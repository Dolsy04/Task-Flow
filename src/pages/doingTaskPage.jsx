import HeaderComponent from "../components/Header";
import Loader from "../components/ui/loader";
import { useAuth } from "../supabase/authContext";
import { supabase } from "../supabase/supabase";
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast } from"react-hot-toast"
import { FaRegClock } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import UpdateTask from "../components/updateTask";
import DeleteTask from "../components/deleteTask";
import { IoCloseSharp } from "react-icons/io5";

export default function DoingTaskPage(){
    const { user, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [tasks, setTask] = useState([]);
    const [filteredTask, setFilteredTask] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [taskDetails, setTaskDetails] = useState(false)

    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }
    if(!user){
        return <Navigate to="/"/>
    }

    const fetchTasks = async ()=>{
        try{
            setLoading(true);
        // console.log("Fetching tasks for user:", user.id);

            const {data, error} = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "doing").order("created_at", {ascending: false});

            if(error){
                toast.dismiss()
                toast.error(`error fetching tasks: ${error.message}`, {duration: 4000})
                throw error
            }

            setTask(data)
        }catch (error){
            toast.dismiss()
            toast.error(`error fetching tasks: ${error.message}`, {duration: 4000})
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(user) fetchTasks();
    },[user]) 

    // search 
    useEffect(()=>{
        if(search.trim()){
            const searchTasks = tasks.filter((task)=> task.taskName.toLowerCase().includes(search.toLowerCase()) || String(task.taskDueDate).toLowerCase().includes(search.toLowerCase()))

            setFilteredTask(searchTasks)
            setCurrentPage(1)
        }else{
            setFilteredTask(tasks)
        }
    },[tasks, search])

    const paginatedPage = filteredTask.slice((currentPage -1) * 15, currentPage * 15 );
    const pageNumber = Math.ceil(filteredTask.length / 15);

    const handleOpenEdit = (task) =>{
        setIsModalOpen(true);
        setSelectedTask(task)
    }
    const handleDeleteTask = (task) =>{
        setIsDeleteModalOpen(true);
        setSelectedTask(task)
    }
    const handleViewDetails = (task) =>{
        setTaskDetails(true);
        setSelectedTask(task)
    }


    const handleCloseModal = () =>{
        setIsModalOpen(false);
        setSelectedTask(null)
    }
    const handleDeleteCloseModal = () =>{
        setIsDeleteModalOpen(false);
        setSelectedTask(null)
    }
     const handleCloseViewDetails = () =>{
        setTaskDetails(false);
        setSelectedTask(null)
    }


    return (<>
        {/* <HeaderComponent /> */}
        <div className="w-[90%] mx-auto flex items-center justify-between lg:flex-row flex-col">
            <div className="flex items-center gap-2">
                <Link to="/dashboard/task" className="flex items-center gap-2">
                    <span className="text-2xl border-1 w-8 h-auto border-gray-400 dark:border-red-600 flex items-center justify-center rounded my-4 text-gray-600 dark:text-red-600"><IoIosArrowRoundBack /></span>
                    <span className="text-gray-600 dark:text-red-600 text-base font-[sans]">Go back</span>
                </Link>
                <span className="text-gray-600 dark:text-red-600 text-base font-[sans]">/</span>
                <span className="text-gray-900 dark:text-white text-base font-[sans]">In-progress Tasks</span>
            </div>
            <div className="border-2 border-gray-500 dark:border-white rounded-full md:w-[50%] w-full lg:w-[30%] flex items-center h-[40px] px-2 focus-within:border-blue-400">
                <IoSearch className="h-full w-[20px] dark:text-white text-gray-600 rounded-full"/>
                <input type="search" placeholder="search by task name" value={search} onChange={(e) => setSearch(e.target.value)} className="border-none px-2 w-full h-full outline-none font-[sans] font-normal text-sm text-black dark:text-white"/>
            </div>
        </div>


        <section className="w-full">
            <div>
                {loading ? (<div className="w-full h-[400px] flex items-center justify-center">
                    <Loader />
                </div>) : tasks.length === 0 ? (<p  className="w-full h-[400px] flex items-center justify-center font-[sans] font-normal text-red-600 text-lg">No pending or TO-DO task.</p>) : search.trim() && filteredTask.length === 0 ? (<p  className="w-full h-[400px] flex items-center justify-center font-[sans] font-normal text-red-600 text-lg">No result for your search !.</p>) : (<div className="w-full my-10 h-full">
                    <div className="w-[95%] mx-auto my-10 h-full flex items-center justify-center lg:justify-start flex-wrap gap-6">
                        {paginatedPage.map((task, index)=> (
                            <div key={index} className="bg-white dark:bg-[#343a40] w-[300px] h-auto p-4 rounded-md relative">
                                <div className="absolute inset-0 w-full h-[10px] rounded-t-md bg-[#7BF1A8]"></div>
                                <div className="flex items-center justify-between font-[sans] text-sm font-normal my-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-700 bg-gray-300 px-1 py-0.5 rounded">#{String(index + 1).padStart(3, "0")}</span>
                                        <span>-</span>
                                        <span className="bg-[#7BF1A8] text-red-900 py-0.5 p-1 rounded-md capitalize">{task.taskStatus}</span>
                                    </div>
                                    <div onClick={()=> handleDeleteTask(task)} className="w-8 h-8 cursor-pointer rounded-md flex items-center justify-center bg-red-600"><MdDeleteForever size={20} color="white"/></div>
                                </div>

                                <div className="pt-6 w-full flex items-center justify-between mb-6">
                                    <div className="">
                                        <h3 className="font-semibold tracking-wide text-sm text-gray-700 dark:text-white font-[sans]">{task.taskName.charAt(0).toUpperCase() + task.taskName.slice(1)}</h3>
                                        <p className="font-semibold font-[sans] text-xs text-gray-500 dark:text-cyan-400 mt-2">{task.taskDescription.length > 50 ? task.taskDescription.slice(0, 30) + "..." : task.taskDescription}</p>
                                    </div>
                                </div>
                                <hr className="border-b border-gray-600 dark:border-white"/>

                                <div className="w-full flex items-center justify-between">
                                    <div className="mt-6 text-sm font-[sans]">
                                            <p className="text-gray-600 text-base dark:text-white font-[sans] font-extralight">Due By</p>
                                            <p className="flex items-center gap-1 font-semibold text-red-700 dark:text-cyan-400 text-sm"><FaRegClock /> {new Date(task.taskDueDate).toLocaleDateString("en-us", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}</p>
                                    </div>
                                    
                                    <div className="text-sm flex items-center gap-2">
                                        <TbEdit onClick={() => handleOpenEdit(task)} className="w-6 h-auto border border-gray-500 text-gray-600 dark:text-cyan-400 dark:border-none cursor-pointer p-0.5 rounded"/>
                                        <button onClick={()=>handleViewDetails(task)} className="bg-gray-300 cursor-pointer p-2 rounded-md text-gray-900 font-[sans] text-sm">View Details</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* pagintion */}
                    <div className="w-[90%] mx-auto my-10 h-full flex items-center justify-center flex-wrap gap-6">
                        <div className="flex items-center gap-4">
                            <button disabled={currentPage === 1} onClick={()=> setCurrentPage((p)=> p - 1)} className={`py-1 px-2 font-[sans] text-sm font-normal rounded-md ${currentPage === 1 ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-white"}`} >Previous</button>
                            <button disabled={currentPage === pageNumber} onClick={()=> setCurrentPage((p)=> p + 1)} className={`py-1 px-2 font-[sans] text-sm font-normal rounded-md ${currentPage === pageNumber ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-white"}`}>Next</button>
                        </div>
                        <p className="font-[sans] text-sm text-gray-700 dark:text-white">Page {currentPage} of {pageNumber}</p>
                    </div>
                </div>)}
            </div>
        </section>
        
        {taskDetails && selectedTask && (
        <div className="w-full h-screen fixed inset-0 bg-white/50 dark:bg-[#1a1d23d2] backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#24272F] h-auto rounded-md w-[500px] shadow-lg">
                <div className="flex items-center rounded-md justify-between shadow py-4 px-6">
                    <h3 className="text-lg font-[sans] font-semibold text-[#07011e] dark:text-white capitalize tracking-wide">Task Details</h3>
                    <IoCloseSharp className="cursor-pointer text-xl text-black dark:text-red-600" size={30} onClick={()=>handleCloseViewDetails()}/>
                </div>

                <div className="p-2 mt-6">
                    <div>
                        <p className="mt-2 font-[sans] text-sm font-normal dark:text-cyan-400 text-gray-600">Task Name</p>
                        <p className="dark:text-white font-[sans] text-base text-gray-700  font-semibold">{selectedTask.taskName}</p>
                    </div>
                    <div>
                        <p className="mt-2 font-[sans] text-sm font-normal dark:text-cyan-400 text-gray-600">Task Description</p>
                        <p className="font-[sans] text-base dark:text-white text-gray-700 font-semibold">{selectedTask.taskDescription}</p>
                    </div>
                    <div>
                        <p className="mt-2 font-[sans] text-sm dark:text-cyan-400 font-normal text-gray-600">Task Due Date</p>
                        <p className="font-[sans] text-base  dark:text-white text-gray-700 font-semibold">{selectedTask.taskDueDate}</p>
                    </div>
                    <div>
                        <p className="mt-2 font-[sans] text-sm dark:text-cyan-400 font-normal text-gray-600">Task Status</p>
                        <p className="font-[sans] text-base dark:text-white text-gray-700 font-semibold">{selectedTask.taskStatus}</p>
                    </div>

                </div>
            </div>
        </div>
        )}
    {isModalOpen && (
    <UpdateTask task={selectedTask} onClose={handleCloseModal} onUpdate={fetchTasks}/>
        )}

        {isDeleteModalOpen && (
            <DeleteTask task={selectedTask} onClose={handleDeleteCloseModal} onUpdate={fetchTasks}/>
        )}
    </>)
}