<template>
  <div class="flex-1 flex flex-col h-full relative">
    <div class="p-6 md:p-10 pb-4 z-20 text-left border-b border-white/5 bg-[#09090b]">
        <h2 class="text-2xl md:text-4xl font-bold tracking-tighter">Manage <span class="text-yellow-400">Storydesto HQ</span></h2>
        <p class="text-gray-400 text-[10px] uppercase tracking-widest mt-1 opacity-50 font-bold">Table: storydesto_content</p>
    </div>

    <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-4 pb-48 md:pb-10 relative">
      <div v-if="isLoading" class="py-20 text-center"><i class="ph ph-spinner-gap text-4xl animate-spin text-yellow-400"></i></div>
      
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
                <button @click="togglePin(item)" class="active:scale-75 transition-transform"><i :class="item.is_pinned ? 'ph-fill ph-push-pin text-xl text-yellow-400' : 'ph ph-push-pin text-xl text-gray-700'"></i></button>
              </td>
              <td class="p-5">
                <div class="font-bold text-white text-base">{{ item.title || 'Untitled' }}</div>
                <div class="text-[11px] text-gray-500 mt-0.5">{{ item.subtitle || '-' }}</div>
              </td>
              <td class="p-5 text-center"><span class="px-3 py-1 rounded bg-white/5 text-[9px] uppercase border border-white/10 font-black text-yellow-400">{{ item.type }}</span></td>
              <td class="p-5 text-center"><span class="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full font-black text-xs">{{ item.sort_order }}</span></td>
              <td class="p-5 pr-8 text-right">
                <button @click="openEditModal(item)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black mr-2 transition cursor-pointer"><i class="ph ph-pencil-simple text-lg"></i></button>
                <button @click="deleteItem(item.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition cursor-pointer"><i class="ph ph-trash text-lg"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col md:flex-row items-end md:items-center gap-4 z-[90]">
        <button @click="openAddModal" class="w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"><i class="ph-fill ph-plus text-3xl md:text-xl md:mr-2"></i><span class="hidden md:inline">Add Content</span></button>
    </div>

    <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10" @click.self="closeModal">
            <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
                <div class="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem] shrink-0">
                    <h2 class="text-xl md:text-2xl font-black italic text-white">{{ isEditing ? 'Edit Storydesto' : 'New Storydesto' }}</h2>
                    <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 text-gray-400 hover:text-white flex justify-center items-center cursor-pointer"><i class="ph ph-x text-xl"></i></button>
                </div>
                
                <div class="p-6 md:p-8 overflow-y-auto flex-1">
                    <form class="space-y-8" @submit.prevent>
                        <div class="grid grid-cols-3 gap-3">
                            <label v-for="t in ['portfolio', 'testimonial', 'hero']" :key="t" class="cursor-pointer">
                                <input type="radio" :value="t" v-model="form.type" class="hidden">
                                <div :class="['text-center py-4 rounded-xl border font-black uppercase text-[10px] tracking-widest transition-all', form.type === t ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-[#09090b] text-gray-500 border-white/10 hover:border-white/30']">{{ t }}</div>
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label class="text-[10px] text-gray-500 font-black uppercase mb-2 block">Title / Name</label><input v-model="form.title" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400 transition"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase mb-2 block">Sort Order</label><input v-model="form.sort_order" type="number" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400"></div>
                            <div><label class="text-[10px] text-gray-500 font-black uppercase mb-2 block">Subtitle / Campus</label><input v-model="form.subtitle" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400"></div>
                        </div>

                        <div class="border-t border-white/5 pt-6">
                            <div v-if="form.type === 'portfolio'">
                                <label class="text-[10px] text-gray-500 font-black uppercase mb-3 block">Upload Gallery Images</label>
                                <input type="file" multiple accept="image/*" @change="handleFileSelect" class="text-xs file:bg-white/5 file:text-white file:px-5 file:py-3 file:rounded-xl file:border-0 cursor-pointer w-full">
                            </div>
                            <div v-if="form.type === 'testimonial'"><label class="text-[10px] text-gray-500 font-black uppercase mb-3 block">Message</label><textarea v-model="form.description" class="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400" rows="3"></textarea></div>
                            <div v-if="form.type === 'hero'">
                                <label class="text-[10px] text-gray-500 font-black uppercase mb-3 block">Upload Video Hero (MP4/WebM)</label>
                                <input type="file" accept="video/*" @change="handleVideoSelect" class="text-xs file:bg-white/5 file:text-white file:px-5 file:py-3 file:rounded-xl file:border-0 cursor-pointer w-full">
                                <p v-if="form.media_url && !selectedVideo" class="mt-3 text-[11px] text-gray-500 truncate bg-white/5 p-3 rounded-xl border border-white/5">Current: <a :href="form.media_url" target="_blank" class="text-yellow-400 underline ml-1 font-bold">View File</a></p>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="p-6 md:p-8 border-t border-white/5 bg-[#18181b]/50 rounded-b-[2.5rem] shrink-0">
                    <div v-if="isSaving" class="mb-4">
                        <div class="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2"><span>Uploading...</span><span>{{ uploadProgress }}%</span></div>
                        <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden"><div class="bg-yellow-400 h-full transition-all" :style="{ width: uploadProgress + '%' }"></div></div>
                    </div>
                    <div class="flex justify-end gap-4">
                        <button @click="closeModal" :disabled="isSaving" class="text-gray-500 font-black text-[10px] uppercase px-8">Cancel</button>
                        <button @click="saveItem" :disabled="isSaving" class="bg-yellow-400 text-black px-12 py-4 rounded-[1.5rem] font-black text-[10px] uppercase shadow-lg disabled:opacity-50 flex items-center gap-2"><i v-if="isSaving" class="ph ph-spinner-gap animate-spin"></i> Save</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; import { supabase } from '../../supabase'; import Swal from 'sweetalert2';
