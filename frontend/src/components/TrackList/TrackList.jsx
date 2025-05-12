import Track from '../Track/Track'
import './TrackList.css'

const TrackList = ({ tracks, currentTrack, onTrackSelect }) => {
  return (
    <div className="track-list">
      <div className="track-list-header">
        <div className="header-title">Название</div>
        <div className="header-artist">Автор</div>
        <div className="header-duration">Длительность</div>
      </div>
      {tracks.map((track, index) => (
        <Track 
          key={index}
          track={track}
          isCurrent={currentTrack?.title === track.title}
          onSelect={() => onTrackSelect(track)}
        />
      ))}
    </div>
  )
}

export default TrackList