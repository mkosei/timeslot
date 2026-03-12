import { Hono } from "hono";
import { initAuthConfig, authHandler, verifyAuth } from '@hono/auth-js';
import Google from '@auth/core/providers/google'
import { HTTPException } from 'hono/http-exception'
import { cors } from "hono/cors"


// ★D1 データベースの型定義
type CloudflareBindings = {
  DB: D1Database;
  AUTH_SECRET: string
  AUTH_GOOGLE_ID: string
  AUTH_GOOGLE_SECRET: string
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    rustHost: true,
    providers: [
      Google({
        clientId: c.env.AUTH_GOOGLE_ID,
        clientSecret: c.env.AUTH_GOOGLE_SECRET,
      }),
    ],
  }))
)

app.use('/api/auth/*', authHandler())

app.use('*', verifyAuth())

app.get('/events', async (c) => {
  try {
    const auth = c.get("authUser")
    const userId = auth?.token?.sub

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const { results } = await c.env.DB
      .prepare("SELECT * FROM events WHERE user_id = ?")
      .bind(userId)
      .all()
    return c.json(results);
  } catch (error) {

    throw error; // onErrorミドルウェアに処理を委譲
  }
});

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException && err.status === 401) {
    return c.redirect('/api/auth/signin');
  }
  return c.json({ message: "Internal Server Error", error: err.message }, 500);
});

export default app;