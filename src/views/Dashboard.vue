<template>
  <div class="h-screen bg-[#09090b] text-white font-sans flex flex-col md:flex-row overflow-hidden text-sm">
    
    <Sidebar :active="activeMenu" @switch="switchMenu" @logout="handleLogout" />

    <header class="md:hidden flex justify-between items-center p-6 border-b border-white/10 bg-[#111113] z-30 shadow-xl">
        <h1 class="text-xl font-extrabold italic">Central <span class="text-cyan-400">Admin.</span></h1>
        <button @click="handleLogout" class="text-gray-500 hover:text-red-400"><i class="ph ph-sign-out text-2xl"></i></button>
    </header>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      
      <div class="p-6 md:p-10 pb-4 bg-[#09090b] z-10 text-left border-b border-white/5">
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
            <thead class="sticky top-0 bg-[#111113] z-10 border-b border-white/10">
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
                  <button @click="togglePin(project)" class="transition-transform active:scale-75 hover:scale-110">
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
                    <button @click="openEditModal(project)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black transition border border-white/10 shadow-lg"><i class="ph ph-pencil-simple text-lg"></i></button>
                    <button @click="deleteProject(project.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 transition border border-white/10 shadow-lg"><i class="ph ph-trash text-lg"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <button @click="openAddModal" 
              :class="['fixed bottom-28 right-6 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center z-50 transition-all active:scale-90', 
                       activeMenu === 'vixel' ? 'bg-cyan-400 text-black shadow-cyan-400/40' : 'bg-purple-400 text-black shadow-purple-400/40']">
          <i class="ph-fill ph-plus text-3xl"></i>
      </button>

      <div class="md:hidden fixed bottom-[88px] left-0 w-full px-6 py-3 flex gap-3 z-40 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent">
          <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" target="_blank" class="flex-1 flex items-center justify-center bg-[#111113]/90 backdrop-blur-xl border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-2xl active:bg-white/20">View Site</a>
          <button @click="seedData" class="flex-1 flex items-center justify-center bg-[#111113]/90 backdrop-blur-xl border border-white/10 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase shadow-2xl active:bg-white/20">Seed DB</button>
      </div>

      <nav class="md:hidden fixed bottom-0 w-full bg-[#09090b]/90 backdrop-blur-2xl border-t border-white/10 flex justify-around p-4 pb-8 z-50">
          <button @click="switchMenu('vixel')" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'vixel' ? 'text-cyan-400' : 'text-gray-600']"><i :class="activeMenu === 'vixel' ? 'ph-fill ph-squares-four text-3xl' : 'ph ph-squares-four text-3xl'"></i><span class="text-[9px] font-black uppercase">Vixel</span></button>
          <button @click="switchMenu('personal')" :class="['flex flex-col items-center gap-1 transition', activeMenu === 'personal' ? 'text-purple-400' : 'text-gray-600']"><i :class="activeMenu === 'personal' ? 'ph-fill ph-user-circle text-3xl' : 'ph ph-user-circle text-3xl'"></i><span class="text-[9px] font-black uppercase">Personal</span></button>
      </nav>

      <div class="hidden md:flex fixed bottom-10 right-10 gap-3 z-40">
           <a :href="activeMenu === 'vixel' ? 'https://vixelcreative.my.id' : 'https://portfoliowildan.my.id'" target="_blank" class="flex items-center bg-[#111113] border border-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase shadow-2xl hover:bg-white hover:text-black transition">View Live <i class="ph ph-arrow-square-out ml-2"></i></a>
           <button @click="seedData" class="bg-[#111113] border border-white/10 text-gray-500 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase hover:border-white transition">Seed</button>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
        <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl my-8 flex flex-col max-h-[90vh] text-left">
            <div class="p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem]">
                <h2 class="text-2xl font-black italic tracking-tighter">{{ isEditing ? 'Edit Project.' : 'New Project.' }}</h2>
                <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"><i class="ph ph-x text-xl"></i></button>
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
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Title</label><input v-model="form.title" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none focus:border-white transition shadow-inner" placeholder="Project Name"></div>
                        <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Category</label><input v-model="form.category" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none focus:border-white transition" placeholder="e.g. Mobile Development"></div>
                    </div>

                    <template v-if="form.project_type === 'cinema'">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Platform</label><select v-model="form.media_type" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none"><option value="youtube">YouTube</option><option value="drive">Google Drive</option><option value="link">Behance</option></select></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Video ID / Link</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none" placeholder="Ex: gDOdVnRsZ0E"></div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Client Name</label><input v-model="form.client" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none" placeholder="Self-Project / Company"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Live URL</label><input v-model="form.link" type="text" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 outline-none" placeholder="https://..."></div>
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
                <button @click="closeModal" class="px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-white transition">Cancel</button>
                <button @click="saveProject" :disabled="isSaving" :class="['px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-2xl disabled:opacity-50', activeMenu === 'vixel' ? 'bg-cyan-400 text-black' : 'bg-purple-400 text-black']">
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

