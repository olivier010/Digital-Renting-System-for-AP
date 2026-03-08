export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: 'house' | 'apartment' | 'car' | 'land' | 'commercial' | 'other';
  images: string[];
  available: boolean;
  bookings: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive';
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
