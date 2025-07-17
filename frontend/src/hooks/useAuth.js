import { useMemo } from "react";
export const useAuth = () => {
  const user = useMemo(()=>{
    return  JSON.parse(localStorage.getItem("user"));
  }, []);
  
};