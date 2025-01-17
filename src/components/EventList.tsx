import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { fetchEvents } from '../api/events';

const EventList: React.FC = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events?.map((event: any) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.address}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{event.tickets?.length || 0} tickets</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventList;