export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#FAF9F7] flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo animé */}
        <div className="relative">
          <div className="font-serif text-5xl font-semibold tracking-wider animate-pulse">
            Eva<span className="text-[#8B7355]">Styl</span>
          </div>
          <p className="text-xs text-[#8B8680] tracking-[0.3em] text-center mt-2">
            MODE & BIJOUX
          </p>
        </div>

        {/* Animation de chargement */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Cercle de chargement élégant */}
        <div className="relative w-16 h-16">
          <svg className="animate-spin" viewBox="0 0 50 50">
            <circle
              className="stroke-[#E8E0D5]"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="3"
            />
            <circle
              className="stroke-[#8B7355]"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="3"
              strokeDasharray="80, 200"
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
