import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { supabase } from "../supabase/supabase"
import{ useState, useEffect } from "react"
import { useAuth } from "../supabase/authContext"
import toast from "react-hot-toast"
import Card from "./ui/card"
import Loader from "./ui/loader"


export default function PieChartComponennt(){
    const { user, isLoading } = useAuth()
    const [totalPending, setTotalPending] = useState(0)
    const [totalDoing, setTotalDoing] = useState(0)
    const [totalDone, setTotalDone] = useState(0)
    const [allTask, setAllTask] = useState([])
    const [sliceTask, setSliceTask] = useState([])
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

            const {data: allTaskData, error: allTaskError} = await supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", {ascending: false});

             if(allTaskError){
                toast.error(`error fetching tasks: ${pendingError.message}`)
                throw pendingError
            }

            const {data: pendingData, error: pendingError} = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "pending").order("created_at", {ascending: false});

            if(pendingError){
                toast.error(`error fetching tasks: ${pendingError.message}`)
                throw pendingError
            }

            const { data: doneData, error: doneError } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "done").order("created_at", {ascending: false})

            if(doneError){
                toast.error(`error fetching tasks: ${doneError.message}`)
                throw doneError
            }

            const { data: doingData, error: doingError } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "doing").order("created_at", {ascending: false})

            if(doingError){
                toast.error(`error fetching tasks: ${doingError.message}`)
                throw doingError
            }

            setAllTask(allTaskData)
            setTotalPending(pendingData)
            setTotalDone(doneData)
            setTotalDoing(doingData)
        }catch (error){
            toast.error(`error fetching tasks: ${error.message}`)
        }finally{
            setLoading(false)
        }
        
    }
    useEffect(()=>{
        if(user) fetchTasks();
    },[user]) 
    useEffect(()=>{
        if(allTask && allTask.length > 0){
            const sliceAllTask = allTask.slice(0, 5)
            setSliceTask(sliceAllTask)
        }
    },[allTask])

    const datas = [
        {name: "Pending Task", value: totalPending.length || 0, color: "#f97316",},
        {name: "Doing Task", value: totalDoing.length || 0, color: "#3b82f6",},
        {name: "Done Task", value: totalDone.length || 0, color: "#10b981",},
    ]

    return(<div className="flex lg:items-start items-center lg:flex-nowrap flex-wrap  gap-5 justify-center">
        {loading ? (<div className="w-[300px] bg-white dark:bg-[#2C303A] p-6 flex items-center justify-center rounded-md"><Loader /></div>) : totalPending.length === 0 && totalDoing.length === 0 && totalDone.length === 0 ? (<p className="w-[300px] h-[150px] bg-white dark:bg-[#2C303A] p-6 flex items-center justify-center rounded-md text-red-600 text-xl font-[sans] font-normal">Zero Statistics</p>) : (
            <div className="w-[350px] h-auto flex items-center justify-center flex-col bg-white dark:bg-[#2C303A] rounded-md py-3">
            <h3 className="font-[sans] text-lg font-semibold text-gray-600 dark:text-white">Task Statistics</h3>
            <PieChart width={300} height={320}>
                <Pie data={datas} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {datas.map((data, i) => (
                        <Cell key={`cell-${i}`} fill={data.color}/>
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
        )}


        {loading ? (<div className="w-[300px]  bg-white dark:bg-[#2C303A] p-6 flex items-center justify-center rounded-md"><Loader /></div>) : sliceTask.length === 0 ? (<p className="w-[300px] h-[150px] bg-white dark:bg-[#2C303A] p-6 flex items-center justify-center rounded-md text-red-600 text-xl font-[sans] font-normal">No Recent Task Avaliable</p>) : (<div className="p-4 bg-white dark:bg-[#2C303A] rounded-lg shadow-sm w-full lg:max-w-2xl max-w-full">
            <h3 className="lg:text-lg font-semibold text-gray-700 dark:text-white mb-3 font-[sans]">Recent Task</h3>
            <div className="w-full overflow-x-auto">
                <table className="min-w-[700px] text-xs lg:text-sm border-gray-200 dark:border-gray-800 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-[#343A40] text-gray-700 dark:text-white uppercase text-sm font-bold tracking-wide">
                            <td className="lg:px-4 px-1 text-xs lg:text-sm lg:py-3 py-2 text-left border-b border-gray-300 capitalize">S/N</td>
                            <td className="lg:px-4 px-1 text-xs lg:text-sm lg:py-3 py-2 text-left border-b border-gray-300 capitalize">Task Name</td>
                            <td className="lg:px-4 px-1 text-xs lg:text-sm lg:py-3 py-2 text-left border-b border-gray-300 capitalize">Task Description</td>
                            <td className="lg:px-4 px-1 text-xs lg:text-sm lg:py-3 py-2 text-left border-b border-gray-300 capitalize">Due By</td>
                            <td className="lg:px-4 px-1 text-xs lg:text-sm lg:py-3 py-2 text-left border-b border-gray-300 capitalize">Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        {sliceTask.map((task, index)=>(
                            <tr key={index} className="hover:bg-gray-50 hover:dark:bg-[#343A40] border-b border-gray-300 dark:border-green-500 transition-colors duration-200">
                                <td className="py-3 font-[sans] capitalize text-gray-700 dark:text-cyan-200">{index + 1}</td>
                                <td className="py-3 font-[sans] border-gray-300 capitalize text-gray-700 dark:text-cyan-200">{task.taskName  && task.taskName.length > 20 ? task.taskName.slice(0, 20) + "..." : task.taskName}</td>
                                <td className="py-3 font-[sans] border-gray-300 capitalize text-gray-700 dark:text-cyan-200">{task.taskDescription && task.taskDescription.length > 20 ? task.taskDescription.slice(0, 20) + "..." : task.taskDescription || "Null"}</td>
                                <td className="py-3 font-[sans] border-gray-300 capitalize text-gray-700 dark:text-cyan-200">{new Date(task.taskDueDate).toLocaleDateString("en-us", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}</td>
                                <td className={`py-3 font-[sans] border-gray-300 capitalize text-gray-700 dark:text-cyan-200`}>
                                    <span className={`py-0.5 px-2 rounded-full text-xs lg:text-sm ${task.taskStatus === "pending" ? "bg-red-600 text-white" : task.taskStatus === "doing" ? "bg-green-400 dark:text-black text-white" : task.taskStatus === "done" ? "bg-green-600 text-white" : ""}`}>{task.taskStatus}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>)}
    </div>);
}