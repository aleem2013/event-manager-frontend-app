import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { fetchEvents } from '../api/events';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

const EventList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>{t('events.list.error')}</div>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 break-words">{event.title}</h2>
                <div className="flex items-center text-gray-600 mb-2 break-words">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="break-words">{event.address}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    {new Date(event.startDate).toLocaleDateString(i18n.language)} - {new Date(event.endDate).toLocaleDateString(i18n.language)}
                    <span className="ml-1 text-sm">
                      {t('events.list.duration', { 
                        days: event.numberOfDays,
                        count: event.numberOfDays 
                      })}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {t('events.list.tickets', { 
                        count: event.tickets?.length || 0 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;