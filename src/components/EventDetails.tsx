import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Printer, Loader2, Clock, Calendar, ArrowLeft, Ticket, Sparkles, Users } from 'lucide-react';
import { fetchEventDetails, createTicket } from '../api/events';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

const LoadingOverlay = () => {
  const { t } = useTranslation();
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-opacity duration-300 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="bg-white/10 rounded-xl p-8 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300 border border-white/20">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
          <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
        </div>
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
    onMutate: () => setShowLoadingOverlay(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success(t('events.details.ticketCreated'));
    },
    onSettled: () => setShowLoadingOverlay(false),
    onError: () => toast.error(t('events.details.ticketCreationError')),
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/`)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 mb-6 rounded-full 
                     bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </button>

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
            {/* Event Title */}
            <h1 className="text-3xl font-bold mb-6 break-words bg-gradient-to-r from-purple-600 to-blue-600 
                         bg-clip-text text-transparent">{event.title}</h1>
            
            {/* Location Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center flex-wrap">
                <MapPin className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
                <a 
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline break-words font-medium"
                >
                  {event.address}
                </a>
              </div>
            </div>

            {/* Date and Duration Section */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-900">{t('events.details.eventDuration')}</div>
                    <div className="text-blue-700">
                      {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
                  <div className="text-purple-700 font-medium">
                    {t('events.details.duration', { count: event.numberOfDays })}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                {t('events.details.qrCode')}
              </h2>
              <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                <img 
                  src={event.qrCodeUrl} 
                  alt={t('events.details.qrCodeAlt')} 
                  className="w-48 h-48"
                />
              </div>
            </div>

            {/* Tickets Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-purple-500" />
                  {t('events.details.tickets')}
                </h2>
                <button
                  onClick={() => createTicketMutation.mutate(id!)}
                  disabled={isTicketGenerationDisabled}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white
                           hover:from-purple-700 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-md hover:shadow-lg disabled:hover:shadow-none
                           flex items-center space-x-2"
                >
                  {isTicketGenerationDisabled 
                    ? t('events.details.eventEndedMessage')
                    : t('events.details.generateTicket')
                  }
                </button>
              </div>

              {isTicketGenerationDisabled && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {t('events.details.cannotGenerateTickets')}
                </p>
              )}

              {/* Existing Tickets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {t('events.details.existingTickets')}
                </h3>
                <div className="grid gap-4">
                  {event.tickets?.map((ticket: any) => (
                    <div 
                      key={ticket.id} 
                      className="bg-white rounded-lg p-4 flex justify-between items-center hover:shadow-xl
                               transition-all duration-300 border border-gray-100 hover:border-blue-300 
                               cursor-pointer group"
                      onClick={() => navigate(`/events/${id}/tickets/${ticket.id}`)}
                    >
                      <div>
                        <span className="font-medium group-hover:text-blue-600 transition-colors flex items-center">
                          <Ticket className="h-4 w-4 mr-2 text-blue-500" />
                          {t('events.details.ticketNumber', { number: ticket.ticketNumber })}
                        </span>
                        <div className="text-sm text-gray-500 ml-6">
                          {ticket.attended 
                            ? t('events.details.attended') 
                            : t('events.details.notAttended')
                          }
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {ticket.attended && (
                          <span className="text-green-600 text-sm break-words bg-green-50 px-3 py-1 rounded-full">
                            {formatDateTime(ticket.attendanceTimestamp)}
                          </span>
                        )}
                        <button 
                          className="flex items-center px-4 py-2 text-sm bg-blue-50 text-blue-600
                                   hover:bg-blue-100 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${id}/tickets/${ticket.id}`);
                          }}
                        >
                          <Printer className="h-4 w-4 mr-2" />
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
      </div>
    </>
  );
};

export default EventDetails;