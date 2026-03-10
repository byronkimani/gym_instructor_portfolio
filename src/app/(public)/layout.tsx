import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20"> {/* pt-20 to clear the fixed 80px h-20 Navbar */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
