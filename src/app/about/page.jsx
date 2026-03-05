"use client";

import Hero from "./components/HeroSimple";
import Story from "./components/Story";
import Values from "./components/Values";
import Team from "./components/Team";
import CTA from "./components/CTA";

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Story />
      <Values />
      <Team />
      <CTA />
    </>
  );
}
