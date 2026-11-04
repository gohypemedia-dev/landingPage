"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CurrencyCode } from "@/types";
import { CURRENCIES, formatPriceINR, formatNumberDeterministic } from "@/data/products";

interface ThreeProductViewerProps {
  currency: CurrencyCode;
  onAddToCart?: (name: string, finish: string, priceUSD: number) => void;
}

type FinishId = "kunis-breccia" | "smoked-oak" | "calacatta" | "brushed-brass";
type LightingId = "morning" | "noon" | "dusk";

interface FinishConfig {
  id: FinishId;
  name: string;
  materialColor: number;
  roughness: number;
  metalness: number;
  textureType: "stone" | "wood" | "marble" | "metal";
  priceUSD: number;
}

const FINISHES: FinishConfig[] = [
  {
    id: "kunis-breccia",
    name: "Kunis Breccia Travertine",
    materialColor: 0xd6cbb8,
    roughness: 0.85,
    metalness: 0.05,
    textureType: "stone",
    priceUSD: 1890,
  },
  {
    id: "smoked-oak",
    name: "Smoked Espresso Oak",
    materialColor: 0x302722,
    roughness: 0.65,
    metalness: 0.1,
    textureType: "wood",
    priceUSD: 1650,
  },
  {
    id: "calacatta",
    name: "Calacatta Viola Marble",
    materialColor: 0xe8e4de,
    roughness: 0.35,
    metalness: 0.15,
    textureType: "marble",
    priceUSD: 2450,
  },
  {
    id: "brushed-brass",
    name: "Solid Cast Brushed Brass",
    materialColor: 0xb58e57,
    roughness: 0.3,
    metalness: 0.85,
    textureType: "metal",
    priceUSD: 2890,
  },
];

