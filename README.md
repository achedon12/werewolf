# 🐺 Loup-Garou en Ligne (Werewolf Online)

Une application web en temps réel du célèbre jeu de société Loup-Garou (Werewolf), construite avec Next.js, React, Node.js et Socket.io. Jouez avec vos amis en ligne dans une ambiance immersive et mystérieuse !

[🇫🇷 Version française](#french) | [🇬🇧 English version](#english)

[![Discord](https://img.shields.io/badge/Discord-Rejoindre-7289DA?logo=discord&logoColor=white)](https://discord.gg/TgybvRqjEY)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/achedon12/werewolf)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎮 Fonctionnalités Principales

- **🌙 Gameplay en Temps Réel :** Parties dynamiques et engageantes avec Socket.io
- **👥 Multijoueur :** Jusqu'à 18 joueurs par partie
- **🎭 16 Rôles Disponibles :** Loup-Garou, Voyante, Sorcière, Chasseur, Cupidon, et bien d'autres
- **🔒 Authentification Sécurisée :** Comptes utilisateurs avec JWT et historique de parties
- **📊 Statistiques en Direct :** Suivez les parties en cours et les joueurs connectés
- **⚙️ Configurations Personnalisables :** Choisissez vos rôles et configurations de partie
- **🎨 Interface Moderne :** Design élégant avec Tailwind CSS et DaisyUI
- **🐳 Déploiement Docker :** Conteneurisation complète pour un déploiement facile

## 🎭 Rôles Disponibles

Le jeu inclut 16 rôles différents avec des capacités uniques :

### 🐺 Équipe des Loups
- **Loup-Garou** : Élimine un joueur chaque nuit
- **Loup-Garou Blanc** : Peut éliminer un autre loup-garou

### 👥 Équipe du Village
- **Voyante** : Découvre l'identité d'un joueur chaque nuit
- **Sorcière** : Possède une potion de vie et une potion de mort
- **Chasseur** : Élimine un joueur lorsqu'il meurt
- **Salvateur** : Protège un joueur chaque nuit
- **Petite Fille** : Espionne les loups-garous
- **Sœur** : Deux sœurs qui se connaissent
- **Servante Dévouée** : Peut prendre le rôle d'un joueur éliminé
- **Enfant Sauvage** : Devient loup-garou si son modèle meurt
- **Renard** : Détecte les loups-garous
- **Montreur d'Ours** : Son ours grogne si un loup est proche
- **Villageois** : Aucun pouvoir spécial

### ⚡ Rôles Spéciaux
- **Cupidon** : Crée un lien d'amour entre deux joueurs
- **Voleur** : Peut échanger son rôle au début de la partie

## 💻 Stack Technique

- **Frontend :** Next.js 15, React 19, Tailwind CSS 4, DaisyUI
- **Backend :** Node.js, Socket.io
- **Base de données :** PostgreSQL, Prisma ORM
- **Authentification :** JWT, bcrypt
- **Email :** Nodemailer
- **Conteneurisation :** Docker, Docker Compose
- **Graphiques :** Chart.js, Recharts
- **Validation :** Zod

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js :** Version 20 ou supérieure
- **npm :** Inclus avec Node.js
- **Docker :** Pour la conteneurisation (optionnel)
- **Docker Compose :** Pour les applications multi-conteneurs (optionnel)
- **PostgreSQL :** Base de données (ou via Docker)

## 🚀 Installation et Configuration

### Installation en Local

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/achedon12/werewolf.git
   cd werewolf
   ```

2. **Installer les dépendances :**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement :**

   Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :

   ```env
   # Database
   DATABASE_URL="postgresql://db_user:db_password@localhost:5432/db_name"
   
   # App
   JWT_SECRET="votre_clé_secrète_jwt"
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_DISCORD_URL="https://discord.gg/TgybvRqjEY"
   NEXT_PUBLIC_GITHUB_URL="https://github.com/achedon12/werewolf"
   NODE_ENV=development
   
   # Mailer (Development)
   SMTP_HOST=localhost
   SMTP_PORT=1025
   ```

4. **Lancer les migrations de base de données :**

   ```bash
   npx prisma migrate dev
   ```

5. **Générer le client Prisma :**

   ```bash
   npx prisma generate
   ```

6. **Peupler la base de données (optionnel) :**

   ```bash
   npm run seed
   ```

7. **Démarrer le serveur de développement :**

   ```bash
   npm run dev
   ```

8. **Accéder à l'application :**

   Ouvrez votre navigateur à l'adresse `http://localhost:3000`

### 🐳 Installation avec Docker

Pour déployer l'application avec Docker :

1. **Créer le fichier `.env` :**

   Copiez `.env.example` vers `.env` et configurez les variables (notamment pour PostgreSQL)

2. **Construire et démarrer les conteneurs :**

   ```bash
   docker compose up --build -d
   ```

   Pour le développement :
   ```bash
   docker compose -f docker-compose.dev.yml up --build -d
   ```

3. **Lancer les migrations :**

   ```bash
   docker compose exec app npx prisma migrate deploy
   ```

4. **Accéder à l'application :**

   - **Production :** `http://localhost:82`
   - **Développement :** `http://localhost:3000`

5. **Voir les logs :**

   ```bash
   docker compose logs -f app
   ```

6. **Arrêter les conteneurs :**

   ```bash
   docker compose down
   ```

> **Note :** À chaque modification du code, reconstruisez l'image Docker avec `docker compose up --build -d`

## 📖 Utilisation

### Comment Jouer

1. **Créer un compte** : Inscrivez-vous avec un nom d'utilisateur et un email
2. **Rejoindre ou créer une partie** : Accédez à la liste des parties disponibles
3. **Configurer les rôles** : L'hôte choisit les rôles et le nombre de joueurs (8-18)
4. **Commencer la partie** : Les rôles sont distribués aléatoirement
5. **Jouer** :
   - **Nuit** : Les rôles spéciaux effectuent leurs actions
   - **Jour** : Tous les joueurs débattent et votent pour éliminer un suspect
6. **Gagner** :
   - **Villageois** : Éliminez tous les loups-garous
   - **Loups-garous** : Égalisez ou dépassez le nombre de villageois

### Structure du Projet

```
werewolf/
├── src/
│   ├── app/              # Pages Next.js et API routes
│   │   ├── api/          # Endpoints API
│   │   ├── game/         # Pages du jeu
│   │   ├── auth/         # Authentification
│   │   └── ...
│   ├── server/           # Serveur Node.js et Socket.io
│   │   ├── socket/       # Gestionnaires Socket.io
│   │   └── index.js      # Point d'entrée du serveur
│   ├── utils/            # Utilitaires (Roles, Date, etc.)
│   └── components/       # Composants React
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   ├── migrations/       # Migrations
│   └── seed.js           # Script de seed
├── public/               # Fichiers statiques
└── docker-compose.yml    # Configuration Docker
```

### Scripts Disponibles

```bash
npm run dev      # Démarre le serveur de développement avec nodemon
npm run build    # Construit l'application pour la production
npm start        # Démarre le serveur en mode production
npm run lint     # Exécute ESLint
npm run seed     # Peuple la base de données
npm run analyze  # Analyse la taille du bundle
```

### API Endpoints

#### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/profile` - Récupérer le profil utilisateur
- `GET /api/auth/profile/history` - Historique des parties

#### Jeu
- `GET /api/game/list` - Liste des parties disponibles
- `POST /api/game` - Créer une nouvelle partie

#### Socket.io Events
- `create-game` - Créer une partie
- `join-game` - Rejoindre une partie
- `start-game` - Démarrer la partie
- `chat-message` - Envoyer un message
- `vote` - Voter pendant le jour
- `night-action` - Effectuer une action nocturne

## ⚙️ Configuration

### Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Clé secrète pour les tokens JWT | `votre_clé_secrète_très_sécurisée` |
| `NEXT_PUBLIC_APP_URL` | URL de l'application | `http://localhost:3000` |
| `NEXT_PUBLIC_DISCORD_URL` | Lien vers Discord | URL du serveur Discord |
| `NEXT_PUBLIC_GITHUB_URL` | Lien vers GitHub | URL du dépôt |
| `NODE_ENV` | Environnement d'exécution | `development` ou `production` |
| `SMTP_HOST` | Serveur SMTP pour les emails | `localhost` ou serveur SMTP |
| `SMTP_PORT` | Port SMTP | `1025` (dev) ou `587` (prod) |
| `SMTP_USER` | Utilisateur SMTP | Votre email SMTP |
| `SMTP_PASSWORD` | Mot de passe SMTP | Mot de passe SMTP |

### Configuration des Rôles

Les configurations de rôles pour chaque nombre de joueurs (8-18) sont définies dans `src/utils/Roles.js`. Vous pouvez personnaliser les rôles disponibles pour chaque taille de partie.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Forkez le dépôt**
2. **Créez une branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Faites vos modifications**
4. **Committez** : `git commit -m 'Ajout d'une nouvelle fonctionnalité'`
5. **Poussez** : `git push origin feature/nouvelle-fonctionnalite`
6. **Ouvrez une Pull Request**

### Directives de Contribution

- Respectez le style de code existant
- Testez vos modifications avant de soumettre
- Documentez les nouvelles fonctionnalités
- Assurez-vous que le linting passe : `npm run lint`

## 🐛 Signaler un Bug

Si vous trouvez un bug, veuillez ouvrir une issue sur GitHub avec :
- Une description claire du problème
- Les étapes pour reproduire le bug
- Le comportement attendu vs le comportement actuel
- Des captures d'écran si possible

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

Copyright (c) 2025 Leo Deroin

## 🙏 Remerciements

Ce projet utilise et remercie les technologies suivantes :

- [Next.js](https://nextjs.org) - Framework React pour le frontend
- [React](https://reactjs.org) - Bibliothèque UI
- [Node.js](https://nodejs.org) - Runtime JavaScript serveur
- [Socket.io](https://socket.io) - Communication temps réel
- [Prisma](https://www.prisma.io) - ORM pour la base de données
- [PostgreSQL](https://www.postgresql.org) - Base de données relationnelle
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [DaisyUI](https://daisyui.com) - Composants UI pour Tailwind
- [JWT](https://jwt.io) - Authentification sécurisée
- [Docker](https://www.docker.com) - Conteneurisation
- [Chart.js](https://www.chartjs.org) - Graphiques et statistiques
- [Zod](https://zod.dev) - Validation de schémas

## 📞 Contact & Liens

- **Discord** : [Rejoindre le serveur](https://discord.gg/TgybvRqjEY)
- **GitHub** : [Dépôt du projet](https://github.com/achedon12/werewolf)
- **Auteur** : Leo Deroin - [l.deroin@netcourrier.com](mailto:l.deroin@netcourrier.com)

## 📊 Statistiques du Projet

- **Version** : 0.3.0
- **Rôles disponibles** : 16
- **Joueurs supportés** : 8-18 par partie
- **Technologies** : 15+ bibliothèques et frameworks

---

<div align="center">

**Fait avec ❤️ par [Leo Deroin](https://github.com/achedon12)**

⭐ N'oubliez pas de mettre une étoile si vous aimez ce projet !

</div>