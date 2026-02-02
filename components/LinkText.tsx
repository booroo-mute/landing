interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
}

export default function LinkText({ href, children, className = '', underline = true }: LinkTextProps) {
  return (
    <a
      href={href}
      className={`body-text text-text-secondary hover:text-accent transition-colors ${underline ? 'underline decoration-dashed underline-offset-8' : ''} ${className}`}
    >
      {children}
    </a>
  );
}
