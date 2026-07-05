const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  rows,
  maxLength,
}) => {
  const InputComponent = type === "textarea" ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <InputComponent
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
          error ? "border-rose-500" : "border-zinc-800"
        }`}
      />
      {maxLength && (
        <p className="text-xs text-zinc-600 text-right">
          {value?.length || 0}/{maxLength}
        </p>
      )}
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default InputField;
