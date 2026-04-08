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
      <div v-if="isLoading" class="py-20 text-center flex flex-col items-center">
          <i class="ph ph-spinner-gap text-4xl animate-spin text-cyan-400 mb-4"></i>
          <p class="text-[10px] uppercase tracking-widest font-bold text-gray-500">Loading Database...</p>
      </div>
      
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
          <tbody class="text-sm text-gray-300">
            <tr v-for="item in filteredItems" :key="item.id" class="border-b border-white/5 hover:bg-white/[0.02] transition">
              <td class="p-5 pl-8 text-center">
                <button @click="togglePin(item)" class="active:scale-75 transition-transform cursor-pointer">
                  <i :class="item.isPinned ? 'ph-fill ph-push-pin text-xl text-cyan-400' : 'ph ph-push-pin text-xl text-gray-700 hover:text-gray-400'"></i>
                </button>
              </td>
              <td class="p-5">
                <div class="font-bold text-white text-base tracking-tight">{{ item.title }}</div>
                <div class="text-[11px] text-gray-500 mt-0.5 tracking-wide">{{ item.client || '-' }}</div>
              </td>
              <td class="p-5 text-center">
                <span class="px-2 py-1 rounded bg-white/5 text-[9px] uppercase border border-white/10 font-black text-cyan-400 italic tracking-tighter">{{ item.project_type || 'web' }}</span>
              </td>
              <td class="p-5"><span class="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 text-gray-500">{{ item.category }}</span></td>
              <td class="p-5 text-center"><span class="bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full font-black text-xs">{{ item.sort_order }}</span></td>
              <td class="p-5 pr-8 text-right">
                <button @click="openEditModal(item)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black mr-2 transition cursor-pointer shadow-lg"><i class="ph ph-pencil-simple text-lg"></i></button>
                <button @click="deleteItem(item.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition cursor-pointer shadow-lg"><i class="ph ph-trash text-lg"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col md:flex-row items-end md:items-center gap-4 z-[90]">
        <button @click="openAddModal" class="w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-2xl bg-cyan-400 text-black flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"><i class="ph-fill ph-plus text-3xl md:text-xl md:mr-2"></i><span class="hidden md:inline text-[11px]">Add Project</span></button>
    </div>

    <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10" @click.self="closeModal">
            <div class="bg-[#111113] border border-white/10 w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
                
                <div class="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem] shrink-0">
                    <h2 class="text-xl md:text-2xl font-black italic text-white">{{ isEditing ? 'Edit Vixel Work.' : 'New Vixel Work.' }}</h2>
                    <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 text-gray-400 hover:text-white cursor-pointer transition flex items-center justify-center"><i class="ph ph-x text-xl"></i></button>
                </div>
                
                <div class="p-6 md:p-8 overflow-y-auto flex-1">
                    <form class="space-y-8" @submit.prevent>
                        
                        <div @click="form.isPinned = !form.isPinned" :class="['flex justify-between items-center p-6 rounded-2xl border cursor-pointer transition-all', form.isPinned ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400 shadow-inner' : 'bg-white/5 border-white/10 text-gray-500']">
                            <span class="font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2"><i class="ph-fill ph-push-pin"></i> Featured Project (Pin)</span>
                            <div :class="['w-10 h-6 rounded-full p-1 transition-colors relative', form.isPinned ? 'bg-cyan-400' : 'bg-gray-700']">
                                <div :class="['w-4 h-4 bg-white rounded-full transition-transform shadow-md', form.isPinned ? 'translate-x-4' : 'translate-x-0']"></div>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                            <label v-for="t in ['web', 'app', 'appsheet']" :key="t" class="cursor-pointer">
                                <input type="radio" :value="t" v-model="form.project_type" class="hidden">
                                <div :class="['text-center py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all', form.project_type === t ? 'bg-cyan-400 text-black border-cyan-400 shadow-xl' : 'bg-[#09090b] text-gray-500 border-white/10 hover:border-white/30']">{{ t }}</div>
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Title</label><input v-model="form.title" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Category</label><input v-model="form.category" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Client</label><input v-model="form.client" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Live URL</label><input v-model="form.link" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></div>
                        </div>

                        <div class="grid grid-cols-1 gap-6">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Short Description</label><textarea v-model="form.descShort" rows="2" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></textarea></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">About Project (Long)</label><textarea v-model="form.descLong" rows="3" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></textarea></div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sort Order</label><input v-model="form.sort_order" type="number" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></div>
                            <div class="space-y-2"><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">GitHub Repo</label><input v-model="form.github" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-400"></div>
                            
                            <div class="space-y-2">
                                <label class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Add Images</label>
                                <input type="file" multiple accept="image/*" @change="handleFileSelect" class="text-[11px] file:bg-white/5 file:text-white file:px-5 file:py-3 file:rounded-xl file:border-0 file:cursor-pointer w-full text-gray-500">
                                
                                <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2 bg-[#09090b] p-3 rounded-2xl border border-white/5">
                                    <p class="text-[9px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1"><i class="ph-fill ph-star"></i> File #1 otomatis jadi Thumbnail</p>
                                    <div v-for="(file, idx) in selectedFiles" :key="idx" class="flex items-center gap-3 bg-white/5 p-2 px-3 rounded-xl border border-white/5">
                                        <div class="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">{{ idx + 1 }}</div>
                                        <span class="text-[11px] text-gray-300 truncate flex-1">{{ file.name }}</span>
                                        <span class="text-[9px] text-gray-500 font-bold">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="border-t border-white/5 pt-8 pb-4">
                            <label class="text-[10px] text-gray-500 font-black uppercase mb-4 block tracking-[0.2em]">Tech Stack Specification</label>
                            <div class="flex flex-wrap gap-2 bg-[#070708] p-5 rounded-[2rem] border border-white/5 max-h-[250px] overflow-y-auto shadow-inner">
                                <label v-for="t in availableStacks" :key="t" class="flex items-center gap-3 cursor-pointer group py-1.5 px-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10">
                                    <input type="checkbox" :value="t" v-model="form.stack" class="w-4 h-4 accent-cyan-400 rounded cursor-pointer"> 
                                    <span class="text-[10px] font-bold text-gray-400 group-hover:text-cyan-400 transition-colors uppercase">{{ t }}</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="p-6 md:p-8 border-t border-white/5 bg-[#18181b]/50 flex flex-col gap-4 rounded-b-[2.5rem] shrink-0">
                    <div v-if="isSaving" class="w-full">
                        <div class="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            <span>{{ uploadProgress < 100 ? 'Uploading media...' : 'Syncing database...' }}</span>
                            <span class="text-cyan-400">{{ uploadProgress }}%</span>
                        </div>
                        <div class="w-full bg-black h-2 rounded-full overflow-hidden border border-white/5">
                            <div class="bg-cyan-400 h-full transition-all duration-300 ease-out" :style="{ width: uploadProgress + '%' }"></div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-4 w-full">
                        <button @click="closeModal" :disabled="isSaving" class="text-gray-500 font-black text-[10px] uppercase tracking-widest px-8 hover:text-white disabled:opacity-50">Cancel</button>
                        <button @click="saveItem" :disabled="isSaving" class="bg-cyan-400 text-black px-12 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all">
                            <i v-if="isSaving" class="ph ph-spinner-gap animate-spin text-lg"></i> {{ isEditing ? 'Update Work' : 'Publish Work' }}
                        </button>
                    </div>
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
const uploadProgress = ref(0);

const availableStacks = ['React', 'Vue.js', 'Vite', 'Framer', 'Element', 'Tailwind CSS', 'Bootstrap', 'Flutter', 'Dart', 'Android', 'Laravel', 'Node.js', 'Supabase', 'PostgreSQL', 'MySQL', 'Firebase', 'Vercel', 'Phosphor', 'Netlify', 'HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'TypeScript', 'Python', 'Django', 'Flask', 'AppSheet', 'Google Sheet', 'Automation', 'SEO', 'Responsive', 'Three.js', 'Spline', 'WebGL', 'Blender', 'Figma', 'GitHub', 'VS Code', 'Canva', 'Illustrator', 'Google Fonts'];

const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: '#22d3ee', borderRadius: '32px' };
const form = ref({ project_type: 'web', title: '', category: '', client: '', descShort: '', descLong: '', link: '', github: '', isPinned: false, images: [], sort_order: 0, stack: [] });

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
    isEditing.value = false; editId.value = null; selectedFiles.value = []; uploadProgress.value = 0;
    form.value = { project_type: 'web', title: '', category: '', client: '', descShort: '', descLong: '', link: '', github: '', isPinned: false, images: [], sort_order: 0, stack: [] }; 
    showModal.value = true; 
};

