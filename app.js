// CONFIGURACIÓN GLOBAL
const API_URL = "https://script.google.com/macros/s/AKfycbwfeq_wGQhlP1P8OeiHwHNcRiHYdIXB4nHdxUUvcJwR8UTYNrRJZGJ9giiyt7cuJnN2/exec";

// Estado de la aplicación
let appState = {
  isSleeping: false,
  sleepStartTime: null,
  lastSleepEndTime: new Date(),
  timerInterval: null,
  wakeInterval: null,
  logs: [],
  growth: []
};

// Instancias globales de gráficos para destrucción/redibujado limpio
let chartSleepInst = null;
let chartFeedInst = null;
let chartDiaperInst = null;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSleepTracker();
  initTeethMap();
  initModal();
  initGrowthForm();
  loadData();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed:', err));
  }
});

// Auto-sincronización en tiempo real al reenfocar la pantalla y polling periódico
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    loadData();
  }
});

setInterval(loadData, 60000); // Recarga automática cada 60 segundos

// Navegación por pestañas
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
      if(tab.dataset.tab === 'tab-stats') renderCharts();
    });
  });
}

// Lógica de Sueño y Wake Windows
function initSleepTracker() {
  const sleepBtn = document.getElementById("btn-toggle-sleep");
  
  const savedState = localStorage.getItem("leandro_sleep_state");
  if(savedState) {
    const data = JSON.parse(savedState);
    appState.isSleeping = data.isSleeping;
    appState.sleepStartTime = data.sleepStartTime ? new Date(data.sleepStartTime) : null;
    appState.lastSleepEndTime = data.lastSleepEndTime ? new Date(data.lastSleepEndTime) : new Date();
  }

  updateSleepUI();
  startWakeWindowTimer();

  sleepBtn.addEventListener("click", () => {
    appState.isSleeping = !appState.isSleeping;
    const now = new Date();
    
    if(appState.isSleeping) {
      appState.sleepStartTime = now;
    } else {
      const durationMin = Math.round((now - appState.sleepStartTime) / 60000);
      saveRecord({
        categoria: "sleep",
        subtipo: "Siesta/Sueño",
        valor: durationMin,
        unidad: "min",
        fechaInicio: appState.sleepStartTime.toISOString(),
        fechaFin: now.toISOString()
      });
      appState.lastSleepEndTime = now;
      appState.sleepStartTime = null;
    }
    
    saveSleepState();
    updateSleepUI();
  });
}

function saveSleepState() {
  localStorage.setItem("leandro_sleep_state", JSON.stringify({
    isSleeping: appState.isSleeping,
    sleepStartTime: appState.sleepStartTime,
    lastSleepEndTime: appState.lastSleepEndTime
  }));
}

function updateSleepUI() {
  const btn = document.getElementById("btn-toggle-sleep");
  const btnText = document.getElementById("sleep-btn-text");
  
  if(appState.isSleeping) {
    btn.className = "btn btn-sleep-stop";
    btnText.textContent = "Finalizar Sueño";
    if(!appState.timerInterval) {
      appState.timerInterval = setInterval(updateSleepTimerDisplay, 1000);
    }
  } else {
    btn.className = "btn btn-sleep-start";
    btnText.textContent = "Iniciar Sueño";
    clearInterval(appState.timerInterval);
    appState.timerInterval = null;
    document.getElementById("sleep-timer").textContent = "00:00:00";
  }
}

function updateSleepTimerDisplay() {
  if(!appState.sleepStartTime) return;
  const diffSec = Math.floor((new Date() - appState.sleepStartTime) / 1000);
  const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
  const secs = String(diffSec % 60).padStart(2, '0');
  document.getElementById("sleep-timer").textContent = `${hrs}:${mins}:${secs}`;
}

function startWakeWindowTimer() {
  setInterval(() => {
    if(appState.isSleeping) {
      document.getElementById("wake-window-badge").textContent = "Durmiendo...";
      return;
    }
    const diffMins = Math.floor((new Date() - new Date(appState.lastSleepEndTime)) / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    const badge = document.getElementById("wake-window-badge");
    badge.textContent = `Despierto: ${hrs}h ${mins}m`;

    if(diffMins < 120) {
      badge.className = "badge badge-optimal";
    } else if(diffMins <= 180) {
      badge.className = "badge badge-alert";
    } else {
      badge.className = "badge badge-overtired";
    }
  }, 10000);
}

// Modal Dinámico
function initModal() {
  const modal = document.getElementById("action-modal");
  const closeBtn = document.querySelector(".modal-close");
  const form = document.getElementById("modal-form");

  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      setupModalFields(type);
      modal.classList.add("active");
    });
  });

  closeBtn.onclick = () => modal.classList.remove("active");

  form.onsubmit = (e) => {
    e.preventDefault();
    const type = document.getElementById("modal-type").value;
    const notes = document.getElementById("modal-notes").value;
    const payload = extractFormData(type);
    payload.notas = notes;
    
    saveRecord(payload);
    modal.classList.remove("active");
    form.reset();
  };
}

