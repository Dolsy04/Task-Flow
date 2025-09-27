import { useState, useEffect, createContext, useContext, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../supabase/authContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/ui/loader";
const ThemeContext = createContext();
export function Theme({children}){
    const [isDark, setIsDark] = useState(false)
    const {user,  isLoading} = useAuth();
    const alertOnLoad = useRef(true);
    
    
    useEffect(() => {      
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark")
            setIsDark(true)
        }
    },[])
    
   

    useEffect(()=>{
        if(alertOnLoad.current){
            alertOnLoad.current = false;
            return
        }

        if(isDark){
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
            toast.dismiss()
            // toast.success("Dark Theme Enabled", {duration: 2000})
        }else{
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
            toast.dismiss()
            // toast.success("Light Theme Enabled", {duration: 2000})
        }
    },[isDark])
    if (isLoading){
            return <div className="w-full h-screen flex items-center justify-center">
                <Loader />
            </div>;
    }
   
    return (
        <ThemeContext.Provider value={{isDark, setIsDark}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(){
    return useContext(ThemeContext)
}