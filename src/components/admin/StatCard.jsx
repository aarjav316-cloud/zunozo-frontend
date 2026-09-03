const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
      {icon && (
        <div className="flex items-center justify-between mb-2 sm:mb-4 text-zinc-400">
          {icon}
        </div>
      )}
      <div
        className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
        style={{ fontFamily: '"Geist", sans-serif' }}
      >
        {value}
      </div>
      <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
