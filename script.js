// Data calonimport { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 🔧 Ganti config ini dengan punyamu dari Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "pemilu-osis.firebaseapp.com",
  databaseURL: "https://pemilu-osis-default-rtdb.firebaseio.com",
  projectId: "pemilu-osis",
  storageBucket: "pemilu-osis.appspot.com",
  messagingSenderId: "123456789",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Data Kandidat
const candidates = [
  {id:1, name:"WAHYU HADITYA", img:"calon1.jpg", visi:"Menjadikan OSIS lebih aktif dan kreatif.", misi:"Meningkatkan kegiatan ekstrakurikuler, mempererat solidaritas siswa."},
  {id:2, name:"REHAN SABPUTRA", img:"calon2.jpg", visi:"OSIS sebagai wadah inovasi siswa.", misi:"Mengembangkan program berbasis teknologi & lingkungan."},
  {id:3, name:"AISYAH RAHMI FITRI", img:"calon3.jpg", visi:"Membangun budaya disiplin.", misi:"Menumbuhkan sikap tanggung jawab & kepemimpinan."},
  {id:4, name:"TYA SALSABILA", img:"calon4.jpg", visi:"OSIS inklusif untuk semua siswa.", misi:"Memberikan ruang untuk semua bakat tanpa diskriminasi."},
  {id:5, name:"ARIEL PUTRA RAMADHAN", img:"calon5.jpg", visi:"OSIS yang peduli sosial.", misi:"Meningkatkan program bakti sosial & kepedulian lingkungan."},
  {id:6, name:"DEVI PIRDIANITA", img:"calon6.jpg", visi:"OSIS modern berbasis digital.", misi:"Membuat sistem informasi kegiatan OSIS online."},
  {id:7, name:"RAISHA FATIHA SABRINA", img:"calon7.jpg", visi:"Menjadi teladan siswa berprestasi.", misi:"Fokus pada peningkatan akademik & lomba sekolah."},
];

// Render Kandidat
const container = document.getElementById("candidatesContainer");
candidates.forEach(c => {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";
  col.innerHTML = `
    <div class="card candidate-card h-100">
      <img src="${c.img}" class="card-img-top" alt="${c.name}" onclick="showVisiMisi(${c.id})">
      <div class="card-body text-center">
        <h5 class="card-title">${c.name}</h5>
        <button class="btn btn-success" onclick="voteCandidate(${c.id})">Vote</button>
        <p class="mt-2">Suara: <span id="vote-${c.id}" class="vote-count">0</span></p>
      </div>
    </div>
  `;
  container.appendChild(col);
});

// Voting
window.voteCandidate = function(candidateId) {
  if (localStorage.getItem("hasVoted")) {
    alert("Kamu sudah memberikan suara!");
    return;
  }
  const voteRef = ref(db, 'votes/' + candidateId);
  get(voteRef).then(snapshot => {
    let currentVotes = snapshot.exists() ? snapshot.val() : 0;
    set(voteRef, currentVotes + 1);
    localStorage.setItem("hasVoted", "true");
  });
};

// Show Visi Misi
window.showVisiMisi = function(id) {
  const candidate = candidates.find(c => c.id === id);
  document.getElementById("modalTitle").textContent = candidate.name;
  document.getElementById("modalVisi").textContent = candidate.visi;
  document.getElementById("modalMisi").textContent = candidate.misi;
  new bootstrap.Modal(document.getElementById("visiMisiModal")).show();
};

// Leaderboard Live
const votesRef = ref(db, 'votes/');
onValue(votesRef, snapshot => {
  const data = snapshot.val() || {};
  candidates.forEach(c => {
    document.getElementById(`vote-${c.id}`).textContent = data[c.id] || 0;
  });

  // Sort leaderboard
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


