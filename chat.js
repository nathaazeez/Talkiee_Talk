const sendMessage = async () => {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;
    const aiConfigMsg = `You are a mental health chatbot. Only respond to mental health-related topics. 
    If the input is not related to mental health, respond with ' Hey friend! Let’s focus on mental wellness. 
    Please share your thoughts or concerns related to mental health, and I'll be here to provide support and guidance..
    'If the input is 'Hi'or'hi'or'hello'or 'Hello' respond with 'Hey my Friend,what make your day worse?'
     Here is the input: "${userInput}".`;
    const apiResponse = await apiCall(aiConfigMsg);

    // if (!containsMentalHealthKeywords(userInput)) {
    // appendMessage("user-message", userInput);
    // appendMessage("bot-message", "I'm here to listen with you in your hard times");
    // return;
    // }

    //const apiResponse = await apiCall(userInput);
    appendMessage("user-message", userInput);
    appendMessage("bot-message", apiResponse);
    document.getElementById("user-input").value = "";
    scrollChatWindow();
};
// const mentalHealthKeywords = [
//     "anxiety",
//     "depression",
//     "stress",
//     "mental health",
//     "therapy",
//     "counseling",
//     "emotional well-being",
//     "panic",
//     "PTSD",
//     "trauma",
//     "unwell",
//     "overwhelmed",
//     "tensed",
//     "angry",
//     "broken",
//     "tired",
//     "unhappy",
//     "mood swings",
//     "pcod",
//     "fail",
//     "tension",
//     "break up",

// ];

function appendMessage(className, message) {
    const chatWindow = document.getElementById("chat-window");
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.innerHTML = `<div class="message">${message}</div>`;
    chatWindow.appendChild(messageDiv);
}

function containsMentalHealthKeywords(input) {
    return mentalHealthKeywords.some(keyword => input.toLowerCase().includes(keyword));
}
async function apiCall(input) {
    const apiKey = 'AIzaSyBxj9bOCED3Y4a5fYGapVVWPejCcc-qQbg'; // Replace with your actual Gemini API key

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: input }]
                }]
            })
        });

        const data = await response.json();

        // Log the entire response for debugging
        console.log("API response:", JSON.stringify(data, null, 2));

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Validate response structure and get the correct parts
        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts) {
            throw new Error("Invalid response structure: Missing candidates or content.parts");
        }

        // Join the parts of the candidate response to return a single string
        return data.candidates[0].content.parts.map(part => part.text).join('').trim();

    } catch (error) {
        // Log the error for debugging
        console.error("Error generating response:", error);

        // Return a friendly error message for the mental health chatbot
        return "Error generating response. Please ask a mental health-related question.";
    }
}
