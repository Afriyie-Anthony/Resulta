# Resulta Frontend Integration Guide: CTVET / NABPTEX Voucher Type Implementation

> **Target Audience:** Frontend Engineering Team (Web App, Admin Portal, Affiliate Portal)  
> **Backend API Version:** v1.0.0+  
> **Swagger URL:** `https://Base_url/api/v1/docs` (or local `http://Base_url/api/v1/docs`)  
> **Status:** Fully Deployed & Tested

---

## 1. Executive Summary & Core Specifications

The Resulta platform now officially supports a third examination voucher type: **CTVET / NABPTEX** (`CTVET_NABPTEX`), operating alongside **BECE** and **WASSCE / NOVDEC**.

### Key Exam Specifications:

- **Enum Identifier in API:** `CTVET_NABPTEX` (also accepts aliases `CTVET` or `CTVET/NABPTEX` on order initiation).
- **Official Candidate Results Portal:** `https://examination.ctvet.gov.gh/login`
- **PIN Format:** 12-digit numeric code (e.g., `290950455180`).
- **Serial Number Format:** Alphanumeric prefix + sequential digits (e.g., `TER2400008313`, up to 16 characters).
- **Delivery SMS Format:** Single-segment GSM-7 (~112 characters):
  ```text
  Resulta CTVET Voucher:
  Serial: TER2400008313
  PIN: 290950455180
  Check: https://examination.ctvet.gov.gh/login
  ```

---

## 2. Public Storefront / Candidate Web App Updates

### A. Voucher Selection on Homepage & Storefront

- **Component:** Exam selector tabs, dropdowns, or product cards.
- **Update:** Add **CTVET / NABPTEX** as a selectable exam product option.
- **Badge / Label:** "CTVET / NABPTEX" or "Technical & Vocational (CTVET)".
- **External Portal Link:** Show `https://examination.ctvet.gov.gh/login` on the exam description or "How to check results" accordion.

### B. Fetching Pricing & Low-Stock Status

- **Endpoint:** `GET /api/v1/public/vouchers/config`
- **Access:** Public (No authentication required)
- **Response Payload Addition:**
  ```json
  {
    "success": true,
    "data": {
      "beceLowStockThreshold": 100,
      "wassceLowStockThreshold": 100,
      "ctvetLowStockThreshold": 100,
      "priceTiers": [
        {
          "voucherType": "BECE",
          "minQuantity": 1,
          "maxQuantity": 10,
          "unitPrice": "20.00"
        },
        {
          "voucherType": "WASSCE_NOVDEC",
          "minQuantity": 1,
          "maxQuantity": 10,
          "unitPrice": "25.00"
        },
        {
          "voucherType": "CTVET_NABPTEX",
          "minQuantity": 1,
          "maxQuantity": 10,
          "unitPrice": "25.00"
        }
      ]
    }
  }
  ```
- **Frontend Action:** Filter `priceTiers` where `voucherType === 'CTVET_NABPTEX'` to compute the checkout price based on selected quantity.

### C. Initiating a Voucher Purchase Order

- **Endpoint:** `POST /api/v1/public/orders/initiate`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "voucherType": "CTVET_NABPTEX",
    "quantity": 2,
    "fullName": "Kofi Mensah",
    "phoneNumber": "0244123456",
    "email": "kofi@example.com",
    "affiliateCode": "OPTIONAL_AFFILIATE_CODE"
  }
  ```
  _(Note: `email` is mandatory only if `quantity > 5`)._
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "order": {
        "id": "ord_xyz789",
        "orderNumber": "ORD-1791761000-4321",
        "voucherType": "CTVET_NABPTEX",
        "quantity": 2,
        "unitPrice": 25.0,
        "totalAmount": 50.0,
        "status": "PENDING"
      },
      "checkoutUrl": "https://checkout.hubtel.com/...",
      "checkoutId": "chk_abc123"
    }
  }
  ```

