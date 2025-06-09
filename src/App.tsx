import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';


export default function App() {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/ajouter-un-nouveau-logiciel"
          element={<AddSoftware />}
        />
        <Route path="/all-categories" element={<AllCategory />} />
        {/* …other routes */}
      </Routes>
    </Router>
  );
}
