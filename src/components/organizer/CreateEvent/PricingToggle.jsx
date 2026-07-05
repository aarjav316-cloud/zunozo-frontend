const PricingToggle = ({ isFree, onChange, price, onPriceChange, error }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-300">
        Pricing
        <span className="text-rose-500 ml-1">*</span>
      </label>

      {/* Toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
            isFree
              ? "border-[#6366F1] bg-[#6366F1]/10 text-white"
              : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
          }`}
        >
          Free Event
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
            !isFree
              ? "border-[#6366F1] bg-[#6366F1]/10 text-white"
              : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
          }`}
        >
          Paid Event
        </button>
      </div>

      {/* Price Input */}
      {!isFree && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            Price (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              ₹
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full pl-10 pr-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
                error ? "border-rose-500" : "border-zinc-800"
              }`}
            />
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default PricingToggle;
