import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Dashboard.module.css";

// Import selectors created by createEntityAdapter in your books slice
// e.g., export const { selectAll: selectAllBooks } = booksAdapter.getSelectors((s) => s.books);
import { selectAllBooks } from "../../store/reducers/bookReducer";

export default function Dashboard() {
  const navigate = useNavigate();

  // Pull normalized list from the store using memoized adapter selectors
  const books = useSelector(selectAllBooks);

  // Lightweight derived stats
  const totalBooks = books.length;
  const newest = useMemo(() => books.slice(0, 5), [books]);

  const goMyBooks = () => navigate("/books/mine");
  const goIncoming = () => navigate("/requests/incoming");
  const goMyRequests = () => navigate("/requests/mine");

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Dashboard</h1>

      <section>
        <p>You have {totalBooks} books listed.</p>
      </section>

      <div className={styles.actions}>
        <Button onClick={goMyBooks}>My Books</Button>
        <Button variant="secondary" onClick={goIncoming}>Incoming Requests</Button>
        <Button variant="secondary" onClick={goMyRequests}>My Requests</Button>
      </div>

      <section style={{ marginTop: "1rem" }}>
        <h2>Recently Added</h2>
        {newest.length === 0 ? (
          <p>No books yet. Post the first one!</p>
        ) : (
          <ul>
            {newest.map((b) => (
              <li key={b._id || b.id}>
                {b.title} by {b.author} · {b.condition}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
