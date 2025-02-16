import classNames from "classnames";
import styles from "./Button.module.scss";
import { Loader } from '../Loader/Loader';

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
