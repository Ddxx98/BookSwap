import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./NewBook.module.css";
import { createBook } from "../../store/actions/bookActions";

const CONDITIONS = ["new", "good", "fair", "poor"];

export default function NewBook() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creating = useSelector((s) => s.books.loading); // or a dedicated creating flag if you add one
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    condition: "good",
    imageUrl: "",
  });

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
    setError("");
    const v = validate();
    if (v) return setError(v);

    try {
      await dispatch(
        createBook({
          title: form.title.trim(),
          author: form.author.trim(),
          condition: form.condition,
          imageUrl: form.imageUrl.trim() || undefined,
        })
      ).unwrap();
      navigate("/books/mine", { replace: true });
    } catch (errMsg) {
      setError(String(errMsg || "Failed to create book"));
    }
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Post a Book</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          <div className={styles.label}>Title</div>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className={styles.input}
            placeholder="The Pragmatic Programmer"
            disabled={creating}
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
            disabled={creating}
          />
        </label>

        <label>
          <div className={styles.label}>Condition</div>
          <select
            name="condition"
            value={form.condition}
            onChange={onChange}
            className={styles.input}
            disabled={creating}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          <div className={styles.label}>Image URL (optional)</div>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={onChange}
            className={styles.input}
            placeholder="https://..."
            disabled={creating}
          />
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <Button type="submit" disabled={creating}>
            {creating ? "Posting..." : "Post Book"}
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
