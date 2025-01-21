import React, { useState, useEffect, useRef } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { markAttendance, getTicketDetailsByTicketId } from '../api/events';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { errorToastConfig } from '../utils/toast-config';

const ScanQR: React.FC = () => {
  const [scanning, setScanning] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const processingRef = useRef(false);

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
      toast.success('Attendance marked successfully!');
      setScanning(true);
      setCurrentTicketId(null);
      processingRef.current = false;
    },
    onError: () => {
      toast.error('Failed to mark attendance');
      setScanning(true);
      setCurrentTicketId(null);
      processingRef.current = false;
    },
  });

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
        toast.error('Oops!! This ticket has already been used', {
          ...errorToastConfig,
          icon: '⚠️',
        });
        setScanning(true);
        setCurrentTicketId(null);
        processingRef.current = false;
        return;
      }

       // Check if event has ended
       if (isEventEnded(ticketDetails.event.endDate)) {
        toast.error('This event has already ended', {
          ...errorToastConfig,
          icon: '❌',
        });
        setScanning(true);
        setCurrentTicketId(null);
        processingRef.current = false;
        return;
      }

      // Check if event hasn't started yet
      if (isEventNotStarted(ticketDetails.event.startDate)) {
        const startDate = new Date(ticketDetails.event.startDate).toLocaleDateString();
        toast.error(`This event hasn't started yet. Event starts on ${startDate}`, {
          ...errorToastConfig,
          icon: '⏰',
        });
        setScanning(true);
        setCurrentTicketId(null);
        processingRef.current = false;
        return;
      }

      mutation.mutate(ticketId);
    } catch (error) {
      console.error('Error validating ticket:', error);
      //toast.error('Failed to validate ticket');
      toast.error('Invalid ticket or QR code', {
        ...errorToastConfig,
        icon: '❌',
      });
      setScanning(true);
      setCurrentTicketId(null);
      processingRef.current = false;
    }
  };

  const handleScan = (data: string) => {
    if (data && !processingRef.current) {
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
          });
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>
      
      {scanning ? (
        <div className="aspect-square">
          <QrScanner
            onDecode={handleScan}
            onError={(error: any) => {
              if (!processingRef.current) {
                console.error(error);
                toast.error('Camera error. Please check permissions.', {
                  ...errorToastConfig,
                  icon: '📷',
                });
              }
            }}
            constraints={{
              facingMode: 'environment'
            }}
          />
        </div>
      ) : (
        // <div className="text-center">Processing...</div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <div className="text-center text-gray-600">Processing...</div>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500 text-center">
        Position the QR code within the frame to scan
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