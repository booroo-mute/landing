import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 bg-background-primary z-50">
      <div className="container h-[104px] flex items-center">
        <Image src="/logo.svg" alt="Logo" width={103} height={27} />
      </div>
    </header>
  );
}
