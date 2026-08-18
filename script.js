// Nexa Logic — Interactive Client Experience Scripts

// Formspree Lead Notification Webhook Endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzaqpa';

// 0. Mobile Navigation Drawer Handlers
function toggleMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (btn && drawer) {
    btn.classList.toggle('active');
    drawer.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (btn && drawer) {
    btn.classList.remove('active');
    drawer.classList.remove('active');
  }
}

// 1. Switch Showroom Tabs (Voice, Chat, Routing, Reviews) with Touch & Auto-Scroll
const DEMO_ORDER = ['voice', 'chat', 'routing', 'reviews'];
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
  } else if (type === 'chat') {
    tabs[1]?.classList.add('active');
    document.getElementById('chat-demo-view')?.classList.add('active');
    tabs[1]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  } else if (type === 'routing') {
    tabs[2]?.classList.add('active');
    document.getElementById('routing-demo-view')?.classList.add('active');
    tabs[2]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    if (!document.getElementById('routing-matrix-card')?.innerHTML.trim()) {
      selectRoutingNiche('medspa');
    }
  } else if (type === 'reviews') {
    tabs[3]?.classList.add('active');
    document.getElementById('reviews-demo-view')?.classList.add('active');
    tabs[3]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

// Mobile Touch-Swipe Gesture Engine for Showroom
document.addEventListener('DOMContentLoaded', () => {
  const swipeCard = document.getElementById('demo-swipe-card');
  if (!swipeCard) return;

  let touchStartX = 0;
  let touchEndX = 0;

  swipeCard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  swipeCard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleCardSwipe();
  }, { passive: true });

  function handleCardSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return; // Ignore small accidental taps

    if (diff > 50) {
      // Swiped Left -> Go to Next Demo
      if (currentDemoIndex < DEMO_ORDER.length - 1) {
        switchDemo(DEMO_ORDER[currentDemoIndex + 1]);
      }
    } else if (diff < -50) {
      // Swiped Right -> Go to Prev Demo
      if (currentDemoIndex > 0) {
        switchDemo(DEMO_ORDER[currentDemoIndex - 1]);
      }
    }
  }
});

// 2. Audio & Speech Synthesis Voice Engine
let isCallActive = false;
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
  utterance.rate = 1.05; // Natural conversational tempo
  utterance.pitch = 1.0;
  
  // Pick natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Karen') || v.name.includes('Ava') || v.lang.startsWith('en')));
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

// Run / Toggle Live Voice Call
function runVoiceSim() {
  const btn = document.getElementById('btn-call-sim');
  const transcript = document.getElementById('voice-transcript');
  const prompts = document.getElementById('voice-quick-prompts');
  const status = document.getElementById('voice-audio-status');

  if (!isCallActive) {
    isCallActive = true;
    playPhoneChime();

    btn.innerHTML = '<span>🔴 End Voice Call</span>';
    btn.classList.add('active-call');
    if (prompts) prompts.style.display = 'flex';
    if (status) status.innerHTML = '<span class="pulse-dot" style="background:#22c55e;"></span> <strong>Call Connected:</strong> Speaking with Nexa Voice AI... (Turn your sound on!)';

    const greeting = "Hi there! Thanks for calling Nexa Logic. I am your 24/7 AI voice receptionist. I can answer questions about our automation systems or check open slots on our team's calendar. What questions do you have?";

    transcript.innerHTML = `
      <div class="msg ai-msg">
        <strong>Nexa Voice AI:</strong> "${greeting}"
      </div>
    `;

    speakAI(greeting);

  } else {
    isCallActive = false;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const pulse = document.getElementById('voice-pulse');
    if (pulse) pulse.classList.remove('speaking');

    btn.innerHTML = '<span>▶ Call Nexa Voice AI (Live Audio Demo)</span>';
    btn.classList.remove('active-call');
    if (prompts) prompts.style.display = 'none';
    if (status) status.innerHTML = '<span class="pulse-dot"></span> Call ended. Click above to call again.';
  }
}

// Handle Interactive Voice Questions
function askVoiceQuestion(question) {
  if (!isCallActive) return;

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
    response = "We connect directly with Calendly, Google Calendar, and your CRM. When callers speak with me, I check real-time open slots and lock in confirmed appointments instantly.";
  } else if (q.includes('specialist') || q.includes('doctor') || q.includes('route')) {
    response = "Yes, absolutely! I use semantic intent matching to route callers to specific doctors, attorneys, or sales specialists based on their requested service and location.";
  } else if (q.includes('2 am') || q.includes('night') || q.includes('weekend')) {
    response = "78% of customers book with the first company that answers. I respond in under 5 seconds, 24 hours a day, 365 days a year—even when your office is closed!";
  } else if (q.includes('consultation') || q.includes('schedule') || q.includes('book')) {
    response = "I'd love to get that scheduled! Scroll down to the calendar below to pick a 15-minute slot directly with our engineering team.";
    setTimeout(() => {
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    }, 3500);
  } else {
    response = "That is a great question. Our systems are custom built for your business to eliminate missed calls and follow up on leads in seconds. Would you like to see a custom live demo?";
  }

  setTimeout(() => {
    transcript.innerHTML += `
      <div class="msg ai-msg" style="margin-top: 14px;">
        <strong>Nexa Voice AI:</strong> "${response}"
      </div>
    `;
    transcript.scrollTop = transcript.scrollHeight;
    speakAI(response);
  }, 400);
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

