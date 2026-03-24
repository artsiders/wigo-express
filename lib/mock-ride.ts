export interface LocationInfo {
  city: string;
  address: string;
  description: string;
  time: string;
  date: string;
}

export interface AmenityInfo {
  luggage: boolean;
  pet: boolean;
  smoking: boolean;
  winterTire: boolean;
  max2Back: boolean;
  instantBooking: boolean;
}

export interface DriverInfo {
  name: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  verifiedItems: string[];
}

export interface CarInfo {
  make: string;
  model: string;
  type: string;
  year: string;
  color: string;
  photo?: string;
}

export interface MockRideDetails {
  id: string;
  departure: LocationInfo;
  arrival: LocationInfo;
  stops: LocationInfo[];
  price: number;
  currency: string;
  bookingFee: number;
  amenities: AmenityInfo;
  driver: DriverInfo;
  car: CarInfo;
  policy: {
    description: string;
  };
}

export const mockRidesDetails: Record<string, MockRideDetails> = {
  r1: {
    id: "r1",
    departure: {
      city: "Montréal, QC",
      time: "08:00 AM",
      date: "Mardi le 24 mars",
      address: "Station Berri-UQAM",
      description: "À la sortie de la station de métro, côté place Émilie-Gamelin.",
    },
    arrival: {
      city: "Québec, QC",
      time: "11:15 AM",
      date: "Mardi le 24 mars",
      address: "Gare du Palais",
      description: "Devant l'entrée principale de la gare.",
    },
    stops: [
      {
        city: "Trois-Rivières, QC",
        time: "09:30 AM",
        date: "Mardi le 24 mars",
        address: "Halte routière",
        description: "Petite pause café et toilettes.",
      }
    ],
    price: 45.0,
    currency: "$",
    bookingFee: 5.5,
    amenities: {
      luggage: true,
      pet: false,
      smoking: false,
      winterTire: true,
      max2Back: true,
      instantBooking: true,
    },
    driver: {
      name: "Alexandre Tremblay",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 4.9,
      reviewsCount: 124,
      isVerified: true,
      verifiedItems: ["Permis de conduire vérifié", "Numéro de téléphone", "Email"],
    },
    car: {
      make: "Toyota",
      model: "Camry",
      type: "Berline",
      year: "2021",
      color: "Gris",
      photo: "/images/wigo-express-red-card.jpg"
    },
    policy: {
      description: "Annulation gratuite jusqu'à 24h avant le départ. Passé ce délai, 50% du montant sera retenu en cas d'annulation de dernière minute ou d'absence. Merci de prendre connaissance des conditions d'utilisation."
    }
  },
  r2: {
    id: "r2",
    departure: {
      city: "Québec, QC",
      time: "06:15 AM",
      date: "Mardi le 24 mars",
      address: "Shell, Boul. Laurier (Sainte-Foy)",
      description: "Station service Shell situé au coin du boulevard Laurier et de la route de l'Église.",
    },
    arrival: {
      city: "Trois-Rivières, QC",
      time: "08:00 AM",
      date: "Mardi le 24 mars",
      address: "UQTR - Cubes",
      description: "Devant l'entrée de l'université qui donne sur l'avenue Gilles-Boulet.",
    },
    stops: [],
    price: 19.0,
    currency: "$",
    bookingFee: 5.5,
    amenities: {
      luggage: true,
      pet: false,
      smoking: false,
      winterTire: false,
      max2Back: true,
      instantBooking: false,
    },
    driver: {
      name: "Sophie Laurent",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      rating: 5.0,
      reviewsCount: 89,
      isVerified: true,
      verifiedItems: ["Permis de conduire vérifié", "Pièce d'identité"],
    },
    car: {
      make: "Inconnue",
      model: "Inconnu",
      type: "Voiture de location",
      year: "Année inconnue",
      color: "Inconnue",
      photo: "/images/wigo-express-red-card.jpg"
    },
    policy: {
      description: "Merci de prendre connaissance des conditions d'utilisation."
    }
  }
};
