import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Software from './pages/Software';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import LLMInjection from './components/LLMInjection';




export default function App() {

   const isLLMBot = true;

  return (
    
    <Router>
      <LLMInjection isLLMBot={isLLMBot} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/ajouter-un-nouveau-logiciel"
          element={<AddSoftware />}
        />
        <Route path="/toutes-categories" element={<AllCategory />} />
        <Route path="/categorie/:slug" element={<Category />} />
        <Route path="/logiciel/:slug" element={<Software />} />
        <Route path="/recherche" element={<SearchResults />} />
        {/* …other routes */}
      </Routes>
    </Router>
  );
}
