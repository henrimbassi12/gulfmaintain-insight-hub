
import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceEvent {
  id: string;
  title: string;
  equipment: string;
  technician: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'preventive' | 'corrective' | 'inspection';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
  location: string;
}

export function MaintenanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [draggedEvent, setDraggedEvent] = useState<MaintenanceEvent | null>(null);
  const { toast } = useToast();

  const [events, setEvents] = useState<MaintenanceEvent[]>([
    {
      id: '1',
      title: 'Maintenance préventive - Réfrigérateur',
      equipment: 'FR-2024-089',
      technician: 'Ahmed Benali',
      date: new Date(),
      startTime: '09:00',
      endTime: '11:30',
      type: 'preventive',
      priority: 'medium',
      status: 'planned',
      location: 'Agence Casablanca Nord'
    },
    {
      id: '2',
      title: 'Réparation urgente - Climatiseur',
      equipment: 'AC-2024-012',
      technician: 'Fatima Zahra',
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: '14:00',
      endTime: '15:15',
      type: 'corrective',
      priority: 'high',
      status: 'planned',
      location: 'Agence Rabat Centre'
    }
  ]);

  const getEventsByDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive': return 'bg-blue-100 text-blue-800';
      case 'corrective': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleDragStart = (event: MaintenanceEvent) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newDate: Date) => {
    e.preventDefault();
    if (draggedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === draggedEvent.id 
          ? { ...event, date: newDate }
          : event
      ));
      
      toast({
        title: "Événement déplacé",
        description: `${draggedEvent.title} a été reprogrammé au ${newDate.toLocaleDateString('fr-FR')}`,
      });
      
      setDraggedEvent(null);
    }
  };

  const TimeSlot = ({ time, date }: { time: string, date: Date }) => {
    const dayEvents = getEventsByDate(date);
    const slotEvents = dayEvents.filter(event => event.startTime <= time && event.endTime > time);

    return (
      <div 
        className="h-16 border-b border-gray-100 relative"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, date)}
      >
        <span className="text-xs text-gray-500 absolute left-2 top-1">{time}</span>
        {slotEvents.map(event => (
          <div
            key={event.id}
            draggable
            onDragStart={() => handleDragStart(event)}
            className={`absolute left-12 right-2 top-1 bottom-1 rounded px-2 py-1 cursor-move border-l-4 ${getPriorityColor(event.priority)} bg-white shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="text-xs font-medium truncate">{event.title}</div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <User className="w-3 h-3" />
              {event.technician}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Planning des maintenances
        </h2>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day'].map((v) => (
              <Button
                key={v}
                variant={view === v ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(v as any)}
              >
                {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Jour'}
              </Button>
            ))}
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle intervention
          </Button>
        </div>
      </div>

      {/* Mini Calendar and Legend - Above Main Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-l-4 border-l-red-500 bg-white border border-gray-200"></div>
                  <span>Priorité haute</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-l-4 border-l-yellow-500 bg-white border border-gray-200"></div>
                  <span>Priorité moyenne</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-l-4 border-l-green-500 bg-white border border-gray-200"></div>
                  <span>Priorité faible</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Calendar - Full Width */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Planning</CardTitle>
        </CardHeader>
        <CardContent>
          {view === 'day' && selectedDate ? (
            <div className="space-y-0">
              {generateTimeSlots().map(time => (
                <TimeSlot key={time} time={time} date={selectedDate} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Week view or month view */}
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayEvents = getEventsByDate(date);
                
                return (
                  <div 
                    key={i}
                    className="min-h-32 border rounded-lg p-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, date)}
                  >
                    <div className="font-medium text-sm mb-2">
                      {date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          draggable
                          onDragStart={() => handleDragStart(event)}
                          className={`text-xs p-1 rounded cursor-move border-l-2 ${getPriorityColor(event.priority)} bg-gray-50 hover:bg-gray-100`}
                        >
                          <div className="font-medium truncate">{event.equipment}</div>
                          <div className="text-gray-600">{event.startTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Section - Full Width Below Calendar */}
      {selectedDate && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Événements du jour - {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsByDate(selectedDate).map(event => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type === 'preventive' ? 'Préventif' :
                       event.type === 'corrective' ? 'Correctif' : 'Inspection'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Équipement:</span>
                      <div className="font-medium">{event.equipment}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Technicien:</span>
                      <div className="font-medium">{event.technician}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Horaire:</span>
                      <div className="font-medium">{event.startTime} - {event.endTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Lieu:</span>
                      <div className="font-medium">{event.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">Modifier</Button>
                    <Button size="sm">Voir détails</Button>
                  </div>
                </div>
              ))}
              
              {getEventsByDate(selectedDate).length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  Aucune intervention planifiée pour cette date
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
