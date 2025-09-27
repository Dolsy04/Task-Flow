
import { Children, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user ?? null);
            setIsLoading(false);
        }
        getUser();

        const { data: { subscription }} = supabase.auth.onAuthStateChange((_e, session)=>{
            setUser(session?.user ?? null);
        })

        return () => subscription.unsubscribe();
    },[])

    return (
        <AuthContext.Provider value={{user, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)