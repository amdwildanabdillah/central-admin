<template>
  <div class="h-screen bg-[#09090b] text-white font-sans flex flex-col md:flex-row overflow-hidden text-sm">
    
    <aside class="hidden md:flex w-64 border-r border-white/10 p-6 flex-col bg-[#111113] z-20">
      <div class="mb-10 text-left">
        <h1 class="text-2xl font-extrabold tracking-tight italic">Central <span class="text-cyan-400">Admin.</span></h1>
        <p class="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Super Dashboard</p>
      </div>
      
      <nav class="flex-1 space-y-3">
        <button @click="switchMenu('vixel')" :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition border', activeMenu === 'vixel' ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white']">
            <i :class="activeMenu === 'vixel' ? 'ph-fill ph-squares-four text-xl' : 'ph ph-squares-four text-xl'"></i> Vixel Works
        </button>
        <button @click="switchMenu('personal')" :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition border', activeMenu === 'personal' ? 'bg-purple-400/10 text-purple-400 border-purple-400/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white']">
            <i :class="activeMenu === 'personal' ? 'ph-fill ph-user-circle text-xl' : 'ph ph-user-circle text-xl'"></i> Personal Porto
        </button>
      </nav>
      
      <button @click="handleLogout" class="flex items-center gap-3 text-gray-500 hover:text-red-400 px-4 py-3 transition font-medium group mt-auto">
        <i class="ph ph-sign-out text-xl group-hover:-translate-x-1 transition-transform"></i> Log Out
      </button>
    </aside>

    <header class="md:hidden flex justify-between items-center p-6 border-b border-white/10 bg-[#111113] z-30">
        <h1 class="text-xl font-extrabold italic">Central <span class="text-cyan-400">Admin.</span></h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-red-400"><i class="ph ph-sign-out text-2xl"></i></button>
    </header>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <div class="p-6 md:p-10 pb-4 bg-[#09090b] z-10 text-left">
          <h2 class="text-2xl md:text-4xl font-bold tracking-tighter">
            Manage <span :class="activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400'">{{ activeMenu === 'vixel' ? 'Vixel Projects' : 'Personal Porto' }}</span>
          </h2>
          <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-1 opacity-50">Database: {{ activeTable }}</p>
      </div>

      <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-2 pb-48 md:pb-10">
        <div v-if="isLoading" class="py-20 text-center flex flex-col items-center justify-center">
            <i :class="['ph ph-spinner-gap text-4xl animate-spin mb-4', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400']"></i>
        </div>

        <div v-else class="bg-[#111113] border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead class="sticky top-0 bg-[#111113] z-10">
              <tr class="border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest bg-white/5">
                <th class="p-5 pl-8 font-bold w-12 text-center">Pin</th>
                <th class="p-5 font-bold">Title & Client</th>
                <th class="p-5 font-bold text-center">Category</th>
                <th class="p-5 font-bold text-center" v-if="activeMenu === 'personal'">Type</th>
                <th class="p-5 pr-8 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="project in projects" :key="project.id" class="border-b border-white/5 hover:bg-white/[0.02] transition">
                <td class="p-5 pl-8 text-center">
                  <i v-if="project.isPinned" :class="['ph-fill ph-push-pin text-xl', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400']"></i>
                  <i v-else class="ph ph-push-pin text-gray-700 text-xl"></i>
                </td>
                <td class="p-5">
                  <div class="font-bold text-white text-base tracking-tight">{{ project.title }}</div>
                  <div class="text-xs text-gray-500 mt-0.5" v-if="project.project_type !== 'cinema'">{{ project.client || 'No Client' }}</div>
                </td>
                <td class="p-5 text-center">
                  <span class="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 text-gray-400">{{ project.category }}</span>
                </td>
                <td class="p-5 text-center" v-if="activeMenu === 'personal'">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter" 
                        :class="project.project_type === 'dev' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : project.project_type === 'photo' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'">
                    {{ project.project_type }}
                  </span>
                </td>
                <td class="p-5 pr-8 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditModal(project)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black transition border border-white/10"><i class="ph ph-pencil-simple text-lg"></i></button>
                    <button @click="deleteProject(project.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition border border-white/10"><i class="ph ph-trash text-lg"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <button @click="openAddModal" 
              :class="['fixed bottom-28 right-6 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center z-50 transition-all active:scale-95 active:rotate-12', 
                       activeMenu === 'vixel' ? 'bg-cyan-400 text-black shadow-cyan-400/40' : 'bg-purple-400 text-black shadow-purple-400/40']">
          <i class="ph-fill ph-plus text-3xl"></i>
      </button>

      <div class="md:hidden fixed bottom-[88px] left-0 w-full px-6 py-3 flex gap-3 z-40">
          <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" 
             target="_blank"
             class="flex-1 flex items-center justify-center gap-2 bg-[#111113]/80 backdrop-blur-xl border border-white/10 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] active:bg-white/10 transition shadow-xl">
             View Site
          </a>
          <button @click="seedData" 
             class="flex-1 flex items-center justify-center gap-2 bg-[#111113]/80 backdrop-blur-xl border border-white/10 text-gray-500 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] active:bg-white/10 transition shadow-xl">
             Seed
          </button>
      </div>

      <nav class="md:hidden fixed bottom-0 w-full bg-[#09090b]/90 backdrop-blur-2xl border-t border-white/10 flex justify-around p-4 pb-8 z-50">
          <button @click="switchMenu('vixel')" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-gray-600']"><i :class="activeMenu === 'vixel' ? 'ph-fill ph-squares-four text-3xl' : 'ph ph-squares-four text-3xl'"></i><span class="text-[9px] font-black uppercase tracking-tighter">Vixel</span></button>
          <button @click="switchMenu('personal')" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'personal' ? 'text-purple-400' : 'text-gray-600']"><i :class="activeMenu === 'personal' ? 'ph-fill ph-user-circle text-3xl' : 'ph ph-user-circle text-3xl'"></i><span class="text-[9px] font-black uppercase tracking-tighter">Personal</span></button>
      </nav>

      <div class="hidden md:flex fixed bottom-10 right-10 gap-3 z-40">
           <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" 
             target="_blank"
             class="flex items-center gap-2 bg-[#111113] border border-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition shadow-2xl">
             View Site <i class="ph ph-arrow-square-out"></i>
          </a>
          <button @click="seedData" class="bg-[#111113] border border-white/10 text-gray-500 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-white hover:text-white transition">
            Seed
          </button>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
        <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2rem] shadow-2xl my-8 flex flex-col max-h-[90vh] text-left">
            <div class="p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2rem]">
                <h2 class="text-2xl font-black tracking-tight italic">{{ isEditing ? 'Edit Project.' : 'New Project.' }}</h2>
                <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"><i class="ph ph-x text-xl"></i></button>
            </div>
            
            <div class="p-8 overflow-y-auto flex-1">
                <form class="space-y-8 text-sm">
                    <div :class="['flex items-center justify-between p-5 rounded-2xl border transition', activeMenu === 'vixel' ? 'bg-cyan-400/5 border-cyan-400/20 text-cyan-400' : 'bg-purple-400/5 border-purple-400/20 text-purple-400']">
                        <div class="flex items-center gap-3">
                          <i class="ph-fill ph-push-pin text-xl"></i>
                          <span class="font-bold uppercase tracking-widest text-xs">Pin to Selected Works</span>
                        </div>
                        <input type="checkbox" v-model="form.isPinned" :class="['w-6 h-6 rounded-lg', activeMenu === 'vixel' ? 'accent-cyan-400' : 'accent-purple-400']">
                    </div>

                    <div v-if="activeMenu === 'personal'" class="grid grid-cols-3 gap-4">
                        <label v-for="type in ['dev', 'photo', 'cinema']" :key="type" class="cursor-pointer">
                            <input type="radio" :value="type" v-model="form.project_type" class="hidden">
                            <div :class="['text-center py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all', form.project_type === type ? 'bg-purple-400 text-black border-purple-400 shadow-lg shadow-purple-400/20' : 'bg-[#09090b] text-gray-500 border-white/10 hover:border-purple-400/50']">
                                {{ type }}
                            </div>
                        </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Title</label>
                            <input v-model="form.title" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none focus:border-white transition shadow-inner">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Category</label>
                            <input v-model="form.category" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none focus:border-white transition">
                        </div>
                    </div>

                    <template v-if="activeMenu === 'vixel' || form.project_type === 'dev'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Client</label><input v-model="form.client" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Live URL</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none"></div>
                        </div>
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Short Desc</label><textarea v-model="form.descShort" rows="2" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none"></textarea></div>
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Long Desc</label><textarea v-model="form.descLong" rows="4" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none"></textarea></div>
                        
                        <div class="bg-[#09090b] border border-dashed border-white/20 p-8 rounded-2xl text-center">
                            <label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] block mb-4">Click to Upload Images</label>
                            <input type="file" multiple accept="image/*" @change="handleFileSelect" class="block w-full text-xs text-gray-500">
                        </div>

                        <div class="space-y-3">
                            <label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Tech Stack</label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <label v-for="tech in availableStacks" :key="tech" class="flex items-center gap-3 bg-[#09090b] border border-white/10 p-3 rounded-xl cursor-pointer hover:border-white/30 transition">
                                    <input type="checkbox" :value="tech" v-model="form.stack" :class="['w-4 h-4 rounded', activeMenu === 'vixel' ? 'accent-cyan-400' : 'accent-purple-400']">
                                    <span class="text-xs font-medium">{{ tech }}</span>
                                </label>
                            </div>
                        </div>
                    </template>

                    <template v-if="form.project_type === 'photo'">
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Aesthetic Quote</label><input v-model="form.descShort" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none"></div>
                        <div class="bg-[#09090b] border border-dashed border-white/20 p-10 rounded-2xl text-center">
                            <input type="file" multiple accept="image/*" @change="handleFileSelect" class="block w-full text-xs text-gray-500">
                        </div>
                    </template>

                    <template v-if="form.project_type === 'cinema'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Platform</label><select v-model="form.media_type" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none text-white"><option value="youtube">YouTube</option><option value="drive">Google Drive</option><option value="link">Behance</option></select></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Video ID</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 outline-none"></div>
                        </div>
                    </template>
                </form>
            </div>

            <div class="p-8 border-t border-white/5 bg-[#18181b]/50 rounded-b-[2rem] flex justify-end gap-4">
                <button type="button" @click="closeModal" class="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-500 hover:text-white transition">Cancel</button>
                <button @click="saveProject" :disabled="isSaving" :class="['px-10 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2', activeMenu === 'vixel' ? 'bg-cyan-400 text-black shadow-cyan-400/20' : 'bg-purple-400 text-black shadow-purple-400/20']">
                    {{ isSaving ? 'Sending...' : 'Save Data' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // <-- IMPORT SWEETALERT

const router = useRouter();
const activeMenu = ref('vixel'); 
const activeTable = computed(() => activeMenu.value === 'vixel' ? 'vixel_works' : 'personal_works');
const projects = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const selectedFiles = ref([]);

// --- STYLE CONFIG UNTUK SWEETALERT ---
const swalConfig = {
  background: '#111113',
  color: '#fff',
  confirmButtonColor: '#22d3ee', // Cyan-400
  borderRadius: '24px',
  customClass: {
    popup: 'border border-white/10 shadow-2xl',
    confirmButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-xs',
    cancelButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-xs'
  }
};

const availableStacks = ['React', 'Vue.js', 'Tailwind CSS', 'Vite', 'Flutter', 'Dart', 'AppSheet', 'Supabase', 'Firebase', 'Google Maps', 'Netlify', 'Vercel', 'Node.js', 'HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS'];

const form = ref({ project_type: 'dev', title: '', category: '', client: '', descShort: '', descLong: '', stack: [], images: [], link: '', github: '', media_type: 'youtube', isPinned: false });

watch(activeMenu, () => { fetchProjects(); });
const switchMenu = (menu) => { activeMenu.value = menu; };

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase.from(activeTable.value).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    projects.value = data;
  } catch (e) { 
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Oops!', text: 'Gagal ambil data.' });
  } finally { isLoading.value = false; }
};

