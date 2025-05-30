import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NepaliCalendar from '@/components/NepaliCalendar';
import { useAuth } from '@/context/AuthContext';
import { CalendarDays, MapPin, Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Interface for raw event data from the backend
interface RawEvent {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description: string;
  files?: { url: string; type: string }[];
}

// Interface for events passed to NepaliCalendar
interface Event {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description: string;
  files?: { url: string; type: string }[];
}

const Dashboard = () => {
  const { notifications, addNotification } = useAuth();
  const { toast } = useToast();
  const [currentMonth] = useState('May/Jun 2025');
  const [totalRetired] = useState(145);
  const [newMembers] = useState(21);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [completedEventsCount, setCompletedEventsCount] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [noEventMessage, setNoEventMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/event/get-all-event`, {
          withCredentials: true,
        });

        // Normalize events
        const normalizedEvents: Event[] = response.data.data.map((event: RawEvent) => ({
          _id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
          files: event.files,
        }));

        // Adjust for +0545 timezone
        const now = new Date();
        const offsetMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000; // +0545
        const adjustedNow = new Date(now.getTime() + offsetMs);

        const upcoming = normalizedEvents
          .filter((event) => event.date && new Date(`${event.date}T${event.time || '00:00'}:00+05:45`) > adjustedNow)
          .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())
          .slice(0, 3);

        const completed = normalizedEvents.filter(
          (event) => event.date && new Date(`${event.date}T${event.time || '00:00'}:00+05:45`) <= adjustedNow
        );

        setEvents(normalizedEvents);
        setUpcomingEventsCount(upcoming.length);
        setCompletedEventsCount(completed.length);

        addNotification({
          title: 'Welcome Back',
          message: 'Welcome to your REST admin dashboard',
        });
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError('Failed to fetch events');
          toast({
            title: 'Error',
            description: error.response?.data?.message || 'Could not load events',
            variant: 'destructive',
          });
        } else {
          setError('An unexpected error occurred');
          toast({
            title: 'Error',
            description: 'An unexpected error occurred while loading events',
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [addNotification, toast]);

  const handleDateClick = async (date: string) => {
    // Convert date to YYYY-MM-DD format for comparison
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');

    // Find events on the selected date
    const matchingEvents = events.filter(
      (event) => event.date && format(new Date(event.date), 'yyyy-MM-dd') === formattedDate
    );

    if (matchingEvents.length > 0) {
      // Fetch the first matching event by ID
      const eventId = matchingEvents[0]._id;
      try {
        const response = await axios.get(`${API_BASE_URL}/event/get-event/${eventId}`, {
          withCredentials: true,
        });
        const eventData: RawEvent = response.data.data;
        setSelectedEvent({
          _id: eventData._id,
          title: eventData.title,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          description: eventData.description,
          files: eventData.files,
        });
        setNoEventMessage('');
        setIsDialogOpen(true);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to fetch event details'
          : 'An unexpected error occurred';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else {
      setSelectedEvent(null);
      setNoEventMessage(`No event on ${format(new Date(date), 'MMMM d, yyyy')}`);
      setIsDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500 text-center p-4">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#1E4E9D] mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Welcome to REST admin dashboard</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-green-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-700">Total Retired Employee</h2>
              <p className="text-3xl font-bold mt-2">{totalRetired}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-700">New Member</h2>
              <p className="text-3xl font-bold mt-2">{newMembers}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-700">Upcoming Events</h2>
              <p className="text-3xl font-bold mt-2">{upcomingEventsCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-700">Events Already Completed</h2>
              <p className="text-3xl font-bold mt-2">{completedEventsCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-[#1E4E9D] mb-4">Upcoming Events</h2>

            {upcomingEventsCount === 0 ? (
              <p className="text-gray-500">No upcoming events</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => {
                    if (!event.date || !event.time) return false;
                    const eventDateTime = new Date(`${event.date}T${event.time}:00+05:45`);
                    const now = new Date();
                    const offsetMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000; // +0545
                    const adjustedNow = new Date(now.getTime() + offsetMs);
                    return eventDateTime > adjustedNow;
                  })
                  .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <Card key={event._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center bg-[#1E4E9D] text-white rounded-lg p-3 min-w-[60px]">
                            <span className="text-lg font-bold">
                              {event.date ? format(parseISO(event.date), 'dd') : '--'}
                            </span>
                            <span className="text-xs uppercase">
                              {event.date ? format(parseISO(event.date), 'MMM') : '---'}
                            </span>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-500 text-sm mb-1">{event.description}</p>
                            {event.location && (
                              <div className="flex items-center text-gray-500 text-sm mb-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.date && event.time && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <CalendarDays className="w-4 h-4 mr-1" />
                                <span>{format(parseISO(`${event.date}T${event.time}`), 'h:mm a')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <NepaliCalendar events={events} onDateClick={handleDateClick} />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? selectedEvent.title : 'No Event'}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent ? (
                  <div className="space-y-2">
                    <p>{selectedEvent.description}</p>
                    {selectedEvent.date && (
                      <p>
                        <strong>Date:</strong> {format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}
                      </p>
                    )}
                    {selectedEvent.time && (
                      <p>
                        <strong>Time:</strong> {format(parseISO(`${selectedEvent.date}T${selectedEvent.time}`), 'h:mm a')}
                      </p>
                    )}
                    {selectedEvent.location && (
                      <p>
                        <strong>Location:</strong> {selectedEvent.location}
                      </p>
                    )}
                    {selectedEvent.files && selectedEvent.files.length > 0 && (
                      <div>
                        <strong>Files:</strong>
                        <ul className="list-disc pl-5">
                          {selectedEvent.files.map((file, index) => (
                            <li key={index}>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {file.url.split('/').pop()}
                              </a> ({file.type})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{noEventMessage}</p>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;