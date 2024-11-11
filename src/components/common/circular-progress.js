import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgress = ({ progress }) => (
  <CircularProgressbar
    value={progress}
    text={`${progress}%`}
    styles={buildStyles({
      pathColor: progress < 100 ? '#2c7a7b' : '#239899',
      textColor: '#fff',
    })}
  />
);

export default CircularProgress;
