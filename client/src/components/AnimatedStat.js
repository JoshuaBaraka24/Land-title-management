import React, { useEffect, useState } from 'react';

const AnimatedStat = ({ 
  target, 
  decimals = 0, 
  suffix = '', 
  prefix = '',
  duration = 2000,
  className = '',
  children 
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = target / (duration / 20); // 20ms intervals
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setValue(decimals ? current.toFixed(decimals) : Math.floor(current));
    }, 20);
    
    return () => clearInterval(timer);
  }, [target, decimals, duration]);

  return (
    <span className={className}>
      {prefix}{value}{suffix}
      {children}
    </span>
  );
};

export default AnimatedStat; 