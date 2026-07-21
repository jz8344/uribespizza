<template>
  <div class="volante-app">
    <!-- Ticker Superior Marquee -->
    <div class="ticker">
      <div class="ticker-track">
        <span>🔥 <b>URIBE'S PIZZA</b> — SERVICIO A DOMICILIO AL <b>333 599 2647</b></span>
        <span>🍕 <b>MEGA COMBOS</b> CON ORILLA 100% RELLENA DE QUESO</span>
        <span>📍 <b>LA FORTUNA</b>, TLAJOMULCO DE ZÚÑIGA, JALISCO</span>
        <span>🔥 <b>URIBE'S PIZZA</b> — SERVICIO A DOMICILIO AL <b>333 599 2647</b></span>
        <span>🍕 <b>MEGA COMBOS</b> CON ORILLA 100% RELLENA DE QUESO</span>
        <span>📍 <b>LA FORTUNA</b>, TLAJOMULCO DE ZÚÑIGA, JALISCO</span>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-inner">
        <a href="#" class="brand">
          <div class="brand-logo">🍕</div>
          <div class="brand-text">
            <div class="brand-name">URIBE'S <em>PIZZA</em></div>
            <div class="status-pill" :class="{ open: isOpen, closed: !isOpen }">
              <span class="status-dot"></span>
              <span>{{ isOpen ? '🟢 ABIERTO AHORA' : '🔴 CERRADO POR AHORA' }}</span>
            </div>
          </div>
        </a>

        <div class="nav-links-desktop">
          <a href="#menu">Combos</a>
          <a href="#menu">Alitas & Extras</a>
          <a href="#contacto">Horarios</a>
        </div>

        <div class="nav-cta">
          <button class="btn-cart-nav" @click="isCartOpen = true" aria-label="Ver Pedido">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span class="cart-count" :class="{ show: totalCartQty > 0 }">{{ totalCartQty }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
      <div class="container">
        <div class="hero-inner">
          <div class="hero-text">
            <div class="hero-tag"><i>¡EL COMBO PERFECTO</i> PARA COMPARTIR!</div>
            <h1>
              <span class="line w-red">SORPRÉNDETE</span>
              <span class="line w-outline">CON EL SABOR</span>
              <span class="line">DE NUESTRAS PIZZAS</span>
            </h1>
            <p class="hero-sub">Pizzas con orilla rellena de queso, alitas, nuggets, papas y Pepsi helada.</p>
            <p class="hero-desc">Servicio a domicilio rápido y calientito directo a tu hogar en el Fracc. La Fortuna.</p>
            
            <div class="hero-ctas">
              <a href="https://wa.me/523335992647" target="_blank" class="btn btn-wa">
                📱 PEDIR AL 333 599 2647
              </a>
              <a href="#menu" class="btn btn-ink">
                🍕 VER COMBOS
              </a>
            </div>

            <div class="hero-badges">
              <span class="stamp">🧀 Orilla <b>100% Queso</b></span>
              <span class="stamp">🚀 Entrega <b>Rápida</b></span>
              <span class="stamp">⭐ Sabor <b>Artesanal</b></span>
            </div>
          </div>

          <!-- Poster Hero con Cinta Adhesiva -->
          <div class="hero-flyer" @click="openLightbox('/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (3).jpeg')">
            <div class="tape tape-tl"></div>
            <div class="tape tape-br"></div>
            <div class="price-splash">
              <small>DESDE</small>
              <div class="num">$245</div>
            </div>
            <div class="paper-photo">
              <img src="/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (3).jpeg" alt="Mega Combo Uribe's Pizza">
              <figcaption class="marker">Mega Combo Orilla de Queso</figcaption>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Separador ZigZag -->
    <div class="rip"></div>

    <!-- Sección de Menú de Combos (Fondo Oscuro Volante) -->
    <section id="menu" class="menu-sec">
      <div class="container">
        <div class="sec-head">
          <span class="sec-kicker">¡DIRECTO DEL VOLANTE OFICIAL!</span>
          <h2 class="sec-title">NUESTROS <span class="red">COMBOS OFICIALES</span></h2>
          <p class="sec-note">Elige tu combinación favorita y haz tu pedido en 1 clic por WhatsApp.</p>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            class="filter-btn" 
            :class="{ active: activeFilter === cat.id }"
            @click="activeFilter = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Grid de Flyers -->
        <div class="combos-grid">
          <article 
            v-for="combo in filteredCombos" 
            :key="combo.id" 
            class="flyer-card"
          >
            <div class="tape"></div>
            <div class="flyer-img" @click="openLightbox(combo.image)">
              <img :src="combo.image" :alt="combo.title">
              <span class="zoom-hint">🔍 Toca para ampliar</span>
              <div class="combo-tag">{{ combo.badge }}</div>
              <div class="price-tag">${{ combo.price }}</div>
            </div>
            <div class="flyer-body">
              <h3 class="flyer-name">{{ combo.title }}</h3>
              <span class="incluye-label">INCLUYE:</span>
              <ul class="flyer-includes">
                <li v-for="(inc, idx) in combo.includes" :key="idx">{{ inc }}</li>
              </ul>
              <button class="btn-add" @click="addToCart(combo)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                AGREGAR AL PEDIDO
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Separador ZigZag Invertido -->
    <div class="rip flip"></div>

    <!-- Ticker Intermedio -->
    <div class="mid-ticker">
      <span>🍕 ORILLA RELLENA DE QUESO • ALITAS JUGOSAS • NUGGETS CRUJIETES • PAPAS A LA FRANCESA • CANELAZOS • PEPSI HELADA • 🍕 ORILLA RELLENA DE QUESO</span>
    </div>

    <!-- Horarios y Ubicación -->
    <section id="contacto" class="info-sec">
      <div class="container">
        <div class="info-grid">
          <div class="info-card">
            <h3 class="marker">🕒 Horarios de Atención</h3>
            <p><strong>Lunes a Viernes:</strong> 3:00 PM – 10:30 PM</p>
            <p><strong>Sábado y Domingo:</strong> 1:00 PM – 10:30 PM</p>
            <p style="color: var(--red); font-weight:700; margin-top:6px;">Martes: CERRADO</p>
          </div>

          <div class="info-card">
            <h3 class="marker">📍 Ubicación & Envíos</h3>
            <p>De la Bendición #429, Fracc. La Fortuna, Jalisco.</p>
            <p><strong>Cobertura:</strong> Fracc. La Fortuna y zonas aledañas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Drawer del Carrito -->
    <div class="cart-overlay" :class="{ show: isCartOpen }" @click.self="isCartOpen = false">
      <div class="cart-panel">
        <div class="cart-header">
          <h3>TU PEDIDO ({{ totalCartQty }})</h3>
          <button class="close-btn" @click="isCartOpen = false">&times;</button>
        </div>

        <div class="cart-body">
          <div v-if="cartItems.length === 0" class="cart-empty">
            <span class="big">🍕</span>
            Tu pedido está vacío.<br>Agrega un combo desde el menú.
          </div>

          <div v-else class="cart-list">
            <div v-for="item in cartItems" :key="item.combo.id" class="cart-item">
              <div class="ci-info">
                <div class="ci-name">{{ item.combo.title }}</div>
                <div class="ci-price">${{ item.combo.price }} c/u</div>
              </div>
              <div class="ci-qty">
                <button @click="changeQty(item.combo.id, -1)">−</button>
                <span>{{ item.qty }}</span>
                <button @click="changeQty(item.combo.id, 1)">+</button>
              </div>
            </div>

            <!-- Formulario Cliente -->
            <div class="cust-form">
              <h4>DATOS DE ENTREGA</h4>
              <input type="text" v-model="custName" placeholder="Tu Nombre (Ej. Juan Perez)">
              <textarea v-model="custAddress" rows="2" placeholder="Dirección completa y referencias en La Fortuna"></textarea>
              <input type="text" v-model="custNotes" placeholder="Notas adicionales (Ej. Refresco muy frío)">
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span>TOTAL:</span>
            <span>${{ cartTotal }}</span>
          </div>
          <button class="btn btn-wa" :disabled="cartItems.length === 0" @click="sendWhatsAppOrder">
            📱 ENVIAR PEDIDO A WHATSAPP
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div class="lightbox" :class="{ show: !!lightboxImg }" @click="lightboxImg = null">
      <div class="lightbox-box" v-if="lightboxImg">
        <button class="lightbox-close">&times;</button>
        <img :src="lightboxImg" alt="Volante Uribe's Pizza Ampliado">
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" :class="{ show: toastMsg }">
      <span>🍕</span> {{ toastMsg }}
    </div>

    <!-- Footer -->
    <footer>
      <p>&copy; 2026 Uribe's Pizza • Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const COMBOS = [
  {
    id: 1,
    title: "Mega Combo Orilla de Queso",
    price: 245,
    badge: "MÁS VENDIDO 🔥",
    cats: ["grandes"],
    image: "/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (3).jpeg",
    includes: ["Pizza Grande Orilla de Queso", "Papas a la Francesa", "Refresco 1.5L Pepsi"]
  },
  {
    id: 2,
    title: "Combo Familiar Dulce & Salado",
    price: 280,
    badge: "COMPLETO 👨‍🍳",
    cats: ["grandes"],
    image: "/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (5).jpeg",
    includes: ["1 Pizza Familiar (12 Rebanadas)", "1 Pan de Ajo y Parmesano", "1 Canelaso (Postre)"]
  },
  {
    id: 3,
    title: "Combo Familiar Queso & Nuggets",
    price: 290,
    badge: "FAVORITO 🍗",
    cats: ["alitas", "grandes"],
    image: "/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (4).jpeg",
    includes: ["1 Pizza Familiar (Orilla Rellena de Queso)", "Paquete de Nuggets", "Refresco 1.5L Pepsi"]
  },
  {
    id: 4,
    title: "Combo Familiar Alitas",
    price: 310,
    badge: "RECOMENDADO 🌶️",
    cats: ["alitas", "grandes"],
    image: "/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (1).jpeg",
    includes: ["1 Pizza Familiar (12 Rebanadas)", "Orden de Alitas Jugosas", "Refresco 1.5L Pepsi"]
  },
  {
    id: 5,
    title: "Combo Jumbo Nuggets",
    price: 320,
    badge: "JUMBO SIZE ⚡",
    cats: ["grandes"],
    image: "/Images/WhatsApp Interactive 2026-07-21 at 2.18.43 PM.jpeg",
    includes: ["1 Pizza Jumbo Orilla de Queso", "Orden de Nuggets", "Refresco 1.5L Pepsi"]
  },
  {
    id: 6,
    title: "Combo Familiar 2 Pizzas",
    price: 340,
    badge: "DOBLE SABOR 🍕🍕",
    cats: ["grandes"],
    image: "/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM (2).jpeg",
    includes: ["2 Pizzas Grandes (8 rebanadas c/u)", "Papas a la Francesa", "Refresco 1.5L Pepsi"]
  },
  {
    id: 7,
    title: "Combo Jumbo Alitas",
    price: 345,
    badge: "PARA COMPARTIR 🎉",
    cats: ["alitas", "grandes"],
    image: "/Images/WhatsApp Image 2026-07-21 at 2.31.04 PM.jpeg",
    includes: ["1 Pizza Jumbo (16 Rebanadas)", "Orden de Alitas", "Refresco 1.5L Pepsi"]
  },
  {
    id: 8,
    title: "Combo Mega Supremo Alitas",
    price: 365,
    badge: "EL REY 👑",
    cats: ["alitas", "grandes"],
    image: "/Images/WhatsApp Interactive 2026-07-21 at ss2.18.43 PM.jpeg",
    includes: ["1 Pizza Mega Orilla de Queso", "Alitas Deliciosas", "Refresco 1.5L Pepsi"]
  }
]

