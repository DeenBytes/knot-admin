import React from "react";
import clsx from "clsx"; // optional, but recommended for class merging

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  className = "",
  icon,
  ...props
}) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-light">
          <i className={icon}></i>
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          "w-full bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-black dark:text-lightwhite",
          "placeholder-light dark:placeholder-lightwhite  rounded-md py-3 pl-5 pr-5 transition-colors duration-200 ease-in-out",
          "focus:outline-none ",
          icon ? "pl-10" : "pl-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;
