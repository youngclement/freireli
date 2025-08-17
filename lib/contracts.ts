import logisticsAbi from "../logistics-abi.json";
import { config } from "./config";

// Contract address từ environment variables
export const LOGISTICS_CONTRACT_ADDRESS = config.contract.logisticsAddress;

export const LOGISTICS_ABI = logisticsAbi;

// Enum cho Status - theo thứ tự trong smart contract
export enum StatusEnum {
  Pending = 0,
  InTransit = 1,
  Delivered = 2,
  Canceled = 3,
}

// Types cho Shipment
export interface Shipment {
  shipmentCode: string;
  productName: string;
  origin: string;
  destination: string;
  currentStatus: StatusEnum;
  creator: string;
  carrier: string;
  createdAt: bigint;
  depositAmount: bigint;
  escrowReleased: boolean;
  escrowRefunded: boolean;
  rated: boolean;
  rating: number;
  feedback: string;
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

// Form types
export interface CreateShipmentForm {
  shipmentCode: string;
  productName: string;
  origin: string;
  destination: string;
  carrier: string;
  depositAmount?: string; // Số Ether để deposit (optional)
}

export interface AddEventForm {
  shipmentCode: string;
  location: string;
  eventType: string;
}

export interface UpdateStatusForm {
  shipmentCode: string;
  newStatus: StatusEnum;
  note?: string;
}

export interface RateCarrierForm {
  shipmentCode: string;
  rating: number;
  feedback: string;
}

export interface UpdateStatusForm {
  shipmentCode: string;
  newStatus: StatusEnum;
}
