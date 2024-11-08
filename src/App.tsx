import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './routes/Signin';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
