import React, { FC } from "react";

export const Arrow: FC<{ left?: boolean }> = ({ left }) => {
  if (left) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        style={{ transform: "rotate(180deg)" }}
      >
        <path
          fill="currentColor"
          d="M12.293 5.293a1 1 0 0 0 0 1.414L16.586 11H4a1 1 0 1 0 0 2h12.586l-4.293 4.293a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414l-6-6a1 1 0 0 0-1.414 0Z"
        ></path>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path
        fill="currentColor"
        d="M12.293 5.293a1 1 0 0 0 0 1.414L16.586 11H4a1 1 0 1 0 0 2h12.586l-4.293 4.293a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414l-6-6a1 1 0 0 0-1.414 0Z"
      ></path>
    </svg>
  );
};
