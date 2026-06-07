"use client";

import Hero from "@/app/components/home/Hero";
import ServicesGrid from "@/app/components/home/Services";
import Why from "@/app/components/home/Why";
import Dashboard from "@/app/components/home/Dashboard";
import Process from "@/app/components/home/Process";
import DigitalExperience from "@/app/components/home/DigitalExperience";
import CTA from "@/app/components/home/CTA";


export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Why />
      <Dashboard />
      <Process />
      <DigitalExperience />
      <CTA />
    </>
  );
}
