import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="header">
      <NavLink to="/" className="logo" onClick={closeMenu}>
        <span className="logo-mark">Q</span>
        QUESTLOG
      </NavLink>

      <button
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navigation ${menuOpen ? "is-open" : ""}`}>
        <NavLink to="/" end className="nav-link" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/about" className="nav-link" onClick={closeMenu}>About</NavLink>
        <NavLink to="/games" className="nav-link" onClick={closeMenu}>Games</NavLink>
        <NavLink to="/library" className="nav-link" onClick={closeMenu}>Library</NavLink>
        <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</NavLink>

        {!loading && (
          user ? (
            <>
              <NavLink to="/profile" className="nav-link" onClick={closeMenu}>Profile</NavLink>
              <button className="nav-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>Login</NavLink>
              <NavLink to="/signup" className="nav-link" onClick={closeMenu}>Signup</NavLink>
            </>
          )
        )}
      </nav>
    </header>
  );
}
