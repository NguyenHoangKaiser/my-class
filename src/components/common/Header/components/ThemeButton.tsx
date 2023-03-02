import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "src/components/common/Icons";
import { atom, useAtom } from "jotai";

export enum Themes {
  Dark = "dark",
  Light = "light",
}

export const themeAtom = atom<Themes>(Themes.Light);

function ThemeButton() {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [, setThemeState] = useAtom(themeAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(isDarkMode ? Themes.Light : Themes.Dark);
    setThemeState(isDarkMode ? Themes.Light : Themes.Dark);
  }

  const isDarkMode = theme === Themes.Dark;

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? "Toggle light mode" : "Toggle dark mode"}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeButton;
