import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Rocket, Sparkles, ArrowRight, Zap, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { ProductCard } from "../components/ProductCard";
import { useFirebase } from "../contexts/FirebaseContext";

export const Home = () => {
  const { products, getProducts } = useFirebase();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getProducts();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Take the top 6 most boosted products as featured
    const sorted = [...products].sort((a, b) => (b.boost_count || 0) - (a.boost_count || 0));
    setFeaturedProducts(sorted.slice(0, 6));
  }, [products]);
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[150px] animate-pulse delay-700" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              The Stage for AI Native Builders
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
              Where AI Native Builders <br />
              <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Ship Their Soul.
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              VibePort is the ultimate showcase for the next generation of web creators. 
              Post your builds, find inspiration, and join a community that values craft over corporate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/submit">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg group">
                  Post Your Build
                  <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                  Explore Inspiration
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
              <p className="text-zinc-500">Hand-picked gems from the community.</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why VibePort Section */}
      {/* <section className="py-32 px-4 sm:px-6 lg:px-8 border-y border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AI-Powered Showcase</h3>
              <p className="text-zinc-500 leading-relaxed">
                Our platform uses AI to help you polish your story and automatically extract metadata from your links.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Supportive Community</h3>
              <p className="text-zinc-500 leading-relaxed">
                We replace "Likes" with "Boosts". Every interaction is designed to encourage and empower creators.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Maker-First Identity</h3>
              <p className="text-zinc-500 leading-relaxed">
                Your profile is a mini-exhibition of your creative journey, not just a list of features.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};
