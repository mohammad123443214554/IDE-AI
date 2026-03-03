// 1. CONFIGURATION
// Bhai, yahan apni key 'AIza...' wali direct paste karni hai
const API_KEY = "APNI_ASLI_GEMINI_KEY_YAHAN_DALO"; 

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. MAIN FUNCTION
async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return alert("Bhai, kuch likho toh sahi!");

    // Check if key is missing
    if (API_KEY === "APNI_ASLI_GEMINI_KEY_YAHAN_DALO") {
        alert("Bhai, pehle script.js mein apni asli API Key dalo!");
        return;
    }

    // UI Update: User Message
    chatHistory.innerHTML += `<div class="flex flex-col items-end mb-4"><div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%] shadow-sm">${userPrompt}</div></div>`;
    
    // Loading State
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" class="flex gap-3 mb-4">
            <div class="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-robot text-xs text-white"></i></div>
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none text-sm text-gray-100 italic">Bhai, website ready ho rahi hai... 🚀</div>
        </div>`;
    
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Preview Panel Loading
    previewFrame.srcdoc = "<body style='background:#0f172a; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;'><h2>IDE AI is Building... 🛠️</h2></body>";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Generate a full responsive single-file HTML website with Tailwind CSS for: ${userPrompt}. Return only code, no text.` }] }]
            })
        });

        if (!response.ok) throw new Error("API Response Failed");

        const data = await response.json();
        let aiCode = data.candidates[0].content.parts[0].text;
        
        // Clean markdown
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // Render Code
        previewFrame.srcdoc = aiCode;

        // Success message
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-check text-xs text-white"></i></div>
            <div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">Bhai, website taiyar hai! ✨</div>`;

    } catch (error) {
        console.error("Gemini Error:", error);
        document.getElementById(loadingId).innerHTML = `<div class="text-red-500 text-xs mt-1">Bhai, API ne response nahi diya. Key check karo!</div>`;
    }

    promptInput.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 3. RUN BUTTON LOGIC
function openLocalhost() {
    const iframe = document.getElementById('previewFrame');
    const code = iframe.srcdoc;
    if (!code || code.includes("Building")) return alert("Pehle website banne do bhai!");
    
    const win = window.open();
    win.document.write(code);
    win.document.close();
}

// Enter Key Listener
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateWebsite();
    }
});
