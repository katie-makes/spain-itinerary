# Barcelona & Costa Brava — Itinerario

Static itinerary site (HTML, CSS, JS). No build step.

## Run locally

```bash
cd spain-itinerary
python3 -m http.server 4173
```

Open http://localhost:4173

## Deploy on Netlify (GitHub)

### 1. Create a GitHub repo

From this folder:

```bash
git init
git add .
git commit -m "Initial Spain itinerary site"
gh repo create spain-itinerary --public --source=. --remote=origin --push
```

If you do not use the GitHub CLI, create an empty repo on github.com, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/spain-itinerary.git
git branch -M main
git push -u origin main
```

### 2. Connect Netlify

1. Sign in at [https://app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project** → **GitHub**
3. Authorize Netlify and select the `spain-itinerary` repository
4. Build settings (should match `netlify.toml`):
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
5. **Deploy site**

Netlify will deploy on every push to `main`.

### 3. Custom domain (optional)

In Netlify: **Site configuration** → **Domain management** → add your domain and follow DNS instructions.
