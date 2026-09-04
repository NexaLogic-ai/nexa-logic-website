// Master Lead Intake & Email Auto-Responder Endpoints (100% Free Google Sheets + Formspree)
const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwVK3RrV3FGGLoh822ID3JVFhVIaqqCitwGjBXXbMuDomDvTUIePJR1Ca9CK6MD2dd3/exec';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzaqpa';

// 0. Dynamic Island Capsule Scroll Spy & Navigation
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('header#hero, section#solutions, section#demo, section#request-demo, section#process, section#showdown, section#booking');
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

// Handle Custom Demo Lead Form Submission (Formspree + Google Sheets)
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

// ================= MASTER SIMULATION LAB TAB SWITCHER =================
// 5 Tabs: Voice, WhatsApp, Instagram, ChatKit/CRM, Voice Cloning
const DEMO_ORDER = ['voice', 'whatsapp', 'instagram', 'chatkit', 'cloning'];
let currentDemoIndex = 0;

function switchDemo(type) {
  const targetType = type || 'voice';

  // 1. Deactivate all tabs, views, and mobile dots
  const allTabs = document.querySelectorAll('.demo-tab');
  const allViews = document.querySelectorAll('.demo-view');
  const allDots = document.querySelectorAll('.m-dot');

  allTabs.forEach(t => t.classList.remove('active'));
  allViews.forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none'; // Explicit inline style override prevents CSS conflicts
  });
  allDots.forEach(d => d.classList.remove('active'));

  // 2. Activate target tab by ID or data attribute or onclick matching
  const tabBtn = document.getElementById(`tab-btn-${targetType}`) || document.querySelector(`.demo-tab[onclick*="${targetType}"]`);
  if (tabBtn) {
    tabBtn.classList.add('active');
    try {
      tabBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } catch (e) {}
  }

  // 3. Activate target view by ID
  const viewEl = document.getElementById(`${targetType}-demo-view`);
  if (viewEl) {
    viewEl.classList.add('active');
    viewEl.style.display = 'block'; // Explicit inline style override ensures visibility
  }

  // 4. Update dot index
  const idx = DEMO_ORDER.indexOf(targetType);
  if (idx !== -1) {
    currentDemoIndex = idx;
    if (allDots[idx]) allDots[idx].classList.add('active');
  }
}

window.switchDemo = switchDemo;

// Jump and switch to specific Simulation Lab tab
function jumpToDemo(type) {
  switchDemo(type);
  const demoSection = document.getElementById('demo');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' });
  }
}

window.jumpToDemo = jumpToDemo;

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
    transcript: "“Hello, thanks for calling Radiance Clinic after-hours emergency line. I understand you have post-procedure swelling. I have logged your patient chart and am immediately connecting you to Dr. Sarah's on-call priority line right now. Please hold for one second while I initiate the direct transfer.”"
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
    return availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
  } else {
    const preferred = ['Daniel', 'Oliver', 'Alex', 'Fred', 'Google UK English Male', 'David', 'George', 'Arthur'];
    for (const name of preferred) {
      const match = availableVoices.find(v => v.name.includes(name));
      if (match) return match;
    }
    return availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
  }
}

function playPhoneChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {}
}

function switchVoiceScenario(id) {
  stopScenarioAudioPlayback();
  currentScenarioId = id;

  const btns = [1, 2, 3];
  btns.forEach(i => {
    const b = document.getElementById(`btn-scen-${i}`);
    if (b) {
      if (i === id) b.classList.add('active');
      else b.classList.remove('active');
    }
  });

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


// ================= 2. WHATSAPP BUSINESS CLOUD AI LAB (TAB 2) =================
function getDubaiCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
}

