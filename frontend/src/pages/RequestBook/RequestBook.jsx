import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./RequestBook.module.css";
import { createRequest } from "../../store/actions/requestActions";

export default function RequestBook() {
  const { id: bookId } = useParams(); // book id from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await dispatch(createRequest({ bookId, note: note.trim() || undefined })).unwrap();
      navigate("/requests/mine", { replace: true });
    } catch (errMsg) {
      setError(String(errMsg || "Failed to send request"));
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => navigate(-1);

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Request this Book</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          <div className={styles.label}>Note (optional)</div>
          <textarea
            className={styles.textarea}
            rows={5}
            placeholder="Introduce yourself or propose a swap..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={submitting}
          />
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Request"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
