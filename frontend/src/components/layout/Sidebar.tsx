// ============================================================
// EcoSphere — Sidebar Navigation Component
// Collapsible sidebar with role-based menu items
// ============================================================

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Tags,
  Leaf,
  Users,
  Shield,
  Trophy,
  Gift,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TreePine,
  Medal,
  Target,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import { ROUTES } from '@/constants/routes';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
  children?: { title: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Departments',
    href: ROUTES.DEPARTMENTS,
    icon: Building2,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Categories',
    href: ROUTES.CATEGORIES,
    icon: Tags,
    roles: [Role.ADMIN],
  },
  {
    title: 'Environmental',
    href: ROUTES.ENVIRONMENTAL,
    icon: Leaf,
    children: [
      { title: 'Overview', href: ROUTES.ENVIRONMENTAL },
      { title: 'Interactive Map', href: '/environmental/map', icon: Globe },
      { title: 'Emission Factors', href: ROUTES.EMISSION_FACTORS },
      { title: 'Product Profiles', href: ROUTES.PRODUCT_PROFILES },
      { title: 'Goals', href: ROUTES.ENVIRONMENTAL_GOALS },
      { title: 'Carbon Transactions', href: ROUTES.CARBON_TRANSACTIONS },
    ],
  },
  {
    title: 'Social',
    href: ROUTES.SOCIAL,
    icon: Users,
    children: [
      { title: 'Overview', href: ROUTES.SOCIAL },
      { title: 'CSR Activities', href: ROUTES.CSR_ACTIVITIES },
      { title: 'Participations', href: ROUTES.PARTICIPATIONS },
    ],
  },
  {
    title: 'Governance',
    href: ROUTES.GOVERNANCE,
    icon: Shield,
    children: [
      { title: 'Overview', href: ROUTES.GOVERNANCE },
      { title: 'Policies', href: ROUTES.POLICIES },
      { title: 'Audits', href: ROUTES.AUDITS },
      { title: 'Compliance', href: ROUTES.COMPLIANCE },
    ],
  },
  {
    title: 'Gamification',
    href: ROUTES.GAMIFICATION,
    icon: Trophy,
    children: [
      { title: 'Leaderboard', href: ROUTES.LEADERBOARD, icon: Trophy },
      { title: 'Virtual Forest', href: '/gamification/forest', icon: TreePine },
      { title: 'Badges', href: ROUTES.BADGES, icon: Medal },
      { title: 'Challenges', href: ROUTES.CHALLENGES, icon: Target },
    ],
  },
  {
    title: 'Rewards',
    href: ROUTES.REWARDS,
    icon: Gift,
  },
  {
    title: 'Reports',
    href: ROUTES.REPORTS,
    icon: FileText,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: 'Notifications',
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const filteredNav = navigation.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold text-foreground overflow-hidden whitespace-nowrap"
            >
              EcoSphere
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            item.children?.some((c) => location.pathname === c.href);
          const isExpanded = expandedItems.includes(item.title);

          if (item.children && !collapsed) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={({ isActive }) =>
                              cn(
                                'block rounded-md px-3 py-2 text-sm transition-colors duration-150',
                                isActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                              )
                            }
                          >
                            {child.title}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <NavLink
              key={item.title}
              to={item.href || '#'}
              title={collapsed ? item.title : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
