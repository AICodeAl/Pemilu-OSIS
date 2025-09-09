// ==================== IMPORT FIREBASE ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getDatabase, ref, get, set, onValue, onDisconnect 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ==================== KONFIGURASI FIREBASE ====================
const firebaseConfig = {
  apiKey: "AIzaSyCCYfAGsELjM6bFIO-fFE1YOTfT9uLWETg",
  authDomain: "pemilu-osis-1a131.firebaseapp.com",
  databaseURL: "https://pemilu-osis-1a131-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pemilu-osis-1a131",
  storageBucket: "pemilu-osis-1a131.firebasestorage.app",
  messagingSenderId: "247452424893",
  appId: "1:247452424893:web:ee6ed5b995a48f3d3a35d4",
  measurementId: "G-4YE8K3402N"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

// ==================== PRESENCE (JUMLAH USER ONLINE) ====================
signInAnonymously(auth).catch((error) => {
  console.error("Auth error:", error);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(db, "onlineUsers/" + uid);

    // Gunakan koneksi bawaan Firebase
    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(userRef, true);              // tandai online
        onDisconnect(userRef).remove();  // hapus saat disconnect
      }
    });

    // Hapus data saat tab/browser ditutup
    window.addEventListener("beforeunload", () => {
      set(userRef, null);
    });
  }
});

// Hitung user online
const onlineRef = ref(db, "onlineUsers/");
onValue(onlineRef, (snapshot) => {
  const onlineUsers = snapshot.val() || {};
  const count = Object.keys(onlineUsers).length;
  document.getElementById("onlineCount").textContent = count;
});

// ==================== DATA KANDIDAT ====================
const candidates = [
  {id:"1", name:"WAHYU HADITYA", img:"img/calon1.jpg", visi:"Menjadikan OSIS lebih aktif dan kreatif.", misi:"Meningkatkan kegiatan ekstrakurikuler, mempererat solidaritas siswa."},
  {id:"2", name:"REHAN SABPUTRA", img:"img/calon2.jpg", visi:"OSIS sebagai wadah inovasi siswa.", misi:"Mengembangkan program berbasis teknologi & lingkungan."},
  {id:"3", name:"AISYAH RAHMI FITRI", img:"img/calon3.jpg", visi:"Membangun budaya disiplin.", misi:"Menumbuhkan sikap tanggung jawab & kepemimpinan."},
  {id:"4", name:"TYA SALSABILA", img:"img/calon4.jpg", visi:"OSIS inklusif untuk semua siswa.", misi:"Memberikan ruang untuk semua bakat tanpa diskriminasi."},
  {id:"5", name:"ARIEL PUTRA RAMADHAN", img:"img/calon5.jpg", visi:"OSIS yang peduli sosial.", misi:"Meningkatkan program bakti sosial & kepedulian lingkungan."},
  {id:"6", name:"DEVI PIRDIANITA", img:"img/calon6.jpg", visi:"OSIS modern berbasis digital.", misi:"Membuat sistem informasi kegiatan OSIS online."},
  {id:"7", name:"RAISHA FATIHA SABRINA", img:"img/calon7.jpg", visi:"Menjadi teladan siswa berprestasi.", misi:"Fokus pada peningkatan akademik & lomba sekolah."},
];

// Render kandidat
const candidateList = document.getElementById("candidateList");
candidates.forEach(c => {
  const col = document.createElement("div");
  col.className = "col";
  col.innerHTML = `
    <div class="card candidate-card h-100">
      <img src="${c.img}" class="card-img-top" alt="${c.name}" onclick="showVisiMisi('${c.id}')">
      <div class="card-body text-center">
        <h5 class="card-title">${c.name}</h5>
        <button class="btn btn-success" onclick="voteCandidate('${c.id}')">Vote</button>
        <p class="mt-2">Suara: <span id="vote-${c.id}" class="vote-count">0</span></p>
      </div>
    </div>
  `;
  candidateList.appendChild(col);
});

// ==================== VOTING ====================
window.voteCandidate = function(candidateId) {
  if (localStorage.getItem("hasVoted")) {
    Swal.fire("Oops!", "Kamu sudah memberikan suara!", "warning");
    return;
  }
  const voteRef = ref(db, 'votes/' + candidateId);
  get(voteRef).then(snapshot => {
    let currentVotes = snapshot.exists() ? snapshot.val() : 0;
    set(voteRef, currentVotes + 1);
    localStorage.setItem("hasVoted", "true");
    Swal.fire("Terima Kasih!", "Suaramu berhasil disimpan.", "success");
  }).catch(err => {
    console.error("Error saat vote:", err);
    Swal.fire("Error", "Gagal menyimpan suara ke Firebase", "error");
  });
};

// ==================== MODAL VISI MISI ====================
window.showVisiMisi = function(id) {
  const candidate = candidates.find(c => c.id === id);
  document.getElementById("candidateName").textContent = candidate.name;
  document.getElementById("candidateVisi").textContent = "Visi: " + candidate.visi;
  document.getElementById("candidateMisi").textContent = "Misi: " + candidate.misi;
  new bootstrap.Modal(document.getElementById("visiMisiModal")).show();
};

// ==================== LEADERBOARD LIVE ====================
const votesRef = ref(db, 'votes/');
onValue(votesRef, snapshot => {
  const data = snapshot.val() || {};
  candidates.forEach(c => {
    document.getElementById(`vote-${c.id}`).textContent = data[c.id] || 0;
  });

  let sorted = candidates.map(c => ({...c, votes: data[c.id] || 0}))
                         .sort((a,b) => b.votes - a.votes);

  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = "";
  sorted.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${c.name}</td>
        <td>${c.votes}</td>
      </tr>
    `;
  });
});

