import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { createUseStyles } from 'react-jss';
import { CAMERA_X, CAMERA_Y, CAMERA_ZOOM, TILE_HEIGHT_OFFSET_RATIO } from '../game/constants';

const useStyles = createUseStyles(
  {
    valid: {
      borderStyle: 'solid',
      borderWidth: 'thin',
      border: '#d3d3d34a',
      height: '100%',
      '&:hover': {
        borderStyle: 'solid',
        borderWidth: 'thin',
        border: 'deepSkyBlue',
        height: '100%',
      }
    },
    invalid: {
      borderStyle: 'solid',
      borderWidth: 'thin',
      border: '#d3d3d34a',
      height: '100%',
      '&:hover': {
        borderStyle: 'solid',
        borderWidth: 'thin',
        border: 'red',
        height: '100%',
      }
    }
  },
  {
    generateId: (rule) => {
      return `map-grid-${rule.key}`;
    }
  }
);

export default function MapGrid(props) {
  const classes = useStyles();
  const width = window.innerWidth / (CAMERA_ZOOM + props.zoom);
  var height = window.innerHeight / (CAMERA_ZOOM + props.zoom);
  height = height - (TILE_HEIGHT_OFFSET_RATIO * height);
  const tileSize = Math.sqrt((Math.pow(width / 2, 2) + Math.pow(height / 2, 2)));
  const rotation = 2 * Math.PI - Math.atan(height / width); //335.2//
  const skew = Math.PI / 2 - Math.atan(height / width) * 2; //40.4//

  const [xCenter, setXCenter] = useState(CAMERA_X);
  const [yCenter, setYCenter] = useState(CAMERA_Y);
  const [valid, setValid] = useState(false);

  const handleEnter = () => {
    setValid(Math.random() > 0.5);
  }

  useEffect(() => {
    if (props.center.x && props.center.y) {
      const canvasTan = window.innerHeight / window.innerWidth;
      const canvasAngle = Math.atan(canvasTan);
      const adjustedCanvasAngle = Math.PI / 2 - canvasAngle;

      const xDiff = (props.center.x - window.innerWidth / 2);
      const yDiff = (window.innerHeight / 2 - props.center.y);
      let angle = 0;

      if (yDiff === 0) {
        if (xDiff < 0) {
          angle = Math.PI + Math.PI / 2;
        }
        else {
          angle = Math.PI / 2;
        }
      }
      else if (xDiff === 0) {
        if (yDiff < 0) {
          angle = Math.PI;
        }
      }
      else {
        angle = Math.atan2(Math.abs(yDiff), Math.abs(xDiff));

        if (xDiff > 0 && yDiff > 0) {
          angle = Math.PI / 2 - angle;
        }
        else if (xDiff > 0 && yDiff < 0) {
          angle += Math.PI / 2;
        }
        else if (xDiff < 0 && yDiff < 0) {
          angle = Math.PI + (Math.PI / 2 - angle);
        }
        else {
          angle += Math.PI + Math.PI / 2
        }
      }

      const hypo = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

      let adjustedAngle = angle - adjustedCanvasAngle;
      adjustedAngle = angle >= adjustedCanvasAngle ? adjustedAngle : adjustedAngle + 2 * Math.PI;

      if (adjustedAngle <= 2 * canvasAngle) {
        adjustedAngle = adjustedAngle * ((Math.PI / 2) / (2 * canvasAngle));
      }
      else {
        let adjustment = Math.PI / 2;
        if (adjustedAngle <= Math.PI) {
          adjustment += (adjustedAngle - 2 * canvasAngle) * ((Math.PI / 2) / (2 * adjustedCanvasAngle));
        }
        else {
          adjustment = Math.PI;
          if (adjustedAngle <= 2 * canvasAngle + Math.PI) {
            adjustment += (adjustedAngle - Math.PI) * ((Math.PI / 2) / (2 * canvasAngle));
          }
          else {
            adjustment = Math.PI + Math.PI / 2 + (adjustedAngle - (Math.PI + Math.PI / 2)) * ((Math.PI / 2) / (2 * adjustedCanvasAngle));
          }
        }
        adjustedAngle = adjustment;
      }

      const xPrime = Math.cos(adjustedAngle) * hypo;
      const yPrime = Math.sin(adjustedAngle) * hypo;
      const tileX = xPrime > 0 ?
        Math.floor(xPrime / tileSize) :
        Math.ceil(xPrime / tileSize);
      const tileY = yPrime > 0 ?
        Math.floor(yPrime / tileSize) :
        Math.ceil(yPrime / tileSize);

      setXCenter(xCenter + tileX);
      setYCenter(yCenter + tileY);
    }
  }, [props.center]);

  return (
    <div style={{ display: 'block', position: 'absolute', width: `${window.innerWidth}px`, height: `${window.innerHeight}px`, overflow: 'hidden' }}>
      <div style={props.visible ? { display: 'block', position: 'relative', width: 'inherit', height: 'inherit', transform: `translateX(${window.innerWidth / 2}px) translateY(${425}px)` } : { display: 'none' }}>
        <div style={{
          width: (tileSize * 100) + 'px', height: (tileSize * 100) + 'px', transformOrigin: 'top left',
          transform: `rotate(${rotation * 180 / Math.PI}deg) skewX(${skew * 180 / Math.PI}deg) scaleY(${Math.cos(skew)}) translateX(${-xCenter * tileSize}px) translateY(${-yCenter * tileSize}px)`
        }}>
          {Array.from(Array(100)).map((_, i) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {Array.from(Array(100)).map((_, j) => (
                <div key={i + '_' + j} style={{ width: `${tileSize}px`, height: `${tileSize}px` }}>
                  <div className={valid ? classes.valid : classes.invalid}  onMouseEnter={() => handleEnter()}></div>
                </div>
              ))}
            </div>
          ))}

        </div>


        {/* <Grid container spacing={0} columns={{ xs: 100 }} style={{
        //   width: (tileSize * 100) + 'px',
        //   height: (tileSize * 100) + 'px',
        //   transformOrigin: 'top left',
        //   transform: `rotate(${rotation * 180 / Math.PI}deg) skewX(${skew * 180 / Math.PI}deg) scaleY(${Math.cos(skew)}) translateX(${-xCenter * tileSize}px) translateY(${-yCenter * tileSize}px)`
        // }}>
          // {
          //   Array.from(Array(10000)).map((_, index) => (
          //     <Grid xs={1} item key={index} style={{display: 'hidden'}}>
          //       <div className={valid ? classes.valid : classes.invalid} onMouseEnter={() => handleEnter()}></div>
          //     </Grid>
          //   ))
          // 
      </Grid>*/}
      </div>
    </div >
  )
}