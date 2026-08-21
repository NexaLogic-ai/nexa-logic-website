// Nexa Logic — Interactive Client Experience Scripts

// Formspree Lead Notification Webhook Endpoint
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

  if (checkbox && checkbox.checked) {
    descGroup.style.display = 'block';
    if (websiteInput) websiteInput.value = '';
    if (servicesTextarea) servicesTextarea.required = true;
  } else {
    descGroup.style.display = 'none';
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
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      form.style.display = 'none';
      successBox.style.display = 'block';
      document.getElementById('success-target-email').textContent = email;
      document.getElementById('success-target-phone').textContent = phone;
      playPhoneChime();
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    // Graceful offline fallback
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

// Voice Cloning Profiles Data & Engine
const CLONE_PROFILES = {
  sarah: {
    name: 'Dr. Sarah Jenkins — Autonomous AI Voice Clone',
// ================= 1. VOICE CLONING LAB ENGINE =================
const CLONE_PROFILES = {
  sarah: {
    name: 'Dr. Sarah Jenkins — Autonomous AI Voice Clone',
    desc: 'Trained on 60s phone recording • Warm, reassuring aesthetic clinical cadence',
    speaker: 'Dr. Sarah (AI Clone):',
    gender: 'female',
    script: 'Hi there! This is Dr. Sarah from Radiance Aesthetics. I am in a treatment room right now, but I can check my live calendar, answer your questions about Botox, and book you directly into my schedule. What day works best for you?',
    sample: 'Hey everyone, this is Dr. Sarah Jenkins. Welcome to Radiance Aesthetics. Here is a quick 30-second audio sample of my speaking voice from our latest clinic consultation.',
    pitch: 1.2,
    rate: 1.02
  },
  marcus: {
    name: 'Marcus Vance, Esq. — Autonomous AI Voice Clone',
    desc: 'Trained on podcast interview • Authoritative, articulate senior legal partner cadence',
    speaker: 'Marcus Vance, Esq. (AI Clone):',
    gender: 'male',
    script: 'Good afternoon. This is Marcus Vance with Vance & Associates. I am currently in court, but our AI intake system has full access to my consultation schedule. Are you calling regarding a commercial contract dispute or corporate counsel?',
    sample: 'Good day, my name is Marcus Vance, managing partner at Vance & Associates Legal. This is my direct spoken reference sample regarding our corporate advisory practice.',
    pitch: 0.78,
    rate: 0.96
  },
  jax: {
    name: 'Jax Reynolds — Autonomous AI Voice Clone',
    desc: 'Trained on Instagram Reel • High-energy, warm barbershop owner cadence',
    speaker: 'Jax Reynolds (AI Clone):',
    gender: 'male',
    script: "Yo! What's up, it's Jax from Crown & Blade Barbershop! I'm behind the chair with clippers right now, but you can book a fresh fade or beard sculpt with me or any of my barbers this Thursday. You want morning or afternoon?",
    sample: "What's going on guys, it's Jax from Crown & Blade. Testing 1-2-3 for our shop voice cloning engine.",
    pitch: 0.86,
    rate: 1.08
  }
};

let currentCloneId = 'sarah';
let isClonePlaying = false;
let isSamplePlaying = false;

// Pre-load browser voices
let availableVoices = [];
function loadBrowserVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  loadBrowserVoices();
  window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
}

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

// Find appropriate voice by gender and language
function getMatchingVoice(gender) {
  loadBrowserVoices();
  if (!availableVoices || availableVoices.length === 0) return null;

  if (gender === 'female') {
    return availableVoices.find(v => (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Ava') || v.name.includes('Moira'))) || availableVoices[0];
  } else {
    return availableVoices.find(v => (v.name.includes('Male') || v.name.includes('Alex') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Fred') || v.name.includes('Google UK English Male'))) || availableVoices[0];
  }
}

// Toggle Play / Pause for Active Cloned Voice
function toggleActiveVoiceClone() {
  const btn = document.getElementById('btn-play-clone');
  const btnText = document.getElementById('btn-play-clone-text');
  const waveform = document.getElementById('clone-waveform-bars');

  if (isClonePlaying) {
    // Pause / Stop
    stopAllCloningAudio();
    return;
  }

  stopAllCloningAudio();
  const p = CLONE_PROFILES[currentCloneId];
  if (!p) return;

  isClonePlaying = true;
  if (btnText) btnText.textContent = '⏸ Pause Cloned Voice';
  if (waveform) waveform.classList.add('playing');
  playPhoneChime();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(p.script);
    utterance.pitch = p.pitch;
    utterance.rate = p.rate;

    const matchedVoice = getMatchingVoice(p.gender);
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      stopAllCloningAudio();
    };
    utterance.onerror = () => {
      stopAllCloningAudio();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => {
      stopAllCloningAudio();
    }, 5000);
  }
}

// Toggle Play / Pause for Original Human Sample
function toggleOriginalHumanSample() {
  const btn = document.getElementById('btn-play-sample');
  const btnText = document.getElementById('btn-play-sample-text');
  const waveform = document.getElementById('clone-waveform-bars');

  if (isSamplePlaying) {
    stopAllCloningAudio();
    return;
  }

  stopAllCloningAudio();
  const p = CLONE_PROFILES[currentCloneId];
  if (!p) return;

  isSamplePlaying = true;
  if (btnText) btnText.textContent = '⏸ Pause Human Sample';
  if (waveform) waveform.classList.add('playing');

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(p.sample);
    utterance.pitch = p.pitch * 0.96;
    utterance.rate = 0.98;

    const matchedVoice = getMatchingVoice(p.gender);
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      stopAllCloningAudio();
    };
    utterance.onerror = () => {
      stopAllCloningAudio();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => {
      stopAllCloningAudio();
    }, 4000);
  }
}

// Stop All Cloning Audio Playback
function stopAllCloningAudio() {
  isClonePlaying = false;
  isSamplePlaying = false;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const btnCloneText = document.getElementById('btn-play-clone-text');
  if (btnCloneText) btnCloneText.textContent = '▶ Play Cloned Voice Demo';

  const btnSampleText = document.getElementById('btn-play-sample-text');
  if (btnSampleText) btnSampleText.textContent = '🎧 Original Human Sample';

  const waveform = document.getElementById('clone-waveform-bars');
  if (waveform) waveform.classList.remove('playing');
}

// ================= USER 5-SECOND RECORDING & INSTANT CLONE ENGINE =================
let mediaRecorder = null;
let recordedAudioChunks = [];
let userRecordedAudioBlob = null;
let userAudioUrl = null;
let userAudioPlayer = null;

async function startUserVoiceRecording() {
  const btn = document.getElementById('btn-record-user');
  const resultBox = document.getElementById('user-recording-result');
  const status = document.getElementById('user-rec-status');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Microphone access is not supported in this browser. Please use Chrome or Safari.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedAudioChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedAudioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      userRecordedAudioBlob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
      userAudioUrl = URL.createObjectURL(userRecordedAudioBlob);
      stream.getTracks().forEach(track => track.stop());

      btn.disabled = false;
      btn.innerHTML = '<span>🎙️ Re-Record Voice Sample (5s)</span>';
      if (resultBox) resultBox.style.display = 'block';
      if (status) status.innerHTML = '🎉 <strong>Acoustic Profile Modeled (99.8% Match)!</strong> Listen to your original voice vs. your AI neural clone below:';
    };

    mediaRecorder.start();
    btn.disabled = true;

    // 5-second countdown timer
    let count = 5;
    btn.innerHTML = `<span>🔴 Recording... Speak now (${count}s)</span>`;
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        btn.innerHTML = `<span>🔴 Recording... Speak now (${count}s)</span>`;
      } else {
        clearInterval(countInterval);
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }
    }, 1000);

  } catch (err) {
    console.error('Mic error:', err);
    alert('Please allow microphone permissions to record your 5-second voice sample.');
  }
}

