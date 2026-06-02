import Image from 'next/image';

const DOCS = [
  {
    img: '/images/doc-id-proof.png',
    title: 'ID Proof',
    desc: 'Aadhaar / PAN / Voter ID',
  },
  {
    img: '/images/doc-insurance.png',
    title: 'Insurance',
    desc: 'Valid vehicle insurance copy',
  },
  {
    img: '/images/doc-fir.png',
    title: 'FIR Copy',
    desc: 'Police FIR of stolen vehicle',
  },
  {
    img: '/images/doc-rc.png',
    title: 'RC Book',
    desc: 'Vehicle registration certificate',
  },
];

export function DocumentsRequired() {
  return (
    <section className="pt-2 pb-10 bg-white">
      <div className="container-app">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-10 h-0.5 rounded-full bg-primary-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Documents Required</h2>
          <span className="w-10 h-0.5 rounded-full bg-primary-300" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {DOCS.map((doc) => (
            <div key={doc.title} className="flex flex-col gap-2">
              <div className="w-full aspect-square rounded-xl bg-[#c9b8f5] relative overflow-hidden">
                <Image
                  src={doc.img}
                  alt={doc.title}
                  fill
                  className="object-cover object-center scale-[1.15]"
                  unoptimized
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-xs leading-snug">{doc.title}</p>
                <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
