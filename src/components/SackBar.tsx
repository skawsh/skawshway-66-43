
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SackBarProps {
  className?: string;
  isVisible?: boolean;
}

const SackBar: React.FC<SackBarProps> = ({ className, isVisible = true }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [uniqueServiceCount, setUniqueServiceCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setCartItems(parsedItems);
          
          const uniqueServices = new Set();
          parsedItems.forEach((item: any) => {
            if (item.serviceId) {
              uniqueServices.add(item.serviceId);
            }
          });
          setUniqueServiceCount(uniqueServices.size);
          
          console.log('Cart items loaded:', parsedItems);
          console.log('Unique service count:', uniqueServices.size);
        } else {
          setCartItems([]);
          setUniqueServiceCount(0);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setCartItems([]);
        setUniqueServiceCount(0);
      }
    };
    
    loadCartItems();
    
    window.addEventListener('storage', loadCartItems);
    document.addEventListener('cartUpdated', loadCartItems);
    
    return () => {
      window.removeEventListener('storage', loadCartItems);
      document.removeEventListener('cartUpdated', loadCartItems);
    };
  }, []);
  
  if (cartItems.length === 0) return null;
  
  const handleViewSack = () => {
    // Check if we're coming from an edit order action
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('orderId');
    
    navigate('/cart', {
      state: {
        previousPath: location.pathname,
        studioId: cartItems[0]?.studioId || null,
        orderId: orderId
      }
    });
  };
  
  const handleClearSack = () => {
    localStorage.removeItem('cartItems');
    setCartItems([]);
    setIsDialogOpen(false);
    document.dispatchEvent(new Event('cartUpdated'));
  };
  
  const studioInfo = cartItems[0]?.studioId ? {
    id: cartItems[0].studioId,
    name: 'Busy Bee'
  } : null;
  
  return (
    <div 
      className={cn(
        "fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 transition-all duration-500 ease-in-out",
        isVisible ? 'translate-y-0 animate-fade-in' : 'translate-y-full',
        className
      )}
    >
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-between py-1 px-3 transform hover:scale-[1.02] active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-white">
              <img 
                src="/lovable-uploads/fda4730e-82ff-4406-877e-1f45d0ca2ebd.png" 
                alt="Studio logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">{studioInfo?.name || 'Studio'}</span>
              <button 
                className="text-xs text-left flex items-center text-primary-500"
                onClick={() => studioInfo && navigate(`/studio/${studioInfo.id}`)}
              >
                View menu <span className="ml-1">▶</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewSack}
              className="bg-[#92E3A9] text-black font-semibold px-4 py-1.5 rounded-full flex flex-col items-center hover:bg-[#83d699] transition-colors"
            >
              <span>View Sack</span>
              <span>{uniqueServiceCount} {uniqueServiceCount === 1 ? 'Service' : 'Services'}</span>
            </button>
            
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={24} className="text-red-500" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl animate-scale-in">
                <div className="flex justify-end">
                  <AlertDialogCancel className="p-2 m-0 h-auto absolute top-2 right-2 rounded-full">
                    <X size={18} />
                  </AlertDialogCancel>
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Sack</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to clear your sack? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
                  <AlertDialogCancel className="rounded-full border-gray-300 text-gray-700 font-medium">
                    <X className="mr-1 h-4 w-4" /> No
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearSack}
                    className="rounded-full bg-red-500 hover:bg-red-600 text-white font-medium"
                  >
                    <Check className="mr-1 h-4 w-4" /> Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SackBar;
