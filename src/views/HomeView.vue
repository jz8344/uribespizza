<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import PizzaSvg from '../components/PizzaSvg.vue'

/* ══════════════════════════════════════════════
   DATOS — combos con sus volantes reales
══════════════════════════════════════════════ */
const IMG = '/Images/'
const WA_PHONE = '523335992647'

const COMBOS = [
  {
    id: 'mega-orilla-queso', name: 'Mega Combo Orilla de Queso', price: 245,
    img: IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (3).jpeg',
    cats: ['todos'], tag: '¡el más económico!',
    includes: ['Pizza Grande con Orilla de Queso', 'Papas a la Francesa', 'Refresco 1.5 L Pepsi']
  },
  {
    id: 'familiar-dulce-salado', name: 'Combo Familiar Dulce & Salado', price: 280,
    img: IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (5).jpeg',
    cats: ['familiar'], tag: '¡con postre!',
    includes: ['1 Pizza Familiar · 12 rebanadas', '1 Pan de Ajo y Parmesano', '1 Canelaso (postre)']
  },
  {
    id: 'familiar-queso-nuggets', name: 'Combo Familiar Queso & Nuggets', price: 290,
    img: IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (4).jpeg',
    cats: ['familiar'], tag: 'orilla rellena',
    includes: ['1 Pizza Familiar · 12 rebanadas', 'Orilla Rellena de Queso', 'Paquete de Nuggets', 'Refresco 1.5 L Pepsi']
  },
  {
    id: 'familiar-alitas', name: 'Combo Familiar Alitas', price: 310,
    img: IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (1).jpeg',
    cats: ['familiar', 'alitas'], tag: '¡el más vendido!',
    includes: ['1 Pizza Familiar · 12 rebanadas', 'Orden de Alitas', 'Refresco 1.5 L Pepsi']
  },
  {
    id: 'jumbo-nuggets', name: 'Combo Jumbo Nuggets', price: 320,
    img: IMG + 'WhatsApp Interactive 2026-07-21 at 2.18.43 PM.jpeg',
    cats: ['jumbo'], tag: '¡más grande, más sabrosa!',
    includes: ['1 Pizza Jumbo con Orilla de Queso', 'Orden de Nuggets', 'Refresco 1.5 L Pepsi']
  },
  {
    id: 'familiar-2-pizzas', name: 'Combo Familiar 2 Pizzas', price: 340,
    img: IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (2).jpeg',
    cats: ['familiar'], tag: 'doble sabor',
    includes: ['2 Pizzas Grandes · 8 rebanadas c/u', 'Papas a la Francesa', 'Refresco 1.5 L Pepsi']
  },
  {
    id: 'jumbo-alitas', name: 'Combo Jumbo Alitas', price: 345,
    img: IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM.jpeg',
    cats: ['jumbo', 'alitas'], tag: '16 rebanadas',
    includes: ['1 Pizza Jumbo · 16 rebanadas', 'Orden de Alitas', 'Refresco 1.5 L Pepsi']
  },
  {
    id: 'mega-supremo-alitas', name: 'Combo Mega Supremo Alitas', price: 365,
    img: IMG + 'WhatsApp Interactive 202aa6-07-21 ssss2.18.43 PM.jpeg',
    cats: ['alitas'], tag: 'el rey de la casa',
    includes: ['Pizza Mega con Orilla de Queso', 'Alitas Deliciosas', 'Refresco 1.5 L Pepsi']
  }
]

const money = (n) => '$' + n.toLocaleString('es-MX')

/* ══════════════════════════════════════════════
   CARTA — menú real del cliente (precios oficiales)
══════════════════════════════════════════════ */
// Pizzas por tamaño · precio individual · 2× promo · costo extra de orilla de queso
const PIZZAS = [
  { size: 'Chica',    price: 90,  duo: null, orilla: 20 },
  { size: 'Mediana',  price: 120, duo: null, orilla: 20 },
  { size: 'Grande',   price: 145, duo: 270,  orilla: 25 },
  { size: 'Familiar', price: 160, duo: 300,  orilla: 30 },
  { size: 'Jumbo',    price: 185, duo: 350,  orilla: 35 },
  { size: 'Mega',     price: 210, duo: 400,  orilla: 35 },
  { size: 'Cuadrada', price: 220, duo: 430,  orilla: 40 },
  { size: 'Calzone',  price: 75,  duo: null, orilla: null }
]

const SNACKS = [
  { name: 'Alitas',            price: 85, note: 'BBQ · Búfalo · Mango habanero', icon: '🍗' },
  { name: 'Nuggets',           price: 65, icon: '🧆' },
  { name: 'Aros de cebolla',   price: 65, icon: '🧅' },
  { name: 'Hamburguesa',       price: 75, icon: '🍔' },
  { name: 'Papas gajo',        price: 50, icon: '🥔' },
  { name: 'Papas a la francesa', price: 45, icon: '🍟' },
  { name: 'Canelasos',         price: 65, icon: '🍩' },
  { name: 'Pan de ajo',        price: 65, icon: '🥖' },
  { name: 'Hot dog',           price: 30, icon: '🌭' }
]

// Especialidades ya armadas · extra = costo adicional sobre el precio de la pizza
const ESPECIALIDADES = [
  { name: 'Hawaiana',     ings: ['Jamón', 'Piña'], extra: null },
  { name: 'Carnes Frías', ings: ['Jamón', 'Salami', 'Salchicha'], extra: null },
  { name: 'Italiana',     ings: ['Jamón', 'Piña', 'Salchicha'], extra: null },
  { name: 'Mexicana',     ings: ['Chorizo', 'Tocino', 'Jalapeño'], extra: null },
  { name: 'Ranchera',     ings: ['Chorizo', 'Tocino', 'Jitomate', 'Cebolla', 'Jalapeño'], extra: null },
  { name: 'Vegetariana',  ings: ['Piña', 'Elote', 'Morrón', 'Champiñón'], extra: null },
  { name: 'Carnívora',    ings: ['Jamón', 'Salami', 'Salchicha', 'Chorizo', 'Tocino', 'Peperoni'], extra: 20 },
  { name: 'Especial',     ings: ['Jamón', 'Salchicha', 'Salami', 'Chorizo', 'Piña', 'Champiñón', 'Tocino', 'Morrón'], extra: 35 }
]

// Ingredientes a elegir (3 por pizza, sin costo). Pastor con costo extra.
const INGREDIENTES = ['Jamón', 'Salchicha', 'Salami', 'Chorizo', 'Tocino', 'Peperoni', 'Piña', 'Champiñón', 'Morrón', 'Elote', 'Jitomate', 'Cebolla', 'Aceitunas']
const PASTOR_EXTRA = 25

/* ══════════════════════════════════════════════
   FILTROS
══════════════════════════════════════════════ */
const activeFilter = ref('todos')
const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'familiar', label: 'Familiares' },
  { key: 'jumbo', label: 'Jumbos' },
  { key: 'alitas', label: 'Con Alitas' }
]
function matchesFilter (combo) {
  return activeFilter.value === 'todos' || combo.cats.includes(activeFilter.value)
}

/* ══════════════════════════════════════════════
   CARRITO — por líneas: cada pizza lleva su propio
   tamaño, orilla e ingredientes (sin mezclarse)
══════════════════════════════════════════════ */
const ING_EXTRA = 10          // cada ingrediente extra (+$10, Pastor +$25) — sin límite de cantidad
const SIZE_OPTS = PIZZAS.filter(p => p.size !== 'Calzone')

let lineSeq = 0
const cartLines = reactive([])
const bump = ref(false)

function ingsCost (ings) {
  return ings.reduce((s, i) => s + (i === 'Pastor' ? PASTOR_EXTRA : ING_EXTRA), 0)
}
function pizzaUnit (l) {
  const s = SIZE_OPTS.find(o => o.size === l.size)
  return s.price + (l.orilla ? s.orilla : 0) + (l.specExtra || 0) + ingsCost(l.ings)
}
function lineUnit (l) {
  if (l.kind === 'pizza') return pizzaUnit(l)
  return l.price
}
const cartQty = computed(() => cartLines.reduce((a, l) => a + l.qty, 0))
const cartTotal = computed(() => cartLines.reduce((a, l) => a + lineUnit(l) * l.qty, 0))

function pulse (msg) {
  bump.value = false
  nextTick(() => { bump.value = true })
  showToast(msg)
}
function addCombo (id) {
  const c = COMBOS.find(x => x.id === id)
  const ex = cartLines.find(l => l.kind === 'combo' && l.ref === id)
  let key
  if (ex) { ex.qty++; key = ex.key }
  else { key = ++lineSeq; cartLines.push({ key, kind: 'combo', ref: id, name: c.name, price: c.price, img: c.img, qty: 1 }) }
  pulse(`✔ ${c.name} agregado`)
  scrollToCartLine(key)
}
function addSnack (s) {
  const ex = cartLines.find(l => l.kind === 'snack' && l.ref === s.name)
  let key
  if (ex) { ex.qty++; key = ex.key }
  else { key = ++lineSeq; cartLines.push({ key, kind: 'snack', ref: s.name, name: s.name, price: s.price, icon: s.icon || '🍽️', qty: 1 }) }
  pulse(`✔ ${s.name} agregado`)
  scrollToCartLine(key)
}
function changeQty (key, op) {
  const i = cartLines.findIndex(l => l.key === key)
  if (i < 0) return
  cartLines[i].qty += op
  if (cartLines[i].qty <= 0) cartLines.splice(i, 1)
}

/* ── Configurador de pizza (especialidad o armada) ── */
const pizzaModal = reactive({ open: false, spec: null, size: 'Grande', orilla: false, ings: [] })
function openPizzaModal (spec, size) {
  pizzaModal.spec = spec || null
  pizzaModal.size = size || 'Grande'
  pizzaModal.orilla = false
  pizzaModal.ings = []
  pizzaModal.open = true
}
function closePizzaModal () { pizzaModal.open = false }
function toggleModalIng (name) {
  const i = pizzaModal.ings.indexOf(name)
  if (i >= 0) pizzaModal.ings.splice(i, 1)
  else pizzaModal.ings.push(name)
}
const modalUnit = computed(() => {
  if (!pizzaModal.open) return 0
  return pizzaUnit({ size: pizzaModal.size, orilla: pizzaModal.orilla, specExtra: pizzaModal.spec?.extra || 0, ings: pizzaModal.ings })
})
const modalOrillaCost = computed(() => SIZE_OPTS.find(o => o.size === pizzaModal.size)?.orilla || 0)
function confirmPizza () {
  const spec = pizzaModal.spec
  const name = spec ? `Pizza ${spec.name}` : 'Pizza a tu gusto'
  const sig = [name, pizzaModal.size, pizzaModal.orilla, [...pizzaModal.ings].sort().join('|')].join('·')
  const ex = cartLines.find(l => l.kind === 'pizza' && l.sig === sig)
  let key
  if (ex) { ex.qty++; key = ex.key }
  else {
    key = ++lineSeq
    cartLines.push({
      key, kind: 'pizza', sig, name,
      size: pizzaModal.size, orilla: pizzaModal.orilla,
      ings: [...pizzaModal.ings],
      specExtra: spec?.extra || 0,
      specIngs: spec ? spec.ings : [],
      qty: 1
    })
  }
  pulse(`✔ ${name} (${pizzaModal.size}) agregada`)
  closePizzaModal()
  openCart()
  scrollToCartLine(key)
}

