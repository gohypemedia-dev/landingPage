"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { shopActions, useShopStore } from "@/lib/shopStore";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AudoProductStage } from "@/components/AudoProductStage";
import { AtmosphereShowcase } from "@/components/AtmosphereShowcase";
// import { LookbookHotspot } from "@/components/LookbookHotspot";
import { Footer } from "@/components/Footer";
import { StoryCards } from "@/components/StoryCards";
import { Testimonials } from "@/components/Testimonials";
import { HomeFaqs } from "@/components/HomeFaqs";
import { ShopByLook } from "@/components/ShopByLook";
import { PopularCategories } from "@/components/PopularCategories";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { Toast } from "@/components/Toast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { DealBanner } from "@/components/DealBanner";
import { BestsellerBanner, bestsellerSlides } from "@/components/BestsellerBanner";
import { FestiveOfferBanner } from "@/components/FestiveOfferBanner";
import { AddOnSaleBanner } from "@/components/AddOnSaleBanner";
import { PromoCarousel } from "@/components/PromoCarousel";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

const ScrollProgress = dynamic(
  () => import("@/components/ScrollProgress").then((mod) => mod.ScrollProgress),
  { ssr: false }
);




export default function Home() {
  // Currency state - default to INR for Kurnool
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  // Shortlist + inquiry list are shared with every page (saved in the browser)
  const { items: cartItems, wishlistIds } = useShopStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Clicking a product opens its full detail page
  const router = useRouter();
  const openProduct = (p: Product) => router.push(`/product/${p.id}`);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Enquiry list + shortlist operations
  const handleAddToCart = (product: Product, finish: ProductFinish, quantity = 1) => {
    shopActions.addItem(product, finish, quantity);
    showToast(`Added ${product.name} to inquiry list`);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => shopActions.updateQuantity(index, quantity);

  const handleRemoveCartItem = (index: number) => {
    const item = cartItems[index];
    shopActions.removeItem(index);
    if (item) showToast(`Removed ${item.product.name} from list`);
  };

  const handleClearCart = () => shopActions.clearItems();

  const handleToggleWishlist = (product: Product) => {
    const added = shopActions.toggleWishlist(product);
    showToast(added ? `Shortlisted ${product.name}` : `Removed ${product.name} from shortlist`);
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product, product.finishes[0], 1);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Shared props for the three product stages (New Designs, Best Sellers, Online Exclusive)
  const stageProps = {
    currency,
    wishlistIds,
    onToggleWishlist: handleToggleWishlist,
    onQuickView: openProduct,
    onAddToCart: (p: Product, f: ProductFinish) => {
      handleAddToCart(p, f, 1);
      setIsCartOpen(true);
    },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Luxury Custom Pointer */}
      <CustomCursor />

      {/* 1. Navigation Header (Solid Navy #102B46 + Gold Badge & Wordmark) */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* 1. Hero with Cinematic Preserved Video & 3D Scroll-Linked Scaling */}
        <Hero />

        {/* One banner slider: bestsellers, Diwali festive offers & Add-On sale */}
        <PromoCarousel
          label="Featured collections and offers"
          slides={[
            ...bestsellerSlides.map((s, i) => <BestsellerBanner key={s.href} slide={s} priority={i === 0} />),
            <FestiveOfferBanner key="diwali" />,
            <AddOnSaleBanner key="add-on" />,
          ]}
        />

        {/* Limited time deal, trust badges & coupon banner */}
        <DealBanner />

        {/* Popular Categories (circles) */}
        <PopularCategories />

        {/* 2. Signature 3-Column AUDO Product Stages: New Designs, then Best Sellers */}
        <div id="collection" />
        <AudoProductStage collection="new" title="New Designs" {...stageProps} />
        <AudoProductStage collection="bestsellers" title="Best Sellers" {...stageProps} />

        {/* 4. Full-Bleed Atmosphere Showcases (01 Living, 02 Bedroom, 03 Dining with Floating 3D Cards) */}
        <AtmosphereShowcase
          currency={currency}
          onQuickView={openProduct}
          onAddToCart={(p, f) => {
            handleAddToCart(p, f, 1);
            setIsCartOpen(true);
          }}
        >
          {/* 5. Inspiration drag carousel sits between the two banner pairs (hidden for now) */}
          {/* <LookbookHotspot
            currency={currency}
            onQuickView={setQuickViewProduct}
          /> */}
        </AtmosphereShowcase>

        {/* Online Exclusive product stage */}
        <AudoProductStage collection="exclusive" title="Online Exclusive" {...stageProps} />

        {/* Shop By Look reels */}
        <ShopByLook />

        {/* FAQs, then customer testimonials */}
        <HomeFaqs />
        <Testimonials />

        <StoryCards />
      </main>

      {/* Luxury Footer with Contact, Showroom Timings & Local Kurnool SEO */}
      <Footer />

      {/* Floating WhatsApp Action Widget */}
      <FloatingWhatsApp />

      {/* Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        currency={currency}
        onSelectProduct={openProduct}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currency={currency}
        onSelectProduct={openProduct}
      />

      {/* Floating Micro-interaction Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
