import React, { useState } from 'react';
import { Canvas } from './components/canvas';
import TowerSpeedDial from './components/tower-speed-dial';
import MapGrid from './components/map-grid';

function App() {
  const [tower, setTower] = useState(undefined);
  const [position, setPosition] = useState({ x: undefined, y: undefined });
  const [zoom, setZoom] = useState(0);
  const [center, setCenter] = useState({ x: undefined, y: undefined });

  const handleClick = (tower) => {
    if (tower) {
      setTower({ name: tower })
    }
    else {
      setTower(undefined);
    }
  }

  const handleMouseWheel = (deltaY) => {
    let delta = 1;
    if (deltaY < 0) {
      delta = -1;
    }
    setZoom(zoom + delta);
  }
  
  const handleMouseUp = (event) => {
    if (tower) {

    }
    else {
      setCenter(
        { 
          x: event.pageX - (event.currentTarget.offsetLeft), 
          y: event.pageY - (event.currentTarget.offsetTop) 
        })
    }
  }

  return (
    <div onClick={() => handleClick()} >
      <TowerSpeedDial onClick={(tower) => handleClick(tower)}></TowerSpeedDial>
      <div style={{ overflow: 'hidden' }}
        onMouseLeave={() => setPosition({ x: undefined, y: undefined })}
        onMouseEnter={(event) => setPosition({ x: event.pageX - (event.currentTarget.offsetLeft), y: event.pageY - (event.currentTarget.offsetTop)  })}
        onMouseMove={(event) => setPosition({ x: event.pageX - (event.currentTarget.offsetLeft), y: event.pageY - (event.currentTarget.offsetTop)  })}
        onWheel={(event) => handleMouseWheel(event.deltaY)}
        onMouseUp={(event) => handleMouseUp(event)}>
        <MapGrid visible={tower} zoom={zoom} center={center}></MapGrid>
        <Canvas position={position} zoom={zoom} center={center} />
      </div>
    </div>
  );
}

export default App;