/* ══════════════════════════════════════════════
   PANEL CARRITO / LIGHTBOX / MENÚ MÓVIL
══════════════════════════════════════════════ */
const cartOpen = ref(false)
function openCart () { cartOpen.value = true }
function closeCart () { cartOpen.value = false }

// Indicador de scroll: avisa cuando hay más productos abajo
const cartItemsEl = ref(null)
const cartCanScrollDown = ref(false)
function updateCartScroll () {
  const el = cartItemsEl.value
  cartCanScrollDown.value = !!el && (el.scrollHeight - el.scrollTop - el.clientHeight > 8)
}
watch([() => cartLines.length, cartOpen], () => { nextTick(updateCartScroll) })

// Desplaza la lista del carrito hasta el producto recién agregado
function scrollToCartLine (key) {
  nextTick(() => {
    const el = cartItemsEl.value
    if (!el) return
    const item = el.querySelector(`[data-key="${key}"]`)
    if (item) {
      const top = el.scrollTop + (item.getBoundingClientRect().top - el.getBoundingClientRect().top) - 10
      el.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
      item.classList.remove('just-added')
      void item.offsetWidth
      item.classList.add('just-added')
    }
    updateCartScroll()
  })
}

const lightboxSrc = ref(null)
function openLightbox (src) { lightboxSrc.value = src }
function closeLightbox () { lightboxSrc.value = null }

watch([cartOpen, lightboxSrc, () => pizzaModal.open], ([c, l, m]) => {
  document.body.style.overflow = (c || l || m) ? 'hidden' : ''
})

const menuOpen = ref(false)

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
const toastMsg = ref('')
const toastShow = ref(false)
let toastTimer
function showToast (msg) {
  toastMsg.value = msg
  toastShow.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastShow.value = false }, 2100)
}

/* ══════════════════════════════════════════════
   FORMULARIO + WHATSAPP
══════════════════════════════════════════════ */
const form = reactive({ name: '', phone: '', addr: '', notes: '' })

function lineDesc (l) {
  if (l.kind !== 'pizza') return ''
  const parts = [l.size]
  if (l.orilla) parts.push('orilla de queso')
  if (l.ings.length) parts.push('extra: ' + l.ings.join(', '))
  return parts.join(' · ')
}

function sendWhatsapp () {
  if (cartTotal.value === 0) return
  const lines = ["Hola Uribe's Pizza! 🍕 Quisiera pedir:", '']
  for (const l of cartLines) {
    const u = lineUnit(l)
    const desc = lineDesc(l)
    lines.push(`• ${l.qty}x ${l.name}${desc ? ` (${desc})` : ''} — ${money(u)} c/u = ${money(u * l.qty)}`)
  }
  lines.push('', `*Total: ${money(cartTotal.value)}*`)
  if (form.name) lines.push('', `👤 Nombre: ${form.name}`)
  if (form.phone) lines.push(`📱 Teléfono: ${form.phone}`)
  if (form.addr) lines.push(`📍 Dirección: ${form.addr}`)
  if (form.notes) lines.push(`📝 Notas: ${form.notes}`)
  lines.push('', '¡Gracias!')
  window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener')
}

/* ══════════════════════════════════════════════
   ESTADO ABIERTO / CERRADO en tiempo real
   L–V 15:00–22:30 · S–D 13:00–22:30
══════════════════════════════════════════════ */
const isOpen = ref(false)
const statusText = ref('…')
const statusLineHtml = ref('Verificando horario…')
const statusLineOpen = ref(false)
const todayDay = ref(new Date().getDay())

const HOURS_ROWS = [
  { label: 'Lunes a Viernes', time: '15:00 – 22:30', days: [1, 2, 3, 4, 5] },
  { label: 'Sábados y Domingos', time: '13:00 – 22:30', days: [6, 0] }
]
function scheduleFor (day) {
  return (day === 0 || day === 6) ? { open: 13 * 60, close: 22 * 60 + 30 } : { open: 15 * 60, close: 22 * 60 + 30 }
}
function updateStatus () {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const { open, close } = scheduleFor(now.getDay())
  const openNow = mins >= open && mins < close
  isOpen.value = openNow
  statusText.value = openNow ? 'ABIERTO AHORA' : 'CERRADO POR AHORA'
  statusLineOpen.value = openNow
  todayDay.value = now.getDay()
  if (openNow) {
    statusLineHtml.value = '🟢&nbsp; <span><strong>¡Estamos abiertos!</strong> Recibimos pedidos hasta las 22:30.</span>'
  } else {
    const o = `${Math.floor(open / 60)}:${String(open % 60).padStart(2, '0')}`
    statusLineHtml.value = `🔴&nbsp; <span><strong>Cerrado por ahora.</strong> Hoy abrimos a las ${o} — ¡deja tu pedido listo por WhatsApp!</span>`
  }
}

/* ══════════════════════════════════════════════
   MONTAJE — status interval + reveal + escape
══════════════════════════════════════════════ */
let statusInterval
let io
let revealFallback
function onKeydown (e) {
  if (e.key === 'Escape') { closeCart(); closeLightbox(); closePizzaModal() }
}
onMounted(() => {
  updateStatus()
  statusInterval = setInterval(updateStatus, 60000)
  document.addEventListener('keydown', onKeydown)

  io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target) }
    })
  }, { threshold: 0.1 })
  nextTick(() => {
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
  })

  // Red de seguridad: si el observer no dispara (algunos móviles / webviews),
  // nada quedaría visible. Tras un momento, si nada se reveló, mostramos todo.
  revealFallback = setTimeout(() => {
    const revs = [...document.querySelectorAll('.reveal')]
    if (!revs.some((el) => el.classList.contains('visible'))) {
      revs.forEach((el) => el.classList.add('visible'))
    }
  }, 1500)
})
onUnmounted(() => {
  clearInterval(statusInterval)
  clearTimeout(toastTimer)
  clearTimeout(revealFallback)
  document.removeEventListener('keydown', onKeydown)
  if (io) io.disconnect()
  document.body.style.overflow = ''
})

const year = new Date().getFullYear()

/* tickers: contenido base (se renderiza 2x en template para loop infinito) */
const TICKER = [
  '🛵 SERVICIO A DOMICILIO',
  '📞 PEDIDOS: 333 599 2647',
  '🧀 ORILLA 100% RELLENA DE QUESO',
  '📍 LA FORTUNA, JALISCO',
  '🍕 EL COMBO PERFECTO PARA COMPARTIR'
]
const MID_TICKER = [
  '★ COMBOS DESDE $245',
  '★ PIZZA JUMBO 16 REBANADAS',
  '★ ALITAS & NUGGETS',
  '★ PEPSI 1.5L INCLUIDA',
  '★ PAN DE AJO Y CANELASO'
]
</script>

