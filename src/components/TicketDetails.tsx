import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Printer, Share2, Calendar, MapPin, Clock, Ticket, Sparkles } from 'lucide-react';
import { getTicketDetails } from '../api/events';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js'; 
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

const TicketDetails: React.FC = () => {
  const { eventId, ticketId } = useParams<{ eventId: string; ticketId: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
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
      await html2pdf().set(opt).from(element).save();
      return opt.filename;
    } catch (error) {
      console.error('PDF generation failed:', error);
      return null;
    }
  };

  const handleShare = async () => {
    if (!ticket) return;

    try {
      const loadingToast = toast.loading(t('tickets.details.generatingPdf'));
      const pdfFileName = await generatePDF();
      
      if (!pdfFileName) {
        toast.error(t('tickets.details.pdfGenerationError'));
        toast.dismiss(loadingToast);
        return;
      }

      const shareData = {
        title: t('tickets.details.shareTitle', { title: ticket.event.title }),
        text: t('tickets.details.shareText', { 
          title: ticket.event.title,
          address: ticket.event.address,
          ticketNumber: ticket.ticketNumber
        }),
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
        toast.success(t('tickets.details.shareSuccess'));
      } else {
        const link = document.createElement('a');
        link.href = pdfFileName;
        link.download = pdfFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t('tickets.details.downloadSuccess'));
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error(t('tickets.details.shareError'));
        console.error('Share failed:', error);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!ticket) return <div>{t('tickets.details.notFound')}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 mb-6 rounded-full 
                   bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.backToEvent')}
        </button>

        {/* Printable Ticket Section */}
        <div 
          ref={printRef}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6 md:p-8 print:shadow-none
                   print:bg-white border border-gray-100 relative overflow-hidden"
        >
          {/* Decorative Elements (hidden in print) */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-blue-600 
                       to-violet-600 print:hidden" />
          <div className="absolute top-4 right-4 print:hidden">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Ticket Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 
                         bg-clip-text text-transparent print:text-gray-900">
              {t('tickets.details.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full print:hidden" />
          </div>
          
          {/* QR Code Section */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-xl shadow-md print:shadow-none">
              <img 
                src={ticket.qrCodeUrl}
                alt={t('tickets.details.qrCodeAlt')}
                className="w-64 h-64"
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            {/* Event Title */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-800 to-blue-800 
                           bg-clip-text text-transparent print:text-gray-900">
                {ticket.event.title}
              </h2>
            </div>

            {/* Event Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 print:gap-2">
              {/* Location */}
              <div className="bg-purple-50 rounded-lg p-4 flex items-start print:bg-transparent print:p-2">
                <MapPin className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0 print:text-gray-600" />
                <p className="text-gray-600">{ticket.event.address}</p>
              </div>

              {/* Date/Time */}
              <div className="bg-blue-50 rounded-lg p-4 flex items-start print:bg-transparent print:p-2">
                <Calendar className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 print:text-gray-600" />
                <div className="text-gray-600">
                  <div>{new Date(ticket.event.startDate).toLocaleString()}</div>
                  <div>{new Date(ticket.event.endDate).toLocaleString()}</div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-violet-50 rounded-lg p-4 flex items-center print:bg-transparent print:p-2">
                <Clock className="h-5 w-5 mr-2 text-violet-500 flex-shrink-0 print:text-gray-600" />
                <p className="text-gray-600">
                  {t('tickets.details.duration', { count: ticket.event.numberOfDays })}
                </p>
              </div>

              {/* Ticket Number */}
              <div className="bg-indigo-50 rounded-lg p-4 flex items-center print:bg-transparent print:p-2">
                <Ticket className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0 print:text-gray-600" />
                <p className="text-gray-700 font-medium">
                  {t('tickets.details.ticketNumber', { number: ticket.ticketNumber })}
                </p>
              </div>
            </div>

            {/* Attendance Status */}
            {ticket.attended && (
              <div className="bg-green-50 rounded-lg p-4 text-center print:bg-transparent print:p-2">
                <p className="text-green-600 font-medium">
                  {t('tickets.details.attendedAt', { 
                    time: new Date(ticket.attendanceTimestamp).toLocaleString() 
                  })}
                </p>
              </div>
            )}

            {/* Scan Instructions */}
            <div className="text-center text-gray-600 text-sm bg-gray-50 rounded-lg p-4 print:bg-transparent print:p-2">
              <p>{t('tickets.details.scanInstructions')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (hidden in print) */}
        <div className="mt-6 flex justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 
                     text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md 
                     hover:shadow-lg"
          >
            <Printer className="h-4 w-4 mr-2" />
            {t('tickets.details.printButton')}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 
                     text-white hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-md 
                     hover:shadow-lg"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t('tickets.details.sharePdfButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;