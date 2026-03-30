<template>
  <div class="h-screen bg-[#09090b] text-white font-sans flex flex-col md:flex-row overflow-hidden text-sm">
    
    <Sidebar :active="activeMenu" @switch="switchMenu" @logout="handleLogout" />

    <header class="md:hidden flex justify-between items-center p-6 border-b border-white/10 bg-[#111113] z-30 shadow-xl relative">
        <h1 class="text-xl font-extrabold italic">Central <span class="text-cyan-400">Admin.</span></h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-red-400"><i class="ph ph-sign-out text-2xl"></i></button>
    </header>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
      
      <div class="p-6 md:p-10 pb-4 bg-[#09090b] z-20 text-left border-b border-white/5">
          <h2 class="text-2xl md:text-4xl font-bold tracking-tighter">
            Manage <span :class="activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400'">{{ activeMenu === 'vixel' ? 'Vixel Projects' : 'Personal Porto' }}</span>
          </h2>
          <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-1 opacity-50 font-bold">Table: {{ activeTable }}</p>
      </div>

      <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-4 pb-48 md:pb-10">
        <div v-if="isLoading" class="py-20 text-center flex flex-col items-center justify-center">
            <i :class="['ph ph-spinner-gap text-4xl animate-spin mb-4', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400']"></i>
            <p class="text-gray-500 animate-pulse font-bold tracking-widest uppercase text-[10px]">Loading Database...</p>
        </div>

        <div v-else class="bg-[#111113] border border-white/10 rounded-3xl overflow-x-auto shadow-2xl overflow-hidden">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead class="sticky top-0 bg-[#111113] z-20 border-b border-white/10">
              <tr class="text-gray-400 text-[10px] uppercase tracking-widest bg-white/5">
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
                  <button @click="togglePin(project)" class="transition-transform active:scale-75 hover:scale-110 cursor-pointer">
                    <i v-if="project.isPinned" :class="['ph-fill ph-push-pin text-xl', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400']"></i>
                    <i v-else class="ph ph-push-pin text-gray-700 text-xl hover:text-gray-400"></i>
                  </button>
                </td>
                <td class="p-5">
                  <div class="font-bold text-white text-base tracking-tight">{{ project.title }}</div>
                  <div class="text-xs text-gray-500 mt-0.5">{{ project.client || 'No Client' }}</div>
                </td>
                <td class="p-5 text-center">
                  <span class="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 text-gray-400">{{ project.category }}</span>
                </td>
                <td class="p-5 text-center" v-if="activeMenu === 'personal'">
                  <span class="px-2 py-0.5 rounded bg-white/5 text-[9px] uppercase border border-white/5 font-black text-gray-300 italic tracking-tighter">{{ project.project_type }}</span>
                </td>
                <td class="p-5 pr-8 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditModal(project)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black transition border border-white/10 shadow-lg cursor-pointer"><i class="ph ph-pencil-simple text-lg"></i></button>
                    <button @click="deleteProject(project.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition border border-white/10 shadow-lg cursor-pointer"><i class="ph ph-trash text-lg"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div> <button @click="openAddModal" 
            :class="['md:hidden fixed bottom-32 right-6 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center z-[90] transition-all active:scale-90 cursor-pointer', 
                     activeMenu === 'vixel' ? 'bg-cyan-400 text-black shadow-cyan-400/40' : 'bg-purple-400 text-black shadow-purple-400/40']">
        <i class="ph-fill ph-plus text-3xl"></i>
    </button>

    <div class="md:hidden fixed bottom-[90px] left-0 w-full px-6 py-3 flex gap-3 z-[80] pointer-events-none">
        <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" 
           target="_blank" 
           class="pointer-events-auto flex-1 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/30 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-2xl active:bg-white/20 transition cursor-pointer">
           View Site
        </a>
        <button @click="seedData" 
                class="pointer-events-auto flex-1 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/30 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-2xl active:bg-white/20 transition cursor-pointer">
           Seed DB
        </button>
    </div>

    <nav class="md:hidden fixed bottom-0 w-full bg-[#09090b]/95 backdrop-blur-2xl border-t border-white/10 flex justify-around p-4 pb-8 z-[90]">
        <button @click="switchMenu('vixel')" :class="['flex flex-col items-center gap-1 transition cursor-pointer', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-gray-600']"><i :class="activeMenu === 'vixel' ? 'ph-fill ph-squares-four text-3xl' : 'ph ph-squares-four text-3xl'"></i><span class="text-[9px] font-black uppercase tracking-tighter">Vixel</span></button>
        <button @click="switchMenu('personal')" :class="['flex flex-col items-center gap-1 transition cursor-pointer', activeMenu === 'personal' ? 'text-purple-400' : 'text-gray-600']"><i :class="activeMenu === 'personal' ? 'ph-fill ph-user-circle text-3xl' : 'ph ph-user-circle text-3xl'"></i><span class="text-[9px] font-black uppercase tracking-tighter">Personal</span></button>
    </nav>

    <div class="hidden md:flex fixed bottom-10 right-10 gap-4 z-[90]">
         <button @click="openAddModal" :class="['px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform cursor-pointer', activeMenu === 'vixel' ? 'bg-cyan-400 text-black shadow-cyan-400/20' : 'bg-purple-400 text-black shadow-purple-400/20']">
           <i class="ph-fill ph-plus-circle mr-2"></i> Add Project
         </button>
         <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" 
           target="_blank" 
           class="flex items-center bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase shadow-2xl hover:bg-white/20 transition cursor-pointer">
           View Live <i class="ph ph-arrow-square-out ml-2"></i>
         </a>
         <button @click="seedData" class="bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase hover:bg-white/20 transition cursor-pointer">
           Seed DB
         </button>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
        <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl my-8 flex flex-col max-h-[90vh] text-left">
            <div class="p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem]">
                <h2 class="text-2xl font-black italic tracking-tighter">{{ isEditing ? 'Edit Project.' : 'New Project.' }}</h2>
                <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"><i class="ph ph-x text-xl"></i></button>
            </div>
            
            <div class="p-8 overflow-y-auto flex-1">
                <form class="space-y-8 text-sm" @submit.prevent>
                    <div @click="form.isPinned = !form.isPinned" 
                         :class="['flex items-center justify-between p-6 rounded-[1.5rem] border transition-all cursor-pointer', 
                                  form.isPinned ? (activeMenu === 'vixel' ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400 shadow-lg shadow-cyan-400/5' : 'bg-purple-400/10 border-purple-400/40 text-purple-400 shadow-lg shadow-purple-400/5') : 'bg-white/5 border-white/10 text-gray-500 opacity-60']">
                        <div class="flex items-center gap-4">
                          <i :class="[form.isPinned ? 'ph-fill ph-push-pin' : 'ph ph-push-pin', 'text-2xl']"></i>
                          <div class="flex flex-col">
                            <span class="font-black uppercase tracking-[0.1em] text-xs">Featured Project</span>
                            <span class="text-[10px] opacity-70">Project ini bakal muncul di section awal web.</span>
                          </div>
                        </div>
                        <div :class="['w-10 h-6 rounded-full relative transition-colors p-1', form.isPinned ? (activeMenu === 'vixel' ? 'bg-cyan-400' : 'bg-purple-400') : 'bg-gray-700']">
                           <div :class="['w-4 h-4 bg-white rounded-full transition-transform shadow-sm', form.isPinned ? 'translate-x-4' : 'translate-x-0']"></div>
                        </div>
                    </div>

                    <div v-if="activeMenu === 'personal'" class="grid grid-cols-3 gap-4">
                        <label v-for="type in ['dev', 'photo', 'cinema']" :key="type" class="cursor-pointer">
                            <input type="radio" :value="type" v-model="form.project_type" class="hidden">
                            <div :class="['text-center py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all', form.project_type === type ? 'bg-purple-400 text-black border-purple-400 shadow-xl' : 'bg-[#09090b] text-gray-500 border-white/10']">{{ type }}</div>
                        </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Title</label><input v-model="form.title" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none focus:border-white transition shadow-inner"></div>
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Category</label><input v-model="form.category" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none focus:border-white transition"></div>
                    </div>

                    <template v-if="form.project_type === 'cinema'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Platform</label><select v-model="form.media_type" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none"><option value="youtube">YouTube</option><option value="drive">Google Drive</option><option value="link">Behance</option></select></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Video ID / Link</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none"></div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Client / Quote</label><input v-model="form.client" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Live URL</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none"></div>
                        </div>
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Upload Images</label>
                            <input type="file" multiple @change="handleFileSelect" class="w-full text-gray-500 file:bg-white/5 file:border-white/10 file:text-white file:px-6 file:py-3 file:rounded-2xl file:mr-4 file:font-bold file:uppercase file:text-[10px] cursor-pointer">
                        </div>
                        <div v-if="form.project_type === 'dev'" class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Tech Stack</label>
                          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#09090b] p-4 rounded-2xl border border-white/5">
                             <label v-for="t in availableStacks" :key="t" class="flex items-center gap-2 cursor-pointer group">
                               <input type="checkbox" :value="t" v-model="form.stack" class="w-4 h-4 accent-cyan-400 rounded"> 
                               <span class="text-[11px] font-bold text-gray-400 group-hover:text-white transition">{{ t }}</span>
                             </label>
                          </div>
                        </div>
                    </template>
                </form>
            </div>

            <div class="p-8 border-t border-white/5 bg-[#18181b]/50 rounded-b-[2.5rem] flex justify-end gap-4">
                <button @click="closeModal" class="px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-white transition cursor-pointer">Cancel</button>
                <button @click="saveProject" :disabled="isSaving" :class="['px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-2xl disabled:opacity-50 cursor-pointer', activeMenu === 'vixel' ? 'bg-cyan-400 text-black' : 'bg-purple-400 text-black']">
                    <i v-if="isSaving" class="ph ph-spinner-gap animate-spin text-lg"></i>
                    {{ isEditing ? 'Update Work.' : 'Publish Work.' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { supabase } from '../supabase';
import Sidebar from '../components/Sidebar.vue';
import Swal from 'sweetalert2';

const activeMenu = ref('vixel'); 
const activeTable = computed(() => activeMenu.value === 'vixel' ? 'vixel_works' : 'personal_works');
const projects = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const selectedFiles = ref([]);

const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: activeMenu.value === 'vixel' ? '#22d3ee' : '#c084fc', borderRadius: '24px' };
const availableStacks = ['React', 'Vue.js', 'Tailwind', 'Vite', 'Flutter', 'Dart', 'AppSheet', 'Supabase', 'Firebase', 'Netlify', 'Vercel', 'Node.js', 'Python', 'Bootstrap'];

const form = ref({ project_type: 'dev', title: '', category: '', client: '', descShort: '', descLong: '', stack: [], images: [], link: '', github: '', media_type: 'youtube', isPinned: false });

watch(activeMenu, () => { fetchProjects(); });
const switchMenu = (menu) => { activeMenu.value = menu; };

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase.from(activeTable.value).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    projects.value = data;
  } catch (e) { console.error(e); } finally { isLoading.value = false; }
};

