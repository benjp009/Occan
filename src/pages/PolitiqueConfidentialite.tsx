import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Helmet>
        <title>Politique de confidentialité | Logiciel France</title>
        <meta
          name="description"
          content="Découvrez notre politique de confidentialité et la protection de vos données personnelles sur Logiciel France."
        />
      </Helmet>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Politique de confidentialité</h1>

        <p className="legal-intro">
          La présente politique de confidentialité décrit comment UGITECH SAS (« nous », « notre », « nos ») collecte, utilise et protège vos données personnelles lorsque vous utilisez le site Logiciel France (ci-après « le Site »).
        </p>

        <section className="legal-section">
          <h2>1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données personnelles est :</p>
          <ul>
            <li><strong>Raison sociale :</strong> UGITECH SAS</li>
            <li><strong>Siège social :</strong> 34 Cours Forbin, 13120 Gardanne, France</li>
            <li><strong>SIREN :</strong> 994 306 538</li>
            <li><strong>Email :</strong> <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. Données personnelles collectées</h2>
          <p>Nous pouvons collecter les catégories de données suivantes :</p>

          <h3>2.1 Données collectées automatiquement</h3>
          <ul>
            <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, système d&apos;exploitation, pages visitées, durée de visite, URL de provenance</li>
            <li><strong>Données techniques :</strong> identifiants de cookies, données de connexion</li>
          </ul>

          <h3>2.2 Données que vous nous fournissez</h3>
          <ul>
            <li><strong>Formulaire de contact :</strong> nom, prénom, adresse email, message</li>
            <li><strong>Demande de référencement :</strong> informations sur votre entreprise et votre logiciel</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Finalités et bases légales du traitement</h2>
          <p>Vos données sont traitées pour les finalités suivantes :</p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Finalité</th>
                <th>Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Répondre à vos demandes de contact</td>
                <td>Intérêt légitime</td>
              </tr>
              <tr>
                <td>Traiter les demandes de référencement</td>
                <td>Exécution d&apos;un contrat / mesures précontractuelles</td>
              </tr>
              <tr>
                <td>Améliorer et optimiser le Site</td>
                <td>Intérêt légitime</td>
              </tr>
              <tr>
                <td>Analyser la fréquentation du Site</td>
                <td>Consentement (cookies analytiques)</td>
              </tr>
              <tr>
                <td>Assurer la sécurité du Site</td>
                <td>Intérêt légitime</td>
              </tr>
              <tr>
                <td>Respecter nos obligations légales</td>
                <td>Obligation légale</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>4. Destinataires des données</h2>
          <p>Vos données personnelles peuvent être communiquées aux destinataires suivants :</p>
          <ul>
            <li><strong>Personnel habilité</strong> de UGITECH SAS, dans la limite de leurs attributions</li>
            <li><strong>Sous-traitants techniques :</strong> hébergeur (Google Cloud France), prestataires d&apos;analyse (si applicable)</li>
          </ul>
          <p>
            Nous ne vendons, ne louons et ne cédons jamais vos données personnelles à des tiers à des fins commerciales.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Transferts de données hors UE</h2>
          <p>
            Vos données sont principalement hébergées au sein de l&apos;Union européenne (Google Cloud France). Dans le cas où des données seraient transférées vers des pays tiers, nous nous assurons que ces transferts sont encadrés par des garanties appropriées conformément au RGPD (clauses contractuelles types, décision d&apos;adéquation, etc.).
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Durée de conservation</h2>
          <p>Vos données personnelles sont conservées pendant les durées suivantes :</p>
          <ul>
            <li><strong>Données de contact :</strong> 3 ans à compter du dernier contact</li>
            <li><strong>Données de navigation :</strong> 13 mois maximum (cookies)</li>
            <li><strong>Données de référencement :</strong> durée de la relation commerciale + 3 ans</li>
          </ul>
          <p>
            À l&apos;expiration de ces délais, vos données sont supprimées ou anonymisées.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Cookies et traceurs</h2>

          <h3>7.1 Qu&apos;est-ce qu&apos;un cookie ?</h3>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d&apos;un site web. Il permet au site de mémoriser des informations sur votre visite.
          </p>

          <h3>7.2 Types de cookies utilisés</h3>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Type de cookie</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cookies strictement nécessaires</td>
                <td>Fonctionnement du site, navigation</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>Cookies analytiques</td>
                <td>Mesure d&apos;audience, statistiques de visite</td>
                <td>13 mois max.</td>
              </tr>
            </tbody>
          </table>

          <h3>7.3 Gestion des cookies</h3>
          <p>
            Vous pouvez à tout moment modifier vos préférences en matière de cookies :
          </p>
          <ul>
            <li>Via les paramètres de votre navigateur</li>
            <li>En utilisant notre bandeau de gestion des cookies (si présent)</li>
          </ul>
          <p>
            <strong>Paramétrage par navigateur :</strong>
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :
          </p>
          <ul>
            <li><strong>Droit d&apos;accès :</strong> obtenir la confirmation que des données vous concernant sont traitées et en recevoir une copie</li>
            <li><strong>Droit de rectification :</strong> demander la correction de données inexactes ou incomplètes</li>
            <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données dans certains cas</li>
            <li><strong>Droit à la limitation :</strong> demander la suspension du traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible par machine</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données pour des motifs légitimes</li>
            <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les traitements basés sur le consentement</li>
            <li><strong>Droit de définir des directives post-mortem :</strong> concernant la conservation, l&apos;effacement et la communication de vos données après votre décès</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Exercer vos droits</h2>
          <p>
            Pour exercer vos droits, vous pouvez nous contacter :
          </p>
          <ul>
            <li><strong>Par email :</strong> <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a></li>
            <li><strong>Par courrier :</strong> UGITECH SAS - Protection des données, 34 Cours Forbin, 13120 Gardanne, France</li>
          </ul>
          <p>
            Nous nous engageons à répondre à votre demande dans un délai d&apos;un mois suivant sa réception. Ce délai peut être prolongé de deux mois supplémentaires en cas de demande complexe.
          </p>
          <p>
            Une pièce d&apos;identité pourra vous être demandée afin de vérifier votre identité.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Réclamation auprès de la CNIL</h2>
          <p>
            Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d&apos;introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :
          </p>
          <ul>
            <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
            <li><strong>Adresse :</strong> CNIL, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>11. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour assurer la sécurité et la confidentialité de vos données personnelles, notamment :
          </p>
          <ul>
            <li>Chiffrement des communications (HTTPS/TLS)</li>
            <li>Contrôle des accès aux données</li>
            <li>Hébergement sécurisé chez un prestataire certifié</li>
            <li>Mises à jour régulières des systèmes</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>12. Modification de la politique</h2>
          <p>
            Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. En cas de modification substantielle, nous vous en informerons par tout moyen approprié. La date de dernière mise à jour figure en bas de cette page.
          </p>
          <p>
            Nous vous invitons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
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
