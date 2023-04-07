import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { createUseStyles } from 'react-jss';
import { CAMERA_X, CAMERA_Y, CAMERA_ZOOM, TILE_HEIGHT, TILE_WIDTH } from '../game/constants';

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
  const scale = (window.innerWidth / (CAMERA_ZOOM + props.zoom)) / (window.innerWidth/100) - 1.41;
  const [valid, setValid] = useState(false);

  const handleEnter = () => {
    setValid(Math.random() > 0.5);
  }

  const Cells = React.memo(() => {
    return (
      Array.from(Array(10000)).map((_, index) => (
        <Grid xs={1} item key={index}>
          <div className={valid ? classes.valid : classes.invalid} onMouseEnter={() => handleEnter()}></div>
        </Grid>
      ))
    );
  })

  return (
    <div style={{ display: 'block', position: 'absolute', width: 'inherit', height: 'inherit' }}>
      <div style={props.visible ? { display: 'block', position: 'relative', width: 'inherit', height: 'inherit', overflow: 'hidden' } : { display: 'none' }}>
        <Grid container spacing={0} columns={{ xs: 1 }} style={{ 
          width: window.innerWidth + 'px', 
          height: window.innerHeight + 'px', 
          transform: `rotate(24.8deg) skewX(319.5deg) translateX(${((CAMERA_ZOOM + props.zoom)-(props.center.x ? props.center.x/TILE_WIDTH : CAMERA_X))*4*(scale)*(window.innerWidth/100)+TILE_HEIGHT}px) translateY(${((props.center.y ? props.center.y/TILE_HEIGHT : CAMERA_Y)-(CAMERA_ZOOM + props.zoom))*4*(scale)*(window.innerHeight/100)-TILE_WIDTH}px) scale(${scale})`}}>
          {
            Array.from(Array(100)).map((_, index) => (
              <Grid xs={1} item key={index}>
                <div className={valid ? classes.valid : classes.invalid} onMouseEnter={() => handleEnter()}></div>
              </Grid>
            ))
          }
        </Grid>
      </div>
    </div>
  )
}