const StatCard = ({ icon, label, value, color = "zinc" }) => {
  const colorClasses = {
    zinc: "text-zinc-400",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    rose: "text-rose-500",
  };

  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-zinc-500 text-sm font-medium">{label}</span>
        <div className={`${colorClasses[color]}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
