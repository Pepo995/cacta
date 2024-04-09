import { useContext } from "react";

import { AppContext } from "~/context/AppContext";

export const useAppContext = () => {
  const { showSidebar, setShowSidebar } = useContext(AppContext);

  return { showSidebar, setShowSidebar };
};
