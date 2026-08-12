const fs = require('fs');
const path = require('path');

/**
 * Generates an AI book cover image using Pollinations.ai free image generation
 * and saves it to /uploads/covers on disk. Returns the relative path (e.g. '/uploads/covers/xxx.jpg')
 * on success, or null if generation is unavailable/fails (caller must handle fallback).
 */
const generateCoverImage = async ({ title, genre, synopsis, language }) => {
  try {
    const langContext = language ? `, setting/language: ${language}` : '';
    const synopsisExcerpt = synopsis ? synopsis.slice(0, 250) : 'An evocative literary masterpiece';
    const promptText = `Design an elegant, museum-grade hardcover book cover illustration for a book titled "${title}", genre: ${genre || 'Literary Fiction'}${langContext}. Theme/synopsis context: ${synopsisExcerpt}. Style: premium literary publishing house cover art, painterly and evocative, portrait 3:4 orientation, refined palette with warm ivory, midnight navy, and rich ochre, typography-free art composition, award-winning book jacket aesthetics.`;

    const encodedPrompt = encodeURIComponent(promptText);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1e9)}`;

    const response = await fetch(pollinationsUrl);
    if (!response.ok) {
      console.error('[AI Cover Generation Error]: Pollinations API returned status', response.status);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const coversDir = path.join(__dirname, '../../uploads/covers');
    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }

    const filename = `ai-cover-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const filePath = path.join(coversDir, filename);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/covers/${filename}`;
  } catch (err) {
    console.error('[AI Cover Generation Error]:', err.message);
    return null;
  }
};

module.exports = generateCoverImage;
