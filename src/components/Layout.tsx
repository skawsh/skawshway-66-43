
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, ShoppingBag, ClipboardList } from 'lucide-react';
import SackBar from './SackBar';

type LayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Check if current path is a studio profile page
  const isStudioProfilePage = location.pathname.includes('/studio/');
  // Check if current path is the cart page
  const isCartPage = location.pathname === '/cart';
  // Check if current path is the profile page
  const isProfilePage = location.pathname === '/profile';
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and not at the top
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const shouldShowBottomNav = !isStudioProfilePage && !isCartPage && !hideFooter;
  
  // Only show SackBar on pages other than studio profile, profile, and cart
  const shouldShowSackBar = !isStudioProfilePage && !isProfilePage && !isCartPage && !hideFooter;

  return (
    <div className="min-h-screen flex flex-col pb-16 overflow-hidden bg-primary-50">
      <main className="flex-1 page-transition-enter bg-white">
        {children}
      </main>
      
      {shouldShowSackBar && <SackBar isVisible={isVisible} />}
      
      {shouldShowBottomNav && (
        <nav className={`fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-lg glass z-40 transition-all duration-500 ease-in-out transform ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
            <NavItem 
              to="/" 
              icon={<Home size={22} />} 
              label="Skawsh" 
              isActive={isActive("/")}
            />
            <NavItem 
              to="/services" 
              icon={<Layers size={22} />} 
              label="Services" 
              isActive={isActive("/services")}
            />
            <NavItem 
              to="/orders" 
              icon={<ClipboardList size={22} />} 
              label="Orders" 
              isActive={isActive("/orders")}
            />
            <NavItem 
              to="/cart" 
              icon={<ShoppingBag size={22} />} 
              label="Sack" 
              isActive={isActive("/cart")}
            />
          </div>
        </nav>
      )}
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
        isActive 
          ? 'text-primary-500' 
          : 'text-gray-500 hover:text-primary-400'
      }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <div 
        className={`${isActive ? 'scale-110 mb-1' : 'mb-1'} transition-transform duration-200 ${
          isPressed ? 'scale-75' : ''
        }`}
      >
        {icon}
      </div>
      <span className={`text-xs font-bold transition-all ${
        isActive ? 'opacity-100' : 'opacity-80'
      } ${isPressed ? 'scale-95' : ''}`}>
        {label}
      </span>
    </Link>
  );
};

export default Layout;