<template>
  <!-- ═══════════ TICKER ═══════════ -->
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      <span v-for="(t, i) in [...TICKER, ...TICKER]" :key="'t' + i">{{ t }}</span>
    </div>
  </div>

  <!-- ═══════════ NAVBAR ═══════════ -->
  <header class="navbar">
    <div class="nav-inner">
      <a href="#inicio" class="brand" aria-label="Uribe's Pizza — Inicio">
        <img class="brand-logo" :src="IMG + 'Logo.png'" alt="" aria-hidden="true">
        <span class="brand-text">
          <span class="brand-name">URIBE'S <em>PIZZA</em></span><br>
          <span class="status-pill" :class="isOpen ? 'open' : 'closed'">
            <span class="status-dot"></span><span class="status-text">{{ statusText }}</span>
          </span>
        </span>
      </a>
      <nav aria-label="Navegación principal">
        <ul class="nav-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#menu">Combos</a></li>
          <li><a href="#carta">Carta</a></li>
          <li><a href="#ubicacion">Ubicación</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <button class="btn-cart-nav" aria-label="Abrir carrito de pedido" @click="openCart">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57L22.5 7H5.12"/></svg>
          <span class="cart-count" :class="{ show: cartQty > 0 }">{{ cartQty }}</span>
        </button>
        <button class="hamburger" aria-label="Abrir menú" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" :class="{ show: menuOpen }">
    <a href="#inicio" @click="menuOpen = false">🏠 Inicio</a>
    <a href="#menu" @click="menuOpen = false">🍕 Combos</a>
    <a href="#carta" @click="menuOpen = false">📋 Carta</a>
    <a href="#ubicacion" @click="menuOpen = false">📍 Ubicación</a>
    <a href="#contacto" @click="menuOpen = false">📞 Contacto</a>
  </div>

  <!-- ═══════════ HERO ═══════════ -->
  <section class="hero" id="inicio">
    <div class="container hero-inner">
      <div>
        <span class="hero-tag">¡El combo perfecto para <i>compartir!</i></span>
        <h1>
          <span class="line">Sorpréndete</span>
          <span class="line w-red">con el sabor</span>
          <span class="line w-outline">de verdad</span>
        </h1>
        <p class="hero-sub">— pizzas con orilla rellena de queso, alitas y más —</p>
        <p class="hero-desc">Combos familiares, jumbos y mega desde <strong>$245</strong>. Hechos al momento con ingredientes frescos y entregados calientitos en tu puerta, en La Fortuna, Jalisco.</p>
        <div class="hero-ctas">
          <a class="btn btn-wa" href="https://wa.me/523335992647?text=Hola%20Uribe%27s%20Pizza!%20Quiero%20hacer%20un%20pedido%20%F0%9F%8D%95" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Pide por WhatsApp
          </a>
          <a class="btn btn-ink" href="#menu">Ver los combos ↓</a>
        </div>
        <div class="hero-badges">
          <span class="stamp">🛵 Entrega <b>rápida</b> a domicilio</span>
          <span class="stamp">🧀 Queso <b>100%</b> relleno</span>
          <span class="stamp">🍅 Ingredientes <b>frescos</b></span>
        </div>
      </div>

      <figure class="hero-flyer">
        <span class="tape tape-tl"></span>
        <span class="tape tape-br"></span>
        <div class="price-splash"><div><small>DESDE</small><div class="num">$245</div></div></div>
        <div class="paper-photo">
          <img :src="IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (1).jpeg'" alt="Combo Familiar Alitas — volante oficial" @click="openLightbox(IMG + 'WhatsApp Image 2026-07-21 at 2.31.04 PM (1).jpeg')">
        </div>
        <figcaption>← nuestros volantes oficiales, precios reales →</figcaption>
      </figure>
    </div>
  </section>

  <div class="rip"></div>

  <!-- ═══════════ MENÚ / COMBOS ═══════════ -->
  <section class="menu-sec" id="menu">
    <div class="container">
      <div class="sec-head reveal">
        <span class="sec-kicker">directo de nuestros volantes…</span>
        <h2 class="sec-title">Los combos <span class="red">oficiales</span></h2>
        <p class="sec-note">Toca cualquier volante para verlo en grande. Agrega los que quieras y arma tu pedido por WhatsApp.</p>
      </div>

      <div class="filters reveal" aria-label="Filtrar combos">
        <button v-for="f in FILTERS" :key="f.key" class="filter-btn" :class="{ active: activeFilter === f.key }" @click="activeFilter = f.key">{{ f.label }}</button>
      </div>

      <div class="combos-grid">
        <article v-for="c in COMBOS" :key="c.id" class="flyer-card reveal" :class="{ hidden: !matchesFilter(c) }">
          <span class="tape"></span>
          <div class="flyer-img" role="button" tabindex="0" :aria-label="'Ver volante de ' + c.name + ' en grande'" @click="openLightbox(c.img)" @keydown.enter="openLightbox(c.img)">
            <img :src="c.img" :alt="'Volante: ' + c.name" loading="lazy">
            <span class="combo-tag">{{ c.tag }}</span>
            <span class="zoom-hint">🔍 Ver volante</span>
            <span class="price-tag">${{ c.price }}</span>
          </div>
          <div class="flyer-body">
            <h3 class="flyer-name">{{ c.name }}</h3>
            <div class="incluye-label">incluye:</div>
            <ul class="flyer-includes">
              <li v-for="(inc, i) in c.includes" :key="i">{{ inc }}</li>
            </ul>
            <button class="btn-add" :aria-label="'Agregar ' + c.name + ' al pedido'" @click="addCombo(c.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Agregar al pedido
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div class="rip flip"></div>

  <!-- ═══════════ MARQUEE ═══════════ -->
  <div class="mid-ticker" aria-hidden="true">
    <div class="ticker-track">
      <span v-for="(t, i) in [...MID_TICKER, ...MID_TICKER]" :key="'m' + i">{{ t }}</span>
    </div>
  </div>

  <!-- ═══════════ CARTA COMPLETA ═══════════ -->
  <section class="carta-sec" id="carta">
    <div class="container">
      <div class="sec-head reveal">
        <span class="sec-kicker dark-k">arma tu pizza como quieras…</span>
        <h2 class="sec-title dark">La carta <span class="red">completa</span></h2>
        <p class="sec-note dark">Precios reales de nuestro menú. Elige el tamaño, agrégale orilla rellena de queso y hasta <strong>3 ingredientes</strong> por pizza.</p>
      </div>

      <div class="boards-grid">
        <!-- PIZZAS -->
        <div class="menu-board reveal">
          <span class="tape"></span>
          <h3 class="board-title">🍕 Pizzas</h3>
          <p class="board-legend">precio · <em>2×</em> promo · <b>+orilla de queso</b></p>
          <ul class="price-list">
            <li v-for="p in PIZZAS" :key="p.size">
              <span class="pl-name">{{ p.size }}</span>
              <span class="pl-dots" aria-hidden="true"></span>
              <span class="pl-prices">
                <span class="pl-main">{{ money(p.price) }}</span>
                <em v-if="p.duo" class="pl-duo">2×{{ money(p.duo) }}</em>
                <b v-if="p.orilla" class="pl-orilla">+{{ money(p.orilla) }} orilla</b>
              </span>
              <button v-if="p.size !== 'Calzone'" class="pl-add" :aria-label="'Armar pizza ' + p.size" @click="openPizzaModal(null, p.size)">+</button>
              <button v-else class="pl-add" aria-label="Agregar Calzone" @click="addSnack({ name: 'Calzone', price: p.price, icon: '🥟' })">+</button>
            </li>
          </ul>
          <p class="board-foot marker">🧀 Orilla rellena 100% de queso</p>
        </div>

        <!-- SNACKS -->
        <div class="menu-board reveal">
          <span class="tape"></span>
          <h3 class="board-title">🍟 Snacks & extras</h3>
          <p class="board-legend">para acompañar tu pizza</p>
          <ul class="price-list">
            <li v-for="s in SNACKS" :key="s.name">
              <span class="pl-name">
                {{ s.name }}
                <small v-if="s.note">{{ s.note }}</small>
              </span>
              <span class="pl-dots" aria-hidden="true"></span>
              <span class="pl-prices"><span class="pl-main">{{ money(s.price) }}</span></span>
              <button class="pl-add" :aria-label="'Agregar ' + s.name" @click="addSnack(s)">+</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- ESPECIALIDADES -->
      <div class="esp-head reveal">
        <span class="sec-kicker dark-k">o pídela ya armada…</span>
        <h3 class="esp-title">Especialidades <span class="red">de la casa</span></h3>
      </div>
      <div class="esp-grid">
        <article v-for="e in ESPECIALIDADES" :key="e.name" class="esp-card reveal">
          <div class="esp-pizza">
            <PizzaSvg :ings="e.ings" />
          </div>
          <div class="esp-name">
            {{ e.name }}
            <span v-if="e.extra" class="esp-extra">+{{ money(e.extra) }}</span>
          </div>
          <div class="esp-ings">
            <span v-for="ing in e.ings" :key="ing">{{ ing }}</span>
          </div>
          <button class="btn-esp-add" @click="openPizzaModal(e)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Agregar · elige tamaño
          </button>
        </article>
      </div>

      <!-- INGREDIENTES -->
      <div class="ing-panel reveal">
        <span class="tape"></span>
        <div class="ing-panel-in">
          <h3>🧑‍🍳 Arma tu pizza</h3>
          <p class="ing-lead">Agrega <strong>los ingredientes que quieras</strong> — +{{ money(ING_EXTRA) }} c/u. El Pastor +{{ money(PASTOR_EXTRA) }}.</p>
          <div class="ing-chips">
            <span v-for="ing in INGREDIENTES" :key="ing">{{ ing }}</span>
            <span class="ing-pastor">Pastor +{{ money(PASTOR_EXTRA) }}</span>
          </div>
          <button class="btn btn-wa ing-cta" type="button" @click="openPizzaModal(null)">
            🍕 Arma tu pizza aquí
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════ UBICACIÓN ═══════════ -->
  <section class="loc-sec" id="ubicacion">
    <div class="container">
      <div class="sec-head reveal">
        <span class="sec-kicker">¿dónde y cuándo?</span>
        <h2 class="sec-title">Ubicación y <span class="red">horarios</span></h2>
      </div>

      <div class="loc-grid">
        <div class="paper-card reveal">
          <span class="tape"></span>
          <h3>🕒 Horario de atención</h3>
          <table class="hours-table">
            <tbody>
              <tr v-for="row in HOURS_ROWS" :key="row.label" :class="{ today: row.days.includes(todayDay) }">
                <td>{{ row.label }}</td><td>{{ row.time }}</td>
              </tr>
            </tbody>
          </table>
          <div class="status-line" :style="{ borderColor: statusLineOpen ? '#0a7d3c' : 'var(--red)' }" v-html="statusLineHtml"></div>
        </div>

        <div class="paper-card alt reveal">
          <span class="tape"></span>
          <h3>📍 ¿Dónde estamos?</h3>
          <p class="addr-text"><strong>De la Bendición 429</strong>, Fraccionamiento de la Fortuna, 45650 La Fortuna, Jalisco, México.</p>
          <div class="map-frame">
            <iframe title="Mapa de Uribe's Pizza" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=De+la+Bendici%C3%B3n+429,+Fraccionamiento+de+la+Fortuna,+45650+La+Fortuna,+Jalisco&output=embed"></iframe>
          </div>
          <div class="loc-btns">
            <a class="btn btn-ink" href="https://maps.app.goo.gl/gGpXk7jD1K6uoBaVA" target="_blank" rel="noopener">🗺️ Abrir en Google Maps</a>
            <a class="btn btn-wa" href="tel:+523335992647">📞 333 599 2647</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════ CTA FINAL ═══════════ -->
  <section class="final-sec" id="contacto">
    <div class="container final-inner reveal">
      <img class="final-logo" :src="IMG + 'Logo.png'" alt="Uribe's Pizza" />
      <span class="marker">¿ya se te antojó?</span>
      <h2>Pide ahora y<br>disfruta en casa</h2>
      <p>Mándanos WhatsApp o llámanos al <b>333 599 2647</b> — llevamos el sabor hasta tu puerta.</p>
      <a class="btn btn-wa" href="https://wa.me/523335992647?text=Hola%20Uribe%27s%20Pizza!%20Quiero%20hacer%20un%20pedido%20%F0%9F%8D%95" target="_blank" rel="noopener">
        📲 Ordenar por WhatsApp
      </a>
    </div>
  </section>

  <!-- ═══════════ FOOTER ═══════════ -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#inicio" class="brand">
            <img class="brand-logo" :src="IMG + 'Logo.png'" alt="" aria-hidden="true">
            <span class="brand-name" style="font-size:1.4rem;color:#fff">URIBE'S <em style="font-style:normal;color:var(--red)">PIZZA</em></span>
          </a>
          <p>Pizzas artesanales con orilla rellena de queso y el sabor que une a la familia. Servicio a domicilio en La Fortuna y alrededores.</p>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul class="footer-links">
            <li><a href="https://wa.me/523335992647" target="_blank" rel="noopener">📱 WhatsApp: 333 599 2647</a></li>
            <li><a href="tel:+523335992647">📞 Teléfono: 333 599 2647</a></li>
            <li><a href="mailto:jouri898989@gmail.com">✉️ jouri898989@gmail.com</a></li>
            <li><a href="https://maps.app.goo.gl/gGpXk7jD1K6uoBaVA" target="_blank" rel="noopener">📍 De la Bendición 429, La Fortuna, Jal.</a></li>
          </ul>
        </div>
        <div>
          <h4>Explora</h4>
          <ul class="footer-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#menu">Combos</a></li>
            <li><a href="#ubicacion">Ubicación y horarios</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ year }} Uribe's Pizza · Todos los derechos reservados.</span>
        <span class="marker">"Sorpréndete con el delicioso sabor de nuestras pizzas"</span>
      </div>
    </div>
  </footer>

  <!-- ═══════════ LIGHTBOX ═══════════ -->
  <div class="lightbox" :class="{ show: lightboxSrc }" role="dialog" aria-label="Volante en tamaño completo" @click.self="closeLightbox">
    <button class="lightbox-close" aria-label="Cerrar" @click="closeLightbox">✕</button>
    <img v-if="lightboxSrc" :src="lightboxSrc" alt="Volante de Uribe's Pizza">
  </div>

  <!-- ═══════════ CARRITO FLOTANTE ═══════════ -->
  <button class="cart-fab" :class="{ bump }" aria-label="Abrir carrito de pedido" @click="openCart">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57L22.5 7H5.12"/></svg>
    <span class="cart-count" :class="{ show: cartQty > 0 }">{{ cartQty }}</span>
  </button>

  <div class="cart-overlay" :class="{ show: cartOpen }" @click="closeCart"></div>

  <aside class="cart-panel" :class="{ show: cartOpen }" aria-label="Carrito de pedido">
    <div class="cart-head">
      <h3>Tu pedido <span>({{ cartQty }})</span></h3>
      <button class="cart-close" aria-label="Cerrar carrito" @click="closeCart">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="cart-scroll">
    <div class="cart-items" ref="cartItemsEl" @scroll="updateCartScroll">
      <div v-if="cartQty === 0" class="cart-empty">
        <span class="big">🍕</span><span class="marker">tu pedido está vacío…</span><br>Agrega un combo desde el menú.
      </div>
      <div v-for="l in cartLines" :key="l.key" class="cart-item" :data-key="l.key">
        <img v-if="l.kind === 'combo'" class="ci-thumb" :src="l.img" alt="">
        <div v-else-if="l.kind === 'pizza'" class="ci-thumb ci-pizza" aria-hidden="true">
          <PizzaSvg :ings="l.ings.length ? [...l.specIngs, ...l.ings] : (l.specIngs.length ? l.specIngs : ['peperoni'])" />
        </div>
        <div v-else class="ci-thumb ci-snack" aria-hidden="true">{{ l.icon || '🍽️' }}</div>
        <div class="ci-info">
          <div class="ci-name">{{ l.name }}</div>
          <div v-if="l.kind === 'pizza'" class="ci-detail">
            <b>{{ l.size }}</b><span v-if="l.orilla"> · 🧀 orilla de queso</span>
            <span v-if="l.ings.length"> · +{{ l.ings.join(', +') }}</span>
          </div>
          <div class="ci-price">{{ money(lineUnit(l)) }} c/u · {{ money(lineUnit(l) * l.qty) }}</div>
        </div>
        <div class="ci-qty">
          <button class="qty-btn" aria-label="Quitar uno" @click="changeQty(l.key, -1)">−</button>
          <span>{{ l.qty }}</span>
          <button class="qty-btn" aria-label="Agregar uno" @click="changeQty(l.key, 1)">+</button>
        </div>
      </div>
    </div>
      <div class="cart-fade" :class="{ show: cartCanScrollDown }" aria-hidden="true">
        <span class="cart-fade-pill">▼ desliza para ver más</span>
      </div>
    </div>
    <form class="cart-form" autocomplete="on" @submit.prevent>
      <div>
        <label for="fName">tu nombre</label>
        <input type="text" id="fName" v-model="form.name" placeholder="Ej. Juan Pérez" maxlength="60">
      </div>
      <div>
        <label for="fPhone">teléfono</label>
        <input type="tel" id="fPhone" v-model="form.phone" placeholder="Ej. 333 599 2647" maxlength="20">
      </div>
      <div>
        <label for="fAddr">dirección de entrega</label>
        <input type="text" id="fAddr" v-model="form.addr" placeholder="Calle, número, colonia y referencias" maxlength="140">
      </div>
      <div>
        <label for="fNotes">notas del pedido</label>
        <textarea id="fNotes" rows="2" v-model="form.notes" placeholder="Ej. refresco bien frío, aderezo extra…" maxlength="200"></textarea>
      </div>
    </form>
    <div class="cart-foot">
      <div class="cart-total-row">
        <span class="label">total del pedido</span>
        <span class="amount">{{ money(cartTotal) }}</span>
      </div>
      <button class="btn-send-wa" :disabled="cartQty === 0" @click="sendWhatsapp">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Enviar pedido por WhatsApp
      </button>
    </div>
  </aside>

  <!-- ═══════════ CONFIGURADOR DE PIZZA ═══════════ -->
  <div class="pz-overlay" :class="{ show: pizzaModal.open }" @click.self="closePizzaModal">
    <div class="pz-modal" role="dialog" aria-label="Configura tu pizza">
      <div class="pz-head">
        <div>
          <div class="pz-title">{{ pizzaModal.spec ? 'Pizza ' + pizzaModal.spec.name : '🧑‍🍳 Arma tu pizza' }}</div>
          <div v-if="pizzaModal.spec" class="pz-sub">
            lleva: {{ pizzaModal.spec.ings.join(', ') }}
            <b v-if="pizzaModal.spec.extra"> (+{{ money(pizzaModal.spec.extra) }})</b>
          </div>
          <div v-else class="pz-sub">elige tamaño e ingredientes</div>
        </div>
        <button class="pz-close" aria-label="Cerrar" @click="closePizzaModal">✕</button>
      </div>

      <div class="pz-body">
        <div class="pz-label">1 · Elige el tamaño</div>
        <div class="pz-sizes">
          <button v-for="s in SIZE_OPTS" :key="s.size" type="button"
            class="pz-size" :class="{ on: pizzaModal.size === s.size }"
            @click="pizzaModal.size = s.size">
            <span class="pz-size-name">{{ s.size }}</span>
            <span class="pz-size-price">{{ money(s.price) }}</span>
          </button>
        </div>

        <div class="pz-label">2 · ¿Orilla rellena de queso?</div>
        <button type="button" class="pz-orilla" :class="{ on: pizzaModal.orilla }" @click="pizzaModal.orilla = !pizzaModal.orilla">
          <span class="pz-check" aria-hidden="true">{{ pizzaModal.orilla ? '✔' : '' }}</span>
          🧀 Sí, con orilla de queso <b>+{{ money(modalOrillaCost) }}</b>
        </button>

        <div class="pz-label">
          3 · Ingredientes extra
          <span class="pz-hint">
            <template v-if="pizzaModal.ings.length">{{ pizzaModal.ings.length }} · +{{ money(ingsCost(pizzaModal.ings)) }}</template>
            <template v-else>+{{ money(ING_EXTRA) }} c/u · los que quieras</template>
          </span>
        </div>
        <div class="ing-picker">
          <button v-for="ing in INGREDIENTES" :key="ing" type="button"
            class="ing-pick" :class="{ on: pizzaModal.ings.includes(ing) }"
            @click="toggleModalIng(ing)">{{ ing }}</button>
          <button type="button" class="ing-pick pastor" :class="{ on: pizzaModal.ings.includes('Pastor') }"
            @click="toggleModalIng('Pastor')">Pastor +{{ money(PASTOR_EXTRA) }}</button>
        </div>
      </div>

      <div class="pz-foot">
        <div class="pz-total">
          <span>esta pizza:</span>
          <b>{{ money(modalUnit) }}</b>
        </div>
        <button class="pz-confirm" @click="confirmPizza">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Agregar al pedido
        </button>
      </div>
    </div>
  </div>

  <div class="toast" :class="{ show: toastShow }">{{ toastMsg }}</div>
