// Google Gemini API Configuration
const API_KEY = "YAHAN_APNI_GEMINI_API_KEY_DALO"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) return alert("Bhai, kuch likho toh sahi!");

    // UI par user ka message dikhao
    chatHistory.innerHTML += `
        <div class="flex flex-col items-end gap-1">
            <div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%] shadow-sm">
                ${userPrompt}
            </div>
        </div>
    `;

    // AI ka loading message
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" class="flex gap-3">
            <div class="w-7 h-7 rounded-full theme-accent-bg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-robot text-xs text-white"></i>
            </div>
            <div class="bg-[var(--bg-main)] border theme-border p-3 rounded-xl rounded-tl-none text-sm shadow-sm">
                Bhai, website ban rahi hai... <i class="fa-solid fa-spinner animate-spin ml-2"></i>
            </div>
        </div>
    `;
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
    promptInput.value = ""; // Input clear karo

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a world-class frontend developer. Generate a complete, single-file HTML website with modern CSS (using Tailwind CDN if needed) based on this prompt: "${userPrompt}". 
                        IMPORTANT: Output ONLY the source code starting with <!DOCTYPE html> and ending with </html>. Do not include any markdown or extra text.`
                    }]
                }]
            })
        });

        const data = await response.json();
        let aiCode = data.candidates[0].content.parts[0].text;

        // Code clean-up (markdown tags hatana agar AI galti se de de)
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // Iframe mein code render karna
        previewFrame.srcdoc = aiCode;

        // Loading message hatakar success dikhana
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full theme-accent-bg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-robot text-xs text-white"></i>
            </div>
            <div class="bg-[var(--bg-main)] border theme-border p-3 rounded-xl rounded-tl-none text-sm shadow-sm">
                Bhai, website ready hai! Aap Preview panel mein dekh sakte ho. ✨
            </div>
        `;

    } catch (error) {
        console.error("API Error:", error);
        document.getElementById(loadingId).innerText = "Bhai, Error aa gaya! API Key check karo.";
    }
}

// Enter key se bhi generate ho jaye
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateWebsite();
    }
});
