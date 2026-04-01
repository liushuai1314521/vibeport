import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Rocket, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Wand2,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { polishIdeaStory } from "../services/gemini";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { useFirebase } from "../contexts/FirebaseContext";

import { cn } from "../lib/utils";

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, updateProduct, uploadFile, user } = useFirebase();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [polishing, setPolishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    idea_story: "",
    website_url: "",
    app_store_url: "",
    cover_image: "",
    tags: [] as string[],
    status: "published"
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProduct(id);
        if (data) {
          setFormData({
            name: data.name || "",
            tagline: data.tagline || "",
            description: data.description || "",
            idea_story: data.idea_story || "",
            website_url: data.website_url || "",
            app_store_url: data.app_store_url || "",
            cover_image: data.cover_image || "",
            tags: data.tags || [],
            status: data.status || "published"
          });
        }
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePolishDescription = async () => {
    if (!formData.description) return;
    setPolishing(true);
    try {
      const polished = await polishIdeaStory(formData.description);
      setFormData({ ...formData, description: polished });
      toast.success("Description polished!");
    } catch (error) {
      console.error("Failed to polish description:", error);
      toast.error("Failed to polish description.");
    } finally {
      setPolishing(false);
    }
  };

  const handlePolishStory = async () => {
    if (!formData.idea_story) return;
    setPolishing(true);
    try {
      const polished = await polishIdeaStory(formData.idea_story);
      setFormData({ ...formData, idea_story: polished });
      toast.success("Story polished!");
    } catch (error) {
      console.error("Failed to polish story:", error);
      toast.error("Failed to polish story.");
    } finally {
      setPolishing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const path = `products/${user.uid}/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData(prev => ({ ...prev, cover_image: url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await updateProduct(id, formData);
      toast.success("Build updated successfully!");
      navigate(`/product/${id}`);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update build. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-32 text-center">
        <Loader2 className="h-12 w-12 text-violet-500 animate-spin mx-auto mb-4" />
        <p className="text-zinc-500">Retrieving build details...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Edit Your Build</h1>
        <p className="text-zinc-500">Refine your product's presence on VibePort.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= s ? "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "bg-zinc-800"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <Card className="p-8 space-y-6 bg-zinc-900/50 border-zinc-800">
              <div className="space-y-4">
                <Input 
                  label="Product Name" 
                  placeholder="e.g. AuraMind" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input 
                  label="Tagline" 
                  placeholder="A short, catchy one-liner" 
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-400">Description</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-violet-400 hover:text-violet-300 gap-1.5"
                      onClick={handlePolishDescription}
                      disabled={polishing || !formData.description}
                    >
                      {polishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                      AI Polish
                    </Button>
                  </div>
                  <Input 
                    multiline 
                    placeholder="What does it do? Who is it for?" 
                    className="h-32"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full h-12 gap-2" onClick={() => setStep(2)}>
                Next: The Story
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <Card className="p-8 space-y-6 bg-zinc-900/50 border-zinc-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-400">Product Introduction</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-violet-400 hover:text-violet-300 gap-1.5"
                    onClick={handlePolishStory}
                    disabled={polishing || !formData.idea_story}
                  >
                    {polishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                    AI Polish
                  </Button>
                </div>
                <Input 
                  multiline 
                  placeholder="Why did you build this? What was the spark? (AI can help you polish this)" 
                  className="h-48"
                  value={formData.idea_story}
                  onChange={(e) => setFormData({ ...formData, idea_story: e.target.value })}
                />
                <p className="text-xs text-zinc-500 italic">
                  Tip: Be authentic. People connect with the "why" behind the build.
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-[2] h-12 gap-2" onClick={() => setStep(3)}>
                  Next: Visuals & Links
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <Card className="p-8 space-y-8 bg-zinc-900/50 border-zinc-800">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-zinc-400">Cover Image</label>
                  <Input 
                    placeholder="Or paste an image URL here..." 
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  />
                  <div 
                    onClick={() => document.getElementById('edit-file-upload')?.click()}
                    className="aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 relative cursor-pointer group flex flex-col items-center justify-center gap-3"
                  >
                    <input 
                      id="edit-file-upload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
                        <p className="text-xs text-zinc-500">Uploading to VibePort...</p>
                      </div>
                    ) : formData.cover_image ? (
                      <img 
                        src={formData.cover_image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/seed/${encodeURIComponent(formData.name)}/1200/600`;
                        }}
                      />
                    ) : (
                      <>
                        <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ImageIcon className="h-5 w-5 text-zinc-600" />
                        </div>
                        <p className="text-xs text-zinc-500">Click to upload a new image</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Website URL" 
                    placeholder="https://..." 
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  />
                  <Input 
                    label="App Store URL (Optional)" 
                    placeholder="https://..." 
                    value={formData.app_store_url}
                    onChange={(e) => setFormData({ ...formData, app_store_url: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-400">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {["AI", "Web3", "SaaS", "DevTools", "Design", "Productivity", "Health", "Social", "Vibe"].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = formData.tags.includes(tag)
                            ? formData.tags.filter(t => t !== tag)
                            : [...formData.tags, tag];
                          setFormData({ ...formData, tags: newTags });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                          formData.tags.includes(tag)
                            ? "bg-violet-500/20 border-violet-500 text-violet-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  className="flex-[2] h-14 bg-gradient-to-r from-violet-600 to-cyan-600 border-none"
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Update Build
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
