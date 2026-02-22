export default function HeroStats() {
  const stats = [
    { value: "15+", label: "Years Experience", sub: "Since 2010" },
    { value: "560+", label: "Properties Managed", sub: "Across Ireland" },
    { value: "98%", label: "Client Retention", sub: "Year on year" },
    { value: "24/7", label: "Portal Access", sub: "Always online" },
  ];

  return (
    <div className="container mx-auto px-6 lg:px-16 relative z-30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ value, label, sub }) => (
          <div key={label} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[2.2rem] font-black text-primary-400 leading-none mb-1">{value}</div>
            <div className="text-sm font-semibold text-white mb-0.5">{label}</div>
            <div className="text-xs text-dark-400">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
