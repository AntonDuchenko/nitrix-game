import { useState } from "react";

export const useShowLog = () => {
  const [isShow, setIsShow] = useState(false);

  const handleClick = () => {
    setIsShow((current) => !current);
  };

  return { isShow, handleClick };
};
