import React, { useState, useEffect, useRef } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { markAttendance, getTicketDetailsByTicketId } from '../api/events';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { errorToastConfig } from '../utils/toast-config';
import { useTranslation } from 'react-i18next';

const SCAN_COOLDOWN = 1000;

const ScanQR: React.FC = () => {
  const [scanning, setScanning] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const processingRef = useRef(false);
  const lastScanTimeRef = useRef(0);
  const scannerRef = useRef<any>(null);
  const { t } = useTranslation();

  // Query to fetch ticket details
  /*const ticketQuery = useQuery({
    queryKey: ['ticket', currentTicketId],
    queryFn: async () => {
      if (!currentTicketId) return null;
      try {
        // We need to pass both eventId and ticketId, but since we don't have eventId in QR,
        // we'll modify the backend to accept just ticketId if needed
        return await getTicketDetailsByTicketId(currentTicketId);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        throw error;
      }
    },
    enabled: !!currentTicketId,
  });*/
  console.log(currentTicketId);
  const mutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      toast.success(t('tickets.scan.success'));
      resetScannerState();
      // setScanning(true);
      // setCurrentTicketId(null);
      // processingRef.current = false;
    },
    onError: () => {
      toast.error(t('tickets.scan.error.generic'));
      resetScannerState();
      // setScanning(true);
      // setCurrentTicketId(null);
      // processingRef.current = false;
    },
  });

  const resetScannerState = () => {
    setScanning(true);
    setCurrentTicketId(null);
    processingRef.current = false;
    // Update last scan time to prevent immediate rescanning
    lastScanTimeRef.current = Date.now();
  };

  // Check if event has ended
  const isEventEnded = (endDate: string): boolean => {
    const currentDate = new Date();
    const eventEndDate = new Date(endDate);
    return currentDate > eventEndDate;
  };

  // Check if event hasn't started yet
  const isEventNotStarted = (startDate: string): boolean => {
    const currentDate = new Date();
    const eventStartDate = new Date(startDate);
    return currentDate < eventStartDate;
  };

  // Handle ticketId from URL parameter
  useEffect(() => {
    const ticketId = searchParams.get('ticketId');
    if (ticketId && !processingRef.current) {
      //mutation.mutate(ticketId);
      handleTicketValidation(ticketId);
    }
  }, [searchParams]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup scanner on component unmount
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const handleTicketValidation = async (ticketId: string) => {
    if (processingRef.current) return;

    processingRef.current = true;
    setScanning(false);
    setCurrentTicketId(ticketId);

    try {
      const ticketDetails = await getTicketDetailsByTicketId(ticketId); //await ticketQuery.refetch();
      console.log('Status : '+ticketDetails);

      // Check if ticket is already used
      if (ticketDetails?.attended) {
        toast.error(t('tickets.scan.error.alreadyUsed'), {
          ...errorToastConfig,
          icon: '⚠️',
        });
        resetScannerState();
        // setScanning(true);
        // setCurrentTicketId(null);
        // processingRef.current = false;
        return;
      }

       // Check if event has ended
       if (isEventEnded(ticketDetails.event.endDate)) {
        toast.error(t('tickets.scan.error.eventEnded'), {
          ...errorToastConfig,
          icon: '❌',
        });
        resetScannerState();
        // setScanning(true);
        // setCurrentTicketId(null);
        // processingRef.current = false;
        return;
      }

      // Check if event hasn't started yet
      if (isEventNotStarted(ticketDetails.event.startDate)) {
        toast.error(t('tickets.scan.error.eventNotStarted', {
          date: new Date(ticketDetails.event.startDate).toLocaleDateString()
        }), {
          ...errorToastConfig,
          icon: '⏰',
        });
        resetScannerState();
        return;
      }

      mutation.mutate(ticketId);
    } catch (error) {
      console.error('Error validating ticket:', error);
      //toast.error('Failed to validate ticket');
      toast.error(t('tickets.scan.error.invalid'), {
        ...errorToastConfig,
        icon: '❌',
      });
      resetScannerState();
      // setScanning(true);
      // setCurrentTicketId(null);
      // processingRef.current = false;
    }
  };

  const handleScan = (data: string | null) => {
    const now = Date.now();
    if (!data || processingRef.current || (now - lastScanTimeRef.current) < SCAN_COOLDOWN) {
      return;
    }

    lastScanTimeRef.current = now;
      //setScanning(false);
      try {
        // Extract ticketId from URL parameter
        const url = new URL(data);
        console.log('URL :'+url)
        const ticketId = url.searchParams.get('ticketId');
        if (ticketId) {
          //mutation.mutate(ticketId);
          handleTicketValidation(ticketId);
        } else {
          throw new Error('No ticket ID found');
        }
      } catch (error) {
        if (!processingRef.current) {
        console.error('Invalid QR code data:', error);
        toast.error('Invalid QR code format', {
          ...errorToastConfig,
          icon: '❌',
          duration: 2000,
          });
        }
      }
  };

  const handleError = (error: any) => {
    if (!processingRef.current && (Date.now() - lastScanTimeRef.current) >= SCAN_COOLDOWN) {
      console.error(error);
      lastScanTimeRef.current = Date.now();
      toast.error('Camera error. Please check permissions.', {
        ...errorToastConfig,
        icon: '📷',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{t('tickets.scan.title')}</h1>
      
      {scanning ? (
        <div className="aspect-square">
          <QrScanner
            ref={(instance) => {
              scannerRef.current = instance; // Assign the instance to the ref
            }}
            onDecode={handleScan}
            onError={handleError}
            constraints={{
              facingMode: 'environment'
            }}
            scanDelay={500} // Add a slight delay between scans
          />
        </div>
      ) : (
        // <div className="text-center">Processing...</div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <div className="text-center text-gray-600">{t('tickets.scan.processing')}</div>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500 text-center">
      {t('tickets.scan.instructions')}
      </p>
    </div>
  );
};

export default ScanQR;


// import React, { useState } from 'react';
// import { QrScanner } from '@yudiel/react-qr-scanner';
// import { useMutation } from '@tanstack/react-query';  // Updated import
// import { markAttendance } from '../api/events';
// import toast from 'react-hot-toast';

// const ScanQR: React.FC = () => {
//   const [scanning, setScanning] = useState(true);

//   const mutation = useMutation({  // Updated mutation syntax for @tanstack/react-query v5
//     mutationFn: markAttendance,
//     onSuccess: () => {
//       toast.success('Attendance marked successfully!');
//       setScanning(true);
//     },
//     onError: () => {
//       toast.error('Failed to mark attendance');
//       setScanning(true);
//     },
//   });

//   const handleScan = (data: string) => {
//     if (data) {
//       setScanning(false);
//       try {
//         const ticketId = new URL(data).pathname.split('/').pop();
//         if (ticketId) {
//           mutation.mutate(ticketId);
//         }
//       } catch (error) {
//         console.error('Invalid QR code data:', error);
//         toast.error('Invalid QR code');
//         setScanning(true);
//       }
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//       <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>
      
//       {scanning ? (
//         <div className="aspect-square">
//           <QrScanner
//             onDecode={handleScan}
//             onError={(error: any) => console.error(error)}
//             constraints={{
//               facingMode: 'environment'
//             }}
//           />
//         </div>
//       ) : (
//         <div className="text-center">Processing...</div>
//       )}
//     </div>
//   );
// };

// export default ScanQR;