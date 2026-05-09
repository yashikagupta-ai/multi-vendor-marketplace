import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import './RatingStars.css';

export const RatingStars = ({ rating, size = 'md', interactive = false, onSetRating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStar = (index, type) => {
    const starClass = `star ${type} ${interactive ? 'interactive' : ''} ${size}`;
    const key = `${type}-${index}`;

    if (interactive) {
      return (
        <button 
          key={key} 
          className={starClass} 
          onClick={() => onSetRating && onSetRating(index + 1)}
          type="button"
        >
          <Star size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} fill={type === 'full' ? 'currentColor' : 'none'} />
        </button>
      );
    }

    return (
      <span key={key} className={starClass}>
        {type === 'half' ? (
          <StarHalf size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} fill="currentColor" />
        ) : (
          <Star size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} fill={type === 'full' ? 'currentColor' : 'none'} />
        )}
      </span>
    );
  };

  return (
    <div className={`rating-stars ${size}`}>
      {[...Array(fullStars)].map((_, i) => renderStar(i, 'full'))}
      {hasHalfStar && renderStar(0, 'half')}
      {[...Array(emptyStars)].map((_, i) => renderStar(fullStars + (hasHalfStar ? 1 : 0) + i, 'empty'))}
      {!interactive && rating > 0 && <span className="rating-value">{rating.toFixed(1)}</span>}
    </div>
  );
};