const openEditModal = (p) => { 
    isEditing.value = true; editId.value = p.id; selectedFiles.value = []; uploadProgress.value = 0;
    form.value = { ...p, project_type: p.project_type || 'web', stack: p.stack || [], isPinned: Boolean(p.isPinned) }; 
    showModal.value = true; 
};

const closeModal = () => { if(!isSaving.value) showModal.value = false; }; 
const handleFileSelect = (e) => selectedFiles.value = Array.from(e.target.files);

const startProgress = () => {
    uploadProgress.value = 0;
    return setInterval(() => {
        if (uploadProgress.value < 90) {
            uploadProgress.value += Math.floor(Math.random() * 8) + 4;
            if(uploadProgress.value > 90) uploadProgress.value = 90; 
        }
    }, 450);
};

const saveItem = async () => {
    isSaving.value = true;
    const progressTimer = startProgress();

    try {
        let upUrls = isEditing.value ? [...(form.value.images||[])] : [];
        
        if (selectedFiles.value.length > 0) {
            upUrls = [];
            for (const file of selectedFiles.value) {
                const name = `vixel/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
                const { error: upErr } = await supabase.storage.from('portfolio-images').upload(name, file);
                if (upErr) throw upErr;
                upUrls.push(supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl);
            }
        }
        
        clearInterval(progressTimer);
        uploadProgress.value = 100;

        const payload = { ...form.value, images: upUrls, isPinned: Boolean(form.value.isPinned), sort_order: parseInt(form.value.sort_order)||0 };

        if (isEditing.value) await supabase.from('vixel_works').update(payload).eq('id', editId.value);
        else await supabase.from('vixel_works').insert([payload]);
        
        closeModal(); fetchItems(); 
        Swal.fire({...swalConfig, icon: 'success', title: 'Work Published!', timer: 1500, showConfirmButton: false});
    } catch (error) {
        clearInterval(progressTimer); uploadProgress.value = 0;
        Swal.fire({...swalConfig, icon: 'error', title: 'Failed!', text: error.message});
    } finally {
        isSaving.value = false;
    }
};

const deleteItem = async (id) => { 
    const res = await Swal.fire({...swalConfig, title: 'Hapus Project?', icon: 'warning', showCancelButton: true}); 
    if(res.isConfirmed) { await supabase.from('vixel_works').delete().eq('id', id); fetchItems(); } 
};
</script>
