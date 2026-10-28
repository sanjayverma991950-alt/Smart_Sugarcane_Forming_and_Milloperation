const axios = require("axios");

/**
 * AgroCane 360 AI & Agricultural Agronomy Intelligence Engine
 * - Powered by Google Gemini Generative AI (when API key configured)
 * - Backed by comprehensive Sugarcane Agronomy Knowledge & Expert Decision Engine
 * - Context-aware of Farmer's Tickets, Payments, Fields, Weather & Season
 */

// ============================================================================
// 1. SUGARCANE DOMAIN KNOWLEDGE BASE
// ============================================================================

const AGRONOMY_KNOWLEDGE = {
  diseases: [
    {
      id: "red_rot",
      nameEn: "Sugarcane Red Rot (Colletotrichum falcatum)",
      nameHi: "लाल सड़न रोग (Red Rot / कैंसर ऑफ शुगरकेन)",
      aliases: ["red rot", "lal sadan", "laal sadan", "redrot", "cancer of sugarcane", "lal rog"],
      symptomsEn: [
        "Yellowing and withering of 3rd or 4th leaf from top crown",
        "Red discoloration inside the stalk pith with distinctive white transverse patches",
        "Characteristic sour alcoholic/fermented smell when stalk is split longitudinally",
        "Cane shrinks, wrinkles, and dries completely in severe attacks",
      ],
      symptomsHi: [
        "ऊपरी हिस्से की तीसरी और चौथी पत्ती पीली पड़कर सूखने लगती है",
        "गन्ने को बीच से चीरने पर भीतरी गूदा ईंट जैसा लाल दिखाई देता है और उस पर सफेद आड़ी पट्टियां (white patches) होती हैं",
        "चीरने पर सिरके या खट्टी शराब जैसी तेज गंध आती है",
        "गन्ना अंदर से खोखला होकर सिकुड़ जाता है",
      ],
      remediesEn: [
        "Immediate Action: Rogue out (uproot) infected cane clumps with roots and burn outside field.",
        "Ratoon Warning: NEVER take a ratoon crop (पेड़ी) from an infected field.",
        "Varietal Replacement: Stop planting susceptible varieties (especially older Co 0238). Switch to certified resistant varieties like Co 0118, Co 15023, CoLk 14201, or Co 98014.",
        "Seed Treatment: Treat setts with Carbendazim 50% WP (1 gram/liter water) or Trichoderma viride (10 g/kg seed) for 15-20 minutes before planting.",
        "Soil Treatment: Apply Trichoderma viride @ 2.5 kg mixed in 50 kg well-rotted FYM/pressmud per acre at planting.",
        "Crop Rotation: Practice 1-2 year rotation with paddy, maize, or legumes in heavily infected plots.",
      ],
      remediesHi: [
        "तत्काल उपाय: प्रभावित पौधे को जड़ सहित उखाड़कर खेत से बाहर जला दें या गहरे गड्ढे में दबा दें।",
        "पेड़ी न लें: लाल सड़न से ग्रसित खेत में कभी भी पेड़ी (ratoon) न रखें।",
        "किस्म बदलें: संवेदनशील किस्म (विशेषकर Co 0238) की बुवाई बंद करें। इसकी जगह Co 0118, Co 15023, CoLk 14201 या Co 98014 जैसी रोगरोधी किस्में लगाएं।",
        "बीज शोधन: बुवाई से पहले 2-आंख वाले टुकड़ों को कार्बेंडाजिम 50% WP (1 ग्राम प्रति लीटर पानी) के घोल में 15 मिनट डुबोकर उपचारित करें।",
        "भूमि शोधन: ट्राइकोडर्मा विरिडी (2.5 किग्रा प्रति एकड़) को 50 किग्रा सड़ी गोबर की खाद में मिलाकर बुवाई के समय कूंड़ों में डालें।",
        "फसल चक्र: अत्यधिक प्रभावित खेत में 1-2 वर्ष धान, मक्का या दलहनी फसलों का फसल चक्र अपनाएं।",
      ],
    },
    {
      id: "pokkah_boeng",
      nameEn: "Pokkah Boeng (Fusarium moniliforme / fujikuroi)",
      nameHi: "पोक्का बोइंग रोग (Pokkah Boeng / मुड़ी हुई चोटी)",
      aliases: ["pokkah boeng", "poka boeng", "twisted top", "choti mudna", "chlorosis", "pokah"],
      symptomsEn: [
        "Chlorotic, crinkled or crumpled leaves near the spindle/terminal top",
        "Shortening, twisting, and malformation of top leaves ('twisted top')",
        "Reddish-brown ladder-like cuts or lesions inside top stalk",
        "Terminal bud rots in severe cases during humid monsoon periods",
      ],
      symptomsHi: [
        "गोभ की नई पत्तियां सिकुड़ी, मुड़ी हुई और हल्के पीले रंग की हो जाती हैं",
        "पत्तियां उलझकर मुड़ जाती हैं जिसे 'ट्विस्टेड टॉप' कहते हैं",
        "गोभ के भीतर लाल-कत्थई रंग की सीढ़ीनुमा धारियां बन जाती हैं",
        "गंभीर स्थिति में शीर्ष कलिका (गोभ) सड़ जाती है",
      ],
      remediesEn: [
        "Fungicide Spray: Spray Copper Oxychloride 50% WP (COC) @ 2.5 grams/liter (or Carbendazim 12% + Mancozeb 63% WP @ 2 g/L) targeting the leaf whorl/spindle.",
        "Repeat Spray: Repeat after 12-15 days if cloudy/humid conditions persist.",
        "Nitrogen Management: Avoid excessive urea/nitrogen application during hot, humid rainy season.",
        "Drainage: Ensure excess standing water is drained out promptly.",
      ],
      remediesHi: [
        "कवकनाशी छिड़काव: कॉपर ऑक्सीक्लोराइड 50% WP (2.5 ग्राम प्रति लीटर) या साफ (Carbendazim + Mancozeb @ 2 ग्राम/लीटर) का गोभ को भिगोते हुए छिड़काव करें।",
        "दोहराव: यदि मौसम बादलों और उमस वाला बना रहे तो 12-15 दिन बाद दोबारा छिड़काव करें।",
        "यूरिया पर नियंत्रण: बारिश के दिनों में अत्यधिक यूरिया (नाइट्रोजन) देने से बचें।",
        "जल निकासी: खेत में भरा हुआ पानी तुरंत बाहर निकालें।",
      ],
    },
    {
      id: "smut",
      nameEn: "Sugarcane Smut (Sporisorium scitamineum)",
      nameHi: "कंडुआ रोग / चाबुक रोग (Sugarcane Smut)",
      aliases: ["smut", "kandua", "chabuk rog", "black whip", "kala chabuk"],
      symptomsEn: [
        "Characteristic black whip-like unbranched structure emerging from central apical shoot",
        "Stunted growth with numerous thin, grassy, tillers",
        "Black soot-like powdery spores dispersed by wind",
      ],
      symptomsHi: [
        "गन्ने के शीर्ष से काले रंग का चाबुक जैसा लंबा मुड़ा हुआ डंडा निकलता है",
        "पौधे की बढ़वार रुक जाती है और पतले-पतले घास जैसे कल्ले निकलते हैं",
        "चाबुक से काला पाउडर (बीजाणु) हवा में उड़ता है",
      ],
      remediesEn: [
        "Physical Removal: Gently cover the black whip with a polythene bag BEFORE cutting to avoid spore dispersal, cut infected clumps at base, and burn completely.",
        "Sett Treatment: Treat seed setts with hot water at 52°C for 30 minutes, followed by Carbendazim 0.1% dip.",
        "Resistant Varieties: Cultivate smut-resistant varieties.",
      ],
      remediesHi: [
        "सावधानीपूर्वक कटाई: काले चाबुक को काटने से पहले पॉलीथिन बैग से ढकें ताकि धूल न उड़े, फिर पौधे को नीचे से काटकर जला दें।",
        "बीज शोधन: बुवाई से पहले बीजों का 52°C गर्म पानी में 30 मिनट उपचार करें और बाविस्टिन (1 ग्राम/लीटर) में डुबोएं।",
        "प्रमाणित बीज: रोगमुक्त प्रमाणित बीज का ही उपयोग करें।",
      ],
    },
    {
      id: "wilt",
      nameEn: "Sugarcane Wilt (Fusarium sacchari)",
      nameHi: "उकठा रोग (Sugarcane Wilt)",
      aliases: ["wilt", "uktha", "ukatha", "sukhna", "stalk hollow"],
      symptomsEn: [
        "Gradual withering of crown leaves, looking dull and rolled inward",
        "Stalk becomes light in weight and pith forms boat-shaped hollow cavities",
        "Reddish-brown internal discoloration without white transverse bands",
      ],
      symptomsHi: [
        "पौधे की पत्तियां ऊपर से धीरे-धीरे मुरझाने और सूखने लगती हैं",
        "गन्ना हल्का और पोला (खोखला) हो जाता है",
        "गन्ने के भीतर नाव के आकार के खोखले गड्ढे बन जाते हैं और लाल-भूरा रंग दिखता है",
      ],
      remediesEn: [
        "Soil Application: Drench soil along cane rows with Carbendazim 0.1% or apply Trichoderma @ 2.5 kg/acre with pressmud.",
        "Avoid Drought & Waterlogging: Maintain balanced moisture; avoid prolonged drought followed by heavy stagnation.",
        "Sett Selection: Do not select seed from drought-affected or wilt-affected fields.",
      ],
      remediesHi: [
        "मिट्टी उपचार: कतारों में कार्बेंडाजिम (1 ग्राम/लीटर) से ड्रेंचिंग करें या ट्राइकोडर्मा 2.5 किग्रा/एकड़ गोबर की खाद में मिलाकर दें।",
        "जल प्रबंधन: न तो लंबे समय सूखा रखें और न ही जलभराव होने दें।",
        "स्वस्थ बीज: उकठा प्रभावित खेत से बीज न लें।",
      ],
    },
    {
      id: "grassy_shoot",
      nameEn: "Grassy Shoot Disease (Phytoplasma)",
      nameHi: "घासी प्ररोह रोग (Grassy Shoot Disease)",
      aliases: ["grassy shoot", "ghasi praroh", "grass", "ghas jaisa", "albino tillers"],
      symptomsEn: [
        "Profuse slender tillers giving cane a bushy, grassy appearance",
        "Pale yellow or albino (white) narrow leaves",
        "No millable thick cane formation",
      ],
      symptomsHi: [
        "गन्ने के तने से अनगिनत पतले-पतले घास जैसे कल्ले फूटते हैं",
        "पत्तियां सफेद, पीली और बहुत पतली हो जाती हैं",
        "मोटा गन्ना बिल्कुल नहीं बन पाता",
      ],
      remediesEn: [
        "Rogueing: Immediately pull out and destroy entire bushy clump.",
        "Heat Therapy: Hot water treatment of seed setts at 50°C for 2 hours.",
        "Vector Control: Control aphid and leafhopper vectors using Imidacloprid 17.8% SL @ 100 ml/acre.",
      ],
      remediesHi: [
        "उखाड़ना: झाड़ीनुमा रोगी पौधे को तुरंत उखाड़कर नष्ट करें।",
        "बीज उपचार: गर्म भाप या 50°C गर्म पानी में 2 घंटे बीजोपचार करें।",
        "कीट नियंत्रण: रोग फैलाने वाले रसचूसक कीड़ों के लिए इमिडाक्लोप्रिड 17.8% SL (100 मिली/एकड़) का छिड़काव करें।",
      ],
    },
  ],

  pests: [
    {
      id: "shoot_borer",
      nameEn: "Early Shoot Borer (Chilo infuscatellus)",
      nameHi: "कंसुआ / तना छेदक (Early Shoot Borer)",
      aliases: ["shoot borer", "kansua", "tana chedakh", "dead heart", "deadheart", "early shoot"],
      symptomsEn: [
        "Attacks young crop (30 to 90 days after planting)",
        "Drying of central spindle forming a 'dead heart' that pulls out easily emitting a foul rotting smell",
        "Small entry holes near soil level on young shoots",
      ],
      symptomsHi: [
        "बुवाई के 30 से 90 दिन की अवस्था पर हमला करता है",
        "बीच की गोभ सूख जाती है (Dead Heart) जिसे खींचने पर आसानी से बाहर निकल आती है और उसमें से सड़ी दुर्गंध आती है",
        "तने पर जमीन के पास छोटे-छोटे छेद दिखाई देते हैं",
      ],
      remediesEn: [
        "Chemical Drenching: Chlorantraniliprole 18.5% SC (Coragen) @ 150 ml in 400 liters water per acre, sprayed/drenched directly over cane setts at planting or along rows at 35-45 days.",
        "Granular Alternative: Fipronil 0.3% GR @ 10-12 kg/acre or Cartap Hydrochloride 4G @ 10 kg/acre followed by light irrigation.",
        "Cultural: Earthing up at 45-60 days covers the lower leaf sheaths and reduces borer entry.",
        "Biological: Release Trichogramma chilonis parasitoid cards @ 20,000 eggs/acre at 10-day intervals.",
      ],
      remediesHi: [
        "रासायनिक ड्रेंचिंग: कोराजन (Chlorantraniliprole 18.5% SC) 150 मिली को 400 लीटर पानी में मिलाकर बुवाई के समय कूंड़ों में या 35-45 दिन पर जड़ों के पास ड्रेंचिंग करें।",
        "दानेदार दवा: फिप्रोनिल 0.3% GR (10-12 किग्रा प्रति एकड़) या कारटाप हाइड्रोक्लोराइड 4G (10 किग्रा) डालकर हल्की सिंचाई करें।",
        "मिट्टी चढ़ाना: 45-60 दिन पर हल्की मिट्टी चढ़ा देने से कीट तने में प्रवेश नहीं कर पाता।",
        "जैविक नियंत्रण: ट्राइकोग्रामा चिलोनीस परजीवी कार्ड (20,000 अंडे प्रति एकड़) लगाएं।",
      ],
    },
    {
      id: "top_borer",
      nameEn: "Top Borer (Scirpophaga excerptalis)",
      nameHi: "चोटी बेधक (Top Borer)",
      aliases: ["top borer", "choti bedhak", "choti borer", "shot hole", "bunchy top"],
      symptomsEn: [
        "Shot holes in opened leaves arranged in horizontal rows",
        "Red central streak/tunnel in the leaf midrib",
        "Spindle dries and turns black; cane develops bunchy top (गुच्छा शीर्ष) with small lateral shoots",
      ],
      symptomsHi: [
        "पत्तियों में एक सीध में बंदूकी छर्रे जैसे छेद (shot holes) दिखाई देते हैं",
        "पत्ती की मुख्य नस (midrib) के बीच में लाल रंग की सुरंग बन जाती है",
        "ऊपरी गोभ सूख जाती है और कल्ले ऊपर से गुच्छेदार (bunchy top) हो जाते हैं",
      ],
      remediesEn: [
        "Timely Application: Apply Chlorantraniliprole 18.5% SC @ 150 ml/acre or Carbofuran 3G @ 12-13 kg/acre in end of June or first week of July.",
        "Egg Mass Destruction: Collect and crush visible egg masses on lower surface of top leaves.",
        "Cutting Infested Shoots: Cut infested shoots below the caterpillar level and destroy.",
      ],
      remediesHi: [
        "समय पर दवा: जून के अंतिम सप्ताह या जुलाई के प्रथम सप्ताह में कोराजन (150 मिली/एकड़) की ड्रेंचिंग या कार्बोफ्यूरान 3G (12-13 किग्रा/एकड़) जड़ों के पास डालें।",
        "अंडों को नष्ट करना: पत्तियों की निचली सतह पर दिखने वाले अंडे के गुच्छों को नष्ट करें।",
        "कीटग्रस्त गोभ काटना: कीट लगी हुई गोभ को कीड़े के नीचे से काटकर नष्ट कर दें।",
      ],
    },
    {
      id: "pyrilla",
      nameEn: "Sugarcane Leafhopper / Pyrilla (Pyrilla perpusilla)",
      nameHi: "पायरिला / पत्ती फुदका (Pyrilla)",
      aliases: ["pyrilla", "pairila", "leaf hopper", "sooty mold", "fudka", "kala phafund"],
      symptomsEn: [
        "Adults and nymphs suck sap from leaf underside; leaves turn yellowish-white",
        "Excretes sugary honey-dew on which black sooty mold fungus develops",
        "Drastic reduction in photosynthesis, cane tonnage, and sugar recovery",
      ],
      symptomsHi: [
        "कीट और बच्चे पत्तियों के नीचे से रस चूसते हैं जिससे पत्तियां पीली पड़ जाती हैं",
        "कीट मीठा चिपचिपा रस छोड़ता है जिससे पत्तियों पर काली फफूंद (Sooty Mold) जम जाती है",
        "गन्ने का वजन और चीनी का परता (recovery) 20-30% तक गिर जाता है",
      ],
      remediesEn: [
        "Foliar Spray: Spray Imidacloprid 17.8% SL @ 100 ml in 200 liters water per acre, OR Chlorpyrifos 20% EC @ 1 liter/acre.",
        "Biological Miracle: Conserve or introduce the natural nymphal parasitoid Epiricania melanoleuca (400-500 cocoons or 4,000-5,000 egg masses per acre).",
      ],
      remediesHi: [
        "कीटनाशक छिड़काव: इमिडाक्लोप्रिड 17.8% SL (100 मिली प्रति एकड़) को 200 लीटर पानी में मिलाकर छिड़कें, या क्लोरपायरीफॉस 20% EC (1 लीटर/एकड़) का प्रयोग करें।",
        "जैविक मित्र कीट: मित्र परजीवी एपीरिकेनिया मेलानोल्युका (Epiricania melanoleuca) के 400-500 कोकून या अंडे खेत में लगाएं।",
      ],
    },
    {
      id: "white_grub",
      nameEn: "White Grub (Holotrichia consanguinea)",
      nameHi: "सफेद लट / कुरमुला (White Grub)",
      aliases: ["white grub", "safed lat", "kurmula", "root grub", "jad keeda"],
      symptomsEn: [
        "C-shaped fleshy white grubs eat underground roots",
        "Cane clumps wither and dry up in patches",
        "Affected cane can be pulled out effortlessly by hand",
      ],
      symptomsHi: [
        "सी (C) आकार की सफेद लट जमीन के नीचे गन्ने की जड़ें काट देती है",
        "खेत में चकत्तों में गन्ना सूखने लगता है",
        "हाथ से खींचने पर गन्ना बिना किसी जोर के जड़ समेत आसानी से उखड़ जाता है",
      ],
      remediesEn: [
        "Soil Treatment: Apply Fipronil 0.3% GR @ 10-12 kg/acre or Chlorpyrifos 20% EC @ 1.5-2 liters/acre drenched with irrigation water.",
        "Bio-control: Mix Metarhizium anisopliae or Beauveria bassiana @ 2 kg/acre with well-rotted FYM and apply during rainy season.",
        "Light Traps: Install light traps in June after first monsoon showers to trap and kill adult beetles.",
      ],
      remediesHi: [
        "भूमि शोधन: फिप्रोनिल 0.3% GR (10-12 किग्रा/एकड़) या क्लोरपायरीफॉस 20% EC (1.5 से 2 लीटर/एकड़) पानी के साथ सिंचाई में दें।",
        "जैविक उपचार: मेटाराइजियम या ब्यूवेरिया बैसियाना (2 किग्रा/एकड़) को गोबर की खाद में मिलाकर बारिश के समय डालें।",
        "प्रकाश प्रपंच (Light Trap): पहली मानसूनी बारिश के बाद रात में लाइट ट्रैप लगाकर प्रौढ़ भृंग (बीटल) नष्ट करें।",
      ],
    },
    {
      id: "termites",
      nameEn: "Termites (Odontotermes obesus)",
      nameHi: "दीमक (Termites)",
      aliases: ["termite", "termites", "deemak", "dimak", "dimakh"],
      symptomsEn: [
        "Attacks eyes of seed setts, preventing germination",
        "Tunnels inside mature canes, packing cavities with soil",
      ],
      symptomsHi: [
        "बुवाई के समय गन्ने की आंखों को खा जाती है जिससे जमाव नहीं होता",
        "खड़े गन्ने को अंदर से खाकर उसमें मिट्टी भर देती है",
      ],
      remediesEn: [
        "Planting Spray: Spray Chlorpyrifos 20% EC @ 1.5-2 liters/acre or Bifenthrin 10% EC @ 400 ml/acre over seed setts in open furrows before covering with soil.",
        "Avoid Unrotted Manure: Never use unrotted or raw cow dung, which attracts termites.",
      ],
      remediesHi: [
        "बुवाई पर छिड़काव: बुवाई के समय कूंड़ में गन्ने के टुकड़ों पर क्लोरपायरीफॉस 20% EC (1.5-2 लीटर/एकड़) या बाईफेन्थ्रिन 10% EC (400 मिली/एकड़) का छिड़काव कर मिट्टी से ढकें।",
        "कच्ची खाद न डालें: खेत में बिना सड़ी गोबर की खाद बिल्कुल न डालें क्योंकि इससे दीमक बढ़ती है।",
      ],
    },
  ],

  fertilizer: {
    npkSummaryEn:
      "General Sugarcane NPK Requirement: 150-180 kg Nitrogen (N), 60-80 kg Phosphorus (P2O5), and 60 kg Potash (K2O) per hectare.\nPer Acre Dosage: Approx 65-75 kg Nitrogen (130-150 kg Urea), 30 kg P2O5 (60-65 kg DAP), and 25 kg K2O (40-50 kg MOP).",
    npkSummaryHi:
      "गन्ने के लिए सामान्य NPK अनुशंसा: 150-180 किग्रा नाइट्रोजन, 60-80 किग्रा फास्फोरस और 60 किग्रा पोटाश प्रति हेक्टेयर।\nप्रति एकड़ मात्रा: लगभग 130-150 किग्रा यूरिया, 60-65 किग्रा डीएपी (DAP), और 40-50 किग्रा पोटाश (MOP)।",
    scheduleEn: [
      "Basal Dose (At Sowing): Full DAP (60 kg/acre) + Full MOP (40 kg/acre) + 1/3rd Urea (40 kg/acre) + Zinc Sulphate 21% (10 kg/acre) applied in the furrows.",
      "1st Top Dressing (45-60 Days / Tillering): 1/3rd Urea (45-50 kg/acre) followed by immediate light irrigation.",
      "2nd Top Dressing (90-120 Days / Before Earthing Up): Remaining 1/3rd Urea (45-50 kg/acre) before June monsoon onset, followed by earthing up.",
      "Micronutrient Care: If yellowing occurs (Iron chlorosis on top leaves), spray Ferrous Sulphate (1%) + Citric Acid (0.1%) twice at 10-day intervals.",
    ],
    scheduleHi: [
      "बुवाई के समय (बेसल डोज): पूरा डीएपी (60 किग्रा/एकड़) + पूरा पोटाश (40 किग्रा/एकड़) + 1/3 यूरिया (40 किग्रा/एकड़) + जिंक सल्फेट 21% (10 किग्रा/एकड़) कूंड़ों में डालें।",
      "पहला टॉप ड्रेसिंग (45-60 दिन - कल्ले फूटते समय): 1/3 यूरिया (45-50 किग्रा/एकड़) डालकर हल्की सिंचाई करें।",
      "दूसरा टॉप ड्रेसिंग (90-120 दिन - मिट्टी चढ़ाने से पहले): शेष 1/3 यूरिया (45-50 किग्रा/एकड़) जून में बारिश शुरू होने से पहले देकर मिट्टी चढ़ाएं।",
      "सूक्ष्म पोषक तत्व: यदि ऊपरी पत्तियां पीली पड़ें (आयरन की कमी), तो फेरस सल्फेट 1% + 0.1% साइट्रिक एसिड का घोल बनाकर छिड़काव करें।",
    ],
  },

  varieties: [
    {
      name: "Co 0118",
      type: "Early Maturing (अगेती)",
      featuresEn: "High sugar recovery (~12.5-13%), moderate tillering, tolerant to red rot, strong erect canes, excellent for early season crushing.",
      featuresHi: "उच्च चीनी परता (लगभग 12.5-13%), मध्यम कल्ले, लाल सड़न (Red Rot) के प्रति सहनशील, सीधा खड़ा रहने वाला गन्ना, अगेती पेराई के लिए सर्वोत्तम।",
    },
    {
      name: "Co 15023",
      type: "Very Early Maturing (अति अगेती)",
      featuresEn: "Super early maturing (10 months), high sucrose (>13.2%), rapid initial growth, thin rind, high tonnage. Excellent replacement for Co 0238 in disease-free zones.",
      featuresHi: "अति अगेती किस्म (10 माह में परिपक्व), रिकॉर्ड मिठास (13.2% से अधिक सुक्रोज), बहुत तेज बढ़वार, कोमल छिलका, Co 0238 का शानदार विकल्प।",
    },
    {
      name: "CoLk 14201",
      type: "Early Maturing (अगेती)",
      featuresEn: "High yield, thick green stalks, resistant to Red Rot, good ratoonability, developed by IISR Lucknow for UP cane belt.",
      featuresHi: "उच्च उपज, मोटे हरे तने, लाल सड़न के प्रति रोधी, बेहतरीन पेड़ी क्षमता, भारतीय गन्ना अनुसंधान संस्थान लखनऊ द्वारा अनुमोदित।",
    },
    {
      name: "Co 98014 (Karan 1)",
      type: "Early Maturing (अगेती)",
      featuresEn: "Drought and waterlogging tolerant, stable yield, good for areas prone to erratic rainfall.",
      featuresHi: "सूखा और जलभराव दोनों सहन करने में सक्षम, स्थिर उपज, उतार-चढ़ाव वाले मौसम के लिए उपयुक्त।",
    },
    {
      name: "Co 0238 (Warning Note)",
      type: "Phasing Out (हटाने योग्य)",
      featuresEn: "CRITICAL ADVICE: Co 0238 has broken down to Red Rot fungal strains across UP, Bihar, and Haryana. Agricultural scientists strongly recommend replacing Co 0238 with Co 0118, Co 15023, or CoLk 14201.",
      featuresHi: "महत्वपूर्ण चेतावनी: Co 0238 में यूपी और बिहार में लाल सड़न रोग की भारी व्यापकता आ चुकी है। वैज्ञानिक इसे तुरंत बदलकर Co 0118, Co 15023 या CoLk 14201 लगाने की सलाह देते हैं।",
    },
  ],

  sowing: {
    seasonsEn: "Two major planting seasons: Autumn Planting (Sept 15 - Oct 31, gives 20-25% higher yield and ideal for intercropping) and Spring Planting (Feb 15 - March 31).",
    seasonsHi: "गन्ना बुवाई के दो मुख्य मौसम हैं: शरदकालीन बुवाई (15 सितंबर से 31 अक्टूबर - इसमें 20-25% अधिक उपज और सहफसली खेती का लाभ मिलता है) तथा बसंतकालीन बुवाई (15 फरवरी से 31 मार्च)।",
    trenchMethodEn:
      "Trench Method (ट्रेंच विधि): Dig furrows 4 to 4.5 feet apart and 25-30 cm deep. Place 2-bud setts end-to-end, apply basal fertilizer, treat with fungicide, and cover with 5-7 cm soil. Saves 30% water, prevents lodging, increases tillering by 30%, and allows intercropping with potato or mustard.",
    trenchMethodHi:
      "ट्रेंच विधि (Trench Method): 4 से 4.5 फीट की दूरी पर 25-30 सेमी गहरी नालियां बनाएं। 2 आंख वाले टुकड़ों को सिरे से सिरा मिलाकर बिछाएं, बेसल खाद डालें, कवकनाशी उपचार करें और 5-7 सेमी मिट्टी से ढकें। यह विधि 30% पानी बचाती है, गन्ने को गिरने से बचाती है, और आलू/सरसों की सहफसली खेती संभव बनाती है।",
    seedRateEn: "Seed Rate: 30-35 quintals per acre (approx 15,000-18,000 two-bud setts). Cut setts with sharp cane cutter.",
    seedRateHi: "बीज दर: 30-35 क्विंटल प्रति एकड़ (लगभग 15,000-18,000 दो आंख वाले टुकड़े)। हमेशा तेज धार वाले हंसिए से ही टुकड़े काटें।",
  },

  culturalOperations: {
    earthingUpEn:
      "Earthing Up (मिट्टी चढ़ाना): Undertake at 90-120 days (May-June) after 2nd top-dressing of Urea. Converts furrows into ridges, anchors roots firmly, prevents lodging during monsoon, and eases drainage.",
    earthingUpHi:
      "मिट्टी चढ़ाना (Earthing Up): बुवाई के 90-120 दिन (मई-जून में) यूरिया की दूसरी खुराक के बाद करें। नालियों को मेड़ों में बदलें ताकि जड़ें मजबूत हों, बारिश में गन्ना गिरे नहीं और पानी की निकासी आसान हो।",
    proppingEn:
      "Propping & Tying (बंधाई): In August-September, tie opposite cane clumps together using dried cane leaves ('trash'). Repeat a second tying in September. Prevents cane lodging, rodent damage, and 20-30% sucrose loss.",
    proppingHi:
      "गन्ने की बंधाई (Propping/Tying): अगस्त-सितंबर में तेज हवाओं और बारिश से बचाने के लिए 4-5 गन्नों के थानों को सूखी पत्तियों से आपस में बांधें। सितंबर में दोबारा बंधाई करें। गिरा हुआ गन्ना 20-30% वजन और मिठास खो देता है।",
    weedControlEn:
      "Weed Control: Spray Atrazine 50% WP @ 1-1.5 kg/acre in 200L water within 48 hours of sowing as pre-emergence herbicide. For broadleaf weeds at 30-45 days, spray 2,4-D Amine salt 58% SL @ 800 ml/acre.",
    weedControlHi:
      "खरपतवार नियंत्रण: बुवाई के 48 घंटे के भीतर एट्राजीन 50% WP (1 से 1.5 किग्रा/एकड़) 200 लीटर पानी में घोलकर छिड़कें (जमाव पूर्व)। जमाव के बाद चौड़ी पत्ती वाले खरपतवार के लिए 2,4-D अमाइन साल्ट 58% SL (800 मिली/एकड़) 30-40 दिन पर छिड़कें।",
    trashMulchingEn:
      "Trash Mulching: Spreading dried cane leaves (3-4 tonnes/acre) in inter-row spaces after germination retains soil moisture, lowers soil temperature in summer, smothers weeds, and adds valuable organic carbon.",
    trashMulchingHi:
      "पत्ती बिछाना (Trash Mulching): कल्ले निकलने के बाद कूंड़ों के बीच सूखी गन्ने की पत्ती (3-4 टन/एकड़) बिछाने से जमीन में नमी बनी रहती है, खरपतवार नहीं उगते, गर्मियों में तापमान नियंत्रित रहता है और जमीन में जैविक कार्बन बढ़ता है।",
    intercroppingEn:
      "Intercropping (सहफसली खेती): In Autumn planted trench cane (spaced at 4-5 feet), farmers can take 2 rows of Potato, Mustard, Garlic, Onion, Coriander, or Pea. This provides early cash income within 90-100 days without hurting cane yield.",
    intercroppingHi:
      "सहफसली खेती: 4 से 5 फीट दूरी पर शरदकालीन ट्रेंच गन्ने के साथ बीच में आलू, सरसों, लहसुन, प्याज, मटर या धनिया की 2 लाइनें उगाएं। इससे गन्ना उत्पादन प्रभावित हुए बिना 90-100 दिन में किसान को अतिरिक्त नगद आमदनी मिलती है।",
    ratoonEn:
      "Ratoon Management (पेड़ी गन्ना): Stubble shaving at ground level immediately after harvest; apply 20% extra Nitrogen (Urea); break compacted ridges; do NOT burn trash; fill gaps using sprouted single-bud setts; spray Bavistin 0.1% over cut stubbles.",
    ratoonHi:
      "पेड़ी गन्ना प्रबंधन: कटाई के तुरंत बाद जमीन की सतह से ठूंठों की छंटाई (Stubble Shaving) करें; कटे ठूंठों पर बाविस्टिन 0.1% का छिड़काव करें; सामान्य से 20% अधिक यूरिया दें; गन्ने की पत्ती बिल्कुल न जलाएं बल्कि खेत में फैला दें; खाली स्थानों में पॉलीबैग के पौधों से गैप फिलिंग करें।",
  },
};

