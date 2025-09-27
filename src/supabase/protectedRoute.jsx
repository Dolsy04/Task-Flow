import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/ui/loader";


export default function ProtectedRoute({children}){

    const {user, isLoading} = useAuth();

    if (isLoading){
        return <div className="w-full h-screen flex items-center justify-center">
            <Loader />
        </div>;
    }

    if(!user){
        return <Navigate to="/"/>
    }

    return children
}