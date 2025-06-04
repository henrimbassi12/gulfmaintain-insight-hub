
import React, { useState, useEffect } from 'react';
import { Star, Heart, Bookmark, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface FavoriteItem {
  id: string;
  type: 'equipment' | 'location' | 'technician';
  name: string;
  details: string;
  priority: 'high' | 'medium' | 'low';
  addedAt: Date;
  tags: string[];
}

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'equipment' | 'location' | 'technician';
  itemName: string;
  itemDetails: string;
  priority?: 'high' | 'medium' | 'low';
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function FavoriteButton({ 
  itemId, 
  itemType, 
  itemName, 
  itemDetails, 
  priority = 'medium',
  size = 'default',
  variant = 'ghost'
}: FavoriteButtonProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les favoris depuis le localStorage
    const savedFavorites = localStorage.getItem('gulfmaintain_favorites');
    if (savedFavorites) {
      const parsed = JSON.parse(savedFavorites);
      setFavorites(parsed);
      setIsFavorite(parsed.some((fav: FavoriteItem) => fav.id === itemId));
    }
  }, [itemId]);

  const toggleFavorite = () => {
    let updatedFavorites: FavoriteItem[];
    
    if (isFavorite) {
      // Retirer des favoris
      updatedFavorites = favorites.filter(fav => fav.id !== itemId);
      setIsFavorite(false);
      toast({
        title: "Retiré des favoris",
        description: `${itemName} a été retiré de vos favoris`
      });
    } else {
      // Ajouter aux favoris
      const newFavorite: FavoriteItem = {
        id: itemId,
        type: itemType,
        name: itemName,
        details: itemDetails,
        priority,
        addedAt: new Date(),
        tags: []
      };
      updatedFavorites = [newFavorite, ...favorites];
      setIsFavorite(true);
      toast({
        title: "Ajouté aux favoris",
        description: `${itemName} a été ajouté à vos favoris`
      });
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('gulfmaintain_favorites', JSON.stringify(updatedFavorites));
  };

  const getIcon = () => {
    if (itemType === 'equipment' && priority === 'high') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={toggleFavorite}
            className={`${isFavorite ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {getIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'equipment' | 'location' | 'technician'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const savedFavorites = localStorage.getItem('gulfmaintain_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('gulfmaintain_favorites', JSON.stringify(updatedFavorites));
    toast({
      title: "Favori supprimé",
      description: "L'élément a été retiré de vos favoris"
    });
  };

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(fav => fav.type === filter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return '🔧';
      case 'location': return '📍';
      case 'technician': return '👤';
      default: return '⭐';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Favoris
          <Badge variant="outline">{favorites.length}</Badge>
        </CardTitle>
        <CardDescription>Vos équipements et éléments marqués comme favoris</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          {['all', 'equipment', 'location', 'technician'].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType as any)}
            >
              {filterType === 'all' ? 'Tous' : 
               filterType === 'equipment' ? 'Équipements' :
               filterType === 'location' ? 'Localisations' : 'Techniciens'}
            </Button>
          ))}
        </div>

        {/* Liste des favoris */}
        <div className="space-y-3">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucun favori {filter !== 'all' ? 'dans cette catégorie' : ''}</p>
            </div>
          ) : (
            filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getTypeIcon(favorite.type)}</span>
                  <div>
                    <h4 className="font-medium">{favorite.name}</h4>
                    <p className="text-sm text-muted-foreground">{favorite.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getPriorityColor(favorite.priority)}>
                        {favorite.priority === 'high' ? 'Critique' :
                         favorite.priority === 'medium' ? 'Important' : 'Normal'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Ajouté le {favorite.addedAt.toLocaleDateString ? new Date(favorite.addedAt).toLocaleDateString() : 'Récemment'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(favorite.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
