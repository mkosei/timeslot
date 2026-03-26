import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { ensureUser } from "@/app/lib/ensureUser"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
    if (account?.providerAccountId && user) {
        const session = {
        user: {
            id: `g_${account.providerAccountId}`,
            name: user.name ?? "",
            email: user.email ?? "",
        },
        expires: ""
        }
        await ensureUser(session)
    }
    return true
    },
    jwt({ token, account }) {
      if (account?.providerAccountId) {
        token.sub = `g_${account.providerAccountId}`
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub!
      return session
    }
  }
})