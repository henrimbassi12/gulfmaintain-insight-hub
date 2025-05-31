
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
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

export function useMessages() {
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      const { data: participantsData, error: partError } = await supabase
        .from('conversation_participants')
        .select('*');

      if (partError) throw partError;

      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;

      const conversationsWithData = conversationsData.map(conv => {
        const participant = participantsData.find(p => p.conversation_id === conv.id);
        const conversationMessages = messagesData.filter(m => m.conversation_id === conv.id);
        const lastMessage = conversationMessages[0];
        const unreadCount = conversationMessages.filter(m => !m.is_me).length > 0 ? 
          Math.floor(Math.random() * 3) : 0; // Simulation du nombre de messages non lus

        return {
          ...conv,
          participant,
          lastMessage,
          unreadCount
        };
      });

      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      toast.error('Erreur lors de la récupération des conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      toast.error('Erreur lors de la récupération des messages');
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_name: 'Vous',
            content,
            is_me: true
          }
        ]);

      if (error) throw error;

      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      toast.success('Message envoyé');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
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
      supabase.removeChannel(channel);
    };
  }, [selectedConversationId]);

  return {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    isLoading,
    sendMessage,
    refetch: fetchConversations,
  };
}
