SWAG — Full Deploy Package
-------------------------

Folders:
- public/    => front-end static files (index.html, styles.css, app.js, admin.html, product.html, cart.html)
- server/    => Node/Express server (API + optional Stripe endpoint)
- Dockerfile => builds server with public files
- docker-compose.yml => convenience compose to run app

Quick start (local docker):
1) unzip package
2) set environment variables in .env file (example below) or pass to docker
   - ADMIN_PASSWORD (default: swagmoneyfinesser)
   - STRIPE_SECRET_KEY (optional, for live checkout)
   - STRIPE_PUBLISHABLE_KEY (optional, for client)
3) run:
   docker compose up --build

Local dev without docker:
1) cd server
2) npm install
3) ADMIN_PASSWORD=swagmoneyfinesser STRIPE_SECRET_KEY=sk_test... node server.js
4) visit http://localhost:3000

Stripe:
- The server includes a placeholder /create-checkout-session route that expects STRIPE_SECRET_KEY.
- Do not commit your secret key. Use environment variables.

Banner & UI:
- Added a top banner showing the logo and a promotional message.
- Improved UI spacing, card hover, and accessible buttons.

If you want, I can:
- Deploy this to Render or Railway for you (you will need to provide deployment consent and secrets).
- Add image upload handling (S3 or local), or add a CMS.