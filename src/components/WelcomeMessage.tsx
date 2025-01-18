import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type WelcomeMessageProps = {
    isAuthenticated: boolean;
    username?: string;
  };
  
  const WelcomeMessage = ({ isAuthenticated, username }: WelcomeMessageProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
          setIsVisible(true);
          const timer = setTimeout(() => {
            setIsVisible(false);
          }, 3000); // Show for 3 seconds
    
          return () => clearTimeout(timer);
        }
      }, [isAuthenticated]);

    if (!isAuthenticated || !isVisible) return null;

      // Use name from props or fallback to user context
    const displayName = username || user?.name;


  
    return (
        <div 
        className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        >
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-lg">
            <div className="flex">
            <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm text-green-700">
                Welcome back{displayName ? `, ${displayName}` : ''}! You have successfully logged in.
                </p>
            </div>
            </div>
        </div>
        </div>
    );
  };
  
  export default WelcomeMessage;