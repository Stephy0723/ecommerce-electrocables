import React from 'react';
import { Star } from 'lucide-react';
import './Rating.css';

export default function Rating({ value = 0 }) {
  return (
    <span className="rating" aria-label={`Rating ${value}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={14} fill={index < Math.round(value) ? 'currentColor' : 'none'} />
      ))}
      <b>{value}</b>
    </span>
  );
}
