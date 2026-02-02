import Image from "next/image";
import Link from "next/link";

interface ButtonPrimaryProps {
  icon?: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
}

export default function ButtonPrimary({ icon, children, href, target }: ButtonPrimaryProps) {
  const className = "w-full lg:w-fit px-6 md:px-8 lg:px-[48px] py-3 md:py-[12px] bg-accent text-background-primary text-[15px] md:text-[16px] lg:text-[17px] leading-[22px] md:leading-[24px] font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 md:gap-[8px]";

  const content = (
    <>
      {icon && <Image src={icon} alt="" width={20} height={20} className="w-4 h-4 md:w-5 md:h-5" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className}>
      {content}
    </button>
  );
}
