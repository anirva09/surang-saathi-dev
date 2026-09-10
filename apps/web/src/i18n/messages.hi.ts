import type { Messages } from "./messages.en";

/**
 * Hindi messages — a curated translation, not machine output.
 *
 * Typed as `Messages`, so omitting or misspelling a key fails the build.
 * Identifiers, hashes, coordinates and proper names are never translated;
 * they do not appear here.
 */
export const hi: Messages = {
  // ── Government utility strip ───────────────────────────────────────
  "gov.country": "भारत सरकार",
  "gov.ministry": "कोयला मंत्रालय",
  "gov.skip": "मुख्य सामग्री पर जाएँ",

  // ── Accessibility + language controls ──────────────────────────────
  "a11y.textSize": "अक्षर आकार",
  "a11y.textSmaller": "छोटा अक्षर आकार",
  "a11y.textDefault": "सामान्य अक्षर आकार",
  "a11y.textLarger": "बड़ा अक्षर आकार",
  "lang.group": "इंटरफ़ेस भाषा",
  "lang.english": "English",
  "lang.hindi": "हिन्दी",
  "lang.switchToEnglish": "इंटरफ़ेस अंग्रेज़ी में बदलें",
  "lang.switchToHindi": "इंटरफ़ेस हिन्दी में बदलें",

  // ── Prototype notice ───────────────────────────────────────────────
  "proto.title": "एसआईएच 2026 प्रोटोटाइप।",
  "proto.body":
    "सुरंग साथी एक छात्र परियोजना है और यह भारत सरकार की आधिकारिक सेवा नहीं है। यहाँ दिखाए गए सभी आँकड़े केवल उदाहरण हेतु प्रदर्शन डेटा हैं।",

  // ── Brand ──────────────────────────────────────────────────────────
  "brand.name": "सुरंग साथी",
  "brand.tagline": "सुरक्षित खदान। सशक्त भविष्य।",
  "brand.descriptor": "स्मार्ट खदान सुरक्षा एवं अनुपालन मंच",
  "brand.home": "सुरंग साथी — मुख्य पृष्ठ",

  // ── Public navigation ──────────────────────────────────────────────
  "nav.primary": "मुख्य",
  "nav.footer": "फुटर",
  "nav.home": "मुख्य पृष्ठ",
  "nav.about": "परिचय",
  "nav.features": "विशेषताएँ",
  "nav.fieldTeams": "क्षेत्रीय दलों हेतु",
  "nav.managers": "प्रबंधकों हेतु",
  "nav.resources": "संसाधन",
  "nav.contact": "संपर्क",
  "nav.menu": "मेन्यू",
  "nav.close": "बंद करें",
  "nav.openMenu": "मेन्यू खोलें",
  "nav.closeMenu": "मेन्यू बंद करें",
  "nav.login": "पोर्टल में लॉगिन",
  "nav.loginShort": "लॉगिन",

  // ── Hero ───────────────────────────────────────────────────────────
  "hero.eyebrow": "सुरक्षित खदानों के लिए एक डिजिटल मंच",
  "hero.headlineLead": "लोगों को सशक्त बनाना।",
  "hero.headlineAccent": "सुरक्षित खदान। सशक्त भविष्य।",
  "hero.body":
    "सुरंग साथी खदान सुरक्षा के लिए एक एकीकृत डिजिटल मंच है: क्षेत्रीय दल नेटवर्क के बिना भी संकट और निरीक्षण दर्ज करते हैं, साक्ष्य सर्वर पर सत्यापित होते हैं, सुधारात्मक कार्रवाई पर नामित उत्तरदायी अधिकारी और समय-सीमा होती है, और हर चरण एक अपरिवर्तनीय अंकेक्षण अभिलेख में दर्ज होता है।",
  "hero.getStarted": "आरंभ करें",
  "hero.knowMore": "और जानें",
  "hero.imageAlt":
    "एक खदान सुरक्षा अधिकारी, उच्च-दृश्यता वस्त्र और हेलमेट पहने, खुली खदान में टैबलेट पर निरीक्षण दर्ज करते हुए।",
  "hero.placeholder": "अस्थायी चित्र",
  "hero.panelLine1": "सुरक्षित खदान",
  "hero.panelLine2": "समृद्ध भारत",
  "hero.pillarPeople": "जन",
  "hero.pillarSafety": "सुरक्षा",
  "hero.pillarAccountability": "उत्तरदायित्व",
  "hero.pillarSustainability": "संधारणीयता",

  // ── Statistics ─────────────────────────────────────────────────────
  "stats.heading": "मंच के आँकड़े — केवल उदाहरण हेतु प्रोटोटाइप आँकड़े",
  "stats.disclaimer": "उदाहरण हेतु प्रोटोटाइप आँकड़े — सजीव डेटा नहीं",
  "stats.inspections": "दर्ज निरीक्षण",
  "stats.hazards": "चिह्नित संकट",
  "stats.users": "क्षेत्रीय उपयोगकर्ता",
  "stats.resolved": "निस्तारित प्रकरण",

  // ── Key features ───────────────────────────────────────────────────
  "features.heading": "प्रमुख विशेषताएँ",
  "features.exploreAll": "सभी विशेषताएँ देखें",
  "features.inspections.title": "डिजिटल निरीक्षण",
  "features.inspections.body":
    "चलते-फिरते संकट, साक्ष्य और अवलोकन दर्ज करें — भूमिगत नेटवर्क न होने पर भी।",
  "features.analytics.title": "सुरक्षा विश्लेषण",
  "features.analytics.body":
    "व्याख्या-योग्य, नियम-आधारित जोखिम सूचकांक से सभी स्थलों का सुरक्षा प्रदर्शन देखें।",
  "features.accountability.title": "उत्तरदायित्व",
  "features.accountability.body":
    "प्रत्येक सुधारात्मक कार्रवाई पर नामित उत्तरदायी अधिकारी, समय-सीमा और उन्नयन प्रक्रिया होती है।",
  "features.evidence.title": "भू-सत्यापित साक्ष्य",
  "features.evidence.body":
    "प्रत्येक निरीक्षण के चित्र, स्थान और समय-मुद्रा सर्वर पर सत्यापित।",
  "features.compliance.title": "नियामक अनुपालन",
  "features.compliance.body":
    "वैधानिक दायित्व, नियत तिथियाँ और उन्हें पूर्ण करने वाला साक्ष्य अभिलेख।",

  // ── Credibility band ───────────────────────────────────────────────
  "band.heading": "सुरंग साथी के बारे में",
  "band.quote":
    "सुरक्षित खदानों और सुदृढ़ उत्तरदायित्व के लिए प्रौद्योगिकी।",
  "band.attribution": "सुरंग साथी परियोजना वक्तव्य",
  "band.cta": "और जानें",
  "band.imageAlt":
    "सीढ़ीनुमा बेंच और ढुलाई मार्गों सहित एक खुली कोयला खदान का विस्तृत दृश्य।",

  // ── Footer ─────────────────────────────────────────────────────────
  "footer.privacy": "गोपनीयता नीति",
  "footer.terms": "उपयोग की शर्तें",
  "footer.help": "सहायता",
  "footer.sihBadge": "एसआईएच 2026",
  "footer.sihSub": "छात्र प्रोटोटाइप",
  "footer.youtube": "यूट्यूब पर परियोजना चैनल",
  "footer.linkedin": "लिंक्डइन पर परियोजना पृष्ठ",
  "footer.disclaimerTitle": "प्रोटोटाइप अस्वीकरण।",
  "footer.disclaimer":
    "सुरंग साथी स्मार्ट इंडिया हैकाथॉन 2026 का छात्र प्रोटोटाइप है। यह भारत सरकार, कोयला मंत्रालय, कोल इंडिया अथवा डीजीएमएस की आधिकारिक सेवा नहीं है और इसे किसी सरकारी अनुमोदन का समर्थन प्राप्त नहीं है। यहाँ दिखाए गए सभी आँकड़े उदाहरण हेतु प्रदर्शन डेटा हैं।",
  "footer.domainNote":
    "कोयला मंत्रालय के समस्या-क्षेत्र हेतु निर्मित; इससे संबद्ध अथवा अनुमोदित नहीं।",

  // ── Not found ──────────────────────────────────────────────────────
  "notfound.title": "यह पृष्ठ अभी बनाया नहीं गया है",
  "notfound.body1":
    "इस संस्करण में सार्वजनिक मुख्य पृष्ठ और प्रबंधक सुरक्षा डैशबोर्ड सम्मिलित हैं। परिचय, क्षेत्रीय दलों हेतु, प्रबंधकों हेतु और संसाधन पृष्ठ — साथ ही संकट रजिस्टर, सुधारात्मक कार्रवाई, जोखिम और अंकेक्षण अभिलेख स्क्रीन — कार्ययोजना में हैं और अभी बनाई नहीं गई हैं।",
  "notfound.body2":
    "आपने जिस लिंक का अनुसरण किया वह उसी मार्ग की ओर संकेत करता है जिसे यह पृष्ठ आगे चलकर लेगा — यह कोई सजावटी बटन नहीं है, इसे अभी बनाया नहीं गया है।",
  "notfound.home": "मुख्य पृष्ठ पर लौटें",
  "notfound.dashboard": "सुरक्षा डैशबोर्ड खोलें",

  // ── Signed-in workspace navigation ─────────────────────────────────
  "work.nav": "कार्यक्षेत्र",
  "work.nav.dashboard": "डैशबोर्ड",
  "work.nav.hazards": "संकट",
  "work.nav.risk": "जोखिम",
  "work.nav.audit": "अंकेक्षण",
  "work.backToSite": "सार्वजनिक पृष्ठ पर लौटें",

  // ── Error and empty states ─────────────────────────────────────────
  "state.error.unreachable.title": "सुरक्षा एपीआई तक पहुँच नहीं हो सकी",
  "state.error.unreachable.body":
    "यह स्क्रीन सुरंग साथी एपीआई से सजीव आँकड़े पढ़ती है। एपीआई ने उत्तर नहीं दिया, अतः दिखाने हेतु कुछ नहीं है। इसके स्थान पर कोई प्रदर्शन डेटा नहीं रखा गया है — रिक्त आँकड़ा गढ़े हुए आँकड़े से अधिक सत्यनिष्ठ है।",
  "state.error.unreachable.hint":
    "बैकएंड को docker compose up से आरंभ करें, तत्पश्चात यह पृष्ठ पुनः लोड करें।",
  "state.error.notFound.title": "यह अभिलेख विद्यमान नहीं है",
  "state.error.notFound.body":
    "एपीआई ने सूचित किया कि आपके द्वारा माँगा गया अभिलेख रजिस्टर में नहीं है।",
  "state.error.conflict.title": "यह परिवर्तन इस समय अनुमत नहीं है",
  "state.error.conflict.body":
    "अभिलेख की वर्तमान स्थिति आपके प्रयास किए गए कार्य की अनुमति नहीं देती। वर्तमान स्थिति देखने हेतु पृष्ठ पुनः लोड करें।",
  "state.error.validation.title": "प्रस्तुति अस्वीकृत कर दी गई",
  "state.error.validation.body":
    "एपीआई ने भेजे गए मानों को अस्वीकार कर दिया। प्रत्येक क्षेत्र का संदेश उसके साथ दिखाया गया है।",
  "state.error.generic.title": "यह आँकड़ा लोड नहीं हो सका",
  "state.error.generic.body":
    "एपीआई ने त्रुटि के साथ उत्तर दिया। त्रुटि का कोड नीचे दिया गया है जिससे विफलता का पता लगाया जा सके।",
  "state.error.codeLabel": "त्रुटि कोड",
  "state.error.statusLabel": "एचटीटीपी स्थिति",
  "state.error.messageLabel": "सूचित संदेश",
  "state.error.retry": "यह पृष्ठ पुनः लोड करें",
  "state.empty.title": "दिखाने हेतु कुछ नहीं",
  "state.empty.hazards":
    "रजिस्टर में कोई भी संकट वर्तमान छननी के अनुरूप नहीं है।",
  "state.empty.audit": "अंकेक्षण अभिलेख में अभी कोई प्रविष्टि नहीं है।",
  "state.empty.evidence": "इस संकट के साथ कोई साक्ष्य संलग्न नहीं है।",
  "state.empty.actions":
    "इस संकट के विरुद्ध कोई सुधारात्मक कार्रवाई दर्ज नहीं की गई है।",
  "state.loading": "सजीव आँकड़े लोड हो रहे हैं…",

  // ── Shared domain vocabulary ───────────────────────────────────────
  "domain.severity": "गंभीरता",
  "domain.severity.LOW": "न्यून",
  "domain.severity.MEDIUM": "मध्यम",
  "domain.severity.HIGH": "उच्च",
  "domain.status": "स्थिति",
  "domain.status.OPEN": "खुला",
  "domain.status.ACKNOWLEDGED": "संज्ञान लिया गया",
  "domain.status.OVERDUE": "अवधि बीती",
  "domain.status.ESCALATED": "उच्च स्तर पर भेजा गया",
  "domain.status.RESOLVED": "निस्तारित",
  "domain.sync": "समकालन",
  "domain.sync.QUEUED": "पंक्ति में",
  "domain.sync.SYNCING": "समकालन हो रहा है",
  "domain.sync.SYNCED": "समकालित",
  "domain.sync.CONFLICT": "समकालन विरोध",
  "domain.sync.OFFLINE": "संपर्क से बाहर",
  "domain.geofence": "स्थान प्रमाण",
  "domain.geofence.LOCAL_VALID": "उपकरण पर वैध",
  "domain.geofence.SERVER_PENDING": "सर्वर जाँच प्रतीक्षित",
  "domain.geofence.SERVER_VERIFIED": "सर्वर द्वारा सत्यापित",
  "domain.geofence.OUTSIDE_GEOFENCE": "खान सीमा के बाहर",
  "domain.geofence.CONFLICT": "स्थान विरोध",
  "domain.reportedBy": "सूचनाकर्ता",
  "domain.assignedTo": "उत्तरदायी",
  "domain.unassigned": "अनिर्दिष्ट",
  "domain.location": "स्थान",
  "domain.capturedAt": "अंकित",
  "domain.syncedAt": "समकालित",
  "domain.dueAt": "नियत",
  "domain.mine": "खान",
  "domain.area": "क्षेत्र",
  "domain.evidenceCount": "साक्ष्य",
  "domain.actionCount": "कार्रवाइयाँ",

  // ── Manager dashboard ──────────────────────────────────────────────
  "dash.title": "सुरक्षा डैशबोर्ड",
  "dash.subtitle":
    "{mine} हेतु — क्या असुरक्षित है, किसकी अवधि बीत चुकी है, वह किसके उत्तरदायित्व में है, और अभी किस पर कार्रवाई आवश्यक है।",
  "dash.asOf": "{timestamp} तक के सजीव आँकड़े",
  "dash.kpi.heading": "वर्तमान सुरक्षा स्थिति",
  "dash.kpi.openHazards": "खुले संकट",
  "dash.kpi.openHazards.help": "सूचित, अभी तक अनिस्तारित",
  "dash.kpi.highRiskHazards": "उच्च गंभीरता के संकट",
  "dash.kpi.highRiskHazards.help": "खुले तथा उच्च श्रेणी में",
  "dash.kpi.overdueCorrectiveActions": "अवधि बीती कार्रवाइयाँ",
  "dash.kpi.overdueCorrectiveActions.help": "नियत तिथि बीती, अनिस्तारित",
  "dash.kpi.conflictedHazards": "साक्ष्य विरोध",
  "dash.kpi.conflictedHazards.help": "समकालन अथवा स्थान प्रमाण विवादित",
  "dash.risk.heading": "खान जोखिम सूचकांक",
  "dash.risk.none":
    "इस खान हेतु अभी कोई जोखिम गणना दर्ज नहीं है। प्रथम गणना बनाने हेतु जोखिम स्क्रीन पर पुनर्गणना चलाएँ।",
  "dash.risk.factors": "योगदायी कारक",
  "dash.risk.weight": "भार",
  "dash.risk.currentValue": "वर्तमान मान",
  "dash.risk.open": "जोखिम विश्लेषण खोलें",
  "dash.next.heading": "कहाँ कार्रवाई करें",
  "dash.next.hazards": "संकट रजिस्टर देखें",
  "dash.next.hazards.help":
    "प्रत्येक सूचित संकट, उसका उत्तरदायी, नियत तिथि और साक्ष्य स्थिति।",
  "dash.next.risk": "जोखिम सूचकांक परखें",
  "dash.next.risk.help":
    "प्रत्येक कारक अंक में कितना योगदान करता है, और उसकी पुनर्गणना।",
  "dash.next.audit": "अंकेक्षण अभिलेख सत्यापित करें",
  "dash.next.audit.help":
    "प्रत्येक परिवर्तन का केवल-वर्धनशील अभिलेख, और उसकी हैश-श्रृंखला का निर्णय।",

  // ── Hazard register ────────────────────────────────────────────────
  "hazards.title": "संकट रजिस्टर",
  "hazards.subtitle":
    "{mine} पर सूचित प्रत्येक संकट, उसके उत्तरदायी, साक्ष्य और समकालन स्थिति सहित।",
  "hazards.showing": "{total} में से {shown} संकट दिखाए जा रहे हैं",
  "hazards.filter.heading": "रजिस्टर छानें",
  "hazards.filter.severity": "गंभीरता",
  "hazards.filter.status": "स्थिति",
  "hazards.filter.any": "कोई भी",
  "hazards.filter.apply": "छननी लागू करें",
  "hazards.filter.clear": "छननी हटाएँ",
  "hazards.table.caption": "सूचित संकट",
  "hazards.open": "संकट {id} खोलें",
  "hazards.prev": "पिछला पृष्ठ",
  "hazards.next": "अगला पृष्ठ",
  "hazards.page": "पृष्ठ {page} / {pages}",

  // ── Hazard detail ──────────────────────────────────────────────────
  "hazard.back": "संकट रजिस्टर पर लौटें",
  "hazard.description": "सूचित विवरण",
  "hazard.facts": "अभिलेख",
  "hazard.evidence.heading": "साक्ष्य",
  "hazard.evidence.file": "संचिका",
  "hazard.evidence.size": "आकार",
  "hazard.evidence.hash": "एसएचए-256",
  "hazard.evidence.captured": "अंकित",
  "hazard.evidence.coords": "निर्देशांक",
  "hazard.evidence.accuracy": "यथार्थता",
  "hazard.evidence.localState": "उपकरण का निर्णय",
  "hazard.evidence.serverState": "सर्वर का निर्णय",
  "hazard.evidence.noCoords": "दर्ज नहीं",
  "hazard.actions.heading": "सुधारात्मक कार्रवाइयाँ",
  "hazard.actions.owner": "उत्तरदायी",
  "hazard.actions.due": "नियत तिथि",
  "hazard.actions.acknowledged": "संज्ञान लिया गया",
  "hazard.actions.resolved": "निस्तारित",

  // ── Hazard mutations ───────────────────────────────────────────────
  "mutate.heading": "प्रबंधक निर्णय",
  "mutate.actingAs": "{actor} के रूप में कार्य",
  "mutate.noAuthNotice":
    "इस प्रोटोटाइप में कोई प्रमाणीकरण सेवा नहीं है। कार्रवाइयाँ एक नियत प्रदर्शन उपयोगकर्ता के नाम दर्ज होती हैं, और अंकेक्षण अभिलेख उसी उपयोगकर्ता का नाम सत्यनिष्ठा से लिखता है — यह किसी सत्यापित सरकारी लॉगिन का आभास नहीं देता।",
  "mutate.acknowledge": "संकट का संज्ञान लें",
  "mutate.acknowledge.help":
    "दर्ज करता है कि प्रबंधक ने यह संकट देख लिया है। अंकेक्षण अभिलेख में लिखा जाता है।",
  "mutate.review.heading": "समीक्षा और पुनर्श्रेणीकरण",
  "mutate.review.severity": "संशोधित गंभीरता",
  "mutate.review.status": "संशोधित स्थिति",
  "mutate.review.unchanged": "अपरिवर्तित रखें",
  "mutate.review.submit": "समीक्षा दर्ज करें",
  "mutate.action.heading": "सुधारात्मक कार्रवाई दर्ज करें",
  "mutate.action.description": "क्या किया जाना है",
  "mutate.action.assignee": "किसे सौंपें (उपयोगकर्ता आईडी)",
  "mutate.action.due": "नियत तिथि",
  "mutate.action.submit": "कार्रवाई दर्ज करें",
  "mutate.action.resolve": "निस्तारित चिह्नित करें",
  "mutate.action.resolve.help":
    "किसी संकट की अंतिम खुली कार्रवाई निस्तारित करने पर संकट स्वयं भी निस्तारित हो जाता है।",
  "mutate.evidence.heading": "साक्ष्य संलग्न करें",
  "mutate.evidence.file": "छायाचित्र",
  "mutate.evidence.fileHelp": "जेपीईजी, पीएनजी अथवा वेबपी, अधिकतम 10 एमबी।",
  "mutate.evidence.latitude": "अक्षांश",
  "mutate.evidence.longitude": "देशांतर",
  "mutate.evidence.accuracy": "जीपीएस यथार्थता (मीटर)",
  "mutate.evidence.capturedAt": "अंकन समय",
  "mutate.evidence.submit": "साक्ष्य अपलोड करें",
  "mutate.evidence.tooLarge": "यह संचिका 10 एमबी की सीमा से बड़ी है।",
  "mutate.evidence.wrongType":
    "साक्ष्य जेपीईजी, पीएनजी अथवा वेबपी चित्र होना चाहिए।",
  "mutate.evidence.hashVerified":
    "सर्वर ने संचिका का हैश पुनः गणना किया और वह मिल गया।",
  "mutate.evidence.hashMismatch":
    "सर्वर का हैश संचिका के साथ भेजे गए हैश से मेल नहीं खाया।",
  "mutate.success": "दर्ज हो गया। अभिलेख अद्यतन कर दिया गया है।",
  "mutate.pending": "दर्ज हो रहा है…",
  "mutate.required": "आवश्यक",

  // ── Risk ───────────────────────────────────────────────────────────
  "risk.title": "खान जोखिम सूचकांक",
  "risk.subtitle":
    "{mine} हेतु नियम-आधारित, सुबोध अंक — प्रत्येक कारक, उसका भार और उसका योगदान।",
  "risk.score": "जोखिम अंक",
  "risk.level": "जोखिम स्तर",
  "risk.calculatedAt": "{timestamp} पर गणना",
  "risk.snapshotId": "गणना अभिलेख",
  "risk.factors.caption": "जोखिम कारक और उनके योगदान",
  "risk.factors.name": "कारक",
  "risk.factors.weight": "भार",
  "risk.factors.value": "वर्तमान मान",
  "risk.factors.score": "कारक अंक",
  "risk.factors.contribution": "योगदान",
  "risk.factors.source": "स्रोत",
  "risk.notCalculated": "गणना नहीं हुई",
  "risk.recalc.heading": "सूचकांक की पुनर्गणना",
  "risk.recalc.body":
    "पुनर्गणना वर्तमान संकट और कार्रवाई आँकड़े पढ़ती है और एक नया अभिलेख अंकेक्षण में लिखती है। पूर्व अभिलेख सुरक्षित रहता है।",
  "risk.recalc.gasBreaches": "गैस सीमा उल्लंघन (पिछले 30 दिन)",
  "risk.recalc.coverage": "लक्ष्य के सापेक्ष निरीक्षण आवरण (%)",
  "risk.recalc.optional": "वैकल्पिक — संचित मान बनाए रखने हेतु रिक्त छोड़ें",
  "risk.recalc.submit": "पुनर्गणना करें",

  // ── Audit ledger ───────────────────────────────────────────────────
  "audit.title": "अंकेक्षण अभिलेख",
  "audit.subtitle":
    "प्रत्येक परिवर्तन का केवल-वर्धनशील, हैश-श्रृंखलित अभिलेख। प्रत्येक प्रविष्टि का हैश उससे पूर्व की प्रविष्टि को समाविष्ट करता है, अतः कोई भी मौन संशोधन श्रृंखला को तोड़ देता है।",
  "audit.verify.heading": "श्रृंखला सत्यापन",
  "audit.verify.valid": "हैश श्रृंखला अक्षत है",
  "audit.verify.validBody":
    "{total} में से सभी {checked} प्रविष्टियाँ सत्यापित। लेखन के पश्चात कोई प्रविष्टि बदली अथवा हटाई नहीं गई है।",
  "audit.verify.invalid": "हैश श्रृंखला भंग है",
  "audit.verify.invalidBody":
    "प्रविष्टि {sequence} पर सत्यापन विफल रहा। लेखन के पश्चात किसी प्रविष्टि को बदला अथवा हटाया गया है।",
  "audit.verify.head": "शीर्ष हैश",
  "audit.verify.reason": "सूचित कारण",
  "audit.verify.unavailable":
    "एपीआई ने उत्तर नहीं दिया, अतः श्रृंखला सत्यापित नहीं हो सकी।",
  "audit.events.heading": "अभिलेख प्रविष्टियाँ",
  "audit.events.caption": "अंकेक्षण अभिलेख की प्रविष्टियाँ, नवीनतम पहले",
  "audit.events.sequence": "क्रम",
  "audit.events.event": "घटना",
  "audit.events.entity": "इकाई",
  "audit.events.actor": "कर्ता",
  "audit.events.recorded": "दर्ज",
  "audit.events.hash": "प्रविष्टि हैश",
  "audit.events.previousHash": "पूर्व हैश",
  "audit.events.payload": "दर्ज मान",
  "audit.events.noActor": "प्रणाली",
  "audit.events.showing": "{total} में से {shown} प्रविष्टियाँ दिखाई जा रही हैं",
  "audit.events.expand": "प्रविष्टि {sequence} के दर्ज मान दिखाएँ",
};
