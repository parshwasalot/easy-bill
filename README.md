# 🧾 Easy Bill - React Native Expo App

**Internship Project Duration:** 19th May 2025 – 19th June 2025 (Mon–Fri)  
**Platform:** Android (Not yet published to Play Store)  
**Backend:** Firebase (Authentication, Firestore, Storage, Hosting)  
**Frontend:** React Native (Expo)  
**Status:** Development Completed ✅

---

## 📱 Overview

**Easy Bill** is a billing and analytics application designed for small shopkeepers to quickly generate, manage, and share bills via WhatsApp. The app streamlines the entire billing workflow — from selecting products to generating secure digital bills and sharing them instantly with customers.

---

## 🧭 App Flow

1. Shopkeeper types a customer mobile number.
2. If the customer exists, their name auto-fills; otherwise, they can register them.
3. Shopkeeper selects a product category (Saree, Dress, Suit-Piece), adds an optional description, price, and quantity.
4. Total is auto-calculated in real-time.
5. Selects payment method: **Cash** or **UPI**.
   - If UPI is selected, a dynamic QR is shown for that amount.
6. On clicking **Generate Bill**, a **secure URL** is generated and sent via **WhatsApp** directly to the customer.
7. Bill can be viewed on a dedicated hosted website using the secure URL.

---

## 📂 Screens Overview

| Screen                | Description |
|----------------------|-------------|
| **Billing**           | Core screen to create a new bill with product, payment, and customer details. |
| **Customer List**     | Shows list of all customers; tapping a name shows their bill history. |
| **Customer Detail**   | View previous bills of a selected customer. |
| **Analytics**         | View income, bill count, item count, and category-wise breakdown for any date range. |
| **Bill History**      | Full list of generated bills, filterable by customer or date. |
| **Shop Details**      | Add/edit shop name, logo, address, GST number, UPI ID — used on every bill. |
| **Bin**               | Soft-deleted bills; restore or permanently delete. |
| **Edit Bill**         | Modify bill details before sending (if not shared yet). |

---

## 🧰 Technologies Used

- **React Native (Expo)**
- **Firebase**
  - Authentication
  - Firestore (Real-time DB)
  - Storage (for shop logo)
  - Hosting (for bill web rendering)
- **WhatsApp Deep Linking API**
- **UPI QR Code Generation (Dynamic)**

---

## 🔐 Security Features

- Unique external bill ID (different from internal Firestore ID) for secure public sharing.
- Firestore rules ensure access only to shopkeeper’s own data.
- Firebase-hosted bill pages are rendered securely via mapped external IDs.

---

## 🌐 Bill Website

Each bill has a publicly accessible web version (read-only) that includes:
- Shop and customer details
- Purchased items and totals
- Payment mode (Cash/UPI)
- Shop logo and contact
- Secure, unguessable URL

---

## 🚫 Limitations

- Currently Android-only (no iOS build).
- APK not yet published on Play Store.
- No offline mode implemented yet.
- No Figma/wireframe used – development was directly on code.

---

## 📝 Future Scope

- Add offline caching & sync.
- Deploy to Play Store.
- Add customer insights (purchase patterns).
- Multi-language support for vernacular users.
- Admin dashboard (web) for shopkeepers.

---

## 🧪 Testing

- All features tested on physical Android devices.
- WhatsApp integration tested with real numbers.
- QR code scanned using Google Pay, PhonePe, Paytm.
- Website tested on Chrome and mobile browsers.

---

## 🔗 Quick Links

- 🔒 [Secure Bill Viewer (Firebase Hosted)](https://yourdomain.com/bill/secure-id)
- 📂 Sample APK: _Not Published Yet_
- 🛠️ Firebase Console: _Project is private_

---

## 📃 License

This project is for educational and internship demonstration purposes only. Not licensed for commercial distribution.

---

## 🙋‍♂️ Author

**Internship Project by:** Parshwa Salot 22IT135
**Date:** May–June 2025

