**RESULTA**

**DEVELOPER IMPLEMENTATION DOCUMENTATION**

**Product Brand:** Resulta\
**Tagline:** Your Results. Your Next Step.\
**Parent Company:** Owelyn Holdings Ltd.\
**Business:** WASSCE & BECE Result-Checking Voucher Distribution Platform\
**Primary Market:** Ghana\
**Product Phase:** Phase 1 --- Commercial MVP\
**Document Version:** 1.0\
**Document Status:** Development Specification\
**Prepared For:** Software Development Team / AI Coding Agents / Technical Team

**TABLE OF CONTENTS**

1.  Project Overview

2.  Product Vision

3.  Phase 1 Scope

4.  System Users

5.  User Roles and Permissions

6.  Core Business Model

7.  System Architecture

8.  Technology Stack

9.  Frontend Architecture

10. Backend Architecture

11. Database Architecture

12. Authentication & Authorization

13. Customer Website Requirements

14. Purchase & Checkout Flow

15. Payment Architecture

16. Voucher Inventory System

17. Voucher Fulfillment

18. USSD System

19. Affiliate System

20. Commission System

21. Affiliate Withdrawal System

22. Admin Dashboard

23. Notifications

24. Customer Support

25. Reporting & Analytics

26. Security Requirements

27. Fraud Prevention

28. Audit Logging

29. API Standards

30. API Endpoint Requirements

31. Error Handling

32. Validation Requirements

33. Frontend UX Requirements

34. Design System

35. Responsive Requirements

36. Accessibility

37. Performance

38. Testing Strategy

39. Deployment Architecture

40. Environment Configuration

41. CI/CD

42. Monitoring

43. Backup & Disaster Recovery

44. Development Workflow

45. Git & Code Standards

46. Definition of Done

47. Phase 1 Development Roadmap

48. Future Expansion

49. Final Developer Checklist

**1. PROJECT OVERVIEW**

Resulta is a commercial digital platform for selling WASSCE and BECE result-checking vouchers to customers in Ghana.

The platform will provide customers with a simple and secure way to:

-   Select a result-checking voucher.

-   Pay online.

-   Receive their voucher details.

-   Access purchased vouchers.

-   View order history.

-   Receive purchase confirmations.

-   Contact customer support.

Customers will be able to purchase through:

1.  **Resulta Website**

2.  **Resulta USSD**

Resulta will also operate an affiliate program where individuals can register through the website and earn commissions by referring customers.

Administrators will manage:

-   Customers.

-   Orders.

-   Payments.

-   Voucher inventory.

-   Affiliates.

-   Commissions.

-   Withdrawals.

-   Reports.

-   Support.

The system must be designed as a **real commercial product**, not as a school project or prototype.

**2. PRODUCT VISION**

The goal is to build Resulta into a trusted digital platform for examination-related services.

The initial product is:

WASSCE and BECE result-checking voucher sales.

The longer-term platform can expand into:

-   Additional examination services.

-   Education-related digital products.

-   Student services.

-   USSD education services.

-   Affiliate/reseller networks.

-   Mobile applications.

-   Institutional partnerships.

The technical architecture must therefore avoid hard-coding the entire system around only two products.

The system should treat WASSCE and BECE as configurable products.

**3. PHASE 1 SCOPE**

Phase 1 must include:

**Customer Website**

-   Homepage.

-   Voucher purchase.

-   Checkout.

-   Payment.

-   Order confirmation.

-   Order lookup.

-   Customer account.

-   Voucher access.

-   Order history.

-   How It Works.

-   Support.

-   Affiliate registration.

-   Affiliate dashboard.

**USSD**

-   Product selection.

-   Purchase initiation.

-   Payment initiation.

-   Payment confirmation.

-   Transaction reference.

-   SMS delivery.

**Affiliate System**

-   Affiliate registration.

-   Affiliate application.

-   Admin approval.

-   Affiliate account.

-   Referral code.

-   Referral link.

-   Sales tracking.

-   Commission tracking.

-   Withdrawal requests.

**Admin Dashboard**

-   Dashboard.

-   Orders.

-   Payments.

-   Voucher inventory.

-   Customers.

-   Affiliates.

-   Commissions.

-   Withdrawals.

-   Reports.

-   Support.

-   Settings.

The system should intentionally avoid unnecessary pages.

The interface should be **compact and operationally focused**.

**4. SYSTEM USERS**

The system has the following user types.

**Customer**

Purchases vouchers.

**Affiliate**

Promotes Resulta and earns commissions.

