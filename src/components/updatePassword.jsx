import Card from "./ui/card";
import Button from "./ui/button";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";

export default function UpdatePassword(){
    const [togglePassword, setTogglePassword] = useState(false)
    const [password, setPassword] = useState("");
    const [resetPasswordResponse, setResetPasswordResponse] = useState("");
    const navigate = useNavigate()

    const passwordToggle = () =>{
        setTogglePassword(!togglePassword);
    }

    useEffect(()=>{
        const { data: sub } = supabase.auth.onAuthStateChange(async(e, session)=>{
            if(e == "PASSWORD_RECOVERY"){
                toast.info("Password Reset Mode active")
            }
        });
        return ()=>{
            sub.subscription.unsubscribe();
        }
    },[])

    const passwordUpdateState = async (e) => {
       e.preventDefault();

       if(!password){
        toast.error("Password can't be empty");
        return;
       }

       const { data, error} = await supabase.auth.updateUser({password});

       return error ? error.message.includes("Auth session missing") ? (toast.error(`Reset link expired. Request a new one`), setTimeout(()=>{navigate("/")},3000)) : (toast.error(`Error updating password ${error.message}`), setResetPasswordResponse(`Error updating password ${error.message}`)) : data ? (toast.success(`Password updated successfully. You can login now`), setResetPasswordResponse(`Password updated successfully. You can login now`), setTimeout(()=>{navigate("/")},3000)) : null;
    }
    
    return (
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col">
            <div className={`h-auto mx-auto overflow-y-auto min-w-[80%] lg:min-w-[400px]`}>
                <div className={`mb-10 flex items-center gap-3 ml-0`}>
                    <h1 className="text-white text-2xl font-bold font-sans">Task Flow</h1>
                </div>
                <Card title= "Update Password" subTitle="Input New Password" className="bg-black/50 rounded-lg px-6 pt-6 pb-10">
                <hr className="border-b border-white/20 mt-2"/>
                    <form className="w-full h-full" onSubmit={passwordUpdateState}>
                        <div className={`mt-4`}>
                            <div className="flex items-center justify-between">
                                <label className="text-white text-base font-normal font-sans tracking-wide">New Password</label><br />
                            </div>
                            <div className="bg-transparent w-full h-[40px] mt-2 border-2 border-white/50 rounded-md px-2 focus-within:border-2 focus-within:border-blue-400 focus-within:shadow-sm focus-within:shadow-white flex items-center">
                                <input value={password} onChange={(e)=> setPassword(e.target.value)} type={togglePassword ? "text" : "password"} className="flex-1 bg-transparent h-full border-none outline-none text-lg text-white"/>
                                <div onClick={passwordToggle}>
                                    {togglePassword ? <FaRegEye color="white"/> : <FaRegEyeSlash color="white"/>}
                                </div>
                            </div>
                        </div>

                        <p className={`text-sm font-sans font-normal mt-4 text-red-600 w-full ${resetPasswordResponse ? "block" : "hidden"}`}>{resetPasswordResponse}</p>
                        <div className="mt-8 w-full h-[40px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-[50px] border border-white/20">
                            <Button type="submit" className="w-full h-full text-center border border-white rounded-[50px] flex items-center justify-center text-white text-base font-sans cursor-pointer">
                                <span>Update Password</span>
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
