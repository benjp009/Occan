import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router';import Home from './pages/Home';
import Software from './pages/Software';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';
import AllSoftwares from './pages/AllSoftwares';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import LLMInjection from './components/LLMInjection';
import Canonical from './components/Canonical';
import ScrollToTop from './components/ScrollToTop';




interface AppProps {
  location?: string;
}

export default function App({ location }: AppProps) {

   const isLLMBot = true;
   const Router: any = location ? StaticRouter : BrowserRouter;
   const routerProps = location ? { location } : {};


  return (

    <Router {...routerProps}>
      <Canonical />
      <LLMInjection isLLMBot={isLLMBot} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/ajouter-un-nouveau-logiciel"
          element={<AddSoftware />}
        />
        <Route path="/toutes-categories" element={<AllCategory />} />
        <Route path="/categorie/:slug" element={<Category />} />
        <Route path="/logiciel/:slug" element={<Software />} />
        <Route path="/tous-les-logiciels" element={<AllSoftwares />} />
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