const categories = [
  { id: 'todos', label: 'TODOS LOS COMBOS' },
  { id: 'grandes', label: 'COMBOS GRANDES' },
  { id: 'alitas', label: 'CON ALITAS / NUGGETS' }
]

const activeFilter = ref('todos')
const cart = ref(new Map()) // id -> qty
const isCartOpen = ref(false)
const lightboxImg = ref(null)
const toastMsg = ref('')
const isOpen = ref(true)

const custName = ref('')
const custAddress = ref('')
const custNotes = ref('')

let toastTimer = null

const filteredCombos = computed(() => {
  if (activeFilter.value === 'todos') return COMBOS
  return COMBOS.filter(c => c.cats.includes(activeFilter.value))
})

const cartItems = computed(() => {
  const list = []
  for (const [id, qty] of cart.value.entries()) {
    const combo = COMBOS.find(c => c.id === id)
    if (combo) list.push({ combo, qty })
  }
  return list
})

const totalCartQty = computed(() => {
  let count = 0
  for (const qty of cart.value.values()) count += qty
  return count
})

const cartTotal = computed(() => {
  let total = 0
  for (const [id, qty] of cart.value.entries()) {
    const combo = COMBOS.find(c => c.id === id)
    if (combo) total += combo.price * qty
  }
  return total
})