// 4. Interactive ROI Calculator
function calculateROI() {
  const leads = parseInt(document.getElementById('leads-slider').value);
  const clv = parseInt(document.getElementById('clv-slider').value);

  document.getElementById('leads-val').innerText = `${leads} leads`;
  document.getElementById('clv-val').innerText = `$${clv.toLocaleString()}`;

  // Average 25% after-hours / missed calls rate
  const missedLeads = Math.round(leads * 0.25);
  // Average 30% closing rate on recovered leads
  const recoveredRevenue = Math.round(missedLeads * 0.30 * clv);

  document.getElementById('missed-leads').innerText = `${missedLeads} leads`;
  document.getElementById('recovered-rev').innerText = `$${recoveredRevenue.toLocaleString()} / mo`;
}

// ================= 5. FLOATING AI AUTO-AGENT (WITH INSTANT FORMSPREE EMAIL ALERTS) =================
let leadStage = 'ASK_NAME'; // 'ASK_NAME' -> 'ASK_EMAIL' -> 'QUALIFIED'
let visitorData = {
  name: '',
  email: '',
  source: 'Nexa Website Floating AI Agent'
};

function toggleFloatingAgent() {
  const drawer = document.getElementById('ai-chat-drawer');
  if (drawer.style.display === 'none' || drawer.style.display === '') {
    drawer.style.display = 'flex';
    document.getElementById('drawer-input').focus();
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

  // Bot Intake Progression
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'drawer-bubble bot';

    if (leadStage === 'ASK_NAME') {
      visitorData.name = text;
      leadStage = 'ASK_EMAIL';
      botBubble.innerText = `Great to meet you, ${visitorData.name}! What is the best Business Email to send your AI demo notes to?`;
      document.getElementById('drawer-input').placeholder = "Enter your business email...";
    } 
    else if (leadStage === 'ASK_EMAIL') {
      visitorData.email = text;
      leadStage = 'QUALIFIED';
      
      // Dispatch Instant Email Notification via Formspree Webhook
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lead_name: visitorData.name,
          lead_email: visitorData.email,
          lead_source: visitorData.source,
          submitted_at: new Date().toLocaleString()
        })
      })
      .then(response => {
        console.log('⚡ Lead successfully dispatched to Formspree email!');
      })
      .catch(err => {
        console.error('Error sending lead to Formspree:', err);
      });

      // Save lead locally as well
      try {
        localStorage.setItem('nexa_lead_' + Date.now(), JSON.stringify(visitorData));
      } catch(e) {}

      botBubble.innerHTML = `Thanks, ${visitorData.name}! ✅ I've saved your info and notified our team. How can Nexa Logic help your business today? You can ask me any question, or <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">click here to pick a time on our live calendar</a>.`;
      document.getElementById('drawer-input').placeholder = "Ask Nexa AI anything...";
    } 
    else {
      // General Q&A after qualification
      const lower = text.toLowerCase();
      if (lower.includes('voice') || lower.includes('call') || lower.includes('phone')) {
        botBubble.innerHTML = `Our Voice AI agents sound 100% human with &lt;600ms latency. They answer inbound calls 24/7 and book appointments on your calendar. Ready to see a live prototype? <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline;">Click to book a call</a>.`;
      } else if (lower.includes('crm') || lower.includes('integrate') || lower.includes('tools')) {
        botBubble.innerText = "We build turnkey integrations with GoHighLevel, HubSpot, Airtable, Notion, and Google Sheets. All call transcripts and leads sync in real time.";
      } else if (lower.includes('book') || lower.includes('strategy') || lower.includes('audit')) {
        botBubble.innerHTML = `You can pick a time on our live calendar right now! <a href='#booking' onclick='toggleFloatingAgent()' style='color:#00f0ff; text-decoration:underline; font-weight:700;'>Click here to jump to the scheduler</a>.`;
      } else {
        botBubble.innerHTML = `Nexa Logic builds custom autonomous AI systems for your specific business workflows. Would you like to <a href='#booking' onclick='toggleFloatingAgent()' style='color:#00f0ff; text-decoration:underline;'>schedule a quick 15-minute live demo</a>?`;
      }
    }

    msgContainer.appendChild(botBubble);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 700);
}

function sendQuickChip(questionText) {
  document.getElementById('drawer-input').value = questionText;
  sendDrawerMessage();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  calculateROI();
});
