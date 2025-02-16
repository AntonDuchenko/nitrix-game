import { useEffect, useState } from "react";

export const useCoordinate = (
  damage: number | null,
  setDamage: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const [coordinate, setCoordinate] = useState(0);

  useEffect(() => {
    if (damage !== null) {
      setCoordinate(Math.floor(Math.random() * 80) + 10);

      const timeOut = setTimeout(() => {
        setDamage(null);
        clearTimeout(timeOut);
      }, 1000);

      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [damage]);

  return { coordinate };
};
