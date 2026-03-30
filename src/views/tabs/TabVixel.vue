<template>
  <div class="flex-1 flex flex-col h-full relative">
    <div class="p-6 md:p-10 pb-4 z-20 text-left border-b border-white/5 bg-[#09090b]">
        <h2 class="text-2xl md:text-4xl font-bold tracking-tighter">Manage <span class="text-cyan-400">Vixel Projects</span></h2>
        <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-1 opacity-50 font-bold">Table: vixel_works</p>
    </div>

    <div class="px-6 md:px-10 py-4 border-b border-white/5 bg-[#111113] overflow-x-auto flex gap-3 z-10 sticky top-0">
        <button v-for="f in ['all', 'web', 'app', 'appsheet']" :key="f" 
            @click="activeFilter = f"
            :class="['px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border cursor-pointer', 
                     activeFilter === f ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white']">
            {{ f === 'all' ? 'All Projects' : f }}
        </button>
    </div>

    <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-4 pb-48 md:pb-10 relative">
      <div v-if="isLoading" class="py-20 text-center"><i class="ph ph-spinner-gap text-4xl animate-spin text-cyan-400"></i></div>
      
      <div v-else class="bg-[#111113] border border-white/10 rounded-3xl overflow-x-auto shadow-2xl">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead class="bg-[#18181b] border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th class="p-5 pl-8 text-center w-16">Pin</th>
              <th class="p-5 font-bold">Title & Client</th>
              <th class="p-5 text-center">Type</th>
              <th class="p-5 font-bold">Category</th>
              <th class="p-5 text-center">Order</th>
              <th class="p-5 pr-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="item in filteredItems" :key="item.id" class="border-b border-white/5 hover:bg-white/[0.02] transition">
              <td class="p-5 pl-8 text-center">
                <button @click="togglePin(item)" class="active:scale-75 transition-transform cursor-pointer">
                  <i :class="item.isPinned ? 'ph-fill ph-push-pin text-xl text-cyan-400' : 'ph ph-push-pin text-xl text-gray-700 hover:text-gray-400'"></i>
                </button>
              </td>
              <td class="p-5">
                <div class="font-bold text-white text-base">{{ item.title }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ item.client || '-' }}</div>
              </td>
              <td class="p-5 text-center">
                <span class="px-2 py-1 rounded bg-white/5 text-[9px] uppercase border border-white/10 font-black text-cyan-400 italic tracking-tighter">{{ item.project_type || 'web' }}</span>
              </td>
              <td class="p-5"><span class="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 text-gray-400">{{ item.category }}</span></td>
              <td class="p-5 text-center"><span class="bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full font-black text-xs">{{ item.sort_order }}</span></td>
              <td class="p-5 pr-8 text-right">
                <button @click="openEditModal(item)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black mr-2 transition cursor-pointer"><i class="ph ph-pencil-simple text-lg"></i></button>
                <button @click="deleteItem(item.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition cursor-pointer"><i class="ph ph-trash text-lg"></i></button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0"><td colspan="6" class="p-10 text-center text-gray-500 font-bold uppercase tracking-widest">Tidak ada project di kategori ini.</td></tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col md:flex-row items-end md:items-center gap-4 z-[90]">
        <div class="flex md:hidden gap-3 mb-2">
            <button @click="seedData" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-gray-400 flex justify-center items-center shadow-xl cursor-pointer"><i class="ph ph-database text-xl"></i></button>
            <a href="https://vixelcreative.my.id" target="_blank" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-white flex justify-center items-center shadow-xl cursor-pointer"><i class="ph ph-arrow-square-out text-xl"></i></a>
        </div>
        <button @click="seedData" class="hidden md:block px-6 py-3.5 bg-[#111113] border border-white/20 text-gray-400 rounded-2xl font-bold text-xs uppercase hover:text-white transition cursor-pointer">Sync Data</button>
        <a href="https://vixelcreative.my.id" target="_blank" class="hidden md:flex items-center gap-2 px-6 py-3.5 bg-[#111113] border border-white/20 text-white rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition cursor-pointer">Live <i class="ph ph-arrow-square-out"></i></a>
        <button @click="openAddModal" class="w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-2xl bg-cyan-400 text-black flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"><i class="ph-fill ph-plus text-3xl md:text-xl md:mr-2"></i><span class="hidden md:inline">Add</span></button>
    </div>

    <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10" @click.self="closeModal">
            <div class="bg-[#111113] border border-white/10 w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh]">
                
                <div class="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem] shrink-0">
                    <h2 class="text-xl md:text-2xl font-black italic">{{ isEditing ? 'Edit Vixel Work' : 'New Vixel Work' }}</h2>
                    <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 text-gray-400 hover:text-white cursor-pointer transition"><i class="ph ph-x text-xl"></i></button>
                </div>
                
                <div class="p-6 md:p-8 overflow-y-auto flex-1">
                    <form class="space-y-6">
                        
                        <div @click="form.isPinned = !form.isPinned" :class="['flex justify-between items-center p-5 rounded-2xl border cursor-pointer transition-all', form.isPinned ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-500']">
                            <span class="font-black uppercase tracking-widest text-xs"><i class="ph ph-push-pin mr-2"></i> Pin Project</span>
                            <div :class="['w-10 h-6 rounded-full p-1 transition-colors', form.isPinned ? 'bg-cyan-400' : 'bg-gray-700']"><div :class="['w-4 h-4 bg-white rounded-full transition-transform', form.isPinned ? 'translate-x-4' : 'translate-x-0']"></div></div>
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                        <label v-for="t in ['web', 'app', 'appsheet']" :key="t" class="cursor-pointer">
                            <input type="radio" :value="t" v-model="form.project_type" class="hidden">
                            <div :class="['text-center py-3 rounded-xl border text-[10px] font-black uppercase transition-all', form.project_type === t ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-[#09090b] text-gray-500 border-white/10 hover:border-white/30']">{{ t }}</div>
                        </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Title</label><input v-model="form.title" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Category (ex: Landing Page)</label><input v-model="form.category" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Client Name</label><input v-model="form.client" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Live Link / URL</label><input v-model="form.link" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Short Description</label><textarea v-model="form.descShort" rows="2" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></textarea></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Long Description</label><textarea v-model="form.descLong" rows="2" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></textarea></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Sort Order</label><input v-model="form.sort_order" type="number" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">GitHub Repo (Optional)</label><input v-model="form.github" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase">Upload Images</label><input type="file" multiple @change="handleFileSelect" class="text-xs file:bg-white/5 file:text-white file:px-4 file:py-2 file:rounded-xl file:border-0 w-full mt-1 text-gray-400 cursor-pointer"></div>
                        </div>

                        <div class="border-t border-white/5 pt-6">
                            <label class="text-[10px] text-gray-500 font-black uppercase mb-3 block">Tech Stack</label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-[#09090b] p-4 rounded-2xl border border-white/5">
                                <label v-for="t in availableStacks" :key="t" class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" :value="t" v-model="form.stack" class="w-4 h-4 accent-cyan-400 rounded cursor-pointer"> 
                                <span class="text-[11px] font-bold text-gray-400 group-hover:text-white transition">{{ t }}</span>
                                </label>
                            </div>
                        </div>

                    </form>
                </div>
                
                <div class="p-6 md:p-8 border-t border-white/5 bg-[#18181b]/50 flex justify-end gap-4 rounded-b-[2.5rem] shrink-0">
                    <button @click="closeModal" class="text-gray-500 font-black text-xs uppercase px-6 hover:text-white transition cursor-pointer">Cancel</button>
                    <button @click="saveItem" :disabled="isSaving" class="bg-cyan-400 text-black px-10 py-3 rounded-2xl font-black text-xs uppercase shadow-xl shadow-cyan-400/20 disabled:opacity-50 cursor-pointer flex items-center gap-2">
                        <i v-if="isSaving" class="ph ph-spinner-gap animate-spin"></i> Save
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; 
import { supabase } from '../../supabase'; 
import Swal from 'sweetalert2';

const items = ref([]); 
const isLoading = ref(true); 
const isSaving = ref(false); 
const showModal = ref(false); 
const isEditing = ref(false); 
const editId = ref(null); 
const selectedFiles = ref([]);
const activeFilter = ref('all');

const availableStacks = ['React', 'Vue.js', 'Tailwind CSS', 'Vite', 'Flutter', 'Dart', 'AppSheet', 'Supabase', 'Firebase', 'Netlify', 'Vercel', 'Node.js', 'Laravel', 'Vanilla JS'];
const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: '#22d3ee', borderRadius: '24px' };

