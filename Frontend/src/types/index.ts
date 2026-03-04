export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'apartment' | 'house' | 'condo' | 'studio';
  images: string[];
  amenities: string[];
  available: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'admin';
  avatar?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
