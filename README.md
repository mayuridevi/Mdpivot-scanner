# Pivot Cross Scanner (PWA)

Chartink जैसा स्कैनर: Latest Close, Next-period Camarilla L3/R3 और Pivot S1/R1 को क्रॉस करे, तो स्टॉक दिखाए। Sector-wise गिनती के साथ।

## GitHub Pages पर चढ़ाना
1. GitHub पर नया repo बनाओ (जैसे `pivot-scanner`), Public रखो।
2. इन सातों फ़ाइलें repo के बिल्कुल ऊपर (root) में Upload करो:
   `index.html, manifest.json, sw.js, worker.js, icon-192.png, icon-512.png, README.md`
3. Settings → Pages → Branch: `main` / `(root)` → Save।
4. 1-2 मिनट बाद लिंक मिलेगा: `https://<username>.github.io/pivot-scanner/`
5. Chrome में खोलो → ⋮ → "Add to Home screen" / "Install app"।

## Cloudflare Worker (रिकमेंडेड, फ्री)
बिना Worker के ऐप फ्री public proxy से चलता है, जो धीमा और कभी-कभी बंद रहता है। Worker से स्कैन तेज़ और स्थिर चलता है।
1. cloudflare.com पर फ्री अकाउंट → Workers & Pages → Create → Hello World → Deploy।
2. Edit code में `worker.js` की पूरी कॉपी पेस्ट करो → Deploy।
3. जो लिंक मिले (`https://xxx.workers.dev`) उसे ऐप में ⚙ Settings → Worker URL में डालो।
4. फिर "🔄 स्टॉक लिस्ट / सेक्टर फिर से लोड करें" दबाओ।

## कैसे काम करता है
- **लेवल (Camarilla/Pivot):** Level-टाइमफ्रेम (Daily/Weekly/Monthly/Quarterly/Yearly) की कैंडल के H/L/C से:
  `L3 = C − (H−L)×1.1/4`, `R3 = C + (H−L)×1.1/4`, `P = (H+L+C)/3`, `S1 = 2P − H`, `R1 = 2P − L`
- **Next period:** सबसे ताज़ा कैंडल से निकला लेवल (Chartink का "Tomorrow")। **Current period:** पिछली पूरी कैंडल से निकला लेवल।
- **Crossed Above:** पिछली Close ≤ लेवल और अभी की Close > लेवल (Close-टाइमफ्रेम की कैंडल पर)। Crossed Below इसका उल्टा।
- **MA फ़िल्टर:** SMA 20/50/200 (Daily) और SMA 20/200 (Weekly)। "Close Crossed" या "Above/Below" चुनो; ये लेवल कंडीशन के साथ AND होते हैं।
- **Sector:** Nifty 500 लिस्ट की Industry से। Nifty 500 के बाहर के स्टॉक "Unclassified" में।

## ध्यान रखें
- डेटा Yahoo Finance से आता है (थोड़ी देरी संभव)। ट्रेड से पहले अपने चार्ट पर मिलाओ।
- 1 मिनट डेटा सिर्फ़ पिछले ~5 दिन का, 5 मिनट के लिए भी इतना ही।
- "सभी NSE" (~2000 स्टॉक) में स्कैन में कई मिनट लग सकते हैं। Nifty 500 पर ~1-2 मिनट (Worker के साथ)।
