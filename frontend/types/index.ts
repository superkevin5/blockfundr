import React, {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface User {
  id?: number;
  name?: string;
  username?: string;
  userId?: string;
  role?: string;
}

export interface Unit {
  id?: number;
  name?: string;
}

export interface Product {
  id?: number;
  name?: string;
  internalId?: string;
  unitId?: number;
  changedByUser?: number;
  updatedAt?: string;
}

export interface Inventory {
  id?: number;
  comment?: string;
  productId?: number;
  balance?: number;
  changedByUser?: number;
  updatedAt?: string;
}


export interface ProcurementOrder {
  id?: number;
  purchaseDate?: string;
  contractNumber?: string;
  sourceCompany?: string;
  procuredByUser?: number;
  status?: string;
  submitAt?: string;
  comment?: string;
  totalPrice?: number;
  approvedByUser?: number;
  createdAt?: string;
  updatedAt?: string;
  addingProductEntrys?: any
}


export interface InboundInventoryOrder {
  id?: number;
  status?: string;
  inboundByUser?: number;
  submitAt?: string;
  comment?: string;
  approvedByUser?: number;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  addingProductEntries?: any;
  isFromProcurement?: Boolean
}



// Define the type for the authentication context
export interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export interface SideBarProps {
  className?: string;
  handleMenuItemClick: (menuType:string) => void;
  // other props...
}

export interface UserManagementPageProps {
  users: User[];
  loading: boolean;
  error: string | null;
  saveUser: (input: UserInput)=>{}
}

export interface ProductPageProps {
  products: Product[];
  units?: Unit[];
  loading: boolean;
  error: string | null;
  saveProduct: (input: Product)=>{}
}

export interface InventoryPageProps {
  inventories: Inventory[];
  products?: Product[];
  loading: boolean;
  error: string | null;
  saveInventory: (input: Inventory)=>{}
}

export interface ProcurementPageProps {
  procurementOrders: ProcurementOrder[];
  loading: boolean;
  error: string | null;
  saveProcurementOrder: (procurementOrder: ProcurementOrder, status: string) => void;
}



export interface UserInput {
  username: string;
  password?: string;
  role?: string;
  name: string;
  id?: number
}


export interface CreateUserInput {
  user: UserInput
}


export interface UpdateUserInput {
  user: UserInput
}


export interface UserModalProps {
  isOpen: boolean;
  onClose?: () => void;
  saveUser: (user: UserInput, isUpdate: Boolean) => void;
  onOpenChange: ()=>void
  selectedUser?: User
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose?: () => void;
  saveProduct: (product: Product, isUpdate: Boolean) => void;
  onOpenChange: ()=>void
  selectedProduct?: Product;
  units?: any
}


export interface InventoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  saveInventory: (inventory: Inventory, isUpdate: Boolean) => void;
  onOpenChange: ()=>void
  selectedInventory?: Inventory;
  products?: any
}


export interface ProcurementOrderModalProps {
  isOpen: boolean;
  onClose?: () => void;
  saveProcurementOrder: (procurementOrder: ProcurementOrder, status: string) => void;
  onOpenChange: ()=>void
  selectedProcurementOrder?: ProcurementOrder;
  procurementOrders?: any
}


export interface ProcurementOrderProductStatus {
  productId: number;
  balance: number;
  productName: string;
  unitName: string;
  requiredNumber: number;
  approvedNumber: number;
  submittedNumber: number;
  remainingNumber: number;
}

export interface ProcurementOrderInBoundStatusProps {
  procurementOrderId: number;
}


export interface OutboundInventoryOrder {
  id: number;
  outboundType: string;
  outboundByUser: number;
  submitAt: string; // or Date if you prefer
  comment: string;
  status: string;
  approvedByUser: number;
  approvedAt: string; // or Date if you prefer
  createdAt: string; // or Date if you prefer
  updatedAt: string; // or Date if you prefer
}


export const WEB3_LOADED = "WEB3_LOADED";
export const WALLET_ADDRESS_LOADED = "WALLET_ADDRESS_LOADED";

export const USER_LOADED = "USER_LOADED";


export const CROWD_FUNDING_CONTRACT_LOADED = "CROWD_FUNDING_CONTRACT_LOADED";

// Project
export const PROJECT_CONTRACTS_LOADED = "PROJECT_CONTRACTS_LOADED";
export const PROJECTS_LOADED = "PROJECTS_LOADED";
export const NEW_PROJECT_CONTRACT_LOADED = "NEW_PROJECT_CONTRACT_LOADED";
export const NEW_PROJECT_LOADED = "NEW_PROJECT_LOADED";
export const INCREASE_PROGRESS = "INCREASE_PROGRESS";
export const WITHDRAW_BALANCE = "WITHDRAW_BALANCE";
