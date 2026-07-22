<script setup>
/* ══════════════════════════════════════════════
   PizzaSvg — pizza animada en perspectiva 3/4
   Recibe la lista de ingredientes de la especialidad
   y coloca los toppings correspondientes sobre el queso.
══════════════════════════════════════════════ */
import { computed } from 'vue'

const props = defineProps({
  ings: { type: Array, default: () => [] }
})

/* id único por instancia (evita colisión de gradientes/filtros) */
let _counter = 0
const uid = 'pz' + (++_counter) + '-' + Math.floor(Math.random() * 1e4)

/* normaliza: minúsculas y sin acentos */
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const KIND = {
  jamon: 'jamon', pina: 'pina', salami: 'salami', salchicha: 'salchicha',
  chorizo: 'chorizo', tocino: 'tocino', jalapeno: 'jalapeno', jitomate: 'jitomate',
  cebolla: 'cebolla', elote: 'elote', morron: 'morron', champinon: 'champinon',
  peperoni: 'peperoni', pepperoni: 'peperoni', aceitunas: 'aceituna', aceituna: 'aceituna'
}
const kinds = computed(() => {
  const ks = props.ings.map((i) => KIND[norm(i)] || 'peperoni')
  return ks.length ? ks : ['peperoni']
})

/* ── posiciones de toppings sobre el plano en perspectiva ── */
const K = 0.56          // achatamiento vertical (perspectiva)
const CY = 88           // centro vertical del queso
function ring (count, r, phase) {
  const arr = []
  for (let i = 0; i < count; i++) {
    const t = phase + (i / count) * Math.PI * 2
    arr.push({ x: Math.cos(t) * r, y: Math.sin(t) * r * K })
  }
  return arr
}
const RAW = [{ x: 0, y: 0 }, ...ring(6, 40, 0.35), ...ring(9, 68, 0.1)]
const slots = RAW.map((p) => {
  const depth = 1 + (p.y / (68 * K)) * 0.16   // los de enfrente (abajo) un poco más grandes
  return { x: 120 + p.x, y: CY + p.y, s: +depth.toFixed(3) }
})

const toppings = computed(() => {
  const ks = kinds.value
  const seed = props.ings.length
  return slots
    .map((sl, i) => ({ ...sl, kind: ks[(i + seed) % ks.length], i }))
    .sort((a, b) => a.y - b.y)   // los de atrás se dibujan primero
})
</script>

