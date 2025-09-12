import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import logo from '@/assets/logo.png'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Atualizar activeTab quando defaultTab mudar
  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const handleLoginSuccess = () => {
    onClose()
  }

  const handleRegisterSuccess = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <img 
              src={logo} 
              alt="Pokédex" 
              className="w-12 h-12"
            />
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              Pokédex
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cadastrar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          </TabsContent>
          
          <TabsContent value="register" className="mt-6">
            <RegisterForm 
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