</template>

<style>
/* ══════════════════════════════════════════════════════════
   URIBE'S PIZZA — "Volante Callejero" Design System
══════════════════════════════════════════════════════════ */
:root{
  --paper:#f5f1e8;
  --paper-2:#ece7db;
  --ink:#141416;
  --ink-soft:#3a3a40;
  --red:#E50914;
  --red-deep:#B00710;
  --gold:#FFB703;
  --green:#008C45;
  --white:#ffffff;
  --font-poster:'Anton',sans-serif;
  --font-brush:'Permanent Marker',cursive;
  --font-body:'Inter',sans-serif;
  --shadow-card:0 18px 40px -16px rgba(20,20,22,.35);
  --nav-h:86px;
  --rough:255px 18px 225px 18px / 18px 225px 18px 255px;
  --rough-2:18px 225px 18px 255px / 255px 18px 225px 18px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:calc(var(--nav-h) + 20px)}
body{
  font-family:var(--font-body);
  background:var(--paper);
  color:var(--ink);
  line-height:1.6;
  overflow-x:hidden;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
::selection{background:var(--red);color:#fff}
::-webkit-scrollbar{width:11px}
::-webkit-scrollbar-track{background:var(--paper-2)}
::-webkit-scrollbar-thumb{background:var(--ink);border-radius:6px}
::-webkit-scrollbar-thumb:hover{background:var(--red)}
.container{width:min(1200px,92%);margin-inline:auto}

.marker{font-family:var(--font-brush)}

/* ═══════════ TICKER superior ═══════════ */
.ticker{
  background:var(--ink);color:var(--paper);
  overflow:hidden;white-space:nowrap;
  font-family:var(--font-poster);
  font-size:.82rem;letter-spacing:.14em;
  padding:9px 0;
  border-bottom:3px solid var(--red);
}
.ticker-track{display:inline-flex;gap:0;animation:ticker 28s linear infinite}
.ticker-track span{padding:0 26px;display:inline-flex;align-items:center;gap:10px}
@keyframes ticker{to{transform:translateX(-50%)}}

/* ═══════════ NAVBAR ═══════════ */
.navbar{
  position:sticky;top:0;z-index:900;
  height:var(--nav-h);
  background:rgba(245,241,232,.94);
  backdrop-filter:blur(10px);
  border-bottom:3px solid var(--ink);
  display:flex;align-items:center;
}
.nav-inner{width:min(1200px,94%);margin-inline:auto;display:flex;align-items:center;justify-content:space-between;gap:14px}
.brand{display:flex;align-items:center;gap:12px;min-width:0}
.brand-logo{
  width:74px;height:74px;flex-shrink:0;
  object-fit:contain;display:block;
  filter:drop-shadow(2px 2px 0 rgba(20,20,22,.22));
}
.footer-brand .brand-logo{width:96px;height:96px}
.brand-text{line-height:1.05}
.brand-name{font-family:var(--font-poster);font-size:1.3rem;letter-spacing:.02em}
.brand-name em{font-style:normal;color:var(--red)}
.status-pill{
  display:inline-flex;align-items:center;gap:6px;
  font-size:.66rem;font-weight:800;letter-spacing:.06em;
  color:var(--ink-soft);
}
.status-dot{width:8px;height:8px;border-radius:50%;background:#999;flex-shrink:0}
.status-pill.open{color:#0a7d3c}
.status-pill.open .status-dot{background:#16a34a;box-shadow:0 0 8px #16a34a;animation:pulse 1.6s infinite}
.status-pill.closed{color:var(--red-deep)}
.status-pill.closed .status-dot{background:var(--red)}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.4);opacity:.6}}
.nav-links{display:flex;gap:2px;list-style:none;align-items:center}
.nav-links a{
  font-family:var(--font-poster);font-size:.92rem;letter-spacing:.05em;
  padding:9px 15px;color:var(--ink-soft);
  border-radius:8px;transition:all .2s;text-transform:uppercase;
}
.nav-links a:hover{color:var(--red);transform:rotate(-2deg) scale(1.05)}
.nav-cta{display:flex;align-items:center;gap:10px}
.btn-cart-nav{
  position:relative;
  width:48px;height:48px;
  background:var(--ink);color:#fff;
  border-radius:12px;
  display:grid;place-items:center;
  box-shadow:3px 3px 0 var(--red);
  transition:transform .2s, box-shadow .2s;
}
.btn-cart-nav:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--red)}
.btn-cart-nav svg{width:22px;height:22px;stroke:#fff}
.cart-count{
  position:absolute;top:-8px;right:-8px;
  min-width:22px;height:22px;padding:0 5px;
  background:var(--gold);color:var(--ink);
  border:2px solid var(--ink);
  border-radius:100px;
  font-weight:800;font-size:.72rem;
  display:grid;place-items:center;
  transform:scale(0);transition:transform .25s cubic-bezier(.34,1.56,.64,1);
}
.cart-count.show{transform:scale(1)}
.hamburger{display:none;width:46px;height:46px;border-radius:10px;background:var(--ink);place-items:center;flex-shrink:0}
.hamburger svg{width:22px;height:22px;stroke:#fff}
.mobile-menu{
  position:fixed;top:var(--nav-h);left:0;right:0;z-index:880;
  background:var(--paper);
  border-bottom:3px solid var(--ink);
  padding:10px 4% 20px;
  display:none;flex-direction:column;gap:2px;
  box-shadow:0 20px 40px rgba(0,0,0,.25);
}
.mobile-menu.show{display:flex}
.mobile-menu a{font-family:var(--font-poster);font-size:1.05rem;letter-spacing:.05em;padding:13px 14px;text-transform:uppercase;border-bottom:1px dashed rgba(20,20,22,.15)}
.mobile-menu a:hover{color:var(--red)}

/* ═══════════ HERO ═══════════ */
.hero{position:relative;padding:64px 0 84px;overflow:hidden}
.hero::before,.hero::after{
  content:"";position:absolute;height:200px;width:420px;
  background:var(--red);
  border-radius:var(--rough);
  opacity:.92;z-index:0;
}
.hero::before{top:-90px;left:-160px;transform:rotate(-24deg)}
.hero::after{bottom:-100px;right:-180px;transform:rotate(-18deg);background:var(--ink)}
.hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.hero-tag{
  font-family:var(--font-brush);
  font-size:clamp(1rem,1.8vw,1.25rem);
  background:var(--ink);color:var(--paper);
  display:inline-block;padding:.35em .9em;
  border-radius:var(--rough-2);
  transform:rotate(-2deg);
  box-shadow:5px 5px 0 var(--red);
  margin-bottom:26px;
  animation:stampIn .5s .1s both;
}
.hero-tag i{font-style:normal;color:var(--gold)}
.hero h1{
  font-family:var(--font-poster);
  text-transform:uppercase;
  font-size:clamp(3.2rem,8.5vw,6.8rem);
  line-height:.94;letter-spacing:.01em;
  margin-bottom:8px;
}
.hero h1 .line{display:block;animation:slideStamp .55s both}
.hero h1 .line:nth-child(2){animation-delay:.12s}
.hero h1 .line:nth-child(3){animation-delay:.24s}
.hero h1 .w-red{color:var(--red);text-shadow:3px 3px 0 var(--ink)}
.hero h1 .w-outline{
  color:var(--paper);
  -webkit-text-stroke:2.5px var(--ink);
  text-shadow:4px 4px 0 var(--gold);
}
.hero-sub{
  font-family:var(--font-brush);
  font-size:clamp(1.05rem,2vw,1.4rem);
  color:var(--red-deep);
  margin:14px 0 26px;
  transform:rotate(-1deg);
  animation:fadeUp .6s .35s both;
}
.hero-desc{color:var(--ink-soft);max-width:480px;font-size:1.02rem;margin-bottom:30px;animation:fadeUp .6s .4s both}
.hero-ctas{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:34px;animation:fadeUp .6s .5s both}
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:1.02rem;letter-spacing:.05em;
  padding:16px 28px;
  border:3px solid var(--ink);
  border-radius:14px;
  transition:transform .18s, box-shadow .18s;
}
.btn-wa{background:#22C55E;color:#fff;box-shadow:5px 5px 0 var(--ink)}
.btn-wa:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--ink)}
.btn-wa:active{transform:translate(0,0);box-shadow:3px 3px 0 var(--ink)}
.btn-ink{background:var(--paper);color:var(--ink);box-shadow:5px 5px 0 var(--red)}
.btn-ink:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--red)}
.hero-badges{display:flex;flex-wrap:wrap;gap:10px;animation:fadeUp .6s .6s both}
.stamp{
  display:inline-flex;align-items:center;gap:8px;
  font-weight:700;font-size:.8rem;
  background:var(--white);
  border:2px dashed var(--ink);
  padding:9px 15px;border-radius:100px;
  transform:rotate(-1deg);
}
.stamp:nth-child(2){transform:rotate(1.2deg)}
.stamp:nth-child(3){transform:rotate(-.6deg)}
.stamp b{color:var(--red)}
.hero-flyer{position:relative;transform:rotate(2.5deg);animation:fadeUp .7s .3s both}
.hero-flyer .paper-photo{
  background:#fff;
  padding:14px 14px 18px;
  border:1px solid rgba(20,20,22,.12);
  box-shadow:var(--shadow-card), 0 2px 0 rgba(20,20,22,.06);
  transition:transform .35s;
}
.hero-flyer:hover .paper-photo{transform:rotate(-2deg) scale(1.02)}
.hero-flyer img{width:100%;aspect-ratio:1;object-fit:cover;cursor:zoom-in}
.tape{
  position:absolute;width:120px;height:34px;
  background:rgba(255,224,130,.75);
  border-left:1px dashed rgba(0,0,0,.12);
  border-right:1px dashed rgba(0,0,0,.12);
  box-shadow:0 3px 8px rgba(0,0,0,.12);
  z-index:5;
}
.tape-tl{top:-14px;left:-34px;transform:rotate(-38deg)}
.tape-br{bottom:-12px;right:-34px;transform:rotate(-42deg)}
.price-splash{
  position:absolute;right:-26px;top:-30px;z-index:6;
  background:var(--red);color:#fff;
  font-family:var(--font-poster);
  width:118px;height:118px;border-radius:50%;
  display:grid;place-items:center;text-align:center;
  border:4px solid var(--ink);
  box-shadow:5px 5px 0 rgba(20,20,22,.9);
  transform:rotate(10deg);
  animation:stampIn .5s .7s both;
}
.price-splash small{display:block;font-size:.62rem;letter-spacing:.14em;margin-bottom:-4px}
.price-splash .num{font-size:2.1rem;line-height:1}
.hero-flyer figcaption{
  font-family:var(--font-brush);
  text-align:center;font-size:1rem;color:var(--ink-soft);
  padding-top:12px;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideStamp{from{opacity:0;transform:translateX(-30px) skewX(-6deg)}to{opacity:1;transform:translateX(0) skewX(0)}}
@keyframes stampIn{from{opacity:0;transform:scale(1.7) rotate(18deg)}to{opacity:1;transform:scale(1) rotate(10deg)}}

/* ═══════════ SEPARADOR ZIGZAG ═══════════ */
.rip{
  height:26px;
  background:var(--ink);
  clip-path:polygon(0 55%,3% 20%,7% 60%,11% 25%,15% 65%,19% 20%,23% 55%,27% 30%,31% 70%,35% 25%,39% 60%,43% 20%,47% 65%,51% 30%,55% 60%,59% 22%,63% 68%,67% 28%,71% 58%,75% 20%,79% 66%,83% 30%,87% 60%,91% 22%,95% 62%,100% 30%,100% 100%,0 100%);
}
.rip.flip{transform:scaleY(-1)}

/* ═══════════ SECCIÓN MENÚ ═══════════ */
.menu-sec{
  background:var(--ink);
  color:var(--paper);
  padding:90px 0 100px;
  position:relative;
  overflow:hidden;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}
.menu-sec::before{
  content:"";position:absolute;top:-70px;right:-140px;
  width:430px;height:190px;background:var(--red);
  border-radius:var(--rough);transform:rotate(-16deg);opacity:.85;
}
.sec-head{text-align:center;max-width:720px;margin:0 auto 30px;position:relative;z-index:2}
.sec-kicker{
  font-family:var(--font-brush);
  font-size:1.15rem;color:var(--gold);
  display:inline-block;transform:rotate(-2deg);
  margin-bottom:14px;
}
.sec-title{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:clamp(2.4rem,5.5vw,4.2rem);
  line-height:.96;
}
.menu-sec .sec-title .red{color:var(--red);text-shadow:2px 2px 0 rgba(255,255,255,.15)}
.sec-note{color:#b9b9c0;margin-top:14px;font-size:.98rem}

.filters{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:34px 0 50px;position:relative;z-index:2}
.filter-btn{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:.92rem;letter-spacing:.06em;
  padding:11px 22px;
  background:transparent;color:#cfcfd6;
  border:2px solid rgba(245,241,232,.35);
  border-radius:100px;
  transition:all .2s;
}
.filter-btn:hover{color:#fff;border-color:#fff;transform:rotate(-2deg)}
.filter-btn.active{
  background:var(--red);color:#fff;border-color:var(--red);
  box-shadow:4px 4px 0 rgba(245,241,232,.25);
  transform:rotate(-2deg) scale(1.05);
}

.combos-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:44px 34px;
  position:relative;z-index:2;
}
.flyer-card{
  background:#fdfcf9;
  color:var(--ink);
  padding:13px 13px 0;
  box-shadow:0 24px 50px -18px rgba(0,0,0,.65);
  position:relative;
  display:flex;flex-direction:column;
  transition:transform .3s, box-shadow .3s;
  border:1px solid rgba(0,0,0,.08);
}
.combos-grid .flyer-card:nth-child(odd){transform:rotate(-1.4deg)}
.combos-grid .flyer-card:nth-child(even){transform:rotate(1.2deg)}
.combos-grid .flyer-card:hover{transform:rotate(0deg) translateY(-10px) scale(1.02);box-shadow:0 34px 70px -18px rgba(229,9,20,.45);z-index:5}
.flyer-card.hidden{display:none}
.flyer-card .tape{width:96px;height:28px;top:-14px;left:50%;transform:translateX(-50%) rotate(-3deg)}
.flyer-img{
  position:relative;overflow:hidden;cursor:zoom-in;
  aspect-ratio:1;
  background:#eee;
}
.flyer-img img{width:100%;height:100%;object-fit:cover;object-position:center;transition:transform .5s}
.flyer-card:hover .flyer-img img{transform:scale(1.06)}
.flyer-img .zoom-hint{
  position:absolute;right:10px;bottom:10px;
  background:rgba(20,20,22,.85);color:#fff;
  font-size:.68rem;font-weight:700;letter-spacing:.06em;
  padding:6px 11px;border-radius:100px;
  display:flex;align-items:center;gap:6px;
  opacity:0;transform:translateY(6px);
  transition:all .25s;
}
.flyer-card:hover .zoom-hint{opacity:1;transform:translateY(0)}
.combo-tag{
  position:absolute;top:12px;left:12px;
  font-family:var(--font-brush);
  font-size:.82rem;
  background:var(--ink);color:var(--gold);
  padding:5px 13px;
  border-radius:var(--rough-2);
  transform:rotate(-3deg);
  box-shadow:3px 3px 0 var(--red);
}
.price-tag{
  position:absolute;right:-10px;bottom:-16px;
  font-family:var(--font-poster);
  background:var(--red);color:#fff;
  font-size:1.75rem;line-height:1;
  padding:10px 18px 8px;
  border:3px solid var(--ink);
  border-radius:var(--rough);
  transform:rotate(3deg);
  box-shadow:4px 4px 0 var(--ink);
}
.flyer-body{padding:26px 10px 16px;display:flex;flex-direction:column;flex:1}
.flyer-name{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:1.28rem;line-height:1.1;letter-spacing:.02em;
  margin-bottom:12px;
}
.incluye-label{
  font-family:var(--font-brush);font-size:.8rem;
  color:var(--red-deep);
  margin-bottom:7px;
}
.flyer-includes{list-style:none;display:flex;flex-direction:column;gap:6px;margin-bottom:18px;flex:1}
.flyer-includes li{
  display:flex;gap:9px;align-items:flex-start;
  font-size:.86rem;color:var(--ink-soft);font-weight:500;
}
.flyer-includes li::before{content:"■";color:var(--red);font-size:.6rem;margin-top:5px}
.btn-add{
  font-family:var(--font-poster);text-transform:uppercase;
  letter-spacing:.06em;font-size:.95rem;
  width:100%;
  background:var(--ink);color:#fff;
  padding:14px;
  border:none;
  border-radius:10px;
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  box-shadow:4px 4px 0 var(--red);
  transition:transform .18s, box-shadow .18s, background .18s;
  margin-bottom:14px;
}
.btn-add:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--red);background:var(--red-deep)}
.btn-add:active{transform:translate(1px,1px);box-shadow:2px 2px 0 var(--red)}
.btn-add svg{width:17px;height:17px;stroke:#fff;flex-shrink:0}

/* ═══════════ CINTA MARQUEE ═══════════ */
.mid-ticker{
  background:var(--red);color:#fff;
  border-top:3px solid var(--ink);
  border-bottom:3px solid var(--ink);
  font-family:var(--font-poster);
  font-size:1.05rem;letter-spacing:.12em;
  padding:13px 0;
  overflow:hidden;white-space:nowrap;
  transform:rotate(-.6deg) scale(1.01);
}
.mid-ticker .ticker-track{animation-duration:22s}
.mid-ticker span{padding:0 24px}

/* ═══════════ CARTA COMPLETA ═══════════ */
.carta-sec{padding:92px 0 96px;position:relative;overflow:hidden}
.carta-sec::before{
  content:"";position:absolute;top:-60px;left:-150px;
  width:400px;height:180px;background:var(--gold);
  border-radius:var(--rough-2);transform:rotate(-16deg);opacity:.35;
}
.sec-title.dark{color:var(--ink)}
.sec-title.dark .red{color:var(--red);text-shadow:2px 2px 0 var(--gold)}
.sec-kicker.dark-k{color:var(--red-deep)}
.sec-note.dark{color:var(--ink-soft)}
.sec-note.dark strong{color:var(--red-deep)}

.boards-grid{
  display:grid;grid-template-columns:1.15fr 1fr;gap:34px;
  margin-top:48px;position:relative;z-index:2;align-items:start;
}
.menu-board{
  background:var(--ink);color:var(--paper);
  padding:34px 30px 30px;position:relative;
  box-shadow:var(--shadow-card);
  border:1px solid rgba(0,0,0,.2);
  transform:rotate(-.7deg);transition:transform .3s;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}
.menu-board:nth-child(2){transform:rotate(.7deg)}
.menu-board:hover{transform:rotate(0) translateY(-5px)}
.menu-board .tape{width:104px;height:28px;top:-13px;left:30px;transform:rotate(-4deg)}
.board-title{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:1.9rem;letter-spacing:.02em;color:var(--gold);
  line-height:1;
}
.board-legend{
  font-family:var(--font-brush);font-size:.82rem;color:#b9b9c0;
  margin:4px 0 20px;
}
.board-legend em{color:var(--paper);font-style:normal}
.board-legend b{color:var(--gold);font-weight:400}
.price-list{list-style:none;display:flex;flex-direction:column;gap:2px}
.price-list li{display:flex;align-items:flex-end;gap:8px;padding:7px 0}
.pl-name{
  font-weight:700;font-size:1.02rem;flex-shrink:0;
  display:flex;flex-direction:column;line-height:1.15;
}
.pl-name small{font-weight:500;font-size:.72rem;color:var(--gold);letter-spacing:.01em;margin-top:2px}
.pl-dots{flex:1;border-bottom:2px dotted rgba(245,241,232,.3);transform:translateY(-4px);min-width:16px}
.pl-prices{display:flex;align-items:baseline;gap:9px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}
.pl-main{font-family:var(--font-poster);font-size:1.32rem;color:#fff;letter-spacing:.02em}
.pl-duo{
  font-style:normal;font-size:.7rem;font-weight:700;
  background:var(--red);color:#fff;padding:2px 8px;border-radius:100px;
}
.pl-orilla{font-weight:600;font-size:.68rem;color:var(--gold)}
.board-foot{
  margin-top:20px;padding-top:16px;
  border-top:1px dashed rgba(245,241,232,.25);
  font-size:1rem;color:var(--gold);text-align:center;
}
.pl-add{
  flex-shrink:0;width:30px;height:30px;margin-left:4px;
  background:var(--red);color:#fff;
  border:2px solid rgba(245,241,232,.4);border-radius:9px;
  font-weight:800;font-size:1.05rem;line-height:1;
  display:grid;place-items:center;
  transition:transform .15s, background .15s;
  align-self:center;
}
.pl-add:hover{transform:scale(1.12) rotate(90deg);background:#fff;color:var(--red);border-color:var(--red)}

.esp-head{text-align:center;margin:74px auto 34px;max-width:640px;position:relative;z-index:2}
.esp-title{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:clamp(1.9rem,4.5vw,3rem);line-height:1;color:var(--ink);
}
.esp-title .red{color:var(--red);text-shadow:2px 2px 0 var(--gold)}
.esp-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:20px;position:relative;z-index:2;
}
.esp-card{
  background:#fdfcf9;border:2px solid var(--ink);
  box-shadow:5px 5px 0 rgba(20,20,22,.85);
  padding:18px 20px 20px;
  transition:transform .22s, box-shadow .22s;
}
.esp-card:nth-child(even){transform:rotate(-1deg)}
.esp-card:nth-child(odd){transform:rotate(.8deg)}
.esp-card:hover{transform:rotate(0) translateY(-4px);box-shadow:7px 7px 0 var(--red)}
.esp-pizza{
  width:162px;margin:-6px auto 10px;
  pointer-events:none;
}
.esp-card:hover .pizza-wrap{transform:scale(1.08) rotate(-3deg)}
.esp-name{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:1.2rem;letter-spacing:.02em;color:var(--ink);
  display:flex;align-items:center;gap:9px;flex-wrap:wrap;
  padding-bottom:10px;margin-bottom:11px;
  border-bottom:2px solid var(--gold);
}
.esp-extra{
  font-family:var(--font-body);font-size:.72rem;font-weight:800;
  background:var(--red);color:#fff;padding:2px 9px;border-radius:100px;
}
.esp-ings{display:flex;flex-wrap:wrap;gap:6px}
.esp-ings span{
  font-size:.76rem;font-weight:600;color:var(--ink-soft);
  background:var(--paper-2);border:1px solid rgba(20,20,22,.12);
  padding:4px 10px;border-radius:100px;
}
.btn-esp-add{
  margin-top:14px;width:100%;
  font-family:var(--font-poster);text-transform:uppercase;
  letter-spacing:.05em;font-size:.85rem;
  background:var(--ink);color:#fff;
  padding:11px;border-radius:9px;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:3px 3px 0 var(--red);
  transition:transform .18s, box-shadow .18s, background .18s;
}
.btn-esp-add:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--red);background:var(--red-deep)}
.btn-esp-add svg{width:15px;height:15px;stroke:#fff;flex-shrink:0}

.ing-panel{
  margin-top:44px;position:relative;z-index:2;
  background:var(--red);
  border:3px solid var(--ink);
  box-shadow:8px 8px 0 var(--ink);
  padding:38px 32px;transform:rotate(-.5deg);
}
.ing-panel .tape{width:120px;height:30px;top:-15px;left:50%;transform:translateX(-50%) rotate(-2deg)}
.ing-panel-in{text-align:center;color:#fff}
.ing-panel h3{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:clamp(1.6rem,4vw,2.4rem);line-height:1;
  text-shadow:3px 3px 0 var(--ink);
}
.ing-lead{margin:12px 0 22px;font-size:1.05rem;opacity:.96}
.ing-lead strong{font-family:var(--font-poster);font-weight:400;letter-spacing:.04em;color:var(--gold);font-size:1.2em}
.ing-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;margin-bottom:28px}
.ing-chips span{
  font-weight:700;font-size:.86rem;color:var(--ink);
  background:var(--paper);
  border:2px solid var(--ink);
  padding:7px 15px;border-radius:100px;
  transition:transform .18s;
}
.ing-chips span:hover{transform:translateY(-3px) rotate(-2deg)}
.ing-chips .ing-pastor{background:var(--gold);color:var(--ink)}
.ing-cta{background:#22C55E;color:#fff;border-color:var(--ink);box-shadow:5px 5px 0 var(--ink)}
.ing-cta:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--ink)}

