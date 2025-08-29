// src/pages/About/About.jsx
import React from "react";
import styles from "./About.module.css";

export default function About() {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>About</h1>
      <p>BookSwap is a community marketplace to exchange used books with a privacy-first flow.</p>
      <p>Post listings with title, author, condition, and image; request swaps; and manage everything in your dashboard.</p>
    </main>
  );
}
