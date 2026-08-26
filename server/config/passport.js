import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

// Google OAuth Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID || "dummy_google_client_id";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "dummy_google_client_secret";
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || profile.name?.givenName || "Google User",
            username: profile.emails?.[0]?.value?.split("@")[0] || profile.displayName || "GoogleUser",
            email: profile.emails?.[0]?.value || `${profile.id}@gmail.com`,
            avatar: profile.photos?.[0]?.value || null,
            provider: "Google",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
const githubClientId = process.env.GITHUB_CLIENT_ID || "dummy_github_client_id";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || "dummy_github_client_secret";
const githubCallbackUrl =
  process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback";

passport.use(
  new GitHubStrategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: githubCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          githubId: profile.id,
        });

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username || "GitHub User",
            username: profile.username || "GitHubUser",
            email: profile.emails?.[0]?.value || `${profile.username}@users.noreply.github.com`,
            avatar: profile.photos?.[0]?.value || null,
            provider: "GitHub",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
