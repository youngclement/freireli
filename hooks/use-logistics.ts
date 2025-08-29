import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, parseGwei } from "viem";
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
    deadline: number, // Timestamp cho deadline
    depositAmount?: string // Số Ether để deposit (dạng string, ví dụ: "0.2")
  ) => {
    const depositWei = depositAmount ? parseEther(depositAmount) : BigInt(0);

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
        BigInt(deadline),
        depositWei,
      ],
      value: depositAmount ? parseEther(depositAmount) : undefined,
      // Cấu hình gas đúng cách cho Kairos testnet
      gas: BigInt(250000), // Gas limit hợp lý
      maxFeePerGas: parseGwei("6"),
      maxPriorityFeePerGas: parseGwei("1.5"),
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
    console.log(`Adding event: ${shipmentCode}, ${location}, ${eventType}`);
    writeContract({
      address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOGISTICS_ABI,
      functionName: "addShipmentEvent",
      args: [shipmentCode, location, eventType],
      // Cấu hình gas đúng cách cho Kairos testnet
      gas: BigInt(250000), // Gas limit hợp lý
      maxFeePerGas: parseGwei("6"),
      maxPriorityFeePerGas: parseGwei("1.5"),
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

  const updateStatus = async (
    shipmentCode: string,
    newStatus: StatusEnum,
    note?: string
  ) => {
    try {
      // Kiểm tra xem shipment có tồn tại không trước khi cập nhật
      console.log(
        `Đang cập nhật shipment ${shipmentCode} sang trạng thái ${newStatus} với ghi chú: ${
          note || ""
        }`
      );

      await writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "updateShipmentStatus",
        args: [shipmentCode, newStatus, note || ""],
        // Cấu hình gas đúng cách cho Kairos testnet
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      throw err; // Re-throw để component có thể xử lý
    }
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
      // Cấu hình gas đúng cách cho Kairos testnet
      gas: BigInt(250000), // Gas limit hợp lý
      maxFeePerGas: parseGwei("6"),
      maxPriorityFeePerGas: parseGwei("1.5"),
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
    isReleased: shipmentData?.escrowState === 1, // EscrowState.Released
    isRefunded: shipmentData?.escrowState === 2, // EscrowState.Refunded
    depositAmount: shipmentData?.depositAmount || BigInt(0),
  };
}
