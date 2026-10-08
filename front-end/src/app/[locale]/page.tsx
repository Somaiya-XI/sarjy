import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HomeHero } from "@/components/sections/HomeHero";


export default async function HomePage({ params }: PageProps<"/[locale]">) {

  return (
    <div className="font-display font-medium tracking-wider min-h-screen">
      <Header />
      <Container className="flex-1">
        <HomeHero />
      </Container>
    </div>
  );
}
