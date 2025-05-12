import { FaPlay, FaPause, FaEdit, FaTrash } from 'react-icons/fa';

const TrackItem = ({ 
  track, 
  currentlyPlaying, 
  onPlay, 
  onEdit, 
  onDelete 
}) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="track-item">
      <div className="track-cover">
        {track.cover_url ? (
          <img src={track.cover_url} alt={track.title} />
        ) : (
          <div className="cover-placeholder"></div>
        )}
      </div>
      
      <div className="track-info">
        <h3>{track.title}</h3>
        <p className="author">{track.author || 'Неизвестный исполнитель'}</p>
        <p className="duration">{formatDuration(track.duration)}</p>
        <p className="description">{track.description}</p>
        <div className="tags">
          {track.theme && <span className="theme">{track.theme}</span>}
          {track.subtheme && <span className="subtheme">{track.subtheme}</span>}
          <span className="visibility">{track.is_public ? 'Публичный' : 'Приватный'}</span>
        </div>
      </div>
      
      <div className="track-actions">
        <button 
          className="play-btn"
          onClick={() => onPlay(track)}
        >
          {currentlyPlaying === track.id ? <FaPause /> : <FaPlay />}
        </button>
        
        <button 
          className="edit-btn"
          onClick={() => onEdit(track)}
        >
          <FaEdit />
        </button>
        
        <button 
          className="delete-btn"
          onClick={() => onDelete(track.id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TrackItem;