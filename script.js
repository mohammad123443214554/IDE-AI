// 1. CONFIGURATION
// Bhai, yahan apni 'AIza...' wali key direct " " ke beech mein paste karo
const API_KEY = "AIzaSyC0NCYPihcRJFTuMAnPSHbLqkC7Dz53Bzs"; 

// URL ko sahi format mein rakhein taaki 404 error na aaye
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. MAIN FUNCTION
async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return alert("Bhai, pehle kuch likho toh sahi!");

    // Check if key is still the placeholder
    if (API_KEY === "APNI_ASLI_GEMINI_KEY_YAHAN_DALO" || API_KEY === "") {
        alert("Bhai, pehle script.js ki pehli line mein apni asli API Key dalo!");
        return;
    }

    // UI Update: User Message
    chatHistory.innerHTML += `
        <div class="flex flex-col items-end mb-4">
            <div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%] shadow-sm">
                ${userPrompt}
            </div>
        </div>`;
    
    // Loading State
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" class="flex gap-3 mb-4">
            <div class="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-robot text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">
                Bhai, AI architect kaam par lag gaya hai... 🚀
            </div>
        </div>`;
    
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Preview Panel Loading
    previewFrame.srcdoc = `
        <body style="background:#0f172a; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
            <div style="text-align:center;">
                <div style="border:4px solid #3b82f6; border-top:4px solid transparent; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:auto;"></div>
                <h2 style="margin-top:20px;">IDE AI is Building... 🛠️</h2>
            </div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </body>`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `You are an expert web developer. Generate a complete, modern, responsive single-file HTML/Tailwind CSS website for: ${userPrompt}. Return only the source code.` 
                    }] 
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error Details:", errorData);
            throw new Error("API Response Failed");
        }

        const data = await response.json();
        let aiCode = data.candidates[0].content.parts[0].text;
        
        // Clean markdown backticks if present
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // Render Code in Iframe
        previewFrame.srcdoc = aiCode;

        // Success message
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-check text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">
                Bhai, website ready hai! Check kar lo. ✨
            </div>`;

    } catch (error) {
        console.error("Catch Block Error:", error);
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-triangle-exclamation text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-red-400">
                Error: Bhai, API ne mana kar diya. Key check karo!
            </div>`;
    }

    promptInput.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Enter Key Listener
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateWebsite();
    }
});

// Run Button Logic
function openLocalhost() {
    const iframe = document.getElementById('previewFrame');
    const code = iframe.srcdoc;
    if (!code || code.includes("Building")) return alert("Pehle website toh banne do bhai!");
    
    const win = window.open();
    win.document.write(code);
    win.document.close();
}
