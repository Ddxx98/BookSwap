import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Header.module.css";
import { logout } from "../../store/reducers/authReducer"; // import from slice

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth?.token);
  const user = useSelector((s) => s.auth?.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>BookSwap</Link>

        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Dashboard
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            About
          </NavLink>

          <span className={styles.spacer} />

          {!token ? (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                Sign up
              </NavLink>
            </>
          ) : (
            <>
              {user?.username ? (
                <span className={styles.welcome}>Hi, {user.username}</span>
              ) : null}
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
