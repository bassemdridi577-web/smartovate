# 🚀 Smartovate - Plateforme d'Analyses Interactive Premium (Next.js)

**Smartovate** est un tableau de bord analytique haute performance de qualité premium, conçu pour transformer les données brutes en insights stratégiques exploitables. Cette application a été optimisée avec un **système de repli (fallback) intelligent** permettant de l'exécuter soit de manière dynamique avec son backend, soit de manière **100% autonome (standalone)** pour une démonstration directe dans votre portfolio.

---

## 🌟 Caractéristiques & Fonctionnalités clés

### 📊 Visualisations de Données Avancées
*   **Surveillance du Trafic (Chart.js)** : Suivi en temps réel des pages vues et visiteurs uniques avec des graphiques interactifs haute-fidélité.
*   **Entonnoir de Conversion (Recharts)** : Visualisation claire des étapes d'engagement des leads pour repérer les points de friction dans le tunnel de conversion.
*   **Carte de Chaleur d'Activité (D3.js)** : Composant sur-mesure affichant l'intensité des heures d'affluence des utilisateurs.

### 🤖 Intelligence Artificielle & Aide à la Décision
*   **Centre de Décision IA** : Génération d'insights stratégiques et alertes d'anomalies de haute ou moyenne gravité.
*   **Assistant Virtuel Interactif (SmartBot)** : Bot de discussion capable de répondre intelligemment à vos questions analytiques sur les revenus, le trafic, les leads ou les produits.

### 💼 Expérience Utilisateur & Design Premium
*   **Esthétique Moderne** : Design soigné basé sur le *glassmorphism*, avec des animations fluides propulsées par **Framer Motion**.
*   **Gestion des Rôles & Sécurité** : Interface complète de gestion d'accès (Admin, Éditeur, Lecteur).
*   **Paramètres Complets** : Profil, sécurité, préférences de notifications, configuration du fournisseur IA (Google Gemini, OpenRouter) et statut de connexion à la base de données.

---

## 🛠️ Stack Technique

*   **Framework** : [Next.js 16 (App Router)](https://nextjs.org/)
*   **Language** : TypeScript
*   **Styling** : CSS Modules (Aesthetics & Performance)
*   **Animations** : [Framer Motion](https://www.framer.com/motion/)
*   **Charts & Visualizations** : [Chart.js](https://www.chartjs.org/), [Recharts](https://recharts.org/), et [D3.js](https://d3js.org/)
*   **Icons** : [Lucide React](https://lucide.dev/)
*   **Client API** : Axios with Custom Interceptors for Auto-Mock Mode

---

## ⚡ Démarrage Rapide (Mode Standalone Démo)

Vous n'avez pas besoin d'exécuter de serveur backend pour tester l'application ! Grâce à notre **Mock Adapter** intégré, si aucun serveur n'est détecté, l'application passe automatiquement en mode démonstration autonome.

### 1. Cloner le projet et installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement local
```bash
npm run dev
```
Ouvrez ensuite votre navigateur sur **[http://localhost:5500](http://localhost:5500)**.

### 3. Explorer en Mode Démo
Sur l'écran de connexion, cliquez simplement sur le bouton premium **"Explorer en Mode Démo"** pour accéder instantanément au tableau de bord sans avoir à saisir de mot de passe !

---

## ☁️ Déploiement en 1 Clic (Vercel)

Cette application est prête pour le déploiement sur Vercel :
1. Créez un projet sur [Vercel](https://vercel.com).
2. Liez votre dépôt GitHub.
3. Déployez ! Aucune configuration de variables d'environnement n'est obligatoire pour faire tourner le mode démonstration.

---

© 2026 Smartovate. Conçu avec passion et excellence pour les portfolios d'ingénieurs frontend modernes.

