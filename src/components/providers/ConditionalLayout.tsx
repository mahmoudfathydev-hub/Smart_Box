"use client";

import Navbar from "@/components/common/navbar/navbar";
import Footer from "@/components/common/footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
