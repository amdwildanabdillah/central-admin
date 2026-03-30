<template>
  <div class="flex-1 flex flex-col h-full relative">
    <div class="p-6 md:p-10 pb-4 z-20 text-left border-b border-white/5 bg-[#09090b]"><h2 class="text-2xl md:text-4xl font-bold tracking-tighter">Manage <span class="text-yellow-400">Storydesto HQ</span></h2></div>
    <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-4 pb-48 md:pb-10"><div v-if="isLoading" class="py-20 text-center"><i class="ph ph-spinner-gap text-4xl animate-spin text-yellow-400"></i></div>
      <div v-else class="bg-[#111113] border border-white/10 rounded-3xl overflow-x-auto shadow-2xl">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="sticky top-0 bg-[#111113] z-20 border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest bg-white/5">
            <tr><th class="p-5 text-center">Pin</th><th class="p-5 font-bold">Title</th><th class="p-5 text-center">Type</th><th class="p-5 text-center">Order</th><th class="p-5 text-right">Actions</th></tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="item in items" :key="item.id" class="border-b border-white/5 hover:bg-white/[0.02]">
              <td class="p-5 text-center"><button @click="togglePin(item)"><i :class="item.is_pinned ? 'ph-fill ph-push-pin text-xl text-yellow-400' : 'ph ph-push-pin text-xl text-gray-700'"></i></button></td>
              <td class="p-5"><div class="font-bold text-white">{{ item.title }}</div><div class="text-xs text-gray-500">{{ item.subtitle }}</div></td>
              <td class="p-5 text-center"><span class="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold uppercase text-yellow-400 border border-white/5">{{ item.type }}</span></td>
              <td class="p-5 text-center"><span class="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full font-black text-xs">{{ item.sort_order }}</span></td>
              <td class="p-5 text-right"><button @click="openEditModal(item)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black mr-2"><i class="ph ph-pencil-simple text-lg"></i></button><button @click="deleteItem(item.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500"><i class="ph ph-trash text-lg"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col md:flex-row items-end md:items-center gap-4 z-[90]">
        <div class="flex md:hidden gap-3 mb-2">
            <button @click="seedData" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-gray-400 flex justify-center items-center shadow-xl"><i class="ph ph-database text-xl"></i></button>
            <a href="https://storydesto.my.id" target="_blank" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-white flex justify-center items-center shadow-xl"><i class="ph ph-arrow-square-out text-xl"></i></a>
        </div>
        <button @click="seedData" class="hidden md:block px-6 py-3.5 bg-[#111113] border border-white/20 text-gray-400 rounded-2xl font-bold text-xs uppercase hover:text-white transition">Sync Data</button>
        <a href="https://storydesto.my.id" target="_blank" class="hidden md:flex items-center gap-2 px-6 py-3.5 bg-[#111113] border border-white/20 text-white rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition">Live <i class="ph ph-arrow-square-out"></i></a>
        <button @click="openAddModal" class="w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95 transition-all"><i class="ph-fill ph-plus text-3xl md:text-xl md:mr-2"></i><span class="hidden md:inline">Add</span></button>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
      <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl my-8 flex flex-col max-h-[90vh]">
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem]"><h2 class="text-2xl font-black italic">{{ isEditing ? 'Edit Storydesto' : 'New Storydesto' }}</h2><button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 text-gray-400 hover:text-white"><i class="ph ph-x"></i></button></div>
        <div class="p-8 overflow-y-auto flex-1">
          <form class="space-y-6">
            <div @click="form.is_pinned = !form.is_pinned" :class="['flex justify-between p-6 rounded-2xl border cursor-pointer', form.is_pinned ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-500']">
              <span class="font-black uppercase text-xs"><i class="ph ph-push-pin mr-2"></i> Pin Item</span><div :class="['w-10 h-6 rounded-full p-1', form.is_pinned?'bg-yellow-400':'bg-gray-700']"><div :class="['w-4 h-4 bg-white rounded-full transition-transform', form.is_pinned?'translate-x-4':'translate-x-0']"></div></div>
            </div>
            <div class="grid grid-cols-3 gap-4"><label v-for="t in ['portfolio','testimonial','hero']" :key="t" class="cursor-pointer"><input type="radio" :value="t" v-model="form.type" class="hidden"><div :class="['text-center py-3 rounded-xl border font-black uppercase text-[10px]', form.type===t?'bg-yellow-400 text-black':'bg-[#09090b] text-gray-500']">{{t}}</div></label></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-[10px] text-gray-500 font-black uppercase">Title / Name</label><input v-model="form.title" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
              <div><label class="text-[10px] text-gray-500 font-black uppercase">Sort Order</label><input v-model="form.sort_order" type="number" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
            </div>
            <div v-if="form.type === 'portfolio'"><label class="text-[10px] text-gray-500 font-black uppercase block mb-2">Upload Images</label><input type="file" multiple @change="handleFileSelect" class="text-xs file:bg-white/5 file:text-white file:px-4 file:py-2 file:rounded-xl file:border-0 text-gray-400"></div>
            <div v-if="form.type === 'testimonial'"><label class="text-[10px] text-gray-500 font-black uppercase block mb-2">Pesan Testimoni</label><textarea v-model="form.description" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white" rows="3"></textarea></div>
            <div v-if="form.type === 'hero'"><label class="text-[10px] text-gray-500 font-black uppercase block mb-2">Link Video (MP4/Drive)</label><input v-model="form.media_url" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
          </form>
        </div>
        <div class="p-8 border-t border-white/5 bg-[#18181b]/50 flex justify-end gap-4"><button @click="closeModal" class="text-gray-500 font-black text-xs uppercase px-6">Cancel</button><button @click="saveItem" class="bg-yellow-400 text-black px-10 py-3 rounded-2xl font-black text-xs uppercase">Save</button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; import { supabase } from '../../supabase'; import Swal from 'sweetalert2';
