import { useState } from "react";

const CustomSelect = ({ options, value, onChange, placeholder = 'Select Status' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option); // send value back to parent
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-48">
      <button
        onClick={(e) => {
          e.stopPropagation();   // ✅ Prevents event bubbling
          setIsOpen(!isOpen);
        }}
        type="button"            // ✅ Prevents it from acting like a submit button
        className="w-full py-3 pl-5 pr-5 text-left bg-white dark:bg-inputbg border border-lightborder dark:border-inputborder text-sm text-black dark:text-lightwhite rounded-lg focus:outline-none"
      >
        {value || placeholder}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <i className="ri-arrow-down-s-line"></i>
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full bg-white dark:bg-inputbg border border-inputborder rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()} // ✅ Prevents option clicks from bubbling
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white dark:hover:bg-[#333]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
