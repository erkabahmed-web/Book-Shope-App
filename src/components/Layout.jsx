import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function SiteLayout() {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Little Bookshop home">
          <span className="brand-mark">lb</span>
          <span>little bookshop<small>a little joy, one page at a time</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/books">The shelves</NavLink>
          {profile?.role === 'customer' && <NavLink to="/favorites">Saved books</NavLink>}
          {profile?.role === 'customer' && <NavLink to="/account">My account</NavLink>}
          {profile?.role === 'admin' && <NavLink to="/admin">Shop desk</NavLink>}
        </nav>
        <div className="nav-actions">
          {session
            ? <button className="text-button" onClick={handleSignOut}>Sign out</button>
            : <Link className="button button-small" to="/login">Sign in <span aria-hidden="true">↗</span></Link>}
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="site-footer">
        <Link className="footer-brand" to="/">little bookshop <span>✿</span></Link>
        <p>Made for slow mornings and one-more-chapter nights.</p>
        <span>© {new Date().getFullYear()} Little Bookshop</span>
      </footer>
    </div>
  );
}
