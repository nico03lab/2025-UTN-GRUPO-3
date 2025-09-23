export const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = false, options = null }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="select select-bordered w-full"
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input input-bordered w-full"
          required={required}
        />
      )}
    </div>
  );
};