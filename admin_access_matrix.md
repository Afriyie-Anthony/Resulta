# Resulta Backend — Admin & Super Admin Endpoint Access Matrix

This document provides a detailed specification of the **Role-Based Access Control (RBAC)** architecture in the Resulta API backend. It outlines the modules, routes, HTTP methods, and permission boundaries enforced for `ADMIN` and `SUPER_ADMIN` roles.

---

## 🔐 Executive Role Summary

| Role | Access Level | Scope & Responsibilities |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | **Full System Access (Unrestricted)** | Root platform supervisor. Access to **100% of API endpoints**, including Staff/User CRUD, Voucher Inventory & CSV Uploads, Pricing Tier Configuration, SMS Broadcast Gateway, Financial Payout Approvals, and Affiliate Deletion. |
| **`ADMIN`** | **Operational Access (Restricted)** | Day-to-day operations supervisor. Access to Executive Dashboard, Order Management, Customer Directory, Timetables, Commercial Reports (CSV/PDF), Contact Inquiries, Activity Logs, and Affiliate Approvals/Rate Configuration. **Restricted** from User Management, Voucher Uploads, SMS Gateway, and Withdrawal Payout Approvals. |

---

## 📊 Module Access Comparison Table

| Module | Endpoint Route | HTTP Method | Allowed Roles | Access Level |
| :--- | :--- | :---: | :---: | :---: |
| **Executive Dashboard** | `/api/v1/admin/dashboard` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Order Management** | `/api/v1/admin/orders` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Order Analytics** | `/api/v1/admin/orders/stats` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Order CSV Export** | `/api/v1/admin/orders/export` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Single Order Detail** | `/api/v1/admin/orders/:id` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Customer Intelligence** | `/api/v1/admin/customers` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Customer Analytics** | `/api/v1/admin/customers/stats` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Customer CSV Export** | `/api/v1/admin/customers/export` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Single Customer History** | `/api/v1/admin/customers/:phoneNumber` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Exam Timetables** | `/api/v1/admin/timetables` | `GET`, `POST` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Manage Timetable Item** | `/api/v1/admin/timetables/:id` | `GET`, `PUT`, `DELETE` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Commercial Reports** | `/api/v1/admin/reports/analytics` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Reports CSV Export** | `/api/v1/admin/reports/export/csv` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Reports PDF Summary** | `/api/v1/admin/reports/export/pdf` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Contact Support Inquiries** | `/api/v1/admin/contacts` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Contact Desk Stats** | `/api/v1/admin/contacts/stats` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Contact Status & Reply** | `/api/v1/admin/contacts/:id/status`, `/:id/reply` | `PATCH`, `POST` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Delete Support Message** | `/api/v1/admin/contacts/:id` | `DELETE` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Activity Audit Logs** | `/api/v1/admin/logs` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Activity Log Stats** | `/api/v1/admin/logs/stats` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Admin Self Profile** | `/api/v1/admin/profile` | `GET`, `PATCH` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Affiliate Directory & Stats** | `/api/v1/admin/affiliates`, `/stats`, `/analytics` | `GET` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Approve / Reject Affiliate** | `/api/v1/admin/affiliates/:id/approve`, `/:id/reject` | `PATCH` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Update Affiliate Rates** | `/api/v1/admin/affiliates/:id`, `/config` | `PUT` | `ADMIN`, `SUPER_ADMIN` | Shared |
| **Delete Affiliate** | `/api/v1/admin/affiliates/:id` | `DELETE` | **`SUPER_ADMIN` ONLY** | Restricted |
| **User & Staff Directory** | `/api/v1/admin/users` | `GET`, `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Manage User Account** | `/api/v1/admin/users/:id` | `GET`, `PATCH`, `DELETE` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Voucher Inventory List** | `/api/v1/admin/vouchers` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Voucher Price Tiers** | `/api/v1/admin/vouchers/config` | `GET`, `PUT` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Voucher CSV Upload** | `/api/v1/admin/vouchers/upload` | `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Voucher Single Add** | `/api/v1/admin/vouchers/single` | `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Upload Batch History** | `/api/v1/admin/vouchers/upload-history` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Voucher Low Stock Alerts** | `/api/v1/admin/vouchers/alerts` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **SMS Audience Preview** | `/api/v1/admin/sms/preview` | `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Single SMS Dispatch** | `/api/v1/admin/sms/single` | `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Bulk SMS Broadcast** | `/api/v1/admin/sms/bulk` | `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **SMS Audit Logs** | `/api/v1/admin/sms/logs` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Withdrawals Overview** | `/api/v1/admin/withdrawals/stats` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Bank Codes List** | `/api/v1/admin/withdrawals/bank-codes` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Withdrawals Directory** | `/api/v1/admin/withdrawals` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Approve / Reject Payout** | `/api/v1/admin/withdrawals` | `POST` | **`SUPER_ADMIN` ONLY** | Restricted |
| **Withdrawal Request Detail** | `/api/v1/admin/withdrawals/:id` | `GET` | **`SUPER_ADMIN` ONLY** | Restricted |

