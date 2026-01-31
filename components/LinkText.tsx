interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function LinkText({ href, children, className = '' }: LinkTextProps) {
  return (
    <a
      href={href}
      className={`body-text text-text-secondary underline decoration-dashed underline-offset-8 hover:text-accent transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
