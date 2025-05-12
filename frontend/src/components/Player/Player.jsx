import { useState, useEffect } from 'react'
import './Player.css'
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js'

const Player = ({ track, isPlaying, onPlayPause, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')  
  const [coverArt, setCoverArt] = useState(null);

  useEffect(() => {
    if (!track?.audio_url) {
      setCoverArt(null);
      return;
    }

    new jsmediatags.Reader(track.audio_url)
      .setTagsToRead(['picture'])
      .read({
        onSuccess: (tag) => {
          if (tag.tags.picture) {
            const { data, format } = tag.tags.picture;
            let base64String = '';
            for (let i = 0; i < data.length; i++) {
              base64String += String.fromCharCode(data[i]);
            }
            const imageUrl = `data:${format};base64,${window.btoa(base64String)}`;
            setCoverArt(imageUrl);
          } else {
            setCoverArt(null);
          }
        },
        onError: (error) => {
          console.error('Error reading audio tags:', error);
          setCoverArt(null);
        }
      });
  }, [track]);


  useEffect(() => {
    const audio = document.querySelector('audio')
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(formatTime(audio.currentTime))
      }
    }

    audio.addEventListener('timeupdate', updateProgress)
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleProgressClick = (e) => {
    if (!track) return
    
    const audio = document.querySelector('audio')
    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const progressBarWidth = progressBar.clientWidth
    const percentage = (clickPosition / progressBarWidth) * 100
    const newTime = (percentage / 100) * audio.duration
    
    audio.currentTime = newTime
    setProgress(percentage)
  }

  if (!track) {
    return (
      <div className="player inactive">
        <div className="player-info">
          <div className="album-cover">
            <div className="album-cover-placeholder"></div>
          </div>
          <div className="track-info">
            <h3 className="track-title">No track selected</h3>
            <p className="track-artist">Select a track to play</p>
          </div>
        </div>
        <div className="player-controls">
          <button className="control-btn disabled">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor"/>
            </svg>
          </button>
          <button className="control-btn play-btn disabled">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
          </button>
          <button className="control-btn disabled">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="player">
      <div className="player-info">
        <div className="album-cover">
            {coverArt ? (
                <img src={coverArt} alt="Album cover" className="cover-image" />
            ) : (
                <div className="album-cover-placeholder"></div>
            )}
        </div>
        <div className="track-info">
          <h3 className="track-title">{track.title}</h3>
          <p className="track-artist">{track.author}</p>
        </div>
      </div>
      
      <div className="player-controls">
        <div className="player-progress">
            <span className="time-current">{currentTime}</span>
            <div className="progress-bar" onClick={handleProgressClick}>
            <div 
                className="progress" 
                style={{ width: `${progress}%` }}
            ></div>
            </div>
            <span className="time-duration">{formatTime(track.duration)}</span>
        </div>
        <button className="control-btn" onClick={onPrev}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor"/>
          </svg>
        </button>
        <button className="control-btn play-btn" onClick={onPlayPause}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
          )}
        </button>
        <button className="control-btn" onClick={onNext}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      
    </div>
  )
}

export default Player