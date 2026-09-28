# Resulta Backend Integration Guide: Admin Payout Wallets & Financial Security OTP System

> **Target Audience:** Frontend Engineering Team  
> **Backend Version:** v1.0.0+  
> **Swagger URL:** `https://api.resultagh.com/api/v1/docs` (or `http://localhost:5000/api/v1/docs`)  
> **Auth Required:** `Bearer <JWT_TOKEN>` with `SUPER_ADMIN` role

---

## 1. Overview & Security Architecture

To prevent unauthorized disbursements and protect company funds if an administrator's credentials are ever compromised, the Resulta Backend now enforces a **Two-Step Financial Authorization Pattern**:

1. **Designated Security Recipient:**
   - All One-Time Passwords (OTPs) for financial operations are **strictly and exclusively sent to the designated authorized financial security administrator email**.
   - Even if another SuperAdmin is logged in, the code will **never** go to their personal email address. It always goes to the authorized financial administrator email.
2. **Two-Step Operation:**
   - **Step 1:** The frontend requests an OTP for the specific action (`WALLET_CREATE`, `WALLET_UPDATE`, `WALLET_DELETE`, or `WITHDRAWAL_INITIATE`).
   - **Step 2:** A modal/dialog prompts the SuperAdmin for the 6-digit code received at the authorized financial security email. The code is submitted along with the mutation payload.
3. **Strict Rate Limiting:**
   - Maximum **5 requests per 15-minute window** on financial endpoints (`/admin/security/request-otp`, `/admin/wallets`, and `POST /admin/withdrawals`).
4. **Pre-Configured Wallets:**
   - SuperAdmins can register more than 2 payout wallets (`MOBILE_MONEY` or `BANK`).
   - During withdrawal, the frontend displays a dropdown of saved wallets so the user selects by `walletId` rather than typing account details manually every time.

---

## 2. API Endpoints Reference

### A. Request Financial Security OTP

Dispatches a 6-digit OTP to the designated financial security email (valid for 15 minutes).

- **Method:** `POST`
- **URL:** `/api/v1/admin/security/request-otp`
- **Headers:** `Authorization: Bearer <SUPER_ADMIN_TOKEN>`
- **Request Body:**

```json
{
  "action": "WALLET_CREATE",
  "metadata": {
    "channel": "MOBILE_MONEY",
    "label": "Primary Operations MoMo",
    "phoneNumber": "0244123456"
  }
}
```

_Allowed `action` values:_

- `"WALLET_CREATE"`
- `"WALLET_UPDATE"`
- `"WALLET_DELETE"`
- `"WITHDRAWAL_INITIATE"`

- **Success Response (`200 OK`):**

```json
{
  "success": true,
  "message": "A 6-digit security OTP has been sent to the authorized security administrator email.",
  "data": {
    "expiresAt": "2026-09-25T20:30:00.000Z"
  }
}
```

---

### B. Wallet CRUD Endpoints

#### 1. List All Active Wallets

- **Method:** `GET`
- **URL:** `/api/v1/admin/wallets`
- **Query Params (Optional):**
  - `channel`: `MOBILE_MONEY` | `BANK`
  - `search`: string (filters label, phone, bank name, account name)
- **Response (`200 OK`):**

```json
{
  "success": true,
  "message": "Payout wallets retrieved successfully",
  "data": [
    {
      "id": "wlt_cm12345abc",
      "label": "Primary Operations MoMo",
      "channel": "MOBILE_MONEY",
      "network": "MTN",
      "phoneNumber": "0244123456",
      "bankName": null,
      "bankCode": null,
      "accountNumber": null,
      "accountName": "Resulta Enterprise",
      "isDefault": true,
      "isActive": true,
      "createdAt": "2026-09-25T19:00:00.000Z"
    },
    {
      "id": "wlt_cm67890xyz",
      "label": "GCB Commercial Account",
      "channel": "BANK",
      "network": null,
      "phoneNumber": null,
      "bankName": "GCB BANK LIMITED",
      "bankCode": "300304",
      "accountNumber": "1011130001",
      "accountName": "Resulta Technologies Ltd",
      "isDefault": false,
      "isActive": true,
      "createdAt": "2026-09-25T19:15:00.000Z"
    }
  ]
}
```

#### 2. Get Single Wallet by ID

- **Method:** `GET`
- **URL:** `/api/v1/admin/wallets/:id`
- **Response (`200 OK`):** Returns single wallet object.

