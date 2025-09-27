import HeaderComponent from "../components/Header";
import Switch from "../components/ui/themeSwitch";
import { useAuth } from "../supabase/authContext";
import Loader from "../components/ui/loader";
import { supabase } from "../supabase/supabase";
import toast from "react-hot-toast";
import SettingContent from "../components/settingContent";

export default function SettingPage(){
    const { user, isLoading} = useAuth();


    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }
    if(!user){
        return <Navigate to="/"/>
    }
    
    return (
        <>
            {/* <HeaderComponent /> */}

            <SettingContent />
        </>
    )
}