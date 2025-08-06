import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookIcon,
  BrainIcon,
  ChartBarIncreasing,
  HandshakeIcon,
} from "lucide-react";
import Link from "next/link";

export const FEATURES = [
  {
    icon: BookIcon,
    title: "Kursus Lengkap & Bervariasi",
    description:
      "Pelajari berbagai topik menarik dari instruktur pilihan. Setiap kursus terdiri dari chapter dan lesson yang tersusun rapi.",
  },
  {
    icon: BrainIcon,
    title: "Belajar Fleksibel",
    description:
      "Nikmati pengalaman belajar yang bisa diakses kapan saja. Mulai dari video pembelajaran, materi tertulis, hingga bonus tambahan.",
  },
  {
    icon: ChartBarIncreasing,
    title: "Lacak Perjalanan Belajarmu",
    description:
      "Pantau kemajuanmu secara real-time dan lanjutkan belajar dari titik terakhir tanpa ribet.",
  },
  {
    icon: HandshakeIcon,
    title: "Komunitas Pembelajar",
    description:
      "Terhubung dengan pembuat kursus dan peserta lainnya untuk berdiskusi, bertukar ide, dan saling menginspirasi.",
  },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div>
        <div className="space-y-16">
          <div className="flex flex-col gap-y-10 text-center">
            <h1 className="text-5xl font-bold">
              Tingkatkan Pengalaman Belajar Anda
            </h1>
            <p className="max-w-2xl mx-auto text-pretty text-muted-foreground">
              Temukan cara baru untuk belajar melalui sistem pembelajaran modern
              dan interaktif. Akses materi berkualitas tinggi di mana saja,
              kapan saja.
            </p>
          </div>
          <div className="flex items-center gap-x-2 w-full mx-auto  justify-center">
            <Link href="/courses" className={buttonVariants()}>
              Lihat Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "secondary",
              })}
            >
              Login
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 xl:px-0">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle>{<feature.icon />}</CardTitle>
                  <CardDescription className="font-semibold">
                    {feature.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">
                    {feature.description}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
