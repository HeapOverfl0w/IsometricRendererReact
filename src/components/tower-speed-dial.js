import React from 'react';
import { SpeedDialAction, SpeedDial } from '@mui/material';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(
  {
    root: {
      position: 'absolute',
      zIndex: '2'
    }
  },
  {
    generateId: (rule) => {
      return `map-grid-${rule.key}`;
    }
  }
);

export default function TowerSpeedDial(props) {
  const classes = useStyles();

  const handleClick = (event, tower) => {
    event.stopPropagation();
    props.onClick(tower);
  }

  const actions = [
    { name: 'Copy' },
    { name: 'Save' },
    { name: 'Print' },
    { name: 'Share' },
  ];

  return (
    <div className={classes.root}>
      <SpeedDial direction='right' ariaLabel="speedDial">
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            tooltipTitle={action.name}
            onClick={(event) => handleClick(event, action.name)}
          />
        ))}
      </SpeedDial>
    </div>
  )
}