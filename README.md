# Modern Property Management System

> **Design Credit:** The frontend experience was implemented based on a client-provided design reference(generated using GPT tools).

## 🚀 Overview

**RPR** is a high-performance, full-stack property management ecosystem designed to bridge the gap between landlords, tenants, and administrators. Built with a focus on visual excellence and operational efficiency, it provides a seamless interface for managing complex property portfolios, financial tracking, and maintenance workflows.

## 🎭 The Three Pillars (Roles)

The system is architected around three specialized portals, each tailored to a specific user persona:

### 1. 🏗️ Administrator Portal

The central command center for system-wide oversight.

- **System Overview:** High-level KPIs for properties, active tenancies, and maintenance issues.
- **Financial Analytics:** Comprehensive revenue breakdowns, collection rates, and monthly trends.
- **User Management:** Granular control over landlord and tenant profiles.
- **Global Documentation:** Management of contracts, notices, and legal filings with role-based visibility.

### 2. 🏠 Landlord Portal

A portfolio-centric dashboard for owners to track their investments.

- **Portfolio Tracking:** Real-time status of all properties (Let, Notice, Vacant).
- **Financial Summaries:** Net income tracking after deductions and management fees.
- **RTB Compliance:** Centralized tracking of RTB registration status across the portfolio.
- **Direct Oversight:** Quick access to maintenance issues and tenant status.

### 3. 🔑 Tenant Portal

A simplified, mobile-friendly interface for the ultimate resident experience.

- **Rent Management:** Clear visibility into payment schedules, next due dates, and historical receipts.
- **Maintenance Reporting:** One-click issue reporting with status updates from "Open" to "Resolved."
- **Document Access:** Easy access to lease agreements, inspection reports, and official notices.
- **Property Details:** Comprehensive overview of the tenancy, including landlord contact info.

## ✨ Key Features

- **💎 Premium Aesthetics:** Modern UI design utilizing glassmorphism, smooth transitions (Lenis), and a curated professional color palette.
- **📊 Real-time Analytics:** Interactive charts powered by Recharts for financial and operational data.
- **🛠️ Robust Maintenance Workflow:** End-to-end tracking of property issues with priority-based sorting.
- **📂 Intelligent Document Center:** Role-based visibility for various document types (Contracts, RTB Certs, Invoices, Notices).
- **📱 Fully Responsive:** Seamless transition from desktop power-user views to mobile-first tenant experiences.
- **🔒 Secure Authentication:** Token-based authentication system ensuring data privacy across all roles.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Smooth Scrolling:** [Lenis](https://github.com/darkroomengineering/lenis)
- **Notifications:** [SweetAlert2](https://sweetalert2.github.io/)
- **API Integration:** Custom `authenticatedFetch` utility for secure backend communication.
