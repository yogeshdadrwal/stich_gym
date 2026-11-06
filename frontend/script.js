/**
 * STITCH / VORTEX LABS - CORE FRONTEND JAVASCRIPT
 * Brand: Vortex Labs | Elite Gym Supplements
 * Integrated Backend API (http://localhost:5000/api) with resilient LocalStorage fallback
 */

const API_BASE_URL = 'http://localhost:5000/api';

// -------------------------------------------------------------
// 1. PRODUCTS DATA STORE & SVG GRAPHICS ENGINE
// -------------------------------------------------------------
const PRODUCTS_DATA = [
  {
    id: 'iso-matrix-isolate',
    name: 'ISO Matrix Isolate',
    category: 'protein',
    categoryLabel: 'Whey Isolate',
    price: 2999,
    originalPrice: 3999,
    weight: '2kg',
    rating: 4.9,
    reviewCount: 284,
    badge: 'Best Seller',
    badgeType: 'neon',
    flavors: ['Chocolate Fudge', 'Vanilla Soft-Serve', 'Wild Strawberry', 'Alphonso Mango'],
    sizes: ['1kg', '2kg', '4kg'],
    description: 'Ultra-pure cross-flow micro-filtered whey protein isolate. Delivers 27g of pure protein per scoop with zero added sugar and rapid-digesting hydrolysate peptides for maximum muscle protein synthesis.',
    colorAccent: '#00d4ff',
    iconType: 'tub-isolate',
    nutrition: {
      servingSize: '32g (1 Scoop)',
      servingsPerContainer: 62,
      calories: 120,
      protein: '27g',
      carbs: '0.8g',
      fat: '0.5g',
      bcaa: '5.8g',
      sugar: '0g'
    }
  },
  {
    id: 'vortex-pre-workout',
    name: 'Vortex Pre-Workout',
    category: 'pre-workout',
    categoryLabel: 'Pre-Workout',
    price: 1499,
    originalPrice: 1999,
    weight: '300g',
    rating: 4.8,
    reviewCount: 192,
    badge: 'Explosive Pump',
    badgeType: 'sale',
    flavors: ['Electric Blue Razz', 'Sour Apple Fury', 'Cosmic Watermelon'],
    sizes: ['300g (30 Servings)'],
    description: 'Extreme energy and laser focus matrix formulated with 350mg Caffeine Anhydrous, 6g pure L-Citrulline Malate for skin-splitting pumps, and 3.2g Beta-Alanine for endless endurance.',
    colorAccent: '#39ff14',
    iconType: 'jar-preworkout',
    nutrition: {
      servingSize: '10g (1 Scoop)',
      servingsPerContainer: 30,
      calories: 5,
      protein: '0g',
      carbs: '1.2g',
      fat: '0g',
      citrulline: '6,000mg',
      caffeine: '350mg'
    }
  },
  {
    id: 'creatine-x-force',
    name: 'Creatine X-Force',
    category: 'creatine',
    categoryLabel: 'Creatine',
    price: 999,
    originalPrice: 1299,
    weight: '300g',
    rating: 4.9,
    reviewCount: 340,
    badge: 'Pure Micronized',
    badgeType: 'default',
    flavors: ['Unflavored', 'Tangy Orange Punch'],
    sizes: ['300g (100 Servings)', '500g'],
    description: '100% ultra-micronized pharmaceutical grade Creatine Monohydrate (200 mesh). Increases intracellular hydration, elevates phosphocreatine stores, and powers max strength output.',
    colorAccent: '#00d4ff',
    iconType: 'tub-creatine',
    nutrition: {
      servingSize: '3g (1 Scoop)',
      servingsPerContainer: 100,
      calories: 0,
      protein: '0g',
      carbs: '0g',
      fat: '0g',
      creatine: '3,000mg'
    }
  },
  {
    id: 'bcaa-storm',
    name: 'BCAA Storm',
    category: 'bcaa',
    categoryLabel: 'BCAA & Electrolytes',
    price: 1299,
    originalPrice: 1699,
    weight: '400g',
    rating: 4.7,
    reviewCount: 115,
    badge: 'Intra-Workout',
    badgeType: 'neon',
    flavors: ['Lemon Lime Blast', 'Iced Berry Splash'],
    sizes: ['400g (40 Servings)'],
    description: 'Scientifically validated 2:1:1 vegan instantized BCAAs packed with raw coconut water powder and pink Himalayan sea salt for immediate intracellular recovery and hydration.',
    colorAccent: '#39ff14',
    iconType: 'tub-bcaa',
    nutrition: {
      servingSize: '10g (1 Scoop)',
      servingsPerContainer: 40,
      calories: 10,
      protein: '7g',
      carbs: '1g',
      fat: '0g',
      leucine: '3,500mg',
      electrolytes: '750mg'
    }
  },
  {
    id: 'mass-gainer-pro',
    name: 'Mass Gainer Pro',
    category: 'protein',
    categoryLabel: 'Mass Gainer',
    price: 3499,
    originalPrice: 4499,
    weight: '3kg',
    rating: 4.6,
    reviewCount: 98,
    badge: 'Heavy Calorie',
    badgeType: 'sale',
    flavors: ['Double Rich Chocolate', 'Cookies & Cream'],
    sizes: ['3kg', '5kg'],
    description: '1,150 clean anabolic calories per serving, 60g multi-stage protein matrix, and complex oat and sweet potato carbohydrates engineered for hardcore mass gains without fat spillover.',
    colorAccent: '#ff7700',
    iconType: 'tub-gainer',
    nutrition: {
      servingSize: '250g (3 Scoops)',
      servingsPerContainer: 12,
      calories: 1150,
      protein: '60g',
      carbs: '210g',
      fat: '7g',
      sugar: '12g'
    }
  },
  {
    id: 'glutamine-surge',
    name: 'Glutamine Surge',
    category: 'recovery',
    categoryLabel: 'Recovery',
    price: 799,
    originalPrice: 1099,
    weight: '250g',
    rating: 4.8,
    reviewCount: 87,
    badge: 'Cell Repair',
    badgeType: 'default',
    flavors: ['Unflavored', 'Berry Fusion'],
    sizes: ['250g (50 Servings)'],
    description: '100% pure fermented L-Glutamine powder to accelerate muscle glycogen restoration, decrease post-training soreness, and fortify the gastrointestinal gut microbiome.',
    colorAccent: '#00d4ff',
    iconType: 'tub-creatine',
    nutrition: {
      servingSize: '5g (1 Scoop)',
      servingsPerContainer: 50,
      calories: 0,
      protein: '5g',
      carbs: '0g',
      fat: '0g',
      glutamine: '5,000mg'
    }
  },
  {
    id: 'omega-force',
    name: 'Omega Force',
    category: 'vitamins',
    categoryLabel: 'Vitamins & Health',
    price: 599,
    originalPrice: 799,
    weight: '90 capsules',
    rating: 4.9,
    reviewCount: 143,
    badge: 'Triple Strength',
    badgeType: 'neon',
    flavors: ['Enteric Coated Lemon Softgels'],
    sizes: ['90 Softgels (30-day Supply)'],
    description: 'Ultra-pure molecularly distilled Norwegian wild fish oil providing 1000mg EPA and 500mg DHA per dose for cardiovascular health, neurological focus, and joint lubrication.',
    colorAccent: '#ffb703',
    iconType: 'bottle-softgels',
    nutrition: {
      servingSize: '3 Softgels',
      servingsPerContainer: 30,
      calories: 30,
      protein: '0g',
      carbs: '0g',
      fat: '3g',
      epa: '1,000mg',
      dha: '500mg'
    }
  },
  {
    id: 'night-recovery-complex',
    name: 'Night Recovery Complex',
    category: 'recovery',
    categoryLabel: 'Deep Sleep & GH',
    price: 1799,
    originalPrice: 2299,
    weight: '60 capsules',
    rating: 4.8,
    reviewCount: 76,
    badge: 'Anabolic Sleep',
    badgeType: 'sale',
    flavors: ['Vegetarian Capsules'],
    sizes: ['60 Capsules (30 Servings)'],
    description: 'High-potency night-time recovery catalyst with KSM-66® Ashwagandha, ZMA, 5-HTP, and Melatonin. Induces restorative deep REM sleep and optimizes nocturnal Growth Hormone synthesis.',
    colorAccent: '#9d4edd',
    iconType: 'bottle-capsules',
    nutrition: {
      servingSize: '2 Capsules',
      servingsPerContainer: 30,
      calories: 0,
      protein: '0g',
      carbs: '0g',
      fat: '0g',
      ashwagandha: '600mg',
      zma: '450mg'
    }
  }
];

