import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "src/components/common/Icons";

export enum Themes {
  Dark = "dark",
  Light = "light",
}

function ThemeButton() {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(isDarkMode ? Themes.Light : Themes.Dark);
  }

  const isDarkMode = theme === Themes.Dark;

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? "toggle light mode" : "toggle dark mode"}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeButton;
