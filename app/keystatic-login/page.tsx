import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = { title: 'Administration — Connexion' }

export default function KeystaticLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