### D. Order Verification & Candidate Receipt Page

- **Endpoint:** `GET /api/v1/public/orders/:orderId/verify` (or `/api/v1/orders/:orderId/verify`)
- **Access:** Public
- **Response for Paid CTVET Order:**
  ```json
  {
    "success": true,
    "data": {
      "order": {
        "orderNumber": "ORD-1791761000-4321",
        "voucherType": "CTVET_NABPTEX",
        "quantity": 1,
        "totalAmount": 25.0,
        "status": "SUCCESSFUL",
        "deliveryStatus": "DELIVERED",
        "paidAt": "2026-10-11T20:00:00.000Z",
        "vouchers": [
          {
            "serialNumber": "TER2400008313",
            "pin": "290950455180"
          }
        ]
      }
    }
  }
  ```
- **UI Action on Receipt Screen:**
  - Display the Serial Number with a "Copy" button.
  - Display the PIN code with an "Eye" reveal toggle and "Copy" button.
  - Prominent CTA Button: **"Check Results on CTVET Portal"** linking directly to `https://examination.ctvet.gov.gh/login` in a new browser tab (`target="_blank" rel="noopener noreferrer"`).

---

## 3. Admin Portal Updates

The Admin Portal requires updates across 6 key sections:

### Section 1: Executive Dashboard (`/admin/dashboard`)

- **Endpoint:** `GET /api/v1/admin/dashboard?timeframe=7d`
- **New Fields in Response:**
  ```json
  {
    "success": true,
    "data": {
      "overviewCards": {
        "beceStock": 142,
        "wassceStock": 235,
        "ctvetStock": 180
      },
      "salesByType": {
        "beceCount": 45,
        "becePercentage": 40.0,
        "wassceCount": 45,
        "wasscePercentage": 40.0,
        "ctvetCount": 20,
        "ctvetPercentage": 20.0
      },
      "inventoryStatus": {
        "bece": { "available": 142, "threshold": 100, "isLow": false },
        "wassce": { "available": 235, "threshold": 100, "isLow": false },
        "ctvet": { "available": 180, "threshold": 100, "isLow": false }
      }
    }
  }
  ```
- **UI Updates:**
  - Add **CTVET Available Stock** metric card alongside BECE and WASSCE.
  - Include CTVET slice/bar in the **Sales by Voucher Type** donut chart.
  - Add CTVET row in the **Inventory Health / Threshold Progress** widget.

---

### Section 2: Voucher Inventory & Pricing Configuration (`/admin/vouchers`)

#### A. Voucher Configuration & Tier Pricing

- **Get Config:** `GET /api/v1/admin/vouchers/config`
- **Update Config:** `PUT /api/v1/admin/vouchers/config`
- **Request Payload Example:**
  ```json
  {
    "beceLowStockThreshold": 100,
    "wassceLowStockThreshold": 100,
    "ctvetLowStockThreshold": 100,
    "priceTiers": [
      { "voucherType": "BECE", "minQuantity": 1, "maxQuantity": 10, "unitPrice": 20.0 },
      { "voucherType": "WASSCE_NOVDEC", "minQuantity": 1, "maxQuantity": 10, "unitPrice": 25.0 },
      { "voucherType": "CTVET_NABPTEX", "minQuantity": 1, "maxQuantity": 10, "unitPrice": 25.0 },
      { "voucherType": "CTVET_NABPTEX", "minQuantity": 11, "maxQuantity": 50, "unitPrice": 23.0 }
    ]
  }
  ```
- **UI Updates:** Add an input field for **CTVET Low Stock Threshold** and allow administrators to add pricing tiers specifically for `CTVET_NABPTEX`.

#### B. Low Stock Alert Status

