import { Movie } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

interface AIRecommendation {
    title: string;
    reason: string;
}

export const getAIRecommendations = async (history: Movie[]): Promise<AIRecommendation[]> => {
    if (!history || history.length === 0) return [];

    // 1. Chuẩn bị dữ liệu lịch sử gọn nhẹ để tiết kiệm token
    // Chỉ lấy phim được đánh giá cao (>= 3 sao) hoặc mới xem gần đây
    const watchedList = history
        .filter(m => (m.rating || 0) >= 3) // Chỉ lấy phim user thích
        .slice(0, 50) // Giới hạn 50 phim gần nhất
        .map(m => `${m.title} (${m.rating}/5 stars) - Genre: ${m.genres || 'Unknown'}`)
        .join('\n');

    const prompt = `
    Based on the user's watched movie history below, recommend 10 similar movies that they haven't watched.
    
    User History:
    ${watchedList}

    Return ONLY a JSON array with the following format, no other text:
    [
      { "title": "Movie Name 1", "reason": "Short reason why" },
      { "title": "Movie Name 2", "reason": "Short reason why" }
    ]
    The movie title must be the exact English or Original title for TMDB search.
  `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // Required by OpenRouter
                "X-Title": "Cinemetrics", // Optional
            },
            body: JSON.stringify({
                "model": "x-ai/grok-4.1-fast:free",
                "messages": [
                    { "role": "system", "content": "You are a helpful movie recommendation engine. You output valid JSON only." },
                    { "role": "user", "content": prompt }
                ],
                "temperature": 0.7,
                "reasoning": { "enabled": true }
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const content = data.choices[0].message.content;
            // Làm sạch chuỗi JSON (đôi khi AI trả về markdown ```json ... ```)
            const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString) as AIRecommendation[];
        }

        return [];
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        return [];
    }
};
