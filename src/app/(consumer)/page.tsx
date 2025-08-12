import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookIcon, BrainIcon, ChartBarIncreasing } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: BookIcon,
    title: "Comprehensive & Diverse Courses",
    description:
      "Explore a wide range of engaging topics. Each course is neatly organized into chapters and lessons.",
  },
  {
    icon: BrainIcon,
    title: "Flexible Learning",
    description:
      "Enjoy the freedom to learn anytime, anywhere. Access video lectures, written materials, and extra resources at your own pace.",
  },
  {
    icon: ChartBarIncreasing,
    title: "Track Your Learning Journey",
    description:
      "Monitor your progress in real-time and pick up right where you left off without any hassle.",
  },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center mt-32">
      <div>
        <div className="space-y-16">
          <div className="flex flex-col gap-y-10 text-center">
            <h1 className="text-5xl font-bold">
              Enhance Your Learning Experience
            </h1>
            <p className="max-w-2xl mx-auto text-pretty text-muted-foreground">
              Discover a new way to learn through a modern and interactive
              learning system. Access high-quality materials anytime, anywhere.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-2 2xl:px-10">
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
