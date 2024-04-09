import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from "react";

type AppContextType = {
  showSidebar: boolean | null;
  setShowSidebar: Dispatch<SetStateAction<boolean | null>>;
};

const AppContext = createContext<AppContextType>({
  showSidebar: true,
  setShowSidebar: () => null,
});

const AppContextProvider = ({ children }: { children: ReactElement }) => {
  const [showSidebar, setShowSidebar] = useState<boolean | null>(null);

  useEffect(() => {
    if (showSidebar === null) {
      const savedValue = window.localStorage.getItem("showSidebar");

      setShowSidebar(savedValue === "true" || savedValue === null);
      return;
    }

    window.localStorage.setItem("showSidebar", showSidebar.toString());
  }, [showSidebar]);

  if (showSidebar === null) return null;

  return (
    <AppContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