const form = ref({ project_type: 'web', title: '', category: '', client: '', descShort: '', descLong: '', link: '', github: '', isPinned: false, images: [], sort_order: 0, stack: [] });

// Logic Filter
const filteredItems = computed(() => {
    if (activeFilter.value === 'all') return items.value;
    return items.value.filter(item => item.project_type === activeFilter.value);
});

const fetchItems = async () => { 
    isLoading.value = true; 
    const { data } = await supabase.from('vixel_works').select('*').order('sort_order', {ascending: true}).order('created_at', { ascending: false }); 
    items.value = data || []; 
    isLoading.value = false; 
};
onMounted(() => fetchItems());

const togglePin = async (item) => { 
    item.isPinned = !item.isPinned; 
    await supabase.from('vixel_works').update({ isPinned: item.isPinned }).eq('id', item.id); 
};

const openAddModal = () => { 
    isEditing.value = false; editId.value = null; selectedFiles.value = []; 
    form.value = { project_type: 'web', title: '', category: '', client: '', descShort: '', descLong: '', link: '', github: '', isPinned: false, images: [], sort_order: 0, stack: [] }; 
    showModal.value = true; 
};

const openEditModal = (p) => { 
    isEditing.value = true; editId.value = p.id; 
    form.value = { ...p, project_type: p.project_type || 'web', stack: p.stack || [], isPinned: Boolean(p.isPinned) }; 
    showModal.value = true; 
};

