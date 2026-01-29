import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function ConditionsUtilisation() {
  return (
    <>
      <Helmet>
        <title>Conditions générales d&apos;utilisation | Logiciel France</title>
        <meta
          name="description"
          content="Consultez les conditions générales d'utilisation de Logiciel France, l'annuaire des logiciels et entreprises tech françaises."
        />
      </Helmet>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Conditions générales d&apos;utilisation</h1>

        <p className="legal-intro">
          Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») régissent l&apos;accès et l&apos;utilisation du site Logiciel France (ci-après « le Site »), édité par UGITECH SAS. En accédant au Site, vous acceptez sans réserve les présentes CGU.
        </p>

        <section className="legal-section">
          <h2>1. Définitions</h2>
          <p>Dans les présentes CGU, les termes suivants ont la signification indiquée ci-dessous :</p>
          <ul>
            <li><strong>« Site »</strong> : désigne le site internet Logiciel France accessible à l&apos;adresse <a href="https://logicielfrance.com">logicielfrance.com</a></li>
            <li><strong>« Éditeur »</strong> : désigne UGITECH SAS, société éditrice du Site</li>
            <li><strong>« Utilisateur »</strong> : désigne toute personne accédant au Site et utilisant ses services</li>
            <li><strong>« Services »</strong> : désigne l&apos;ensemble des fonctionnalités et contenus proposés sur le Site</li>
            <li><strong>« Contenu »</strong> : désigne l&apos;ensemble des informations, textes, images, logos et autres éléments présents sur le Site</li>
            <li><strong>« Entreprise référencée »</strong> : désigne toute entreprise dont les informations sont présentées sur le Site</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. Objet du Site</h2>
          <p>
            Logiciel France est un annuaire en ligne dédié à la promotion des logiciels et entreprises technologiques françaises. Le Site a pour vocation de :
          </p>
          <ul>
            <li>Référencer et présenter les solutions logicielles développées en France</li>
            <li>Faciliter la mise en relation entre les éditeurs de logiciels français et les utilisateurs potentiels</li>
            <li>Promouvoir l&apos;écosystème technologique français (« Made in France »)</li>
            <li>Fournir des informations sur les entreprises et leurs produits</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Accès au Site</h2>
          <h3>3.1 Gratuité</h3>
          <p>
            L&apos;accès au Site et la consultation des informations sont gratuits pour tous les Utilisateurs.
          </p>

          <h3>3.2 Disponibilité</h3>
          <p>
            L&apos;Éditeur s&apos;efforce d&apos;assurer l&apos;accessibilité du Site 24 heures sur 24 et 7 jours sur 7. Toutefois, l&apos;accès au Site peut être temporairement suspendu, sans préavis ni indemnité, notamment pour des raisons de :
          </p>
          <ul>
            <li>Maintenance technique</li>
            <li>Mise à jour du contenu ou des fonctionnalités</li>
            <li>Force majeure</li>
            <li>Dysfonctionnement technique indépendant de la volonté de l&apos;Éditeur</li>
          </ul>

          <h3>3.3 Prérequis techniques</h3>
          <p>
            L&apos;Utilisateur est responsable de son équipement informatique et de sa connexion internet. Le Site est optimisé pour les navigateurs récents (Chrome, Firefox, Safari, Edge).
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Utilisation du Site</h2>
          <h3>4.1 Engagement de l&apos;Utilisateur</h3>
          <p>En utilisant le Site, l&apos;Utilisateur s&apos;engage à :</p>
          <ul>
            <li>Utiliser le Site conformément à sa destination et aux présentes CGU</li>
            <li>Ne pas porter atteinte à l&apos;intégrité ou au fonctionnement du Site</li>
            <li>Ne pas collecter de manière automatisée les données présentes sur le Site (scraping) sans autorisation préalable</li>
            <li>Ne pas utiliser le Site à des fins illicites ou contraires à l&apos;ordre public</li>
            <li>Respecter les droits de propriété intellectuelle de l&apos;Éditeur et des tiers</li>
          </ul>

          <h3>4.2 Comportements interdits</h3>
          <p>Sont notamment interdits :</p>
          <ul>
            <li>L&apos;extraction ou la réutilisation non autorisée du contenu du Site</li>
            <li>L&apos;introduction de virus, malwares ou tout élément nuisible</li>
            <li>Les tentatives d&apos;accès non autorisé aux systèmes informatiques</li>
            <li>La surcharge intentionnelle des serveurs</li>
            <li>L&apos;usurpation d&apos;identité</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Contenu du Site</h2>
          <h3>5.1 Informations sur les entreprises</h3>
          <p>
            Les informations relatives aux entreprises référencées (descriptions, logos, captures d&apos;écran, tarifs, etc.) sont fournies à titre indicatif. L&apos;Éditeur s&apos;efforce de maintenir ces informations à jour mais ne garantit pas leur exactitude, exhaustivité ou actualité.
          </p>

          <h3>5.2 Responsabilité quant au contenu</h3>
          <p>
            L&apos;Éditeur n&apos;est pas responsable des informations fournies par les entreprises référencées. Les Utilisateurs sont invités à vérifier directement auprès des entreprises concernées l&apos;exactitude des informations avant toute décision.
          </p>

          <h3>5.3 Signalement d&apos;erreurs</h3>
          <p>
            Si vous constatez une erreur ou une information obsolète, vous pouvez nous la signaler à l&apos;adresse{' '}
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>. Nous nous efforcerons de corriger les informations dans les meilleurs délais.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Propriété intellectuelle</h2>
          <h3>6.1 Droits de l&apos;Éditeur</h3>
          <p>
            L&apos;ensemble des éléments du Site (structure, design, textes, graphismes, images, vidéos, sons, logiciels, bases de données, etc.) est protégé par le droit de la propriété intellectuelle et appartient à l&apos;Éditeur ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation.
          </p>

          <h3>6.2 Droits des entreprises référencées</h3>
          <p>
            Les marques, logos, dénominations et autres signes distinctifs des entreprises référencées demeurent la propriété exclusive de leurs titulaires respectifs. Leur présence sur le Site ne saurait être interprétée comme une cession de droits.
          </p>

          <h3>6.3 Utilisation autorisée</h3>
          <p>
            L&apos;Utilisateur est autorisé à consulter le Site et à télécharger ou imprimer des pages pour son usage personnel et non commercial. Toute autre utilisation est soumise à l&apos;autorisation préalable et écrite de l&apos;Éditeur.
          </p>

          <h3>6.4 Sanctions</h3>
          <p>
            Toute reproduction, représentation, modification, publication, distribution ou exploitation non autorisée constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Liens hypertextes</h2>
          <h3>7.1 Liens sortants</h3>
          <p>
            Le Site peut contenir des liens vers des sites tiers (sites des entreprises référencées, réseaux sociaux, etc.). L&apos;Éditeur n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leurs pratiques ou leur disponibilité.
          </p>

          <h3>7.2 Liens entrants</h3>
          <p>
            La création de liens hypertextes vers le Site est autorisée sans autorisation préalable, sous réserve que :
          </p>
          <ul>
            <li>Le lien ne porte pas atteinte à l&apos;image de l&apos;Éditeur ou du Site</li>
            <li>Le Site ne soit pas intégré dans les pages d&apos;un autre site (framing)</li>
            <li>La source soit clairement identifiée</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Demande de référencement</h2>
          <p>
            Les entreprises souhaitant être référencées sur le Site peuvent en faire la demande via les canaux de contact mis à disposition. L&apos;Éditeur se réserve le droit :
          </p>
          <ul>
            <li>D&apos;accepter ou de refuser toute demande de référencement, sans avoir à justifier sa décision</li>
            <li>De définir les critères d&apos;éligibilité au référencement</li>
            <li>De modifier ou supprimer une fiche à tout moment</li>
            <li>De demander des informations complémentaires avant référencement</li>
          </ul>
          <p>
            Le référencement sur le Site n&apos;implique aucune recommandation, certification ou validation de la part de l&apos;Éditeur.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Responsabilité</h2>
          <h3>9.1 Limitation de responsabilité</h3>
          <p>
            L&apos;Éditeur met tout en œuvre pour assurer la qualité du Site et de ses contenus, mais ne peut garantir l&apos;absence totale d&apos;erreurs. L&apos;Éditeur ne saurait être tenu responsable :
          </p>
          <ul>
            <li>Des dommages directs ou indirects résultant de l&apos;utilisation du Site</li>
            <li>Des interruptions temporaires du Site</li>
            <li>De l&apos;impossibilité d&apos;accéder au Site</li>
            <li>Des décisions prises sur la base des informations du Site</li>
            <li>Du contenu des sites tiers accessibles via des liens</li>
          </ul>

          <h3>9.2 Force majeure</h3>
          <p>
            L&apos;Éditeur ne pourra être tenu responsable en cas de survenance d&apos;un événement de force majeure tel que défini par l&apos;article 1218 du Code civil.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Données personnelles</h2>
          <p>
            L&apos;Éditeur s&apos;engage à respecter la réglementation applicable en matière de protection des données personnelles, notamment le Règlement Général sur la Protection des Données (RGPD).
          </p>
          <p>
            Pour toute information concernant le traitement de vos données personnelles, veuillez consulter notre{' '}
            <a href="/politique-de-confidentialite">Politique de confidentialité</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Modification des CGU</h2>
          <p>
            L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site. L&apos;Utilisateur est invité à consulter régulièrement cette page.
          </p>
          <p>
            La poursuite de l&apos;utilisation du Site après modification des CGU vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Nullité partielle</h2>
          <p>
            Si une ou plusieurs stipulations des présentes CGU sont tenues pour non valides ou déclarées comme telles par une loi, un règlement ou une décision définitive d&apos;une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes, et après échec de toute tentative de recherche d&apos;une solution amiable, les tribunaux français seront seuls compétents.
          </p>
          <p>
            Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, l&apos;Utilisateur consommateur peut recourir gratuitement au service de médiation proposé par l&apos;Éditeur ou à tout autre médiateur de son choix.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU ou à l&apos;utilisation du Site, vous pouvez nous contacter :
          </p>
          <ul>
            <li><strong>Par email :</strong> <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a></li>
            <li><strong>Par courrier :</strong> UGITECH SAS, 34 Cours Forbin, 13120 Gardanne, France</li>
          </ul>
        </section>

        <p className="legal-update">
          <em>Dernière mise à jour : Janvier 2025</em>
        </p>
      </main>
      <Footer />
    </>
  );
}
