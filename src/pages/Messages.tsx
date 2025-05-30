
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send,
  Search,
  Paperclip,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Ahmed Benali',
      role: 'Technicien Senior',
      lastMessage: 'La maintenance est terminée, tout fonctionne parfaitement.',
      time: '10:30',
      unread: 0,
      online: true,
      avatar: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Fatima Zahra',
      role: 'Technicienne',
      lastMessage: 'J\'aurai besoin de la pièce de rechange pour demain.',
      time: '09:45',
      unread: 2,
      online: true,
      avatar: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Mohamed Alami',
      role: 'Technicien',
      lastMessage: 'L\'inspection est prévue pour 14h.',
      time: 'Hier',
      unread: 0,
      online: false,
      avatar: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Youssef Idrissi',
      role: 'Technicien Senior',
      lastMessage: 'Le compresseur est défaillant, remplacement nécessaire.',
      time: 'Hier',
      unread: 1,
      online: false,
      avatar: '/placeholder.svg'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Ahmed Benali',
      message: 'Bonjour, je commence l\'intervention sur le frigo FR-2024-089.',
      time: '09:00',
      isMe: false
    },
    {
      id: 2,
      sender: 'Vous',
      message: 'Parfait, tenez-moi au courant de l\'avancement.',
      time: '09:05',
      isMe: true
    },
    {
      id: 3,
      sender: 'Ahmed Benali',
      message: 'J\'ai détecté un problème au niveau du thermostat. Je procède au remplacement.',
      time: '09:30',
      isMe: false
    },
    {
      id: 4,
      sender: 'Vous',
      message: 'D\'accord, avez-vous la pièce en stock ?',
      time: '09:32',
      isMe: true
    },
    {
      id: 5,
      sender: 'Ahmed Benali',
      message: 'Oui, j\'ai tout ce qu\'il faut. L\'intervention devrait prendre encore 1h.',
      time: '09:35',
      isMe: false
    },
    {
      id: 6,
      sender: 'Ahmed Benali',
      message: 'La maintenance est terminée, tout fonctionne parfaitement.',
      time: '10:30',
      isMe: false
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

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
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Rechercher..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">
                            {conversation.name}
                          </h4>
                          <p className="text-xs text-gray-500">{conversation.role}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConv.avatar} />
                        <AvatarFallback>
                          {selectedConv.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConv.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedConv.online ? 'En ligne' : 'Hors ligne'} • {selectedConv.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.isMe 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border'
                      } p-3 rounded-lg shadow-sm`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.isMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
    </div>
  );
}
