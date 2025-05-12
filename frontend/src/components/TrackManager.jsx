import { useState, useEffect } from 'react';
import api from '../api';
import { FaPlus } from 'react-icons/fa';
import TrackItem from './TrackItem';

const TrackManager = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: '',
    author: '',
    description: '',
    duration: 0,
    theme: '',
    subtheme: '',
    audio_url: '',
    cover_url: '',
    download_url: '',
    is_public: true,
    publisher_id: 1
  });

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await api.get('/tracks');
      
      // Добавляем проверку
      if (!Array.isArray(response.data)) {
        console.error('Ожидался массив треков, но получено:', response.data);
        setTracks([]); // Устанавливаем пустой массив в случае ошибки
        return;
      }
      
      setTracks(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setTracks([]); // Устанавливаем пустой массив в случае ошибки
    }
  };

  const handlePlay = (track) => {
    if (currentlyPlaying === track.id) {
      audio.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (audio) {
      audio.pause();
    }

    const newAudio = new Audio(track.audio_url);
    newAudio.play();
    setAudio(newAudio);
    setCurrentlyPlaying(track.id);
    
    newAudio.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот трек?')) {
      try {
        await api.delete(`/tracks/${id}`);
        setTracks(tracks.filter(track => track.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (track) => {
    setEditMode(true);
    setCurrentTrack(track);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentTrack({
      ...currentTrack,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/tracks/${currentTrack.id}`, currentTrack);
      } else {
        const response = await api.post('/tracks/upload', currentTrack);
        setTracks([...tracks, response.data]);
      }
      setEditMode(false);
      setCurrentTrack({
        title: '',
        author: '',
        description: '',
        duration: 0,
        theme: '',
        subtheme: '',
        audio_url: '',
        cover_url: '',
        download_url: '',
        is_public: true,
        publisher_id: 1
      });
      fetchTracks();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="track-manager">
      <h1>Управление треками</h1>
      
      <button 
        className="add-track-btn"
        onClick={() => {
          setEditMode(true);
          setCurrentTrack({
            title: '',
            author: '',
            description: '',
            duration: 0,
            theme: '',
            subtheme: '',
            audio_url: '',
            cover_url: '',
            download_url: '',
            is_public: true,
            publisher_id: 1
          });
        }}
      >
        <FaPlus /> Добавить трек
      </button>

      {editMode && (
        <div className="edit-form">
          <h2>{currentTrack.id ? 'Редактировать трек' : 'Добавить трек'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                name="title"
                value={currentTrack.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Автор:</label>
              <input
                type="text"
                name="author"
                value={currentTrack.author}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Описание:</label>
              <textarea
                name="description"
                value={currentTrack.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Длительность (сек):</label>
              <input
                type="number"
                name="duration"
                value={currentTrack.duration}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Тема:</label>
              <input
                type="text"
                name="theme"
                value={currentTrack.theme}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Подтема:</label>
              <input
                type="text"
                name="subtheme"
                value={currentTrack.subtheme}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>URL аудио:</label>
              <input
                type="text"
                name="audio_url"
                value={currentTrack.audio_url}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>URL обложки:</label>
              <input
                type="text"
                name="cover_url"
                value={currentTrack.cover_url}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>URL для скачивания:</label>
              <input
                type="text"
                name="download_url"
                value={currentTrack.download_url}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={currentTrack.is_public}
                  onChange={handleInputChange}
                />
                Публичный
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={() => setEditMode(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      <div className="tracks-list">
        {tracks.map(track => (
          <h1>None</h1>
        ))}
      </div>
    </div>
  );
};

export default TrackManager;