import { auth } from "@/app/auth"
import { NextRequest } from "next/server"
import { HONO_API_URL, INTERNAL_SECRET } from "@/app/lib/config"

console.log('INTERNAL_SECRET:', INTERNAL_SECRET)

// 認証不要なパスのパターン
const PUBLIC_PATHS = [
  /^\/api\/bookings\/[^/]+$/,  // GET /:slug, POST /:slug
]

function isPublicPath(method: string, path: string) {
  return PUBLIC_PATHS.some(pattern => pattern.test(path)) && 
    (method === 'GET' || method === 'POST')
}

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/proxy', '')
  const search = req.nextUrl.search
  const isPublic = isPublicPath(req.method, path)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-internal-secret': INTERNAL_SECRET,
  }

  if (!isPublic) {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session?.user
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    headers['x-user-id'] = user.id ?? ''
    headers['x-user-name'] = encodeURIComponent(user.name ?? '')
    headers['x-user-email'] = user.email ?? ''
  }

  const res = await fetch(`${HONO_API_URL}${path}${search}`, {
    method: req.method,
    headers,
    body: req.method !== 'GET' ? req.body : undefined,
    // @ts-ignore
    duplex: 'half',
  })

  return new Response(res.body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler