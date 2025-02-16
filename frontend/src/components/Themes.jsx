import React, { useEffect, useState } from 'react';
import api from '../api';

const ThemeList = () => {
  const [themes, setThemes] = useState([]);

  const fetchThemes = async () => {
    try {
      const response = await api.get('/themes');
      setThemes(response.data.themes);
    } catch (error) {
      console.error("Error fetching themes", error);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return (
    <div>
      {themes.map((theme, index) => (
        <div>
          <h2>{theme.name}</h2>
          <ul>{theme.subthemes.map((subtheme, subindex) => (
            <li key={index}>{subtheme.name}</li>
          ))}</ul>
        </div>
      ))}
    </div>
  );
};

export default ThemeList;