/* ═══════════ UBICACIÓN ═══════════ */
.loc-sec{padding:96px 0}
.loc-sec .sec-kicker{color:var(--red)}
.loc-sec .sec-title .red{color:var(--red);text-shadow:2px 2px 0 var(--gold)}
.loc-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:34px;margin-top:50px;align-items:start}
.paper-card{
  background:#fdfcf9;
  border:1px solid rgba(20,20,22,.1);
  box-shadow:var(--shadow-card);
  padding:32px;
  position:relative;
  transform:rotate(-.8deg);
  transition:transform .3s;
}
.paper-card:hover{transform:rotate(0deg) translateY(-6px)}
.paper-card.alt{transform:rotate(.8deg)}
.paper-card .tape{width:100px;height:28px;top:-13px;left:28px;transform:rotate(-4deg)}
.paper-card h3{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:1.5rem;margin-bottom:18px;
  display:flex;align-items:center;gap:10px;
}
.hours-table{width:100%;border-collapse:collapse}
.hours-table td{padding:12px 4px;border-bottom:1px dashed rgba(20,20,22,.18);font-size:.95rem}
.hours-table tr:last-child td{border-bottom:none}
.hours-table td:first-child{font-weight:600;color:var(--ink-soft)}
.hours-table td:last-child{text-align:right;font-family:var(--font-poster);letter-spacing:.04em}
.hours-table tr.today td{color:var(--red-deep)}
.hours-table tr.today td:first-child::after{
  content:"HOY";
  font-family:var(--font-brush);font-size:.66rem;
  background:var(--gold);color:var(--ink);
  padding:2px 8px;border-radius:100px;margin-left:8px;
  display:inline-block;transform:rotate(-3deg);
}
.status-line{
  margin-top:18px;padding:13px 16px;
  font-weight:700;font-size:.9rem;
  display:flex;align-items:flex-start;gap:9px;
  border:2px dashed var(--ink);
  border-radius:12px;
  background:var(--paper);
}
.addr-text{color:var(--ink-soft);font-size:.98rem;margin-bottom:18px}
.addr-text strong{color:var(--ink)}
.map-frame{
  border:3px solid var(--ink);
  box-shadow:6px 6px 0 var(--red);
  margin-bottom:24px;
  aspect-ratio:16/10;
  background:#ddd;
}
.map-frame iframe{width:100%;height:100%;border:0}
.loc-btns{display:flex;flex-wrap:wrap;gap:12px}

