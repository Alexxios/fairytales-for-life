import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Admin.css';

import TrackManager from '../components/TrackManager';

const SwipeableScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const screens = [
    <div key={0} className="screen-content"><TrackManager/></div>,
    <div key={1} className="screen-content">Еще один компонент</div>,
    <div key={2} className="screen-content">Третий компонент</div>
  ];

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setActiveIndex(prev => Math.min(prev + 1, screens.length - 1));
    },
    onSwipedRight: () => {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="admin">
      <div {...handlers} className="swipe-container">
        <div 
          className="screens-wrapper"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {screens.map((screen, index) => (
            <div key={index} className="screen">
              {screen}
            </div>
          ))}
        </div>
      </div>
      
      <div className="screen-indicator">
        {screens.map((_, index) => (
          <div 
            key={index}
            className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableScreen;