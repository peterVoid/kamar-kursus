"use client";

import * as React from "react";

import { SidebarGroup } from "@/components/ui/sidebar";

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return <SidebarGroup {...props}></SidebarGroup>;
}
