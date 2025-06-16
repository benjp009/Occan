# Logiciel France 🇫🇷 - Annuaire des entreprises technologiques françaises

Logiciel France est le premier annuaire dédié aux entreprises technologiques françaises et à leurs solutions logicielles. L'objectif est de promouvoir le "Made in France" et de faciliter les échanges entre les éditeurs de logiciels français et leurs clients ou partenaires potentiels.

## 🚀 Fonctionnalités

* Recherche et découverte des entreprises technologiques françaises.
* Présentation des produits et services logiciels proposés.
* Données centralisées et mises à jour via une feuille de calcul Google Sheets publique.

## 📂 Structure du projet
 
```
/Occan
├── public/            # Fichiers statiques
├── src/               # Code source de l'application
│   ├── components/    # Composants React
│   ├── hooks/         # Hooks personnalisés
│   ├── pages/         # Pages de l'application
│   ├── services/      # Services pour accès aux données
│   ├── App.tsx        # Composant racine
│   └── index.tsx      # Point d'entrée
├── README.md          # Documentation du projet
├── package.json       # Dépendances et scripts npm
├── tsconfig.json      # Configuration TypeScript
└── .gitignore         # Fichiers ignorés par git
```

## 🛠️ Technologies utilisées

* **React** (v18+) avec **TypeScript** pour une expérience de développement typée et robuste.
* **Plain CSS** pour le style et le design, sans framework CSS externe.
* **Google Sheets API** via un service REST pour récupérer et mettre à jour les données de l'annuaire.
* **Vite** comme bundler pour des temps de démarrage et de rechargement rapide.

## 📊 Source des données

Les informations sur les entreprises et leurs logiciels sont stockées dans une feuille Google Sheets publique :

> [https://docs.google.com/spreadsheets/d/1WoUB3iTejzgFtf3iCs-PN6d88lxuop\_VlhOyrhD1HiQ/edit?gid=0](https://docs.google.com/spreadsheets/d/1WoUB3iTejzgFtf3iCs-PN6d88lxuop_VlhOyrhD1HiQ/edit?gid=0)

Les données sont récupérées dynamiquement à chaque chargement de l'application.

## 🔧 Installation et démarrage

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/benjp009/Occan.git
   cd Occan
   ```
2. Installer les dépendances :

   ```bash
   npm install
   ```
3. Créer un fichier `.env` à la racine et ajouter votre clé d'API Google Sheets :

   ```env
   VITE_GOOGLE_SHEETS_API_KEY=Votre_Cle_API_Ici
   ```
4. Lancer l'application en mode développement :

   ```bash
   npm run dev
   ```
5. Accéder à l'application via `http://localhost:5173`.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des améliorations ou signaler des problèmes :

1. Ouvrir une issue.
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`).
3. Committer vos modifications (`git commit -m 'Ajout d'une fonctionnalité'`).
4. Pusher vers la branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrir une Pull Request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🚀 Déploiement

Avant de mettre l'application en production, générez un sitemap à jour. Le script `npm run build` s'en charge automatiquement et crée `public/sitemap.xml` à partir des catégories présentes dans la feuille Google Sheets.

```bash
npm run build
```

*Logiciel France 🇫🇷 - Annuaire des entreprises technologiques françaises*
