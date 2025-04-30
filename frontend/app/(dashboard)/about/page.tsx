"use client";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">About BanglaHire</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="mb-4">
            <strong>BanglaHire</strong> is a cutting-edge freelancing platform designed to empower the thriving community of Bangladeshi freelancers 🇧🇩. It seamlessly connects talented professionals with clients through a secure, feature-rich environment that simplifies collaboration and builds trust.
          </p>
          <p className="mb-4">
            Whether you're a <strong>Client</strong> looking to get work done or a <strong>Freelancer</strong> seeking new opportunities. Tailored specifically for Bangladesh, BanglaHire integrates local payment gateways and cultural workflows, making it the go-to platform for freelance work in the region.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">👥 Team</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-medium mb-3">Project Mentor</h3>
          <p className="mb-4">Shadman Ahmed</p>
          
          <h3 className="text-xl font-medium mb-3">Developers</h3>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Team Leader</td>
                <td className="border p-2">Md. Ibne Sina</td>
              </tr>
              <tr>
                <td className="border p-2">Developer</td>
                <td className="border p-2">Pantho Haque</td>
              </tr>
              <tr>
                <td className="border p-2">Developer</td>
                <td className="border p-2">Doniel Tripura</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">✨ Features</h2>
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b pb-4 md:border-b-0 md:pb-0">
            <h3 className="text-xl font-medium mb-2">🔐 Secure Authentication</h3>
            <p>Registration, login, email verification, password reset, and role-based access for Clients and Freelancers.</p>
          </div>
          <div className="border-b pb-4 md:border-b-0 md:pb-0">
            <h3 className="text-xl font-medium mb-2">👤 Comprehensive Profiles</h3>
            <p>Freelancer profiles include skills, experience, hourly rate, certifications, and portfolio links—fully editable and searchable.</p>
          </div>
          <div className="border-b pb-4 md:border-b-0 md:pb-0">
            <h3 className="text-xl font-medium mb-2">💼 Project Marketplace</h3>
            <p>Clients can post projects, define milestones, and manage bids. Freelancers can submit proposals, negotiate terms, and accept offers.</p>
          </div>
          <div className="border-b pb-4 md:border-b-0 md:pb-0">
            <h3 className="text-xl font-medium mb-2">🤖 Smart Talent Matching</h3>
            <p>SQL-driven logic suggests the most suitable freelancers for each job based on skills, availability, and performance history.</p>
          </div>
          <div className="border-b pb-4 md:border-b-0 md:pb-0">
            <h3 className="text-xl font-medium mb-2">💬 Real-Time Messaging</h3>
            <p>Built-in chat system for seamless communication between clients and freelancers, including read receipts and timestamps.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">💰 Escrow Payment System</h3>
            <p>Secure, milestone-based payment handling with SSLCommerz and Stripe integration. Funds are released only upon client approval.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🛠 Tech Stack</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">🎨 Frontend</h3>
              <p>Next.js, React, Tailwind CSS</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">🛠 Backend</h3>
              <p>Laravel, PHP 8.2, Sanctum</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">🗄️ Database</h3>
              <p>MySQL, Eloquent ORM</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">💳 Payments</h3>
              <p>SSLCommerz, Stripe SDK</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
