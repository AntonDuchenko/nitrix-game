import classNames from "classnames";
import { Loader } from "../Loader/Loader";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  loading = false,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className={classNames(styles.btn, className)}
      {...props}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};
