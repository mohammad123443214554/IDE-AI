/**
 * IDE AI - Professional Script (A to Z)
 * Created for: Mohammad Khan
 * Purpose: Connects Gemini AI to Frontend Workspace
 */

// 1. CONFIGURATION
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // <--- Bhai yahan apni asli key dalo
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. MAIN GENERATION FUNCTION
async function generateWebsite() {
    const promptInput = document.getElementById('promptInput');
    const previewFrame = document.getElementById('previewFrame');
    const chatHistory = document.getElementById('chatHistory');
    const userPrompt = promptInput.value.trim();

    // Agar prompt khali hai toh ruk jao
    if (!userPrompt) {
        alert("Bhai, pehle kuch likho toh sahi ki kya banana hai!");
        return;
    }

    // 3. UPDATE CHAT UI (User Message)
    chatHistory.innerHTML += `
        <div class="flex flex-col items-end mb-4">
            <div class="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none text-sm max-w-[85%] shadow-sm">
                ${userPrompt}
            </div>
        </div>
    `;

    // 4. SHOW LOADING IN PREVIEW & CHAT
    const loadingId = "loading-" + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" class="flex gap-3 mb-4 animate-pulse">
            <div class="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-robot text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none text-sm text-gray-300">
                Bhai, AI architect kaam par lag gaya hai... 🚀
            </div>
        </div>
    `;
    
    // Auto-scroll chat to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Preview panel mein loading message
    previewFrame.srcdoc = `
        <body style="background:#0f172a; color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
            <div style="border:4px solid #3b82f6; border-top:4px solid transparent; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;"></div>
            <h2 style="margin-top:20px;">IDE AI is Building your Website...</h2>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </body>
    `;

    // 5. CALL GEMINI API
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an expert frontend developer. Create a modern, fully responsive, and professional single-file HTML website for: "${userPrompt}". 
                        Use Tailwind CSS (via CDN) for styling. 
                        Include sample content, icons (FontAwesome), and good typography. 
                        IMPORTANT: Output ONLY the source code (starting with <!DOCTYPE html>). No explanations.`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]) {
            throw new Error("AI ne response nahi diya. Key check karo!");
        }

        let aiCode = data.candidates[0].content.parts[0].text;

        // 6. CODE CLEANUP (Markdown remove karein)
        aiCode = aiCode.replace(/```html/g, "").replace(/```/g, "").trim();

        // 7. RENDER WEBSITE IN IFRAME
        previewFrame.srcdoc = aiCode;

        // Update Chat success message
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-check text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none text-sm text-gray-100">
                Website ready hai bhai! Right side mein dekho. ✨
            </div>
        `;

        // Clear input box
        promptInput.value = "";

    } catch (error) {
        console.error("API Error:", error);
        document.getElementById(loadingId).innerHTML = `
            <div class="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-triangle-exclamation text-xs text-white"></i>
            </div>
            <div class="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none text-sm text-red-400">
                Bhai, Error aa gaya! Shayad API Key expire ho gayi hai ya limit khatam.
            </div>
        `;
    }
}

// 8. HELPERS
// Enter key press par generation shuru karein
document.getElementById('promptInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateWebsite();
    }
});

// Localhost preview function (Naye tab mein kholne ke liye)
function openLocalhost() {
    const iframe = document.getElementById('previewFrame');
    const code = iframe.srcdoc;
    if(!code || code.includes("Building")) {
        alert("Pehle website toh banne do bhai!");
        return;
    }
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(code);
    newWindow.document.close();
}
