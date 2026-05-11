"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [tab, setTab] = useState<"signin" | "register">("signin")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    })
    if (result?.error) {
      setError("Invalid email or password")
    } else {
      window.location.href = "/"
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Registration failed")
      return
    }
    await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirectTo: "/",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-[#111113] rounded-xl p-8 shadow-xl">
        <h1 className="text-white text-2xl font-semibold mb-6 text-center">CineVault</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-white/10">
          <button
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "signin" ? "text-white border-b-2 border-white" : "text-white/40"}`}
            onClick={() => { setTab("signin"); setError(null) }}
          >
            Sign in
          </button>
          <button
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${tab === "register" ? "text-white border-b-2 border-white" : "text-white/40"}`}
            onClick={() => { setTab("register"); setError(null) }}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {tab === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <input name="email" type="email" placeholder="Email" required className="w-full bg-[#1c1c1f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-white/30" />
            <input name="password" type="password" placeholder="Password" required className="w-full bg-[#1c1c1f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-white/30" />
            <button type="submit" className="w-full bg-white text-black font-medium rounded-lg py-2.5 text-sm hover:bg-white/90 transition-colors">
              Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input name="name" type="text" placeholder="Name" required className="w-full bg-[#1c1c1f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-white/30" />
            <input name="email" type="email" placeholder="Email" required className="w-full bg-[#1c1c1f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-white/30" />
            <input name="password" type="password" placeholder="Password" required className="w-full bg-[#1c1c1f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-white/30" />
            <button type="submit" className="w-full bg-white text-black font-medium rounded-lg py-2.5 text-sm hover:bg-white/90 transition-colors">
              Register
            </button>
          </form>
        )}

        {googleEnabled && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1c1c1f] text-white border border-white/10 rounded-lg py-2.5 text-sm hover:bg-[#252528] transition-colors"
            >
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  )
}
