/* ============================================================
   CASE-STUDIES.JS — Case Study Data Array
   ============================================================
   
   INSTRUCTIONS:
   - Add your case studies below by copying the template
   - Images should be placed in: assets/images/case-studies/case-XX/
   - Reference images as: assets/images/case-studies/case-XX/filename.jpg
   - The case-study.html page will automatically render cards from this array
   - Modal will display the full case study on card click
   
   ============================================================ */

var caseStudies = [

  // ── Case Study 1: Adahi Al-Barakah ──
  {
    id: 1,
    title: "Adahi Al-Barakah — 37.66X ROAS Seasonal Campaign",
    industry: "E-commerce",
    thumbnail: "assets/images/case-studies/case-01/slide-1.png",
    keyMetric: "37.66X ROAS",
    platforms: ["Meta Ads", "Google Ads", "TikTok Ads"],
    images: [
      "assets/images/case-studies/case-01/slide-1.png",
      "assets/images/case-studies/case-01/slide-2.png",
      "assets/images/case-studies/case-01/slide-3.png",
      "assets/images/case-studies/case-01/slide-4.png",
      "assets/images/case-studies/case-01/slide-5.png"
    ],
    challenge: "Adahi Al-Barakah, an online store offering Qurbani, Aqiqah, charity, vows, and expiation services, needed to maximize online sales during the high-demand Qurbani season. The store provides Sharia-compliant slaughtering, meat distribution to families in need across Africa, and full documentation through photos and videos. The primary challenge was driving qualified traffic from Saudi Arabia, reducing customer acquisition cost, and maximizing return on ad spend across multiple digital advertising platforms within a limited seasonal window.",
    strategy: [
      "Deployed a multi-channel advertising strategy across Meta Ads, Google Ads, and TikTok Ads to cover the full customer journey from search intent and awareness to retargeting and purchase completion",
      "Google Ads captured high-intent users actively searching for Qurbani, Aqiqah, and related services, driving qualified traffic with strong purchase intent",
      "Meta Ads focused on sales campaigns and retargeting to maximize conversion rates, with dynamic creative optimization and audience segmentation",
      "TikTok Ads expanded reach and generated additional direct sales through seasonal sales-focused creatives targeting interested users",
      "Leveraged Salla store analytics for performance tracking, abandoned cart recovery (9.8% recovery rate), and conversion optimization"
    ],
    results: [
      { value: 37.66, suffix: "X", label: "Meta ROAS" },
      { value: 182.81, prefix: "SAR ", suffix: "K", label: "Total Sales" },
      { value: 143, suffix: "%", label: "Target Achieved" },
      { value: 251, suffix: "", label: "Total Orders" },
      { value: 8.9, suffix: "X", label: "TikTok ROAS" },
      { value: 727.3, prefix: "SAR ", suffix: "", label: "Avg Order Value" }
    ]
  },

  // ── TEMPLATE: Copy this block for each new case study ──
  // {
  //   id: 2,
  //   title: "Brand Name — Key Result",
  //   industry: "E-commerce",  // Options: E-commerce, Real Estate, Education, FMCG, App Marketing
  //   thumbnail: "assets/images/case-studies/case-02/thumb.jpg",
  //   keyMetric: "4x ROAS",
  //   platforms: ["Meta Ads", "Google Ads"],
  //   images: [
  //     "assets/images/case-studies/case-02/slide-1.jpg",
  //     "assets/images/case-studies/case-02/slide-2.jpg"
  //   ],
  //   challenge: "Description of the challenge...",
  //   strategy: [
  //     "Strategy point 1",
  //     "Strategy point 2",
  //     "Strategy point 3"
  //   ],
  //   results: [
  //     { value: 400, suffix: "%", label: "ROAS" },
  //     { value: 50, prefix: "$0.", suffix: "", label: "CPC" },
  //     { value: 35, suffix: "%", label: "CTR" }
  //   ]
  // },

];
