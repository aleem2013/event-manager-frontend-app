import React, { useState, useEffect } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { markAttendance, getTicketDetailsByTicketId } from '../api/events';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const ScanQR: React.FC = () => {
  const [scanning, setScanning] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

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
    },
    onError: () => {
      toast.error('Failed to mark attendance');
      setScanning(true);
      setCurrentTicketId(null);
    },
  });

  // Handle ticketId from URL parameter
  useEffect(() => {
    const ticketId = searchParams.get('ticketId');
    if (ticketId) {
      //mutation.mutate(ticketId);
      handleTicketValidation(ticketId);
    }
  }, [searchParams]);

  const handleTicketValidation = async (ticketId: string) => {
    setScanning(false);
    setCurrentTicketId(ticketId);

    try {
      const ticketDetails = await getTicketDetailsByTicketId(ticketId); //await ticketQuery.refetch();
      console.log('Status : '+ticketDetails);
      if (ticketDetails?.attended) {
        toast.error('This ticket has already been marked as attended!', {
          duration: 4000,
          icon: '⚠️',
        });
        setScanning(true);
        setCurrentTicketId(null);
        return;
      }

      mutation.mutate(ticketId);
    } catch (error) {
      console.error('Error validating ticket:', error);
      toast.error('Failed to validate ticket');
      setScanning(true);
      setCurrentTicketId(null);
    }
  };

  const handleScan = (data: string) => {
    if (data) {
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
        console.error('Invalid QR code data:', error);
        toast.error('Invalid QR code');
        setScanning(true);
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
            onError={(error: any) => console.error(error)}
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