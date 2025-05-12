import "./MediaLibrary.css";
import api from "../api";
import { useEffect, useRef, useState } from "react";
import TrackList from "../components/TrackList/TrackList";
import Player from "../components/Player/Player";

const MediaLibrary = () => {
    const audioRef = useRef(null);
    const [currentTrack, setCurrentTrack] = useState(null);  
    const [isPlaying, setIsPlaying] = useState(false) 
    const [tracks, setTracks] = useState([]);

    const fetchTracks = async() => {
        try {
            const response = await api.get("/tracks/");

            setTracks(response.data.map((track) => 
                ({...track, audio_url: "http://localhost:8000" + track.audio_url})));
            
            console.log(response.data.map((track) => 
                ({...track, audio_url: "http://localhost:8000" + track.audio_url})));
        } catch (error) {
            console.error("Error fetching tracks", error);
        }
    }

    useEffect(() => {
        fetchTracks();
    }, []);

    useEffect(() => {
        const audio = audioRef.current
        
        const handleEnded = () => {
            handleNext()
        }

        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('ended', handleEnded)
        }
    }, [currentTrack])
    
    useEffect(() => {
        const audio = audioRef.current
        
        if (!currentTrack) {
            audio.pause()
            audio.src = ''
            setIsPlaying(false)
            return
        }

        if (audio.src !== currentTrack.audio_url) {
            audio.src = currentTrack.audio_url
            audio.currentTime = 0
        }

        if (isPlaying) {
            audio.play().catch(error => {
                console.error("Audio playback failed:", error)
                setIsPlaying(false)
            })
        } else {
            audio.pause()
        }
    }, [currentTrack, isPlaying])


    const handleTrackSelect = (track) => {
        // Если выбираем тот же трек, просто продолжаем/ставим на паузу
        if (currentTrack && currentTrack.audio_url === track.audio_url) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentTrack(track)
            setIsPlaying(true)
        }
    }
    
    const togglePlay = () => {
        if (!currentTrack) return;
        setIsPlaying(!isPlaying)
    }
    
    const handleNext = () => {
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex(t => t.title === currentTrack.title)
        const nextIndex = (currentIndex + 1) % tracks.length
        handleTrackSelect(tracks[nextIndex])
    }
    
    const handlePrev = () => {
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex(t => t.title === currentTrack.title)
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
        handleTrackSelect(tracks[prevIndex])
    }



    return (
        <div className="medialib">
            <h1>Медиатека</h1>

            <audio ref={audioRef} />
            <div className="track-list-container">
                <TrackList 
                    tracks={tracks} 
                    currentTrack={currentTrack}
                    onTrackSelect={handleTrackSelect}
                />
            </div>
            <div className="player-container">
                <Player 
                    track={currentTrack} 
                    isPlaying={isPlaying}
                    onPlayPause={togglePlay}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            </div>
        </div>
    );
}

export default MediaLibrary;