<template>
  <div class="pizza-wrap">
    <svg class="pizza-svg" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <defs>
        <radialGradient :id="uid + '-cheese'" cx="42%" cy="34%" r="72%">
          <stop offset="0" stop-color="#ffe28f" />
          <stop offset="60%" stop-color="#f8c85f" />
          <stop offset="100%" stop-color="#eab049" />
        </radialGradient>
        <radialGradient :id="uid + '-pep'" cx="40%" cy="38%" r="70%">
          <stop offset="0" stop-color="#e2503f" />
          <stop offset="100%" stop-color="#c22b23" />
        </radialGradient>
        <linearGradient :id="uid + '-crust'" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#edb45f" />
          <stop offset="1" stop-color="#d68f3b" />
        </linearGradient>
      </defs>

      <!-- sombra en el piso -->
      <ellipse cx="122" cy="156" rx="90" ry="15" fill="#000" opacity="0.16" />

      <!-- costado / grosor de la pizza (da el volumen 3D) -->
      <ellipse cx="120" cy="103" rx="103" ry="60" fill="#a9682a" />
      <!-- tapa (masa dorada) -->
      <ellipse cx="120" cy="90" rx="103" ry="60" :fill="`url(#${uid}-crust)`" />
      <!-- borde interno / orilla -->
      <ellipse cx="120" cy="89" rx="88" ry="50" fill="#cf9a4a" />
      <!-- salsa -->
      <ellipse cx="120" cy="88" rx="85" ry="48" fill="#bb3b28" />
      <!-- queso -->
      <ellipse cx="120" cy="87" rx="80" ry="45" :fill="`url(#${uid}-cheese)`" />
      <!-- manchas de queso derretido -->
      <g opacity="0.45" fill="#fff1c6">
        <ellipse cx="96" cy="76" rx="11" ry="5" />
        <ellipse cx="150" cy="82" rx="13" ry="6" />
        <ellipse cx="122" cy="98" rx="10" ry="4.5" />
      </g>
      <!-- brillo -->
      <ellipse cx="100" cy="72" rx="33" ry="11" fill="#fff" opacity="0.13" />

      <!-- ── TOPPINGS ── -->
      <g v-for="t in toppings" :key="t.i" :transform="`translate(${t.x} ${t.y}) scale(${t.s} ${t.s * 0.72})`">
        <!-- Peperoni -->
        <template v-if="t.kind === 'peperoni'">
          <circle r="8.2" :fill="`url(#${uid}-pep)`" stroke="#8d1b1b" stroke-width="1" />
          <circle cx="-2.4" cy="-1.6" r="1.1" fill="#7d1717" />
          <circle cx="2.8" cy="1" r="1.1" fill="#7d1717" />
          <circle cx="-0.8" cy="3" r="1" fill="#7d1717" />
        </template>
        <!-- Salami -->
        <template v-else-if="t.kind === 'salami'">
          <circle r="8" fill="#c23b34" stroke="#93221d" stroke-width="1" />
          <circle cx="-2.5" cy="-1" r="1.4" fill="#f0e2d5" />
          <circle cx="2.6" cy="2" r="1.3" fill="#f0e2d5" />
          <circle cx="1" cy="-3" r="1.1" fill="#f0e2d5" />
          <circle cx="-3" cy="2.6" r="1" fill="#f0e2d5" />
        </template>
        <!-- Chorizo (grumos) -->
        <template v-else-if="t.kind === 'chorizo'">
          <circle r="7" fill="#9c2a1e" />
          <circle cx="-1.6" cy="1" r="1.3" fill="#7a1d14" />
          <circle cx="2.1" cy="-1.6" r="1.2" fill="#7a1d14" />
          <circle cx="1" cy="2.4" r="1" fill="#c0402c" />
        </template>
        <!-- Jamón -->
        <template v-else-if="t.kind === 'jamon'">
          <rect x="-7.5" y="-6.5" width="15" height="13" rx="4.5" fill="#f2a8a2" stroke="#dd867f" stroke-width="1" />
          <circle cx="2" cy="1.4" r="1.6" fill="#e79089" />
        </template>
        <!-- Salchicha -->
        <template v-else-if="t.kind === 'salchicha'">
          <circle r="7" fill="#edaaa2" stroke="#d8877e" stroke-width="1" />
          <circle r="3.4" fill="none" stroke="#d8877e" stroke-width="1" />
        </template>
        <!-- Piña -->
        <template v-else-if="t.kind === 'pina'">
          <path d="M0,-7 L6,0 L0,7 L-6,0 Z" fill="#ffd23e" stroke="#e8b52c" stroke-width="1" />
          <path d="M0,-3.6 L3,0 L0,3.6 L-3,0 Z" fill="#ffe58f" opacity="0.75" />
        </template>
        <!-- Champiñón -->
        <template v-else-if="t.kind === 'champinon'">
          <ellipse rx="8" ry="6.4" fill="#d8c4a2" stroke="#b7a07c" stroke-width="1" />
          <path d="M-5,1.5 h10" stroke="#b09a76" stroke-width="1" />
          <ellipse cx="0" cy="2.4" rx="2.6" ry="1.8" fill="#c3ab84" />
        </template>
        <!-- Tocino -->
        <template v-else-if="t.kind === 'tocino'">
          <path d="M-9,-3 q4,-2.5 9,0 q4,2.5 9,0 l0,5 q-5,2.5 -9,0 q-4,-2.5 -9,0 z" fill="#b6573b" />
          <path d="M-9,-0.6 q4,-2.5 9,0 q4,2.5 9,0" fill="none" stroke="#e59a7d" stroke-width="1.6" />
        </template>
        <!-- Jalapeño -->
        <template v-else-if="t.kind === 'jalapeno'">
          <circle r="6.5" fill="#3f9b45" />
          <circle r="3.4" fill="#c7eaac" />
          <circle r="3.4" fill="none" stroke="#2f7d38" stroke-width="1" />
        </template>
        <!-- Jitomate -->
        <template v-else-if="t.kind === 'jitomate'">
          <circle r="7" fill="#e24a30" />
          <circle r="4.4" fill="#f2795f" />
          <circle cx="-1.6" cy="-1" r="0.8" fill="#ffd9c9" />
          <circle cx="1.7" cy="1" r="0.8" fill="#ffd9c9" />
        </template>
        <!-- Cebolla (aro translúcido) -->
        <template v-else-if="t.kind === 'cebolla'">
          <circle r="7" fill="none" stroke="#efe6d8" stroke-width="2.4" opacity="0.9" />
          <circle r="4.3" fill="none" stroke="#e3d6c4" stroke-width="1.4" opacity="0.75" />
        </template>
        <!-- Morrón (tira de pimiento) -->
        <template v-else-if="t.kind === 'morron'">
          <path d="M-8,-2.5 q8,-3 16,0 l0,5 q-8,3 -16,0 z" fill="#3ea94e" stroke="#2c8039" stroke-width="0.8" />
          <path d="M-8,-2.5 q8,-3 16,0" fill="none" stroke="#7fc98a" stroke-width="1" />
        </template>
        <!-- Elote (granos) -->
        <template v-else-if="t.kind === 'elote'">
          <g fill="#ffcf1f" stroke="#e8b415" stroke-width="0.5">
            <circle cx="-3" cy="-2" r="2" />
            <circle cx="1" cy="-3" r="2" />
            <circle cx="3.6" cy="0.5" r="2" />
            <circle cx="-1" cy="2" r="2" />
            <circle cx="-4" cy="2.4" r="1.8" />
            <circle cx="2.4" cy="3" r="1.8" />
          </g>
        </template>
        <!-- Aceituna (aro negro) -->
        <template v-else-if="t.kind === 'aceituna'">
          <circle r="5.6" fill="#2c2b30" />
          <circle r="2.4" fill="#6d5a3a" />
        </template>
      </g>

      <!-- ── VAPOR ── -->
      <g fill="none" stroke="#c9c4bb" stroke-width="3" stroke-linecap="round">
        <path class="steam s1" d="M104,58 q-7,-9 -1,-18 q6,-9 -1,-18" />
        <path class="steam s2" d="M121,60 q7,-10 1,-19 q-6,-9 1,-18" />
        <path class="steam s3" d="M137,57 q-6,-9 0,-18 q6,-9 0,-17" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pizza-wrap {
  transition: transform 0.3s ease;
}
.pizza-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  transform-origin: center bottom;
  animation: floaty 4.5s ease-in-out infinite;
  filter: drop-shadow(0 6px 8px rgba(20, 20, 22, 0.18));
}
@keyframes floaty {
  0%, 100% { transform: translateY(0) rotate(-0.8deg); }
  50%      { transform: translateY(-7px) rotate(0.8deg); }
}
.steam {
  opacity: 0;
  transform-origin: center bottom;
  animation: steam 3.2s ease-in-out infinite;
}
.steam.s2 { animation-delay: 1s; }
.steam.s3 { animation-delay: 1.9s; }
@keyframes steam {
  0%   { opacity: 0; transform: translateY(7px) scaleY(0.7); }
  30%  { opacity: 0.55; }
  100% { opacity: 0; transform: translateY(-15px) scaleY(1.25); }
}
@media (prefers-reduced-motion: reduce) {
  .pizza-svg { animation: none; }
  .steam { animation: none; opacity: 0; }
}
</style>
