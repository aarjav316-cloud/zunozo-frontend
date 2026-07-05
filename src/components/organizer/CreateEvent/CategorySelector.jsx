const CategorySelector = ({ value, onChange, error }) => {
  const categories = [
    { value: "MUSIC", label: "Music", icon: "🎵" },
    { value: "COMEDY", label: "Comedy", icon: "😂" },
    { value: "SPORTS", label: "Sports", icon: "⚽" },
    { value: "RUN_CLUB", label: "Run Club", icon: "🏃" },
    { value: "HOUSE_PARTY", label: "House Party", icon: "🎉" },
    { value: "WORKSHOP", label: "Workshop", icon: "🛠️" },
    { value: "FOOD", label: "Food", icon: "🍕" },
    { value: "FESTIVAL", label: "Festival", icon: "🎪" },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Category
        <span className="text-rose-500 ml-1">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`p-4 rounded-xl border-2 transition-all ${
              value === category.value
                ? "border-[#6366F1] bg-[#6366F1]/10"
                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="text-sm font-medium text-white">
              {category.label}
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default CategorySelector;
