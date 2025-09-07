# 🌱 Smart Gardening – Frontend

Interface web en Next.js permettant de gérer un jardin connecté simulé.  
Ce frontend consomme l’API backend (Node/Express, PostgreSQL, MongoDB) et offre une expérience utilisateur fluide : gestion des plantes, visualisation des capteurs simulés, notifications et articles éducatifs.

---

## 🚀 Fonctionnalités principales

- 📋 **Authentification** (connexion/inscription via JWT)
- 🌿 **Gestion des plantes** (CRUD complet : ajout, consultation, modification, suppression)
- 📊 **Capteurs simulés** (température, humidité, lumière, humidité du sol avec statuts OK/LOW/CRITICAL)
- 🔔 **Notifications en temps réel** liées aux seuils critiques
- 📚 **Articles éducatifs** pour l’entretien des plantes (contenu MongoDB)
- 💻 **Dashboard responsive** avec indicateurs visuels et code couleur

---

## 📦 Stack technique

- **Framework** : Next.js 13+ (App Router)
- **Langage** : TypeScript / JavaScript
- **UI** : React + TailwindCSS
- **Tests E2E** : Playwright
- **Outils** : Axios (requêtes API), SWR (fetching optimisé), Framer Motion (animations)

---

## ⚙️ Installation et lancement

### 1. Cloner le projet
```bash
git clone https://github.com/Dukent29/smart-gardening-frontend.git
cd smart-gardening-frontend
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en modifiant `pages/index.js`. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Les [routes API](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) peuvent être accédées à l'adresse [http://localhost:3000/api/hello](http://localhost:3000/api/hello). Ce point de terminaison peut être modifié dans `pages/api/hello.js`.

Le répertoire `pages/api` est mappé sur `/api/*`. Les fichiers de ce répertoire sont traités comme des [routes API](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) au lieu de pages React.

Ce projet utilise [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une nouvelle famille de polices pour Vercel.

## En savoir plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn-pages-router) - un tutoriel interactif sur Next.js.

Vous pouvez consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Déployer sur Vercel

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation sur le déploiement Next.js](https://nextjs.org/docs/pages/building-your-application/deploying) pour plus de détails.
