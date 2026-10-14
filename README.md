# Geethu's Corner 🍰

A full-stack cake ordering website for a real home bakery.

🔗 Live: https://geethuscorner.vercel.app

## Features
**Customers:** browse menu · cart · checkout (delivery or pickup, date and time slot,
cash/UPI on delivery) · order tracking · cancel pending orders · custom cake requests · reviews

**Admin:** orders dashboard with status updates · manage cakes and photos ·
holidays and daily order limit · custom request replies · customer list · sales summary

## Tech stack
| Layer    | Tech |
|----------|------|
| Frontend | React (Vite), React Router, plain CSS — hosted on Vercel |
| Backend  | Java, Spring Boot, Spring Security (JWT), Spring Data JPA — Render (Docker) |
| Database | PostgreSQL on Supabase · photos in Supabase Storage |

## How it works
React → REST API (JWT in the Authorization header) → Spring Boot → PostgreSQL

## Security highlights
- Passwords hashed with BCrypt; stateless JWT login; roles CUSTOMER / ADMIN
- Order totals calculated on the server from database prices, never trusted from the browser
- Customers can only see or cancel their own orders
- Input validation on every form; clean error messages; secrets only in environment variables

## Run locally
1. backend/.env: DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET
   (optional: SUPABASE_URL, SUPABASE_SECRET_KEY, SHOW_SQL=true)
2. Backend: cd backend → ./mvnw spring-boot:run (port 8080)
3. Frontend: cd Frountend/frontend → npm install → npm run dev (port 5173)

## Screenshots
![Home](docs/screenshots/home.png)
![Admin dashboard](docs/screenshots/admin.png)
