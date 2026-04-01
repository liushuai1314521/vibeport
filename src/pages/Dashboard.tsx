import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LayoutGrid,
  FileText,
  Archive,
  Trash2,
  Edit3,
  Eye,
  MoreVertical,
  Plus,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn, formatDate } from "../lib/utils";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { useFirebase } from "../contexts/FirebaseContext";

export const Dashboard = () => {
  const { user, myProducts, getMyProducts, deleteProduct, updateProduct } = useFirebase();
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "archived">("all");

  useEffect(() => {
    const unsubscribe = getMyProducts();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this build?")) {
      await deleteProduct(id);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateProduct(id, { status: newStatus });
  };

  const filtered = myProducts.filter(p => activeTab === "all" || p.status === activeTab);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Builds</h1>
          <p className="text-zinc-500">Manage your creations and track their impact.</p>
        </div>
        <Link to="/submit">
          <Button className="gap-2 h-12 px-6">
            <Plus className="h-5 w-5" />
            Share New Build
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-8 border-b border-zinc-900 pb-4 overflow-x-auto">
        {(["all", "published", "draft", "archived"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all relative",
              activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-violet-500" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map(product => (
            <Card key={product.id} className="p-6 hover:border-zinc-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <img className ="w-full h-full object-cover rounded-xl" src={product.cover_image_url} alt={product.name} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge
                        variant={product.status === "published" ? "emerald" : product.status === "draft" ? "cyan" : "zinc"}
                      >
                        {product.status}
                      </Badge>
                      <span className="text-xs text-zinc-600">Updated {formatDate(product.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{product.views || 0}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{product.boost_count || 0}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Boosts</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/product/${product.id}`}>
                      <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/edit/${product.id}`}>
                      <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => handleStatusChange(product.id, product.status === "archived" ? "published" : "archived")}
                    >
                      <Archive className={cn("h-4 w-4", product.status === "archived" && "text-amber-500")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500/50 hover:text-red-500"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
            <p className="text-zinc-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
