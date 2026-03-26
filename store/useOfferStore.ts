import { create } from "zustand";

export interface OfferOptions {
  max2InBack: boolean;
  autoAccept: boolean;
  petFriendly: boolean;
}

interface OfferState {
  departure: string;
  arrival: string;
  departCoords: { lat: number; lon: number } | null;
  arriveeCoords: { lat: number; lon: number } | null;
  date: string | null; // ISO string to keep it serializable
  time: string;
  seats: number;
  options: OfferOptions;
  price: number;

  // Actions
  setRoute: (
    departure: string, 
    arrival: string, 
    departCoords?: { lat: number; lon: number } | null, 
    arriveeCoords?: { lat: number; lon: number } | null
  ) => void;
  setDateTime: (date: string | null, time: string) => void;
  setSeatsAndOptions: (seats: number, options: Partial<OfferOptions>) => void;
  setPrice: (price: number) => void;
  resetOffer: () => void;
}

const initialState = {
  departure: "",
  arrival: "",
  departCoords: null,
  arriveeCoords: null,
  date: null,
  time: "08:00",
  seats: 3,
  options: {
    max2InBack: false,
    autoAccept: true,
    petFriendly: false,
  },
  price: 15, // Prix suggéré par défaut (à dynamiser idéalement)
};

export const useOfferStore = create<OfferState>((set) => ({
  ...initialState,
  
  setRoute: (departure, arrival, departCoords = null, arriveeCoords = null) => 
    set({ departure, arrival, departCoords, arriveeCoords }),
  
  setDateTime: (date, time) => set({ date, time }),
  
  setSeatsAndOptions: (seats, options) => 
    set((state) => ({ 
      seats, 
      options: { ...state.options, ...options } 
    })),
    
  setPrice: (price) => set({ price }),
  
  resetOffer: () => set(initialState),
}));
