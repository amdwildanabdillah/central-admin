<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans flex flex-col md:flex-row">
    
    <aside class="hidden md:flex w-64 border-r border-white/10 p-6 flex-col bg-[#111113]">
      <div class="mb-10">
        <h1 class="text-2xl font-extrabold tracking-tight">Central <span class="text-cyan-400">Admin.</span></h1>
        <p class="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Content Management</p>
      </div>
      <nav class="flex-1 space-y-2">
        <a href="#" class="flex items-center gap-3 bg-cyan-400/10 text-cyan-400 px-4 py-3 rounded-xl font-bold border border-cyan-400/20">
            <i class="ph-fill ph-squares-four text-xl"></i> Projects
        </a>
      </nav>
      <button @click="handleLogout" class="flex items-center gap-3 text-gray-500 hover:text-red-400 px-4 py-3 transition font-medium group mt-auto">
        <i class="ph ph-sign-out text-xl group-hover:-translate-x-1 transition-transform"></i> Log Out
      </button>
    </aside>

    <header class="md:hidden flex justify-between items-center p-6 border-b border-white/10 bg-[#111113]">
        <h1 class="text-xl font-extrabold">Central <span class="text-cyan-400">Admin.</span></h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-red-400"><i class="ph ph-sign-out text-2xl"></i></button>
    </header>

    <main class="flex-1 p-6 md:p-10 overflow-y-auto pb-24 md:pb-10">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold">Manage Projects</h2>
          <p class="text-gray-400 text-sm mt-1">Atur data portofolio. Centang 'Pin to Home' untuk memunculkannya di beranda.</p>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <button @click="seedOldData" class="border border-cyan-400/50 text-cyan-400 px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition">
            Import Data Lama
          </button>
          <button @click="openAddModal" class="flex-1 md:flex-none bg-cyan-400 text-black px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white transition flex items-center justify-center gap-2">
            <i class="ph-fill ph-plus-circle text-lg"></i> Add Project
          </button>
        </div>
      </header>

      <div v-if="isLoading" class="py-20 text-center flex flex-col items-center justify-center">
          <i class="ph ph-spinner-gap text-4xl text-cyan-400 animate-spin mb-4"></i>
          <span class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Data...</span>
      </div>

      <div v-else class="bg-[#111113] border border-white/10 rounded-xl overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest bg-white/5">
              <th class="p-4 pl-6 font-bold w-12">Pin</th>
              <th class="p-4 font-bold">Title & Client</th>
              <th class="p-4 font-bold">Category</th>
              <th class="p-4 font-bold">Tech Stack</th>
              <th class="p-4 pr-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="project in projects" :key="project.id" class="border-b border-white/5 hover:bg-white/5 transition">
              <td class="p-4 pl-6 text-center">
                <i v-if="project.isPinned" class="ph-fill ph-push-pin text-cyan-400 text-lg"></i>
                <i v-else class="ph ph-push-pin text-gray-600 text-lg"></i>
              </td>
              <td class="p-4">
                <div class="font-bold text-white text-base">{{ project.title }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ project.client || 'No Client' }}</div>
              </td>
              <td class="p-4">
                <span class="bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase border border-white/10 text-gray-300 whitespace-nowrap">{{ project.category }}</span>
              </td>
              <td class="p-4">
                <div class="flex flex-wrap gap-1 max-w-[200px]">
                  <span v-for="tech in (project.stack || []).slice(0,3)" :key="tech" class="text-[9px] bg-[#09090b] border border-white/10 px-1.5 py-0.5 rounded text-gray-400">{{ tech }}</span>
                  <span v-if="(project.stack || []).length > 3" class="text-[9px] text-gray-500">+{{ project.stack.length - 3 }}</span>
                </div>
              </td>
              <td class="p-4 pr-6 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openEditModal(project)" class="p-2 rounded bg-white/5 hover:bg-cyan-400 hover:text-black transition border border-white/10"><i class="ph ph-pencil-simple"></i></button>
                  <button @click="deleteProject(project.id)" class="p-2 rounded bg-white/5 hover:bg-red-500 hover:text-white transition border border-white/10"><i class="ph ph-trash"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="5" class="p-10 text-center text-gray-500">Belum ada project di Supabase. Klik "Import Data Lama" untuk mengisi otomatis.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-white/10 flex justify-between items-center bg-[#18181b] rounded-t-2xl">
                <h2 class="text-xl font-bold">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-white"><i class="ph ph-x text-xl"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
                <form class="space-y-6 text-sm">
                    <div class="flex items-center gap-3 bg-cyan-400/10 border border-cyan-400/20 p-4 rounded-xl">
                        <input type="checkbox" id="pinToggle" v-model="form.isPinned" class="w-5 h-5 accent-cyan-400 rounded">
                        <label for="pinToggle" class="font-bold text-cyan-400 cursor-pointer select-none">Pin to Home (Selected Works)</label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Project Title *</label>
                            <input v-model="form.title" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-400">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Category *</label>
                            <input v-model="form.category" type="text" placeholder="e.g. Web Dev • Landing Page" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-400">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Client</label>
                            <input v-model="form.client" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-400">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Live Link / Demo</label>
                            <input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-400">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Short Description *</label>
                        <textarea v-model="form.descShort" rows="2" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-400"></textarea>
                    </div>

                    <div>
                        <label class="block text-xs text-gray-400 font-bold mb-2 uppercase">Detailed Description</label>
                        <textarea v-model="form.descLong" rows="4" class="w-full bg-[#09090b] border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-400"></textarea>
                    </div>

                    <div class="bg-[#09090b] border border-dashed border-white/20 p-6 rounded-xl">
                        <label class="block text-xs text-gray-400 font-bold mb-3 uppercase">Upload Images (Bisa pilih banyak)</label>
                        <input type="file" multiple accept="image/*" @change="handleFileSelect" class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer">
                        <p class="text-[10px] text-gray-500 mt-2">Pilih gambar baru akan menimpa gambar lama. Jika tidak memilih, gambar lama tetap aman.</p>
                        
                        <div v-if="selectedFiles.length > 0" class="mt-3 flex gap-2 flex-wrap">
                            <span v-for="file in selectedFiles" :key="file.name" class="text-[10px] bg-cyan-400/20 text-cyan-400 px-2 py-1 rounded">{{ file.name }}</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs text-gray-400 font-bold mb-3 uppercase">Tech Stack</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <label v-for="tech in availableStacks" :key="tech" class="flex items-center gap-2 bg-[#09090b] border border-white/10 p-2 rounded-lg cursor-pointer hover:border-cyan-400/50 transition">
                                <input type="checkbox" :value="tech" v-model="form.stack" class="accent-cyan-400">
                                <span class="text-xs">{{ tech }}</span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>

            <div class="p-6 border-t border-white/10 bg-[#18181b] rounded-b-2xl flex justify-end gap-3">
                <button type="button" @click="closeModal" :disabled="isSaving" class="px-6 py-2.5 rounded-lg font-bold text-xs uppercase text-gray-400 hover:text-white transition">Cancel</button>
                <button @click="saveProject" :disabled="isSaving" class="bg-cyan-400 text-black px-6 py-2.5 rounded-lg font-bold text-xs uppercase hover:bg-white transition flex items-center gap-2 disabled:opacity-50">
                    <i v-if="isSaving" class="ph ph-spinner-gap animate-spin"></i>
                    <i v-else class="ph-fill ph-floppy-disk"></i> 
                    {{ isSaving ? 'Uploading...' : 'Save Project' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const projects = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);
const selectedFiles = ref([]);

const availableStacks = [
  'React', 'Vue.js', 'Tailwind CSS', 'Vite', 'Flutter', 'Dart', 'AppSheet', 
  'Supabase', 'Firebase', 'Google Maps', 'Netlify', 'Vercel', 'Node.js', 
  'HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS'
];

const form = ref({
    title: '', category: '', client: '', descShort: '', descLong: '', 
    stack: [], images: [], link: '', github: '', isPinned: false
});

// GET DATA DARI SUPABASE
const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
        .from('vixel_works')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) throw error;
    projects.value = data;
  } catch (error) { 
    console.error("Gagal get data:", error); 
  } finally { 
    isLoading.value = false; 
  }
};

