<template>
  <div class="h-screen bg-[#09090b] text-white font-sans flex flex-col md:flex-row overflow-hidden text-sm relative">
    
    <Sidebar :active="activeMenu" @switch="activeMenu = $event" @logout="handleLogout" />

    <header class="md:hidden flex justify-between items-center p-6 border-b border-white/10 bg-[#111113] z-50 shadow-xl relative">
        <h1 class="text-xl font-extrabold italic">Central <span class="text-cyan-400">Admin.</span></h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-red-400"><i class="ph ph-sign-out text-2xl"></i></button>
    </header>

    <div class="flex-1 flex flex-col min-w-0 relative z-10 bg-[#09090b]">
        <TabVixel v-if="activeMenu === 'vixel' && isOwner" />
        <TabPersonal v-if="activeMenu === 'personal' && isOwner" />
        <TabStorydesto v-if="activeMenu === 'storydesto'" />
        
        <div v-if="(activeMenu === 'vixel' || activeMenu === 'personal') && !isOwner" class="flex-1 flex items-center justify-center p-10 text-center">
            <div>
                <i class="ph ph-prohibit text-6xl text-red-500 mb-4"></i>
                <h2 class="text-xl font-bold">Access Denied</h2>
                <p class="text-gray-500 text-xs uppercase tracking-widest mt-2">Cuma Wildan yang punya kunci ruangan ini.</p>
                <button @click="activeMenu = 'storydesto'" class="mt-6 px-6 py-2 bg-white text-black rounded-full font-bold uppercase text-[10px]">Balik ke Storydesto</button>
            </div>
        </div>
    </div>

    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-[#09090b]/95 backdrop-blur-2xl border-t border-white/10 flex justify-around p-4 pb-8 z-[200]">
        <button v-if="isOwner" @click="activeMenu = 'vixel'" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-gray-600']">
            <i :class="activeMenu === 'vixel' ? 'ph-fill ph-squares-four text-3xl' : 'ph ph-squares-four text-3xl'"></i>
            <span class="text-[9px] font-black uppercase">Vixel</span>
        </button>

        <button v-if="isOwner" @click="activeMenu = 'personal'" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'personal' ? 'text-purple-400' : 'text-gray-600']">
            <i :class="activeMenu === 'personal' ? 'ph-fill ph-user-circle text-3xl' : 'ph ph-user-circle text-3xl'"></i>
            <span class="text-[9px] font-black uppercase">Personal</span>
        </button>

        <button @click="activeMenu = 'storydesto'" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'storydesto' ? 'text-yellow-400' : 'text-gray-600']">
            <i :class="activeMenu === 'storydesto' ? 'ph-fill ph-camera text-3xl' : 'ph ph-camera text-3xl'"></i>
            <span class="text-[9px] font-black uppercase">Storydesto</span>
        </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; 
import { supabase } from '../supabase';
import Sidebar from '../components/Sidebar.vue'; 
import TabVixel from './tabs/TabVixel.vue'; 
import TabPersonal from './tabs/TabPersonal.vue'; 
import TabStorydesto from './tabs/TabStorydesto.vue';

const activeMenu = ref('storydesto'); // Default ke Storydesto biar Firman nggak kaget liat blank page
const isOwner = ref(false);

onMounted(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        if (user.email === 'amd.wildanabdillah@gmail.com') {
            isOwner.value = true;
            activeMenu.value = 'vixel'; // Kalo lu yang login, default balik ke Vixel
        }
    }
});

const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    window.location.href = "/"; 
};
</script>