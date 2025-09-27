import { useAuth } from "../supabase/authContext"
import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabase"
import Switch from "./ui/themeSwitch"
import MobileSwitch from "./ui/Switch"
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./sidebar"


export default function HeaderComponent({onUpdate, onOpenNav}){
    const {user,  isLoading} = useAuth();
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
   

    if (isLoading){
            return <div className="w-full h-screen flex items-center justify-center">
                <Loader />
            </div>;
    }
    

    const fetchData = async ()=>{
        try{
            setLoading(true);
        // console.log("Fetching tasks for user:", user.id);

            const { data, error } = await supabase.from("users").select("*").eq("auth_id", user.id).single()

            if(error){
                toast.dismiss()
                toast.error(`error fetching login user: ${error.message}`, {duration: 4000})
                throw error
            }else{
                setData(data)
            }
        }catch (error){
            toast.dismiss()
            toast.error(error.message, {duration: 4000})
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(user) fetchData()
    },[user])

    useEffect(()=>{if(onUpdate) fetchData();},[onUpdate])

    return (<>

        <header className="flex items-center justify-between sticky top-0 lg:px-6 px-2 w-full h-[60px] z-40 bg-white dark:bg-[#1a1d23]">
        <div className="flex items-center gap-3">
            <RxHamburgerMenu className="lg:hidden block text-black dark:text-white" size={20} onClick={onOpenNav}/>
            <h3 className="text-[#07011E] dark:text-white uppercase font-bold lg:text-xl tracking-wide font-[sans]">Dashboard</h3>
        </div>
        <div className="flex gap-3 cursor-pointer lg:w-[25%] w-[auto]">
            <div className="mb-2 lg:block hidden">
                <Switch />
            </div>
            <div className="mb-2 block lg:hidden">
                <MobileSwitch />
            </div>

            
            <NavLink to="/dashboard/profilePage" className="flex items-center justify-center gap-2 h-auto w-[80%]">
                 <div className="dark:bg-[#2C303A] bg-[#f5f5f5] lg:h-[50px] lg:w-[50px] h-[40px] w-[40px] flex items-center justify-center rounded-full">
                   <span className="text-[#2C303A] dark:text-white font-extrabold font-[sans] text-xs lg:text-base uppercase">{data?.username[0]}</span>
                    <span className="text-[#2C303A] dark:text-white font-extrabold font-[sans] text-xs lg:text-base uppercase">{data?.username[1]}</span>
                </div>
                <div className="w-[140px]  hidden overflow-hidden h-full lg:flex items-start justify-center flex-col">
                    <p className="text-black dark:text-white text-xs lg:text-sm font-[sans] font-semibold uppercase">{data?.username && data?.username.length > 20 ? data?.username.slice(0, 20)  + "...": data?.username}</p>
                    <p className="text-black uppercase dark:text-white text-xs
                    lg:text-sm font-[sans] font-semibold">{data?.gender}</p>
                </div>
            </NavLink>
        </div>
    </header>

        {/* <Sidebar isActive={openResNav}/> */}
    </>)
}