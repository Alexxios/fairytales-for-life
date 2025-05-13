import React from 'react';
import './MusicLibrary.css';

const MusicLibrary = ({ libraryData }) => {
  // Получаем все группы (первый уровень вложенности)
  const groups = Object.keys(libraryData);

  // Рендер трека
  const renderTrack = (track) => (
    <div key={track.audio_url} className="track">
      <div className="track-icon">
        <MusicIcon />
      </div>
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        {track.author && <div className="track-author">{track.author}</div>}
        {track.description && (
          <div className="track-description">{track.description}</div>
        )}
      </div>
      {track.duration && (
        <div className="track-duration">
          {formatDuration(track.duration)}
        </div>
      )}
    </div>
  );

  // Рендер группы (жанр, автор и т.д.)
  const renderGroup = (groupName) => {
    const items = libraryData[groupName];
    
    // Проверяем, является ли группа массивом треков
    const isDirectTracks = Array.isArray(items);
    
    return (
      <div key={groupName} className="group">
        <h2 className="group-title">{groupName}</h2>
        <div className="divider"></div>
        
        {isDirectTracks ? (
          <div className="tracks-list">
            {items.map(renderTrack)}
          </div>
        ) : (
          // Если есть вложенные группы (например, поджанры)
          Object.keys(items).map(subGroup => (
            <div key={subGroup} className="subgroup">
              <h3 className="subgroup-title">{subGroup}</h3>
              <div className="tracks-list">
                {items[subGroup].map(renderTrack)}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="music-library">
      {groups.map(renderGroup)}
    </div>
  );
};

// Форматирование длительности
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Иконка музыки
const MusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18V5L21 3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default MusicLibrary;