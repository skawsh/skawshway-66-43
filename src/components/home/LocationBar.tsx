
import React from 'react';
import { MapPin, ChevronDown, User } from 'lucide-react';

const LocationBar: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-1.5 mb-2 pl-1">
        <div className="text-xl font-semibold text-primary-500 flex items-center">
          <span className="mr-1">Home</span>
          <ChevronDown size={18} className="text-gray-500" />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 pl-1">
          <span className="truncate">Room No: 306, Vathsalya Men's PG</span>
        </div>
      </div>
    </div>
  );
};

export default LocationBar;