onMounted(() => { fetchProjects(); });

const seedData = async () => {
  const result = await Swal.fire({
    ...swalConfig,
    title: 'Seed Database?',
    text: `Mau isi data lama ke ${activeTable.value}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Seed it!',
    cancelButtonColor: '#333'
  });

  if(!result.isConfirmed) return;

  isLoading.value = true;
  let dataToSeed = [];
  
  if(activeMenu.value === 'vixel') {
    dataToSeed = [
        { title: 'Omah Cempe', category: 'Web Dev • Landing Page', client: 'Omah Cempe Kediri', descShort: 'A modern landing page designed to digitalize livestock investment and Aqiqah services.', descLong: 'The official digital platform for Omah Cempe Kediri, designed to bridge traditional farming with modern investment opportunities...', stack: ["React", "Tailwind CSS", "Vite", "Google Maps"], images: ['/omahcempe/1.png'], isPinned: true },
        { title: "D'Production Profile", category: 'Web Dev • Corporate', client: "D'Production House", descShort: 'Official landing page for a creative production house.', descLong: 'Designed to professionally showcase video showreels, detail services packages, and enhance brand credibility.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify'], images: ['/project-dpro.png'], isPinned: true },
        { title: "Personal Portfolio v1", category: 'Web Dev • Personal Branding', client: 'Personal Project', descShort: 'Interactive portfolio featuring a modern Glassmorphism design.', descLong: 'An interactive personal portfolio website showcasing projects and skills. Built with Vue.js 3 / React as a Single Page Application (SPA).', stack: ['React', 'Tailwind CSS', 'Vite', 'Vercel'], images: ['/porto/1.png'], isPinned: true },
        { title: 'Digital Invitation', category: 'Web Dev • Invitation', client: 'Personal', descShort: 'Official website for VIXEL Studio showcasing services and portfolio.', descLong: 'Designed to showcase our range of services, portfolio, and client testimonials.', stack: ['Vue.js', 'Tailwind CSS', 'Vite', 'Vercel'], images: ['/invite/1.png'], isPinned: true },
        { title: "Puskeswan Mobile", category: "Android App", client: 'Puskeswan Trenggalek', descShort: "Mobile application for veterinary services management.", stack: ['Flutter', 'Dart', 'Supabase'], images: ['/puskeswan/1.png'], isPinned: false }
    ];
  } else {
    dataToSeed = [
        { project_type: 'cinema', title: 'Cinematic Vlog', category: 'After Movie PBAK UINSA 2022', media_type: 'youtube', link: 'gDOdVnRsZ0E', isPinned: true },
        { project_type: 'cinema', title: 'Short Movie', category: 'DUA SISI', media_type: 'youtube', link: 'vDXaoQyCoAs', isPinned: true },
        { project_type: 'cinema', title: 'After Movie', category: 'GASS PT. HM SAMPOERNA', media_type: 'youtube', link: '1B131fvG1z4', isPinned: true },
        { project_type: 'cinema', title: 'Short Movie', category: 'UPEKSHA', media_type: 'youtube', link: 'fumJ_jLM7KM', isPinned: true },
        { project_type: 'cinema', title: 'Profile Video', category: 'Profil Desa Wisata Ngabab', media_type: 'youtube', link: 'pBeJKxubs6M', isPinned: true },
        { project_type: 'cinema', title: 'After Movie', category: 'KKN UINSA 72 2025', media_type: 'link', link: 'wbE4NyEjDTc', isPinned: true },
        { project_type: 'dev', title: 'Storydesto', category: 'Marketplace Platform', client: 'Internal Startup', descShort: 'A digital marketplace connecting photography vendors with clients.', descLong: 'Features include a Smart Booking System, integrated multi-payment Gateway (Midtrans), and a robust Admin Dashboard.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify'], images: ['/coverdesto.png'], isPinned: true },
        { project_type: 'photo', title: 'Wedding Stories', category: 'WEDDING', descShort: 'Two souls, one promise. Capturing the sacred vows of eternal love.', images: ['/wed-cov.jpg'], isPinned: true },
        { project_type: 'photo', title: 'Life Lately', category: 'JOURNAL', descShort: 'Fragments of moments.', images: ['/livin1.jpg'], isPinned: true }
    ];
  }

  const { error } = await supabase.from(activeTable.value).insert(dataToSeed);
  if(!error) { 
    fetchProjects(); 
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Imported!', text: 'Database seeded successfully.' });
  }
  isLoading.value = false;
};

const openAddModal = () => { isEditing.value = false; editId.value = null; selectedFiles.value = []; form.value = { project_type: 'dev', title: '', category: '', client: '', descShort: '', descLong: '', stack: [], images: [], link: '', github: '', media_type: 'youtube', isPinned: false }; showModal.value = true; };
const openEditModal = (p) => { isEditing.value = true; editId.value = p.id; form.value = { ...p, stack: p.stack || [] }; showModal.value = true; };
const closeModal = () => { showModal.value = false; };
const handleFileSelect = (e) => { selectedFiles.value = Array.from(e.target.files); };

const saveProject = async () => {
    isSaving.value = true;
    try {
        let uploadedUrls = form.value.images || [];
        if (selectedFiles.value.length > 0) {
            uploadedUrls = [];
            for (const file of selectedFiles.value) {
                const name = `${Date.now()}-${file.name}`;
                await supabase.storage.from('portfolio-images').upload(name, file);
                const { data } = supabase.storage.from('portfolio-images').getPublicUrl(name);
                uploadedUrls.push(data.publicUrl);
            }
        }
        const payload = { ...form.value, images: uploadedUrls, project_type: activeMenu.value === 'vixel' ? 'dev' : form.value.project_type };
        if (isEditing.value) await supabase.from(activeTable.value).update(payload).eq('id', editId.value);
        else await supabase.from(activeTable.value).insert([payload]);
        closeModal(); fetchProjects();
        Swal.fire({ ...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false });
    } catch (e) { 
        Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal!', text: 'Periksa koneksi atau file.' });
    } finally { isSaving.value = false; }
};

const deleteProject = async (id) => { 
  const result = await Swal.fire({
    ...swalConfig,
    title: 'Hapus Project?',
    text: "Data bakal ilang selamanya!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus Aja!',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#333'
  });

  if(result.isConfirmed) { 
    await supabase.from(activeTable.value).delete().eq('id', id); 
    fetchProjects(); 
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Deleted.', timer: 1000, showConfirmButton: false });
  } 
};

const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };
</script>

<style scoped>
/* Swalert Dark Tweaks */
.swal2-popup { border: 1px solid rgba(255,255,255,0.1) !important; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>