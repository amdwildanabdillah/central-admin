<script setup>
defineProps(['active']);
defineEmits(['switch', 'logout']);

const menuItems = [
  { id: 'vixel', label: 'Vixel Works', icon: 'ph ph-squares-four', iconFill: 'ph-fill ph-squares-four', activeClass: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' },
  { id: 'personal', label: 'Personal Porto', icon: 'ph ph-user-circle', iconFill: 'ph-fill ph-user-circle', activeClass: 'bg-purple-400/10 text-purple-400 border-purple-400/20' },
  { id: 'storydesto', label: 'Storydesto HQ', icon: 'ph ph-camera', iconFill: 'ph-fill ph-camera', activeClass: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' }
];
</script>

<template>
  <aside class="hidden md:flex w-64 border-r border-white/10 p-6 flex-col bg-[#111113] z-20 h-full">
    <div class="mb-10 text-left px-2">
      <h1 class="text-2xl font-extrabold tracking-tight italic">Central <span class="text-cyan-400">Admin.</span></h1>
      <p class="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">Vixel Creative HQ</p>
    </div>
    
    <nav class="flex-1 space-y-3">
      <button v-for="item in menuItems" :key="item.id" 
        @click="$emit('switch', item.id)" 
        :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition border group cursor-pointer', 
                 active === item.id ? item.activeClass : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white']">
          <i :class="[active === item.id ? item.iconFill : item.icon, 'text-xl group-hover:scale-110 transition-transform']"></i> 
          {{ item.label }}
      </button>
    </nav>
    
    <button @click="$emit('logout')" class="flex items-center gap-3 text-gray-500 hover:text-red-400 px-4 py-3 transition font-medium group mt-auto border border-transparent hover:border-red-400/20 rounded-xl cursor-pointer">
      <i class="ph ph-sign-out text-xl group-hover:-translate-x-1 transition-transform"></i> Log Out
    </button>
  </aside>
</template>