# Social Media OAuth Setup Guide

Your application is configured with an end-to-end OAuth authentication flow for **Google**, **GitHub**, and **Microsoft**.

When you click on any provider button on the login page:
1. It redirects to the official login page (`accounts.google.com`, `github.com/login`, or `login.microsoftonline.com`).
2. After authentication, the provider redirects back to your server.
3. The server exchanges the authorization code for the user profile, retrieves the social media username and details, and returns them to your dashboard.

---

## Setting up OAuth Credentials

Add the Client ID and Client Secret to your `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
MICROSOFT_TENANT_ID=common

CLIENT_URL=http://localhost:5173
OAUTH_CALLBACK_BASE_URL=http://localhost:5000
```

---

## 1. Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and navigate to **APIs & Services** > **Credentials**.
3. Click **Create Credentials** > **OAuth client ID** (Application type: *Web application*).
4. Set **Authorized redirect URIs** to:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
5. Copy your **Client ID** and **Client Secret** into `.env`.

---

## 2. GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers) > **OAuth Apps**.
2. Click **New OAuth App**.
3. Set **Homepage URL** to `http://localhost:5173`.
4. Set **Authorization callback URL** to:
   ```
   http://localhost:5000/api/auth/github/callback
   ```
5. Copy the **Client ID** and generate a **Client Secret**, then add them to `.env`.

---

## 3. Microsoft OAuth Setup
1. Go to the [Azure Portal App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
2. Click **New registration**.
3. Under **Supported account types**, select: *Accounts in any organizational directory and personal Microsoft accounts*.
4. Under **Redirect URI (Web)**, enter:
   ```
   http://localhost:5000/api/auth/microsoft/callback
   ```
5. Navigate to **Certificates & secrets** to create a new client secret.
6. Copy the **Application (client) ID** and the **Client secret Value** into `.env`.

---

## Running the App

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
