// Master Lead Intake & Email Auto-Responder Endpoints (100% Free Google Sheets + Formspree)
const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwVK3RrV3FGGLoh822ID3JVFhVIaqqCitwGjBXXbMuDomDvTUIePJR1Ca9CK6MD2dd3/exec';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzaqpa';

// 0. Dynamic Island Capsule Scroll Spy & Navigation
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('header#hero, section#solutions, section#demo, section#request-demo, section#process, section#calculator, section#booking');
  const islandItems = document.querySelectorAll('.island-item');

  function updateActiveIslandItem() {
    let current = 'hero';
    const scrollPosition = window.scrollY + 220;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    islandItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === `#${current}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveIslandItem, { passive: true });
  updateActiveIslandItem();
});

// Toggle Manual Description Field if No Website
function toggleNoWebsiteFields() {
  const checkbox = document.getElementById('no-website-checkbox');
  const descGroup = document.getElementById('manual-desc-group');
  const websiteInput = document.getElementById('demo-website');
  const servicesTextarea = document.getElementById('demo-services');
  if (!checkbox || !descGroup) return;

  if (checkbox.checked) {
    descGroup.style.display = 'block';
    if (websiteInput) {
      websiteInput.value = '';
      websiteInput.placeholder = '(No website - Details provided manually below)';
      websiteInput.disabled = true;
    }
    if (servicesTextarea) servicesTextarea.required = true;
  } else {
    descGroup.style.display = 'none';
    if (websiteInput) {
      websiteInput.placeholder = 'https://yourbusiness.com';
      websiteInput.disabled = false;
    }
    if (servicesTextarea) servicesTextarea.required = false;
  }
}

// Handle Custom Demo Lead Form Submission (Formspree)
async function handleCustomDemoSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('custom-demo-request-form');
  const submitBtn = document.getElementById('btn-submit-demo-request');
  const successBox = document.getElementById('demo-request-success');

  const name = document.getElementById('demo-name').value.trim();
  const business = document.getElementById('demo-business').value.trim();
  const niche = document.getElementById('demo-niche').value;
  const website = document.getElementById('demo-website').value.trim();
  const isNoWebsite = document.getElementById('no-website-checkbox')?.checked;
  const servicesAndPricing = document.getElementById('demo-services')?.value.trim() || '';
  const specialistNames = document.getElementById('demo-staff')?.value.trim() || '';
  const businessLocation = document.getElementById('demo-location')?.value.trim() || '';
  const operatingHours = document.getElementById('demo-hours')?.value.trim() || '';
  const email = document.getElementById('demo-email').value.trim();
  const phone = document.getElementById('demo-phone').value.trim();
  const notes = document.getElementById('demo-notes')?.value.trim() || '';

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>⏳ Training Custom AI & Dispatching Request...</span>';

  const payload = {
    _subject: `🚀 [Free Demo Request] ${business} (${niche})`,
    full_name: name,
    business_name: business,
    industry_niche: niche,
    has_website: !isNoWebsite && website ? 'YES' : 'NO (Manual Details Provided)',
    website_url: website || 'No live website provided',
    services_and_charges: servicesAndPricing || 'Scrape from website URL',
    specialists_and_staff: specialistNames || 'N/A',
    location_city: businessLocation || 'N/A',
    operating_hours: operatingHours || 'N/A',
    business_email: email,
    phone_number: phone,
    special_requests: notes || 'N/A',
    submitted_at: new Date().toLocaleString()
  };

  try {
    // 1. Send to Google Sheets (Appends row to Sheet + auto-sends confirmation email to customer + alerts Nomena)
    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    }).catch(e => console.error('Google Sheets dispatch error:', e));

    // 2. Send to Formspree as backup
    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(e => console.error('Formspree dispatch error:', e));

    form.style.display = 'none';
    successBox.style.display = 'block';
    document.getElementById('success-target-email').textContent = email;
    document.getElementById('success-target-phone').textContent = phone;
    playPhoneChime();
  } catch (err) {
    form.style.display = 'none';
    successBox.style.display = 'block';
    document.getElementById('success-target-email').textContent = email;
    document.getElementById('success-target-phone').textContent = phone;
  }
}

// 1. Switch Showroom Tabs (Voice, Cloning, Chat, Routing, Reviews) with Touch & Auto-Scroll
const DEMO_ORDER = ['voice', 'cloning', 'chat', 'routing', 'reviews'];
let currentDemoIndex = 0;

function switchDemo(type) {
  const tabs = document.querySelectorAll('.demo-tab');
  const views = document.querySelectorAll('.demo-view');
  const dots = document.querySelectorAll('.m-dot');

  tabs.forEach(t => t.classList.remove('active'));
  views.forEach(v => v.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  const index = DEMO_ORDER.indexOf(type);
  if (index !== -1) {
    currentDemoIndex = index;
    if (dots[index]) dots[index].classList.add('active');
  }

  if (type === 'voice') {
    tabs[0]?.classList.add('active');
    document.getElementById('voice-demo-view')?.classList.add('active');
    tabs[0]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  } else if (type === 'cloning') {
    tabs[1]?.classList.add('active');
    document.getElementById('cloning-demo-view')?.classList.add('active');
    tabs[1]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  } else if (type === 'chat') {
    tabs[2]?.classList.add('active');
    document.getElementById('chat-demo-view')?.classList.add('active');
    tabs[2]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  } else if (type === 'routing') {
    tabs[3]?.classList.add('active');
    document.getElementById('routing-demo-view')?.classList.add('active');
    tabs[3]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    if (!document.getElementById('routing-matrix-card')?.innerHTML.trim()) {
      selectRoutingNiche('medspa');
    }
  } else if (type === 'reviews') {
    tabs[4]?.classList.add('active');
    document.getElementById('reviews-demo-view')?.classList.add('active');
    tabs[4]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

// Jump and switch to specific Simulation Lab tab
function jumpToDemo(type) {
  switchDemo(type);
  const demoSection = document.getElementById('demo');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ================= 1. STUDIO SCENARIO TELEPHONY ENGINE (TAB 1) =================
const SCENARIOS = {
  1: {
    title: 'Patient Treatment Intake',
    subtitle: 'Botox pricing & calendar booking',
    duration: 22,
    speaker: 'Elena (AI Receptionist):',
    transcript: '“Thanks for calling Radiance Aesthetic Clinic! This is Elena. Are you looking to schedule an appointment with Dr. Sarah, or can I answer any questions about our Botox and dermal filler packages today? Perfect! Dr. Sarah has an opening this Thursday at 10:30 AM or Friday at 2:00 PM. Which time suits you best?”'
  },
  2: {
    title: '2:00 AM Emergency Triage',
    subtitle: 'After-hours call transfer to on-call doc',
    duration: 24,
    speaker: 'Elena (AI Triage Agent):',
    transcript: '“Hello, thanks for calling Radiance Clinic after-hours emergency line. I understand you have post-procedure swelling. I have logged your patient chart and am immediately connecting you to Dr. Sarah\'s on-call priority line right now. Please hold for one second while I initiate the direct transfer.”'
  },
  3: {
    title: '2-Way Rescheduling',
    subtitle: 'Self-service calendar modification',
    duration: 18,
    speaker: 'Elena (AI Assistant):',
    transcript: '“Hi Marcus! I found your appointment with Dr. Sarah for Thursday at 2:00 PM. I can easily move that for you to Friday at 11:00 AM. I have updated your calendar and dispatched an instant SMS confirmation to your mobile right now!”'
  }
};

let currentScenarioId = 1;
let isScenarioPlaying = false;
let scenarioAudioTimer = null;
let scenarioSecondsElapsed = 0;
let audioCtx = null;
let availableVoices = [];

// Initialize Browser Voices
function initBrowserVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}

if ('speechSynthesis' in window) {
  initBrowserVoices();
  window.speechSynthesis.onvoiceschanged = initBrowserVoices;
}

function getBestSpeechVoice(gender = 'female') {
  initBrowserVoices();
  if (!availableVoices || availableVoices.length === 0) return null;

  if (gender === 'female') {
    const preferred = ['Samantha', 'Ava', 'Victoria', 'Karen', 'Moira', 'Google US English', 'Zira', 'Microsoft Zira', 'Fiona'];
    for (const name of preferred) {
      const match = availableVoices.find(v => v.name.includes(name));
      if (match) return match;
    }
    return availableVoices.find(v => v.name.toLowerCase().includes('female') || v.lang.startsWith('en')) || availableVoices[0];
  } else {
    const preferred = ['Alex', 'Daniel', 'Tom', 'David', 'George', 'Fred', 'Google UK English Male', 'Google US English', 'Microsoft David'];
    for (const name of preferred) {
      const match = availableVoices.find(v => v.name.includes(name));
      if (match) return match;
    }
    return availableVoices.find(v => v.name.toLowerCase().includes('male') || v.lang.startsWith('en')) || availableVoices[0];
  }
}

// Sound Effects for Studio Playback
function playPhoneChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1040, now + 0.18);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    console.log('Audio chime not available');
  }
}

function switchVoiceScenario(id) {
  stopScenarioAudioPlayback();
  currentScenarioId = id;

  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`btn-scen-${i}`);
    if (btn) {
      if (i === id) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  const sc = SCENARIOS[id];
  if (!sc) return;

  const transcriptBox = document.getElementById('voice-scenario-transcript');
  if (transcriptBox) {
    transcriptBox.innerHTML = `<strong style="color: var(--cyan);">${sc.speaker}</strong> ${sc.transcript}`;
  }

  const timer = document.getElementById('voice-scenario-timer');
  if (timer) timer.textContent = `0:00 / 0:${sc.duration < 10 ? '0' + sc.duration : sc.duration}`;
}

function toggleScenarioAudioPlayback() {
  if (isScenarioPlaying) {
    stopScenarioAudioPlayback();
    return;
  }

  stopScenarioAudioPlayback();
  const sc = SCENARIOS[currentScenarioId];
  if (!sc) return;

  isScenarioPlaying = true;
  scenarioSecondsElapsed = 0;
  playPhoneChime();

  const playBtnText = document.getElementById('btn-voice-play-text');
  if (playBtnText) playBtnText.textContent = '⏸ Pause Studio Track';

  const waveform = document.getElementById('voice-sim-waveform');
  if (waveform) waveform.classList.add('playing');

  const timer = document.getElementById('voice-scenario-timer');

  scenarioAudioTimer = setInterval(() => {
    scenarioSecondsElapsed++;
    if (timer) {
      const min = Math.floor(scenarioSecondsElapsed / 60);
      const sec = scenarioSecondsElapsed % 60;
      timer.textContent = `${min}:${sec < 10 ? '0' + sec : sec} / 0:${sc.duration < 10 ? '0' + sc.duration : sc.duration}`;
    }
  }, 1000);

  // Play audio out loud via browser speech engine
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const cleanText = sc.transcript.replace(/[“”"']/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.08;

    const voice = getBestSpeechVoice('female');
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      stopScenarioAudioPlayback();
    };
    utterance.onerror = () => {
      stopScenarioAudioPlayback();
    };

    window.speechSynthesis.speak(utterance);
  }
}

function stopScenarioAudioPlayback() {
  isScenarioPlaying = false;
  if (scenarioAudioTimer) {
    clearInterval(scenarioAudioTimer);
    scenarioAudioTimer = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const playBtnText = document.getElementById('btn-voice-play-text');
  if (playBtnText) playBtnText.textContent = '▶ Play Studio Audio Track';

  const waveform = document.getElementById('voice-sim-waveform');
  if (waveform) waveform.classList.remove('playing');

  const sc = SCENARIOS[currentScenarioId];
  const timer = document.getElementById('voice-scenario-timer');
  if (timer && sc) timer.textContent = `0:00 / 0:${sc.duration < 10 ? '0' + sc.duration : sc.duration}`;
}

// ================= 2. EXECUTIVE NEURAL VOICE CLONING STUDIO (TAB 2) =================
const CLONE_PROFILES = {
  sarah: {
    name: 'Dr. Sarah Jenkins — Neural Voice Model',
    desc: 'Trained on 45s raw phone audio • Warm, reassuring aesthetic clinical cadence',
    speaker: 'Dr. Sarah (AI Clone):',
    gender: 'female',
    script: '“Hi there! This is Dr. Sarah from Radiance Aesthetics. I am in a treatment room right now, but I can check my live calendar, answer your questions about Botox, and book you directly into my schedule. What day works best for you?”',
    sampleText: '“Hey everyone, this is Dr. Sarah Jenkins. Welcome to Radiance Aesthetics. Here is a quick audio sample from our clinic consultation regarding dermal fillers and skin rejuvenation.”',
    duration: 18
  },
  marcus: {
    name: 'Marcus Vance, Esq. — Neural Voice Model',
    desc: 'Trained on 60s podcast audio • Authoritative, articulate senior legal partner cadence',
    speaker: 'Marcus Vance, Esq. (AI Clone):',
    gender: 'male',
    script: '“Good afternoon. This is Marcus Vance with Vance & Associates. I am currently in court, but our AI intake system has full access to my consultation schedule. Are you calling regarding a commercial contract dispute or corporate counsel?”',
    sampleText: '“Good day, my name is Marcus Vance, managing partner at Vance & Associates Legal. This is my direct spoken reference sample regarding our corporate advisory practice.”',
    duration: 20
  },
  jax: {
    name: 'Jax Reynolds — Neural Voice Model',
    desc: 'Trained on 30s Instagram audio • High-energy, warm luxury salon founder cadence',
    speaker: 'Jax Reynolds (AI Clone):',
    gender: 'male',
    script: '“Yo! What\'s up, it\'s Jax from Crown & Blade! I\'m behind the chair with clippers right now, but you can book a fresh fade or beard sculpt with me or any of my barbers this Thursday. You want morning or afternoon?”',
    sampleText: '“What\'s going on guys, it\'s Jax from Crown & Blade. Testing 1-2-3 for our shop voice cloning reference audio.”',
    duration: 16
  }
};

let currentCloneId = 'sarah';
let isClonePlaying = false;
let isSamplePlaying = false;
let cloneAudioTimer = null;

function selectCloneProfile(id) {
  stopAllCloningAudio();
  currentCloneId = id;
  const cards = document.querySelectorAll('.clone-profile-card');
  cards.forEach(c => c.classList.remove('active'));
  document.getElementById(`clone-card-${id}`)?.classList.add('active');

  const p = CLONE_PROFILES[id];
  if (!p) return;

  document.getElementById('clone-active-name').textContent = p.name;
  document.getElementById('clone-active-desc').textContent = p.desc;
  document.getElementById('clone-speaker-tag').textContent = p.speaker;
  document.getElementById('clone-speech-text').textContent = p.script;
}

function toggleActiveVoiceClone() {
  if (isClonePlaying) {
    stopAllCloningAudio();
    return;
  }

  stopAllCloningAudio();
  const p = CLONE_PROFILES[currentCloneId];
  if (!p) return;

  isClonePlaying = true;
  playPhoneChime();

  const btnText = document.getElementById('btn-play-clone-text');
  if (btnText) btnText.textContent = '⏸ Pause AI Neural Clone';

  const waveform = document.getElementById('clone-waveform-bars');
  if (waveform) waveform.classList.add('playing');

  // Play audio out loud via browser speech engine
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const cleanText = p.script.replace(/[“”"']/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = p.gender === 'male' ? 0.98 : 1.02;
    utterance.pitch = p.gender === 'male' ? 0.92 : 1.12;

    const voice = getBestSpeechVoice(p.gender);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      stopAllCloningAudio();
    };
    utterance.onerror = () => {
      stopAllCloningAudio();
    };

    window.speechSynthesis.speak(utterance);
  }
}

function toggleOriginalHumanSample() {
  if (isSamplePlaying) {
    stopAllCloningAudio();
    return;
  }

  stopAllCloningAudio();
  const p = CLONE_PROFILES[currentCloneId];
  if (!p) return;

  isSamplePlaying = true;
  playPhoneChime();

  const btnText = document.getElementById('btn-play-sample-text');
  if (btnText) btnText.textContent = '⏸ Pause Human Sample';

  const waveform = document.getElementById('clone-waveform-bars');
  if (waveform) waveform.classList.add('playing');

  const transcriptBox = document.getElementById('clone-transcript-box');
  if (transcriptBox) {
    transcriptBox.innerHTML = `<strong style="color: #f59e0b;">Original Human Audio Memo:</strong> "${p.sampleText}"`;
  }

  // Play audio out loud via browser speech engine
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const cleanText = p.sampleText.replace(/[“”"']/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = p.gender === 'male' ? 0.94 : 0.96;
    utterance.pitch = p.gender === 'male' ? 0.88 : 1.0;

    const voice = getBestSpeechVoice(p.gender);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      stopAllCloningAudio();
    };
    utterance.onerror = () => {
      stopAllCloningAudio();
    };

    window.speechSynthesis.speak(utterance);
  }
}

function stopAllCloningAudio() {
  isClonePlaying = false;
  isSamplePlaying = false;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const btnCloneText = document.getElementById('btn-play-clone-text');
  if (btnCloneText) btnCloneText.textContent = '⚡ Play AI Neural Clone (Inbound Call)';

  const btnSampleText = document.getElementById('btn-play-sample-text');
  if (btnSampleText) btnSampleText.textContent = '🎧 Play Original Human Audio Memo';

  const waveform = document.getElementById('clone-waveform-bars');
  if (waveform) waveform.classList.remove('playing');

  const p = CLONE_PROFILES[currentCloneId];
  const transcriptBox = document.getElementById('clone-transcript-box');
  if (transcriptBox && p) {
    transcriptBox.innerHTML = `<strong style="color: var(--cyan);" id="clone-speaker-tag">${p.speaker}</strong> "<span id="clone-speech-text">${p.script}</span>"`;
  }
}

// 3. Showroom 2-Way Chatbot State Machine
let showroomFlow = {
  state: 'IDLE',
  selectedDay: '',
  selectedTime: '',
  userName: '',
  userEmail: ''
};

function appendShowroomBubble(sender, text) {
  const box = document.getElementById('showroom-chat-window');
  if (!box) return;
  const b = document.createElement('div');
  b.className = `chat-bubble ${sender}`;
  b.innerHTML = text;
  box.appendChild(b);
  box.scrollTop = box.scrollHeight;
}

function handleShowroomQuickClick(text) {
  appendShowroomBubble('user', text);
  processShowroomAIResponse(text);
}

function sendShowroomChat() {
  const input = document.getElementById('showroom-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendShowroomBubble('user', text);
  processShowroomAIResponse(text);
}

function processShowroomAIResponse(userText) {
  const t = userText.toLowerCase().trim();

  setTimeout(() => {
    // 1. Handling "yes", "sure", "ok"
    if (['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'sounds good', 'let\'s do it', 'lets do it'].includes(t)) {
      appendShowroomBubble('bot', `
        Awesome! Which of these available slots works best for your schedule?
        <div class="slot-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Thursday at 10:30 AM')">📅 Thu, 10:30 AM</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Thursday at 2:00 PM')">📅 Thu, 2:00 PM</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Friday at 11:00 AM')">📅 Fri, 11:00 AM</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Friday at 3:30 PM')">📅 Fri, 3:30 PM</div>
        </div>
      `);
      showroomFlow.state = 'AWAITING_TIME';
      return;
    }

    // 2. Day choices: Thursday vs Friday
    if (t.includes('thursday') || t.includes('thu')) {
      showroomFlow.selectedDay = 'Thursday';
      showroomFlow.state = 'AWAITING_TIME';
      appendShowroomBubble('bot', `
        ⚙️ <em>Querying Cal.com API for Thursday openings...</em><br><br>
        I found <strong>2 available openings</strong> for Thursday:
        <div class="slot-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Thursday at 10:30 AM')">🕒 10:30 AM (Morning)</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Thursday at 2:00 PM')">🕒 2:00 PM (Afternoon)</div>
        </div>
        <br>Which of these two times suits you best?
      `);
      return;
    }

    if (t.includes('friday') || t.includes('fri')) {
      showroomFlow.selectedDay = 'Friday';
      showroomFlow.state = 'AWAITING_TIME';
      appendShowroomBubble('bot', `
        ⚙️ <em>Querying Cal.com API for Friday openings...</em><br><br>
        I found <strong>2 available openings</strong> for Friday:
        <div class="slot-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Friday at 11:00 AM')">🕒 11:00 AM (Morning)</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Friday at 3:30 PM')">🕒 3:30 PM (Afternoon)</div>
        </div>
        <br>Which time works best for you?
      `);
      return;
    }

    // 3. Time specific matching
    if (t.includes('10:30') || t.includes('10:30am') || (t.includes('morning') && showroomFlow.selectedDay === 'Thursday')) {
      handleShowroomSlotSelection('Thursday at 10:30 AM');
      return;
    }
    if (t.includes('2pm') || t.includes('2:00') || t.includes('2:00pm') || t === '2' || (t.includes('afternoon') && showroomFlow.selectedDay === 'Thursday')) {
      handleShowroomSlotSelection('Thursday at 2:00 PM');
      return;
    }
    if (t.includes('11:00') || t.includes('11am') || t === '11' || (t.includes('morning') && showroomFlow.selectedDay === 'Friday')) {
      handleShowroomSlotSelection('Friday at 11:00 AM');
      return;
    }
    if (t.includes('3:30') || t.includes('3:30pm') || (t.includes('afternoon') && showroomFlow.selectedDay === 'Friday')) {
      handleShowroomSlotSelection('Friday at 3:30 PM');
      return;
    }

    // 4. Name / Email intake
    if (showroomFlow.state === 'AWAITING_NAME') {
      showroomFlow.userName = userText;
      showroomFlow.state = 'AWAITING_EMAIL';
      appendShowroomBubble('bot', `
        Pleasure to meet you, <strong>${showroomFlow.userName}</strong>! What is your best <strong>business email address</strong> to send the calendar invite and Google Meet link to?
      `);
      return;
    }

    if (showroomFlow.state === 'AWAITING_EMAIL' || (t.includes('@') && t.includes('.'))) {
      showroomFlow.userEmail = userText;
      showroomFlow.state = 'CONFIRMED';

      // Dispatch lead to Google Sheets & Formspree
      const leadPayload = {
        full_name: showroomFlow.userName || 'Web Chat Lead',
        business_name: 'ChatKit Prototype Reservation',
        industry_niche: 'Web Chat Booking',
        business_email: showroomFlow.userEmail,
        phone_number: 'Provided via Web Chat',
        special_requests: `Selected Slot: ${showroomFlow.selectedTime || 'Thursday at 10:30 AM'}`,
        submitted_at: new Date().toLocaleString()
      };

      fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(leadPayload)
      }).catch(e => console.error(e));

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      }).catch(e => console.error(e));

      appendShowroomBubble('bot', `
        ✅ <strong>All Set! Your Meeting is Confirmed!</strong><br><br>
        ⚙️ <em>Executed tool: <code>createCalComMeeting(slot="${showroomFlow.selectedTime || 'Thursday at 10:30 AM'}", email="${showroomFlow.userEmail}")</code></em><br><br>
        • 👤 <strong>Name:</strong> ${showroomFlow.userName || 'Valued Client'}<br>
        • ✉️ <strong>Email:</strong> ${showroomFlow.userEmail}<br>
        • 📅 <strong>Scheduled Time:</strong> ${showroomFlow.selectedTime || 'Thursday at 10:30 AM'}<br>
        • 🔗 <strong>Location:</strong> Google Meet (Invite synced with Google Calendar)<br><br>
        <a href="https://cal.com/nomena-khan-l63gmb/15min" target="_blank" style="background:#00f0ff; color:#030708; font-weight:700; padding:8px 16px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:6px;">📅 Lock Time on Live Cal.com Calendar →</a>
      `);
      return;
    }

    // 5. Booking / General Slots
    if (t.includes('book') || t.includes('schedule') || t.includes('appointment') || t.includes('consultation')) {
      showroomFlow.state = 'AWAITING_TIME';
      appendShowroomBubble('bot', `
        ⚙️ <em>Executing tool: <code>getCalComAvailability(multi_day=true)</code></em>...<br><br>
        I've checked our live schedule. Here are our soonest openings:
        <div class="slot-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Thursday at 10:30 AM')">📅 Thu, 10:30 AM</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Thursday at 2:00 PM')">📅 Thu, 2:00 PM</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Friday at 11:00 AM')">📅 Fri, 11:00 AM</div>
          <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="handleShowroomSlotSelection('Friday at 3:30 PM')">📅 Fri, 3:30 PM</div>
        </div>
        <br>Click any slot above or type your preferred time!
      `);
      return;
    }

    if (t.includes('available') || t.includes('open') || t.includes('times') || t.includes('when')) {
      showroomFlow.state = 'AWAITING_TIME';
      appendShowroomBubble('bot', `
        We have 4 openings synchronized directly across our calendar this week:<br>
        • <strong>Thursday:</strong> 10:30 AM & 2:00 PM<br>
        • <strong>Friday:</strong> 11:00 AM & 3:30 PM<br><br>
        Which day would you prefer to reserve? (Say <strong>Thursday</strong> or <strong>Friday</strong>)
      `);
      return;
    }

    // 6. Greetings
    if (t.includes('hi') || t.includes('hello') || t.includes('hey') || t === 'hi') {
      appendShowroomBubble('bot', `
        Hello! 👋 I am the Nexa Logic autonomous receptionist. I can check live calendar availability, book meetings, or answer questions about our AI phone & chat systems. How can I help you today?
      `);
      return;
    }

    // 7. Pricing & Packages
    if (t.includes('price') || t.includes('cost') || t.includes('package') || t.includes('fee') || t.includes('how much') || t.includes('rate') || t.includes('charge')) {
      appendShowroomBubble('bot', `
        💰 <strong>Pricing & Solutions Overview:</strong><br><br>
        Our AI systems are customized to your monthly volume, channels (Phone, WhatsApp, Instagram), and CRM setup.<br><br>
        Please type your <strong>Email Address</strong> below to receive our complete Pricing Overview directly in your inbox, or say <strong>"Book a meeting"</strong> to pick a time on our live calendar!
      `);
      return;
    }

    // 8. Default fallback
    appendShowroomBubble('bot', `
      I can help you check real-time calendar availability, schedule a meeting, or demonstrate multi-staff routing. Would you like to view our open slots for <strong>Thursday</strong> or <strong>Friday</strong>?
    `);

  }, 400);
}

function handleShowroomSlotSelection(slot) {
  showroomFlow.selectedTime = slot;
  showroomFlow.state = 'AWAITING_NAME';
  appendShowroomBubble('bot', `
    Selected: <strong>${slot}</strong> 🕒<br><br>
    To finalize the calendar invite on Google Calendar and reserve this slot, what is your <strong>Full Name</strong>?
  `);
}

function resetShowroomChat() {
  showroomFlow = {
    state: 'IDLE',
    selectedDay: '',
    selectedTime: '',
    userName: '',
    userEmail: ''
  };
  const box = document.getElementById('showroom-chat-window');
  if (box) {
    box.innerHTML = `
      <div class="chat-bubble bot">
        👋 Hi there! I am your 24/7 AI Receptionist. I can check open appointment slots, lock in confirmed meetings, reschedule, or answer any questions about our systems.
        
        <div class="quick-starters" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
          <button class="starter-btn" onclick="handleShowroomQuickClick('📅 Book an appointment')">📅 Book an appointment</button>
          <button class="starter-btn" onclick="handleShowroomQuickClick('🕒 What times are available this week?')">🕒 Check open slots</button>
          <button class="starter-btn" onclick="handleShowroomQuickClick('👥 Can you route to multiple doctors/specialists?')">👥 Multi-staff routing</button>
          <button class="starter-btn" onclick="handleShowroomQuickClick('🔄 I need to reschedule my meeting')">🔄 Reschedule</button>
        </div>
      </div>
    `;
  }
}

// 4. Multi-Staff Routing Niche Matrix Switcher with Live Interactive Booking
function selectRoutingNiche(niche) {
  const btnMed = document.getElementById('btn-niche-medspa');
  const btnLeg = document.getElementById('btn-niche-legal');
  const btnRe = document.getElementById('btn-niche-realestate');
  const card = document.getElementById('routing-matrix-card');
  if (!card) return;

  [btnMed, btnLeg, btnRe].forEach(b => { if (b) b.classList.remove('active-niche', 'btn-primary'); });

  if (niche === 'medspa') {
    if (btnMed) btnMed.classList.add('active-niche', 'btn-primary');
    card.innerHTML = `
      <div style="font-size: 0.9rem; margin-bottom: 14px; color: var(--cyan); font-weight: 700;">💉 AESTHETICS CLINIC SPECIALIST MATRIX (CLICK TO TEST ROUTING)</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
        <tr style="border-bottom: 1px solid var(--border); color: var(--text-dim);">
          <th style="padding: 8px;">Specialist</th>
          <th style="padding: 8px;">Service / Treatment</th>
          <th style="padding: 8px;">Duration</th>
          <th style="padding: 8px;">Action</th>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; color: #fff;"><strong>Dr. Sarah Jenkins</strong></td>
          <td style="padding: 10px; color: var(--cyan);">Botox & Dermal Fillers</td>
          <td style="padding: 10px;">45 mins</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--cyan); color:var(--cyan);" onclick="simulateSpecialistRouting('Dr. Sarah Jenkins', 'Botox & Dermal Fillers', 'dr-sarah-injectables', '45 mins')">⚡ Book with Dr. Sarah</button></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; color: #fff;"><strong>Jessica Miller, LE</strong></td>
          <td style="padding: 10px; color: var(--purple);">Laser Resurfacing & Peels</td>
          <td style="padding: 10px;">60 mins</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--purple); color:var(--purple);" onclick="simulateSpecialistRouting('Jessica Miller, LE', 'Laser Resurfacing & Peels', 'jessica-laser-skin', '60 mins')">⚡ Book with Jessica</button></td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #fff;"><strong>Nurse Elena</strong></td>
          <td style="padding: 10px; color: var(--emerald);">IV Hydration Therapy</td>
          <td style="padding: 10px;">30 mins</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--emerald); color:var(--emerald);" onclick="simulateSpecialistRouting('Nurse Elena', 'IV Hydration Therapy', 'elena-iv-therapy', '30 mins')">⚡ Book with Elena</button></td>
        </tr>
      </table>
      
      <!-- Interactive Live Routing Sandbox Box -->
      <div id="specialist-live-sandbox" style="margin-top: 16px; display: none; background: #070c12; border: 1px solid var(--border); border-radius: 12px; padding: 16px;"></div>
    `;
  } else if (niche === 'legal') {
    if (btnLeg) btnLeg.classList.add('active-niche', 'btn-primary');
    card.innerHTML = `
      <div style="font-size: 0.9rem; margin-bottom: 14px; color: var(--cyan); font-weight: 700;">⚖️ LAW FIRM PRACTICE AREA MATRIX (CLICK TO TEST ROUTING)</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
        <tr style="border-bottom: 1px solid var(--border); color: var(--text-dim);">
          <th style="padding: 8px;">Attorney</th>
          <th style="padding: 8px;">Practice Area</th>
          <th style="padding: 8px;">Consult Fee</th>
          <th style="padding: 8px;">Action</th>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; color: #fff;"><strong>David Vance, Esq.</strong></td>
          <td style="padding: 10px; color: var(--cyan);">Personal Injury & Accidents</td>
          <td style="padding: 10px;">Free Consult</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--cyan); color:var(--cyan);" onclick="simulateSpecialistRouting('David Vance, Esq.', 'Personal Injury Consult', 'vance-pi-consult', '30 mins')">⚡ Route to Vance</button></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; color: #fff;"><strong>Marcus Reed, Esq.</strong></td>
          <td style="padding: 10px; color: var(--purple);">Criminal Defense & DUI</td>
          <td style="padding: 10px;">$250 Consult</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--purple); color:var(--purple);" onclick="simulateSpecialistRouting('Marcus Reed, Esq.', 'Criminal Defense Intake', 'reed-criminal-defense', '45 mins')">⚡ Route to Reed</button></td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #fff;"><strong>Sarah Sterling, Esq.</strong></td>
          <td style="padding: 10px; color: var(--emerald);">Estate Planning & Trusts</td>
          <td style="padding: 10px;">Free 15-Min</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--emerald); color:var(--emerald);" onclick="simulateSpecialistRouting('Sarah Sterling, Esq.', 'Estate Planning Consult', 'sterling-estate-planning', '15 mins')">⚡ Route to Sterling</button></td>
        </tr>
      </table>

      <!-- Interactive Live Routing Sandbox Box -->
      <div id="specialist-live-sandbox" style="margin-top: 16px; display: none; background: #070c12; border: 1px solid var(--border); border-radius: 12px; padding: 16px;"></div>
    `;
  } else if (niche === 'realestate') {
    if (btnRe) btnRe.classList.add('active-niche', 'btn-primary');
    card.innerHTML = `
      <div style="font-size: 0.9rem; margin-bottom: 14px; color: var(--cyan); font-weight: 700;">🏡 REAL ESTATE BROKERAGE MATRIX (CLICK TO TEST ROUTING)</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
        <tr style="border-bottom: 1px solid var(--border); color: var(--text-dim);">
          <th style="padding: 8px;">Agent</th>
          <th style="padding: 8px;">Specialty / Role</th>
          <th style="padding: 8px;">Territory</th>
          <th style="padding: 8px;">Action</th>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; color: #fff;"><strong>Brandon Hayes</strong></td>
          <td style="padding: 10px; color: var(--cyan);">Luxury Listing Specialist</td>
          <td style="padding: 10px;">Downtown & Waterfront</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--cyan); color:var(--cyan);" onclick="simulateSpecialistRouting('Brandon Hayes', 'Luxury Listing Valuation', 'brandon-luxury-listings', '45 mins')">⚡ Route to Brandon</button></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; color: #fff;"><strong>Chloe Bennett</strong></td>
          <td style="padding: 10px; color: var(--purple);">First-Time Home Buyers</td>
          <td style="padding: 10px;">Suburbs & North County</td>
          <td style="padding: 10px;"><button class="btn btn-secondary" style="padding:4px 10px; font-size:0.75rem; border-color:var(--purple); color:var(--purple);" onclick="simulateSpecialistRouting('Chloe Bennett', 'First-Time Buyer Consult', 'chloe-buyer-consult', '30 mins')">⚡ Route to Chloe</button></td>
        </tr>
      </table>

      <!-- Interactive Live Routing Sandbox Box -->
      <div id="specialist-live-sandbox" style="margin-top: 16px; display: none; background: #070c12; border: 1px solid var(--border); border-radius: 12px; padding: 16px;"></div>
    `;
  }
}

// Live Specialist Routing Simulator Handler (Step 1: Choose Slot)
function simulateSpecialistRouting(name, service, slug, duration) {
  const box = document.getElementById('specialist-live-sandbox');
  if (!box) return;
  box.style.display = 'block';

  box.innerHTML = `
    <div style="font-size: 0.84rem; color: var(--cyan); margin-bottom: 8px;">
      🤖 <strong>AI Semantic Intent Analyzer:</strong> Inbound inquiry for <em>"${service}"</em> detected!
    </div>
    <div style="background: rgba(18,28,42,0.8); border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-size: 0.88rem; line-height: 1.5; color: #fff;">
      ⚙️ <em>Executing tool: <code>getCalComAvailability(specialist="${slug}", duration="${duration}")</code></em><br><br>
      "I have routed you to <strong>${name}</strong>'s personal calendar. Here are their soonest available appointments:"
      
      <div class="slot-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 10px;">
        <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="promptSpecialistDetails('${name}', '${service}', '${slug}', 'Thursday at 10:30 AM')">📅 Thu, 10:30 AM</div>
        <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="promptSpecialistDetails('${name}', '${service}', '${slug}', 'Thursday at 2:00 PM')">📅 Thu, 2:00 PM</div>
        <div class="slot-pill" style="background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3); color:#fff; padding:8px; border-radius:8px; text-align:center; cursor:pointer;" onclick="promptSpecialistDetails('${name}', '${service}', '${slug}', 'Friday at 11:00 AM')">📅 Fri, 11:00 AM</div>
      </div>
      <div style="margin-top: 10px; font-size: 0.78rem; color: var(--text-dim);">Step 1 of 2: Click an available time slot above.</div>
    </div>
  `;
}

// Step 2: Intake Details (Full Name, Business Email, Phone)
function promptSpecialistDetails(name, service, slug, slot) {
  const box = document.getElementById('specialist-live-sandbox');
  if (!box) return;

  box.innerHTML = `
    <div style="background: rgba(18,28,42,0.9); border: 1px solid var(--border); border-radius: 8px; padding: 18px; font-size: 0.88rem; color: #fff;">
      <div style="font-size: 0.84rem; color: var(--cyan); margin-bottom: 6px;">
        📝 <strong>Step 2: Caller Intake & Verification</strong>
      </div>
      <p style="margin-bottom: 12px;">You selected <strong>${slot}</strong> for <strong>${service}</strong> with <strong>${name}</strong>.</p>
      
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 420px; margin-bottom: 14px;">
        <input type="text" id="spec-client-name" placeholder="Full Name (e.g. Sarah Jenkins)" style="background: rgba(5,8,11,0.8); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 0.88rem; outline: none;">
        <input type="email" id="spec-client-email" placeholder="Business Email (e.g. sarah@example.com)" style="background: rgba(5,8,11,0.8); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 0.88rem; outline: none;">
        <input type="tel" id="spec-client-phone" placeholder="Phone Number (e.g. +1 415 555 0199)" style="background: rgba(5,8,11,0.8); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 0.88rem; outline: none;">
      </div>

      <div style="display: flex; gap: 10px; align-items: center;">
        <button class="btn btn-primary btn-glow" style="padding: 8px 18px; font-size: 0.84rem;" onclick="submitSpecialistBooking('${name}', '${service}', '${slug}', '${slot}')">
          Confirm Appointment with ${name.split(' ')[0]} →
        </button>
        <button class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.8rem;" onclick="simulateSpecialistRouting('${name}', '${service}', '${slug}', '45 mins')">
          ← Back to Slots
        </button>
      </div>
    </div>
  `;
}

// Step 3: Final Execution & Live Confirmation
function submitSpecialistBooking(name, service, slug, slot) {
  const box = document.getElementById('specialist-live-sandbox');
  if (!box) return;

  const clientName = (document.getElementById('spec-client-name')?.value.trim()) || 'Sarah Jenkins';
  const clientEmail = (document.getElementById('spec-client-email')?.value.trim()) || 'sarah.j@example.com';
  const clientPhone = (document.getElementById('spec-client-phone')?.value.trim()) || '+1 (415) 555-0199';

  // Dispatch Specialist Lead to Google Sheets & Formspree
  const leadPayload = {
    full_name: clientName,
    business_name: `Specialist Booking: ${name} (${service})`,
    industry_niche: 'Multi-Staff Router Demo',
    business_email: clientEmail,
    phone_number: clientPhone,
    special_requests: `Booked slot: ${slot} with ${name}`,
    submitted_at: new Date().toLocaleString()
  };

  fetch(GOOGLE_SHEETS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(leadPayload)
  }).catch(e => console.error(e));

  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(leadPayload)
  }).catch(e => console.error(e));

  box.innerHTML = `
    <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 8px; padding: 18px; font-size: 0.88rem; color: #fff;">
      <div style="font-weight: 700; color: var(--emerald); font-size: 1rem; margin-bottom: 8px;">
        ✅ Appointment Confirmed & Synced!
      </div>
      ⚙️ <em>Executed tool: <code>createCalComSpecialistMeeting(specialist="${slug}", name="${clientName}", email="${clientEmail}", phone="${clientPhone}", time="${slot}")</code></em><br><br>
      
      <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 14px; margin: 12px 0; line-height: 1.65;">
        • 👤 <strong>Patient / Client:</strong> ${clientName}<br>
        • 👨‍⚕️ <strong>Assigned Specialist:</strong> ${name} (<em>${service}</em>)<br>
        • 🕒 <strong>Confirmed Time:</strong> ${slot}<br><br>
        <span style="color: var(--cyan); font-weight: 600;">📬 Multi-Channel Dispatch Actions:</span><br>
        • ✉️ <strong>Email Invite:</strong> Google Calendar invite & video link sent to <code>${clientEmail}</code><br>
        • 📱 <strong>SMS Text Alert:</strong> Instant confirmation SMS + automated 24-hour reminder queued for <code>${clientPhone}</code><br>
        • 🔄 <strong>CRM Sync:</strong> Contact deal card created in pipeline with 0 manual data entry!<br><br>
        <a href="https://cal.com/nomena-khan-l63gmb/15min" target="_blank" style="background:#00f0ff; color:#030708; font-weight:700; padding:8px 16px; border-radius:6px; text-decoration:none; display:inline-block;">📅 View on Live Cal.com Calendar →</a>
      </div>

      <button class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.78rem; margin-top: 6px;" onclick="selectRoutingNiche('medspa')">⟳ Test Another Specialist or Practice</button>
    </div>
  `;
}

// 4. Interactive Speed-to-Lead Live Battle Simulator
let nexaInterval = null;
let tradInterval = null;

function runSpeedSimulation() {
  const telemetry = document.getElementById('sim-telemetry');
  const btn = document.getElementById('btn-run-sim');
  const nexaTimer = document.getElementById('sim-nexa-timer');
  const tradTimer = document.getElementById('sim-trad-timer');
  if (!telemetry || !btn) return;

  if (nexaInterval) clearInterval(nexaInterval);
  if (tradInterval) clearInterval(tradInterval);

  playPhoneChime();

  btn.disabled = true;
  btn.innerHTML = '<span>⚡ Simulating Inbound Call Across Systems...</span>';
  telemetry.style.display = 'grid';

  // Animate Nexa Logic AI Timer (0.00s -> 0.42s)
  let nexaMs = 0;
  if (nexaTimer) nexaTimer.innerText = '0.00s';
  nexaInterval = setInterval(() => {
    nexaMs += 35;
    if (nexaMs >= 420) {
      clearInterval(nexaInterval);
      if (nexaTimer) nexaTimer.innerText = '0.42s ⚡ (Answered & Booked!)';
      btn.disabled = false;
      btn.innerHTML = '<span>⚡ Re-Run Live Simulation</span>';
    } else {
      if (nexaTimer) nexaTimer.innerText = (nexaMs / 1000).toFixed(2) + 's';
    }
  }, 30);

  // Animate Traditional Timer (Counting up to 42 minutes)
  let tradMin = 0;
  let tradSec = 0;
  if (tradTimer) tradTimer.innerText = '0m 00s';
  tradInterval = setInterval(() => {
    tradMin += 3;
    tradSec = Math.floor(Math.random() * 59);
    if (tradMin >= 42) {
      clearInterval(tradInterval);
      if (tradTimer) tradTimer.innerText = '42m 18s ❌ (Missed / Voicemail)';
    } else {
      if (tradTimer) tradTimer.innerText = `${tradMin}m ${tradSec < 10 ? '0' + tradSec : tradSec}s`;
    }
  }, 45);
}

window.runSpeedSimulation = runSpeedSimulation;

// ================= 5. FLOATING AI ASSISTANT (CONVERSATIONAL INTELLIGENCE & LEAD ENGINE) =================
let visitorData = {
  name: '',
  email: '',
  source: 'Nexa Website Floating AI Agent'
};

function toggleFloatingAgent() {
  const drawer = document.getElementById('ai-chat-drawer');
  if (!drawer) return;
  if (drawer.style.display === 'none' || drawer.style.display === '') {
    drawer.style.display = 'flex';
    document.getElementById('drawer-input')?.focus();
  } else {
    drawer.style.display = 'none';
  }
}

function sendDrawerMessage() {
  const input = document.getElementById('drawer-input');
  const text = input.value.trim();
  if (!text) return;

  const msgContainer = document.getElementById('drawer-messages');

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'drawer-bubble user';
  userBubble.innerText = text;
  msgContainer.appendChild(userBubble);
  input.value = '';
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Simulate Typing / Thinking indicator
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'drawer-bubble bot';

    const lower = text.toLowerCase();

    // 1. Email Extraction & Formspree Dispatch
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      visitorData.email = emailMatch[0];
      
      // Dispatch Instant Lead to Google Sheets & Formspree
      fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        visitorData.email = emailMatch[0];
      }

      fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          lead_type: 'pricing_request',
          business_email: visitorData.email,
          full_name: visitorData.name || '',
          business_name: '',
          special_requests: `Chat Inquiry / Pricing Request: "${text}"`,
          submitted_at: new Date().toLocaleString()
        })
      }).catch(e => console.error(e));

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lead_type: 'pricing_request',
          lead_email: visitorData.email,
          raw_message: text,
          submitted_at: new Date().toLocaleString()
        })
      }).catch(e => console.error(e));

      botBubble.innerHTML = `✅ <strong>Sent!</strong> I've emailed our complete <strong>Pricing & Solutions Overview</strong> to <code>${visitorData.email}</code>. Please check your inbox in 1–2 minutes!<br><br>
        If you'd like to review your custom setup with Nomena, you can also <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">pick a 15-min strategy call on our calendar</a>.`;
    }
    // 2. Greetings & Pleasantries
    else if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.includes('how are you') || lower.includes('who are you') || lower.includes('good morning') || lower.includes('good afternoon') || lower.includes('good evening')) {
      botBubble.innerHTML = `👋 Hello! I am the <strong>Nexa Logic AI Assistant</strong>.<br><br>I can answer questions about our <strong>24/7 AI Voice Phone Agents</strong>, <strong>WhatsApp Automations</strong>, email our <strong>pricing packages</strong>, or help you book a 15-minute call with Nomena.<br><br>How can I help you today?`;
    }
    // 3. Pricing, Cost & Packages Request
    else if (lower.includes('cost') || lower.includes('charge') || lower.includes('price') || lower.includes('pricing') || lower.includes('rate') || lower.includes('package') || lower.includes('fee') || lower.includes('retainer') || lower.includes('how much') || lower.includes('quote') || lower.includes('budget') || lower.includes('aed') || lower.includes('dollar') || lower.includes('pay')) {
      botBubble.innerHTML = `💰 <strong>Nexa Logic Pricing & Packages:</strong><br><br>
        Because our AI systems are custom-tailored to your monthly call volume, CRM integrations, and business setup, we email our complete <strong>Pricing & Solutions Overview</strong> with exact package breakdowns.<br><br>
        ✉️ <strong>Where should I send your pricing overview?</strong><br>
        Please type your <strong>Email Address</strong> below, and I'll send it straight to your inbox!`;
    }
    // 4. Delivery Timeline & Turnaround
    else if (lower.includes('how long') || lower.includes('delivery') || lower.includes('timeline') || lower.includes('turnaround') || lower.includes('how fast') || lower.includes('time') || lower.includes('launch') || lower.includes('days') || lower.includes('weeks') || lower.includes('deliver a project')) {
      botBubble.innerHTML = `⏱️ <strong>Our Turnkey Delivery Timeline is under 7 Days:</strong><br><br>
        • <strong>Days 1–2:</strong> Discovery & Ingestion of your services, FAQs & pricing.<br>
        • <strong>Days 3–4:</strong> Prompt Engineering, Voice Tuning & Cal.com/CRM Integrations.<br>
        • <strong>Days 5–6:</strong> Rigorous stress-testing, latency optimization (&lt;500ms) & edge-case handling.<br>
        • <strong>Day 7:</strong> 1-Click Live Go-Live on your phone lines and WhatsApp!<br><br>
        Ready to start? <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">Click here to pick your kickoff slot</a>.`;
    }
    // 5. All 8 Agents / What We Build
    else if (lower.includes('what agents') || lower.includes('what do you build') || lower.includes('what do you do') || lower.includes('services') || lower.includes('offerings') || lower.includes('features')) {
      botBubble.innerHTML = `🤖 <strong>We deploy an 8-Channel Autonomous AI Workforce:</strong><br><br>
        1. 🎙️ <strong>24/7 AI Voice Phone Agents</strong> (Sub-500ms live phone calling & calendar booking)<br>
        2. 📲 <strong>WhatsApp Business Agents</strong> (In-chat booking & PDF brochures)<br>
        3. ⚡ <strong>Speed-to-Lead Outbound Callers</strong> (Calls ad leads in &lt;30 seconds)<br>
        4. 🔄 <strong>Cold CRM Reactivation Agents</strong> (Reviving dormant client databases)<br>
        5. 🛡️ <strong>24/7 Tier-1 Support Agents</strong> (Zero hold times & FAQ triage)<br>
        6. 📸 <strong>Instagram DM & Social Lead Agents</strong> (Comment-to-DM automated triggers)<br>
        7. ⭐ <strong>5-Star Google Review Multipliers & SMS Recovery</strong><br>
        8. 🧬 <strong>30-Second Executive Voice Cloning Studio</strong><br><br>
        Which system would solve your biggest bottleneck right now?`;
    }
    // 6. Voice Cloning Tech
    else if (lower.includes('clone') || lower.includes('cloning') || lower.includes('accent') || lower.includes('sound real') || lower.includes('human') || lower.includes('robotic')) {
      botBubble.innerHTML = `🧬 <strong>Hyper-Realistic Neural Voice Cloning:</strong><br><br>
        We clone the voice of the founder, top doctor, or head executive using just a 30–60 second phone recording with <strong>99.8% vocal fidelity</strong>. The AI speaks with your exact cadence, timbre, and regional accents!<br><br>
        You can test our live Voice Cloning Studio right on this page or <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">book a live demo with Nomena</a>.`;
    }
    // 7. Booking / Meeting / Demo
    else if (lower.includes('book') || lower.includes('schedule') || lower.includes('meeting') || lower.includes('demo') || lower.includes('call') || lower.includes('strategy') || lower.includes('consultation') || lower.includes('appointment') || lower.includes('talk')) {
      botBubble.innerHTML = `📅 <strong>Schedule Your 15-Minute AI Strategy Walkthrough:</strong><br><br>
        You can pick a live time slot directly on our calendar: <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">Click here to choose your slot</a>.<br><br>
        Nomena will prepare a custom AI roadmap tailored to your specific business workflows!`;
    }
    // 8. Contact Info / Phone Number / WhatsApp
    else if (lower.includes('phone') || lower.includes('number') || lower.includes('call you') || lower.includes('whatsapp') || lower.includes('hotline') || lower.includes('contact') || lower.includes('reach')) {
      botBubble.innerHTML = `📞 <strong>Direct Contact Channels:</strong><br><br>
        • <strong>24/7 Telephone AI Hotline:</strong> <a href="tel:+971585517132" style="color:#00f0ff; font-family:monospace; text-decoration:underline;">+971 58 551 7132</a> (Tap to dial from phone/Mac)<br>
        • <strong>Official WhatsApp Line:</strong> <code>+971 58 551 7132</code><br>
        • <strong>Direct Email:</strong> <code>hello@getnexalogic.com</code><br><br>
        Elena is live on our phone line right now if you'd like to test an inbound call!`;
    }
    // 9. Integrations & CRM
    else if (lower.includes('crm') || lower.includes('integrate') || lower.includes('hubspot') || lower.includes('gohighlevel') || lower.includes('cal.com') || lower.includes('sheets') || lower.includes('zapier') || lower.includes('make')) {
      botBubble.innerHTML = `⚡ <strong>Turnkey CRM & Workflow Integrations:</strong><br><br>
        We integrate natively with <strong>Cal.com, Google Calendar, GoHighLevel, HubSpot, Salesforce, Airtable, Notion, Make.com, and Zapier</strong>.<br><br>
        All call transcripts, caller recordings, qualified lead cards, and confirmed appointments sync in real time with zero manual data entry.`;
    }
    // 10. Intelligent Name Capture ("my name is X" / "I am X")
    else if (lower.startsWith('my name is ') || lower.startsWith('i am ') || lower.startsWith("i'm ")) {
      const parts = text.split(/is|am|'m/i);
      visitorData.name = parts[1]?.trim() || text;
      botBubble.innerHTML = `Great to meet you, <strong>${visitorData.name}</strong>! 🤝 What is your business name or what questions can I answer about our AI workforce for you?`;
    }
    // 11. Conversational Fallback with Helpful Guidance
    else {
      botBubble.innerHTML = `Thanks for asking! Nexa Logic engineers custom 24/7 Autonomous AI Workforces (Voice, WhatsApp, Instagram & CRM automation) with &lt;7 day turnaround and sub-500ms voice speed.<br><br>
        You can:<br>
        • Ask about <strong>pricing & packages</strong><br>
        • Ask about our <strong>7-day delivery timeline</strong><br>
        • Ask about our <strong>8 autonomous AI agent types</strong><br>
        • Call our 24/7 hotline at <a href="tel:+971585517132" style="color:#00f0ff;">+971 58 551 7132</a><br>
        • Or <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">book a 15-min strategy session on our calendar</a>!`;
    }

    msgContainer.appendChild(botBubble);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 400);
}

function sendQuickChip(questionText) {
  const input = document.getElementById('drawer-input');
  if (input) {
    input.value = questionText;
    sendDrawerMessage();
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Ready
});
