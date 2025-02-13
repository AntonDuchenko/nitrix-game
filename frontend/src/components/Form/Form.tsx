import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./Form.module.scss";
import { Link, useLocation, useNavigate } from "react-router";
import { login, registration } from "../../utils/api/auth";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../Button/Button";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

export const Form = () => {
  const { login: authenticate } = useAuth();
  const path = useLocation().pathname;
  const isLogin = path === "/login";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      if (isLogin) {
        await login({ email: data.email, password: data.password });
        authenticate();

        navigate("/game");
      } else {
        await registration({
          email: data.email,
          password: data.password,
        });

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

        <Button loading={loading} type="submit">
          Sign in
        </Button>
      </form>

      <span className={styles.text}>
        {isLogin ? (
          <>
            Don’t have account? <Link to="/register">Create account</Link>
          </>
        ) : (
          <>
            Have an account? <Link to="/login">Login Now</Link>
          </>
        )}
      </span>
    </div>
  );
};
