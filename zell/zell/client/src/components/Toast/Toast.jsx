import React from 'react';
import { useToast } from '../../store/useToast';
import './Toast.css';

export const Toast = () => {
  const { message, visible } = useToast();

  if (!visible) return null;

  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">✓</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};
