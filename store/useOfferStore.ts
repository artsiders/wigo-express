import { create } from "zustand";

export interface OfferOptions {
  max2InBack: boolean;
  autoAccept: boolean;
  petFriendly: boolean;
}

interface OfferState {
  departure: string;
  arrival: string;
  date: string | null; // ISO string to keep it serializable
  time: string;
  seats: number;
  options: OfferOptions;
  price: number;

  // Actions
  setRoute: (departure: string, arrival: string) => void;
  setDateTime: (date: string | null, time: string) => void;
  setSeatsAndOptions: (seats: number, options: Partial<OfferOptions>) => void;
  setPrice: (price: number) => void;
  resetOffer: () => void;
}

const initialState = {
  departure: "",
  arrival: "",
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
  
  setRoute: (departure, arrival) => set({ departure, arrival }),
  
  setDateTime: (date, time) => set({ date, time }),
  
  setSeatsAndOptions: (seats, options) => 
    set((state) => ({ 
      seats, 
      options: { ...state.options, ...options } 
    })),
    
  setPrice: (price) => set({ price }),
  
  resetOffer: () => set(initialState),
}));