---

## 📁 Comprehensive Module Specifications

### 1️⃣ Executive Control Center (`/api/v1/admin/dashboard`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/dashboard?timeframe=24h|7d|30d`: Retrieves top-level KPI telemetry (Total Revenue, Active Orders, Stock Availability, Affiliate Conversions, Recent Transactions, and System Health).

---

### 2️⃣ Order Management System (`/api/v1/admin/orders`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/orders`: Paginated order search with filtering by `channel` (`USSD`, `WEBSTORE`), `status` (`SUCCESSFUL`, `PENDING`, `FAILED`), and search terms.
  * `GET /api/v1/admin/orders/stats`: Overview cards showing total orders count, total volume, and breakdown by sales channel.
  * `GET /api/v1/admin/orders/export`: Downloads formatted CSV spreadsheet of order logs.
  * `GET /api/v1/admin/orders/:id`: Full inspection of order details, assigned vouchers, customer contact info, and Hubtel transaction IDs.

---

### 3️⃣ Customer Intelligence & Directory (`/api/v1/admin/customers`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/customers`: Paginated customer directory with repeat order counts, total spent, and VIP segment badges.
  * `GET /api/v1/admin/customers/stats`: Analytics overview with customer leaderboards and segment distributions.
  * `GET /api/v1/admin/customers/export`: Exports customer phone directory to CSV.
  * `GET /api/v1/admin/customers/:phoneNumber`: Complete order history and total lifetime value (LTV) for a specific customer phone number.

---

### 4️⃣ Examination Timetables (`/api/v1/admin/timetables`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/timetables`: Lists exam timetables (`BECE`, `WASSCE_NOVDEC`).
  * `POST /api/v1/admin/timetables`: Creates and publishes new timetable entries with PDF/image attachments.
  * `GET /api/v1/admin/timetables/:id`: View single timetable record.
  * `PUT /api/v1/admin/timetables/:id`: Update timetable details or status (`DRAFT`, `PUBLISHED`).
  * `DELETE /api/v1/admin/timetables/:id`: Delete timetable record.

---

### 5️⃣ Commercial Reports & Analytics (`/api/v1/admin/reports`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/reports/analytics?period=DAILY|WEEKLY|MONTHLY|YEARLY`: Generates revenue trends, channel share, and financial performance breakdowns.
  * `GET /api/v1/admin/reports/export/csv`: Exports raw financial analytics report as a downloadable CSV spreadsheet.
  * `GET /api/v1/admin/reports/export/pdf`: Exports executive PDF report summary.

---

### 6️⃣ Contact Support Desk (`/api/v1/admin/contacts`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/contacts`: Paginated list of public contact inquiries.
  * `GET /api/v1/admin/contacts/stats`: Ticket status distribution (`PENDING`, `REPLIED`, `CLOSED`).
  * `PATCH /api/v1/admin/contacts/:id/status`: Updates ticket status.
  * `POST /api/v1/admin/contacts/:id/reply`: Dispatches direct email reply to customer and updates status to `REPLIED`.
  * `DELETE /api/v1/admin/contacts/:id`: Removes support ticket record.

---

### 7️⃣ Activity Logs & System Audit (`/api/v1/admin/logs`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/logs`: Paginated audit logs recording admin login events, configuration updates, and operational actions.
  * `GET /api/v1/admin/logs/stats`: Breakdown of log events by severity and action type.

---

### 8️⃣ Admin Profile Self-Service (`/api/v1/admin/profile`)
* **Allowed Roles**: `ADMIN`, `SUPER_ADMIN`
* **Features**:
  * `GET /api/v1/admin/profile`: View personal staff profile details.
  * `PATCH /api/v1/admin/profile`: Update name, phone number, avatar, or change password.

---

### 9️⃣ Affiliate Partner Management (`/api/v1/admin/affiliates`)
* **Allowed Roles**:
  * Overview, Approval, Config, Stats: `ADMIN` & `SUPER_ADMIN`
  * Account Deletion: **`SUPER_ADMIN` ONLY**