- **Endpoint:** `GET /api/v1/admin/vouchers/alerts`
- **Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "bece": { "available": 50, "threshold": 100, "isLowStock": true },
      "wassce_novdec": { "available": 200, "threshold": 100, "isLowStock": false },
      "ctvet_nabptex": { "available": 150, "threshold": 100, "isLowStock": false }
    }
  }
  ```

#### C. Inventory Overview Statistics

- **Endpoint:** `GET /api/v1/admin/vouchers/stats`
- **Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "bece": { "available": 50, "sold": 150, "total": 200 },
      "wassce_novdec": { "available": 200, "sold": 500, "total": 700 },
      "ctvet_nabptex": { "available": 150, "sold": 250, "total": 400 }
    }
  }
  ```

#### D. Pre-Check & Bulk Voucher Upload

- **Validation Endpoint:** `POST /api/v1/admin/vouchers/validate-upload` (`multipart/form-data`)
- **Upload Endpoint:** `POST /api/v1/admin/vouchers/upload` (`multipart/form-data`)
- **Parameters:** `voucherType` = `"CTVET_NABPTEX"` + `file` (`.csv`, `.xlsx`, `.xls`).
- **Supported Column Names in File:**
  - Serial: `serial`, `serialNumber`, `serial_number`, `serial no`, or auto-detected by `TER...` prefix.
  - PIN: `pin`, `pincode`, `pin_code`, `code`, `voucher_code`, or 12 numeric digits.

#### E. Inventory Filters & Search

- **Available Vouchers:** `GET /api/v1/admin/vouchers?type=CTVET_NABPTEX&status=AVAILABLE&page=1&limit=10`
- **Sold Vouchers:** `GET /api/v1/admin/vouchers/sold?type=CTVET_NABPTEX&page=1&limit=10`
- **Upload History:** `GET /api/v1/admin/vouchers/upload-history?voucherType=CTVET_NABPTEX&page=1&limit=10`
- **UI Update:** Add `"CTVET_NABPTEX"` to the Voucher Type filter dropdowns.

---

### Section 3: Orders Directory (`/admin/orders`)

- **Endpoint:** `GET /api/v1/admin/orders?voucherType=CTVET_NABPTEX&page=1&limit=10`
- **Order Overview Statistics:** `GET /api/v1/admin/orders/stats` returns breakdown including:
  ```json
  {
    "data": {
      "breakdown": {
        "BECE": 120,
        "WASSCE": 350,
        "CTVET": 80
      }
    }
  }
  ```
- **Resend SMS:** `POST /api/v1/admin/orders/:id/resend-sms`
  - Body: `{ "overridePhoneNumber": "0244123456" }` (optional)
  - Automatically formats single-segment SMS and points candidate to the CTVET portal.

---

### Section 4: Commercial Analytics & Reports (`/admin/reports`)

- **Endpoint:** `GET /api/v1/admin/reports/analytics?period=WEEKLY&voucherType=CTVET_NABPTEX`
- **Telemetry Data Points:**
  - `data.kpiCards.ctvetVouchers`: Number of CTVET vouchers sold.
  - `data.breakdowns.examMarketShare.ctvet`: CTVET revenue and volume percentage.
- **Exports:**
  - CSV Export: `GET /api/v1/admin/reports/export/csv?voucherType=CTVET_NABPTEX`
  - PDF Export: `GET /api/v1/admin/reports/export/pdf?voucherType=CTVET_NABPTEX`

---

### Section 5: Affiliate Global Configuration (`/admin/affiliates/config`)

- **Get Config:** `GET /api/v1/admin/affiliates/config`
- **Update Config:** `PUT /api/v1/admin/affiliates/config`
- **Payload Structure:**
  ```json
  {
    "commissionPercentage": 10.0,
    "beceSellingPrice": 20.0,
    "wassceSellingPrice": 25.0,
    "ctvetSellingPrice": 25.0,
    "beceCommissionGhs": 2.0,
    "wassceCommissionGhs": 2.5,
    "ctvetCommissionGhs": 2.5,
    "oneTimeRecruitmentBonusGhs": 10.0
  }
  ```
