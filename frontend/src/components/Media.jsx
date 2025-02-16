import './Media.css'
import api from '../api'


const MediaList = () => {
    const [media, setMedia] = useState([]);

    const fetchMedia = async () => {
        try {
        const response = await api.get('/media');
        setMedia(response.data.media);
        } catch (error) {
        console.error("Error fetching themes", error);
        }
    };

  
    useEffect(() => {
      fetchMedia();
    }, []);


    return (
        <div>
            {media.map((file, index) => (
                <>
                </>
            ))}
        </div>
    )
}

export default MediaList;