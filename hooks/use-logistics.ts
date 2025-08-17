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

// Hook để tạo shipment mới với escrow deposit
export function useCreateShipment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createShipment = (
    shipmentCode: string,
    productName: string,
    origin: string,
    destination: string,
    carrier: string,
    depositAmount?: string // Số Ether để deposit (dạng string, ví dụ: "0.2")
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
      value: depositAmount ? parseEther(depositAmount) : undefined,
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

  const updateStatus = (
    shipmentCode: string,
    newStatus: StatusEnum,
    note?: string
  ) => {
    writeContract({
      address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOGISTICS_ABI,
      functionName: "updateShipmentStatus",
      args: [shipmentCode, newStatus, note || ""],
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

// Hook để đánh giá carrier
export function useRateCarrier() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const rateCarrier = (
    shipmentCode: string,
    rating: number,
    feedback: string
  ) => {
    writeContract({
      address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOGISTICS_ABI,
      functionName: "rateCarrier",
      args: [shipmentCode, rating, feedback],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    rateCarrier,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để lấy thông tin đánh giá carrier
export function useGetCarrierRating(carrierAddress?: string) {
  return useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "getCarrierAverageRating",
    args: carrierAddress ? [carrierAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!carrierAddress,
    },
  });
}

// Hook để lấy thống kê carrier
export function useGetCarrierStats(carrierAddress?: string) {
  return useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "carrierStats",
    args: carrierAddress ? [carrierAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!carrierAddress,
    },
  });
}

// Hook để lấy lịch sử thay đổi status
export function useGetStatusHistory(shipmentCode?: string) {
  return useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "getStatusHistory",
    args: shipmentCode ? [shipmentCode] : undefined,
    query: {
      enabled: !!shipmentCode,
    },
  });
}

// Hook để kiểm tra xem escrow đã được release chưa
export function useIsEscrowReleased(shipmentCode?: string) {
  const { data: shipment } = useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "getShipment",
    args: shipmentCode ? [shipmentCode] : undefined,
    query: {
      enabled: !!shipmentCode,
    },
  });

  const shipmentData = shipment as Shipment | undefined;
  
  return {
    isReleased: shipmentData?.escrowReleased || false,
    isRefunded: shipmentData?.escrowRefunded || false,
    depositAmount: shipmentData?.depositAmount || BigInt(0),
  };
}