const items = ref([]); const isLoading = ref(true); const isSaving = ref(false); const showModal = ref(false); const isEditing = ref(false); const editId = ref(null); const selectedFiles = ref([]); const selectedVideo = ref(null); const uploadProgress = ref(0);
const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: '#facc15', borderRadius: '32px' };
const form = ref({ type: 'portfolio', title: '', subtitle: '', description: '', media_url: '', images: [], is_pinned: true, sort_order: 0 });

const fetchItems = async () => { isLoading.value = true; const { data } = await supabase.from('storydesto_content').select('*').order('sort_order', {ascending: true}); items.value = data || []; isLoading.value = false; };
onMounted(() => fetchItems());
const togglePin = async (item) => { item.is_pinned = !item.is_pinned; await supabase.from('storydesto_content').update({ is_pinned: item.is_pinned }).eq('id', item.id); };
const openAddModal = () => { isEditing.value = false; editId.value = null; selectedFiles.value = []; selectedVideo.value = null; uploadProgress.value = 0; form.value = { type: 'portfolio', title: '', subtitle: '', description: '', media_url: '', images: [], is_pinned: true, sort_order: 0 }; showModal.value = true; };
const openEditModal = (p) => { isEditing.value = true; editId.value = p.id; selectedFiles.value = []; selectedVideo.value = null; uploadProgress.value = 0; form.value = { ...p, is_pinned: Boolean(p.is_pinned) }; showModal.value = true; };
const closeModal = () => { if(!isSaving.value) showModal.value = false; };
const handleFileSelect = (e) => selectedFiles.value = Array.from(e.target.files);
const handleVideoSelect = (e) => { if (e.target.files?.length > 0) selectedVideo.value = e.target.files[0]; };

const saveItem = async () => {
    isSaving.value = true; let progress = 0; const timer = setInterval(() => { if(progress < 90) progress += 5; uploadProgress.value = progress; }, 400);
    try {
        let upUrls = isEditing.value ? [...(form.value.images||[])] : [];
        let finalMediaUrl = form.value.media_url;
        if (form.value.type === 'portfolio' && selectedFiles.value.length > 0) {
            upUrls = [];
            for (const file of selectedFiles.value) {
                const name = `storydesto/images/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
                await supabase.storage.from('portfolio-images').upload(name, file);
                upUrls.push(supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl);
            }
        }
        if (form.value.type === 'hero' && selectedVideo.value) {
            const name = `storydesto/videos/${Date.now()}-${selectedVideo.value.name.replace(/\s+/g,'-')}`;
            const { error: upErr } = await supabase.storage.from('portfolio-images').upload(name, selectedVideo.value);
            if (upErr) throw upErr;
            finalMediaUrl = supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl;
        }
        clearInterval(timer); uploadProgress.value = 100;
        const payload = { ...form.value, images: upUrls, media_url: finalMediaUrl, sort_order: parseInt(form.value.sort_order)||0 };
        if (isEditing.value) await supabase.from('storydesto_content').update(payload).eq('id', editId.value);
        else await supabase.from('storydesto_content').insert([payload]);
        closeModal(); fetchItems(); Swal.fire({...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false});
    } catch (e) { clearInterval(timer); uploadProgress.value = 0; Swal.fire({...swalConfig, icon: 'error', title: 'Failed!', text: e.message}); } finally { isSaving.value = false; }
};
const deleteItem = async (id) => { const res = await Swal.fire({...swalConfig, title: 'Hapus?', icon: 'warning', showCancelButton: true}); if(res.isConfirmed) { await supabase.from('storydesto_content').delete().eq('id', id); fetchItems(); } };
</script>
