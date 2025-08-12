import { Navbar } from "@/features/homepage/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 mb-20">{children}</div>
    </div>
  );
}
