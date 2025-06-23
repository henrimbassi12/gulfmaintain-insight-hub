
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

// Noms des membres de l'équipe - UNIQUEMENT ceux-ci sont autorisés
const AUTHORIZED_TEAM_MEMBERS = [
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
  const [archivedConversations, setArchivedConversations] = useState<ConversationWithParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Fonction pour générer des conversations stables
  const generateStableConversations = (): ConversationWithParticipant[] => {
    const userEmail = user?.email || 'unknown';
    const storageKey = `conversations_${userEmail}`;
    const archivedKey = `archived_conversations_${userEmail}`;
    
    // Récupérer les conversations archivées
    const archivedIds = JSON.parse(localStorage.getItem(archivedKey) || '[]');
    
    // Vérifier si on a déjà des conversations en cache
    const cachedConversations = localStorage.getItem(storageKey);
    if (cachedConversations) {
      try {
        const parsed = JSON.parse(cachedConversations);
        console.log('📱 Conversations récupérées du cache');
        return parsed.filter((conv: ConversationWithParticipant) => !archivedIds.includes(conv.id));
      } catch (error) {
        console.error('Erreur parsing cache conversations:', error);
      }
    }

    // Générer des conversations stables
    const stableConversations = AUTHORIZED_TEAM_MEMBERS.map((member, index) => {
      const conversationId = `conv-${member.name.toLowerCase().replace(/\s+/g, '-')}`;
      const lastMessageTime = new Date(Date.now() - (index + 1) * 86400000 * 2).toISOString();
      
      return {
        id: conversationId,
        name: `Conversation avec ${member.name}`,
        created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        updated_at: lastMessageTime,
        participant: {
          id: `participant-${member.name.toLowerCase().replace(/\s+/g, '-')}`,
          conversation_id: conversationId,
          user_name: member.name,
          user_role: member.role,
          avatar_url: null,
          is_online: Math.random() > 0.4,
          created_at: new Date().toISOString()
        },
        lastMessage: {
          id: `msg-last-${conversationId}`,
          conversation_id: conversationId,
          sender_name: member.name,
          content: SAMPLE_MESSAGES[index % SAMPLE_MESSAGES.length],
          is_me: false,
          created_at: lastMessageTime
        },
        unreadCount: Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0
      };
    });

    // Sauvegarder en cache
    localStorage.setItem(storageKey, JSON.stringify(stableConversations));
    console.log('💾 Conversations sauvegardées en cache');
    
    return stableConversations.filter(conv => !archivedIds.includes(conv.id));
  };

  const generateSampleMessages = (conversationId: string): Message[] => {
    const conversation = [...conversations, ...archivedConversations].find(c => c.id === conversationId);
    if (!conversation) return [];

    const messageCount = Math.floor(Math.random() * 8) + 3; // 3-10 messages
    const messages: Message[] = [];
    const participantName = conversation.participant?.user_name || 'Utilisateur';
    
    for (let i = 0; i < messageCount; i++) {
      const isMe = Math.random() > 0.6; // 40% de chance que ce soit moi
      const messageTime = new Date(Date.now() - (messageCount - i) * 2400000); // Messages espacés de 40min
      
      messages.push({
        id: `msg-${conversationId}-${i + 1}`,
        conversation_id: conversationId,
        sender_name: isMe ? (userProfile?.full_name || user?.email || 'Moi') : participantName,
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
      console.log('🔄 Récupération des conversations...');
      
      // Utiliser des conversations stables
      const stableConversations = generateStableConversations();
      
      // Trier par date de dernier message (plus récent en premier)
      const sortedConversations = stableConversations.sort((a, b) => {
        const timeA = new Date(a.lastMessage?.created_at || a.updated_at).getTime();
        const timeB = new Date(b.lastMessage?.created_at || b.updated_at).getTime();
        return timeB - timeA;
      });
      
      setConversations(sortedConversations);
      
      // Charger les conversations archivées
      const userEmail = user.email || 'unknown';
      const archivedKey = `archived_conversations_${userEmail}`;
      const archivedIds = JSON.parse(localStorage.getItem(archivedKey) || '[]');
      
      if (archivedIds.length > 0) {
        const allConversations = AUTHORIZED_TEAM_MEMBERS.map((member, index) => {
          const conversationId = `conv-${member.name.toLowerCase().replace(/\s+/g, '-')}`;
          const lastMessageTime = new Date(Date.now() - (index + 1) * 86400000 * 2).toISOString();
          
          return {
            id: conversationId,
            name: `Conversation avec ${member.name}`,
            created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
            updated_at: lastMessageTime,
            participant: {
              id: `participant-${member.name.toLowerCase().replace(/\s+/g, '-')}`,
              conversation_id: conversationId,
              user_name: member.name,
              user_role: member.role,
              avatar_url: null,
              is_online: Math.random() > 0.4,
              created_at: new Date().toISOString()
            },
            lastMessage: {
              id: `msg-last-${conversationId}`,
              conversation_id: conversationId,
              sender_name: member.name,
              content: SAMPLE_MESSAGES[index % SAMPLE_MESSAGES.length],
              is_me: false,
              created_at: lastMessageTime
            },
            unreadCount: 0,
            is_archived: true
          };
        });
        
        const archived = allConversations.filter(conv => archivedIds.includes(conv.id));
        setArchivedConversations(archived);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      console.log('📨 Récupération des messages pour:', conversationId);
      const sampleMessages = generateSampleMessages(conversationId);
      setMessages(sampleMessages);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des messages:', error);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !userProfile) {
      toast.error('Vous devez être connecté pour envoyer un message');
      return;
    }

    try {
      console.log('📤 Envoi du message:', content);
      
      const senderName = userProfile.full_name || user.email || 'Utilisateur';
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        sender_name: senderName,
        content,
        is_me: true,
        created_at: new Date().toISOString()
      };

      // Ajouter le message localement
      setMessages(prev => [...prev, newMessage]);
      
      // Mettre à jour la conversation pour la remonter en haut
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: newMessage,
              updated_at: new Date().toISOString()
            };
          }
          return conv;
        });
        
        // Trier à nouveau par date de dernier message
        return updated.sort((a, b) => {
          const timeA = new Date(a.lastMessage?.created_at || a.updated_at).getTime();
          const timeB = new Date(b.lastMessage?.created_at || b.updated_at).getTime();
          return timeB - timeA;
        });
      });
      
      toast.success('Message envoyé');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const createNewConversation = async (memberName: string) => {
    try {
      const member = AUTHORIZED_TEAM_MEMBERS.find(m => m.name === memberName);
      if (!member) {
        toast.error('Membre de l\'équipe non trouvé');
        return;
      }

      const conversationId = `conv-${member.name.toLowerCase().replace(/\s+/g, '-')}-new-${Date.now()}`;
      
      const newConversation: ConversationWithParticipant = {
        id: conversationId,
        name: `Conversation avec ${member.name}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participant: {
          id: `participant-${member.name.toLowerCase().replace(/\s+/g, '-')}`,
          conversation_id: conversationId,
          user_name: member.name,
          user_role: member.role,
          avatar_url: null,
          is_online: Math.random() > 0.4,
          created_at: new Date().toISOString()
        },
        unreadCount: 0
      };

      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(conversationId);
      
      toast.success(`Nouvelle conversation créée avec ${member.name}`);
    } catch (error) {
      console.error('❌ Erreur lors de la création de la conversation:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      console.log('🗑️ Suppression de la conversation:', conversationId);
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la conversation:', error);
      throw error;
    }
  };

  const archiveConversation = async (conversationId: string) => {
    try {
      console.log('📦 Archivage de la conversation:', conversationId);
      
      const conversationToArchive = conversations.find(conv => conv.id === conversationId);
      if (!conversationToArchive) return;
      
      // Marquer comme archivée
      const archivedConversation = { ...conversationToArchive, is_archived: true };
      
      // Ajouter aux conversations archivées
      setArchivedConversations(prev => [archivedConversation, ...prev]);
      
      // Supprimer des conversations actives
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // Sauvegarder en local
      const userEmail = user?.email || 'unknown';
      const archivedKey = `archived_conversations_${userEmail}`;
      const currentArchived = JSON.parse(localStorage.getItem(archivedKey) || '[]');
      localStorage.setItem(archivedKey, JSON.stringify([...currentArchived, conversationId]));
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'archivage de la conversation:', error);
      throw error;
    }
  };

  const selectConversation = (conversationId: string) => {
    console.log('✅ Sélection de la conversation:', conversationId);
    setSelectedConversationId(conversationId);
  };

  const refreshMessages = async () => {
    console.log('🔄 Actualisation des messages');
    await fetchConversations();
    if (selectedConversationId) {
      await fetchMessages(selectedConversationId);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

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
