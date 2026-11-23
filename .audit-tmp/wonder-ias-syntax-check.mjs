export {};

    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    /* =========================================================================
       1. CONSTANTS, TRANSLATIONS & 10-STAGE JOURNEY
       ========================================================================= */
    const STAGES = [
      { id: 1, en: "Zero Level Foundation", hi: "शून्य स्तर नींव (Zero Foundation)", desc: "Basic concepts, terminology & exam orientation" },
      { id: 2, en: "NCERT Foundation", hi: "NCERT आधार (कक्षा 6-12)", desc: "Class 6–12 NCERT conceptual clarity" },
      { id: 3, en: "Basic Subject Knowledge", hi: "मूल विषय ज्ञान", desc: "Core GS subjects: Polity, History, Geo, Economy" },
      { id: 4, en: "Standard Books Level", hi: "मानक पुस्तकें (Standard Books)", desc: "Laxmikanth, Spectrum, Ramesh Singh, Shankar IAS" },
      { id: 5, en: "UPSC Prelims Level", hi: "UPSC प्रारंभिक परीक्षा स्तर", desc: "MCQ accuracy, elimination & CSAT qualification" },
      { id: 6, en: "UPSC Mains Level", hi: "UPSC मुख्य परीक्षा स्तर", desc: "GS Paper I–IV, Optional & Essay integration" },
      { id: 7, en: "Advanced Analytical", hi: "उन्नत विश्लेषणात्मक स्तर", desc: "Interlinking static syllabus with Current Affairs" },
      { id: 8, en: "Answer Writing Mastery", hi: "उत्तर लेखन दक्षता", desc: "Timed 10/15/20 mark answers & Case Studies" },
      { id: 9, en: "Interview Preparation", hi: "साक्षात्कार (Interview) तैयारी", desc: "DAF mastery, balanced opinion & mock board" },
      { id: 10, en: "Final Exam Simulation", hi: "अंतिम परीक्षा सिमुलेशन", desc: "Full-length UPSC/PCS exam temperament" }
    ];

    const UI_STRINGS = {
      en: {
        dashboard: "Dashboard", syllabus: "Syllabus & Notes", maps: "Maps & Mind Maps",
        currentAffairs: "Current Affairs", prelims: "Prelims, CSAT & Mocks",
        mains: "Mains & Essay", interview: "Interview Prep", mentor: "AI Personal Mentor",
        studyPlan: "Study Plan", admin: "Admin & Data",
        welcome: "Welcome back, Future Civil Servant",
        tagline: "YOUR JOURNEY FROM ZERO TO CIVIL SERVICES"
      },
      hi: {
        dashboard: "डैशबोर्ड", syllabus: "पाठ्यक्रम एवं नोट्स", maps: "मानचित्र एवं माइंड मैप",
        currentAffairs: "समसामयिकी (Current Affairs)", prelims: "प्रिलिम्स, CSAT एवं मॉक",
        mains: "मेन्स एवं निबंध (Essay)", interview: "साक्षात्कार तैयारी", mentor: "AI पर्सनल मेंटर",
        studyPlan: "अध्ययन योजना", admin: "एडमिन एवं डेटा",
        welcome: "स्वागत है, भावी लोक सेवक",
        tagline: "शून्य से सिविल सेवा तक आपकी यात्रा"
      },
      bi: {
        dashboard: "Dashboard / डैशबोर्ड", syllabus: "Syllabus & Notes / पाठ्यक्रम", maps: "Maps & Mind Maps / मानचित्र",
        currentAffairs: "Current Affairs / समसामयिकी", prelims: "Prelims & CSAT / प्रिलिम्स",
        mains: "Mains & Essay / मुख्य परीक्षा", interview: "Interview / साक्षात्कार", mentor: "AI Mentor / AI गुरु",
        studyPlan: "Study Plan / अध्ययन योजना", admin: "Admin & Data / डेटा",
        welcome: "Welcome, Future IAS / स्वागत है",
        tagline: "ZERO TO CIVIL SERVICES • शून्य से सिविल सेवा तक"
      }
    };

    /* =========================================================================
       2. COMPLETE UPSC SYLLABUS DATABASE (ALL GS + ETHICS + 10 OPTIONALS)
       ========================================================================= */
    const INITIAL_SYLLABUS = [
      // HISTORY
      {
        id: "his-anc-1", subject: "History", category: "Ancient India", paper: "Prelims & GS-I",
        title: "Indus Valley Civilization (IVC)", hiTitle: "सिंधु घाटी सभ्यता (हड़प्पा सभ्यता)",
        level: "Stage 2: NCERT", estTime: "45 min", prereq: "Prehistoric India",
        quickNotes: "Bronze Age urban civilization (c. 2600–1900 BCE). Known for grid-pattern town planning, Great Bath (Mohenjodaro), dockyard (Lothal), standardized weights, and undeciphered pictographic script.",
        detailedNotes: "The Harappan Civilization flourished in the northwestern Indian subcontinent. Cities were typically divided into an elevated Citadel (western) and Lower Town (eastern), with Dholavira uniquely having three divisions and advanced water conservation. Baked bricks in a 4:2:1 ratio, covered drainage systems, and granaries reflect strong municipal administration. Trade extended to Mesopotamia (Meluhha). Religion featured Pashupati seal, Mother Goddess, and tree worship, with no clear evidence of monumental temples.",
        hiNotes: "सिंधु घाटी सभ्यता (लगभग 2600–1900 ईसा पूर्व) एक कांस्य युगीन नगरीय सभ्यता थी। इसकी प्रमुख विशेषताएँ ग्रिड प्रणाली पर आधारित नगर नियोजन, जल निकासी व्यवस्था, मोहनजोदड़ो का विशाल स्नानागार, लोथल का गोदीवाड़ा (Dockyard) और धोलावीरा का जल प्रबंधन हैं। मेसोपोटामिया के अभिलेखों में इसे 'मेलुहा' कहा गया है।",
        keyFacts: ["Lothal: Artificial dockyard & bead-making", "Dholavira: UNESCO World Heritage Site (2021), water reservoirs", "Kalibangan: Ploughed field & fire altars", "No iron or horse-centered warfare evidence"],
        pyqConn: "UPSC Prelims 2019 (Harappan Sites), Prelims 2021 (Dholavira water management), Mains GS-I 2014 (Urban planning inputs for present urbanization)."
      },
      {
        id: "his-anc-2", subject: "History", category: "Ancient India", paper: "Prelims & GS-I",
        title: "Buddhism, Jainism & Mauryan Empire", hiTitle: "बौद्ध धर्म, जैन धर्म एवं मौर्य साम्राज्य",
        level: "Stage 3: Basic", estTime: "60 min", prereq: "Vedic Civilization & Mahajanapadas",
        quickNotes: "6th Century BCE heterodox sects challenging Vedic ritualism. Mauryan Empire (322–185 BCE) founded by Chandragupta Maurya; Ashoka's Dhamma propagated via Rock & Pillar Edicts.",
        detailedNotes: "Gautama Buddha taught Four Noble Truths and the Eightfold Path (Ashtangika Marga), emphasizing Madhyama Marga (Middle Path). Vardhamana Mahavira, the 24th Tirthankara, emphasized Ahimsa, Anekantavada (non-absolutism), and Syadvada. Politically, Magadha rose to supremacy culminating in the Mauryan Empire. Kautilya's Arthashastra details centralized statecraft, while Ashoka's Kalinga War (261 BCE) led to his policy of Dhamma-Vijaya inscribed in Prakrit (Brahmi/Kharosthi scripts).",
        hiNotes: "छठी शताब्दी ईसा पूर्व में बौद्ध और जैन धर्म का उदय हुआ। बुद्ध ने चार आर्य सत्य और अष्टांगिक मार्ग दिया, जबकि महावीर ने अहिंसा और अनेकान्तवाद पर बल दिया। मौर्य साम्राज्य की स्थापना चंद्रगुप्त मौर्य ने की और अशोक ने कलिंग युद्ध (261 ई.पू.) के बाद 'धम्म विजय' की नीति अपनाई।",
        keyFacts: ["4 Buddhist Councils: Rajagriha, Vaishali, Pataliputra, Kashmir", "Ashoka's Major Rock Edict XIII mentions Kalinga War", "James Prinsep deciphered Brahmi script in 1837"],
        pyqConn: "UPSC Prelims 2020 (Paramitas & Ashokan Edicts), Prelims 2023 (Souls in Jainism)."
      },
      {
        id: "his-med-1", subject: "History", category: "Medieval India", paper: "Prelims & GS-I",
        title: "Delhi Sultanate, Vijayanagara & Bhakti-Sufi Movements", hiTitle: "दिल्ली सल्तनत, विजयनगर एवं भक्ति-सूफी आंदोलन",
        level: "Stage 3: Basic", estTime: "55 min", prereq: "Early Medieval India",
        quickNotes: "Five dynasties of Delhi Sultanate (1206–1526) introduced Iqta system. Vijayanagara Empire (1336) peaked under Krishnadevaraya. Bhakti & Sufi saints promoted syncretic devotion.",
        detailedNotes: "Alauddin Khilji introduced market reforms, Dagh (branding of horses), and Chehra (descriptive roll). Muhammad bin Tughlaq experimented with token currency and capital shift to Daulatabad. In South India, Harihara and Bukka founded Vijayanagara (Hampi), famed for Nayankara system and Vittala Temple. Simultaneously, Nirguna Bhakti (Kabir, Guru Nanak), Saguna Bhakti (Mirabai, Tulsidas, Chaitanya), and Chishti Sufis (Nizamuddin Auliya) bridged social divides.",
        hiNotes: "दिल्ली सल्तनत (1206–1526) में इक्ता प्रणाली (Iqta System) और अलाउद्दीन खिलजी के बाजार सुधार प्रमुख हैं। दक्षिण में विजयनगर साम्राज्य (कृष्णदेवराय) कला व प्रशासन का केंद्र था। भक्ति (कबीर, नानक) और सूफी (चिश्ती सिलसिला) संतों ने सामाजिक समरसता को बढ़ावा दिया।",
        keyFacts: ["Amuktamalyada written in Telugu by Krishnadevaraya", "Ibn Battuta visited during Muhammad bin Tughlaq", "Silsilas: Chishti, Suhrawardi, Naqshbandi"],
        pyqConn: "UPSC Prelims 2019 (Mian Tansen & Bhakti), Prelims 2021 (Vijayanagara taxation & travelers)."
      },
      {
        id: "his-mod-1", subject: "History", category: "Modern India", paper: "Prelims & GS-I",
        title: "Revolt of 1857, INC & Gandhian Era", hiTitle: "1857 का विद्रोह, भारतीय राष्ट्रीय कांग्रेस एवं गांधी युग",
        level: "Stage 4: Standard Books", estTime: "75 min", prereq: "British Expansion & Economic Impact",
        quickNotes: "1857 Revolt ended East India Company rule (GOI Act 1858). INC founded in 1885. Gandhian mass movements: Non-Cooperation (1920), Civil Disobedience (1930), Quit India (1942).",
        detailedNotes: "Economic drain (Dadabhai Naoroji), land revenue settlements (Permanent, Ryotwari, Mahalwari), and Doctrine of Lapse triggered the 1857 uprising. Post-1885, the Indian National Movement evolved through Moderate constitutionalism, Extremist Swadeshi (1905), and Gandhian Satyagraha (Champaran 1917, Kheda, Ahmedabad 1918). Constitutional milestones include GOI Acts of 1909, 1919 (Dyarchy), and 1935 (Provincial Autonomy), culminating in the Indian Independence Act 1947.",
        hiNotes: "1857 के विद्रोह के बाद भारत का शासन सीधे ब्रिटिश क्राउन के अधीन आ गया (1858 अधिनियम)। 1885 में कांग्रेस की स्थापना हुई। गांधीजी ने चंपारण (1917), असहयोग (1920), सविनय अवज्ञा (1930) और भारत छोड़ो आंदोलन (1942) के माध्यम से राष्ट्रीय आंदोलन को जन-आंदोलन बनाया।",
        keyFacts: ["Champaran (1917): First Civil Disobedience", "Dandi March: March 12 – April 6, 1930", "Quit India Resolution: August 8, 1942 (Gowalia Tank)"],
        pyqConn: "UPSC Prelims 2021 (Quit India & Gandhi-Irwin Pact), Mains GS-I 2019 (Many voices in 1920s freedom struggle)."
      },
      {
        id: "his-wld-1", subject: "History", category: "World History", paper: "GS-I (Mains)",
        title: "Industrial Revolution, World Wars & Cold War", hiTitle: "औद्योगिक क्रांति, विश्व युद्ध एवं शीत युद्ध",
        level: "Stage 6: Mains", estTime: "50 min", prereq: "Modern India",
        quickNotes: "Industrial Revolution began in Britain (18th c.), fueling colonialism. WWI (1914–18) & WWII (1939–45) reshaped global order, leading to UN, decolonization, and Cold War bipolarity.",
        detailedNotes: "Mechanization in textiles and steam power shifted agrarian economies to industrial capitalism, driving European imperial scramble in Asia and Africa. The Treaty of Versailles (1919) sowed seeds of Fascism and Nazism. Post-WWII, Afro-Asian decolonization gained momentum alongside Non-Aligned Movement (NAM) led by India, Egypt, and Yugoslavia during US–USSR Cold War rivalry.",
        hiNotes: "औद्योगिक क्रांति की शुरुआत 18वीं सदी में ब्रिटेन से हुई, जिसने उपनिवेशवाद को बढ़ावा दिया। प्रथम एवं द्वितीय विश्व युद्ध के बाद संयुक्त राष्ट्र (UN) की स्थापना, उपनिवेशवाद का अंत और अमेरिका-सोवियत संघ के बीच शीत युद्ध (Cold War) तथा गुटनिरपेक्ष आंदोलन (NAM) का उदय हुआ।",
        keyFacts: ["Treaty of Versailles (1919)", "Bretton Woods Conference (1944): IMF & World Bank", "Bandung Conference (1955) -> NAM (1961)"],
        pyqConn: "UPSC Mains GS-I 2015 (Why Industrial Revolution first occurred in England)."
      },

      // GEOGRAPHY
      {
        id: "geo-phy-1", subject: "Geography", category: "Physical Geography", paper: "Prelims & GS-I",
        title: "Plate Tectonics, Atmosphere & Indian Monsoon", hiTitle: "प्लेट विवर्तनिकी, वायुमंडल एवं भारतीय मानसून",
        level: "Stage 2: NCERT", estTime: "60 min", prereq: "Earth's Interior & Latitudes",
        quickNotes: "Lithospheric plates move over the asthenosphere causing earthquakes, volcanoes, and fold mountains. Indian Monsoon is driven by differential heating, ITCZ shift, Jet Streams, ENSO & IOD.",
        detailedNotes: "Convergent boundaries (Indian–Eurasian plates) formed the Himalayas. Atmospheric circulation involves Coriolis force, Trade Winds, Westerlies, and Subtropical Jet Streams. Indian Southwest Monsoon (June–Sept) arrives in two branches (Arabian Sea & Bay of Bengal); El Niño generally weakens it while positive Indian Ocean Dipole (IOD) strengthens rainfall.",
        hiNotes: "प्लेट विवर्तनिकी (Plate Tectonics) सिद्धांत के अनुसार स्थलमंडलीय प्लेटें एस्थेनोस्फीयर पर गति करती हैं, जिससे हिमालय जैसे वलित पर्वत, भूकंप और ज्वालामुखी बनते हैं। भारतीय मानसून ITCZ के खिसकाव, जेट स्ट्रीम, अल-नीनो (El Niño) और हिंद महासागर द्विध्रुव (IOD) से प्रभावित होता है।",
        keyFacts: ["Troposphere contains ~75% of atmospheric mass & all weather", "Positive IOD boosts Indian Monsoon", "Western Disturbances bring winter rain to NW India"],
        pyqConn: "UPSC Prelims 2017 (Indian Ocean Dipole), Mains GS-I 2022 (Troposphere & weather)."
      },
      {
        id: "geo-ind-1", subject: "Geography", category: "Indian Geography", paper: "Prelims & GS-I",
        title: "Himalayan & Peninsular Drainage Systems", hiTitle: "हिमालयी एवं प्रायद्वीपीय अपवाह तंत्र (नदियाँ)",
        level: "Stage 3: Basic", estTime: "55 min", prereq: "Physical Features of India",
        quickNotes: "Himalayan rivers (Indus, Ganga, Brahmaputra) are perennial & antecedent. Peninsular rivers (Godavari, Krishna, Kaveri—east-flowing; Narmada, Tapi—west-flowing rift valleys) are seasonal.",
        detailedNotes: "The Ganga rises at Gangotri (Bhagirathi) and meets Alaknanda at Devprayag. Brahmaputra enters India as Dihang in Arunachal Pradesh. Godavari is 'Dakshin Ganga'. Narmada and Tapi flow westward through structural rift valleys between Vindhya and Satpura ranges and form estuaries rather than deltas.",
        hiNotes: "हिमालयी नदियाँ (सिंधु, गंगा, ब्रह्मपुत्र) बारहमासी होती हैं, जबकि प्रायद्वीपीय नदियाँ मौसमी होती हैं। नर्मदा और तापी भ्रंश घाटी (Rift Valley) से बहकर अरब सागर में ज्वारनदमुख (Estuary) बनाती हैं, जबकि गोदावरी, कृष्णा और कावेरी बंगाल की खाड़ी में डेल्टा बनाती हैं।",
        keyFacts: ["Devprayag = Bhagirathi + Alaknanda", "Narmada & Tapi form estuaries", "Godavari is longest peninsular river (1,465 km)"],
        pyqConn: "UPSC Prelims 2021 (Indus River system tributaries), Prelims 2023 (Jhelum & Wular Lake)."
      },

      // INDIAN POLITY
      {
        id: "pol-fnd-1", subject: "Polity", category: "Constitutional Framework", paper: "Prelims & GS-II",
        title: "Preamble, Fundamental Rights, DPSP & Fundamental Duties", hiTitle: "प्रस्तावना, मौलिक अधिकार, नीति निदेशक तत्व एवं मूल कर्तव्य",
        level: "Stage 3: Basic", estTime: "70 min", prereq: "Constituent Assembly",
        quickNotes: "Preamble declares India Sovereign, Socialist, Secular, Democratic Republic. Part III (Art 12–35) Fundamental Rights are justiciable; Part IV (Art 36–51) DPSPs are non-justiciable; Part IVA (Art 51A) Fundamental Duties.",
        detailedNotes: "Kesavananda Bharati Case (1973) established the Basic Structure Doctrine—Parliament can amend the Constitution under Art 368 without destroying its basic features. 42nd Amendment (1976) added Socialist, Secular, Integrity to Preamble and 10 Fundamental Duties (Swaran Singh Committee). Art 32 (Constitutional Remedies) was called the 'heart and soul' of the Constitution by Dr. B.R. Ambedkar.",
        hiNotes: "प्रस्तावना संविधान का सार है। भाग III (अनुच्छेद 12–35) में मौलिक अधिकार न्याययोग्य (Justiciable) हैं, जबकि भाग IV (अनुच्छेद 36–51) के नीति निदेशक तत्व (DPSP) गैर-न्याययोग्य हैं। केशवानंद भारती वाद (1973) में 'मूल ढांचा सिद्धांत' (Basic Structure Doctrine) प्रतिपादित किया गया।",
        keyFacts: ["Art 32: 5 Writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto)", "Art 21: Right to Life & Personal Liberty (Maneka Gandhi 1978)", "86th Amendment (2002): Art 21A Right to Education"],
        pyqConn: "UPSC Prelims 2020 (Preamble & Legal Effect), Prelims 2022 (Writs & Mandamus)."
      },
      {
        id: "pol-adv-1", subject: "Polity", category: "Union & Federalism", paper: "Prelims & GS-II",
        title: "Parliament, Judiciary, Federalism & Constitutional Bodies", hiTitle: "संसद, न्यायपालिका, संघवाद एवं संवैधानिक निकाय",
        level: "Stage 4: Standard Books", estTime: "80 min", prereq: "Fundamental Rights",
        quickNotes: "Parliament comprises President, Lok Sabha & Rajya Sabha. Money Bill (Art 110) needs Speaker's certification. Constitutional Bodies: ECI (Art 324), CAG (Art 148), UPSC (Art 315), Finance Commission (Art 280).",
        detailedNotes: "Indian federalism is 'quasi-federal' (K.C. Wheare) with Seventh Schedule dividing Union, State, and Concurrent Lists. Supreme Court exercises Judicial Review (Art 13, 32, 136). Panchayati Raj (73rd Amendment, 11th Schedule) and Municipalities (74th Amendment, 12th Schedule) institutionalized grassroots democracy.",
        hiNotes: "संसद में राष्ट्रपति, लोकसभा और राज्यसभा शामिल हैं। धन विधेयक (अनुच्छेद 110) केवल लोकसभा में पेश किया जा सकता है। निर्वाचन आयोग (अनुच्छेद 324), CAG (अनुच्छेद 148), UPSC (अनुच्छेद 315) और वित्त आयोग (अनुच्छेद 280) प्रमुख संवैधानिक निकाय हैं।",
        keyFacts: ["Joint Sitting (Art 108): Presided by Lok Sabha Speaker; NOT for Money/Constitutional Amendment Bills", "CAG is Guardian of Public Purse", "73rd & 74th Amendments (1992): Local Self-Government"],
        pyqConn: "UPSC Prelims 2023 (Finance Bill vs Money Bill), Mains GS-II 2021 (Cooperative Federalism)."
      },

      // INDIAN ECONOMY
      {
        id: "eco-fnd-1", subject: "Economy", category: "Macroeconomics & Banking", paper: "Prelims & GS-III",
        title: "GDP, Inflation, RBI Monetary Policy & Fiscal Policy", hiTitle: "GDP, मुद्रास्फीति, RBI की मौद्रिक नीति एवं राजकोषीय नीति",
        level: "Stage 2: NCERT", estTime: "65 min", prereq: "What is Economics & Money?",
        quickNotes: "GDP measures final goods/services produced within domestic territory. RBI's Monetary Policy Committee (MPC) targets CPI inflation at 4% ± 2% using Repo Rate, CRR, SLR, OMO. Fiscal policy manages Union Budget & FRBM targets.",
        detailedNotes: "Repo Rate is the rate at which RBI lends short-term funds to commercial banks against government securities. Tight (hawkish) monetary policy raises Repo Rate to curb demand-pull inflation. Fiscal Deficit = Total Expenditure – (Revenue Receipts + Non-debt Capital Receipts). GST (101st Amendment) unified indirect taxes into a destination-based consumption tax.",
        hiNotes: "सकल घरेलू उत्पाद (GDP) देश की सीमा के भीतर उत्पादित अंतिम वस्तुओं और सेवाओं का कुल मूल्य है। RBI की मौद्रिक नीति समिति (MPC) रेपो रेट, CRR और SLR के माध्यम से खुदरा मुद्रास्फीति (CPI) को 4% (±2%) के दायरे में नियंत्रित करती है। राजकोषीय नीति (Fiscal Policy) सरकार के बजट और कराधान से संबंधित है।",
        keyFacts: ["MPC has 6 members (3 RBI + 3 Govt), chaired by RBI Governor", "Base year for India GDP: 2011–12", "CPI (Combined) is published by NSO (MoSPI)"],
        pyqConn: "UPSC Prelims 2020 (Expansionist Monetary Policy), Prelims 2022 (Inflation-Indexed Bonds & RBI)."
      },
      {
        id: "eco-adv-1", subject: "Economy", category: "External Sector & Agriculture", paper: "Prelims & GS-III",
        title: "Balance of Payments, MSP, Inclusive Growth & Digital Economy", hiTitle: "भुगतान संतुलन (BoP), MSP, समावेशी विकास एवं डिजिटल अर्थव्यवस्था",
        level: "Stage 5: Prelims", estTime: "55 min", prereq: "Fiscal & Monetary Policy",
        quickNotes: "BoP has Current Account (Trade + Invisibles) and Capital Account (FDI, FPI, ECB). MSP is recommended by CACP and approved by CCEA for 22 mandated crops + FRP for sugarcane.",
        detailedNotes: "Foreign Direct Investment (FDI) brings long-term capital and technology, whereas Foreign Portfolio Investment (FPI) is volatile 'hot money'. Digital Public Infrastructure (DPI)—Aadhaar, UPI, DigiLocker—drives financial inclusion (JAM Trinity: Jan Dhan–Aadhaar–Mobile).",
        hiNotes: "भुगतान संतुलन (BoP) में चालू खाता (व्यापार एवं अदृश्य मदें) और पूंजी खाता (FDI, FPI) शामिल होते हैं। न्यूनतम समर्थन मूल्य (MSP) की सिफारिश CACP द्वारा की जाती है। आधार, UPI और जन-धन (JAM Trinity) ने भारत में वित्तीय समावेशन को क्रांतिकारी गति दी है।",
        keyFacts: ["CACP recommends MSP; CCEA gives final approval", "FDI = long-term equity/management; FPI = financial markets", "UPI developed by NPCI"],
        pyqConn: "UPSC Prelims 2020 (MSP crops), Mains GS-III 2023 (Digital Public Infrastructure)."
      },

      // ENVIRONMENT & ECOLOGY
      {
        id: "env-adv-1", subject: "Environment", category: "Biodiversity & Climate", paper: "Prelims & GS-III",
        title: "Biodiversity, Protected Areas, Ramsar Sites & Climate Conventions", hiTitle: "जैव विविधता, संरक्षित क्षेत्र, रामसर स्थल एवं जलवायु सम्मेलन",
        level: "Stage 4: Standard Books", estTime: "65 min", prereq: "Ecosystem & Food Web",
        quickNotes: "In-situ conservation: National Parks, Wildlife Sanctuaries, Biosphere Reserves (MAB). Key laws: Wildlife Protection Act 1972, EPA 1986. Global treaties: UNFCCC (Paris Agreement), CBD, Ramsar (Wetlands), CITES.",
        detailedNotes: "India hosts 4 Biodiversity Hotspots: Himalayas, Indo-Burma, Western Ghats, and Sundaland. Ramsar Convention (1971) protects wetlands of international importance (Montreux Record tracks threatened sites—Keoladeo & Loktak in India). Paris Agreement (COP21) aims to limit global warming well below 2°C, pursuing 1.5°C, via Nationally Determined Contributions (NDCs). India's Panchamrit targets Net-Zero by 2070.",
        hiNotes: "जैव विविधता संरक्षण के दो तरीके हैं: स्व-स्थाने (In-situ: राष्ट्रीय उद्यान, अभयारण्य, बायोस्फीयर रिजर्व) और बाह्य-स्थाने (Ex-situ)। वन्यजीव संरक्षण अधिनियम 1972 और पर्यावरण संरक्षण अधिनियम 1986 प्रमुख कानून हैं। भारत ने 2070 तक 'नेट-ज़ीरो' उत्सर्जन का लक्ष्य रखा है।",
        keyFacts: ["Montreux Record sites in India: Keoladeo NP (RJ) & Loktak Lake (MN)", "EPA 1986 enacted after Bhopal Gas Tragedy", "India Net-Zero target: 2070"],
        pyqConn: "UPSC Prelims 2022 (Climate Action Tracker & EPA), Prelims 2023 (Invasive Species & Ramsar)."
      },

      // SCIENCE & TECH
      {
        id: "sci-adv-1", subject: "Science & Tech", category: "Space, AI & Biotech", paper: "Prelims & GS-III",
        title: "ISRO Missions, AI, Quantum Computing & Biotechnology", hiTitle: "ISRO मिशन, कृत्रिम बुद्धिमत्ता (AI), क्वांटम एवं जैव प्रौद्योगिकी",
        level: "Stage 4: Standard Books", estTime: "55 min", prereq: "Basic Physics, Chemistry, Biology",
        quickNotes: "ISRO vehicles: PSLV (workhorse), GSLV Mk-II (cryogenic), LVM3 (Chandrayaan-3, Gaganyaan). Emerging tech: CRISPR-Cas9 gene editing, mRNA vaccines, National Quantum Mission, Generative AI.",
        detailedNotes: "Chandrayaan-3 achieved historic soft landing near the lunar South Pole (Shiv Shakti Point), while Aditya-L1 studies the Sun from Lagrange Point L1. CRISPR-Cas9 acts as molecular scissors for targeted DNA editing. Quantum computers use qubits exploiting superposition and entanglement for exponentially faster optimization and cryptography.",
        hiNotes: "ISRO के प्रमुख प्रक्षेपण यान PSLV, GSLV और LVM3 हैं। चंद्रयान-3 ने चंद्रमा के दक्षिणी ध्रुव पर सफल लैंडिंग की और आदित्य-L1 सूर्य का अध्ययन कर रहा है। CRISPR-Cas9 जीन एडिटिंग तकनीक है, जबकि राष्ट्रीय क्वांटम मिशन भारत को क्वांटम कंप्यूटिंग में अग्रणी बना रहा है।",
        keyFacts: ["LVM3 launched Chandrayaan-3", "Aditya-L1 placed in Halo Orbit around Sun-Earth L1", "CRISPR-Cas9: Bacterial defense mechanism adapted for gene editing"],
        pyqConn: "UPSC Prelims 2019 (Cas9 protein), Prelims 2022 (Qubits & Web 3.0)."
      },

      // ART & CULTURE
      {
        id: "art-1", subject: "Art & Culture", category: "Architecture & Performing Arts", paper: "Prelims & GS-I",
        title: "Temple Architecture (Nagara, Dravida, Vesara) & Classical Dances", hiTitle: "मंदिर वास्तुकला (नागर, द्रविड़, वेसर) एवं शास्त्रीय नृत्य",
        level: "Stage 3: Basic", estTime: "50 min", prereq: "Ancient & Medieval History",
        quickNotes: "Nagara (North: curvilinear Shikhara, Panchayatan), Dravida (South: pyramidal Vimana, Gopuram, compound wall), Vesara (Deccan hybrid: Chalukyas/Hoysalas). 8 Sangeet Natak Akademi Classical Dances.",
        detailedNotes: "Key Nagara sub-schools: Odisha (Konark, Lingaraja), Khajuraho (Chandelas), Solanki (Modhera Sun Temple). Dravida peaked under Pallavas (Mahabalipuram) and Cholas (Brihadisvara Temple, Thanjavur). The 8 classical dances are Bharatanatyam, Kathak, Kathakali, Kuchipudi, Odissi, Manipuri, Mohiniyattam, and Sattriya.",
        hiNotes: "भारतीय मंदिर स्थापत्य की तीन प्रमुख शैलियाँ हैं: नागर (उत्तर भारत—शिखर), द्रविड़ (दक्षिण भारत—विमान व गोपुरम), और वेसर (दक्कन—मिश्रित शैली)। संगीत नाटक अकादमी द्वारा मान्यता प्राप्त 8 शास्त्रीय नृत्य हैं: भरतनाट्यम, कथक, कथकली, कुचिपुड़ी, ओडिसी, मणिपुरी, मोहिनीअट्टम और सत्रिया।",
        keyFacts: ["Brihadisvara Temple: Rajaraja Chola I (1010 CE)", "Sattriya: Introduced by Srimanta Sankardeva in Assam", "Ajanta: Purely Buddhist; Ellora: Hindu, Buddhist & Jain"],
        pyqConn: "UPSC Prelims 2021 (Chausath Yogini Temple), Prelims 2022 (Somnath & Ramanuja)."
      },

      // INDIAN SOCIETY
      {
        id: "soc-1", subject: "Indian Society", category: "Social Issues", paper: "GS-I (Mains)",
        title: "Diversity, Women Empowerment, Urbanization & Demography", hiTitle: "विविधता, महिला सशक्तिकरण, शहरीकरण एवं जनसांख्यिकी",
        level: "Stage 6: Mains", estTime: "45 min", prereq: "NCERT Sociology",
        quickNotes: "India's demographic dividend requires skilling, health & female LFPR boost. Rapid urbanization demands transit-oriented planning, affordable housing, and climate-resilient Smart Cities.",
        detailedNotes: "Unity in diversity is sustained by constitutional secularism and linguistic federalism. Social empowerment initiatives include Beti Bachao Beti Padhao, Nari Shakti Vandan Adhiniyam (106th Amendment—33% women's reservation in Lok Sabha & State Assemblies), and PM-JANMAN for Particularly Vulnerable Tribal Groups (PVTGs).",
        hiNotes: "भारत की जनसांख्यिकीय लाभांश (Demographic Dividend) का लाभ उठाने के लिए शिक्षा, कौशल विकास और महिला श्रम बल भागीदारी आवश्यक है। 106वें संविधान संशोधन (नारी शक्ति वंदन अधिनियम) ने लोकसभा और विधानसभाओं में महिलाओं के लिए 33% आरक्षण का प्रावधान किया।",
        keyFacts: ["106th Constitutional Amendment Act: Women's Reservation", "75 PVTGs identified across India", "Urbanization ~35%+ and rising rapidly"],
        pyqConn: "UPSC Mains GS-I 2023 (Caste identity, Women's role, Urbanization challenges)."
      },

      // INTERNATIONAL RELATIONS
      {
        id: "ir-1", subject: "International Relations", category: "Foreign Policy & Orgs", paper: "Prelims & GS-II",
        title: "India's Foreign Policy, Neighbourhood First & Multilateral Orgs", hiTitle: "भारत की विदेश नीति, नेबरहुड फर्स्ट एवं अंतर्राष्ट्रीय संगठन",
        level: "Stage 5: Prelims & Mains", estTime: "60 min", prereq: "Indian Polity",
        quickNotes: "Guided by Strategic Autonomy, Neighbourhood First, Act East, and SAGAR (Indian Ocean). Key groupings: UN, G20, BRICS+, QUAD, SCO, ASEAN, BIMSTEC.",
        detailedNotes: "India balances ties with the USA (iCET, QUAD), Russia (defence & energy), EU, and Global South (Voice of Global South, African Union inclusion in G20 during India's 2023 Presidency). Neighbourhood challenges involve border management (LAC), connectivity, and debt-trap geopolitics in the Indo-Pacific.",
        hiNotes: "भारत की विदेश नीति 'रणनीतिक स्वायत्तता' (Strategic Autonomy), 'नेबरहुड फर्स्ट', 'एक्ट ईस्ट' और 'सागर' (SAGAR) विजन पर आधारित है। भारत G20, BRICS, QUAD, SCO और BIMSTEC जैसे मंचों के माध्यम से ग्लोबल साउथ की आवाज बुलंद कर रहा है।",
        keyFacts: ["QUAD: India, USA, Japan, Australia", "BIMSTEC: Bay of Bengal initiative (7 members)", "African Union joined G20 at New Delhi Summit 2023"],
        pyqConn: "UPSC Prelims 2022 (G20 & BIMSTEC), Mains GS-II 2023 (India's G20 Presidency & QUAD)."
      },

      // INTERNAL SECURITY
      {
        id: "sec-1", subject: "Internal Security", category: "Security Challenges", paper: "GS-III (Mains)",
        title: "Cybersecurity, Border Management, Left-Wing Extremism & Money Laundering", hiTitle: "साइबर सुरक्षा, सीमा प्रबंधन, वामपंथी उग्रवाद एवं मनी लॉन्ड्रिंग",
        level: "Stage 6: Mains", estTime: "50 min", prereq: "Indian Polity & IR",
        quickNotes: "Key agencies: CERT-In, NCIIPC (Critical Infrastructure), NIA, ED (PMLA 2002), FATF. Border management integrates CIBMS (Smart Fencing) and Vibrant Villages Programme.",
        detailedNotes: "Modern threats span hybrid warfare, ransomware on power/banking grids, narco-terrorism via drones, and terror financing. India's SAMADHAN doctrine combines smart leadership, technology, and developmental outreach to address Left-Wing Extremism (LWE).",
        hiNotes: "आंतरिक सुरक्षा के अंतर्गत साइबर सुरक्षा (CERT-In, NCIIPC), सीमा प्रबंधन (CIBMS, वाइब्रेंट विलेज प्रोग्राम), आतंकवाद निरोध (NIA) और मनी लॉन्ड्रिंग (PMLA 2002, FATF) प्रमुख स्तंभ हैं।",
        keyFacts: ["CERT-In: Nodal agency for cyber incidents", "PMLA 2002 enforced by Enforcement Directorate", "FATF Grey/Black lists combat terror financing"],
        pyqConn: "UPSC Mains GS-III 2023 (Terror funding & Maritime security)."
      },

      // DISASTER MANAGEMENT
      {
        id: "dm-1", subject: "Disaster Management", category: "DRR & Frameworks", paper: "GS-III (Mains)",
        title: "NDMA, Disaster Management Act 2005 & Sendai Framework", hiTitle: "NDMA, आपदा प्रबंधन अधिनियम 2005 एवं सेंदाई फ्रेमवर्क",
        level: "Stage 6: Mains", estTime: "40 min", prereq: "Physical Geography",
        quickNotes: "Shift from relief-centric to proactive Disaster Risk Reduction (DRR). NDMA chaired by Prime Minister; SDMA by Chief Minister; DDMA by District Collector. Sendai Framework (2015–2030) has 4 priorities & 7 targets.",
        detailedNotes: "India launched the Coalition for Disaster Resilient Infrastructure (CDRI). Key hazards include Himalayan earthquakes/GLOFs, urban floods (sponge cities), heatwaves, and coastal cyclones (IMD early warning drastically reduced fatalities).",
        hiNotes: "आपदा प्रबंधन अधिनियम 2005 के तहत NDMA (अध्यक्ष: प्रधानमंत्री), SDMA और DDMA की त्रि-स्तरीय संरचना है। सेंदाई फ्रेमवर्क (2015–2030) आपदा जोखिम न्यूनीकरण (DRR) का वैश्विक ढांचा है।",
        keyFacts: ["NDMA Chairman: Prime Minister of India", "Sendai Framework: 2015–2030", "CDRI HQ: New Delhi"],
        pyqConn: "UPSC Mains GS-III 2022 (Cloudbursts & Landslides), 2023 (Dam failures & Urban floods)."
      },

      // ETHICS GS PAPER IV (Special structured fields!)
      {
        id: "eth-1", subject: "Ethics (GS-IV)", category: "Foundational Values", paper: "GS-IV (Mains)",
        title: "Integrity, Impartiality, Objectivity & Emotional Intelligence", hiTitle: "सत्यनिष्ठा, निष्पक्षता, वस्तुनिष्ठता एवं भावनात्मक बुद्धिमत्ता",
        level: "Stage 6: Mains", estTime: "60 min", prereq: "General Awareness",
        quickNotes: "Nolan Committee's 7 Principles of Public Life: Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, Leadership. EI (Daniel Goleman): Self-awareness, Self-regulation, Motivation, Empathy, Social Skills.",
        detailedNotes: "Ethics in civil services bridges legality with morality. Integrity means unwavering adherence to moral principles even when no one is watching. Impartiality ensures non-partisan decision-making free from political or personal bias, while Empathy and Compassion drive citizen-centric governance for the vulnerable.",
        hiNotes: "लोक सेवा में नैतिकता कानून और अंतरात्मा के बीच सेतु है। सत्यनिष्ठा (Integrity) का अर्थ विपरीत परिस्थितियों में भी नैतिक सिद्धांतों पर अडिग रहना है। भावनात्मक बुद्धिमत्ता (Emotional Intelligence) प्रशासक को तनावपूर्ण स्थितियों में संयम और सहानुभूति के साथ निर्णय लेने में सक्षम बनाती है।",
        keyFacts: ["Nolan Committee (1995): 7 Principles of Public Life", "Gandhi's Talisman: Recall the face of the poorest person", "2nd ARC 4th Report: Ethics in Governance"],
        pyqConn: "UPSC Mains GS-IV 2021–2023 (Integrity, Compassion, Emotional Intelligence in administration).",
        ethicsPack: {
          concept: "Integrity & Objectivity in Public Administration",
          definition: "Integrity is consistency between one's values, words, and actions—doing the right thing even at personal cost. Objectivity means basing administrative decisions solely on merit, evidence, and rules.",
          realLifeExample: "Returning excess change to a street vendor even when they haven't noticed, or refusing to jump a hospital queue despite having contacts.",
          civilServiceExample: "Sir M. Visvesvaraya used two separate candles—one government-funded for official work, and a personal candle when reading private letters—exemplifying financial probity and integrity.",
          caseStudy: "You are a District Magistrate overseeing flood relief. A powerful local MLA pressures you to divert 60% of relief kits to his relatively less-affected constituency ahead of elections, while a remote tribal block is severely submerged.",
          modelAnswer: "1) Stakeholders: Flood-affected tribal citizens, MLA, district administration, taxpayers. 2) Ethical Dilemmas: Political pressure vs. Impartiality & Compassion; Duty of care vs. Career convenience. 3) Course of Action: Politely present objective satellite/revenue damage data to the MLA; deploy relief strictly on vulnerability index (Gandhi's Talisman); maintain transparent public dashboard of relief distribution; document orders in writing to uphold rule of law."
        }
      },
      {
        id: "eth-2", subject: "Ethics (GS-IV)", category: "Probity in Governance", paper: "GS-IV (Mains)",
        title: "Probity, Transparency, RTI, Citizen Charter & Ethical Dilemmas", hiTitle: "शासन में ईमानदारी, पारदर्शिता, RTI, नागरिक चार्टर एवं नैतिक दुविधाएँ",
        level: "Stage 7: Analytical", estTime: "55 min", prereq: "Foundational Values",
        quickNotes: "Probity is uprightness and absence of corruption. Tools: RTI Act 2005, Citizen's Charter (Sevottam model), Social Audit (Meghalaya Act), E-Governance, Code of Conduct vs Code of Ethics.",
        detailedNotes: "While Code of Conduct lists legally enforceable 'dos and don'ts', Code of Ethics articulates aspirational moral values. Transparency reduces information asymmetry, curbing discretion-driven corruption (Corruption = Monopoly + Discretion – Accountability).",
        hiNotes: "शासन में सत्यनिष्ठा (Probity) केवल भ्रष्टाचार का अभाव नहीं, बल्कि सार्वजनिक संसाधनों का नैतिक और प्रभावी उपयोग है। RTI अधिनियम 2005, सिटिजन चार्टर (सेवोत्तम मॉडल) और सोशल ऑडिट पारदर्शिता के प्रमुख उपकरण हैं।",
        keyFacts: ["Klitgaard Formula: C = M + D – A", "Sevottam Model: Citizen Charter + Grievance Redressal + Service Delivery", "RTI Act 2005: Empowers citizens as masters of democracy"],
        pyqConn: "UPSC Mains GS-IV 2022 (Probity & Whistleblowing), 2023 (Accountability & Conflict of Interest).",
        ethicsPack: {
          concept: "Conflict of Interest & Probity in Public Procurement",
          definition: "A Conflict of Interest arises when a public official's private interests (financial, familial) could improperly influence the performance of official duties.",
          realLifeExample: "A teacher recusing themselves from grading an exam paper written by their own child.",
          civilServiceExample: "An IAS officer heading a tender committee immediately discloses in writing that a bidder is owned by their brother-in-law and formally recuses themselves from the entire procurement process.",
          caseStudy: "As Municipal Commissioner, you discover your subordinate—who is an honest, hardworking engineer—approved a slightly substandard road bill under duress from a local syndicate threatening his family.",
          modelAnswer: "1) Immediate Safety & Integrity: Ensure police protection for the engineer's family while immediately halting payment and ordering an independent quality audit. 2) Institutional Reform: Shift to e-tendering with geo-tagged third-party inspection so individuals cannot be coerced. 3) Balanced Justice: Follow due process—distinguish coercion from malice while upholding zero tolerance for public safety compromise."
        }
      }
    ];

    /* 10 OPTIONAL SUBJECTS */
    const OPTIONAL_SUBJECTS = [
      { id: "opt-his", name: "History", hiName: "इतिहास", p1: "Ancient & Medieval India (Sources, IVC, Mauryas, Guptas, Cholas, Delhi Sultanate, Mughals, Bhakti-Sufi)", p2: "Modern India & World History (British Expansion, Economic Impact, Freedom Struggle, Enlightenment, Industrialization, World Wars, Cold War)", prompt: "Critically examine the nature of the 1857 Revolt. Was it merely a sepoy mutiny or the First War of Independence? (250 words)" },
      { id: "opt-geo", name: "Geography", hiName: "भूगोल", p1: "Principles of Geography (Geomorphology, Climatology, Oceanography, Biogeography, Perspectives in Human Geography, Regional Planning)", p2: "Geography of India (Physical Setting, Resources, Agriculture, Industry, Transport, Cultural Setting, Contemporary Issues & Map Work)", prompt: "Discuss the mechanism of the Indian Monsoon with reference to Jet Streams and El Niño–Southern Oscillation (ENSO). (250 words)" },
      { id: "opt-psir", name: "Political Science & IR", hiName: "राजनीति विज्ञान एवं IR", p1: "Political Theory & Indian Politics (Plato to Marx, Justice, Equality, Indian Constitution, Federalism, Caste & Democracy)", p2: "Comparative Politics & International Relations (Realism, Liberalism, India's Foreign Policy, UN, Global South, Indo-Pacific)", prompt: "Analyze the relevance of Kautilya's Mandal Theory in India's contemporary Neighbourhood First policy. (250 words)" },
      { id: "opt-pubad", name: "Public Administration", hiName: "लोक प्रशासन", p1: "Administrative Theory (Wilson, Weber, Taylor, Elton Mayo, New Public Management, Accountability, Financial Administration)", p2: "Indian Administration (Evolution, PMO, Cabinet Secretariat, District Collector, Panchayati Raj, Law & Order, Administrative Reforms)", prompt: "Examine how e-Governance and Digital Public Infrastructure are transforming the Weberian bureaucracy in India. (250 words)" },
      { id: "opt-soc", name: "Sociology", hiName: "समाजशास्त्र", p1: "Fundamentals of Sociology (Marx, Durkheim, Weber, Stratification, Work, Religion, Kinship, Social Change)", p2: "Indian Society: Structure & Change (Caste System, Tribal Communities, Rural & Agrarian Transformation, Urbanization, Social Movements)", prompt: "Discuss M.N. Srinivas's concept of Sanskritization and its relevance in contemporary India. (250 words)" },
      { id: "opt-phil", name: "Philosophy", hiName: "दर्शनशास्त्र", p1: "History & Problems of Philosophy (Plato, Aristotle, Descartes, Kant, Nyaya, Sankhya, Yoga, Advaita Vedanta, Buddhism, Jainism)", p2: "Socio-Political Philosophy & Philosophy of Religion (Justice, Sovereignty, Secularism, Problem of Evil, Religious Pluralism)", prompt: "Compare and contrast Shankaracharya's Advaita Vedanta with Ramanuja's Vishishtadvaita. (250 words)" },
      { id: "opt-eco", name: "Economics", hiName: "अर्थशास्त्र", p1: "Advanced Micro & Macro Economics, Money & Banking, International Economics, Public Finance, Growth & Development", p2: "Indian Economy: Pre- & Post-Independence, Planning, Agriculture, Industry, Liberalization (1991), New Economic Policy", prompt: "Evaluate the role of Fiscal Consolidation under the FRBM Act in balancing growth and macroeconomic stability. (250 words)" },
      { id: "opt-psy", name: "Psychology", hiName: "मनोविज्ञान", p1: "Foundations of Psychology (Research Methods, Sensation, Learning, Memory, Motivation, Intelligence, Personality)", p2: "Psychology: Issues & Applications (Psychological Measurement, Mental Health, Work & Organizational Psychology, Community & Rehabilitation)", prompt: "Explain the role of Emotional Intelligence in effective leadership and stress management in public service. (250 words)" },
      { id: "opt-anthro", name: "Anthropology", hiName: "मानवशास्त्र", p1: "Physical, Archaeological & Socio-Cultural Anthropology (Human Evolution, Genetics, Kinship, Religion, Anthropological Theories)", p2: "Indian Anthropology (Caste, Tribe-Caste Continuum, PVTGs, Forest Rights, Tribal Development & Constitutional Safeguards)", prompt: "Analyze the impact of the Forest Rights Act (2006) on the socio-economic empowerment of Scheduled Tribes. (250 words)" },
      { id: "opt-lit", name: "Hindi / English Literature", hiName: "साहित्य (हिंदी / अंग्रेज़ी)", p1: "History of Language & Literary Criticism (Evolution of Khari Boli/Devangari or Renaissance–Modern English Literary Movements)", p2: "Prescribed Classical & Modern Literary Texts (Kabir, Surdas, Tulsidas, Premchand / Shakespeare, Milton, Wordsworth, Dickens)", prompt: "Discuss Premchand's contribution to social realism in Hindi literature with reference to 'Godan'. (250 words)" }
    ];

    /* =========================================================================
       3. AUTHENTIC QUESTION BANK (STRICTLY LABELED: OFFICIAL PYQ vs PRACTICE)
       ========================================================================= */
    const INITIAL_QUESTIONS = [
      {
        id: "q-pyq-2021-pol1", subject: "Polity", topic: "Constitutional Government", paper: "Prelims GS",
        type: "Standard MCQ", level: "LEVEL 5 — UPSC STANDARD", authenticity: "OFFICIAL PYQ", year: "UPSC CSE 2021",
        q: "What is the position of the Right to Property in India?",
        hiQ: "भारत में संपत्ति के अधिकार (Right to Property) की क्या स्थिति है?",
        options: [
          "Legal right available to citizens only",
          "Legal right available to any person",
          "Fundamental Right available to citizens only",
          "Neither Fundamental Right nor legal right"
        ],
        answer: 1,
        whyCorrect: "By the 44th Constitutional Amendment Act (1978), Right to Property was removed from Fundamental Rights and made a Constitutional/Legal Right under Article 300A, which states 'No person shall be deprived of his property save by authority of law'.",
        whyWrong: "It applies to 'any person' (not just citizens), and it is no longer a Fundamental Right.",
        concept: "Article 300A (Part XII) — Constitutional & Legal Right.",
        trick: "Remember: 44th Amendment (4+4=8 -> 1978) moved Property to 300A for 'any person'."
      },
      {
        id: "q-pyq-2020-his1", subject: "History", topic: "Ancient India (Buddhism)", paper: "Prelims GS",
        type: "Standard MCQ", level: "LEVEL 5 — UPSC STANDARD", authenticity: "OFFICIAL PYQ", year: "UPSC CSE 2020",
        q: "With reference to the cultural history of India, which one of the following is the correct description of the term 'Paramitas'?",
        hiQ: "भारत के सांस्कृतिक इतिहास के संदर्भ में, 'पारमिता' (Paramitas) शब्द का सही विवरण निम्नलिखित में से कौन-सा है?",
        options: [
          "The earliest Dharmashastra texts written in aphoristic (sutra) style",
          "Philosophical schools that did not accept the authority of Vedas",
          "Perfections whose attainment led to the Bodhisattva path",
          "Powerful merchant guilds of early medieval South India"
        ],
        answer: 2,
        whyCorrect: "In Mahayana Buddhism, Paramitas refer to 'perfections' or transcendent virtues (such as Dana, Sila, Ksanti, Virya, Dhyana, Prajna) practiced to attain Bodhisattvahood.",
        whyWrong: "Option B refers to Nastika schools; Option D refers to guilds like Manigramam/Ayyavole.",
        concept: "Mahayana Buddhism & Bodhisattva Ideal.",
        trick: "Paramita = 'Param' (Supreme) Perfection on the Bodhisattva path."
      },
      {
        id: "q-pyq-2021-geo1", subject: "Geography", topic: "Indian Drainage", paper: "Prelims GS",
        type: "Standard MCQ", level: "LEVEL 5 — UPSC STANDARD", authenticity: "OFFICIAL PYQ", year: "UPSC CSE 2021",
        q: "With reference to the Indus river system, of the following four rivers, three of them pour into one of them which joins the Indus direct. Among the following, which one is such river that joins the Indus direct?",
        hiQ: "सिंधु नदी प्रणाली के संदर्भ में, निम्नलिखित चार नदियों में से तीन नदियाँ इनमें से किसी एक नदी में मिलती हैं जो सीधे सिंधु से मिलती है। वह नदी कौन-सी है जो सीधे सिंधु से मिलती है?",
        options: ["Chenab", "Jhelum", "Ravi", "Sutlej"],
        answer: 3,
        whyCorrect: "Jhelum and Ravi join Chenab, and Chenab joins Sutlej (forming Panjnad) which finally flows directly into the Indus near Mithankot.",
        whyWrong: "Jhelum and Ravi do not directly join the Indus; they merge into Chenab first.",
        concept: "Indus River System (Panjnad).",
        trick: "North to South: I-J-C-R-B-S -> Sutlej carries the combined Panjnad waters into Indus."
      },
      {
        id: "q-pyq-2020-eco1", subject: "Economy", topic: "Monetary Policy", paper: "Prelims GS",
        type: "Multiple Statement", level: "LEVEL 5 — UPSC STANDARD", authenticity: "OFFICIAL PYQ", year: "UPSC CSE 2020",
        q: "If the RBI decides to adopt an expansionist monetary policy, which of the following would it NOT do?\n1. Cut and optimize the Statutory Liquidity Ratio (SLR)\n2. Increase the Marginal Standing Facility (MSF) Rate\n3. Cut the Bank Rate and Repo Rate",
        hiQ: "यदि RBI विस्तारवादी मौद्रिक नीति (Expansionist Monetary Policy) अपनाने का निर्णय लेता है, तो वह निम्नलिखित में से क्या नहीं करेगा?\n1. SLR में कटौती\n2. MSF दर में वृद्धि\n3. बैंक दर और रेपो दर में कटौती",
        options: ["1 and 2 only", "2 only", "1 and 3 only", "1, 2 and 3"],
        answer: 1,
        whyCorrect: "An expansionist policy aims to increase money supply by lowering interest rates (cutting SLR, Bank Rate, Repo Rate). Increasing the MSF Rate would make borrowing costlier (contractionary), so RBI would NOT do statement 2.",
        whyWrong: "Statements 1 and 3 inject liquidity into the economy, which IS what expansionist policy does.",
        concept: "RBI Quantitative Monetary Policy Tools.",
        trick: "Expansion = Lower Rates (Cheap Money); Contraction = Higher Rates (Dear Money)."
      },
      {
        id: "q-pyq-2022-env1", subject: "Environment", topic: "Environmental Laws", paper: "Prelims GS",
        type: "Standard MCQ", level: "LEVEL 5 — UPSC STANDARD", authenticity: "OFFICIAL PYQ", year: "UPSC CSE 2022",
        q: "Which one of the following has been constituted under the Environment (Protection) Act, 1986?",
        hiQ: "निम्नलिखित में से किसका गठन पर्यावरण (संरक्षण) अधिनियम, 1986 के अंतर्गत किया गया है?",
        options: [
          "Central Water Commission",
          "Central Ground Water Board",
          "Central Ground Water Authority",
          "National Water Development Agency"
        ],
        answer: 2,
        whyCorrect: "Central Ground Water Authority (CGWA) was constituted under Section 3(3) of the Environment (Protection) Act, 1986 to regulate and control development and management of groundwater resources.",
        whyWrong: "CGWB and CWC are subordinate/attached technical organizations not created under EPA 1986.",
        concept: "Statutory Authorities under EPA 1986.",
        trick: "Authority (CGWA) = Regulatory power under EPA 1986; Board (CGWB) = Technical research."
      },
      {
        id: "q-prac-pol2", subject: "Polity", topic: "Parliament & Money Bill", paper: "Prelims GS",
        type: "Assertion-Reason", level: "LEVEL 4 — ADVANCED", authenticity: "PRACTICE QUESTION", year: "WONDER IAS Bank",
        q: "Assertion (A): A Joint Sitting of both Houses of Parliament cannot be summoned to resolve a deadlock over a Money Bill.\nReason (R): The Rajya Sabha has limited powers regarding a Money Bill and can detain it for a maximum of 14 days.",
        hiQ: "कथन (A): धन विधेयक पर गतिरोध को दूर करने के लिए संसद के दोनों सदनों की संयुक्त बैठक नहीं बुलाई जा सकती।\nकारण (R): धन विधेयक के संबंध में राज्यसभा की शक्तियाँ सीमित हैं और वह इसे अधिकतम 14 दिनों तक रोक सकती है।",
        options: [
          "Both A and R are true and R is the correct explanation of A",
          "Both A and R are true but R is NOT the correct explanation of A",
          "A is true but R is false",
          "A is false but R is true"
        ],
        answer: 0,
        whyCorrect: "Under Article 108, Joint Sitting applies only to Ordinary Bills and Financial Bills (I/II), never to Money Bills (Art 110) or Constitutional Amendment Bills (Art 368), because Lok Sabha has overriding authority over Money Bills.",
        whyWrong: "Both statements are factually correct and R directly explains A.",
        concept: "Article 108 & Article 110 of Indian Constitution.",
        trick: "No Joint Sitting for Money (110) & Amendment (368) Bills."
      },
      {
        id: "q-prac-sci1", subject: "Science & Tech", topic: "Space Technology", paper: "Prelims GS",
        type: "Match the Following", level: "LEVEL 3 — INTERMEDIATE", authenticity: "PRACTICE QUESTION", year: "WONDER IAS Bank",
        q: "Match the following ISRO Missions with their primary objectives:\n1. Aditya-L1 — Solar Corona Study\n2. Gaganyaan — Human Spaceflight\n3. NISAR — Dual-frequency Earth Observation Radar\nHow many pairs given above are correctly matched?",
        hiQ: "निम्नलिखित ISRO मिशनों का उनके उद्देश्यों से मिलान कीजिए:\n1. आदित्य-L1 — सौर कोरोना अध्ययन\n2. गगनयान — मानव अंतरिक्ष उड़ान\n3. NISAR — पृथ्वी अवलोकन रडार\nउपर्युक्त में से कितने युग्म सही सुमेलित हैं?",
        options: ["Only one pair", "Only two pairs", "All three pairs", "None of the pairs"],
        answer: 2,
        whyCorrect: "All three are correctly matched: Aditya-L1 orbits Sun-Earth L1 point; Gaganyaan is India's human spaceflight mission; NISAR is the joint NASA-ISRO Synthetic Aperture Radar satellite.",
        whyWrong: "Every pair is accurate, so options with fewer than three are incorrect.",
        concept: "ISRO Flagship Missions.",
        trick: "Aditya = Sun; Gagan = Sky/Human flight; N-I-SAR = NASA-ISRO SAR."
      },
      {
        id: "q-prac-map1", subject: "Geography", topic: "Map Learning", paper: "Prelims GS",
        type: "Map-Based", level: "LEVEL 4 — ADVANCED", authenticity: "PRACTICE QUESTION", year: "WONDER IAS Map Bank",
        q: "Arrange the following National Parks of India from North to South:\n1. Kaziranga National Park\n2. Jim Corbett National Park\n3. Kanha National Park\n4. Silent Valley National Park",
        hiQ: "भारत के निम्नलिखित राष्ट्रीय उद्यानों को उत्तर से दक्षिण के क्रम में व्यवस्थित कीजिए:\n1. काजीरंगा  2. जिम कॉर्बेट  3. कान्हा  4. साइलेंट वैली",
        options: ["2 - 1 - 3 - 4", "1 - 2 - 3 - 4", "2 - 3 - 1 - 4", "1 - 3 - 2 - 4"],
        answer: 0,
        whyCorrect: "Jim Corbett (Uttarakhand, ~29.5°N) is northernmost, followed by Kaziranga (Assam, ~26.6°N), Kanha (Madhya Pradesh, ~22.3°N), and Silent Valley (Kerala, ~11.1°N).",
        whyWrong: "Uttarakhand lies significantly north of Assam's Brahmaputra valley.",
        concept: "Protected Areas Geography & Latitudes.",
        trick: "Corbett (UK) > Kaziranga (Assam) > Kanha (MP) > Silent Valley (Kerala)."
      },
      // CSAT QUESTIONS
      {
        id: "q-csat-1", subject: "CSAT", topic: "Number System & Percentage", paper: "Prelims CSAT",
        type: "Standard MCQ", level: "LEVEL 3 — INTERMEDIATE", authenticity: "PRACTICE QUESTION", year: "CSAT Quant Bank",
        q: "If the price of an article is first increased by 20% and then decreased by 20%, what is the net percentage change in the price?",
        hiQ: "यदि किसी वस्तु के मूल्य में पहले 20% की वृद्धि की जाती है और फिर 20% की कमी की जाती है, तो मूल्य में शुद्ध प्रतिशत परिवर्तन क्या होगा?",
        options: ["0% (No change)", "4% increase", "4% decrease", "2% decrease"],
        answer: 2,
        whyCorrect: "Let initial price = 100. After +20% -> 120. After -20% of 120 (-24) -> 96. Net change = -4% (4% decrease). Formula: -x²/100 = -(20²)/100 = -4%.",
        whyWrong: "Equal % increase followed by same % decrease ALWAYS results in a net decrease.",
        concept: "Successive Percentage Change.",
        trick: "Same +x% and -x% ALWAYS gives -x²/100% loss."
      },
      {
        id: "q-csat-2", subject: "CSAT", topic: "Logical Reasoning (Syllogism)", paper: "Prelims CSAT",
        type: "Standard MCQ", level: "LEVEL 3 — INTERMEDIATE", authenticity: "PRACTICE QUESTION", year: "CSAT Reasoning Bank",
        q: "Statements:\n1. All rivers are water bodies.\n2. Some water bodies are polluted.\nConclusions:\nI. Some rivers are polluted.\nII. Some polluted things are water bodies.\nWhich conclusion logically follows?",
        hiQ: "कथन: 1. सभी नदियाँ जल निकाय हैं। 2. कुछ जल निकाय प्रदूषित हैं।\nनिष्कर्ष: I. कुछ नदियाँ प्रदूषित हैं। II. कुछ प्रदूषित वस्तुएँ जल निकाय हैं।",
        options: ["Only Conclusion I follows", "Only Conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
        answer: 1,
        whyCorrect: "From Statement 2 ('Some water bodies are polluted'), its converse ('Some polluted things are water bodies') definitely follows. However, no definite link is given between Rivers and Polluted, so I is only a possibility, not a definite conclusion.",
        whyWrong: "Conclusion I commits the undistributed middle fallacy.",
        concept: "Syllogism & Venn Diagrams.",
        trick: "'Some A are B' ALWAYS implies 'Some B are A'."
      },
      {
        id: "q-csat-3", subject: "CSAT", topic: "Reading Comprehension", paper: "Prelims CSAT",
        type: "Standard MCQ", level: "LEVEL 4 — ADVANCED", authenticity: "PRACTICE QUESTION", year: "CSAT Comprehension",
        q: "Passage: 'Sustainable urban growth cannot rely solely on concrete flyovers; it requires restoring urban wetlands, expanding public transit, and decentralizing municipal finance so cities remain livable during climate extremes.'\nWhich of the following best reflects the crux of the passage?",
        hiQ: "गद्यांश का मुख्य संदेश (Crux) निम्नलिखित में से कौन-सा है?",
        options: [
          "Flyovers should be completely banned in Indian cities",
          "Climate-resilient urbanization needs ecological restoration, public transit, and empowered local governance",
          "Municipalities lack the technical skill to manage wetlands",
          "Urbanization is inherently incompatible with ecology"
        ],
        answer: 1,
        whyCorrect: "Option B captures all three pillars mentioned in the passage—ecological restoration (wetlands), public transit, and decentralized municipal finance—without making extreme assumptions.",
        whyWrong: "Options A, C, and D use extreme words ('completely banned', 'inherently incompatible') not supported by the text.",
        concept: "CSAT Main Idea & Extreme-Word Elimination.",
        trick: "Avoid extreme choices ('only', 'completely', 'never') in UPSC CSAT Comprehension."
      },
      {
        id: "q-prac-ir1", subject: "International Relations", topic: "International Organizations", paper: "Prelims GS",
        type: "Standard MCQ", level: "LEVEL 4 — ADVANCED", authenticity: "PRACTICE QUESTION", year: "WONDER IAS Bank",
        q: "Which of the following countries is NOT a member of BIMSTEC (Bay of Bengal Initiative for Multi-Sectoral Technical and Economic Cooperation)?",
        hiQ: "निम्नलिखित में से कौन-सा देश BIMSTEC का सदस्य नहीं है?",
        options: ["Bhutan", "Nepal", "Thailand", "Maldives"],
        answer: 3,
        whyCorrect: "BIMSTEC has 7 members: Bangladesh, Bhutan, India, Myanmar, Nepal, Sri Lanka, and Thailand. Maldives is a member of SAARC, not BIMSTEC.",
        whyWrong: "Bhutan, Nepal, and Thailand are all full members of BIMSTEC.",
        concept: "Regional Groupings around India.",
        trick: "BIMSTEC = SAARC minus (Pakistan, Afghanistan, Maldives) + (Myanmar, Thailand)."
      }
    ];

    /* =========================================================================
       4. CURRENT AFFAIRS ENGINE (AUTHENTIC CONCEPTUAL & INSTITUTIONAL BRIEFS)
       ========================================================================= */
    const INITIAL_CURRENT_AFFAIRS = [
      {
        id: "ca-1", date: "Nov 2026", category: "Economy", source: "RBI / PIB",
        headline: "India's Digital Public Infrastructure (DPI) & Global UPI Expansion",
        hiHeadline: "भारत का डिजिटल पब्लिक इंफ्रास्ट्रक्चर (DPI) और UPI का वैश्विक विस्तार",
        background: "India Stack (Aadhaar, UPI, DigiLocker, Account Aggregator) has emerged as a global model for low-cost, interoperable financial inclusion.",
        whyImportant: "Directly linked to GS-III Inclusive Growth, Financial Inclusion, and GS-II Digital Diplomacy with Global South nations.",
        syllabus: "GS-III: Indian Economy (Financial Inclusion, Digital Economy) | GS-II: IR",
        prelimsFacts: ["NPCI operates UPI & RuPay", "Account Aggregator framework is regulated by RBI", "DPI is built on open-source, interoperable APIs"],
        mainsAnalysis: "DPI bridges the physical-digital divide, lowers KYC costs, and enables Direct Benefit Transfers (DBT) with minimal leakage. Challenges include cyber-fraud, rural digital literacy, and data privacy under DPDP Act.",
        keywords: ["DPI", "India Stack", "JAM Trinity", "Interoperability", "DPDP Act"],
        possibleQ: "Discuss how India's Digital Public Infrastructure (DPI) model advances both domestic inclusive growth and soft-power diplomacy. (15 Marks)"
      },
      {
        id: "ca-2", date: "Nov 2026", category: "Environment", source: "UNFCCC / MoEFCC",
        headline: "Climate Finance, Loss & Damage Fund & India's Panchamrit Roadmap",
        hiHeadline: "जलवायु वित्त, लॉस एंड डैमेज फंड एवं भारत का पंचामृत रोडमैप",
        background: "Developing nations emphasize Common But Differentiated Responsibilities (CBDR-RC) and predictable climate finance for green energy transition and adaptation.",
        whyImportant: "Core recurring theme in UPSC Prelims (UNFCCC mechanisms) and Mains GS-III (Climate Change & Renewable Energy).",
        syllabus: "GS-III: Environment & Climate Change | GS-II: International Conventions",
        prelimsFacts: ["India targets 500 GW non-fossil energy capacity by 2030", "Net-Zero target: 2070", "Loss & Damage Fund operationalized at COP28, hosted initially by World Bank"],
        mainsAnalysis: "Balancing rapid poverty alleviation with decarbonization requires concessional finance, green hydrogen scaling, and grid storage. India's LiFE (Lifestyle for Environment) mission complements technological mitigation.",
        keywords: ["CBDR-RC", "Panchamrit", "Climate Justice", "Green Hydrogen", "Mission LiFE"],
        possibleQ: "Explain the principle of CBDR-RC. How can India balance developmental imperatives with its Net-Zero 2070 commitment? (15 Marks)"
      },
      {
        id: "ca-3", date: "Nov 2026", category: "Polity", source: "Supreme Court / Parliament",
        headline: "Constitutional Morality, Cooperative Federalism & Election Reforms",
        hiHeadline: "संवैधानिक नैतिकता, सहकारी संघवाद एवं निर्वाचन सुधार",
        background: "Recent constitutional debates focus on the independence of constitutional bodies, Centre-State fiscal federalism (Finance Commission devolution), and electoral transparency.",
        whyImportant: "High-yield GS-II Polity topic tested frequently in both Prelims conceptual questions and Mains analytical essays.",
        syllabus: "GS-II: Indian Constitution, Federalism, Election Commission",
        prelimsFacts: ["Article 324: Superintendence of elections by ECI", "Article 280: Finance Commission", "Article 263: Inter-State Council"],
        mainsAnalysis: "Strengthening institutional autonomy, empowering the Inter-State Council, and adopting transparent political funding mechanisms reinforce democratic legitimacy and public trust.",
        keywords: ["Constitutional Morality", "Cooperative Federalism", "Article 324", "Fiscal Devolution"],
        possibleQ: "What is Constitutional Morality? Discuss its role in strengthening India's parliamentary democracy. (10 Marks)"
      },
      {
        id: "ca-4", date: "Nov 2026", category: "Science & Tech", source: "ISRO / DST",
        headline: "India's Deep Space Roadmap: Gaganyaan, Bharatiya Antariksh Station & Quantum Mission",
        hiHeadline: "भारत का अंतरिक्ष रोडमैप: गगनयान, भारतीय अंतरिक्ष स्टेशन एवं क्वांटम मिशन",
        background: "Building on Chandrayaan-3 and Aditya-L1, India is advancing human spaceflight (Gaganyaan), private space startups (IN-SPACe), and the National Quantum Mission.",
        whyImportant: "High-probability Prelims S&T questions and GS-III Indigenization of Technology.",
        syllabus: "GS-III: Science & Technology (Space, Quantum, Indigenization)",
        prelimsFacts: ["IN-SPACe regulates & promotes private space sector", "NSIL is ISRO's commercial arm", "National Quantum Mission focuses on computing, communication, sensing & materials"],
        mainsAnalysis: "Opening the space sector to private startups accelerates downstream applications in agriculture, disaster warning, and telecom while reducing launch costs.",
        keywords: ["IN-SPACe", "Gaganyaan", "LVM3", "Qubits", "Atmanirbhar Bharat"],
        possibleQ: "How are private space sector reforms transforming India's space economy and strategic capabilities? (10 Marks)"
      }
    ];

    /* =========================================================================
       5. INTERACTIVE MAPS & MIND MAPS DATA
       ========================================================================= */
    const INDIA_MAP_PINS = [
      { id: "m-him", x: 155, y: 78, type: "Mountain", name: "Himalayan Ranges & Karakoram", fact: "Young fold mountains formed by Indian–Eurasian plate collision. Home to K2, Kanchenjunga, and Siachen Glacier." },
      { id: "m-corb", x: 158, y: 125, type: "National Park", name: "Jim Corbett National Park (Uttarakhand)", fact: "India's oldest National Park (1936, Hailey NP). First site of Project Tiger (1973). Ramganga river flows through it." },
      { id: "m-ganga", x: 205, y: 155, type: "River", name: "Ganga River Basin", fact: "Originates at Gangotri (Bhagirathi), meets Alaknanda at Devprayag. Major tributaries: Yamuna, Ghaghara, Gandak, Kosi, Son." },
      { id: "m-kaz", x: 300, y: 152, type: "National Park", name: "Kaziranga National Park (Assam)", fact: "UNESCO World Heritage Site famous for Great Indian One-Horned Rhinoceros on the Brahmaputra floodplains." },
      { id: "m-nar", x: 145, y: 215, type: "River", name: "Narmada Rift Valley", fact: "Originates at Amarkantak Plateau (MP), flows west between Vindhya & Satpura ranges into Gulf of Khambhat forming an estuary." },
      { id: "m-wg", x: 118, y: 295, type: "Mountain", name: "Western Ghats (Sahyadri)", fact: "UNESCO Biodiversity Hotspot; escarpment causing orographic rainfall; highest peak Anamudi (2,695 m) in Kerala." },
      { id: "m-god", x: 185, y: 265, type: "River", name: "Godavari Basin (Dakshin Ganga)", fact: "Longest Peninsular river (1,465 km), rises at Trimbakeshwar (Maharashtra), drains into Bay of Bengal." },
      { id: "m-sund", x: 262, y: 205, type: "National Park", name: "Sundarbans Biosphere Reserve", fact: "World's largest mangrove forest & delta (Ganga-Brahmaputra), habitat of Royal Bengal Tiger; Ramsar Site." }
    ];

    const WORLD_MAP_PINS = [
      { id: "w-mal", x: 325, y: 150, type: "Strait", name: "Strait of Malacca", fact: "Connects Andaman Sea (Indian Ocean) with South China Sea (Pacific). Vital global oil & trade chokepoint between Malaysia & Indonesia." },
      { id: "w-hor", x: 248, y: 118, type: "Strait", name: "Strait of Hormuz", fact: "Connects Persian Gulf with Gulf of Oman. Crucial maritime chokepoint for global crude oil transit." },
      { id: "w-bab", x: 228, y: 138, type: "Strait", name: "Bab-el-Mandeb Strait", fact: "Connects Red Sea with Gulf of Aden (Indian Ocean), separating Yemen from Djibouti & Eritrea." },
      { id: "w-gib", x: 168, y: 98, type: "Strait", name: "Strait of Gibraltar", fact: "Connects Atlantic Ocean to Mediterranean Sea, separating Spain (Europe) from Morocco (Africa)." },
      { id: "w-and", x: 108, y: 175, type: "Mountain", name: "Andes Mountains (South America)", fact: "Longest continental mountain range in the world; formed by Nazca–South American plate subduction." },
      { id: "w-sah", x: 192, y: 120, type: "Desert", name: "Sahara Desert", fact: "World's largest hot desert spanning North Africa; influenced by subtropical high-pressure belt & cold Canary Current." }
    ];

    const MIND_MAPS = {
      constitution: {
        title: "Indian Constitution Mind Map",
        center: "Constitution of India (1950)",
        branches: [
          { title: "Preamble", color: "bg-royal-800", items: [
            { label: "Sovereign, Socialist, Secular", note: "42nd Amendment (1976) added Socialist, Secular, Integrity. Declares source of authority: 'We, the People of India'." },
            { label: "Justice, Liberty, Equality, Fraternity", note: "Social, Economic, Political Justice (Russian Rev); Liberty, Equality, Fraternity (French Rev)." }
          ]},
          { title: "Fundamental Rights (Part III)", color: "bg-emerald-600", items: [
            { label: "Art 14–18: Equality", note: "Rule of Law (Art 14), Non-discrimination (Art 15), Public Employment (Art 16), Untouchability abolished (Art 17)." },
            { label: "Art 19–22: Freedom & Life", note: "6 Freedoms (Art 19), Life & Personal Liberty (Art 21 — Maneka Gandhi due process)." },
            { label: "Art 32: Writs", note: "Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto." }
          ]},
          { title: "Union & Federalism", color: "bg-purple-600", items: [
            { label: "Parliament (Art 79–122)", note: "President + Lok Sabha + Rajya Sabha. Money Bill (Art 110), Joint Sitting (Art 108)." },
            { label: "Judiciary & Basic Structure", note: "Kesavananda Bharati (1973): Parliament cannot alter Basic Structure under Art 368." }
          ]},
          { title: "Constitutional Bodies", color: "bg-amber-600", items: [
            { label: "ECI (324) & UPSC (315)", note: "Independent guardians of free elections and merit-based civil services." },
            { label: "CAG (148) & FC (280)", note: "CAG audits public expenditure; Finance Commission recommends Centre-State tax devolution." }
          ]}
        ]
      },
      modernHistory: {
        title: "Modern Indian History Mind Map",
        center: "Indian National Movement (1857–1947)",
        branches: [
          { title: "Early Resistance & 1857", color: "bg-rose-700", items: [
            { label: "Tribal & Peasant Revolts", note: "Santhal (1855), Indigo (1859), Munda Ulgulan (Birsa Munda)." },
            { label: "Revolt of 1857", note: "Triggered by greased cartridges, Doctrine of Lapse, economic drain. Led to GOI Act 1858." }
          ]},
          { title: "Moderate & Extremist Era", color: "bg-royal-800", items: [
            { label: "INC (1885) & Drain Theory", note: "Dadabhai Naoroji's 'Poverty and Un-British Rule in India'; constitutional petitions." },
            { label: "Swadeshi (1905) & Home Rule", note: "Bengal Partition protest; Lal-Bal-Pal; Annie Besant & Tilak (1916)." }
          ]},
          { title: "Gandhian Mass Movements", color: "bg-emerald-600", items: [
            { label: "Non-Cooperation (1920–22)", note: "Khilafat synergy, boycott of titles/schools; withdrawn after Chauri Chaura." },
            { label: "Civil Disobedience (1930)", note: "Dandi Salt March, Gandhi-Irwin Pact, Round Table Conferences." },
            { label: "Quit India (1942)", note: "'Do or Die' call; parallel governments in Ballia, Tamluk, Satara." }
          ]},
          { title: "Constitutional Milestones", color: "bg-amber-600", items: [
            { label: "GOI Acts 1909, 1919, 1935", note: "Separate electorates (1909), Provincial Dyarchy (1919), Provincial Autonomy & Federal Court (1935)." },
            { label: "Cabinet Mission & 1947", note: "Constituent Assembly formed (1946); Mountbatten Plan -> Independence (Aug 15, 1947)." }
          ]}
        ]
      },
      economy: {
        title: "Indian Economy Mind Map",
        center: "Indian Economy Framework",
        branches: [
          { title: "Monetary Policy (RBI)", color: "bg-royal-800", items: [
            { label: "Repo, Reverse Repo, MSF", note: "MPC (6 members) targets CPI 4% ± 2% using policy rate corridors." },
            { label: "CRR, SLR & OMO", note: "Quantitative tools controlling commercial bank liquidity." }
          ]},
          { title: "Fiscal Policy & Budget", color: "bg-emerald-600", items: [
            { label: "Deficits & FRBM", note: "Fiscal Deficit = borrowing requirement; Revenue Deficit = revenue shortfall." },
            { label: "Taxation & GST", note: "Direct (Income/Corporate) vs Indirect (GST—101st Amendment, GST Council Art 279A)." }
          ]},
          { title: "External Sector", color: "bg-purple-600", items: [
            { label: "Balance of Payments", note: "Current Account (Trade + Remittances/Services) & Capital Account (FDI, FPI, ECB)." },
            { label: "Forex & Exchange Rate", note: "Managed float by RBI; Forex reserves include FCA, Gold, SDR, RTP." }
          ]}
        ]
      },
      environment: {
        title: "Environment & Ecology Mind Map",
        center: "Ecology & Climate Governance",
        branches: [
          { title: "Biodiversity Conservation", color: "bg-emerald-600", items: [
            { label: "In-situ Protection", note: "National Parks, Wildlife Sanctuaries, Biosphere Reserves, Sacred Groves." },
            { label: "Indian Hotspots (4)", note: "Himalayas, Western Ghats, Indo-Burma, Sundaland." }
          ]},
          { title: "Indian Environmental Laws", color: "bg-royal-800", items: [
            { label: "WPA 1972 & EPA 1986", note: "Schedules for species protection; EPA is umbrella legislation." },
            { label: "FRA 2006 & NGT 2010", note: "Recognizes tribal forest rights; NGT provides speedy environmental justice." }
          ]},
          { title: "Global Conventions", color: "bg-amber-600", items: [
            { label: "UNFCCC & Paris Agreement", note: "Limit warming < 2°C / 1.5°C; NDCs; India Net-Zero 2070." },
            { label: "Ramsar, CBD, CITES", note: "Wetlands (Ramsar), Biodiversity (Kunming-Montreal 30x30), Wildlife Trade (CITES)." }
          ]}
        ]
      }
    };

    /* =========================================================================
       6. APPLICATION STATE & FIREBASE PERSISTENCE (NO localStorage!)
       ========================================================================= */
    const DEFAULT_STATE = {
      lang: "en",
      wonderVersion: "1",
      activeTab: "dashboard",
      adminMode: false,
      currentStage: 1,
      targetExam: "UPSC CSE",
      xp: 120,
      streak: 1,
      studyHours: 4.5,
      completedTopics: ["his-anc-1", "pol-fnd-1"],
      bookmarks: ["pol-fnd-1"],
      personalNotes: {
        "pol-fnd-1": "Revise Kesavananda Bharati 1973 and 5 Writs under Article 32 before Prelims mock."
      },
      dailyTargets: [
        { id: "t1", text: "Complete 1 Polity NCERT/Standard Topic", done: true },
        { id: "t2", text: "Practice 5 Prelims MCQs + Review Explanations", done: false },
        { id: "t3", text: "Read 2 Daily Current Affairs Briefs", done: false },
        { id: "t4", text: "Write 1 Mains 10-Mark Answer & Get AI Feedback", done: false }
      ],
      // Spaced Repetition History: { [questionId]: { attempts, correct, stageIdx (0..5), nextReviewAt (timestamp), lastWrong } }
      // Intervals: 1h, 1d, 5d, 7d, 14d, 21d
      questionHistory: {},
      mockHistory: [
        { date: "Nov 18", title: "GS Foundation Mini-Mock", score: 11.34, maxScore: 20, accuracy: 70, timeSec: 420 },
        { date: "Nov 21", title: "Polity & History Sprint", score: 14.66, maxScore: 20, accuracy: 80, timeSec: 390 }
      ],
      dafProfile: {
        name: "Civil Services Aspirant",
        homeState: "Uttar Pradesh",
        district: "Lucknow",
        education: "B.Tech / B.A. Graduate",
        optional: "Political Science & IR",
        hobbies: "Reading Non-Fiction, Chess, Running"
      },
      customSyllabus: [],
      customQuestions: [],
      customCA: [],
      savedStudyPlan: null,
      masterRegistry: { files: [], records: [], lastAuditAt: null },
      masterDataMeta: { archived: [], versions: [], lastSearch: "" },
      duplicateAuditLog: []
    };

    let state = structuredClone(DEFAULT_STATE);
    let sessionSeenQuestions = new Set();
    let activeCharts = [];
    let activeMock = null;
    let mockTimerInterval = null;
    let mainsTimerInterval = null;
    let mentorMessages = [
      {
        role: "model",
        text: "Namaste! I am your **WONDER IAS Personal AI Mentor**. I know your current preparation stage, language preference, and weak topics. Ask me to explain any UPSC/PCS concept from zero, translate into natural Hindi, generate UPSC-standard MCQs, or craft a Mains answer structure!"
      }
    ];
    let interviewMessages = [
      {
        role: "model",
        text: "Good morning! Please have a seat. Welcome to the UPSC Personality Test Board. Let us begin with your DAF—tell us briefly about your educational background and why you want to join the Civil Services."
      }
    ];

    /* Firebase Setup (Following all 3 Mandatory Rules) */
    let db = null;
    let auth = null;
    let currentUser = null;
    let appId = typeof __app_id !== "undefined" ? __app_id : "wonder-ias-platform";

    async function initFirebase() {
      try {
        if (typeof __firebase_config === "undefined" || !__firebase_config) {
          updateSyncBadge("In-Memory Session Mode", "bg-amber-400");
          return;
        }
        const firebaseConfig = typeof __firebase_config === "string" ? JSON.parse(__firebase_config) : __firebase_config;
        const app = initializeApp(firebaseConfig);        auth = getAuth(app);
        db = getFirestore(app);

        // RULE 3: Auth BEFORE any Firestore queries
        if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
          const cred = await signInWithCustomToken(auth, __initial_auth_token);
          currentUser = cred.user;
        } else {
          const cred = await signInAnonymously(auth);
          currentUser = cred.user;
        }

        if (!currentUser) return;
        updateSyncBadge("Cloud Synced", "bg-emerald-400");

        // RULE 1: Strict Path /artifacts/{appId}/users/{userId}/{collectionName}/{docId}
        const profileRef = doc(db, "artifacts", appId, "users", currentUser.uid, "studentData", "profile");
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          const cloudData = snap.data();
          // Safe merge without overwriting defaults or resetting progress
          state = {
            ...DEFAULT_STATE,
            ...cloudData,
            wonderVersion: ["1","2","3","4"].includes(String(cloudData.wonderVersion)) ? String(cloudData.wonderVersion) : "1",
            dafProfile: { ...DEFAULT_STATE.dafProfile, ...(cloudData.dafProfile || {}) },
            personalNotes: { ...DEFAULT_STATE.personalNotes, ...(cloudData.personalNotes || {}) },
            questionHistory: { ...(cloudData.questionHistory || {}) }
          };
          normalizeMasterData();
          renderAll();
        } else {
          normalizeMasterData();
          await saveStateToCloud();
        }

        // Listen for shared admin content from public path
        const pubRef = collection(db, "artifacts", appId, "public", "data", "sharedContent");
        onSnapshot(
          pubRef,
          (snapshot) => {
            snapshot.forEach((d) => {
              const item = d.data();
              if(!item||!["topic","question","ca"].includes(item.kind))return;
              const key=item.kind==="topic"?"customSyllabus":item.kind==="question"?"customQuestions":"customCA";
              const merged=mergeImportedArray(state[key],[item],item.kind);
              if(merged.added){state[key]=merged.items;normalizeMasterData({log:false});renderAll();saveStateToCloud();}
            });
          },
          (err) => {
            console.warn("Public snapshot warning:", err?.message);
          }
        );
      } catch (err) {
        console.warn("Firebase init fallback:", err?.message);
        updateSyncBadge("Offline / Session Mode", "bg-amber-400");
      }
    }

    async function saveStateToCloud() {
      if (!db || !currentUser) return;
      try {
        const profileRef = doc(db, "artifacts", appId, "users", currentUser.uid, "studentData", "profile");
        await setDoc(profileRef, {
          ...state,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (err) {
        console.warn("Cloud save skipped:", err?.message);
      }
    }

    function updateSyncBadge(text, dotColor) {
      const html = `<span class="w-2 h-2 rounded-full ${dotColor}"></span><span>${text}</span>`;
      const d = document.getElementById("desktop-sync-status");
      const m = document.getElementById("mobile-sync-status");
      if (d) d.innerHTML = html;
      if (m) m.innerHTML = html;
    }

    /* =========================================================================
       7. GEMINI API HELPER (EXPONENTIAL BACKOFF, NO HARDCODED KEYS)
       ========================================================================= */
    async function callGeminiAPI(userPrompt, systemInstruction = "", useGrounding = false) {
      const apiKey = ""; // Runtime-provided
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }]
      };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      if (useGrounding) {
        payload.tools = [{ google_search: {} }];
      }

      const delays = [1000, 2000, 4000];
      for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
          throw new Error("Empty response");
        } catch (err) {
          if (attempt < delays.length) {
            await new Promise(r => setTimeout(r, delays[attempt]));
          } else {
            return "⚠️ AI Mentor is temporarily busy or offline. Please check your connection and try again in a moment.";
          }
        }
      }
    }

    /* =========================================================================
       8. UTILITY FUNCTIONS (TOASTS, MODALS, SPACED REPETITION, ANALYTICS)
       ========================================================================= */
    function showToast(msg, type = "info") {
      const colors = {
        info: "bg-navy-900 text-white border-royal-600",
        success: "bg-emerald-700 text-white border-emerald-400",
        warning: "bg-amber-600 text-white border-amber-300",
        error: "bg-rose-700 text-white border-rose-400"
      };
      const container = document.getElementById("toast-container");
      const el = document.createElement("div");
      el.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg border-l-4 text-sm font-medium flex items-center justify-between gap-3 fade-in ${colors[type] || colors.info}`;
      el.innerHTML = `<span>${msg}</span><button class="opacity-75 hover:opacity-100" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }

    function openModal(title, subtitle, bodyHtml, footerHtml = "") {
      document.getElementById("modal-title").textContent = title;
      document.getElementById("modal-subtitle").textContent = subtitle || "";
      document.getElementById("modal-body").innerHTML = bodyHtml;
      const footer = document.getElementById("modal-footer");
      if (footerHtml) {
        footer.innerHTML = footerHtml;
        footer.classList.remove("hidden");
      } else {
        footer.innerHTML = "";
        footer.classList.add("hidden");
      }
      document.getElementById("app-modal").classList.remove("hidden");
    }

    function closeModal() {
      document.getElementById("app-modal").classList.add("hidden");
    }

    function formatMarkdown(text) {
      if (!text) return "";
      return text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-navy-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h4 class="font-bold text-royal-800 text-base mt-3 mb-1">$1</h4>')
        .replace(/^## (.*$)/gim, '<h3 class="font-extrabold text-navy-900 text-lg mt-4 mb-1.5">$1</h3>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/\n/g, "<br>");
    }

    function getAllSyllabus() {
      return [...INITIAL_SYLLABUS, ...(state.customSyllabus || [])];
    }

    function getAllQuestions() {
      return [...INITIAL_QUESTIONS, ...(state.customQuestions || [])];
    }

    function getAllCA() {
      return [...INITIAL_CURRENT_AFFAIRS, ...(state.customCA || [])];
    }

    /* =========================================================================
       MASTER DATA / ONE FILE, ZERO DUPLICATES
       ========================================================================= */
    function normalizeMasterText(value) { return String(value||"").toLowerCase().normalize("NFKC").replace(/[^\\p{L}\\p{N}]+/gu," ").trim().replace(/\\s+/g," "); }
    function stableRecordHash(text){let h1=0x811c9dc5,h2=0x9e3779b9;for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);h1=Math.imul(h1^c,0x01000193);h2=Math.imul(h2^c,0x85ebca6b);}return(h1>>>0).toString(16).padStart(8,"0")+(h2>>>0).toString(16).padStart(8,"0");}
    const MASTER_ID_PREFIX={topic:"TOP",question:"QUE",ca:"CA"};
    function createPermanentId(kind){return(MASTER_ID_PREFIX[kind]||"REC")+"-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).slice(2,8).toUpperCase();}
    function ensurePermanentIds(items,kind){let assigned=0;for(const item of(Array.isArray(items)?items:[])){if(!item||typeof item!=="object")continue;if(!String(item.id||"").trim()){item.id=createPermanentId(kind);assigned++;}if(!Number.isInteger(item.recordVersion))item.recordVersion=1;if(!item.createdAt)item.createdAt=Date.now();item.updatedAt=item.updatedAt||item.createdAt;item.status=item.status||"active";item.tags=Array.isArray(item.tags)?item.tags:[];}return assigned;}
    function recordFingerprint(kind,record){if(kind==="question")return stableRecordHash([normalizeMasterText(record.q||record.question),...(record.options||[]).map(normalizeMasterText)].join("|"));if(kind==="topic")return stableRecordHash([normalizeMasterText(record.subject),normalizeMasterText(record.title||record.hiTitle)].join("|"));if(kind==="ca")return stableRecordHash([normalizeMasterText(record.title||record.headline),normalizeMasterText(record.date||record.year||"")].join("|"));return stableRecordHash(normalizeMasterText(record.title||record.name||record.id));}
    function recordCandidates(kind){const initial=kind==="topic"?INITIAL_SYLLABUS:kind==="question"?INITIAL_QUESTIONS:INITIAL_CURRENT_AFFAIRS;const custom=kind==="topic"?state.customSyllabus:kind==="question"?state.customQuestions:state.customCA;return [...initial,...(custom||[])];}
    function getMasterRecordById(kind,id){return recordCandidates(kind).find(x=>String(x.id)===String(id))||null;}
    function escapeMasterHTML(value) {
      return String(value ?? "").replace(/[&<>\"']/g, ch => {
        if (ch === "&") return "&amp;";
        if (ch === "<") return "&lt;";
        if (ch === ">") return "&gt;";
        if (ch === "\"") return "&quot;";
        return "&#39;";
      });
    }
    function masterDataRecords() {
      return [
        ...recordCandidates("topic").map(record=>({kind:"topic",record,title:record.title||record.hiTitle||"Untitled topic",subject:record.subject||"Unassigned",id:record.id})),
        ...recordCandidates("question").map(record=>({kind:"question",record,title:record.q||record.question||"Untitled question",subject:record.subject||"Unassigned",id:record.id})),
        ...recordCandidates("ca").map(record=>({kind:"ca",record,title:record.title||record.headline||"Untitled current affair",subject:record.category||record.subject||"Current Affairs",id:record.id}))
      ];
    }
    function masterDataHealth(){const records=masterDataRecords(),ids=records.map(x=>x.id).filter(Boolean);return{total:records.length,topics:recordCandidates("topic").length,questions:recordCandidates("question").length,currentAffairs:recordCandidates("ca").length,missingIds:records.filter(x=>!x.id).length,duplicateIds:ids.length-new Set(ids).size,incomplete:records.filter(x=>!String(x.title||"").trim()||!String(x.subject||"").trim()).length,archived:(state.masterDataMeta?.archived||[]).length,brokenReferences:countBrokenMasterReferences(),registeredFiles:(state.masterRegistry?.files||[]).length,registeredRecords:(state.masterRegistry?.records||[]).length};}
    function countBrokenMasterReferences(){const topics=new Set(recordCandidates("topic").map(x=>String(x.id))),questions=new Set(recordCandidates("question").map(x=>String(x.id)));let n=0;for(const id of [...(state.completedTopics||[]),...(state.bookmarks||[])])if(!topics.has(String(id)))n++;for(const id of Object.keys(state.questionHistory||{}))if(!questions.has(String(id)))n++;return n;}
    function searchMasterData(query){const q=normalizeMasterText(query);return masterDataRecords().filter(x=>!q||normalizeMasterText([x.title,x.subject,x.id,x.kind,x.record.paper,x.record.topic,x.record.year,x.record.category,x.record.q,x.record.hiQ,(x.record.options||[]).join(" ")].join(" ")).includes(q));}
    function dedupeRegistryFiles(files) {
      const seen = new Set(); return (Array.isArray(files)?files:[]).filter(file=>{
        const key=normalizeMasterText(file.hash || file.name || file.path || JSON.stringify(file));
        if(!key || seen.has(key)) return false; seen.add(key); return true;
      });
    }

    function dedupeMasterArray(items,kind){const byId=new Map(),byFingerprint=new Map(),kept=[];let removed=0,merged=0;for(const item of(Array.isArray(items)?items:[])){if(!item||typeof item!=="object")continue;const id=String(item.id||""),fp=recordFingerprint(kind,item),master=(id&&byId.get(id))||(fp&&byFingerprint.get(fp));if(master){const masterId=master.id;for(const [key,value] of Object.entries(item))if((master[key]===undefined||master[key]===null||master[key]==="")&&value!==undefined)master[key]=value;if(masterId)master.id=masterId;removed++;merged++;continue;}kept.push(item);if(id)byId.set(id,item);if(fp)byFingerprint.set(fp,item);}return{items:kept,removed,merged};}
    function normalizeMasterData({log=true}={}) {
      state.customSyllabus = Array.isArray(state.customSyllabus) ? state.customSyllabus : [];
      state.customQuestions = Array.isArray(state.customQuestions) ? state.customQuestions : [];
      state.customCA = Array.isArray(state.customCA) ? state.customCA : [];
      state.masterRegistry = state.masterRegistry && typeof state.masterRegistry === "object"
        ? state.masterRegistry : { files: [], records: [], lastAuditAt: null };
      state.masterRegistry.files = Array.isArray(state.masterRegistry.files) ? state.masterRegistry.files : [];
      state.masterRegistry.records = Array.isArray(state.masterRegistry.records) ? state.masterRegistry.records : [];
      state.duplicateAuditLog = Array.isArray(state.duplicateAuditLog) ? state.duplicateAuditLog : [];
      state.masterDataMeta = state.masterDataMeta && typeof state.masterDataMeta === "object" ? state.masterDataMeta : { archived: [], versions: [], lastSearch: "" };
      state.masterDataMeta.archived = Array.isArray(state.masterDataMeta.archived) ? state.masterDataMeta.archived : [];
      state.masterDataMeta.versions = Array.isArray(state.masterDataMeta.versions) ? state.masterDataMeta.versions : [];
      const assigned={topics:ensurePermanentIds(INITIAL_SYLLABUS,"topic"),questions:ensurePermanentIds(INITIAL_QUESTIONS,"question"),currentAffairs:ensurePermanentIds(INITIAL_CURRENT_AFFAIRS,"ca")};
      assigned.topics+=ensurePermanentIds(state.customSyllabus,"topic");assigned.questions+=ensurePermanentIds(state.customQuestions,"question");assigned.currentAffairs+=ensurePermanentIds(state.customCA,"ca");
      const topics=dedupeMasterArray(state.customSyllabus,"topic"),questions=dedupeMasterArray(state.customQuestions,"question"),ca=dedupeMasterArray(state.customCA,"ca");
      state.customSyllabus=topics.items;state.customQuestions=questions.items;state.customCA=ca.items;
      state.masterRegistry.records=[...recordCandidates("topic").map(x=>({id:x.id,kind:"topic",fingerprint:recordFingerprint("topic",x)})),...recordCandidates("question").map(x=>({id:x.id,kind:"question",fingerprint:recordFingerprint("question",x)})),...recordCandidates("ca").map(x=>({id:x.id,kind:"ca",fingerprint:recordFingerprint("ca",x)}))];
      const removed = topics.removed + questions.removed + ca.removed;
      if(log&&(removed||Object.values(assigned).some(Boolean)))state.duplicateAuditLog.push({at:Date.now(),action:"MASTER_NORMALIZE",removed,assignedIds:assigned,details:{topics:topics.removed,questions:questions.removed,currentAffairs:ca.removed}});
      return{topicsRemoved:topics.removed,questionsRemoved:questions.removed,caRemoved:ca.removed,totalRemoved:removed,assignedIds:assigned};
    }
    function runDuplicateAudit() {
      const groups=[{name:"All Syllabus Topics",kind:"topic",records:recordCandidates("topic")},{name:"All Questions",kind:"question",records:recordCandidates("question")},{name:"All Current Affairs",kind:"ca",records:recordCandidates("ca")}];
      const duplicateGroups = [];
      let duplicateCount = 0;
      for (const group of groups) {
        const map = new Map();
        for (const record of group.records) {
          const fp = recordFingerprint(group.kind, record);
          if (!fp) continue;
          if (!map.has(fp)) map.set(fp, []);
          map.get(fp).push(record);
        }
        for (const [fingerprint, records] of map.entries()) {
          if (records.length > 1) {
            duplicateCount += records.length - 1;
            duplicateGroups.push({ section: group.name, fingerprint, ids: records.map(x=>x.id), titles: records.map(x=>x.title || x.q || x.headline || "(untitled)") });
          }
        }
      }
      const report = { at: Date.now(), customTopics: state.customSyllabus.length, customQuestions: state.customQuestions.length, customCA: state.customCA.length, registeredFiles: state.masterRegistry.files.length, duplicateGroups, duplicateCount };
      state.masterRegistry.lastAuditAt = report.at;
      state.duplicateAuditLog.push({ at: report.at, action: "AUDIT", duplicateCount, duplicateGroups: duplicateGroups.length });
      return report;
    }
    function mergeImportedArray(existing,incoming,kind){const current=dedupeMasterArray(existing,kind).items,byId=new Map(current.filter(x=>x.id).map(x=>[String(x.id),x])),fingerprints=new Set(current.map(x=>recordFingerprint(kind,x)));let added=0,skipped=0;for(const raw of(Array.isArray(incoming)?incoming:[])){if(!raw||typeof raw!=="object"){skipped++;continue;}const item={...raw};if(!item.id)item.id=createPermanentId(kind);const id=String(item.id),fp=recordFingerprint(kind,item);if(byId.has(id)||(fp&&fingerprints.has(fp))){skipped++;continue;}item.recordVersion=Number.isInteger(item.recordVersion)?item.recordVersion:1;item.createdAt=item.createdAt||Date.now();item.updatedAt=item.updatedAt||item.createdAt;item.status=item.status||"active";item.tags=Array.isArray(item.tags)?item.tags:[];current.push(item);byId.set(id,item);if(fp)fingerprints.add(fp);added++;}return{items:current,added,skipped,updated:0};}

    function addXP(points, reason) {
      state.xp += points;
      updateHeaderStats();
      saveStateToCloud();
      if (reason) showToast(`+${points} XP — ${reason}`, "success");
    }

    // Spaced Repetition Intervals (ms): 1h, 1d, 5d, 7d, 14d, 21d
    const SR_INTERVALS_MS = [
      1 * 3600 * 1000,
      24 * 3600 * 1000,
      5 * 24 * 3600 * 1000,
      7 * 24 * 3600 * 1000,
      14 * 24 * 3600 * 1000,
      21 * 24 * 3600 * 1000
    ];
    const SR_LABELS = ["1 Hour", "1 Day", "5 Days", "7 Days", "14 Days", "21 Days"];

    function recordQuestionAttempt(qId, isCorrect) {
      const prev = state.questionHistory[qId] || { attempts: 0, correct: 0, stageIdx: 0 };
      const attempts = prev.attempts + 1;
      const correct = prev.correct + (isCorrect ? 1 : 0);
      // Wrong answers reset to earlier revision (1 Hour); Correct advances along 1h->1d->5d->7d->14d->21d
      const stageIdx = isCorrect ? Math.min(prev.stageIdx + 1, SR_INTERVALS_MS.length - 1) : 0;
      const nextReviewAt = Date.now() + SR_INTERVALS_MS[stageIdx];

      state.questionHistory[qId] = {
        attempts, correct, stageIdx, nextReviewAt, lastWrong: !isCorrect, lastAttemptAt: Date.now()
      };
      sessionSeenQuestions.add(qId);
      addXP(isCorrect ? 15 : 5);
      saveStateToCloud();
    }

    function getDueRevisions() {
      const now = Date.now();
      return getAllQuestions().filter(q => {
        const h = state.questionHistory[q.id];
        return h && (h.lastWrong || h.nextReviewAt <= now);
      });
    }

    function getWeakTopics() {
      const map = {};
      getAllQuestions().forEach(q => {
        const h = state.questionHistory[q.id];
        if (h && h.attempts > 0) {
          if (!map[q.subject]) map[q.subject] = { attempts: 0, correct: 0 };
          map[q.subject].attempts += h.attempts;
          map[q.subject].correct += h.correct;
        }
      });
      const weak = Object.entries(map)
        .filter(([, v]) => (v.correct / v.attempts) < 0.7)
        .map(([subj, v]) => ({ subject: subj, accuracy: Math.round((v.correct / v.attempts) * 100) }));
      return weak.length ? weak : [{ subject: "Economy", accuracy: 58 }, { subject: "Environment", accuracy: 64 }];
    }

    function getOverallPrepPercent() {
      const total = getAllSyllabus().length;
      const done = state.completedTopics.length;
      const sylPct = total ? (done / total) * 60 : 0;
      const stagePct = (state.currentStage / 10) * 25;
      const qCount = Object.keys(state.questionHistory).length;
      const qPct = Math.min(15, (qCount / Math.max(1, getAllQuestions().length)) * 15);
      return Math.min(100, Math.round(sylPct + stagePct + qPct));
    }

    function getBadges() {
      const qAttempted = Object.keys(state.questionHistory).length;
      return [
        { icon: "fa-landmark", name: "Constitution Master", unlocked: state.completedTopics.includes("pol-fnd-1"), color: "text-royal-700 bg-royal-50 border-royal-200" },
        { icon: "fa-scroll", name: "History Explorer", unlocked: state.completedTopics.includes("his-anc-1"), color: "text-amber-700 bg-amber-50 border-amber-200" },
        { icon: "fa-earth-asia", name: "Geography Champion", unlocked: state.completedTopics.includes("geo-phy-1"), color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
        { icon: "fa-fire", name: "21-Day Revision Streak", unlocked: state.streak >= 21, color: "text-rose-700 bg-rose-50 border-rose-200" },
        { icon: "fa-trophy", name: "Prelims Warrior", unlocked: qAttempted >= 5 || state.mockHistory.length >= 2, color: "text-purple-700 bg-purple-50 border-purple-200" }
      ];
    }

    /* =========================================================================
       9. NAVIGATION & HEADER RENDERING
       ========================================================================= */
    const NAV_ITEMS = [
      { id: "dashboard", icon: "fa-gauge-high", key: "dashboard" },
      { id: "syllabus", icon: "fa-book-open", key: "syllabus" },
      { id: "maps", icon: "fa-map-location-dot", key: "maps" },
      { id: "currentAffairs", icon: "fa-newspaper", key: "currentAffairs" },
      { id: "prelims", icon: "fa-list-check", key: "prelims" },
      { id: "mains", icon: "fa-pen-nib", key: "mains" },
      { id: "interview", icon: "fa-user-tie", key: "interview" },
      { id: "mentor", icon: "fa-robot", key: "mentor" },
      { id: "studyPlan", icon: "fa-calendar-days", key: "studyPlan" },
      { id: "admin", icon: "fa-screwdriver-wrench", key: "admin" }
    ];

    function applyWonderVersion(version, rerender = false) {
      const allowed = ["1", "2", "3", "4"];
      const v = allowed.includes(String(version)) ? String(version) : "1";
      state.wonderVersion = v;
      document.body.setAttribute("data-wonder-version", v);
      const selector = document.getElementById("wonder-version-control");
      if (selector) selector.value = v;
      const label = document.getElementById("wonder-version-label");
      if (label) label.textContent = `V${v}`;
      const names = { "1":"Classic", "2":"Ocean", "3":"Midnight", "4":"Minimal" };
      if (selector) selector.title = `Version ${v} — ${names[v]}`;
      if (rerender) renderAll();
      return v;
    }

    function renderNavigation() {
      const t = UI_STRINGS[state.lang];
      const navHtml = NAV_ITEMS.map(item => {
        const active = state.activeTab === item.id;
        return `
          <button onclick="W.navigate('${item.id}')"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              active
                ? "bg-royal-700 text-white shadow-md shadow-royal-900/40"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }">
            <i class="fa-solid ${item.icon} w-5 text-center ${active ? "text-gold-400" : "text-slate-400"}"></i>
            <span class="truncate">${t[item.key]}</span>
          </button>
        `;
      }).join("");

      document.getElementById("desktop-sidebar-nav").innerHTML = navHtml;
      document.getElementById("mobile-drawer-nav").innerHTML = navHtml;

      document.querySelectorAll(".mob-nav-btn").forEach(btn => {
        const active = btn.dataset.nav === state.activeTab;
        btn.className = `mob-nav-btn flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-semibold transition ${
          active ? "text-royal-800 bg-royal-50" : "text-slate-500"
        }`;
      });
    }

    function updateHeaderStats() {
      document.getElementById("header-streak").textContent = state.streak;
      document.getElementById("header-xp").textContent = `${state.xp} XP`;
      document.getElementById("sidebar-stage-num").textContent = `Stage ${state.currentStage}/10`;
      document.getElementById("sidebar-stage-bar").style.width = `${state.currentStage * 10}%`;

      ["en", "hi", "bi"].forEach(l => {
        const btn = document.getElementById(`lang-btn-${l}`);
        if (btn) {
          btn.className = l === state.lang
            ? "px-2 sm:px-2.5 py-1.5 rounded-lg bg-royal-800 text-white shadow-sm transition"
            : "px-2 sm:px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-navy-900 transition";
        }
      });

      const roleBtn = document.getElementById("role-toggle-btn");
      const roleLbl = document.getElementById("role-toggle-label");
      if (state.adminMode) {
        roleBtn.className = "px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition";
        roleLbl.textContent = "Admin";
      } else {
        roleBtn.className = "px-2.5 py-1.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-xs font-semibold flex items-center gap-1.5 transition";
        roleLbl.textContent = "Student";
      }
    }

    function destroyCharts() {
      activeCharts.forEach(c => { try { c.destroy(); } catch {} });
      activeCharts = [];
    }

    /* =========================================================================
       10. VIEW 1: STUDENT DASHBOARD & ANALYTICS
       ========================================================================= */
    function renderDashboard() {
      const t = UI_STRINGS[state.lang];
      const prepPct = getOverallPrepPercent();
      const dueRevs = getDueRevisions();
      const weakTopics = getWeakTopics();
      const badges = getBadges();
      const totalTopics = getAllSyllabus().length;
      const stageObj = STAGES[state.currentStage - 1];

      const html = `
        <!-- Hero Banner -->
        <section class="hero-gradient rounded-2xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div class="absolute right-0 top-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-gold-400">
                <i class="fa-solid fa-crown"></i>
                <span>${t.tagline}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">${t.welcome}</h2>
              <p class="text-sm text-slate-300 max-w-2xl">
                Active Stage: <strong class="text-white">Stage ${stageObj.id} — ${state.lang === 'hi' ? stageObj.hi : stageObj.en}</strong>
                • Target: <strong class="text-gold-400">${state.targetExam}</strong>
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[110px]">
                <div class="text-2xl font-black text-gold-400">${prepPct}%</div>
                <div class="text-[11px] text-slate-300 font-medium">Overall Prep</div>
              </div>
              <button onclick="W.navigate('syllabus')" class="px-5 py-3 rounded-xl gold-gradient text-navy-900 font-bold text-sm shadow-lg hover:brightness-105 transition flex items-center gap-2">
                <i class="fa-solid fa-play"></i> Continue Learning
              </button>
            </div>
          </div>
        </section>

        <!-- 10-Stage Student Journey Tracker -->
        <section class="glass-card rounded-2xl p-5 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 class="font-extrabold text-navy-900 text-base sm:text-lg flex items-center gap-2">
                <i class="fa-solid fa-route text-royal-700"></i> 10-Stage Civil Services Journey
              </h3>
              <p class="text-xs text-slate-500">Tap any stage to update your current preparation milestone</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-royal-50 text-royal-800 text-xs font-bold border border-royal-200">
              Stage ${state.currentStage} of 10
            </span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            ${STAGES.map(st => {
              const isDone = st.id < state.currentStage;
              const isCurr = st.id === state.currentStage;
              return `
                <button onclick="W.setStage(${st.id})"
                  class="text-left p-3 rounded-xl border transition relative ${
                    isCurr
                      ? "bg-royal-800 text-white border-royal-900 shadow-md ring-2 ring-gold-400"
                      : isDone
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider ${isCurr ? 'text-gold-400' : isDone ? 'text-emerald-700' : 'text-slate-400'}">Stage ${st.id}</span>
                    ${isDone ? '<i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i>' : isCurr ? '<i class="fa-solid fa-location-dot text-gold-400 text-xs"></i>' : ''}
                  </div>
                  <div class="text-xs font-bold leading-snug">${state.lang === 'hi' ? st.hi : st.en}</div>
                </button>
              `;
            }).join("")}
          </div>
        </section>

        <!-- KPI Summary Row -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="glass-card rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-royal-100 text-royal-800 flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-book-bookmark"></i></div>
            <div>
              <div class="text-xl font-extrabold text-navy-900">${state.completedTopics.length}/${totalTopics}</div>
              <div class="text-xs text-slate-500 font-medium">Syllabus Completed</div>
            </div>
          </div>
          <div class="glass-card rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-clock-rotate-left"></i></div>
            <div>
              <div class="text-xl font-extrabold text-navy-900">${dueRevs.length} Due</div>
              <div class="text-xs text-slate-500 font-medium">Spaced Revision</div>
            </div>
          </div>
          <div class="glass-card rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-stopwatch"></i></div>
            <div>
              <div class="text-xl font-extrabold text-navy-900">${state.studyHours} hrs</div>
              <div class="text-xs text-slate-500 font-medium">Study Hours Logged</div>
            </div>
          </div>
          <div class="glass-card rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-bolt"></i></div>
            <div>
              <div class="text-xl font-extrabold text-navy-900">${state.xp} XP</div>
              <div class="text-xs text-slate-500 font-medium">Streak: ${state.streak} Days</div>
            </div>
          </div>
        </section>

        <!-- Quick Action Hub -->
        <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          ${[
            { tab: "currentAffairs", icon: "fa-newspaper", label: "Current Affairs", color: "bg-royal-50 text-royal-800 border-royal-200" },
            { tab: "prelims", icon: "fa-bullseye", label: "Prelims Practice", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
            { tab: "mains", icon: "fa-pen-fancy", label: "Mains Writing", color: "bg-purple-50 text-purple-800 border-purple-200" },
            { tab: "maps", icon: "fa-map", label: "Maps & Mind Maps", color: "bg-amber-50 text-amber-800 border-amber-200" },
            { tab: "interview", icon: "fa-microphone-lines", label: "AI Interview", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
            { tab: "studyPlan", icon: "fa-calendar-check", label: "Study Planner", color: "bg-teal-50 text-teal-800 border-teal-200" }
          ].map(q => `
            <button onclick="W.navigate('${q.tab}')" class="p-3.5 rounded-2xl border ${q.color} hover:shadow-md transition flex flex-col items-center justify-center gap-2 text-center">
              <i class="fa-solid ${q.icon} text-xl"></i>
              <span class="text-xs font-bold">${q.label}</span>
            </button>
          `).join("")}
        </section>

        <!-- Today's Target + Weak Topics & Revision Due -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Today's Target Checklist -->
          <div class="glass-card rounded-2xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-navy-900 flex items-center gap-2"><i class="fa-solid fa-list-check text-emerald-600"></i> Today's Target</h3>
              <button onclick="W.logStudyHour()" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100">+0.5 Hr Logged</button>
            </div>
            <div class="space-y-2.5">
              ${state.dailyTargets.map(item => `
                <label class="flex items-center gap-3 p-3 rounded-xl border ${item.done ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'} cursor-pointer">
                  <input type="checkbox" ${item.done ? 'checked' : ''} onchange="W.toggleDailyTarget('${item.id}')" class="w-4 h-4 accent-emerald-600 rounded" />
                  <span class="text-sm font-medium ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}">${item.text}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <!-- Weak Topics & Revision Alerts -->
          <div class="glass-card rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h3 class="font-bold text-navy-900 flex items-center gap-2 mb-3"><i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Weak Topics & Revision Radar</h3>
              <div class="space-y-2.5">
                ${weakTopics.map(w => `
                  <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <div>
                      <div class="text-sm font-bold text-navy-900">${w.subject}</div>
                      <div class="text-xs text-amber-700">Accuracy: ${w.accuracy}% — Needs targeted revision</div>
                    </div>
                    <button onclick="W.askMentorQuick('Create a 3-day revision crash plan for my weak subject: ${w.subject}')" class="px-3 py-1.5 rounded-lg bg-royal-800 text-white text-xs font-semibold hover:bg-royal-900">Fix with AI</button>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="p-3.5 rounded-xl bg-royal-50 border border-royal-200 flex items-center justify-between gap-3">
              <div>
                <div class="text-xs font-bold text-royal-900">Spaced Repetition Engine (1h → 21d)</div>
                <div class="text-xs text-royal-700">${dueRevs.length} question(s) scheduled for active recall</div>
              </div>
              <button onclick="W.navigate('prelims')" class="px-3.5 py-2 rounded-xl bg-royal-800 text-white text-xs font-bold shrink-0">Revise Now</button>
            </div>
          </div>
        </section>

        <!-- Interactive Analytics Charts (Chart.js) -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="glass-card rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-navy-900 text-sm mb-3"><i class="fa-solid fa-chart-column text-royal-700 mr-1.5"></i> Subject Mastery (%)</h3>
            <div class="h-56"><canvas id="chart-subject-mastery"></canvas></div>
          </div>
          <div class="glass-card rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-navy-900 text-sm mb-3"><i class="fa-solid fa-chart-line text-emerald-600 mr-1.5"></i> Mock Test Score Trend</h3>
            <div class="h-56"><canvas id="chart-mock-trend"></canvas></div>
          </div>
          <div class="glass-card rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-navy-900 text-sm mb-3"><i class="fa-solid fa-chart-pie text-purple-600 mr-1.5"></i> UPSC Prelims PYQ Weightage</h3>
            <div class="h-56"><canvas id="chart-pyq-weightage"></canvas></div>
          </div>
        </section>

        <!-- Gamification: Badges & Leaderboard -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="lg:col-span-2 glass-card rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-navy-900 mb-3 flex items-center gap-2"><i class="fa-solid fa-medal text-gold-500"></i> Achievement Badges</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${badges.map(b => `
                <div class="p-3 rounded-xl border flex items-center gap-3 ${b.unlocked ? b.color : 'bg-slate-50 border-slate-200 opacity-55 grayscale'}">
                  <div class="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shrink-0"><i class="fa-solid ${b.icon}"></i></div>
                  <div class="min-w-0">
                    <div class="text-xs font-bold truncate">${b.name}</div>
                    <div class="text-[10px] font-semibold">${b.unlocked ? 'Unlocked' : 'Locked'}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="glass-card rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-navy-900 mb-3 flex items-center gap-2"><i class="fa-solid fa-ranking-star text-purple-600"></i> Weekly Leaderboard</h3>
            <div class="space-y-2 text-xs">
              ${[
                { name: "Aarav Sharma (UPSC)", xp: 1480 },
                { name: "Priya Verma (UPPSC)", xp: 1210 },
                { name: `${state.dafProfile.name} (You)`, xp: state.xp, isMe: true },
                { name: "Rohan Das (BPSC)", xp: 95 }
              ].sort((a,b) => b.xp - a.xp).map((u, idx) => `
                <div class="flex items-center justify-between p-2.5 rounded-xl ${u.isMe ? 'bg-royal-50 border border-royal-200 font-bold text-royal-900' : 'bg-slate-50 text-slate-700'}">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-navy-900 text-white flex items-center justify-center text-[10px] font-bold">${idx + 1}</span>
                    <span>${u.name}</span>
                  </div>
                  <span class="font-bold text-purple-700">${u.xp} XP</span>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;

      document.getElementById("app-content").innerHTML = html;
      initDashboardCharts();
    }

    function initDashboardCharts() {
      destroyCharts();
      const subjects = ["History", "Geography", "Polity", "Economy", "Environment", "Science & Tech", "Ethics (GS-IV)"];
      const masteryData = subjects.map(s => {
        const list = getAllSyllabus().filter(t => t.subject === s);
        const done = list.filter(t => state.completedTopics.includes(t.id)).length;
        return list.length ? Math.round((done / list.length) * 100) : 0;
      });

      const c1 = new Chart(document.getElementById("chart-subject-mastery"), {
        type: "bar",
        data: {
          labels: subjects.map(s => s.replace(" (GS-IV)", "")),
          datasets: [{ label: "Mastery %", data: masteryData, backgroundColor: "#1e3a8a", borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
      });

      const c2 = new Chart(document.getElementById("chart-mock-trend"), {
        type: "line",
        data: {
          labels: state.mockHistory.map(m => m.date),
          datasets: [{
            label: "Accuracy %",
            data: state.mockHistory.map(m => m.accuracy),
            borderColor: "#059669",
            backgroundColor: "rgba(5, 150, 105, 0.12)",
            fill: true,
            tension: 0.35
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
      });

      const c3 = new Chart(document.getElementById("chart-pyq-weightage"), {
        type: "doughnut",
        data: {
          labels: ["Polity", "Economy", "Environment", "History", "Geography", "Sci-Tech & IR"],
          datasets: [{
            data: [18, 18, 17, 16, 15, 16],
            backgroundColor: ["#1e3a8a", "#059669", "#10b981", "#d97706", "#7c3aed", "#0284c7"]
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } }
      });

      activeCharts.push(c1, c2, c3);
    }

    /* =========================================================================
       11. VIEW 2: COMPLETE UPSC SYLLABUS MAP, NOTES & OPTIONAL SUBJECTS
       ========================================================================= */
    let syllabusFilter = { subject: "ALL", search: "", showOptionals: false };

    function renderSyllabus() {
      const all = getAllSyllabus();
      const subjects = ["ALL", ...new Set(all.map(t => t.subject))];
      const filtered = all.filter(t => {
        const matchSubj = syllabusFilter.subject === "ALL" || t.subject === syllabusFilter.subject;
        const q = syllabusFilter.search.toLowerCase();
        const matchQ = !q || t.title.toLowerCase().includes(q) || t.hiTitle.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
        return matchSubj && matchQ;
      });

      const html = `
        <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Complete UPSC & State PCS Syllabus Map</h2>
            <p class="text-xs sm:text-sm text-slate-500">Zero-to-Advanced structured lessons, bilingual notes, Ethics case studies & 10 Optionals</p>
          </div>
          <div class="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-xs self-start">
            <button onclick="W.setSyllabusMode(false)" class="px-3.5 py-1.5 rounded-lg text-xs font-bold ${!syllabusFilter.showOptionals ? 'bg-royal-800 text-white' : 'text-slate-600'}">GS & Ethics (I–IV)</button>
            <button onclick="W.setSyllabusMode(true)" class="px-3.5 py-1.5 rounded-lg text-xs font-bold ${syllabusFilter.showOptionals ? 'bg-purple-700 text-white' : 'text-slate-600'}">Optional Subjects (10)</button>
          </div>
        </section>

        ${syllabusFilter.showOptionals ? renderOptionalsSection() : `
          <!-- Filter Bar -->
          <div class="glass-card rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex flex-wrap gap-2">
              ${subjects.map(s => `
                <button onclick="W.filterSyllabusSubject('${s}')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    syllabusFilter.subject === s ? 'bg-royal-800 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }">${s}</button>
              `).join("")}
            </div>
            <input type="text" value="${syllabusFilter.search}" oninput="W.filterSyllabusSearch(this.value)"
              placeholder="Filter topics by title, Hindi keyword, or category..."
              class="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-royal-600 outline-none" />
          </div>

          <!-- Syllabus Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${filtered.map(topic => {
              const isDone = state.completedTopics.includes(topic.id);
              const isBookmarked = state.bookmarks.includes(topic.id);
              return `
                <div class="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4 border-l-4 ${isDone ? 'border-l-emerald-500' : 'border-l-royal-700'}">
                  <div>
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="px-2.5 py-0.5 rounded-full bg-royal-50 text-royal-800 text-[11px] font-bold">${topic.subject}</span>
                        <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${topic.paper}</span>
                        <span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">${topic.level}</span>
                      </div>
                      <button onclick="W.toggleBookmark('${topic.id}')" class="text-slate-400 hover:text-gold-500 transition" title="Bookmark">
                        <i class="fa-${isBookmarked ? 'solid text-gold-500' : 'regular'} fa-bookmark"></i>
                      </button>
                    </div>
                    <h3 class="font-extrabold text-navy-900 text-base leading-snug">${state.lang === 'hi' ? topic.hiTitle : topic.title}</h3>
                    ${state.lang === 'bi' ? `<p class="text-xs font-semibold text-royal-700 mt-0.5">${topic.hiTitle}</p>` : ''}
                    <p class="text-xs text-slate-600 mt-2 line-clamp-2">${state.lang === 'hi' ? topic.hiNotes : topic.quickNotes}</p>
                  </div>
                  <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <div class="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span><i class="fa-regular fa-clock mr-1"></i>${topic.estTime}</span>
                      <button onclick="W.toggleTopicComplete('${topic.id}')" class="font-bold ${isDone ? 'text-emerald-600' : 'text-slate-500 hover:text-royal-700'}">
                        <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'} mr-1"></i>${isDone ? 'Completed' : 'Mark Done'}
                      </button>
                    </div>
                    <button onclick="W.openTopicViewer('${topic.id}')" class="px-3.5 py-1.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-xs font-bold transition">
                      Open Lesson & Notes <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `}
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    function renderOptionalsSection() {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${OPTIONAL_SUBJECTS.map(opt => `
            <div class="glass-card rounded-2xl p-5 shadow-sm border-t-4 border-t-purple-600 flex flex-col justify-between gap-3">
              <div>
                <div class="flex items-center justify-between">
                  <h3 class="font-extrabold text-navy-900 text-base">${opt.name} <span class="text-xs font-semibold text-purple-700">(${opt.hiName})</span></h3>
                  <span class="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold">500 Marks</span>
                </div>
                <div class="mt-3 space-y-2 text-xs text-slate-600">
                  <div class="p-2.5 rounded-xl bg-slate-50"><strong class="text-navy-900">Paper I:</strong> ${opt.p1}</div>
                  <div class="p-2.5 rounded-xl bg-slate-50"><strong class="text-navy-900">Paper II:</strong> ${opt.p2}</div>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 pt-2">
                <button onclick="W.practiceOptionalAnswer('${opt.name}', \`${opt.prompt}\`)" class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold">
                  <i class="fa-solid fa-pen-nib mr-1"></i> Write Optional Answer
                </button>
                <button onclick="W.askMentorQuick('Give me a structured 6-month strategy and standard booklist for ${opt.name} Optional Paper I & II.')" class="px-3.5 py-2 rounded-xl bg-royal-50 text-royal-800 hover:bg-royal-100 text-xs font-bold">
                  <i class="fa-solid fa-robot mr-1"></i> AI Strategy
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    function openTopicViewer(topicId) {
      const topic = getAllSyllabus().find(t => t.id === topicId);
      if (!topic) return;
      const savedNote = state.personalNotes[topic.id] || "";
      const ethicsHtml = topic.ethicsPack ? `
        <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2.5">
          <h4 class="font-extrabold text-purple-900 text-sm flex items-center gap-2"><i class="fa-solid fa-scale-balanced"></i> GS-IV Ethics Framework & Case Study</h4>
          <div class="text-xs space-y-1.5 text-slate-700">
            <p><strong>Definition:</strong> ${topic.ethicsPack.definition}</p>
            <p><strong>Real-Life Example:</strong> ${topic.ethicsPack.realLifeExample}</p>
            <p><strong>Civil Service Example:</strong> ${topic.ethicsPack.civilServiceExample}</p>
            <div class="p-3 rounded-xl bg-white border border-purple-200 mt-2">
              <div class="font-bold text-purple-900 mb-1">Case Study Scenario:</div>
              <p>${topic.ethicsPack.caseStudy}</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div class="font-bold text-emerald-900 mb-1">Structured Model Approach:</div>
              <p>${topic.ethicsPack.modelAnswer}</p>
            </div>
          </div>
        </div>
      ` : "";

      const body = `
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-lg bg-royal-50 text-royal-800 font-bold">${topic.subject} • ${topic.category}</span>
            <span class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold">${topic.level}</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">Prerequisite: ${topic.prereq}</span>
          </div>

          <div class="p-4 rounded-2xl bg-royal-50/70 border border-royal-200">
            <h4 class="font-bold text-royal-900 text-sm mb-1.5"><i class="fa-solid fa-bolt mr-1.5 text-gold-500"></i>Quick Revision Summary</h4>
            <p class="text-sm text-slate-700 leading-relaxed">${topic.quickNotes}</p>
          </div>

          <div class="p-4 rounded-2xl bg-white border border-slate-200">
            <h4 class="font-bold text-navy-900 text-sm mb-1.5"><i class="fa-solid fa-book-open mr-1.5 text-royal-700"></i>Detailed Conceptual Notes (English)</h4>
            <p class="text-sm text-slate-700 leading-relaxed">${topic.detailedNotes}</p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <h4 class="font-bold text-amber-900 text-sm mb-1.5"><i class="fa-solid fa-language mr-1.5"></i>हिन्दी नोट्स (Natural Bilingual Explanation)</h4>
            <p class="text-sm text-slate-800 leading-relaxed">${topic.hiNotes}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <h4 class="font-bold text-emerald-900 text-sm mb-2">High-Yield Prelims Facts</h4>
              <ul class="list-disc ml-4 text-xs text-slate-700 space-y-1">
                ${topic.keyFacts.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-navy-900 text-sm mb-2">UPSC PYQ Connections</h4>
              <p class="text-xs text-slate-700 leading-relaxed">${topic.pyqConn}</p>
            </div>
          </div>

          ${ethicsHtml}

          <!-- Personal Notes Pad -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-navy-900 text-sm"><i class="fa-solid fa-note-sticky text-gold-500 mr-1.5"></i>My Personal Notes (Auto-Saved)</h4>
              <button onclick="W.savePersonalNote('${topic.id}')" class="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">Save Note</button>
            </div>
            <textarea id="personal-note-input" rows="3" class="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-royal-600" placeholder="Add your own mnemonics, current affairs linkages, or revision points...">${savedNote}</textarea>
          </div>
        </div>
      `;

      const footer = `
        <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-navy-900 text-xs font-bold"><i class="fa-solid fa-print mr-1"></i> Print / PDF</button>
        <button onclick="W.closeModal(); W.askMentorQuick('Explain ${topic.title} from zero level with simple examples and 2 UPSC practice questions.')" class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"><i class="fa-solid fa-robot mr-1"></i> Ask AI Mentor</button>
        <button onclick="W.closeModal(); W.navigate('prelims');" class="px-3.5 py-2 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-xs font-bold"><i class="fa-solid fa-list-check mr-1"></i> Practice MCQs</button>
      `;

      openModal(topic.title, topic.hiTitle, body, footer);
    }

    /* =========================================================================
       12. VIEW 3: INTERACTIVE MAPS & MIND MAPS
       ========================================================================= */
    let mapState = { mode: "india", selectedPin: INDIA_MAP_PINS[0], activeMindMap: "constitution", selectedNode: null };

    function renderMaps() {
      const pins = mapState.mode === "india" ? INDIA_MAP_PINS : WORLD_MAP_PINS;
      const mm = MIND_MAPS[mapState.activeMindMap];

      const html = `
        <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Interactive Map Learning & Visual Mind Maps</h2>
            <p class="text-xs sm:text-sm text-slate-500">Tap geographic markers & mind-map nodes for instant UPSC high-yield briefs</p>
          </div>
        </section>

        <!-- Interactive Map Module -->
        <section class="glass-card rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-extrabold text-navy-900 flex items-center gap-2"><i class="fa-solid fa-earth-asia text-emerald-600"></i> Interactive Geography Atlas</h3>
            <div class="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button onclick="W.setMapMode('india')" class="px-3.5 py-1.5 rounded-lg ${mapState.mode === 'india' ? 'bg-royal-800 text-white' : 'text-slate-600'}">India Map</button>
              <button onclick="W.setMapMode('world')" class="px-3.5 py-1.5 rounded-lg ${mapState.mode === 'world' ? 'bg-royal-800 text-white' : 'text-slate-600'}">World Map</button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <!-- SVG Map Canvas -->
            <div class="lg:col-span-2 bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl border border-sky-200 p-3 relative overflow-hidden">
              ${mapState.mode === "india" ? `
                <svg viewBox="0 0 400 380" class="w-full h-auto max-h-[380px] mx-auto">
                  <!-- Stylized India Outline -->
                  <path d="M145,28 L180,38 L195,62 L178,86 L205,112 L245,126 L278,125 L318,118 L335,148 L312,175 L292,168 L272,195 L258,215 L232,235 L208,268 L182,302 L162,348 L145,356 L128,325 L112,280 L102,238 L78,218 L66,192 L85,175 L72,155 L95,122 L115,92 L125,52 Z"
                    fill="#fefce8" stroke="#1e3a8a" stroke-width="2.5" />
                  <!-- Andaman & Lakshadweep -->
                  <circle cx="88" cy="315" r="4" fill="#93c5fd" stroke="#1e3a8a" stroke-width="1" />
                  <ellipse cx="325" cy="305" rx="5" ry="18" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.5" />
                  <!-- Labels -->
                  <text x="20" y="295" font-size="11" fill="#0369a1" font-weight="700">Arabian Sea</text>
                  <text x="255" y="280" font-size="11" fill="#0369a1" font-weight="700">Bay of Bengal</text>
                  <text x="140" y="372" font-size="11" fill="#0369a1" font-weight="700">Indian Ocean</text>                  ${pins.map(p => `
                    <g class="map-pin" onclick="W.selectMapPin('${p.id}')">
                      <circle cx="${p.x}" cy="${p.y}" r="${mapState.selectedPin?.id === p.id ? 9 : 6.5}"
                        fill="${p.type === 'River' ? '#2563eb' : p.type === 'National Park' ? '#059669' : '#d97706'}"
                        stroke="#ffffff" stroke-width="2" />
                    </g>
                  `).join("")}
                </svg>
              ` : `
                <svg viewBox="0 0 440 240" class="w-full h-auto max-h-[340px] mx-auto">
                  <!-- Stylized Continents -->
                  <path d="M30,45 L115,35 L125,88 L95,112 L65,98 L42,72 Z" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.8" />
                  <path d="M88,125 L125,132 L135,178 L112,218 L92,192 Z" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.8" />
                  <path d="M168,42 L235,38 L242,88 L175,92 Z" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.8" />
                  <path d="M168,100 L225,102 L238,155 L205,205 L178,170 L160,132 Z" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.8" />
                  <path d="M238,40 L375,45 L382,118 L335,148 L295,140 L265,122 L238,95 Z" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.8" />
                  <path d="M335,168 L392,165 L398,205 L345,208 Z" fill="#fefce8" stroke="#1e3a8a" stroke-width="1.8" />
                  ${pins.map(p => `
                    <g class="map-pin" onclick="W.selectMapPin('${p.id}')">
                      <circle cx="${p.x}" cy="${p.y}" r="${mapState.selectedPin?.id === p.id ? 8 : 6}"
                        fill="${p.type === 'Strait' ? '#dc2626' : p.type === 'Mountain' ? '#d97706' : '#059669'}"
                        stroke="#ffffff" stroke-width="2" />
                    </g>
                  `).join("")}
                </svg>
              `}
              <div class="flex flex-wrap gap-3 justify-center text-[11px] font-semibold text-slate-600 mt-2">
                <span><span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-600 mr-1"></span>Mountains</span>
                <span><span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mr-1"></span>Rivers</span>
                <span><span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1"></span>National Parks</span>
                <span><span class="inline-block w-2.5 h-2.5 rounded-full bg-red-600 mr-1"></span>Straits</span>
              </div>
            </div>

            <!-- Selected Pin Inspector -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div class="text-xs font-bold uppercase tracking-wider text-royal-700">${mapState.selectedPin?.type || "Location"}</div>
              <h4 class="font-extrabold text-navy-900 text-lg">${mapState.selectedPin?.name || "Select a Pin"}</h4>
              <p class="text-sm text-slate-700 leading-relaxed">${mapState.selectedPin?.fact || ""}</p>
              <div class="pt-2 border-t border-slate-200">
                <div class="text-xs font-bold text-slate-500 mb-2">Quick Jump Locations:</div>
                <div class="flex flex-wrap gap-1.5">
                  ${pins.map(p => `
                    <button onclick="W.selectMapPin('${p.id}')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold ${mapState.selectedPin?.id === p.id ? 'bg-royal-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">${p.name.split('(')[0].trim()}</button>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Interactive Mind Map Viewer -->
        <section class="glass-card rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-extrabold text-navy-900 flex items-center gap-2"><i class="fa-solid fa-diagram-project text-purple-600"></i> Interactive Mind Maps</h3>
            <div class="flex flex-wrap gap-1.5">
              ${Object.entries(MIND_MAPS).map(([k, v]) => `
                <button onclick="W.setMindMap('${k}')" class="px-3 py-1.5 rounded-xl text-xs font-bold ${mapState.activeMindMap === k ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">${v.title.replace(' Mind Map','')}</button>
              `).join("")}
            </div>
          </div>

          <div class="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
            <div class="flex justify-center">
              <div class="px-6 py-3 rounded-2xl hero-gradient text-white font-extrabold text-sm sm:text-base shadow-lg border-2 border-gold-400">
                ${mm.center}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              ${mm.branches.map(br => `
                <div class="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-2.5">
                  <div class="${br.color} text-white px-3 py-1.5 rounded-xl text-xs font-bold text-center">${br.title}</div>
                  <div class="space-y-2">
                    ${br.items.map(node => `
                      <button onclick="W.openMindNode('${node.label.replace(/'/g, "\\'")}', '${node.note.replace(/'/g, "\\'")}')"
                        class="mind-node w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-royal-50 border border-slate-200 hover:border-royal-300 text-xs font-semibold text-navy-900 flex items-center justify-between gap-2">
                        <span>${node.label}</span>
                        <i class="fa-solid fa-circle-info text-royal-600 shrink-0"></i>
                      </button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    /* =========================================================================
       13. VIEW 4: CURRENT AFFAIRS ENGINE
       ========================================================================= */
    let caCategory = "ALL";

    function renderCurrentAffairs() {
      const all = getAllCA();
      const cats = ["ALL", ...new Set(all.map(c => c.category))];
      const list = caCategory === "ALL" ? all : all.filter(c => c.category === caCategory);

      const html = `
        <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Daily Current Affairs Engine</h2>
            <p class="text-xs sm:text-sm text-slate-500">Authentic institutional sources (PIB, RBI, ISRO, Supreme Court, UN) mapped to UPSC Syllabus</p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${cats.map(c => `
              <button onclick="W.setCACategory('${c}')" class="px-3 py-1.5 rounded-xl text-xs font-bold ${caCategory === c ? 'bg-royal-800 text-white' : 'bg-white border border-slate-200 text-slate-700'}">${c}</button>
            `).join("")}
          </div>
        </section>

        <div class="space-y-4">
          ${list.map(ca => `
            <article class="glass-card rounded-2xl p-5 shadow-sm space-y-3 border-l-4 border-l-gold-500">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <span class="px-2.5 py-0.5 rounded-full bg-royal-800 text-white font-bold">${ca.category}</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"><i class="fa-solid fa-shield-check mr-1"></i>Source: ${ca.source}</span>
                  <span class="text-slate-500 font-semibold">${ca.date}</span>
                </div>
                <button onclick="W.explainCAWithAI('${ca.id}')" class="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-sparkles"></i> AI Deep Explainer
                </button>
              </div>

              <div>
                <h3 class="font-extrabold text-navy-900 text-lg">${state.lang === 'hi' ? ca.hiHeadline : ca.headline}</h3>
                ${state.lang === 'bi' ? `<p class="text-xs font-semibold text-royal-700 mt-0.5">${ca.hiHeadline}</p>` : ''}
                <p class="text-xs font-semibold text-amber-700 mt-1"><i class="fa-solid fa-sitemap mr-1"></i>${ca.syllabus}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div class="font-bold text-navy-900">Background & Why Important</div>
                  <p class="text-slate-700 leading-relaxed">${ca.background} ${ca.whyImportant}</p>
                  <div class="font-bold text-emerald-800 pt-1">Prelims Facts:</div>
                  <ul class="list-disc ml-4 text-slate-700 space-y-0.5">${ca.prelimsFacts.map(f => `<li>${f}</li>`).join("")}</ul>
                </div>
                <div class="p-3.5 rounded-xl bg-royal-50/60 border border-royal-200 space-y-1.5">
                  <div class="font-bold text-royal-900">Mains Analysis</div>
                  <p class="text-slate-700 leading-relaxed">${ca.mainsAnalysis}</p>
                  <div class="flex flex-wrap gap-1 pt-1">
                    ${ca.keywords.map(k => `<span class="px-2 py-0.5 rounded-md bg-white border border-royal-200 text-royal-800 font-semibold">#${k}</span>`).join("")}
                  </div>
                  <div class="pt-1.5 text-navy-900 font-semibold"><strong>Possible Mains Q:</strong> ${ca.possibleQ}</div>
                </div>
              </div>
              <div id="ca-ai-${ca.id}" class="hidden p-4 rounded-xl bg-purple-50 border border-purple-200 text-sm text-slate-800"></div>
            </article>
          `).join("")}
        </div>
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    /* =========================================================================
       14. VIEW 5: PRELIMS, CSAT, PYQ, SPACED ROTATION & MOCK TEST ENGINE
       ========================================================================= */
    let prelimsState = { subTab: "practice", subject: "ALL", currentQ: null, selectedOpt: null, revealed: false };

    function getNextRotatedQuestion(subj = "ALL") {
      const pool = getAllQuestions().filter(q => subj === "ALL" || q.subject === subj);
      if (!pool.length) return null;
      // Priority 1: Due revision questions not seen in current session
      const now = Date.now();
      let candidates = pool.filter(q => {
        const h = state.questionHistory[q.id];
        return !sessionSeenQuestions.has(q.id) && h && (h.lastWrong || h.nextReviewAt <= now);
      });
      // Priority 2: Brand new unseen questions
      if (!candidates.length) {
        candidates = pool.filter(q => !sessionSeenQuestions.has(q.id) && !state.questionHistory[q.id]);
      }
      // Priority 3: Any question not seen this session
      if (!candidates.length) {
        candidates = pool.filter(q => !sessionSeenQuestions.has(q.id));
      }
      // Reset session tracker if exhausted
      if (!candidates.length) {
        sessionSeenQuestions.clear();
        candidates = pool;
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    function renderPrelims() {
      if (activeMock) {
        renderActiveMockTest();
        return;
      }
      const allQ = getAllQuestions();
      const subjects = ["ALL", ...new Set(allQ.map(q => q.subject))];
      if (!prelimsState.currentQ) prelimsState.currentQ = getNextRotatedQuestion(prelimsState.subject);
      const q = prelimsState.currentQ;
      const dueList = getDueRevisions();

      const authBadge = (a) => {
        if (a === "OFFICIAL PYQ") return "bg-emerald-100 text-emerald-800 border-emerald-300";
        if (a === "AI-GENERATED QUESTION") return "bg-purple-100 text-purple-800 border-purple-300";
        return "bg-royal-100 text-royal-800 border-royal-300";
      };

      const html = `
        <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Prelims, CSAT, PYQs & Mock Tests</h2>
            <p class="text-xs sm:text-sm text-slate-500">Smart Question Rotation • Spaced Revision (1h→21d) • UPSC +2 / -0.66 Scoring</p>
          </div>
          <div class="inline-flex rounded-xl bg-white p-1 border border-slate-200 text-xs font-bold self-start">
            <button onclick="W.setPrelimsTab('practice')" class="px-3 py-1.5 rounded-lg ${prelimsState.subTab === 'practice' ? 'bg-royal-800 text-white' : 'text-slate-600'}">Smart Practice</button>
            <button onclick="W.setPrelimsTab('mocks')" class="px-3 py-1.5 rounded-lg ${prelimsState.subTab === 'mocks' ? 'bg-royal-800 text-white' : 'text-slate-600'}">Mock Tests</button>
            <button onclick="W.setPrelimsTab('revision')" class="px-3 py-1.5 rounded-lg ${prelimsState.subTab === 'revision' ? 'bg-royal-800 text-white' : 'text-slate-600'}">Revision (${dueList.length})</button>
          </div>
        </section>

        ${prelimsState.subTab === "practice" ? `
          <div class="glass-card rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap gap-1.5">
              ${subjects.map(s => `
                <button onclick="W.setPrelimsSubject('${s}')" class="px-3 py-1.5 rounded-xl text-xs font-bold ${prelimsState.subject === s ? 'bg-royal-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">${s}</button>
              `).join("")}
            </div>
            <button onclick="W.generateAIMCQ()" id="gen-ai-mcq-btn" class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Generate Fresh AI UPSC MCQ
            </button>
          </div>

          ${q ? `
            <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full border font-extrabold ${authBadge(q.authenticity)}">${q.authenticity}</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">${q.subject} • ${q.year}</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">${q.type}</span>
                </div>
                <span class="text-slate-400 font-mono text-[11px]">${q.level}</span>
              </div>

              <div class="text-sm sm:text-base font-bold text-navy-900 whitespace-pre-line leading-relaxed">${state.lang === 'hi' && q.hiQ ? q.hiQ : q.q}</div>
              ${state.lang === 'bi' && q.hiQ ? `<div class="text-xs sm:text-sm font-medium text-royal-800 bg-royal-50/60 p-3 rounded-xl whitespace-pre-line">${q.hiQ}</div>` : ''}

              <div class="space-y-2.5">
                ${q.options.map((opt, idx) => {
                  let cls = "bg-white border-slate-200 hover:border-royal-500 text-slate-800";
                  if (prelimsState.revealed) {
                    if (idx === q.answer) cls = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                    else if (idx === prelimsState.selectedOpt) cls = "bg-rose-50 border-rose-500 text-rose-900";
                  } else if (idx === prelimsState.selectedOpt) {
                    cls = "bg-royal-50 border-royal-600 text-royal-900 font-bold";
                  }
                  return `
                    <button onclick="W.selectPracticeOption(${idx})" ${prelimsState.revealed ? 'disabled' : ''}
                      class="w-full text-left p-3.5 rounded-xl border-2 text-sm transition flex items-start gap-3 ${cls}">
                      <span class="w-6 h-6 rounded-lg bg-slate-100 text-navy-900 font-bold text-xs flex items-center justify-center shrink-0">${String.fromCharCode(65 + idx)}</span>
                      <span>${opt}</span>
                    </button>
                  `;
                }).join("")}
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                ${!prelimsState.revealed ? `
                  <button onclick="W.submitPracticeAnswer()" class="px-5 py-2.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-sm font-bold">Check Answer</button>
                ` : `
                  <button onclick="W.nextPracticeQuestion()" class="px-5 py-2.5 rounded-xl gold-gradient text-navy-900 text-sm font-extrabold">Next Rotated Question <i class="fa-solid fa-arrow-right ml-1"></i></button>
                `}
                <button onclick="W.nextPracticeQuestion()" class="text-xs font-bold text-slate-500 hover:text-royal-800">Skip Question</button>
              </div>

              ${prelimsState.revealed ? `
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm fade-in">
                  <div class="font-extrabold ${prelimsState.selectedOpt === q.answer ? 'text-emerald-700' : 'text-rose-700'}">
                    ${prelimsState.selectedOpt === q.answer ? '✅ Correct! Scheduled for next Spaced Repetition interval.' : `❌ Incorrect. Correct Answer: (${String.fromCharCode(65 + q.answer)}) — Scheduled for 1-Hour Early Revision.`}
                  </div>
                  <p><strong>Why Correct:</strong> ${q.whyCorrect}</p>
                  <p><strong>Why Others Wrong:</strong> ${q.whyWrong}</p>
                  <p><strong>Core Concept:</strong> ${q.concept}</p>
                  <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold"><i class="fa-solid fa-lightbulb mr-1"></i> Memory Trick: ${q.trick}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        ` : prelimsState.subTab === "mocks" ? `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${[
              { id: "full-gs", title: "UPSC Prelims GS Full Sprint", filter: "GS", mins: 15, desc: "Mixed GS Paper I (Polity, History, Geo, Economy, Env, Sci-Tech, IR) with +2 / -0.66 negative marking." },
              { id: "csat-mock", title: "CSAT Qualifying Mini-Mock", filter: "CSAT", mins: 10, desc: "Quantitative Aptitude, Logical Reasoning & Reading Comprehension (33% qualifying standard)." },
              { id: "pyq-mock", title: "Official UPSC PYQ Simulator", filter: "PYQ", mins: 12, desc: "Strictly curated authentic UPSC Previous Year Questions for real exam calibration." }
            ].map(m => `
              <div class="glass-card rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 border-t-4 border-t-royal-800">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full bg-royal-50 text-royal-800 text-[11px] font-bold">${m.mins} Mins • Negative Marking</span>
                  <h3 class="font-extrabold text-navy-900 text-base mt-2">${m.title}</h3>
                  <p class="text-xs text-slate-600 mt-1.5">${m.desc}</p>
                </div>
                <button onclick="W.startMockTest('${m.title}', '${m.filter}', ${m.mins})" class="w-full py-2.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-xs font-bold">
                  <i class="fa-solid fa-play mr-1.5"></i> Start Timed Mock Test
                </button>
              </div>
            `).join("")}
          </div>

          <div class="glass-card rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-navy-900 text-sm mb-3">Recent Mock Test History</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 text-slate-600 uppercase">
                  <tr><th class="p-2.5 rounded-l-lg">Date</th><th class="p-2.5">Test</th><th class="p-2.5">Score</th><th class="p-2.5 rounded-r-lg">Accuracy</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${state.mockHistory.map(m => `
                    <tr>
                      <td class="p-2.5 font-medium">${m.date}</td>
                      <td class="p-2.5 font-bold text-navy-900">${m.title}</td>
                      <td class="p-2.5 font-bold text-royal-800">${m.score} / ${m.maxScore}</td>
                      <td class="p-2.5 font-bold text-emerald-700">${m.accuracy}%</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        ` : `
          <!-- Spaced Revision Dashboard -->
          <div class="glass-card rounded-2xl p-5 shadow-sm space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="font-extrabold text-navy-900">Spaced Revision Schedule (1 Hr → 1d → 5d → 7d → 14d → 21d)</h3>
                <p class="text-xs text-slate-500">Incorrect questions are automatically pushed to the 1-Hour high-priority queue.</p>
              </div>
            </div>
            ${dueList.length === 0 ? `
              <div class="p-6 text-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                🎉 All caught up! Practice more questions in Smart Practice to populate your spaced repetition queue.
              </div>
            ` : `
              <div class="space-y-2.5">
                ${dueList.map(dq => {
                  const h = state.questionHistory[dq.id];
                  return `
                    <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-bold text-amber-800">${dq.subject} • Interval: ${SR_LABELS[h.stageIdx]} ${h.lastWrong ? '(Missed Previously)' : ''}</div>
                        <div class="text-sm font-bold text-navy-900 truncate">${dq.q}</div>
                      </div>
                      <button onclick="W.loadSpecificQuestion('${dq.id}')" class="px-3.5 py-2 rounded-xl bg-royal-800 text-white text-xs font-bold shrink-0">Revise Now</button>
                    </div>
                  `;
                }).join("")}
              </div>
            `}
          </div>
        `}
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    function renderActiveMockTest() {
      const q = activeMock.questions[activeMock.idx];
      const mins = Math.floor(activeMock.remainingSec / 60);
      const secs = String(activeMock.remainingSec % 60).padStart(2, "0");

      const html = `
        <div class="glass-card rounded-2xl p-4 sm:p-6 shadow-md space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 class="font-extrabold text-navy-900 text-base sm:text-lg">${activeMock.title}</h2>
              <p class="text-xs text-slate-500">Question ${activeMock.idx + 1} of ${activeMock.questions.length} • +2.0 / -0.66 Marks</p>
            </div>
            <div class="flex items-center gap-2.5">
              <div id="mock-timer-display" class="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-extrabold text-sm">
                <i class="fa-regular fa-clock mr-1"></i>${mins}:${secs}
              </div>
              <button onclick="W.submitMockTest()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Submit Test</button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div class="lg:col-span-3 space-y-4">
              <div class="flex items-center gap-2 text-xs">
                <span class="px-2.5 py-0.5 rounded-full bg-royal-50 text-royal-800 font-bold">${q.subject}</span>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">${q.authenticity}</span>
              </div>
              <div class="text-sm sm:text-base font-bold text-navy-900 whitespace-pre-line">${q.q}</div>
              <div class="space-y-2">
                ${q.options.map((opt, i) => `
                  <button onclick="W.answerMockQuestion(${i})"
                    class="w-full text-left p-3.5 rounded-xl border-2 text-sm flex items-start gap-3 transition ${
                      activeMock.answers[activeMock.idx] === i ? 'bg-royal-50 border-royal-700 font-bold text-royal-900' : 'bg-white border-slate-200 hover:border-slate-400'
                    }">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 font-bold text-xs flex items-center justify-center shrink-0">${String.fromCharCode(65 + i)}</span>
                    <span>${opt}</span>
                  </button>
                `).join("")}
              </div>
              <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div class="flex gap-2">
                  <button onclick="W.toggleMarkForReview()" class="px-3.5 py-2 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold">
                    <i class="fa-solid fa-flag mr-1"></i>${activeMock.review.has(activeMock.idx) ? 'Unmark Review' : 'Mark for Review'}
                  </button>
                  <button onclick="W.clearMockAnswer()" class="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Clear</button>
                </div>
                <div class="flex gap-2">
                  <button onclick="W.jumpMockQuestion(${activeMock.idx - 1})" ${activeMock.idx === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-xl bg-slate-200 text-navy-900 text-xs font-bold disabled:opacity-40">Prev</button>
                  <button onclick="W.jumpMockQuestion(${activeMock.idx + 1})" ${activeMock.idx === activeMock.questions.length - 1 ? 'disabled' : ''} class="px-4 py-2 rounded-xl bg-royal-800 text-white text-xs font-bold disabled:opacity-40">Next</button>
                </div>
              </div>
            </div>

            <!-- Question Palette -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-xs font-bold text-navy-900 mb-3">Question Palette</div>
              <div class="grid grid-cols-5 gap-2">
                ${activeMock.questions.map((_, i) => {
                  const isAns = activeMock.answers[i] !== undefined;
                  const isRev = activeMock.review.has(i);
                  const isCurr = i === activeMock.idx;
                  let cls = "bg-white border-slate-300 text-slate-700";
                  if (isRev) cls = "bg-purple-600 text-white border-purple-700";
                  else if (isAns) cls = "bg-emerald-600 text-white border-emerald-700";
                  return `<button onclick="W.jumpMockQuestion(${i})" class="h-9 rounded-lg border text-xs font-bold ${cls} ${isCurr ? 'ring-2 ring-gold-500' : ''}">${i + 1}</button>`;
                }).join("")}
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    /* =========================================================================
       15. VIEW 6: MAINS ANSWER WRITING ACADEMY & ESSAY MASTERCLASS (GEMINI AI)
       ========================================================================= */
    const MAINS_PROMPTS = [
      { id: "m1", paper: "GS-II Polity", marks: 10, words: 150, q: "Discuss the significance of the Basic Structure Doctrine in preserving constitutional supremacy in India." },
      { id: "m2", paper: "GS-III Economy", marks: 15, words: 250, q: "Examine how India's Digital Public Infrastructure (DPI) promotes inclusive growth. What challenges must be addressed?" },
      { id: "m3", paper: "GS-IV Ethics Case Study", marks: 20, words: 250, q: "As District Collector during severe floods, an influential MLA demands diverting relief supplies to his unaffected ward. Identify ethical dilemmas and outline your course of action." },
      { id: "m4", paper: "UPSC Essay Masterclass", marks: 125, words: 1000, q: "Philosophical Essay: 'A ship in harbor is safe, but that is not what ships are built for.' Explore with Indian & global examples." }
    ];
    let selectedMainsPrompt = MAINS_PROMPTS[0];

    function renderMains() {
      const html = `
        <section>
          <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Mains Answer Writing Academy & Essay Masterclass</h2>
          <p class="text-xs sm:text-sm text-slate-500">Structured UPSC Frameworks • Live Word Counter • Instant Gemini AI Evaluation & Model Answers</p>
        </section>

        <!-- Structure Frameworks -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="glass-card rounded-2xl p-4 border-t-4 border-t-royal-800">
            <h4 class="font-bold text-navy-900 text-sm">1. Introduction (15%)</h4>
            <p class="text-xs text-slate-600 mt-1">Start with a crisp definition, constitutional article, recent RBI/NITI data, or historical context.</p>
          </div>
          <div class="glass-card rounded-2xl p-4 border-t-4 border-t-emerald-600">
            <h4 class="font-bold text-navy-900 text-sm">2. Multi-Dimensional Body (70%)</h4>
            <p class="text-xs text-slate-600 mt-1">Use PESTEL (Political, Economic, Social, Tech, Env, Legal) subheadings, diagrams, and Supreme Court judgments.</p>
          </div>
          <div class="glass-card rounded-2xl p-4 border-t-4 border-t-gold-500">
            <h4 class="font-bold text-navy-900 text-sm">3. Way Forward Conclusion (15%)</h4>
            <p class="text-xs text-slate-600 mt-1">Futuristic, balanced conclusion citing 2nd ARC, SDGs, or Viksit Bharat 2047 vision.</p>
          </div>
        </section>

        <!-- Prompt Selector + Writing Pad -->
        <section class="glass-card rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap gap-2">
            ${MAINS_PROMPTS.map(p => `
              <button onclick="W.selectMainsPrompt('${p.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold ${selectedMainsPrompt.id === p.id ? 'bg-royal-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                ${p.paper} (${p.marks}M)
              </button>
            `).join("")}
          </div>

          <div class="p-4 rounded-xl bg-royal-50 border border-royal-200">
            <div class="flex items-center justify-between text-xs font-bold text-royal-800 mb-1">
              <span>${selectedMainsPrompt.paper}</span>
              <span>${selectedMainsPrompt.marks} Marks • Target: ${selectedMainsPrompt.words} words</span>
            </div>
            <p id="mains-active-question" class="text-sm sm:text-base font-extrabold text-navy-900">${selectedMainsPrompt.q}</p>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Write your structured answer below (English or Hindi):</span>
              <span id="mains-word-count" class="px-2.5 py-0.5 rounded-lg bg-slate-100 font-bold text-navy-900">0 words</span>
            </div>
            <textarea id="mains-answer-input" rows="8" oninput="W.updateMainsWordCount()"
              class="w-full p-4 rounded-2xl border border-slate-300 focus:border-royal-700 outline-none text-sm leading-relaxed"
              placeholder="Write your Introduction, structured Body points (with articles/examples), and Way Forward Conclusion..."></textarea>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button onclick="W.evaluateMainsAnswer()" id="eval-mains-btn" class="px-5 py-2.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-sm font-bold flex items-center gap-2">
              <i class="fa-solid fa-sparkles text-gold-400"></i> Evaluate with AI Examiner
            </button>
            <button onclick="W.generateMainsModel()" id="model-mains-btn" class="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold flex items-center gap-2">
              <i class="fa-solid fa-file-lines"></i> Generate Model Answer
            </button>
          </div>

          <div id="mains-ai-output" class="hidden p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-2"></div>
        </section>
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    /* =========================================================================
       16. VIEW 7: INTERVIEW PREPARATION & AI BOARD SIMULATOR
       ========================================================================= */
    function renderInterview() {
      const d = state.dafProfile;
      const html = `
        <section>
          <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">UPSC Interview Preparation & AI Board Simulator</h2>
          <p class="text-xs sm:text-sm text-slate-500">DAF-based Question Generator • Voice/Text Mock Board • Balanced Opinion Feedback</p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- DAF Form -->
          <div class="glass-card rounded-2xl p-5 shadow-sm space-y-3">
            <h3 class="font-extrabold text-navy-900 text-sm flex items-center gap-2"><i class="fa-solid fa-id-card text-royal-700"></i> Detailed Application Form (DAF)</h3>
            ${[
              { key: "name", label: "Candidate Name" },
              { key: "homeState", label: "Home State" },
              { key: "district", label: "Home District" },
              { key: "education", label: "Graduation / Stream" },
              { key: "optional", label: "Optional Subject" },
              { key: "hobbies", label: "Hobbies & Interests" }
            ].map(f => `
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">${f.label}</label>
                <input id="daf-${f.key}" type="text" value="${d[f.key] || ''}" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-royal-600 outline-none" />
              </div>
            `).join("")}
            <button onclick="W.saveDAF()" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Save DAF & Personalize Board</button>
          </div>

          <!-- AI Mock Interview Chat -->
          <div class="lg:col-span-2 glass-card rounded-2xl p-5 shadow-sm flex flex-col h-[540px]">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center"><i class="fa-solid fa-user-tie"></i></div>
                <div>
                  <div class="font-extrabold text-navy-900 text-sm">UPSC Personality Test Board (AI)</div>
                  <div class="text-[11px] text-emerald-600 font-semibold">Live DAF-Aware Evaluation</div>
                </div>
              </div>
              <button onclick="W.resetInterview()" class="text-xs font-bold text-slate-500 hover:text-royal-800">Restart Board</button>
            </div>

            <div id="interview-chat-box" class="flex-1 overflow-y-auto py-4 space-y-3">
              ${interviewMessages.map(m => `
                <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
                  <div class="max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-royal-800 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }">${formatMarkdown(m.text)}</div>
                </div>
              `).join("")}
            </div>

            <div class="pt-3 border-t border-slate-200 flex items-center gap-2">
              <button onclick="W.startVoiceInput('interview-input')" class="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center shrink-0" title="Speak Answer (Voice Input)">
                <i class="fa-solid fa-microphone"></i>
              </button>
              <input id="interview-input" type="text" onkeydown="if(event.key==='Enter') W.sendInterviewResponse()"
                placeholder="Type or speak your response to the UPSC Board..."
                class="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 focus:bg-white border border-transparent focus:border-royal-600 text-sm outline-none" />
              <button onclick="W.sendInterviewResponse()" class="px-4 py-2.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-sm font-bold shrink-0">Send</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById("app-content").innerHTML = html;
      const box = document.getElementById("interview-chat-box");
      if (box) box.scrollTop = box.scrollHeight;
    }

    /* =========================================================================
       17. VIEW 8: AI PERSONAL MENTOR (CONTEXT-AWARE)
       ========================================================================= */
    function renderMentor() {
      const chips = [
        "Explain Fiscal Deficit from zero level",
        "Explain Fundamental Rights in simple Hindi",
        "Make quick revision notes on Revolt of 1857",
        "Generate 3 UPSC Prelims MCQs on Environment",
        "Give a Mains answer structure on Cooperative Federalism",
        "Create a 7-day revision plan for my weak topics"
      ];

      const html = `
        <section class="glass-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col h-[calc(100vh-11rem)] min-h-[500px]">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl hero-gradient text-gold-400 flex items-center justify-center text-lg shadow"><i class="fa-solid fa-robot"></i></div>
              <div>
                <h2 class="font-extrabold text-navy-900 text-base">WONDER IAS Personal AI Mentor</h2>
                <p class="text-xs text-slate-500">Context: Stage ${state.currentStage}/10 • ${state.targetExam} • Language: ${state.lang.toUpperCase()}</p>
              </div>
            </div>
            <button onclick="W.clearMentorChat()" class="text-xs font-bold text-slate-500 hover:text-rose-600">Clear Chat</button>
          </div>

          <!-- Quick Action Chips -->
          <div class="flex gap-2 overflow-x-auto py-2.5 shrink-0">
            ${chips.map(c => `
              <button onclick="W.askMentorQuick('${c}')" class="px-3 py-1.5 rounded-full bg-royal-50 hover:bg-royal-100 border border-royal-200 text-royal-800 text-xs font-semibold whitespace-nowrap shrink-0">${c}</button>
            `).join("")}
          </div>

          <div id="mentor-chat-box" class="flex-1 overflow-y-auto py-3 space-y-3">
            ${mentorMessages.map(m => `
              <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-royal-800 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }">${formatMarkdown(m.text)}</div>
              </div>
            `).join("")}
          </div>

          <div class="pt-3 border-t border-slate-200 flex items-center gap-2">
            <input id="mentor-input" type="text" onkeydown="if(event.key==='Enter') W.sendMentorMessage()"
              placeholder="Ask anything in English or Hindi (e.g., Explain Article 356 from zero)..."
              class="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 focus:bg-white border border-transparent focus:border-royal-600 text-sm outline-none" />
            <button onclick="W.sendMentorMessage()" class="px-5 py-2.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-sm font-bold shrink-0">Ask</button>
          </div>
        </section>
      `;
      document.getElementById("app-content").innerHTML = html;
      const box = document.getElementById("mentor-chat-box");
      if (box) box.scrollTop = box.scrollHeight;
    }

    /* =========================================================================
       18. VIEW 9: PERSONALIZED STUDY PLAN GENERATOR
       ========================================================================= */
    function renderStudyPlan() {
      const plan = state.savedStudyPlan;
      const html = `
        <section>
          <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Personalized Study Plan Generator</h2>
          <p class="text-xs sm:text-sm text-slate-500">Balances NCERTs, Standard Books, Current Affairs, Spaced Revision & Mock Tests</p>
        </section>

        <section class="glass-card rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Target Exam</label>
            <select id="plan-exam" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold">
              <option value="UPSC CSE">UPSC Civil Services (IAS/IPS)</option>
              <option value="State PCS">State PCS (UPPSC/BPSC/MPPSC/RAS)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Duration</label>
            <select id="plan-duration" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold">
              <option value="3 Months">3 Months (Intensive)</option>
              <option value="6 Months">6 Months (Fast-Track)</option>
              <option value="1 Year" selected>1 Year (Standard UPSC)</option>
              <option value="2 Years">2 Years (College Foundation)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Daily Study Hours</label>
            <select id="plan-hours" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold">
              <option value="2">2 Hours / Day</option>
              <option value="4">4 Hours / Day</option>
              <option value="6" selected>6 Hours / Day</option>
              <option value="8">8 Hours / Day</option>
              <option value="10">10 Hours / Day</option>
            </select>
          </div>
          <button onclick="W.generateStudyPlan()" class="py-2.5 px-4 rounded-xl gold-gradient text-navy-900 font-extrabold text-sm shadow hover:brightness-105">
            <i class="fa-solid fa-wand-sparkles mr-1"></i> Generate Plan
          </button>
        </section>

        ${plan ? `
          <section class="glass-card rounded-2xl p-5 shadow-sm space-y-5 fade-in">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <h3 class="font-extrabold text-navy-900 text-lg">${plan.exam} — ${plan.duration} Roadmap (${plan.hours} hrs/day)</h3>
                <p class="text-xs text-slate-500">Tailored for Stage ${state.currentStage} • Weak Focus: ${plan.weakFocus}</p>
              </div>
              <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-royal-800 text-white text-xs font-bold"><i class="fa-solid fa-print mr-1"></i> Print Schedule</button>
            </div>

            <div>
              <h4 class="font-bold text-royal-800 text-sm mb-2">Daily Time Allocation (${plan.hours} Hours)</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                ${plan.dailyBlocks.map(b => `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="text-xs font-extrabold text-royal-700">${b.time}</div>
                    <div class="font-bold text-navy-900 text-sm mt-0.5">${b.title}</div>
                    <div class="text-xs text-slate-600 mt-1">${b.desc}</div>
                  </div>
                `).join("")}
              </div>
            </div>

            <div>
              <h4 class="font-bold text-emerald-800 text-sm mb-2">Phase-wise Milestone Calendar</h4>
              <div class="space-y-2.5">
                ${plan.phases.map((p, i) => `
                  <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-3">
                    <span class="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">P${i+1}</span>
                    <div>
                      <div class="font-bold text-navy-900 text-sm">${p.title}</div>
                      <div class="text-xs text-slate-700 mt-0.5">${p.tasks}</div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </section>
        ` : `
          <div class="glass-card rounded-2xl p-8 text-center text-slate-500 text-sm">
            Select your target exam, duration, and daily hours above, then click <strong>Generate Plan</strong>.
          </div>
        `}
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    /* =========================================================================
       19. VIEW 10: TEACHER / ADMIN CONTENT MANAGER & DATA EXPORT/IMPORT
       ========================================================================= */
    function renderAdmin() {
      const html = `
        <section class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-navy-900">Teacher / Admin Content Studio & Data Backup</h2>
            <p class="text-xs sm:text-sm text-slate-500">Add new syllabus topics, practice MCQs, current affairs, or Export/Import full JSON backup</p>
          </div>
          <div class="flex gap-2">
            <button onclick="W.exportDataJSON()" class="px-3.5 py-2 rounded-xl bg-royal-800 text-white text-xs font-bold"><i class="fa-solid fa-download mr-1"></i> Export JSON</button>
            <label class="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
              <i class="fa-solid fa-upload mr-1"></i> Import JSON
              <input type="file" accept=".json" onchange="W.importDataJSON(event)" class="hidden" />
            </label>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Add Syllabus Topic -->
          <div class="glass-card rounded-2xl p-5 shadow-sm space-y-3">
            <h3 class="font-extrabold text-navy-900 text-sm"><i class="fa-solid fa-plus-circle text-royal-700 mr-1.5"></i> Add New Syllabus Topic</h3>
            <div class="grid grid-cols-2 gap-2.5">
              <input id="adm-t-subj" type="text" placeholder="Subject (e.g., Polity)" class="p-2.5 rounded-xl border border-slate-200 text-xs" />
              <input id="adm-t-paper" type="text" placeholder="Paper (e.g., GS-II)" class="p-2.5 rounded-xl border border-slate-200 text-xs" />
            </div>
            <input id="adm-t-title" type="text" placeholder="Topic Title (English)" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs" />
            <input id="adm-t-hi" type="text" placeholder="शीर्षक (Hindi Title)" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs" />
            <textarea id="adm-t-notes" rows="3" placeholder="Quick & Detailed Notes..." class="w-full p-2.5 rounded-xl border border-slate-200 text-xs"></textarea>
            <button onclick="W.adminAddTopic()" class="w-full py-2.5 rounded-xl bg-royal-800 hover:bg-royal-900 text-white text-xs font-bold">Publish Topic to Syllabus</button>
          </div>

          <!-- Add Practice MCQ -->
          <div class="glass-card rounded-2xl p-5 shadow-sm space-y-3">
            <h3 class="font-extrabold text-navy-900 text-sm"><i class="fa-solid fa-circle-question text-emerald-600 mr-1.5"></i> Add Question to Smart Bank</h3>
            <div class="grid grid-cols-2 gap-2.5">
              <input id="adm-q-subj" type="text" placeholder="Subject (e.g., Economy)" class="p-2.5 rounded-xl border border-slate-200 text-xs" />
              <select id="adm-q-auth" class="p-2.5 rounded-xl border border-slate-200 text-xs">
                <option value="PRACTICE QUESTION">PRACTICE QUESTION</option>
                <option value="OFFICIAL PYQ">OFFICIAL PYQ</option>
              </select>
            </div>
            <textarea id="adm-q-text" rows="2" placeholder="Question text..." class="w-full p-2.5 rounded-xl border border-slate-200 text-xs"></textarea>
            <div class="grid grid-cols-2 gap-2">
              <input id="adm-q-o0" type="text" placeholder="Option A" class="p-2 rounded-xl border border-slate-200 text-xs" />
              <input id="adm-q-o1" type="text" placeholder="Option B" class="p-2 rounded-xl border border-slate-200 text-xs" />
              <input id="adm-q-o2" type="text" placeholder="Option C" class="p-2 rounded-xl border border-slate-200 text-xs" />
              <input id="adm-q-o3" type="text" placeholder="Option D" class="p-2 rounded-xl border border-slate-200 text-xs" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <select id="adm-q-ans" class="p-2 rounded-xl border border-slate-200 text-xs">
                <option value="0">Correct: Option A</option>
                <option value="1">Correct: Option B</option>
                <option value="2">Correct: Option C</option>
                <option value="3">Correct: Option D</option>
              </select>
              <input id="adm-q-exp" type="text" placeholder="Short Explanation" class="p-2 rounded-xl border border-slate-200 text-xs" />
            </div>
            <button onclick="W.adminAddQuestion()" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Add Question to Bank</button>
          </div>
        </div>

        <!-- Permanent One File / Zero Duplicate Registry -->
        <section class="glass-card rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="font-extrabold text-navy-900"><i class="fa-solid fa-database text-purple-600 mr-2"></i>One File — Zero Duplicate Data Registry</h3>
              <p class="text-xs text-slate-500 mt-1">One master record, multiple references. Import is merge-only; existing IDs and records are preserved.</p>
            </div>
            <button onclick="W.runMasterAudit()" class="px-3 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold"><i class="fa-solid fa-magnifying-glass-chart mr-1"></i> Run Duplicate Audit</button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div class="p-3 rounded-xl bg-blue-50 border border-blue-100"><div class="text-[10px] text-blue-700 font-bold">CUSTOM TOPICS</div><div id="master-topics-count" class="text-xl font-extrabold text-blue-900">${(state.customSyllabus||[]).length}</div></div>
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-100"><div class="text-[10px] text-emerald-700 font-bold">CUSTOM QUESTIONS</div><div id="master-questions-count" class="text-xl font-extrabold text-emerald-900">${(state.customQuestions||[]).length}</div></div>
            <div class="p-3 rounded-xl bg-amber-50 border border-amber-100"><div class="text-[10px] text-amber-700 font-bold">CURRENT AFFAIRS</div><div id="master-ca-count" class="text-xl font-extrabold text-amber-900">${(state.customCA||[]).length}</div></div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200"><div class="text-[10px] text-slate-600 font-bold">REGISTERED FILES</div><div id="master-files-count" class="text-xl font-extrabold text-slate-900">${(state.masterRegistry?.files||[]).length}</div></div>
          </div>
          <div id="master-audit-result" class="text-xs text-slate-600 bg-slate-50 rounded-xl p-3">Audit not yet run in this session. Run the audit to inspect duplicates and registry health.</div>
          <div class="flex flex-wrap gap-2">
            <button onclick="W.exportMasterRegistry()" class="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold"><i class="fa-solid fa-file-export mr-1"></i> Export Registry</button>
            <button onclick="W.repairMasterDuplicates()" class="px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Safe Deduplicate</button>
          </div>
        </section>

        <!-- V2 Smart Master Data Control Center -->
        <section class="glass-card rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap justify-between items-center gap-3">
            <div><h3 class="font-extrabold text-navy-900"><i class="fa-solid fa-layer-group text-blue-600 mr-2"></i>Smart Master Data Control Center — V2</h3><p class="text-xs text-slate-500 mt-1">Search once, use master records everywhere. Archive instead of deleting; preserve IDs.</p></div>
            <button onclick="W.exportMasterDataBackup()" class="px-3 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold"><i class="fa-solid fa-box-archive mr-1"></i> V2 Backup</button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2" id="master-health-cards">
            ${(() => { const h=masterDataHealth(); return [ ["TOTAL MASTER RECORDS",h.total,"blue"],["TOPICS",h.topics,"indigo"],["QUESTIONS",h.questions,"emerald"],["CURRENT AFFAIRS",h.currentAffairs,"amber"],["MISSING IDs",h.missingIds,"rose"],["DUPLICATE IDs",h.duplicateIds,"rose"],["INCOMPLETE",h.incomplete,"orange"],["ARCHIVED",h.archived,"slate"] ].map(([label,value,color])=>`<div class="p-3 rounded-xl bg-${color}-50 border border-${color}-100"><div class="text-[10px] font-bold text-${color}-700">${label}</div><div class="text-xl font-extrabold text-${color}-900">${value}</div></div>`).join(""); })()}
          </div>
          <div class="flex gap-2"><input id="master-search" oninput="W.searchMasterDataUI(this.value)" type="search" placeholder="Search title, subject, ID, paper, topic..." class="flex-1 p-3 rounded-xl border border-slate-200 text-sm"/><button onclick="W.searchMasterDataUI(document.getElementById('master-search').value)" class="px-4 rounded-xl bg-slate-800 text-white text-xs font-bold">Search</button></div>
          <div id="master-search-results" class="space-y-2 text-sm"><div class="text-slate-500 text-xs">Start typing to search your custom master records.</div></div>
          <div class="rounded-xl border border-slate-200 p-3 space-y-2">
            <div class="text-xs font-bold text-slate-700">Archived Master Records</div>
            ${(state.masterDataMeta?.archived||[]).length?(state.masterDataMeta.archived.slice(-30).reverse().map(x=>`<div class="flex flex-wrap items-center justify-between gap-2 text-xs"><span class="break-words">${escapeMasterHTML(x.kind)} • ${escapeMasterHTML(x.record?.id||"NO ID")} • ${escapeMasterHTML(x.record?.title||x.record?.q||x.record?.headline||"Archived record")}</span><button onclick="W.restoreArchivedRecord('${escapeMasterHTML(x.kind)}','${escapeMasterHTML(x.record?.id||"")}')" class="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold">Restore</button></div>`).join("")):`<div class="text-xs text-slate-500">No archived custom records.</div>`}
          </div>
          <div class="text-[11px] text-slate-500">V3: built-in + custom record registry • permanent IDs • content fingerprints • safer import • archive restore.</div>
        </section>
      `;
      document.getElementById("app-content").innerHTML = html;
    }

    /* =========================================================================
       20. MAIN ROUTER & PUBLIC WINDOW.W ACTIONS
       ========================================================================= */
    function renderCurrentView() {
      destroyCharts();
      switch (state.activeTab) {
        case "dashboard": renderDashboard(); break;
        case "syllabus": renderSyllabus(); break;
        case "maps": renderMaps(); break;
        case "currentAffairs": renderCurrentAffairs(); break;
        case "prelims": renderPrelims(); break;
        case "mains": renderMains(); break;
        case "interview": renderInterview(); break;
        case "mentor": renderMentor(); break;
        case "studyPlan": renderStudyPlan(); break;
        case "admin": renderAdmin(); break;
        default: renderDashboard();
      }
    }

    function renderAll() {
      applyWonderVersion(state.wonderVersion || "1", false);
      renderNavigation();
      updateHeaderStats();
      renderCurrentView();
    }

    window.W = {
      restoreArchivedRecord(kind,id) {
        const idx=state.masterDataMeta.archived.findIndex(x=>x.kind===kind&&String(x.record?.id)===String(id));if(idx<0)return;
        const entry=state.masterDataMeta.archived[idx],key=kind==="topic"?"customSyllabus":kind==="question"?"customQuestions":"customCA",masters=recordCandidates(kind);
        if(masters.some(x=>String(x.id)===String(id)||recordFingerprint(kind,x)===recordFingerprint(kind,entry.record))){showToast("A master already exists; restore skipped.","warning");return;}
        state[key].push(entry.record);state.masterDataMeta.archived.splice(idx,1);normalizeMasterData({log:false});state.duplicateAuditLog.push({at:Date.now(),action:"RESTORE_RECORD",kind,id});saveStateToCloud();renderAdmin();showToast("Archived master record restored.","success");
      },
      setVersion(version) { applyWonderVersion(version, true); saveStateToCloud(); showToast(`Visual version changed to V${state.wonderVersion}.`, "success"); },
      navigate(tab) {
        if (activeMock && tab !== "prelims") {
          showToast("Please submit or finish your active mock test first.", "warning");
          return;
        }
        state.activeTab = tab;
        this.toggleMobileDrawer(false);
        renderAll();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      toggleMobileDrawer(open) {
        const d = document.getElementById("mobile-drawer");
        const o = document.getElementById("mobile-drawer-overlay");
        if (open) {
          d.classList.remove("-translate-x-full");
          o.classList.remove("hidden");
        } else {
          d.classList.add("-translate-x-full");
          o.classList.add("hidden");
        }
      },
      setLanguage(l) {
        state.lang = l;
        saveStateToCloud();
        renderAll();
        showToast(`Language switched to ${l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'Bilingual'}`, "info");
      },
      toggleAdminMode() {
        state.adminMode = !state.adminMode;
        updateHeaderStats();
        if (state.adminMode) this.navigate("admin");
        else showToast("Switched to Student Mode", "info");
      },
      setStage(stageId) {
        state.currentStage = stageId;
        addXP(20, `Moved to Stage ${stageId}: ${STAGES[stageId - 1].en}`);
        renderAll();
      },
      toggleDailyTarget(id) {
        const t = state.dailyTargets.find(x => x.id === id);
        if (t) {
          t.done = !t.done;
          if (t.done) addXP(25, "Daily Target Completed!");
          saveStateToCloud();
          renderDashboard();
        }
      },
      logStudyHour() {
        state.studyHours = Math.round((state.studyHours + 0.5) * 10) / 10;
        addXP(15, "Logged +0.5 Study Hour");
        renderDashboard();
      },
      handleGlobalSearch(val) {
        const dd = document.getElementById("global-search-dropdown");
        const q = val.trim().toLowerCase();
        if (!q) { dd.classList.add("hidden"); return; }
        const topics = getAllSyllabus().filter(t => t.title.toLowerCase().includes(q) || t.hiTitle.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 5);
        const cas = getAllCA().filter(c => c.headline.toLowerCase().includes(q)).slice(0, 3);
        if (!topics.length && !cas.length) {
          dd.innerHTML = `<div class="p-3 text-xs text-slate-500">No matches found for "${val}"</div>`;
        } else {
          dd.innerHTML = [
            ...topics.map(t => `<button onclick="document.getElementById('global-search-dropdown').classList.add('hidden'); W.openTopicViewer('${t.id}')" class="w-full text-left px-4 py-2.5 hover:bg-royal-50 border-b border-slate-100 text-xs"><div class="font-bold text-navy-900">${t.title}</div><div class="text-slate-500">${t.subject} • ${t.paper}</div></button>`),
            ...cas.map(c => `<button onclick="document.getElementById('global-search-dropdown').classList.add('hidden'); W.navigate('currentAffairs')" class="w-full text-left px-4 py-2.5 hover:bg-amber-50 border-b border-slate-100 text-xs"><div class="font-bold text-amber-900">${c.headline}</div><div class="text-slate-500">Current Affairs • ${c.category}</div></button>`)
          ].join("");
        }
        dd.classList.remove("hidden");
      },

      /* Syllabus Actions */
      setSyllabusMode(showOpt) { syllabusFilter.showOptionals = showOpt; renderSyllabus(); },
      filterSyllabusSubject(s) { syllabusFilter.subject = s; renderSyllabus(); },
      filterSyllabusSearch(val) { syllabusFilter.search = val; renderSyllabus(); },
      toggleTopicComplete(id) {
        const idx = state.completedTopics.indexOf(id);
        if (idx === -1) { state.completedTopics.push(id); addXP(30, "Syllabus Topic Completed!"); }
        else state.completedTopics.splice(idx, 1);
        saveStateToCloud();
        renderSyllabus();
      },
      toggleBookmark(id) {
        const idx = state.bookmarks.indexOf(id);
        if (idx === -1) { state.bookmarks.push(id); showToast("Topic Bookmarked", "info"); }
        else state.bookmarks.splice(idx, 1);
        saveStateToCloud();
        renderSyllabus();
      },
      openTopicViewer,
      savePersonalNote(id) {
        const val = document.getElementById("personal-note-input").value;
        state.personalNotes[id] = val;
        saveStateToCloud();
        showToast("Personal note saved!", "success");
      },
      practiceOptionalAnswer(name, prompt) {
        selectedMainsPrompt = { id: "opt-custom", paper: `${name} Optional`, marks: 15, words: 250, q: prompt };
        this.navigate("mains");
      },

      /* Maps & Mind Maps */
      setMapMode(m) {
        mapState.mode = m;
        mapState.selectedPin = m === "india" ? INDIA_MAP_PINS[0] : WORLD_MAP_PINS[0];
        renderMaps();
      },
      selectMapPin(id) {
        const pins = mapState.mode === "india" ? INDIA_MAP_PINS : WORLD_MAP_PINS;
        mapState.selectedPin = pins.find(p => p.id === id) || pins[0];
        renderMaps();
      },
      setMindMap(key) { mapState.activeMindMap = key; renderMaps(); },
      openMindNode(label, note) {
        openModal(label, "Interactive Mind Map Concept", `<p class="text-sm text-slate-700 leading-relaxed">${note}</p>`,
          `<button onclick="W.closeModal(); W.askMentorQuick('Explain ${label} in detail for UPSC Prelims and Mains.')" class="px-4 py-2 rounded-xl bg-royal-800 text-white text-xs font-bold">Deep-Dive with AI Mentor</button>`);
      },

      /* Current Affairs */
      setCACategory(c) { caCategory = c; renderCurrentAffairs(); },
      async explainCAWithAI(id) {
        const ca = getAllCA().find(x => x.id === id);
        if (!ca) return;
        const box = document.getElementById(`ca-ai-${id}`);
        box.classList.remove("hidden");
        box.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Generating UPSC Prelims & Mains AI analysis...`;
        const resp = await callGeminiAPI(
          `Provide a crisp UPSC Prelims + Mains explainer on "${ca.headline}" (${ca.syllabus}). Language mode: ${state.lang}. Include 3 Prelims pointers, 3 Mains dimensions, and 1 Way Forward.`,
          "You are a senior UPSC CSE faculty member. Keep explanations accurate, neutral, and structured."
        );
        box.innerHTML = formatMarkdown(resp);
        addXP(10);
      },

      /* Prelims, CSAT & Mock Tests */
      setPrelimsTab(t) { prelimsState.subTab = t; renderPrelims(); },
      setPrelimsSubject(s) {
        prelimsState.subject = s;
        prelimsState.currentQ = getNextRotatedQuestion(s);
        prelimsState.selectedOpt = null;
        prelimsState.revealed = false;
        renderPrelims();
      },
      selectPracticeOption(i) { prelimsState.selectedOpt = i; renderPrelims(); },      submitPracticeAnswer() {
        if (prelimsState.selectedOpt === null) { showToast("Please select an option first.", "warning"); return; }
        prelimsState.revealed = true;
        recordQuestionAttempt(prelimsState.currentQ.id, prelimsState.selectedOpt === prelimsState.currentQ.answer);
        renderPrelims();
      },
      nextPracticeQuestion() {
        prelimsState.currentQ = getNextRotatedQuestion(prelimsState.subject);
        prelimsState.selectedOpt = null;
        prelimsState.revealed = false;
        renderPrelims();
      },
      loadSpecificQuestion(id) {
        const q = getAllQuestions().find(x => x.id === id);
        if (q) {
          prelimsState.subTab = "practice";
          prelimsState.currentQ = q;
          prelimsState.selectedOpt = null;
          prelimsState.revealed = false;
          renderPrelims();
        }
      },
      async generateAIMCQ() {
        const btn = document.getElementById("gen-ai-mcq-btn");
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Crafting UPSC MCQ...`;
        const subj = prelimsState.subject === "ALL" ? "Indian Polity or Economy" : prelimsState.subject;
        const prompt = `Create 1 original UPSC Prelims-standard multiple-choice question on ${subj}. Return ONLY valid JSON with keys: "q", "hiQ", "options" (array of 4 strings), "answer" (0-3 integer), "whyCorrect", "whyWrong", "concept", "trick". No markdown fences.`;
        const raw = await callGeminiAPI(prompt, "You are a UPSC Prelims Question Setter. Output strict JSON only.");
        try {
          const cleaned = raw.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          const newQ = {
            id: "q-ai-" + Date.now(),
            subject: prelimsState.subject === "ALL" ? "Polity" : prelimsState.subject,
            topic: "AI Practice", paper: "Prelims GS", type: "Standard MCQ",
            level: "LEVEL 5 — UPSC STANDARD", authenticity: "AI-GENERATED QUESTION", year: "Gemini AI",
            ...parsed
          };
          state.customQuestions.push(newQ);
          prelimsState.currentQ = newQ;
          prelimsState.selectedOpt = null;
          prelimsState.revealed = false;
          saveStateToCloud();
          showToast("Generated a fresh AI-GENERATED QUESTION!", "success");
        } catch {
          showToast("Could not parse AI MCQ. Please try again.", "error");
        }
        renderPrelims();
      },
      startMockTest(title, filter, mins) {
        let qs = getAllQuestions();
        if (filter === "CSAT") qs = qs.filter(q => q.subject === "CSAT");
        else if (filter === "PYQ") qs = qs.filter(q => q.authenticity === "OFFICIAL PYQ");
        else qs = qs.filter(q => q.subject !== "CSAT");
        if (!qs.length) { showToast("No questions available for this mock.", "warning"); return; }

        activeMock = {
          title, questions: qs, idx: 0, answers: {}, review: new Set(),
          totalSec: mins * 60, remainingSec: mins * 60
        };
        clearInterval(mockTimerInterval);
        mockTimerInterval = setInterval(() => {
          if (!activeMock) return;
          activeMock.remainingSec--;
          const el = document.getElementById("mock-timer-display");
          if (el) {
            const m = Math.floor(activeMock.remainingSec / 60);
            const s = String(activeMock.remainingSec % 60).padStart(2, "0");
            el.innerHTML = `<i class="fa-regular fa-clock mr-1"></i>${m}:${s}`;
          }
          if (activeMock.remainingSec <= 0) W.submitMockTest();
        }, 1000);
        renderActiveMockTest();
      },
      answerMockQuestion(optIdx) { activeMock.answers[activeMock.idx] = optIdx; renderActiveMockTest(); },
      clearMockAnswer() { delete activeMock.answers[activeMock.idx]; renderActiveMockTest(); },
      toggleMarkForReview() {
        if (activeMock.review.has(activeMock.idx)) activeMock.review.delete(activeMock.idx);
        else activeMock.review.add(activeMock.idx);
        renderActiveMockTest();
      },
      jumpMockQuestion(i) {
        if (i >= 0 && i < activeMock.questions.length) { activeMock.idx = i; renderActiveMockTest(); }
      },
      submitMockTest() {
        clearInterval(mockTimerInterval);
        let correct = 0, wrong = 0, unattempted = 0;
        activeMock.questions.forEach((q, i) => {
          const ans = activeMock.answers[i];
          if (ans === undefined) unattempted++;
          else if (ans === q.answer) { correct++; recordQuestionAttempt(q.id, true); }
          else { wrong++; recordQuestionAttempt(q.id, false); }
        });
        const score = Math.round((correct * 2 - wrong * 0.66) * 100) / 100;
        const maxScore = activeMock.questions.length * 2;
        const accuracy = (correct + wrong) ? Math.round((correct / (correct + wrong)) * 100) : 0;
        const timeUsed = activeMock.totalSec - activeMock.remainingSec;

        state.mockHistory.push({
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
          title: activeMock.title, score, maxScore, accuracy, timeSec: timeUsed
        });
        addXP(50, "Mock Test Completed!");
        const completedMock = activeMock;
        activeMock = null;
        saveStateToCloud();

        openModal(
          "Mock Test Performance Report",
          completedMock.title,
          `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-3 rounded-xl bg-royal-50"><div class="text-xl font-black text-royal-800">${score}/${maxScore}</div><div class="text-xs text-slate-600">UPSC Score</div></div>
              <div class="p-3 rounded-xl bg-emerald-50"><div class="text-xl font-black text-emerald-700">${accuracy}%</div><div class="text-xs text-slate-600">Accuracy</div></div>
              <div class="p-3 rounded-xl bg-amber-50"><div class="text-xl font-black text-amber-700">${correct} / ${wrong}</div><div class="text-xs text-slate-600">Right / Wrong</div></div>
              <div class="p-3 rounded-xl bg-purple-50"><div class="text-xl font-black text-purple-700">${Math.ceil(timeUsed/60)} min</div><div class="text-xs text-slate-600">Time Taken</div></div>
            </div>
            <div class="space-y-2 pt-2">
              <h4 class="font-bold text-navy-900 text-sm">Question-wise Review:</h4>
              ${completedMock.questions.map((q, i) => `
                <div class="p-3 rounded-xl border text-xs ${completedMock.answers[i] === q.answer ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}">
                  <div class="font-bold text-navy-900">Q${i+1}: ${q.q}</div>
                  <div class="mt-1 text-slate-700"><strong>Correct:</strong> (${String.fromCharCode(65 + q.answer)}) ${q.options[q.answer]} — ${q.whyCorrect}</div>
                </div>
              `).join("")}
            </div>
          `
        );
        renderPrelims();
      },

      /* Mains & Essay Actions */
      selectMainsPrompt(id) {
        selectedMainsPrompt = MAINS_PROMPTS.find(p => p.id === id) || MAINS_PROMPTS[0];
        renderMains();
      },
      updateMainsWordCount() {
        const text = document.getElementById("mains-answer-input").value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        document.getElementById("mains-word-count").textContent = `${words} words`;
      },
      async evaluateMainsAnswer() {
        const ans = document.getElementById("mains-answer-input").value.trim();
        if (ans.length < 30) { showToast("Please write at least a short structured answer before evaluating.", "warning"); return; }
        const out = document.getElementById("mains-ai-output");
        out.classList.remove("hidden");
        out.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>UPSC AI Examiner is evaluating your answer...`;
        const resp = await callGeminiAPI(
          `Evaluate this UPSC Mains answer.\nQuestion (${selectedMainsPrompt.marks} Marks): ${selectedMainsPrompt.q}\nStudent Answer: ${ans}\n\nProvide:\n1. Estimated Score out of ${selectedMainsPrompt.marks}\n2. Evaluation on Relevance, Structure (Intro-Body-Conclusion), Content, Examples/Articles, Keywords\n3. 3 Specific Improvement Suggestions\n4. Crisp Suggested Structure.`,
          "You are a strict yet encouraging UPSC Mains Examiner. Respond in " + (state.lang === 'hi' ? 'Hindi with English UPSC terms' : 'English') + "."
        );
        out.innerHTML = `<h4 class="font-extrabold text-royal-800">AI Examiner Evaluation Report</h4>` + formatMarkdown(resp);
        addXP(40, "Mains Answer Evaluated!");
      },
      async generateMainsModel() {
        const out = document.getElementById("mains-ai-output");
        out.classList.remove("hidden");
        out.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Drafting Topper-Quality Model Answer...`;
        const resp = await callGeminiAPI(
          `Write a UPSC topper-level structured Model Answer (${selectedMainsPrompt.words} words) for:\n"${selectedMainsPrompt.q}"\nInclude Introduction, Subheaded Body with Constitutional Articles/Data/Examples, and Way Forward Conclusion.`,
          "You are a UPSC Topper & Mentor. Language preference: " + state.lang
        );
        out.innerHTML = `<h4 class="font-extrabold text-purple-800">Topper Model Answer</h4>` + formatMarkdown(resp);
      },

      /* Interview Actions */
      saveDAF() {
        ["name", "homeState", "district", "education", "optional", "hobbies"].forEach(k => {
          state.dafProfile[k] = document.getElementById(`daf-${k}`).value.trim();
        });
        saveStateToCloud();
        showToast("DAF Profile saved! Board questions will now adapt to your profile.", "success");
      },
      resetInterview() {
        interviewMessages = [interviewMessages[0]];
        renderInterview();
      },
      async sendInterviewResponse() {
        const inp = document.getElementById("interview-input");
        const text = inp.value.trim();
        if (!text) return;
        inp.value = "";
        interviewMessages.push({ role: "user", text });
        interviewMessages.push({ role: "model", text: "Evaluating your response..." });
        renderInterview();

        const d = state.dafProfile;
        const resp = await callGeminiAPI(
          `Candidate DAF: State=${d.homeState}, District=${d.district}, Education=${d.education}, Optional=${d.optional}, Hobbies=${d.hobbies}.\nCandidate's Answer: "${text}"\n\nGive concise feedback on (1) Communication & Clarity, (2) Balanced Opinion, then ask the next penetrating UPSC Interview follow-up question (DAF, Situational, or Ethical).`,
          "You are the Chairperson of the UPSC Civil Services Personality Test Board. Be dignified, analytical, and constructive."
        );
        interviewMessages[interviewMessages.length - 1] = { role: "model", text: resp };
        addXP(25);
        renderInterview();
      },
      startVoiceInput(inputId) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { showToast("Voice recognition is not supported in this browser.", "warning"); return; }
        const recog = new SR();
        recog.lang = state.lang === "hi" ? "hi-IN" : "en-IN";
        showToast("Listening... Speak now.", "info");
        recog.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          const el = document.getElementById(inputId);
          if (el) el.value = transcript;
        };
        recog.onerror = () => showToast("Could not capture audio. Try typing.", "warning");
        recog.start();
      },

      /* AI Personal Mentor Actions */
      askMentorQuick(prompt) {
        state.activeTab = "mentor";
        renderAll();
        document.getElementById("mentor-input").value = prompt;
        this.sendMentorMessage();
      },
      clearMentorChat() {
        mentorMessages = [mentorMessages[0]];
        renderMentor();
      },
      async sendMentorMessage() {
        const inp = document.getElementById("mentor-input");
        const text = inp.value.trim();
        if (!text) return;
        inp.value = "";
        mentorMessages.push({ role: "user", text });
        mentorMessages.push({ role: "model", text: "Thinking..." });
        renderMentor();

        const weak = getWeakTopics().map(w => w.subject).join(", ");
        const sys = `You are WONDER IAS Personal AI Mentor. Student Context: Stage ${state.currentStage}/10 (${STAGES[state.currentStage - 1].en}), Target Exam: ${state.targetExam}, Weak Subjects: ${weak}, Preferred Language: ${state.lang === 'hi' ? 'Natural Hindi with English UPSC terms' : state.lang === 'bi' ? 'Bilingual English + Hindi' : 'Clear English'}. Adapt depth to student's stage and never overwhelm beginners.`;
        const resp = await callGeminiAPI(text, sys);
        mentorMessages[mentorMessages.length - 1] = { role: "model", text: resp };
        addXP(10);
        renderMentor();
      },

      /* Study Plan Generator */
      generateStudyPlan() {
        const exam = document.getElementById("plan-exam").value;
        const duration = document.getElementById("plan-duration").value;
        const hours = Number(document.getElementById("plan-hours").value);
        const weakFocus = getWeakTopics().map(w => w.subject).join(" & ");

        const coreHrs = Math.max(1, Math.round(hours * 0.45 * 10) / 10);
        const caHrs = Math.max(0.5, Math.round(hours * 0.2 * 10) / 10);
        const pracHrs = Math.max(0.5, Math.round(hours * 0.2 * 10) / 10);
        const revHrs = Math.max(0.5, Math.round((hours - coreHrs - caHrs - pracHrs) * 10) / 10);

        state.targetExam = exam;
        state.savedStudyPlan = {
          exam, duration, hours, weakFocus,
          dailyBlocks: [
            { time: `${coreHrs} hrs`, title: "Core GS & Optional", desc: `Focus on NCERTs -> Standard Books & weak areas (${weakFocus})` },
            { time: `${caHrs} hrs`, title: "Daily Current Affairs", desc: "PIB, Newspaper Editorials & Syllabus-mapped notes" },
            { time: `${pracHrs} hrs`, title: "Prelims MCQ / Mains Writing", desc: "15 Prelims MCQs + 1 timed Mains answer / CSAT practice" },
            { time: `${revHrs} hrs`, title: "Spaced Revision", desc: "1h → 1d → 5d → 7d → 14d → 21d active recall cycle" }
          ],
          phases: [
            { title: "Phase 1: Foundation & NCERT Mastery", tasks: "Complete Class 6–12 NCERTs (Polity, History, Geography, Economy) + Daily Current Affairs habit." },
            { title: "Phase 2: Standard Books & Optional Paper I–II", tasks: "Laxmikanth, Spectrum, Shankar IAS, Economy Survey + Ethics GS-IV Case Studies + Weekly Answer Writing." },
            { title: "Phase 3: Prelims & CSAT Intensive Sprint", tasks: "Full-Length Mock Tests (+2/-0.66), PYQ Analysis (10 years), Map Drills & Spaced Revision." },
            { title: "Phase 4: Mains Simulation & Interview Board", tasks: "Timed 3-hour Mains papers, Essay Masterclass, DAF analysis & AI Mock Interviews." }
          ]
        };
        saveStateToCloud();
        addXP(20, "Personalized Study Plan Created!");
        renderStudyPlan();
      },

      /* Admin & Data Export/Import */
      adminAddTopic() {
        const subject = document.getElementById("adm-t-subj").value.trim() || "Polity";
        const paper = document.getElementById("adm-t-paper").value.trim() || "GS-II";
        const title = document.getElementById("adm-t-title").value.trim();
        const hiTitle = document.getElementById("adm-t-hi").value.trim() || title;
        const notes = document.getElementById("adm-t-notes").value.trim();
        if (!title || !notes) { showToast("Please enter Topic Title and Notes.", "warning"); return; }

        const newTopic={id:createPermanentId("topic"),recordVersion:1,createdAt:Date.now(),updatedAt:Date.now(),status:"active",tags:[],subject,category:"Custom Module",paper,title,hiTitle,level:"Stage 4: Standard",estTime:"30 min",prereq:"Foundation",quickNotes:notes,detailedNotes:notes,hiNotes:notes,keyFacts:["Added via Admin Studio"],pyqConn:"Teacher-curated high-yield topic"};
        const fingerprint = recordFingerprint("topic", newTopic);
        if (state.customSyllabus.some(x => recordFingerprint("topic", x) === fingerprint)) {
          showToast("Duplicate topic detected. Existing master record was kept.", "warning"); return;
        }
        state.customSyllabus.push(newTopic);
        normalizeMasterData();
        saveStateToCloud();
        showToast("New Syllabus Topic Published!", "success");
        renderAdmin();
      },
      adminAddQuestion() {
        const subject = document.getElementById("adm-q-subj").value.trim() || "Polity";
        const authenticity = document.getElementById("adm-q-auth").value;
        const q = document.getElementById("adm-q-text").value.trim();
        const options = [0,1,2,3].map(i => document.getElementById(`adm-q-o${i}`).value.trim());
        const answer = Number(document.getElementById("adm-q-ans").value);
        const exp = document.getElementById("adm-q-exp").value.trim() || "Verified explanation.";
        if (!q || options.some(o => !o)) { showToast("Please fill the question and all 4 options.", "warning"); return; }

        const newQuestion={id:createPermanentId("question"),recordVersion:1,createdAt:Date.now(),updatedAt:Date.now(),status:"active",tags:[],subject,topic:"Admin Curated",paper:"Prelims GS",type:"Standard MCQ",level:"LEVEL 4 — ADVANCED",authenticity,year:"Admin Bank",q,hiQ:q,options,answer,whyCorrect:exp,whyWrong:"Other options do not match standard UPSC facts.",concept:subject,trick:"Revise key terms carefully."};
        const qFingerprint = recordFingerprint("question", newQuestion);
        if (state.customQuestions.some(x => recordFingerprint("question", x) === qFingerprint)) {
          showToast("Duplicate question detected. Existing master record was kept.", "warning"); return;
        }
        state.customQuestions.push(newQuestion);
        normalizeMasterData();
        saveStateToCloud();
        showToast("Question added to Smart Question Bank!", "success");
        renderAdmin();
      },
      exportDataJSON() {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wonder-ias-backup-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Student & Admin backup exported!", "success");
      },
      importDataJSON(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const imported = JSON.parse(reader.result);
            if (!imported || typeof imported !== "object") throw new Error("Invalid backup");
            const topics=mergeImportedArray(state.customSyllabus,imported.customSyllabus,"topic");
            const questions=mergeImportedArray(state.customQuestions,imported.customQuestions,"question");
            const ca=mergeImportedArray(state.customCA,imported.customCA,"ca");
            const protectedKeys=["lang","wonderVersion","activeTab","adminMode","currentStage","targetExam","xp","streak","studyHours","completedTopics","bookmarks","personalNotes","dailyTargets","questionHistory","mockHistory","dafProfile","savedStudyPlan"];
            const mergedPrefs={...state};
            for(const key of protectedKeys){const incoming=imported[key];if(incoming===undefined||incoming===null)continue;
              if(key==="completedTopics"||key==="bookmarks")mergedPrefs[key]=[...new Set([...(state[key]||[]),...(Array.isArray(incoming)?incoming:[])])];
              else if(key==="personalNotes"||key==="questionHistory"||key==="dafProfile")mergedPrefs[key]={...(state[key]||{}),...(typeof incoming==="object"?incoming:{})};
              else if(key==="dailyTargets"||key==="adminMode")mergedPrefs[key]=state[key];
              else if(key==="mockHistory")mergedPrefs[key]=[...(state[key]||[]),...(Array.isArray(incoming)?incoming.filter(n=>!(state[key]||[]).some(o=>JSON.stringify(o)===JSON.stringify(n))):[])];
              else if(key==="savedStudyPlan")mergedPrefs[key]=state[key]||incoming;
              else if(["xp","streak","studyHours","currentStage"].includes(key))mergedPrefs[key]=Math.max(Number(state[key]||0),Number(incoming||0));
              else mergedPrefs[key]=incoming;
            }
            const archives=[...(state.masterDataMeta?.archived||[]),...(Array.isArray(imported.masterDataMeta?.archived)?imported.masterDataMeta.archived:[])];
            const archiveMap=new Map(archives.map(x=>[String(x.kind)+":"+String(x.record?.id||recordFingerprint(x.kind,x.record||{})),x]));
            const registryRecords=[...(state.masterRegistry?.records||[]),...(imported.masterRegistry?.records||[])];
            const registryMap=new Map(registryRecords.filter(x=>x?.id).map(x=>[String(x.id),x]));
            state={...mergedPrefs,customSyllabus:topics.items,customQuestions:questions.items,customCA:ca.items,
              masterRegistry:{...(state.masterRegistry||{}),files:dedupeRegistryFiles([...(state.masterRegistry?.files||[]),...(imported.masterRegistry?.files||[])]),records:[...registryMap.values()]},
              masterDataMeta:{...(state.masterDataMeta||{}),archived:[...archiveMap.values()],versions:[...(state.masterDataMeta?.versions||[]),...(imported.masterDataMeta?.versions||[])]},
              duplicateAuditLog:[...(state.duplicateAuditLog||[]),...(imported.duplicateAuditLog||[]),{at:Date.now(),action:"IMPORT_MERGE",added:{topics:topics.added,questions:questions.added,currentAffairs:ca.added},skipped:{topics:topics.skipped,questions:questions.skipped,currentAffairs:ca.skipped}}]};
            normalizeMasterData();
            saveStateToCloud();
            renderAll();
            showToast(`Import merged safely: ${topics.added} topics, ${questions.added} questions, ${ca.added} current affairs added; duplicates skipped.`, "success");
          } catch {
            showToast("Invalid JSON backup file.", "error");
          }
        };
        reader.readAsText(file);
      },
      searchMasterDataUI(query) {
        const out=document.getElementById("master-search-results");if(!out)return;
        const results=searchMasterData(query).slice(0,100);
        if(!results.length){out.innerHTML='<div class="text-xs text-slate-500 p-3">No matching master records.</div>';return;}
        out.innerHTML=results.map(x=>`<div class="p-3 rounded-xl border border-slate-200 bg-white flex flex-wrap justify-between gap-2"><div class="min-w-0"><div class="text-[10px] uppercase font-bold text-blue-700">${escapeMasterHTML(x.kind)} • ${escapeMasterHTML(x.subject)} • ${escapeMasterHTML(x.id||"MISSING ID")}</div><div class="font-semibold text-slate-800 break-words">${escapeMasterHTML(x.title)}</div><div class="text-[10px] text-slate-500">${escapeMasterHTML(x.record.paper||x.record.topic||x.record.year||"Built-in / Master")}</div></div><div>${String(x.id||"").startsWith("TOP-")||String(x.id||"").startsWith("QUE-")||String(x.id||"").startsWith("CA-")?`<button onclick="W.archiveMasterRecord('${escapeMasterHTML(x.kind)}','${escapeMasterHTML(x.id)}')" class="px-2 py-1 rounded-lg border text-[10px] font-bold">Archive</button>`:"<span class='text-[10px] text-slate-400'>Built-in</span>"}</div></div>`).join("");
      },
      archiveMasterRecord(kind,id) {
        if(!id){showToast("Record has no ID; archive cancelled.","warning");return;}
        const key=kind==="topic"?"customSyllabus":kind==="question"?"customQuestions":"customCA";
        const index=state[key].findIndex(x=>String(x.id)===String(id));if(index<0){showToast("Only custom records can be archived here.","info");return;}
        if(!confirm("Archive this master record? A backup copy will be retained and can be restored."))return;
        const record=state[key][index];state.masterDataMeta.archived=state.masterDataMeta.archived.filter(x=>!(x.kind===kind&&String(x.record?.id)===String(id)));
        state.masterDataMeta.archived.push({kind,record,archivedAt:Date.now(),archivedBy:"admin"});state[key].splice(index,1);
        state.duplicateAuditLog.push({at:Date.now(),action:"ARCHIVE_RECORD",kind,id});saveStateToCloud();renderAdmin();showToast("Record archived and retained for restore.","success");
      },
      exportMasterDataBackup() {
        const payload={schemaVersion:2,exportedAt:new Date().toISOString(),state:{customSyllabus:state.customSyllabus,customQuestions:state.customQuestions,customCA:state.customCA,masterRegistry:state.masterRegistry,masterDataMeta:state.masterDataMeta,duplicateAuditLog:state.duplicateAuditLog}};
        const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`wonder-ias-master-data-v2-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);showToast("V2 Master Data backup exported.","success");
      },
      runMasterAudit() {
        const report = runDuplicateAudit();
        const out = document.getElementById("master-audit-result");
        if (out) {
          out.innerHTML = `<div class="font-bold text-navy-900 mb-1">Audit completed: ${report.duplicateCount} duplicate record(s) across ${report.duplicateGroups.length} group(s).</div>
            <div>Topics: ${report.customTopics} • Questions: ${report.customQuestions} • Current Affairs: ${report.customCA} • Registered Files: ${report.registeredFiles}</div>
            ${report.duplicateGroups.length ? `<ul class="mt-2 space-y-1">${report.duplicateGroups.map(g=>`<li class="text-rose-700"><strong>${g.section}:</strong> ${g.titles.join(" / ")}</li>`).join("")}</ul>` : `<div class="mt-2 text-emerald-700 font-semibold">No duplicate custom records detected.</div>`}`;
        }
        saveStateToCloud();
        showToast("Master data audit completed.", report.duplicateCount ? "warning" : "success");
        return report;
      },
      repairMasterDuplicates() {
        const result = normalizeMasterData();
        state.duplicateAuditLog.push({at:Date.now(),action:"SAFE_DEDUPE",removed:result.totalRemoved,details:result});
        saveStateToCloud();
        renderAdmin();
        showToast(`Safe deduplication complete. ${result.totalRemoved} duplicate(s) removed; master IDs preserved.`, result.totalRemoved ? "success" : "info");
        return result;
      },
      exportMasterRegistry() {
        const registry = { schemaVersion: 1, exportedAt: new Date().toISOString(), registry: state.masterRegistry, auditLog: state.duplicateAuditLog };
        const blob = new Blob([JSON.stringify(registry,null,2)],{type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a=document.createElement("a");a.href=url;a.download=`wonder-ias-master-registry-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
        showToast("Master registry exported.", "success");
      },
      closeModal
    };

    /* =========================================================================
       21. INITIALIZE APPLICATION ON LOAD
       ========================================================================= */
    window.addEventListener("DOMContentLoaded", () => {
      normalizeMasterData();
      renderAll();
      initFirebase();
    });
  