function getProductSVG(type, accentColor = '#00d4ff') {
  if (type === 'tub-isolate') {
    return `
      <svg viewBox="0 0 160 210" width="160" height="210" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tubGrad-iso" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0e131d"/>
            <stop offset="35%" stop-color="#1e2638"/>
            <stop offset="70%" stop-color="#141926"/>
            <stop offset="100%" stop-color="#0a0c12"/>
          </linearGradient>
          <linearGradient id="labelGrad-iso" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#06080d"/>
            <stop offset="100%" stop-color="#161c28"/>
          </linearGradient>
        </defs>
        <rect x="42" y="16" width="76" height="18" rx="4" fill="#1b202c" stroke="#2a3348" stroke-width="1.5"/>
        <line x1="45" y1="22" x2="115" y2="22" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="4 2"/>
        <path d="M46 34 L114 34 L120 46 L40 46 Z" fill="#11151f" stroke="#222b3e"/>
        <rect x="25" y="46" width="110" height="145" rx="14" fill="url(#tubGrad-iso)" stroke="#2a354c" stroke-width="1.5"/>
        <line x1="26" y1="58" x2="134" y2="58" stroke="${accentColor}" stroke-width="2" opacity="0.8"/>
        <line x1="26" y1="178" x2="134" y2="178" stroke="${accentColor}" stroke-width="2" opacity="0.8"/>
        <rect x="30" y="66" width="100" height="104" rx="8" fill="url(#labelGrad-iso)" stroke="#222c3f"/>
        <polygon points="80,74 92,81 92,95 80,102 68,95 68,81" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
        <circle cx="80" cy="88" r="3.5" fill="${accentColor}"/>
        <text x="80" y="114" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="11" text-anchor="middle" letter-spacing="1">ISO MATRIX</text>
        <text x="80" y="125" fill="${accentColor}" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="8" text-anchor="middle">100% WHEY ISOLATE</text>
        <rect x="42" y="134" width="76" height="16" rx="3" fill="#0d111a" stroke="${accentColor}" stroke-width="0.8"/>
        <text x="80" y="145" fill="#39ff14" font-family="'Inter', sans-serif" font-weight="700" font-size="7.5" text-anchor="middle">27G PROTEIN | 0 SUGAR</text>
        <text x="80" y="160" fill="#64748b" font-family="'Inter', sans-serif" font-size="6.5" text-anchor="middle">VORTEX LABS PHARMA</text>
      </svg>
    `;
  } else if (type === 'jar-preworkout') {
    return `
      <svg viewBox="0 0 160 210" width="160" height="210" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="jarGrad-pre" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#141a12"/>
            <stop offset="50%" stop-color="#232e20"/>
            <stop offset="100%" stop-color="#0c110b"/>
          </linearGradient>
        </defs>
        <rect x="30" y="32" width="100" height="22" rx="4" fill="#182415" stroke="#39ff14" stroke-width="1.5"/>
        <line x1="36" y1="37" x2="124" y2="37" stroke="#39ff14" stroke-width="1" stroke-dasharray="3 3"/>
        <line x1="36" y1="44" x2="124" y2="44" stroke="#39ff14" stroke-width="1" stroke-dasharray="3 3"/>
        <rect x="22" y="54" width="116" height="130" rx="12" fill="url(#jarGrad-pre)" stroke="#2d3d29" stroke-width="1.5"/>
        <path d="M 24 70 L 40 70 L 48 85 L 112 85 L 120 70 L 136 70" fill="none" stroke="#39ff14" stroke-width="1.5" opacity="0.8"/>
        <rect x="30" y="88" width="100" height="84" rx="6" fill="#090e08" stroke="#1f2c1c"/>
        <text x="80" y="105" fill="#39ff14" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1">VORTEX PRE-X</text>
        <text x="80" y="117" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="8" text-anchor="middle">EXPLOSIVE PUMP FORMULA</text>
        <rect x="42" y="125" width="76" height="16" rx="3" fill="#152112" stroke="#39ff14" stroke-width="0.8"/>
        <text x="80" y="136" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="700" font-size="7" text-anchor="middle">350MG CAFFEINE | 6G CITRULLINE</text>
        <text x="80" y="156" fill="#39ff14" font-family="'Inter', sans-serif" font-size="6.5" text-anchor="middle">VORTEX HIGH-STIM MATRIX</text>
        <circle cx="80" cy="180" r="3" fill="#39ff14"/>
      </svg>
    `;
  } else if (type === 'tub-creatine' || type === 'tub-bcaa') {
    return `
      <svg viewBox="0 0 160 210" width="160" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect x="38" y="24" width="84" height="20" rx="4" fill="#1b202c" stroke="${accentColor}" stroke-width="1.5"/>
        <rect x="28" y="44" width="104" height="142" rx="12" fill="#121622" stroke="#252e42" stroke-width="1.5"/>
        <rect x="34" y="58" width="92" height="114" rx="8" fill="#0b0e15" stroke="${accentColor}" stroke-opacity="0.4"/>
        <polygon points="80,68 88,75 88,87 80,93 72,87 72,75" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
        <text x="80" y="110" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="11" text-anchor="middle" letter-spacing="1">MICRONIZED</text>
        <text x="80" y="122" fill="${accentColor}" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="8" text-anchor="middle">PURE CREAPURE® 200 MESH</text>
        <rect x="42" y="132" width="76" height="16" rx="3" fill="#141a27" stroke="${accentColor}" stroke-width="0.8"/>
        <text x="80" y="143" fill="#39ff14" font-family="'Inter', sans-serif" font-weight="700" font-size="7" text-anchor="middle">100% PURE CELL VOLUMIZER</text>
        <text x="80" y="160" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="6.5" text-anchor="middle">STITCH LABS CERTIFIED</text>
      </svg>
    `;
  } else if (type === 'tub-gainer') {
    return `
      <svg viewBox="0 0 160 210" width="160" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="12" width="88" height="24" rx="4" fill="#201a14" stroke="#ff7700" stroke-width="1.5"/>
        <rect x="20" y="36" width="120" height="160" rx="14" fill="#16120e" stroke="#3d2c1c" stroke-width="1.5"/>
        <rect x="28" y="52" width="104" height="126" rx="8" fill="#0d0a07" stroke="#ff7700" stroke-opacity="0.5"/>
        <text x="80" y="80" fill="#ff7700" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="14" text-anchor="middle">MASS GAINER</text>
        <text x="80" y="94" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="8.5" text-anchor="middle">PRO ANABOLIC CALORIES</text>
        <rect x="36" y="106" width="88" height="20" rx="4" fill="#24160a" stroke="#ff7700" stroke-width="1"/>
        <text x="80" y="119" fill="#ffaa33" font-family="'Inter', sans-serif" font-weight="700" font-size="7.5" text-anchor="middle">1,150 KCAL | 60G PROTEIN</text>
        <text x="80" y="145" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="600" font-size="7" text-anchor="middle">CLEAN COMPLEX CARBOHYDRATES</text>
        <text x="80" y="162" fill="#888888" font-family="'Inter', sans-serif" font-size="6.5" text-anchor="middle">VORTEX LABS MASS MATRIX</text>
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 160 210" width="160" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect x="52" y="22" width="56" height="20" rx="4" fill="#1b202c" stroke="${accentColor}" stroke-width="1.5"/>
        <rect x="36" y="42" width="88" height="146" rx="14" fill="#12151e" stroke="#252d3d" stroke-width="1.5"/>
        <rect x="42" y="58" width="76" height="112" rx="8" fill="#090b10" stroke="${accentColor}" stroke-opacity="0.4"/>
        <circle cx="80" cy="80" r="14" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
        <text x="80" y="85" fill="${accentColor}" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="14" text-anchor="middle">V</text>
        <text x="80" y="112" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-weight="800" font-size="10.5" text-anchor="middle">OMEGA FORCE</text>
        <text x="80" y="124" fill="${accentColor}" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="7.5" text-anchor="middle">MOLECULAR DISTILLED</text>
        <rect x="48" y="132" width="64" height="15" rx="3" fill="#141a27" stroke="${accentColor}" stroke-width="0.8"/>
        <text x="80" y="142" fill="#39ff14" font-family="'Inter', sans-serif" font-weight="700" font-size="6.5" text-anchor="middle">1000 EPA / 500 DHA</text>
        <text x="80" y="158" fill="#64748b" font-family="'Inter', sans-serif" font-size="6.5" text-anchor="middle">30 ULTRA SOFTGELS</text>
      </svg>
    `;
  }
}

