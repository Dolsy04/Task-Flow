import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabase";
import { useAuth } from "../supabase/authContext";
import Loader from "./ui/loader";
import Card from "./ui/card"
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import UpdateTask from "./updateTask";
import DeleteTask from "./deleteTask";
import { IoAddCircleOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { LuLoaderCircle } from "react-icons/lu";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoSearchSharp, IoCloseSharp } from "react-icons/io5";


export default function FetchTask({autoLoad}){
    const {user,  isLoading} = useAuth();
    const [storeAll, setStoreAll] = useState([])
    const [storePending, setStorePending] = useState([])
    const [storeDoneTask, setStoreDoneTask] = useState([])
    const [storeDoingTask, setStoreDoingTask] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [search, setSearch] = useState("")
    const [filterSearch, setFilterSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [taskDetails, setTaskDetails] = useState(false)
    const [rowNumber, setRowNumber] = useState(10)


    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }
    
    const handleViewDetails = (task) =>{
        setTaskDetails(true);
        setSelectedTask(task)
    }  
    const handleCloseViewDetails = () =>{
        setTaskDetails(false);
        setSelectedTask(null)
    }

    const fetchTasks = async ()=>{
        try{
            setLoading(true);
        // console.log("Fetching tasks for user:", user.id);

            const {data: allData, error: allError} = await supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", {ascending: false});

              if(allError){
                toast.dismiss()
                toast.error(`error fetching tasks: ${allError.message}`, {duration: 4000})
                throw allError
            }


            const {data: pendingData, error: pendingError} = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "pending").order("created_at", {ascending: false});

            if(pendingError){
                toast.dismiss()
                toast.error(`error fetching tasks: ${pendingError.message}`, {duration: 4000})
                throw pendingError
            }

            const { data: doneData, error: doneError } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "done").order("created_at", {ascending: false})

            if(doneError){
                toast.dismiss()
                toast.error(`error fetching tasks: ${doneError.message}`,  {duration: 4000})
                throw doneError
            }

            const { data: doingData, error: doingError } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("taskStatus", "doing").order("created_at", {ascending: false})

            if(doingError){
                toast.dismiss()
                toast.error(`error fetching tasks: ${doingError.message}`, {duration: 4000})
                throw doingError
            }

            setStoreAll(allData)
            setStorePending(pendingData)
            setStoreDoneTask(doneData)
            setStoreDoingTask(doingData)
        }catch (error){
            toast.dismiss()
            toast.error(`error fetching tasks: ${error.message}`, {duration: 4000})
        }finally{
            setLoading(false)
        }
        
    }
    useEffect(()=>{
        if(user) fetchTasks();
    },[user, autoLoad]) 


    useEffect(()=>{
        if(search.trim()){
            const searchResult = storeAll.filter((task)=> task.taskName.toLowerCase().includes(search.toLowerCase()) || task.taskStatus.toLowerCase().includes() || task.taskDueDate.toLowerCase().includes());
            setFilterSearch(searchResult)
            setCurrentPage(1)
        }else{
            setFilterSearch(storeAll)
        }
    },[search, storeAll])
    
    const handleOpenEdit = (task) =>{
        setIsModalOpen(true);
        setSelectedTask(task)
    }
    const handleDeleteTask = (task) =>{
        setIsDeleteModalOpen(true);
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

    const paginatedPage = filterSearch.slice((currentPage - 1) * rowNumber, currentPage * rowNumber)
    const pageNumber = Math.ceil(filterSearch.length / rowNumber)


    return(<>

        <div className="lg:w-[90%] w-[90%] mx-auto h-auto my-10 flex items-center justify-center lg:justify-between flex-wrap lg:gap-0 gap-5">
            <Link className="bg-white dark:bg-[#2C303A] lg:w-[200px] w-full h-[100px] rounded-lg hover:bg-[#2C303A] focus:bg-[#2C303A] dark:hover:bg-white group dark:focus:bg-white transition-colors duration-300">
                <Card className=" w-full h-[100px]">
                    <div className="w-full h-full flex items-center justify-between px-6 py-2">
                        <div>
                            <p className="text-2xl font-bold text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100">{storeAll && storeAll.length > 0 ? storeAll.length : "0"}</p>
                            <p className="text-base font-normal text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100">Total Task</p>
                        </div>
                        <IoAddCircleOutline size={30} className="text-orange-500"/>
                    </div>
                </Card>
            </Link>

            <Link to="/dashboard/pendingPage" className="bg-white dark:bg-[#2C303A] lg:w-[200px] w-full h-[100px] rounded-lg hover:bg-[#2C303A] focus:bg-[#2C303A] dark:hover:bg-white group dark:focus:bg-white transition-colors duration-300">
                <Card className="w-full h-full">
                    <div className="w-full h-full flex items-center justify-between px-6 py-2">
                        <div>
                            <p className="group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100 text-2xl font-bold text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide">{storePending && storePending.length > 0 ? storePending.length : "0"}</p>
                            <p className="group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100 text-base font-normal text-gray-700 dark:text-white font-[sans] tracking-wide">Pending Task</p>
                        </div>
                        <GoClock size={30} className="text-red-600"/>
                    </div>
                </Card>
            </Link>

            <Link to="/dashboard/doingPage" className="bg-white dark:bg-[#2C303A] lg:w-[200px] w-full h-[100px] rounded-lg hover:bg-[#2C303A] focus:bg-[#2C303A] dark:hover:bg-white group dark:focus:bg-white transition-colors duration-300">
                <Card className="w-full h-full">
                    <div className="w-full h-full flex items-center justify-between px-6 py-2">
                        <div>
                            <p className="group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100 text-2xl font-bold text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide">{storeDoingTask && storeDoingTask.length > 0 ? storeDoingTask.length : "0"}</p>
                            <p className="group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100 text-base font-normal text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide">Doing Task</p>
                        </div>
                        <LuLoaderCircle size={30} className="text-blue-400"/>
                    </div>
                </Card>
            </Link>

            <Link to="/dashboard/donePage" className="bg-white dark:bg-[#2C303A] lg:w-[200px] w-full h-[100px] rounded-lg hover:bg-[#2C303A] focus:bg-[#2C303A] dark:hover:bg-white group dark:focus:bg-white transition-colors duration-300">
                <Card className="w-full h-full">
                    <div className="w-full h-full flex items-center justify-between px-6 py-2">
                        <div>
                            <p className="group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100 text-2xl font-bold text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide">{storeDoneTask && storeDoneTask.length > 0 ? storeDoneTask.length : "0"}</p>
                            <p className="group-hover:text-gray-100 group-focus:dark:text-gray-700 dark:group-hover:text-gray-700 group-focus:text-gray-100 text-base font-normal text-gray-700 dark:text-white mb-2 font-[sans] tracking-wide">Finished Task</p>
                        </div>
                        <IoIosCheckmarkCircleOutline size={30} className="text-emerald-500"/>
                    </div>
                </Card>
            </Link>
        </div>

        <div className="w-[90%] mx-auto flex lg:items-center gap-2 justify-between lg:flex-row flex-col">
            <h3 className="text-lg font-semibold font-[sans] text-gray-700 dark:text-white tracking-wide">All Tasks</h3>

            <div className="lg:w-[30%] w-full h-[40px] border-2 border-[#00000082] dark:border-gray-300 focus-within:border-2 focus-within:border-blue-600 rounded-md flex items-center px-3">
                <IoSearchSharp  className="w-[20px] h-full text-gray-700 dark:text-gray-300"/>
                <input type="search" placeholder="search tasks" value={search} onChange={(e)=> setSearch(e.target.value)} className="w-full h-full pl-2 text-sm font-normal font-[sans] border-none outline-none text-gray-700 dark:text-white"/>
            </div>
        </div>

        <div className="w-[90%] mx-auto mt-6 p-8 rounded-md bg-white dark:bg-[#2C303A]">
            <div className="w-full overflow-x-auto bg-white dark:bg-[#2C303A]">
                <table className="w-full min-w-[700px] h-auto text-left border-collapse">
                    <thead className="lg:text-base text-sm font-semibold font-[sans] text-gray-700 dark:text-white sticky top-0 bg-white dark:bg-[#2c303a]">
                        <tr>
                            <td className="p-3 border-b">S/N</td>
                            <td className="p-3 border-b">Task Title</td>
                            <td className="p-3 border-b">Task Description</td>
                            <td className="p-3 border-b">Due Date</td>
                            <td className="p-3 border-b">Task Status</td>
                            <td className="p-3 border-b text-center">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="h-[150px] text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : storeAll.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="h-[150px] text-red-600 text-xl font-[sans] font-normal">
                                    You do not have any task. create a new task by click add task button
                                </td>
                            </tr>
                        ) : search.trim() && filterSearch.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="h-[150px] text-red-600 text-xl font-[sans] font-normal">
                                    No result for your search !.
                                </td>
                            </tr>
                    ) : (
                            paginatedPage.map((task, index)=>(
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#24272F] border-b">
                                    <td className="p-3 text-gray-700 dark:text-white font-[sans] text-sm capitalize">{index + 1}</td>
                                    <td className="p-3 text-gray-700 dark:text-white font-[sans] text-sm capitalize">{task.taskName  && task.taskName.length > 20 ? task.taskName.slice(0, 20) + "..." : task.taskName}</td>
                                    <td className="p-3 text-gray-700 dark:text-white font-[sans] text-sm capitalize">{task.taskDescription && task.taskDescription.length > 20 ? task.taskDescription.slice(0, 20) + "..." : task.taskDescription || "Null"}</td>
                                    <td className="p-3 text-gray-700 dark:text-white font-[sans] text-sm capitalize">{new Date(task.taskDueDate || "Null").toLocaleDateString("en-us",{
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}</td>
                                    <td className="p-3 text-gray-700 dark:text-white font-[sans] text-sm capitalize text-center">
                                        <span className={`px-2 p-0.5 rounded-full ${task.taskStatus === "pending" ? "bg-red-600 text-white" : task.taskStatus === "doing" ? "bg-green-500 text-black" : task.taskStatus === "done" ? "bg-green-600 text-white": ""} `}>{task.taskStatus}</span>
                                    </td>
                                    <td className="p-3 text-gray-700 dark:text-white font-[sans] text-sm capitalize flex items-center gap-2 justify-end">
                                        <TbEdit className="font-normal text-xl text-gray-900 dark:text-cyan-300 font-[sans] border rounded border-gray-100 dark:border-none cursor-pointer lg:mb-0 mb-2" onClick={()=>handleOpenEdit(task)}/>
                                        <button className="bg-gray-300 cursor-pointer p-2 rounded-md text-gray-900 font-[sans] text-sm" onClick={()=>handleViewDetails(task)}>Details</button>
                                        <MdDeleteForever className="font-normal text-xl text-red-600 dark:text-orange-200 font-[sans] border rounded border-gray-100 dark:border-none cursor-pointer lg:mb-0 mb-2" onClick={() => handleDeleteTask(task)} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="w-[100%] px-5 py-3 mx-auto my-1 h-auto flex items-center justify-center flex-wrap gap-6 lg:justify-between">
                <div className="flex items-center gap-4">
                    <button disabled={currentPage === 1} onClick={()=> setCurrentPage((p)=> p - 1)} className={`py-1 px-2 font-[sans] text-sm font-normal rounded-md ${currentPage === 1 ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-[#d3d3d3]"}`} >Previous</button>
                    <button disabled={currentPage === pageNumber} onClick={()=> setCurrentPage((p)=> p + 1)} className={`py-1 px-2 font-[sans] text-sm font-normal rounded-md ${currentPage === pageNumber ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-[#d3d3d3]"}`}>Next</button>
                </div>
                <div>
                    <label className="text-gray-600 dark:text-white font-[sans] text-sm">No of rows</label>
                    <select className="dark:bg-[#f5f5f5] bg-[#e5e7eb] ml-2 rounded-md border-none outline-none text-sm font-[sans]" value={rowNumber} onChange={(e)=>setRowNumber(e.target.value)}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <p className="font-[sans] text-sm text-gray-700 dark:text-white">Page {currentPage} of {pageNumber}</p>
            </div>
        </div>

        {taskDetails && selectedTask && (
            <div className="w-full h-screen fixed inset-0 bg-white/50 dark:bg-[#1a1d23d2] backdrop-blur-xs flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#24272F] h-screen overflow-y-auto rounded-md w-[500px] shadow-lg">
                    <div className="flex items-center rounded-md justify-between shadow py-4 px-6 sticky top-0 bg-white dark:bg-[#24272F]">
                        <h3 className="text-lg font-[sans] dark:text-white font-semibold text-[#07011e] capitalize tracking-wide">Task Details</h3>
                        <IoCloseSharp className="cursor-pointer text-xl text-black dark:text-red-600" size={30} onClick={()=>handleCloseViewDetails()}/>
                    </div>

                    <div className="p-2 my-6">
                        <div className="p-2 my-3">
                            <p className="mt-2 font-[sans] text-sm font-normal text-gray-600 dark:text-cyan-400">Task Name</p>
                            <p className=" font-[sans] text-base dark:text-white text-gray-700  font-semibold">{selectedTask.taskName.charAt(0).toUpperCase() + selectedTask.taskName.slice(1)}</p>
                        </div>
                        <div className="p-2 my-3">
                            <p className="mt-2 font-[sans] text-sm font-normal text-gray-600 dark:text-cyan-400">Task Description</p>
                            <p className="font-[sans] text-base dark:text-white text-gray-700 font-semibold">{selectedTask.taskDescription || "Null"}</p>
                        </div>
                      
                        <div className="p-2 mb-3">
                            <p className="mt-2 font-[sans] text-sm font-normal dark:text-cyan-400 text-gray-600">Task Due Date</p>
                            <p className="font-[sans] text-base dark:text-white text-gray-700 font-semibold">{selectedTask.taskDueDate || "Null"}</p>
                        </div>
                        <div className="p-2 mb-3">
                            <p className="mt-2 font-[sans] text-sm font-normal dark:text-cyan-400 text-gray-600">Task Status</p>
                            <p className="font-[sans] text-base text-gray-700 dark:text-white font-semibold">{selectedTask.taskStatus || "Null"}</p>
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
    </>);
}