function setupModalFields(type) {
  document.getElementById("modal-type").value = type;
  document.getElementById("modal-title").textContent = `Registrar ${type}`;
  const fieldsContainer = document.getElementById("modal-fields");
  fieldsContainer.innerHTML = "";

  if(type === 'Biberon' || type === 'Extractor') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Cantidad (ml)</label>
        <input type="number" id="field-val" placeholder="120" required>
      </div>`;
  } else if(type === 'Lactancia') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Lado</label>
        <select id="field-side"><option>Izquierdo</option><option>Derecho</option><option>Ambos</option></select>
      </div>
      <div class="form-group">
        <label>Duración (minutos)</label>
        <input type="number" id="field-val" placeholder="15" required>
      </div>`;
  } else if(type === 'Panal') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Tipo</label>
        <select id="field-sub"><option>Pis</option><option>Caca</option><option>Mixto</option></select>
      </div>`;
  } else if(type === 'Temperatura') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Temperatura (ºC)</label>
        <input type="number" step="0.1" id="field-val" placeholder="36.6" required>
      </div>`;
  } else {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Detalle / Nombre</label>
        <input type="text" id="field-sub" placeholder="Especificar..." required>
      </div>`;
  }
}

function extractFormData(type) {
  const valInput = document.getElementById("field-val");
  const subInput = document.getElementById("field-sub");
  const sideInput = document.getElementById("field-side");
  
  return {
    categoria: getCategoryGroup(type),
    subtipo: type + (subInput ? ` (${subInput.value})` : '') + (sideInput ? ` (${sideInput.value})` : ''),
    valor: valInput ? parseFloat(valInput.value) : 1,
    unidad: type === 'Biberon' || type === 'Extractor' ? 'ml' : (type === 'Temperatura' ? 'ºC' : 'unidad'),
    fechaInicio: new Date().toISOString(),
    fechaFin: new Date().toISOString()
  };
}

function getCategoryGroup(type) {
  if (type === 'Sueño') return 'sleep';
  if (['Lactancia', 'Biberon', 'Extractor', 'Solido', 'Bebida'].includes(type)) return 'feed';
  if (['Panal', 'Orinal', 'Bano', 'Dientes', 'Medicamento', 'Temperatura', 'Consulta', 'Vacuna', 'Sintomas', 'Llanto'].includes(type)) return 'hygiene';
  return 'activity';
}

// Persistencia en localStorage y backend con sincronización segura
function saveRecord(recordData) {
  appState.logs.push(recordData);
  localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
  renderTimeline();

  if(!API_URL || API_URL.includes("REEMPLAZAR")) return;

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "addRecord", data: recordData })
  }).catch(err => console.error("Sincronización remota pendiente:", err));
}

async function loadData() {
  const cachedLogs = localStorage.getItem("leandro_logs");
  if(cachedLogs) {
    appState.logs = JSON.parse(cachedLogs);
    renderTimeline();
  }

  if(!API_URL || API_URL.includes("REEMPLAZAR")) return;

  try {
    const res = await fetch(API_URL + "?action=getData");
    const json = await res.json();
    if(json.records && json.records.length > 0) {
      const remoteKeys = new Set(json.records.map(r => r.fechainicio || r.fechaInicio));
      const unsyncedLocal = appState.logs.filter(l => !remoteKeys.has(l.fechaInicio));
      appState.logs = [...json.records, ...unsyncedLocal];
      localStorage.setItem("leandro_logs", JSON.stringify(appState.logs));
    }
    if(json.growth) appState.growth = json.growth;
    
    renderTimeline();
    
    const activeTab = document.querySelector(".tab-btn.active");
    if(activeTab && activeTab.dataset.tab === 'tab-stats') {
      renderCharts();
    }
  } catch(err) {
    console.warn("Utilizando datos locales en caché (offline).", err);
  }
}

// Renderizado de Timeline
function renderTimeline() {
  const container = document.getElementById("timeline-bar");
  const list = document.getElementById("timeline-log-list");
  if(!container) return;
  
  container.innerHTML = "";
  list.innerHTML = "";

  const todayStr = new Date().toDateString();
  const todayLogs = appState.logs.filter(l => new Date(l.fechaInicio || l.fechainicio).toDateString() === todayStr);

  todayLogs.forEach(log => {
    const start = new Date(log.fechaInicio || log.fechainicio);
    const startMins = start.getHours() * 60 + start.getMinutes();
    const leftPct = (startMins / 1440) * 100;
    
    let durationMins = log.unidad === 'min' ? log.valor : 15;
    const widthPct = Math.max((durationMins / 1440) * 100, 1.5);

    const block = document.createElement("div");
    block.className = `timeline-block bg-${log.categoria}`;
    block.style.left = `${leftPct}%`;
    block.style.width = `${widthPct}%`;
    block.title = `${log.subtipo} - ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    container.appendChild(block);

    const item = document.createElement("div");
    item.className = "text-sm";
    item.style.padding = "6px 0";
    item.style.borderBottom = "1px solid #f1f5f9";
    item.innerHTML = `<strong>${start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</strong> - ${log.subtipo} ${log.valor ? `(${log.valor} ${log.unidad})` : ''}`;
    list.appendChild(item);
  });
}

