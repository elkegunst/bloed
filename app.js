// ── PDF.JS WORKER ──────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ── STATE ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'bloodapp_v2';

const DEFAULT_CATEGORIES = [
  'Hematologie', 'IJzer & Anemie', 'Vitaminen & Mineralen', 'Lever', 'Nieren',
  'Tumormarkers',
  'Glucose & Metabolisme', 'Cholesterol en Hart', 'Schildklier', 'Hormonen',
  'Ontsteking', 'Elektrolieten', 'Eiwitten', 'Overige',
];

// Preset elements with ortho ranges and descriptions
const PRESET_ELEMENTS = {
  // ── HEMATOLOGIE — rode bloedcellen ──
  'Hemoglobine':                                    { category: 'Hematologie', orthoMin: 13.5, orthoMax: 15.5, description: 'Eiwit in rode bloedcellen dat zuurstof transporteert. Te laag veroorzaakt vermoeidheid, kortademigheid en bloedarmoede. Te hoog kan wijzen op uitdroging of een aandoening van het beenmerg.' },
  'Erythrocyten':                                   { category: 'Hematologie', orthoMin: 4.0,  orthoMax: 5.0,  description: 'Rode bloedcellen die zuurstof door het lichaam vervoeren. Te weinig leidt tot bloedarmoede met vermoeidheid en bleekheid. Te veel vergroot de kans op bloedstolsels.' },
  'Hematocriet':                                    { category: 'Hematologie', orthoMin: 38,   orthoMax: 46,   description: 'Het percentage rode bloedcellen in je totale bloedvolume. Te laag gaat samen met bloedarmoede. Te hoog kan wijzen op uitdroging of een verhoogde aanmaak van rode bloedcellen.' },
  'Gemiddeld celvolume (MCV)':                      { category: 'Hematologie', orthoMin: 82,   orthoMax: 95,   description: 'De gemiddelde grootte van rode bloedcellen. Te kleine cellen wijzen op ijzertekort. Te grote cellen wijzen op een tekort aan vitamine B12 of foliumzuur.' },
  'Gemiddeld cellulair hemoglobine (MCH)':          { category: 'Hematologie', orthoMin: 27,   orthoMax: 32,   description: 'De hoeveelheid hemoglobine per rode bloedcel. Te laag wijst op ijzertekort of kleine bloedcellen. Te hoog komt voor bij vergrote bloedcellen door B12- of foliumzuurtekort.' },
  'Gemiddelde hemoglobineconcentratie (MCHC)':      { category: 'Hematologie', orthoMin: 32,   orthoMax: 36,   description: 'De concentratie hemoglobine in rode bloedcellen. Te laag wijst op bloedarmoede door ijzertekort. Te hoog is zeldzaam en kan wijzen op afbraak van rode bloedcellen.' },
  'Rode bloedcellen distributie (RDW)':             { category: 'Hematologie', orthoMax: 13,                   description: 'Maat voor hoe sterk rode bloedcellen in grootte variëren. Verhoogd bij gemengde tekorten zoals ijzer én B12, of bij herstel na bloedarmoede. Een hoge waarde vraagt om verdere uitzoekering.' },
  'Reticulocyten':                                  { category: 'Hematologie',                                 description: 'Jonge rode bloedcellen, net vrijgegeven vanuit het beenmerg. Te laag wijst op verminderde aanmaak van rode bloedcellen. Te hoog wijst op verhoogde productie, bijvoorbeeld bij herstel van bloedarmoede of bloedverlies.' },
  'Reticulocytose':                                 { category: 'Hematologie',                                 description: 'Absolute telling van jonge rode bloedcellen in het bloed. Geeft een directere maat voor de activiteit van het beenmerg dan het percentage. Verhoogd bij actieve bloedaanmaak na verlies of behandeling.' },
  'Normoblasten':                                   { category: 'Hematologie',                                 description: 'Onrijpe rode bloedcellen met nog een celkern — normaal alleen aanwezig in beenmerg, niet in bloed. Aanwezigheid in bloed wijst op ernstige stress van het beenmerg of een onderliggende bloedaandoening.' },
  // ── HEMATOLOGIE — witte bloedcellen ──
  'Leukocyten':                                     { category: 'Hematologie', orthoMin: 4000, orthoMax: 7500, description: 'Witte bloedcellen die het lichaam beschermen tegen infecties. Te laag maakt je vatbaar voor infecties. Te hoog kan wijzen op een acute infectie, ontsteking of in zeldzame gevallen een bloedaandoening.' },
  'Neutrofielen':                                   { category: 'Hematologie', orthoMin: 45,   orthoMax: 65,   description: 'De meest voorkomende witte bloedcel, eerste verdediging bij bacteriële infecties. Te laag maakt je vatbaar voor infecties. Te hoog wijst op een actieve bacteriële infectie of ontsteking.' },
  'Neutrofielen totaal':                            { category: 'Hematologie',                                 description: 'Absoluut aantal neutrofielen per microliter bloed. Geeft samen met het percentage een volledig beeld van de neutrofielenactiviteit.' },
  'Lymfocyten':                                     { category: 'Hematologie', orthoMin: 25,   orthoMax: 45,   description: 'Witte bloedcellen die virale infecties bestrijden en het immuungeheugen vormen. Te laag kan wijzen op chronische stress, een virus of immuunproblemen. Te hoog komt voor bij virale infecties.' },
  'Lymfocyten totaal':                              { category: 'Hematologie',                                 description: 'Absoluut aantal lymfocyten per microliter bloed. Relevant bij vermoedelijke virale infecties of immuunaandoeningen.' },
  'Monocyten':                                      { category: 'Hematologie', orthoMin: 2,    orthoMax: 8,    description: 'Grote witte bloedcellen die ziekteverwekkers opruimen en het immuunsysteem reguleren. Te hoog wijst op chronische ontsteking of infectie. Te laag is zeldzaam maar kan voorkomen bij beenmergproblemen.' },
  'Monocyten totaal':                               { category: 'Hematologie',                                 description: 'Absoluut aantal monocyten per microliter bloed. Verhoogd bij chronische infecties of inflammatoire aandoeningen.' },
  'Eosinofielen':                                   { category: 'Hematologie', orthoMin: 1,    orthoMax: 4,    description: 'Witte bloedcellen betrokken bij allergische reacties en afweer tegen parasieten. Te hoog wijst op allergie, astma of een parasitaire infectie. Te laag heeft weinig klinische betekenis.' },
  'Eosinofielen totaal':                            { category: 'Hematologie',                                 description: 'Absoluut aantal eosinofielen per microliter bloed. Verhoogd bij allergieën of parasitaire infecties.' },
  'Basofielen':                                     { category: 'Hematologie', orthoMin: 0.2,  orthoMax: 1.0,  description: 'Zeldzame witte bloedcellen betrokken bij allergische reacties. Verhoogd bij allergieën of schildklierproblemen. Verlaagd heeft zelden klinische betekenis.' },
  'Basofielen totaal':                              { category: 'Hematologie',                                 description: 'Absoluut aantal basofielen per microliter bloed. Verhoogd bij allergische of ontstekingreacties.' },
  'Immature granulocyten':                          { category: 'Hematologie', orthoMax: 0.5,                  description: 'Onrijpe witte bloedcellen die normaal niet in het bloed circuleren. Een verhoogde waarde wijst op een ernstige infectie, ontsteking of beenmergactivatie.' },
  // ── HEMATOLOGIE — trombocyten & stolling ──
  'Trombocyten':                                    { category: 'Hematologie', orthoMin: 175,  orthoMax: 340,  description: 'Bloedplaatjes die bloedstolling mogelijk maken. Te laag vergroot het risico op bloedingen. Te hoog verhoogt het risico op trombose.' },
  'Sedimentatie':                                   { category: 'Hematologie', orthoMax: 15,                   description: 'Hoe snel rode bloedcellen bezinken in een buisje bloed. Verhoogd bij ontsteking, infectie of auto-immuunziektes. Niet specifiek genoeg om alleen op te steunen, maar nuttig als signaal.' },
  'Protrombinetijd (%)':                            { category: 'Hematologie',                                 description: 'Maat voor hoe snel het bloed stolt via de externe stollingscascade. Te laag wijst op een stollingsstoornis of ernstige leverziekte. Te hoog kan voorkomen bij gebruik van bloedverdunners.' },
  'Protrombinetijd INR':                            { category: 'Hematologie',                                 description: 'Gestandaardiseerde weergave van de protrombinetijd. Normaal rond 1.0. Te hoog bij gebruik van antistollingsmiddelen of leverproblemen. Te laag wijst op verhoogd stollingsneiging.' },
  'Protrombinetijd (sec)':                          { category: 'Hematologie',                                 description: 'Tijd in seconden die het bloed nodig heeft om te stollen via de externe cascade. Verlengd bij stollingsstoornissen, vitamine K-tekort of leverziekte.' },
  'Geactiveerde partiële tromboplastinetijd (aPTT)':{ category: 'Hematologie',                                 description: 'Maat voor de interne stollingscascade. Verlengd bij gebruik van heparine, stollingsfactortekorten of bij antifosfolipidensyndroom.' },
  'aPTT ratio':                                     { category: 'Hematologie',                                 description: 'Verhouding van de aPTT ten opzichte van een referentiewaarde. Normaal rond 1.0. Verhoogd bij dezelfde oorzaken als een verlengde aPTT.' },

  // ── IJZER & ANEMIE ──
  'IJzer':                    { category: 'IJzer & Anemie',        orthoMin: 70,   orthoMax: 150,  description: 'Ijzer in het bloed dat op dat moment in omloop is. Sterk variabel door voeding en tijdstip — bekijk altijd samen met ferritine. Te laag geeft vermoeidheid en bloedarmoede. Te hoog kan wijzen op hemochromatose.' },
  'Ferritine':                { category: 'IJzer & Anemie',        orthoMin: 50,   orthoMax: 150,  description: 'Eiwitcomplex dat de ijzervoorraad in het lichaam opslaat. Te laag geeft vermoeidheid, haaruitval en concentratieproblemen, ook als hemoglobine nog normaal is. Te hoog kan wijzen op ontsteking, leverproblemen of ijzerstapeling.' },

  // ── VITAMINEN ──
  'Vitamine B6 (Pyridoxine)': { category: 'Vitaminen & Mineralen', orthoMin: 40,   orthoMax: 80,   description: 'Betrokken bij de aanmaak van neurotransmitters, hormoonmetabolisme en het immuunsysteem. Te laag geeft stemmingsklachten, vermoeidheid en neuropathie. Langdurig te hoog via suppletie kan zenuwschade veroorzaken.' },
  'Vitamine B11 (Foliumzuur)':{ category: 'Vitaminen & Mineralen', orthoMin: 10,   orthoMax: 24,   description: 'B-vitamine nodig voor celdeling, DNA-aanmaak en het afbreken van homocysteïne. Te laag verhoogt het risico op bloedarmoede en bij zwangerschap op neurale buisdefecten. Te hoog via suppletie kan B12-tekort maskeren.' },
  'Vitamine B12 (Cobalamine)':{ category: 'Vitaminen & Mineralen', orthoMin: 500,  orthoMax: 900,  description: 'Essentieel voor de aanmaak van rode bloedcellen en een gezond zenuwstelsel. Te laag geeft tintelingen, geheugenklachten, vermoeidheid en bloedarmoede. Tekort komt vaker voor bij vegetariërs, veganisten en ouderen.' },
  'Vitamine D':               { category: 'Vitaminen & Mineralen', orthoMin: 60,   orthoMax: 100,  description: 'Hormoon-vitamine aangemaakt via zonlicht, betrokken bij botsterkte, immuunfunctie en stemming. Te laag geeft vermoeidheid, spierpijn, verhoogde infectiegevoeligheid en somberheid. Overdosering is mogelijk maar zeldzaam bij suppletie zonder meting.' },


  // ── LEVER ──
  'Alanineaminotransferase (ALT)':     { category: 'Lever',        orthoMax: 25,                   description: 'Leverenzym dat vrijkomt bij beschadiging van levercellen. Verhoogd bij leverontsteking, vetlever, medicijngebruik of alcoholgebruik. Aanhoudend verhoogd vraagt om verder onderzoek.' },
  'Aspartaataminotransferase (AST)':   { category: 'Lever',        orthoMax: 35,                   description: 'Leverenzym dat ook voorkomt in hartspier en skeletspieren. Verhoogd bij leverschade, hartinfarct of spierbeschadiging. Bekijk altijd samen met ALT voor een volledig beeld.' },
  'Gamma-glutamyltransferase (Gamma-GT)': { category: 'Lever',    orthoMax: 25,                   description: 'Leverenzym dat stijgt bij galwegproblemen, alcoholgebruik en bepaalde medicijnen. Verhoogd in combinatie met andere leverwaarden wijst op leverproblematiek. Geïsoleerd verhoogd kan ook voorkomen zonder duidelijke oorzaak.' },
  'Alkalische fosfatase':     { category: 'Lever',                 orthoMin: 44,   orthoMax: 120,  description: 'Enzym aanwezig in lever, botten en nieren. Verhoogd bij galwegobstructie, botaandoeningen of leverziekte. Te laag kan wijzen op een tekort aan zink of magnesium.' },
  'Bilirubine Totaal':        { category: 'Lever',                 orthoMax: 1.0,                  description: 'Afbraakproduct van hemoglobine dat via de lever wordt uitgescheiden. Verhoogd bij leverproblemen, galwegobstructie of verhoogde afbraak van rode bloedcellen. Licht verhoogd bij het syndroom van Gilbert is goedaardig.' },
  'Lactaatdehydrogenase (LDH)': { category: 'Lever',              orthoMin: 140,  orthoMax: 280,  description: 'Enzym aanwezig in veel weefsels dat vrijkomt bij weefselschade. Verhoogd bij hartinfarct, longembool, leverziekte of hemolyse. Niet specifiek — moet altijd in context bekeken worden.' },

  // ── NIEREN ──
  'Creatinine':               { category: 'Nieren',                orthoMin: 0.5,  orthoMax: 0.9,  description: 'Afvalproduct van spiermetabolisme dat via de nieren wordt uitgescheiden. Verhoogd bij verminderde nierfunctie of uitdroging. Te laag kan wijzen op weinig spiermassa. Bekijk steeds samen met de eGFR.' },
  'Urinezuur':                { category: 'Nieren',                                                description: 'Afbraakproduct van purines uit voeding en celdeling. Te hoog verhoogt het risico op jicht en nierstenen. Daalt met een purine-arme voeding en voldoende hydratatie. Te laag is zeldzaam maar kan voorkomen bij bepaalde medicijnen.' },

  // ── GLUCOSE & METABOLISME ──
  'Glucose':                  { category: 'Glucose & Metabolisme', orthoMin: 75,   orthoMax: 90,   description: 'Nuchter bloedsuiker. Te laag geeft duizeligheid, trillen en concentratieproblemen. Te hoog — ook binnen de "normale" range — kan insulineresistentie signaleren. Diabetes wordt gediagnosticeerd bij herhaaldelijk ≥ 126 mg/dL.' },
  'Geglyceerd hemoglobine % (HbA1c)':    { category: 'Glucose & Metabolisme', orthoMin: 4.5, orthoMax: 5.5, description: 'Gemiddeld bloedsuiker over de afgelopen 2 à 3 maanden, uitgedrukt als percentage (DCCT/NGSP). Te hoog wijst op langdurig verhoogde bloedsuikers en risico op diabetes. Te laag komt voor bij bloedarmoede of frequent lage bloedsuikers.' },
  'Geglyceerd hemoglobine IFCC (HbA1c)': { category: 'Glucose & Metabolisme',                description: 'Dezelfde meting als HbA1c %, maar uitgedrukt in mmol/mol volgens de internationale IFCC-standaard. Normaalwaarde ligt rond 20-42 mmol/mol. Beide waarden worden soms samen gerapporteerd.' },
  'Insuline':                 { category: 'Glucose & Metabolisme', orthoMin: 2,    orthoMax: 8,    description: 'Nuchter insuline geeft een vroeg signaal van insulineresistentie, ook als glucose nog normaal is. Te hoog wijst op dat de cellen minder goed reageren op insuline. Te laag kan bij vasten normaal zijn, of bij type 1 diabetes.' },
  'HOMA 2 IR index':          { category: 'Glucose & Metabolisme', orthoMax: 1.0,  description: 'Berekende maat voor insulineresistentie op basis van nuchter glucose en insuline. Waarden boven 1.5 zijn een vroeg signaal, boven 2.0 wijst op duidelijke insulineresistentie.' },
  'HOMA2 %B (bèta-cel activiteit)': { category: 'Glucose & Metabolisme', description: 'Maat voor de functie van de bèta-cellen in de alvleesklier, die insuline aanmaken. Te laag wijst op verminderde insulineproductie (zoals bij type 1 of gevorderd type 2 diabetes). Te hoog kan wijzen op overcompensatie bij insulineresistentie.' },
  'HOMA2 %S (insulinegevoeligheid)': { category: 'Glucose & Metabolisme', description: 'Maat voor hoe gevoelig de cellen zijn voor insuline. Te laag (= insulineresistentie) bij overgewicht, weinig beweging of prediabetes. Te hoog is zelden een probleem. Waarden onder 70% worden als verminderd beschouwd.' },

  // ── CHOLESTEROL EN HART ──
  'Cholesterol totaal':       { category: 'Cholesterol en Hart',   orthoMin: 150,  orthoMax: 200,  description: 'Totale hoeveelheid cholesterol in het bloed. Te hoog verhoogt het risico op hart- en vaatziekten. Te laag is ook ongewenst — cholesterol is nodig voor hormoonproductie, celwanden en de aanmaak van vitamine D.' },
  'HDL cholesterol':          { category: 'Cholesterol en Hart',   orthoMin: 65,                   description: 'Het "goede" cholesterol dat overtollig cholesterol afvoert naar de lever. Hoge waarden zijn beschermend voor het hart. Te laag verhoogt het cardiovasculaire risico, ook als totaalcholesterol normaal is.' },
  'LDL cholesterol':          { category: 'Cholesterol en Hart',   orthoMax: 100,                  description: 'Het "slechte" cholesterol dat zich kan afzetten in bloedvaten. Te hoog verhoogt het risico op hart- en vaatziekten. De streefwaarde hangt af van je persoonlijk cardiovasculair risicoprofiel.' },

  // ── SCHILDKLIER ──
  'Schildklierstimulerend hormoon (TSH)': { category: 'Schildklier', orthoMin: 1.0, orthoMax: 2.0, description: 'Hormoon dat de schildklier aanstuurt. Te hoog wijst op een trage schildklier: vermoeidheid, koude-intolerantie, gewichtstoename. Te laag wijst op een overactieve schildklier: hartkloppingen, zweten, gewichtsverlies.' },
  'Vrij T3':                  { category: 'Schildklier',           orthoMin: 4.5,  orthoMax: 6.5,  description: 'Het actieve schildklierhormoon dat cellen direct aanstuurt. Te laag geeft klachten zoals vermoeidheid, hersenmist en koude-intolerantie, ook als TSH normaal lijkt. Te hoog geeft hartkloppingen en rusteloosheid.' },
  'Vrij T4':                  { category: 'Schildklier',           orthoMin: 15,   orthoMax: 23,   description: 'Het inactieve schildklierhormoon dat in de cellen wordt omgezet naar T3. Te laag bij hypothyreoïdie. Te hoog bij hyperthyreoïdie of overmatige schildkliermedicatie.' },

  // ── HORMONEN ──
  'Estradiol':                { category: 'Hormonen',                                              description: 'Het belangrijkste oestrogeen, aangemaakt in de eierstokken. Regelt de menstruatiecyclus, botdichtheid en stemming. Te laag geeft opvliegers, droge slijmvliezen en stemmingswisselingen. Te hoog kan PMS en oestrogeendominantie veroorzaken. Sterk variabel per cyclusfase.' },
  'Progesteron':              { category: 'Hormonen',                                              description: 'Hormoon aangemaakt na de eisprong, essentieel voor de tweede helft van de cyclus en zwangerschap. Te laag geeft korte luteale fase, PMS, slaapproblemen en vruchtbaarheidsproblemen. Meting is het meest zinvol rond dag 19-21 van de cyclus.' },
  'Follikelstimulerend hormoon (FSH)':    { category: 'Hormonen',                                  description: 'Hormoon dat de rijping van eiblaasjes stimuleert. Te hoog wijst op een dalende eierstokfunctie of aanloop naar de overgang. Te laag kan wijzen op hypofyseproblemen of een verstoorde hormoonregulatie.' },
  'Luteïniserend hormoon (LH)':           { category: 'Hormonen',                                  description: 'Hormoon dat de eisprong triggert. Stijgt sterk midden in de cyclus. Samen met FSH een maat voor de eierstokfunctie. Te hoog buiten de ovulatie kan wijzen op PCOS of overgangsklachten.' },
  'FSH:LH ratio':                         { category: 'Hormonen',                                  description: 'Verhouding tussen FSH en LH. Normaal is FSH iets hoger dan LH. Bij PCOS is de verhouding vaak omgekeerd: meer LH dan FSH. Helpt bij het onderscheiden van PCOS van andere hormonale stoornissen.' },
  'Testosteron':              { category: 'Hormonen',                                              description: 'Aangemaakt in bijnieren en eierstokken. Betrokken bij energie, libido, spierkracht en stemming. Te laag geeft vermoeidheid, verminderd libido en spierverlies. Te hoog bij vrouwen kan wijzen op PCOS en gaat gepaard met acne en overmatige haargroei.' },
  'DHEA-sulfaat (DHEA-S)':    { category: 'Hormonen',                                              description: 'Bijnierhormoon dat dient als bouwstof voor geslachtshormonen. Daalt normaal met de leeftijd. Te laag wijst op uitgeputte bijnieren of veroudering. Te hoog kan acne, onregelmatige cyclus en mannelijk haarpatroon veroorzaken.' },
  'Cortisol':                 { category: 'Hormonen',              orthoMin: 200,  orthoMax: 550,  description: 'Stresshormoon aangemaakt door de bijnieren, normaal het hoogst in de ochtend. Te hoog bij chronische stress: slaapproblemen, gewichtstoename rond de buik, verhoogde bloedsuiker. Te laag bij bijnieruitputting: extreme vermoeidheid, duizeligheid bij opstaan en zoute trek. Meting bij voorkeur nuchter rond 8u.' },

  // ── ONTSTEKING ──
  'C-reactief proteïne (CRP)':{ category: 'Ontsteking',            orthoMax: 1.0,                  description: 'Eiwit aangemaakt door de lever als reactie op ontsteking. Stijgt snel bij infecties, weefselbeschadiging of auto-immuunreacties. Zelfs licht verhoogde waarden binnen de "normale" range kunnen wijzen op laaggradige chronische ontsteking.' },
  'Homocysteïne':             { category: 'Ontsteking',            orthoMax: 10,                   description: 'Aminozuur dat bij te hoge concentraties de bloedvatwanden beschadigt en het risico op hart- en vaatziekten verhoogt. Te hoog door tekort aan B6, B12 of foliumzuur, of genetische varianten in het methylatiepad. Daalt goed met gerichte suppletie.' },

  // ── ELEKTROLIETEN ──
  'Natrium':                  { category: 'Elektrolieten',         orthoMin: 138,  orthoMax: 142,  description: 'Mineraal dat de vochtbalans en zenuwgeleiding regelt. Te laag geeft hoofdpijn, verwarring en spierkrampen. Te hoog wijst op uitdroging of nierproblemen.' },
  'Kalium':                   { category: 'Elektrolieten',         orthoMin: 3.8,  orthoMax: 4.5,  description: 'Essentieel voor een normaal hartritme en spierwerking. Te laag geeft spierkrampen, vermoeidheid en hartritme-stoornissen. Te hoog is gevaarlijk voor het hart en komt voor bij nierproblemen.' },
  'Chloride':                 { category: 'Elektrolieten',         orthoMin: 100,  orthoMax: 106,  description: 'Elektrolyt dat samenwerkt met natrium voor de vochtbalans en de zuur-basebalans in het bloed. Verstoringen wijzen meestal op nieren- of ademhalingsproblemen.' },
  'Bicarbonaat':              { category: 'Elektrolieten',         orthoMin: 23,   orthoMax: 28,   description: 'Bufferstof die de zuurgraad van het bloed stabiel houdt. Te laag wijst op verzuring (acidose), te hoog op overmatige basificiteit (alkalose). Beide kunnen ernstige gevolgen hebben voor orgaanfunctie.' },
  'Calcium':                  { category: 'Elektrolieten',         orthoMin: 2.2,  orthoMax: 2.45, description: 'Mineraal betrokken bij botsterkte, spiercontractie en zenuwgeleiding. Te laag geeft tintelingen, spierkrampen en osteoporose. Te hoog wijst op bijschildklierproblematiek of overmatige vitamine D-inname.' },
  'Fosfor':                   { category: 'Elektrolieten',         orthoMin: 1.0,  orthoMax: 1.35, description: 'Werkt samen met calcium voor botopbouw en energieproductie (ATP). Te laag bij ondervoeding of malabsorptie. Te hoog bij nierproblemen, wat de botgezondheid op termijn aantast.' },

  // ── MINERALEN ──
  'Magnesium':                { category: 'Vitaminen & Mineralen', orthoMin: 0.85, orthoMax: 1.1,  description: 'Betrokken bij meer dan 300 enzymatische reacties in het lichaam. Te laag geeft spierkrampen, slaapproblemen, angst en hartkloppingen. Bloedwaarden weerspiegelen de intracellulaire voorraad slecht — klachten zijn minstens even belangrijk als de meting.' },
  'Zink':                     { category: 'Vitaminen & Mineralen', orthoMin: 12,   orthoMax: 18,   description: 'Essentieel voor immuunfunctie, wondgenezing, huid en hormoonproductie. Te laag geeft verhoogde infectiegevoeligheid, haaruitval, slechte wondgenezing en verminderd reuk- en smaakvermogen. Te hoog via suppletie kan koper verdringen.' },
  'Selenium':                 { category: 'Vitaminen & Mineralen', orthoMin: 120,  orthoMax: 160,  description: 'Spoorelement dat de schildklierfunctie ondersteunt en antioxidantbescherming biedt. Te laag verhoogt het risico op schildklierproblemen en infecties. Te hoog is toxisch — suppletie boven 400 µg/dag is risicovol.' },

  // ── EIWITTEN ──
  'Albumine':                 { category: 'Eiwitten',              orthoMin: 40,   orthoMax: 50,   description: 'Het meest voorkomende eiwit in bloed, aangemaakt door de lever. Transporteert hormonen, medicijnen en vetzuren. Te laag wijst op ondervoeding, leverziekte of chronische ziekte. Te hoog komt bijna alleen voor bij uitdroging.' },
  'Totaal eiwit':             { category: 'Eiwitten',              orthoMin: 70,   orthoMax: 80,   description: 'De totale hoeveelheid eiwit in het bloedserum. Te laag wijst op ondervoeding, malabsorptie of leverproblemen. Te hoog kan wijzen op uitdroging of bepaalde bloedaandoeningen zoals multipel myeloom.' },

  // ── TUMORMARKERS ──
  'CA 15-3':                  { category: 'Tumormarkers',                                          description: 'Tumormarker (Cancer Antigen 15-3) gebruikt bij de opvolging van borstkankerbehandeling. Verhoogd bij actieve ziekte of terugval. Niet geschikt als screeningstest — enkel zinvol in de context van een bestaande diagnose.' },
};