onMounted(() => { fetchProjects(); });

const togglePin = async (project) => {
  const newStatus = !project.isPinned;
  project.isPinned = newStatus;
  try {
    const { error } = await supabase.from(activeTable.value).update({ isPinned: newStatus }).eq('id', project.id);
    if (error) throw error;
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: newStatus ? 'Pinned' : 'Unpinned', showConfirmButton: false, timer: 1500, background: '#111113', color: '#fff' });
  } catch (e) {
    project.isPinned = !newStatus;
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Error', text: 'Gagal update status.' });
  }
};

const openAddModal = () => { isEditing.value = false; editId.value = null; form.value = { project_type: 'dev', title: '', category: '', client: '', descShort: '', descLong: '', stack: [], images: [], link: '', github: '', media_type: 'youtube', isPinned: false }; showModal.value = true; };
const openEditModal = (p) => { isEditing.value = true; editId.value = p.id; form.value = { ...p, stack: p.stack || [], isPinned: Boolean(p.isPinned) }; showModal.value = true; };
const closeModal = () => { showModal.value = false; };
const handleFileSelect = (e) => { selectedFiles.value = Array.from(e.target.files); };

const saveProject = async () => {
    isSaving.value = true;
    try {
        let uploadedUrls = form.value.images || [];
        if (selectedFiles.value.length > 0) {
            uploadedUrls = isEditing.value ? [...uploadedUrls] : [];
            for (const file of selectedFiles.value) {
                const name = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                const { error: upErr } = await supabase.storage.from('portfolio-images').upload(name, file);
                if(upErr) throw upErr;
                const { data } = supabase.storage.from('portfolio-images').getPublicUrl(name);
                uploadedUrls.push(data.publicUrl);
            }
        }

        const payload = {
            title: form.value.title,
            category: form.value.category,
            client: form.value.client || null,
            descShort: form.value.descShort || '',
            descLong: form.value.descLong || '',
            stack: form.value.stack || [],
            images: uploadedUrls,
            link: form.value.link || '',
            github: form.value.github || '',
            isPinned: Boolean(form.value.isPinned), 
            project_type: activeMenu.value === 'vixel' ? 'dev' : form.value.project_type,
            media_type: form.value.media_type || 'youtube'
        };

        if (isEditing.value) await supabase.from(activeTable.value).update(payload).eq('id', editId.value);
        else await supabase.from(activeTable.value).insert([payload]);
        
        closeModal(); fetchProjects();
        Swal.fire({ ...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false });
    } catch (e) { Swal.fire({ ...swalConfig, icon: 'error', title: 'Error', text: e.message }); } 
    finally { isSaving.value = false; }
};

