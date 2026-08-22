# Bel Âge Pâtisserie

Application React + Vite déployée sur Vercel.

## Plateforme de formation

### Architecture

- Frontend : React Router dans `src/pages/Plateforme/`.
- Backend : fonctions serverless Vercel sous `api/training/`.
- Utilisateurs : `server/training/users.json`, uniquement importé par les fonctions API et les scripts Node locaux, jamais par le frontend.
- Mots de passe : hachés avec `bcryptjs` (12 rounds).
- Sessions : cookie signé `HttpOnly`, `SameSite=Lax`, `Secure` en production. Le secret est stocké dans `TRAINING_SESSION_SECRET`.
- Progression : stockée localement dans le navigateur. Elle ne donne aucun droit et peut être perdue si le navigateur est réinitialisé.

### Routes

Frontend : `/plateforme/connexion`, `/plateforme`, `/plateforme/layer-cake`, `/plateforme/flower-cupcake`, `/plateforme/wedding-cake`.

API : `POST /api/training/login`, `POST /api/training/logout`, `GET /api/training/session`, `GET /api/training/courses`, `GET /api/training/course/:courseId`, `GET /api/training/video/:courseId/:lessonId`.

La route vidéo vérifie l’accès, mais aucun stockage vidéo privé n’est connecté à ce stade. Ne placez jamais une vidéo payante dans `public/` : ajoutez un stockage privé et servez-la par cette route après contrôle de session.

### Variables d’environnement

Copiez `.env.example` en `.env.local` puis définissez :

```txt
TRAINING_SESSION_SECRET=une-valeur-aleatoire-d-au-moins-32-caracteres
```

Pour Vercel : ajoutez la même variable privée dans **Project Settings → Environment Variables**. Ne préfixez pas cette variable avec `VITE_`, elle ne doit jamais arriver dans le navigateur.

### Paiement Stripe

Ajoutez ces variables privées dans Vercel, sans préfixe `VITE_` :

```txt
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Le webhook Stripe doit pointer vers `https://www.belagepatisserie.com/api/stripe/webhook` et écouter `checkout.session.completed`. Les premières ventes sont traitées manuellement : la commande Stripe indique l’e-mail et les formations achetées, puis l’administratrice crée le compte formation.

### Gestion des clientes

Les comptes sont définis dans le fichier serveur privé. Vercel ne permet pas à une fonction serverless de modifier durablement ce fichier : après toute opération locale, faites un commit et déployez.

```bash
npm run training:user:list
npm run training:user:add
npm run training:user:disable -- identifiant
npm run training:user:enable -- identifiant
npm run training:user:update-courses -- identifiant
npm run training:user:reset-password -- identifiant
npm run training:user:delete -- identifiant
```

Procédure pour chaque vente :

1. Exécutez `npm run training:user:add`.
2. Saisissez le prénom, les cours achetés et le statut.
3. Copiez l’identifiant et le mot de passe affiché une seule fois.
4. Vérifiez que seul un hash est ajouté à `server/training/users.json`.
5. Committez et déployez sur Vercel.
6. Envoyez les identifiants à la cliente par un canal sûr.
7. Testez la connexion.

### Développement et déploiement

```bash
npm install
npm run dev
npm run build
npm run lint
```

`npm run dev:vercel` lance le site complet via Vercel localement : c’est la commande à utiliser pour tester la connexion et les droits des formations. Vercel affichera l’adresse locale dans le terminal (souvent `http://localhost:3000`).

`npm run dev` (ou `npm run dev:vite`) lance uniquement l’interface React ; utilisez-le pour travailler rapidement sur l’interface. Il ne peut pas faire fonctionner la connexion, car les routes `api/` n’y sont pas exécutées.

Vercel déploie le frontend et les routes `api/` depuis le même dépôt.

### Vérifications avant mise en ligne

- Lancer `npm run lint` puis `npm run build`.
- Vérifier qu’une connexion invalide renvoie toujours le même message générique.
- Vérifier session, déconnexion, compte désactivé et compte expiré.
- Vérifier qu’une cliente n’accède qu’aux formations présentes dans son compte.
- Vérifier l’API vidéo avec une leçon autorisée, un cours non acheté et un identifiant de leçon inconnu.
- Tester les largeurs mobile, tablette et ordinateur, les liens du menu mobile et les tailles de boutons tactiles.
- Activer « réduire les animations » dans le système et contrôler que les transitions restent discrètes.

### Limites sans base de données

- Les changements de clientes nécessitent commit + déploiement.
- La progression n’est ni synchronisée ni sauvegardée côté serveur.
- Les vidéos payantes nécessitent un stockage privé externe ou Vercel Blob avec URL signées pour une protection complète.
- Le dépôt utilisateurs est isolé derrière une interface (`trainingUserRepository`) afin de remplacer plus tard le fichier JSON par PostgreSQL, Supabase ou un autre stockage sans réécrire l’authentification.
