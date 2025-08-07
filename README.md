# Freireli Logistics - Blockchain Tracking System

Hệ thống theo dõi logistics sử dụng công nghệ blockchain trên mạng Kairos Testnet.

## 🚀 Tính Năng

- **Tạo Vận Đơn**: Tạo vận đơn mới với thông tin chi tiết
- **Tra Cứu Vận Đơn**: Theo dõi tình trạng giao hàng realtime
- **Quản Lý Vận Đơn**: Cập nhật trạng thái và thêm sự kiện vận chuyển
- **Bảo Mật Blockchain**: Dữ liệu được lưu trữ bảo mật trên blockchain
- **Kết Nối Ví**: Hỗ trợ MetaMask và các ví khác qua RainbowKit

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: Wagmi, RainbowKit, Viem
- **UI**: Tailwind CSS, Radix UI, Shadcn/ui
- **Network**: Kairos Testnet (Klaytn)

## 📦 Cài Đặt

1. Clone repository:

```bash
git clone <repository-url>
cd freireli
```

2. Cài đặt dependencies:

```bash
pnpm install
```

3. Tạo file environment variables:

```bash
cp .env.example .env.local
```

4. Cập nhật các environment variables trong `.env.local`:

```env
# Contract Address - CẬP NHẬT SAU KHI DEPLOY
NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS=your_deployed_contract_address

# WalletConnect Project ID - Lấy từ https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Network Configuration (Kairos Testnet)
NEXT_PUBLIC_KAIROS_RPC_URL=https://rpc.ankr.com/klaytn_testnet
NEXT_PUBLIC_KAIROS_CHAIN_ID=1001
NEXT_PUBLIC_KAIROS_EXPLORER_URL=https://kairos.kaiascope.com

# App Configuration
NEXT_PUBLIC_APP_NAME=Freireli Logistics
NEXT_PUBLIC_APP_DESCRIPTION=Hệ thống theo dõi logistics sử dụng blockchain technology

# Faucet URL
NEXT_PUBLIC_FAUCET_URL=https://kairos.wallet.klaytn.foundation/faucet
```

5. Chạy development server:

```bash
pnpm dev
```

## 🔧 Cấu Hình

### Environment Variables

Tất cả cấu hình quan trọng được quản lý thông qua environment variables:

| Variable                                 | Description                  | Required | Default             |
| ---------------------------------------- | ---------------------------- | -------- | ------------------- |
| `NEXT_PUBLIC_LOGISTICS_CONTRACT_ADDRESS` | Địa chỉ smart contract       | ✅       | N/A                 |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`   | WalletConnect Project ID     | ❌       | Default ID          |
| `NEXT_PUBLIC_KAIROS_RPC_URL`             | RPC URL cho Kairos testnet   | ❌       | Ankr RPC            |
| `NEXT_PUBLIC_KAIROS_CHAIN_ID`            | Chain ID (1001)              | ❌       | 1001                |
| `NEXT_PUBLIC_KAIROS_EXPLORER_URL`        | Block explorer URL           | ❌       | Kaiascope           |
| `NEXT_PUBLIC_APP_NAME`                   | Tên ứng dụng                 | ❌       | Freireli Logistics  |
| `NEXT_PUBLIC_APP_DESCRIPTION`            | Mô tả ứng dụng               | ❌       | Default description |
| `NEXT_PUBLIC_FAUCET_URL`                 | URL faucet để lấy test token | ❌       | Kairos faucet       |

### 1. Cài Đặt MetaMask

Thêm mạng Kairos Testnet vào MetaMask:

- **Network Name**: Kairos Testnet
- **RPC URL**: https://rpc.ankr.com/klaytn_testnet
- **Chain ID**: 1001
- **Currency Symbol**: KLAY
- **Block Explorer**: https://kairos.kaiascope.com

### 2. Lấy Test KLAY

Truy cập faucet để lấy test KLAY:
https://kairos.wallet.klaytn.foundation/faucet

### 3. Deploy Smart Contract

Deploy file `freireli.sol` lên Kairos testnet bằng Remix IDE hoặc Hardhat.

## 📱 Sử Dụng

### Tạo Vận Đơn

1. Kết nối ví MetaMask
2. Truy cập trang "Tạo vận đơn"
3. Điền thông tin vận đơn
4. Xác nhận transaction

### Tra Cứu Vận Đơn

1. Truy cập trang "Tra cứu"
2. Nhập mã vận đơn
3. Xem thông tin chi tiết và lịch sử vận chuyển

### Quản Lý Vận Đơn

1. Truy cập trang "Quản lý"
2. Thêm sự kiện vận chuyển
3. Cập nhật trạng thái vận đơn

## 🔗 Smart Contract

Contract được viết bằng Solidity và bao gồm các function chính:

- `createShipment()`: Tạo vận đơn mới
- `getShipment()`: Lấy thông tin vận đơn
- `addShipmentEvent()`: Thêm sự kiện vận chuyển
- `updateShipmentStatus()`: Cập nhật trạng thái
- `getShipmentEvents()`: Lấy lịch sử sự kiện

## 📂 Cấu Trúc Project

```
freireli/
├── app/                    # Next.js app router
│   ├── create/            # Trang tạo vận đơn
│   ├── track/             # Trang tra cứu
│   ├── manage/            # Trang quản lý
│   ├── logistics/         # Dashboard logistics
│   └── setup/             # Hướng dẫn cài đặt
├── components/
│   ├── logistics/         # Components logistics
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn/ui)
├── hooks/                # Custom hooks
├── lib/                  # Utilities và constants
├── providers/            # Context providers
└── logistics-abi.json    # Contract ABI
```

## 🎯 Roadmap

- [ ] Thêm dashboard analytics
- [ ] Hỗ trợ nhiều loại hàng hóa
- [ ] Tích hợp thông báo realtime
- [ ] API cho mobile app
- [ ] Multi-language support

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License

## 📞 Liên Hệ

- Email: support@freireli.com
- Website: https://freireli.com
