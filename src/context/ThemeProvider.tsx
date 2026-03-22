import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from "./theme-context";

const STORAGE_KEY = "portfolio-theme";

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function readSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function initialTheme(): Theme {
  return readStoredTheme() ?? readSystemTheme();
}

function userHasSavedPreference(): boolean {
  return readStoredTheme() !== null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => initialTheme());
  const [userHasChosen, setUserHasChosen] = useState(() =>
    userHasSavedPreference(),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (userHasChosen) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, userHasChosen]);

  useEffect(() => {
    if (userHasChosen) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setThemeState(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [userHasChosen]);

  const setTheme = useCallback((t: Theme) => {
    setUserHasChosen(true);
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setUserHasChosen(true);
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
