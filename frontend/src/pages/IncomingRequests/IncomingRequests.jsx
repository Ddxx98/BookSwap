import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./IncomingRequests.module.css";

import { fetchIncomingRequests, updateRequestStatus } from "../../store/actions/requestActions";
import { selectAllRequests } from "../../store/reducers/requestReducer";

const getId = (v) => (v && (v._id || v.id)) || v;
const getName = (u) => (u && (u.username || u.name || u.email)) || "User";

export default function IncomingRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requests = useSelector(selectAllRequests);
  const loading = useSelector((s) => s.requests.incomingLoading);
  const error = useSelector((s) => s.requests.incomingError);

  const [actionError, setActionError] = useState("");
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    dispatch(fetchIncomingRequests());
  }, [dispatch]);

  const sorted = useMemo(() => {
    const arr = [...requests];
    // pending first, then accepted, then rejected; newest first within each
    const order = { pending: 0, accepted: 1, rejected: 2 };
    return arr.sort((a, b) => {
      const s = (order[a.status] ?? 9) - (order[b.status] ?? 9);
      if (s !== 0) return s;
      const at = new Date(a.updatedAt || a.createdAt).getTime();
      const bt = new Date(b.updatedAt || b.createdAt).getTime();
      return bt - at;
    });
  }, [requests]);

  const onUpdate = async (id, status) => {
    setActionError("");
    setActingId(id);
    try {
      await dispatch(updateRequestStatus({ id, status })).unwrap();
    } catch (errMsg) {
      setActionError(String(errMsg || "Failed to update request"));
    } finally {
      setActingId(null);
    }
  };

  const goMyRequests = () => navigate("/requests/mine");

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Incoming Requests</h1>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={goMyRequests}>My Requests</Button>
        </div>
      </header>

      {loading && <p className={styles.muted}>Loading incoming requests...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {!loading && !error && sorted.length === 0 && (
        <div className={styles.empty}>
          <p>No incoming requests right now.</p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <ul className={styles.list}>
          {sorted.map((r) => {
            const reqId = r._id || r.id;
            const bookId = getId(r.bookId);
            const fromUserId = getId(r.fromUserId);
            return (
              <li key={reqId} className={styles.item}>
                <div className={styles.row}>
                  <div className={styles.colInfo}>
                    <div className={styles.topLine}>
                      <span className={`${styles.badge} ${styles[`status_${r.status}`]}`}>
                        {r.status}
                      </span>
                      <span className={styles.time}>
                        {new Date(r.updatedAt || r.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className={styles.title}>
                      <Link to={`/books/${bookId}`}>{r.bookId?.title || "View Book"}</Link>
                    </div>

                    <div className={styles.line}>
                      From:{" "}
                      <Link to={`/users/${fromUserId}`}>{getName(r.fromUserId)}</Link>
                    </div>

                    {r.note && <p className={styles.note}>{r.note}</p>}
                  </div>

                  <div className={styles.colActions}>
                    {r.status === "pending" ? (
                      <div className={styles.btns}>
                        <Button
                          size="sm"
                          onClick={() => onUpdate(reqId, "accepted")}
                          disabled={actingId === reqId}
                        >
                          {actingId === reqId ? "Accepting..." : "Accept"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onUpdate(reqId, "rejected")}
                          disabled={actingId === reqId}
                        >
                          {actingId === reqId ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    ) : (
                      <span className={styles.stateText}>
                        {r.status === "accepted" ? "Accepted" : "Rejected"}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/books/${bookId}`)}
                    >
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
