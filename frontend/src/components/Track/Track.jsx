import './Track.css'

const Track = ({ track, isCurrent, onSelect }) => {
  return (
    <div 
      className={`track ${isCurrent ? 'current' : ''}`}
      onClick={onSelect}
    >
      <div className="track-title">{track.title}</div>
      <div className="track-artist">{track.author}</div>
      <div className="track-duration">{Math.floor(track.duration/60)+":"+track.duration%60}</div>
    </div>
  )
}

export default Track