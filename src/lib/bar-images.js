// Bars with locally generated images (in /public/bars/)
export const LOCAL_IMAGES = new Set([
  "abbaubar","abbildbar","abdichtbar","abgrenzbar","abhoerbar",
  "ableitbar","abrufbar","absehbar","absicherbar","abspielbar",
  "abstimmbar","abwaehlbar","abwandelbar","abwehrbar","abzeichenbar",
  "achtsam-bar","aenderbar","ahnbar","akkumulierbar","adressierbar",
  "anrufbar","anschliessbar","ansprechbar","anwendbar","anzeigbar","anzweifelbar","auffindbar","aufblasbar","aufladbar","aufzeichenbar",
  "ausbaubar","ausblendbar","ausfuehrbar","aushaltbar","auslagerbar","ausloesbar","auslesbar","ausschaltbar","austauschbar","auswaehlbar",
  "auswertbar","auszahlbar","automatisierbar","bearbeitbar","bebaubar","bedienbar","bedruckbar","beeinflussbar","befahrbar","begehbar",
  "begrenzbar","behebbar","beheizbar","bekaempfbar","belastbar","beleuchtbar","bemerkbar","benutzbar","beobachtbar","berechenbar",
  "beschreibbar","besetzbar","bestellbar","bestechbar","besteuerbar","betreibbar","bewohnbar","bezahlbar","bezwingbar","biegbar",
  "brauchbar","buchbar","codierbar","darstellbar","datierbar","deaktivierbar","dehnbar","definierbar","delegierbar","denkbar",
  "digitalisierbar","dokumentierbar","druckbar","durchfuehrbar","einbaubar","eingrenzbar","einplanbar","einschaltbar","einstellbar","einteilbar",
  "erfahrbar","erfassbar","erfuellbar","erkennbar","erklaerbar","erlebbar","ermittelbar","erpressbar","erreichbar","ersetzbar",
]);

export function getBarImageUrl(bar) {
  const slug = typeof bar === "object" ? bar.slug : bar;
  if (slug && LOCAL_IMAGES.has(slug)) {
    return `/bars/${slug}.jpg`;
  }
  return null;
}
