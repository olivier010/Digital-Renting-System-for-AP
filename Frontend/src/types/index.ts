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
  isVerified?: boolean;
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
  id: number;
  property: {
    id: number;
    title: string;
    location: string;
    category: string;
    price: number;
    image: string;
    ownerId: number;
    ownerName: string;
  };
  renter: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancellationPolicy?: string;
  createdAt: string;
  updatedAt: string;
  reviewed: boolean;
}
