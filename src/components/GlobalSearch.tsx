
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Bookmark, 
  History, 
  X,
  MapPin,
  Wrench,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';

interface SearchFilter {
  type: 'location' | 'equipment' | 'technician' | 'date';
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter[];
  createdAt: Date;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const addFilter = (filter: SearchFilter) => {
    if (!activeFilters.find(f => f.type === filter.type && f.value === filter.value)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const saveCurrentSearch = () => {
    if (!query.trim()) return;
    
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: query,
      query,
      filters: activeFilters,
      createdAt: new Date()
    };
    
    setSavedSearches([savedSearch, ...savedSearches.slice(0, 9)]);
    toast({
      title: "Recherche sauvegardée",
      description: `"${query}" a été ajoutée aux favoris`
    });
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    setActiveFilters(savedSearch.filters);
    setOpen(false);
  };

  const performSearch = () => {
    if (!query.trim()) return;
    
    if (!recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
    
    toast({
      title: "Recherche effectuée",
      description: `Recherche pour "${query}" avec ${activeFilters.length} filtres`
    });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Rechercher...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Rechercher équipements, techniciens, interventions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                performSearch();
              }
            }}
          />
          <Button size="sm" onClick={saveCurrentSearch} disabled={!query.trim()}>
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 p-3 border-b">
            {activeFilters.map((filter, index) => {
              const IconComponent = filter.icon;
              return (
                <Badge key={index} variant="secondary" className="gap-1">
                  <IconComponent className="h-3 w-3" />
                  {filter.label}: {filter.value}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}

        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          <CommandGroup heading="Filtres rapides">
            <CommandItem onSelect={() => addFilter({ type: 'location', label: 'Localisation', value: 'Casablanca', icon: MapPin })}>
              <MapPin className="mr-2 h-4 w-4" />
              Casablanca
            </CommandItem>
            <CommandItem onSelect={() => addFilter({ type: 'equipment', label: 'Type', value: 'Réfrigérateur', icon: Wrench })}>
              <Wrench className="mr-2 h-4 w-4" />
              Réfrigérateur
            </CommandItem>
            <CommandItem onSelect={() => addFilter({ type: 'date', label: 'Période', value: 'Cette semaine', icon: Calendar })}>
              <Calendar className="mr-2 h-4 w-4" />
              Cette semaine
            </CommandItem>
          </CommandGroup>

          {recentSearches.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recherches récentes">
                {recentSearches.map((search, index) => (
                  <CommandItem key={index} onSelect={() => setQuery(search)}>
                    <History className="mr-2 h-4 w-4" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {savedSearches.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recherches sauvegardées">
                {savedSearches.map((savedSearch) => (
                  <CommandItem key={savedSearch.id} onSelect={() => loadSavedSearch(savedSearch)}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{savedSearch.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {savedSearch.filters.length} filtres
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>

        <div className="flex items-center justify-between p-3 border-t">
          <div className="flex gap-2">
            <Button size="sm" onClick={performSearch} disabled={!query.trim()}>
              Rechercher
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              setQuery('');
              setActiveFilters([]);
            }}>
              Effacer
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Appuyez sur Entrée pour rechercher
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
