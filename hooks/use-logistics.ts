import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import {
  LOGISTICS_CONTRACT_ADDRESS,
  LOGISTICS_ABI,
  StatusEnum,
  Shipment,
  ShipmentEvent,
} from "../lib/contracts";

// Hook để tạo shipment mới
export function useCreateShipment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createShipment = (
    shipmentCode: string,
    productName: string,
    origin: string,
    destination: string,
    carrier: string
  ) => {
    writeContract({
      address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOGISTICS_ABI,
      functionName: "createShipment",
      args: [
        shipmentCode,
        productName,
        origin,
        destination,
        carrier as `0x${string}`,
      ],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    createShipment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để lấy thông tin shipment
export function useGetShipment(shipmentCode: string) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "getShipment",
    args: [shipmentCode],
    query: {
      enabled: !!shipmentCode,
    },
  });

  return {
    shipment: data as Shipment | undefined,
    isError,
    isLoading,
    refetch,
  };
}

// Hook để lấy events của shipment
export function useGetShipmentEvents(shipmentCode: string) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "getShipmentEvents",
    args: [shipmentCode],
    query: {
      enabled: !!shipmentCode,
    },
  });

  return {
    events: data as ShipmentEvent[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

// Hook để thêm event vào shipment
export function useAddShipmentEvent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const addEvent = (
    shipmentCode: string,
    location: string,
    eventType: string
  ) => {
    writeContract({
      address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOGISTICS_ABI,
      functionName: "addShipmentEvent",
      args: [shipmentCode, location, eventType],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    addEvent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để cập nhật status của shipment
export function useUpdateShipmentStatus() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const updateStatus = (shipmentCode: string, newStatus: StatusEnum) => {
    writeContract({
      address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOGISTICS_ABI,
      functionName: "updateShipmentStatus",
      args: [shipmentCode, newStatus],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    updateStatus,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
