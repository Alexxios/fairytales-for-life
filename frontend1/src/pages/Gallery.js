import { useState } from "react";
import { Image } from "lucide-react";

const images = [
  "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg",

  "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg",

  "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg",

  "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg",

  "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
  "https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg"
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Фотогалерея</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        {images.map((src, index) => (
          <div key={index} onClick={() => setSelectedImage(src)} style={{ cursor: 'pointer', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', padding: '8px' }}>
            <img src={src} alt="Gallery" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setSelectedImage(null)}>
          <div style={{ position: 'relative', padding: '16px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Image style={{ width: '24px', height: '24px', position: 'absolute', top: '8px', right: '8px', cursor: 'pointer' }} onClick={() => setSelectedImage(null)} />
            <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
