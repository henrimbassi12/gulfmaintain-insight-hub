
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernButton } from "@/components/ui/modern-button";
import { Shield, Eye, EyeOff } from 'lucide-react';

interface SecuritySectionProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: (value: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  loadingPassword: boolean;
  handleChangePassword: () => void;
}

export function SecuritySection({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loadingPassword,
  handleChangePassword
}: SecuritySectionProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password">Mot de passe actuel *</Label>
            <div className="relative mt-1">
              <Input 
                id="current-password" 
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loadingPassword}
                placeholder="Entrez votre mot de passe actuel"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="new-password">Nouveau mot de passe *</Label>
            <div className="relative mt-1">
              <Input 
                id="new-password" 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loadingPassword}
                placeholder="Entrez votre nouveau mot de passe (min. 6 caractères)"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirmer le mot de passe *</Label>
            <div className="relative mt-1">
              <Input 
                id="confirm-password" 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loadingPassword}
                placeholder="Confirmez votre nouveau mot de passe"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="pt-2">
            <ModernButton 
              onClick={handleChangePassword} 
              disabled={loadingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full md:w-auto"
            >
              {loadingPassword ? 'Changement en cours...' : 'Changer le mot de passe'}
            </ModernButton>
          </div>
          {newPassword && newPassword.length < 6 && (
            <p className="text-sm text-orange-600">Le mot de passe doit contenir au moins 6 caractères</p>
          )}
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
