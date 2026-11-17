import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import {
  archiveBook, archiveCategory, buyBook, getBook, getBooks, getCategories, getFavorites,
  saveBook, saveCategory, toggleFavorite, updateStock,
} from './services/bookApi.js';
import { BookCover, BookCard, EmptyState, Field, LinkButton, Loading, Notice, PageHeading } from './components/UI.jsx';

function useBooks(options) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const includeArchived = Boolean(options?.includeArchived);
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBooks(await getBooks({ includeArchived }));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [includeArchived]);
  useEffect(() => { load(); }, [load]);
  return { books, setBooks, loading, error, reload: load, setError };
}

function AuthCard({ eyebrow, title, description, children, footer }) {
  return (
    <section className="auth-wrap">
      <div className="auth-art">
        <span className="art-sun">✳</span>
        <p className="eyebrow">A LITTLE SPACE TO BEGIN</p>
        <h2>Every good story starts somewhere.</h2>
        <p>Find your next favorite, one lovely page at a time.</p>
        <div className="art-book">read<br />more<span>✿</span></div>
      </div>
      <div className="auth-panel">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </section>
  );
}

export function HomePage() {
  const { books, loading, error } = useBooks({});
  const featuredBooks = books.slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">YOUR NEIGHBORHOOD BOOK NOOK</p>
          <h1>A little book<br />for a <em>big</em> feeling.</h1>
          <p className="hero-description">Thoughtful stories, well-loved classics, and your next favorite thing — waiting right here on the shelf.</p>
          <div className="hero-actions"><LinkButton to="/books">Wander the shelves <span>↗</span></LinkButton><Link to="/signup" className="quiet-link">Join our little club <span>→</span></Link></div>
          <div className="hero-note"><span className="avatar-stack"><i>J</i><i>M</i><i>A</i></span><span>Good books, shared by good people.</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of books and flowers">
          <div className="hero-sun" />
          <div className="flower flower-one">✿</div><div className="flower flower-two">✿</div>
          <div className="hero-book book-back"><span>THE<br />GARDEN</span></div>
          <div className="hero-book book-front"><span>little<br />stories</span><i>✷</i></div>
          <div className="hero-leaf">⌁</div>
          <span className="art-caption">a good story<br />changes everything</span>
        </div>
        <div className="hero-index">01 <span /> 03</div>
      </section>
      <section className="section-block">
        <div className="section-intro"><div><p className="eyebrow">PICKED WITH LOVE</p><h2>Little treasures<br />on our shelves.</h2></div><Link to="/books" className="quiet-link">See all the books <span>→</span></Link></div>
        <Notice>{error}</Notice>
        {loading ? <Loading label="Dusting off the shelves…" /> : featuredBooks.length
          ? <div className="book-grid">{featuredBooks.map((book) => <BookCard key={book.id} book={book} />)}</div>
          : <EmptyState title="The shelves are taking a little nap">Try again soon for new stories to discover.</EmptyState>}
        <p className="preview-note">Demo shelf data is saved in this browser.</p>
      </section>
      <section className="quote-band"><span>“</span><p>Books are a uniquely portable magic.</p><small>— Stephen King</small></section>
    </>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, loading, signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: 'customer' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && session && !loading && profile) {
      navigate(profile.role === 'admin' ? '/admin' : (location.state?.from || '/books'), { replace: true });
    }
  }, [submitted, session, loading, profile, navigate, location.state]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      signIn(form);
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard eyebrow="WELCOME BACK" title="Come on in." description="Sign in to find your spot on the bookshelf."
      footer={<>New around here? <Link to="/signup">Create a demo account</Link></>}>
      <Notice tone="info">Choose a demo account type below. Any email and password work; this role selection is only for the frontend demo.</Notice>
      <Notice>{error}</Notice>
      {submitted && <Notice tone="info">Checking your bookshop account…</Notice>}
      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Sign in as</span>
          <select name="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <Field label="Email address" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <div className="form-between"><span /> <Link className="small-link" to="/forgot-password">Forgot password?</Link></div>
        <button className="button button-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in to the shop'} <span>↗</span></button>
      </form>
    </AuthCard>
  );
}

