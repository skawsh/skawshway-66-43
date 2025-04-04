
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent 
} from '@/components/ui/dropdown-menu';
import { Order } from '@/types/order';

interface OrderCardHeaderProps {
  order: Order;
  dropdownMenuContent: React.ReactNode;
}

const OrderCardHeader: React.FC<OrderCardHeaderProps> = ({ order, dropdownMenuContent }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-bold">{order.studioName}</h3>
        <p className="text-sm text-gray-500">Order #{order.id.substring(0, 8)}</p>
        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()} • {order.status.replace('_', ' ')}
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        
        {dropdownMenuContent}
      </DropdownMenu>
    </div>
  );
};

export default OrderCardHeader;
