export async function postChatgpt(prompt) {
    const apiKey = import.meta.env.VITE_API_KEY;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            max_tokens: 200,
            top_p: 1,
            temperature: 1.3,
            messages: prompt
        }),
    });
    const data = await response.json();
    return data["choices"][0]["message"].content;
}
