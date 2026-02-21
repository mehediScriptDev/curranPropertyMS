import { Code, Layout } from "lucide-react";

export default function Process() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-slate-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-xl font-bold text-dark-900 mb-2">How We Work</h3>
          <p className="text-dark-500 mb-4">A simple, transparent process that keeps you in control.</p>
          <ol className="list-decimal list-inside space-y-2 text-dark-600">
            <li>Initial assessment</li>
            <li>Proposal & timeline</li>
            <li>Delivery & review</li>
            <li>Ongoing support</li>
          </ol>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-sm">
            <div className="flex gap-4 items-center mb-4">
              <Layout className="text-primary-600" />
              <div>
                <h4 className="font-semibold">Plan</h4>
                <p className="text-sm text-dark-500">Clear milestones and deliverables.</p>
              </div>
            </div>
            <div className="flex gap-4 items-center mb-4">
              <Code className="text-primary-600" />
              <div>
                <h4 className="font-semibold">Build</h4>
                <p className="text-sm text-dark-500">Fast, tested implementation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
