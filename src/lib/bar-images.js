/**
 * Erzeugt Bild-URLs für Lieblingsbars via Pollinations.ai (kostenlos, kein API-Key).
 * Jede Bar bekommt ein einzigartiges Bild basierend auf ihrem imagePrompt.
 */

export function getBarImageUrl(bar, width = 400, height = 225) {
  // bar kann ein Bar-Objekt (mit imagePrompt) oder eine ID sein (Fallback)
  let prompt;
  if (typeof bar === 'object' && bar?.imagePrompt) {
    prompt = bar.imagePrompt;
  } else {
    // Fallback: generischer Bar-Prompt
    prompt = 'moody bar interior, amber lighting, dark atmospheric, editorial photography, film grain';
  }
  
  const encoded = encodeURIComponent(prompt);
  // seed = bar.id für konsistente Bilder (immer gleiche URL → gleiche Bild)
  const seed = typeof bar === 'object' ? bar.id : bar;
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=false`;
}
