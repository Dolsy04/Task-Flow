import { NavLink, useNavigate, Navigate } from "react-router-dom";
import Loader from "./ui/loader";
import { CgLoadbarSound } from "react-icons/cg";
import { MdOutlineTaskAlt, MdOutlineLogout } from "react-icons/md";
import { HiOutlineCog } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import toast from "react-hot-toast";
import { useAuth } from "../supabase/authContext";
import { useState } from "react";
import { supabase } from "../supabase/supabase";
import { IoClose } from "react-icons/io5";

export default function Sidebar({isActive, onClose}){
    const { user, isLoading } = useAuth();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }
    

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
        {isActive && (<div className={`w-full h-full bg-white/50 dark:bg-[#1a1d23ab] backdrop-blur-sm py-2 px-5 dark:text-white lg:hidden block fixed lg:left-0 transition-all duration-300 z-50 top-0 ${isActive ? "left-0" : "left-[-100%]"}`}></div>)}
        <aside className={`w-[250px] h-full bg-white dark:bg-[#1a1d23] py-2 px-5 dark:text-white lg:relative fixed lg:left-0 transition-all duration-300 z-50 top-0 ${isActive ? "left-0" : "left-[-100%]"}`}>
            <div className="w-[100%] h-[60px] mx-auto mb-5 flex items-center relative">
                <span className="font-bold text-2xl text-[#07011e] font-[sans] dark:text-[#f5f5f5] uppercase">Task flow</span>
                <CgLoadbarSound className="text-[#07011e] dark:text-[#f5f5f5]" size={30}/>
                <IoClose  className="lg:hidden block absolute -right-4 top-0 text-[#07011e] dark:text-[#db1515]" size={30} onClick={onClose}/>
            </div>
            
            <div className="flex flex-col justify-between h-[calc(100% - 60px)] pb-10 overflow-hidden">
                <nav className="flex flex-col overflow-y-auto">
                    <NavLink onClick={onClose} className={`flex items-center gap-1 text-base text-[#07011e] dark:text-white font-[sans] font-normal mt-3`} to="/dashboard" >
                        <CgLoadbarSound className="text-2xl" />
                        <span>Overview</span>
                    </NavLink>
                    <NavLink onClick={onClose} className={`flex items-center gap-1 text-base text-[#07011e] dark:text-white font-[sans] font-normal mt-3`} to="task">
                        <MdOutlineTaskAlt className="text-xl" />
                        <span>Task</span>
                    </NavLink>
                </nav>

                <div className="flex flex-col">
                    <NavLink onClick={onClose} to="settingPage" className={`flex items-center gap-1 text-base text-[#07011e] dark:text-white font-[sans] font-normal mt-3`} >
                        <HiOutlineCog />
                        <span>Settings</span>
                    </NavLink>

                    <NavLink onClick={handleSignOut} className={`flex items-center gap-1 text-base text-red-500 font-[sans] font-normal mt-3`} >
                        <MdOutlineLogout />
                        <span>Log Out</span>
                    </NavLink>
                </div>
            </div>
        </aside>
    </>)
}