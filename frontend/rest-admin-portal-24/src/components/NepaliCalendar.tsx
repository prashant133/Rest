import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import NepaliDate from 'nepali-date-converter';

interface CalendarEvent {
  _id: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  files?: Array<{
    url: string;
    type: string;
  }>;
}

interface NepaliCalendarProps {
  events?: CalendarEvent[];
  onEventAdded?: (newEvent: CalendarEvent) => void;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

const NepaliCalendar: React.FC<NepaliCalendarProps> = ({ events = [], onEventAdded }) => {
  const { toast } = useToast();
  const [currentNepaliDate] = useState(new NepaliDate());
  const [currentYear, setCurrentYear] = useState(currentNepaliDate.getYear());
  const [currentMonth, setCurrentMonth] = useState(currentNepaliDate.getMonth() + 1);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Nepali month names
  const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  // Convert backend events to calendar format with Nepali dates
  const calendarEvents = useMemo(() => {
    return events.map(event => {
      const nepaliDate = event.date ? new NepaliDate(new Date(event.date)) : null;
      return {
        ...event,
        nepaliDate,
        formattedDate: nepaliDate ? `${nepaliDate.getYear()}-${(nepaliDate.getMonth() + 1).toString().padStart(2, '0')}-${nepaliDate.getDate().toString().padStart(2, '0')}` : ''
      };
    });
  }, [events]);

  // Generate calendar dates for current Nepali month
  const calendarDates = useMemo(() => {
    const nepaliDate = new NepaliDate(currentYear, currentMonth - 1, 1);
    const daysInMonth = new NepaliDate(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = nepaliDate.getDay();

    const dates = [];
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      dates.push(null);
    }
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(day);
    }
    return dates;
  }, [currentYear, currentMonth]);

  // Get events for the selected day
  const getEventsForDate = (day: number) => {
    const dateString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return calendarEvents.filter(event => event.formattedDate === dateString);
  };

  // Get upcoming events for current month
  const getUpcomingEventsForMonth = () => {
    return calendarEvents.filter(event => {
      return event.nepaliDate && 
             event.nepaliDate.getYear() === currentYear && 
             event.nepaliDate.getMonth() + 1 === currentMonth;
    }).sort((a, b) => {
      return (a.nepaliDate?.getDate() || 0) - (b.nepaliDate?.getDate() || 0);
    });
  };

  const previousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddEvent = async () => {
    if (!activeDate || !newEvent.title) {
      toast({
        title: "Validation Error",
        description: "Please select a date and provide an event title",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/event/create-event`, {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const createdEvent = response.data.data;
      if (onEventAdded) {
        onEventAdded(createdEvent);
      }

      toast({
        title: "Event Added",
        description: `${newEvent.title} has been added to the calendar`
      });

      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: ''
      });
      setActiveDate(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (day: number) => {
    const nepaliDate = new NepaliDate(currentYear, currentMonth - 1, day);
    const gregorianDate = nepaliDate.toJsDate();
    setActiveDate(gregorianDate.toISOString());
    setNewEvent(prev => ({
      ...prev,
      date: gregorianDate.toISOString()
    }));
  };

  const upcomingEventsThisMonth = getUpcomingEventsForMonth();

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={previousMonth}>«</Button>
          <h2 className="text-xl font-medium">
            {nepaliMonths[currentMonth - 1]} {currentYear} BS
          </h2>
          <Button variant="outline" onClick={nextMonth}>»</Button>
        </div>

        {upcomingEventsThisMonth.length > 0 && (
          <div className="mb-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-[#1E4E9D] mb-3">
              Events in {nepaliMonths[currentMonth - 1]} {currentYear}
            </h3>
            <div className="space-y-2">
              {upcomingEventsThisMonth.map(event => (
                <div key={event._id} className="flex items-center space-x-3 p-2 bg-white rounded-md">
                  <div className="bg-[#1E4E9D] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {event.nepaliDate?.getDate()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    {event.description && <div className="text-sm text-gray-600">{event.description}</div>}
                    {event.location && <div className="text-sm text-gray-500">{event.location}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 text-center font-medium border-b bg-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {calendarDates.map((day, index) => {
            const dateEvents = day ? getEventsForDate(day) : [];
            return (
              <div 
                key={index} 
                className={`border p-1 h-20 relative ${day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-100'}`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <div className="text-right">{day}</div>
                    {dateEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="text-xs px-1 py-0.5 rounded-sm bg-blue-100 text-blue-700">
                          {dateEvents.length} event{dateEvents.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {activeDate && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">
              Add Event for {activeDate && format(parseISO(activeDate), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              <Input
                placeholder="Event Title *"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <Input
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddEvent} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Event'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NepaliCalendar;