import React, { useState } from "react";
import { motion } from "motion/react";
import { Rocket, Sparkles, Globe, Image as ImageIcon, Wand2, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { extractMetadata, polishIdeaStory } from "../services/gemini";
import { cn } from "../lib/utils";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { useFirebase } from "../contexts/FirebaseContext";

export const SubmitProduct = () => {
  const navigate = useNavigate();
  const { createProduct, uploadFile, user } = useFirebase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    name: "",
    tagline: "",
    description: "",
    idea_story: "",
    tags: [] as string[],
    cover_image: "",
  });

  const handleExtract = async () => {
    if (!formData.url) return;
    setLoading(true);
    try {
      const data = await extractMetadata(formData.url);
      setFormData(prev => ({
        ...prev,
        name: data.name || prev.name,
        tagline: data.tagline || prev.tagline,
        description: data.description || prev.description,
        tags: data.tags || prev.tags,
        cover_image: data.cover_image || prev.cover_image,
      }));
      setStep(2);
      toast.success("AI analysis complete!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePolishDescription = async () => {
    if (!formData.description) return;
    setLoading(true);
    try {
      const polished = await polishIdeaStory(formData.description);
      setFormData(prev => ({ ...prev, description: polished }));
      toast.success("Description polished!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to polish description.");
    } finally {
      setLoading(false);
    }
  };

  const handlePolishStory = async () => {
    if (!formData.idea_story) return;
    setLoading(true);
    try {
      const polished = await polishIdeaStory(formData.idea_story);
      setFormData(prev => ({ ...prev, idea_story: polished }));
      toast.success("Story polished!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to polish story.");
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      const productId = await createProduct({
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description || "No description provided.",
        idea_story: formData.idea_story || "No story provided.",
        website_url: formData.url,
        cover_image_url: formData.cover_image || `https://picsum.photos/seed/${encodeURIComponent(formData.name)}/1200/600`,
        tags: formData.tags,
        status: "published",
      });
      if (productId) {
        navigate(`/product/${productId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Share Your Build</h1>
        <p className="text-zinc-500">Your first piece of work deserves to be seen by the world.</p>
      </div>

      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute -top-8 left-0 w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-violet-400 mb-2">
                  <Globe className="h-5 w-5" />
                  <h2 className="font-bold uppercase tracking-widest text-xs">Step 1: The Link</h2>
                </div>
                <p className="text-zinc-400 text-sm">Start with your product URL. Our AI will help you fill in the details.</p>
                <Input
                  label="Website URL"
                  placeholder="https://your-amazing-product.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <Button
                  className="w-full h-14"
                  onClick={handleExtract}
                  isLoading={loading}
                  disabled={!formData.url}
                >
                  Continue with AI Assist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-violet-400 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="font-bold uppercase tracking-widest text-xs">Step 2: The Details</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="One-line Tagline"
                    placeholder="The IDE that plays lo-fi beats..."
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">What it does (Description)</label>
                      <button
                        onClick={handlePolishDescription}
                        disabled={loading || !formData.description}
                        className="text-[10px] font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Wand2 className="h-3 w-3" />
                        Polish
                      </button>
                    </div>
                    <Input
                      multiline
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {["AI", "Web3", "SaaS", "DevTools", "Design", "Productivity", "Health", "Social", "Vibe", "Games"].map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            const newTags = formData.tags.includes(tag)
                              ? formData.tags.filter(t => t !== tag)
                              : [...formData.tags, tag];
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all border",
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
                  <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-[2]" onClick={() => setStep(3)}>Next: The Story</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center gap-3 text-violet-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <h2 className="font-bold uppercase tracking-widest text-xs">Step 3: The Story Behind the Vibe</h2>
                    <div className="flex items-center justify-between">
                    </div>
                  </div>

                    <button
                      onClick={handlePolishStory}
                      disabled={loading || !formData.idea_story}
                      className="text-[10px] font-bold uppercase tracking-widest text-violet-400 flex items-center gap-1 hover:cursor-pointer"
                    >
                      <Wand2 className="h-3 w-3" />
                      Polish with AI
                    </button>
                </div>

                <div className="space-y-4">

                  <Input
                    multiline
                    placeholder="hat inspired you? Share the journey, the grind, and the wins."
                    value={formData.idea_story}
                    onChange={(e) => setFormData({ ...formData, idea_story: e.target.value })}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Cover Image</label>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      placeholder="Or paste an image URL here..."
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    />
                    <div
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="aspect-video w-full rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3 hover:border-violet-500/30 transition-all cursor-pointer group overflow-hidden bg-zinc-900/50 relative"
                    >
                      <input
                        id="file-upload"
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
                          className="h-full w-full object-cover"
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://picsum.photos/seed/${encodeURIComponent(formData.name)}/1200/600`;
                          }}
                        />
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImageIcon className="h-6 w-6 text-zinc-600" />
                          </div>
                          <p className="text-xs text-zinc-500">Click to upload or drag and drop</p>
                        </>
                      )}
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
                    Launch to VibePort
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
