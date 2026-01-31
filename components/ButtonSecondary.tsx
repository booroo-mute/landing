import Image from "next/image";

interface ButtonSecondaryProps {
  icon?: string;
  children: React.ReactNode;
}

export default function ButtonSecondary({ icon, children }: ButtonSecondaryProps) {
  return (
    <button className="w-full lg:w-fit px-6 md:px-8 lg:px-[48px] py-3 md:py-[12px] bg-transparent border border-[#494B4A] text-text-primary text-[15px] md:text-[16px] lg:text-[17px] leading-[22px] md:leading-[24px] font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2 md:gap-[8px]">
      {icon && <Image src={icon} alt="" width={20} height={20} className="w-4 h-4 md:w-5 md:h-5" />}
      {children}
    </button>
  );
}
