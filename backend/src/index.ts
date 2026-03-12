import 'dotenv/config'
import { Hono } from "hono";
import { D1Database } from "../types/d1";
import { initAuthConfig, authHandler, verifyAuth } from '@hono/auth-js';
import Google from '@auth/core/providers/google'
import { HTTPException } from 'hono/http-exception'


// ★D1 データベースの型定義
type CloudflareBindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: [
      Google,
    ],
  }))
)

app.use('/api/auth/*', authHandler())

app.use('*', verifyAuth())

app.get("/", (c) => {
  // ★env.DB で D1 にアクセス可能
  const db = c.env.DB;
  return c.text("Hello Hono!");
});

app.get('/events', async (c) => {
  try {
    // D1 から全てのアイテムを取得
    const { results } = await c.env.DB.prepare('SELECT * FROM events').all();
    return c.json(results); // 取得したデータをJSONで返す
  } catch (error) {
    // エラーハンドリングはonErrorミドルウェアが捕捉するが、個別のログ出力なども可能
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