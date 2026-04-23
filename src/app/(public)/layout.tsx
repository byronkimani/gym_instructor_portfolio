import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-marketing flex min-h-screen flex-col bg-surface text-text-primary">
      <Navbar />
      <main className="flex-grow pt-[4.5rem] md:pt-20">{/* clears fixed navbar */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
