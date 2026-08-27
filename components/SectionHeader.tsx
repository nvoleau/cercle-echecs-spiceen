interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  light?: boolean
  centered?: boolean
  as?: 'h1' | 'h2' | 'h3'
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
  centered = false,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {label && (
        <p className="text-club-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          {label}
        </p>
      )}
      <Heading
        className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
          light ? 'text-white' : 'text-club-dark'
        }`}
      >
        {title}
      </Heading>
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
