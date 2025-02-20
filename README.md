# 🎴 Pokémon Store

Bienvenue sur **Pokémon Store**, une boutique en ligne permettant d'acheter des cartes Pokémon avec un système d'authentification, un panier et un paiement sécurisé via Stripe.

🖥️ **Site en ligne** : [pokemon-green-gamma.vercel.app](https://pokemon-green-gamma.vercel.app)  
🛠️ **API utilisée** : [Pokémon TCG API](https://docs.pokemontcg.io)

---

## 🚀 Fonctionnalités

- 🔐 **Authentification et rôles**  
  - Inscription et connexion des utilisateurs  
  - Rôles : utilisateur & administrateur  
  - Dashboard utilisateur : suivi des commandes  
  - Dashboard administrateur : gestion de toutes les commandes  
  - Mot de passe oublié  

- 🛒 **Boutique & Panier**  
  - Catalogue de cartes Pokémon (données via **Pokémon TCG API**)  
  - Ajout au panier avec gestion des quantités  
  - Paiement sécurisé avec **Stripe (mode test virtuel)**  

- 📦 **Gestion des commandes**  
  - Sauvegarde des commandes dans la base de données avec métadonnées Stripe  
  - Envoi d’un email récapitulatif avec **Nodemailer**  

---

## 🛠️ Technologies utilisées

| Technologie   | Version   |
|--------------|-----------|
| **Frontend** |           |
| Next.js      | ^14.2.15  |
| React        | ^18       |
| React DOM    | ^18       |
| Tailwind CSS | ^3.4.12   |
| Sass         | ^1.78.0   |
| Swiper       | ^7.4.1    |
| FontAwesome  | ^6.6.0    |
| **Backend**  |           |
| Next Auth    | ^4.24.8   |
| MySQL        | ^3.11.1   |
| Micro        | ^10.0.1   |
| Dotenv       | ^16.4.5   |
| **Sécurité** |           |
| Bcrypt       | ^5.1.1    |
| BcryptJS     | ^2.4.3    |
| **Paiement** |           |
| Stripe SDK   | ^16.10.0  |
| Stripe JS    | ^4.4.0    |
| **Email**    |           |
| Nodemailer   | ^6.9.15   |
| **Tests**    |           |
| Jest         | ^29.7.0   |
| Supertest    | ^7.0.0    |
| TS-Jest      | ^29.2.5   |

---

## 📦 Installation et exécution

1. **Cloner le projet**  
   ```sh
   git clone https://github.com/ton-repo/pokemon-card-shop.git
   cd pokemon-card-shop

2. **Installer les dépendances**
   ```sh
   npm install

3. **Configurer l’environnement**
    Crée un fichier .env.local et ajoute les valeurs suivantes :

```json
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-public-key
STRIPE_SECRET_KEY=your-secret-key

# Base de données
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# Email SMTP
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
SMTP_HOST=your-smtp-host
SMTP_PORT=your-smtp-port
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_SECURE=false

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_DOMAIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Pokémon TCG API
POKEMON_TCG_API_KEY=your-api-key
```

⚠️ Ne partage jamais ces informations sensibles publiquement ! Pense à ajouter .env.local à ton .gitignore.

## 📧 Configuration de Gmail pour Nodemailer

Si tu utilises une adresse **Gmail** pour envoyer des emails depuis ton application, Google peut bloquer l’accès pour des raisons de sécurité. Voici les étapes pour éviter ce problème :

### 🔹 Utiliser un "Mot de passe d'application" (Recommandé)
Google propose une solution plus sécurisée via des **mots de passe d'application** :

#### ✅ Activer l'authentification à deux facteurs (2FA) sur ton compte Google  
- Va sur [Mon compte Google](https://myaccount.google.com/security)  
- Active **"Vérification en deux étapes"**  

#### ✅ Générer un mot de passe d’application  
- Toujours sur [Mon compte Google](https://myaccount.google.com/security), descends jusqu’à **"Mots de passe d'application"**  
- Sélectionne **"Mail"** et **"Appareil : Autre"** (nomme-le `"Nodemailer"`)  
- Google génère un **mot de passe à 16 caractères**  

#### ✅ Utiliser ce mot de passe dans Nodemailer  
Remplace ton `EMAIL_PASS` dans **.env.local** avec ce mot de passe généré :

```ini
EMAIL_USER=ton-adresse@gmail.com
EMAIL_PASS=mot-de-passe-google-généré
```
4. **Lancer le projet**
   ```sh
   npm run dev
   
## 🏗️ Scripts disponibles
   npm run dev     # Lancer le projet en mode développement  
   npm run build   # Construire le projet pour la production    
   npm run start   # Démarrer le serveur en production  
   npm run lint    # Vérifier le code   

## 📜 Licence
    - Ce projet est sous licence MIT.
