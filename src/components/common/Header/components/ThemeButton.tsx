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

export const modeAtom = atom<Themes>(Themes.Light);

function ThemeButton() {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [, setModeAtom] = useAtom(modeAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setModeAtom(theme === Themes.Dark ? Themes.Dark : Themes.Light);
  }, [setModeAtom, theme]);

  if (!mounted) return null;

  function toggleTheme() {
    setTheme(isDarkMode ? Themes.Light : Themes.Dark);
  }

  const isDarkMode = theme === Themes.Dark;

  return (
    <FloatButton.Group
      trigger="hover"
      type="default"
      style={{ right: 30 }}
      icon={<SlidersOutlined />}
    >
      <FloatButton icon={<CommentOutlined />} />
      <FloatButton
        onClick={toggleTheme}
        icon={<BulbOutlined />}
        tooltip={<div>{"Light Mode"}</div>}
        type={isDarkMode ? "default" : "primary"}
      />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
  );
}

export default ThemeButton;
