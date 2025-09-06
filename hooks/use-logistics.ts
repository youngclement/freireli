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
  StatusChange,
  CarrierStats,
} from "../lib/contracts";

// Hook để tạo shipment mới
export function useCreateShipment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createShipment = (
    shipmentCode: string,
    productName: string,
    origin: string,
    destination: string,
    carrier: string,
    shippingFee: string
  ) => {
    const shippingFeeWei = parseEther(shippingFee);

    console.log(`Creating shipment with code: ${shipmentCode}`);
    console.log(`Shipping fee: ${shippingFeeWei.toString()}`);

    try {
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
          shippingFeeWei,
        ],
        value: shippingFeeWei, // Send the shipping fee as payment
        gas: BigInt(500000),
      });
    } catch (error) {
      console.error("Error in createShipment:", error);
      throw error;
    }
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

// Hook để cập nhật shipment với location và status mới
export function useUpdateShipment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const updateShipment = (
    shipmentCode: string,
    location: string,
    newStatus: StatusEnum
  ) => {
    console.log(`Updating shipment ${shipmentCode} to status ${newStatus} at ${location}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "updateShipment",
        args: [shipmentCode, location, newStatus],
        gas: BigInt(300000),
      });
    } catch (error) {
      console.error("Error in updateShipment:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    updateShipment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để start transit
export function useStartTransit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const startTransit = (shipmentCode: string) => {
    console.log(`Starting transit for shipment: ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "startTransit",
        args: [shipmentCode],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in startTransit:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    startTransit,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để warehouse confirm
export function useWarehouseConfirm() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const warehouseConfirm = (shipmentCode: string) => {
    console.log(`Warehouse confirming shipment: ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "warehouseConfirm",
        args: [shipmentCode],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in warehouseConfirm:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    warehouseConfirm,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để quality approve
export function useQualityApprove() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const qualityApprove = (shipmentCode: string) => {
    console.log(`Quality approving shipment: ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "qualityApprove",
        args: [shipmentCode],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in qualityApprove:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    qualityApprove,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để set warehouse manager riêng
export function useSetWarehouseManager() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const setWarehouseManager = (shipmentCode: string, manager: string) => {
    console.log(`Setting warehouse manager for shipment ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "setWarehouseManager",
        args: [shipmentCode, manager as `0x${string}`],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in setWarehouseManager:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    setWarehouseManager,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để set quality inspector riêng
export function useSetQualityInspector() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const setQualityInspector = (shipmentCode: string, inspector: string) => {
    console.log(`Setting quality inspector for shipment ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "setQualityInspector",
        args: [shipmentCode, inspector as `0x${string}`],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in setQualityInspector:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    setQualityInspector,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để cancel shipment (admin only)
export function useCancelShipment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const cancelShipment = (shipmentCode: string, reason: string) => {
    console.log(`Canceling shipment ${shipmentCode} with reason: ${reason}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "cancelShipment",
        args: [shipmentCode, reason],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in cancelShipment:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    cancelShipment,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để add shipment event chung
export function useAddShipmentEvent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const addShipmentEvent = (shipmentCode: string, location: string, eventType: string) => {
    console.log(`Adding event for shipment ${shipmentCode}: ${eventType} at ${location}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "addShipmentEvent",
        args: [shipmentCode, location, eventType],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in addShipmentEvent:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    addShipmentEvent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để add transit event (carrier only)
export function useAddTransitEvent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const addTransitEvent = (shipmentCode: string, location: string, note: string) => {
    console.log(`Adding transit event for shipment ${shipmentCode} at ${location}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "addTransitEvent",
        args: [shipmentCode, location, note],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in addTransitEvent:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    addTransitEvent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để add warehouse event
export function useAddWarehouseEvent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const addWarehouseEvent = (shipmentCode: string, eventType: string) => {
    console.log(`Adding warehouse event for shipment ${shipmentCode}: ${eventType}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "addWarehouseEvent",
        args: [shipmentCode, eventType],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in addWarehouseEvent:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    addWarehouseEvent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để add quality event
export function useAddQualityEvent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const addQualityEvent = (shipmentCode: string, eventType: string) => {
    console.log(`Adding quality event for shipment ${shipmentCode}: ${eventType}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "addQualityEvent",
        args: [shipmentCode, eventType],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in addQualityEvent:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    addQualityEvent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để update location (tất cả actors)
export function useUpdateLocation() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const updateLocation = (shipmentCode: string, location: string) => {
    console.log(`Updating location for shipment ${shipmentCode} to ${location}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "updateLocation",
        args: [shipmentCode, location],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in updateLocation:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    updateLocation,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để lấy full tracking info
export function useGetFullTrackingInfo(shipmentCode: string) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "getFullTrackingInfo",
    args: [shipmentCode],
    query: {
      enabled: !!shipmentCode,
    },
  });

  return {
    trackingInfo: data as Shipment | undefined,
    isError,
    isLoading,
    refetch,
  };
}

// Hook để confirm delivery
export function useConfirmDelivery() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const confirmDelivery = (shipmentCode: string) => {
    console.log(`Confirming delivery for shipment: ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "confirmDelivery",
        args: [shipmentCode],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in confirmDelivery:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    confirmDelivery,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để rate hoặc dispute
export function useRateOrDispute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const rateOrDispute = (
    shipmentCode: string,
    rating: number,
    feedback: string,
    isDispute: boolean
  ) => {
    console.log(`Rating/Disputing shipment ${shipmentCode}, rating: ${rating}, isDispute: ${isDispute}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "rateOrDispute",
        args: [shipmentCode, rating, feedback, isDispute],
        gas: BigInt(300000),
      });
    } catch (error) {
      console.error("Error in rateOrDispute:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    rateOrDispute,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để set actors (warehouse manager và quality inspector)
export function useSetActors() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const setActors = (
    shipmentCode: string,
    manager: string,
    inspector: string
  ) => {
    console.log(`Setting actors for shipment ${shipmentCode}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "setActors",
        args: [shipmentCode, manager as `0x${string}`, inspector as `0x${string}`],
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error("Error in setActors:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    setActors,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook để resolve dispute (admin only)
export function useResolveDispute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const resolveDispute = (shipmentCode: string, favorCreator: boolean) => {
    console.log(`Resolving dispute for shipment ${shipmentCode}, favor creator: ${favorCreator}`);

    try {
      writeContract({
        address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOGISTICS_ABI,
        functionName: "resolveDispute",
        args: [shipmentCode, favorCreator],
        gas: BigInt(300000),
      });
    } catch (error) {
      console.error("Error in resolveDispute:", error);
      throw error;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    resolveDispute,
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

// Hook để kiểm tra admin
export function useGetAdmin() {
  return useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "admin",
  });
}

// Hook để kiểm tra authorized inspectors
export function useIsAuthorizedInspector(address?: string) {
  return useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "authorizedInspectors",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook để kiểm tra authorized warehouse managers
export function useIsAuthorizedWarehouseManager(address?: string) {
  return useReadContract({
    address: LOGISTICS_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOGISTICS_ABI,
    functionName: "authorizedWarehouseManagers",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook để kiểm tra trạng thái escrow
export function useIsEscrowReleased(shipmentCode: string) {
  const { shipment } = useGetShipment(shipmentCode);

  const isReleased = shipment ? 
    shipment.currentStatus === StatusEnum.Completed ||
    shipment.currentStatus === StatusEnum.Delivered : false;

  const isRefunded = shipment ? 
    shipment.currentStatus === StatusEnum.Canceled : false;

  const depositAmount = shipment?.depositAmount || BigInt(0);

  return {
    isReleased,
    isRefunded,
    depositAmount,
  };
}
