type Props = {
  id: string;
  title: string;
  subtitle?: string;
  /** Override bottom margin on the wrapper. Defaults to mb-6 with subtitle, mb-2 without. */
  mb?: string;
};

export function SectionHeading({ id, title, subtitle, mb }: Props) {
  const marginClass = mb ?? (subtitle ? 'mb-6' : 'mb-2');
  return (
    <div className={marginClass}>
      <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-900">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
