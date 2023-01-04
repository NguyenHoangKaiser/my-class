import { useEffect } from "react";

interface UseClickOutsideProps {
  ref: React.RefObject<HTMLElement>;
  onClose: () => void;
}

const useClickOutside = ({ ref, onClose }: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, onClose]);
};

export default useClickOutside;
