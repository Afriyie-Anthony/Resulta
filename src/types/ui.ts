import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  badgeColor?: BadgeVariant;
  children?: NavItem[];
}

export type LayoutMode = 'customer' | 'affiliate' | 'admin';
