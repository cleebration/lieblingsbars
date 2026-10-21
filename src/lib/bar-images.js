// Bars with locally generated images (in /public/bars/)
const LOCAL_IMAGES = new Set([
  "abbaubar","abbildbar","abdichtbar","abgrenzbar","abhoerbar",
  "ableitbar","abrufbar","absehbar","absicherbar","abspielbar",
  "abstimmbar","abwaehlbar","abwandelbar","abwehrbar","abzeichenbar",
  "achtsam-bar","aenderbar","ahnbar","akkumulierbar","adressierbar",
  "anrufbar","anschliessbar","ansprechbar","anwendbar","anzeigbar","anzweifelbar","auffindbar","aufblasbar","aufladbar","aufzeichenbar",
]);

export function getBarImageUrl(bar, width = 400, height = 225) {
  const slug = typeof bar === 'object' ? bar.slug : null;
  
  // Use local image if available
  if (slug && LOCAL_IMAGES.has(slug)) {
    return `/bars/${slug}.jpg`;
  }
  
  // Fallback: Pollinations.ai
  let prompt;
  if (typeof bar === 'object' && bar?.imagePrompt) {
    prompt = bar.imagePrompt;
  } else {
    prompt = 'moody bar interior, amber lighting, dark atmospheric, editorial photography, film grain';
  }
  const encoded = encodeURIComponent(prompt);
  const seed = typeof bar === 'object' ? bar.id : bar;
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=false`;
}
