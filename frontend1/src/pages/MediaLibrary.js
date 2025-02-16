import React from "react";
import ReactPlayer from "react-player";
import "./MediaLibrary.css";
import brokenimage from "../images/brokenimage.png";

const MediaLibrary = () => {
  const items = [
    { id: 1, title: "Произведение", author: "Автор" },
    { id: 2, title: "Произведение", author: "Автор" },
    { id: 3, title: "Произведение", author: "Автор" },
  ];

  return (
    <div className="media-library">
      <nav className="navbar">
        <a href="#stories" className="nav-link">Сказки для жизни</a>
        <a href="#about" className="nav-link">О проекте</a>
        <a href="#contacts" className="nav-link">Контакты</a>
        <a href="#media" className="nav-link active">Медиатека</a>
        <a href="#feedback" className="nav-link">Обратная связь</a>
      </nav>
      <div className="media-content">
        <h1 className="media-title">Медиатека</h1>
        <ul className="media-list">
          {items.map((item) => (
            <li key={item.id} className="media-item">
              <img src={brokenimage} alt="Thumbnail" className="media-image" />
              <div className="media-text">
                <div className="media-title">{item.title}</div>
                <div className="media-author">{item.author}</div>
              </div>
              <button className="media-options">⋮</button>
            </li>
          ))}
        </ul>
      </div>
      <footer className="media-footer">
        <button className="footer-button play">▶</button>
        <button className="footer-button skip">⏭</button>
        <div className="footer-info">
          <img src={brokenimage} alt="Current" className="footer-image" />
          <div className="footer-text">
            <div className="footer-title">Произведение</div>
            <div className="footer-author">Автор</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MediaLibrary;
