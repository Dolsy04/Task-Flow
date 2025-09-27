import { supabase } from "../supabase/supabase"
import{ useState, useEffect } from "react"
import { useAuth } from "../supabase/authContext"
import toast from "react-hot-toast"
import Card from "./ui/card"
import Loader from "./ui/loader"
import { GoClock } from "react-icons/go";
import { LuLoaderCircle } from "react-icons/lu";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import PieChartComponennt from "./overviewPieChart";


export default function OverviewContent(){
    const { user, isLoading } = useAuth()
    const [totalPending, setTotalPending] = useState(0)
    const [totalDoing, setTotalDoing] = useState(0)
    const [totalDone, setTotalDone] = useState(0)
    const [loading, setLoading] = useState(false)

    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }
    
    

    const fetchTasks = async ()=>{
        try{
            setLoading(true);
        // console.log("Fetching tasks for user:", user.id);

            const {data: pendingData, error: pendingError} = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "pending").order("created_at", {ascending: false});

            if(pendingError){
                toast.dismiss()
                toast.error(`error fetching tasks: ${pendingError.message}`)
                throw pendingError
            }

            const { data: doneData, error: doneError } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "done").order("created_at", {ascending: false})

            if(doneError){
                  toast.dismiss()
                toast.error(`error fetching tasks: ${doneError.message}`)
                throw doneError
            }

            const { data: doingData, error: doingError } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "doing").order("created_at", {ascending: false})

            if(doingError){
                  toast.dismiss()
                toast.error(`error fetching tasks: ${doingError.message}`)
                throw doingError
            }

            setTotalPending(pendingData)
            setTotalDone(doneData)
            setTotalDoing(doingData)
        }catch (error){
              toast.dismiss()
            toast.error(`error fetching tasks: ${error.message}`)
        }finally{
            setLoading(false)
        }
        
    }
    useEffect(()=>{
        if(user) fetchTasks();
    },[user]) 


    return (<section className="mb-20">
        {loading ? (<div className="w-[90%] mx-auto my-10 h-300px bg-white dark:bg-[#2C303A] p-6 flex items-center justify-center rounded-md"><Loader /></div>) : (
        <div className="lg:w-[90%] w-[80%] mx-auto my-10 bg-white dark:bg-[#2C303A] rounded-md flex items-center justify-center lg:flex-nowrap flex-wrap lg:gap-20 gap-10 py-2 lg:py-6">
            <Card className="">
                <div className="flex lg:items-start lg:justify-start gap-3 lg:flex-row flex-col items-center justify-center">
                    <GoClock className="lg:w-5 lg:h-5 w-10 h-10 text-orange-500"/>
                    <div className="flex lg:items-start flex-col gap-1">
                        <p className="font-[sans] text-orange-500 text-base  text-center">Total Pending Task</p>
                        <p className="font-[sans] font-semibold text-xl tracking-wide text-orange-500 text-center">{String(totalPending.length || 0).padStart(3, "0")}</p>
                    </div>
                </div>
            </Card>
            <hr className="lg:border-r border-b w-[90%] lg:w-0 border-gray-400 lg:h-20"/>
            <Card className="">
                <div className="flex lg:items-start lg:justify-start gap-3 lg:flex-row flex-col items-center justify-center">
                        <LuLoaderCircle className="lg:w-5 lg:h-5 w-10 h-10 text-blue-500"/>
                    <div className="flex lg:items-start flex-col gap-1">
                        <p className="font-[sans] text-blue-500 text-base  text-center">Total Doing Task</p>
                        <p className="font-[sans] font-semibold text-xl tracking-wide text-blue-500 text-center">{String(totalDoing.length || 0).padStart(3, "0")}</p>
                    </div>
                </div>
            </Card>
            <hr className="lg:border-r border-b w-[90%] lg:w-0 border-gray-400 lg:h-20"/>
            <Card className="">
                <div className="flex lg:items-start lg:justify-start gap-3 lg:flex-row flex-col items-center justify-center">
                    <IoIosCheckmarkCircleOutline className="lg:w-5 lg:h-5 w-10 h-10 text-emerald-500"/>
                    <div className="flex lg:items-start flex-col gap-1">
                        <p className="font-[sans] text-emerald-500 text-base  text-center">Total Done Task</p>
                        <p className="font-[sans] font-semibold text-xl tracking-wide text-emerald-500 text-center">{String(totalDone.length || 0).padStart(3, "0")}</p>
                    </div>
                </div>
            </Card>

        </div>
        )}


        <div className="w-[90%] mx-auto">
            <PieChartComponennt />
        </div>
    </section>)
}   