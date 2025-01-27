import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
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
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.backToEvent')}
        </button>

        {/* Printable Ticket Section */}
        <div 
          ref={printRef}
          className="bg-white rounded-lg shadow-md p-4 md:p-8 print:shadow-none"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">{t('tickets.details.title')}</h1>
          
          <div className="flex justify-center mb-6">
            <img 
              src={ticket.qrCodeUrl}
              alt={t('tickets.details.qrCodeAlt')}
              className="w-64 h-64"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">{ticket.event.title}</h2>
            <p className="text-gray-600 mb-2">{ticket.event.address}</p>
            <p className="text-gray-600">
              {new Date(ticket.event.startDate).toLocaleString()} - {new Date(ticket.event.endDate).toLocaleString()}
            </p>
            <p className="text-gray-600">
              {t('tickets.details.duration', { 
                days: ticket.event.numberOfDays,
                count: ticket.event.numberOfDays 
              })}
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium">
              {t('tickets.details.ticketNumber', { number: ticket.ticketNumber })}
            </p>
            {ticket.attended && (
              <p className="text-green-600 mt-2">
                {t('tickets.details.attendedAt', { 
                  time: new Date(ticket.attendanceTimestamp).toLocaleString() 
                })}
              </p>
            )}
          </div>

          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>{t('tickets.details.scanInstructions')}</p>
          </div>
        </div>

        {/* Print/Share/Download Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            {t('tickets.details.printButton')}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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