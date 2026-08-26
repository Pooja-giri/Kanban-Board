import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "kanban_super_secret_jwt_key_2026";
const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");

/**
 * Route 1: Send user to Google's login page
 * GET /api/auth/google
 */
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    // If credentials are not set, redirect to client auth-success in demo mode
    return res.redirect(`${CLIENT_URL}/auth-success?provider=Google&demo=true`);
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
});

/**
 * Route 2: Handle Google's callback response
 * GET /api/auth/google/callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?auth_error=Google%20sign-in%20cancelled%20or%20failed`,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        username: user.username || user.name,
        avatar: user.avatar,
        provider: "Google",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userParam = encodeURIComponent(
      JSON.stringify({
        name: user.name,
        username: user.username || user.name,
        email: user.email,
        avatar: user.avatar,
        provider: "Google",
      })
    );

    res.redirect(`${CLIENT_URL}/auth-success?token=${token}&user=${userParam}`);
  }
);

/**
 * Route 3: Send user to GitHub's login page
 * GET /api/auth/github
 */
router.get("/github", (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.redirect(`${CLIENT_URL}/auth-success?provider=GitHub&demo=true`);
  }

  passport.authenticate("github", {
    scope: ["user:email", "read:user"],
  })(req, res, next);
});

/**
 * Route 4: Handle GitHub's callback response
 * GET /api/auth/github/callback
 */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?auth_error=GitHub%20sign-in%20cancelled%20or%20failed`,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        username: user.username || user.name,
        avatar: user.avatar,
        provider: "GitHub",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userParam = encodeURIComponent(
      JSON.stringify({
        name: user.name,
        username: user.username || user.name,
        email: user.email,
        avatar: user.avatar,
        provider: "GitHub",
      })
    );

    res.redirect(`${CLIENT_URL}/auth-success?token=${token}&user=${userParam}`);
  }
);

/**
 * Route 5: Microsoft login
 * GET /api/auth/microsoft
 */
router.get("/microsoft", (req, res) => {
  res.redirect(`${CLIENT_URL}/auth-success?provider=Microsoft&demo=true`);
});

/**
 * Verify JWT token
 * POST /api/auth/verify
 */
router.post("/verify", (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
