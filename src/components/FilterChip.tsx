interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export function FilterChip({ label, isSelected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
        isSelected
          ? 'bg-green-500 text-black font-semibold'
          : 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
      }`}
    >
      {label}
    </button>
  )
}
