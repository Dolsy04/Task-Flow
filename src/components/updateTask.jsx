import { supabase } from "../supabase/supabase"
import { useState } from "react"
import toast from "react-hot-toast"
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../supabase/authContext"

export default function UpdateTask({task, onClose, onUpdate}){
    const { user, isLoading} = useAuth()
    const [taskName, setTaskName] = useState(task.taskName || "")
    const [taskStatus, setTaskStatus] = useState(task.taskStatus ||"")
    const [taskDescription, setTaskDescription] = useState(task.taskDescription ||"")
    const [taskDueDate, setTaskDueDate] = useState(task.taskDueDate ||"")
    const [loading, setLoading] = useState(false)


    // useEffect(()=>{
        const updateTask = async (e) => {
            e.preventDefault()
            setLoading(true)
            const toastID = toast.loading("Updating Task...")
            const { error } = await supabase.from("tasks").update({
                taskName: taskName,
                taskStatus: taskStatus,
                taskDescription: taskDescription,
                taskDueDate: taskDueDate,
            }).eq("id", task.id).eq("user_id", user.id)

            if (error) {
                toast.error(`Error updating task ${error.message}`)
                toast.dismiss(toastID)
            }else{
                toast.success("Update task successfully", {id: toastID, duration: 4000});
                onUpdate?.()
                onClose()
            }
            setLoading(false)
        }

    // },[])
    

    return (
        <>
            <div className="w-full h-screen fixed inset-0 bg-white/50 dark:bg-[#1a1d23d2] backdrop-blur-xs flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#24272F] h-screen overflow-y-auto rounded-md w-[500px] shadow-lg">
                    <div className="flex items-center rounded-md justify-between shadow py-4 px-6 sticky top-0 bg-white dark:bg-[#24272F] z-30">
                        <h3 className="text-lg font-[sans] font-semibold text-[#07011e] capitalize tracking-wide dark:text-white">Update task</h3>
                        <IoCloseSharp className="cursor-pointer text-black dark:text-red-600" size={35} onClick={onClose} />
                    </div>

                    <form className="p-6 w-full" onSubmit={updateTask}> 
                        <div className="w-full h-auto flex flex-col">
                            <label className="text-base text-[#07011e] dark:text-white font-[sans]">Task Name</label>
                            <input type="text" className="border-1 border-gray-400 w-full h-[40px] rounded-md outline-none px-2 text-base text-[#07011e] dark:text-white font-[sans] focus:border-2 focus:border-blue-600" value={taskName} onChange={(e)=> setTaskName(e.target.value)}/>
                        </div>
                        <div className="w-full h-auto flex flex-col mt-5">
                            <label className="text-base text-[#07011e] dark:text-white font-[sans]">Task Description</label>
                            
                            <div className="w-full h-[100px]">
                                <textarea  className="w-full h-full border-1 border-gray-400 px-2 rounded font-[sans] text-base text-black dark:text-white outline-none focus:border-2 focus:border-blue-600 resize-none" value={taskDescription} onChange={(e)=> setTaskDescription(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="w-full h-auto flex flex-col mt-5">
                            <label className="text-base text-[#07011e] dark:text-white font-[sans]">Task Due Date</label>
                            <input type="date" className="border-1 border-gray-400 w-full h-[40px] rounded-md outline-none px-2 text-base text-[#07011e] dark:text-white font-[sans] focus:border-2 focus:border-blue-600" value={taskDueDate} onChange={(e)=> setTaskDueDate(e.target.value)}/>
                        </div>
                        <div className="w-full h-auto flex flex-col mt-5">
                            <label className="text-base text-[#07011e] dark:text-white font-[sans]">Task Status</label>
                            <div className="flex items-start lg:justify-between w-[100%] mx-auto mt-3 flex-wrap gap-5">
                                <div className="flex items-center justify-center border border-gray-400 px-3 py-2 rounded-md gap-2">
                                    <p className="text-base font-[sans] text-[#07011e] dark:text-white">Pending</p>
                                    <input type="radio" name="taskStatus" value="pending" onChange={(e)=> setTaskStatus(e.target.value)} checked={taskStatus === "pending"} />
                                </div>
                                <div className="flex items-center justify-center border border-gray-400 px-3 py-2 rounded-md gap-2">
                                    <p className="text-base font-[sans] text-[#07011e] dark:text-white">In Progress</p>
                                    <input type="radio" name="taskStatus" value="doing" onChange={(e)=> setTaskStatus(e.target.value)} checked={taskStatus === "doing"} />
                                </div>
                                <div className="flex items-center justify-center border border-gray-400 px-3 py-2 rounded-md gap-2">
                                    <p className="text-base font-[sans] text-[#07011e] dark:text-white">Done</p>
                                    <input type="radio" name="taskStatus" value="done" onChange={(e)=> setTaskStatus(e.target.value)} checked={taskStatus === "done"} />
                                </div>
                            </div>
                        </div>

                        <div className={`mt-7 text-white w-full h-[44px] rounded-full ${loading ? "bg-blue-300" : "bg-blue-600"}`}>
                            <button className={`w-full h-full font-[sans] text-base tracking-wide ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>{loading ? (<div className="flex items-center justify-center gap-1 text-white"><p className="w-6 h-6 border-4 border-t-blue-600 border-gray-300 rounded-full animate-spin" /> Loading..</div>) : "Update Task"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}