"use client";

import Hero from "./components/home/Hero";
import ServicesGrid from "./components/home/Services";
import Why from "./components/home/Why";
import Dashboard from "./components/home/Dashboard";
import Process from "./components/home/Process";
import DigitalExperience from "./components/home/DigitalExperience";
import CTA from "./components/home/CTA";

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
