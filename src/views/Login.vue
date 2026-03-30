<template>
  <div class="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden font-sans">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    
    <div class="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl">
      <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
        <i class="ph ph-lock-key text-3xl text-cyan-400"></i>
      </div>
      
      <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Central <span class="text-cyan-400">Admin.</span></h1>
      <p class="text-gray-400 text-sm mb-10">Restricted access. Please verify your identity.</p>
      
      <form @submit.prevent="handleEmailLogin" class="space-y-4 mb-8 text-left">
        <div>
          <label class="text-[10px] text-gray-500 font-black uppercase mb-2 block ml-4 tracking-widest">Staff Email</label>
          <input v-model="email" type="email" placeholder="admin@desto.com" required
            class="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white outline-none focus:border-cyan-400 transition shadow-inner text-sm">
        </div>
        <div>
          <label class="text-[10px] text-gray-500 font-black uppercase mb-2 block ml-4 tracking-widest">Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required
            class="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white outline-none focus:border-cyan-400 transition shadow-inner text-sm">
        </div>
        <button 
          :disabled="isLoading"
          type="submit"
          class="w-full bg-cyan-400 text-black py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          {{ isLoading ? 'Verifying...' : 'Sign In Staff' }}
        </button>
      </form>

      <div class="relative flex items-center py-4 mb-8">
        <div class="flex-grow border-t border-white/5"></div>
        <span class="flex-shrink mx-4 text-gray-600 text-[9px] font-bold uppercase tracking-[0.3em]">Or Owner Access</span>
        <div class="flex-grow border-t border-white/5"></div>
      </div>

      <button 
        @click="loginWithGoogle"
        class="w-full bg-white/5 border border-white/10 text-white py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Login with Google
      </button>

      <p v-if="errorMsg" class="mt-6 text-red-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref('');

// Cek session saat load
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    router.push('/dashboard');
  }
});

// LOGIN STAFF (Email & Password)
const handleEmailLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;
    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// LOGIN OWNER (Google)
const loginWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard' 
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error("Gagal login:", error.message);
  }
};
</script>