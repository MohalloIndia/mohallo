/**
 * Mohallo V3 — Real Interactive 3D Hero Experience
 * Built with Three.js (Procedural geometries, lightweight, 60fps, zero lag)
 * Zero-Border Seamless Floating Design:
 * - 100% transparent canvas background (no container borders, no platform edges)
 * - True Mohallo brand colors (#E8622C orange, warm glowing window, dark charcoal trims)
 * - Soft, blurred contact shadows on the floor (no harsh cylinder boundaries)
 * - Mouse parallax & camera damping
 * - Responsive auto-resize and prefers-reduced-motion support
 */

(function initMohallo3DHero() {
  const container = document.getElementById("hero-3d-canvas-container");
  const fallback = document.getElementById("hero-3d-fallback");
  const heroSection = document.getElementById("home") || container;
  if (!container) return;

  // 1. WebGL & Reduced Motion Check
  function hasWebGL() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasWebGL() || typeof THREE === "undefined") {
    console.log("WebGL unavailable or Three.js missing — using high-res fallback.");
    if (fallback) fallback.style.display = "block";
    return;
  }

  // 2. Setup Scene, Camera, Target, Renderer
  const scene = new THREE.Scene();

  // Target the geometric center of the shop + smartphone
  const target = new THREE.Vector3(0, 1.05, 0.1);

  let width = container.clientWidth || 560;
  let height = container.clientHeight || 480;

  // Camera positioned at natural 3/4 isometric perspective
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0.15, 2.5, 6.6);
  camera.lookAt(target);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // 100% transparent background
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Color accuracy without washing out saturated brand oranges
  if (THREE.sRGBEncoding) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.background = "transparent";
  renderer.domElement.style.border = "none";
  renderer.domElement.style.outline = "none";

  container.appendChild(renderer.domElement);
  if (fallback) fallback.style.display = "none";

  // 3. Balanced Lighting (Rich colors, no blowout)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.95);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffeedd, 0.4);
  fillLight.position.set(-6, 4, 3);
  scene.add(fillLight);

  // Warm amber point light inside the shop window
  const interiorLight = new THREE.PointLight(0xff8800, 2.2, 5);
  interiorLight.position.set(-1.15, 0.85, 0.2);
  scene.add(interiorLight);

  // 4. Create 3D Mohallo Group
  const worldGroup = new THREE.Group();
  worldGroup.position.set(0, 0, 0);
  scene.add(worldGroup);

  // Brand Palette
  const COLOR_ORANGE = 0xe8622c;
  const COLOR_DARK = 0x222226;
  const COLOR_CREAM = 0xfaf9f5;
  const COLOR_WALL = 0xf5f3ec;
  const COLOR_AMBER = 0xffdf80;
  const COLOR_GREEN = 0x15803d;

  // Helper: Create Soft Radial Contact Shadow Texture
  function createSoftShadowTexture(radius = 128) {
    const canvas = document.createElement("canvas");
    canvas.width = radius * 2;
    canvas.height = radius * 2;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    grad.addColorStop(0, "rgba(20, 20, 20, 0.16)");
    grad.addColorStop(0.45, "rgba(20, 20, 20, 0.08)");
    grad.addColorStop(0.8, "rgba(20, 20, 20, 0.02)");
    grad.addColorStop(1, "rgba(20, 20, 20, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, radius * 2, radius * 2);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const shadowTex = createSoftShadowTexture();

  // A. Contact Shadows directly on the transparent floor (Zero harsh borders)
  // Shadow under Shop
  const shopShadowGeo = new THREE.PlaneGeometry(3.2, 2.6);
  const shopShadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });
  const shopShadow = new THREE.Mesh(shopShadowGeo, shopShadowMat);
  shopShadow.rotation.x = -Math.PI / 2;
  shopShadow.position.set(-1.15, 0.01, 0.0);
  worldGroup.add(shopShadow);

  // Shadow under Phone
  const phoneShadowGeo = new THREE.PlaneGeometry(2.0, 1.4);
  const phoneShadow = new THREE.Mesh(phoneShadowGeo, shopShadowMat);
  phoneShadow.rotation.x = -Math.PI / 2;
  phoneShadow.position.set(1.4, 0.01, 0.3);
  worldGroup.add(phoneShadow);

  // Shadow under Parcel & Pin
  const smallShadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
  const smallShadow = new THREE.Mesh(smallShadowGeo, shopShadowMat);
  smallShadow.rotation.x = -Math.PI / 2;
  smallShadow.position.set(0.4, 0.01, 1.15);
  worldGroup.add(smallShadow);

  // Dynamic shadow catcher plane for key light shadows (100% transparent otherwise)
  const shadowPlaneGeo = new THREE.PlaneGeometry(20, 20);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.06 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.005;
  shadowPlane.receiveShadow = true;
  worldGroup.add(shadowPlane);

  // B. Shop Building
  const shopGroup = new THREE.Group();
  shopGroup.position.set(-1.15, 0, -0.1);
  worldGroup.add(shopGroup);

  // Shop Main Walls
  const wallGeo = new THREE.BoxGeometry(2.3, 1.8, 1.8);
  const wallMat = new THREE.MeshStandardMaterial({ color: COLOR_WALL, roughness: 0.45 });
  const wallMesh = new THREE.Mesh(wallGeo, wallMat);
  wallMesh.position.y = 0.9;
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  shopGroup.add(wallMesh);

  // Roof Molding Trim
  const roofTrimGeo = new THREE.BoxGeometry(2.4, 0.08, 1.9);
  const roofTrimMat = new THREE.MeshStandardMaterial({ color: 0xe5e1d6, roughness: 0.4 });
  const roofTrim = new THREE.Mesh(roofTrimGeo, roofTrimMat);
  roofTrim.position.y = 1.82;
  roofTrim.castShadow = true;
  shopGroup.add(roofTrim);

  // Glowing Storefront Window
  const winGeo = new THREE.BoxGeometry(1.0, 0.9, 0.08);
  const winMat = new THREE.MeshStandardMaterial({
    color: COLOR_AMBER,
    emissive: 0xff9900,
    emissiveIntensity: 0.45,
    roughness: 0.2
  });
  const winMesh = new THREE.Mesh(winGeo, winMat);
  winMesh.position.set(-0.45, 0.75, 0.92);
  shopGroup.add(winMesh);

  // Window Frames (cross mullions)
  const frameMat = new THREE.MeshStandardMaterial({ color: COLOR_DARK, roughness: 0.4 });
  const fHorizontal = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.04, 0.1), frameMat);
  fHorizontal.position.set(-0.45, 0.75, 0.93);
  shopGroup.add(fHorizontal);

  const fVertical = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.94, 0.1), frameMat);
  fVertical.position.set(-0.45, 0.75, 0.93);
  shopGroup.add(fVertical);

  // Shop Door
  const doorGeo = new THREE.BoxGeometry(0.65, 1.3, 0.08);
  const doorMat = new THREE.MeshStandardMaterial({ color: COLOR_DARK, roughness: 0.4 });
  const doorMesh = new THREE.Mesh(doorGeo, doorMat);
  doorMesh.position.set(0.55, 0.65, 0.92);
  shopGroup.add(doorMesh);

  // Door Glass Window
  const doorGlassGeo = new THREE.BoxGeometry(0.45, 0.6, 0.085);
  const doorGlassMat = new THREE.MeshStandardMaterial({
    color: COLOR_AMBER,
    emissive: 0xff9900,
    emissiveIntensity: 0.3,
    roughness: 0.2
  });
  const doorGlass = new THREE.Mesh(doorGlassGeo, doorGlassMat);
  doorGlass.position.set(0.55, 0.85, 0.925);
  shopGroup.add(doorGlass);

  // Door Handle (Brass)
  const handleGeo = new THREE.SphereGeometry(0.045, 16, 16);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.2, metalness: 0.8 });
  const handleMesh = new THREE.Mesh(handleGeo, handleMat);
  handleMesh.position.set(0.32, 0.65, 0.98);
  shopGroup.add(handleMesh);

  // Awning (Striped Orange & Cream)
  const awningGroup = new THREE.Group();
  awningGroup.position.set(0, 1.7, 0.92);
  awningGroup.rotation.x = 0.38;
  shopGroup.add(awningGroup);

  const numStripes = 7;
  const stripeWidth = 2.4 / numStripes;
  for (let i = 0; i < numStripes; i++) {
    const sColor = i % 2 === 0 ? COLOR_ORANGE : COLOR_CREAM;
    const sGeo = new THREE.BoxGeometry(stripeWidth, 0.06, 0.7);
    const sMat = new THREE.MeshStandardMaterial({
      color: sColor,
      roughness: 0.35,
      emissive: i % 2 === 0 ? COLOR_ORANGE : 0x000000,
      emissiveIntensity: i % 2 === 0 ? 0.08 : 0
    });
    const sMesh = new THREE.Mesh(sGeo, sMat);
    sMesh.position.set(-1.2 + stripeWidth * (i + 0.5), 0, 0.35);
    sMesh.castShadow = true;
    awningGroup.add(sMesh);
  }

  // Shop Signboard
  const signGeo = new THREE.BoxGeometry(1.6, 0.42, 0.12);
  const signMat = new THREE.MeshStandardMaterial({ color: COLOR_DARK, roughness: 0.3 });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(0, 2.1, 0.86);
  shopGroup.add(signMesh);

  // Orange Mohallo Emblem on sign
  const emblemGeo = new THREE.TorusGeometry(0.1, 0.035, 16, 32);
  const emblemMat = new THREE.MeshStandardMaterial({
    color: COLOR_ORANGE,
    roughness: 0.3,
    emissive: COLOR_ORANGE,
    emissiveIntensity: 0.35
  });
  const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
  emblemMesh.position.set(0, 2.1, 0.94);
  shopGroup.add(emblemMesh);

  // Potted Succulent Plant outside shop
  const potGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.25, 16);
  const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.6 });
  const potMesh = new THREE.Mesh(potGeo, potMat);
  potMesh.position.set(-1.45, 0.12, 0.8);
  shopGroup.add(potMesh);

  const plantGeo = new THREE.ConeGeometry(0.16, 0.35, 12);
  const plantMat = new THREE.MeshStandardMaterial({ color: COLOR_GREEN, roughness: 0.5 });
  const plantMesh = new THREE.Mesh(plantGeo, plantMat);
  plantMesh.position.set(-1.45, 0.36, 0.8);
  shopGroup.add(plantMesh);

  // C. Upright Smartphone / Digital Interface
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(1.4, 1.25, 0.3);
  phoneGroup.rotation.y = -0.22;
  worldGroup.add(phoneGroup);

  // Phone Body
  const phoneGeo = new THREE.BoxGeometry(1.5, 2.65, 0.12);
  const phoneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
  phoneMesh.castShadow = true;
  phoneGroup.add(phoneMesh);

  // Phone Screen
  const screenGeo = new THREE.PlaneGeometry(1.36, 2.45);
  const screenMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfb, roughness: 0.15 });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.065;
  phoneGroup.add(screenMesh);

  // Phone UI Top Header Bar
  const uiHeaderGeo = new THREE.PlaneGeometry(1.24, 0.25);
  const uiHeaderMat = new THREE.MeshBasicMaterial({ color: 0xf3f3ee });
  const uiHeader = new THREE.Mesh(uiHeaderGeo, uiHeaderMat);
  uiHeader.position.set(0, 0.95, 0.07);
  phoneGroup.add(uiHeader);

  // Mini Ceramic Mug on phone display
  const miniMugGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.28, 16);
  const miniMugMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 });
  const miniMug = new THREE.Mesh(miniMugGeo, miniMugMat);
  miniMug.position.set(-0.32, 0.42, 0.18);
  phoneGroup.add(miniMug);

  // Mini Succulent Planter on phone display
  const miniPlanterGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.22, 16);
  const miniPlanterMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
  const miniPlanter = new THREE.Mesh(miniPlanterGeo, miniPlanterMat);
  miniPlanter.position.set(0.32, 0.42, 0.18);
  phoneGroup.add(miniPlanter);

  // Screen UI Cards behind products
  const card1Geo = new THREE.PlaneGeometry(0.55, 0.55);
  const cardMat = new THREE.MeshBasicMaterial({ color: 0xf4f4ee });
  const c1 = new THREE.Mesh(card1Geo, cardMat);
  c1.position.set(-0.32, 0.42, 0.07);
  phoneGroup.add(c1);

  const c2 = new THREE.Mesh(card1Geo, cardMat);
  c2.position.set(0.32, 0.42, 0.07);
  phoneGroup.add(c2);

  // Tiny Mohallo button pill on phone screen
  const uiBtnGeo = new THREE.PlaneGeometry(1.0, 0.24);
  const uiBtnMat = new THREE.MeshBasicMaterial({ color: COLOR_ORANGE });
  const uiBtn = new THREE.Mesh(uiBtnGeo, uiBtnMat);
  uiBtn.position.set(0, -0.75, 0.07);
  phoneGroup.add(uiBtn);

  // D. Map Location Pin Marker
  const pinGroup = new THREE.Group();
  pinGroup.position.set(1.35, 0.4, 1.25);
  worldGroup.add(pinGroup);

  const pinHeadGeo = new THREE.SphereGeometry(0.24, 20, 20);
  const pinMat = new THREE.MeshStandardMaterial({
    color: COLOR_ORANGE,
    roughness: 0.2,
    emissive: COLOR_ORANGE,
    emissiveIntensity: 0.3
  });
  const pinHead = new THREE.Mesh(pinHeadGeo, pinMat);
  pinHead.position.y = 0.35;
  pinGroup.add(pinHead);

  const pinPointGeo = new THREE.ConeGeometry(0.22, 0.35, 16);
  const pinPoint = new THREE.Mesh(pinPointGeo, pinMat);
  pinPoint.position.y = 0.15;
  pinPoint.rotation.x = Math.PI;
  pinGroup.add(pinPoint);

  // E. Floating Shopping Parcel Box
  const parcelGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4);
  const parcelMat = new THREE.MeshStandardMaterial({ color: 0xd6c4b2, roughness: 0.6 });
  const parcelMesh = new THREE.Mesh(parcelGeo, parcelMat);
  parcelMesh.position.set(0.4, 0.2, 1.15);
  parcelMesh.rotation.y = 0.35;
  parcelMesh.castShadow = true;
  worldGroup.add(parcelMesh);

  // Ribbon on parcel
  const ribbonGeo = new THREE.BoxGeometry(0.52, 0.06, 0.42);
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: COLOR_ORANGE,
    roughness: 0.3,
    emissive: COLOR_ORANGE,
    emissiveIntensity: 0.25
  });
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.position.copy(parcelMesh.position);
  ribbon.rotation.copy(parcelMesh.rotation);
  worldGroup.add(ribbon);

  // 5. Interactive Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX = Math.max(-1, Math.min(1, normX));
    mouseY = Math.max(-1, Math.min(1, normY));
  });

  heroSection.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
  });

  // Click on 3D diorama navigates directly to marketplace explore
  container.addEventListener("click", () => {
    window.location.href = "marketplace.html";
  });
  container.style.cursor = "pointer";
  container.setAttribute("title", "Click to explore local neighbourhood shops");

  // 6. Animation Loop with Parallax & Damping
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Gentle idle floating of parcel and pin
      pinGroup.position.y = 0.4 + Math.sin(time * 2.0) * 0.05;
      parcelMesh.position.y = 0.2 + Math.cos(time * 1.5) * 0.03;
      ribbon.position.y = parcelMesh.position.y;

      // Smooth mouse parallax interpolation
      targetRotationY = mouseX * 0.20;
      targetRotationX = -mouseY * 0.09;

      worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.06;
      worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.06;
    }

    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  animate();

  // 7. Robust Responsive Resize Handling
  function updateViewport() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight || 480;
    if (newWidth && newHeight) {
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      camera.lookAt(target);
      renderer.setSize(newWidth, newHeight);
    }
  }

  window.addEventListener("resize", updateViewport);
  window.addEventListener("load", updateViewport);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => updateViewport());
    ro.observe(container);
  }

  console.log("Mohallo V3 Real 3D Hero: zero-border seamless floating initialized! 🚀");
})();
