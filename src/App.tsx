import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Software from './pages/Software';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import LLMInjection from './components/LLMInjection';
import Canonical from './components/Canonical';




export default function App() {

   const isLLMBot = true;

  return (

    <Router>
      <Canonical />
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
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route
          path="/politique-de-confidentialite"
          element={<PolitiqueConfidentialite />}
        />
        <Route
          path="/conditions-utilisation"
          element={<ConditionsUtilisation />}
        />
        {/* …other routes */}
      </Routes>
    </Router>
  );
}
