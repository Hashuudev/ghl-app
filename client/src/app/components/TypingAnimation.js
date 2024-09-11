// components/TypingAnimation.js
import { useEffect, useState } from "react";

const words = [
  " Innovation",
  "Technology",
  "Creativity",
  "Efficiency",
  "Productivity",
  "Success",
  "Growth",
  "Future",
  "Opportunity",
];

export default function TypingAnimation() {
  const [currentWord, setCurrentWord] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    if (charIndex < words[index].length && !isDeleting) {
      setTimeout(() => {
        setCurrentWord((prev) => prev + words[index][charIndex]);
        setCharIndex(charIndex + 1);
        setSpeed(100);
      }, speed);
    } else if (isDeleting && charIndex > 0) {
      setTimeout(() => {
        setCurrentWord((prev) => prev.slice(0, -1));
        setCharIndex(charIndex - 1);
        setSpeed(50);
      }, speed);
    } else if (!isDeleting && charIndex === words[index].length) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    }
  }, [charIndex, isDeleting, index, speed]);

  return (
    <div className="">
      <span>{currentWord}</span>
      <span className="blinking-cursor">|</span>
    </div>
  );
}
