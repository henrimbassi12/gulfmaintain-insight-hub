
import React from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConversationWithParticipant } from '@/hooks/useMessages';

interface ConversationListProps {
  conversations: ConversationWithParticipant[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchTerm,
  onSearchChange,
  isLoading
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.participant?.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 jours
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header avec recherche */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">
              {conversations.length === 0 ? 
                "Aucune conversation. Créez-en une nouvelle !" : 
                "Aucune conversation trouvée"
              }
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const participantName = conversation.participant?.user_name || conversation.name;
            const isSelected = selectedConversationId === conversation.id;
            
            return (
              <div
                key={conversation.id}
                className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                {/* Avatar */}
                <div className="relative mr-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.participant?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                      {getInitials(participantName)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participant?.is_online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Contenu de la conversation */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium truncate ${
                      isSelected ? 'text-blue-700' : 'text-gray-900'
                    } ${conversation.unreadCount > 0 ? 'font-semibold' : ''}`}>
                      {participantName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {conversation.lastMessage?.created_at && (
                        <span className={`text-xs ${
                          conversation.unreadCount > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'
                        }`}>
                          {formatTime(conversation.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'
                    }`}>
                      {conversation.lastMessage?.is_me && (
                        <span className="text-blue-500 mr-1">✓</span>
                      )}
                      {conversation.lastMessage?.content || 'Aucun message'}
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full ml-2">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>

                  {/* Rôle du participant */}
                  {conversation.participant?.user_role && (
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">
                      {conversation.participant.user_role}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