let state = {
  tests: [],
  elements: {},
  categories: [...DEFAULT_CATEGORIES],
  settings: { useOrtho: true, hideEmpty: false },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
      if (!state.categories) state.categories = [...DEFAULT_CATEGORIES];
      if (!state.settings) state.settings = { useOrtho: true, hideEmpty: false };
      if (state.settings.useOrtho === undefined) state.settings.useOrtho = true;
      if (state.settings.hideEmpty === undefined) state.settings.hideEmpty = false;
      // No tests = discard saved elements (presets repopulate them cleanly)
      if (!state.tests || state.tests.length === 0) state.elements = {};

      // Migrations
      state.categories = state.categories.map(c =>
        c === 'Lipiden' ? 'Cholesterol en Hart' :
        c === 'Vitaminen' || c === 'Mineralen' ? 'Vitaminen & Mineralen' : c
      );
      // Remove duplicate category entries after mapping
      state.categories = [...new Set(state.categories)];
      for (const el of Object.values(state.elements)) {
        if (el.category === 'Lipiden') el.category = 'Cholesterol en Hart';
        if (el.category === 'Vitaminen' || el.category === 'Mineralen') el.category = 'Vitaminen & Mineralen';
      }
      // Add missing default categories
      for (const cat of DEFAULT_CATEGORIES) {
        if (!state.categories.includes(cat)) state.categories.push(cat);
      }
      // Apply NAME_MAP to existing saved element keys and test results
      const norm = s => s.toLowerCase().replace(/\s+/g, ' ').replace(/[µμ]/g, 'u').trim();
      for (const [oldName, newName] of Object.entries(NAME_MAP)) {
        const normOld = norm(oldName);
        const existingKey = Object.keys(state.elements).find(k => norm(k) === normOld);
        if (existingKey && existingKey !== newName) {
          if (!state.elements[newName]) state.elements[newName] = {};
          const src = state.elements[existingKey], dst = state.elements[newName];
          if (!dst.category || dst.category === 'Overige') dst.category = src.category;
          if (!dst.description) dst.description = src.description;
          if (dst.orthoMin == null) dst.orthoMin = src.orthoMin;
          if (dst.orthoMax == null) dst.orthoMax = src.orthoMax;
          delete state.elements[existingKey];
        }
        for (const test of (state.tests || []))
          for (const r of test.results)
            if (norm(r.element) === normOld) r.element = newName;
      }
    }
  } catch (e) { /* start fresh */ }

  // Apply presets: case-insensitive match, fill missing fields only, never overwrite user edits
  for (const [presetName, preset] of Object.entries(PRESET_ELEMENTS)) {
    // Find existing entry with same name (case-insensitive)
    const existingKey = Object.keys(state.elements)
      .find(k => k.toLowerCase() === presetName.toLowerCase());

    const key = existingKey || presetName;
    if (!existingKey) state.elements[key] = {};

    const el = state.elements[key];
    if (!el.category || el.category === 'Overige') el.category = preset.category;
    if (!el.description)                           el.description = preset.description;
    if (el.orthoMin === undefined || el.orthoMin === null) el.orthoMin = preset.orthoMin ?? null;
    if (el.orthoMax === undefined || el.orthoMax === null) el.orthoMax = preset.orthoMax ?? null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── CATEGORIES & DEFAULT CATEGORY DETECTION ─────────────────────────────────

function defaultCategory(name) {
  const n = name.toLowerCase();
  if (/hemoglobine|erythrocyt|leukocyt|leucocyt|hematocri|celvolume|cellulair hemoglobine|hemoglobineconcentratie|trombocyt|thrombocyt|bloedcellen distributie|reticulocyt|normoblast|neutrofiel|lymfocyt|monocyt|eosinofiel|basofiel|sedimentati|granulocyt|red blood cell|absoluut aantal|protrombinetijd|tromboplastinetijd|aptt/.test(n)) return 'Hematologie';
  if (/ijzer|ferritine/.test(n)) return 'IJzer & Anemie';
  if (/vitamine\s*[abd11]|foliumzuur|pyridoxine|cobalamine|\bb6\b|\bb11\b|\bb12\b|holotrans|magnesium|zink|selenium|koper|mangaan/.test(n)) return 'Vitaminen & Mineralen';
  if (/alanineaminotransferase|aspartaataminotransferase|\balt\b|\bast\b|gpt|got|\balat\b|\basat\b|gamma.?gt|gamma-glutamyl|alkalische|bilirubine|lactaatdehydrogenase|\bldh\b|transaminase/.test(n)) return 'Lever';
  if (/urinezuur|uric acid/.test(n)) return 'Nieren';
  if (/creatinine|egfr|\bgfr\b/.test(n)) return 'Nieren';
  if (/glucose|hba1c|geglyceerd|insuline|homa/.test(n)) return 'Glucose & Metabolisme';
  if (/cholesterol|hdl|ldl|triglyceri/.test(n)) return 'Cholesterol en Hart';
  if (/schildklierstimulerend|\btsh\b|vrij t[34]|\bt3\b|\bt4\b|schildklier/.test(n)) return 'Schildklier';
  if (/follikelstimulerend|luteïniserend|estradiol|progesteron|\bfsh\b|\blh\b|testosteron|dhea|cortisol/.test(n)) return 'Hormonen';
  if (/c-reactief|\bcrp\b|homocyste|inflamm|fibrinogeen/.test(n)) return 'Ontsteking';
  if (/\bca\s*15|tumormarker|cancer antigen/.test(n)) return 'Tumormarkers';
  if (/natrium|kalium|chloride|bicarbonaat|calcium|fosfor/.test(n)) return 'Elektrolieten';
  if (/albumine|eiwit/.test(n)) return 'Eiwitten';
  return 'Overige';
}

// ── ZOEK DE BESTAANDE CANONIEKE NAAM voor een element (case-insensitief)
const NAME_MAP = {
  // Hematologie — witte bloedcellen
  'leucocytose': 'Leukocyten',
  'leucocyten': 'Leukocyten',
  'neutrofiele segmenten': 'Neutrofielen',
  'lymfocyten': 'Lymfocyten',
  'monocyten': 'Monocyten',
  'eosinofielen': 'Eosinofielen',
  'basofielen': 'Basofielen',
  'absoluut aantal lymfo': 'Lymfocyten totaal',
  'absoluut aantal mono': 'Monocyten totaal',
  'absoluut aantal baso': 'Basofielen totaal',
  // Hematologie — rode bloedcellen
  'erythrocyten': 'Erythrocyten',
  'hemoglobine': 'Hemoglobine',
  'hematocriet': 'Hematocriet',
  'mcv': 'Gemiddeld celvolume (MCV)',
  'mch': 'Gemiddeld cellulair hemoglobine (MCH)',
  'mchc': 'Gemiddelde hemoglobineconcentratie (MCHC)',
  'rdw': 'Rode bloedcellen distributie (RDW)',
  'red blood cell distribution': 'Rode bloedcellen distributie (RDW)',
  'red blood cell distribution width': 'Rode bloedcellen distributie (RDW)',
  // Hematologie — stolling
  'thrombocyten': 'Trombocyten',
  'sedimentatie na 1 uur': 'Sedimentatie',
  'pt (%)': 'Protrombinetijd (%)',
  'pt(%)': 'Protrombinetijd (%)',
  'pt (inr)': 'Protrombinetijd INR',
  'pt(inr)': 'Protrombinetijd INR',
  'pt sec': 'Protrombinetijd (sec)',
  'aptt': 'Geactiveerde partiële tromboplastinetijd (aPTT)',
  'aptt ratio': 'aPTT ratio',
  // IJzer & Anemie
  'ferritine': 'Ferritine',
  // Vitaminen
  'vitamine d': 'Vitamine D',
  'vitamine d (25-oh-vit d)': 'Vitamine D',
  'vitamine d3': 'Vitamine D',
  '25-oh vitamine d': 'Vitamine D',
  'vitamine b12': 'Vitamine B12 (Cobalamine)',
  'vitamine b12 (cobalamine)': 'Vitamine B12 (Cobalamine)',
  'cobalamine': 'Vitamine B12 (Cobalamine)',
  'actief b12': 'Vitamine B12 (Cobalamine)',
  'holotranscobalamine': 'Vitamine B12 (Cobalamine)',
  'foliumzuur': 'Vitamine B11 (Foliumzuur)',
  'foliumzuur in serum': 'Vitamine B11 (Foliumzuur)',
  'vitamine b11': 'Vitamine B11 (Foliumzuur)',
  'vitamine b11 (foliumzuur)': 'Vitamine B11 (Foliumzuur)',
  'vitamine b6': 'Vitamine B6 (Pyridoxine)',
  'vitamine b6 (pyridoxine)': 'Vitamine B6 (Pyridoxine)',
  'pyridoxine': 'Vitamine B6 (Pyridoxine)',
  // Lever
  'alt': 'Alanineaminotransferase (ALT)',
  'alanineaminotransferase': 'Alanineaminotransferase (ALT)',
  'transaminase alt (gpt)': 'Alanineaminotransferase (ALT)',
  'alat': 'Alanineaminotransferase (ALT)',
  'gpt': 'Alanineaminotransferase (ALT)',
  'ast': 'Aspartaataminotransferase (AST)',
  'aspartaataminotransferase': 'Aspartaataminotransferase (AST)',
  'asat': 'Aspartaataminotransferase (AST)',
  'got': 'Aspartaataminotransferase (AST)',
  'gamma-gt': 'Gamma-glutamyltransferase (Gamma-GT)',
  'gamma gt': 'Gamma-glutamyltransferase (Gamma-GT)',
  'ggt': 'Gamma-glutamyltransferase (Gamma-GT)',
  'ldh': 'Lactaatdehydrogenase (LDH)',
  'ldh (ifcc)': 'Lactaatdehydrogenase (LDH)',
  'alkalische fosfatase': 'Alkalische fosfatase',
  'bilirubine totaal': 'Bilirubine Totaal',
  'creatinine': 'Creatinine',
  'urinezuur': 'Urinezuur',
  'uric acid': 'Urinezuur',
  // Glucose
  'glucose': 'Glucose',
  'hba1c': 'Geglyceerd hemoglobine % (HbA1c)',
  'hba1c%': 'Geglyceerd hemoglobine % (HbA1c)',
  'hba1c% (screening)': 'Geglyceerd hemoglobine % (HbA1c)',
  'geglyceerd hemoglobine': 'Geglyceerd hemoglobine % (HbA1c)',
  'hba1c (ifcc)': 'Geglyceerd hemoglobine IFCC (HbA1c)',
  'insuline': 'Insuline',
  'homa 2 ir index': 'HOMA 2 IR index',
  'homa2 ir index': 'HOMA 2 IR index',
  'homa2 %b (bèta-cel activiteit)': 'HOMA2 %B (bèta-cel activiteit)',
  'homa2 %b (bèta-cel': 'HOMA2 %B (bèta-cel activiteit)',
  'homa2 %b': 'HOMA2 %B (bèta-cel activiteit)',
  'homa2 %s (insulinegevoeligheid)': 'HOMA2 %S (insulinegevoeligheid)',
  'homa2 %s': 'HOMA2 %S (insulinegevoeligheid)',
  // Cholesterol
  'cholesterol totaal': 'Cholesterol totaal',
  'hdl cholesterol': 'HDL cholesterol',
  'ldl cholesterol': 'LDL cholesterol',
  // Schildklier
  'tsh': 'Schildklierstimulerend hormoon (TSH)',
  'vrij t3': 'Vrij T3',
  'vrij t4': 'Vrij T4',
  // Hormonen
  'fsh': 'Follikelstimulerend hormoon (FSH)',
  'lh': 'Luteïniserend hormoon (LH)',
  'estradiol': 'Estradiol',
  'progesteron': 'Progesteron',
  'testosteron': 'Testosteron',
  'dhea-s': 'DHEA-sulfaat (DHEA-S)',
  'dheas': 'DHEA-sulfaat (DHEA-S)',
  'cortisol': 'Cortisol',
  // Ontsteking
  'crp': 'C-reactief proteïne (CRP)',
  'c-reactief proteïne': 'C-reactief proteïne (CRP)',
  'homocysteïne': 'Homocysteïne',
  'homocysteine': 'Homocysteïne',
  'homocysteïne (mg/l)': 'Homocysteïne',
  'homocysteïne (µmol/l)': 'Homocysteïne',
  'homocysteïne (umol/l)': 'Homocysteïne',
  'ca 15,3': 'CA 15-3',
  'ca 15.3': 'CA 15-3',
  'ca 15-3': 'CA 15-3',
  'ca15-3': 'CA 15-3',
  'ca15,3': 'CA 15-3',
  'ca15.3': 'CA 15-3',
  // Elektrolieten
  'natrium': 'Natrium',
  'kalium': 'Kalium',
  'chloride': 'Chloride',
  'bicarbonaat': 'Bicarbonaat',
  'calcium': 'Calcium',
  'calcium (mmol/l)': 'Calcium',
  'fosfor': 'Fosfor',
  'fosfor (mmol/l)': 'Fosfor',
  // Mineralen
  'magnesium': 'Magnesium',
  'zink': 'Zink',
  'selenium': 'Selenium',
  // Eiwitten
  'albumine': 'Albumine',
  'totaal eiwit': 'Totaal eiwit',
};

function canonicalName(name) {
  const lower = name.trim().toLowerCase();
  if (NAME_MAP[lower]) return NAME_MAP[lower];
  for (const key of Object.keys(state.elements)) {
    if (key.toLowerCase() === lower) return key;
  }
  for (const test of state.tests) {
    for (const r of test.results) {
      if (r.element.toLowerCase() === lower) return r.element;
    }
  }
  // Check presets case-insensitively
  const presetKey = Object.keys(PRESET_ELEMENTS).find(k => k.toLowerCase() === lower);
  if (presetKey) return presetKey;
  // Nieuw element: eerste letter hoofdletter
  return name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
}

// Verwijder een element uit alle tests + state.elements
function deleteElement(name) {
  if (!confirm(`"${name}" verwijderen uit alle testen?`)) return;
  for (const test of state.tests) {
    test.results = test.results.filter(r => r.element !== name);
  }
  delete state.elements[name];
  saveState();
  if (selectedElement === name) closeDetailPanel();
  renderTable();
}

// Verwijder een volledige test (PDF-import)
function deleteTest(testId) {
  const test = state.tests.find(t => t.id === testId);
  if (!test) return;
  if (!confirm(`Alle resultaten van "${test.filename}" verwijderen?`)) return;
  state.tests = state.tests.filter(t => t.id !== testId);
  saveState();
  renderTable();
}

// Hernoem een element in alle tests + state.elements
function renameElement(oldName, newName) {
  if (!newName || newName === oldName) return;
  // Merge: als newName al bestaat, hernoem alle oldName naar newName
  for (const test of state.tests) {
    for (const r of test.results) {
      if (r.element === oldName) r.element = newName;
    }
  }
  if (state.elements[oldName]) {
    if (!state.elements[newName]) {
      state.elements[newName] = state.elements[oldName];
    }
    delete state.elements[oldName];
  }
  saveState();
  renderTable();
  if (selectedElement === oldName) openDetailPanel(newName);
}

// ── PDF EXTRACTION ──────────────────────────────────────────────────────────

async function extractLines(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const allLines = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();

    // Group items by rounded Y position
    const byY = new Map();
    for (const item of tc.items) {
      if (!item.str.trim()) continue;
      const y = Math.round(item.transform[5] / 3) * 3;
      if (!byY.has(y)) byY.set(y, []);
      byY.get(y).push({ x: item.transform[4], t: item.str });
    }

    // Sort Y descending (PDF: 0 = bottom), X ascending within line
    const ys = [...byY.keys()].sort((a, b) => b - a);
    for (const y of ys) {
      const line = byY.get(y)
        .sort((a, b) => a.x - b.x)
        .map(i => i.t)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (line) allLines.push(line);
    }
  }

  return allLines;
}

