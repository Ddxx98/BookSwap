import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./MyBooks.module.css";

import { fetchMyBooks } from "../../store/actions/bookActions";
import { selectAllBooks } from "../../store/reducers/bookReducer";

export default function MyBooks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allBooks = useSelector(selectAllBooks);
  const loading = useSelector((s) => s.books.myLoading || s.books.loading);
  const error = useSelector((s) => s.books.myError || s.books.error);
  const userId = useSelector((s) => s.auth?.user?.userId || s.auth?.user?.id);

  useEffect(() => {
    // Always refresh "mine" when landing here; adjust with staleness logic if desired
    dispatch(fetchMyBooks());
  }, [dispatch]);

  // If backend already filtered, this will just return all; else filter locally as a safety net
  const myBooks = useMemo(() => {
    if (!userId) return [];
    return allBooks.filter((b) => String(b.owner?._id || b.owner || b.userId) === String(userId));
  }, [allBooks, userId]);

  const goNew = () => navigate("/books/new");
  const openEdit = (id) => navigate(`/books/${id}/edit`);
  const openDetails = (id) => navigate(`/books/${id}`);

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Books</h1>
        <Button onClick={goNew}>Post a Book</Button>
      </header>

      {loading && <p className={styles.muted}>Loading your books...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && myBooks.length === 0 && (
        <div className={styles.empty}>
          <p>You haven’t posted any books yet.</p>
          <Button onClick={goNew} variant="secondary">Post your first book</Button>
        </div>
      )}

      {!loading && !error && myBooks.length > 0 && (
        <ul className={styles.grid}>
          {myBooks.map((b) => (
            <li key={b._id || b.id} className={styles.card}>
              <button className={styles.cardBody} onClick={() => openDetails(b._id || b.id)}>
                <div className={styles.thumb}>
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt={`${b.title} cover`} />
                  ) : (
                    <div className={styles.placeholder}>No Image</div>
                  )}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.bookTitle}>{b.title}</h3>
                  <p className={styles.author}>by {b.author}</p>
                  <p className={styles.meta}>Condition: {b.condition}</p>
                </div>
              </button>
              <div className={styles.row}>
                <Button variant="secondary" onClick={() => openEdit(b._id || b.id)}>Edit</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
