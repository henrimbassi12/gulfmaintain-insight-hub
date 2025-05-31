
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send,
  Search,
  Paperclip,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useCallState } from '@/hooks/useCallState';
import { CallInterface } from '@/components/CallInterface';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Messages() {
  const {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    isLoading,
    sendMessage
  } = useMessages();
  
  const { callState, startCall, endCall } = useCallState();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.participant?.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversationId) {
      await sendMessage(selectedConversationId, newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAudioCall = () => {
    if (selectedConversation) {
      const contactName = selectedConversation.participant?.user_name || selectedConversation.name;
      startCall(contactName, 'audio');
    }
  };

  const handleVideoCall = () => {
    if (selectedConversation) {
      const contactName = selectedConversation.participant?.user_name || selectedConversation.name;
      startCall(contactName, 'video');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communication avec vos techniciens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Conversations</CardTitle>
              <Badge variant="secondary">{filteredConversations.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.participant?.avatar_url || '/placeholder.svg'} />
                          <AvatarFallback>
                            {conversation.participant?.user_name 
                              ? conversation.participant.user_name.split(' ').map(n => n[0]).join('').substring(0, 2)
                              : conversation.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.participant?.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">
                              {conversation.participant?.user_name || conversation.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {conversation.participant?.user_role || 'Conversation'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage 
                                ? formatTime(conversation.lastMessage.created_at)
                                : formatTime(conversation.updated_at)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage?.content || 'Aucun message'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.participant?.avatar_url || '/placeholder.svg'} />
                        <AvatarFallback>
                          {selectedConversation.participant?.user_name 
                            ? selectedConversation.participant.user_name.split(' ').map(n => n[0]).join('').substring(0, 2)
                            : selectedConversation.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.participant?.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.participant?.user_name || selectedConversation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.participant?.is_online ? 'En ligne' : 'Hors ligne'} • {selectedConversation.participant?.user_role || 'Conversation'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAudioCall}
                      title="Appel audio"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleVideoCall}
                      title="Appel vidéo"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.is_me ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.is_me 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border'
                        } p-3 rounded-lg shadow-sm`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.is_me ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500">
                  Choisissez une conversation pour commencer à chatter
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Call Interface */}
      <CallInterface 
        isVisible={callState.isVisible}
        onClose={endCall}
        contactName={callState.contactName}
        callType={callState.callType}
      />
    </div>
  );
}
