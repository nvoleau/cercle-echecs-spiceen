interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  light?: boolean
  centered?: boolean
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <p className="text-club-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">
        {label}
      </p>
      <h2
        className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
          light ? 'text-white' : 'text-club-dark'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base max-w-2xl ${centered ? 'mx-auto' : ''} ${
            light ? 'text-gray-300' : 'text-club-gray'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
