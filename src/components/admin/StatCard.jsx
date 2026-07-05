const StatCard = ({ icon, label, value, color = "zinc" }) => {
  const colorClasses = {
    zinc: "bg-zinc-900 border-zinc-800 text-zinc-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-500",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-xl p-6 transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-3 mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
};

export default StatCard;
