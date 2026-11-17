import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/Layout.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import {
  AccountPage, AdminCategoriesPage, AdminDashboardPage, AdminInventoryPage,
  AdminBooksPage, BookDetailsPage, BooksPage, FavoritesPage, ForgotPasswordPage,
  PurchasesPage,
  HomePage, LoginPage, NotFoundPage, ResetPasswordPage, SignUpPage,
} from './pages.jsx';

function Protected({ role, children }) {
  return <RoleRoute role={role}>{children}</RoleRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:bookId" element={<BookDetailsPage />} />
        <Route path="favorites" element={<Protected role="customer"><FavoritesPage /></Protected>} />
        <Route path="purchases" element={<Protected role="customer"><PurchasesPage /></Protected>} />
        <Route path="account" element={<Protected role="customer"><AccountPage /></Protected>} />
        <Route path="admin" element={<Protected role="admin"><AdminDashboardPage /></Protected>} />
        <Route path="admin/books" element={<Protected role="admin"><AdminBooksPage /></Protected>} />
        <Route path="admin/categories" element={<Protected role="admin"><AdminCategoriesPage /></Protected>} />
        <Route path="admin/inventory" element={<Protected role="admin"><AdminInventoryPage /></Protected>} />
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}
