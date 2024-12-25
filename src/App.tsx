import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './routes/Signin';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';
import Tasks from './routes/Tasks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path='/tasks' element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;
