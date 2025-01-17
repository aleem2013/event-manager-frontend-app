declare module '@yudiel/react-qr-scanner' {
  interface QrScannerProps {
    onDecode: (result: string) => void;
    onError: (error: Error) => void;
    constraints?: MediaTrackConstraints;
  }
  
  export const QrScanner: React.FC<QrScannerProps>;
  export default QrScanner;
}