import { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioSrc, coverImage = null, title = "Title", author = "Author"}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    audioRef.current.currentTime += 10; // Пропускаем на 10 секунд вперед
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioSrc;
    link.download = `${title} - ${author}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioSrc} />
      
      {/* Прогресс-бар */}
      <div className="progress-container">
        <input
          type="range"
          className="progress-bar"
          value={progress}
          onChange={handleProgressChange}
        />
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="player-controls">
        {/* Кнопки управления */}
        <div className="controls-left">
          <button onClick={togglePlayPause} className="control-btn">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={skipForward} className="control-btn">
            ⏩
          </button>
        </div>
        
        {/* Обложка */}
        <div className="cover-image">
          <img src={coverImage} alt="Обложка трека" />
        </div>
        
        {/* Информация о треке - теперь слева от кнопки загрузки */}
        <div className="track-info">
          <h3 className="track-title">{title}</h3>
          <p className="track-author">{author}</p>
        </div>
        
        {/* Кнопка загрузки справа */}
        <button onClick={handleDownload} className="control-btn">
          ⭳
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;