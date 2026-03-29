import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// types
export interface TripProvider {
  id: string;
  driverId: string;
  vehicleId: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: string;
  departurePlace: string | null;
  arrivalPlace: string | null;
  duration: string | null;
  instantBooking: boolean;
  max2Back: boolean;
  luggage: boolean;
  smoking: boolean;
  pet: boolean;
  createdAt: string;
  driver: {
    id: string;
    name: string | null;
    image: string | null;
    rating: number;
    reviewsCount: number;
    idVerified: boolean;
    bio?: string | null;
    createdAt?: string;
    totalRides?: number;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string | null;
    photo: string | null;
    features: string[];
  };
}

export interface BookingProvider {
  id: string;
  tripId: string;
  passengerId: string;
  bookedSeats: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  trip: TripProvider;
}

export interface MyTripsResponse {
  published: TripProvider[];
  booked: BookingProvider[];
}

// 1. Hook pour les trajets de l'utilisateur
export const useMyTrajets = () => {
  return useQuery({
    queryKey: ['my-trips'],
    queryFn: async (): Promise<MyTripsResponse> => {
      const response = await axios.get('/api/trips/me');
      return response.data;
    },
    retry: 1,
  });
};

// 2. Hook pour la recherche de trajets
export interface SearchTripsFilters {
  depart?: string;
  arrivee?: string;
  date?: string;
}

export const useSearchTrips = (filters: SearchTripsFilters) => {
  return useQuery({
    queryKey: ['search-trips', filters],
    queryFn: async (): Promise<TripProvider[]> => {
      const { depart, arrivee, date } = filters;
      let query = '';
      const params = new URLSearchParams();
      if (depart) params.append('depart', depart);
      if (arrivee) params.append('arrivee', arrivee);
      if (date) params.append('date', date);
      
      const queryString = params.toString();
      const response = await axios.get(`/api/trips${queryString ? `?${queryString}` : ''}`);
      return response.data;
    },
    retry: 1,
  });
};

// 3. Hook pour le détail d'un trajet
export const useTripDetails = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['trip-details', id],
    queryFn: async (): Promise<TripProvider> => {
      const response = await axios.get(`/api/trips/${id}`);
      return response.data;
    },
    enabled: !!id && enabled,
    retry: 1,
  });
};

// 4. Hook pour les suggestions
export const useTripSuggestions = (filters: SearchTripsFilters, enabled: boolean) => {
  return useQuery({
    queryKey: ['trip-suggestions', filters],
    queryFn: async (): Promise<TripProvider[]> => {
      const { depart, arrivee } = filters;
      const params = new URLSearchParams();
      if (depart) params.append('depart', depart);
      if (arrivee) params.append('arrivee', arrivee);
      
      const response = await axios.get(`/api/trips/suggestions?${params.toString()}`);
      return response.data;
    },
    enabled: enabled, // Let's simplify and control enablement from the component
    retry: 1,
  });
};
