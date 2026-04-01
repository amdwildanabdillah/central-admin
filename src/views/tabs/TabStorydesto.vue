<template>
  <div class="flex-1 flex flex-col h-full relative">
    
    <div class="p-6 md:p-10 pb-4 z-20 text-left border-b border-white/5 bg-[#09090b]">
        <h2 class="text-2xl md:text-4xl font-bold tracking-tighter">Manage <span class="text-yellow-400">Storydesto HQ</span></h2>
        <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-1 opacity-50 font-bold">Table: storydesto_content</p>
    </div>

    <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-4 pb-48 md:pb-10">
      <div v-if="isLoading" class="py-20 text-center flex flex-col items-center">
          <i class="ph ph-spinner-gap text-4xl animate-spin text-yellow-400 mb-4"></i>
          <p class="text-[10px] uppercase tracking-widest font-bold text-gray-500">Loading Content...</p>
      </div>
      
      <div v-else class="bg-[#111113] border border-white/10 rounded-3xl overflow-x-auto shadow-2xl">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-[#18181b] border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th class="p-5 pl-8 text-center w-16">Pin</th>
              <th class="p-5 font-bold">Title / Name</th>
              <th class="p-5 text-center">Type</th>
              <th class="p-5 text-center">Order</th>
              <th class="p-5 pr-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-300">
            <tr v-for="item in items" :key="item.id" class="border-b border-white/5 hover:bg-white/[0.02] transition">
              <td class="p-5 pl-8 text-center">
                <button @click="togglePin(item)" class="active:scale-75 transition-transform cursor-pointer">
                  <i :class="item.is_pinned ? 'ph-fill ph-push-pin text-xl text-yellow-400' : 'ph ph-push-pin text-xl text-gray-700 hover:text-gray-400'"></i>
                </button>
              </td>
              <td class="p-5">
                <div class="font-bold text-white text-base tracking-tight">{{ item.title || 'Tanpa Judul' }}</div>
                <div class="text-[11px] text-gray-500 mt-0.5 tracking-wide">{{ item.subtitle || '-' }}</div>
              </td>
              <td class="p-5 text-center">
                <span class="px-3 py-1 rounded bg-white/5 text-[9px] uppercase border border-white/10 font-black text-yellow-400 tracking-tighter">{{ item.type }}</span>
              </td>
              <td class="p-5 text-center">
                <span class="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full font-black text-xs">{{ item.sort_order }}</span>
              </td>
              <td class="p-5 pr-8 text-right">
                <button @click="openEditModal(item)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black mr-2 transition cursor-pointer"><i class="ph ph-pencil-simple text-lg"></i></button>
                <button @click="deleteItem(item.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition cursor-pointer"><i class="ph ph-trash text-lg"></i></button>
              </td>
            </tr>
            <tr v-if="items.length === 0"><td colspan="5" class="p-20 text-center text-gray-500 font-bold uppercase tracking-widest italic">Belum ada konten Storydesto.</td></tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col md:flex-row items-end md:items-center gap-4 z-[90]">
        <div class="flex md:hidden gap-3 mb-2">
            <button @click="seedData" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-gray-400 flex justify-center items-center shadow-xl cursor-pointer"><i class="ph ph-database text-xl"></i></button>
            <a href="https://storydesto.my.id" target="_blank" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-white flex justify-center items-center shadow-xl cursor-pointer"><i class="ph ph-arrow-square-out text-xl"></i></a>
        </div>
        <button @click="seedData" class="hidden md:block px-6 py-3.5 bg-[#111113] border border-white/20 text-gray-400 rounded-2xl font-bold text-xs uppercase hover:text-white transition cursor-pointer">Sync Data</button>
        <a href="https://storydesto.my.id" target="_blank" class="hidden md:flex items-center gap-2 px-6 py-3.5 bg-[#111113] border border-white/20 text-white rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition cursor-pointer">Live <i class="ph ph-arrow-square-out"></i></a>
        <button @click="openAddModal" class="w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
            <i class="ph-fill ph-plus text-3xl md:text-xl md:mr-2"></i><span class="hidden md:inline">Add Content</span>
        </button>
    </div>

    <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10" @click.self="closeModal">
            <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
                
                <div class="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem] shrink-0">
                    <h2 class="text-xl md:text-2xl font-black italic text-white">{{ isEditing ? 'Edit Storydesto' : 'New Storydesto' }}</h2>
                    <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 text-gray-400 hover:text-white transition flex justify-center items-center cursor-pointer"><i class="ph ph-x text-xl"></i></button>
                </div>
                
                <div class="p-6 md:p-8 overflow-y-auto flex-1">
                    <form class="space-y-8" @submit.prevent>
                        
                        <div @click="form.is_pinned = !form.is_pinned" :class="['flex justify-between items-center p-5 rounded-2xl border cursor-pointer transition-all', form.is_pinned ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-500']">
                            <span class="font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><i class="ph ph-push-pin"></i> Pin Item</span>
                            <div :class="['w-10 h-6 rounded-full p-1 transition-colors', form.is_pinned ? 'bg-yellow-400' : 'bg-gray-700']"><div :class="['w-4 h-4 bg-white rounded-full transition-transform', form.is_pinned ? 'translate-x-4' : 'translate-x-0']"></div></div>
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                            <label v-for="t in ['portfolio', 'testimonial', 'hero']" :key="t" class="cursor-pointer">
                                <input type="radio" :value="t" v-model="form.type" class="hidden">
                                <div :class="['text-center py-4 rounded-xl border font-black uppercase text-[10px] tracking-widest transition-all', form.type === t ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-[#09090b] text-gray-500 border-white/10 hover:border-white/30']">{{ t }}</div>
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Title / Name</label><input v-model="form.title" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400 transition"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Sort Order</label><input v-model="form.sort_order" type="number" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400 transition"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Subtitle / Campus</label><input v-model="form.subtitle" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400 transition"></div>
                        </div>

                        <div class="border-t border-white/5 pt-6">
                            
                            <div v-if="form.type === 'portfolio'">
                                <label class="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">Upload Images (Gallery)</label>
                                <input type="file" multiple accept="image/*" @change="handleFileSelect" class="text-xs file:bg-white/5 file:text-white file:px-5 file:py-3 file:rounded-xl file:border-0 file:font-bold text-gray-400 cursor-pointer w-full">
                                <p v-if="isEditing && form.images && form.images.length > 0" class="text-[10px] text-yellow-400 mt-2 italic">* Project ini sudah memiliki {{ form.images.length }} foto tersimpan.</p>
                            </div>

                            <div v-if="form.type === 'testimonial'">
                                <label class="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">Pesan Testimoni</label>
                                <textarea v-model="form.description" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400 transition" rows="3" placeholder="Tulis ulasan klien di sini..."></textarea>
                            </div>

                            <div v-if="form.type === 'hero'">
                                <label class="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">Upload Video Hero (MP4/WebM)</label>
                                <input type="file" accept="video/*" @change="handleVideoSelect" class="text-xs file:bg-white/5 file:text-white file:px-5 file:py-3 file:rounded-xl file:border-0 file:font-bold text-gray-400 cursor-pointer w-full">
                                <p v-if="form.media_url && !selectedVideo" class="mt-3 text-[11px] text-gray-500 truncate bg-white/5 p-3 rounded-xl border border-white/5">
                                    Current Video: <a :href="form.media_url" target="_blank" class="text-yellow-400 underline font-bold ml-1">View File</a>
                                </p>
                            </div>
                            
                        </div>
                    </form>
                </div>
                
                <div class="p-6 md:p-8 border-t border-white/5 bg-[#18181b]/50 flex justify-end gap-4 rounded-b-[2.5rem] shrink-0">
                    <button @click="closeModal" class="text-gray-500 font-black text-[10px] uppercase tracking-widest px-6 hover:text-white transition cursor-pointer">Cancel</button>
                    <button @click="saveItem" :disabled="isSaving" class="bg-yellow-400 text-black px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-yellow-400/20 disabled:opacity-50 cursor-pointer flex items-center gap-2">
                        <i v-if="isSaving" class="ph ph-spinner-gap animate-spin"></i> {{ isEditing ? 'Update' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; 
import { supabase } from '../../supabase'; 
import Swal from 'sweetalert2';

const items = ref([]); 
const isLoading = ref(true); 
const isSaving = ref(false); 
const showModal = ref(false); 
const isEditing = ref(false); 
const editId = ref(null); 
const selectedFiles = ref([]); // Buat foto portofolio
const selectedVideo = ref(null); // KHUSUS buat nampung Video Hero

const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: '#facc15', borderRadius: '24px' };

const form = ref({ type: 'portfolio', title: '', subtitle: '', description: '', media_url: '', images: [], is_pinned: true, sort_order: 0 });

const fetchItems = async () => { 
    isLoading.value = true; 
    const { data } = await supabase.from('storydesto_content').select('*').order('sort_order', {ascending: true}).order('created_at', { ascending: false }); 
    items.value = data || []; 
    isLoading.value = false; 
};
onMounted(() => fetchItems());

const togglePin = async (item) => { 
    item.is_pinned = !item.is_pinned; 
    await supabase.from('storydesto_content').update({ is_pinned: item.is_pinned }).eq('id', item.id); 
};

const openAddModal = () => { 
    isEditing.value = false; editId.value = null; selectedFiles.value = []; selectedVideo.value = null;
    form.value = { type: 'portfolio', title: '', subtitle: '', description: '', media_url: '', images: [], is_pinned: true, sort_order: 0 }; 
    showModal.value = true; 
};

const openEditModal = (p) => { 
    isEditing.value = true; editId.value = p.id; selectedFiles.value = []; selectedVideo.value = null;
    form.value = { ...p, is_pinned: Boolean(p.is_pinned) }; 
    showModal.value = true; 
};

const closeModal = () => showModal.value = false; 
const handleFileSelect = (e) => selectedFiles.value = Array.from(e.target.files);

// Logic baru buat nangkep file video
const handleVideoSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        selectedVideo.value = e.target.files[0];
    }
};

