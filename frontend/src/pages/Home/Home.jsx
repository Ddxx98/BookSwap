import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  const goBrowse = () => {
    navigate("/books"); // or "/books" if you later add a listing page
  };

  const goPost = () => {
    // Protected path (requires auth via ProtectedRoute)
    navigate("/books/new");
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Discover and Swap Used Books</h1>
        <p className={styles.subtitle}>
          Browse community listings, request swaps, and manage everything in your dashboard.
        </p>
        <div className={styles.actions}>
          <Button onClick={goBrowse}>Browse Books</Button>
          <Button variant="secondary" onClick={goPost}>Post a Book</Button>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why BookSwap?</h2>
        <ul className={styles.list}>
          <li>Save money and extend the life of books.</li>
          <li>Connect with nearby readers and hobbyists.</li>
          <li>Simple request workflow: pending → accepted/declined.</li>
        </ul>
      </section>
    </main>
  );
}
