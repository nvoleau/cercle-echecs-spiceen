export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-club-gold border-t-transparent animate-spin" />
        <p className="text-club-gray text-sm font-medium">Chargement…</p>
      </div>
    </div>
  )
}
