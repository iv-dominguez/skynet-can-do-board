# Deploying SkyNet Can Do Board to GitHub Pages

This guide walks you through deploying the app as a live PWA on GitHub Pages.

## Prerequisites

- A [GitHub account](https://github.com)
- [Git](https://git-scm.com) installed on your computer
- The project files on your local machine

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name the repository `skynet-can-do-board` (or your preferred name)
3. Set it to **Public** (required for free GitHub Pages)
4. Do **not** initialize with a README (we already have one)
5. Click **Create repository**

## Step 2: Initialize Git and Push

Open a terminal in your project directory and run:

```bash
git init
git add .
git commit -m "Initial commit: SkyNet Can Do Board PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skynet-can-do-board.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. In the left sidebar, click **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Select the **main** branch and **/ (root)** folder
6. Click **Save**

GitHub will begin building your site. It typically takes 1-2 minutes.

## Step 4: Access Your Site

Your site will be available at:

```
https://YOUR_USERNAME.github.io/skynet-can-do-board/
```

## Step 5: Update PWA Paths (Important!)

Since GitHub Pages serves from a subdirectory (`/skynet-can-do-board/`), you need to update a few paths:

### In `manifest.json`:
Change `start_url` and `scope`:
```json
{
  "start_url": "/skynet-can-do-board/",
  "scope": "/skynet-can-do-board/"
}
```

Update shortcut URLs:
```json
"url": "/skynet-can-do-board/?addDraft=New+Task"
```

### In `index.html`:
Update the manifest link, icon references, and service worker registration path to use the subdirectory prefix.

### In `sw.js`:
Update the `CORE_ASSETS` array:
```javascript
const CORE_ASSETS = [
  '/skynet-can-do-board/',
  '/skynet-can-do-board/index.html',
  '/skynet-can-do-board/manifest.json',
  '/skynet-can-do-board/icons/icon-192x192.png',
  '/skynet-can-do-board/icons/icon-512x512.png'
];
```

**Tip:** If you use a custom domain, you can skip the subdirectory prefix and use root paths (`/`).

## Step 6: Custom Domain (Optional)

To use a custom domain like `candoboard.com`:

1. In repository **Settings > Pages**, enter your custom domain
2. Add a `CNAME` file to your repository root containing your domain:
   ```
   candoboard.com
   ```
3. Configure DNS at your domain registrar:
   - For apex domain: Add A records pointing to GitHub's IPs
   - For subdomain: Add a CNAME record pointing to `YOUR_USERNAME.github.io`

See [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for current IP addresses.

## Step 7: Verify PWA Installation

After deployment:

1. Visit your site in Chrome on desktop or mobile
2. You should see an "Install" prompt or the install icon in the address bar
3. On iOS Safari, tap the Share button and select "Add to Home Screen"
4. The app icon should appear on your home screen with the SkyNet branding

## Step 8: Update Siri Shortcuts

Update your iOS Shortcuts to use your live URL:

```
https://YOUR_USERNAME.github.io/skynet-can-do-board/?addDraft=[Input]
https://YOUR_USERNAME.github.io/skynet-can-do-board/?addTodo=[Input]
```

## Updating the App

After making changes locally:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild and deploy within 1-2 minutes.

## Troubleshooting

**Site shows 404:** Make sure GitHub Pages is enabled and pointing to the correct branch. Check that `index.html` exists in the root.

**PWA won't install:** Verify the manifest link in your HTML is correct, the service worker is registering, and you're accessing via HTTPS.

**Service worker not updating:** Increment the cache version in `sw.js` (e.g., change `skynet-static-v1` to `skynet-static-v2`). Users may need to hard-refresh.

**Siri Shortcuts not working:** Ensure URLs are properly encoded. Test by pasting the URL directly in Safari first.

**Offline mode not working:** Open DevTools > Application > Service Workers and verify the service worker is active. Check the Cache Storage section for cached assets.
