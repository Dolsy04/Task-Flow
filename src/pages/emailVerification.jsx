import Card from "../components/ui/card";
import { supabase } from "../supabase/supabase";
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

export default function EmailVerificationAlert(){
    const location = useLocation();
    const [userEmail, setUserEmail] = useState(location.state?.email || "");
    
    useEffect(()=>{
        if(!location.state?.email){
            setUserEmail("No email found. Please sign up again.");
        }
    },[location.state])

    return (<Card className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center flex-col">
        <div className="bg-black/50 rounded-lg px-6 pt-6 pb-6 max-w-[500px] h-auto">
            <h3 className="text-2xl font-semibold text-orange-400">Sign-up Verification</h3>
            <hr className="border-b border-orange-400 mt-2"/>
            <div className="mt-3">
                 <p className="text-base text-white font-sans">
            Email verification has been sent to{" "}
            <strong className="text-orange-300">{userEmail}</strong>. Open your
            mail to confirm your email. You’ll be redirected to login after
            confirmation.
                </p>

            </div>
        </div>
    </Card>)
}