// 1. CONFIGURATION
// Bhai, yahan apni asli API Key paste karo jo 'AIza' se shuru hoti hai
const API_KEY = "AIzaSyAiWS4qAaU9D-1sKcq6BbCxigd4phuFXwM"; 

// URL ko ekdum sahi format mein rakhein taaki 404 error na aaye
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. MAIN GENERATION FUNCTION
async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        alert("Bhai, pehle kuch likho toh sahi!");
        return;
    }

    // Chat UI mein user ka message dikhana
    chatHistory.innerHTML += `
        <div class="flex flex-col items-end mb-4">
            <div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%] shadow-sm">
                ${userPrompt}
            </div>
        </div>
    `;

    // Loading indicator
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" class="flex gap-3 mb-4">
            <div class="w-7 h-7 rounded-full theme-accent-bg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-robot text-xs text-white"></i>
            </div>
            <div class="bg-[var(--bg-main)] border theme-border p-3 rounded-xl rounded-tl-none text-sm shadow-sm">
                Bhai, AI website design kar raha hai... 🚀
            </div>
        </div>
    `;
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Iframe mein loading screen
    previewFrame.srcdoc = `
        <body style="background:#0f172a; color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
            <div style="border:4px solid #3b82f6; border-top:4px solid transparent; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;"></div>
            <h2 style="margin-top:20px;">IDE AI is Building...</h2>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </body>
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write only a professional, single-file HTML website with Tailwind CSS and FontAwesome for: ${userPrompt}. 
                        Include modern design, sections, and placeholder images. No talk, just code.`
                    }]
                }]
            })
        });

        // Agar API response mein koi gadbad ho
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            throw new Error("API Limit or Key Issue");
        }

        const data = await response.json();
        let aiCode = data.candidates[0].content.parts[0].text;

        // Code se markdown tags hatana
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // Website render karna
        previewFrame.srcdoc = aiCode;

        // Success message
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full theme-accent-bg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-check text-xs text-white"></i>
            </div>
            <div class="bg-[var(--bg-main)] border theme-border p-3 rounded-xl rounded-tl-none text-sm shadow-sm">
                Bhai, website ready hai! Check kar lo. ✨
            </div>
        `;

    } catch (error) {
        console.error("Catch Block:", error);
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-triangle-exclamation text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-red-400">
                Bhai, Error aa gaya! Console check karo ya API Key badlo.
            </div>
        `;
    }

    promptInput.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 3. HELPERS
// Enter key se send karna
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateWebsite();
    }
});

// Run Button Function (Naye tab mein preview)
function openLocalhost() {
    const iframe = document.getElementById('previewFrame');
    const code = iframe.srcdoc;
    if (!code || code.includes("Building")) return alert("Pehle website banne do bhai!");
    
    const win = window.open();
    win.document.write(code);
    win.document.close();
}