// ============================================================================
// 2. OPENAI & GEMINI REST API CLIENTS
// ============================================================================

/**
 * Call OpenAI (GPT-4o / GPT-4o-mini Vision) for Crop Disease Pathology
 */
const callOpenAIVision = async ({ imageBase64, mimeType = "image/jpeg", apiKey }) => {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    return null;
  }

  const model = process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  const systemPrompt = `You are a certified senior sugarcane plant pathologist and agricultural AI specialist.
Your job is to examine uploaded photos of sugarcane leaves, stalks, spindles, roots, or fields and diagnose diseases or pest attacks accurately.
Diseases & ailments to identify:
- Red Rot (Colletotrichum falcatum / लाल सड़न रोग)
- Pokkah Boeng (Fusarium moniliforme / पोक्का बोइंग)
- Sugarcane Smut (Sporisorium scitamineum / कंडुआ रोग)
- Sugarcane Wilt (Fusarium sacchari / उकठा रोग)
- Grassy Shoot Disease (घासी प्ररोह रोग)
- Early Shoot Borer (कंसुआ / तना छेदक)
- Top Borer (चोटी बेधक)
- Sugarcane Pyrilla (पायरिला / पत्ती फुदका)
- White Grub (सफेद लट)
- Termites (दीमक)
- Rust or Yellow Leaf Disease
- Healthy Sugarcane Foliage (स्वस्थ गन्ना फसल)

Return your response strictly in valid JSON format:
{
  "detectedDisease": "Full Disease Name in English and Hindi (e.g. Sugarcane Red Rot / लाल सड़न रोग)",
  "confidenceScore": 92,
  "isHealthy": false,
  "symptoms": ["Visible symptom 1 in English & Hindi", "Visible symptom 2"],
  "recommendedActions": [
    "Immediate cultural action (e.g. rogue out & burn infected plants, do not take ratoon)",
    "Recommended chemical fungicide/insecticide dosage per acre (e.g. Carbendazim 50% WP @ 1g/L water)",
    "Future preventative seed sett treatment and resistant varieties (e.g. Co 0118, Co 15023)"
  ],
  "chemicalTreatment": "Active chemical ingredient, brand name, and exact dosage per acre or per liter",
  "preventativeAdvice": "Field sanitation, drainage, and variety selection guidance"
}`;

  const requestBody = {
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this sugarcane crop image. Detect disease, pathogen, pest infestation, or healthy foliage. Return valid JSON matching the schema.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
    temperature: 0.2,
  };

  const response = await axios.post(url, requestBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    timeout: 25000,
  });

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (err) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return null;
  }
};

