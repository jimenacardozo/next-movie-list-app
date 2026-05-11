import LoginForm from "./LoginForm"

const googleConfigured =
  !!process.env.AUTH_GOOGLE_ID && !process.env.AUTH_GOOGLE_ID.startsWith("placeholder") &&
  !!process.env.AUTH_GOOGLE_SECRET && !process.env.AUTH_GOOGLE_SECRET.startsWith("placeholder")

export default function LoginPage() {
  return <LoginForm googleEnabled={googleConfigured} />
}
