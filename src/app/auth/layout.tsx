
export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:flex block items-center justify-center overflow-x-hidden">
      <main className="flex-1 p-[20px] flex min-h-screen flex-col md:flex-row gap-[20px] overflow-x-hidden">
        <section className="h-screen md:h-auto flex-1 hidden md:block overflow-x-hidden">
          <section className="[background:var(--primary-radial)] h-full w-full rounded-[24px] flex flex-col justify-between p-[32px] text-white">
            <p className="font-medium text-[1rem] leading-[140%] text-[#fff]">
              ©2025 One Universe. All Rights Reserved
            </p>
            <div className="flex flex-col gap-[16px]">
              <h3 className="text-[1.625rem] font-medium leading-[120%] text-[#fff]">
                Stay in control of services, users, payments, and performance
              </h3>
              <h2 className="text-[#B9F1E6] text-[2.125rem] font-semibold leading-[120%]">
                all in one place
              </h2>
            </div>
          </section>
        </section>

        <section className="flex-1">{children}</section>
      </main>
    </div>
  );
}
