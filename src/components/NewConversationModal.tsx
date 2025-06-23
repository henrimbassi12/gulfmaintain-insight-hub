
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { toast } from 'sonner';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (memberName: string) => Promise<void>;
}

export function NewConversationModal({ isOpen, onClose, onCreateConversation }: NewConversationModalProps) {
  const [participantName, setParticipantName] = useState('');
  const [participantRole, setParticipantRole] = useState('technician');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateConversation = async () => {
    if (!participantName.trim()) {
      toast.error('Veuillez entrer le nom du participant');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateConversation(participantName);
      toast.success('Conversation créée avec succès');
      onClose();
      setParticipantName('');
      setParticipantRole('technician');
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      toast.error('Erreur lors de la création de la conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedNames = [
    'CÉDRIC', 'MBAPBOU GRÉGOIRE', 'VOUKENG', 'TCHINDA CONSTANT', 
    'NDJOKO IV', 'NDOUMBE ETIA'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Nouvelle conversation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="participant-name">Nom du participant</Label>
            <Input
              id="participant-name"
              placeholder="Entrez le nom de la personne..."
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Suggestions :</p>
              <div className="flex flex-wrap gap-1">
                {suggestedNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setParticipantName(name)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="participant-role">Rôle</Label>
            <Select value={participantRole} onValueChange={setParticipantRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technician">Technicien</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateConversation}
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