* **Features**:
  * `GET /api/v1/admin/affiliates`: Paginated list of registered affiliate partners.
  * `POST /api/v1/admin/affiliates`: Directly registers a new affiliate partner account.
  * `PATCH /api/v1/admin/affiliates/:id/approve`: Approves affiliate application, generates referral code, assigns USSD shortcode extension (e.g., `*920*10#`), and dispatches SMS notification.
  * `PATCH /api/v1/admin/affiliates/:id/reject`: Rejects affiliate application with reason.
  * `PUT /api/v1/admin/affiliates/:id`: Updates custom commission rates or payout details.
  * `DELETE /api/v1/admin/affiliates/:id` (**`SUPER_ADMIN` ONLY**): Permanently deletes affiliate partner.

---

### 🔟 Staff & User Management (`/api/v1/admin/users`) — 🔒 `SUPER_ADMIN` ONLY
* **Allowed Roles**: **`SUPER_ADMIN` ONLY** (Forbidden for `ADMIN` with HTTP 403)
* **Features**:
  * `GET /api/v1/admin/users`: Paginated list of all system users filtered by role (`SUPER_ADMIN`, `ADMIN`, `AFFILIATE`, `USER`).
  * `GET /api/v1/admin/users/:id`: Details of a specific user account.
  * `POST /api/v1/admin/users`: Creates new staff member or admin account with assigned role and password.
  * `PATCH /api/v1/admin/users/:id`: Updates user role, status, or credentials.
  * `DELETE /api/v1/admin/users/:id`: Deletes user account (prevents self-deletion).

---

### 11. Voucher Inventory & CSV Batch Upload Engine (`/api/v1/admin/vouchers`) — 🔒 `SUPER_ADMIN` ONLY
* **Allowed Roles**: **`SUPER_ADMIN` ONLY** (Forbidden for `ADMIN` with HTTP 403)
* **Features**:
  * `GET /api/v1/admin/vouchers`: Paginated inventory of available and sold vouchers (`BECE`, `WASSCE_NOVDEC`).
  * `GET /api/v1/admin/vouchers/sold`: Paginated list of sold vouchers with linked order numbers and sold timestamps.
  * `GET /api/v1/admin/vouchers/config`: Retrieves pricing tier structure and stock threshold warnings.
  * `PUT /api/v1/admin/vouchers/config`: Configures unit prices, volume discount tiers, and low-stock notification limits.
  * `POST /api/v1/admin/vouchers/upload`: Processes multipart CSV batch uploads of serial numbers and PINs with duplicate detection.
  * `POST /api/v1/admin/vouchers/single`: Manually adds a single voucher card to inventory.
  * `GET /api/v1/admin/vouchers/upload-history`: Audit history of CSV batch upload operations.
  * `GET /api/v1/admin/vouchers/alerts`: Real-time stock depletion alerts.

---

### 12. SMS Gateway & Broadcast Engine (`/api/v1/admin/sms`) — 🔒 `SUPER_ADMIN` ONLY
* **Allowed Roles**: **`SUPER_ADMIN` ONLY** (Forbidden for `ADMIN` with HTTP 403)
* **Features**:
  * `POST /api/v1/admin/sms/preview`: Previews recipient audience size and sample phone list before sending broadcasts.
  * `POST /api/v1/admin/sms/single`: Sends individual SMS to a specific customer phone number via Hubtel SMS API.
  * `POST /api/v1/admin/sms/bulk`: Sends targeted broadcast SMS blasts to customer segments (`GLOBAL`, `BECE`, `WASSCE_NOVDEC`, `SUCCESSFUL`, `FAILED`) with automatic number deduplication and batching.
  * `GET /api/v1/admin/sms/logs`: Paginated history of dispatched single and bulk SMS messages.

---

### 13. Affiliate Withdrawal & Payout Approvals (`/api/v1/admin/withdrawals`) — 🔒 `SUPER_ADMIN` ONLY
* **Allowed Roles**: **`SUPER_ADMIN` ONLY** (Forbidden for `ADMIN` with HTTP 403)
* **Features**:
  * `GET /api/v1/admin/withdrawals/stats`: Financial summary of total payout requests, pending amounts, and completed disbursements.
  * `GET /api/v1/admin/withdrawals/bank-codes`: Supported Ghana bank codes for bank transfer payouts.
  * `GET /api/v1/admin/withdrawals`: Paginated list of affiliate withdrawal requests.
  * `POST /api/v1/admin/withdrawals`: Approves or rejects affiliate withdrawal payouts (triggers automated Hubtel Direct Send MoMo/Bank disbursement).
  * `GET /api/v1/admin/withdrawals/:id`: Inspection of withdrawal request details and transaction logs.

---


Attempts by standard `ADMIN` users to access `SUPER_ADMIN`-only endpoints will result in an immediate **`403 Forbidden`** HTTP response.
