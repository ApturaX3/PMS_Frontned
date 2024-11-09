import ProjectDashboard from '@/components/ProjectDashboard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const [isSignedOut, setIsSignedOut] = useState(false);
  const auth = getAuth();

  // Fetch projects data
  

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsSignedOut(true);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (!auth.currentUser || isSignedOut) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
      <h2 className="p-4 text-3xl font-bold mb-2 text-center text-gray-800">
        Dashboard
      </h2>
      <hr />
      
      <div className="container mx-auto p-4 bg-white">
      
        <ProjectDashboard  /> // Pass projects data as prop
    
      </div>
    </div>
  );
}