- **UI Updates:**
  - Add input field for **CTVET Selling Price (GHS)** (default: 25.00).
  - Add input field for **CTVET Fixed Commission (GHS)** (default: 2.50).

---

### Section 6: Bulk SMS Blast (`/admin/sms`)

- **Preview Audience:** `POST /api/v1/admin/sms/preview`
  ```json
  {
    "category": "CTVET_NABPTEX",
    "statusFilter": "ALL"
  }
  ```
  _(Returns count and preview sample of unique numbers who bought CTVET vouchers or dialed CTVET on USSD)._
- **Send Bulk SMS:** `POST /api/v1/admin/sms/bulk`
  ```json
  {
    "category": "CTVET_NABPTEX",
    "statusFilter": "SUCCESSFUL",
    "message": "CTVET Results are officially out! Check your result now at https://examination.ctvet.gov.gh/login"
  }
  ```
- **SMS Logs Filter:** `GET /api/v1/admin/sms/logs?category=CTVET_NABPTEX&page=1&limit=10`

---

## 4. Affiliate Portal Updates

### A. Commission Breakdown & Rates Display

- When displaying commission rates to affiliates, include:
  - **CTVET Voucher Commission:** `GHS <ctvetCommissionGhs>` per unit sold (e.g., GHS 2.50).
  - **CTVET Retail Selling Price:** `GHS <ctvetSellingPrice>` (e.g., GHS 25.00).

### B. Affiliate USSD Storefront

- The affiliate's dedicated shortcode (e.g., `*920*XXX#`) now automatically displays Option 3 for CTVET vouchers:
  ```text
  Welcome to <Affiliate Business Name>
  1. Buy BECE Voucher
  2. Buy WASSCE Voucher
  3. Buy CTVET Voucher
  ```
- Sales via this option credit the affiliate profile with the CTVET commission.

---

## 5. UI/UX Style & Component Best Practices

| Element                 | Recommended Treatment                                                                                                                                                                                                                                              |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Voucher Badge Color** | Suggest using a dedicated purple/indigo or slate styling to differentiate from BECE (Green/Emerald) and WASSCE (Blue/Cobalt). Example: `bg-violet-50 text-violet-700 border-violet-200` (Light) or `bg-violet-950/40 text-violet-400 border-violet-800/40` (Dark). |
| **PIN Reveal Toggle**   | By default, obscure the 12-digit PIN code (`••••••••••••`) with an eye icon toggle to reveal full digits. Provide a single-click copy button with clipboard toast notification.                                                                                    |
| **Direct Results Link** | Always display the official verification URL `https://examination.ctvet.gov.gh/login` prominently on verification receipts.                                                                                                                                        |
| **Input Validation**    | Quantity inputs should enforce `min = 1` and `max = 9` for immediate USSD-aligned checkouts or require email for web orders with quantity > 5.                                                                                                                     |

---

## 6. Quick Checklist for Frontend Developers

- [ ] Add `CTVET_NABPTEX` to client-side `VoucherType` TypeScript enum / constants.
- [ ] Add CTVET product card / tab on web storefront homepage.
- [ ] Update public order initiation payload to pass `voucherType: "CTVET_NABPTEX"`.
- [ ] Add direct portal link button (`https://examination.ctvet.gov.gh/login`) on Order Receipt page.
- [ ] Add `ctvetLowStockThreshold` and CTVET price tiers to Admin Voucher Config form.
- [ ] Add CTVET to Admin Bulk Upload dropdown.
- [ ] Add CTVET to Admin Voucher Inventory, Sold, and Upload History filter dropdowns.
- [ ] Add CTVET to Admin Orders list filter dropdown.
- [ ] Add `ctvetStock` and CTVET sales breakdown to Admin Dashboard.
- [ ] Add `ctvetSellingPrice` and `ctvetCommissionGhs` to Admin Affiliate Config form.
- [ ] Add `CTVET_NABPTEX` to SMS Blast target category dropdown.