#### 3. Create a Payout Wallet (Requires OTP)

- **Method:** `POST`
- **URL:** `/api/v1/admin/wallets`
- **Payload for Mobile Money:**

```json
{
  "label": "Primary Operations MoMo",
  "channel": "MOBILE_MONEY",
  "network": "MTN",
  "phoneNumber": "0244123456",
  "accountName": "Resulta Enterprise",
  "isDefault": true,
  "otp": "123456"
}
```

_Payload for Bank Account:_

```json
{
  "label": "GCB Main Corporate",
  "channel": "BANK",
  "bankCode": "300304",
  "bankName": "GCB BANK LIMITED",
  "accountNumber": "1011130001",
  "accountName": "Resulta Technologies Ltd",
  "isDefault": false,
  "otp": "123456"
}
```

- **Response (`201 Created`):** Returns newly created wallet object.

#### 4. Update an Existing Wallet (Requires OTP)

- **Method:** `PUT`
- **URL:** `/api/v1/admin/wallets/:id`
- **Payload:**

```json
{
  "label": "Updated MoMo Label",
  "isDefault": true,
  "otp": "654321"
}
```

- **Response (`200 OK`):** Returns updated wallet object.

#### 5. Delete (Soft-Delete) a Wallet (Requires OTP)

- **Method:** `DELETE`
- **URL:** `/api/v1/admin/wallets/:id`
- **Payload:**

```json
{
  "otp": "999888"
}
```

- **Response (`200 OK`):**

```json
{
  "success": true,
  "message": "Payout wallet deleted successfully",
  "data": null
}
```

---

### C. Withdrawal Initiation (Requires OTP & Supports `walletId`)

- **Method:** `POST`
- **URL:** `/api/v1/admin/withdrawals`
- **Headers:** `Authorization: Bearer <SUPER_ADMIN_TOKEN>`

#### Recommended Payload (Using Pre-Configured Wallet):

```json
{
  "walletId": "wlt_cm12345abc",
  "amount": 500.0,
  "description": "Weekly revenue payout",
  "otp": "777888"
}
```

_(The backend automatically resolves the channel, network, phone/account number, and account name linked to `walletId`)._

#### Backward-Compatible Payload (Manual Details):

```json
{
  "channel": "MOBILE_MONEY",
  "amount": 500.0,
  "network": "MTN",
  "phoneNumber": "0244123456",
  "accountName": "Resulta Enterprise",
  "description": "Weekly revenue payout",
  "otp": "777888"
}
```

- **Response (`201 Created`):**

```json
{
  "success": true,
  "message": "Withdrawal payout initiated successfully via MOBILE_MONEY",
  "data": {
    "id": "wth_123",
    "reference": "WTH17000000001234",
    "amount": 500.0,
    "channel": "MOBILE_MONEY",
    "status": "PENDING",
    "walletId": "wlt_cm12345abc",
    "hubtelTransactionId": "tx_hubtel_123"
  }
}
```

---

## 3. Frontend UI/UX Flow & State Management

### Recommended Modal Pattern

Do not navigate away from the user's form. Use an **Action Confirmation Modal** with an OTP input field:

```
[ Form State: User fills form ]
            │
            ▼ User clicks "Save Wallet" or "Withdraw"
[ Step 1: Loading State ]
   Frontend calls: POST /api/v1/admin/security/request-otp
            │
            ▼ Success
[ Step 2: Open Security Verification Modal ]
   - Message: "A 6-digit verification code has been dispatched to the authorized security email."
   - Input: 6-digit PIN input
   - Timer: 60s cooldown for "Resend Code"
            │
            ▼ User enters OTP & clicks "Confirm"
[ Step 3: Execute Action ]
   Frontend calls: POST /admin/wallets (or /admin/withdrawals) with { ...formData, otp }
            │
            ├───► If 200/201: Close modal, show green toast, refresh list.
            └───► If 400 (Invalid OTP): Show inline error: "Invalid or expired code. Please retry."
```

---

## 4. Frontend Code Examples (React / TypeScript / Next.js)

### 1. API Client Helper Functions (`api/financialSecurity.ts`)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.resultagh.com/api/v1',
});

