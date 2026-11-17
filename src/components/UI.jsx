import { useState } from 'react';
import { Link } from 'react-router-dom';

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ children, tone = 'error' }) {
  if (!children) return null;
  return <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function Loading({ label = 'A moment, please…' }) {
  return <div className="loading" role="status"><span className="spinner" />{label}</div>;
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">✦</span>
      <h2>{title}</h2>
      <p className="muted">{children}</p>
      {action}
    </div>
  );
}

export function BookCover({ book, className = '' }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`book-cover ${className}`}>
      {book.cover_url && !failed
        ? <img src={book.cover_url} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setFailed(true)} />
        : <div className="cover-placeholder"><span>Little<br />Bookshop</span><strong>{book.title}</strong></div>}
    </div>
  );
}

export function BookCard({ book }) {
  return (
    <article className="book-card">
      <Link to={`/books/${book.id}`} className="book-card-cover" aria-label={`View ${book.title}`}>
        <BookCover book={book} />
        <span className="cover-badge">{book.category || book.categories?.name || 'A good read'}</span>
      </Link>
      <div className="book-card-info">
        <p className="book-author">{book.author}</p>
        <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
        <div className="book-card-bottom">
          <strong>${Number(book.price || 0).toFixed(2)}</strong>
          <span>{book.stock > 0 ? 'In the shop' : 'Out of stock'}</span>
        </div>
      </div>
    </article>
  );
}

export function Field({ label, name, value, onChange, type = 'text', required = false, ...props }) {
  return (
    <label className="field">
      <span>{label}{required && <span className="required"> *</span>}</span>
      <input name={name} value={value} onChange={onChange} type={type} required={required} {...props} />
    </label>
  );
}

export function LinkButton({ to, children, secondary = false, ...props }) {
  return <Link className={`button ${secondary ? 'button-secondary' : ''}`} to={to} {...props}>{children}</Link>;
}
