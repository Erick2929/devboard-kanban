import { LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  onLogout: () => void
}

export function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b bg-background"
      data-testid="app-header"
    >
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">DevBoard</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        data-testid="logout-button"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </header>
  )
}
