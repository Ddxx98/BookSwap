import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Books.module.css";
import Button from "../../components/Button/Button";

import { selectAllBooks } from "../../store/reducers/bookReducer";
import { fetchBooks } from "../../store/actions/bookActions";

export default function Books() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const books = useSelector(selectAllBooks);
  const loading = useSelector((s) => s.books.loading);
  const error = useSelector((s) => s.books.error);
  const authUserId = useSelector((s) => s.auth?.user?.userId || s.auth?.user?.id);

  useEffect(() => {
    if (!books || books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books]);

  const openDetails = (id) => navigate(`/books/${id}`);
  const goNew = () => navigate("/books/new");
  const goRequest = (id) => navigate(`/books/${id}/request`);

  // Helper: get owner id whether populated or raw
  const getOwnerId = (owner) => (owner && (owner._id || owner.id)) || owner;

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Browse Books</h1>
        <Button onClick={goNew} variant="secondary">Post a Book</Button>
      </header>

      {loading && <p className={styles.muted}>Loading books...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <ul className={styles.grid}>
          {books.map((b) => {
            const id = b._id || b.id;
            const ownerId = getOwnerId(b.owner);
            const isOwnBook = authUserId && ownerId && String(ownerId) === String(authUserId);

            return (
              <li
                key={id}
                className={styles.card}
                onClick={() => openDetails(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") openDetails(id); }}
              >
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

                  <div className={styles.row}>
                    {!isOwnBook && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          goRequest(id);
                        }}
                      >
                        Request
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && !error && books.length === 0 && (
        <p className={styles.muted}>No books yet. Be the first to post!</p>
      )}
    </main>
  );
}
