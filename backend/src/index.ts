import { Hono } from "hono";
import { initAuthConfig, authHandler } from '@hono/auth-js';
import Google from '@auth/core/providers/google'
import { HTTPException } from 'hono/http-exception'
import { cors } from "hono/cors"
import bookingsRoute from "./routes/bookings"

// ★D1 データベースの型定義
type CloudflareBindings = {
  DB: D1Database;
  AUTH_SECRET: string
  AUTH_GOOGLE_ID: string
  AUTH_GOOGLE_SECRET: string
  APP_URL: string 
};

export const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", (c, next) => {
  return cors({
    origin: c.env.APP_URL,
    credentials: true,
  })(c, next)
})

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    trustHost: true,
    basePath: '/api/auth',
    providers: [
      Google({
        clientId: c.env.AUTH_GOOGLE_ID,
        clientSecret: c.env.AUTH_GOOGLE_SECRET,
      }),
    ],
    callbacks: {
      jwt({ token, account }) {
        if (account?.providerAccountId) {
          token.sub = `g_${account.providerAccountId}`
        }
        return token
      },
    }
  }))
)

app.use('/api/auth/*', authHandler())

app.get("/", (c) => {
  return c.redirect(c.env.APP_URL + "/schedule")
})

app.route("/api/bookings", bookingsRoute)

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException && err.status === 401) {
    return c.redirect('/api/auth/signin');
  }
  return c.json({ message: "Internal Server Error", error: err.message }, 500);
});

export default app;