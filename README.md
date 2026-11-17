# Little Bookshop

A frontend-only bookstore application built with **React, JavaScript, Vite, and plain CSS**. The application runs locally without requiring a backend, database, API keys, or environment variables.

## Getting Started

To run the project locally, follow these steps:

```bash
npm install
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## Demo Accounts

Choose either Customer or Admin when signing in or creating an account.

- **Customer:** Access customer pages, favorites, purchases, and account information.
- **Admin:** Access the shop dashboard and book management pages.

You can use any email address and password when signing in. Passwords are not validated or stored. Role selection is only a frontend demonstration feature and is not authenticated or secured by a server.

## Demo Data and Storage

The application stores the following information in your browser's `localStorage`:

- Books and categories
- Customer favorites
- Purchases and transaction history
- Profile information
- Shop and inventory updates

Customers can view their purchases under **Bought Books**, while administrators can view all customer purchases under **Sold Books** on the shop dashboard.

Demo data is stored locally in the current browser. It is not shared across browsers or devices and is not backed up. Clearing the browser's site data restores the initial sample catalogue.

## Payment Simulation

Book prices are displayed in **Ethiopian Birr (ETB)**.

Customer purchases are simulated using payment options such as:

- Telebirr
- CBE Birr
- Bank of Abyssinia (BOA)
- Amole
- HelloCash
- Other Ethiopian payment portals

All transactions are demonstrations only. No real payments are processed.

Successful demo purchases reduce the available local stock.

## Book Cover Images

Administrators can upload book cover images up to **1 MB** in size. Uploaded images are stored in the browser alongside the demo catalogue.

## Production Build

To create an optimized production build, run:

```bash
npm run build
```

## Project Information

**Project Name:** Little Bookshop  
**Repository:** Book-Shope-App  
**Technologies:** React, JavaScript, Vite, CSS

This project is intended for demonstration and learning purposes.