// Dentición
function initTeethMap() {
  const container = document.getElementById("teeth-map");
  if(!container) return;
  
  const teethList = [
    "Incisivo Sup Central Izq", "Incisivo Sup Central Der", "Incisivo Sup Lat Izq", "Incisivo Sup Lat Der",
    "Canino Sup Izq", "Canino Sup Der", "Molar Sup Izq", "Molar Sup Der",
    "Incisivo Inf Central Izq", "Incisivo Inf Central Der", "Incisivo Inf Lat Izq", "Incisivo Inf Lat Der",
    "Canino Inf Izq", "Canino Inf Der", "Molar Inf Izq", "Molar Inf Der"
  ];

  const savedTeeth = JSON.parse(localStorage.getItem("leandro_teeth") || "{}");

  teethList.forEach(tooth => {
    const div = document.createElement("div");
    div.className = `tooth-item ${savedTeeth[tooth] ? 'erupted' : ''}`;
    div.textContent = tooth;
    div.onclick = () => {
      savedTeeth[tooth] = !savedTeeth[tooth];
      localStorage.setItem("leandro_teeth", JSON.stringify(savedTeeth));
      div.classList.toggle("erupted");
    };
    container.appendChild(div);
  });
}

// Crecimiento
function initGrowthForm() {
  const form = document.getElementById("growth-form");
  if(!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const payload = {
      fecha: new Date().toISOString(),
      peso: parseFloat(document.getElementById("growth-weight").value),
      talla: parseFloat(document.getElementById("growth-height").value),
      perimetro: parseFloat(document.getElementById("growth-head").value)
    };
    
    appState.growth.push(payload);
    if(API_URL && !API_URL.includes("REEMPLAZAR")) {
      fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addGrowth", data: payload })
      });
    }
    alert("Medición registrada con éxito");
    form.reset();
  };
}

// CÁLCULO DINÁMICO DE ESTADÍSTICAS EN REAL-TIME (Chart.js)
function renderCharts() {
  const ctxSleep = document.getElementById("chart-sleep")?.getContext("2d");
  const ctxFeed = document.getElementById("chart-feeding")?.getContext("2d");
  const ctxDiapers = document.getElementById("chart-diapers")?.getContext("2d");

  const days = [];
  const sleepHours = [0,0,0,0,0,0,0];
  const feedVol = [0,0,0,0,0,0,0];
  let diaperCounts = { Pis: 0, Caca: 0, Mixto: 0 };

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('es-ES', { weekday: 'short' }));
  }

  const now = new Date();
  appState.logs.forEach(log => {
    const logDate = new Date(log.fechaInicio || log.fechainicio);
    const diffDays = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      const dayIdx = 6 - diffDays;
      if (log.categoria === 'sleep') {
        sleepHours[dayIdx] += (parseFloat(log.valor) || 0) / 60;
      }
      if (log.categoria === 'feed' && log.unidad === 'ml') {
        feedVol[dayIdx] += parseFloat(log.valor) || 0;
      }
      if (log.categoria === 'hygiene' && log.subtipo.includes('Panal')) {
        if (log.subtipo.includes('Pis')) diaperCounts.Pis++;
        else if (log.subtipo.includes('Caca')) diaperCounts.Caca++;
        else if (log.subtipo.includes('Mixto')) diaperCounts.Mixto++;
      }
    }
  });

  if(chartSleepInst) chartSleepInst.destroy();
  if(chartFeedInst) chartFeedInst.destroy();
  if(chartDiaperInst) chartDiaperInst.destroy();

  if(ctxSleep) {
    chartSleepInst = new Chart(ctxSleep, {
      type: 'bar',
      data: { labels: days, datasets: [{ label: 'Horas de Sueño', data: sleepHours.map(h => h.toFixed(1)), backgroundColor: '#3b82f6' }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  if(ctxFeed) {
    chartFeedInst = new Chart(ctxFeed, {
      type: 'line',
      data: { labels: days, datasets: [{ label: 'Volumen Biberón (ml)', data: feedVol, borderColor: '#10b981', fill: false }] },
      options: { responsive: true }
    });
  }

  if(ctxDiapers) {
    chartDiaperInst = new Chart(ctxDiapers, {
      type: 'doughnut',
      data: { labels: ['Pis', 'Caca', 'Mixto'], datasets: [{ data: [diaperCounts.Pis, diaperCounts.Caca, diaperCounts.Mixto], backgroundColor: ['#3b82f6', '#f97316', '#eab308'] }] },
      options: { responsive: true }
    });
  }
}
}