function appendWhatsAppBubble(sender, contentHtml) {
  const chatWin = document.getElementById('wa-demo-chat-window');
  if (!chatWin) return;

  const bubble = document.createElement('div');
  const timeStr = getDubaiCurrentTime();

  if (sender === 'user') {
    bubble.style.cssText = 'background: #005c4b; color: #e9edef; padding: 10px 14px; border-radius: 8px 8px 0 8px; max-width: 82%; font-size: 0.88rem; line-height: 1.45; align-self: flex-end; box-shadow: 0 2px 4px rgba(0,0,0,0.3);';
    bubble.innerHTML = `${contentHtml}<div style="font-size: 0.68rem; color: #8696a0; text-align: right; margin-top: 4px;">${timeStr} ✓✓</div>`;
  } else {
    bubble.style.cssText = 'background: #202c33; color: #e9edef; padding: 10px 14px; border-radius: 8px 8px 8px 0; max-width: 85%; font-size: 0.88rem; line-height: 1.45; align-self: flex-start; box-shadow: 0 2px 4px rgba(0,0,0,0.3);';
    bubble.innerHTML = `${contentHtml}<div style="font-size: 0.68rem; color: #8696a0; text-align: right; margin-top: 4px;">${timeStr}</div>`;
  }

  chatWin.appendChild(bubble);
  chatWin.scrollTop = chatWin.scrollHeight;
}

function sendWhatsAppQuickReply(text) {
  appendWhatsAppBubble('user', text);
  processWhatsAppAIResponse(text);
}

function sendWhatsAppDemoMessage() {
  const input = document.getElementById('wa-demo-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendWhatsAppBubble('user', text);
  processWhatsAppAIResponse(text);
}

function processWhatsAppAIResponse(userText) {
  const lower = userText.toLowerCase();

  setTimeout(() => {
    // 1. Saturday 11:30 AM Booking
    if (lower.includes('saturday') || lower.includes('11:30') || lower.includes('book') || lower.includes('lock') || lower.includes('reserve') || lower.includes('jaco')) {
      appendWhatsAppBubble('bot', `
        🎉 <strong>Confirmed & Locked In!</strong><br><br>
        I have booked your smile consultation with <strong>Dr. Jaco</strong> for <strong>Saturday at 11:30 AM</strong> at our Dubai Marina clinic.<br><br>
        • <strong>Doctor:</strong> Dr. Jaco (Lead Aesthetic Prosthodontist)<br>
        • <strong>Service:</strong> Comprehensive Smile & Veneer Assessment<br>
        • <strong>Location:</strong> Smile Studio Dubai, Marina Plaza Level 14<br><br>
        📲 An instant SMS calendar invite and Google Map pin have been dispatched to your mobile. Please bring your Emirates ID or Passport upon arrival. See you Saturday!
      `);
    }
    // 2. Payment Plans
    else if (lower.includes('payment') || lower.includes('plan') || lower.includes('finance') || lower.includes('tabby') || lower.includes('tamara') || lower.includes('installment') || lower.includes('0%') || lower.includes('interest')) {
      appendWhatsAppBubble('bot', `
        💳 <strong>Yes, 100% 0% Interest Financing!</strong><br><br>
        We partner directly with <strong>Tabby and Tamara</strong> to split your treatment across <strong>4 easy monthly installments</strong> with zero interest and zero hidden processing fees.<br><br>
        • Porcelain Veneers: from <strong>300 AED / month</strong> (4 installments)<br>
        • Full Hollywood Smile: from <strong>3,200 AED / month</strong><br><br>
        Would you like to reserve our remaining Saturday consultation slot at <strong>11:30 AM</strong> or <strong>3:00 PM</strong> to get your personalized financing breakdown?
      `);
    }
    // 3. Voice Note
    else if (lower.includes('voice') || lower.includes('note') || lower.includes('audio') || lower.includes('listen')) {
      appendWhatsAppBubble('bot', `
        🎧 <strong>Voice Note Processed in 1.4s:</strong><br><br>
        <em>"Voice memo transcribed: 'Hi, I have dental anxiety and wanted to know if you provide conscious sedation for veneer preparation?'"</em><br><br>
        Yes! We offer <strong>certified conscious sleep sedation</strong> administered by licensed anesthetists, ensuring 100% pain-free and anxiety-free veneer appointments.<br><br>
        Would you like me to note sedation preference on your Saturday chart with Dr. Jaco?
      `);
    }
    // 4. Pricing & Veneers General
    else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('veneer') || lower.includes('invisalign') || lower.includes('whitening')) {
      appendWhatsAppBubble('bot', `
        ✨ <strong>Smile Studio Dubai 2026 Price Overview:</strong><br><br>
        • <strong>Emax Porcelain Veneers:</strong> 1,200 AED / tooth<br>
        • <strong>Composite Smile Bonding:</strong> 450 AED / tooth<br>
        • <strong>Laser In-Clinic Teeth Whitening:</strong> 850 AED<br>
        • <strong>Comprehensive 3D Smile Scan:</strong> FREE with treatment<br><br>
        Would you like to come in this Saturday at <strong>11:30 AM</strong> or <strong>3:00 PM</strong> for your free 3D smile scan?
      `);
    }
    // 5. Default Fallback
    else {
      appendWhatsAppBubble('bot', `
        Thanks for asking! Our clinic is located at <strong>Dubai Marina Plaza, Level 14</strong>, open 7 days a week from 9:00 AM to 9:00 PM.<br><br>
        I can lock in your consultation with Dr. Jaco this Saturday, answer pricing questions, or send treatment brochures. How would you like to proceed?
      `);
    }
  }, 450);
}

