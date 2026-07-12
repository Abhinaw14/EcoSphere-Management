import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Glassmorphic Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EcoSphere</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#impact" className="hover:text-primary transition-colors">Live Impact</a>
            <a href="#mission" className="hover:text-primary transition-colors">Our Mission</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button className="gradient-primary border-0 rounded-full group">
                Enter Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">EcoSphere</span>
          </div>
          <p>© {new Date().getFullYear()} EcoSphere Environmental Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
