import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  console.log("[proxy] path:", req.nextUrl.pathname, "| auth:", !!req.auth?.user)
})

export const config = {
  matcher: ["/((?!login|api/auth|_next|favicon).*)"],
}
