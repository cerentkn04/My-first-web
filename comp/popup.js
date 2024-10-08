
import React from 'react';
import classes from './Popup.module.css';

const Popup = ({ message, onClose }) => {
  return (
    <div className={classes.popupOverlay}>
      <div className={classes.popup}>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
