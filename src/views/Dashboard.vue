<template>
  <div class="h-screen bg-[#09090b] text-white font-sans flex flex-col md:flex-row overflow-hidden">
    
    <aside class="hidden md:flex w-64 border-r border-white/10 p-6 flex-col bg-[#111113] z-20">
      <div class="mb-10">
        <h1 class="text-2xl font-extrabold tracking-tight">Central <span class="text-cyan-400">Admin.</span></h1>
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
        <h1 class="text-xl font-extrabold">Central <span class="text-cyan-400">Admin.</span></h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-red-400"><i class="ph ph-sign-out text-2xl"></i></button>
    </header>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      
      <div class="p-6 md:p-10 pb-4 bg-[#09090b] z-10">
          <h2 class="text-2xl md:text-4xl font-bold">
            Manage <span :class="activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400'">{{ activeMenu === 'vixel' ? 'Vixel Projects' : 'Personal Porto' }}</span>
          </h2>
          <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-1 opacity-50">Database: {{ activeTable }}</p>
      </div>

      <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-2 pb-48 md:pb-10">
        <div v-if="isLoading" class="py-20 text-center flex flex-col items-center justify-center">
            <i :class="['ph ph-spinner-gap text-4xl animate-spin mb-4', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400']"></i>
        </div>

        <div v-else class="bg-[#111113] border border-white/10 rounded-xl overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead class="sticky top-0 bg-[#111113] z-10">
              <tr class="border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest bg-white/5">
                <th class="p-4 pl-6 font-bold w-12">Pin</th>
                <th class="p-4 font-bold">Title & Client</th>
                <th class="p-4 font-bold">Category</th>
                <th class="p-4 font-bold" v-if="activeMenu === 'personal'">Type</th>
                <th class="p-4 pr-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="project in projects" :key="project.id" class="border-b border-white/5 hover:bg-white/5 transition">
                <td class="p-4 pl-6 text-center">
                  <i v-if="project.isPinned" :class="['ph-fill ph-push-pin text-lg', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-purple-400']"></i>
                  <i v-else class="ph ph-push-pin text-gray-600 text-lg"></i>
                </td>
                <td class="p-4">
                  <div class="font-bold text-white text-base">{{ project.title }}</div>
                  <div class="text-xs text-gray-500 mt-1" v-if="project.project_type !== 'cinema'">{{ project.client || 'No Client' }}</div>
                </td>
                <td class="p-4">
                  <span class="bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase border border-white/10 text-gray-300">{{ project.category }}</span>
                </td>
                <td class="p-4" v-if="activeMenu === 'personal'">
                  <span class="px-2 py-1 rounded text-[10px] font-bold uppercase" 
                        :class="project.project_type === 'dev' ? 'bg-blue-500/20 text-blue-400' : project.project_type === 'photo' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'">
                    {{ project.project_type }}
                  </span>
                </td>
                <td class="p-4 pr-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditModal(project)" class="p-2 rounded bg-white/5 hover:bg-white hover:text-black transition border border-white/10"><i class="ph ph-pencil-simple"></i></button>
                    <button @click="deleteProject(project.id)" class="p-2 rounded bg-white/5 hover:bg-red-500 hover:text-white transition border border-white/10"><i class="ph ph-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <button @click="openAddModal" 
              :class="['fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 transition-transform active:scale-90', 
                       activeMenu === 'vixel' ? 'bg-cyan-400 text-black' : 'bg-purple-400 text-black']">
          <i class="ph-fill ph-plus text-2xl"></i>
      </button>

      <div class="md:hidden fixed bottom-[72px] left-0 w-full px-6 py-3 flex gap-3 z-40 bg-gradient-to-t from-[#09090b] to-transparent">
          <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" 
             target="_blank"
             class="flex-1 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:bg-white/20 transition">
             <i class="ph ph-arrow-square-out text-lg"></i> View Site
          </a>
          <button @click="seedData" 
             class="flex-1 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-gray-400 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:bg-white/20 transition">
             <i class="ph ph-database text-lg"></i> Seed Data
          </button>
      </div>

      <nav class="md:hidden fixed bottom-0 w-full bg-[#111113]/95 backdrop-blur-xl border-t border-white/10 flex justify-around p-3 pb-6 z-50">
          <button @click="switchMenu('vixel')" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-gray-500']"><i :class="activeMenu === 'vixel' ? 'ph-fill ph-squares-four text-2xl' : 'ph ph-squares-four text-2xl'"></i><span class="text-[8px] font-bold uppercase">Vixel</span></button>
          <button @click="switchMenu('personal')" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'personal' ? 'text-purple-400' : 'text-gray-500']"><i :class="activeMenu === 'personal' ? 'ph-fill ph-user-circle text-2xl' : 'ph ph-user-circle text-2xl'"></i><span class="text-[8px] font-bold uppercase">Personal</span></button>
      </nav>

      <div class="hidden md:flex fixed bottom-10 right-10 gap-3 z-40">
           <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" 
             target="_blank"
             class="flex items-center gap-2 bg-[#111113] border border-white/10 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition shadow-2xl">
             View Live Site <i class="ph ph-arrow-square-out"></i>
          </a>
          <button @click="seedData" class="bg-[#111113] border border-white/10 text-gray-400 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-white transition">
            Seed
          </button>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-white/10 flex justify-between items-center bg-[#18181b] rounded-t-2xl">
                <h2 class="text-xl font-bold">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-white"><i class="ph ph-x text-xl"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
                <form class="space-y-6 text-sm">
                    <div v-if="activeMenu === 'personal'" class="grid grid-cols-3 gap-3 mb-6">
                        <label v-for="type in ['dev', 'photo', 'cinema']" :key="type" class="cursor-pointer">
                            <input type="radio" :value="type" v-model="form.project_type" class="hidden">
                            <div :class="['text-center p-3 rounded-xl border text-xs font-bold uppercase transition', form.project_type === type ? 'bg-purple-400 text-black border-purple-400' : 'bg-[#09090b] text-gray-400 border-white/10 hover:border-purple-400/50']">
                                {{ type }}
                            </div>
                        </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Project Title *</label><input v-model="form.title" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-white transition"></div>
                        <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Category *</label><input v-model="form.category" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-white transition"></div>
                    </div>

                    <template v-if="activeMenu === 'vixel' || form.project_type === 'dev'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Client</label><input v-model="form.client" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none"></div>
                            <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Live Link</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none"></div>
                        </div>
                        <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Short Description</label><textarea v-model="form.descShort" rows="2" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none"></textarea></div>
                        <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Detailed Description</label><textarea v-model="form.descLong" rows="4" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none"></textarea></div>
                        <div class="bg-[#09090b] border border-dashed border-white/20 p-6 rounded-xl">
                            <label class="block text-xs text-gray-400 font-bold mb-3 uppercase">Upload Images</label>
                            <input type="file" multiple accept="image/*" @change="handleFileSelect" class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer">
                        </div>
                        <div><label class="block text-xs text-gray-400 font-bold mb-3 uppercase">Tech Stack</label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <label v-for="tech in availableStacks" :key="tech" class="flex items-center gap-2 bg-[#09090b] border border-white/10 p-2 rounded-lg cursor-pointer hover:border-white/50 transition">
                                    <input type="checkbox" :value="tech" v-model="form.stack" class="accent-white"><span class="text-xs">{{ tech }}</span>
                                </label>
                            </div>
                        </div>
                    </template>

                    <template v-if="form.project_type === 'photo'">
                        <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Caption</label><input v-model="form.descShort" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none" placeholder="Aesthetic quote..."></div>
                        <div class="bg-[#09090b] border border-dashed border-white/20 p-6 rounded-xl"><label class="block text-xs text-gray-400 font-bold mb-3 uppercase">Upload Photos</label><input type="file" multiple accept="image/*" @change="handleFileSelect" class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"></div>
                    </template>

                    <template v-if="form.project_type === 'cinema'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Platform *</label><select v-model="form.media_type" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-white transition text-white"><option value="youtube">YouTube</option><option value="drive">Google Drive</option><option value="link">Behance</option></select></div>
                            <div><label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Video ID *</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none" placeholder="Ex: gDOdVnRsZ0E"></div>
                        </div>
                    </template>
                </form>
            </div>

            <div class="p-6 border-t border-white/10 bg-[#18181b] rounded-b-2xl flex justify-end gap-3">
                <button type="button" @click="closeModal" class="px-6 py-2.5 rounded-lg font-bold text-xs uppercase text-gray-400 hover:text-white transition">Cancel</button>
                <button @click="saveProject" :disabled="isSaving" :class="['text-black px-6 py-2.5 rounded-lg font-bold text-xs uppercase hover:bg-white transition flex items-center gap-2', activeMenu === 'vixel' ? 'bg-cyan-400' : 'bg-purple-400']">
                    {{ isSaving ? 'Saving...' : 'Save Data' }}
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
  } catch (e) { console.error(e); } finally { isLoading.value = false; }
};

onMounted(() => { fetchProjects(); });

const seedData = async () => {
  if(!confirm(`Import data lama ke ${activeTable.value}?`)) return;
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
        { project_type: 'photo', title: 'Wedding Stories', category: 'WEDDING', descShort: 'Two souls, one promise.', images: ['/wed-cov.jpg'], isPinned: true }
    ];
  }

  const { error } = await supabase.from(activeTable.value).insert(dataToSeed);
  if(!error) fetchProjects();
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
    } catch (e) { alert("Gagal!"); } finally { isSaving.value = false; }
};

const deleteProject = async (id) => { if(confirm("Hapus?")) { await supabase.from(activeTable.value).delete().eq('id', id); fetchProjects(); } };
const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };
</script>