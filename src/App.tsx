import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import Home from './pages/Home';
import { Helmet } from 'react-helmet-async';
import Software from './pages/Software';
import AddSoftware from './pages/AddSoftware';
import AllCategory from './pages/AllCategory';
import AllSoftwares from './pages/AllSoftwares';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Refer from './pages/Refer';
import Alternative from './pages/Alternative';
import UseCase from './pages/UseCase';
import AllUseCases from './pages/AllUseCases';
import AllAlternatives from './pages/AllAlternatives';
import Glossary from './pages/Glossary';
import AllGlossary from './pages/AllGlossary';
import Canonical from './components/Canonical';
import ScrollToTop from './components/ScrollToTop';
import { CompanyRow, CategoryRow, BlogPost as BlogPostData, UseCaseRow, CompetitorRow, GlossaryRow } from './types';
import { AuthProvider } from './contexts/AuthContext';
import { FirebasePrivateRoute } from './components/PrivateRoute';
import UserLogin from './pages/UserLogin';
import Dashboard from './pages/Dashboard';
import ClaimRequest from './pages/ClaimRequest';
import EditCompany from './pages/EditCompany';
import AdminClaims from './pages/AdminClaims';
import AdminEditRequests from './pages/AdminEditRequests';

interface InitialData {
  companies?: CompanyRow[] | null;
  categories?: CategoryRow[] | null;
  category?: CategoryRow | null;
  company?: CompanyRow | null;
  similarCompanies?: CompanyRow[];
  blogPosts?: BlogPostData[];
  blogPost?: BlogPostData | null;
  relatedPosts?: BlogPostData[] | null;
  useCases?: UseCaseRow[] | null;
  useCase?: UseCaseRow | null;
  competitors?: CompetitorRow[] | null;
  competitor?: CompetitorRow | null;
  alternatives?: CompanyRow[] | null;
  glossary?: GlossaryRow[] | null;
  glossaryEntry?: GlossaryRow | null;
  relatedTerms?: GlossaryRow[] | null;
}

interface AppProps {
  location?: string;
  initialData?: InitialData;
}

export default function App({ location, initialData }: AppProps) {
   // Router type assertion needed since StaticRouter and BrowserRouter have different prop signatures
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const Router: any = location ? StaticRouter : BrowserRouter;
   const routerProps = location ? { location } : {};

  return (

    <Router {...routerProps}>
      <AuthProvider>
      <Canonical />
      <Helmet>
        <meta
          name="description"
          content="Le premier annuaire des logiciels & entreprises tech françaises : explorez l'offre Made in France, comparez les solutions SaaS et trouvez votre partenaire local."
        />
      </Helmet>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={<Home initialCompanies={initialData?.companies} initialCategories={initialData?.categories} />}
        />
        <Route
          path="/ajouter-un-nouveau-logiciel"
          element={<AddSoftware />}
        />
        <Route path="/categorie" element={<AllCategory initialCategories={initialData?.categories} />} />
        <Route
          path="/categorie/:slug"
          element={
            <Category
              initialCategory={initialData?.category}
              initialCompanies={initialData?.companies}
              initialRelatedPosts={initialData?.relatedPosts}
            />
          }
        />
        <Route
          path="/logiciel/:slug"
          element={
            <Software
              initialCompany={initialData?.company}
              initialSimilarCompanies={initialData?.similarCompanies}
            />
          }
        />
        <Route
          path="/tous-les-logiciels"
          element={<AllSoftwares initialCompanies={initialData?.companies} />}
        />
        <Route path="/recherche" element={<SearchResults />} />
        <Route path="/refer/:slug" element={<Refer />} />
        <Route path="/blog" element={<Blog initialPosts={initialData?.blogPosts} />} />
        <Route path="/blog/:slug" element={<BlogPostPage initialBlogPost={initialData?.blogPost} />} />
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
        {/* Programmatic SEO pages */}
        <Route path="/cas-d-usage" element={<AllUseCases initialUseCases={initialData?.useCases} />} />
        <Route path="/alternatives" element={<AllAlternatives initialCompetitors={initialData?.competitors} />} />
        <Route
          path="/alternative/:slug"
          element={
            <Alternative
              initialCompetitor={initialData?.competitor}
              initialAlternatives={initialData?.alternatives}
            />
          }
        />
        <Route
          path="/meilleur-logiciel-pour/:slug"
          element={
            <UseCase
              initialUseCase={initialData?.useCase}
              initialCompanies={initialData?.companies}
            />
          }
        />
        {/* Glossary pages */}
        <Route path="/glossaire" element={<AllGlossary initialGlossary={initialData?.glossary} />} />
        <Route
          path="/glossaire/:slug"
          element={
            <Glossary
              initialGlossaryEntry={initialData?.glossaryEntry}
              initialCompanies={initialData?.companies}
              initialRelatedTerms={initialData?.relatedTerms}
            />
          }
        />
        {/* Publisher dashboard routes */}
        <Route path="/espace-editeur" element={<UserLogin />} />
        <Route
          path="/dashboard"
          element={
            <FirebasePrivateRoute>
              <Dashboard />
            </FirebasePrivateRoute>
          }
        />
        <Route
          path="/dashboard/claim/:id"
          element={
            <FirebasePrivateRoute>
              <ClaimRequest />
            </FirebasePrivateRoute>
          }
        />
        <Route
          path="/dashboard/edit/:id"
          element={
            <FirebasePrivateRoute>
              <EditCompany />
            </FirebasePrivateRoute>
          }
        />
        {/* Admin routes for Firebase-based management */}
        <Route
          path="/admin/claims"
          element={
            <FirebasePrivateRoute requireAdmin>
              <AdminClaims />
            </FirebasePrivateRoute>
          }
        />
        <Route
          path="/admin/edits"
          element={
            <FirebasePrivateRoute requireAdmin>
              <AdminEditRequests />
            </FirebasePrivateRoute>
          }
        />
        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}
