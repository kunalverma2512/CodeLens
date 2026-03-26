import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
