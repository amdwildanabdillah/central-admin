<template>
  <div class="flex-1 flex flex-col h-full relative">
    <div class="p-6 md:p-10 pb-4 z-20 text-left border-b border-white/5 bg-[#09090b]"><h2 class="text-2xl md:text-4xl font-bold tracking-tighter">Manage <span class="text-purple-400">Personal Porto</span></h2></div>
    <main class="flex-1 overflow-y-auto p-6 md:p-10 pt-4 pb-48 md:pb-10"><div v-if="isLoading" class="py-20 text-center"><i class="ph ph-spinner-gap text-4xl animate-spin text-purple-400"></i></div>
      <div v-else class="bg-[#111113] border border-white/10 rounded-3xl overflow-x-auto shadow-2xl">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="sticky top-0 bg-[#111113] z-20 border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-widest bg-white/5">
            <tr><th class="p-5 text-center">Pin</th><th class="p-5 font-bold">Title</th><th class="p-5 text-center">Type</th><th class="p-5 text-center">Order</th><th class="p-5 text-right">Actions</th></tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="item in items" :key="item.id" class="border-b border-white/5 hover:bg-white/[0.02]">
              <td class="p-5 text-center"><button @click="togglePin(item)"><i :class="item.isPinned ? 'ph-fill ph-push-pin text-xl text-purple-400' : 'ph ph-push-pin text-xl text-gray-700'"></i></button></td>
              <td class="p-5"><div class="font-bold text-white">{{ item.title }}</div></td>
              <td class="p-5 text-center"><span class="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold uppercase text-purple-400 border border-white/5">{{ item.project_type }}</span></td>
              <td class="p-5 text-center"><span class="bg-purple-400/10 text-purple-400 px-3 py-1 rounded-full font-black text-xs">{{ item.sort_order }}</span></td>
              <td class="p-5 text-right"><button @click="openEditModal(item)" class="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black mr-2"><i class="ph ph-pencil-simple text-lg"></i></button><button @click="deleteItem(item.id)" class="p-2.5 rounded-xl bg-white/5 hover:bg-red-500"><i class="ph ph-trash text-lg"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="fixed bottom-24 right-6 md:bottom-10 md:right-10 flex flex-col md:flex-row items-end md:items-center gap-4 z-[90]">
        <div class="flex md:hidden gap-3 mb-2">
            <button @click="seedData" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-gray-400 flex justify-center items-center shadow-xl"><i class="ph ph-database text-xl"></i></button>
            <a href="https://portfoliowildan.my.id" target="_blank" class="w-12 h-12 rounded-full bg-[#111113] border border-white/20 text-white flex justify-center items-center shadow-xl"><i class="ph ph-arrow-square-out text-xl"></i></a>
        </div>
        <button @click="seedData" class="hidden md:block px-6 py-3.5 bg-[#111113] border border-white/20 text-gray-400 rounded-2xl font-bold text-xs uppercase hover:text-white transition">Sync Data</button>
        <a href="https://portfoliowildan.my.id" target="_blank" class="hidden md:flex items-center gap-2 px-6 py-3.5 bg-[#111113] border border-white/20 text-white rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition">Live <i class="ph ph-arrow-square-out"></i></a>
        <button @click="openAddModal" class="w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-2xl bg-purple-400 text-black flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(192,132,252,0.3)] hover:scale-105 active:scale-95 transition-all"><i class="ph-fill ph-plus text-3xl md:text-xl md:mr-2"></i><span class="hidden md:inline">Add</span></button>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
      <div class="bg-[#111113] border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl my-8 flex flex-col max-h-[90vh]">
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 rounded-t-[2.5rem]"><h2 class="text-2xl font-black italic">{{ isEditing ? 'Edit Porto' : 'New Porto' }}</h2><button @click="closeModal" class="w-10 h-10 rounded-full bg-white/5 text-gray-400 hover:text-white"><i class="ph ph-x"></i></button></div>
        <div class="p-8 overflow-y-auto flex-1">
          <form class="space-y-6">
            <div @click="form.isPinned = !form.isPinned" :class="['flex justify-between p-6 rounded-2xl border cursor-pointer', form.isPinned ? 'bg-purple-400/10 border-purple-400/40 text-purple-400' : 'bg-white/5 border-white/10 text-gray-500']">
              <span class="font-black uppercase text-xs"><i class="ph ph-push-pin mr-2"></i> Pin Project</span><div :class="['w-10 h-6 rounded-full p-1', form.isPinned?'bg-purple-400':'bg-gray-700']"><div :class="['w-4 h-4 bg-white rounded-full transition-transform', form.isPinned?'translate-x-4':'translate-x-0']"></div></div>
            </div>
            <div class="grid grid-cols-3 gap-4"><label v-for="t in ['dev','photo','cinema']" :key="t" class="cursor-pointer"><input type="radio" :value="t" v-model="form.project_type" class="hidden"><div :class="['text-center py-3 rounded-xl border font-black uppercase text-[10px]', form.project_type===t?'bg-purple-400 text-black':'bg-[#09090b] text-gray-500']">{{t}}</div></label></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-[10px] text-gray-500 font-black uppercase">Title</label><input v-model="form.title" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
              <div><label class="text-[10px] text-gray-500 font-black uppercase">Sort Order</label><input v-model="form.sort_order" type="number" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-[10px] text-gray-500 font-black uppercase">{{ form.project_type === 'cinema' ? 'Platform' : 'Client/Category' }}</label><input v-model="form.client" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
              <div><label class="text-[10px] text-gray-500 font-black uppercase">{{ form.project_type === 'cinema' ? 'Video ID' : 'Live URL' }}</label><input v-model="form.link" class="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-white"></div>
            </div>
            <div v-if="form.project_type !== 'cinema'"><label class="text-[10px] text-gray-500 font-black uppercase block mb-2">Upload Images</label><input type="file" multiple @change="handleFileSelect" class="text-xs file:bg-white/5 file:text-white file:px-4 file:py-2 file:rounded-xl file:border-0 text-gray-400"></div>
          </form>
        </div>
        <div class="p-8 border-t border-white/5 bg-[#18181b]/50 flex justify-end gap-4"><button @click="closeModal" class="text-gray-500 font-black text-xs uppercase px-6">Cancel</button><button @click="saveItem" class="bg-purple-400 text-black px-10 py-3 rounded-2xl font-black text-xs uppercase">Save</button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; import { supabase } from '../../supabase'; import Swal from 'sweetalert2';
