import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function MentionsLegales() {
  return (
    <>
      <Helmet>
        <title>Mentions légales | Logiciel France</title>
        <meta
          name="description"
          content="Consultez les mentions légales de Logiciel France, l'annuaire des logiciels et entreprises tech françaises."
        />
      </Helmet>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Mentions légales</h1>

        <section className="legal-section">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>Logiciel France</strong> (ci-après « le Site »), accessible à l&apos;adresse{' '}
            <a href="https://logicielfrance.com">logicielfrance.com</a>, est édité par :
          </p>
          <ul>
            <li><strong>Raison sociale :</strong> UGITECH SAS</li>
            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
            <li><strong>Capital social :</strong> 1 000,00 €</li>
            <li><strong>Siège social :</strong> 34 Cours Forbin, 13120 Gardanne, France</li>
            <li><strong>SIREN :</strong> 994 306 538</li>
            <li><strong>SIRET (siège) :</strong> 994 306 538 00012</li>
            <li><strong>RCS :</strong> Aix-en-Provence</li>
          </ul>
          <p>
            <strong>Contact :</strong>{' '}
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Directeur de la publication</h2>
          <p>
            Le directeur de la publication est <strong>Benjamin Patin</strong>, en sa qualité de Président de UGITECH SAS.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Hébergement</h2>
          <p>Le Site est hébergé par :</p>
          <ul>
            <li><strong>Raison sociale :</strong> Google Cloud France</li>
            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
            <li><strong>Siège social :</strong> 8 Rue de Londres, 75009 Paris, France</li>
            <li><strong>SIREN :</strong> 881 721 583</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des éléments composant le Site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses, bases de données, etc.) ainsi que le Site lui-même, relèvent des législations françaises et internationales sur le droit d&apos;auteur et la propriété intellectuelle.
          </p>
          <p>
            Ces éléments sont la propriété exclusive de UGITECH SAS ou de ses partenaires. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du Site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l&apos;autorisation écrite préalable de UGITECH SAS.
          </p>
          <p>
            Toute exploitation non autorisée du Site ou de son contenu, des informations qui y sont divulguées, engagerait la responsabilité de l&apos;utilisateur et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Données personnelles et cookies</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression, de limitation, de portabilité et d&apos;opposition concernant vos données personnelles.
          </p>
          <p>
            Pour exercer ces droits ou pour toute question relative à vos données personnelles, vous pouvez nous contacter à l&apos;adresse :{' '}
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>
          </p>
          <p>
            Pour plus d&apos;informations sur le traitement de vos données personnelles, veuillez consulter notre{' '}
            <a href="/politique-de-confidentialite">Politique de confidentialité</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Responsabilité</h2>
          <p>
            Les informations contenues sur le Site sont aussi précises que possible et le Site est périodiquement mis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes. Si vous constatez une lacune, erreur ou ce qui paraît être un dysfonctionnement, merci de bien vouloir le signaler par e-mail à{' '}
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>, en décrivant le problème de la manière la plus précise possible.
          </p>
          <p>
            UGITECH SAS ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l&apos;utilisateur lors de l&apos;accès au Site, et résultant soit de l&apos;utilisation d&apos;un matériel ne répondant pas aux spécifications techniques requises, soit de l&apos;apparition d&apos;un bug ou d&apos;une incompatibilité.
          </p>
          <p>
            UGITECH SAS ne pourra également être tenue responsable des dommages indirects consécutifs à l&apos;utilisation du Site. Les informations fournies par les entreprises référencées sur le Site sont présentées à titre indicatif et ne sauraient engager la responsabilité de UGITECH SAS.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Liens hypertextes</h2>
          <p>
            Le Site peut contenir des liens hypertextes vers d&apos;autres sites web. UGITECH SAS n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux éventuels collectes et traitements de données personnelles effectués par ces sites.
          </p>
          <p>
            La mise en place de liens hypertextes vers le Site est autorisée sous réserve de ne pas utiliser la technique du « deep linking », c&apos;est-à-dire que les pages du Site ne doivent pas être imbriquées à l&apos;intérieur des pages d&apos;un autre site.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige et après échec de toute tentative de recherche d&apos;une solution amiable, les tribunaux français seront seuls compétents pour connaître de ce litige.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Crédits</h2>
          <p>
            <strong>Conception et développement :</strong> UGITECH SAS
          </p>
          <p>
            <strong>Icônes :</strong> Les icônes utilisées sur le Site proviennent de sources libres de droits ou ont été créées spécifiquement pour le Site.
          </p>
        </section>

        <p className="legal-update">
          <em>Dernière mise à jour : Janvier 2025</em>
        </p>
      </main>
      <Footer />
    </>
  );
}
