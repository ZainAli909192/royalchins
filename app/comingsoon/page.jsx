export default function ComingSoonPage() {
  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-black">
      {/* Desktop */}
      <div
        className="hidden h-full w-full bg-cover bg-center bg-no-repeat lg:block"
        style={{
          backgroundImage: "url('/comingsoon.svg')",
        }}
      />

      {/* Mobile + Tablet */}
      <div
        className="block h-full w-full bg-no-repeat lg:hidden"
        style={{
          backgroundImage: "url('/mobile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
    </main>
  );
}