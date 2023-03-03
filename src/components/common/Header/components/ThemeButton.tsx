import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import type { SetStateAction } from "jotai";
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

function ThemeButton({
  setMode,
}: {
  setMode: React.Dispatch<SetStateAction<Themes>>;
}) {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMode(theme === Themes.Dark ? Themes.Dark : Themes.Light);
  }, [setMode, theme]);

  if (!mounted) return null;

  function toggleTheme() {
    setTheme(isDarkMode ? Themes.Light : Themes.Dark);
  }

  const isDarkMode = theme === Themes.Dark;

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
