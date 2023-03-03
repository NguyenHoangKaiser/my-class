import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { FloatButton } from "antd";
import {
  BulbOutlined,
  CommentOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

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
    <FloatButton.Group
      trigger="hover"
      type="primary"
      style={{ right: 40 }}
      icon={<SlidersOutlined />}
    >
      <FloatButton icon={<CommentOutlined />} />
      <FloatButton
        onClick={toggleTheme}
        icon={<BulbOutlined />}
        tooltip={
          <div>{isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode"}</div>
        }
        type={isDarkMode ? "default" : "primary"}
      />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
  );
}

export default ThemeButton;
