import toast from "react-hot-toast"
import { supabase } from "../supabase/supabase"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../supabase/authContext";
import Loader from "../components/ui/loader";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import HeaderComponent from "../components/Header";
import Footer from "../components/ui/footer";
import { useState } from "react";


export default function DashBoardPage(){
    const { user, isLoading } = useAuth();
    const [openNav, setOpenNav] = useState(false)
    const [refreshHeader, setRefreshHeader] = useState(false)
    

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

            <div className="w-full transition-colors duration-300 h-screen flex overflow-hidden">
                <Sidebar isActive={openNav} onClose={() => setOpenNav(false)}/>
                <div className="grow bg-[#f5f5f5] dark:bg-[#24272f] transition-colors duration-300 overflow-y-auto h-full">
                    <HeaderComponent onOpenNav={() => setOpenNav(true)} onUpdate={refreshHeader}/>
                    <Outlet />
                    <hr className="w-[90%] mx-auto mt-20 border-b border-[#0000006e] dark:border-white"/>
                    <Footer />
                </div>
            </div>
        </>
    )
}



{/* <h1 className="text-blue-500 text-4xl text-center">DASHBOARD</h1> */}
// const navigate = useNavigate()
{/* <button onClick={signOut}>Logout</button> */}
//     const signOut = async () => {
//         const { error } = await supabase.auth.signOut()
//         if (error) {
//             toast.error(`Error signing Out ${error.message}`)
//         }else{
//             toast.success("Sign out successfull", {})
//             navigate("/", {replace: true})
//         }
//     }   