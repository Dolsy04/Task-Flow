import Switch from "./ui/themeSwitch";
import MobileSwitch from "./ui/Switch";
import { BiUserCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { useAuth } from "../supabase/authContext";
import { supabase } from "../supabase/supabase";
import toast from "react-hot-toast";

export default function SettingContent(){
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate(); 


     const handleSignOut = async () =>{
        setLoading(true);
        const toastID = toast.loading("Signing Out...")
        const { error } = await supabase.auth.signOut()

        if(error){
            if(error.message.includes("already") || error.message.includes("session")){
                toast.dismiss(toastID);
                navigate("/",{replace: true});
            }else{
                toast.error(`error signin out ${error.message}`,{id: toastID, duration: 4000})
            }
        }else{
            toast.success(`signin out successfully`,{id: toastID, duration: 3000})
            navigate("/", {replace: true})
        }
        setLoading(false);
    }

    return (<>
        <section className="my-10 w-[90%] mx-auto">
            <h1 className="text-2xl font-[sans] font-bold uppercase text-gray-700 dark:text-white tracking-wider">Settings</h1>


            <div className="w-full flex items-center justify-between bg-white text-black dark:text-white dark:bg-[#2C303A] px-5 py-3 rounded-lg relative my-10 text-sm lg:text-base font-semibold font-[sans] tracking-wide">
                <span>Theme preference</span>
                <span className="absolute right-5 bottom-[8px] cursor-pointer lg:block hidden"><Switch /></span>
                <span className="absolute right-5 bottom-[8px] cursor-pointer lg:hidden block"><MobileSwitch /></span>
            </div>

            <Link to="../profilePage" className="w-full flex items-center justify-between bg-white text-black dark:text-white dark:bg-[#2C303A] px-5 py-3 rounded-lg relative my-10 text-sm lg:text-base font-semibold font-[sans] tracking-wide cursor-pointer">
                <p>My Profile</p>
                <BiUserCircle size={25}/>
            </Link>
            <div className="w-full flex items-center justify-between bg-white dark:bg-[#2C303A] px-5 py-3 rounded-lg relative my-10 text-sm lg:text-base font-semibold text-red-600 font-[sans] tracking-wide cursor-pointer"  onClick={()=> handleSignOut()}>
                <p>Sign Out</p>
            </div>
        </section>

       
    </>)
}