# Frontend EvaStyl - Mode & Bijoux

## 🎨 Vue d'ensemble

Frontend React + TypeScript pour le site e-commerce EvaStyl avec panel d'administration intégré.

## 📦 Technologies

- **React 19** + TypeScript
- **Vite** - Build tool rapide
- **Tailwind CSS** - Styles
- **Axios** - Client HTTP
- **React Hot Toast** - Notifications
- **Recharts** - Graphiques (dashboard admin)
- **Lucide React** - Icônes

## 🏗️ Structure du projet

```
src/
├── assets/                 # Images et ressources statiques
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation principale
│   │   ├── Footer.tsx      # Pied de page
│   │   └── AdminLayout.tsx # Layout du panel admin
│   ├── sections/           # Sections de la page d'accueil
│   └── ProductCard.tsx     # Carte produit réutilisable
├── data/
│   └── products.ts         # Données statiques des produits
├── hooks/
│   ├── useAuth.ts          # Hook d'authentification
│   ├── useProducts.ts      # Hook de gestion des produits
│   ├── useOrders.ts        # Hook de gestion des commandes
│   ├── useAdmin.ts         # Hook des statistiques admin
│   └── useReveal.ts        # Hook d'animations
├── pages/
│   ├── Home.tsx
│   ├── Collections.tsx
│   ├── Vetements.tsx
│   ├── Bijoux.tsx
│   ├── Apropos.tsx
│   ├── Contact.tsx
│   ├── Favoris.tsx
│   ├── Profil.tsx
│   ├── Checkout.tsx
│   ├── ProductDetail.tsx
│   └── admin/              # Pages d'administration
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminProducts.tsx
│       └── AdminOrders.tsx
├── services/
│   └── api.ts              # Client API Axios
├── types/
│   └── index.ts            # Types TypeScript
├── App.tsx                 # Composant principal avec routing
└── main.tsx               # Point d'entrée

```

## 🚀 Installation et Démarrage

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## 🔧 Configuration

Créez un fichier `.env` à la racine du dossier frontend :

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Fonctionnalités

### Site Public

- ✅ Navigation fluide entre les pages
- ✅ Catalogue de produits (vêtements et bijoux)
- ✅ Système de panier avec calcul automatique
- ✅ Liste de favoris
- ✅ Page de détails produit
- ✅ Formulaire de checkout
- ✅ Page profil utilisateur
- ✅ Conversion automatique en FCFA
- ✅ Filtres par catégorie et prix
- ✅ Recherche de produits
- ✅ Design responsive

### Panel Admin

- ✅ **Dashboard** - Statistiques en temps réel
  - Revenu total
  - Nombre de commandes
  - Produits et utilisateurs
  - Graphique des ventes
  - Top produits
  - Alertes de stock faible
  - Commandes récentes
  
- ✅ **Gestion des Produits**
  - Liste avec pagination
  - Recherche et filtres
  - Création/Modification/Suppression
  - Gestion du stock
  - Activation/Désactivation

- ✅ **Gestion des Commandes**
  - Liste de toutes les commandes
  - Changement de statut
  - Marquer comme payé
  - Détails complets de chaque commande
  - Filtres par statut

- ✅ **Interface Moderne**
  - Sidebar de navigation
  - Dark mode pour l'admin
  - Animations fluides
  - Toasts de notification

## 🔐 Accès Admin

Pour accéder au panel d'administration :

1. **Via le Footer** : Cliquez sur le lien "Admin" en bas de page (discret)
2. **URL directe** : Changez manuellement `currentPage` vers `'admin-login'` dans le code

**Identifiants par défaut :**
```
Email: admin@evastyl.com
Mot de passe: Admin@123456
```

## 🎨 Personnalisation

### Couleurs (tailwind.config.js)

```js
colors: {
  'gold': '#D4AF37',
  'charcoal': '#2C2C2C',
  'cream': '#F8F6F3',
  // ...
}
```

### Hooks Personnalisés

#### useAuth
```typescript
const { user, isAuthenticated, isAdmin, login, logout, register } = useAuth();
```

#### useProducts
```typescript
const { products, loading, pagination, fetchProducts, createProduct } = useProducts();
```

#### useOrders
```typescript
const { orders, loading, createOrder, cancelOrder } = useOrders();
```

#### useAdmin
```typescript
const { stats, salesData, fetchStats, updateOrderStatus } = useAdmin();
```

## 📡 API Integration

Le frontend communique avec le backend via Axios :

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercepteurs pour JWT automatique
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints disponibles

**Authentification:**
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/me` - Informations utilisateur
- `PUT /auth/profile` - Modifier profil
- `PUT /auth/password` - Changer mot de passe

**Produits:**
- `GET /products` - Liste avec filtres
- `GET /products/:id` - Détails
- `POST /products` - Créer (admin)
- `PUT /products/:id` - Modifier (admin)
- `DELETE /products/:id` - Supprimer (admin)

**Commandes:**
- `POST /orders` - Créer commande
- `GET /orders/myorders` - Mes commandes
- `PUT /orders/:id/status` - Changer statut (admin)
- `PUT /orders/:id/cancel` - Annuler

**Admin:**
- `GET /admin/stats` - Statistiques dashboard
- `GET /admin/sales/:period` - Données de ventes
- `GET /admin/users` - Liste utilisateurs

## 🔨 Scripts

```bash
npm run dev      # Développement avec hot reload
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code
```

## 🚢 Build Production

```bash
# Compiler le projet
npm run build

# Le dossier 'dist' contient les fichiers optimisés
# Déployer sur Vercel, Netlify, ou autre hébergeur
```

## 📱 Responsive

Le site est entièrement responsive avec des breakpoints Tailwind :

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🎭 Routes

### Routes Publiques
- `/` - Accueil
- `/collections` - Collections
- `/vetements` - Vêtements
- `/bijoux` - Bijoux
- `/apropos` - À propos
- `/contact` - Contact
- `/favoris` - Favoris
- `/profil` - Profil utilisateur
- `/checkout` - Finaliser commande
- `/product-:id` - Détails produit

### Routes Admin (protégées)
- `/admin-login` - Connexion admin
- `/admin-dashboard` - Tableau de bord
- `/admin-products` - Gestion produits
- `/admin-orders` - Gestion commandes
- `/admin-users` - Gestion utilisateurs

## 🐛 Débogage

### Problème : Token expiré
```javascript
// Le token JWT est automatiquement supprimé si expiré (401)
// L'utilisateur est redirigé vers la page d'accueil
```

### Problème : CORS
```javascript
// Assurez-vous que le backend autorise l'origine du frontend
// backend/src/server.ts: cors({ origin: 'http://localhost:5173' })
```

## 🤝 Contribution

Ce projet utilise :
- ESLint pour le linting
- TypeScript en mode strict
- Prettier (recommandé)

## 📄 License

Propriété de EvaStyl © 2025

---

**Développé avec ❤️ pour EvaStyl**
