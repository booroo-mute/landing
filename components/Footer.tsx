import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-primary border-t border-[#1F1F1F] py-8">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={103} height={27} />
        </Link>
        <span className="text-text-secondary text-sm">
          © {new Date().getFullYear()} Все права защищены
        </span>
      </div>
    </footer>
  );
}
