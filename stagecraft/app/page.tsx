import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/motion";
import { ArrowRight, Search, Sparkles, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-20">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 md:py-32">
        <FadeIn className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            New: AI-Powered Costume Search
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 pb-2 font-heading">
            Theatrical rentals.
            <br />
            Reimagined.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The professional marketplace for costumes, props, and equipment. 
            Powered by Gemini AI to help you find exactly what your production needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/marketplace">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-purple-500/20 bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105">
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base backdrop-blur-sm hover:bg-secondary/50 transition-all hover:scale-105 group">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500 group-hover:text-purple-400 transition-colors" />
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Bento Grid Features */}
        <StaggerContainer className="grid md:grid-cols-3 md:grid-rows-2 gap-6 mt-32 max-w-6xl mx-auto h-[800px] md:h-[600px]">
          {/* Large Card */}
          <StaggerItem className="md:col-span-2 md:row-span-2">
            <HoverCard className="h-full">
              <div className="glass-card h-full rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                      <Search className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Semantic Search</h3>
                    <p className="text-muted-foreground text-lg max-w-md">
                      Don&apos;t just keyword search. Describe your character, the era, and the mood. 
                      Our AI understands &quot;1920s gloomy Hamlet&quot; and builds the perfect bundle.
                    </p>
                  </div>
                  <div className="mt-8 rounded-xl bg-black/40 border border-white/10 p-4 backdrop-blur-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p className="font-mono text-sm text-purple-300">
                      &gt; &quot;I need a costume for a cyberpunk mercenary&quot;
                    </p>
                    <p className="font-mono text-sm text-muted-foreground mt-2">
                      Searching inventory... found 12 matches.
                    </p>
                  </div>
                </div>
              </div>
            </HoverCard>
          </StaggerItem>

          {/* Marketplace Card */}
          <StaggerItem>
            <HoverCard className="h-full">
              <div className="glass-card h-full rounded-3xl p-6 relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-3xl rounded-full -mr-10 -mt-10" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
                    <Globe className="w-5 h-5 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Global Marketplace</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with professional theaters and rental houses worldwide.
                  </p>
                </div>
                <Link href="/marketplace" className="flex items-center text-sm font-medium text-rose-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </HoverCard>
          </StaggerItem>

          {/* Gigs Card */}
          <StaggerItem>
            <HoverCard className="h-full">
              <div className="glass-card h-full rounded-3xl p-6 relative overflow-hidden group flex flex-col justify-between">
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full -ml-10 -mb-10" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gigs & Casting</h3>
                  <p className="text-muted-foreground text-sm">
                    Find your next role or hire the perfect crew for your production.
                  </p>
                </div>
                <Link href="/gigs" className="flex items-center text-sm font-medium text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
                  View Gigs <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Footer Info */}
        <div className="mt-32 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>Built for SparkHacks 2026 • Powered by Google Gemini AI</p>
        </div>
      </main>
    </div>
  );
}
