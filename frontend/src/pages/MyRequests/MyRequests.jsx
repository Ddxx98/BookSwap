import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./MyRequests.module.css";

import { fetchMyRequests } from "../../store/actions/requestActions";
import { selectAllRequests } from "../../store/reducers/requestReducer";

export default function MyRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allRequests = useSelector(selectAllRequests);
  const loading = useSelector((s) => s.requests.myLoading);
  const error = useSelector((s) => s.requests.myError);

  useEffect(() => {
    dispatch(fetchMyRequests());
  }, [dispatch]);

  const goBrowse = () => navigate("/"); // or "/books"
  const goIncoming = () => navigate("/requests/incoming");

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Requests</h1>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={goIncoming}>Incoming Requests</Button>
          <Button onClick={goBrowse}>Browse Books</Button>
        </div>
      </header>

      {loading && <p className={styles.muted}>Loading requests...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && allRequests.length === 0 && (
        <div className={styles.empty}>
          <p>No requests sent yet.</p>
          <Button onClick={goBrowse} variant="secondary">Find a book to request</Button>
        </div>
      )}

      {!loading && !error && allRequests.length > 0 && (
        <ul className={styles.list}>
          {allRequests.map((r) => {
            const id = r._id || r.id;
            const bookId = r.bookId?._id || r.bookId; // populated or plain id
            return (
              <li key={id} className={styles.item}>
                <div className={styles.row}>
                  <div className={styles.colInfo}>
                    <div className={styles.topLine}>
                      <span className={styles.badge}>{r.status}</span>
                      <span className={styles.time}>
                        {new Date(r.updatedAt || r.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.title}>
                      <Link to={`/books/${bookId}`}>{r.bookId?.title || "View Book"}</Link>
                    </div>
                    {r.note && <p className={styles.note}>{r.note}</p>}
                  </div>
                  <div className={styles.colActions}>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/books/${bookId}`)}>
                      View Book
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
