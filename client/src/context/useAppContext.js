import { useContext } from "react";
import { AppContext } from "./ChatContext";

export const useAppContext = () => {
  return useContext(AppContext);
};
