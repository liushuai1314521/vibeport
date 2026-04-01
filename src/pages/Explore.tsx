import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Filter, LayoutGrid, List as ListIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Input } from "../components/Input";
import { ProductCard, Product } from "../components/ProductCard";
import { Badge } from "../components/Badge";
import { useFirebase } from "../contexts/FirebaseContext";

const TAGS = ["All", "AI", "DevTools", "Design", "Productivity", "Music", "Health", "Team"];

export const Explore = () => {
  const { products, getProducts } = useFirebase();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const unsubscribe = getProducts(selectedTag);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [selectedTag]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Explore Inspiration</h1>
        <p className="text-zinc-500">Discover what the world's most creative builders are shipping.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
          <Input
            placeholder="Search products, makers, or vibes..."
            className="pl-12 h-14"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setView("grid")}
              className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300")}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300")}
            >
              <ListIcon className="h-5 w-5" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-all">
            <Filter className="h-4 w-4" />
            Sort: Latest
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
              selectedTag === tag 
                ? "bg-violet-500/10 border-violet-500/50 text-violet-400" 
                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className={cn(
          "grid gap-8",
          view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
            <Search className="h-8 w-8 text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};
