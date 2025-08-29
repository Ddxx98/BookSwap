import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./BookDetails.module.css";

import { selectBookById } from "../../store/reducers/bookReducer";
import { deleteBook, fetchMyBooks } from "../../store/actions/bookActions";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const book = useSelector((state) => selectBookById(state, id));
  const loading = useSelector((s) => s.books.loading || s.books.myLoading);
  const error = useSelector((s) => s.books.error || s.books.myError);
  const userId = useSelector((s) => s.auth?.user?.userId || s.auth?.user?.id);

  // Load user's books if missing due to hard reload / direct link
  useEffect(() => {
    if (!book) dispatch(fetchMyBooks());
  }, [dispatch, book]);

  const isOwner = useMemo(() => {
    const ownerId = book?.owner?._id || book?.owner || book?.userId;
    return ownerId && userId && String(ownerId) === String(userId);
  }, [book, userId]);

  const [localError, setLocalError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleEdit = () => navigate(`/books/${id}/edit`);
  const handleDelete = async () => {
    setLocalError("");
    setConfirming(false);
    try {
      await dispatch(deleteBook(id)).unwrap();
      navigate("/books/mine", { replace: true });
    } catch (errMsg) {
      setLocalError(String(errMsg || "Failed to delete book"));
    }
  };

  const goBack = () => navigate(-1);

  if (!book && (loading || !error)) {
    return (
      <main className={styles.wrapper}>
        <p className={styles.muted}>Loading book...</p>
      </main>
    );
  }

  if (!book && error) {
    return (
      <main className={styles.wrapper}>
        <p className={styles.error}>{error}</p>
        <Button variant="secondary" onClick={goBack}>Back</Button>
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <article className={styles.layout}>
        <div className={styles.media}>
          {book.imageUrl ? (
            <img src={book.imageUrl} alt={`${book.title} cover`} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>

          {book.description ? (
            <p className={styles.description}>{book.description}</p>
          ) : null}

          <ul className={styles.metaList}>
            <li><strong>Condition:</strong> {book.condition}</li>
            {book.owner?.username ? (
              <li><strong>Owner:</strong> {book.owner.username}</li>
            ) : null}
          </ul>

          {(localError || error) && (
            <div className={styles.error}>{localError || error}</div>
          )}

          <div className={styles.actions}>
            <Button variant="secondary" onClick={goBack}>Back</Button>

            {isOwner && (
              <>
                <Button onClick={handleEdit}>Edit</Button>
                {!confirming ? (
                  <Button variant="danger" onClick={() => setConfirming(true)}>Delete</Button>
                ) : (
                  <div className={styles.confirm}>
                    <span>Delete this book?</span>
                    <Button variant="danger" onClick={handleDelete}>Confirm</Button>
                    <Button variant="secondary" onClick={() => setConfirming(false)}>Cancel</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
