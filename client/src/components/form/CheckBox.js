import React from "react";

export default function CheckBox({
  label,
  name = label, // par défaut le name = label
  onChange,
  value,
  error,
  required,
  ...props
}) {
  return (
    <label className="label cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        className="checkbox checkbox-primary checkbox-xs"
      />
      {label && <span className="label-text">{label}</span>}
    </label>
  );
}
