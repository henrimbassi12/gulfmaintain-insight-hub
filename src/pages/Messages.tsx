
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCw, Activity } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { NewConversationModal } from '@/components/NewConversationModal';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { EmptyChat } from '@/components/EmptyChat';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Messages() {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    isLoading,
    sendMessage,
    refetch,
    deleteConversation,
    archiveConversation
  } = useMessages();

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Rediriger vers la connexion si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <AirbnbContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">Vous devez être connecté pour accéder aux messages</p>
            <Button onClick={() => window.location.href = '/login'}>
              Se connecter
            </Button>
          </div>
        </div>
      </AirbnbContainer>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    
    await sendMessage(selectedConversationId, newMessage);
    setNewMessage('');
  };

  const handleRefresh = () => {
    toast.promise(
      refetch(),
      {
        loading: 'Actualisation des messages...',
        success: 'Messages actualisés avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      
      // Déselectionner la conversation si elle était sélectionnée
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
      // Actualiser la liste des conversations
      await refetch();
      
      toast.success('Conversation supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la conversation');
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await archiveConversation(conversationId);
      
      // Déselectionner la conversation si elle était sélectionnée
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
      // Actualiser la liste des conversations
      await refetch();
      
      toast.success('Conversation archivée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast.error('Erreur lors de l\'archivage de la conversation');
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Messages"
        subtitle="Communication temps réel avec l'équipe"
        icon={MessageCircle}
      >
        <ModernButton 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
          icon={RefreshCw}
          className={isLoading ? 'animate-spin' : ''}
        >
          Actualiser
        </ModernButton>
      </AirbnbHeader>

      {/* Statistiques des messages */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Aperçu des messages
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} non lus
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">{conversations.length}</p>
              <p className="text-sm text-gray-600">Conversations totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-red-600 mb-1">{conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}</p>
              <p className="text-sm text-gray-600">Non lus</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-green-600 mb-1">{messages.length}</p>
              <p className="text-sm text-gray-600">Messages aujourd'hui</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-purple-600 mb-1">{conversations.filter(c => c.participant?.is_online).length}</p>
              <p className="text-sm text-gray-600">Utilisateurs en ligne</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface de messagerie style WhatsApp */}
      <Card className="bg-white border border-gray-100 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex h-[700px]">
            {/* Sidebar avec conversations */}
            <div className="w-1/3 min-w-[320px] border-r border-gray-200 flex flex-col">
              {/* Header avec bouton nouvelle conversation */}
              <div className="p-4 border-b border-gray-100 bg-white">
                <NewConversationModal onConversationCreated={refetch} />
              </div>
              
              {/* Liste des conversations */}
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isLoading={isLoading}
              />
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  messages={messages}
                  newMessage={newMessage}
                  onNewMessageChange={setNewMessage}
                  onSendMessage={handleSendMessage}
                  onDeleteConversation={handleDeleteConversation}
                  onArchiveConversation={handleArchiveConversation}
                />
              ) : (
                <EmptyChat />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AirbnbContainer>
  );
}
