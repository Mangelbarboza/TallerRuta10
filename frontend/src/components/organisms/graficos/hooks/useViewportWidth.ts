import { useEffect, useState } from "react";

export function useViewportWidth() {
  const [w, setW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return w;
}

export default useViewportWidth;