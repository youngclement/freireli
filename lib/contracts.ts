import logisticsAbi from "../logistics-abi.json";
import { config } from "./config";

// Contract address từ environment variables
export const LOGISTICS_CONTRACT_ADDRESS = config.contract.logisticsAddress;

export const LOGISTICS_ABI = logisticsAbi;

// Enum cho Status - theo thứ tự trong smart contract
export enum StatusEnum {
  Created = 0,
  InTransit = 1,
  Delivered = 2,
  Cancelled = 3,
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
}

// Types cho Shipment Event
export interface ShipmentEvent {
  location: string;
  eventType: string;
  timestamp: bigint;
  updatedBy: string;
}

// Form types
export interface CreateShipmentForm {
  shipmentCode: string;
  productName: string;
  origin: string;
  destination: string;
  carrier: string;
}

export interface AddEventForm {
  shipmentCode: string;
  location: string;
  eventType: string;
}

export interface UpdateStatusForm {
  shipmentCode: string;
  newStatus: StatusEnum;
}