**Support Agent**

Handles customer issues.

**Inventory Manager**

Manages voucher stock.

**Finance Manager**

Manages payments, commissions, and withdrawals.

**Administrator**

Manages business operations.

**Super Administrator**

Has unrestricted system access.

**5. USER ROLES AND PERMISSIONS**

The system must implement Role-Based Access Control.

Recommended roles:

CUSTOMER

AFFILIATE

SUPPORT_AGENT

INVENTORY_MANAGER

FINANCE_MANAGER

ADMIN

SUPER_ADMIN

Permissions should be granular.

Example:

orders.view

orders.manage

payments.view

payments.refund

inventory.view

inventory.import

inventory.manage

affiliates.view

affiliates.approve

affiliates.suspend

commissions.view

withdrawals.view

withdrawals.approve

withdrawals.process

reports.view

support.view

support.manage

users.view

users.manage

settings.manage

The backend must enforce permissions.

Hiding a button in the frontend is **not sufficient security**.

**6. CORE BUSINESS MODEL**

Resulta sells digital vouchers.

The primary business transaction is:

Customer

↓

Select Voucher

↓

Create Order

↓

Pay

↓

Payment Verified

↓

Voucher Allocated

↓

Voucher Delivered

For affiliate sales:

Affiliate

↓

Referral Link

↓

Customer

↓

Purchase

↓

Payment

↓

Voucher Fulfillment

↓

Commission Created

**7. SYSTEM ARCHITECTURE**

The recommended architecture is a modular monolith.

CUSTOMER WEBSITE

│

▼

RESULTA API

│

┌──────────────┼──────────────┐

│ │ │

▼ ▼ ▼

PostgreSQL Redis Job Worker

│

│

┌───────┼─────────┐

│ │ │

▼ ▼ ▼

Payment USSD Email/SMS

Provider Provider Providers

The website and USSD must use the same backend.

There should be **one central business logic layer**.

**8. TECHNOLOGY STACK**

**Customer Frontend**

Recommended:

-   Next.js

-   TypeScript

-   Tailwind CSS

-   React

**Admin Dashboard**

Recommended:

-   Next.js or React

-   TypeScript

-   Tailwind CSS

-   Reusable component library

**Backend**

Recommended:

-   Node.js

-   TypeScript

-   Express.js

**Database**

-   PostgreSQL

**ORM**

-   Prisma

**Caching / Queues**

Potential:

-   Redis

-   BullMQ

**Deployment**

Recommended infrastructure can use:

-   Vercel or equivalent for frontend.

-   Render, Railway, AWS, or equivalent for backend.

-   Managed PostgreSQL.

-   Managed Redis if required.

The final provider selection should be based on cost, reliability, and expected traffic.

**9. FRONTEND ARCHITECTURE**

The frontend should be modular.

src/

├── app/

├── components/

├── features/

│ ├── auth/

│ ├── products/

│ ├── checkout/

│ ├── orders/

│ ├── vouchers/

│ ├── affiliates/

│ └── support/

├── services/

├── hooks/

├── lib/

├── types/

└── utils/

Business logic should not be scattered across UI components.

API communication should use a centralized service layer.

**10. BACKEND ARCHITECTURE**

Recommended structure:

src/

├── config/

├── modules/

│ ├── auth/

│ ├── users/

│ ├── products/

│ ├── orders/

│ ├── payments/

│ ├── vouchers/

│ ├── inventory/

│ ├── affiliates/

│ ├── commissions/

│ ├── withdrawals/

│ ├── notifications/

│ ├── support/

│ ├── reports/

│ └── admin/

├── integrations/

│ ├── payments/

│ ├── ussd/

│ ├── sms/

│ └── email/

├── middleware/

├── utils/

└── app.ts

Each module should follow:

routes

controller

service

repository

schema

types

Controllers should remain thin.

Business rules belong in services.

**11. DATABASE ARCHITECTURE**

Core entities:

User

Role

Permission

UserRole

RolePermission

Product

ProductPriceHistory

VoucherBatch

Voucher

Order

OrderItem

Payment

PaymentAttempt

Refund

WebhookEvent

Affiliate

AffiliateApplication

AffiliateReferral

Commission

Withdrawal

Notification

NotificationLog

SupportTicket

SupportMessage

AuditLog

LoginAttempt

PostgreSQL is the system of record.

**12. DATABASE REQUIREMENTS**

Important constraints:

User.email UNIQUE

User.phone UNIQUE

Product.code UNIQUE

Product.slug UNIQUE