function resetWhatsAppDemoChat() {
  const chatWin = document.getElementById('wa-demo-chat-window');
  if (!chatWin) return;
  chatWin.innerHTML = `
    <div style="background: #202c33; color: #e9edef; padding: 10px 14px; border-radius: 8px 8px 8px 0; max-width: 82%; font-size: 0.88rem; line-height: 1.45; align-self: flex-start; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      👋 Hello! Welcome to Smile Studio Dubai. I am your 24/7 AI Concierge. How can I help you today?
      <div style="font-size: 0.68rem; color: #8696a0; text-align: right; margin-top: 4px;">10:00 AM</div>
    </div>

    <div style="background: #005c4b; color: #e9edef; padding: 10px 14px; border-radius: 8px 8px 0 8px; max-width: 82%; font-size: 0.88rem; line-height: 1.45; align-self: flex-end; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      Hi! How much are porcelain veneers, and do you have any consultations available with Dr. Jaco this Saturday?
      <div style="font-size: 0.68rem; color: #8696a0; text-align: right; margin-top: 4px;">10:01 AM ✓✓</div>
    </div>

    <div style="background: #202c33; color: #e9edef; padding: 10px 14px; border-radius: 8px 8px 8px 0; max-width: 85%; font-size: 0.88rem; line-height: 1.45; align-self: flex-start; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      Porcelain veneers start from 1,200 AED per tooth. Dr. Jaco has two consultation openings this Saturday:
      <br><br>
      • <strong>11:30 AM</strong><br>
      • <strong>3:00 PM</strong><br><br>
      📄 <em>Attached: Smile_Makeover_Brochure.pdf (2.4 MB)</em><br><br>
      Which time would you like me to lock into Dr. Jaco's calendar for you?
      <div style="font-size: 0.68rem; color: #8696a0; text-align: right; margin-top: 4px;">10:01 AM</div>
    </div>
  `;
}


// ================= 3. INSTAGRAM DM & MULTIMODAL VISION AI LAB (TAB 3) =================
function appendInstagramBubble(sender, contentHtml) {
  const chatWin = document.getElementById('ig-demo-chat-window');
  if (!chatWin) return;

  const bubble = document.createElement('div');

  if (sender === 'user') {
    bubble.style.cssText = 'background: #3797f0; color: #fff; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 0.88rem; line-height: 1.45; align-self: flex-end;';
    bubble.innerHTML = contentHtml;
  } else {
    bubble.style.cssText = 'background: #262626; color: #fff; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 85%; font-size: 0.88rem; line-height: 1.45; align-self: flex-start;';
    bubble.innerHTML = contentHtml;
  }

  chatWin.appendChild(bubble);
  chatWin.scrollTop = chatWin.scrollHeight;
}

