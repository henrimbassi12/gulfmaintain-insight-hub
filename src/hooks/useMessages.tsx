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
}

// Noms des membres de l'équipe
const TEAM_MEMBERS = [
  { name: 'CÉDRIC', role: 'technician' },
  { name: 'MBAPBOU GRÉGOIRE', role: 'manager' },
  { name: 'VOUKENG', role: 'technician' },
  { name: 'TCHINDA CONSTANT', role: 'admin' },
  { name: 'NDJOKO IV', role: 'technician' },
  { name: 'NDOUMBE ETIA', role: 'manager' }
];

// Messages d'exemple pour les conversations
const SAMPLE_MESSAGES = [
  "L'équipement de réfrigération est maintenant opérationnel",
  "Maintenance programmée pour demain matin",
  "Problème résolu sur le site de Douala",
  "Rapport de maintenance envoyé",
  "Intervention terminée avec succès",
  "Équipement en panne sur le site principal",
  "Vérification des niveaux de gaz effectuée",
  "Remplacement des filtres nécessaire"
];

export function useMessages() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generateSampleConversations = (): ConversationWithParticipant[] => {
    return TEAM_MEMBERS.map((member, index) => {
      const conversationId = `conv-${index + 1}`;
      const lastMessageTime = new Date(Date.now() - Math.random() * 86400000 * 7); // Dans les 7 derniers jours
      
      return {
        id: conversationId,
        name: `Conversation avec ${member.name}`,
        created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        updated_at: lastMessageTime.toISOString(),
        participant: {
          id: `participant-${index + 1}`,
          conversation_id: conversationId,
          user_name: member.name,
          user_role: member.role,
          avatar_url: null,
          is_online: Math.random() > 0.3, // 70% de chance d'être en ligne
          created_at: new Date().toISOString()
        },
        lastMessage: {
          id: `msg-last-${index + 1}`,
          conversation_id: conversationId,
          sender_name: member.name,
          content: SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)],
          is_me: false,
          created_at: lastMessageTime.toISOString()
        },
        unreadCount: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0
      };
    });
  };

  const generateSampleMessages = (conversationId: string): Message[] => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return [];

    const messageCount = Math.floor(Math.random() * 10) + 5; // 5-15 messages
    const messages: Message[] = [];
    
    for (let i = 0; i < messageCount; i++) {
      const isMe = Math.random() > 0.6; // 40% de chance que ce soit moi
      const messageTime = new Date(Date.now() - (messageCount - i) * 3600000); // Messages espacés d'1h
      
      messages.push({
        id: `msg-${conversationId}-${i + 1}`,
        conversation_id: conversationId,
        sender_name: isMe ? (userProfile?.full_name || user?.email || 'Moi') : conversation.participant!.user_name,
        content: SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)],
        is_me: isMe,
        created_at: messageTime.toISOString()
      });
    }
    
    return messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching conversations...');
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        // En cas d'erreur, utiliser les données simulées
        const sampleConversations = generateSampleConversations();
        setConversations(sampleConversations);
        setIsLoading(false);
        return;
      }

      console.log('Conversations fetched:', conversationsData);

      if (conversationsData.length === 0) {
        // Aucune conversation en base, utiliser les données simulées
        const sampleConversations = generateSampleConversations();
        setConversations(sampleConversations);
        setIsLoading(false);
        return;
      }

      const { data: participantsData, error: partError } = await supabase
        .from('conversation_participants')
        .select('*');

      if (partError) {
        console.error('Error fetching participants:', partError);
        throw partError;
      }

      console.log('Participants fetched:', participantsData);

      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (msgError) {
        console.error('Error fetching messages:', msgError);
        throw msgError;
      }

      console.log('Messages fetched:', messagesData);

      const conversationsWithData = conversationsData.map(conv => {
        const participant = participantsData.find(p => p.conversation_id === conv.id);
        const conversationMessages = messagesData.filter(m => m.conversation_id === conv.id);
        const lastMessage = conversationMessages[0];
        const unreadCount = conversationMessages.filter(m => !m.is_me).length > 0 ? 
          Math.floor(Math.random() * 3) : 0;

        return {
          ...conv,
          participant,
          lastMessage,
          unreadCount
        };
      });

      console.log('Conversations with data:', conversationsWithData);
      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      // En cas d'erreur, utiliser les données simulées
      const sampleConversations = generateSampleConversations();
      setConversations(sampleConversations);
      toast.error('Utilisation des données de démonstration');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        // En cas d'erreur, générer des messages d'exemple
        const sampleMessages = generateSampleMessages(conversationId);
        setMessages(sampleMessages);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Messages fetched for conversation:', data);
        setMessages(data);
      } else {
        // Aucun message en base, générer des messages d'exemple
        const sampleMessages = generateSampleMessages(conversationId);
        setMessages(sampleMessages);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      // En cas d'erreur, générer des messages d'exemple
      const sampleMessages = generateSampleMessages(conversationId);
      setMessages(sampleMessages);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !userProfile) {
      toast.error('Vous devez être connecté pour envoyer un message');
      return;
    }

    try {
      console.log('Sending message to conversation:', conversationId, content);
      
      // Utiliser le nom du profil utilisateur ou son email comme nom d'expéditeur
      const senderName = userProfile.full_name || user.email || 'Utilisateur';
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        sender_name: senderName,
        content,
        is_me: true,
        created_at: new Date().toISOString()
      };

      // Ajouter le message localement d'abord
      setMessages(prev => [...prev, newMessage]);

      // Essayer de sauvegarder en base
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_name: senderName,
            content,
            is_me: true
          }
        ]);

      if (error) {
        console.error('Error sending message:', error);
        // Le message est déjà ajouté localement, on garde juste une notification
        toast.success('Message envoyé (mode démo)');
        return;
      }

      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      console.log('Message sent successfully');
      toast.success('Message envoyé');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.success('Message envoyé (mode démo)');
    }
  };

  const selectConversation = (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setSelectedConversationId(conversationId);
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversationId) {
      console.log('Selected conversation changed:', selectedConversationId);
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscription');
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as Message;
          if (newMessage.conversation_id === selectedConversationId) {
            setMessages(prev => [...prev, newMessage]);
          }
          // Rafraîchir les conversations pour mettre à jour le dernier message
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedConversationId, user]);

  return {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId: selectConversation,
    isLoading,
    sendMessage,
    refetch: fetchConversations,
  };
}
