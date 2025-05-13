import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../public/logo.jpeg'; // Предполагается, что у вас есть файл логотипа
import './Navbar.css';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, loading, logout, checkAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Проверяем аутентификацию при изменении location
  useEffect(() => {
    checkAuth();
  }, [location, checkAuth]);

  const handleLoginLogout = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  // Не показываем navbar пока идет загрузка
  if (loading) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <img src={logo} alt="Логотип" height="60" />
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Главная
          </Link>
          <Link to="/media" className={`nav-link ${location.pathname === '/media' ? 'active' : ''}`}>
            Медиатека
          </Link>
          <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}>
            Галерея
          </Link>
          
          {/* Админские ссылки */}
          {user?.role == "admin" && (
            <>
              <Link to="/manage" className={`nav-link ${location.pathname === '/manage' ? 'active' : ''}`}>
                Управление
              </Link>
              <Link to="/map" className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}>
                Карта
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="navbar-right">
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
          О проекте
        </Link>
        <Link to="/feedback" className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}>
          Обратная связь
        </Link>
        <button onClick={handleLoginLogout} className="nav-auth-button">
          {user ? 'Выход' : 'Вход'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;