// 1. CONFIGURATION
// Bhai, yahan apni asli key dalo
const API_KEY = "YAHAN_APNI_API_KEY_PASTE_KARO"; 

// Is URL ko ekdum dhyan se copy karna, isme v1beta aur models/ ka sahi hona zaroori hai
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return alert("Bhai, kuch likho toh sahi!");

    // UI Update: User Message
    chatHistory.innerHTML += `<div class="flex flex-col items-end mb-4"><div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%] shadow-sm">${userPrompt}</div></div>`;
    
    // Loading State
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" class="flex gap-3 mb-4">
            <div class="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-robot text-xs text-white"></i></div>
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">AI soch raha hai... 🚀</div>
        </div>`;
    
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate a full responsive single-file HTML website with Tailwind CSS for: ${userPrompt}. Return ONLY the HTML code.`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Error checking
        if (data.error) {
            throw new Error(data.error.message);
        }

        let aiCode = data.candidates[0].content.parts[0].text;
        
        // Clean markdown backticks
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // Render in Iframe
        previewFrame.srcdoc = aiCode;

        // Success Update
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-check text-xs text-white"></i></div>
            <div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">Bhai, website ready hai! ✨</div>`;

    } catch (error) {
        console.error("Final Fix Error:", error);
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark text-xs text-white"></i></div>
            <div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-red-400">Error: ${error.message}</div>`;
    }

    promptInput.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Enter Key Support
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateWebsite();
});

// Run Button Logic
function openLocalhost() {
    const code = document.getElementById('previewFrame').srcdoc;
    if (!code || code.includes("Building")) return alert("Pehle website banne do!");
    const win = window.open();
    win.document.write(code);
    win.document.close();
}
