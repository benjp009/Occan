import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Home from './pages/Home';
import { PrivateRoute } from './components/PrivateRoute';


export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