// ── PARSERS ─────────────────────────────────────────────────────────────────

function toFloat(s) {
  if (!s) return null;
  const n = parseFloat(String(s).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function parseRefText(s) {
  if (!s) return { refMin: null, refMax: null };
  const t = s.trim().replace(/,/g, '.');

  // X - Y  or  X.Y - A.B
  let m = t.match(/^([\d.]+)\s*[-–]\s*([\d.]+)$/);
  if (m) return { refMin: parseFloat(m[1]), refMax: parseFloat(m[2]) };

  // < X  or  <= X
  m = t.match(/^[<≤]\s*=?\s*([\d.]+)$/);
  if (m) return { refMin: null, refMax: parseFloat(m[1]) };

  // > X  or  >= X
  m = t.match(/^[>≥]\s*=?\s*([\d.]+)$/);
  if (m) return { refMin: parseFloat(m[1]), refMax: null };

  return { refMin: null, refMax: null };
}

// ── AML WEST ──
// Columns: Test | Resultaat | Referentiebereik | Eenheid | Validatie
// Row ex:  ". Hemoglobine  13,7  11,7 - 15,1  g/dL  SD"
function parseAML(lines) {
  const results = [];
  let active = false;
  let currentCategory = '';

  for (const line of lines) {
    if (line.includes('Referentiebereik') && line.includes('Validatie')) {
      active = true;
      continue;
    }
    if (!active) continue;

    // Category headers: all-caps, no digits
    if (/^[A-ZÉÀÈÙÂÊÎÔÛÄËÏÖÜ\s\-\/\.]+$/.test(line) && line.length > 3 && !/\d/.test(line)) {
      currentCategory = line.trim();
      continue;
    }

    // Strip leading ". "
    const raw = line.replace(/^\.\s*/, '').trim();

    // Pattern: NAME  VALUE[,decimal]  [annotations like [a]]  RANGE  UNIT  VALIDATOR
    // Validator is 2 uppercase letters at end
    // Range: "X,Y - A,B" or "< X,Y" or ">= X,Y"
    // Value: single number possibly with comma decimal, followed by optional space
    const m = raw.match(
      /^(.+?)\s+([\d]+(?:,\d+)?)\s+(?:\[.\]\s*)*((?:[\d,]+(?:\s*[-–]\s*[\d,]+)?|[<>≤≥]=?\s*[\d,]+))\s+(\S+)\s+[A-Z]{2,3}$/
    );

    if (m) {
      const element = m[1].trim();
      const value = toFloat(m[2]);
      const refText = m[3].trim();
      const unit = m[4].trim();
      const { refMin, refMax } = parseRefText(refText);
      results.push({ element, category: currentCategory, value, valueText: m[2], unit, refMin, refMax, refText, uncertain: false });
    } else if (/\d/.test(raw) && raw.length > 5) {
      const skip = /^(Opmerking|Gewijzigde|aanbevolen|\[a\]|\[b\]|\[c\]|hypovitaminose|deficiënti|Intermediaire|Diabetes|Validatoren|Pagina|Aanvraag|Afname|INSZ|AML:|LoL|Geboren|Adres)/i.test(raw)
        || /Negatief|Positief|index SD|index LD/i.test(raw);
      if (!skip) results.push({ element: raw, category: currentCategory, value: null, valueText: '', unit: '', refMin: null, refMax: null, refText: '', uncertain: true });
    }
  }

  return results;
}

// ── AZ DELTA ──
// Columns: Test | Uitslag | Eenheid | Referentiewaardes | Grensvlag
// Row ex:  "leucocytose  5.03  x10³/μl  4.20-9.80"
function parseAZDelta(lines) {
  const results = [];
  let active = false;
  let currentCategory = '';

  for (const line of lines) {
    if (line.includes('Referentiewaardes') && line.includes('Grensvlag')) {
      active = true;
      continue;
    }
    if (!active) continue;

    if (/^[A-ZÉÀÈÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÀÈÙÂÊÎÔÛÄËÏÖÜ\s\-\/]+$/.test(line) && line.length > 3) {
      currentCategory = line.trim();
      continue;
    }

    // Pattern: NAME  VALUE  UNIT  RANGE  [FLAG]
    const m = line.match(
      /^(.+?)\s+(>?\d[\d.]*(?:e\d+)?)\s+(\S+)\s+([\d.]+-[\d.]+|[<>≤≥]=?\s*[\d.]+)\s*(?:[LH])?\s*$/i
    );

    if (m) {
      const element = m[1].trim();
      const rawVal = m[2];
      const value = rawVal.startsWith('>') ? null : toFloat(rawVal);
      const unit = m[3].trim();
      const refText = m[4].trim();
      const { refMin, refMax } = parseRefText(refText);
      const skipQualified = value === null && /^(GFR|eGFR)/i.test(element);
      if (!skipQualified) {
        results.push({ element, category: currentCategory, value, valueText: rawVal, unit, refMin, refMax, refText, uncertain: value === null });
      }
    } else if (/\d/.test(line) && line.length > 5 && !line.includes('Pagina')) {
      const skippable = /^(Aanvraag|Patiënt|Geboor|Geslacht|Adres|Datum|Afname|Plaats|eGFR|GFR|Berekening|Commentaar|Protocol|mediaanwaarde|duidelijk|sterk gedaald|volgens|Pagina|RDW =|\d)/i.test(line)
        || /<[\d.]/.test(line);  // gekwalificeerde waarden zoals <0.09 of <0.30
      if (!skippable) {
        results.push({ element: line.trim(), category: currentCategory, value: null, valueText: '', unit: '', refMin: null, refMax: null, refText: '', uncertain: true });
      }
    }
  }

  return results;
}

// ── MEDILAB / LABO MAENHOUT ──
// Columns: Test | Result | Flag | Units | Ref. Ranges
// Row ex:  "Glucose  73  L  mg/dl  74-100"
function parseMedialab(lines) {
  const results = [];
  let active = false;
  let currentCategory = '';
  let pendingName = null; // element name without value (multi-line cell)

  for (const line of lines) {
    if ((line.includes('Ref. Ranges') || line.includes('Ref.Ranges')) && line.includes('Result')) {
      active = true;
      continue;
    }
    if (!active) continue;

    // Category header: all-caps, no digits
    if (/^[A-ZÉÀÈÙÂÊÎÔÛÄËÏÖÜ\s\-\/]+$/.test(line) && line.length > 3 && !/\d/.test(line)) {
      currentCategory = line.trim();
      pendingName = null;
      continue;
    }

    // Main pattern: NAME  VALUE  [L|H]  UNIT  RANGE
    const m = line.match(
      /^(.+?)\s+([\d.]+)\s+([LH]\s+)?([^\s\d<>]+(?:\/[^\s]+)?)\s+([\d.]+-[\d.]+|[<>≤≥]=?\s*[\d.]+|\d[\d.]+)\s*$/i
    );
    if (m) {
      pendingName = null;
      const element = m[1].trim();
      const value = toFloat(m[2]);
      const flag = m[3] ? m[3].trim() : null;
      const unit = m[4].trim();
      const refText = m[5].trim();
      const { refMin, refMax } = parseRefText(refText);
      results.push({ element, category: currentCategory, value, valueText: m[2], unit, refMin, refMax, refText, flag, uncertain: false });
      continue;
    }

    // Fallback: NAME  VALUE  [L|H]  UNIT  (ref complex/missing, or value at end of line)
    const m2 = line.match(/^(.+?)\s+([\d,]+)\s+([LH]\s+)?([a-zA-Z%\/µμ\^0-9]+)(\s+|$)/i);
    if (m2) {
      const element = m2[1].trim();
      const annotationSkip = /^(SCORE2|De HOMA|\(latere\)|risico:|laag tot matig|hoog risico|zeer hoog risico|matig risico|streefwaarden|op basis|optimaal is|bij vrouwen|bij mannen|waarden boven)/i.test(element);
      if (!annotationSkip && element.length < 60) {
        pendingName = null;
        const value = toFloat(m2[2]);
        const unit = m2[4].trim();
        results.push({ element, category: currentCategory, value, valueText: m2[2], unit, refMin: null, refMax: null, refText: '', flag: null, uncertain: false });
      }
      continue;
    }

    // Value-only line (starts with digit) — may be continuation of a multi-line cell name
    if (/^\d[\d,.]/.test(line)) {
      const mVal = line.match(/^([\d,.]+)\s+([LH]\s+)?([a-zA-Z%\/µμ\^0-9]+)(\s+.*)?$/i);
      if (mVal && pendingName) {
        const value = toFloat(mVal[1]);
        const unit = mVal[3].trim();
        const refPart = mVal[4] ? mVal[4].trim() : '';
        const { refMin, refMax } = parseRefText(refPart);
        const flag = mVal[2] ? mVal[2].trim() : null;
        results.push({ element: pendingName, category: currentCategory, value, valueText: mVal[1], unit, refMin, refMax, refText: refPart, flag, uncertain: false });
      }
      pendingName = null;
      continue;
    }

    // Line with digit(s) but not starting with a digit
    if (/\d/.test(line)) {
      // Element names that contain digits (multi-line cell: set as pending name)
      if (/^HOMA2/i.test(line)) {
        pendingName = line.trim();
        continue;
      }
      const skippable = /^(Order|Patient|°|Sample|Status|Geldig|Dr\.|Apr\.|Prof\.|Gunst|Electronisch|Resultaten|Indien|Advies|http|<\d|>\d|\d+\.\d+\s*[-–]\s*\d|Streefwaarden|Normale |Insuline tolerantie besluit|Hemolytische index|Op basis van|Verlagen|Referentiewaarden op basis|CyberLab|Waarden boven|Bij vrouwen|volgens 20|SCORE2|HOMA2|risico:|laag tot matig|hoog risico|zeer hoog|matig risico|optimaal is|bij mannen|\(latere\)|De HOMA)/i.test(line);
      if (!skippable && line.length > 5) {
        pendingName = null;
        results.push({ element: line.trim(), category: currentCategory, value: null, valueText: '', unit: '', refMin: null, refMax: null, refText: '', uncertain: true });
      }
      continue;
    }

    // No digits — continuation of a wrapped cell name, or annotation; leave pendingName unchanged
  }

  return results;
}

function detectFormat(lines) {
  const text = lines.join(' ');
  if (text.includes('Referentiebereik') && text.includes('Validatie')) return 'AML';
  if (text.includes('Referentiewaardes') && text.includes('Grensvlag')) return 'AZ_DELTA';
  if (text.includes('Ref. Ranges') || (text.includes('Result') && text.includes('Flag') && text.includes('Units'))) return 'MEDILAB';
  return 'UNKNOWN';
}

function extractDate(lines, filename) {
  // First pass: explicit afname label (most reliable)
  for (const line of lines) {
    let m = line.match(/[Aa]fnamedatum[:\s]+(\d{2})[-\/](\d{2})[-\/](\d{4})/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    m = line.match(/[Aa]fname[:\s]+(\d{2})[-\/](\d{2})[-\/](\d{4})/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  }
  // Second pass: generic date patterns (fallback)
  for (const line of lines) {
    let m = line.match(/(\d{2})-(\d{2})-(\d{4})\s+\d{2}:\d{2}/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    m = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  }
  // from filename like Gunst-Elke-20250430-...
  const fm = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (fm) return `${fm[1]}-${fm[2]}-${fm[3]}`;
  return new Date().toISOString().slice(0, 10);
}

function extractLab(lines, filename) {
  const text = (lines.join(' ') + ' ' + filename).toLowerCase();
  if (text.includes('aml')) return 'AML West';
  if (text.includes('medilab') || text.includes('maenhout')) return 'Labo Maenhout';
  if (text.includes('az delta') || text.includes('az_delta')) return 'AZ Delta';
  return 'Onbekend lab';
}

async function parsePDF(file) {
  const lines = await extractLines(file);
  const format = detectFormat(lines);

  let results = [];
  if (format === 'AML')      results = parseAML(lines);
  else if (format === 'AZ_DELTA') results = parseAZDelta(lines);
  else if (format === 'MEDILAB') results = parseMedialab(lines);

  // Filter out likely garbage rows
  const cleaned = results.filter(r => {
    if (!r.element || r.element.length > 80) return false;
    if (r.uncertain && r.value === null && !r.element.match(/[a-zA-ZÀ-ÿ]/)) return false;
    return true;
  });

  return {
    date: extractDate(lines, file.name),
    lab: extractLab(lines, file.name),
    filename: file.name,
    format,
    results: cleaned,
  };
}

// ── COLOR LOGIC ──────────────────────────────────────────────────────────────

function colorClass(value, refMin, refMax, orthoMin, orthoMax) {
  if (value === null || value === undefined) return 'none';

  const hasOrtho = orthoMin !== null || orthoMax !== null;
  const hasRef   = refMin  !== null || refMax  !== null;

  const withinOrtho = hasOrtho &&
    (orthoMin === null || value >= orthoMin) &&
    (orthoMax === null || value <= orthoMax);

  const outsideRef = hasRef &&
    ((refMin !== null && value < refMin) || (refMax !== null && value > refMax));

  // Ortho takes priority: if within ortho → green
  if (hasOrtho) {
    if (withinOrtho) return 'green';
    // Outside ortho: red if also outside lab, orange otherwise
    return outsideRef ? 'red' : 'orange';
  }

  // No ortho: red only when outside lab range
  if (outsideRef) return 'red';
  return 'none';
}

// ── REVIEW MODAL ─────────────────────────────────────────────────────────────

let pendingParsed = null; // holds parsed data during review

function openReviewModal(parsed) {
  pendingParsed = parsed;

  document.getElementById('modal-title').textContent = `PDF controleren — ${parsed.filename}`;
  document.getElementById('review-date').value = parsed.date;
  document.getElementById('review-lab').value = parsed.lab;

  const uncertain = parsed.results.filter(r => r.uncertain).length;
  const total = parsed.results.length;
  document.getElementById('modal-parsed-count').textContent =
    `${total} rijen uitgelezen${uncertain > 0 ? ` · ${uncertain} onzeker (geel)` : ''}`;

  renderReviewTable(parsed.results);
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function renderReviewTable(rows) {
  const wrap = document.getElementById('modal-table-wrap');
  const table = document.createElement('table');
  table.className = 'review-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th class="col-delete"></th>
        <th class="col-element">Element</th>
        <th class="col-value">Waarde</th>
        <th class="col-unit">Eenheid</th>
        <th class="col-refmin">Ref min</th>
        <th class="col-refmax">Ref max</th>
      </tr>
    </thead>
    <tbody id="review-tbody"></tbody>
  `;
  wrap.innerHTML = '';
  wrap.appendChild(table);

  const tbody = document.getElementById('review-tbody');
  rows.forEach((row, i) => appendReviewRow(tbody, row, i));
}

function appendReviewRow(tbody, row, i) {
  const tr = document.createElement('tr');
  if (row.uncertain) tr.classList.add('uncertain');
  tr.dataset.idx = i;

  tr.innerHTML = `
    <td class="col-delete"><button class="btn-delete-row" title="Verwijder rij">✕</button></td>
    <td class="col-element"><input value="${esc(row.element)}" data-field="element" placeholder="Elementnaam"></td>
    <td class="col-value"><input value="${row.value !== null ? row.value : ''}" data-field="value" placeholder="bv. 13.7" type="number" step="any"></td>
    <td class="col-unit"><input value="${esc(row.unit)}" data-field="unit" placeholder="bv. g/dL"></td>
    <td class="col-refmin"><input value="${row.refMin !== null ? row.refMin : ''}" data-field="refMin" placeholder="min" type="number" step="any"></td>
    <td class="col-refmax"><input value="${row.refMax !== null ? row.refMax : ''}" data-field="refMax" placeholder="max" type="number" step="any"></td>
  `;

  tr.querySelector('.btn-delete-row').addEventListener('click', () => tr.remove());
  tbody.appendChild(tr);
}

function collectReviewRows() {
  const rows = [];
  document.querySelectorAll('#review-tbody tr').forEach(tr => {
    const get = f => tr.querySelector(`[data-field="${f}"]`)?.value.trim() ?? '';
    const element = get('element');
    if (!element) return;
    const valueRaw = get('value');
    const value = valueRaw !== '' ? parseFloat(valueRaw) : null;
    const unit = get('unit');
    const refMinRaw = get('refMin');
    const refMaxRaw = get('refMax');
    const refMin = refMinRaw !== '' ? parseFloat(refMinRaw) : null;
    const refMax = refMaxRaw !== '' ? parseFloat(refMaxRaw) : null;
    rows.push({ element, value, unit, refMin, refMax, refText: '', category: '', uncertain: false });
  });
  return rows;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  pendingParsed = null;
}

// ── MAIN TABLE ───────────────────────────────────────────────────────────────

let selectedElement = null;
const collapsedCategories = new Set();
// hideEmptyRows is now stored in state.settings.hideEmpty

function renderTable() {
  const container = document.getElementById('table-container');

  document.getElementById('empty-state').classList.add('hidden');

  // Sort tests by date
  const tests = [...state.tests].sort((a, b) => a.date.localeCompare(b.date));

  // All elements: from test results + state.elements (presets/manual)
  const allElements = new Set();
  for (const test of tests) {
    for (const r of test.results) allElements.add(r.element);
  }
  for (const el of Object.keys(state.elements)) allElements.add(el);

  // Ensure category assigned for every element
  for (const el of allElements) {
    if (!state.elements[el]) state.elements[el] = {};
    const meta = state.elements[el];
    if (!meta.category || meta.category === 'Overige') {
      const better = defaultCategory(el);
      if (better !== 'Overige' || !meta.category) meta.category = better;
    }
  }

  // Group by state.categories order, sorted by PRESET_ELEMENTS insertion order
  const presetOrder = Object.keys(PRESET_ELEMENTS);
  const grouped = new Map();
  for (const cat of state.categories) grouped.set(cat, []);
  for (const el of allElements) {
    const cat = state.elements[el]?.category || 'Overige';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(el);
  }
  for (const [cat, elements] of grouped) {
    elements.sort((a, b) => {
      const ai = presetOrder.indexOf(a);
      const bi = presetOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    if (state.settings.hideEmpty) {
      const filtered = elements.filter(el =>
        tests.some(t => t.results.find(r => r.element === el && r.value !== null))
      );
      grouped.set(cat, filtered);
    }
  }

  // Build table
  const wrap = document.createElement('div');
  wrap.className = 'results-table-wrap';

  const table = document.createElement('table');
  table.className = 'results-table';

  // Header row — with editable lab name + delete button per column
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const elTh = document.createElement('th');
  elTh.style.minWidth = '220px';
  elTh.textContent = 'Element';
  headerRow.appendChild(elTh);

  for (const test of tests) {
    const th = document.createElement('th');
    th.className = 'date-col';
    th.innerHTML = `
      <div class="col-header-wrap">
        <span class="col-date">${formatDate(test.date)}</span>
        <span class="col-lab" data-testid="${test.id}" title="Klik om te bewerken">${esc(test.lab)}</span>
        <button class="btn-delete-col" data-testid="${test.id}" title="Deze import verwijderen">✕</button>
      </div>`;
    headerRow.appendChild(th);
  }

  const unitTh = document.createElement('th');
  unitTh.className = 'unit-col';
  unitTh.textContent = 'Eenheid';
  headerRow.appendChild(unitTh);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Wire up header events after appending
  thead.querySelectorAll('.col-lab').forEach(span => {
    span.addEventListener('click', e => {
      e.stopPropagation();
      const testId = span.dataset.testid;
      const test = state.tests.find(t => t.id === testId);
      if (!test) return;
      const input = document.createElement('input');
      input.className = 'rename-input';
      input.value = test.lab;
      span.replaceWith(input);
      input.focus(); input.select();
      const save = () => {
        test.lab = input.value.trim() || test.lab;
        saveState(); renderTable();
      };
      input.addEventListener('blur', save);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') renderTable();
      });
    });
  });

  thead.querySelectorAll('.btn-delete-col').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteTest(btn.dataset.testid);
    });
  });

  const tbody = document.createElement('tbody');

  for (const [cat, elements] of grouped) {
    if (elements.length === 0) continue;

    const isCollapsed = collapsedCategories.has(cat);
    const catRow = document.createElement('tr');
    catRow.className = 'category-row';
    catRow.dataset.cat = cat;
    catRow.innerHTML = `<td colspan="${tests.length + 2}">
      <span class="cat-toggle">${isCollapsed ? '▶' : '▼'}</span>
      <span class="cat-label">${esc(cat)}</span>
      <button class="btn-rename-cat" title="Hernoem categorie" data-cat="${esc(cat)}">✎</button>
    </td>`;

    catRow.querySelector('.cat-toggle, .cat-label').addEventListener('click', () => {
      if (collapsedCategories.has(cat)) collapsedCategories.delete(cat);
      else collapsedCategories.add(cat);
      renderTable();
    });

    catRow.querySelector('.btn-rename-cat').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const oldCat = btn.dataset.cat;
      const label = btn.previousElementSibling;
      const input = document.createElement('input');
      input.className = 'rename-input';
      input.value = oldCat;
      label.replaceWith(input);
      btn.style.display = 'none';
      input.focus(); input.select();
      const save = () => {
        const newCat = input.value.trim();
        if (newCat && newCat !== oldCat) {
          state.categories = state.categories.map(c => c === oldCat ? newCat : c);
          for (const el of Object.values(state.elements)) {
            if (el.category === oldCat) el.category = newCat;
          }
          if (collapsedCategories.has(oldCat)) { collapsedCategories.delete(oldCat); collapsedCategories.add(newCat); }
          saveState();
        }
        renderTable();
      };
      input.addEventListener('blur', save);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') renderTable();
      });
    });

    // Drop target for drag-and-drop
    catRow.addEventListener('dragover', e => { e.preventDefault(); catRow.classList.add('drag-over'); });
    catRow.addEventListener('dragleave', () => catRow.classList.remove('drag-over'));
    catRow.addEventListener('drop', e => {
      e.preventDefault();
      catRow.classList.remove('drag-over');
      const elName = e.dataTransfer.getData('text/plain');
      if (elName && state.elements[elName]) {
        state.elements[elName].category = cat;
        saveState();
        renderTable();
      }
    });

    tbody.appendChild(catRow);

    if (isCollapsed) continue;

    for (const el of elements) {
      const elMeta = state.elements[el] || {};
      const row = document.createElement('tr');
      row.className = 'element-row';
      if (selectedElement === el) row.classList.add('selected');
      row.dataset.element = el;

      let rowHTML = `<td><div class="element-name">
        <button class="btn-delete-el" title="Verwijderen" data-el="${esc(el)}">✕</button>
        <span class="el-label">${esc(el)}</span>
        <button class="btn-rename" title="Hernoemen" data-el="${esc(el)}">✎</button>
      </div></td>`;

      let rowUnit = '';
      for (const test of tests) {
        const result = test.results.find(r => r.element === el);
        if (!result || result.value === null) {
          rowHTML += '<td class="value-cell"><span class="no-value">—</span></td>';
        } else {
          const useOrtho = state.settings.useOrtho;
          const cc = colorClass(result.value, elMeta.labMin ?? null, elMeta.labMax ?? null, useOrtho ? (elMeta.orthoMin ?? null) : null, useOrtho ? (elMeta.orthoMax ?? null) : null);
          const refLabel = result.refText ? `<span class="val-ref">${esc(result.refText)}</span>` : '';
          if (!rowUnit && result.unit) rowUnit = result.unit;
          rowHTML += `<td class="value-cell"><span class="val-inner val-${cc}">${result.value}</span>${refLabel}</td>`;
        }
      }
      rowHTML += `<td class="unit-cell">${esc(rowUnit)}</td>`;

      row.innerHTML = rowHTML;
      row.draggable = true;
      row.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', el);
        row.classList.add('dragging');
      });
      row.addEventListener('dragend', () => row.classList.remove('dragging'));

      row.addEventListener('click', e => {
        if (e.target.closest('.btn-rename') || e.target.closest('.btn-delete-el')) return;
        openDetailPanel(el);
      });

      row.querySelector('.btn-delete-el').addEventListener('click', e => {
        e.stopPropagation();
        deleteElement(e.currentTarget.dataset.el);
      });

      row.querySelector('.btn-rename').addEventListener('click', e => {
        e.stopPropagation();
        const btn = e.currentTarget;
        const label = btn.closest('.element-name').querySelector('.el-label');
        const oldName = btn.dataset.el;
        const input = document.createElement('input');
        input.className = 'rename-input';
        input.value = oldName;
        label.replaceWith(input);
        input.focus(); input.select();
        btn.style.display = 'none';
        const doRename = () => {
          const newName = input.value.trim();
          if (newName && newName !== oldName) renameElement(oldName, newName);
          else renderTable();
        };
        input.addEventListener('blur', doRename);
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
          if (e.key === 'Escape') renderTable();
        });
      });

      tbody.appendChild(row);
    }
  }

  table.appendChild(tbody);
  wrap.appendChild(table);
  container.innerHTML = '';
  container.appendChild(wrap);
}

// ── DETAIL PANEL ─────────────────────────────────────────────────────────────

let chartInstance = null;

function openDetailPanel(elementName) {
  selectedElement = elementName;

  // Highlight selected row
  document.querySelectorAll('.element-row').forEach(r => {
    r.classList.toggle('selected', r.dataset.element === elementName);
  });

  document.getElementById('detail-name').textContent = elementName;
  document.getElementById('main').classList.add('panel-open');
  document.getElementById('detail-panel').classList.remove('hidden');

  renderDetailBody(elementName);
}

function closeDetailPanel() {
  selectedElement = null;
  document.getElementById('detail-panel').classList.add('hidden');
  document.getElementById('main').classList.remove('panel-open');
  document.querySelectorAll('.element-row.selected').forEach(r => r.classList.remove('selected'));
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
}

function renderDetailBody(elementName) {
  const elMeta = state.elements[elementName] || {};
  const tests = [...state.tests].sort((a, b) => a.date.localeCompare(b.date));

  const dataPoints = [];
  for (const test of tests) {
    const r = test.results.find(r => r.element === elementName);
    if (r && r.value !== null) {
      dataPoints.push({ date: test.date, value: r.value, unit: r.unit, refMin: r.refMin, refMax: r.refMax });
    }
  }

  const body = document.getElementById('detail-body');
  body.innerHTML = '';

  // Description section (top)
  const descSection = document.createElement('div');
  descSection.className = 'detail-section';
  descSection.innerHTML = `
    <h3>Uitleg</h3>
    <textarea class="desc-area" id="detail-desc" placeholder="Voeg hier een beschrijving toe…">${esc(elMeta.description || '')}</textarea>
  `;
  body.appendChild(descSection);

  const textarea = descSection.querySelector('#detail-desc');
  const autoResize = el => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
  autoResize(textarea);

  let descTimer;
  descSection.querySelector('#detail-desc').addEventListener('input', e => {
    autoResize(e.target);
    clearTimeout(descTimer);
    descTimer = setTimeout(() => {
      if (!state.elements[elementName]) state.elements[elementName] = {};
      state.elements[elementName].description = e.target.value;
      saveState();
    }, 400);
  });

  // Chart section
  if (dataPoints.length > 0) {
    const chartSection = document.createElement('div');
    chartSection.className = 'detail-section';
    chartSection.innerHTML = '<h3>Verloop</h3><div class="detail-chart-wrap"><canvas id="detail-chart"></canvas></div>';
    body.appendChild(chartSection);

    // Render chart after DOM insertion
    requestAnimationFrame(() => renderDetailChart(elementName, dataPoints, elMeta));
  }

  // Values list
  if (dataPoints.length > 0) {
    const valSection = document.createElement('div');
    valSection.className = 'detail-section';
    valSection.innerHTML = '<h3>Waarden</h3><div class="detail-values-list" id="detail-vals"></div>';
    body.appendChild(valSection);

    const valList = valSection.querySelector('#detail-vals');
    for (const dp of [...dataPoints].reverse()) {
      const _useOrtho = state.settings.useOrtho;
      const cc = colorClass(dp.value, elMeta.labMin ?? null, elMeta.labMax ?? null, _useOrtho ? (elMeta.orthoMin ?? null) : null, _useOrtho ? (elMeta.orthoMax ?? null) : null);
      const div = document.createElement('div');
      div.className = 'detail-value-row';
      div.innerHTML = `<span class="dv-date">${formatDate(dp.date)}</span><span class="dv-val val-${cc}">${dp.value} ${esc(dp.unit)}</span>`;
      valList.appendChild(div);
    }
  }

  // Category section
  const catSection = document.createElement('div');
  catSection.className = 'detail-section';
  const currentCat = elMeta.category || defaultCategory(elementName);
  catSection.innerHTML = `
    <h3>Categorie</h3>
    <select id="detail-category" class="cat-select">
      ${state.categories.map(c => `<option value="${c}"${c === currentCat ? ' selected' : ''}>${c}</option>`).join('')}
    </select>`;
  body.appendChild(catSection);
  catSection.querySelector('#detail-category').addEventListener('change', e => {
    if (!state.elements[elementName]) state.elements[elementName] = {};
    state.elements[elementName].category = e.target.value;
    saveState();
    renderTable();
  });

  // Lab reference range section
  // Pre-populate from stored value, else from most recent test result that has a range
  const labMinDefault = elMeta.labMin ?? null;
  const labMaxDefault = elMeta.labMax ?? null;

  const labSection = document.createElement('div');
  labSection.className = 'detail-section';
  labSection.innerHTML = `
    <h3>Lab referentiewaarden</h3>
    <div class="ortho-inputs">
      <div class="ortho-field">
        <label>Min</label>
        <input type="number" step="any" id="lab-min" value="${labMinDefault ?? ''}" placeholder="—">
      </div>
      <div class="ortho-field">
        <label>Max</label>
        <input type="number" step="any" id="lab-max" value="${labMaxDefault ?? ''}" placeholder="—">
      </div>
    </div>
  `;
  body.appendChild(labSection);

  const saveLab = () => {
    const min = document.getElementById('lab-min').value;
    const max = document.getElementById('lab-max').value;
    if (!state.elements[elementName]) state.elements[elementName] = {};
    state.elements[elementName].labMin = min !== '' ? parseFloat(min) : null;
    state.elements[elementName].labMax = max !== '' ? parseFloat(max) : null;
    saveState();
  };

  labSection.querySelector('#lab-min').addEventListener('change', saveLab);
  labSection.querySelector('#lab-max').addEventListener('change', saveLab);

  // Ortho range section (only visible when ortho is enabled in settings)
  const orthoSection = document.createElement('div');
  orthoSection.className = 'detail-section';
  if (!state.settings.useOrtho) orthoSection.classList.add('hidden');
  orthoSection.innerHTML = `
    <h3>Orthomoleculaire referentiewaarden</h3>
    <div class="ortho-inputs">
      <div class="ortho-field">
        <label>Min</label>
        <input type="number" step="any" id="ortho-min" value="${elMeta.orthoMin ?? ''}" placeholder="—">
      </div>
      <div class="ortho-field">
        <label>Max</label>
        <input type="number" step="any" id="ortho-max" value="${elMeta.orthoMax ?? ''}" placeholder="—">
      </div>
    </div>
  `;
  body.appendChild(orthoSection);

  const saveOrtho = () => {
    const min = document.getElementById('ortho-min').value;
    const max = document.getElementById('ortho-max').value;
    if (!state.elements[elementName]) state.elements[elementName] = {};
    state.elements[elementName].orthoMin = min !== '' ? parseFloat(min) : null;
    state.elements[elementName].orthoMax = max !== '' ? parseFloat(max) : null;
    saveState();
    renderTable();
    renderDetailChart(elementName, dataPoints, state.elements[elementName]);
  };

  orthoSection.querySelector('#ortho-min').addEventListener('change', saveOrtho);
  orthoSection.querySelector('#ortho-max').addEventListener('change', saveOrtho);

  const saveHint = document.createElement('p');
  saveHint.className = 'save-hint';
  saveHint.style.textAlign = 'right';
  saveHint.textContent = 'Automatisch opgeslagen';
  body.appendChild(saveHint);
}

function renderDetailChart(elementName, dataPoints, elMeta) {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  const canvas = document.getElementById('detail-chart');
  if (!canvas || dataPoints.length === 0) return;

  const labels = dataPoints.map(d => formatDate(d.date));
  const values = dataPoints.map(d => d.value);

  const refMin = elMeta?.labMin ?? null;
  const refMax = elMeta?.labMax ?? null;
  const orthoMin = state.settings.useOrtho ? (elMeta?.orthoMin ?? null) : null;
  const orthoMax = state.settings.useOrtho ? (elMeta?.orthoMax ?? null) : null;

  const pointColors = dataPoints.map(() => '#111827');

  const allVals = [...values];
  if (refMin !== null) allVals.push(refMin);
  if (refMax !== null) allVals.push(refMax);
  if (orthoMin !== null) allVals.push(orthoMin);
  if (orthoMax !== null) allVals.push(orthoMax);

  const padding = (Math.max(...allVals) - Math.min(...allVals)) * 0.2 || 1;
  const yMin = Math.min(...allVals) - padding;
  const yMax = Math.max(...allVals) + padding;

  const annotations = {};

  // Lab range: light green band
  const hasLab = refMin !== null || refMax !== null;
  if (hasLab) {
    annotations.labBand = {
      type: 'box',
      yMin: refMin ?? yMin,
      yMax: refMax ?? yMax,
      backgroundColor: 'rgba(187,247,208,0.45)',
      borderWidth: 0,
    };
  }

  // Ortho range: darker green band (drawn on top)
  const hasOrtho = orthoMin !== null || orthoMax !== null;
  if (hasOrtho) {
    annotations.orthoBand = {
      type: 'box',
      yMin: orthoMin ?? yMin,
      yMax: orthoMax ?? yMax,
      backgroundColor: 'rgba(34,197,94,0.22)',
      borderWidth: 0,
    };
  }

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: '#111827',
        backgroundColor: 'transparent',
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.y} ${dataPoints[ctx.dataIndex]?.unit || ''}`,
          }
        },
        annotation: {
          annotations,
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { min: yMin, max: yMax, grid: { color: '#f0f0f0' } },
      },
    },
  });
}

// ── EXPORT / IMPORT ──────────────────────────────────────────────────────────

function renderSettingsBody() {
  const body = document.getElementById('settings-body');
  body.innerHTML = '';

  // Weergave
  const displaySection = document.createElement('div');
  displaySection.className = 'detail-section';
  displaySection.innerHTML = `
    <h3>Weergave</h3>
    <label class="settings-toggle">
      <input type="checkbox" id="setting-hide-empty" ${state.settings.hideEmpty ? 'checked' : ''}>
      <span>Verberg elementen zonder waarden</span>
    </label>
    <label class="settings-toggle" style="margin-top:10px">
      <input type="checkbox" id="setting-use-ortho" ${state.settings.useOrtho ? 'checked' : ''}>
      <span>Gebruik orthomoleculaire referentiewaarden</span>
    </label>
  `;
  body.appendChild(displaySection);

  displaySection.querySelector('#setting-hide-empty').addEventListener('change', e => {
    state.settings.hideEmpty = e.target.checked;
    saveState();
    renderTable();
  });

  displaySection.querySelector('#setting-use-ortho').addEventListener('change', e => {
    state.settings.useOrtho = e.target.checked;
    saveState();
    renderTable();
    // Refresh detail panel if open so ortho section shows/hides immediately
    if (selectedElement && !document.getElementById('detail-panel').classList.contains('hidden')) {
      renderDetailBody(selectedElement);
    }
  });

  // Data
  const dataSection = document.createElement('div');
  dataSection.className = 'detail-section';
  dataSection.innerHTML = `
    <h3>Data</h3>
    <div class="settings-actions">
      <button id="settings-export" class="btn-ghost settings-btn">↓ Exporteer backup</button>
      <button id="settings-import" class="btn-ghost settings-btn">↑ Backup herstellen</button>
    </div>
  `;
  body.appendChild(dataSection);

  dataSection.querySelector('#settings-export').addEventListener('click', exportJSON);
  dataSection.querySelector('#settings-import').addEventListener('click', () => {
    document.getElementById('input-json').click();
  });
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bloedwaarden-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported.tests) throw new Error('Ongeldig bestand');
      state = imported;
      saveState();
      renderTable();
      showToast('Backup hersteld');
    } catch {
      showToast('Fout: ongeldig backup-bestand');
    }
  };
  reader.readAsText(file);
}

