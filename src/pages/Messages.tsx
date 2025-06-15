
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, RefreshCw, Activity, Send, Search, User } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { NewConversationModal } from '@/components/NewConversationModal';
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
    refetch
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

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.participant?.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Messages"
        subtitle="Communication et notifications de l'équipe"
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

      {/* Interface de messagerie */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex h-[600px]">
            {/* Liste des conversations */}
            <div className="w-1/3 border-r border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <NewConversationModal onConversationCreated={refetch} />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher des conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-full">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Chargement...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {conversations.length === 0 ? 
                      "Aucune conversation. Créez-en une nouvelle !" : 
                      "Aucune conversation trouvée"
                    }
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedConversationId(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conversation.participant?.user_name || conversation.name}
                              </h3>
                              {conversation.participant?.is_online && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage?.content || 'Aucun message'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {conversation.lastMessage?.created_at ? 
                              new Date(conversation.lastMessage.created_at).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : ''
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header de la conversation */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversation.participant?.user_name || selectedConversation.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.participant?.user_role || 'Utilisateur'}
                          {selectedConversation.participant?.is_online && (
                            <span className="ml-2 text-green-600">• En ligne</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Aucun message dans cette conversation
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.is_me ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.is_me
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {!message.is_me && (
                              <p className="text-xs font-medium mb-1 opacity-75">
                                {message.sender_name}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.is_me ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Sélectionnez une conversation pour commencer</p>
                    <p className="text-sm mt-2">ou créez une nouvelle conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AirbnbContainer>
  );
}