/**
 * Call OpenAI (GPT-4o-mini / GPT-4o) for Text Chat
 */
const callOpenAIChat = async ({ prompt, systemPrompt, apiKey }) => {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    return null;
  }

  const model = process.env.OPENAI_CHAT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  const requestBody = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
    temperature: 0.3,
  };

  const response = await axios.post(url, requestBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    timeout: 15000,
  });

  const text = response.data?.choices?.[0]?.message?.content;
  return text ? text.trim() : null;
};

/**
 * Call Google Gemini 1.5/2.0 Flash via REST API
 */
const callGeminiChat = async ({ prompt, systemPrompt, apiKey }) => {
  const key = apiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }

  const model = process.env.AI_CHAT_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser Question:\n${prompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1000,
      topP: 0.9,
    },
  };

  const response = await axios.post(url, requestBody, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });

  const candidate = response.data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  return text ? text.trim() : null;
};

/**
 * Call Gemini Vision for Crop Pathology Image Analysis
 */
const callGeminiVision = async ({ imageBase64, mimeType = "image/jpeg", apiKey }) => {
  const key = apiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }

  const model = process.env.AI_VISION_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const prompt = `You are a senior sugarcane plant pathologist and agricultural extension specialist. 
Examine the attached image of sugarcane foliage, spindle, stalk, or field.
Identify any sugarcane disease or pest attack (e.g. Red Rot, Pokkah Boeng, Smut, Wilt, Grassy Shoot, Early Shoot Borer, Top Borer, Pyrilla, Rust, Yellow Leaf Disease, or Healthy Cane).

Return your response strictly as valid JSON matching this schema:
{
  "detectedDisease": "string (name in English and Hindi)",
  "confidenceScore": number (60-98),
  "isHealthy": boolean,
  "symptoms": ["string", "string"],
  "recommendedActions": ["string", "string", "string"],
  "preventativeAdvice": "string",
  "chemicalTreatment": "string (active ingredient, formulation, dosage)"
}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1000,
      responseMimeType: "application/json",
    },
  };

  const response = await axios.post(url, requestBody, {
    headers: { "Content-Type": "application/json" },
    timeout: 25000,
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    // If wrapped in markdown ```json ... ```
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return null;
  }
};

// ============================================================================
// 3. SMART QUERY PARSER & SEMANTIC NLP MATCHER
// ============================================================================

/**
 * Detect language: Hindi (Devanagari or Hinglish) vs English
 */
const detectLanguage = (text = "", userLang = "en") => {
  if (userLang === "hi") return "hi";
  if (/[\u0900-\u097F]/.test(text)) return "hi";

  const t = text.toLowerCase();
  const hinglishWords = [
    "kya", "kaise", "kab", "kitna", "kare", "karna", "hai", "hain", "ke", "ki",
    "ka", "me", "mein", "ganna", "ganne", "khet", "pani", "dawai", "khad",
    "beej", "bimaari", "rog", "parchi", "paisa", "rupaye", "chahiye", "sukh",
    "sukha", "peela", "keeda", "lag", "gaya", "karein", "batao", "bataiye", "bata do"
  ];
  let hinglishCount = 0;
  for (const w of hinglishWords) {
    if (new RegExp(`\\b${w}\\b`, "i").test(t)) hinglishCount++;
  }

  return hinglishCount >= 2 ? "hi" : userLang || "en";
};

/**
 * Extract intent & specific question aspect from user query
 */
const analyzeQuery = (query = "") => {
  const q = query.toLowerCase().trim();

  const isDose = /kitna|kitni|matra|dose|dosage|quantity|amount|rate|per acre/i.test(q);
  const isTiming = /kab|time|timing|samay|period|month|din baad|stage/i.test(q);
  const isMedicine = /dawa|dawai|chemical|spray|medicine|spray|roktham|ilaj|treatment|upchar|chhidkaw|control/i.test(q);
  const isSymptom = /lakshan|symptom|pehchan|kya hota hai|dikhta|peela|sukha/i.test(q);
  const isMethod = /kaise|vidhi|tarika|how to|method|technique|step/i.test(q);
  const isWhy = /kyon|kyu|reason|karan|why/i.test(q);

  return {
    raw: query,
    normalized: q,
    isDose,
    isTiming,
    isMedicine,
    isSymptom,
    isMethod,
    isWhy,
  };
};

// ============================================================================
// 4. OFFLINE / FALLBACK INTELLIGENT ADVISORY GENERATOR
// ============================================================================

/**
 * Generate comprehensive, direct, and detailed answer for ANY question
 */
const generateKnowledgeResponse = (parsed, context = {}, isHi = false) => {
  const q = parsed.normalized;

  // 1. Account / Ticket / Payment / Mill Questions
  if (
    q.includes("ticket") ||
    q.includes("parchi") ||
    q.includes("purji") ||
    q.includes("chit") ||
    q.includes("satta") ||
    q.includes("quota")
  ) {
    const { tickets = [] } = context;
    if (tickets.length > 0) {
      const t0 = tickets[0];
      const bal = Math.max(0, (t0.allocatedQuantityTonnes || 0) - (t0.suppliedQuantityTonnes || 0));
      return isHi
        ? `🎫 **आपकी ताज़ा गन्ना आपूर्ति पर्ची विवरण:**\n\n- **टिकट संख्या:** ${t0.ticketNumber}\n- **स्थिति:** '${t0.status.toUpperCase()}'\n- **आवंटित मात्रा:** ${t0.allocatedQuantityTonnes} टन\n- **अब तक तौल (आपूर्ति):** ${t0.suppliedQuantityTonnes} टन\n- **शेष बची मात्रा:** ${bal} टन\n\n📌 **सुझाव:** चीनी मिल कैलेंडर के अनुसार पर्ची जारी होने पर आपको एसएमएस भी प्राप्त होता है। तौल केंद्र पर जाते समय अपना किसान कोड और पहचान पत्र साथ रखें।`
        : `🎫 **Your Latest Sugarcane Supply Ticket Details:**\n\n- **Ticket Number:** ${t0.ticketNumber}\n- **Status:** '${t0.status.toUpperCase()}'\n- **Allocated Quantity:** ${t0.allocatedQuantityTonnes} tonnes\n- **Supplied So Far:** ${t0.suppliedQuantityTonnes} tonnes\n- **Balance Remaining:** ${bal} tonnes\n\n📌 **Advisory:** Sugar mills dispatch tickets based on your fortnightly calendar basic quota. Carry your farmer code and identity when visiting the weighment center.`;
    } else {
      return isHi
        ? `🎫 **गन्ना पर्ची (Ticket Status):**\n\nवर्तमान में आपके खाते में कोई सक्रिय पर्ची लंबित नहीं है।\n\n- यदि आपने इस पेराई सत्र के लिए सट्टा सर्वे कराया है, तो मिल कैलेंडर के अनुसार आपकी पर्ची निर्धारित पक्ष (Fortnight) में जारी होगी।\n- आप पोर्टल के **'My Tickets'** मेनू में जाकर नए टिकट अनुरोध की स्थिति जांच सकते हैं या मिल समिति में संपर्क कर सकते हैं।`
        : `🎫 **Sugarcane Supply Ticket Notice:**\n\nNo active supply ticket is currently scheduled in your account.\n\n- Tickets are automatically generated in accordance with your verified survey area and mill supply calendar.\n- You can monitor requests under the **'My Tickets'** section or visit your Cane Development Society.`;
    }
  }

  if (
    q.includes("payment") ||
    q.includes("paisa") ||
    q.includes("rupaye") ||
    q.includes("balance") ||
    q.includes("bhugtan") ||
    q.includes("pending") ||
    q.includes("rate") ||
    q.includes("sap") ||
    q.includes("msp")
  ) {
    const { paymentSummary } = context;
    const due = paymentSummary?.outstanding || 0;
    const paid = paymentSummary?.totalPaid || 0;
    return isHi
      ? `💰 **गन्ना मूल्य भुगतान विवरण (Payment Status):**\n\n- **कुल प्राप्त भुगतान:** ₹${paid.toLocaleString("en-IN")}\n- **वर्तमान शेष बकाया:** ₹${due.toLocaleString("en-IN")}\n\n📌 **नियम:** चीनी उद्योग नियमों के अनुसार मिल द्वारा गन्ना तौल के 14 दिनों के भीतर भुगतान सीधे आपके बैंक खाते (DBT) में भेजा जाता है। अधिक जानकारी के लिए 'Payments' पृष्ठ पर तौल रसीदें देखें।`
      : `💰 **Sugarcane Payment Summary:**\n\n- **Total Received Payments:** ₹${paid.toLocaleString("en-IN")}\n- **Remaining Balance Due:** ₹${due.toLocaleString("en-IN")}\n\n📌 **Policy:** As per cane supply regulations, payments are remitted via Direct Benefit Transfer (DBT) within 14 days of cane delivery at verified State Advised Price (SAP).`;
  }

  if (
    q.includes("crushing") ||
    q.includes("mill") ||
    q.includes("season") ||
    q.includes("satr") ||
    q.includes("chalu") ||
    q.includes("pehrai")
  ) {
    const { season } = context;
    if (season) {
      const d = season.confirmedStartDate || season.tentativeStartDate;
      const dateStr = d ? new Date(d).toLocaleDateString("en-IN") : "शीघ्र";
      return isHi
        ? `🏭 **चीनी मिल पेराई सत्र विवरण:**\n\n- **सत्र का नाम:** ${season.name}\n- **प्रारंभ तिथि:** ${dateStr}\n- **वर्तमान स्थिति:** '${season.status}'\n\nपेराई शुरू होने से पहले अपने खेत का सर्वे पर्चा और बेसिक कोटा सत्यापित कर लें।`
        : `🏭 **Sugar Mill Crushing Season Schedule:**\n\n- **Season:** ${season.name}\n- **Commencement Date:** ${dateStr}\n- **Current Status:** '${season.status}'\n\nEnsure your pre-crushing field survey and bond quota are verified before mill gates open.`;
    }
  }

  // 2. Specific Diseases (Red Rot, Pokkah Boeng, Smut, Wilt, Grassy Shoot)
  for (const d of AGRONOMY_KNOWLEDGE.diseases) {
    if (d.aliases.some((a) => q.includes(a))) {
      if (parsed.isMedicine || parsed.isMethod) {
        return isHi
          ? `🩺 **${d.nameHi} की रोकथाम एवं उपचार:**\n\n${d.remediesHi.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
          : `🩺 **Treatment & Management for ${d.nameEn}:**\n\n${d.remediesEn.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
      } else if (parsed.isSymptom) {
        return isHi
          ? `🔍 **${d.nameHi} के मुख्य लक्षण:**\n\n${d.symptomsHi.map((s, i) => `• ${s}`).join("\n")}\n\n💡 **तुरंत क्या करें:**\n${d.remediesHi.slice(0, 2).map((r, i) => `${i + 1}. ${r}`).join("\n")}`
          : `🔍 **Symptoms of ${d.nameEn}:**\n\n${d.symptomsEn.map((s, i) => `• ${s}`).join("\n")}\n\n💡 **Immediate Steps:**\n${d.remediesEn.slice(0, 2).map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
      } else {
        return isHi
          ? `🌿 **${d.nameHi} की संपूर्ण जानकारी:**\n\n**लक्षण:**\n${d.symptomsHi.slice(0, 3).map((s) => `• ${s}`).join("\n")}\n\n**उपचार एवं रोकथाम उपाय:**\n${d.remediesHi.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
          : `🌿 **Comprehensive Guide: ${d.nameEn}**\n\n**Key Symptoms:**\n${d.symptomsEn.slice(0, 3).map((s) => `• ${s}`).join("\n")}\n\n**Management & Control Steps:**\n${d.remediesEn.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
      }
    }
  }

  // 3. Specific Pests (Shoot Borer, Top Borer, Pyrilla, White Grub, Termites)
  for (const p of AGRONOMY_KNOWLEDGE.pests) {
    if (p.aliases.some((a) => q.includes(a))) {
      return isHi
        ? `🐛 **${p.nameHi} का नियंत्रण एवं दवा:**\n\n**पहचान/लक्षण:**\n${p.symptomsHi.map((s) => `• ${s}`).join("\n")}\n\n**अनुशंसित दवा एवं नियंत्रण उपाय:**\n${p.remediesHi.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
        : `🐛 **Pest Control: ${p.nameEn}**\n\n**Symptoms & Damage:**\n${p.symptomsEn.map((s) => `• ${s}`).join("\n")}\n\n**Recommended Chemical & Cultural Controls:**\n${p.remediesEn.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
    }
  }

  // 4. Fertilizer, NPK, Urea, DAP, Micronutrients, Yellowing
  if (
    q.includes("fertilizer") ||
    q.includes("khad") ||
    q.includes("npk") ||
    q.includes("urea") ||
    q.includes("dap") ||
    q.includes("potash") ||
    q.includes("zinc") ||
    q.includes("poshan") ||
    q.includes("peela") ||
    q.includes("yellow")
  ) {
    const isYellow = q.includes("peela") || q.includes("yellow");
    if (isYellow) {
      return isHi
        ? `🍃 **गन्ने में पत्तियां पीली पड़ने के कारण एवं उपाय:**\n\n1. **आयरन (लोहे) की कमी:** नई ऊपरी पत्तियां पीली पड़ जाती हैं और नसें हरी रहती हैं।\n   👉 **उपचार:** फेरस सल्फेट 1% (10 ग्राम प्रति लीटर) + साइट्रिक एसिड 0.1% (1 ग्राम/लीटर) का 10 दिन के अंतर पर दो बार छिड़काव करें।\n\n2. **नाइट्रोजन की कमी:** निचली पुरानी पत्तियां हल्की पीली हो जाती हैं।\n   👉 **उपचार:** सिंचाई के साथ 40-45 किग्रा यूरिया प्रति एकड़ दें या 2% यूरिया का पर्णीय छिड़काव करें।\n\n3. **जिंक की कमी:** पत्तियों के बीच में चौड़ी सफेद या पीली पट्टी बनती है।\n   👉 **उपचार:** जिंक सल्फेट 21% (10 किग्रा प्रति एकड़) कूंड़ों में डालें या चिलेटेड जिंक 0.2% का छिड़काव करें।\n\n4. **जलभराव या पोक्का बोइंग:** खेत में पानी भरा हो तो तुरंत निकालें और फफूंदनाशक कॉपर ऑक्सीक्लोराइड का छिड़काव करें।`
        : `🍃 **Causes and Treatment for Yellowing of Sugarcane Leaves:**\n\n1. **Iron Deficiency (Chlorosis):** New top leaves turn yellow/white with veins staying green.\n   👉 **Remedy:** Spray Ferrous Sulphate (1%) + Citric Acid (0.1%) twice at 10-day intervals.\n\n2. **Nitrogen Deficiency:** Lower older leaves turn pale yellow with stunted stalks.\n   👉 **Remedy:** Top-dress 45 kg Urea/acre followed by light irrigation, or 2% Urea foliar spray.\n\n3. **Zinc Deficiency:** Broad white/yellow chlorotic band along leaf midrib.\n   👉 **Remedy:** Apply Zinc Sulphate 21% @ 10 kg/acre in furrows or 0.2% Chelated Zinc foliar spray.\n\n4. **Waterlogging / Root Suffocation:** Ensure immediate drainage; stagnation restricts iron uptake.`;
    }

    return isHi
      ? `🧪 **गन्ने के लिए खाद एवं उर्वरक (NPK) का संपूर्ण शेड्यूल:**\n\n${AGRONOMY_KNOWLEDGE.fertilizer.npkSummaryHi}\n\n**डोज एवं समय सारणी:**\n${AGRONOMY_KNOWLEDGE.fertilizer.scheduleHi.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
      : `🧪 **Sugarcane Fertilizer & Nutrient Management Schedule:**\n\n${AGRONOMY_KNOWLEDGE.fertilizer.npkSummaryEn}\n\n**Application Schedule:**\n${AGRONOMY_KNOWLEDGE.fertilizer.scheduleEn.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
  }

  // 5. Irrigation & Water Management
  if (
    q.includes("irrigation") ||
    q.includes("sinchai") ||
    q.includes("pani") ||
    q.includes("water") ||
    q.includes("drip") ||
    q.includes("jal")
  ) {
    const { weather } = context;
    const weatherNotice = weather
      ? (isHi
          ? `\n\n🌦️ **वर्तमान मौसम सूचना:** तापमान ${weather.temperature}°C, बारिश पूर्वानुमान ${weather.rainMm || 0} मिमी।`
          : `\n\n🌦️ **Live Weather Context:** Temperature ${weather.temperature}°C, Forecasted Rain ${weather.rainMm || 0} mm.`)
      : "";

    return isHi
      ? `💧 **गन्ने में सिंचाई प्रबंधन (Irrigation Guidelines):**\n\n1. **सबसे महत्वपूर्ण चरण (फॉर्मेटिव स्टेज - 60 से 120 दिन):** जब कल्ले फूट रहे हों, तो नमी की कमी से गन्ने की पैदावार में 40% तक गिरावट आ सकती है।\n2. **गर्मियों में अंतराल:** हर 8-12 दिन के अंतराल पर सिंचाई अवश्य करें।\n3. **सर्दियों में अंतराल:** 20-25 दिन के अंतराल पर सिंचाई करें।\n4. **ट्रेंच या टपक (Drip) सिंचाई:** ट्रेंच में एक नाली छोड़कर (Alternate furrow) सिंचाई करने से 35% पानी बचता है, जबकि ड्रिप सिंचाई 40-50% पानी बचाती है और पैदावार 20% बढ़ाती है।\n5. **जल निकासी:** भारी बारिश के दौरान खेत में 24 घंटे से अधिक पानी न रुकने दें।${weatherNotice}`
      : `💧 **Sugarcane Irrigation Guidelines:**\n\n1. **Critical Phase (Formative / Tillering Stage - 60 to 120 Days):** Water deficit at tillering can slash cane yield by up to 40%.\n2. **Summer Intervals:** Irrigate every 8-12 days during peak summer heat.\n3. **Winter Intervals:** Irrigate every 20-25 days during cool months.\n4. **Water-Saving Drip & Alternate Furrow:** Alternate furrow saves ~35% water; drip fertigation saves 45-50% water while boosting tonnage by 15-20%.\n5. **Drainage:** Sugarcane is sensitive to prolonged waterlogging; drain excess rainwater promptly.${weatherNotice}`;
  }

  // 6. Varieties / Kism / Seed Selection
  if (
    q.includes("variety") ||
    q.includes("varieties") ||
    q.includes("kism") ||
    q.includes("kisme") ||
    q.includes("beej") ||
    q.includes("seed") ||
    q.includes("co 0238") ||
    q.includes("co 0118") ||
    q.includes("co 15023")
  ) {
    return isHi
      ? `🌱 **गन्ने की प्रमुख उन्नत एवं रोगरोधी किस्में (Varieties):**\n\n${AGRONOMY_KNOWLEDGE.varieties
          .map((v) => `• **${v.name} (${v.type}):** ${v.featuresHi}`)
          .join("\n\n")}\n\n💡 **विशेष सलाह:** Co 0238 में लाल सड़न फैलने के कारण वैज्ञानिकों की सिफारिश है कि किसान Co 0118 और Co 15023 को प्राथमिकता दें।`
      : `🌱 **Recommended Sugarcane Varieties & Seed Selection:**\n\n${AGRONOMY_KNOWLEDGE.varieties
          .map((v) => `• **${v.name} (${v.type}):** ${v.featuresEn}`)
          .join("\n\n")}\n\n💡 **Agronomic Alert:** Co 0238 is heavily susceptible to Red Rot in North India. Replace it with certified Co 0118 or Co 15023.`;
  }

  // 7. Sowing, Planting, Trench Method, Seed Rate
  if (
    q.includes("sowing") ||
    q.includes("buwai") ||
    q.includes("bona") ||
    q.includes("trench") ||
    q.includes("ring pit") ||
    q.includes("lagana") ||
    q.includes("tarika") ||
    q.includes("vidhi")
  ) {
    return isHi
      ? `🌾 **गन्ना बुवाई का सही समय, बीज दर एवं ट्रेंच विधि:**\n\n1. **बुवाई का सही समय:**\n${AGRONOMY_KNOWLEDGE.sowing.seasonsHi}\n\n2. **बीज दर एवं शोधन:**\n${AGRONOMY_KNOWLEDGE.sowing.seedRateHi}\n• बुवाई से पहले बीजों को कार्बेंडाजिम 0.1% (1 ग्राम/लीटर) के घोल में 15 मिनट अवश्य शोधित करें।\n\n3. **ट्रेंच विधि (Trench Method):**\n${AGRONOMY_KNOWLEDGE.sowing.trenchMethodHi}`
      : `🌾 **Sugarcane Sowing Time, Seed Rate & Trench Planting Method:**\n\n1. **Planting Seasons:**\n${AGRONOMY_KNOWLEDGE.sowing.seasonsEn}\n\n2. **Seed Rate & Treatment:**\n${AGRONOMY_KNOWLEDGE.sowing.seedRateEn}\n• Always soak two-bud setts in Carbendazim 0.1% (1g/L) for 15 minutes before placing in furrows.\n\n3. **Trench Method:**\n${AGRONOMY_KNOWLEDGE.sowing.trenchMethodEn}`;
  }

  // 8. Cultural operations: Earthing up, Propping, Weeding, Mulching, Intercropping, Ratoon
  if (
    q.includes("mitti") ||
    q.includes("earthing") ||
    q.includes("bandhai") ||
    q.includes("propping") ||
    q.includes("tying") ||
    q.includes("girna") ||
    q.includes("lodging") ||
    q.includes("weed") ||
    q.includes("kharpatwar") ||
    q.includes("mulch") ||
    q.includes("patti") ||
    q.includes("intercrop") ||
    q.includes("sahfasli") ||
    q.includes("pedi") ||
    q.includes("ratoon")
  ) {
    let replyParts = [];
    if (q.includes("mitti") || q.includes("earthing")) {
      replyParts.push(isHi ? AGRONOMY_KNOWLEDGE.culturalOperations.earthingUpHi : AGRONOMY_KNOWLEDGE.culturalOperations.earthingUpEn);
    }
    if (q.includes("bandhai") || q.includes("propping") || q.includes("girna") || q.includes("tying")) {
      replyParts.push(isHi ? AGRONOMY_KNOWLEDGE.culturalOperations.proppingHi : AGRONOMY_KNOWLEDGE.culturalOperations.proppingEn);
    }
    if (q.includes("weed") || q.includes("kharpatwar")) {
      replyParts.push(isHi ? AGRONOMY_KNOWLEDGE.culturalOperations.weedControlHi : AGRONOMY_KNOWLEDGE.culturalOperations.weedControlEn);
    }
    if (q.includes("mulch") || q.includes("patti")) {
      replyParts.push(isHi ? AGRONOMY_KNOWLEDGE.culturalOperations.trashMulchingHi : AGRONOMY_KNOWLEDGE.culturalOperations.trashMulchingEn);
    }
    if (q.includes("intercrop") || q.includes("sahfasli")) {
      replyParts.push(isHi ? AGRONOMY_KNOWLEDGE.culturalOperations.intercroppingHi : AGRONOMY_KNOWLEDGE.culturalOperations.intercroppingEn);
    }
    if (q.includes("pedi") || q.includes("ratoon")) {
      replyParts.push(isHi ? AGRONOMY_KNOWLEDGE.culturalOperations.ratoonHi : AGRONOMY_KNOWLEDGE.culturalOperations.ratoonEn);
    }

    if (replyParts.length > 0) {
      return (isHi ? "🚜 **गन्ना कृषि कार्य प्रबंधन सलाह:**\n\n" : "🚜 **Agronomic Field Operations Advisory:**\n\n") + replyParts.join("\n\n");
    }
  }

  // 9. Yield Boosters & General Care
  if (
    q.includes("yield") ||
    q.includes("paidawar") ||
    q.includes("wajan") ||
    q.includes("upaj") ||
    q.includes("badhaye") ||
    q.includes("increase")
  ) {
    return isHi
      ? `📈 **गन्ने की पैदावार (Tonnage & Yield) बढ़ाने के 5 वैज्ञानिक सूत्र:**\n\n1. **ट्रेंच विधि से 4 फीट दूरी पर बुवाई:** धूप और हवा मिलने से कल्ले अधिक निकलते हैं और गन्ना मोटा होता है।\n2. **बीज शोधन अवश्य करें:** कार्बेंडाजिम 0.1% + इमिडाक्लोप्रिड से शोधन करने से 100% जमाव होता है और दीमक/रोग नहीं लगते।\n3. **संतुलित उर्वरक + जिंक:** बुवाई पर डीएपी (60 किग्रा), पोटाश (40 किग्रा) और जिंक सल्फेट (10 किग्रा) जरूर दें। यूरिया को 2-3 किस्तों में ही डालें।\n4. **समय पर मिट्टी चढ़ाना व बंधाई:** मई-जून में मिट्टी चढ़ाएं और अगस्त में बंधाई करें ताकि गन्ना गिरे नहीं।\n5. **कंसुआ व चोटी बेधक से सुरक्षा:** 35-45 दिन पर कोराजन (Coragen 150 ml/एकड़) की ड्रेंचिंग करने से तने सुरक्षित रहते हैं।`
      : `📈 **Top 5 Scientific Pillars to Maximize Sugarcane Yield:**\n\n1. **Trench Planting at 4 to 4.5 Feet Spacing:** Improves solar interception, aeration, tiller count, and stalk girth.\n2. **Mandatory Sett Treatment:** Dip in Carbendazim 0.1% + Imidacloprid to ensure 90%+ germination and ward off early pests.\n3. **Balanced NPK + Micronutrients:** Basal application of DAP (60 kg) + MOP (40 kg) + Zinc Sulphate (10 kg/acre). Split Nitrogen into 3 timely doses.\n4. **Earthing Up & Propping:** Earth-up in May-June and prop canes in August to prevent lodging and sugar degradation.\n5. **Timely Borer Defense:** Drench Chlorantraniliprole (Coragen 150 ml/acre) at 35-45 days to protect shoot development.`;
  }

  // 10. Default General Sugarcane Assistant Response
  return isHi
    ? `नमस्ते! मैं आपका एग्रोकेन 360 कृषि सलाहकार हूँ।\n\nआप मुझसे बेझिझक किसी भी विषय पर पूछ सकते हैं, जैसे:\n• **खाद व उर्वरक:** NPK की मात्रा, यूरिया कब डालें, पत्तियां पीली पड़ने का इलाज\n• **कीट व रोग:** लाल सड़न (Red Rot), पोक्का बोइंग, कंसुआ (Shoot Borer), चोटी बेधक, दीमक की दवा\n• **बुवाई व किस्में:** Co 0118, Co 15023, ट्रेंच विधि, बीज दर और बीज शोधन\n• **सिंचाई व देखरेख:** सिंचाई का समय, मिट्टी चढ़ाना, बंधाई, पेड़ी गन्ना (Ratoon) प्रबंधन\n• **पर्ची व भुगतान:** आपकी ताज़ा सप्लाई टिकट स्थिति, भुगतान बकाया और मिल पेराई सत्र\n\nकृपया अपना प्रश्न नीचे टाइप करें!`
    : `Hello! I am your AgroCane 360 Agronomy & Mill Assistant.\n\nYou can ask me any question directly, such as:\n• **Fertilizers & Nutrition:** NPK dosage, urea split schedules, treating yellowing leaves\n• **Diseases & Pests:** Red Rot prevention, Pokkah Boeng spray, Shoot Borer, Top Borer, Termite control\n• **Planting & Varieties:** Co 0118, Co 15023, Trench planting method, Sett treatment\n• **Irrigation & Care:** Formative phase watering, earthing up, cane propping, ratoon management\n• **Tickets & Payments:** Verified supply ticket status, mill payment balances, and season opening dates\n\nPlease type your specific question below!`;
};

// ============================================================================
// 5. MASTER ASSISTANT FUNCTION (GEMINI + OFFLINE REASONING)
// ============================================================================

/**
 * Generate intelligent, context-grounded response for text and voice chat
 */
const generateAssistantResponse = async ({ query, language = "en", context = {}, apiKey }) => {
  if (!query || !query.trim()) {
    return {
      reply: language === "hi" ? "कृपया अपना सवाल पूछें।" : "Please ask your question.",
      source: "fallback",
    };
  }

  const detectedLang = detectLanguage(query, language);
  const isHi = detectedLang === "hi";
  const parsed = analyzeQuery(query);

  // Prepare concise context string for the AI
  let liveContextStr = "";
  if (context.user) {
    liveContextStr += `Farmer Name: ${context.user.name || "N/A"}, Phone: ${context.user.phone || "N/A"}\n`;
  }
  if (context.tickets && context.tickets.length > 0) {
    const t = context.tickets[0];
    liveContextStr += `Farmer Latest Ticket: Number ${t.ticketNumber}, Status: ${t.status}, Allocated: ${t.allocatedQuantityTonnes}T, Supplied: ${t.suppliedQuantityTonnes}T\n`;
  }
  if (context.paymentSummary) {
    liveContextStr += `Farmer Payments: Total Paid ₹${context.paymentSummary.totalPaid || 0}, Outstanding Balance ₹${context.paymentSummary.outstanding || 0}\n`;
  }
  if (context.season) {
    liveContextStr += `Crushing Season: ${context.season.name}, Status: ${context.season.status}, Start Date: ${context.season.confirmedStartDate || context.season.tentativeStartDate || "TBD"}\n`;
  }
  if (context.weather) {
    liveContextStr += `Current Weather: Temp ${context.weather.temperature}°C, Rain forecast ${context.weather.rainMm || 0}mm\n`;
  }

  // 1. Attempt OpenAI (GPT-4o-mini / GPT-4o) if OpenAI Key exists
  const openAiKey = (context.provider === "openai" ? apiKey : null) || apiKey || process.env.OPENAI_API_KEY;
  const isOpenAIChosen = (context.provider === "openai" || process.env.AI_PROVIDER === "openai") && openAiKey;

  const systemInstruction = `You are AgroCane AI, an expert agricultural scientist and sugarcane agronomist advising sugarcane farmers in India.
Answer the user's specific question directly, accurately, and thoroughly.
Respond in ${isHi ? "Hindi (हिन्दी / clean Hinglish where appropriate for technical terms like NPK, Coragen, Red Rot)" : "English"}.
If the user asks about tickets, payments, weather, or season, use the provided live context data.
For agronomy, diseases, pests, fertilizers, or planting questions: provide concrete steps, chemical names (e.g. Chlorantraniliprole/Coragen, Carbendazim), exact dosages (per acre or liter), and practical timing.
Format with clean bullet points and bold headings. Be polite, encouraging, and farmer-friendly.

Live Farmer Account Context:
${liveContextStr || "No specific farmer record loaded (general agricultural advisory mode)."}`;

  if (isOpenAIChosen || (openAiKey && !process.env.AI_API_KEY && !process.env.GEMINI_API_KEY)) {
    try {
      const gptReply = await callOpenAIChat({
        prompt: query,
        systemPrompt: systemInstruction,
        apiKey: openAiKey,
      });

      if (gptReply && gptReply.trim().length > 20) {
        return {
          reply: gptReply,
          source: "openai",
          detectedLang,
        };
      }
    } catch (err) {
      console.warn("[OpenAI API Error, falling back]:", err.message);
    }
  }

  // 2. Attempt Google Gemini Call if Gemini API Key exists
  const activeGeminiKey = (context.provider === "gemini" ? apiKey : null) || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (activeGeminiKey) {
    try {
      const geminiReply = await callGeminiChat({
        prompt: query,
        systemPrompt: systemInstruction,
        apiKey: activeGeminiKey,
      });

      if (geminiReply && geminiReply.trim().length > 20) {
        return {
          reply: geminiReply,
          source: "gemini",
          detectedLang,
        };
      }
    } catch (err) {
      console.warn("[Gemini API Error, falling back to Agronomy Engine]:", err.message);
    }
  }

  // Fallback to offline comprehensive Agronomy Engine
  const offlineReply = generateKnowledgeResponse(parsed, context, isHi);
  return {
    reply: offlineReply,
    source: "agronomy_engine",
    detectedLang,
  };
};

/**
 * Backward compatibility: detectVoiceIntent
 */
const detectVoiceIntent = (text = "") => {
  const t = text.toLowerCase();
  if (t.includes("ticket") || t.includes("parchi") || t.includes("purji") || t.includes("chit")) {
    return "TICKET_STATUS";
  }
  if (t.includes("payment") || t.includes("paisa") || t.includes("rupaye") || t.includes("balance") || t.includes("bhugtan")) {
    return "PAYMENT_STATUS";
  }
  if (t.includes("season") || t.includes("crushing") || t.includes("mill") || t.includes("pehrai") || t.includes("chalu")) {
    return "SEASON_DATES";
  }
  if (t.includes("irrigation") || t.includes("paani") || t.includes("sinchai") || t.includes("weather") || t.includes("mausam")) {
    return "IRRIGATION_WEATHER";
  }
  return "GENERAL_ADVISORY";
};

/**
 * Backward compatibility: generateGroundedVoiceResponse
 */
const generateGroundedVoiceResponse = (intent, context, language = "en") => {
  const isHi = language === "hi" || /[\u0900-\u097F]/.test(context.query || "");
  const parsed = analyzeQuery(context.query || "");
  return generateKnowledgeResponse(parsed, context, isHi);
};

module.exports = {
  generateAssistantResponse,
  detectVoiceIntent,
  generateGroundedVoiceResponse,
  callOpenAIVision,
  callOpenAIChat,
  callGeminiChat,
  callGeminiVision,
  detectLanguage,
  analyzeQuery,
  AGRONOMY_KNOWLEDGE,
};