Voucher.serialNumber UNIQUE

Order.orderReference UNIQUE

Payment.merchantReference UNIQUE

WebhookEvent.provider + eventId UNIQUE

Affiliate.affiliateCode UNIQUE

Commission.affiliateId + orderId UNIQUE

Financial amounts should use integer minor units.

Example:

amount = 2000

currency = GHS

represents:

GHS 20.00

The system must never use JavaScript floating-point arithmetic for financial calculations.

**13. AUTHENTICATION**

Customer authentication:

-   Email or phone registration.

-   Password authentication.

-   Password reset.

-   Email/phone verification where applicable.

-   Secure session/token management.

Affiliate authentication:

-   Uses the same user authentication system.

-   Affiliate status determines access to affiliate functionality.

Admin authentication:

-   Separate admin login interface.

-   RBAC.

-   MFA strongly recommended.

-   Session timeout.

-   Audit logs.

**14. CUSTOMER WEBSITE**

The website should contain only core pages.

Recommended structure:

/

├── Home

├── Buy Voucher

├── Checkout

├── Payment Result

├── Order Lookup

├── How It Works

├── Support

├── Affiliate

├── Login

└── Account

├── Dashboard

├── Orders

└── Vouchers

The main conversion action should always be:

**Buy Voucher**

**15. HOMEPAGE**

The homepage should communicate immediately:

1.  What Resulta is.

2.  What customers can buy.

3.  How quickly they receive vouchers.

4.  How payment works.

5.  Why customers should trust Resulta.

Primary CTA:

Buy a Voucher

Secondary CTA:

Check My Order

Additional:

Become an Affiliate

**16. BUY VOUCHER PAGE**

Products should be displayed as cards.

Example:

WASSCE Result Checker

Price: GHS XX.XX

\[Buy Now\]

BECE Result Checker

Price: GHS XX.XX

\[Buy Now\]

The price must come from the backend.

**17. CHECKOUT**

Checkout should collect only necessary information.

Recommended:

-   Email.

-   Phone number.

-   Product.

-   Quantity.

-   Affiliate referral if applicable.

For guest checkout:

Customer

↓

Phone

Email

↓

Payment

↓

Voucher

For account users:

Customer

↓

Login

↓

Checkout

↓

Payment

↓

Voucher added to account

**18. PAYMENT FLOW**

POST /orders

↓

Order Created

↓

POST /payments/initiate

↓

Payment Provider

↓

Customer Pays

↓

Provider Webhook

↓

Verify Payment

↓

Mark Payment PAID

↓

Fulfill Voucher

↓

Send Notification

The frontend redirect must not determine payment success.

**19. PAYMENT IDEMPOTENCY**

Every payment must have a unique merchant reference.

Example:

RSL-PAY-2026-7F82A

Duplicate webhooks must be safely ignored.

The system must ensure:

One successful payment

=

One fulfillment event

unless the order explicitly contains multiple voucher quantities.

**20. VOUCHER INVENTORY**

Administrators import voucher stock.

Recommended workflow:

Admin

↓

Select Product

↓

Upload Secure File

↓

Validate File

↓

Detect Duplicates

↓

Encrypt Voucher PINs

↓

Create Batch

↓

Inventory Available

Supported import format can initially be CSV.

Example:

serialNumber,pin

XXXXXX,XXXXXX

XXXXXX,XXXXXX

The system must validate:

-   Required columns.

-   Product.

-   Duplicate serials.

-   Invalid rows.

-   Missing PINs.

-   Duplicate records against existing inventory.

**21. VOUCHER IMPORT SECURITY**

After import:

-   PINs must be encrypted.

-   Raw files should not remain publicly accessible.

-   Import files should not be permanently retained unless operationally necessary.

-   Admin exports must be restricted.

-   Voucher PINs must never appear in logs.

-   Voucher PINs must never appear in analytics.

**22. VOUCHER ALLOCATION**

Voucher allocation must be transactional.

Payment PAID

↓

Find AVAILABLE voucher

↓

Lock voucher

↓

Mark RESERVED

↓

Attach to order

↓

Mark SOLD

↓

Mark fulfillment FULFILLED

If allocation fails:

Transaction Rollback

The customer must not receive a voucher already assigned to another order.

**23. LOW STOCK MANAGEMENT**

The admin dashboard should show:

WASSCE

Available: 2,500

Low Stock: No

BECE

Available: 120

Low Stock: Yes

Each product should have a configurable low-stock threshold.

Example:

lowStockThreshold = 100

