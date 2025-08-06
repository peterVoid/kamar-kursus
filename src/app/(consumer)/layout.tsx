import { Navbar } from "@/features/homepage/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-32 mb-20">{children}</div>
    </div>
  );
}
