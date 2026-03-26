# JRP Speedway — Vue 3 + Firebase Web App

A full-featured website for JRP Speedway in Tulsa, Oklahoma. Built with Vue 3, Firebase (Auth, Firestore, Storage), and deployed via GitHub Actions → Azure Static Web Apps.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 (Composition API) + Vite |
| State | Pinia |
| Routing | Vue Router 4 |
| Backend/DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions |

---

## Pages

### Public
| Route | Description |
|---|---|
| `/` | Home — hero, quick nav, events teaser, CTA |
| `/track` | Track specs, hours, location, rules |
| `/rentals` | Rental karts, rates, group packages, FAQ |
| `/events` | Filterable events calendar from Firestore |
| `/league` | League info, classes, format, TSRS affiliation |
| `/shop` | Karts & tires for sale from Firestore |
| `/blog` | Blog post listing |
| `/blog/:id` | Individual blog post |

### Admin (protected)
| Route | Description |
|---|---|
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard with stats |
| `/admin/blog` | Blog post list |
| `/admin/blog/new` | Create post |
| `/admin/blog/:id/edit` | Edit post |
| `/admin/events` | Manage events |
| `/admin/shop` | Manage products |
| `/admin/users` | Manage admin users *(superadmin only)* |

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `blog` | Blog posts (`title`, `body`, `excerpt`, `category`, `author`, `coverImage`, `published`, `createdAt`) |
| `events` | Race events (`title`, `type`, `eventDate`, `time`, `location`, `description`, `price`, `registrationUrl`) |
| `products` | Shop items (`name`, `category`, `condition`, `price`, `salePrice`, `description`, `imageUrl`, `specs[]`) |
| `admins` | Admin users — keyed by Firebase Auth UID (`email`, `name`, `role: 'admin' | 'superadmin'`) |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-org/jrp-speedway.git
cd jrp-speedway
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `jrp-speedway`)
3. Enable **Firestore Database** (start in production mode)
4. Enable **Authentication** → Email/Password provider
5. Enable **Storage**
6. Copy your Firebase web app config

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your Firebase values in .env.local
```

### 4. Deploy Firestore rules & indexes

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Create your first superadmin

After deploying, you need to manually create the first admin via the Firebase Console:

1. In Firebase Console → **Authentication** → Add user (email + password)
2. Copy the new user's **UID**
3. In **Firestore** → `admins` collection → New document
   - Document ID: **the UID from step 2**
   - Fields: `email` (string), `name` (string), `role: "superadmin"`
4. Go to `/admin/login` and sign in

Once logged in as superadmin, you can create additional admins via `/admin/users`.

### 6. Run locally

```bash
npm run dev
# Open http://localhost:5173
```

---

## Deployment: Azure Static Web Apps

### Initial setup

1. Create an Azure Static Web App in the [Azure Portal](https://portal.azure.com)
   - Source: GitHub
   - Build preset: **Vite**
   - App location: `/`
   - Output location: `dist`
2. Azure will auto-commit a workflow file — you can replace it with `.github/workflows/deploy.yml`

### GitHub Secrets required

Go to your repo → Settings → Secrets → Actions and add:

| Secret | Value |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | From Azure portal (Deployment token) |
| `VITE_FIREBASE_API_KEY` | Firebase config value |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase config value |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase config value |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase config value |
| `VITE_FIREBASE_APP_ID` | Firebase config value |
| `FIREBASE_TOKEN` | Run `firebase login:ci` locally to get this |

### Deploy

Push to `main` — GitHub Actions handles the rest.

```bash
git add .
git commit -m "Initial deploy"
git push origin main
```

---

## Admin Roles

| Role | Permissions |
|---|---|
| `admin` | Create/edit/delete blog posts, events, products |
| `superadmin` | All of the above + manage admin user accounts |

---

## Customization Checklist

- [ ] Update phone, email, address in `AppFooter.vue` and `TrackView.vue`
- [ ] Update track specs in `TrackView.vue`
- [ ] Update operating hours in `TrackView.vue`
- [ ] Update rental pricing in `RentalsView.vue`
- [ ] Update social media handles in `AppFooter.vue`
- [ ] Replace map placeholder with embedded Google Map iframe in `TrackView.vue`
- [ ] Set `VITE_FIREBASE_*` secrets in GitHub
- [ ] Set `AZURE_STATIC_WEB_APPS_API_TOKEN` in GitHub
- [ ] Create first superadmin in Firebase console
- [ ] Deploy Firestore rules
