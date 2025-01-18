import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Printer, Loader2 } from 'lucide-react';
import { fetchEventDetails, createTicket } from '../api/events';
import toast from 'react-hot-toast';

const LoadingOverlay = () => (
  <div 
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 flex items-center justify-center"
    aria-hidden="true"
  >
    <div className="bg-white/10 rounded-lg p-8 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
      <Loader2 className="h-12 w-12 text-white animate-spin" />
      <p className="text-white text-lg font-medium">Generating Ticket...</p>
    </div>
  </div>
);

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventDetails(id!),
  });

  // Enhanced mutation
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onMutate: () => {
      // Show loading overlay when mutation starts
      setShowLoadingOverlay(true);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      
      // Show success toast with larger text
      toast.success('Ticket created successfully!', {
        style: {
          fontSize: '1.2rem',
          padding: '16px',
        },
        duration: 3000,
      });
    },
    onSettled: () => {
      // Hide loading overlay when mutation completes (success or error)
      setShowLoadingOverlay(false);
    },
    onError: () => {
      // Handle error case
      toast.error('Failed to create ticket. Please try again.');
    },
  });

  /*
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success('Ticket created successfully!');
    },
  });*/

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <>
    {showLoadingOverlay && <LoadingOverlay />}
    <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
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

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">QR Code</h2>
              <img src={event.qrCodeUrl} alt="Event QR Code" className="w-48 h-48" />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Tickets</h2>
              <button
                onClick={() => createTicketMutation.mutate(id!)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                Generate New Ticket
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Existing Tickets</h3>
              <div className="grid gap-4">
                {event.tickets?.map((ticket: any) => (
                  <div 
                    key={ticket.id} 
                    className="border rounded-md p-4 flex justify-between items-center hover:shadow-lg transition-all duration-200 hover:border-blue-500 cursor-pointer group"
                    onClick={() => navigate(`/events/${id}/tickets/${ticket.id}`)}
                  >
                    <div>
                      <span className="font-medium group-hover:text-blue-600 transition-colors">
                        Ticket #{ticket.ticketNumber}
                      </span>
                      <div className="text-sm text-gray-500">
                        {ticket.attended ? 'Attended' : 'Not attended'}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {ticket.attended && (
                        <span className="text-green-600 text-sm break-words">
                          {new Date(ticket.attendanceTimestamp).toLocaleString()}
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
                        View/Print
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