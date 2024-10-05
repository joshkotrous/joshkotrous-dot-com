import HeroBanner from "./components/heroBanner";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center h-screen overflow-hidden p-8">
      <main className="">
        <HeroBanner />
      </main>
    </div>
  );
}