const closeModal = () => showModal.value = false; 
const handleFileSelect = (e) => selectedFiles.value = Array.from(e.target.files);

const saveItem = async () => {
    isSaving.value = true;
    let upUrls = isEditing.value ? [...(form.value.images||[])] : [];
    if (selectedFiles.value.length > 0) {
        upUrls = [];
        for (const file of selectedFiles.value) {
            const name = `vixel/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
            await supabase.storage.from('portfolio-images').upload(name, file);
            upUrls.push(supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl);
        }
    }
    const payload = { ...form.value, images: upUrls, isPinned: Boolean(form.value.isPinned), sort_order: parseInt(form.value.sort_order)||0 };
    if (isEditing.value) await supabase.from('vixel_works').update(payload).eq('id', editId.value);
    else await supabase.from('vixel_works').insert([payload]);
    
    closeModal(); fetchItems(); 
    Swal.fire({...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false});
    isSaving.value = false;
};

const deleteItem = async (id) => { 
    const res = await Swal.fire({...swalConfig, title: 'Hapus?', icon: 'warning', showCancelButton: true}); 
    if(res.isConfirmed) { await supabase.from('vixel_works').delete().eq('id', id); fetchItems(); } 
};

const seedData = async () => {
    const res = await Swal.fire({...swalConfig, title: 'Seed Vixel?', showCancelButton: true}); 
    if(!res.isConfirmed) return;
    isLoading.value = true;
    const data = [
        { project_type: 'web', title: 'Omah Cempe', category: 'Landing Page', client: 'Omah Cempe Kediri', descShort: 'A modern landing page designed to digitalize livestock investment.', stack: ["React", "Tailwind CSS", "Vite"], images: ['/omahcempe/1.png'], isPinned: true, sort_order: 1 },
        { project_type: 'web', title: "D'Production Profile", category: 'Corporate', client: "D'Production House", descShort: 'Official landing page for a creative production house.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Netlify'], images: ['/project-dpro.png'], isPinned: true, sort_order: 2 },
        { project_type: 'web', title: "Personal Portfolio v1", category: 'Personal Branding', client: 'Personal', descShort: 'Interactive portfolio featuring a modern Glassmorphism design.', stack: ['React', 'Tailwind CSS', 'Vite'], images: ['/porto/1.png'], isPinned: true, sort_order: 3 },
        { project_type: 'web', title: 'Digital Invitation', category: 'Invitation', client: 'Personal', descShort: 'Highly customizable digital invitation template with RSVP.', stack: ['Vue.js', 'Tailwind CSS', 'Vite'], images: ['/invite/1.png'], isPinned: true, sort_order: 4 },
        { project_type: 'app', title: 'Puskeswan Mobile', category: "Android App", client: 'Puskeswan', descShort: "Mobile application for veterinary services management.", stack: ['Flutter', 'Dart', 'Supabase'], images: ['/puskeswan/1.png'], isPinned: false, sort_order: 5 },
        { project_type: 'appsheet', title: 'WildanInvites HQ', category: "Internal Tool", client: 'Internal Finance', descShort: "Dedicated internal management tool for cashflow tracking.", stack: ['AppSheet'], images: ['/cashflowhq.png'], isPinned: false, sort_order: 6 },
        { project_type: 'web', title: 'Storydesto', category: 'Marketplace', client: 'Internal Startup', descShort: 'A digital marketplace connecting photography vendors with clients.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS'], images: ['/coverdesto.png'], isPinned: true, sort_order: 7 },
        { project_type: 'web', title: 'Bio Link Hub', category: 'Link in Bio', client: 'Akar Coffee', descShort: 'Custom fast and responsive link-in-bio website.', stack: ['Vue.js', 'Tailwind CSS', 'Vite'], link: 'https://bio.portfoliowildan.my.id', images: ['/biolink.png'], isPinned: true, sort_order: 8 }
    ];
    try {
        await supabase.from('vixel_works').insert(data); 
        fetchItems(); 
        Swal.fire({...swalConfig, icon: 'success', title: 'Seed Sukses!', timer: 1500});
    } catch (e) {
        Swal.fire({...swalConfig, icon: 'error', title: 'Gagal', text: e.message});
    } finally {
        isLoading.value = false;
    }
};
</script>