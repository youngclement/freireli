import logisticsAbi from "../logistics-abi.json";
import { config } from "./config";

// Contract address từ environment variables
export const LOGISTICS_CONTRACT_ADDRESS = config.contract.logisticsAddress;

export const LOGISTICS_ABI = logisticsAbi;

export enum StatusEnum {
  Pending = 0,
  WarehouseConfirmed = 1, 
  QualityApproved = 2,
  InTransit = 3,
  Delivered = 4,
  Completed = 5,
  Disputed = 6,
  Canceled = 7,
}

// Enum cho confirmation types
export enum ConfirmationType {
  WarehouseReceived = 0,
  QualityInspected = 1,
  DeliveryConfirmed = 2,
}

// Types cho Shipment (based on new ABI)
export interface Shipment {
  shipmentCode: string;
  productName: string;
  origin: string;
  destination: string;
  currentStatus: StatusEnum;
  creator: string;
  carrier: string;
  warehouseManager: string;
  qualityInspector: string;
  createdAt: bigint;
  depositAmount: bigint;
  shippingFee: bigint;
  flags: number;
  rating: number;
  feedback: string;
  disputeReason: string;
}

// Types cho Shipment Event
export interface ShipmentEvent {
  location: string;
  eventType: string;
  timestamp: bigint;
  updatedBy: string;
}

// Types cho Status History
export interface StatusChange {
  oldStatus: StatusEnum;
  newStatus: StatusEnum;
  timestamp: bigint;
  changedBy: string;
  note: string;
}

// Types cho Carrier Stats
export interface CarrierStats {
  totalRatingPoints: bigint;
  ratingCount: bigint;
}

// Additional utility types for the new contract functions
export interface ShipmentSummary {
  code: string;
  status: StatusEnum;
  rating: number;
  hasDispute: boolean;
  isCompleted: boolean;
}

export interface ContractPermissions {
  isAdmin: boolean;
  isAuthorizedInspector: boolean;
  isAuthorizedWarehouseManager: boolean;
}

export interface DisputeInfo {
  hasDispute: boolean;
  disputeReason: string;
  canResolve: boolean;
}

// Form types for the new contract functions
export interface CreateShipmentForm {
  shipmentCode: string;
  productName: string;
  origin: string;
  destination: string;
  carrier: string;
  shippingFee: string; // Wei amount for shipping fee
}

export interface UpdateShipmentForm {
  shipmentCode: string;
  location: string;
  newStatus: StatusEnum;
}

export interface RateOrDisputeForm {
  shipmentCode: string;
  rating: number;
  feedback: string;
  isDispute: boolean;
}

export interface SetActorsForm {
  shipmentCode: string;
  manager: string;
  inspector: string;
}

export interface ConfirmForm {
  shipmentCode: string;
  isWarehouse: boolean;
}
