
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCw, Activity, Archive, Plus } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { NewConversationModal } from '@/components/NewConversationModal';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { EmptyChat } from '@/components/EmptyChat';
import { MobileHeader } from '@/components/MobileHeader';
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
    refreshMessages,
    deleteConversation,
    archiveConversation,
    createNewConversation,
    showArchived,
    setShowArchived,
    archivedCount
  } = useMessages();

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  // Rediriger vers la connexion si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">Vous devez être connecté pour accéder aux messages</p>
            <Button onClick={() => window.location.href = '/login'}>
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    
    await sendMessage(selectedConversationId, newMessage);
    setNewMessage('');
  };

  const handleRefresh = () => {
    toast.promise(
      refreshMessages(),
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
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
      toast.success('Conversation supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la conversation');
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await archiveConversation(conversationId);
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      
      toast.success('Conversation archivée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast.error('Erreur lors de l\'archivage de la conversation');
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      {/* Header desktop uniquement */}
      <div className="hidden md:block">
        <AirbnbHeader
          title="Messages"
          subtitle="Communication temps réel avec l'équipe"
          icon={MessageCircle}
        >
          <div className="flex items-center gap-2">
            <ModernButton 
              variant="outline" 
              onClick={() => setShowArchived(!showArchived)}
              icon={Archive}
            >
              {showArchived ? 'Conversations actives' : `Archivées (${archivedCount})`}
            </ModernButton>
            <ModernButton 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              icon={RefreshCw}
              iconClassName={isLoading ? 'animate-spin' : ''}
            >
              Actualiser
            </ModernButton>
          </div>
        </AirbnbHeader>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Header mobile avec boutons d'action */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500">Communication temps réel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Statistiques des messages */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-100 pb-3">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Aperçu des messages
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
                {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} non lus
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-lg md:text-2xl font-bold text-blue-600 mb-1">{conversations.length}</p>
                <p className="text-xs md:text-sm text-gray-600">{showArchived ? 'Archivées' : 'Actives'}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-lg md:text-2xl font-bold text-red-600 mb-1">{conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}</p>
                <p className="text-xs md:text-sm text-gray-600">Non lus</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-lg md:text-2xl font-bold text-green-600 mb-1">{messages.length}</p>
                <p className="text-xs md:text-sm text-gray-600">Aujourd'hui</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-lg md:text-2xl font-bold text-purple-600 mb-1">{conversations.filter(c => c.participant?.is_online).length}</p>
                <p className="text-xs md:text-sm text-gray-600">En ligne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interface de messagerie */}
        <Card className="bg-white border border-gray-100 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row h-[600px] md:h-[700px]">
              {/* Sidebar avec conversations - masquée sur mobile quand conversation sélectionnée */}
              <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} md:w-1/3 md:min-w-[320px] w-full border-r border-gray-200 flex-col`}>
                {/* Header avec boutons d'action */}
                <div className="p-3 md:p-4 border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    {!showArchived && (
                      <Button 
                        onClick={() => setShowNewConversationModal(true)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle conversation
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Liste des conversations */}
                <div className="flex-1 overflow-hidden">
                  <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Zone de chat */}
              <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
                {selectedConversation ? (
                  <ChatWindow
                    conversation={selectedConversation}
                    messages={messages}
                    newMessage={newMessage}
                    onNewMessageChange={setNewMessage}
                    onSendMessage={handleSendMessage}
                    onDeleteConversation={handleDeleteConversation}
                    onArchiveConversation={handleArchiveConversation}
                    onBack={() => setSelectedConversationId(null)}
                  />
                ) : (
                  <EmptyChat />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de nouvelle conversation */}
        <NewConversationModal 
          isOpen={showNewConversationModal}
          onClose={() => setShowNewConversationModal(false)}
          onCreateConversation={createNewConversation}
        />
      </div>
    </div>
  );
}
