import { ChartAreaInteractive } from "@/features/admin/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/features/admin/components/sidebar/section-cards";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