export function SignUpPage() {
  const { createDemoAccount } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      createDemoAccount({ email: form.email, displayName: form.name.trim(), role: form.role });
      setMessage(`Your demo ${form.role} account is ready. You are now signed in.`);
      setForm({ name: '', email: '', password: '', role: 'customer' });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard eyebrow="MAKE YOURSELF AT HOME" title="Create an account." description="Choose a customer or admin demo profile to explore the bookshop."
      footer={<>Already part of the club? <Link to="/login">Sign in</Link></>}>
      <Notice>{error}</Notice><Notice tone="info">{message}</Notice>
      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Create account as</span>
          <select name="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <Field label="Your name" name="name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Field label="Email address" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Field label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <p className="field-hint">This demo does not store passwords. Your account is saved only in this browser.</p>
        <button className="button button-full" disabled={busy}>{busy ? 'Creating account…' : `Create my ${form.role} account`} <span>↗</span></button>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      setMessage(`Password reset is not part of this frontend demo. Sign in with any password${email ? ` for ${email}` : ''}.`);
    } catch (submitError) { setError(submitError.message); }
    finally { setBusy(false); }
  }
  return (
    <AuthCard eyebrow="A FRESH PAGE" title="Forgot your password?" description="We’ll send a reset link to the email address on your account." footer={<><Link to="/login">← Back to sign in</Link></>}>
      <Notice>{error}</Notice><Notice tone="info">{message}</Notice>
      <form className="form-stack" onSubmit={handleSubmit}><Field label="Email address" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="button button-full" disabled={busy}>{busy ? 'Sending…' : 'Show demo instructions'} <span>↗</span></button></form>
    </AuthCard>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function handleSubmit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      setMessage('Passwords are not stored in this frontend demo. Taking you to sign in…');
      window.setTimeout(() => navigate('/login'), 1600);
    } catch (submitError) { setError(submitError.message); }
    finally { setBusy(false); }
  }
  return (
    <AuthCard eyebrow="A NEW CHAPTER" title="Choose a new password." description="Make it something only you know." footer={<Link to="/login">← Back to sign in</Link>}>
      <Notice>{error}</Notice><Notice tone="info">{message}</Notice>
      <form className="form-stack" onSubmit={handleSubmit}><Field label="New password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="button button-full" disabled={busy}>{busy ? 'Saving…' : 'Continue'} <span>↗</span></button></form>
    </AuthCard>
  );
}

