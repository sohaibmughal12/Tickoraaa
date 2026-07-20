import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className="flex space-x-4 sm:space-x-6 justify-center">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-luxury-gray/80 border border-white/5 shadow-luxury-soft rounded flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl sm:text-2xl font-black text-white font-poppins tracking-wider">
              {formatNumber(item.value || 0)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-luxury-gold uppercase tracking-widest mt-2 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