const items = ref([]); const isLoading = ref(true); const isSaving = ref(false); const showModal = ref(false); const isEditing = ref(false); const editId = ref(null); const selectedFiles = ref([]);
const swalConfig = { background: '#111113', color: '#fff', confirmButtonColor: '#c084fc', borderRadius: '24px' };
const form = ref({ project_type: 'dev', title: '', client: '', link: '', isPinned: false, images: [], sort_order: 0 });

const fetchItems = async () => { isLoading.value = true; const { data } = await supabase.from('personal_works').select('*').order('sort_order', {ascending: true}).order('created_at', { ascending: false }); items.value = data; isLoading.value = false; };
onMounted(() => fetchItems());

const togglePin = async (item) => { item.isPinned = !item.isPinned; await supabase.from('personal_works').update({ isPinned: item.isPinned }).eq('id', item.id); };
const openAddModal = () => { isEditing.value = false; editId.value = null; selectedFiles.value = []; form.value = { project_type: 'dev', title: '', client: '', link: '', isPinned: false, images: [], sort_order: 0 }; showModal.value = true; };
const openEditModal = (p) => { isEditing.value = true; editId.value = p.id; form.value = { ...p, isPinned: Boolean(p.isPinned) }; showModal.value = true; };
const closeModal = () => showModal.value = false; const handleFileSelect = (e) => selectedFiles.value = Array.from(e.target.files);