// ── UTILS ────────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}

// ── EVENT WIRING ─────────────────────────────────────────────────────────────

function handlePDFFile(file) {
  if (!file || file.type !== 'application/pdf') {
    showToast('Enkel PDF-bestanden worden ondersteund');
    return;
  }

  showToast('PDF wordt ingelezen…');

  parsePDF(file).then(parsed => {
    if (parsed.results.length === 0) {
      showToast('Geen waarden gevonden in deze PDF. Probeer handmatig toe te voegen.');
      // Open empty review modal so user can add rows manually
      parsed.results = [];
    }
    openReviewModal(parsed);
  }).catch(err => {
    console.error(err);
    showToast('Fout bij inlezen van PDF');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderTable();

  // PDF button
  document.getElementById('btn-import-pdf').addEventListener('click', () => {
    document.getElementById('input-pdf').click();
  });
  document.getElementById('empty-import-btn').addEventListener('click', () => {
    document.getElementById('input-pdf').click();
  });

  document.getElementById('input-pdf').addEventListener('change', e => {
    if (e.target.files[0]) handlePDFFile(e.target.files[0]);
    e.target.value = '';
  });


  // Settings panel
  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('detail-panel').classList.add('hidden');
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) renderSettingsBody();
  });
  document.getElementById('settings-close').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.add('hidden');
  });

  document.getElementById('input-json').addEventListener('change', e => {
    if (e.target.files[0]) importJSON(e.target.files[0]);
    e.target.value = '';
  });

  // Drag & drop
  document.addEventListener('dragover', e => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      document.getElementById('drop-overlay').classList.remove('hidden');
    }
  });
  document.addEventListener('dragleave', e => {
    if (!e.relatedTarget) {
      document.getElementById('drop-overlay').classList.add('hidden');
    }
  });
  document.addEventListener('drop', e => {
    e.preventDefault();
    document.getElementById('drop-overlay').classList.add('hidden');
    const file = e.dataTransfer.files[0];
    if (file) handlePDFFile(file);
  });

  // Modal close / cancel
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('review-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // Add row in review
  document.getElementById('review-add-row').addEventListener('click', () => {
    const tbody = document.getElementById('review-tbody');
    if (!tbody) return;
    const newRow = { element: '', value: null, valueText: '', unit: '', refMin: null, refMax: null, refText: '', uncertain: false };
    appendReviewRow(tbody, newRow, Date.now());
    // Focus the element input of the new row
    tbody.lastElementChild?.querySelector('[data-field="element"]')?.focus();
  });

  // Save review
  document.getElementById('review-save').addEventListener('click', () => {
    const date = document.getElementById('review-date').value;
    const lab = document.getElementById('review-lab').value;
    const results = collectReviewRows();

    if (!date) { showToast('Vul een datum in'); return; }
    if (results.length === 0) { showToast('Geen rijen om op te slaan'); return; }

    // Check for duplicate: same filename already imported
    const existing = state.tests.find(t => t.filename === pendingParsed?.filename);
    if (existing) {
      if (!confirm(`Er bestaat al een import van "${pendingParsed.filename}". Vervangen?`)) return;
      state.tests = state.tests.filter(t => t !== existing);
    }

    state.tests.push({
      id: uuid(),
      date,
      lab,
      filename: pendingParsed?.filename || 'handmatig',
      results,
    });

    // Normaliseer elementnamen (case-insensitief samenvoegen)
    for (const r of results) {
      r.element = canonicalName(r.element);
    }

    // Pre-fill lab + ortho ranges + categorie where not yet set
    for (const r of results) {
      if (!r.element) continue;
      if (!state.elements[r.element]) state.elements[r.element] = {};
      const el = state.elements[r.element];
      // 1. Fill labMin/labMax from PDF ref (only if not yet set)
      if (el.labMin === undefined || el.labMin === null) el.labMin = r.refMin ?? null;
      if (el.labMax === undefined || el.labMax === null) el.labMax = r.refMax ?? null;
      // 2. Fill orthoMin/orthoMax from labMin/labMax (only if not yet set)
      if (el.orthoMin === undefined || el.orthoMin === null) el.orthoMin = el.labMin;
      if (el.orthoMax === undefined || el.orthoMax === null) el.orthoMax = el.labMax;
      // Re-categorize if unknown or still "Overige"
      if (!el.category || el.category === 'Overige') el.category = defaultCategory(r.element);
    }

    saveState();
    renderTable();
    closeModal();
    showToast(`${results.length} waarden opgeslagen`);
  });

  // Detail panel close
  document.getElementById('detail-close').addEventListener('click', closeDetailPanel);
});