const saveItem = async () => {
    isSaving.value = true;
    try {
        let upUrls = isEditing.value ? [...(form.value.images||[])] : [];
        let finalMediaUrl = form.value.media_url; // Defaultnya pake URL yang lama kalo ada

        // 1. Upload logic buat Gambar (Portfolio)
        if (form.value.type === 'portfolio' && selectedFiles.value.length > 0) {
            upUrls = [];
            for (const file of selectedFiles.value) {
                const name = `storydesto/images/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
                await supabase.storage.from('portfolio-images').upload(name, file);
                upUrls.push(supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl);
            }
        }

        // 2. Upload logic buat Video (Hero)
        if (form.value.type === 'hero' && selectedVideo.value) {
            const file = selectedVideo.value;
            const name = `storydesto/videos/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
            const { error: uploadErr } = await supabase.storage.from('portfolio-images').upload(name, file);
            
            if (uploadErr) throw uploadErr;
            finalMediaUrl = supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl;
        }

        // Gabungin Payload
        const payload = { 
            type: form.value.type,
            title: form.value.title,
            subtitle: form.value.subtitle,
            description: form.value.description,
            media_url: finalMediaUrl, // Video hero masuk sini
            images: upUrls,           // Foto porto masuk sini
            is_pinned: Boolean(form.value.is_pinned), 
            sort_order: parseInt(form.value.sort_order)||0 
        };

        if (isEditing.value) await supabase.from('storydesto_content').update(payload).eq('id', editId.value);
        else await supabase.from('storydesto_content').insert([payload]);
        
        closeModal(); 
        fetchItems(); 
        Swal.fire({...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false});
    } catch (error) {
        Swal.fire({...swalConfig, icon: 'error', title: 'Gagal Upload', text: error.message});
    } finally {
        isSaving.value = false;
    }
};

const deleteItem = async (id) => { 
    const res = await Swal.fire({...swalConfig, title: 'Hapus Item?', icon: 'warning', showCancelButton: true}); 
    if(res.isConfirmed) { await supabase.from('storydesto_content').delete().eq('id', id); fetchItems(); } 
};

// Seed Data tetep dipertahankan
const seedData = async () => {
    const res = await Swal.fire({...swalConfig, title: 'Seed Storydesto?', showCancelButton: true}); 
    if(!res.isConfirmed) return;
    isLoading.value = true;
    const data = [
        { type: 'hero', media_url: '/assets/hero/hero.mp4', is_pinned: true, sort_order: 1 },
        { type: 'portfolio', title: 'Syahrulabdn', subtitle: 'Universitas Negeri Surabaya', images: ['/assets/syahdrulabdn/1.jpg', '/assets/syahdrulabdn/2.jpg'], is_pinned: true, sort_order: 2 },
        { type: 'testimonial', title: 'Ikaynl', subtitle: 'UNAIR 2024', description: 'Sumpah suka banget sama hasilnya!', is_pinned: true, sort_order: 6 },
    ];
    try {
        await supabase.from('storydesto_content').insert(data); 
        fetchItems(); 
        Swal.fire({...swalConfig, icon: 'success', title: 'Seed Sukses!', timer: 1500});
    } catch (e) {
        Swal.fire({...swalConfig, icon: 'error', title: 'Gagal', text: e.message});
    } finally {
        isLoading.value = false;
    }
};
</script>
