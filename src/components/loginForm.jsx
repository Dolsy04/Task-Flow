import Card from "./ui/card";
import Button from "./ui/button";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import {toast} from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/supabase";

export default function LoginForm(){
    const [togglePassword, setTogglePassword] = useState(false)
    const [resetPasswordToggle, setResetPasswordToggle] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetPasswordForEmail, setResetPasswordForEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const passwordToggle = () =>{
        setTogglePassword(!togglePassword);
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        if(!email.trim() || !password.trim()){
            toast.error("All field are required")
            return;
        }

        setIsLoading(true)
        const toastID = toast.loading("Signing you in...")

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            toast.error(`Sign in Error ${error.message}`)
            setIsLoading(false);
            toast.dismiss(toastID);
            return;
        }else{
            toast.success(`SignIn succesfully ${data.user.email}`, {id: toastID, duration: 3000})
            navigate("/dashboard")
        }

        setEmail("");
        setPassword("")
        setIsLoading(false);

    }

    const handleReset = async (e) => {
        e.preventDefault()
        setIsLoading(true);
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://task-flow-tawny.vercel.app/updatepassword",
        })
         if (error) {
            toast.error(`Reset password Error ${error.message}`)
            setIsLoading(false);
            return;
        }
        toast.success(`Reset Password link sent ${email}`, {duration: 4000})
        setResetPasswordForEmail(`Resent password link as been sent to your ${email}. Please resent your password and login into your board!.`)
        setIsLoading(false);
    }


    return (
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col">
            <div className={` h-auto mx-auto overflow-y-auto ${resetPasswordToggle ? "max-w-[85%] lg:max-w-[400px]" : "min-w-[80%] lg:min-w-[400px]"}`}>
                <div className={`mb-10 flex items-center gap-3 ${resetPasswordToggle ? "ml-1" : "ml-0"}`}>
                    {resetPasswordToggle && (
                        <Link onClick={()=> {setResetPasswordToggle(false), setEmail("") }} className="flex items-center gap-1 text-blue-400 text-sm">
                        <span><IoIosArrowRoundBack /></span>
                        <span>Go back</span>
                        <span>/</span>
                        </Link>
                    )}
                    
                    <h1 className="text-white text-2xl font-bold font-sans">Task Flow</h1>

                </div>
                <Card title={resetPasswordToggle ? "Reset Password" : "Login"} subTitle={resetPasswordToggle ? "Input your registerd email" : "Welcome! Fill in your details."} className="bg-black/50 rounded-lg px-6 pt-6 pb-10">
                <hr className="border-b border-white/20 mt-2"/>
                    <form className="w-full h-full" onSubmit={resetPasswordToggle ? handleReset : handleLogin}>
                        <div className="flex items-start flex-col mt-4">
                            <label className="text-white text-base font-normal font-sans tracking-wide">Email</label>
                            <input type="email" placeholder={resetPasswordToggle ? "example@gmail.com" : "example@gmail.com"} className="bg-transparent border-2 border-white/50 w-full h-[40px] rounded-md font-sans font-semibold text-lg text-white px-2 mt-2 outline-0 focus:border-2 focus:border-blue-400 focus:shadow-sm focus:shadow-white" value={email} onChange={(e)=> setEmail(e.target.value)} />
                        </div>

                        <div className={`mt-4 ${resetPasswordToggle ? "hidden" : "block"}`}>
                            <div className="flex items-center justify-between">
                                <label className="text-white text-base font-normal font-sans tracking-wide">Password</label><br />
                                <span onClick={()=>setResetPasswordToggle(true)} className="text-red-600 text-sm font-sans cursor-pointer">Forgot Password</span>
                            </div>
                            <div className="bg-transparent w-full h-[40px] mt-2 border-2 border-white/50 rounded-md px-2 focus-within:border-2 focus-within:border-blue-400 focus-within:shadow-sm focus-within:shadow-white flex items-center">
                                <input value={password} onChange={(e)=> setPassword(e.target.value)} type={togglePassword ? "text" : "password"} placeholder="........." className="flex-1 bg-transparent h-full border-none outline-none text-lg text-white"/>
                                <div onClick={passwordToggle}>
                                    {togglePassword ? <FaRegEye color="white"/> : <FaRegEyeSlash color="white"/>}
                                </div>
                            </div>
                        </div>

                        <p className={`text-sm font-sans font-normal mt-4 text-red-600 ${resetPasswordToggle ? "block" : "hidden"}`}>{resetPasswordForEmail}</p>

                        <div className={`mt-8 w-full h-[40px] rounded-[50px] border border-white/20 ${isLoading ? "bg-blue-400" : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"}`}>
                             <Button disable={isLoading} type="submit" className={`w-full h-full text-center border border-white rounded-[50px] flex items-center justify-center text-white text-base font-sans  ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                <span>{isLoading ? (<div className="flex items-center justify-center gap-1 text-white"><p className="w-6 h-6 border-4 border-t-blue-600 border-gray-300 rounded-full animate-spin" /> Loading..</div>) : resetPasswordToggle ? "Reset Password" : "Login"}</span>
                            </Button>
                        </div>
                        <div className={`text-center text-white text-sm font-sans font-normal mt-3 ${resetPasswordToggle ? "hidden" : "block"}`}>
                            <p>Do not have an account <Link to="signup" className="text-blue-300">Sign up</Link></p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
