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

![2025-02-21 00 07 50 localhost 5905fd783de6](https://github.com/user-attachments/assets/a7a9af50-197b-4299-8e92-77e2751d6d0a)
![2025-02-21 00 15 34 localhost 6b92d06d369f](https://github.com/user-attachments/assets/7e778e9c-93a5-4415-b44e-03633f15b151)
![2025-02-21 00 15 59 localhost 844ae4c4ea00](https://github.com/user-attachments/assets/3ba93c23-7492-46d1-845f-fdad784c2947)
![2025-02-20 23 57 49 localhost 5c5f18d2d0df](https://github.com/user-attachments/assets/9253925c-a5e6-425a-b9d5-0ddef407e83a)
![2025-02-21 00 09 34 localhost 576045bb14b9](https://github.com/user-attachments/assets/20cf45c2-777e-4fc9-aaf2-224ad6d3701d)
![2025-02-21 00 09 52 localhost f10af7cea343](https://github.com/user-attachments/assets/b5a0a70f-3742-4dab-9f1d-2b8ab691dbcf)
![2025-02-21 00 10 03 localhost fada96d98634](https://github.com/user-attachments/assets/29fa8b54-2b3b-47a8-bca4-5d20b89fc49c)
![2025-02-21 00 10 36 checkout stripe com 4fb7e365717b](https://github.com/user-attachments/assets/5ce9b648-9316-4c20-a60e-eceadc0f0542)
![2025-02-21 00 11 08 localhost 9c7d3082d9d5](https://github.com/user-attachments/assets/1be51dc9-61b9-4fd2-8a8b-3cc0afd315d3)
![Capture d'écran 2025-02-21 001156](https://github.com/user-attachments/assets/3c115ada-c3c2-468e-9a3c-3307e2516228)
![2025-02-21 00 13 02 localhost 797d080d6bc4](https://github.com/user-attachments/assets/e04163fc-3483-4c71-8c94-b05b26dc929b)
![2025-02-21 00 13 44 localhost 1a11af70f08c](https://github.com/user-attachments/assets/1c74bc14-f014-4919-bc1f-f37f1f06f5a8)
![2025-02-21 00 13 30 localhost 5e709f4e3880](https://github.com/user-attachments/assets/96684906-8f12-4923-8498-d02c21fef28b)
![2025-02-21 00 14 21 localhost b5a689771a61](https://github.com/user-attachments/assets/8cd12111-17b3-483f-b3a7-568b67dd29f3)

---
## Structure de ma base de données
![Capture d'écran 2025-02-21 004145](https://github.com/user-attachments/assets/74912aca-d2d8-43aa-aaf4-92d5d222a5f6)
![Capture d'écran 2025-02-21 004117](https://github.com/user-attachments/assets/8cfbc23e-f8e5-4a65-b12e-13bc6f4e8b33)
![Capture d'écran 2025-02-21 004133](https://github.com/user-attachments/assets/f74416b8-df76-44ab-840e-112ddf2f9eae)


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
