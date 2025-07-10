import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

export interface Conversation {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_name: string;
  user_role: string;
  avatar_url: string | null;
  is_online: boolean | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_name: string;
  content: string;
  is_me: boolean | null;
  created_at: string;
}

export interface ConversationWithParticipant extends Conversation {
  participant?: ConversationParticipant;
  lastMessage?: Message;
  unreadCount: number;
  is_archived?: boolean;
}

// Noms des membres de l'équipe autorisés
const AUTHORIZED_TEAM_MEMBERS = [
  { name: 'CÉDRIC', role: 'technician' },
  { name: 'MBAPBOU GRÉGOIRE', role: 'manager' },
  { name: 'VOUKENG', role: 'technician' },
  { name: 'TCHINDA CONSTANT', role: 'admin' },
  { name: 'NDJOKO IV', role: 'technician' },
  { name: 'NDOUMBE ETIA', role: 'manager' }
];

export function useMessages() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<ConversationWithParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Fonction pour récupérer les conversations depuis Supabase
  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Récupération des conversations...');

      // Récupérer les conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (conversationsError) {
        throw conversationsError;
      }

      // Récupérer les participants pour chaque conversation
      const conversationsWithParticipants: ConversationWithParticipant[] = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Récupérer le participant
          const { data: participantData } = await supabase
            .from('conversation_participants')
            .select('*')
            .eq('conversation_id', conv.id)
            .single();

          // Récupérer le dernier message
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Compter les messages non lus (approximation - on peut améliorer avec un système de read_at)
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_me', false)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

          return {
            ...conv,
            participant: participantData || undefined,
            lastMessage: lastMessageData || undefined,
            unreadCount: unreadCount || 0,
            is_archived: false
          };
        })
      );

      setConversations(conversationsWithParticipants);
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des conversations:', error);
      
      // En cas d'erreur, initialiser avec les membres de l'équipe par défaut
      await initializeDefaultConversations();
    } finally {
      setIsLoading(false);
    }
  };

  // Initialiser les conversations par défaut avec les membres de l'équipe
  const initializeDefaultConversations = async () => {
    try {
      console.log('🔧 Initialisation des conversations par défaut...');
      
      for (const member of AUTHORIZED_TEAM_MEMBERS) {
        // Vérifier si la conversation existe déjà
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .eq('name', `Conversation avec ${member.name}`)
          .single();

        if (existingConv) continue;

        // Créer la conversation
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            name: `Conversation avec ${member.name}`
          })
          .select()
          .single();

        if (convError) {
          console.error('Erreur création conversation:', convError);
          continue;
        }

        // Créer le participant
        const { error: participantError } = await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: newConv.id,
            user_name: member.name,
            user_role: member.role,
            is_online: Math.random() > 0.5
          });

        if (participantError) {
          console.error('Erreur création participant:', participantError);
        }
      }

      // Recharger les conversations après initialisation
      await fetchConversations();
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      toast.error('Erreur lors de l\'initialisation des conversations');
    }
  };

  // Récupérer les messages d'une conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      console.log('📨 Récupération des messages pour:', conversationId);
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setMessages(messagesData || []);
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  // Envoyer un message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !userProfile) {
      toast.error('Vous devez être connecté pour envoyer un message');
      return;
    }

    try {
      console.log('📤 Envoi du message:', content);
      
      const senderName = userProfile.full_name || user.email || 'Utilisateur';
      
      // Insérer le message dans Supabase
      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_name: senderName,
          content,
          is_me: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ajouter le message localement
      setMessages(prev => [...prev, newMessage]);
      
      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      // Rafraîchir les conversations pour mettre à jour l'ordre
      await fetchConversations();
      
      toast.success('Message envoyé');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  // Créer une nouvelle conversation
  const createNewConversation = async (memberName: string) => {
    try {
      const member = AUTHORIZED_TEAM_MEMBERS.find(m => m.name === memberName);
      if (!member) {
        toast.error('Membre de l\'équipe non trouvé');
        return;
      }

      // Vérifier si la conversation existe déjà
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('name', `Conversation avec ${member.name}`)
        .single();

      if (existingConv) {
        toast.info('Une conversation avec ce membre existe déjà');
        setSelectedConversationId(existingConv.id);
        return;
      }

      // Créer la nouvelle conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          name: `Conversation avec ${member.name}`
        })
        .select()
        .single();

      if (convError) {
        throw convError;
      }

      // Créer le participant
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: newConv.id,
          user_name: member.name,
          user_role: member.role,
          is_online: Math.random() > 0.5
        });

      if (participantError) {
        throw participantError;
      }

      // Rafraîchir les conversations
      await fetchConversations();
      setSelectedConversationId(newConv.id);
      
      toast.success(`Nouvelle conversation créée avec ${member.name}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de la conversation:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  // Supprimer une conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      console.log('🗑️ Suppression de la conversation:', conversationId);
      
      // Supprimer les messages associés
      await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      // Supprimer les participants
      await supabase
        .from('conversation_participants')
        .delete()
        .eq('conversation_id', conversationId);

      // Supprimer la conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        throw error;
      }
      
      // Mettre à jour l'état local
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la conversation:', error);
      throw error;
    }
  };

  // Archiver une conversation (pour l'instant, on la supprime juste)
  const archiveConversation = async (conversationId: string) => {
    try {
      console.log('📦 Archivage de la conversation:', conversationId);
      
      const conversationToArchive = conversations.find(conv => conv.id === conversationId);
      if (!conversationToArchive) return;
      
      // Pour l'instant, on déplace juste localement
      const archivedConversation = { ...conversationToArchive, is_archived: true };
      
      setArchivedConversations(prev => [archivedConversation, ...prev]);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'archivage de la conversation:', error);
      throw error;
    }
  };

  // Sélectionner une conversation
  const selectConversation = (conversationId: string) => {
    console.log('✅ Sélection de la conversation:', conversationId);
    setSelectedConversationId(conversationId);
  };

  // Actualiser les messages
  const refreshMessages = async () => {
    console.log('🔄 Actualisation des messages');
    await fetchConversations();
    if (selectedConversationId) {
      await fetchMessages(selectedConversationId);
    }
  };

  // Configuration des abonnements temps réel
  useEffect(() => {
    if (!user) return;

    console.log('🔄 Configuration des abonnements temps réel...');

    // Écouter les nouveaux messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('📨 Nouveau message reçu:', payload.new);
          
          // Si c'est pour la conversation sélectionnée et que ce n'est pas moi
          if (payload.new.conversation_id === selectedConversationId && !payload.new.is_me) {
            setMessages(prev => [...prev, payload.new as Message]);
          }
          
          // Actualiser les conversations pour mettre à jour le dernier message
          fetchConversations();
        }
      )
      .subscribe();

    // Écouter les changements de conversations
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          console.log('🔄 Changement dans les conversations détecté');
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Nettoyage des abonnements temps réel');
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, selectedConversationId]);

  // Charger les conversations au montage
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversationId) {
      console.log('📨 Conversation sélectionnée changée:', selectedConversationId);
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  const displayedConversations = showArchived ? archivedConversations : conversations;

  return {
    conversations: displayedConversations,
    messages,
    selectedConversationId,
    setSelectedConversationId: selectConversation,
    isLoading,
    sendMessage,
    deleteConversation,
    archiveConversation,
    createNewConversation,
    refreshMessages,
    refetch: fetchConversations,
    showArchived,
    setShowArchived,
    archivedCount: archivedConversations.length,
  };
}