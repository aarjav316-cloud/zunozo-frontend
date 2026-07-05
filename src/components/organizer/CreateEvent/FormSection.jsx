const FormSection = ({ title, description, children }) => {
  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default FormSection;
