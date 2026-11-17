# Little Bookshop

A frontend-only bookstore demo built with React, JavaScript, Vite, and plain CSS. It runs locally without a backend, database, API keys, or environment variables.

## Run the demo

```bash
npm install
npm run dev
```

## Demo accounts

Choose Customer or Admin when signing in or creating an account:

- Customer: opens the customer pages, favorites, and account.
- Admin: opens the shop dashboard and management pages.

Use any email address and password when signing in. Passwords are not checked or stored. The role choice is only a frontend demo control; it is not authenticated or secured by a server.

## Demo data

Books, categories, favorites, purchases, profile details, and shop edits are saved in this browser's `localStorage`. Customers can see their purchases under **Bought books**; admins can see all purchases under **Sold books** on the shop dashboard. Demo data is not shared with other browsers and is not backed up. Clear the browser's site data to restore the initial sample catalogue.
Book prices display in Ethiopian Birr (ETB). Customer purchases are simulated with Telebirr, CBE Birr, BOA, Amole, HelloCash, or another Ethiopian payment portal as demo options. Purchases reduce local stock; no real payments are processed.
Admins can upload book cover images up to 1 MB; the images are saved in this browser with the demo catalogue.

Run `npm run build` to create a production build.
