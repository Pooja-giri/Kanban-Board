import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
  showNotification: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);
