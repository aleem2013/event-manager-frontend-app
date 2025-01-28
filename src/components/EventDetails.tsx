import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Printer, Loader2, Clock, Calendar } from 'lucide-react';
import { fetchEventDetails, createTicket } from '../api/events';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

const LoadingOverlay = () => {
  const { t } = useTranslation();
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="bg-white/10 rounded-lg p-8 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
        <p className="text-white text-lg font-medium">{t('events.details.generatingTicket')}</p>
      </div>
    </div>
  );
};

const EventDetails: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventDetails(id!),
  });

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onMutate: () => {
      setShowLoadingOverlay(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success(t('events.details.ticketCreated'));
    },
    onSettled: () => {
      setShowLoadingOverlay(false);
    },
    onError: () => {
      toast.error(t('events.details.ticketCreationError'));
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!event) return <div>{t('events.details.notFound')}</div>;

  const formatDateTime = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(i18n.language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventEnded = () => {
    const currentDate = new Date();
    const eventEndDate = new Date(event.endDate);
    return currentDate > eventEndDate;
  };

  const isTicketGenerationDisabled = isEventEnded();

  return (
    <>
      {showLoadingOverlay && <LoadingOverlay />}
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => navigate(`/events`)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              ← {t('common.back')}
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-4 break-words">{event.title}</h1>
            
            <div className="flex items-center mb-4 flex-wrap">
              <MapPin className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
              <a 
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                {event.address}
              </a>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium">{t('events.details.eventDuration')}</div>
                  <div className="text-gray-600">
                    {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                <div className="text-gray-600">
                  {t('events.details.duration', { 
                    count: event.numberOfDays 
                  })}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('events.details.qrCode')}</h2>
              <img 
                src={event.qrCodeUrl} 
                alt={t('events.details.qrCodeAlt')} 
                className="w-48 h-48"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('events.details.tickets')}</h2>
              <button
                onClick={() => createTicketMutation.mutate(id!)}
                disabled={isTicketGenerationDisabled}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                {isTicketGenerationDisabled 
                  ? t('events.details.eventEndedMessage')
                  : t('events.details.generateTicket')
                }
              </button>
              {isTicketGenerationDisabled && (
                <p className="text-red-500 text-sm mt-2">
                  {t('events.details.cannotGenerateTickets')}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">{t('events.details.existingTickets')}</h3>
              <div className="grid gap-4">
                {event.tickets?.map((ticket: any) => (
                  <div 
                    key={ticket.id} 
                    className="border rounded-md p-4 flex justify-between items-center hover:shadow-lg transition-all duration-200 hover:border-blue-500 cursor-pointer group"
                    onClick={() => navigate(`/events/${id}/tickets/${ticket.id}`)}
                  >
                    <div>
                      <span className="font-medium group-hover:text-blue-600 transition-colors">
                        {t('events.details.ticketNumber', { number: ticket.ticketNumber })}
                      </span>
                      <div className="text-sm text-gray-500">
                        {ticket.attended 
                          ? t('events.details.attended') 
                          : t('events.details.notAttended')
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {ticket.attended && (
                        <span className="text-green-600 text-sm break-words">
                          {formatDateTime(ticket.attendanceTimestamp)}
                        </span>
                      )}
                      <button 
                        className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${id}/tickets/${ticket.id}`);
                        }}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        {t('events.details.viewPrint')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;