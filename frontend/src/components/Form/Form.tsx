import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./Form.module.scss";
import { useLocation } from "react-router";

type Inputs = {
  email: string;
  password: string;
};

export const Form = () => {
  const path = useLocation().pathname;
  const isLogin = path === "/login";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {isLogin ? "Welcome Back!" : "Register Here"}
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            placeholder="Enter email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email?.message && (
            <span className={styles.error}>{errors.email?.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            placeholder="Enter password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password?.message && (
            <span className={styles.error}>{errors.password?.message}</span>
          )}
        </div>

        <button type="submit">Sign in</button>
      </form>

      <span className={styles.text}>
        {isLogin ? (
          <>
            Don’t have account? <a href="/register">Create account</a>
          </>
        ) : (
          <>
            Have an account? <a href="/login">Login Now</a>
          </>
        )}
      </span>
    </div>
  );
};
