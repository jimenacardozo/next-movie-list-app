import { NextRequest, NextResponse } from "next/server"
import { RegisterSchema } from "@/src/lib/validations/auth"
import { register } from "@/src/services/auth.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    await register(parsed.data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
