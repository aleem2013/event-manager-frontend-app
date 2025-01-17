import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Printer } from 'lucide-react';
import { getTicketDetails } from '../api/events';

const TicketDetails: React.FC = () => {
  const { eventId, ticketId } = useParams<{ eventId: string; ticketId: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', eventId, ticketId],
    queryFn: () => getTicketDetails(eventId!, ticketId!),
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Event
        </button>

        {/* Printable Ticket Section */}
        <div 
          ref={printRef}
          className="bg-white rounded-lg shadow-md p-8 print:shadow-none"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Event Ticket</h1>
          
          <div className="flex justify-center mb-6">
            <img 
              src={ticket.qrCodeUrl}
              alt="Ticket QR Code"
              className="w-64 h-64"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">{ticket.event.title}</h2>
            <p className="text-gray-600">{ticket.event.address}</p>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium">Ticket #{ticket.ticketNumber}</p>
            {ticket.attended && (
              <p className="text-green-600 mt-2">
                Attended at: {new Date(ticket.attendanceTimestamp).toLocaleString()}
              </p>
            )}
          </div>

          {/* Add scanning instructions */}
          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>Scan this QR code at the event to mark your attendance</p>
          </div>
        </div>

        {/* Print/Download Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;