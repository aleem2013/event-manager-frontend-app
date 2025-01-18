import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import { getTicketDetails } from '../api/events';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js'; 

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

  const generatePDF = async () => {
    if (!printRef.current || !ticket) return null;

    const element = printRef.current;
    const opt = {
      margin: 1,
      filename: `ticket-${ticket.ticketNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      const pdf = await html2pdf().set(opt).from(element).save();
      return opt.filename;
    } catch (error) {
      console.error('PDF generation failed:', error);
      return null;
    }
  };

  const handleShare = async () => {
    if (!ticket) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading('Generating PDF...');
      
      // Generate PDF
      const pdfFileName = await generatePDF();
      
      if (!pdfFileName) {
        toast.error('Failed to generate PDF');
        toast.dismiss(loadingToast);
        return;
      }

      // Prepare share data
      const shareData = {
        title: `Ticket for ${ticket.event.title}`,
        text: `Join me at ${ticket.event.title}!\nLocation: ${ticket.event.address}\nTicket #${ticket.ticketNumber}`,
        files: [
          new File(
            [await fetch(pdfFileName).then(res => res.blob())],
            pdfFileName,
            { type: 'application/pdf' }
          )
        ]
      };

      toast.dismiss(loadingToast);

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Ticket shared successfully!');
      } else {
        // Fallback: Download PDF directly
        const link = document.createElement('a');
        link.href = pdfFileName;
        link.download = pdfFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('PDF downloaded successfully!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share ticket');
        console.error('Share failed:', error);
      }
    }
  };

  /*
  const handleShare = async () => {
    if (!ticket) return;

    const shareData = {
      title: `Ticket for ${ticket.event.title}`,
      text: `Join me at ${ticket.event.title}!\nLocation: ${ticket.event.address}\nTicket #${ticket.ticketNumber}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying the share text to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast.success('Ticket details copied to clipboard!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share ticket');
      }
    }
  };*/

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="min-h-screen p-4">
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
          className="bg-white rounded-lg shadow-md p-4 md:p-8 print:shadow-none"
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
            {/* <p>Scan this QR code at the event to mark your attendance</p> */}
            <p>Don't miss out! Scan the QR code at the venue.</p>
          </div>
        </div>

        {/* Print/Share/Download Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Ticket
          </button>
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;