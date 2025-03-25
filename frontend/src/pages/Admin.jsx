import React, { useState } from 'react';

export function FileUploader() {
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAudioPreview(null);
    }
  };

  return (
    <div>
      <h2>Upload Image and Audio</h2>
      <div>
        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
      </div>
      <div>
        <label>
          Upload Audio:
          <input type="file" accept="audio/*" onChange={handleAudioChange} />
        </label>
        {audioPreview && <audio controls src={audioPreview} style={{ marginTop: '10px' }} />}
      </div>
    </div>
  );
};