export function BooksPage() {
  const [search, setSearch] = useState('');
  const { books, loading, error } = useBooks({});
  const filteredBooks = books.filter((book) => `${book.title} ${book.author} ${book.category || ''}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <section className="content-page">
      <PageHeading eyebrow="TAKE YOUR TIME" title="The bookshelves." description="Find something familiar, or fall into a brand new story." />
      <label className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Search shop books" placeholder="Search the little bookshop…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <Notice>{error}</Notice>
      {loading ? <Loading label="Finding your next favorite…" /> : filteredBooks.length
        ? <div className="book-grid">{filteredBooks.map((book) => <BookCard key={book.id} book={book} />)}</div>
        : <EmptyState title="No books found">Try another title or author — the perfect story may be just around the corner.</EmptyState>}
    </section>
  );
}

export function BookDetailsPage() {
  const { bookId } = useParams();
  const { session, profile } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseBusy, setPurchaseBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getBook(bookId)
      .then((result) => { if (active) setBook(result); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [bookId]);

  useEffect(() => {
    if (!session?.user || profile?.role !== 'customer') return;
    getFavorites(session.user.id)
      .then((favorites) => setFavorite(favorites.some((item) => item.id === bookId)))
      .catch((requestError) => setFavoriteError(requestError.message));
  }, [bookId, session, profile]);

  async function handleFavorite() {
    setFavoriteBusy(true); setFavoriteError('');
    try {
      await toggleFavorite(session.user.id, book.id, favorite);
      setFavorite(!favorite);
    } catch (requestError) { setFavoriteError(requestError.message); }
    finally { setFavoriteBusy(false); }
  }

  async function handleBuy() {
    setPurchaseBusy(true);
    setPurchaseError('');
    setPurchaseMessage('');
    try {
      setBook(await buyBook(book.id));
      const method = paymentMethod === 'card' ? 'demo card' : 'cash on delivery';
      setPurchaseMessage(`Demo purchase complete with ${method}. One copy has been removed from local inventory. No real payment was processed.`);
    } catch (requestError) {
      setPurchaseError(requestError.message);
    } finally {
      setPurchaseBusy(false);
    }
  }

  if (loading) return <Loading label="Turning to the right page…" />;
  if (error) return <section className="content-page"><Notice>{error}</Notice></section>;
  if (!book) return <EmptyState title="We couldn't find that book">It may have wandered off the shelf.</EmptyState>;

  return (
    <section className="content-page">
      <Link to="/books" className="back-link">← Back to the bookshelves</Link>
      <article className="detail-layout">
        <div className="detail-cover"><BookCover book={book} /></div>
        <div className="detail-copy">
          <p className="eyebrow">{book.category || book.categories?.name || 'A LITTLE BOOKSHOP FIND'}</p>
          <h1>{book.title}</h1><p className="detail-author">by {book.author}</p>
          <p className="detail-description">{book.description || 'A lovely story is waiting inside. Pick up a copy and find out where it takes you.'}</p>
          <div className="detail-price"><strong>${Number(book.price || 0).toFixed(2)}</strong><span>{book.stock > 0 ? `${book.stock} on the shelf` : 'Currently out of stock'}</span></div>
          {profile?.role === 'customer' && book.stock > 0 && <>
            <label className="field payment-method">
              <span>Payment method</span>
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option value="card">Card (demo only)</option>
                <option value="cash">Cash on delivery (demo)</option>
              </select>
            </label>
            <p className="field-hint">Demo payment options only. No card details or real payments are collected.</p>
            <div className="button-row detail-actions"><button className="button" onClick={handleBuy} disabled={purchaseBusy}>{purchaseBusy ? 'Processing…' : 'Buy this book'}</button><button className="button button-secondary" onClick={handleFavorite} disabled={favoriteBusy}>{favoriteBusy ? 'Saving…' : (favorite ? '♥ Saved to favorites' : '♡ Save to favorites')}</button></div>
          </>}
          {profile?.role === 'customer' && book.stock < 1 && <Notice tone="info">This book is out of stock right now.</Notice>}
          <Notice tone="success">{purchaseMessage}</Notice>
          {purchaseError && <Notice>{purchaseError}</Notice>}
          {favoriteError && <Notice>{favoriteError}</Notice>}
          {!session && <p className="field-hint"><Link to="/login">Sign in as a customer</Link> to buy or save this book.</p>}
        </div>
      </article>
    </section>
  );
}

export function FavoritesPage() {
  const { session } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    getFavorites(session.user.id)
      .then(setBooks).catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [session]);
  return (
    <section className="content-page">
      <PageHeading eyebrow="KEEP THESE CLOSE" title="Your saved stories." description="The books you want to come back to." />
      <Notice>{error}</Notice>
      {loading ? <Loading label="Gathering your favorites…" /> : books.length
        ? <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} />)}</div>
        : <EmptyState title="Your shelf is waiting for a favorite." action={<LinkButton to="/books">Browse the books</LinkButton>}>Save a book and it’ll be right here when you’re ready.</EmptyState>}
    </section>
  );
}

export function AccountPage() {
  const { session, profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile.display_name || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function handleSubmit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      updateProfile(name.trim());
      setMessage('Your name is updated. Lovely.');
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }
  return (
    <section className="content-page narrow-page">
      <PageHeading eyebrow="YOUR LITTLE CORNER" title="My account." description="A few details about you and your place in the bookshop." />
      <div className="account-card">
        <p className="eyebrow">CUSTOMER PROFILE</p><p className="account-email">{session.user.email}</p>
        <Notice>{error}</Notice><Notice tone="success">{message}</Notice>
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="Display name" name="display_name" value={name} onChange={(event) => setName(event.target.value)} required />
          <label className="field"><span>Your role</span><input value="Customer" disabled /></label>
          <p className="field-hint">Your role is managed by the shop and can’t be changed here.</p>
          <button className="button" disabled={busy}>{busy ? 'Saving…' : 'Save my details'} <span>↗</span></button>
        </form>
      </div>
    </section>
  );
}

function AdminNav() {
  return <nav className="admin-nav" aria-label="Bookshop management"><Link to="/admin">Overview</Link><Link to="/admin/books">Books</Link><Link to="/admin/categories">Categories</Link><Link to="/admin/inventory">Inventory</Link></nav>;
}

export function AdminDashboardPage() {
  const { books, loading, error } = useBooks({ includeArchived: true });
  const { profile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');
  useEffect(() => { getCategories({ includeArchived: true }).then(setCategories).catch((requestError) => setCategoryError(requestError.message)); }, []);
  const activeBooks = books.filter((book) => !book.is_archived);
  const totalStock = activeBooks.reduce((total, book) => total + Number(book.stock || 0), 0);
  return (
    <section className="content-page">
      <PageHeading eyebrow="THE LITTLE SHOP DESK" title={`Hello, ${profile.display_name || 'shopkeeper'}.`} description="A quick look at how your bookshop is doing today." />
      <AdminNav />
      <Notice>{error || categoryError}</Notice>
      {loading ? <Loading /> : <div className="stats-grid"><div className="stat-card"><span>ACTIVE BOOKS</span><strong>{activeBooks.length}</strong><small>Stories on your shelves</small></div><div className="stat-card"><span>CATEGORIES</span><strong>{categories.filter((item) => !item.is_archived).length}</strong><small>Ways to find a story</small></div><div className="stat-card"><span>BOOKS IN STOCK</span><strong>{totalStock}</strong><small>Copies ready to find a reader</small></div></div>}
      <div className="admin-welcome"><div><p className="eyebrow">A FRIENDLY REMINDER</p><h2>Little details make a lovely shop.</h2><p className="muted">Keep your catalogue tidy, your categories clear, and your stock up to date.</p></div><LinkButton to="/admin/books">Manage books <span>↗</span></LinkButton></div>
    </section>
  );
}

const emptyBook = { title: '', author: '', category_id: '', description: '', cover_url: '', price: '', stock: 0 };
const maxCoverSize = 1024 * 1024;

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('The selected image could not be read.'));
    };
    reader.onerror = () => reject(new Error('The selected image could not be read.'));
    reader.readAsDataURL(file);
  });
}

export function AdminBooksPage() {
  const { books, loading, error, reload, setError } = useBooks({ includeArchived: true });
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { getCategories().then(setCategories).catch((requestError) => setError(requestError.message)); }, [setError]);

  function editBook(book) {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, category_id: book.category_id || '', description: book.description || '', cover_url: book.cover_url || '', price: book.price ?? '', stock: book.stock ?? 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function selectCover(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file for the book cover.');
      return;
    }
    if (file.size > maxCoverSize) {
      setError('Choose an image smaller than 1 MB so it can be saved in this browser.');
      return;
    }
    try {
      const coverUrl = await readImageFile(file);
      setForm((currentForm) => ({ ...currentForm, cover_url: coverUrl }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      await saveBook({ ...form, id: editingId, price: Number(form.price), stock: Number(form.stock), category_id: form.category_id || null, is_archived: false });
      setMessage(editingId ? 'Book details updated.' : 'A new book is on the shelf.');
      setForm(emptyBook); setEditingId(null); await reload();
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }
  async function archive(book) {
    setError(''); setMessage('');
    try { await archiveBook(book.id, !book.is_archived); setMessage(book.is_archived ? 'Book restored to the shelves.' : 'Book archived. It remains in the catalogue for records.'); await reload(); }
    catch (requestError) { setError(requestError.message); }
  }
  return (
    <section className="content-page">
      <PageHeading eyebrow="SHOP DESK · CATALOGUE" title="Manage books." description="Add a new story or keep the details on your shelves up to date." />
      <AdminNav />
      <Notice>{error}</Notice><Notice tone="success">{message}</Notice>
      <div className="admin-split">
        <form className="editor-card form-stack" onSubmit={submit}>
          <div><p className="eyebrow">{editingId ? 'EDIT A BOOK' : 'ADD TO THE SHELF'}</p><h2>{editingId ? 'Update this book.' : 'A new little treasure.'}</h2></div>
          <Field label="Book title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <Field label="Author" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required />
          <label className="field"><span>Category</span><select value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="field"><span>Description</span><textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <label className="field"><span>Choose cover image</span><input type="file" accept="image/*" onChange={selectCover} /></label>
          <p className="field-hint">Upload an image under 1 MB, or enter a cover image URL below.</p>
          <Field label="Cover image URL" type="url" value={form.cover_url.startsWith('data:') ? '' : form.cover_url} onChange={(event) => setForm({ ...form, cover_url: event.target.value })} />
          {form.cover_url && <div className="cover-upload-preview"><div className="cover-upload-thumbnail"><BookCover key={form.cover_url} book={{ title: form.title || 'Cover preview', cover_url: form.cover_url }} /></div><button type="button" className="plain-button" onClick={() => setForm({ ...form, cover_url: '' })}>Remove cover</button></div>}
          <div className="field-row"><Field label="Price ($)" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /><Field label="Copies in stock" type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></div>
          <div className="button-row"><button className="button" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Add book'} <span>↗</span></button>{editingId && <button type="button" className="plain-button" onClick={() => { setEditingId(null); setForm(emptyBook); }}>Cancel</button>}</div>
        </form>
        <div className="admin-list-wrap"><h2>Books in the catalogue <span>{books.length}</span></h2>
          {loading ? <Loading /> : books.length ? <div className="admin-list">{books.map((book) => <article className={`admin-book-row ${book.is_archived ? 'is-archived' : ''}`} key={book.id}><BookCover book={book} /><div className="admin-book-copy"><strong>{book.title}</strong><span>{book.author}</span><small>${Number(book.price || 0).toFixed(2)} · {book.stock} copies · {book.categories?.name || book.category || 'No category'}{book.is_archived ? ' · Archived' : ''}</small></div><div className="row-actions"><button className="plain-button" onClick={() => editBook(book)}>Edit</button><button className="plain-button archive-button" onClick={() => archive(book)}>{book.is_archived ? 'Restore' : 'Archive'}</button></div></article>)}</div> : <EmptyState title="No books just yet">Add the first title using the form.</EmptyState>}
        </div>
      </div>
    </section>
  );
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const reload = async () => setCategories(await getCategories({ includeArchived: true }));
  useEffect(() => { reload().catch((requestError) => setError(requestError.message)); }, []);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      await saveCategory({ id: editingId, name: form.name.trim(), description: form.description.trim(), is_archived: false });
      setMessage(editingId ? 'Category updated.' : 'Category added to the shelves.');
      setForm({ name: '', description: '' }); setEditingId(null); await reload();
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }
  async function archive(category) {
    setError(''); setMessage('');
    try { await archiveCategory(category.id, !category.is_archived); setMessage(category.is_archived ? 'Category restored.' : 'Category archived.'); await reload(); }
    catch (requestError) { setError(requestError.message); }
  }
  return (
    <section className="content-page">
      <PageHeading eyebrow="SHOP DESK · ORGANIZE" title="Manage categories." description="A few thoughtful categories make finding a good book easier." />
      <AdminNav />
      <Notice>{error}</Notice><Notice tone="success">{message}</Notice>
      <div className="admin-split category-split">
        <form className="editor-card form-stack" onSubmit={submit}><div><p className="eyebrow">{editingId ? 'EDIT CATEGORY' : 'MAKE A LITTLE SPACE'}</p><h2>{editingId ? 'Rename a category.' : 'Add a category.'}</h2></div><Field label="Category name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><label className="field"><span>Description</span><textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><div className="button-row"><button className="button" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save category' : 'Add category'} <span>↗</span></button>{editingId && <button type="button" className="plain-button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}>Cancel</button>}</div></form>
        <div className="category-list"><h2>Your categories</h2>{categories.map((category) => <article className={`category-row ${category.is_archived ? 'is-archived' : ''}`} key={category.id}><div><strong>{category.name}</strong><span>{category.description || (category.is_archived ? 'Archived category' : 'A little home for good books')}</span></div><button className="plain-button" onClick={() => { setEditingId(category.id); setForm({ name: category.name, description: category.description || '' }); }}>Edit</button><button className="plain-button archive-button" onClick={() => archive(category)}>{category.is_archived ? 'Restore' : 'Archive'}</button></article>)}{!categories.length && <EmptyState title="No categories yet">Add your first category to organize the shelves.</EmptyState>}</div>
      </div>
    </section>
  );
}

export function AdminInventoryPage() {
  const { books, loading, error, reload, setError } = useBooks({ includeArchived: true });
  const [stockEdits, setStockEdits] = useState({});
  const [message, setMessage] = useState('');
  const [savingId, setSavingId] = useState('');
  async function save(book) {
    const stock = Number(stockEdits[book.id] ?? book.stock);
    if (!Number.isInteger(stock) || stock < 0) { setError('Stock must be a whole number of zero or more.'); return; }
    setSavingId(book.id); setError(''); setMessage('');
    try { await updateStock(book.id, stock); setMessage(`Stock updated for “${book.title}”.`); await reload(); }
    catch (requestError) { setError(requestError.message); }
    finally { setSavingId(''); }
  }
  const lowStock = useMemo(() => books.filter((book) => !book.is_archived && book.stock <= 3).length, [books]);
  return (
    <section className="content-page">
      <PageHeading eyebrow="SHOP DESK · STOCKROOM" title="Inventory." description="Keep an eye on how many copies are ready to find a home." />
      <AdminNav />
      <Notice>{error}</Notice><Notice tone="success">{message}</Notice>
      <div className="inventory-summary"><span>ON THE SHELF</span><strong>{books.filter((book) => !book.is_archived).reduce((sum, book) => sum + Number(book.stock || 0), 0)} copies</strong><span className="stock-alert">{lowStock} {lowStock === 1 ? 'title' : 'titles'} running low</span></div>
      {loading ? <Loading /> : books.length ? <div className="inventory-table-wrap"><table className="inventory-table"><thead><tr><th>Book</th><th>Category</th><th>Availability</th><th>Copies</th><th>Update</th></tr></thead><tbody>{books.map((book) => <tr key={book.id} className={book.is_archived ? 'is-archived' : ''}><td><strong>{book.title}</strong><span>{book.author}{book.is_archived ? ' · Archived' : ''}</span></td><td>{book.categories?.name || book.category || '—'}</td><td><span className={`stock-pill ${book.stock <= 3 ? 'stock-low' : ''}`}>{book.stock <= 0 ? 'Out of stock' : book.stock <= 3 ? 'Running low' : 'In stock'}</span></td><td><input aria-label={`Copies in stock for ${book.title}`} type="number" min="0" step="1" value={stockEdits[book.id] ?? book.stock} onChange={(event) => setStockEdits({ ...stockEdits, [book.id]: event.target.value })} /></td><td><button className="plain-button" disabled={savingId === book.id} onClick={() => save(book)}>{savingId === book.id ? 'Saving…' : 'Save'}</button></td></tr>)}</tbody></table></div> : <EmptyState title="No stock to count yet">Add your first book to start tracking inventory.</EmptyState>}
    </section>
  );
}

export function NotFoundPage() {
  return <section className="content-page"><EmptyState title="This page turned up blank." action={<LinkButton to="/">Back to the bookshop</LinkButton>}>We can’t find that little corner of the shop.</EmptyState></section>;
}
