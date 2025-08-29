import React from "react";
import styles from "./Button.module.css";

export default function Button({ children, variant = "primary", onClick, type = "button", disabled = false }) {
  const className = [styles.button, styles[variant], disabled ? styles.disabled : ""].join(" ").trim();
  return (
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
