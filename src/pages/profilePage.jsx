import HeaderComponent from "../components/Header";
import { useAuth } from "../supabase/authContext"
import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabase"
import Loader from "../components/ui/loader"
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

export default function Profile(){
    const {user, isLoading} = useAuth();
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [username, setUserName] = useState("")
    const [refreshHeader, setRefreshHeader] = useState(false)

    if (isLoading){
            return <div className="w-full h-screen flex items-center justify-center">
                <Loader />
            </div>;
    }
    if(!user){
        return <Navigate to="/"/>
    }

    const handleOpenEdit = () =>{
        setOpenModal(true)
    }

    const updateData = async (e) =>{
        e.preventDefault()

        if(!username.trim()){
            toast.dismiss()
            toast.error("input is required", {duration: 3000})
            return
        }

        setLoading(true)
        const toastID = toast.loading("Loading...")

        const { error } = await supabase.from("users").update({
            username: username,
        }).eq("auth_id", user.id).select()

        if(error){
            toast.dismiss(toastID)
            toast.error(`Error updating username: ${error.message}`, {duration: 2000})
        }else{
            toast.success(`username updated successfully!`, {id: toastID, duration: 2000})
        }
        setLoading(false);
        setOpenModal(false);
        setUserName("");
        setRefreshHeader((p)=> !p);
        fetchData()
        
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
    return(
        <>
            {/* <HeaderComponent onUpdate={refreshHeader}/> */}

            {loading ? (<div className="w-full h-full flex items-center justify-center"><Loader /></div>): (
                <section className="my-10 w-[90%] mx-auto">
                    <h1 className="text-2xl font-[sans] font-bold uppercase text-gray-700 dark:text-white tracking-wider">MY PROFILE</h1>

                    <div className="lg:w-[80%] w-full mx-auto h-auto lg:h-[350px] flex items-center lg:justify-start justify-center flex-col lg:flex-row lg:gap-20 border-white mt-6">
                        <div className="flex items-center gap-7 w-full lg:w-[50%] h-auto lg:h-full">
                            <div className="dark:bg-[#2C303A] bg-white lg:h-full h-[150px] w-full flex items-center justify-center rounded-md lg:rounded-full">
                                <span className="text-[#2C303A] dark:text-white font-extrabold font-[sans] lg:text-9xl text-5xl uppercase">{data?.username[0]}</span>
                                <span className="text-[#2C303A] dark:text-white font-extrabold font-[sans] lg:text-9xl text-5xl uppercase">{data?.username[1]}</span>
                            </div>
                        </div>
                        <div className="lg:w-[50%] w-full h-full flex items-start justify-around py-10 flex-col">
                            <div className="w-full h-full">
                                <p className="capitalize text-[#2C303A] dark:text-white font-[sans] font-normal text-lg mb-3 tracking-wide">Username: <span className="dark:text-cyan-400 font-bold">{data?.username}</span></p>
                                <p className="capitalize text-[#2C303A] dark:text-white font-[sans] font-normal text-lg mb-3 tracking-wide">Gender: <span className="dark:text-cyan-400 font-bold">{data?.gender}</span></p>
                                <p className="text-[#2C303A] dark:text-white font-[sans] font-normal text-lg mb-3 tracking-wide">Email: <span className="dark:text-cyan-400 font-bold">{data?.email}</span></p>
                                <p className="text-[#2C303A] dark:text-white font-[sans] font-normal text-lg mb-3 tracking-wide">Date Of Birth: <span className="dark:text-cyan-400 font-bold">{new Date(data?.dob).toLocaleDateString("en-us", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}</span></p>
                                <p className="text-[#2C303A] dark:text-white font-[sans] font-normal text-lg mb-3 tracking-wide">Age: <span className="dark:text-cyan-400 font-bold">{data?.age}</span></p>
                            </div>
                            <button onClick={()=> handleOpenEdit()} className="bg-blue-600 px-4 py-3 rounded-md text-white font-[sans] text-base cursor-pointer">Change Username</button>
                            <span className="text-xs text-gray-600 dark:text-cyan-300">Reload your browser after a successfull update</span>
                        </div>
                    </div>
                </section>
            )}

            {openModal && (
                <section className="w-full h-screen fixed inset-0 bg-white/50 dark:bg-[#1a1d23d2] backdrop-blur-xs flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#24272F] h-auto rounded-md w-[500px] shadow-lg p-6 relative">
                        <h3 className="text-lg font-[sans] font-semibold text-[#07011e] capitalize tracking-wide dark:text-white">Change Username</h3>
                        <IoMdClose className="text-black dark:text-red-600 absolute right-2 top-2 cursor-pointer" size={30} onClick={()=> {setOpenModal(false), setUserName("")}}/>

                        <form onSubmit={updateData} className="mt-4">
                            <label className="text-black dark:text-white text-sm font-[sans] tracking-wide">Old Username</label><br />
                            <input type="text" className="border-1 border-gray-700 dark:border-cyan-400 w-full h-[40px] mb-4 px-3 rounded-md outline-none mt-1 text-black dark:text-white focus:border-blue-400 focus:border-2" value={data.username} disabled/><br />

                            <label className="text-black dark:text-white text-sm font-[sans] tracking-wide">New Username</label><br />
                            <input type="text" className="border-1 border-gray-700 dark:border-cyan-400 w-full h-[40px] mb-4 px-3 rounded-md outline-none mt-1 text-black dark:text-white focus:border-blue-400 focus:border-2" placeholder="New username" value={username} onChange={(e)=> setUserName(e.target.value)} /><br />

                            <button disabled={loading} type="submit" className={`px-4 py-3 rounded-md text-white font-[sans] text-base ${loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 cursor-pointer"}`}>{loading ? "Updating..." : "Update username"}</button>
                        </form>
                    </div>
                </section>
            )}
        </>
    )
}