/* ═══════════ CTA FINAL ═══════════ */
.final-sec{
  background:var(--red);
  border-top:3px solid var(--ink);
  padding:84px 0;
  text-align:center;color:#fff;
  position:relative;overflow:hidden;
}
.final-sec::before{
  content:"";position:absolute;left:-120px;top:-60px;
  width:380px;height:170px;background:var(--ink);
  border-radius:var(--rough);transform:rotate(-18deg);
}
.final-sec::after{
  content:"";position:absolute;right:-140px;bottom:-70px;
  width:400px;height:180px;background:var(--ink);
  border-radius:var(--rough-2);transform:rotate(-14deg);
}
.final-inner{position:relative;z-index:2}
.final-logo{
  width:150px;height:auto;
  margin:0 auto 6px;
  filter:drop-shadow(0 10px 16px rgba(0,0,0,.4));
  animation:floaty-logo 4.5s ease-in-out infinite;
}
@keyframes floaty-logo{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-9px) rotate(1.5deg)}}
.final-sec .marker{font-size:1.3rem;color:var(--gold);display:inline-block;transform:rotate(-2deg);margin-bottom:14px}
.final-sec h2{
  font-family:var(--font-poster);text-transform:uppercase;
  font-size:clamp(2.4rem,6vw,4.4rem);line-height:.95;
  margin-bottom:16px;
  text-shadow:4px 4px 0 var(--ink);
}
.final-sec p{font-size:1.08rem;opacity:.92;margin-bottom:34px}
.final-sec p b{font-family:var(--font-poster);letter-spacing:.06em;font-weight:400;font-size:1.2em}
.final-sec .btn-wa{border-color:var(--ink);box-shadow:6px 6px 0 var(--ink);font-size:1.15rem;padding:19px 36px}