The system should alert administrators when stock falls below the threshold.

**24. CUSTOMER VOUCHER ACCESS**

Customers should be able to access purchased vouchers from:

Account

↓

My Vouchers

Each voucher should show:

-   Product.

-   Order reference.

-   Purchase date.

-   Serial number.

-   PIN visibility control.

The PIN should initially be hidden.

Example:

Serial Number:

XXXXXXXX

PIN:

••••••••

\[Show PIN\]

Displaying the PIN should be logged.

**25. ORDER LOOKUP**

Customers without accounts should be able to find an order using:

-   Order reference.

-   Phone/email verification.

Example:

Order Reference

\+

Phone Number

The backend must verify ownership before showing voucher details.

**26. USSD**

The USSD experience must be extremely simple.

Example:

Welcome to Resulta

1\. WASSCE Voucher

2\. BECE Voucher

3\. Check Order

Purchase:

1\. WASSCE Voucher

Price: GHS XX.XX

1\. Confirm

2\. Cancel

Then:

Payment request sent.

Please approve the payment on your phone.

After payment:

Payment successful.

Your voucher details will be sent by SMS.

**27. USSD ARCHITECTURE**

Customer

↓

USSD Provider

↓

Resulta USSD Endpoint

↓

Resulta Backend

↓

Create Order

↓

Payment Provider

↓

Webhook

↓

Fulfillment

↓

SMS

USSD must use the same order and payment services as the website.

**28. USSD ORDER CHANNEL**

Every USSD order must be stored with:

channel = USSD

Website orders:

channel = WEB

This allows channel analytics.

**29. AFFILIATE REGISTRATION**

Affiliate flow:

Visitor

↓

Become an Affiliate

↓

Register / Login

↓

Submit Application

↓

Admin Review

↓

Approved

↓

Affiliate Dashboard

Affiliate application fields may include:

-   Full name.

-   Phone.

-   Email.

-   Location.

-   Business name, if applicable.

-   Preferred payout method.

The exact KYC requirements should be determined based on the final commercial and regulatory model.

**30. AFFILIATE DASHBOARD**

The affiliate dashboard should show:

Total Sales

Total Commission

Pending Commission

Available Balance

Paid Commission

Also:

Referral Link

Affiliate Code

Sales table:

Order

Product

Date

Amount

Commission

Status

Withdrawal section:

Available Balance

\[Request Withdrawal\]

**31. AFFILIATE ATTRIBUTION**

Example:

Affiliate Link

resulta.com/buy?ref=OB123

When a visitor enters the website:

ref=OB123

The system stores referral attribution.

At order creation:

order.affiliateId = AFFILIATE_ID

The order must permanently retain this association.

**32. COMMISSION RULES**

Recommended initial lifecycle:

Order Paid

↓

Commission Pending

↓

Order Fulfilled

↓

Commission Available

↓

Affiliate Withdrawal

If the order is refunded:

Commission Reversed

The commission ledger must prevent duplicate commissions.

**33. WITHDRAWALS**

Affiliate:

Available Balance

↓

Request Withdrawal

↓

Admin Review

↓

Approve

↓

Process Payment

↓

Mark Paid

Every withdrawal must have:

-   Amount.

-   Affiliate.

-   Payout method.

-   Payout account.

-   Status.

-   Transaction reference.

-   Processing administrator.

-   Timestamp.

**34. ADMIN DASHBOARD**

The admin dashboard should be compact.

Recommended pages:

Dashboard

Orders

Payments

Inventory

Customers

Affiliates

Commissions

Withdrawals

Reports

Support

Settings

Do not create separate pages for every small operation.

Use detail views, drawers, tabs, and modals where appropriate.

**35. ADMIN DASHBOARD**

The dashboard should display:

Today\'s Sales

Total Revenue

Successful Orders

Pending Payments

Available Voucher Stock

Active Affiliates

Pending Withdrawals

Charts:

-   Sales over time.

-   Sales by product.

-   Sales by channel.

-   Affiliate performance.

**36. ADMIN ORDERS**

Admin should be able to:

-   Search order.

-   Filter by status.

-   Filter by product.

-   Filter by channel.

-   View order details.

-   View payment.

-   View fulfillment.

-   View affiliate attribution.

-   View voucher allocation.

Admin should not casually expose voucher PINs.

Sensitive actions require explicit authorization.

**37. ADMIN PAYMENTS**

Admin should see:

-   Payment reference.

-   Order.

-   Customer.

-   Amount.

-   Payment provider.

-   Method.

