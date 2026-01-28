
import { GoogleGenAI } from "@google/genai";

// 1. Team Data
const TEAM_MEMBERS = [
    {
        id: '1',
        name: '권해적',
        role: 'CEO & Founder',
        bio: '혁신적인 기술을 통해 세상을 더 나은 곳으로 만들고자 노력하는 비저너리 리더입니다. 15년 이상의 IT 경력을 보유하고 있습니다.',
        image: 'image/SoonHyun.jpg',
        tags: ['Strategy', 'Leadership', 'Vision']
    },
    {
        id: '2',
        name: '이지은',
        role: 'UI/UX Designer',
        bio: '사용자의 마음을 움직이는 인터렉티브 디자인을 추구합니다. 심미성과 기능성의 완벽한 조화를 만드는 것을 목표로 합니다.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=800&q=80',
        tags: ['Figma', 'Prototyping', 'Art']
    },
    {
        id: '3',
        name: '박민준',
        role: 'Frontend Engineer',
        bio: '최신 웹 기술을 탐구하고 고성능 웹 애플리케이션을 구축하는 것에 열정이 있습니다. 사용자 경험 최적화의 전문가입니다.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=800&q=80',
        tags: ['React', 'TypeScript', 'WebPerf']
    },
    {
        id: '4',
        name: '최서윤',
        role: 'Product Manager',
        bio: '복잡한 프로젝트를 조율하고 팀의 시너지를 극대화하는 커뮤니케이션의 달인입니다. 데이터 기반의 의사결정을 선호합니다.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&h=800&q=80',
        tags: ['Agile', 'Growth', 'Data']
    },
    {
        id: '5',
        name: '정현우',
        role: 'Backend Engineer',
        bio: '안정적이고 확장 가능한 시스템 아키텍처를 설계합니다. 대규모 트래픽 처리에 대한 풍부한 경험을 가지고 있습니다.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&h=800&q=80',
        tags: ['Node.js', 'Cloud', 'Scaling']
    },
    {
        id: '6',
        name: '윤아름',
        role: 'Brand Designer',
        bio: '브랜드의 스토리를 시각적으로 풀어내는 것에 능숙합니다. 감각적인 색채 사용과 타이포그래피가 강점입니다.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=800&q=80',
        tags: ['Branding', 'Motion', 'Concept']
    }
];

// 2. DOM Elements
const teamGrid = document.getElementById('team-grid');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const navbar = document.getElementById('navbar');

const chatWindow = document.getElementById('chat-window');
const toggleChatBtn = document.getElementById('toggle-chat');
const closeChatBtn = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat');

// 3. Render Team Cards
function renderTeam() {
    teamGrid.innerHTML = TEAM_MEMBERS.map((member, index) => `
        <div class="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 opacity-0 translate-y-10 animate-fade-in" style="animation: fadeInUp 0.7s forwards ${index * 0.15}s">
            <div class="relative aspect-[3/4] overflow-hidden">
                <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <p class="text-white text-xs leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        ${member.bio}
                    </p>
                </div>
            </div>
            <div class="p-8">
                <div class="mb-5">
                    <span class="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">${member.role}</span>
                    <h3 class="text-2xl font-black tracking-tight">${member.name}</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${member.tags.map(tag => `
                        <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400">#${tag}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 4. Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('glass', 'shadow-xl', 'py-4');
        navbar.classList.remove('py-6');
    } else {
        navbar.classList.remove('glass', 'shadow-xl', 'py-4');
        navbar.classList.add('py-6');
    }
});

// 5. Theme Toggle
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    sunIcon.classList.toggle('hidden', !isDark);
    moonIcon.classList.toggle('hidden', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
}

// 6. AI Consultant (Gemini API)
let isChatLoading = false;

async function handleAISend() {
    const text = chatInput.value.trim();
    if (!text || isChatLoading) return;

    // Add user message
    addMessage('user', text);
    chatInput.value = '';
    isChatLoading = true;

    // Loading indicator
    const loadingId = addMessage('ai', '생각 중입니다...', true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemPrompt = `당신은 'Elite Team'의 전문 상담가입니다. 
        팀원 데이터: ${JSON.stringify(TEAM_MEMBERS)}.
        사용자의 질문에 대해 한국어로 정중하고 지적으로 답변하세요. 
        사용자가 특정 분야의 전문가를 찾으면 팀원 중에서 추천하세요. 
        답변은 간결하면서도 정보를 충실히 담아야 합니다.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts: [{ text: `${systemPrompt}\n질문: ${text}` }] }],
        });

        updateMessage(loadingId, response.text);
    } catch (error) {
        console.error(error);
        updateMessage(loadingId, "죄송합니다. 서비스 연결에 문제가 발생했습니다.");
    } finally {
        isChatLoading = false;
    }
}

function addMessage(role, text, isLoading = false) {
    const id = 'msg-' + Date.now();
    const isUser = role === 'user';
    const msgHtml = `
        <div id="${id}" class="flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${isUser ? 'right' : 'left'}-2">
            <div class="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-indigo-600 text-white rounded-br-none shadow-lg' : 'bg-indigo-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
        }">
                ${text}
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHtml);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function updateMessage(id, text) {
    const msgEl = document.getElementById(id);
    if (msgEl) {
        const contentDiv = msgEl.querySelector('div');
        contentDiv.textContent = text;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// 7. Event Listeners for Chat
toggleChatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) chatInput.focus();
});

closeChatBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));

sendChatBtn.addEventListener('click', handleAISend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAISend();
});

// 8. Custom Keyframes for Vanilla JS Animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);

// Initialize
renderTeam();
