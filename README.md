# TaskFlow Kanban Board

React and Express kanban board with email and real OAuth sign-in for Google, GitHub, and Microsoft.

## Run locally

Install and start the frontend:

```bash
npm install
npm run dev
```

In another terminal, start the API:

```bash
cd server
npm install
npm run dev
```

The default frontend URL is `http://localhost:5173` and the API URL is `http://localhost:5000`.

## Configure social sign-in

1. Copy `server/.env.example` to `server/.env`.
2. Register a web OAuth application with each provider you want to offer.
3. Copy each client ID and client secret into `server/.env`. Keep secrets out of the root Vite `.env`; browser environment variables are public.
4. Add the exact redirect URL for every provider you enable:

   - Google: `http://localhost:5000/api/auth/google/callback`
   - GitHub: `http://localhost:5000/api/auth/github/callback`
   - Microsoft: `http://localhost:5000/api/auth/microsoft/callback`

For a deployed app, set `CLIENT_URL` to the public frontend origin and `OAUTH_CALLBACK_BASE_URL` to the public HTTPS API origin, then register the matching HTTPS callback URLs.

Provider setup references:

- [Google OAuth web server flow](https://developers.google.com/identity/protocols/oauth2/web-server)
- [GitHub OAuth app web flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Microsoft authorization-code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)

After setup, selecting a social button sends the user to that provider's official authorization screen. No social password is requested or stored by TaskFlow. Once the provider confirms the account, TaskFlow uses its returned account name as the app username. GitHub uses the GitHub login; Google and Microsoft use the profile/display name their account returns.

## Social auth behavior

The server uses OAuth authorization-code exchange, PKCE, a short-lived state cookie, and a one-time code back to the browser. Provider access tokens and client secrets never reach the React app.

This project keeps tasks and OAuth handoff data in memory. Run a single API instance while developing; for multi-instance production deployment, move the short-lived OAuth state and application accounts to shared persistent storage.
