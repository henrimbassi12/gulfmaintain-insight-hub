
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MoreVertical, Phone, Video, Archive, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConversationWithParticipant, Message } from '@/hooks/useMessages';
import { CallInterface } from './CallInterface';
import { useCallState } from '@/hooks/useCallState';
import { toast } from 'sonner';

interface ChatWindowProps {
  conversation: ConversationWithParticipant;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onDeleteConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
}

export function ChatWindow({
  conversation,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onDeleteConversation,
  onArchiveConversation
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { callState, startCall, endCall } = useCallState();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAudioCall = () => {
    const participantName = conversation.participant?.user_name || conversation.name;
    startCall(participantName, 'audio');
  };

  const handleVideoCall = () => {
    const participantName = conversation.participant?.user_name || conversation.name;
    startCall(participantName, 'video');
  };

  const handleDeleteConversation = () => {
    if (onDeleteConversation) {
      onDeleteConversation(conversation.id);
      toast.success('Conversation supprimée');
    }
    setShowDeleteDialog(false);
  };

  const handleArchiveConversation = () => {
    if (onArchiveConversation) {
      onArchiveConversation(conversation.id);
      toast.success('Conversation archivée');
    }
    setShowArchiveDialog(false);
  };

  const participantName = conversation.participant?.user_name || conversation.name;

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Header de la conversation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={conversation.participant?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                  {getInitials(participantName)}
                </AvatarFallback>
              </Avatar>
              {conversation.participant?.is_online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{participantName}</h3>
              <p className="text-sm text-gray-500">
                {conversation.participant?.is_online ? (
                  <span className="text-green-600">En ligne</span>
                ) : (
                  conversation.participant?.user_role || 'Utilisateur'
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={handleAudioCall}
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={handleVideoCall}
            >
              <Video className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem 
                  onClick={() => setShowArchiveDialog(true)}
                  className="cursor-pointer"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver la conversation
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer la conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-25">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">Commencez une conversation</p>
              <p className="text-sm text-center max-w-md">
                Envoyez un message à {participantName} pour démarrer votre conversation.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isMe = message.is_me;
                const showAvatar = !isMe && (index === 0 || messages[index - 1]?.is_me);
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-8">
                        {showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={conversation.participant?.avatar_url || ''} />
                            <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                              {getInitials(message.sender_name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-xs lg:max-w-md ${isMe ? 'order-1' : 'order-2'}`}>
                      {!isMe && showAvatar && (
                        <p className="text-xs text-gray-500 mb-1 ml-3">{message.sender_name}</p>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          isMe
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isMe ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={conversation.participant?.avatar_url || ''} />
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                      {getInitials(participantName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Zone de saisie */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => onNewMessageChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ minHeight: '44px' }}
              />
            </div>
            <Button 
              onClick={onSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-11 h-11 p-0 flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Interface d'appel */}
      <CallInterface
        isVisible={callState.isVisible}
        onClose={endCall}
        contactName={callState.contactName}
        callType={callState.callType}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette conversation avec {participantName} ? 
              Cette action est irréversible et tous les messages seront perdus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConversation}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation d'archivage */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver la conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous archiver cette conversation avec {participantName} ? 
              Vous pourrez la retrouver dans vos conversations archivées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConversation}>
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
