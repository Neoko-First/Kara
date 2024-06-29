import React, { useId, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const InputField = ({
  label,
  name = label, // par défaut le name = label
  type = "text", // par défaut c'est text
  placeholder,
  nota,
  register,
  onChange,
  value,
  error,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const id = useId();

  if (!label) {
    throw new Error("Un label est requis pour le composant InputField !");
  }

  return (
    <div className="flex flex-col w-full gap-[5px]">
      <label htmlFor={id} className="w-fit font-bold">
        {label}
        {required && <span className="text-secondary">&nbsp;*</span>}
      </label>
      <div className="w-full flex relative">
        <input
          className={`w-full input input-bordered input-secondary flex items-center gap-2 ${
            error && "invalid"
          }`}
          style={{ paddingRight: type === "password" && "60px" }}
          type={showPassword ? "text" : type}
          name={name}
          id={id}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="h-full absolute right-[1rem] rounded-[1rem]"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {nota && <p className="text-sm opacity-70">{nota}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InputField;
