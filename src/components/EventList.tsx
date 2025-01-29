import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';
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

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric'
    };
    return `${start.toLocaleDateString(i18n.language, options)} - ${end.toLocaleDateString(i18n.language, options)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            {t('events.list.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group relative bg-white/80 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
                       hover:transform hover:-translate-y-1 overflow-hidden border border-gray-100"
            >
              {/* Sparkle Effect */}
              <div className="absolute top-2 right-2">
                <Sparkles className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6">
                {/* Title with gradient on hover */}
                <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-gray-900 to-gray-900 group-hover:from-purple-600 
                             group-hover:to-blue-600 bg-clip-text text-transparent transition-all duration-300 break-words">
                  {event.title}
                </h2>

                {/* Enhanced location display */}
                <div className="flex items-center text-gray-600 mb-3 break-words bg-gray-50 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                  <span className="break-words">{event.address}</span>
                </div>

                {/* Enhanced date display */}
                <div className="flex flex-col text-gray-600 mb-3">
                  <div className="flex items-center bg-blue-50 p-2 rounded-lg mb-2">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                    <span>{formatDateRange(event.startDate, event.endDate)}</span>
                  </div>
                  <div className="ml-6 text-sm font-medium text-purple-600">
                    ({t('events.list.duration', { count: event.numberOfDays })})
                  </div>
                </div>

                {/* Enhanced tickets counter */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center bg-violet-50 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4 mr-2 text-violet-500" />
                    <span className="text-violet-600 font-medium">
                      {t('events.list.tickets', { count: event.tickets?.length || 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 
                            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;