-   Status.

-   Date.

Possible actions:

-   View.

-   Verify.

-   Investigate.

-   Refund where authorized.

**38. ADMIN INVENTORY**

Inventory page should include:

Product

Batch

Total

Available

Reserved

Sold

Status

Actions:

Import Stock

View Batch

View Inventory

Destructive operations should require elevated permissions.

**39. ADMIN AFFILIATES**

Admin should be able to:

-   View affiliates.

-   Review applications.

-   Approve.

-   Reject.

-   Suspend.

-   Reactivate.

-   Change commission configuration where authorized.

-   View sales.

-   View commissions.

-   View withdrawals.

**40. ADMIN WITHDRAWALS**

Admin can:

View Pending

Review Affiliate

Review Amount

Approve

Reject

Process

Mark Paid

Every action is logged.

**41. REPORTING**

Phase 1 reports:

**Sales**

-   Daily.

-   Weekly.

-   Monthly.

**Products**

-   WASSCE sales.

-   BECE sales.

**Channels**

-   Website.

-   USSD.

**Inventory**

-   Stock remaining.

-   Stock sold.

**Affiliates**

-   Top affiliates.

-   Sales.

-   Commissions.

**Financial**

-   Gross sales.

-   Payments.

-   Refunds.

-   Affiliate commissions.

**42. NOTIFICATIONS**

Customers should receive:

**Purchase Confirmation**

After payment.

**Voucher Delivery**

After successful fulfillment.

**Payment Failure**

If payment fails.

**Refund**

When refund is processed.

**Account Notifications**

For account security.

Channels:

Email

SMS

In-App

USSD customers should primarily receive SMS notifications.

**43. CUSTOMER SUPPORT**

Customers should be able to contact support through:

-   Website support form.

-   Email.

-   Phone/WhatsApp if implemented operationally.

The admin dashboard should provide a basic support ticket system.

Support staff should be able to search by:

-   Order reference.

-   Phone.

-   Email.

**44. SECURITY REQUIREMENTS**

Mandatory:

-   HTTPS.

-   Secure password hashing.

-   Input validation.

-   Rate limiting.

-   CSRF protection where applicable.

-   Secure cookies.

-   Authentication expiry.

-   RBAC.

-   MFA for admins.

-   Database encryption at rest where supported.

-   Voucher PIN encryption.

-   Secret management.

-   Webhook signature verification.

**45. FRAUD PREVENTION**

Monitor:

-   Multiple failed payment attempts.

-   Unusual transaction frequency.

-   High-volume purchases.

-   Suspicious affiliate activity.

-   Repeated account creation.

-   Abnormal withdrawals.

-   Repeated voucher access.

Potential risk states:

NORMAL

REVIEW

BLOCKED

Risk controls should not unnecessarily prevent legitimate customers.

**46. API DESIGN**

API base:

/api/v1

Authentication:

/api/v1/auth

Products:

/api/v1/products

Orders:

/api/v1/orders

Payments:

/api/v1/payments

Vouchers:

/api/v1/vouchers

Affiliates:

/api/v1/affiliates

USSD:

/api/v1/ussd

Admin:

/api/v1/admin

Webhooks:

/api/v1/webhooks

**47. CORE CUSTOMER ENDPOINTS**

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/forgot-password

GET /products

POST /orders

GET /orders/:reference

POST /payments/initiate

GET /account/orders

GET /account/vouchers

GET /account/profile

PATCH /account/profile

**48. AFFILIATE ENDPOINTS**

POST /affiliates/apply

GET /affiliates/me

GET /affiliates/dashboard

GET /affiliates/sales

GET /affiliates/commissions

GET /affiliates/withdrawals

POST /affiliates/withdrawals

**49. ADMIN ENDPOINTS**

GET /admin/dashboard

GET /admin/orders

GET /admin/orders/:id

GET /admin/payments

GET /admin/inventory

POST /admin/inventory/import

GET /admin/customers

GET /admin/affiliates

POST /admin/affiliates/:id/approve

POST /admin/affiliates/:id/reject

POST /admin/affiliates/:id/suspend

GET /admin/commissions

GET /admin/withdrawals

POST /admin/withdrawals/:id/approve

POST /admin/withdrawals/:id/reject

POST /admin/withdrawals/:id/mark-paid

GET /admin/reports

GET /admin/audit-logs

**50. WEBHOOK ENDPOINTS**

POST /webhooks/payments

POST /webhooks/ussd

Webhook processing must:

1.  Validate signature.

2.  Validate payload.