onMounted(() => { fetchProjects(); });

const openAddModal = () => {
    isEditing.value = false;
    editId.value = null;
    selectedFiles.value = [];
    form.value = { title: '', category: '', client: '', descShort: '', descLong: '', stack: [], images: [], link: '', github: '', isPinned: false };
    showModal.value = true;
};

const openEditModal = (project) => {
    isEditing.value = true;
    editId.value = project.id;
    selectedFiles.value = [];
    form.value = { ...project, stack: project.stack || [] };
    showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const handleFileSelect = (event) => {
    selectedFiles.value = Array.from(event.target.files);
};

// --- TOMBOL MAGIC IMPORT DATA LAMA KE SUPABASE ---
const seedOldData = async () => {
    if(!confirm("Proses ini bakal ngirim data default kamu ke database Supabase. Lanjutkan?")) return;
    
    isLoading.value = true;
    const oldData = [
        {
          title: 'Omah Cempe', category: 'Web Dev • Landing Page', client: 'Omah Cempe Kediri',
          descShort: 'A modern landing page designed to digitalize livestock investment and Aqiqah services.',
          descLong: 'The official digital platform for Omah Cempe Kediri, designed to bridge traditional farming with modern investment opportunities...',
          stack: ["React", "Tailwind CSS", "Vite", "Google Maps"],
          images: ['/omahcempe/1.png', '/omahcempe/2.png', '/omahcempe/3.png', '/omahcempe/4.png', '/omahcempe/5.png'], 
          link: null, github: null, isPinned: true
        },
        {
          title: "D'Production Profile", category: 'Web Dev • Corporate', client: "D'Production House",
          descShort: 'Official landing page for a creative production house.',
          descLong: 'Official landing page for a creative production house in Surabaya. Designed to professionally showcase video showreels...',
          stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify'],
          images: ['/project-dpro.png'], link: 'https://dproductionsub.netlify.app/', github: 'https://github.com/amdwildanabdillah/dproductionsub', isPinned: true
        },
        {
          title: "Personal Portfolio v1", category: 'Web Dev • Personal Branding', client: 'Personal Project',
          descShort: 'Interactive portfolio featuring a modern Glassmorphism design.',
          descLong: 'An interactive personal portfolio website showcasing projects and skills. Built with Vue.js 3 / React as a Single Page Application (SPA).',
          stack: ['React', 'Tailwind CSS', 'Vite', 'Vercel'],
          images: ['/porto/1.png', '/porto/2.png', '/porto/3.png'], link: 'https://portfoliowildan.my.id/', github: null, isPinned: true
        },
        {
          title: 'Digital Invitation', category: 'Web Dev • Invitation', client: 'Personal',
          descShort: 'Official website for VIXEL Studio showcasing services and portfolio.',
          descLong: 'The official website for VIXEL Studio, designed to showcase our range of services, portfolio, and client testimonials.',
          stack: ['Vue.js', 'Tailwind CSS', 'Vite', 'Vercel'],
          images: ['/invite/1.png', '/invite/2.png'], link: 'https://wedding-invitation-wildan.vercel.app/', github: null, isPinned: true
        },
        {
          title: "Puskeswan Mobile", category: "Android App", client: 'Puskeswan Trenggalek',
          descShort: "Mobile application for veterinary services management.",
          descLong: "A dedicated mobile application designed for Puskeswan Trenggalek to manage veterinary services...",
          stack: ['Flutter', 'Dart', 'Supabase'],
          images: ['/puskeswan/1.png', '/puskeswan/2.png'], link: null, github: null, isPinned: false
        },
        {
          title: "WildanInvites HQ", category: "AppSheet Development", client: "WildanInvites Finance",
          descShort: "Dedicated internal management tool for automated cashflow tracking and financial reporting.",
          descLong: "A robust internal tool built purely on the AppSheet and Google ecosystem for WildanInvites...",
          stack: ["AppSheet"],
          images: ['/wildaninvites/1.png', '/wildaninvites/2.png'], link: null, github: null, isPinned: false
        }
    ];

    try {
        const { error } = await supabase.from('vixel_works').insert(oldData);
        if (error) throw error;
        fetchProjects();
    } catch (e) { 
        console.error("Gagal Import:", e); 
        alert("Gagal import data.");
    } finally {
        isLoading.value = false;
    }
};

// SAVE / UPLOAD FILE
const saveProject = async () => {
    isSaving.value = true;
    try {
        let uploadedImageUrls = form.value.images || [];

        if (selectedFiles.value.length > 0) {
            uploadedImageUrls = []; 
            for (const file of selectedFiles.value) {
                const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                
                const { error } = await supabase.storage
                    .from('portfolio-images')
                    .upload(fileName, file);
                
                if (error) throw error;

                const { data: publicUrlData } = supabase.storage
                    .from('portfolio-images')
                    .getPublicUrl(fileName);
                    
                uploadedImageUrls.push(publicUrlData.publicUrl);
            }
        }

        const projectData = {
            title: form.value.title,
            category: form.value.category,
            client: form.value.client,
            descShort: form.value.descShort,
            descLong: form.value.descLong,
            stack: form.value.stack,
            images: uploadedImageUrls,
            link: form.value.link || null,
            github: form.value.github || null,
            isPinned: form.value.isPinned
        };

        if (isEditing.value) {
            const { error } = await supabase.from('vixel_works').update(projectData).eq('id', editId.value);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('vixel_works').insert([projectData]);
            if (error) throw error;
        }
        
        closeModal();
        fetchProjects();
    } catch (error) { 
        console.error("Gagal save:", error); 
        alert("Gagal menyimpan data!");
    } finally {
        isSaving.value = false;
    }
};

const deleteProject = async (id) => {
    if(confirm("Hapus permanen project ini?")) {
        const { error } = await supabase.from('vixel_works').delete().eq('id', id);
        if(!error) fetchProjects();
    }
};

const handleLogout = async () => {
  await supabase.auth.signOut(); 
  router.push('/'); 
};
</script>