import { ReactNode } from 'react';

type AlertProps = {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  className?: string;
};

export function Alert({ type = 'info', children, className = '' }: AlertProps) {
  const typeClasses = {
    info: 'bg-blue-950 border-blue-800 text-blue-200',
    success: 'bg-green-950 border-green-800 text-green-200',
    warning: 'bg-yellow-950 border-yellow-800 text-yellow-200',
    error: 'bg-red-950 border-red-800 text-red-200',
  };

  return (
    <div
      className={`border rounded-lg p-4 ${typeClasses[type]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
