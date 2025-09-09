// Data calon
const candidates = [
  {id:1, name:"WAHYU HADITYA", img:"img/calon1.jpg", visi:"Menjadikan OSIS lebih aktif dan kreatif.", misi:"Meningkatkan kegiatan ekstrakurikuler, mempererat solidaritas siswa."},
  {id:2, name:"REHAN SABPUTRA", img:"img/calon2.jpg", visi:"OSIS sebagai wadah inovasi siswa.", misi:"Mengembangkan program berbasis teknologi & lingkungan."},
  {id:3, name:"AISYAH RAHMI FITRI", img:"img/calon3.jpg", visi:"Membangun budaya disiplin.", misi:"Menumbuhkan sikap tanggung jawab & kepemimpinan."},
  {id:4, name:"TYA SALSABILA", img:"img/calon4.jpg", visi:"OSIS inklusif untuk semua siswa.", misi:"Memberikan ruang untuk semua bakat tanpa diskriminasi."},
  {id:5, name:"ARIEL PUTRA RAMADHAN", img:"img/calon5.jpg", visi:"OSIS yang peduli sosial.", misi:"Meningkatkan program bakti sosial & kepedulian lingkungan."},
  {id:6, name:"DEVI PIRDIANITA", img:"img/calon6.jpg", visi:"OSIS modern berbasis digital.", misi:"Membuat sistem informasi kegiatan OSIS online."},
  {id:7, name:"RAISHA FATIHA SABRINA", img:"img/calon7.jpg", visi:"Menjadi teladan siswa berprestasi.", misi:"Fokus pada peningkatan akademik & lomba sekolah."},
];

const votes = Array(candidates.length).fill(0);
let hasVoted = false;

const candidateList = document.getElementById("candidateList");
const modal = new bootstrap.Modal(document.getElementById('visiMisiModal'));

// Render cards
candidates.forEach((c, index) => {
  const col = document.createElement("div");
  col.className = "col";
  col.innerHTML = `
    <div class="card candidate-card h-100 shadow-sm">
      <img src="${c.img}" class="card-img-top" alt="${c.name}" onclick="showVisiMisi(${index})" style="cursor:pointer">
      <div class="card-body text-center">
        <h5 class="card-title">${c.name}</h5>
        <p>Suara: <span class="vote-count" id="vote-${index}">${votes[index]}</span></p>
        <button class="btn btn-outline-primary" onclick="vote(${index})">Pilih</button>
      </div>
    </div>
  `;
  candidateList.appendChild(col);
});

// Show visi misi modal
function showVisiMisi(index) {
  document.getElementById("candidateName").innerText = candidates[index].name;
  document.getElementById("candidateVisi").innerText = "Visi: " + candidates[index].visi;
  document.getElementById("candidateMisi").innerText = "Misi: " + candidates[index].misi;
  modal.show();
}

// Update leaderboard
function updateLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboardBody");
  leaderboardBody.innerHTML = "";
  const ranking = candidates.map((c, i) => ({ name: c.name, votes: votes[i] }));
  ranking.sort((a, b) => b.votes - a.votes);
  ranking.forEach((r, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td>${r.name}</td>
      <td>${r.votes}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}
updateLeaderboard();

// Voting function
function vote(index) {
  if (hasVoted) {
    Swal.fire("Oops!", "Kamu sudah memilih! Setiap orang hanya boleh 1 kali voting.", "warning");
    return;
  }
  votes[index]++;
  document.getElementById(`vote-${index}`).innerText = votes[index];
  hasVoted = true;
  Swal.fire("Terima Kasih!", "Suaramu sudah direkam!", "success");
  updateLeaderboard();
}
