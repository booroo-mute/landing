interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
  target?: string;
}

export default function LinkText({ href, children, className = '', underline = true, target }: LinkTextProps) {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`body-text text-text-secondary hover:text-accent transition-colors ${underline ? 'underline decoration-dashed underline-offset-8' : ''} ${className}`}
    >
      {children}
    </a>
  );
}
