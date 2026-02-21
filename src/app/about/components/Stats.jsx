export default function Stats() {
  return (
    <section className="py-14 px-6 lg:px-16 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[{ value: "15+", label: "Years Experience" }, { value: "560+", label: "Properties Managed" }, { value: "98%", label: "Client Retention" }, { value: "24/7", label: "Portal Access" }].map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-bold text-primary-600 mb-1">{s.value}</div>
            <div className="text-sm text-dark-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
