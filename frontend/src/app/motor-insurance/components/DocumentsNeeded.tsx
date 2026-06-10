import { CheckCircle2 } from 'lucide-react';
import { DOCUMENTS_NEEDED } from '../data';
import { SectionHeading } from './SectionHeading';

export function DocumentsNeeded() {
  return (
    <section className="pt-8 bg-white" aria-labelledby="docs-heading">
      <div className="container-app max-w-5xl">
        <SectionHeading id="docs-heading" title="Documents Needed for Insurance" mb="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOCUMENTS_NEEDED.map((doc) => (
            <div key={doc} className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 border border-gray-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700">{doc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
