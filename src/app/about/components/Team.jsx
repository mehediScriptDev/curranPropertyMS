import Image from "next/image";

export default function Team() {
  const people = [
    { name: "Sarah McCann", role: "Managing Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
    { name: "James Curran", role: "Operations Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Aoife Kelly", role: "Head of Lettings", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
    { name: "David Murphy", role: "Compliance Manager", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  ];

  return (
    <section className="py-20 px-6 lg:px-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-dark-900 mb-10">Leadership Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {people.map((person) => (
            <div key={person.name} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src={person.image} alt={person.name} fill className="object-cover" sizes="128px" />
              </div>
              <h3 className="text-sm font-bold text-dark-900">{person.name}</h3>
              <p className="text-sm text-dark-500">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