const deleteProject = async (id) => { 
  const res = await Swal.fire({ ...swalConfig, title: 'Hapus Data?', text: "Bakal ilang selamanya!", icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus!' });
  if(res.isConfirmed) { await supabase.from(activeTable.value).delete().eq('id', id); fetchProjects(); } 
};

// === FUNGSI SEED DATA FULL 24 PROJECT ===
const seedData = async () => {
  const result = await Swal.fire({ ...swalConfig, title: 'Seed Database?', text: `Isi data asli ke ${activeTable.value}?`, icon: 'question', showCancelButton: true, confirmButtonText: 'Yes, Seed it!', cancelButtonColor: '#333' });
  if(!result.isConfirmed) return;

  isLoading.value = true;
  let dataToSeed = [];
  
  if(activeMenu.value === 'vixel') {
    dataToSeed = [
        { title: 'Omah Cempe', category: 'Web Dev • Landing Page', client: 'Omah Cempe Kediri', descShort: 'A modern landing page designed to digitalize livestock investment and Aqiqah services.', stack: ["React", "Tailwind CSS", "Vite", "Google Maps"], images: ['/omahcempe/1.png'], isPinned: true },
        { title: "D'Production Profile", category: 'Web Dev • Corporate', client: "D'Production House", descShort: 'Official landing page for a creative production house.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify'], images: ['/project-dpro.png'], isPinned: true },
        { title: "Personal Portfolio v1", category: 'Web Dev • Personal Branding', client: 'Personal Project', descShort: 'Interactive portfolio featuring a modern Glassmorphism design.', stack: ['React', 'Tailwind CSS', 'Vite', 'Vercel'], images: ['/porto/1.png'], isPinned: true },
        { title: 'Digital Invitation', category: 'Web Dev • Invitation', client: 'Personal', descShort: 'Official website for VIXEL Studio showcasing services and portfolio.', stack: ['Vue.js', 'Tailwind CSS', 'Vite', 'Vercel'], images: ['/invite/1.png'], isPinned: true },
        { title: "Puskeswan Mobile", category: "Android App", client: 'Puskeswan Trenggalek', descShort: "Mobile application for veterinary services management.", stack: ['Flutter', 'Dart', 'Supabase'], images: ['/puskeswan/1.png'], isPinned: false },
        { title: "WildanInvites HQ", category: "Appsheet Development", client: 'WildanInvites Finance', descShort: "Dedicated internal management tool for cashflow tracking.", stack: ['AppSheet','Google Sheet', 'Automation'], images: ['/cashflowhq.png'], isPinned: false }
    ];
  } else {
    dataToSeed = [
        { project_type: 'cinema', title: 'Cinematic Vlog', category: 'After Movie PBAK UINSA 2022', media_type: 'youtube', link: 'gDOdVnRsZ0E', isPinned: true },
        { project_type: 'cinema', title: 'Short Movie', category: 'DUA SISI', media_type: 'youtube', link: 'vDXaoQyCoAs', isPinned: true },
        { project_type: 'cinema', title: 'After Movie', category: 'GASS PT. HM SAMPOERNA', media_type: 'youtube', link: '1B131fvG1z4', isPinned: false },
        { project_type: 'cinema', title: 'Short Movie', category: 'UPEKSHA', media_type: 'youtube', link: 'fumJ_jLM7KM', isPinned: false },
        { project_type: 'cinema', title: 'Profile Video', category: 'Profil Desa Wisata Ngabab', media_type: 'youtube', link: 'pBeJKxubs6M', isPinned: false },
        { project_type: 'cinema', title: 'After Movie', category: 'KKN UINSA 72 2025', media_type: 'link', link: 'wbE4NyEjDTc', isPinned: true },
        { project_type: 'dev', title: 'Storydesto', category: 'Marketplace Platform', client: 'Internal Startup', descShort: 'A digital marketplace connecting photography vendors with clients seamlessly.', descLong: 'A comprehensive digital marketplace designed to bridge photography vendors with clients. Features include a Smart Booking System, integrated multi-payment Gateway (Midtrans), real-time vendor availability checking, and a robust Admin Dashboard.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify', 'SEO Optimized'], github: 'https://github.com/amdwildanabdillah/storydesto', link: 'https://portfolio-storydesto.netlify.app/', images: ['/coverdesto.png', '/desto/desto1.png', '/desto/desto2.png', '/desto/desto3.png'], isPinned: true },
        { project_type: 'dev', title: 'Personal Portfolio', category: 'Frontend Development', client: 'Personal Project', descShort: 'Interactive portfolio featuring a modern Glassmorphism design.', descLong: 'An interactive personal portfolio website showcasing projects and skills. Built with Vue.js 3 as a Single Page Application (SPA) for a fast, smooth user experience.', stack: ['Vue.js', 'Element UI', 'Vite', 'Vercel', 'Google Fonts'], link: 'https://portfoliowildan.my.id/', images: ['/webwildan.png'], isPinned: true },
        { project_type: 'dev', title: "D'Production Surabaya", category: 'Company Profile', client: "D'Production House", descShort: 'Official landing page for a creative production house.', descLong: 'Official landing page for a creative production house in Surabaya. Designed to professionally showcase video showreels, detail services packages, and enhance brand credibility.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify', 'SEO Optimized'], github: 'https://github.com/amdwildanabdillah/dproductionsub', link: 'https://dproductionsub.netlify.app/', images: ['/dproduction.png'], isPinned: false },
        { project_type: 'dev', title: 'Invitation Kit', category: 'Digital Asset', client: 'Vixel Product', descShort: 'Highly customizable digital invitation template with RSVP.', descLong: 'A productized digital invitation template built for speed and aesthetics. Features smooth entrance animations, integrated Google Forms RSVP.', stack: ['Vue.js', 'HTML', 'Tailwind CSS'], link: 'https://wedding-invitation-wildan.vercel.app/', images: ['/wedinvite.png'], isPinned: false },
        { project_type: 'dev', title: 'Vixel Creative', category: 'Company Profile', client: 'Vixel Creative HQ', descShort: 'Landing page for Web Dev & AppSheet Solution agency.', descLong: 'The official agency landing page for Vixel Creative. It serves as a central hub to showcase our services.', stack: ['Vue.js', 'Vite', 'Tailwind CSS', 'Framer Motion'], link: 'https://vixelcreative.my.id/', images: ['/vixel.png'], isPinned: true },
        { project_type: 'dev', title: 'WildanInvites HQ', category: 'Appsheet Development', client: 'WildanInvites Finance', descShort: 'Dedicated internal management tool for cashflow tracking.', descLong: 'A robust internal tool built purely on AppSheet and Google ecosystem for WildanInvites. It automates cashflow tracking.', stack: ['AppSheet', 'Google Sheet', 'Automation'], images: ['/cashflowhq.png'], isPinned: false },
        { project_type: 'dev', title: 'Puskewan Mobile', category: 'Android App', client: 'Puskeswan Trenggalek', descShort: 'Mobile application for veterinary services management.', descLong: 'A dedicated mobile application designed for Puskeswan Trenggalek to manage veterinary services. It features appointment scheduling, medical record tracking for livestock.', stack: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'Google Sign-In'], images: ['/puskeswan/1.png', '/puskeswan/2.png', '/puskeswan/3.png'], isPinned: true },
        { project_type: 'photo', title: 'Behind the Scene', category: 'PROFILE', descShort: '', images: ['/me7.jpg', '/me6.jpg', '/me5.jpg', '/me8.jpg', '/me3.jpg'], isPinned: false },
        { project_type: 'photo', title: 'Wedding Stories', category: 'WEDDING', descShort: 'Two souls, one promise. Capturing the sacred vows of eternal love.', images: ['/wed-cov.jpg', '/wed1.jpg', '/wed2.jpg'], isPinned: true },
        { project_type: 'photo', title: 'LMLS', category: 'COLLABORATION', descShort: '', images: ['/LMLS-2.jpg', '/LMLS-1.jpg', '/LMLS-3.jpg', '/LMLS-4.jpg', '/LMLS-5.jpg'], isPinned: false },
        { project_type: 'photo', title: 'Life Lately', category: 'JOURNAL', descShort: 'Fragments of time, gasoline, caffeine, and stories in between.', images: ['/livin1.jpg', '/livin3.jpg', '/livin10.jpg', '/livin11.jpg', '/livin4.jpg', '/livin5.jpg', '/livin7.jpg'], isPinned: true },
        { project_type: 'photo', title: 'Sky View', category: 'Aerial', descShort: '', images: ['/urban-cov.jpg', '/urban1.jpg', '/urban2.jpg', '/urban3.jpg'], isPinned: false }
    ];
  }

  try {
    const { error } = await supabase.from(activeTable.value).insert(dataToSeed);
    if(error) throw error;
    fetchProjects(); 
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Data Lengkap Masuk!', showConfirmButton: false, timer: 2000, background: '#111113', color: '#fff' });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Gagal Import', text: e.message, background: '#111113', color: '#fff' });
  } finally { isLoading.value = false; }
};

const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };
</script>

<style scoped>
.swal2-popup { border: 1px solid rgba(255,255,255,0.1) !important; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>