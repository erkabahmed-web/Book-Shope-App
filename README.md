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

Books, categories, favorites, profile details, and shop edits are saved in this browser's `localStorage`. They are not shared with other browsers and are not backed up. Clear the browser's site data to restore the initial sample catalogue.
Customer book purchases are simulated: choose a demo card or cash-on-delivery option. Purchases reduce local stock; no card details or real payments are collected.
Admins can upload book cover images up to 1 MB; the images are saved in this browser with the demo catalogue.

Run `npm run build` to create a production build.
