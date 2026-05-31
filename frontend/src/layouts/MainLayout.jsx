import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans" role="document">
      <Navbar />
      <main className="flex-1 w-full flex flex-col" role="main" aria-label="Main Content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
