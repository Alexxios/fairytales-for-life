import "./MediaLibrary.css";
import api from "../api";
import { useEffect, useState } from "react";
import AudioPlayer from "../components/AudioPlayer";

export function MediaLibrary() {
    const [media, setMedia] = useState([]);

    const fetchMedia = async() => {
        try {
            const response = await api.get("/media/");
            setMedia(response.data);
        } catch (error) {
            console.error("Error fetching media", error);
        }
    }

    useEffect(() => {
        fetchMedia();
    }, []);


    return (
        <div className="medialib">
            <header>
                <h1>Медиатека</h1>
            </header>
            <main>
                {media.map((file, index) => (
                    <AudioPlayer audioSrc={"http://localhost:8000" + file.filepath} />
                ))}
            </main>
        </div>
    );
}