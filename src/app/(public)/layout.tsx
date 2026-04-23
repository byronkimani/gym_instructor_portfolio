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
      <main className="grow pt-18 md:pt-20">{/* clears fixed navbar */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
