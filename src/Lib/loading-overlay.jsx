import React from 'react';

const LoadingOverlay = ({ isLoading, message = "Loading...", color = "green" }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with glassmorphism effect */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Loading container with glass effect */}
      <div className="relative bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 flex flex-col items-center gap-4">
        {/* Animated squares */}
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-0 w-7 h-7 bg-green-500/80 rounded-sm animate-bounce" 
                 style={{ animationDelay: '0s' }} />
            <div className="absolute top-0 right-0 w-7 h-7 bg-green-500/80 rounded-sm animate-bounce" 
                 style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-0 left-0 w-7 h-7 bg-green-500/80 rounded-sm animate-bounce" 
                 style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500/80 rounded-sm animate-bounce" 
                 style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
        
        {/* Loading message with pulse animation */}
        <div className="text-gray-800 font-medium text-lg tracking-wide mt-4 animate-pulse">
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;