
import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useMaintenanceCalendar } from '@/hooks/useMaintenanceCalendar';

export function MaintenanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [draggedEvent, setDraggedEvent] = useState<any>(null);
  const { toast } = useToast();
  const { events, isLoading, updateEvent } = useMaintenanceCalendar();

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

  const handleDragStart = (event: any) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newDate: Date) => {
    e.preventDefault();
    if (draggedEvent) {
      updateEvent(draggedEvent.id, { date: newDate });
      
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

  // Fonction pour obtenir les dates de la semaine courante
  const getWeekDates = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Commencer par lundi
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const renderWeekView = () => {
    const weekDates = selectedDate ? getWeekDates(selectedDate) : getWeekDates(new Date());
    
    return (
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[600px]">
          {weekDates.map((date, i) => {
            const dayEvents = getEventsByDate(date);
            
            return (
              <div key={i} className="min-h-32 border rounded-lg p-1 sm:p-2">
                <div className="font-medium text-xs sm:text-sm mb-2 text-center">
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
                      <div className="text-gray-600 text-xs">{event.startTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    if (!selectedDate) return null;
    
    return (
      <div className="w-full overflow-y-auto max-h-96">
        <div className="space-y-0">
          {generateTimeSlots().map(time => (
            <TimeSlot key={time} time={time} date={selectedDate} />
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <div className="h-80 sm:h-96">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full h-full mx-auto rounded-md border flex flex-col"
            classNames={{
              months: "flex-1 w-full",
              month: "w-full h-full flex flex-col",
              table: "w-full h-full",
              head_row: "flex w-full",
              head_cell: "flex-1 text-center p-1 sm:p-2 text-xs sm:text-sm",
              row: "flex w-full flex-1",
              cell: "flex-1 h-full p-0.5 sm:p-1 border border-gray-100",
              day: "w-full h-full flex items-center justify-center text-xs sm:text-sm hover:bg-blue-50 relative",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-blue-100 text-blue-900"
            }}
            modifiers={{
              hasEvents: (date) => getEventsByDate(date).length > 0,
              highPriority: (date) => getEventsByDate(date).some(event => event.priority === 'high'),
              mediumPriority: (date) => getEventsByDate(date).some(event => event.priority === 'medium'),
              lowPriority: (date) => getEventsByDate(date).some(event => event.priority === 'low' && !getEventsByDate(date).some(event => event.priority === 'high' || event.priority === 'medium'))
            }}
            modifiersClassNames={{
              hasEvents: "font-semibold",
              highPriority: "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
              mediumPriority: "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
              lowPriority: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
            }}
            components={{
              DayContent: ({ date, displayMonth }) => {
                const dayEvents = getEventsByDate(date);
                const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
                
                return (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <span className={`${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              event.priority === 'high' ? 'bg-red-500' :
                              event.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Header avec navigation responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          Calendrier de maintenance
        </h2>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex bg-gray-100 rounded-lg p-1 flex-1 sm:flex-none">
            {(['month', 'week', 'day'] as const).map((v) => (
              <Button
                key={v}
                variant={view === v ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(v)}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Jour'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Calendar selon la vue */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-full overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Vue {view === 'month' ? 'mensuelle' : view === 'week' ? 'hebdomadaire' : 'journalière'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 w-full max-w-full overflow-hidden">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Légende des priorités simplifiée */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Légende des priorités
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-800 text-sm sm:text-base">Priorité Critique</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800 text-sm sm:text-base">Priorité Moyenne</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800 text-sm sm:text-base">Priorité Faible</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tâches du jour - Section responsive avec plus d'espace */}
      {selectedDate && (
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base">
                Tâches du jour - {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-4">
              {getEventsByDate(selectedDate).map(event => (
                <div key={event.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                    <h4 className="font-medium text-sm sm:text-base">{event.title}</h4>
                    <Badge className={`${getTypeColor(event.type)} text-xs`}>
                      {event.type === 'preventive' ? 'Préventif' :
                       event.type === 'corrective' ? 'Correctif' : 'Inspection'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
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
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button size="sm" variant="outline" className="text-xs">Modifier</Button>
                    <Button size="sm" className="text-xs">Voir détails</Button>
                  </div>
                </div>
              ))}
              
              {getEventsByDate(selectedDate).length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Aucune tâche planifiée pour cette date</p>
                  <p className="text-sm text-gray-400 mt-2">Les tâches apparaîtront ici une fois planifiées</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
