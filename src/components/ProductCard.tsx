import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowUpRight, User } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  cover_image_url: string;
  maker_name: string;
  maker_avatar: string;
  maker_username?: string;
  user_id?: string;
  tags: string[];
  boost_count: number;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Card className="p-0 h-full flex flex-col group relative">
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-10" />
      
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-zinc-800">
        <img
          src={product.cover_image_url || `https://picsum.photos/seed/${encodeURIComponent(product.id)}/600/400`}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/seed/${encodeURIComponent(product.name)}/600/400`;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 z-20">
          <Button size="sm" variant="primary" className="h-8 w-8 p-0 rounded-full">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-violet-400 transition-colors">{product.name}</h3>
          <Badge variant="violet" className="flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            {product.boost_count}
          </Badge>
        </div>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
          {product.tagline}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
          <Link 
            to={`/maker/${product.user_id}`} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {product.maker_avatar ? (
              <img src={product.maker_avatar} className="h-5 w-5 rounded-full" alt={product.maker_name} referrerPolicy="no-referrer" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <User className="h-3 w-3 text-zinc-500" />
              </div>
            )}
            <span className="text-xs text-zinc-500 font-medium">by {product.maker_name || "Maker"}</span>
          </Link>
          <div className="flex gap-1">
            {/* 去重后显示标签 */}
            {[...new Set(product.tags)].map((tag) => (
              <Badge key={tag} variant="zinc">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
