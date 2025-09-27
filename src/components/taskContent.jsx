import HeaderComponent from "../components/Header";

import { LuListFilter } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from "../supabase/authContext";
import Loader from "./ui/loader";
import { supabase } from "../supabase/supabase";
import toast from "react-hot-toast";
import FetchTask from "./fetchTask";

export default function TaskContent(){
    const { user, isLoading} = useAuth();
    const [openAddTask, setOpenAddTask] = useState(false);
    const [taskName, setTaskName] = useState("")
    const [taskDueDate, setTaskDueDate] = useState("")
    const [taskStatus, setTaskStatus] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [loading, setloading] = useState(false)
    const [autoLoad, setAutoLoad] = useState(0)


    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }
  

    const handleAddTask = async (e) => {
        e.preventDefault();

        if(!taskName.trim() ){
            toast.error("Task Name must be filled", {duration:4000});
            return;
        }

        setloading(true);
        const toastID = toast.loading("Adding Task...")
        const {data, error} = await supabase.from("tasks").insert([{
            taskName: taskName,
            taskDueDate: taskDueDate,
            taskStatus: taskStatus,
            taskDescription: taskDescription,
            user_id: user.id,
        }])
        if(error){
            toast.error(`Error adding tasking ${error.message}`)
            toast.dismiss(toastID)
            setloading(false)
            return
        }else{
            toast.success("Task added successfully", {id: toastID, duration: 3000})
            resetInput()

            setAutoLoad(p=>p+1)
        }
        setloading(false)
    }
   
    const resetInput =()=>{
        setTaskDueDate("")
        setTaskStatus("")
        setTaskDescription("")
        setTaskName("")
        setOpenAddTask(false)
    }
    
    return (<>
       {/* <HeaderComponent /> */}

        <section className="mt-10 w-[90%] h-[45px] mx-auto flex items-center justify-between ">
            <h3 className="text-2xl font-bold font-[sans] text-[#07011E] dark:text-white">My Tasks</h3>
            <div className="flex items-center gap-6 h-full">
                
                <div className="h-full px-6 bg-blue-600 rounded-md cursor-pointer" onClick={()=> {setOpenAddTask(true); }}>
                    <button className="w-full h-full text-white text-sm font-[sans] font-semibold tracking-wider cursor-pointer">+ Add Task</button>
                </div>
            </div>
        </section>

        {openAddTask &&
            <div className={`w-full h-screen fixed top-0 left-0 bg-[#d7d7e467] dark:bg-[#1a1d23d2] backdrop-blur-[4px] flex items-center justify-center z-50`}>
                {openAddTask && (<section className="lg:w-[30%] w-[100%] lg:h-[500px] h-[500px] overflow-y-auto p-4 bg-white dark:bg-[#24272F] shadow-md rounded-md relative overflow-hidden">
                    <IoClose className="absolute right-2 top-2 cursor-pointer text-black dark:text-red-600" size={35} onClick={()=> {resetInput();}}/>
                    
                    <h3 className="text-xl font-[sans] font-semibold tracking-wider text-[#07011e] dark:text-white">Add Task</h3>
                    <p className="text-sm font-[sans] text-black dark:text-white">Put in your tasks, and ensure to save tasks.</p>

                    <form className="mt-5 w-full lg:h-[400px] h-full overflow-x-auto scrollbar" onSubmit={handleAddTask}>
                        <div className="flex items-start flex-col w-full h-auto">
                            <label className="font-[sans] text-sm text-black dark:text-white">Task Name</label>
                            <input type="text" value={taskName} onChange={(e)=> setTaskName(e.target.value)} placeholder="Enter a task" className="border-2 border-black/50 dark:border-green-400 w-full h-[40px] px-2 rounded font-[sans] text-base text-gray-700 dark:text-white outline-none focus:border-2 focus:border-blue-600"/>
                        </div>
                        <div className="flex items-start flex-col w-full h-auto mt-3">
                            <label className="font-[sans] text-sm text-black dark:text-white">Task Due Date</label>
                            <input type="date" value={taskDueDate} onChange={(e)=> setTaskDueDate(e.target.value)} placeholder="Enter a task" className="border-2 border-black/50 dark:border-green-400  w-full h-[40px] px-2 rounded font-[sans] text-base text-black dark:text-white outline-none focus:border-2 focus:border-blue-600"/>
                        </div>
                        <div className="flex items-start flex-col w-full h-auto mt-3">
                            <label className="font-[sans] text-sm text-black dark:text-white">Task Status</label>

                            <select className="border-2 border-black/50 dark:border-green-400 w-full h-[40px] px-2 rounded font-[sans] text-base text-gray-700 dark:text-white outline-none focus:border-2 focus:border-blue-600" value={taskStatus} onChange={(e)=> setTaskStatus(e.target.value)} >
                                <option className="text-gray-700 dark:text-gray-700" value="" disabled>Select status</option>
                                <option className="text-gray-700 dark:text-gray-700" value="pending">To-Do (Pending)</option>
                                <option className="text-gray-700 dark:text-gray-700" value="doing">Doing (In-Progress)</option>
                                <option className="text-gray-700 dark:text-gray-700" value="done">Done</option>
                                {/* <option value="rejected">Rejected</option> */}
                            </select>
                        </div>
                        <div className="flex items-start flex-col w-full h-auto mt-3">
                            <label className="font-[sans] text-sm text-black dark:text-white">Task Descprition</label>
                            <div className="w-full h-[100px]">
                                <textarea value={taskDescription} onChange={(e)=> setTaskDescription(e.target.value )}  className="w-full h-full border-2 border-black/50 dark:border-green-400 px-2 rounded font-[sans] text-base text-black dark:text-white outline-none focus:border-2 focus:border-blue-600 resize-none" ></textarea>
                            </div>
                        </div>
                        <div className={`mt-3 w-full h-[40px] bg-[#07011e] rounded-full cursor-pointer ${loading ? "bg-blue-300" : "bg-blue-600"}`}>
                            <button className={`text-white w-full h-full font-[sans] font-normal ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>{loading ? (<div className="flex items-center justify-center gap-1 text-white"><p className="w-6 h-6 border-4 border-t-blue-600 border-gray-300 rounded-full animate-spin" /> Loading..</div>) : "Add Task"}</button>
                        </div>
                    </form>
                </section>)}
        </div>
        }

        <FetchTask autoLoad={autoLoad}/>
    </>)
}