const saveItem = async () => {
    isSaving.value = true; let upUrls = isEditing.value ? [...(form.value.images||[])] : [];
    if (selectedFiles.value.length > 0) {
        upUrls = [];
        for (const file of selectedFiles.value) {
            const name = `personal/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
            await supabase.storage.from('portfolio-images').upload(name, file);
            upUrls.push(supabase.storage.from('portfolio-images').getPublicUrl(name).data.publicUrl);
        }
    }
    const payload = { ...form.value, images: upUrls, isPinned: Boolean(form.value.isPinned), sort_order: parseInt(form.value.sort_order)||0 };
    if (isEditing.value) await supabase.from('personal_works').update(payload).eq('id', editId.value);
    else await supabase.from('personal_works').insert([payload]);
    closeModal(); fetchItems(); Swal.fire({...swalConfig, icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false});
    isSaving.value = false;
};
const deleteItem = async (id) => { const res = await Swal.fire({...swalConfig, title: 'Hapus?', icon: 'warning', showCancelButton: true}); if(res.isConfirmed) { await supabase.from('personal_works').delete().eq('id', id); fetchItems(); } };

const seedData = async () => {
    const res = await Swal.fire({...swalConfig, title: 'Seed Porto?', showCancelButton: true}); if(!res.isConfirmed) return;
    isLoading.value = true;
    const data = [
        { project_type: 'cinema', title: 'Cinematic Vlog', link: 'gDOdVnRsZ0E', isPinned: true, sort_order: 1 },
        { project_type: 'cinema', title: 'Short Movie DUA SISI', link: 'vDXaoQyCoAs', isPinned: true, sort_order: 2 },
        { project_type: 'cinema', title: 'After Movie HM SAMPOERNA', link: '1B131fvG1z4', isPinned: false, sort_order: 3 },
        { project_type: 'cinema', title: 'Short Movie UPEKSHA', link: 'fumJ_jLM7KM', isPinned: false, sort_order: 4 },
        { project_type: 'cinema', title: 'Profil Desa Wisata', link: 'pBeJKxubs6M', isPinned: false, sort_order: 5 },
        { project_type: 'cinema', title: 'After Movie KKN UINSA', link: 'wbE4NyEjDTc', isPinned: true, sort_order: 6 },
        { project_type: 'dev', title: 'Storydesto', link: 'https://portfolio-storydesto.netlify.app/', images: ['/coverdesto.png'], isPinned: true, sort_order: 7 },
        { project_type: 'dev', title: 'Personal Portfolio', link: 'https://portfoliowildan.my.id/', images: ['/webwildan.png'], isPinned: true, sort_order: 8 },
        { project_type: 'dev', title: "D'Production Surabaya", link: 'https://dproductionsub.netlify.app/', images: ['/dproduction.png'], isPinned: false, sort_order: 9 },
        { project_type: 'dev', title: 'Invitation Kit', link: 'https://wedding-invitation-wildan.vercel.app/', images: ['/wedinvite.png'], isPinned: false, sort_order: 10 },
        { project_type: 'dev', title: 'Vixel Creative', link: 'https://vixelcreative.my.id/', images: ['/vixel.png'], isPinned: true, sort_order: 11 },
        { project_type: 'dev', title: 'WildanInvites HQ', images: ['/cashflowhq.png'], isPinned: false, sort_order: 12 },
        { project_type: 'dev', title: 'Puskewan Mobile', images: ['/puskeswan/1.png'], isPinned: true, sort_order: 13 },
        { project_type: 'dev', title: 'Bio Link Hub', link: 'https://bio.portfoliowildan.my.id', images: ['/biolink.png'], isPinned: false, sort_order: 14 },
        { project_type: 'photo', title: 'Behind the Scene', images: ['/me7.jpg'], isPinned: false, sort_order: 15 },
        { project_type: 'photo', title: 'Wedding Stories', images: ['/wed-cov.jpg'], isPinned: true, sort_order: 16 },
        { project_type: 'photo', title: 'LMLS', images: ['/LMLS-2.jpg'], isPinned: false, sort_order: 17 },
        { project_type: 'photo', title: 'Life Lately', images: ['/livin1.jpg'], isPinned: true, sort_order: 18 },
        { project_type: 'photo', title: 'Sky View', images: ['/urban-cov.jpg'], isPinned: false, sort_order: 19 }
    ];
    await supabase.from('personal_works').insert(data); fetchItems(); Swal.fire({...swalConfig, icon: 'success', title: 'Seed Sukses!', timer: 1500});
};
</script>