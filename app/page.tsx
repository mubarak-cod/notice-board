import NoticeBoardNav from "@/components/Noticeboardnav";
import Hero from "@/components/Hero";
import Notices from "@/components/Notices";
import HowItWorks from "@/components/HowItWorks";
import WhyDigital from "@/components/Whydigital";
import SubscribeSection from "@/components/Subscribesection";
import SiteFooter from "@/components/Sitefooter";

export default function Home() {
  return (
    <div>
      <NoticeBoardNav />
      <Hero />
      <Notices />
      <HowItWorks />
      <WhyDigital />
      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}