// Nexa Logic — Interactive Client Experience Scripts

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

// 2. Voice Call Simulator
let isCallActive = false;
function runVoiceSim() {
  const btn = document.getElementById('btn-call-sim');
  const transcript = document.getElementById('voice-transcript');

  if (!isCallActive) {
    isCallActive = true;
    btn.innerHTML = '<span>🔴 End Voice Call</span>';
    btn.classList.add('active-call');

    transcript.innerHTML = `
      <div class="msg ai-msg">
        <strong>Nexa Voice AI:</strong> "Hi there! Thanks for calling Nexa Logic. I am an autonomous conversational receptionist. I can answer questions about our AI systems or check availability on our team's calendar. What questions do you have?"
      </div>
    `;

    setTimeout(() => {
      transcript.innerHTML += `
        <div class="msg" style="color: #94a3b8; margin-top: 12px; font-style: italic;">
          <strong>Caller:</strong> "Can you tell me how your AI voice receptionist integrates with our clinic's calendar?"
        </div>
      `;
    }, 2500);

    setTimeout(() => {
      transcript.innerHTML += `
        <div class="msg ai-msg" style="margin-top: 12px;">
          <strong>Nexa Voice AI:</strong> "We connect directly with Calendly, Google Calendar, or your EHR/CRM. When callers speak with me, I check real-time open slots and lock in confirmed appointments instantly. Would you like to reserve a 15-minute strategy call to see a live demo for your business?"
        </div>
      `;
    }, 5500);

  } else {
    isCallActive = false;
    btn.innerHTML = '<span>▶ Start Live Voice Call Demo</span>';
    btn.classList.remove('active-call');
  }
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

// ================= 5. FLOATING AI AUTO-AGENT (GUIDED LEAD INTAKE) =================
let leadStage = 'ASK_NAME'; // 'ASK_NAME' -> 'ASK_EMAIL' -> 'QUALIFIED'
let visitorData = {
  name: '',
  email: '',
  query: ''
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
      
      // Save lead locally
      console.log('⚡ New Lead Captured by Bot:', visitorData);
      try {
        localStorage.setItem('nexa_lead_' + Date.now(), JSON.stringify(visitorData));
      } catch(e) {}

      botBubble.innerHTML = `Thanks, ${visitorData.name}! ✅ I've saved your info. How can Nexa Logic help your business today? You can ask me any question, or <a href="#booking" onclick="toggleFloatingAgent()" style="color:#00f0ff; text-decoration:underline; font-weight:700;">click here to pick a time on our live calendar</a>.`;
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
