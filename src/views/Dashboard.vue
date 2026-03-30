const seedData = async () => {
  if(!confirm(`Import SEMUA data asli ke ${activeTable.value}?`)) return;
  isLoading.value = true;
  let dataToSeed = [];
  
  if(activeMenu.value === 'vixel') {
    // === VIXEL WORKS (6 DATA COMPLETED) ===
    dataToSeed = [
        { title: 'Omah Cempe', category: 'Web Dev • Landing Page', client: 'Omah Cempe Kediri', descShort: 'A modern landing page designed to digitalize livestock investment and Aqiqah services.', stack: ["React", "Tailwind CSS", "Vite", "Google Maps"], images: ['/omahcempe/1.png'], isPinned: true },
        { title: "D'Production Profile", category: 'Web Dev • Corporate', client: "D'Production House", descShort: 'Official landing page for a creative production house.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify'], images: ['/project-dpro.png'], isPinned: true },
        { title: "Personal Portfolio v1", category: 'Web Dev • Personal Branding', client: 'Personal Project', descShort: 'Interactive portfolio featuring a modern Glassmorphism design.', stack: ['React', 'Tailwind CSS', 'Vite', 'Vercel'], images: ['/porto/1.png'], isPinned: true },
        { title: 'Digital Invitation', category: 'Web Dev • Invitation', client: 'Personal', descShort: 'Official website for VIXEL Studio showcasing services and portfolio.', stack: ['Vue.js', 'Tailwind CSS', 'Vite', 'Vercel'], images: ['/invite/1.png'], isPinned: true },
        { title: "Puskeswan Mobile", category: "Android App", client: 'Puskeswan Trenggalek', descShort: "Mobile application for veterinary services management.", stack: ['Flutter', 'Dart', 'Supabase'], images: ['/puskeswan/1.png'], isPinned: false },
        { title: "WildanInvites HQ", category: "Appsheet Development", client: 'WildanInvites Finance', descShort: "Dedicated internal management tool for cashflow tracking.", stack: ['AppSheet','Google Sheet', 'Automation'], images: ['/cashflowhq.png'], isPinned: false }
    ];
  } else {
    // === PERSONAL PORTO (18 DATA COMPLETED) ===
    dataToSeed = [
        // --- 1. CINEMA (6 DATA) ---
        { project_type: 'cinema', title: 'Cinematic Vlog', category: 'After Movie PBAK UINSA 2022', media_type: 'youtube', link: 'gDOdVnRsZ0E', isPinned: true },
        { project_type: 'cinema', title: 'Short Movie', category: 'DUA SISI', media_type: 'youtube', link: 'vDXaoQyCoAs', isPinned: true },
        { project_type: 'cinema', title: 'After Movie', category: 'GASS PT. HM SAMPOERNA', media_type: 'youtube', link: '1B131fvG1z4', isPinned: false },
        { project_type: 'cinema', title: 'Short Movie', category: 'UPEKSHA', media_type: 'youtube', link: 'fumJ_jLM7KM', isPinned: false },
        { project_type: 'cinema', title: 'Profile Video', category: 'Profil Desa Wisata Ngabab', media_type: 'youtube', link: 'pBeJKxubs6M', isPinned: false },
        { project_type: 'cinema', title: 'After Movie', category: 'KKN UINSA 72 2025', media_type: 'link', link: 'wbE4NyEjDTc', isPinned: true },

        // --- 2. DEV (7 DATA) ---
        { project_type: 'dev', title: 'Storydesto', category: 'Marketplace Platform', client: 'Internal Startup', descShort: 'A digital marketplace connecting photography vendors with clients seamlessly.', descLong: 'A comprehensive digital marketplace designed to bridge photography vendors with clients. Features include a Smart Booking System, integrated multi-payment Gateway (Midtrans), real-time vendor availability checking, and a robust Admin Dashboard.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify', 'SEO Optimized'], github: 'https://github.com/amdwildanabdillah/storydesto', link: 'https://portfolio-storydesto.netlify.app/', images: ['/coverdesto.png', '/desto/desto1.png', '/desto/desto2.png', '/desto/desto3.png'], isPinned: true },
        { project_type: 'dev', title: 'Personal Portfolio', category: 'Frontend Development', client: 'Personal Project', descShort: 'Interactive portfolio featuring a modern Glassmorphism design.', descLong: 'An interactive personal portfolio website showcasing projects and skills. Built with Vue.js 3 as a Single Page Application (SPA) for a fast, smooth user experience.', stack: ['Vue.js', 'Element UI', 'Vite', 'Vercel', 'Google Fonts'], link: 'https://portfoliowildan.my.id/', images: ['/webwildan.png'], isPinned: true },
        { project_type: 'dev', title: "D'Production Surabaya", category: 'Company Profile', client: "D'Production House", descShort: 'Official landing page for a creative production house.', descLong: 'Official landing page for a creative production house in Surabaya. Designed to professionally showcase video showreels, detail services packages, and enhance brand credibility.', stack: ['HTML5 Semantic', 'CSS3 Modern', 'Vanilla JS', 'Netlify', 'SEO Optimized'], github: 'https://github.com/amdwildanabdillah/dproductionsub', link: 'https://dproductionsub.netlify.app/', images: ['/dproduction.png'], isPinned: false },
        { project_type: 'dev', title: 'Invitation Kit', category: 'Digital Asset', client: 'Vixel Product', descShort: 'Highly customizable digital invitation template with RSVP.', descLong: 'A productized digital invitation template built for speed and aesthetics. Features smooth entrance animations, integrated Google Forms RSVP.', stack: ['Vue.js', 'HTML', 'Tailwind CSS'], link: 'https://wedding-invitation-wildan.vercel.app/', images: ['/wedinvite.png'], isPinned: false },
        { project_type: 'dev', title: 'Vixel Creative', category: 'Company Profile', client: 'Vixel Creative HQ', descShort: 'Landing page for Web Dev & AppSheet Solution agency.', descLong: 'The official agency landing page for Vixel Creative. It serves as a central hub to showcase our services.', stack: ['Vue.js', 'Vite', 'Tailwind CSS', 'Framer Motion'], link: 'https://vixelcreative.my.id/', images: ['/vixel.png'], isPinned: true },
        { project_type: 'dev', title: 'WildanInvites HQ', category: 'Appsheet Development', client: 'WildanInvites Finance', descShort: 'Dedicated internal management tool for cashflow tracking.', descLong: 'A robust internal tool built purely on AppSheet and Google ecosystem for WildanInvites. It automates cashflow tracking.', stack: ['AppSheet', 'Google Sheet', 'Automation'], images: ['/cashflowhq.png'], isPinned: false },
        { project_type: 'dev', title: 'Puskewan Mobile', category: 'Android App', client: 'Puskeswan Trenggalek', descShort: 'Mobile application for veterinary services management.', descLong: 'A dedicated mobile application designed for Puskeswan Trenggalek to manage veterinary services. It features appointment scheduling, medical record tracking for livestock.', stack: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'Google Sign-In'], images: ['/puskeswan/1.png', '/puskeswan/2.png', '/puskeswan/3.png'], isPinned: true },

        // --- 3. PHOTO (5 DATA) ---
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
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Data Lengkap Berhasil Di-Seed!', showConfirmButton: false, timer: 2000, background: '#111113', color: '#fff' });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Gagal Import', text: e.message, background: '#111113', color: '#fff' });
  } finally {
    isLoading.value = false;
  }
};