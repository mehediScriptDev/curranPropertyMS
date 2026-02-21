import Image from "next/image";

export default function DigitalExperience() {
  return (
    <section className="py-16 px-6 lg:px-16">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-xl font-bold text-dark-900 mb-2">Digital Experience</h3>
          <p className="text-dark-500 mb-4">Design and tech that converts and delights.</p>
          <ul className="space-y-2 text-dark-600">
            <li>Responsive web design</li>
            <li>SEO-focused content</li>
            <li>Fast, accessible interactions</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image src="/images/digital-experience.png" alt="Digital Experience" width={520} height={360} className="rounded-lg shadow" />
        </div>
      </div>
    </section>
  );
}
