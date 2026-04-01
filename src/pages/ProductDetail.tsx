import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { 
  Sparkles, 
  ExternalLink, 
  AppWindow, 
  Heart, 
  Share2, 
  MessageSquare, 
  ArrowLeft,
  Globe,
  User,
  Rocket
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { useFirebase } from "../contexts/FirebaseContext";

export const ProductDetail = () => {
  const { id } = useParams();
  const { getProduct, boostProduct } = useFirebase();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [boosted, setBoosted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProduct(id);
        setProduct(data);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBoost = async () => {
    if (!product || boosted) return;
    setBoosted(true);
    await boostProduct(product.id, product.boost_count);
    setProduct({ ...product, boost_count: product.boost_count + 1 });
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500">Loading product exhibition...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
        <Link to="/explore">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img
                src={product.cover_image_url || `https://picsum.photos/seed/${encodeURIComponent(product.id)}/1200/600`}
                alt={product.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${encodeURIComponent(product.name)}/1200/600`;
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <Badge key={tag} variant="violet" className="px-3 py-1 text-xs">{tag}</Badge>
              ))}
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{product.name}</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">{product.tagline}</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              The Idea Story
            </h2>
            <Card className="p-8 bg-zinc-900/30 border-violet-500/10">
              <p className="text-lg text-zinc-300 leading-relaxed italic">
                "{product.idea_story}"
              </p>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">What it does</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <Card className="p-6 sticky top-24">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Sparkles className="h-6 w-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{product.boost_count}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Boosts</p>
                  </div>
                </div>
                <Button 
                  onClick={handleBoost}
                  variant={boosted ? "primary" : "outline"}
                  className={cn("h-12 px-6 gap-2", boosted && "bg-violet-600")}
                >
                  <Rocket className={cn("h-5 w-5", boosted && "fill-white")} />
                  {boosted ? "Boosted!" : "Boost Build"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="w-full gap-2">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="secondary" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-800">
                <a href={product.website_url} target="_blank" rel="noreferrer" className="block">
                  <Button className="w-full h-12 gap-2 bg-white text-black hover:bg-zinc-200">
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </Button>
                </a>
                {product.app_store_url && (
                  <a href={product.app_store_url} target="_blank" rel="noreferrer" className="block">
                    <Button variant="secondary" className="w-full h-12 gap-2">
                      <AppWindow className="h-4 w-4" />
                      App Store
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">The Maker</h3>
            <div className="flex items-center gap-4 mb-4">
              {product.maker_avatar ? (
                <img src={product.maker_avatar} className="h-12 w-12 rounded-full border border-zinc-800" alt={product.maker_name} />
              ) : (
                <div className="h-12 w-12 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                  <User className="h-6 w-6 text-zinc-600" />
                </div>
              )}
              <div>
                <p className="font-bold text-white">{product.maker_name || "Anonymous Maker"}</p>
                <p className="text-xs text-zinc-500">@{product.maker_username || "maker"}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {product.maker_bio || "This maker is busy building the future."}
            </p>
            <Link to={`/maker/${product.user_id}`}>
              <Button variant="outline" size="sm" className="w-full">View Profile</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