3.  Check event ID.

4.  Check whether already processed.

5.  Process event.

6.  Record result.

7.  Return successful response.

**51. API RESPONSE FORMAT**

Success:

{

\"success\": true,

\"message\": \"Order created successfully\",

\"data\": {}

}

Error:

{

\"success\": false,

\"error\": {

\"code\": \"PAYMENT_FAILED\",

\"message\": \"Payment could not be completed\"

}

}

Validation:

{

\"success\": false,

\"error\": {

\"code\": \"VALIDATION_ERROR\",

\"message\": \"Invalid request\",

\"fields\": {

\"phone\": \"Enter a valid phone number\"

}

}

}

**52. VALIDATION**

All external input must be validated.

Validate:

-   Email.

-   Phone.

-   Password.

-   Product ID.

-   Quantity.

-   Affiliate code.

-   Order reference.

-   Payment reference.

Validation should happen:

Frontend

\+

Backend

The backend remains authoritative.

**53. FRONTEND UX REQUIREMENTS**

The interface must prioritize:

-   Simplicity.

-   Speed.

-   Trust.

-   Mobile-first usability.

-   Clear payment status.

-   Clear voucher delivery.

The purchase process should require as few steps as possible.

Recommended:

Select Voucher

↓

Enter Details

↓

Pay

↓

Receive Voucher

**54. DESIGN SYSTEM**

Resulta should have its own product identity while remaining compatible with the Owelyn Holdings brand family.

The parent company identity:

Owelyn Navy

#0B1F33

Owelyn Emerald

#0F766E

Owelyn Gold

#C9A227

Soft Ivory

#F7F5EF

Charcoal

#1F2933

White

#FFFFFF

Resulta can use an adapted education-focused palette derived from the parent identity.

Typography:

Primary:

Manrope

Secondary:

Inter

**55. COMPONENT SYSTEM**

Create reusable components:

Button

Input

Select

Modal

Drawer

Card

Badge

Alert

Toast

Table

Pagination

Tabs

Dropdown

Form

EmptyState

LoadingState

ErrorState

The same components should be reused across customer and admin interfaces where appropriate.

**56. RESPONSIVE DESIGN**

The website must prioritize:

1.  Mobile.

2.  Tablet.

3.  Desktop.

The admin dashboard should prioritize:

1.  Desktop.

2.  Tablet.

3.  Mobile operational support.

The customer website must work well on low-to-mid-range Android devices.

**57. ACCESSIBILITY**

Implement:

-   Keyboard navigation.

-   Visible focus states.

-   Semantic HTML.

-   Proper labels.

-   Accessible forms.

-   Adequate contrast.

-   Screen-reader-friendly error messages.

**58. PERFORMANCE**

The website should optimize for Ghanaian mobile networks.

Requirements:

-   Compress images.

-   Minimize JavaScript.

-   Lazy-load noncritical content.

-   Optimize fonts.

-   Cache static resources.

-   Use CDN where appropriate.

The homepage should load quickly even on slower connections.

**59. TESTING STRATEGY**

Testing layers:

Unit Tests

Integration Tests

API Tests

Database Tests

End-to-End Tests

Security Tests

Performance Tests

User Acceptance Testing

**60. CRITICAL TEST SCENARIOS**

Test:

**Successful Purchase**

Customer

→ Order

→ Payment

→ Webhook

→ Voucher

→ Notification

**Failed Payment**

Payment Failed

→ No Voucher

→ Order remains unpaid

**Duplicate Webhook**

Webhook 1 → Process

Webhook 2 → Ignore

**Concurrent Purchase**

Two customers attempt to purchase the final voucher.

Expected:

Customer A → Voucher

Customer B → Out of Stock

No duplicate allocation.

**61. AFFILIATE TESTING**

Test:

Affiliate Link

→ Customer

→ Order

→ Commission

Also:

Invalid Affiliate

→ No Attribution

And:

Refunded Order

→ Commission Reversed

And:

Duplicate Webhook

→ No Duplicate Commission

**62. USSD TESTING**

Test:

-   Session starts.

-   Product selection.

-   Invalid input.

-   Timeout.

-   Payment initiation.

-   Payment success.

-   Payment failure.

-   SMS delivery.

-   Duplicate callbacks.

**63. SECURITY TESTING**

Test:

-   SQL injection.

-   XSS.

-   CSRF where applicable.

-   Authentication bypass.

-   Authorization bypass.

-   Rate-limit bypass.

-   IDOR.

-   Voucher access abuse.

