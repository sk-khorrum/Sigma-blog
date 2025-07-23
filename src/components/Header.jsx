import { useState } from 'react'
import { Menu, X, Search, Globe, User, LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GoogleTranslate from './GoogleTranslate'

const Header = ({ onLoginClick, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showTranslate, setShowTranslate] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Smart Blog</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Categories</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Authors</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTranslate(!showTranslate)}
              >
                <Globe className="h-4 w-4" />
              </Button>
              {showTranslate && (
                <div className="absolute top-full right-0 mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 min-w-[250px]">
                  <GoogleTranslate />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTranslate(false)}
                    className="mt-2 w-full"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"} 
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{currentUser.name}</span>
                <Button onClick={onLogout} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick} size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">Home</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">Categories</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">Authors</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">About</a>
              <div className="flex items-center space-x-2 px-3 py-2">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
                {!currentUser && (
                  <Button onClick={onLoginClick} size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

