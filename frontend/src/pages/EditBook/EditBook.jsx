import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./EditBook.module.css";
import { updateBook, fetchMyBooks } from "../../store/actions/bookActions";
import { selectBookById } from "../../store/reducers/bookReducer";

const CONDITIONS = ["new", "good", "fair", "poor"];

export default function EditBook() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select book by id from normalized store
  const book = useSelector((state) => selectBookById(state, id));
  const loading = useSelector((s) => s.books.loading || s.books.myLoading);
  const error = useSelector((s) => s.books.error || s.books.myError);

  // If the book isn't in the store (e.g., page refresh), load "my books"
  useEffect(() => {
    if (!book) {
      dispatch(fetchMyBooks());
    }
  }, [dispatch, book]);

  // Local form state initialized from book when available
  const [form, setForm] = useState({
    title: "",
    author: "",
    condition: "good",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        condition: book.condition || "good",
        imageUrl: book.imageUrl || "",
      });
    }
  }, [book]);

  const [localError, setLocalError] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.author.trim()) return "Author is required.";
    if (!CONDITIONS.includes(form.condition)) return "Invalid condition.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const v = validate();
    if (v) return setLocalError(v);

    try {
      await dispatch(
        updateBook({
          id,
          updates: {
            title: form.title.trim(),
            author: form.author.trim(),
            condition: form.condition,
            imageUrl: form.imageUrl.trim() || undefined,
          },
        })
      ).unwrap();
      navigate(`/books/${id}`, { replace: true });
    } catch (errMsg) {
      setLocalError(String(errMsg || "Failed to update book"));
    }
  };

  const goBack = () => navigate(-1);

  // Simple guard while loading or not found
  if (!book && (loading || !error)) {
    return (
      <main className={styles.wrapper}>
        <h1 className={styles.title}>Edit Book</h1>
        <p className={styles.muted}>Loading book...</p>
      </main>
    );
  }

  if (!book && error) {
    return (
      <main className={styles.wrapper}>
        <h1 className={styles.title}>Edit Book</h1>
        <p className={styles.error}>{error}</p>
        <Button variant="secondary" onClick={goBack}>Back</Button>
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Edit Book</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          <div className={styles.label}>Title</div>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className={styles.input}
            placeholder="The Pragmatic Programmer"
            disabled={loading}
          />
        </label>

        <label>
          <div className={styles.label}>Author</div>
          <input
            name="author"
            value={form.author}
            onChange={onChange}
            className={styles.input}
            placeholder="Andrew Hunt, David Thomas"
            disabled={loading}
          />
        </label>

        <label>
          <div className={styles.label}>Condition</div>
          <select
            name="condition"
            value={form.condition}
            onChange={onChange}
            className={styles.input}
            disabled={loading}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          <div className={styles.label}>Image URL</div>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={onChange}
            className={styles.input}
            placeholder="https://..."
            disabled={loading}
          />
        </label>

        {(localError || error) && <div className={styles.error}>{localError || error}</div>}

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={goBack}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
