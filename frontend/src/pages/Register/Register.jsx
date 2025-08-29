import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import { validateEmail } from "../../utils/validateEmail";
import styles from "./Register.module.css";
import { registerUser } from "../../store/actions/authActions"; // from earlier step

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after register (or default)
  const from = location.state?.from?.pathname || "/dashboard";

  const { loading, error, token } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, from, navigate]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.username.trim() || form.username.trim().length < 2)
      return "Username is required (min 2 characters).";
    if (!validateEmail(form.email)) return "Please enter a valid email address.";
    if (!form.password || form.password.length < 8)
      return "Password must be at least 8 characters.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const v = validate();
    if (v) return setLocalError(v);

    try {
      await dispatch(
        registerUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        })
      ).unwrap();
      navigate('/login');
    } catch (errMsg) {
      setLocalError(String(errMsg || "Registration failed"));
    }
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Create account</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          <div className={styles.label}>Username</div>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="BookLover"
            className={styles.input}
            disabled={loading}
          />
        </label>

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
            placeholder="Minimum 8 characters"
            className={styles.input}
            disabled={loading}
          />
        </label>

        {(localError || error) && (
          <div className={styles.error}>{localError || error}</div>
        )}

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </form>
    </main>
  );
}
