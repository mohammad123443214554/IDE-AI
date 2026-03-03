// 1. CONFIGURATION
// Bhai, yahan apni 'AIza...' wali asli key paste karo
const API_KEY = "AIzaSyC0NCYPihcRJFTuMAnPSHbLqkC7Dz53Bzs"; 

// URL ko ekdum dhyan se dekho, isme koi space nahi hona chahiye
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return alert("Bhai, kuch toh likho!");

    // UI Update
    chatHistory.innerHTML += `<div class="flex flex-col items-end mb-4"><div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%]">${userPrompt}</div></div>`;
    
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `<div id="${loadingId}" class="flex gap-3 mb-4"><div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-gray-100 italic">Bhai, AI design kar raha hai... 🚀</div></div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Loading Screen
    previewFrame.srcdoc = "<body style='background:#0f172a; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;'><h2>IDE AI is Building... 🛠️</h2></body>";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Generate a full responsive single-file HTML website with Tailwind CSS for: ${userPrompt}. Return only code, no extra text.` }] }]
            })
        });

        // Agar response 404 ya 400 hai toh yahan pakda jayega
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Detailed API Error:", errorData);
            throw new Error(errorData.error.message);
        }

        const data = await response.json();
        let aiCode = data.candidates[0].content.parts[0].text;
        
        // Clean markdown tags
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        previewFrame.srcdoc = aiCode;
        document.getElementById(loadingId).innerHTML = `<div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-green-400">Website Ready! ✨</div>`;

    } catch (error) {
        console.error("Catch Block:", error);
        document.getElementById(loadingId).innerHTML = `<div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-red-400">Error: ${error.message}</div>`;
    }

    promptInput.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Enter Key Support
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateWebsite();
    }
});

// Run Button Function
function openLocalhost() {
    const code = document.getElementById('previewFrame').srcdoc;
    if (!code || code.includes("Building")) return alert("Pehle website banne do!");
    const win = window.open();
    win.document.write(code);
    win.document.close();
}
