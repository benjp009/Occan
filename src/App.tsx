import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router';import Home from './pages/Home';
import { Helmet } from 'react-helmet-async';
import Software from './pages/Software';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';
import AllSoftwares from './pages/AllSoftwares';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Canonical from './components/Canonical';
import ScrollToTop from './components/ScrollToTop';




interface AppProps {
  location?: string;
  initialData?: any;
}

export default function App({ location, initialData }: AppProps) {

   const Router: any = location ? StaticRouter : BrowserRouter;
   const routerProps = location ? { location } : {};


  return (

    <Router {...routerProps}>
      <Canonical />
      <Helmet>
        <meta
          name="description"
          content="Le premier annuaire des logiciels & entreprises tech françaises : explorez l’offre Made in France, comparez les solutions SaaS et trouvez votre partenaire local."
        />
      </Helmet>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={<Home initialCompanies={initialData?.companies} />}
        />
        <Route
          path="/ajouter-un-nouveau-logiciel"
          element={<AddSoftware />}
        />
        <Route path="/categorie" element={<AllCategory />} />
        <Route
          path="/categorie/:slug"
          element={
            <Category
              initialCategory={initialData?.category}
              initialCompanies={initialData?.companies}
            />
          }
        />
        <Route
          path="/logiciel/:slug"
          element={<Software initialCompany={initialData?.company} />}
        />
        <Route
          path="/tous-les-logiciels"
          element={<AllSoftwares initialCompanies={initialData?.companies} />}
        />
        <Route path="/recherche" element={<SearchResults />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost initialBlogPost={initialData?.blogPost} />} />
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
        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
