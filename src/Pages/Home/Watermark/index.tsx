import type React from 'react';
import { useEffect, useRef } from 'react';
import star from '../../../assets/images/star.svg';

const Watermark: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const str = ' V O T E • T O • B E • H E A R D • ';
    const textElement = textRef.current;

    if (textElement) {
      for (let i = 0; i < str.length; i++) {
        const span = document.createElement('span');
        span.innerHTML = str[i];
        textElement.appendChild(span);
        span.style.transform = `rotate(${11 * i}deg)`;
        span.classList.add(
          'absolute',
          'left-1/2',
          'transform',
          'origin-[0_75px]',
          'font-bold',
          'uppercase',
          'text-white',
          'letter-spacing-[15px]',
        );
      }
    }
  }, []);
  return (
    <div className="flex justify-center items-center fixed bottom-10 right-10">
      <p id="text" ref={textRef} className="relative h-[150px] w-[150px] animate-spin-slow trans-text" />
      <div className="absolute">
        <img src={star} alt="center" className="w-[30.57px] h-[23.03px] object-cover rounded-full" />
      </div>
    </div>
  );
};

export default Watermark;
