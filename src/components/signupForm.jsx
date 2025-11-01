import Card from "./ui/card";
import Button from "./ui/button";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";

export default function SignUpForm(){
    const [togglePassword, setTogglePassword] = useState(false)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const passwordToggle = () =>{
        setTogglePassword(!togglePassword);
    }
    
    const calAge = (dob) =>{
        const ageDate =  new Date(dob);
        const today = new Date()

        let age = today.getFullYear() - ageDate.getFullYear()
        const month = today.getMonth() - ageDate.getMonth()
        const day = today.getDate() - ageDate.getDate()

        if(month < 0 || (month === 0 && day < 0)){
            age--;
        }
        return age;
    }

    const userAge = calAge(dob)

    const handleSignUP = async (e) => {
        e.preventDefault()

        if(!email.trim() || !password || !username.trim() || !gender.trim()){
            toast.error("All field are required", {duration: 4000})
            return;
        }
        setIsLoading(true);
        const toastID = toast.loading("Creating Account...");

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            toast.error(`Sign-up Error ${error.message}`, {duration: 4000})
            setIsLoading(false);
            toast.dismiss(toastID);
            return;
        }
        if(data?.user?.identities?.length === 0){
            toast.error("Email has been registered, Please Login instead", {duration: 4000})
            setIsLoading(false);
            toast.dismiss(toastID);
            return;
        }

        const { error: insertError } = await supabase.from("users").insert([{
            auth_id: data.user.id,
            username: username,
            email: email,
            gender: gender,
            dob: dob,
            age: userAge,
        }])
        if(insertError){
            toast.error(`Error saving user info: ${insertError.message}`, {duration: 4000})
            setIsLoading(false);
            toast.dismiss(toastID);
            return;
        }


        toast.success(`Sign-up successful ${data.user.email}`, {id:toastID, duration: 4000})
        setEmail("");
        setPassword("");
        setGender("");
        setUsername("");
        setDob("");
        setIsLoading(false);

        setTimeout(()=>{
            navigate("/emailverification", { state: {email}})
        }, 2000)
    }

    return (
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col">
            <div className={`min-w-[80%] lg:min-w-[400px] h-auto mx-auto overflow-y-auto scrollbar`}>
                <div className={`mb-4 flex items-center gap-3 ml-0`}>
                    <Link to="/" className="flex items-center gap-1 text-blue-400 text-sm">
                    <span><IoIosArrowRoundBack /></span>
                    <span>Go back</span>
                    <span>/</span>
                    </Link>
                    <h1 className="text-white text-2xl font-bold font-sans">Task Flow</h1>
                </div>

                <Card title="Sign-up" subTitle="Welcome! Fill in your details." className="bg-black/50 rounded-lg px-6 pt-6 pb-6">
                <hr className="border-b border-white/20 mt-2"/>
                    <form className="w-full h-full" onSubmit={handleSignUP}>
                        <div className="flex items-start flex-col mt-2">
                            <label className="text-white text-base font-normal font-sans tracking-wide">Username</label>
                            <input type="text" placeholder="username" className="bg-transparent border-2 border-white/50 w-full h-[40px] rounded-md font-sans font-semibold text-lg text-white px-2 mt-2 outline-0 focus:border-2 focus:border-blue-400 focus:shadow-sm focus:shadow-white" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                        </div>

                        <div className="flex items-start flex-col mt-2">
                            <label className="text-white text-base font-normal font-sans tracking-wide">Email</label>
                            <input type="email" placeholder="example@gmail.com" className="bg-transparent border-2 border-white/50 w-full h-[40px] rounded-md font-sans font-semibold text-lg text-white px-2 mt-2 outline-0 focus:border-2 focus:border-blue-400 focus:shadow-sm focus:shadow-white" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                        </div>

                        <div className="flex items-start flex-col mt-2">
                            <label className="text-white text-base font-normal font-sans tracking-wide">Date of Birth</label>
                            <input type="date" className="bg-transparent border-2 border-white/50 w-full h-[40px] rounded-md font-sans font-semibold text-lg text-white px-2 mt-2 outline-0 focus:border-2 focus:border-blue-400 focus:shadow-sm focus:shadow-white" value={dob} onChange={(e)=> setDob(e.target.value)}/>
                        </div>

                        <div className="flex items-start flex-col mt-2">
                            <label className="text-white text-base font-normal font-sans tracking-wide">Gender</label>
                            <select className="bg-transparent border-2 border-white/50 w-full h-[40px] rounded-md font-sans font-semibold text-lg text-white px-2 mt-2 outline-0 focus:border-2 focus:border-blue-400 focus:shadow-sm focus:shadow-white" value={gender} onChange={(e)=> setGender(e.target.value)}>
                                <option className="text-black" value="">Select a gender</option>
                                <option className="text-black" value="male">Male</option>
                                <option className="text-black" value="female">Female</option>
                            </select>
                        </div>

                        <div className={`mt-2`}>
                            <label className="text-white text-base font-normal font-sans tracking-wide">Password</label>
                            <div className="bg-transparent w-full h-[40px] mt-2 border-2 border-white/50 rounded-md px-2 focus-within:border-2 focus-within:border-blue-400 focus-within:shadow-sm focus-within:shadow-white flex items-center">
                                <input value={password} onChange={(e)=> setPassword(e.target.value)} type={togglePassword ? "text" : "password"} placeholder="........." className="flex-1 bg-transparent h-full border-none outline-none text-lg text-white"/>
                                <div onClick={passwordToggle}>
                                    {togglePassword ? <FaRegEye color="white"/> : <FaRegEyeSlash color="white"/>}
                                </div>
                            </div>
                        </div>

                        <div className={`mt-8 w-full h-[40px] rounded-[50px] border border-white/20 ${isLoading ? "bg-blue-400" : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"}`}>
                            <Button disable={isLoading} type="submit" className={`w-full h-full text-center border border-white rounded-[50px] flex items-center justify-center text-white text-base font-sans  ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                <span>{isLoading ? (<div className="flex items-center justify-center gap-1 text-white"><p className="w-6 h-6 border-4 border-t-blue-600 border-gray-300 rounded-full animate-spin" /> Loading..</div>) : "Sign up"}</span>
                            </Button>
                        </div>

                        <div className={`mt-3 text-center text-white text-sm font-sans font-normal`}>
                            <p>Already have an account <Link to="/" className="text-blue-300">LogIn</Link></p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