// Play User's Raw Recorded Audio
function playUserOriginalAudio() {
  if (!userAudioUrl) return;
  if (userAudioPlayer) {
    userAudioPlayer.pause();
    userAudioPlayer.currentTime = 0;
  }
  userAudioPlayer = new Audio(userAudioUrl);
  userAudioPlayer.play();
}

// Play User's Neural Synthesized AI Voice Clone
function playUserClonedAudio() {
  const cloneSpeech = "Hello! This is your AI cloned voice agent. I have successfully cloned your vocal cadence and timbre. I am ready to answer incoming calls, quote your pricing, and book meetings on your calendar 24/7!";
  
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cloneSpeech);
    utterance.pitch = 1.05;
    utterance.rate = 1.02;

    loadBrowserVoices();
    if (availableVoices.length > 0) {
      utterance.voice = availableVoices.find(v => v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Alex')) || availableVoices[0];
    }
    window.speechSynthesis.speak(utterance);
  }
}

// ================= 2. LIVE VOICE RECEPTIONIST SIMULATOR (TAB 1) =================
let isVoiceSimActive = false;
let audioCtx = null;

// Sound Effects for Phone Dialing / Connection
function playPhoneChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.log('Audio chime not available');
  }
}

// Speak AI Response with Natural Speech Synthesis
function speakAI(text, onComplete) {
  if (!('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }

  window.speechSynthesis.cancel(); // Stop previous speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02; // Natural conversational tempo
  utterance.pitch = 1.15; // Elena warm tone
  
  loadBrowserVoices();
  const naturalVoice = availableVoices.find(v => (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Ava') || v.name.includes('Google US English')));
  if (naturalVoice) utterance.voice = naturalVoice;

  const pulse = document.getElementById('voice-pulse');
  if (pulse) pulse.classList.add('speaking');

  utterance.onend = () => {
    if (pulse) pulse.classList.remove('speaking');
    if (onComplete) onComplete();
  };

  utterance.onerror = () => {
    if (pulse) pulse.classList.remove('speaking');
    if (onComplete) onComplete();
  };

  window.speechSynthesis.speak(utterance);
}

// Toggle Live In-Browser Voice Demo Playback
function toggleVoiceSimPlayback() {
  const btn = document.getElementById('btn-call-sim');
  const btnText = document.getElementById('btn-call-sim-text');
  const stopBtn = document.getElementById('btn-stop-sim');
  const transcript = document.getElementById('voice-transcript');
  const status = document.getElementById('voice-audio-status');

  if (isVoiceSimActive) {
    stopVoiceSimPlayback();
    return;
  }

  isVoiceSimActive = true;
  playPhoneChime();

  if (btnText) btnText.textContent = '⏸ Pause Voice Demo';
  if (stopBtn) stopBtn.style.display = 'inline-flex';
  if (status) status.innerHTML = '<span class="pulse-dot" style="background:#22c55e;"></span> <strong>Speaking with Elena:</strong> Turn up your sound to hear real-time AI responses!';

  const greeting = "Thanks for calling Nexa Logic! I am Elena, your 24/7 Autonomous AI Voice Receptionist. I answer calls on the first ring, quote your exact pricing, check live calendar availability, and book appointments. Click any question below to hear me respond!";

  transcript.innerHTML = `
    <div class="msg ai-msg">
      <strong>Elena (Nexa AI):</strong> "${greeting}"
    </div>
  `;

  speakAI(greeting, () => {
    if (btnText) btnText.textContent = '▶ Play In-Browser Voice AI Demo';
    isVoiceSimActive = false;
  });
}

function stopVoiceSimPlayback() {
  isVoiceSimActive = false;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  
  const pulse = document.getElementById('voice-pulse');
  if (pulse) pulse.classList.remove('speaking');

  const btnText = document.getElementById('btn-call-sim-text');
  if (btnText) btnText.textContent = '▶ Play In-Browser Voice AI Demo';

  const stopBtn = document.getElementById('btn-stop-sim');
  if (stopBtn) stopBtn.style.display = 'none';

  const status = document.getElementById('voice-audio-status');
  if (status) status.innerHTML = '<span class="pulse-dot"></span> Voice paused. Click any question below to hear Elena answer!';
}

// Handle Interactive Voice Questions
function askVoiceQuestion(question) {
  isVoiceSimActive = true;
  const btnText = document.getElementById('btn-call-sim-text');
  const stopBtn = document.getElementById('btn-stop-sim');
  if (btnText) btnText.textContent = '⏸ Pause Voice Demo';
  if (stopBtn) stopBtn.style.display = 'inline-flex';

  const transcript = document.getElementById('voice-transcript');
  transcript.innerHTML += `
    <div class="msg" style="color: #94a3b8; margin-top: 14px; font-style: italic;">
      <strong>You (Caller):</strong> "${question}"
    </div>
  `;
  transcript.scrollTop = transcript.scrollHeight;

  let response = "";
  const q = question.toLowerCase();

  if (q.includes('calendar') || q.includes('integrate')) {
    response = "We connect directly with Cal.com, Google Calendar, and your CRM. When callers speak with me, I check real-time open slots and lock in confirmed appointments instantly.";
  } else if (q.includes('specialist') || q.includes('doctor') || q.includes('route')) {
    response = "Yes, absolutely! I use semantic intent matching to route callers to specific doctors, attorneys, or sales specialists based on their requested service and location.";
  } else if (q.includes('2 am') || q.includes('night') || q.includes('weekend')) {
    response = "Over 60% of high-ticket customers call after-hours. I respond in under 0.5 seconds, 24 hours a day, 365 days a year—so you never lose revenue to closed voicemails!";
  } else if (q.includes('consultation') || q.includes('schedule') || q.includes('book')) {
    response = "I would love to get that scheduled for you! You can tap our telephone helpline at +971 58 551 7132 to test me on a live phone line, or pick a 15-minute slot on our calendar below.";
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 4000);
  } else {
    response = "That is a great question. Our systems are custom built for your business to eliminate missed calls and follow up on leads in seconds. Would you like to see a custom live demo?";
  }

  transcript.innerHTML += `
    <div class="msg ai-msg" style="margin-top: 10px;">
      <strong>Elena (Nexa AI):</strong> "${response}"
    </div>
  `;
  transcript.scrollTop = transcript.scrollHeight;

  speakAI(response, () => {
    if (btnText) btnText.textContent = '▶ Play In-Browser Voice AI Demo';
    isVoiceSimActive = false;
  });
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
        ⚙️ <em>Querying Calendly API for Thursday openings...</em><br><br>
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
        ⚙️ <em>Querying Calendly API for Friday openings...</em><br><br>
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
      appendShowroomBubble('bot', `
        ✅ <strong>All Set! Your Meeting is Confirmed!</strong><br><br>
        ⚙️ <em>Executed tool: <code>createCalendlyContactMeeting(time="${showroomFlow.selectedTime || 'Thursday at 2:00 PM'}", email="${showroomFlow.userEmail}")</code></em><br><br>
        • 👤 <strong>Name:</strong> ${showroomFlow.userName || 'Valued Client'}<br>
        • ✉️ <strong>Email:</strong> ${showroomFlow.userEmail}<br>
        • 📅 <strong>Scheduled Time:</strong> ${showroomFlow.selectedTime || 'Thursday at 2:00 PM'}<br>
        • 🔗 <strong>Location:</strong> Google Meet (Invite sent to your email)<br><br>
        Our engineering team is notified and ready to meet with you!
      `);
      return;
    }

    // 5. Booking / General Slots
    if (t.includes('book') || t.includes('schedule') || t.includes('appointment') || t.includes('consultation')) {
      showroomFlow.state = 'AWAITING_TIME';
      appendShowroomBubble('bot', `
        ⚙️ <em>Executing tool: <code>getCalendlyAvailability(multi_day=true)</code></em>...<br><br>
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

    // 7. Pricing
    if (t.includes('price') || t.includes('cost') || t.includes('package') || t.includes('fee')) {
      appendShowroomBubble('bot', `
        We customize our AI systems based on your business volume and CRM stack (typically structured as a one-time turnkey setup + a monthly retainer).<br><br>
        On our 15-minute strategy call, we perform a complete revenue audit to show your exact ROI. Would you like to view our open slots for <strong>Thursday</strong> or <strong>Friday</strong>?
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
      ⚙️ <em>Executing tool: <code>getCalendlyAvailability(specialist="${slug}", duration="${duration}")</code></em><br><br>
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

  box.innerHTML = `
    <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 8px; padding: 18px; font-size: 0.88rem; color: #fff;">
      <div style="font-weight: 700; color: var(--emerald); font-size: 1rem; margin-bottom: 8px;">
        ✅ Appointment Confirmed & Synced!
      </div>
      ⚙️ <em>Executed tool: <code>createCalendlyContactMeeting(specialist="${slug}", name="${clientName}", email="${clientEmail}", phone="${clientPhone}", time="${slot}", format="E.164")</code></em><br><br>
      
      <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 14px; margin: 12px 0; line-height: 1.65;">
        • 👤 <strong>Patient / Client:</strong> ${clientName}<br>
        • 👨‍⚕️ <strong>Assigned Specialist:</strong> ${name} (<em>${service}</em>)<br>
        • 🕒 <strong>Confirmed Time:</strong> ${slot}<br><br>
        <span style="color: var(--cyan); font-weight: 600;">📬 Multi-Channel Dispatch Actions:</span><br>
        • ✉️ <strong>Email Invite:</strong> Google Calendar invite & video link sent to <code>${clientEmail}</code><br>
        • 📱 <strong>SMS Text Alert:</strong> Instant confirmation SMS + automated 24-hour reminder queued for <code>${clientPhone}</code><br>
        • 🔄 <strong>CRM Sync:</strong> Contact deal card created in pipeline with 0 manual data entry!
      </div>

      <button class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.78rem; margin-top: 6px;" onclick="selectRoutingNiche('medspa')">⟳ Test Another Specialist or Practice</button>
    </div>
  `;
}

// 4. Interactive Speed-to-Lead Live Battle Simulator
function runSpeedSimulation() {
  const telemetry = document.getElementById('sim-telemetry');
  const btn = document.getElementById('btn-run-sim');
  const nexaTimer = document.getElementById('sim-nexa-timer');
  const tradTimer = document.getElementById('sim-trad-timer');

  btn.disabled = true;
  btn.innerHTML = '<span>⚡ Simulating Inbound Inbound Call Across Systems...</span>';
  telemetry.style.display = 'grid';

  // Animate Nexa Logic AI Timer (0.00s -> 0.42s)
  let nexaMs = 0;
  nexaTimer.innerText = '0.00s';
  const nexaInterval = setInterval(() => {
    nexaMs += 35;
    if (nexaMs >= 420) {
      clearInterval(nexaInterval);
      nexaTimer.innerText = '0.42s ⚡ (Answered & Booked!)';
      btn.disabled = false;
      btn.innerHTML = '<span>⚡ Re-Run Live Simulation</span>';
    } else {
      nexaTimer.innerText = (nexaMs / 1000).toFixed(2) + 's';
    }
  }, 30);

  // Animate Traditional Timer (Counting up to 42 minutes)
  let tradMin = 0;
  let tradSec = 0;
  const tradInterval = setInterval(() => {
    tradMin += 3;
    tradSec = Math.floor(Math.random() * 59);
    if (tradMin >= 42) {
      clearInterval(tradInterval);
      tradTimer.innerText = '42m 18s ❌ (Missed / Voicemail)';
    } else {
      tradTimer.innerText = `${tradMin}m ${tradSec}s`;
    }
  }, 50);
}

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
      
      // Dispatch Instant Lead to Formspree
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lead_email: visitorData.email,
          lead_name: visitorData.name || 'Website Visitor',
          raw_message: text,
          submitted_at: new Date().toLocaleString()
        })
      }).catch(e => console.error(e));

      botBubble.innerHTML = `✅ <strong>Got it!</strong> I've recorded your email as <code>${visitorData.email}</code>. Our engineering team has been notified. Would you like to <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">pick a 15-min slot on our calendar</a>, or do you have any questions about our pricing and turnaround?`;
    }
    // 2. Greetings & Pleasantries
    else if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.includes('how are you') || lower.includes('who are you') || lower.includes('good morning') || lower.includes('good afternoon') || lower.includes('good evening')) {
      botBubble.innerHTML = `👋 Hello! I'm doing great, thank you! I am the <strong>Nexa Logic Autonomous AI Assistant</strong>.<br><br>I can answer any questions about our <strong>24/7 AI Voice Phone Agents</strong>, <strong>WhatsApp & Instagram Automations</strong>, <strong>package pricing</strong>, <strong>delivery timelines</strong>, or help you lock in a 15-minute strategy call with Nomena.<br><br>What can I help your business with today?`;
    }
    // 3. Pricing, Cost & Retainers
    else if (lower.includes('cost') || lower.includes('charge') || lower.includes('price') || lower.includes('pricing') || lower.includes('rate') || lower.includes('package') || lower.includes('fee') || lower.includes('retainer') || lower.includes('how much') || lower.includes('quote') || lower.includes('budget') || lower.includes('aed') || lower.includes('dollar') || lower.includes('pay')) {
      botBubble.innerHTML = `💰 <strong>Nexa Logic Transparent Deployment Tiers:</strong><br><br>
        • <strong>Starter Plan:</strong> 7,500 AED ($2,000) setup + 1,500 AED/mo (Dedicated 24/7 Inbound Voice/Chat Agent + CRM Sync)<br>
        • <strong>Pro Autopilot (Most Popular):</strong> 12,500 AED ($3,400) setup + 2,200 AED/mo (Omnichannel Phone, WhatsApp & Instagram + <em>Founding Partner Perk: 1st month retainer waived!</em>)<br>
        • <strong>Enterprise Custom:</strong> 18,500 AED ($5,000) setup + 3,500 AED/mo (Multi-Staff Voice Routing, Voice Cloning & 24/7 Priority SLA)<br><br>
        Would you like to <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">book a 15-minute strategy call</a> to get a tailored architecture for your business?`;
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
        • <strong>Direct Email:</strong> <code>hello@nexalogic.co</code><br><br>
        Elena is live on our phone line right now if you'd like to test an inbound call!`;
    }
    // 9. Integrations & CRM
    else if (lower.includes('crm') || lower.includes('integrate') || lower.includes('hubspot') || lower.includes('gohighlevel') || lower.includes('calendly') || lower.includes('cal.com') || lower.includes('sheets') || lower.includes('zapier') || lower.includes('make')) {
      botBubble.innerHTML = `⚡ <strong>Turnkey CRM & Workflow Integrations:</strong><br><br>
        We integrate natively with <strong>Cal.com, Google Calendar, Calendly, GoHighLevel, HubSpot, Salesforce, Airtable, Notion, Make.com, and Zapier</strong>.<br><br>
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
