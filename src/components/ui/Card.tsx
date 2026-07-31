import React from 'react';
import type { BaseComponentProps } from '../../types/ui';

export interface CardProps extends BaseComponentProps {
  hoverable?: boolean;
  glass?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glass = true,
  header,
  footer,
  className = '',
  onClick,
}) => {
  const glassStyle = glass
    ? 'glass-card'
    : 'bg-slate-900 border border-slate-800 shadow-xl';

  const hoverStyle = hoverable ? 'glass-card-hover cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden p-5 transition-all duration-200 ${glassStyle} ${hoverStyle} ${className}`}
    >
      {header && <div className="border-b border-slate-800/80 pb-4 mb-4">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="border-t border-slate-800/80 pt-4 mt-4">{footer}</div>}
    </div>
  );
};