function addToCart(combo) {
  const current = cart.value.get(combo.id) || 0
  cart.value.set(combo.id, current + 1)
  showToast(`${combo.title} agregado al pedido`)
}

function changeQty(id, delta) {
  const q = (cart.value.get(id) || 0) + delta
  if (q <= 0) cart.value.delete(id)
  else cart.value.set(id, q)
}

function showToast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMsg.value = ''
  }, 2200)
}

function openLightbox(img) {
  lightboxImg.value = img
}

function checkSchedule() {
  const now = new Date()
  const day = now.getDay() // 0=Dom, 2=Mar
  const mins = now.getHours() * 60 + now.getMinutes()
  
  if (day === 2) {
    isOpen.value = false // Martes cerrado
    return
  }
  const openMins = (day === 0 || day === 6) ? 13 * 60 : 15 * 60
  const closeMins = 22 * 60 + 30
  isOpen.value = mins >= openMins && mins < closeMins
}

function sendWhatsAppOrder() {
  if (cartItems.value.length === 0) return

  const lines = ["🍕 *¡HOLA URIBE'S PIZZA! QUISIERA PEDIR:*", ""]
  cartItems.value.forEach(item => {
    lines.push(`• *${item.qty}x ${item.combo.title}* ($${item.combo.price} c/u) = *$${item.combo.price * item.qty}*`)
  })
  lines.push("", `💰 *TOTAL A PAGAR: $${cartTotal.value}*`)
  if (custName.value.trim()) lines.push(`👤 *Nombre:* ${custName.value.trim()}`)
  if (custAddress.value.trim()) lines.push(`📍 *Dirección:* ${custAddress.value.trim()}`)
  if (custNotes.value.trim()) lines.push(`📝 *Notas:* ${custNotes.value.trim()}`)
  lines.push("", "¡Quedo atento a la confirmación!")

  window.open(`https://wa.me/523335992647?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
}

let scheduleInterval = null
onMounted(() => {
  checkSchedule()
  scheduleInterval = setInterval(checkSchedule, 60000)
})

onUnmounted(() => {
  clearInterval(scheduleInterval)
})
</script>

<style>
/* ══════════════════════════════════════════════════════════
   URIBE'S PIZZA — "Volante Callejero" Design System Vue
   Estética de los flyers reales: papel impreso,
   brochazos rojo/negro, tipografía póster Anton & Permanent Marker.
══════════════════════════════════════════════════════════ */
:root {
  --paper: #f5f1e8;
  --paper-2: #ece7db;
  --ink: #141416;
  --ink-soft: #3a3a40;
  --red: #E50914;
  --red-deep: #B00710;
  --gold: #FFB703;
  --green: #008C45;
  --white: #ffffff;
  --font-poster: 'Anton', sans-serif;
  --font-brush: 'Permanent Marker', cursive;
  --font-body: 'Inter', sans-serif;
  --shadow-card: 0 18px 40px -16px rgba(20,20,22,.35);
  --nav-h: 74px;
  --rough: 255px 18px 225px 18px / 18px 225px 18px 255px;
  --rough-2: 18px 225px 18px 255px / 255px 18px 225px 18px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--paper);
  color: var(--ink);
  line-height: 1.6;
  overflow-x: hidden;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}
img { max-width: 100%; display: block; }
button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }

.container { width: min(1200px, 92%); margin-inline: auto; }
.marker { font-family: var(--font-brush); }

/* Ticker */
.ticker {
  background: var(--ink); color: var(--paper);
  overflow: hidden; white-space: nowrap;
  font-family: var(--font-poster);
  font-size: .84rem; letter-spacing: .14em;
  padding: 9px 0; border-bottom: 3px solid var(--red);
}
.ticker-track { display: inline-flex; animation: ticker 28s linear infinite; }
.ticker-track span { padding: 0 26px; display: inline-flex; align-items: center; gap: 10px; }
.ticker-track b { color: var(--gold); }
@keyframes ticker { to { transform: translateX(-50%); } }

/* Navbar */
.navbar {
  position: sticky; top: 0; z-index: 900;
  height: var(--nav-h);
  background: rgba(245,241,232,.94);
  backdrop-filter: blur(10px);
  border-bottom: 3px solid var(--ink);
  display: flex; align-items: center;
}
.nav-inner { width: min(1200px, 94%); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.brand-logo {
  width: 48px; height: 48px; border-radius: 50%;
  background: conic-gradient(from 200deg, var(--green) 0 33%, #fff 33% 66%, var(--red) 66% 100%);
  display: grid; place-items: center; font-size: 25px;
  border: 3px solid var(--ink); box-shadow: 3px 3px 0 var(--ink);
}
.brand-name { font-family: var(--font-poster); font-size: 1.3rem; letter-spacing: .02em; }
.brand-name em { font-style: normal; color: var(--red); }
.status-pill { display: inline-flex; align-items: center; gap: 6px; font-size: .66rem; font-weight: 800; color: var(--ink-soft); }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #999; }
.status-pill.open { color: #0a7d3c; }
.status-pill.open .status-dot { background: #16a34a; box-shadow: 0 0 8px #16a34a; }
.status-pill.closed { color: var(--red-deep); }
.status-pill.closed .status-dot { background: var(--red); }

.nav-links-desktop { display: flex; gap: 18px; }
.nav-links-desktop a { font-family: var(--font-poster); font-size: 1rem; text-decoration: none; text-transform: uppercase; color: var(--ink-soft); }

.btn-cart-nav {
  position: relative; width: 48px; height: 48px;
  background: var(--ink); color: #fff; border-radius: 12px;
  display: grid; place-items: center; box-shadow: 3px 3px 0 var(--red);
}
.btn-cart-nav svg { width: 22px; height: 22px; stroke: #fff; }
.cart-count {
  position: absolute; top: -8px; right: -8px;
  min-width: 22px; height: 22px; padding: 0 5px;
  background: var(--gold); color: var(--ink);
  border: 2px solid var(--ink); border-radius: 100px;
  font-weight: 800; font-size: .72rem; display: grid; place-items: center;
  transform: scale(0); transition: transform .25s ease;
}
.cart-count.show { transform: scale(1); }

/* Hero */
.hero { position: relative; padding: 64px 0 84px; overflow: hidden; }
.hero-inner { display: grid; grid-template-columns: 1.05fr .95fr; gap: 56px; align-items: center; }
.hero-tag {
  font-family: var(--font-brush); font-size: 1.15rem;
  background: var(--ink); color: var(--paper);
  display: inline-block; padding: .35em .9em; border-radius: var(--rough-2);
  transform: rotate(-2deg); box-shadow: 5px 5px 0 var(--red); margin-bottom: 24px;
}
.hero-tag i { font-style: normal; color: var(--gold); }
.hero h1 { font-family: var(--font-poster); text-transform: uppercase; font-size: clamp(3.2rem, 7.5vw, 6.2rem); line-height: .94; margin-bottom: 12px; }
.hero h1 .line { display: block; }
.hero h1 .w-red { color: var(--red); text-shadow: 3px 3px 0 var(--ink); }
.hero h1 .w-outline { color: var(--paper); -webkit-text-stroke: 2.5px var(--ink); text-shadow: 4px 4px 0 var(--gold); }
.hero-sub { font-family: var(--font-brush); font-size: 1.25rem; color: var(--red-deep); margin-bottom: 16px; transform: rotate(-1deg); }
.hero-desc { color: var(--ink-soft); max-width: 480px; margin-bottom: 28px; }
.hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 30px; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  font-family: var(--font-poster); text-transform: uppercase; font-size: 1.02rem;
  padding: 16px 28px; border: 3px solid var(--ink); border-radius: 14px; text-decoration: none;
  transition: transform .18s, box-shadow .18s;
}
.btn-wa { background: #22C55E; color: #fff; box-shadow: 5px 5px 0 var(--ink); }
.btn-wa:hover { transform: translate(-3px, -3px); box-shadow: 8px 8px 0 var(--ink); }
.btn-ink { background: var(--paper); color: var(--ink); box-shadow: 5px 5px 0 var(--red); }
.btn-ink:hover { transform: translate(-3px, -3px); box-shadow: 8px 8px 0 var(--red); }

.hero-badges { display: flex; gap: 10px; flex-wrap: wrap; }
.stamp {
  font-weight: 700; font-size: .8rem; background: var(--white);
  border: 2px dashed var(--ink); padding: 8px 14px; border-radius: 100px; transform: rotate(-1deg);
}

.hero-flyer { position: relative; transform: rotate(2.5deg); cursor: pointer; }
.hero-flyer .paper-photo {
  background: #fff; padding: 14px 14px 18px; border: 1px solid rgba(20,20,22,.12);
  box-shadow: var(--shadow-card); transition: transform .35s;
}
.hero-flyer:hover .paper-photo { transform: rotate(-2deg) scale(1.02); }
.hero-flyer img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.tape {
  position: absolute; width: 110px; height: 32px;
  background: rgba(255,224,130,.8); border-left: 1px dashed rgba(0,0,0,.15); border-right: 1px dashed rgba(0,0,0,.15);
  box-shadow: 0 3px 8px rgba(0,0,0,.12); z-index: 5;
}
.tape-tl { top: -14px; left: -30px; transform: rotate(-38deg); }
.tape-br { bottom: -12px; right: -30px; transform: rotate(-42deg); }
.price-splash {
  position: absolute; right: -24px; top: -28px; z-index: 6;
  background: var(--red); color: #fff; font-family: var(--font-poster);
  width: 110px; height: 110px; border-radius: 50%; display: grid; place-items: center; text-align: center;
  border: 4px solid var(--ink); box-shadow: 5px 5px 0 rgba(20,20,22,.9); transform: rotate(10deg);
}
.price-splash .num { font-size: 2rem; line-height: 1; }

.rip {
  height: 26px; background: var(--ink);
  clip-path: polygon(0 55%,3% 20%,7% 60%,11% 25%,15% 65%,19% 20%,23% 55%,27% 30%,31% 70%,35% 25%,39% 60%,43% 20%,47% 65%,51% 30%,55% 60%,59% 22%,63% 68%,67% 28%,71% 58%,75% 20%,79% 66%,83% 30%,87% 60%,91% 22%,95% 62%,100% 30%,100% 100%,0 100%);
}
.rip.flip { transform: scaleY(-1); }

/* Menú Sección */
.menu-sec {
  background: var(--ink); color: var(--paper); padding: 80px 0 90px; position: relative;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}
.sec-head { text-align: center; max-width: 700px; margin: 0 auto 30px; }
.sec-kicker { font-family: var(--font-brush); font-size: 1.15rem; color: var(--gold); display: inline-block; transform: rotate(-2deg); margin-bottom: 12px; }
.sec-title { font-family: var(--font-poster); text-transform: uppercase; font-size: clamp(2.4rem, 5.5vw, 4.2rem); line-height: .96; }
.sec-title .red { color: var(--red); }
.sec-note { color: #b9b9c0; margin-top: 10px; }

.filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 30px 0 45px; }
.filter-btn {
  font-family: var(--font-poster); text-transform: uppercase; font-size: .92rem;
  padding: 11px 22px; background: transparent; color: #cfcfd6;
  border: 2px solid rgba(245,241,232,.35); border-radius: 100px; transition: all .2s;
}
.filter-btn.active {
  background: var(--red); color: #fff; border-color: var(--red);
  box-shadow: 4px 4px 0 rgba(245,241,232,.25); transform: rotate(-2deg) scale(1.05);
}

.combos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 44px 34px; }
.flyer-card {
  background: #fdfcf9; color: var(--ink); padding: 13px 13px 0; box-shadow: 0 24px 50px -18px rgba(0,0,0,.65);
  position: relative; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,.08); transition: transform .3s, box-shadow .3s;
}
.combos-grid .flyer-card:nth-child(odd) { transform: rotate(-1.4deg); }
.combos-grid .flyer-card:nth-child(even) { transform: rotate(1.2deg); }
.combos-grid .flyer-card:hover { transform: rotate(0deg) translateY(-10px) scale(1.02); box-shadow: 0 34px 70px -18px rgba(229,9,20,.45); z-index: 5; }

.flyer-img { position: relative; aspect-ratio: 1; cursor: zoom-in; }
.flyer-img img { width: 100%; height: 100%; object-fit: cover; }
.zoom-hint { position: absolute; right: 10px; bottom: 10px; background: rgba(20,20,22,.85); color: #fff; font-size: .68rem; padding: 5px 10px; border-radius: 100px; opacity: 0; transition: opacity .2s; }
.flyer-card:hover .zoom-hint { opacity: 1; }

.combo-tag { position: absolute; top: 12px; left: 12px; font-family: var(--font-brush); font-size: .82rem; background: var(--ink); color: var(--gold); padding: 5px 13px; border-radius: var(--rough-2); transform: rotate(-3deg); box-shadow: 3px 3px 0 var(--red); }
.price-tag { position: absolute; right: -10px; bottom: -16px; font-family: var(--font-poster); background: var(--red); color: #fff; font-size: 1.75rem; padding: 10px 18px 8px; border: 3px solid var(--ink); border-radius: var(--rough); transform: rotate(3deg); box-shadow: 4px 4px 0 var(--ink); }

.flyer-body { padding: 24px 10px 16px; display: flex; flex-direction: column; flex: 1; }
.flyer-name { font-family: var(--font-poster); text-transform: uppercase; font-size: 1.28rem; margin-bottom: 10px; }
.incluye-label { font-family: var(--font-brush); font-size: .8rem; color: var(--red-deep); margin-bottom: 6px; }
.flyer-includes { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; flex: 1; }
.flyer-includes li { font-size: .86rem; color: var(--ink-soft); display: flex; gap: 8px; }
.flyer-includes li::before { content: "■"; color: var(--red); font-size: .6rem; }

.btn-add {
  font-family: var(--font-poster); text-transform: uppercase; font-size: .95rem; width: 100%;
  background: var(--ink); color: #fff; padding: 14px; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 9px;
  box-shadow: 4px 4px 0 var(--red); transition: transform .18s, box-shadow .18s;
}
.btn-add:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--red); }

.mid-ticker { background: var(--red); color: #fff; border-top: 3px solid var(--ink); border-bottom: 3px solid var(--ink); font-family: var(--font-poster); font-size: 1.05rem; padding: 13px 0; overflow: hidden; white-space: nowrap; }

.info-sec { padding: 70px 0; background: var(--paper); }
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
.info-card { background: #fff; padding: 30px; border: 3px solid var(--ink); border-radius: 18px; box-shadow: 6px 6px 0 var(--ink); }
.info-card h3 { font-size: 1.4rem; margin-bottom: 12px; color: var(--red-deep); }

/* Cart Drawer */
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 2000; opacity: 0; pointer-events: none; transition: opacity .3s; }
.cart-overlay.show { opacity: 1; pointer-events: auto; }
.cart-panel { position: fixed; top: 0; right: -460px; width: 100%; max-width: 440px; height: 100vh; background: var(--paper); border-left: 4px solid var(--ink); display: flex; flex-direction: column; transition: right .35s cubic-bezier(.16,1,.3,1); }
.cart-overlay.show .cart-panel { right: 0; }

.cart-header { padding: 20px 24px; border-bottom: 3px solid var(--ink); display: flex; justify-content: space-between; align-items: center; font-family: var(--font-poster); font-size: 1.5rem; }
.close-btn { font-size: 2rem; }
.cart-body { padding: 24px; overflow-y: auto; flex: 1; }
.cart-empty { text-align: center; padding: 40px; color: var(--ink-soft); }
.cart-empty .big { font-size: 3rem; display: block; margin-bottom: 10px; }
.cart-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px dashed rgba(0,0,0,.2); }
.ci-name { font-family: var(--font-poster); font-size: 1.05rem; }
.ci-price { font-size: .85rem; color: var(--red); font-weight: 700; }
.ci-qty { display: flex; align-items: center; gap: 8px; background: var(--ink); color: #fff; padding: 4px 10px; border-radius: 8px; font-weight: 800; }

.cust-form { margin-top: 24px; padding-top: 20px; border-top: 2px solid var(--ink); }
.cust-form h4 { font-family: var(--font-poster); margin-bottom: 12px; font-size: 1.1rem; }
.cust-form input, .cust-form textarea { width: 100%; padding: 11px; margin-bottom: 10px; border: 2px solid var(--ink); border-radius: 8px; font-family: inherit; }

.cart-footer { padding: 20px 24px; border-top: 3px solid var(--ink); background: var(--paper-2); }
.cart-total { display: flex; justify-content: space-between; font-family: var(--font-poster); font-size: 1.6rem; margin-bottom: 14px; }

/* Lightbox & Toast */
.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity .3s; }
.lightbox.show { opacity: 1; pointer-events: auto; }
.lightbox-box img { max-width: 90vw; max-height: 85vh; border: 4px solid var(--gold); border-radius: 12px; }

.toast { position: fixed; bottom: 24px; right: 24px; z-index: 2500; background: var(--ink); color: #fff; padding: 14px 22px; border-radius: 12px; border: 2px solid var(--red); font-family: var(--font-poster); font-size: 1rem; transform: translateY(100px); transition: transform .3s; }
.toast.show { transform: translateY(0); }

footer { text-align: center; padding: 30px; font-size: .85rem; color: var(--ink-soft); border-top: 2px solid var(--ink); background: var(--paper-2); }

@media (max-width: 850px) {
  .hero-inner { grid-template-columns: 1fr; }
  .nav-links-desktop { display: none; }
}
</style>
