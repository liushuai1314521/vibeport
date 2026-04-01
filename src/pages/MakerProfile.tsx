import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { 
  Globe, 
  Twitter, 
  Github, 
  MapPin, 
  Calendar, 
  ArrowLeft,
  User,
  Rocket,
  Sparkles
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProductCard } from "../components/ProductCard";
import { useFirebase } from "../contexts/FirebaseContext";
import { formatDate } from "../lib/utils";

export const MakerProfile = () => {
  const { id } = useParams();
  const { getMakerProfile, getMakerProducts } = useFirebase();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMakerData = async () => {
      if (id) {
        const [profileData, productsData] = await Promise.all([
          getMakerProfile(id),
          getMakerProducts(id)
        ]);
        setProfile(profileData);
        setProducts(productsData);
        setLoading(false);
      }
    };
    fetchMakerData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500">Loading maker profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Maker not found</h2>
        <Link to="/explore">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar: Profile Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative mb-6">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} className="h-32 w-32 rounded-3xl border-2 border-zinc-800 shadow-2xl" alt={profile.name} />
              ) : (
                <div className="h-32 w-32 rounded-3xl border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center shadow-2xl">
                  <User className="h-12 w-12 text-zinc-700" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center border-2 border-zinc-950">
                <Rocket className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
            <p className="text-zinc-500 mb-4">@{profile.username || "maker"}</p>
            
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {profile.bio || "This maker is busy building the future."}
            </p>

            <div className="w-full space-y-3 mb-8">
              {profile.location && (
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                Joined {formatDate(profile.created_at)}
              </div>
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-violet-400 hover:text-violet-300">
                  <Globe className="h-3.5 w-3.5" />
                  {profile.website.replace("https://", "").replace("http://", "")}
                </a>
              )}
            </div>

            <div className="flex gap-4 w-full">
              <Button className="flex-1 h-10 px-4">Follow</Button>
              {profile.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="icon" className="h-10 w-10">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center" hover={false}>
              <p className="text-xl font-bold text-white">{products.length}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Shipped</p>
            </Card>
            <Card className="p-4 text-center" hover={false}>
              <p className="text-xl font-bold text-white">
                {products.reduce((acc, p) => acc + (p.boost_count || 0), 0)}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Boosts</p>
            </Card>
          </div>
        </div>

        {/* Main Content: Products */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Showcase
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
              <p className="text-zinc-500">No products shipped yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