// --- RESET FORM ---
const form = ref({
    project_type: 'dev', title: '', category: '', client: '', descShort: '', descLong: '', 
    stack: [], images: [], link: '', github: '', media_type: 'youtube', isPinned: false 
});

watch(activeMenu, () => { fetchProjects(); });
const switchMenu = (menu) => { activeMenu.value = menu; };

// --- AMBIL DATA ---
const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase.from(activeTable.value).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    projects.value = data;
  } catch (e) { console.error(e); } finally { isLoading.value = false; }
};

onMounted(() => { fetchProjects(); });

// --- QUICK PIN TOGGLE (FIXED) ---
const togglePin = async (project) => {
  const oldStatus = project.isPinned;
  const newStatus = !oldStatus;
  
  // Optimistic UI (Berubah di layar dulu biar cepet)
  project.isPinned = newStatus;

  try {
    const { error } = await supabase.from(activeTable.value).update({ isPinned: newStatus }).eq('id', project.id);
    if (error) throw error;
    
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success', title: newStatus ? 'Pinned to Featured' : 'Removed from Featured',
      showConfirmButton: false, timer: 2000, background: '#111113', color: '#fff'
    });
  } catch (e) {
    project.isPinned = oldStatus; // Rollback kalau error
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Error', text: 'Gagal update status pin.' });
  }
};

// --- MODAL CONTROLS ---
const openAddModal = () => { isEditing.value = false; editId.value = null; form.value = { project_type: 'dev', title: '', category: '', client: '', descShort: '', descLong: '', stack: [], images: [], link: '', github: '', media_type: 'youtube', isPinned: false }; showModal.value = true; };
const openEditModal = (p) => { isEditing.value = true; editId.value = p.id; form.value = { ...p, stack: p.stack || [], isPinned: Boolean(p.isPinned) }; showModal.value = true; };
const closeModal = () => { showModal.value = false; };
const handleFileSelect = (e) => { selectedFiles.value = Array.from(e.target.files); };

// --- SAVE / UPDATE DATA (FIXED PAYLOAD) ---
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

        // --- PAYLOAD BERSIH (PASTIKAN isPinned MASUK) ---
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
            isPinned: Boolean(form.value.isPinned), // <--- DIPAKSA BOOLEAN
            project_type: activeMenu.value === 'vixel' ? 'dev' : form.value.project_type,
            media_type: form.value.media_type || 'youtube'
        };

        if (isEditing.value) {
            const { error } = await supabase.from(activeTable.value).update(payload).eq('id', editId.value);
            if(error) throw error;
        } else {
            const { error } = await supabase.from(activeTable.value).insert([payload]);
            if(error) throw error;
        }
        
        closeModal(); fetchProjects();
        Swal.fire({ ...swalConfig, icon: 'success', title: 'Project Updated.', timer: 1500, showConfirmButton: false });
    } catch (e) { 
        Swal.fire({ ...swalConfig, icon: 'error', title: 'Save Failed', text: e.message });
    } finally { isSaving.value = false; }
};

const deleteProject = async (id) => { 
  const res = await Swal.fire({ ...swalConfig, title: 'Hapus Data?', text: "Bakal ilang selamanya dari Supabase!", icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus!' });
  if(res.isConfirmed) { await supabase.from(activeTable.value).delete().eq('id', id); fetchProjects(); } 
};
const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };
</script>