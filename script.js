// 1. CONFIGURATION
const API_KEY = "AIzaSyC0NCYPihcRJFTuMAnPSHbLqkC7Dz53Bzs"; 

// VERSION CHANGE: 'v1beta' ko hata kar 'v1' kar diya hai
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return;

    // UI Update
    chatHistory.innerHTML += `<div class="flex flex-col items-end mb-4"><div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%]">${userPrompt}</div></div>`;
    
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `<div id="${loadingId}" class="flex gap-3 mb-4"><div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">Bhai, bas 10 second ruk jao... 🚀</div></div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Write a single-file HTML/Tailwind CSS code for: ${userPrompt}. Give only code.` }] }]
            })
        });

        const data = await response.json();

        // Agar abhi bhi error aaye toh console mein check karein
        if (data.error) {
            throw new Error(data.error.message);
        }

        let aiCode = data.candidates[0].content.parts[0].text;
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        previewFrame.srcdoc = aiCode;
        document.getElementById(loadingId).innerHTML = `<div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-green-400">Website Ready! ✨</div>`;

    } catch (error) {
        console.error("Final Fix Error:", error);
        document.getElementById(loadingId).innerHTML = `<div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-red-400">Error: ${error.message}</div>`;
    }

    promptInput.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Enter key support
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateWebsite();
});