export const ThreeProductViewer: React.FC<ThreeProductViewerProps> = ({
  currency,
  onAddToCart,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<FinishConfig>(FINISHES[0]);
  const [activeLighting, setActiveLighting] = useState<LightingId>("morning");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // References for three.js manipulation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const plinthMeshRef = useRef<THREE.Mesh | null>(null);
  const vesselGroupRef = useRef<THREE.Group | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  const curr = CURRENCIES[currency];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3.2, 2.2, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // Procedural Stone Texture Generator
    const createStoneTexture = (type: "stone" | "wood" | "marble" | "metal") => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;

      if (type === "wood") {
        ctx.fillStyle = "#322923";
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#261f1a";
        for (let i = 0; i < 512; i += 6) {
          ctx.fillRect(i, 0, 2 + Math.random() * 2, 512);
        }
      } else if (type === "marble") {
        ctx.fillStyle = "#EAE6DF";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#5A2832";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 80);
        ctx.bezierCurveTo(150, 180, 320, 100, 512, 300);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(100, 512);
        ctx.bezierCurveTo(240, 350, 420, 420, 512, 120);
        ctx.stroke();
      } else if (type === "metal") {
        ctx.fillStyle = "#BA935D";
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#D6AF76";
        for (let i = 0; i < 512; i += 4) {
          ctx.fillRect(i, 0, 1, 512);
        }
      } else {
        // stone / travertine
        ctx.fillStyle = "#D9CEBC";
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#BEB09B";
        for (let i = 0; i < 180; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const w = 20 + Math.random() * 60;
          const h = 4 + Math.random() * 12;
          ctx.fillRect(x, y, w, h);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      return texture;
    };

    // Main Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Plinth Low Table (Monolithic Box with subtle chamfer)
    const plinthGeo = new THREE.BoxGeometry(2.4, 0.75, 1.4, 32, 16, 32);
    const initialTexture = createStoneTexture("stone");
    const plinthMat = new THREE.MeshStandardMaterial({
      color: activeFinish.materialColor,
      map: initialTexture,
      roughness: activeFinish.roughness,
      metalness: activeFinish.metalness,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = 0.375;
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    rootGroup.add(plinthMesh);
    plinthMeshRef.current = plinthMesh;

    // 2. Sculptural Échasse Object (Vessel on stilts sitting on top)
    const vesselGroup = new THREE.Group();
    vesselGroup.position.set(0.3, 0.75, 0.1);

    // Glass teardrop vase
    const vaseGeo = new THREE.SphereGeometry(0.32, 32, 24);
    vaseGeo.scale(0.85, 1.25, 0.85);
    const vaseMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a443e,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const vaseMesh = new THREE.Mesh(vaseGeo, vaseMat);
    vaseMesh.position.y = 0.42;
    vaseMesh.castShadow = true;
    vesselGroup.add(vaseMesh);

    // 4 Brass Stilts
    const legGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.55, 16);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xcaa368,
      metalness: 0.85,
      roughness: 0.25,
    });

    const positions = [
      [-0.18, 0.275, -0.18],
      [0.18, 0.275, -0.18],
      [-0.18, 0.275, 0.18],
      [0.18, 0.275, 0.18],
    ];

    positions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, brassMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      vesselGroup.add(leg);
    });

    // Ring connecting legs
    const ringGeo = new THREE.TorusGeometry(0.24, 0.015, 16, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, brassMat);
    ringMesh.position.y = 0.45;
    vesselGroup.add(ringMesh);

    rootGroup.add(vesselGroup);
    vesselGroupRef.current = vesselGroup;

    // 3. Ground Shadow Floor Plane
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.22,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xf5eedf, 0.7);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xfff7ea, 2.2);
    dirLight.position.set(4, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);
    directionalLightRef.current = dirLight;

    const fillLight = new THREE.DirectionalLight(0xdfecf8, 0.6);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Orbit Drag Interaction via Pointer Events
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.5;
    let targetRotationX = 0.1;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.2, Math.min(0.6, targetRotationX + deltaY * 0.005));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.002;
      const newDistance = camera.position.length() + zoomDelta;
      if (newDistance > 2.5 && newDistance < 7.5) {
        camera.position.normalize().multiplyScalar(newDistance);
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && !isDragging) {
        targetRotationY += 0.25 * delta;
      }

      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.08;

      camera.lookAt(0, 0.45, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("wheel", onWheel);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  // Update material on finish change
  useEffect(() => {
    if (!plinthMeshRef.current) return;
    const mat = plinthMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.setHex(activeFinish.materialColor);
    mat.roughness = activeFinish.roughness;
    mat.metalness = activeFinish.metalness;
    mat.needsUpdate = true;
  }, [activeFinish]);

  // Update lighting environment
  useEffect(() => {
    if (!directionalLightRef.current || !ambientLightRef.current) return;

    if (activeLighting === "noon") {
      directionalLightRef.current.color.setHex(0xffffff);
      directionalLightRef.current.intensity = 2.4;
      ambientLightRef.current.color.setHex(0xf0f4f8);
      ambientLightRef.current.intensity = 0.8;
    } else if (activeLighting === "dusk") {
      directionalLightRef.current.color.setHex(0xffaa66);
      directionalLightRef.current.intensity = 1.9;
      ambientLightRef.current.color.setHex(0x5c4033);
      ambientLightRef.current.intensity = 0.5;
    } else {
      // morning
      directionalLightRef.current.color.setHex(0xfff5ea);
      directionalLightRef.current.intensity = 2.2;
      ambientLightRef.current.color.setHex(0xf5eedf);
      ambientLightRef.current.intensity = 0.7;
    }
  }, [activeLighting]);

  // Exploded view animation
  useEffect(() => {
    if (!vesselGroupRef.current) return;
    if (isExploded) {
      vesselGroupRef.current.position.y = 1.35;
    } else {
      vesselGroupRef.current.position.y = 0.75;
    }
  }, [isExploded]);

  const handleAddPiece = () => {
    if (onAddToCart) {
      onAddToCart("Plinth Monolithic Low Table", activeFinish.name, activeFinish.priceUSD);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <section
      id="3d-studio"
      style={{
        padding: "6.5rem 0",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-canvas)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3rem" }}>
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--color-brass)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            INTERACTIVE 3D CONFIGURATOR • COPENHAGEN LAB
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1.12,
              marginBottom: "1rem",
              fontFamily: "var(--font-serif)",
            }}
          >
            Sculptural Presence, <span style={{ fontStyle: "italic" }}>Orbit in 3D</span>
          </h2>

          <p
            style={{
              color: "#A8A298",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Drag to rotate the piece in full 360° perspective. Inspect material textures, test ambient architectural lightings, or explode the construction layers.
          </p>
        </div>

        {/* 3D Studio Canvas Frame */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "640px",
            background: "radial-gradient(circle at 50% 50%, #292724 0%, #171615 100%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
          data-cursor="drag3d"
        >
          {/* Canvas Mount */}
          <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

          {/* Floating 3D Dimension Callout Badges */}
          {showDimensions && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "14%",
                  background: "rgba(22, 21, 20, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.12em",
                  color: "#FAF8F5",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span style={{ color: "var(--color-brass)" }}>✦</span>
                <span>LENGTH: 100 CM • HONED CHAMFER</span>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "26%",
                  right: "12%",
                  background: "rgba(22, 21, 20, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.12em",
                  color: "#FAF8F5",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span style={{ color: "var(--color-brass)" }}>✦</span>
                <span>MONOLITHIC WEIGHT: 82 KG</span>
              </div>
            </>
          )}

          {/* Top Control Bar (Lighting & View Modes) */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.25rem",
              right: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              zIndex: 10,
              pointerEvents: "auto",
            }}
          >
            {/* Lighting Studio Modes */}
            <div
              style={{
                display: "flex",
                background: "rgba(22, 21, 20, 0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "0.25rem",
                borderRadius: "2px",
                gap: "0.25rem",
              }}
            >
              {[
                { id: "morning", label: "Morning 2700K" },
                { id: "noon", label: "Nordic Noon 5000K" },
                { id: "dusk", label: "Nordhavn Dusk 2200K" },
              ].map((light) => (
                <button
                  key={light.id}
                  onClick={() => setActiveLighting(light.id as LightingId)}
                  style={{
                    background: activeLighting === light.id ? "var(--color-brass)" : "transparent",
                    color: activeLighting === light.id ? "#FFFFFF" : "#A8A298",
                    border: "none",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {light.label}
                </button>
              ))}
            </div>

            {/* View Toggles */}
            <div
              style={{
                display: "flex",
                background: "rgba(22, 21, 20, 0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "0.25rem",
                borderRadius: "2px",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                style={{
                  background: autoRotate ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  color: "#FAF8F5",
                  border: "none",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                Auto-Orbit: {autoRotate ? "ON" : "OFF"}
              </button>

              <button
                onClick={() => setIsExploded(!isExploded)}
                style={{
                  background: isExploded ? "var(--color-brass)" : "transparent",
                  color: isExploded ? "#FFFFFF" : "#A8A298",
                  border: "none",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                {isExploded ? "De-Explode" : "Explode Layers"}
              </button>

              <button
                onClick={() => setShowDimensions(!showDimensions)}
                style={{
                  background: showDimensions ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  color: "#FAF8F5",
                  border: "none",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                Specs: {showDimensions ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>

          {/* Bottom Bar: Material Swatches & Configuration Checkout */}
          <div
            style={{
              position: "absolute",
              bottom: "1.25rem",
              left: "1.25rem",
              right: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.25rem",
              background: "rgba(22, 21, 20, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "1.25rem 1.75rem",
              borderRadius: "2px",
              zIndex: 10,
            }}
          >
            {/* Finish Selector */}
            <div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-brass)",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                SELECT TACTILE MATERIAL FINISH:
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {FINISHES.map((f) => {
                  const isSelected = activeFinish.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFinish(f)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.4rem 0.85rem",
                        border: isSelected ? "1.5px solid var(--color-brass)" : "1px solid rgba(255, 255, 255, 0.2)",
                        background: isSelected ? "rgba(182, 146, 105, 0.18)" : "transparent",
                        color: isSelected ? "#FFFFFF" : "#A8A298",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: `#${f.materialColor.toString(16).padStart(6, "0")}`,
                          display: "inline-block",
                          border: "1px solid rgba(255,255,255,0.4)",
                        }}
                      />
                      <span>{f.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Direct Bag Action */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.6875rem", color: "#8E8880", display: "block" }}>
                  CONFIGURED PRICE:
                </span>
                <span suppressHydrationWarning style={{ fontFamily: "var(--font-sans)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-gold)" }}>
                  {currency === "INR" ? formatPriceINR(Math.round(activeFinish.priceUSD * 83.5)) : `${curr.symbol}${formatNumberDeterministic(Math.round(activeFinish.priceUSD * curr.rate))}`}
                </span>
              </div>

              <a
                href={`https://wa.me/919849012345?text=${encodeURIComponent(
                  `Hello Mallikarjuna Furniture World Kurnool,\nI customized this bespoke piece in your 3D Studio:\nProduct: Plinth Architectural Table\nFinish: ${activeFinish.name}\nEstimated Budget: ${formatPriceINR(Math.round(activeFinish.priceUSD * 83.5))}\nPlease confirm availability and showroom delivery.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{
                  padding: "0.85rem 1.65rem",
                  fontSize: "0.75rem",
                  borderRadius: "999px",
                  fontWeight: 700,
                }}
              >
                <span>ENQUIRE ON WHATSAPP</span>
              </a>

              <button
                onClick={handleAddPiece}
                className="btn-primary"
                style={{
                  background: addedToast ? "var(--color-gold)" : "#FFFFFF",
                  color: addedToast ? "#FFFFFF" : "var(--color-navy)",
                  padding: "0.85rem 1.65rem",
                  fontSize: "0.75rem",
                  borderRadius: "999px",
                  fontWeight: 700,
                }}
              >
                {addedToast ? "SAVED TO BAG ✓" : "SAVE CONFIGURATION"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
