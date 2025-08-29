import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import { validateEmail } from "../../utils/validateEmail";
import styles from "./Login.module.css";
import { loginUser } from "../../store/actions/authActions"; // assumes file from earlier step

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login (default to dashboard)
  const from = location.state?.from?.pathname || "/dashboard";

  const { loading, error, token } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  // If already authenticated, redirect away from Login
  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, from, navigate]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!validateEmail(form.email)) return "Please enter a valid email address.";
    if (!form.password) return "Password is required.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const v = validate();
    if (v) return setLocalError(v);

    try {
      // unwrap gives either payload on success or throws the error payload
      await dispatch(loginUser({ email: form.email, password: form.password })).unwrap(); // [12]
      navigate(from, { replace: true });
    } catch (errMsg) {
      // errMsg comes from rejectWithValue in thunk
      setLocalError(String(errMsg || "Login failed"));
    }
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Login</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          <div className={styles.label}>Email</div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="user@example.com"
            className={styles.input}
            disabled={loading}
          />
        </label>

        <label>
          <div className={styles.label}>Password</div>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            className={styles.input}
            disabled={loading}
          />
        </label>

        {(localError || error) && (
          <div className={styles.error}>{localError || error}</div>
        )}

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Link to="/register" className={styles.link}>
            Create account
          </Link>
        </div>
      </form>
    </main>
  );
}
