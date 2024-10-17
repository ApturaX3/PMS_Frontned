import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
    const [isSignedOut , setIsSignedOut] = useState(false);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            setIsSignedOut(true);
        }
    })
    console.log(auth);
    if (!auth.currentUser || isSignedOut){
        return <Navigate to='/signin' replace />
    }
  
    const signOut = () => {
        auth.signOut().then(()=>setIsSignedOut(true));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard</h2>
                <h1>
                    {auth.currentUser?.email}
                    {auth.currentUser?.displayName}
                </h1>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={signOut}>Sign Out</button>
            </div>
        </div>
    )
}