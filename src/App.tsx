import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { LoginPage } from '@/pages/LoginPage'
import { BoardsPage } from '@/pages/BoardsPage'
import { BoardDetailPage } from '@/pages/BoardDetailPage'

function PrivateRoute({ session, children }: { session: Session | null; children: React.ReactNode }) {
  if (!session) return <Navigate to="/" replace />
  return <>{children}</>
}

function PublicRoute({ session, children }: { session: Session | null; children: React.ReactNode }) {
  if (session) return <Navigate to="/boards" replace />
  return <>{children}</>
}

export function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute session={session}>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/boards"
          element={
            <PrivateRoute session={session}>
              <BoardsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/boards/:id"
          element={
            <PrivateRoute session={session}>
              <BoardDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