// -------------------------------------------------------------
// 2. BACKEND API CLIENT WITH LOCALSTORAGE FALLBACK
// -------------------------------------------------------------
async function fetchProductsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // Backend offline; smoothly fall back to local dataset
  }
  return PRODUCTS_DATA;
}

// -------------------------------------------------------------
// 3. CART SYSTEM (LOCALSTORAGE + BACKEND POST)
// -------------------------------------------------------------
const CART_STORAGE_KEY = 'vortex_stitch_cart_v1';
const PROMO_STORAGE_KEY = 'vortex_stitch_promo_v1';

function initCart() {
  const existing = localStorage.getItem(CART_STORAGE_KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    const defaultCart = [
      {
        id: 'iso-matrix-isolate',
        name: 'ISO Matrix Isolate',
        price: 2999,
        quantity: 1,
        flavor: 'Chocolate Fudge',
        size: '2kg',
        iconType: 'tub-isolate',
        colorAccent: '#00d4ff'
      },
      {
        id: 'vortex-pre-workout',
        name: 'Vortex Pre-Workout',
        price: 1499,
        quantity: 1,
        flavor: 'Electric Blue Razz',
        size: '300g (30 Servings)',
        iconType: 'jar-preworkout',
        colorAccent: '#39ff14'
      }
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(defaultCart));
  }
  updateCartBadge();
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

async function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));

  // Post to backend cart endpoint asynchronously (graceful fallback)
  try {
    await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });
  } catch (e) {
    // LocalStorage keeps working flawlessly
  }
}

