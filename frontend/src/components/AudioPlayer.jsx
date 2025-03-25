import React from "react";
import ReactPlayer from "react-player";

const AudioPlayer = ({ url }) => {
  return (
    <div>
      <ReactPlayer
        url={url} // URL аудиофайла с бэкенда
        controls={true} // Включить стандартные элементы управления (play/pause/volume)
        width="100%"
        height="50px"
        config={{
          file: {
            attributes: {
            //   controlsList: "nodownload", // Отключить кнопку скачивания (опционально)
            },
          },
        }}
      />
    </div>
  );
};

export default AudioPlayer;