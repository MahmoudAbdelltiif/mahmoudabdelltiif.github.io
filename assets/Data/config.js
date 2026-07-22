/* ============================================================
   ASSETS/DATA/CONFIG.JS — Dynamic Data & Portfolio Configuration
   ============================================================
   HOW TO ADD NEW CASE STUDIES OR PROFILE PHOTOS:
   1. Place your new campaign images inside a subfolder in:
      assets/Data/Case_Studies/your-campaign-folder/
   2. Copy one of the campaign objects below and paste it in the array.
   3. Update titles, category, and image file paths.
   ============================================================ */

window.PORTFOLIO_CONFIG = {
  // ── Profile Photos Directory Configuration ──
  profileImages: [
    "assets/Data/Profile/Mahmoud.jpeg"
  ],

  // ── CV Document Path ──
  cvDocument: "assets/Data/CV/Mahmoud_Abdellatif_CV.pdf",

  // ── Anonymous Campaign Results & Screenshots Data ──
  campaigns: [
    {
      id: "campaign-01",
      title: "حملة تجارة إلكترونية موسمية — Seasonal E-commerce Campaign",
      subtitle: "37.66X ROAS Multi-Channel Performance Scaling",
      category: "تجارة إلكترونية (E-commerce)",
      keyMetric: "37.66X ROAS | SAR 182.8K Sales",
      platforms: ["Meta Ads", "Google Ads", "TikTok Ads", "Salla"],
      images: [
        { src: "assets/Data/Case_Studies/campaign-01/slide-1.png", title: "Store Analytics — Sales Overview" },
        { src: "assets/Data/Case_Studies/campaign-01/slide-2.png", title: "Meta Ads Manager — 37.66X ROAS Dashboard" },
        { src: "assets/Data/Case_Studies/campaign-01/slide-3.png", title: "Google Ads High-Intent Conversion Performance" },
        { src: "assets/Data/Case_Studies/campaign-01/slide-4.png", title: "TikTok Ads Manager — Sales Scaling" },
        { src: "assets/Data/Case_Studies/campaign-01/slide-5.png", title: "Abandoned Cart Recovery Analytics" },
        { src: "assets/Data/Case_Studies/campaign-01/Screenshot 2026-05-26 021719.png", title: "Campaign Breakdown & ROAS" },
        { src: "assets/Data/Case_Studies/campaign-01/Screenshot 2026-07-22 021921.png", title: "Order Distribution & Revenue" },
        { src: "assets/Data/Case_Studies/campaign-01/imageye___-_imgi_8_width_1600.webp", title: "Ad Creative & Store Funnel" }
      ]
    },
    {
      id: "campaign-02",
      title: "حملة عقارات واستقطاب عملاء — Real Estate & Lead Gen Campaign",
      subtitle: "High-Ticket Lead Generation & Funnel Optimization",
      category: "عقارات (Real Estate)",
      keyMetric: "Qualified Lead Generation",
      platforms: ["Meta Ads", "Google Ads"],
      images: [
        { src: "assets/Data/Case_Studies/campaign-02/imageye___-_imgi_9_width_1600.webp", title: "Lead Gen Campaign Results" },
        { src: "assets/Data/Case_Studies/campaign-02/imageye___-_imgi_11_width_1600.webp", title: "Meta Ads Performance Dashboard" }
      ]
    },
    {
      id: "campaign-03",
      title: "حملة عيادات وحجوزات طبية — Healthcare & Clinic Campaign",
      subtitle: "Patient Acquisition & Direct Booking Growth",
      category: "خدمات طبية (Healthcare)",
      keyMetric: "High-Intent Booking Campaign",
      platforms: ["Meta Ads", "Snapchat Ads"],
      images: [
        { src: "assets/Data/Case_Studies/campaign-03/imageye___-_imgi_12_width_1600.webp", title: "Patient Acquisition Analytics" },
        { src: "assets/Data/Case_Studies/campaign-03/imageye___-_imgi_14_width_1600.webp", title: "Campaign ROI & Booking Conversions" }
      ]
    },
    {
      id: "campaign-04",
      title: "حملة مراكز تعليمية وتدريبية — Education & Training Campaign",
      subtitle: "Enrollment Drive & Qualified Student Acquisition",
      category: "خدمات تعليمية (Education)",
      keyMetric: "Lead Generation & Enrollment",
      platforms: ["Google Ads", "Meta Ads"],
      images: [
        { src: "assets/Data/Case_Studies/campaign-04/imageye___-_imgi_11_width_1600.webp", title: "Campaign Dashboard & Conversions" }
      ]
    },
    {
      id: "campaign-05",
      title: "حملة خدمات محلية وزيادة مبيعات — Local Services Growth Campaign",
      subtitle: "Brand Reach Expansion & Direct Customer Acquisition",
      category: "خدمات محلية (Local Services)",
      keyMetric: "Brand Reach & Customer Acquisition",
      platforms: ["Meta Ads", "TikTok Ads"],
      images: [
        { src: "assets/Data/Case_Studies/campaign-05/imageye___-_imgi_19_width_1600.webp", title: "Campaign Reach & Customer Growth" }
      ]
    }
  ]
};
