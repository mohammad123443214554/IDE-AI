// 1. CONFIGURATION
// Bhai, yahan apni key dalo (Bina kisi extra space ke)
const API_KEY = "AIzaSyC0NCYPihcRJFTuMAnPSHbLqkC7Dz53Bzs"; 

// Hum v1 use karenge aur model ka full path likhenge
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return alert("Bhai, kuch toh likho!");

    // UI: User Message
    chatHistory.innerHTML += `<div class="flex flex-col items-end mb-4"><div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%]">${userPrompt}</div></div>`;
    
    // Loading State
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `<div id="${loadingId}" class="flex gap-3 mb-4"><div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-gray-100 italic">Bhai, AI code likh raha hai... 🚀</div></div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write a complete responsive single-file HTML website with Tailwind CSS for: ${userPrompt}. Give only the code and nothing else.`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Error Handling for models
        if (data.error) {
            console.error("API Error:", data.error.message);
            throw new Error(data.error.message);
        }

        let aiCode = data.candidates[0].content.parts[0].text;
        
        // Clean markdown code blocks
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // Render code in iframe
        previewFrame.srcdoc = aiCode;

        // Update loading to success
        document.getElementById(loadingId).innerHTML = `<div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-green-400">Website Taiyar Hai! ✨</div>`;

    } catch (error) {
        console.error("Catch Block:", error);
        document.getElementById(loadingId).innerHTML = `<div class="bg-gray-800 p-3 rounded-xl rounded-tl-none text-sm text-red-400">Error: ${error.message}</div>`;
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
    if (!code || code.includes("Building")) return alert("Pehle website banne toh do!");
    const win = window.open();
    win.document.write(code);
    win.document.close();
}
