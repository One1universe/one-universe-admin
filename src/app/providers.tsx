"use client";

import ReactQueryProvider from "@/react-query/providers";
import Toast from "@/shared/Toast/Toast";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toast />
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </SessionProvider>
  );
}