function sendInstagramQuickReply(text) {
  appendInstagramBubble('user', text);
  processInstagramAIResponse(text);
}

function sendInstagramDemoMessage() {
  const input = document.getElementById('ig-demo-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendInstagramBubble('user', text);
  processInstagramAIResponse(text);
}

function processInstagramAIResponse(userText) {
  const lower = userText.toLowerCase();

  setTimeout(() => {
    // 1. Thursday 2:00 PM Booking
    if (lower.includes('thursday') || lower.includes('2:00') || lower.includes('2pm') || lower.includes('book') || lower.includes('scan') || lower.includes('schedule')) {
      appendInstagramBubble('bot', `
        🎉 <strong>You're on the schedule!</strong><br><br>
        Dr. Sarah's surgical coordinator has locked in your <strong>Free 3D Smile Assessment</strong> for <strong>Thursday at 2:00 PM</strong> at Radiance Aesthetics (Miami Design District).<br><br>
        📍 <em>Location: 3841 NE 2nd Ave, Suite 300, Miami, FL</em><br>
        📩 We just dispatched a calendar invite and fast-track intake pass directly to your DMs. See you Thursday!
      `);
    }
    // 2. Pricing Comparison (Composite vs Porcelain)
    else if (lower.includes('compare') || lower.includes('composite') || lower.includes('porcelain') || lower.includes('cost') || lower.includes('price') || lower.includes('bonding')) {
      appendInstagramBubble('bot', `
        💎 <strong>Composite Bonding vs. Porcelain Veneers Comparison:</strong><br><br>
        • <strong>Direct Composite Bonding:</strong> $350–$600 per tooth. Completed in a single 1-hour visit. Great for closing minor gaps or chips.<br>
        • <strong>Custom Porcelain Veneers:</strong> $1,200–$1,800 per tooth. Ultra-high durability (15–20 years) with custom stain-resistant ceramic luster.<br><br>
        Would you like to come in this Thursday at 2:00 PM to see a free 3D digital simulation of both options on your smile?
      `);
    }
    // 3. Multimodal Photo Upload Simulation
    else if (lower.includes('photo') || lower.includes('upload') || lower.includes('image') || lower.includes('skin') || lower.includes('pic')) {
      appendInstagramBubble('bot', `
        📸 <em>[AI Multimodal Vision Processor Activated]</em><br><br>
        👁️ <strong>Diagnostic Analysis of [New_Skin_Photo.jpg]:</strong><br>
        • <strong>Skin Tone & Texture:</strong> Fitzpatrick Type III, mild localized hyperpigmentation around malar cheeks.<br>
        • <strong>Recommended Protocol:</strong> 3-Session Pico Laser Toning + SkinVive hydration booster.<br>
        • <strong>Expected Result:</strong> 85% reduction in pigmentation with zero downtime.<br><br>
        Would you like to book a complimentary 15-minute clinical skin scan with Dr. Sarah this Thursday or Friday?
      `);
    }
    // 4. Default Concierge Response
    else {
      appendInstagramBubble('bot', `
        Thanks for messaging! Dr. Sarah specializes in bespoke smile makeovers and facial aesthetics at our Miami Design District clinic.<br><br>
        I can book your free 3D scan for this Thursday at 2:00 PM, compare treatment packages, or analyze a photo of your smile. What would you like to explore?
      `);
    }
  }, 450);
}

function resetInstagramDemoChat() {
  const chatWin = document.getElementById('ig-demo-chat-window');
  if (!chatWin) return;
  chatWin.innerHTML = `
    <div style="background: #262626; color: #fff; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 80%; font-size: 0.88rem; line-height: 1.45; align-self: flex-start;">
      👋 Hey! Thanks for commenting <strong>"VENEERS"</strong> on our Reel! I am Dr. Sarah's AI concierge. Are you looking for smile alignment or a full porcelain makeover?
    </div>

    <div style="background: #3797f0; color: #fff; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 0.88rem; line-height: 1.45; align-self: flex-end;">
      I have a small gap between my two front teeth. Here is a photo! 📸 [Smile_Photo.jpg]
    </div>

    <div style="background: #262626; color: #fff; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 85%; font-size: 0.88rem; line-height: 1.45; align-self: flex-start;">
      👁️ <em>AI Vision Analysis:</em><br>
      I see the mild midline diastema on your upper front incisors! Dr. Sarah can easily close this with either a <strong>1-visit composite bonding</strong> or <strong>2 porcelain veneers</strong>.
      <br><br>
      Would you like to come in for a free 3D smile scan this Thursday at 2:00 PM or Friday at 10:30 AM?
    </div>
  `;
}


// ================= 4. WEB CHATKIT & LIVE CRM WEBHOOK STREAM (TAB 4) =================
function sendChatKitStreamMessage() {
  const input = document.getElementById('chatkit-demo-input');
  const chatStream = document.getElementById('chatkit-demo-stream');
  const crmLog = document.getElementById('crm-demo-webhook-log');
  if (!input || !chatStream) return;

  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  // 1. Append user message to ChatKit Stream (Left)
  const userEl = document.createElement('div');
  userEl.style.cssText = 'background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.25); padding: 10px 14px; border-radius: 12px; align-self: flex-end; color: #fff; max-width: 85%;';
  userEl.innerHTML = text;
  chatStream.appendChild(userEl);
  chatStream.scrollTop = chatStream.scrollHeight;

  const lower = text.toLowerCase();
  const timeStr = new Date().toLocaleTimeString();

  // 2. Stream AI Response & Simultaneously Dispatch Real-Time CRM Webhook Log (Right)
  setTimeout(() => {
    let botReply = '';
    let intentType = 'GENERAL_INQUIRY';
    let leadField = 'treatment_inquiry';

    if (lower.includes('invisalign') || lower.includes('align') || lower.includes('braces')) {
      botReply = '🦷 <strong>Invisalign Full Treatment</strong> starts from $3,800 or $149/month with 0% financing. Would you like me to book your complimentary 3D iTero scan with Dr. Sarah for Thursday at 3:00 PM?';
      intentType = 'PRICING_INVISALIGN';
      leadField = 'Invisalign Package ($3,800)';
    } else if (lower.includes('3pm') || lower.includes('3:00') || lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
      botReply = "✅ <strong>Booked for 3:00 PM!</strong> I have reserved your consultation and synced your appointment directly with Dr. Sarah's Google Calendar & EHR chart.";
      intentType = 'APPOINTMENT_CONFIRMED';
      leadField = 'Booked: Thursday 3:00 PM';
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      botReply = '💰 Our treatments range from <strong>$450 for Composite Bonding</strong> to <strong>$1,200/tooth for Handcrafted Porcelain Veneers</strong>. I can lock in your free 3D smile assessment today!';
      intentType = 'PRICING_REQUEST';
      leadField = 'Pricing Breakdown Sent';
    } else {
      botReply = '👋 Thanks for inquiring! Nexa Logic AI Receptionists respond in &lt;500ms, answer custom clinic FAQs, and auto-sync qualified appointments to your CRM in real time.';
      intentType = 'LIVE_CHATKIT_INTERACTION';
      leadField = 'Interactive Lead Session';
    }

    // Append bot bubble to Left ChatKit
    const botEl = document.createElement('div');
    botEl.style.cssText = 'background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); padding: 10px 14px; border-radius: 12px; color: #f1f5f9; max-width: 90%;';
    botEl.innerHTML = botReply;
    chatStream.appendChild(botEl);
    chatStream.scrollTop = chatStream.scrollHeight;

    // Append Real-Time Webhook Log to Right CRM Window
    if (crmLog) {
      const logEntry = document.createElement('div');
      logEntry.style.cssText = 'background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.3); padding: 8px 10px; border-radius: 6px; color: #e9d5ff; font-family: var(--font-mono); font-size: 0.74rem; line-height: 1.4;';
      logEntry.innerHTML = `
        <span style="color:#22c55e;">[${timeStr}] POST /api/v1/crm/webhook (200 OK)</span><br>
        <span style="color:#a855f7;">• Event:</span> ${intentType}<br>
        <span style="color:#00f0ff;">• Payload:</span> "${text}"<br>
        <span style="color:#fbbf24;">• Action:</span> Appended Row #51 to Google Sheets & Jane EHR
      `;
      crmLog.appendChild(logEntry);
      crmLog.scrollTop = crmLog.scrollHeight;
    }
  }, 350);
}


// ================= 5. EXECUTIVE NEURAL VOICE CLONING STUDIO (TAB 5) =================
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
    script: "“Yo! What's up, it's Jax from Crown & Blade! I'm behind the chair with clippers right now, but you can book a fresh fade or beard sculpt with me or any of my barbers this Thursday. You want morning or afternoon?”",
    sampleText: "“What's going on guys, it's Jax from Crown & Blade. Testing 1-2-3 for our shop voice cloning reference audio.”",
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

// ================= 6. LIVE SHOWDOWN SPEED SIMULATOR =================
let isSpeedRunning = false;
function runSpeedSimulation() {
  if (isSpeedRunning) return;
  isSpeedRunning = true;

  const btn = document.getElementById('btn-start-speed-test');
  const aiStatus = document.getElementById('speed-ai-status');
  const humanStatus = document.getElementById('speed-human-status');
  const aiTimer = document.getElementById('speed-ai-timer');
  const humanTimer = document.getElementById('speed-human-timer');

  if (btn) btn.disabled = true;
  if (aiStatus) aiStatus.innerHTML = '⚡ Dialing inbound line...';
  if (humanStatus) humanStatus.innerHTML = '📞 Ringing front desk phone...';

  playPhoneChime();

  // AI answers on Ring 1 (< 500ms)
  setTimeout(() => {
    if (aiStatus) {
      aiStatus.innerHTML = '🟢 <strong>Connected in 420ms!</strong> Elena answers: <em>"Thanks for calling! How can I help you today?"</em>';
      aiStatus.style.color = '#22c55e';
    }
    if (aiTimer) aiTimer.textContent = '0.42s (Instant Answer)';
  }, 420);

  // Human front desk simulation: Ring 1 (2s), Ring 2 (5s), Ring 3 (8s) -> Voicemail (12s)
  setTimeout(() => {
    if (humanStatus) humanStatus.innerHTML = '🔔 Ringing... (No answer yet)';
  }, 2000);

  setTimeout(() => {
    if (humanStatus) humanStatus.innerHTML = '🔔 Staff busy with in-clinic patient...';
  }, 5000);

  setTimeout(() => {
    if (humanStatus) {
      humanStatus.innerHTML = '❌ <strong>Hit Voicemail after 12 seconds:</strong> <em>"Sorry we missed your call. Please leave a message..."</em> (Lead Lost to Competitor)';
      humanStatus.style.color = '#ef4444';
    }
    if (humanTimer) humanTimer.textContent = '12.4s (Voicemail)';
    if (btn) {
      btn.disabled = false;
      btn.textContent = '⚡ Re-Test Inbound Speed Showdown';
    }
    isSpeedRunning = false;
  }, 8000);
}


// ================= 7. FLOATING 24/7 AI CHAT DRAWER =================
let isDrawerOpen = false;
let visitorData = {
  name: '',
  email: '',
  phone: '',
  niche: ''
};

function toggleFloatingAgent() {
  const drawer = document.getElementById('ai-chat-drawer');
  if (!drawer) return;

  isDrawerOpen = !isDrawerOpen;
  if (isDrawerOpen) {
    drawer.style.display = 'flex';
    const input = document.getElementById('drawer-input');
    if (input) setTimeout(() => input.focus(), 200);
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

    // 1. Email Extraction & Multi-Channel Dispatch
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      visitorData.email = emailMatch[0];

      // Dispatch Instant Lead to Google Sheets
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

      // Dispatch Instant Lead to Formspree
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
        • <strong>Official WhatsApp Line:</strong> <a href="https://wa.me/971585517132" target="_blank" style="color:#25D366; font-family:monospace; font-weight:700; text-decoration:underline;">+971 58 551 7132</a> (Tap to chat or send voice note)<br>
        • <strong>Live Strategy Consultations:</strong> <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">Pick a 15-min slot on Cal.com</a><br>
        • <strong>Direct Email:</strong> <code>hello@getnexalogic.com</code><br><br>
        Our AI assistants are online 24/7 across WhatsApp and web!`;
    }
    // 9. Integrations & CRM
    else if (lower.includes('crm') || lower.includes('integrate') || lower.includes('hubspot') || lower.includes('gohighlevel') || lower.includes('cal.com') || lower.includes('sheets') || lower.includes('zapier') || lower.includes('make')) {
      botBubble.innerHTML = `⚡ <strong>Turnkey CRM & Workflow Integrations:</strong><br><br>
        We integrate natively with <strong>Cal.com, Google Calendar, GoHighLevel, HubSpot, Salesforce, Airtable, Notion, Make.com, and Zapier</strong>.<br><br>
        All call transcripts, caller recordings, qualified lead cards, and confirmed appointments sync in real time with zero manual data entry.`;
    }
    // 10. Conversational Fallback with Helpful Guidance
    else {
      botBubble.innerHTML = `Thanks for asking! Nexa Logic engineers custom 24/7 Autonomous AI Workforces (Voice, WhatsApp, Instagram & CRM automation) with &lt;7 day turnaround and sub-500ms voice speed.<br><br>
        You can:<br>
        • Ask about <strong>pricing & packages</strong><br>
        • Ask about our <strong>7-day delivery timeline</strong><br>
        • Ask about our <strong>8 autonomous AI agent types</strong><br>
        • Message our 24/7 WhatsApp line at <a href="https://wa.me/971585517132" target="_blank" style="color:#25D366; font-weight:700;">+971 58 551 7132</a><br>
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

// ================= 8. GLOBAL EVENT LISTENERS & INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  // Bind click handlers directly to all 5 simulation lab tab buttons
  const tabMapping = {
    'tab-btn-voice': 'voice',
    'tab-btn-whatsapp': 'whatsapp',
    'tab-btn-instagram': 'instagram',
    'tab-btn-chatkit': 'chatkit',
    'tab-btn-cloning': 'cloning'
  };

  Object.keys(tabMapping).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchDemo(tabMapping[id]);
      });
    }
  });

  // Touch Swipe Support for Mobile Showroom Card
  const swipeCard = document.getElementById('demo-swipe-card');
  if (swipeCard) {
    let touchStartX = 0;
    let touchEndX = 0;

    swipeCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    swipeCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) {
          // Swipe Left -> Next Tab
          currentDemoIndex = (currentDemoIndex + 1) % DEMO_ORDER.length;
        } else {
          // Swipe Right -> Prev Tab
          currentDemoIndex = (currentDemoIndex - 1 + DEMO_ORDER.length) % DEMO_ORDER.length;
        }
        switchDemo(DEMO_ORDER[currentDemoIndex]);
      }
    }, { passive: true });
  }

  // Ensure initial Voice Lab tab is active and visible
  switchDemo('voice');
});
