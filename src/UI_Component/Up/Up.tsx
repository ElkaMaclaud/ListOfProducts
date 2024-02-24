import React, { useEffect, useState } from "react";
import classes from "./style/Up.module.css";

export const Up = () => {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const keyGenerate = () => {
    return Math.random().toString(36).substring(2, 15)
  }
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= window.innerHeight / 2) {
        setShowScrollUp(true);
      } else setShowScrollUp(false);
    }
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  });
  if (showScrollUp) {
    return (
      <div className={classes.arrowWrapper} onClick={handleClick}>
        {Array.from({ length: 2 }).map(() => {
          const key = keyGenerate();
          return <span key={key}className={classes.arrow}></span>;
        })}
      </div>
    );
  }
  return null;
};
