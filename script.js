// Nexa Logic — Interactive Client Experience Scripts

// Formspree Lead Notification Webhook Endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzaqpa';

// 1. Switch Demo Tabs (Voice vs Chat)
function switchDemo(type) {
  const tabs = document.querySelectorAll('.demo-tab');
  const views = document.querySelectorAll('.demo-view');

  tabs.forEach(t => t.classList.remove('active'));
  views.forEach(v => v.classList.remove('active'));

  if (type === 'voice') {
    tabs[0].classList.add('active');
    document.getElementById('voice-demo-view').classList.add('active');
  } else {
    tabs[1].classList.add('active');
    document.getElementById('chat-demo-view').classList.add('active');
  }
}

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

// 3. Interactive In-Page Chat Simulator
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const chatWindow = document.getElementById('chat-window');

  // Append user message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = text;
  chatWindow.appendChild(userBubble);
  input.value = '';

  chatWindow.scrollTop = chatWindow.scrollHeight;

  // AI Response Simulation
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    
    const lower = text.toLowerCase();
    if (lower.includes('crm') || lower.includes('ghl') || lower.includes('hubspot')) {
      botBubble.innerText = "Yes! Our agents connect seamlessly via API/Webhooks into GoHighLevel, HubSpot, Salesforce, Airtable, or Google Sheets with zero manual data entry needed.";
    } else if (lower.includes('demo') || lower.includes('book') || lower.includes('call')) {
      botBubble.innerText = "Awesome! You can scroll right down to our booking calendar below to reserve your 1-on-1 strategy call with our team.";
    } else {
      botBubble.innerText = "Our autonomous agents are custom-trained on your exact company FAQs, services, and pricing rules. Scroll down to choose a time on our live calendar!";
    }

    chatWindow.appendChild(botBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 800);
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
