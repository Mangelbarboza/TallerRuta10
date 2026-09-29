export interface Employee {
  idEmployee?: number;
  name: string;
  phoneNumber: string;
  email: string;
  position: string;
  idBranch: number;
  isActive: boolean;
}

export interface Branch {
  idBranch?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  isActive: boolean;
}

export type Service = {
  idService?: number;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  idOffer?: number | null;
  discount?: number | null;
  basePriceDisplay?: string;
  discountedPriceDisplay?: string | null;
  branchesDisplay?: string;
  offerDisplay?: string;
};

export type Client = {
  idClient?: number;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  withAppointment: boolean;
  isActive?: boolean;
};

export interface Appointment {
  idAppointment?: number;
  date: string;
  time: string;
  status: string;
  observations: string;
  vehiclePlate: string;
  vehicleBrand: string;
  idBranch: number;
  idClient: number;
  isActive: boolean;

  client?: Client;
  branch?: Branch;
  services?: Service[];
}

export interface Product {
  idProduct?: number;
  name: string;
  description: string;
  salePrice: number;
  idSupplier: number;
  isActive?: boolean;
  image?: string;
  salePriceDisplay?: string;
  supplierDisplay?: string;
  branchesDisplay?: string;
  idOffer?: number | null;
  offerDisplay?: string;
  discount?: number | null;
  discountedPriceDisplay?: string | null;
  imageUrl?: string;
  branches?: {
    idBranch: number;
    stock: number;
  }[];
}

export interface SelectedBranch {
  idBranch: number;
  stock: number;
}
export interface Supplier {
  idSupplier: number;
  name: string;
  isActive?: boolean;
}
export interface Offer {
  idOffer?: number;
  startDate: string;
  endDate: string;
  discount: number;
  isActive: boolean;
  productIds: number[];

  products?: {
    idProduct: number;
    name: string;
  }[];
}