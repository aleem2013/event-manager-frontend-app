import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-violet-900/50 
                    backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-4 
                    animate-in fade-in zoom-in duration-300 border border-white/20">
        {/* Gradient Ring with Spinner */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 
                        animate-spin duration-700" style={{ padding: '3px' }}>
            <div className="w-full h-full bg-black/20 backdrop-blur-xl rounded-full" />
          </div>
          <Loader2 className="h-12 w-12 text-white relative animate-spin duration-700" />
        </div>
        
        {/* Decorative Elements */}
        <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
        
        {/* Message */}
        <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r 
                   from-purple-200 via-blue-200 to-violet-200 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};