-   Admin privilege escalation.

Especially test:

Can Customer A access Customer B\'s voucher?

The answer must always be **No**.

**64. DEPLOYMENT ARCHITECTURE**

Production:

Internet

↓

CDN / DNS

↓

Customer Website

↓

Backend API

↓

PostgreSQL

↓

Redis / Queue

External:

Payment Provider

USSD Provider

SMS Provider

Email Provider

**65. ENVIRONMENTS**

Maintain:

Development

Staging

Production

Environment variables should include:

DATABASE_URL

JWT_SECRET

ENCRYPTION_KEY

PAYMENT_PROVIDER_KEY

PAYMENT_PROVIDER_SECRET

USSD_PROVIDER_KEY

SMS_PROVIDER_KEY

EMAIL_PROVIDER_KEY

CLIENT_URL

Secrets must never be committed to Git.

**66. CI/CD**

Recommended workflow:

Developer

↓

Feature Branch

↓

Pull Request

↓

Automated Tests

↓

Code Review

↓

Merge

↓

Staging Deployment

↓

UAT

↓

Production Deployment

Production deployment should be controlled.

**67. DATABASE MIGRATIONS**

All database changes must use migrations.

Developers must not manually modify production schemas.

Example:

Create Migration

↓

Review

↓

Test

↓

Apply Staging

↓

Apply Production

Production migrations must be backward-compatible where possible.

**68. MONITORING**

Monitor:

**Application**

-   Error rate.

-   Response time.

-   CPU.

-   Memory.

**Payments**

-   Success rate.

-   Failure rate.

-   Webhook failures.

**Inventory**

-   Low stock.

-   Allocation failures.

**USSD**

-   Session errors.

-   Drop-offs.

**Notifications**

-   SMS failure.

-   Email failure.

**69. BACKUP**

Database:

-   Automated daily backups.

-   Point-in-time recovery where available.

-   Backup retention.

-   Restoration testing.

The team must periodically test:

Can we actually restore Resulta from a backup?

**70. DISASTER RECOVERY**

If the production application fails:

Detect

↓

Investigate

↓

Restore Service

↓

Verify Database

↓

Verify Payments

↓

Verify Voucher Inventory

↓

Resume Operations

The team should document recovery procedures before launch.

**71. DEVELOPMENT WORKFLOW**

Development should proceed in feature modules.

Example:

feature/authentication

feature/products

feature/inventory

feature/orders

feature/payments

feature/affiliates

feature/ussd

feature/admin

Avoid large unstructured commits.

**72. GIT STANDARDS**

Recommended:

main

develop

feature/\*

fix/\*

hotfix/\*

Commit examples:

feat: add voucher inventory import

fix: prevent duplicate voucher allocation

feat: add affiliate commission ledger

fix: handle duplicate payment webhook

**73. CODE QUALITY**

The project should use:

-   TypeScript strict mode.

-   ESLint.

-   Prettier.

-   Consistent naming.

-   Reusable services.

-   Centralized error handling.

-   Environment validation.

Avoid:

-   Hard-coded secrets.

-   Hard-coded product prices.

-   Business logic in UI components.

-   Duplicate payment logic.

-   Direct database calls from controllers.

**74. DEFINITION OF DONE**

A feature is not complete until:

Code Written

↓

Validation Added

↓

Unit Tests

↓

Integration Tests

↓

Error Handling

↓

Security Review

↓

UI Completed

↓

Responsive Tested

↓

Admin Operations Tested

↓

Documentation Updated

**75. PHASE 1 DEVELOPMENT ROADMAP**

**Sprint 1 --- Foundation**

Build:

-   Repository.

-   Backend.

-   Database.

-   Prisma.

-   Environment management.

-   Authentication foundation.

-   RBAC.

**Sprint 2 --- Products & Inventory**

Build:

-   Products.

-   Voucher batches.

-   Voucher import.

-   Encryption.

-   Inventory management.

Admin:

-   Inventory page.

**Sprint 3 --- Orders & Payments**

Build:

-   Orders.

-   Order items.

-   Payment integration.

-   Payment webhooks.

-   Idempotency.

Admin:

-   Orders.

-   Payments.

**Sprint 4 --- Voucher Fulfillment**

Build:

-   Automatic voucher allocation.

-   Secure voucher delivery.

-   Customer voucher access.

-   Order lookup.

**Sprint 5 --- Customer Website**

Build:

-   Homepage.

-   Buy Voucher.

-   Checkout.

-   Payment result.

-   Account.

-   Orders.

