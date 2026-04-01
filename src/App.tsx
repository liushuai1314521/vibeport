import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { ProductDetail } from "./pages/ProductDetail";
import { SubmitProduct } from "./pages/SubmitProduct";
import { Dashboard } from "./pages/Dashboard";
import { MakerProfile } from "./pages/MakerProfile";
import { EditProduct } from "./pages/EditProduct";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="submit" element={<SubmitProduct />} />
          <Route path="edit/:id" element={<EditProduct />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="maker/:id" element={<MakerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
