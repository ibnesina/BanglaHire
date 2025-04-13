# bladerunners

<div align="center">
  
<p align="center"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://img.shields.io/badge/SonarCloud-Analysis-4E9BCD?style=for-the-badge&logo=sonarcloud&logoColor=white" alt="SonarCloud Analysis" width="250"> </a> </p>

<table style="border: none; border-collapse: collapse;">
 <tr style="border: none;"> 
 <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=alert_status" alt="Quality Gate Status"> </a> </td> 
 <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=ncloc" alt="Lines of Code"> </a> </td> 
 
 <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=vulnerabilities" alt="Vulnerabilities"> </a> </td>
  <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=code_smells" alt="Code Smells"> </a> </td> 
 
  </tr>

 <tr style="border: none;"> 
 <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=sqale_index" alt="Technical Debt"> </a> </td> 
 <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=duplicated_lines_density" alt="Duplicated Lines (%)"> </a> </td> 
   <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=coverage" alt="Coverage"> </a> </td> 
 <td style="border: none; padding: 5px;"> <a href="https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_bladerunners"> <img src="https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_bladerunners&metric=bugs" alt="Bugs"> </a> </td> 
 </tr>
</table>

</div>

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


## Docker
```bash
docker compose run --build --rm backend composer install --prefer-dist --no-scripts --no-dev --no-interaction

docker compose run --build --rm backend php artisan key:generate --force

docker compose run --build --rm backend php artisan migrate:fresh --seed

npm cache clean --force

docker compose run --build --rm frontend npm install

docker compose up --build --remove-orphans 

```