function addToCart(productId, quantity = 1, flavor = null, size = null) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const chosenFlavor = flavor || product.flavors[0];
  const chosenSize = size || product.sizes[0];

  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.id === productId && item.flavor === chosenFlavor && item.size === chosenSize
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      flavor: chosenFlavor,
      size: chosenSize,
      iconType: product.iconType,
      colorAccent: product.colorAccent
    });
  }

  saveCart(cart);
  showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
}

function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1);
    saveCart(cart);
    showToast(`Removed "${removed[0].name}" from cart`, 'info');
  }
}

function updateCartQuantity(index, delta) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

// -------------------------------------------------------------
// 4. TOAST NOTIFICATION SYSTEM
// -------------------------------------------------------------
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3200);
}

// -------------------------------------------------------------
// 5. MOBILE NAVIGATION MENU
// -------------------------------------------------------------
function setupMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      toggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

// -------------------------------------------------------------
// 6. QUICK VIEW MODAL
// -------------------------------------------------------------
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  let modalOverlay = document.getElementById('quickViewModal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'quickViewModal';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  modalOverlay.innerHTML = `
    <div class="modal-content" style="max-width: 760px;">
      <button class="modal-close-btn" onclick="closeQuickView()">✕</button>
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; align-items: center;">
        <div style="background: radial-gradient(circle, #1c2438 0%, #0d1017 80%); padding: 30px; border-radius: 14px; text-align: center; border: 1px solid var(--border-subtle);">
          ${getProductSVG(product.iconType, product.colorAccent)}
        </div>
        <div>
          <span style="color: var(--primary-blue); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">${product.categoryLabel}</span>
          <h2 style="font-size: 1.8rem; margin: 4px 0 10px 0; color: #ffffff;">${product.name}</h2>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
            <span style="color: #ffb703;">★★★★★</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">(${product.reviewCount} verified reviews)</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 14px; margin-bottom: 16px;">
            <span style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: #ffffff;">₹${product.price.toLocaleString('en-IN')}</span>
            <span style="font-size: 1.1rem; color: var(--text-muted); text-decoration: line-through;">₹${product.originalPrice.toLocaleString('en-IN')}</span>
            <span style="color: var(--neon-green); font-size: 0.85rem; font-weight: 700; background: rgba(57,255,20,0.1); padding: 2px 8px; border-radius: 4px;">${discountPercent}% OFF</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">${product.description}</p>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px;">Select Flavour</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="quickFlavors">
              ${product.flavors.map((f, i) => `
                <button type="button" class="chip-btn ${i === 0 ? 'active' : ''}" onclick="selectQuickChip(this)">${f}</button>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 22px;">
            <div class="qty-counter">
              <button class="qty-btn" onclick="changeQuickQty(-1)">-</button>
              <input type="text" id="quickQtyInput" class="qty-input" value="1" readonly />
              <button class="qty-btn" onclick="changeQuickQty(1)">+</button>
            </div>
            <button class="btn btn-primary" style="flex: 1;" onclick="submitQuickAddToCart('${product.id}')">
              Add to Cart • ₹${product.price.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
}

function closeQuickView() {
  const modalOverlay = document.getElementById('quickViewModal');
  if (modalOverlay) modalOverlay.classList.remove('open');
}

function selectQuickChip(btn) {
  btn.parentElement.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function changeQuickQty(delta) {
  const input = document.getElementById('quickQtyInput');
  if (!input) return;
  let val = parseInt(input.value, 10) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

function submitQuickAddToCart(productId) {
  const activeFlavor = document.querySelector('#quickFlavors .chip-btn.active');
  const flavor = activeFlavor ? activeFlavor.textContent.trim() : null;
  const qtyInput = document.getElementById('quickQtyInput');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;

  addToCart(productId, qty, flavor);
  closeQuickView();
}

// -------------------------------------------------------------
// 7. ORDER PLACEMENT API INTEGRATION
// -------------------------------------------------------------
async function placeOrderApi(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // backend offline, generate fallback client order confirmation
  }
  return {
    success: true,
    orderId: 'VTX-' + Math.floor(100000 + Math.random() * 900000),
    estimatedDelivery: '3-4 Business Days',
    message: 'Order placed successfully!'
  };
}

// -------------------------------------------------------------
// 8. BIOMETRICS API INTEGRATION
// -------------------------------------------------------------
async function calculateBiometricsApi(params) {
  try {
    const res = await fetch(`${API_BASE_URL}/biometric/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // backend offline, calculate with Mifflin-St Jeor formula
  }

  // Fallback client-side calculation
  const { weight, height, age, gender, activityLevel, goal } = params;
  
  // Mifflin-St Jeor formula
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'female' ? bmr - 161 : bmr + 5;

  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'very': 1.725,
    'extreme': 1.9
  };

  const multiplier = activityMultipliers[activityLevel] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  let proteinRatio = 2.0;

  if (goal === 'hypertrophy') {
    targetCalories = tdee + 400; // Lean surplus
    proteinRatio = 2.2;
  } else if (goal === 'fatloss') {
    targetCalories = tdee - 500; // Caloric deficit
    proteinRatio = 2.4;
  } else {
    // endurance
    targetCalories = tdee;
    proteinRatio = 1.8;
  }

  const dailyProtein = Math.round(weight * proteinRatio);
  const waterLiters = (weight * 0.04).toFixed(1);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    dailyProtein,
    waterLiters,
    recommendations: [
      `Consume ${dailyProtein}g protein across 4-5 meals daily`,
      `Optimal post-workout window: 1 scoop ISO Matrix Isolate within 45 mins`,
      `Stay hydrated with minimum ${waterLiters}L water daily`
    ]
  };
}

// -------------------------------------------------------------
// 9. GLOBAL INIT
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  setupMobileNav();

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeQuickView();
  });

  const modalOverlay = document.getElementById('quickViewModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeQuickView();
    });
  }
});
