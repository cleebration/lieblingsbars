// Bars with locally generated images (in /public/bars/)
export const LOCAL_IMAGES = new Set([
  "abbaubar","abbildbar","abdichtbar","abgrenzbar","abhoerbar",
  "ableitbar","abrufbar","absehbar","absicherbar","abspielbar",
  "abstimmbar","abwaehlbar","abwandelbar","abwehrbar","abzeichenbar",
  "achtsam-bar","aenderbar","ahnbar","akkumulierbar","adressierbar",
  "anrufbar","anschliessbar","ansprechbar","anwendbar","anzeigbar","anzweifelbar","auffindbar","aufblasbar","aufladbar","aufzeichenbar",
  "ausbaubar","ausblendbar","ausfuehrbar","aushaltbar","auslagerbar","ausloesbar","auslesbar","ausschaltbar","austauschbar","auswaehlbar",
  "auswertbar","auszahlbar","automatisierbar","bearbeitbar","bebaubar","bedienbar","bedruckbar","beeinflussbar","befahrbar","begehbar",
]);

export function getBarImageUrl(bar) {
  const slug = typeof bar === "object" ? bar.slug : bar;
  if (slug && LOCAL_IMAGES.has(slug)) {
    return `/bars/${slug}.jpg`;
  }
  return null;
}