-   Vouchers.

-   Support.

**Sprint 6 --- Affiliate System**

Build:

-   Affiliate registration.

-   Application.

-   Approval.

-   Referral tracking.

-   Commission ledger.

-   Affiliate dashboard.

Admin:

-   Affiliate management.

-   Commission management.

**Sprint 7 --- Withdrawals**

Build:

-   Withdrawal requests.

-   Admin approval.

-   Payment processing.

-   Transaction tracking.

**Sprint 8 --- USSD**

Build:

-   USSD integration.

-   Product selection.

-   Order creation.

-   Payment initiation.

-   SMS notification.

**Sprint 9 --- Reporting & Support**

Build:

-   Sales analytics.

-   Inventory reports.

-   Affiliate reports.

-   Support tickets.

-   Audit logs.

**Sprint 10 --- Production Readiness**

Complete:

-   Security testing.

-   Performance testing.

-   UAT.

-   Monitoring.

-   Backups.

-   Disaster recovery.

-   Production deployment.

**76. FINAL PHASE 1 USER JOURNEY**

The completed system should support:

RESULTA

│

┌───────────┴────────────┐

│ │

WEBSITE USSD

│ │

▼ ▼

Select Voucher Select Voucher

│ │

▼ ▼

Checkout Create Order

│ │

▼ ▼

Payment Payment

│ │

└──────────┬─────────────┘

▼

Payment Verified

│

▼

Voucher Allocated

│

┌─────┴─────┐

│ │

▼ ▼

Website SMS

│

▼

Customer Access

Affiliate:

Affiliate

↓

Register

↓

Admin Approval

↓

Referral Link

↓

Customer Purchase

↓

Commission

↓

Withdrawal

Admin:

Admin

│

├── Orders

├── Payments

├── Inventory

├── Customers

├── Affiliates

├── Commissions

├── Withdrawals

├── Reports

└── Support

**77. NON-NEGOTIABLE SYSTEM RULES**

The following rules must be enforced throughout development.

**1.**

A payment must be verified before voucher fulfillment.

**2.**

A voucher can only be sold once.

**3.**

Duplicate payment webhooks must not create duplicate orders or vouchers.

**4.**

Duplicate commission records must be impossible.

**5.**

Customers must only access their own vouchers.

**6.**

Admins must only access functions permitted by their role.

**7.**

Voucher PINs must be encrypted at rest.

**8.**

Financial transactions must be auditable.

**9.**

Affiliate attribution must be stored on the order.

**10.**

Website and USSD must use the same core order and payment logic.

**11.**

Product prices must be controlled by the backend.

**12.**

Historical order prices must never change when product prices change.

**13.**

Payment success must not depend solely on frontend redirects.

**14.**

Voucher fulfillment failures must be recoverable without charging the customer again.

**15.**

Sensitive admin actions must be logged.

**78. FINAL SYSTEM DELIVERABLE**

At the end of Phase 1, the development team should deliver:

RESULTA

│

├── Customer Website

│

├── Customer Authentication

│

├── Voucher Purchase

│

├── Checkout

│

├── Payment Integration

│

├── Voucher Fulfillment

│

├── Customer Voucher Dashboard

│

├── Order Lookup

│

├── USSD Purchase

│

├── SMS/Email Notifications

│

├── Affiliate Registration

│

├── Affiliate Dashboard

│

├── Commission System

│

├── Affiliate Withdrawals

│

├── Admin Dashboard

│

├── Voucher Inventory Management

│

├── Payment Management

│

├── Order Management

│

├── Affiliate Management

│

├── Customer Management

│

├── Reports

│

├── Support

│

├── Audit Logs

│

├── Security Controls

│

├── Automated Tests

│

└── Production Deployment

**79. RECOMMENDED NEXT STEP**

The documentation set for Resulta now has a strong foundation:

1\. BUSINESS & PRODUCT CONCEPT

↓

2\. UX/UI & DESIGN SYSTEM

↓

3\. TECHNICAL ARCHITECTURE

↓

4\. DATABASE DESIGN

↓

5\. DEVELOPER IMPLEMENTATION DOCUMENTATION

The **next document I recommend producing is the *Resulta API Specification & Backend Contract***. Unlike this implementation document, it should be extremely precise and developer-facing, defining every endpoint with:

-   Method

-   URL

-   Authentication

-   Authorization

-   Request body

-   Query parameters

-   Validation

-   Success response

-   Error response

-   Database interaction

-   Business rules

-   Idempotency

-   Webhook behavior