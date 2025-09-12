import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import CardSearchSection from "@/components/CardSearchSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header currentPage="home" />
      <HeroSection />
      <CardSearchSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;