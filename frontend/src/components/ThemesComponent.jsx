import React, { useState } from 'react';
import './ThemesComponent.css';

const ThemesComponent = ({ initialTheme }) => {
  const [themeStack, setThemeStack] = useState([initialTheme]);
  const currentTheme = themeStack[themeStack.length - 1];

  // Рендер элемента произведения
  const renderWorkItem = (work) => (
    <div key={work.id} className="work-item">
      <div className="work-icon">
        {work.icon || <DefaultIcon />}
      </div>
      <div className="work-title">{work.title}</div>
      <div className="work-author">{work.author}</div>
    </div>
  );

  // Рендер подтемы
  const renderSubtheme = (subtheme) => (
    <div 
      key={subtheme.id} 
      className="subtheme"
      onClick={() => handleSubthemeClick(subtheme)}
    >
      <h3 className="subtheme-title">{subtheme.title}</h3>
      <div className="divider"></div>
      <div className="subtheme-items-grid">
        {subtheme.subthemes?.map(item => (
          <div key={item.id} className="subtheme-item">
            {item.title}
          </div>
        ))}
        {subtheme.works?.map(item => (
          <div key={item.id} className="subtheme-item">
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );

  // Обработчик клика по подтеме
  const handleSubthemeClick = (subtheme) => {
    setThemeStack(prev => [...prev, subtheme]);
  };

  // Навигация назад
  const handleBackClick = () => {
    setThemeStack(prev => prev.slice(0, -1));
  };

  return (
    <div className="themes-container">
      {themeStack.length > 1 && (
        <button className="back-button" onClick={handleBackClick}>
          ← Назад
        </button>
      )}
      
      <h1 className="root-theme-title">{currentTheme.title}</h1>
      
      {currentTheme.subthemes?.length > 0 ? (
        <div className="subthemes-list">
          {currentTheme.subthemes.map(renderSubtheme)}
        </div>
      ) : (
        <div className="works-container">
          <div className="works-list">
            {currentTheme.works?.map(renderWorkItem)}
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ThemesComponent;