const items = ref([]); const isLoading = ref(true); const isSaving = ref(false); const showModal = ref(false); const isEditing = ref(false); const editId = ref(null); const selectedFiles = ref([]);
const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: '#facc15', borderRadius: '24px' };
const form = ref({ type: 'portfolio', title: '', subtitle: '', description: '', media_url: '', images: [], is_pinned: true, sort_order: 0 });

const fetchItems = async () => { isLoading.value = true; const { data } = await supabase.from('storydesto_content').select('*').order('sort_order', {ascending: true}).order('created_at', { ascending: false }); items.value = data; isLoading.value = false; };
onMounted(() => fetchItems());

const togglePin = async (item) => { item.is_pinned = !item.is_pinned; await supabase.from('storydesto_content').update({ is_pinned: item.is_pinned }).eq('id', item.id); };
const openAddModal = () => { isEditing.value = false; editId.value = null; selectedFiles.value = []; form.value = { type: 'portfolio', title: '', subtitle: '', description: '', media_url: '', images: [], is_pinned: true, sort_order: 0 }; showModal.value = true; };
const openEditModal = (p) => { isEditing.value = true; editId.value = p.id; form.value = { ...p, is_pinned: Boolean(p.is_pinned) }; showModal.value = true; };
const closeModal = () => showModal.value = false; const handleFileSelect = (e) => selectedFiles.value = Array.from(e.target.files);

const saveItem = async () => {
    isSaving.value = true; let upUrls = isEditing.value ? [...(form.value.images||[])] : [];
    if (selectedFiles.value.length > 0) {
        upUrls = [];
        for (const file of selectedFiles.value) {
            const name = `storydesto/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
            await supabase.storage.from('portfolio-images').upload(name, file);
            upUrls.push(supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl);
        }
    }
    const payload = { ...form.value, images: upUrls, is_pinned: Boolean(form.value.is_pinned), sort_order: parseInt(form.value.sort_order)||0 };
    if (isEditing.value) await supabase.from('storydesto_content').update(payload).eq('id', editId.value);
    else await supabase.from('storydesto_content').insert([payload]);
    closeModal(); fetchItems(); Swal.fire({...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false});
    isSaving.value = false;
};
const deleteItem = async (id) => { const res = await Swal.fire({...swalConfig, title: 'Hapus?', icon: 'warning', showCancelButton: true}); if(res.isConfirmed) { await supabase.from('storydesto_content').delete().eq('id', id); fetchItems(); } };

const seedData = async () => {
    const res = await Swal.fire({...swalConfig, title: 'Seed Storydesto?', showCancelButton: true}); 
    if(!res.isConfirmed) return;
    
    isLoading.value = true;
    const data = [
        // HERO
        { type: 'hero', media_url: '/assets/hero/hero.mp4', is_pinned: true, sort_order: 1 },
        
        // PORTFOLIO (FULL IMAGES)
        { 
            type: 'portfolio', title: 'Syahrulabdn', subtitle: 'Universitas Negeri Surabaya', 
            images: ['/assets/syahdrulabdn/1.jpg', '/assets/syahdrulabdn/2.jpg', '/assets/syahdrulabdn/3.jpg', '/assets/syahdrulabdn/4.jpg', '/assets/syahdrulabdn/5.jpg', '/assets/syahdrulabdn/6.jpg'], 
            is_pinned: true, sort_order: 2 
        },
        { 
            type: 'portfolio', title: 'ikaynl', subtitle: 'Universitas Airlangga', 
            images: ['/assets/ikaynl/1.jpg', '/assets/ikaynl/2.jpg', '/assets/ikaynl/3.jpg', '/assets/ikaynl/4.jpg', '/assets/ikaynl/5.jpg'], 
            is_pinned: true, sort_order: 3 
        },
        { 
            type: 'portfolio', title: 'Ade Happy', subtitle: 'Universitas Negeri Sunan Ampel Surabaya', 
            images: ['/assets/happy/1.jpg', '/assets/happy/2.jpg', '/assets/happy/3.jpg', '/assets/happy/4.jpg', '/assets/happy/5.jpg'], 
            is_pinned: true, sort_order: 4 
        },
        { 
            type: 'portfolio', title: 'Group Session', subtitle: 'Magister Studi Islam', 
            images: ['/assets/group-session/1.jpg', '/assets/group-session/2.jpg', '/assets/group-session/3.jpg', '/assets/group-session/4.jpg', '/assets/group-session/5.jpg', '/assets/group-session/6.jpg'], 
            is_pinned: true, sort_order: 5 
        },

        // TESTIMONIAL (FULL TEXT)
        { 
            type: 'testimonial', title: 'Ikaynl', subtitle: 'UNAIR 2024', 
            description: 'Sumpah suka banget sama hasilnya ! Awalnya kaku banget ga bisa gaya, tapi diarahin sama fotografernya jadi luwes. Makasih Storydesto!', 
            is_pinned: true, sort_order: 6 
        },
        { 
            type: 'testimonial', title: 'Syahrulabdn', subtitle: 'UNESA 2025', 
            description: 'Tone warnanya cakep parah, warm aesthetic gitu. Mas-nya juga asik diajak ngobrol jadi sesi fotonya ga tegang. Recommended!', 
            is_pinned: true, sort_order: 7 
        },
        { 
            type: 'testimonial', title: 'Tim Hore', subtitle: 'UINSA 2025', 
            description: 'Foto grup sekelas jadi rusuh tapi seru banget! Hasilnya tajem, ga ada yang blur. File-nya juga cepet dikirimnya. Mantap!', 
            is_pinned: true, sort_order: 8 
        }
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