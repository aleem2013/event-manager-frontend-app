import React, { useState, useEffect, useRef } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { markAttendance, getTicketDetailsByTicketId } from '../api/events';
import toast from 'react-hot-toast';
import { Loader2, Scan, Camera, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { successToastConfig, errorToastConfig, warningToastConfig } from '../utils/toast-config';
import { useTranslation } from 'react-i18next';

const SCAN_COOLDOWN = 1000;

const ProcessingOverlay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center space-y-4 h-full">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 
                    animate-spin duration-700" style={{ padding: '3px' }}>
        <div className="w-full h-full bg-black/20 backdrop-blur-xl rounded-full" />
      </div>
      <Loader2 className="h-12 w-12 text-white relative animate-spin duration-700" />
    </div>
    <div className="text-center">
      <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r 
                   from-purple-600 via-blue-600 to-violet-600 animate-pulse">
        {message}
      </p>
    </div>
  </div>
);

const ScanQR: React.FC = () => {
  const [scanning, setScanning] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
  const processingRef = useRef(false);
  const lastScanTimeRef = useRef(0);
  const scannerRef = useRef<any>(null);
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      toast.success(t('tickets.scan.success'), {
        icon: '✨',
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px'
        }
      });
      resetScannerState();
    },
    onError: () => {
      toast.error(t('tickets.scan.error.generic'), {
        ...errorToastConfig,
      });
      resetScannerState();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scan className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('tickets.scan.title')}
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Scanner Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-100">
          <div className="relative">
            {/* Scanner Frame */}
            <div className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-purple-300 
                          bg-gradient-to-br from-purple-50 to-blue-50">
              {scanning ? (
                <div className="relative w-full h-full">
                  {/* Scanner Corner Decorations */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-600 z-10" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-600 z-10" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-600 z-10" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-600 z-10" />
                  
                  {/* Sparkle Decorations */}
                  <Sparkles className="absolute top-2 right-2 h-6 w-6 text-yellow-400 animate-pulse z-10" />
                  <Sparkles className="absolute bottom-2 left-2 h-4 w-4 text-blue-400 animate-pulse delay-300 z-10" />
                  
                  {/* QR Scanner */}
                  <div className="absolute inset-0">
                    <QrScanner
                      ref={(instance) => {
                        scannerRef.current = instance;
                      }}
                      onDecode={handleScan}
                      onError={handleError}
                      constraints={{
                        facingMode: 'environment'
                      }}
                      scanDelay={500}
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm">
                  <ProcessingOverlay message={t('tickets.scan.processing')} />
                </div>
              )}
            </div>

            {/* Instructions Card */}
            <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100">
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('tickets.scan.instructions')}
                  </p>
                  <div className="mt-3 flex items-center text-xs text-purple-600">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    <span>{t('tickets.scan.securityNote')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-600">
                {scanning ? t('tickets.scan.ready') : t('tickets.scan.processing')}
              </span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {t('tickets.scan.helpText')}
          </p>
        </div>
      </div>
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