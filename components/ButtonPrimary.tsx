import Image from "next/image";

interface ButtonPrimaryProps {
  icon?: string;
  children: React.ReactNode;
}

export default function ButtonPrimary({ icon, children }: ButtonPrimaryProps) {
  return (
    <button className="w-fit px-[48px] py-[12px] bg-transparent border border-accent text-accent text-[17px] leading-[24px] font-medium hover:bg-accent/10 transition-colors flex items-center gap-[8px]">
      {icon && <Image src={icon} alt="" width={20} height={20} />}
      {children}
    </button>
  );
}
