"use client";

import Hero from "./components/HeroSimple";
import Stats from "./components/Stats";
import Story from "./components/Story";
import Values from "./components/Values";
import Team from "./components/Team";
import CTA from "./components/CTA";

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Story />
      <Values />
      <Team />
      <CTA />
    </>
  );
}