/* ═══════════ FOOTER ═══════════ */
footer{background:var(--ink);color:#b9b9c0;padding:60px 0 30px}
.footer-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:40px;margin-bottom:44px}
.footer-brand p{font-size:.92rem;max-width:320px;margin-top:14px}
footer h4{
  font-family:var(--font-poster);text-transform:uppercase;
  color:#fff;font-size:1.05rem;letter-spacing:.06em;
  margin-bottom:16px;
}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:10px}
.footer-links a{font-size:.92rem;transition:color .2s;display:inline-flex;gap:8px;align-items:center}
.footer-links a:hover{color:var(--gold)}
.footer-bottom{
  border-top:1px solid rgba(245,241,232,.15);
  padding-top:24px;
  display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;
  font-size:.84rem;
}
.footer-bottom .marker{color:var(--gold)}

/* ═══════════ LIGHTBOX ═══════════ */
.lightbox{
  position:fixed;inset:0;z-index:1100;
  background:rgba(10,10,12,.93);
  display:grid;place-items:center;
  padding:28px;
  opacity:0;pointer-events:none;
  transition:opacity .28s;
}
.lightbox.show{opacity:1;pointer-events:auto}
.lightbox img{
  max-width:min(560px,92vw);max-height:86vh;
  object-fit:contain;
  border:6px solid #fff;
  box-shadow:0 40px 100px rgba(0,0,0,.8);
  transform:rotate(-1deg) scale(.92);
  transition:transform .28s;
}
.lightbox.show img{transform:rotate(-1deg) scale(1)}
.lightbox-close{
  position:absolute;top:22px;right:26px;
  width:52px;height:52px;
  background:var(--red);color:#fff;
  border:3px solid #fff;border-radius:50%;
  font-size:1.5rem;font-weight:800;
  display:grid;place-items:center;
  transition:transform .2s;
}
.lightbox-close:hover{transform:rotate(90deg) scale(1.1)}

