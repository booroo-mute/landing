import Image from "next/image";

interface ButtonSecondaryProps {
  icon?: string;
  children: React.ReactNode;
}

export default function ButtonSecondary({ icon, children }: ButtonSecondaryProps) {
  return (
    <button className="w-fit px-[48px] py-[12px] bg-transparent border border-[#494B4A] text-text-primary text-[17px] leading-[24px] font-medium hover:bg-white/5 transition-colors flex items-center gap-[8px]">
      {icon && <Image src={icon} alt="" width={20} height={20} />}
      {children}
    </button>
  );
}
