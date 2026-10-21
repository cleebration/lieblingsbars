#!/usr/bin/env node
/**
 * generate-local.mjs
 * Generiert bars.json lokal ohne API-Aufruf.
 * Nutzt semantische Templates basierend auf der Wortbedeutung.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const CITIES = [
  { city: "Berlin", neighborhoods: ["Mitte", "Prenzlauer Berg", "Kreuzberg", "Neukölln", "Friedrichshain", "Charlottenburg", "Wedding", "Schöneberg"] },
  { city: "Hamburg", neighborhoods: ["Schanzenviertel", "Altona", "St. Pauli", "Ottensen", "Eimsbüttel", "Barmbek", "Winterhude"] },
  { city: "München", neighborhoods: ["Maxvorstadt", "Schwabing", "Glockenbachviertel", "Haidhausen", "Bogenhausen", "Au"] },
  { city: "Köln", neighborhoods: ["Ehrenfeld", "Nippes", "Deutz", "Südstadt", "Belgisches Viertel", "Mühlheim"] },
  { city: "Frankfurt", neighborhoods: ["Bornheim", "Sachsenhausen", "Nordend", "Westend", "Bockenheim"] },
  { city: "Leipzig", neighborhoods: ["Connewitz", "Plagwitz", "Lindenau", "Gohlis", "Schleußig"] },
  { city: "Stuttgart", neighborhoods: ["West", "Heslach", "Degerloch", "Bad Cannstatt", "Feuerbach"] },
  { city: "Düsseldorf", neighborhoods: ["Flingern", "Bilk", "Friedrichstadt", "Pempelfort", "Oberkassel"] },
  { city: "Dresden", neighborhoods: ["Neustadt", "Pieschen", "Löbtau", "Striesen"] },
  { city: "Hannover", neighborhoods: ["List", "Linden", "Oststadt"] },
];

function getCity(id) {
  const c = CITIES[id % CITIES.length];
  return { city: c.city, neighborhood: c.neighborhoods[id % c.neighborhoods.length] };
}

function toSlug(name) {
  return name.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getDate(id) {
  const d = new Date(2025, 0, 1 + (id - 1));
  return d.toISOString().split("T")[0];
}

// Daten für alle Bars — handgefertigt für maximale Qualität
const barData = [
  { name:"Abbaubar", tagline:"Wo jeder Stress zerlegt wird.", concept:"Die Abbaubar in Hamburg-Schanzenviertel ist ein Tempel des kontrollierten Verfalls. Hier kommt man nicht zum Aufbauen — man kommt, um alles Unnötige abzulegen.", blogTitle:"Was übrig bleibt, wenn man alles abbaut", blogContent:"Es gibt Bars, die einen aufbauen wollen. Mit Motivationszitaten an den Wänden, mit aufmunternden Barkeepern, mit Drinks, die »Energy« im Namen tragen. Die Abbaubar ist das Gegenteil davon — und das ist das Schönste an ihr.\n\nDie Einrichtung folgt dem Prinzip des kontrollierten Zerfalls: Kronleuchter, deren Birnen nach und nach ausfallen. Stühle, die leicht wackeln — aber nur leicht genug, um es noch gemütlich zu nennen. An der Wand hängt ein Bild, das jemand offensichtlich halbfertig gemalt und dann aufgehört hat.\n\nDer Barkeeper Gottfried fragt beim ersten Besuch immer: »Was möchten Sie heute abbauen?« Manche antworten: den Stress. Manche: die Erwartungen. Einmal kam jemand und sagte: »Meinen inneren Schweinehund.« Gottfried nickte, mixte schweigend und stellte das Glas so hin, dass der Schweinehund nicht mehr rankonnte.\n\nDie Abbaubar schließt immer dann, wenn der letzte Gast fertig abgebaut hat. Manchmal ist das um elf, manchmal um vier. Einmal war es acht Uhr morgens.", signatureDrink:"Der Zerfall", signatureDrinkDescription:"Mezcal, bittere Enzianliköre und ein Hauch Rauch. Wird ohne Eis serviert — Eis würde die Struktur aufrechterhalten, und darum geht es hier nicht.", imagePrompt:"A moody bar interior photograph of Abbaubar, half-lit chandelier with missing bulbs, vintage chairs slightly askew, unfinished painting on dark wall, amber light pools, cinematic lighting, film grain, editorial photography, dark and atmospheric", tweet:"Die Abbaubar in Hamburg: Wo man hingeht, um sich selbst zu demontieren — auf die schönste Art. 🔩 #Abbaubar #Hamburg", instagram:"Manchmal braucht man keine Aufbauarbeit. Manchmal reicht es, einfach abzubauen. ✨ Die Abbaubar macht genau das möglich — in einer Atmosphäre aus halbem Licht und ganzem Verständnis.\n\n#abbaubar #hamburg #schanzenviertel #bar #nachtleben #barkultur #cocktails #feierabend", facebook:"Die Abbaubar in Hamburg lädt ein: Komm rein, lass alles hinter dir und baue sanft ab. Manchmal ist weniger mehr. Habt ihr solche Orte in eurer Stadt?" },
  { name:"Abbildbar", tagline:"Hier sieht jeder aus wie ein Gemälde.", concept:"Die Abbildbar in Berlin-Mitte ist eine Bar, die vollständig in Spiegeln ausgekleidet ist. Nicht aus Eitelkeit, sondern aus philosophischer Neugier: Was sind wir, wenn wir uns selbst abbilden?", blogTitle:"Das bin ich? Das bin ich.", blogContent:"Wer die Abbildbar betritt, trifft sofort sich selbst. Und zwar mehrfach — die Spiegel an allen vier Wänden, der Decke und stellenweise auch dem Boden sorgen dafür, dass man nie allein ist. Auch wenn man allein ist.\n\nDie Gründerin, eine ehemalige Porträtfotografin namens Vera, wollte einen Ort schaffen, an dem die Selbstwahrnehmung zur Kunstform wird. »Wir sind alle Porträts, die noch gesucht werden«, sagt sie und meint es ernst.\n\nDie Cocktailkarte ist nach fotografischen Begriffen benannt: »Belichtungszeit«, »Tiefenschärfe«, »Überbelichtet«. Letzterer ist der stärkste. Das Licht ist so gesetzt, dass jeder Gast im bestmöglichen Winkel beleuchtet wird — warm, weich, schmeichelnd.\n\nEs heißt, manche Stammgäste kämen nur her, um sich anzuschauen. Nicht aus Narzissmus, sondern weil sie sich nirgendwo sonst so klar sehen.", signatureDrink:"Tiefenschärfe", signatureDrinkDescription:"Klarer Wodka, Elderflower, ein Spritzer Yuzu. Transparent wie Wahrheit, scharf wie ein guter Blick auf sich selbst.", imagePrompt:"A moody bar interior photograph of Abbildbar, walls entirely covered in aged mirrors reflecting infinite versions of the space, warm amber spotlights, art deco fixtures, cinematic lighting, film grain, editorial photography, dark and atmospheric", tweet:"Die Abbildbar in Berlin: Tritt ein und triff dich. In Spiegeln, in Drinks, in deinen eigenen Augen. 🪞 #Abbildbar #Berlin", instagram:"Wer bin ich? Diese Frage beantwortet die Abbildbar auf ihre ganz eigene Art — mit Spiegeln, warmem Licht und Drinks, die so transparent sind wie gute Selbstkenntnis. 🪞✨\n\n#abbildbar #berlin #mitte #spiegelbar #cocktailbar #barkultur #nachtleben #selbstreflexion", facebook:"Eine Bar komplett in Spiegeln — die Abbildbar in Berlin-Mitte. Man geht rein und trifft sich selbst. Was habt ihr das letzte Mal wirklich gesehen, wenn ihr in den Spiegel geschaut habt?" },
  { name:"Abdichtbar", tagline:"Außen Lärm. Innen Stille.", concept:"Die Abdichtbar in Hamburg-Altona ist schallisoliert bis zur Perfektion. Draußen tobt die Stadt, drinnen herrscht absolute Ruhe — außer dem Klimpern der Eiswürfel.", blogTitle:"Die lauteste Stille der Stadt", blogContent:"Die Abdichtbar ist von außen nicht als Bar erkennbar. Keine Leuchtreklame, kein Klingeln, kein Stimmengemurmel, das durch die Tür dringt. Stattdessen: eine schallgedämmte Stahltür, die sich so öffnet wie ein Banksafe.\n\nInnen ist es so still, dass man sein eigenes Herz hört. Was manche gruselig finden, empfinden die Stammgäste als kostbarstes Gut in einer Welt, die niemals schweigt. Der Barkeeper flüstert die Bestellung. Man nickt. Man setzt sich. Man atmet.\n\nDie Karte besteht nur aus sechs Drinks — alle wurden akustisch optimiert. Kein Knall beim Öffnen, kein lautes Schütteln, kein Glasklirren. Alles gedämpft, alles leise, alles sorgfältig.\n\nWer sein Handy nicht lautlos stellt, muss gehen. Das ist die einzige Regel. Die andere, ungeschriebene: Man geht leiser raus als man reingekommen ist.", signatureDrink:"Weißes Rauschen", signatureDrinkDescription:"Champagner mit Milch und Vanille — ein Drink, der das Geräusch des Meeres imitiert. Laut genug zum Einschläfern, leise genug zum Träumen.", imagePrompt:"A moody bar interior photograph of Abdichtbar, soundproofed walls with thick acoustic panels, minimal decor, single candle on each table, extreme quietness conveyed through stillness, cinematic lighting, film grain, editorial photography, dark and atmospheric", tweet:"Die Abdichtbar: Eine Bar in Hamburg, die so gut gedämmt ist, dass man sein eigenes Denken hört. 🤫 #Abdichtbar #Hamburg #Stille", instagram:"In einer Welt voller Lärm: Ein Ort der absoluten Stille. Die Abdichtbar in Hamburg-Altona ist schallisoliert bis zur Perfektion. Sechs Drinks. Keine Musik. Kein Handy.\n\n#abdichtbar #hamburg #altona #stille #cocktailbar #bar #nachtleben #ruhepol", facebook:"Kennt ihr das? Man will einfach mal gar nichts hören. Die Abdichtbar in Hamburg ist genau für solche Abende gemacht. Stille als Luxus." },
  { name:"Abgrenzbar", tagline:"Dein Tisch. Deine Welt. Dein Drink.", concept:"Die Abgrenzbar in Berlin-Prenzlauer Berg bietet jedem Tisch eine eigene kleine Welt — durch Vorhänge, Trennwände und schalldämpfende Pflanzen wird jeder Bereich zu einem privaten Universum.", blogTitle:"Der Wert einer guten Grenze", blogContent:"Es gibt eine Theorie, die besagt, dass gute Zäune gute Nachbarn machen. Die Abgrenzbar hat diese Philosophie auf die Gastronomie übertragen, und das Ergebnis ist erstaunlich harmonisch.\n\nJeder Tisch in der Abgrenzbar ist von den anderen getrennt — durch hohe Pflanzen, halbdurchsichtige Vorhänge, kleine Regale voller Bücher. Man sieht die anderen Gäste, aber man hört sie kaum. Man weiß, dass man nicht allein ist, aber man ist auch nicht gestört.\n\nDie Idee kam von der Philosophin und Barbesitzerin Karoline, die einmal zu lange in einem Café saß, in dem alle Gespräche miteinander verflochten wurden wie ein schlecht gestrickter Pullover.\n\nBesonders beliebt ist der »Bunkerraum« — ein echtes Kellerzimmer für zwei Personen, das man für genau zwei Stunden reservieren kann. Was darin besprochen wird, bleibt darin.", signatureDrink:"Persönlicher Raum", signatureDrinkDescription:"Gin, Gurke, Dill und ein Hauch Salz. Erfrischend präzise, mit klaren Grenzen zwischen den Aromen.", imagePrompt:"A moody bar interior photograph of Abgrenzbar, each table separated by lush plants and sheer curtains, private alcoves with warm lighting, intimate spaces within a larger room, cinematic lighting, film grain, editorial photography, dark and atmospheric", tweet:"Die Abgrenzbar in Berlin: Endlich eine Bar, die versteht, dass manchmal Grenzen das Schönste sind. 🌿 #Abgrenzbar #Berlin", instagram:"Grenzen sind nicht das Ende — sie sind der Anfang von etwas Eigenem. Die Abgrenzbar in Berlin schafft private Welten in einer gemeinsamen Bar. 🌿\n\n#abgrenzbar #berlin #prenzlauerberg #bar #intim #cocktails #nachtleben #barkultur", facebook:"Die Abgrenzbar in Berlin-Prenzlauer Berg: Jeder Tisch eine eigene Welt. Manchmal braucht man genau das — einen Ort, der sagt: hier bist du du." },
  { name:"Abhörbar", tagline:"Wir hören mit. Offiziell.", concept:"Die Abhörbar in Berlin-Mitte spielt mit Überwachungsästhetik. Abhörgeräte an den Wänden, Aufnahmespulen als Deko — aber alles ist Attrappe. Hier lauscht niemand. Oder?", blogTitle:"Was du sagst, wenn du denkst, niemand hört", blogContent:"Die Abhörbar in Berlin-Mitte ist entweder ein sehr seltsamer Scherz oder eine sehr ernste Aussage über die Gegenwart. Vielleicht ist es beides.\n\nAn den Wänden hängen Abhörgeräte aus den 1960ern bis 1980ern — Bandaufnahmegeräte, Wanzen in Taschenformat, Richtmikrofone. Alles Attrappen, versichert die Besitzerin Marta. »Oder?«, fügt sie mit einem Lächeln hinzu, das nicht ganz eindeutig ist.\n\nDie Gäste flüstern am Anfang, ohne es zu merken. Dann lachen sie darüber, dass sie flüstern. Dann reden sie lauter als sonst, wie aus Protest. Dann flüstern sie wieder.\n\nAuf der Karte: »Das wissen Sie, bevor Sie bestellen«, steht als Präambel. Dann folgen Drinks mit Namen wie »Stille Post«, »Aktenzeichen« und »Protokoll«. Der Barkeeper heißt Klaus-Dieter. Er sagt wenig.", signatureDrink:"Aktenzeichen X", signatureDrinkDescription:"Dunkler Rum, schwarzer Tee, ein Tropfen Bitterorange. Undurchsichtig und tief — wie ein gut gehütetes Geheimnis.", imagePrompt:"A moody bar interior photograph of Abhörbar, vintage surveillance equipment on dark walls, reel-to-reel tape recorders as decoration, dim red lighting, East German aesthetic, cinematic lighting, film grain, editorial photography, dark and atmospheric", tweet:"Die Abhörbar in Berlin: Wir hören zu. Offiziell. (Alle Geräte sind Attrappen. Vielleicht.) 👂 #Abhörbar #Berlin", instagram:"Manche Orte fordern heraus. Die Abhörbar in Berlin-Mitte hängt DDR-Abhörgeräte an die Wände und fragt: Was sagst du, wenn du denkst, niemand hört? 👂🎙️\n\n#abhörbar #berlin #mitte #surveillance #cocktailbar #nachtleben #barkultur #retro", facebook:"Die Abhörbar in Berlin lässt einen nachdenken: Was reden wir eigentlich, wenn wir uns unbeobachtet fühlen? Eine Bar mit einem ganz eigenen Konzept." },
];

// Generiere die restlichen 313 Bars mit gutem Template-Content
const allNames = [
  "Abbaubar","Abbildbar","Abdichtbar","Abgrenzbar","Abhörbar",
  "Ableitbar","Abrufbar","Absehbar","Absicherbar","Abspielbar",
  "Abstimmbar","Abwählbar","Abwandelbar","Abzählbar","Aktivierbar",
  "Analysierbar","Anfechtbar","Angreifbar","Anpassbar","Anrechenbar",
  "Anrufbar","Anschließbar","Ansprechbar","Anwendbar","Anzeigbar",
  "Anzweifelbar","Auffindbar","Aufblasbar","Aufladbar","Aufzeichenbar",
  "Ausbaubar","Ausblendbar","Ausführbar","Aushaltbar","Auslagerbar",
  "Auslösbar","Auslesbar","Ausschaltbar","Austauschbar","Auswählbar",
  "Auswertbar","Auszahlbar","Automatisierbar","Bearbeitbar","Bebaubar",
  "Bedienbar","Bedruckbar","Beeinflussbar","Befahrbar","Begehbar",
  "Begrenzbar","Behebbar","Beheizbar","Bekämpfbar","Belastbar",
  "Beleuchtbar","Bemerkbar","Benutzbar","Beobachtbar","Berechenbar",
  "Beschreibbar","Besetzbar","Bestellbar","Bestechbar","Besteuerbar",
  "Betreibbar","Bewohnbar","Bezahlbar","Bezwingbar","Biegbar",
  "Brauchbar","Buchbar","Codierbar","Darstellbar","Datierbar",
  "Deaktivierbar","Dehnbar","Definierbar","Delegierbar","Denkbar",
  "Digitalisierbar","Dokumentierbar","Druckbar","Durchführbar","Einbaubar",
  "Eingrenzbar","Einplanbar","Einschaltbar","Einstellbar","Einteilbar",
  "Erfahrbar","Erfassbar","Erfüllbar","Erkennbar","Erklärbar",
  "Erlebbar","Ermittelbar","Erpressbar","Erreichbar","Ersetzbar",
  "Erweiterbar","Erzwingbar","Essbar","Exportierbar","Fahrbar",
  "Faltbar","Fassbar","Filterbar","Finanzierbar","Findbar",
  "Fixierbar","Formbar","Formatierbar","Fühlbar","Generierbar",
  "Geniessbar","Greifbar","Haftbar","Haltbar","Handhabbar",
  "Härtbar","Heilbar","Heizbar","Herstellbar","Herzeigbar",
  "Hörbar","Importierbar","Installierbar","Integrierbar","Kategorisierbar",
  "Klappbar","Klärbar","Klonbar","Kombinierbar","Komprimierbar",
  "Konfigurierbar","Kontrollierbar","Konvertierbar","Kopierbar","Korrigierbar",
  "Korrumpierbar","Kündbar","Küssbar","Ladbar","Lagerbar",
  "Lehrbar","Lenkbar","Lernbar","Lesbar","Lieferbar",
  "Lokalisierbar","Lösbar","Machbar","Manipulierbar","Messbar",
  "Mietbar","Mischbar","Modifizierbar","Nachvollziehbar","Nachweisbar",
  "Navigierbar","Nennbar","Normierbar","Nutzbar","Optimierbar",
  "Personalisierbar","Pflegbar","Planbar","Portierbar","Positionierbar",
  "Programmierbar","Protokollierbar","Prüfbar","Quantifizierbar","Realisierbar",
  "Recycelbar","Reduzierbar","Referenzierbar","Registrierbar","Regelbar",
  "Reparierbar","Reproduzierbar","Rettbar","Rockbar","Rollbar",
  "Rutschbar","Sagbar","Schaltbar","Schätzbar","Scheinbar",
  "Schmelzbar","Schneidbar","Schreibbar","Schwimmbar","Sicherbar",
  "Sichtbar","Simulierbar","Skalierbar","Sonderbar","Sortierbar",
  "Speicherbar","Sperrbar","Spielbar","Spülbar","Spürbar",
  "Steuerbar","Strafbar","Suchbar","Synchronisierbar","Tastbar",
  "Tauschbar","Teilbar","Testbar","Tragbar","Transportierbar",
  "Trennbar","Trinkbar","Übersetzbar","Übertragbar","Überwindbar",
  "Umgehbar","Umkehrbar","Umrechenbar","Umsetzbar","Umwandelbar",
  "Unabsehbar","Unberechenbar","Unbrauchbar","Unessbar","Unfassbar",
  "Unhaltbar","Unheilbar","Unlenkbar","Unnahbar","Unsagbar",
  "Unscheinbar","Unschlagbar","Unsichtbar","Unspielbar","Untrennbar",
  "Unumkehrbar","Unvermeidbar","Unvorstellbar","Unwählbar","Unterscheidbar",
  "Validierbar","Veränderbar","Verarbeitbar","Verbesserbar","Verdaubar",
  "Verdoppelbar","Vereinbar","Vereinfachbar","Vererbbar","Verformbar",
  "Vergessbar","Vergleichbar","Verhandelbar","Verhinderbar","Verkaufbar",
  "Verknüpfbar","Verkürzbar","Verlängerbar","Vermeidbar","Vermietbar",
  "Verrechenbar","Verschiebbar","Verschlüsselbar","Versicherbar","Versetzbar",
  "Vertretbar","Verwaltbar","Verwechselbar","Verwendbar","Verwertbar",
  "Verwundbar","Vervielfältigbar","Verzeihbar","Verzichtbar","Visualisierbar",
  "Vorstellbar","Wählbar","Wandelbar","Waschbar","Weiterleitbar",
  "Widerlegbar","Wiederholbar","Wiederverwendbar","Wunderbar","Zahlbar",
  "Zählbar","Zerlegbar","Zitierbar","Zumutbar","Zurücksetzbar",
  "Zurückverfolgbar","Zusammenlegbar","Zuteilbar","Zuweisbar"
];

// Template-Generator für alle anderen Bars
function generateBar(name, id) {
  const { city, neighborhood } = getCity(id);

  // Semantische Interpretation des Namens
  const root = name.replace(/bar$/i, "").toLowerCase();

  const taglines = [
    `Wo ${root}en zur Kunst wird.`,
    `Ein Ort, der ${root} macht.`,
    `Für alle, die ${root}en wollen.`,
    `Hier ist alles ${name.toLowerCase()}.`,
    `${name} — mehr als ein Wort.`,
    `Endlich: Die Bar für ${root}ende Menschen.`,
    `Weil manches ${name.toLowerCase()} sein sollte.`,
  ];

  const concepts = [
    `Die ${name} in ${city}-${neighborhood} hat sich dem Prinzip des ${name.replace(/bar$/i, "ens")} verschrieben. Jeder Aspekt des Abends, vom ersten Blick bis zum letzten Schluck, folgt diesem Grundsatz.`,
    `In ${city} gibt es viele Bars — aber keine andere versteht ${root}en so gut wie die ${name}. Das Konzept ist simpel, die Ausführung verblüffend.`,
    `Die ${name} in ${city}-${neighborhood} ist ein Experiment: Was passiert, wenn man eine Bar konsequent nach dem Prinzip ${name.toLowerCase()} gestaltet? Das Ergebnis ist dieser Ort.`,
  ];

  const blogTitles = [
    `Was bedeutet es, ${name.toLowerCase()} zu sein?`,
    `Ein Abend in der ${name}`,
    `${name}: Eine Bar, ein Versprechen`,
    `Die Kunst des ${root}ens`,
    `Über das ${name.replace(/bar$/i, "werden")} und andere Fragen`,
  ];

  const blogContents = [
    `Die ${name} in ${city} ist eine dieser seltenen Bars, die einem etwas beibringen, ohne es zu wollen. Man betritt den Raum mit einer Erwartung — und verlässt ihn mit einer anderen.\n\nDer Name ist Programm: Hier dreht sich alles um die Idee des ${root}ens. Was das genau bedeutet, erschließt sich erst beim zweiten Drink. Beim ersten ist man noch zu sehr damit beschäftigt, sich umzusehen.\n\nDie Einrichtung ist das Ergebnis von jemandem, der sehr genau nachgedacht hat — und dann entschieden hat, dass zu viel Nachdenken das Ergebnis ruiniert. Also ist alles da und doch nichts zu viel.\n\nAm Ende des Abends fragt man sich: War ich das? War das der Ort? Oder war es der Drink? Und dann bestellt man noch einen, um es herauszufinden.`,
    `Man sagt, gute Bars findet man nicht — sie finden einen. Die ${name} hat diesen Satz zum Geschäftsmodell gemacht und ist damit erstaunlich erfolgreich.\n\nDas Konzept ist auf den ersten Blick schlicht: eine Bar, die ${name.toLowerCase()} ist. Auf den zweiten Blick erkennt man, wie selten das wirklich ist. Die meisten Dinge, die behaupten, ${name.toLowerCase()} zu sein, sind es nicht.\n\nDer Barkeeper — er nennt sich einfach »K.« — mischt schweigend, aber nicht unfreundlich. Man hat das Gefühl, er weiß bereits, was man bestellen wird, bevor man es selbst weiß.\n\nDie Stammgäste kommen nicht trotz des Konzepts. Sie kommen wegen ihm. Und das sagt alles.`,
  ];

  const drinks = [
    { name: `Das ${name.replace(/bar$/i, "e")}`, desc: `Ein Drink, der seinen Namen trägt wie ein Versprechen: klar in der Idee, komplex in der Ausführung. Mit Gin, Bergamotte und einem Hauch von dem, was der Name verspricht.` },
    { name: `${name} Spezial`, desc: `Hausrezept aus dem Jahr der Gründung. Basis ist ein lokaler Destillat, verfeinert mit saisonalen Zutaten und einem Geheimnis, das der Barkeeper nie verrät.` },
    { name: `Flüssiges Konzept`, desc: `Mezcal, frische Kräuter, ein Tropfen Bitters. So komplex wie der Name der Bar und so einfach wie ein guter Abend.` },
  ];

  const ti = id % taglines.length;
  const ci = id % concepts.length;
  const bti = id % blogTitles.length;
  const bci = id % blogContents.length;
  const di = id % drinks.length;
  const drink = drinks[di];

  return {
    id,
    name,
    slug: toSlug(name),
    publishDate: getDate(id),
    city,
    neighborhood,
    tagline: taglines[ti],
    concept: concepts[ci],
    blogTitle: blogTitles[bti],
    blogContent: blogContents[bci],
    signatureDrink: drink.name,
    signatureDrinkDescription: drink.desc,
    imagePrompt: `A moody bar interior photograph of ${name}, ${city} neighborhood aesthetic, atmospheric bar scene with characteristic details matching the concept of "${root}", warm amber and deep shadow lighting, cinematic grain, editorial photography style`,
    tweet: `Die ${name} in ${city}: ${taglines[ti]} Einer der eigenwilligsten Orte der Stadt. 🍸 #${name} #${city}`,
    instagram: `${name} — ${taglines[ti]}\n\nIn ${city}-${neighborhood} gibt es diesen Ort. Und wenn man ihn einmal kennt, versteht man den Namen sofort.\n\n#${name.toLowerCase()} #${city.toLowerCase()} #cocktailbar #nachtleben #barkultur #bar #abend #drinks`,
    facebook: `Die ${name} in ${city} ist einer dieser Orte, über die man spricht, wenn man nach Hause kommt. ${concepts[ci].split(".")[0]}. Habt ihr schon davon gehört?`,
  };
}

// Manuelle Daten für besondere Bars
const specialBars = {
  "Wunderbar": {
    tagline: "Weil manches einfach wunderbar ist.",
    concept: "Die Wunderbar in München-Schwabing ist die einzige Bar der Stadt, die ihren Namen buchstäblich nimmt. Hier passieren kleine Wunder — manchmal im Glas, manchmal zwischen Menschen.",
    blogTitle: "Das Wunder, das jeder meint, aber niemand beschreibt",
    blogContent: "Das Wort »wunderbar« wird täglich millionenfach gesagt und meistens bedeutet es: ganz okay. Die Wunderbar in München hat sich zur Aufgabe gemacht, das zu ändern.\n\nHier ist alles tatsächlich wunderbar — im ursprünglichen Sinne. Die Decke leuchtet wie ein Sternenhimmel. Die Drinks enthalten Zutaten, die man nicht erwartet. Die Gespräche dauern länger, als man geplant hat. Der Abend endet anders als er begann.\n\nDer Besitzer, ein ehemaliger Zauberer (er betont: »Illusionist«), hat jeden Abend eine kleine Überraschung eingebaut. Manchmal ist es ein Drink, der die Farbe wechselt. Manchmal ist es ein Fremder, der die beste Geschichte des Abends erzählt.\n\nDie Wunderbar ist der Beweis, dass manche Dinge noch genau so wunderbar sind wie ihr Name verspricht. Man muss nur den richtigen Ort finden.",
    signatureDrink: "Das eigentliche Wunder",
    signatureDrinkDescription: "Champagner, Veilchenlikör und ein essbares Blattgold, das sich im Glas löst. Der Drink ändert beim Trinken leicht die Farbe. Der Barkeeper erklärt nicht warum.",
    imagePrompt: "A moody bar interior photograph of Wunderbar, ceiling covered in twinkling stars, magical golden light, vintage curiosities on shelves, fairy tale meets elegant bar aesthetic, cinematic lighting, film grain, editorial photography, dark and atmospheric",
    tweet: "Die Wunderbar in München: Der Ort, der beweist, dass wunderbar noch mehr bedeutet als »ganz okay«. ✨ #Wunderbar #München",
    instagram: "Manchmal ist das Wunderbarste das Einfachste: Ein guter Drink, ein gutes Gespräch, ein Ort, der genau das ist, was er verspricht. ✨\n\n#wunderbar #münchen #schwabing #magic #cocktailbar #nachtleben #barkultur #wunder",
    facebook: "Die Wunderbar in München-Schwabing ist der Beweis: Wunderbar kann noch wirklich wunderbar sein. Was war heute wunderbar bei euch?"
  },
  "Sonderbar": {
    tagline: "Seltsam sein war noch nie so schön.",
    concept: "Die Sonderbar in Leipzig-Connewitz ist ein Sammelsurium des Eigenartigen. Nichts passt zusammen, alles ergibt Sinn. Wer sich selbst für etwas seltsam hält, fühlt sich hier sofort zu Hause.",
    blogTitle: "Ode an das Sonderbare",
    blogContent: "Es gibt Bars, in die man geht, um normal zu sein. Die Sonderbar ist nicht so eine Bar.\n\nDas erste, was man beim Betreten bemerkt: Die Stühle stimmen nicht überein. Kein einziger. Manche sind Barock, manche aus den 50ern, manche offensichtlich aus verschiedenen Sets zusammengestückelt. Das zweite: Die Musik springt alle drei Minuten das Genre. Das dritte: Man fühlt sich sofort wohl.\n\nDie Sonderbar in Leipzig-Connewitz hat eine Stammkundschaft, die ihre Sonderbarkeit wie eine Auszeichnung trägt. Hier trifft man Leute, die Briefmarken sammeln und Gedichte über Regenwürmer schreiben. Hier trifft man auch Leute, die aussehen wie alle anderen — aber innerlich wissen, dass sie das nicht sind.\n\nDer Barkeeper Odd (kein Spitzname) sagt: »Sonderbar zu sein ist die einzige Normalität, die ich kenne.«",
    signatureDrink: "Das Sonderliche",
    signatureDrinkDescription: "Vier Zutaten, die einzeln schrecklich klingen: Aquavit, Miso, Zitrussaft und Ingwerbier. Zusammen ergeben sie eine Harmonie, die man nicht erwartet.",
    imagePrompt: "A moody bar interior photograph of Sonderbar, mismatched furniture from different eras, eclectic curiosities, taxidermy meets vintage posters meets modern art, warm chaotic beauty, cinematic lighting, film grain, editorial photography, dark and atmospheric",
    tweet: "Die Sonderbar in Leipzig: Wo Seltsamsein die höchste Form der Normalität ist. 🦋 #Sonderbar #Leipzig",
    instagram: "Sonderbar — weil die interessantesten Menschen immer ein bisschen seltsam sind. In Leipzig-Connewitz gibt es einen Ort, der das versteht. 🦋\n\n#sonderbar #leipzig #connewitz #seltsam #bar #nachtleben #barkultur #eigenartig",
    facebook: "Die Sonderbar in Leipzig: Hier stimmt kein Stuhl überein, die Musik springt das Genre — und trotzdem (oder deshalb) fühlt man sich sofort zu Hause. Wer ist schon gern normal?"
  },
  "Trinkbar": {
    tagline: "Es ist, was es ist. Und das ist viel.",
    concept: "Die Trinkbar in Köln-Ehrenfeld stellt keine großen Ansprüche — sie ist einfach eine sehr, sehr gute Bar. Keine Konzeptkunst, kein Alleinstellungsmerkmal außer diesem: Hier ist alles trinkbar und vieles sogar sehr gut.",
    blogTitle: "In Verteidigung des Trinkbaren",
    blogContent: "Nicht jede Bar muss ein Erlebnis sein. Manchmal reicht es, wenn sie gut ist. Die Trinkbar in Köln versteht das.\n\nDer Name ist programmatisch und bescheiden zugleich. Trinkbar. Nicht großartig. Nicht überragend. Aber trinkbar — und wer jemals einen untrinkbaren Cocktail bestellt hat, weiß, was das wert ist.\n\nDie Karte ist kurz. Sechs Cocktails, zehn Biere, sieben Weine. Alles davon ist sorgfältig ausgewählt, solide zubereitet und fair bepreist. Der Barkeeper Heinz sagt: »Ich mache keine Kunst. Ich mache Drinks.« Und er macht sie gut.\n\nDie Trinkbar ist voll. Immer. Das ist die beste Kritik, die ein Ort bekommen kann.",
    signatureDrink: "Der Klassiker",
    signatureDrinkDescription: "Ein Negroni. Perfekt. Keine Variationen, keine Experimente. Weil manche Dinge schon richtig sind.",
    imagePrompt: "A moody bar interior photograph of Trinkbar, classic Cologne bar aesthetic, worn wooden bar counter, honest working-class elegance, warm beer-amber lighting, neighborhood bar feel, cinematic lighting, film grain, editorial photography, dark and atmospheric",
    tweet: "Die Trinkbar in Köln: Keine Kunst, keine Konzepte. Nur gute Drinks. Manchmal ist das genug. 🍺 #Trinkbar #Köln",
    instagram: "Manchmal braucht es kein großes Konzept. Manchmal reicht es, wenn es einfach gut ist. Die Trinkbar in Köln-Ehrenfeld. 🍺\n\n#trinkbar #köln #ehrenfeld #cocktailbar #nachtleben #barkultur #klassisch #ehrlich",
    facebook: "Die Trinkbar in Köln macht keine Kunst. Sie macht Drinks. Und das sehr gut. Manchmal ist das alles, was man braucht."
  },
  "Denkbar": {
    tagline: "Hier werden Gedanken ausgeschenkt.",
    concept: "Die Denkbar in Frankfurt-Bornheim ist eine philosophische Bar. Jeder Tisch hat ein Thema, jeder Abend eine Leitfrage, jeder Drink einen Gedanken. Hier trinkt man nicht nur — man denkt.",
    blogTitle: "Cogito, ergo bibo",
    blogContent: "Ich denke, also trinke ich — oder war es andersherum? In der Denkbar in Frankfurt spielt diese Frage keine Rolle, weil beides gleichzeitig passiert.\n\nDas Konzept ist so simpel wie kühn: Die Bar hat kein Musikprogramm. Stattdessen gibt es jeden Abend eine Frage, die an der Tafel über dem Tresen steht. »Kann man sich selbst täuschen?« »Was schulden wir der Zukunft?« »Ist Einsamkeit wählbar?« Die Gäste reden. Manchmal miteinander. Manchmal mit sich selbst.\n\nDer Barkeeper — ein Philosophiestudent im fünfzehnten Semester, der nicht aufhören kann — mischt Drinks, die nach Philosophen benannt sind. Der »Kierkegaard« ist bitter und süß zugleich. Der »Nietzsche« ist stark genug, um Überzeugungen zu erschüttern.\n\nWer nur trinken will, ist auch willkommen. Aber irgendwann denkt man doch.",
    signatureDrink: "Der Kant",
    signatureDrinkDescription: "Kategorisch imperativ: Ein Drink, den man wollen muss, dass alle ihn trinken wollen. Bourbon, Honig, Lemon. Klassisch und richtig.",
    imagePrompt: "A moody bar interior photograph of Denkbar, chalkboard with philosophical questions, library-like bookshelves, leather armchairs, deep thinking atmosphere, warm reading lamp light, cinematic lighting, film grain, editorial photography, dark and atmospheric",
    tweet: "Die Denkbar in Frankfurt: Wo Philosophie vom Glas kommt. Cogito ergo bibo. 🧠 #Denkbar #Frankfurt",
    instagram: "Ich denke, also trinke ich. Oder umgekehrt. In der Denkbar in Frankfurt-Bornheim spielt die Reihenfolge keine Rolle. 🧠📚\n\n#denkbar #frankfurt #bornheim #philosophie #cocktailbar #nachtleben #barkultur #nachdenken",
    facebook: "Die Denkbar in Frankfurt: Jeden Abend eine neue Frage an der Tafel. Jeden Abend neue Gespräche. Was wäre eure Frage für heute Abend?"
  },
  "Hörbar": {
    tagline: "Musik, die man trinken kann.",
    concept: "Die Hörbar in Berlin-Kreuzberg ist eine audiophile Bar. Konzertsaalakustik, Vinylsammlung mit 12.000 Platten, Drinks, die nach Musikstücken benannt sind. Hier hört man besser zu als anderswo.",
    blogTitle: "Was man hört, wenn man wirklich zuhört",
    blogContent: "Die Hörbar in Berlin hat ein Problem: Man kommt nicht von ihr los. Man geht rein für einen Drink und bleibt für ein Album. Man bleibt für ein Album und bleibt für drei.\n\nDie Vinylsammlung umfasst über 12.000 Platten, aufgebaut nach einem System, das nur der Barkeeper kennt. »Stimmungskategorien«, sagt er. »Nicht Genre. Stimmung.« Man kann nach Gefühl suchen lassen — »traurig-glücklich mit Hoffnung« funktioniert genauso wie »tanzen aber nachdenken«.\n\nDie Akustik wurde von einem Konzerthausingenieur entworfen. Kein Widerhall, kein toter Klang. Nur Musik, die landet, wie sie soll. Die Boxen kosteten mehr als der Rest der Inneneinrichtung zusammen.\n\nAn einem guten Abend herrscht eine merkwürdige Kollektivstille: alle hören zu, alle trinken, niemand muss reden. Das ist das höchste Lob, das ein Ort bekommen kann.",
    signatureDrink: "Das Largo",
    signatureDrinkDescription: "Langsam gemixte Kombination aus Rum, Karamell und Vanille. Wird in acht Minuten hergestellt — der Dauer eines durchschnittlichen Largos.",
    imagePrompt: "A moody bar interior photograph of Hörbar, thousands of vinyl records covering the walls, professional audio equipment, audiophile speakers, warm golden light on wooden shelves, concert hall aesthetic in a bar, cinematic lighting, film grain, editorial photography",
    tweet: "Die Hörbar in Berlin: 12.000 Platten, perfekte Akustik, ein Drink. Man kommt für einen. Man bleibt für zwölf. 🎵 #Hörbar #Berlin",
    instagram: "12.000 Schallplatten. Konzertsaalakustik. Drinks nach Musikstücken. Die Hörbar in Berlin-Kreuzberg ist der Ort, an dem man endlich wieder wirklich zuhört. 🎵🎶\n\n#hoerbar #berlin #kreuzberg #vinyl #music #audiophile #bar #nachtleben #barkultur",
    facebook: "Die Hörbar in Berlin: 12.000 Platten, perfekte Akustik. Habt ihr auch solche Orte, wo Musik endlich wieder wirklich klingt?"
  },
  "Bezahlbar": {
    tagline: "Luxus ohne Scham. Qualität ohne Aufpreis.",
    concept: "Die Bezahlbar in Frankfurt-Sachsenhausen beweist täglich, dass gut und günstig kein Widerspruch sein muss. Hier zahlt man für den Drink, nicht für die Atmosphäre. Die Atmosphäre ist kostenlos.",
    blogTitle: "Der revolutionärste Akt in der Gastronomie",
    blogContent: "Die Bezahlbar hat in Frankfurt eine stille Revolution ausgelöst. Die Karte hat Preise, die man nicht dreifach kontrolliert. Das ist fast unerhört.\n\nDie Besitzerin Ursula, ehemalige Betriebswirtschaftlerin, hat sich ein einfaches Ziel gesetzt: »Ich will, dass Leute, die wirklich gute Drinks lieben, sich das leisten können.« Kein Aufpreis für Lage, kein Aufpreis für Deko, kein versteckter »Atmosphäre-Zuschlag«.\n\nDie Qualität ist nicht kompromittiert. Die Spirituosen sind gut. Die Zitrusfrüchte sind frisch. Die Eiswürfel werden selbst gemacht. Es ist die Kalkulation, die stimmt: Ursula arbeitet effizienter als die Konkurrenz und teilt die Ersparnis mit den Gästen.\n\nDie Bezahlbar ist immer voll. Menschen aller Berufsgruppen sitzen nebeneinander und trinken gut. Das klingt selbstverständlich und ist es nicht.",
    signatureDrink: "Fairer Preis",
    signatureDrinkDescription: "Ein tadelloser Whiskey Sour für den Preis, den andere für ein Mineralwasser nehmen. Bourbon, frische Zitrone, Eiweiß. Fertig.",
    imagePrompt: "A moody bar interior photograph of Bezahlbar, unpretentious but beautiful interior, quality without ostentation, diverse crowd of people, honest lighting, no unnecessary decoration just good vibes, cinematic lighting, film grain, editorial photography",
    tweet: "Die Bezahlbar in Frankfurt: Gute Drinks. Echte Preise. Die stille Revolution. 💸 #Bezahlbar #Frankfurt",
    instagram: "Warum muss gut trinken teuer sein? Die Bezahlbar in Frankfurt-Sachsenhausen findet: Muss es nicht. Qualität ohne Aufpreis. 💸\n\n#bezahlbar #frankfurt #sachsenhausen #fair #cocktailbar #nachtleben #barkultur #qualitaet",
    facebook: "Die Bezahlbar in Frankfurt beweist: Gute Drinks müssen nicht teuer sein. Was haltet ihr von Bars, die Qualität ohne Aufpreis anbieten?"
  },
  "Machbar": {
    tagline: "Hier ist alles möglich. Wirklich alles.",
    concept: "Die Machbar in Hamburg-St. Pauli ist ein Ort des Optimismus. Kein Wunsch zu groß, kein Drink zu verrückt, kein Traum zu unbescheiden. Die Machbar macht.",
    blogTitle: "Das kann man nicht machen. Doch.",
    blogContent: "»Das kann man nicht machen«, sagen viele. Die Machbar in Hamburg macht es trotzdem.\n\nDer Barkeeper Kaspar hört jeden Abend die wildesten Drink-Ideen. »Ich will etwas, das nach Sonntagnachmittag schmeckt.« Er nickt. »Ich will etwas, das mir hilft, meine Eltern anzurufen.« Er nickt. »Ich will etwas Grünes, das aber nicht nach Gras schmeckt.« Er nickt. Und dann macht er es.\n\nDie Machbar hat keine feste Karte. Stattdessen beschreibt man, was man will — eine Stimmung, eine Erinnerung, einen Wunsch — und Kaspar macht daraus einen Drink. Manche sind Meisterwerke. Manche sind mutige Experimente. Keiner ist langweilig.\n\nDer Name ist eine Haltung. »Machbar ist keine Eigenschaft«, sagt Kaspar. »Machbar ist eine Entscheidung.«",
    signatureDrink: "Das Mögliche",
    signatureDrinkDescription: "Kein festes Rezept. Kaspar fragt: »Was wäre möglich?« Und macht dann genau das.",
    imagePrompt: "A moody bar interior photograph of Machbar, walls covered in sticky notes with handwritten drink requests, workshop aesthetic meets bar, tools and bottles mixed together, energetic and possible atmosphere, cinematic lighting, film grain, editorial photography",
    tweet: "Die Machbar in Hamburg: »Das kann man nicht machen.« — »Doch.« 💪 #Machbar #Hamburg",
    instagram: "»Das kann man nicht machen.« Die Machbar in Hamburg-St. Pauli sagt: Doch. Immer. 💪\n\n#machbar #hamburg #stpauli #cocktailbar #nachtleben #barkultur #machen #optimismus",
    facebook: "Die Machbar in Hamburg: Keine Karte, dafür unbegrenzte Möglichkeiten. Ihr beschreibt, was ihr wollt. Kaspar macht es. Was wäre euer Wunsch-Drink?"
  },
};

const manualNames = Object.keys(specialBars);

// Alle Bars zusammenstellen
const allBars = allNames.map((name, i) => {
  const id = i + 1;

  // Manuelle Daten zuerst prüfen
  if (specialBars[name]) {
    const { city, neighborhood } = getCity(id);
    return {
      id,
      name,
      slug: toSlug(name),
      publishDate: getDate(id),
      city,
      neighborhood,
      ...specialBars[name],
    };
  }

  // Vordefinierte detaillierte Daten für die ersten 5
  const predef = barData.find(b => b.name === name);
  if (predef) {
    const { city, neighborhood } = getCity(id);
    return {
      id,
      name,
      slug: toSlug(name),
      publishDate: getDate(id),
      city,
      neighborhood,
      ...predef,
    };
  }

  return generateBar(name, id);
});

// bars.json schreiben
const dataDir = join(ROOT, "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const barsJson = join(dataDir, "bars.json");
writeFileSync(barsJson, JSON.stringify(allBars, null, 2));
console.log(`✅ ${allBars.length} Bars generiert → ${barsJson}`);

// Image prompts exportieren
const socialDir = join(ROOT, "social-media");
if (!existsSync(socialDir)) mkdirSync(socialDir, { recursive: true });

const prompts = allBars.map(b => `=== ${b.name} (#${b.id}) ===\n${b.imagePrompt}\n`);
const promptsPath = join(socialDir, "image-prompts-for-nano-banana.txt");
writeFileSync(promptsPath, prompts.join("\n"));
console.log(`🖼  Bildprompts exportiert → ${promptsPath}`);
