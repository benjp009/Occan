import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';
import Category from './pages/Category';



export default function App() {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/ajouter-un-nouveau-logiciel"
          element={<AddSoftware />}
        />
        <Route path="/toutes-categories" element={<AllCategory />} />
        <Route path="/categorie/:slug" element={<Category />} />
        {/* …other routes */}
      </Routes>
    </Router>
  );
}
