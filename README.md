# bladerunners

## Team Members

- ibnesina (Team Leader)
- Pantho-Haque
- MachangDoniel

## Mentor

- shadman-ahmed-bs23

## Project Description

**BanglaHire** is a freelancing platform designed for Bangladesh, supporting **local and global payments, AI-powered matching, and milestone-based escrow payments.** It enables **freelancers to showcase their skills and earn securely** while helping **clients manage projects seamlessly.** Key features include:

- **Freelancer and Client Profiles** with skills, portfolios, and verified payment methods.
- **Project Bidding & Management** with a Kanban-style tracker for milestones.
- **Secure Payment System** using **SSLCommerz (BDT) and Stripe (Global)** with escrow protection.
- **Real-time Chat & Video Conferencing** for seamless client-freelancer collaboration.
- **AI-Powered Matching & Proposal Assistance** to optimize hiring and bidding.
- **Gamification & Analytics Dashboard** for performance tracking and engagement.


```bash
docker compose run --build --rm backend composer install --prefer-dist --no-scripts --no-dev --no-interaction

docker compose run --build --rm backend php artisan key:generate --force

docker compose run --build --rm backend php artisan migrate:fresh --seed

npm cache clean --force

docker compose run --build --rm frontend npm install

docker compose up --build --remove-orphans 

```
