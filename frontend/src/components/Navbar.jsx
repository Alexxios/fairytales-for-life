import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../public/logo.jpeg'; // Предполагается, что у вас есть файл логотипа
import './Navbar.css';

export function Navbar () {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Эмуляция проверки авторизации и прав администратора
  useEffect(() => {
    // В реальном приложении здесь бы был запрос к API или проверка токена
    const checkAuth = async () => {
      // Для демонстрации - случайные значения
      // В реальном приложении заменить на реальную проверку
      setIsAuth(Math.random() > 0.5);
      setIsAdmin(isAuth && Math.random() > 0.5);
    };

    checkAuth();
  }, [location]);

  const handleLoginLogout = () => {
    if (isAuth) {
      // Логика выхода
      setIsAuth(false);
      setIsAdmin(false);
      console.log('User logged out');
    } else {
      // Логика входа
      setIsAuth(true);
      // Случайно определяем, является ли пользователь админом после входа
      setIsAdmin(Math.random() > 0.5);
      console.log('User logged in');
    }
  };

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
          {isAdmin && (
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
        <button onClick={handleLoginLogout} className="auth-button">
          {isAuth ? 'Выход' : 'Вход'}
        </button>
      </div>
    </nav>
  );
};