/* ═══════════ CARRITO ═══════════ */
.cart-fab{
  position:fixed;right:22px;bottom:22px;z-index:950;
  width:66px;height:66px;
  background:var(--red);
  border:3px solid var(--ink);
  border-radius:18px;
  display:grid;place-items:center;
  box-shadow:5px 5px 0 var(--ink);
  transition:transform .2s, box-shadow .2s;
}
.cart-fab:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--ink)}
.cart-fab svg{width:27px;height:27px;stroke:#fff}
.cart-fab .cart-count{top:-10px;right:-10px}
.cart-fab.bump{animation:bump .4s}
@keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.15) rotate(-5deg)}100%{transform:scale(1)}}
.cart-overlay{
  position:fixed;inset:0;z-index:960;
  background:rgba(15,15,18,.55);
  opacity:0;pointer-events:none;transition:opacity .3s;
}
.cart-overlay.show{opacity:1;pointer-events:auto}
.cart-panel{
  position:fixed;top:0;right:0;bottom:0;z-index:970;
  width:min(440px,100%);
  background:var(--paper);
  border-left:3px solid var(--ink);
  display:flex;flex-direction:column;
  transform:translateX(105%);
  transition:transform .38s cubic-bezier(.32,.72,0,1);
  box-shadow:-30px 0 70px rgba(0,0,0,.4);
}
.cart-panel.show{transform:translateX(0)}
.cart-head{
  padding:20px 24px;
  background:var(--ink);color:var(--paper);
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:3px solid var(--red);
}
.cart-head h3{font-family:var(--font-poster);text-transform:uppercase;font-size:1.35rem;letter-spacing:.04em}
.cart-head h3 span{color:var(--gold)}
.cart-close{
  width:40px;height:40px;border-radius:10px;
  background:rgba(245,241,232,.12);
  display:grid;place-items:center;transition:background .2s;
}
.cart-close:hover{background:var(--red)}
.cart-close svg{width:18px;height:18px;stroke:#fff}
.cart-scroll{position:relative;flex:1;min-height:0;display:flex;flex-direction:column}
.cart-items{flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:12px}
.cart-fade{
  position:absolute;left:0;right:0;bottom:0;height:70px;
  pointer-events:none;
  background:linear-gradient(to top, var(--paper) 22%, rgba(245,241,232,0));
  display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;
  opacity:0;transform:translateY(4px);transition:opacity .25s, transform .25s;
}
.cart-fade.show{opacity:1;transform:translateY(0)}
.cart-fade-pill{
  font-family:var(--font-brush);font-size:.82rem;
  background:var(--ink);color:var(--gold);
  padding:5px 15px;border-radius:100px;
  box-shadow:0 5px 14px rgba(0,0,0,.3);
  animation:fadeBob 1.5s ease-in-out infinite;
}
@keyframes fadeBob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
.cart-empty{text-align:center;color:var(--ink-soft);padding:40px 12px;font-size:.95rem}
.cart-empty .big{font-size:3rem;display:block;margin-bottom:10px}
.cart-empty .marker{color:var(--red-deep)}
.cart-item{
  display:flex;align-items:center;gap:12px;
  background:#fdfcf9;
  border:2px solid var(--ink);
  padding:10px 12px;
  box-shadow:3px 3px 0 rgba(20,20,22,.25);
}
.cart-item.just-added{animation:justAdded 1.1s ease}
@keyframes justAdded{
  0%{box-shadow:0 0 0 0 var(--gold), 3px 3px 0 rgba(20,20,22,.25);transform:scale(1)}
  25%{box-shadow:0 0 0 4px var(--gold), 3px 3px 0 rgba(20,20,22,.25);transform:scale(1.02)}
  100%{box-shadow:0 0 0 0 rgba(255,183,3,0), 3px 3px 0 rgba(20,20,22,.25);transform:scale(1)}
}
.ci-thumb{width:52px;height:52px;object-fit:cover;flex-shrink:0;border:2px solid var(--ink)}
.ci-thumb.ci-pizza{display:grid;place-items:center;background:#fff;padding:2px}
.ci-thumb.ci-pizza .pizza-svg{animation:none;filter:none}
.ci-thumb.ci-snack{display:grid;place-items:center;background:#fff;font-size:1.5rem}
.ci-info{flex:1;min-width:0}
.ci-name{font-weight:800;font-size:.84rem;line-height:1.2}
.ci-detail{font-size:.72rem;color:var(--ink-soft);line-height:1.35;margin:2px 0}
.ci-detail b{color:var(--red-deep)}
.ci-price{color:var(--red-deep);font-weight:700;font-size:.8rem}
.ci-qty{display:flex;align-items:center;gap:7px}
.qty-btn{
  width:28px;height:28px;
  background:var(--ink);color:#fff;
  font-weight:800;font-size:1rem;
  display:grid;place-items:center;
  transition:background .2s;
}
.qty-btn:hover{background:var(--red)}
.ci-qty span{font-family:var(--font-poster);min-width:18px;text-align:center;font-size:1rem}
.cart-form{padding:4px 22px 10px;display:flex;flex-direction:column;gap:10px}
.cart-form label{font-family:var(--font-brush);font-size:.78rem;color:var(--ink-soft)}
.cart-form input,.cart-form textarea,.cart-form select{
  width:100%;
  background:#fdfcf9;
  border:2px solid var(--ink);
  padding:11px 13px;
  color:var(--ink);font-family:var(--font-body);font-size:.92rem;
  outline:none;resize:none;
  transition:box-shadow .2s;
}
.cart-form input:focus,.cart-form textarea:focus,.cart-form select:focus{box-shadow:3px 3px 0 var(--red)}
.cart-form ::placeholder{color:#9a9aa2}
.ing-hint{font-family:var(--font-body);color:var(--red-deep);font-weight:700;font-size:.72rem}
.ing-picker{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
.ing-pick{
  font-size:.74rem;font-weight:700;
  background:#fdfcf9;color:var(--ink-soft);
  border:2px solid var(--ink);
  padding:6px 11px;border-radius:100px;
  transition:transform .15s, background .15s, color .15s;
}
.ing-pick:hover:not(:disabled){transform:translateY(-2px)}
.ing-pick.on{background:var(--red);color:#fff;border-color:var(--red)}
.ing-pick.pastor.on{background:var(--gold);color:var(--ink);border-color:var(--ink)}
.ing-pick:disabled{opacity:.35;cursor:not-allowed}
.cart-foot{
  padding:16px 22px 22px;
  background:var(--ink);
  border-top:3px solid var(--red);
}
.cart-total-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px}
.cart-total-row .label{font-family:var(--font-brush);color:#b9b9c0;font-size:.95rem}
.cart-total-row .amount{font-family:var(--font-poster);font-size:2rem;color:var(--gold)}
.btn-send-wa{
  width:100%;
  font-family:var(--font-poster);text-transform:uppercase;
  letter-spacing:.05em;font-size:1.05rem;
  background:#22C55E;color:#fff;
  padding:16px;
  border:3px solid var(--paper);
  border-radius:12px;
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  transition:transform .18s, opacity .2s;
}
.btn-send-wa:hover{transform:translateY(-3px)}
.btn-send-wa:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* ═══════════ CONFIGURADOR DE PIZZA ═══════════ */
.pz-overlay{
  position:fixed;inset:0;z-index:1050;
  background:rgba(15,15,18,.6);
  display:grid;place-items:center;padding:18px;
  opacity:0;pointer-events:none;transition:opacity .28s;
}
.pz-overlay.show{opacity:1;pointer-events:auto}
.pz-modal{
  width:min(520px,100%);max-height:min(680px,92vh);
  background:var(--paper);
  border:3px solid var(--ink);
  box-shadow:8px 8px 0 var(--red), 0 40px 90px rgba(0,0,0,.5);
  display:flex;flex-direction:column;
  transform:translateY(24px) scale(.97);transition:transform .28s cubic-bezier(.32,.72,0,1);
}
.pz-overlay.show .pz-modal{transform:translateY(0) scale(1)}
.pz-head{
  padding:16px 20px;
  background:var(--ink);color:var(--paper);
  border-bottom:3px solid var(--red);
  display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
}
.pz-title{font-family:var(--font-poster);text-transform:uppercase;font-size:1.35rem;letter-spacing:.03em;line-height:1.1}
.pz-sub{font-size:.78rem;color:#b9b9c0;margin-top:4px}
.pz-sub b{color:var(--gold)}
.pz-close{
  width:38px;height:38px;flex-shrink:0;border-radius:10px;
  background:rgba(245,241,232,.12);color:#fff;
  font-size:1.05rem;font-weight:800;
  display:grid;place-items:center;transition:background .2s;
}
.pz-close:hover{background:var(--red)}
.pz-body{flex:1;overflow-y:auto;padding:18px 20px}
.pz-label{
  font-family:var(--font-brush);font-size:.92rem;color:var(--red-deep);
  margin:16px 0 9px;
}
.pz-body .pz-label:first-child{margin-top:0}
.pz-hint{font-family:var(--font-body);font-weight:700;font-size:.72rem;color:var(--ink-soft)}
.pz-sizes{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
.pz-size{
  background:#fdfcf9;border:2px solid var(--ink);
  padding:9px 6px;border-radius:10px;
  display:flex;flex-direction:column;align-items:center;gap:2px;
  transition:transform .15s, background .15s, color .15s;
}
.pz-size:hover{transform:translateY(-2px)}
.pz-size.on{background:var(--red);border-color:var(--red);color:#fff;box-shadow:3px 3px 0 var(--ink)}
.pz-size-name{font-weight:800;font-size:.82rem}
.pz-size-price{font-family:var(--font-poster);font-size:1.02rem;letter-spacing:.03em}
.pz-orilla{
  width:100%;
  background:#fdfcf9;border:2px dashed var(--ink);
  padding:12px 14px;border-radius:12px;
  display:flex;align-items:center;gap:10px;
  font-weight:700;font-size:.9rem;text-align:left;
  transition:background .15s, border-color .15s;
}
.pz-orilla b{color:var(--red-deep);margin-left:auto}
.pz-orilla.on{background:#fff7e0;border-color:var(--gold);border-style:solid}
.pz-check{
  width:24px;height:24px;flex-shrink:0;
  border:2px solid var(--ink);border-radius:7px;
  display:grid;place-items:center;
  font-size:.8rem;color:#fff;background:#fdfcf9;
}
.pz-orilla.on .pz-check{background:var(--green);border-color:var(--green)}
.pz-foot{
  padding:14px 20px;
  background:var(--ink);border-top:3px solid var(--red);
  display:flex;align-items:center;justify-content:space-between;gap:14px;
}
.pz-total{display:flex;align-items:baseline;gap:8px;color:#b9b9c0}
.pz-total span{font-family:var(--font-brush);font-size:.85rem}
.pz-total b{font-family:var(--font-poster);font-size:1.7rem;color:var(--gold);font-weight:400}
.pz-confirm{
  font-family:var(--font-poster);text-transform:uppercase;
  letter-spacing:.05em;font-size:.95rem;
  background:#22C55E;color:#fff;
  padding:13px 20px;border:3px solid var(--paper);border-radius:12px;
  display:inline-flex;align-items:center;gap:8px;
  transition:transform .18s;
}
.pz-confirm:hover{transform:translateY(-2px)}
.pz-confirm svg{width:16px;height:16px;stroke:#fff}

/* Toast */
.toast{
  position:fixed;left:50%;bottom:106px;z-index:990;
  transform:translateX(-50%) translateY(16px) rotate(-1deg);
  background:var(--ink);color:#fff;
  font-family:var(--font-brush);font-size:.95rem;
  padding:13px 24px;
  border:2px solid var(--gold);
  box-shadow:5px 5px 0 rgba(229,9,20,.8);
  opacity:0;pointer-events:none;
  transition:opacity .3s, transform .3s;
  white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis;
}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0) rotate(-1deg)}

/* Reveal */
.reveal{opacity:0;transform:translateY(30px);transition:opacity .65s ease, transform .65s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.combos-grid .flyer-card.reveal{transition:opacity .6s ease, transform .45s ease, box-shadow .3s}
.combos-grid .flyer-card.reveal:not(.visible){opacity:0;transform:translateY(34px) rotate(0)}

/* ═══════════ RESPONSIVE ═══════════ */
@media (max-width:1024px){
  .hero-inner{grid-template-columns:1fr;gap:70px;text-align:center}
  .hero-desc{margin-inline:auto}
  .hero-ctas,.hero-badges{justify-content:center}
  .hero-flyer{max-width:440px;margin-inline:auto}
  .loc-grid{grid-template-columns:1fr}
  .boards-grid{grid-template-columns:1fr;gap:40px}
}
@media (max-width:860px){
  .nav-links{display:none}
  .hamburger{display:grid}
  .footer-grid{grid-template-columns:1fr;gap:32px}
  /* En móvil no dependemos del scroll-reveal: mostramos todo siempre */
  .reveal{opacity:1;transform:none}
  .combos-grid .flyer-card.reveal:not(.visible){opacity:1;transform:none}
}
@media (max-width:560px){
  .hero{padding:44px 0 70px}
  .hero-ctas .btn{width:100%}
  .price-splash{width:96px;height:96px;right:-10px;top:-24px}
  .price-splash .num{font-size:1.7rem}
  .combos-grid{gap:38px 20px}
  .cart-fab{right:14px;bottom:14px}
  .loc-btns .btn{width:100%}
  .menu-board{padding:28px 20px 24px}
  .pl-name{font-size:.94rem}
  .pl-main{font-size:1.18rem}
  .ing-panel{padding:30px 20px}
  .ing-cta{width:100%}
  /* configurador como hoja inferior en móvil */
  .pz-overlay{padding:0;align-items:end}
  .pz-modal{width:100%;max-height:94dvh;border-left:none;border-right:none;border-bottom:none;box-shadow:0 -20px 60px rgba(0,0,0,.55)}
  .pz-sizes{grid-template-columns:repeat(3,1fr)}
  .pz-foot{flex-direction:column;align-items:stretch;text-align:center}
  .pz-total{justify-content:center}
  .pz-confirm{justify-content:center}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}
  .ticker-track{animation:none}
}
</style>
