import React from 'react';
import type { BaseComponentProps } from '../../../types/ui';

interface SectionHeadingProps extends BaseComponentProps {
  label?: string;
  heading: string;
  description?: string;
  centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  heading,
  description,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {label && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          {label}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;