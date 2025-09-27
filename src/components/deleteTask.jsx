import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase/supabase";
import { useAuth } from "../supabase/authContext";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-hot-toast"


export default function DeleteTask({task, onClose, onUpdate}){
    const {user, IsLoading} = useAuth();
    const [loading, setLoading] = useState(false)

    const handleDeleteTask = async () =>{
        setLoading(true)
        const toastID = toast.loading("Deleting Task...")
        const { error } = await supabase.from("tasks").delete().eq("id", task.id).eq("user_id", user.id)

        if (error) {
            toast.error(`Error Deleting task ${error.message}`)
            toast.dismiss(toastID)
        }else{
            toast.success("Task deleted successfully", {id: toastID, duration: 4000});
            onUpdate?.()
            onClose()
        }
        setLoading(false)
    }

    return(<>
        <section className="fixed inset-0 bg-white/50 dark:bg-[#1a1d23d2] backdrop-blur-sm flex items-center justify-center w-full h-screen z-50">
            <div className="bg-white dark:bg-[#24272F]  shadow-xl rounded-xl p-6">
                <div className="relative w-full p-3">
                    <h4 className="text-center font-[sans] text-base text-red-600 dark:text-red-300">Delete Task</h4>
                    <IoMdClose size={30} onClick={onClose} className="text-xl cursor-pointer absolute right-2 top-2 text-black dark:text-red-600"/>
                </div>
                <div>
                    <p className="text-center mb-3 px-3 font-[sans] text-base dark:text-white">Are you sure you want to delete <span className="font-semibold text-red-600">{task.taskName}</span> ?</p>
                </div>
                <div className="w-full flex items-center justify-end gap-8">
                    <button onClick={onClose} className="px-4 py-2 cursor-pointer bg-white rounded-md border border-red-400 text-sm text-red-600 font-normal font-[sans]">Cancel</button>
                    <button disabled={loading} onClick={handleDeleteTask} className={`px-4 py-2 text-sm text-white font-normal font-[sans] rounded-md ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 cursor-pointer"}`}>{loading ? (<div className="flex items-center justify-center gap-1 text-white"><p className="w-6 h-6 border-4 border-t-blue-600 border-gray-300 rounded-full animate-spin" /> Deleting...</div>) : "Delete"}</button>
                </div>
            </div>
        </section>
    </>);
}