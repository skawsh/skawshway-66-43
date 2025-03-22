import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import StudioHeader from '../components/studio/StudioHeader';
import ServiceList from '../components/studio/ServiceList';
import SackFooter from '../components/studio/SackFooter';
import { ShoppingBag, ChevronLeft, MoreVertical, Share, Info, Flag } from 'lucide-react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Helper function to format currency in Indian Rupee format
export const formatIndianRupee = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(amount).replace('₹', '₹');
};

const StudioProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isScrolled, setIsScrolled] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  // Use console log to debug the route params
  console.log("Studio ID from URL:", id);
  console.log("Order ID from URL params:", orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if we're editing an order
    if (orderId) {
      setIsEditingOrder(true);
      
      // Clear existing cart items before loading the order
      localStorage.removeItem('cartItems');
      document.dispatchEvent(new Event('cartUpdated'));
      
      // Load the order details and set them in the cart
      // This is a mock implementation - in a real app, you'd fetch from API
      const orders = JSON.parse(sessionStorage.getItem('orders') || '[]');
      const orderToEdit = orders.find((order: any) => order.id === orderId);
      
      if (orderToEdit && orderToEdit.items) {
        // Convert order items to cart items format
        const cartItems = orderToEdit.items.map((item: any) => ({
          serviceId: item.serviceId || Math.random().toString(36).substring(7),
          serviceName: item.serviceName || 'Service',
          studioId: id,
          price: item.price || 0,
          quantity: item.quantity || 1
        }));
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        document.dispatchEvent(new Event('cartUpdated'));
        
        // Show toast to inform user they're editing an order
        toast({
          title: "Editing Order",
          description: `You're now editing order #${orderId.substring(0, 8)}`,
          duration: 3000,
        });
      }
    }
  }, [location, orderId, id]);

  useEffect(() => {
    const handleScroll = () => {
      if (backButtonRef.current) {
        const backButtonPosition = backButtonRef.current.getBoundingClientRect().top;
        setIsScrolled(backButtonPosition < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load initial cart count on mount and count unique services
  useEffect(() => {
    const countUniqueServices = () => {
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        try {
          const parsedItems = JSON.parse(storedCartItems);
          const studioSpecificItems = parsedItems.filter((item: any) => !studio.id || item.studioId === studio.id);
          
          // Count unique services by serviceId
          const uniqueServices = new Set();
          studioSpecificItems.forEach((item: any) => {
            if (item.serviceId) {
              uniqueServices.add(item.serviceId);
            }
          });
          
          setCartCount(uniqueServices.size);
        } catch (error) {
          console.error('Error parsing cart items:', error);
        }
      }
    };
    
    countUniqueServices();
    
    // Listen for cart updates
    document.addEventListener('cartUpdated', countUniqueServices);
    
    return () => {
      document.removeEventListener('cartUpdated', countUniqueServices);
    };
  }, []);

  const handleBackClick = () => {
    // If editing an order, go back to orders page
    if (isEditingOrder) {
      navigate('/orders');
      return;
    }
    
    navigate('/');
  };

  const handleShareStudio = () => {
    if (navigator.share) {
      navigator.share({
        title: studio.name,
        text: `Check out ${studio.name}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Studio link copied to clipboard"
      });
    }
  };

  const handleAboutStudio = () => {
    navigate(`/studio/${id}/about`);
  };

  const handleReportStudio = () => {
    toast({
      title: "Thank you for your feedback",
      description: `${studio.name} has been reported`,
    });
  };
  
  const handleCartUpdate = (count: number) => {
    setCartCount(count);
  };

  // This would normally come from an API using the ID from the URL
  // For now, we'll use hardcoded data but acknowledge that the ID exists
  const studio = {
    id: id || '1',
    name: 'Busy Bee',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    reviewCount: 126,
    deliveryTime: '1-2 days',
    description: 'Premium laundry services with eco-friendly cleaning options.'
  };

  const services = [
    {
      id: '1',
      name: 'Dry Cleaning',
      description: 'Professional cleaning for delicate fabrics and special care items.',
      price: 8.99,
      unit: 'per piece'
    },
    {
      id: '2',
      name: 'Wash & Fold',
      description: 'Complete laundry service charged by weight.',
      price: 2.49,
      unit: 'per kg'
    },
    {
      id: '3',
      name: 'Ironing',
      description: 'Professional pressing and wrinkle removal.',
      price: 4.99,
      unit: 'per piece'
    },
    {
      id: '4',
      name: 'Express Service',
      description: 'Same-day service when ordered before 10 AM.',
      price: 12.99,
      unit: 'per kg'
    },
    {
      id: '5',
      name: 'Carpet Cleaning',
      description: 'Deep cleaning for carpets and rugs.',
      price: 3.49,
      unit: 'per sft'
    }
  ];

  return (
    <Layout hideFooter={cartCount > 0}>
      <div className="no-scrollbar bg-gray-50/50">
        {isScrolled && (
          <div className="fixed top-0 left-0 right-0 bg-white z-40 shadow-md animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <button onClick={handleBackClick} className="mr-3 p-1.5 rounded-full text-gray-700 bg-gray-100/70 hover:bg-gray-200/80 transition-all">
                  <ChevronLeft size={22} />
                </button>
                <h2 className="text-lg font-semibold truncate">
                  {isEditingOrder ? 'Edit Order' : studio.name}
                  {isEditingOrder && (
                    <span className="ml-2 text-sm text-blue-600">
                      #{orderId?.substring(0, 8)}
                    </span>
                  )}
                </h2>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 bg-gray-100/70">
                    <MoreVertical size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={handleShareStudio} className="flex items-center gap-2">
                    <Share size={16} />
                    <span>Share Studio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAboutStudio} className="flex items-center gap-2">
                    <Info size={16} />
                    <span>About Studio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleReportStudio} className="flex items-center gap-2 text-red-500">
                    <Flag size={16} />
                    <span>Report this Studio</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        
        <StudioHeader 
          name={isEditingOrder ? `Edit Order #${orderId?.substring(0, 8)}` : studio.name} 
          image={studio.image} 
          rating={studio.rating} 
          reviewCount={studio.reviewCount} 
          deliveryTime={studio.deliveryTime} 
          backButtonRef={backButtonRef} 
          description={isEditingOrder ? 'Edit your order details below' : studio.description} 
          onBackClick={handleBackClick} 
        />
        
        <div className="section-container relative pb-20">
          <ServiceList 
            services={services} 
            isScrolled={isScrolled} 
            onCartUpdate={handleCartUpdate} 
            studioId={studio.id}
          />
        </div>

        {/* Sack Footer */}
        <SackFooter 
          itemCount={cartCount} 
          studioId={studio.id} 
        />
      </div>
    </Layout>
  );
};

export default StudioProfile;
