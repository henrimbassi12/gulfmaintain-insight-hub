
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Bell, Zap } from "lucide-react";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAlertModal({ isOpen, onClose }: CreateAlertModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: '',
    priority: '',
    equipmentId: '',
    location: '',
    title: '',
    description: '',
    autoAssign: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID d'alerte
    const alertId = `ALT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    toast({
      title: "✅ Alerte créée",
      description: `Alerte ${alertId} créée et envoyée aux équipes`,
    });
    
    // Simulation de l'envoi des notifications
    setTimeout(() => {
      toast({
        title: "Notifications envoyées",
        description: "Les techniciens concernés ont été notifiés",
      });
    }, 1000);
    
    // Reset form
    setFormData({
      type: '',
      priority: '',
      equipmentId: '',
      location: '',
      title: '',
      description: '',
      autoAssign: false
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Créer une nouvelle alerte
          </DialogTitle>
          <DialogDescription>
            Créez une alerte pour signaler un incident ou un problème urgent
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'alerte</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Problème technique</SelectItem>
                  <SelectItem value="safety">Sécurité</SelectItem>
                  <SelectItem value="maintenance">Maintenance urgente</SelectItem>
                  <SelectItem value="environmental">Environnemental</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Niveau de priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau de priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">🔴 Critique</SelectItem>
                  <SelectItem value="high">🟠 Élevée</SelectItem>
                  <SelectItem value="medium">🟡 Moyenne</SelectItem>
                  <SelectItem value="low">🟢 Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentId">ID Équipement (optionnel)</Label>
              <Input
                id="equipmentId"
                placeholder="FR-2024-xxx"
                value={formData.equipmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, equipmentId: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Localisation précise du problème"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'alerte</Label>
            <Input
              id="title"
              placeholder="Résumé bref du problème"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail, les symptômes observés, les mesures déjà prises..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          {/* Informations sur l'impact */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Impact de l'alerte</span>
            </div>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• Les techniciens seront automatiquement notifiés</p>
              <p>• Une intervention sera programmée selon la priorité</p>
              <p>• Le superviseur sera alerté pour les priorités critiques</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              <Bell className="w-4 h-4 mr-2" />
              Créer l'alerte
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