// Helper: Request Financial OTP
export async function requestFinancialOtp(
  action: 'WALLET_CREATE' | 'WALLET_UPDATE' | 'WALLET_DELETE' | 'WITHDRAWAL_INITIATE',
  metadata: Record<string, any> = {}
) {
  const token = localStorage.getItem('token');
  const response = await api.post(
    '/admin/security/request-otp',
    { action, metadata },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// Helper: Create Wallet
export async function createWallet(payload: {
  label: string;
  channel: 'MOBILE_MONEY' | 'BANK';
  network?: string;
  phoneNumber?: string;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName: string;
  isDefault?: boolean;
  otp: string;
}) {
  const token = localStorage.getItem('token');
  const response = await api.post('/admin/wallets', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Helper: Initiate Withdrawal
export async function initiateWithdrawal(payload: {
  walletId: string;
  amount: number;
  description?: string;
  otp: string;
}) {
  const token = localStorage.getItem('token');
  const response = await api.post('/admin/withdrawals', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
```

---

### 2. Example: Withdrawal Component with OTP Modal

```tsx
import React, { useState, useEffect } from 'react';
import { requestFinancialOtp, initiateWithdrawal } from './api/financialSecurity';

export const WithdrawalPage = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Modal & OTP States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Initial click: triggers OTP request
  const handleStartWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await requestFinancialOtp('WITHDRAWAL_INITIATE', {
        walletId: selectedWalletId,
        amount: parseFloat(amount),
      });
      setIsOtpModalOpen(true); // Open the verification dialog
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  // 2. Final confirm: submits payload + OTP
  const handleConfirmOtpAndWithdraw = async () => {
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await initiateWithdrawal({
        walletId: selectedWalletId,
        amount: parseFloat(amount),
        description,
        otp: otpCode,
      });

      alert(`Success! Withdrawal reference: ${result.data.reference}`);
      setIsOtpModalOpen(false);
      setOtpCode('');
      setAmount('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SuperAdmin Payout Disbursement</h1>

      <form onSubmit={handleStartWithdrawal} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Payout Wallet</label>
          <select
            value={selectedWalletId}
            onChange={(e) => setSelectedWalletId(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">-- Choose Destination Wallet --</option>
            {wallets.map((w: any) => (
              <option key={w.id} value={w.id}>
                {w.label} (
                {w.channel === 'MOBILE_MONEY'
                  ? `${w.network} - ${w.phoneNumber}`
                  : `${w.bankName} - ${w.accountNumber}`}
                )
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Amount (GHS)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          {loading ? 'Requesting Security Authorization...' : 'Proceed to Withdrawal'}
        </button>
      </form>

      {/* Security OTP Verification Dialog */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-lg font-bold">Financial Security Authorization</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              A 6-digit authorization code has been dispatched to the authorized security email.
              Enter it below to authorize this payout.
            </p>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-3">
                {errorMsg}
              </div>
            )}

            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl tracking-widest font-mono border rounded-lg py-3 mb-4"
              autoFocus
            />

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="flex-1 border py-2 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading || otpCode.length !== 6}
                onClick={handleConfirmOtpAndWithdraw}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Authorize Payout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 5. Error Handling Guide

| Status Code             | Message / Cause                                                                      | Recommended Frontend Handling                                                         |
| :---------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `400 Bad Request`       | `"Invalid or expired financial security OTP..."`                                     | Display inline error on the modal: _"Invalid or expired OTP. Please re-check email."_ |
| `403 Forbidden`         | Non-SuperAdmin user attempted access                                                 | Show unauthorized alert: _"SuperAdmin role required."_                                |
| `404 Not Found`         | Wallet ID not found or inactive                                                      | Refresh wallet dropdown list.                                                         |
| `429 Too Many Requests` | `"Too many financial action attempts. Maximum 5 requests allowed per 15 minutes..."` | Show alert: _"Security rate limit reached. Please wait 15 minutes before retrying."_  |

---

## 6. Checklist for Frontend Developers

- [ ] Fetch saved wallets on page load using `GET /api/v1/admin/wallets`.
- [ ] Populate a dropdown for selecting the payout wallet on the Withdrawal page.
- [ ] Add the "Add New Wallet" modal (`channel`, `phoneNumber` / `bankCode`, `accountNumber`, `accountName`, `isDefault`).
- [ ] Implement the Two-Step OTP confirmation dialog before submitting `POST /admin/wallets`, `PUT /admin/wallets/:id`, `DELETE /admin/wallets/:id`, and `POST /admin/withdrawals`.
- [ ] Handle `429 Too Many Requests` with a clear cooldown message.
