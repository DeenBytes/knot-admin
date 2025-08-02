import PropTypes from "prop-types";
import clsx from "clsx";

const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseStyle =
    "px-4 py-3 rounded-md font-medium transition-all duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-primary text-white dark:text-black hover:bg-opacity-80 hover:from-[#D8BC8E] hover:to-[#C5A572] shadow-lg hover:shadow-[0_0_20px_rgba(197,165,114,0.3)]",
    secondary:
      "bg-gray-800 text-gray-300 hover:text-primary hover:bg-gray-700",
    ghost: "bg-transparent text-primary hover:bg-gray-800",
    outline:
      "bg-transparent text-primary border border-primary hover:bg-primary hover:text-black",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        baseStyle,
        !disabled && variant && variants[variant], // only apply variant if not disabled
        {
          "opacity-50 cursor-not-allowed": disabled,
        },
        className // user styles always last
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost", "outline", null]),
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
