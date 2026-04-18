export type SeoFaqData = {
  question: string;
  answer: string;
};

export type SeoBenefitData = {
  title: string;
  description: string;
  icon: 'shield' | 'download' | 'money' | 'youtube' | 'instagram' | 'lock'; // strings mapped to lucide icons in the component
};

export type SeoPageConfig = {
  slug: string;
  title: string;          // Meta title
  description: string;    // Meta description
  h1: string;             // Page H1
  heroCopy: string;       // Hero subtitle
  apiQuery: string;       // Query for jamendo api (e.g. 'vlog', 'gaming', 'study')
  tags: string[];         // Array of tags to show
  benefits: SeoBenefitData[];
  faqs: SeoFaqData[];
  relatedSlugs: string[]; // Internal linking
};

export const seoPagesConfig: Record<string, SeoPageConfig> = {
  "free-vlog-background-music": {
    slug: "free-vlog-background-music",
    title: "Free Vlog Background Music Download | BeatFlow",
    description: "Discover royalty-free vlog background music for YouTube creators. Stream and download free tracks on BeatFlow.",
    h1: "Free Vlog Background Music",
    heroCopy: "Elevate your vlogs with premium, royalty-free background music. No copyright strikes, 100% free to download and use in your YouTube videos.",
    apiQuery: "vlog",
    tags: ["Vlog", "YouTube", "Upbeat", "Lifestyle"],
    benefits: [
      { title: "YouTube Safe", description: "Cleared for YouTube monetization. No copyright claims.", icon: "youtube" },
      { title: "One-Click Download", description: "Download MP3s instantly without signing up.", icon: "download" },
      { title: "Royalty-Free", description: "Use it forever without paying royalties or licensing fees.", icon: "money" }
    ],
    faqs: [
      { question: "Can I use this music on YouTube?", answer: "Yes! All tracks listed here are 100% royalty-free and safe for YouTube monetization. You will not get copyright strikes." },
      { question: "Is it really free?", answer: "Absolutely. You can download and use these tracks for free in your personal or commercial video projects." },
      { question: "Do I need to give credit?", answer: "While not strictly required for all tracks, we highly recommend adding artist attribution in your video description to support the creators." }
    ],
    relatedSlugs: ["music-for-youtube-shorts", "travel-vlog-music-free", "chill-background-music-free"]
  },
  "free-lofi-study-music": {
    slug: "free-lofi-study-music",
    title: "Free LoFi Study Music & Chill Beats | BeatFlow",
    description: "Download relaxing, royalty-free LoFi study music. Perfect for coding, studying, or background streams without copyright strikes.",
    h1: "Free LoFi Study Music",
    heroCopy: "Get in the zone with our curated selection of chill, royalty-free LoFi beats. Perfect for study streams, coding sessions, or just relaxing.",
    apiQuery: "lofi",
    tags: ["LoFi", "Study", "Chill", "Coding"],
    benefits: [
      { title: "Stream Safe", description: "Perfect for Twitch or YouTube 24/7 study streams.", icon: "shield" },
      { title: "Chill Vibes", description: "Curated specifically for focus and relaxation.", icon: "youtube" },
      { title: "No Royalties", description: "Completely free from confusing licensing fees.", icon: "money" }
    ],
    faqs: [
      { question: "Can I use this for my 24/7 study stream on YouTube?", answer: "Yes, these tracks are cleared for streaming. Your VODs and live streams will not be muted for copyright." },
      { question: "Can I download these LoFi tracks?", answer: "Yes, you can directly download the tracks to use them offline or in your editing software." }
    ],
    relatedSlugs: ["chill-background-music-free", "free-vlog-background-music"]
  },
  "no-copyright-gaming-music": {
    slug: "no-copyright-gaming-music",
    title: "No Copyright Gaming Music & Stream Beats | BeatFlow",
    description: "Download high-energy, no copyright gaming music for Twitch streams and YouTube gaming highlights.",
    h1: "No Copyright Gaming Music",
    heroCopy: "Level up your streams and gaming montages with high-energy, royalty-free gaming music. Zero copyright strikes.",
    apiQuery: "gaming",
    tags: ["Gaming", "Twitch", "Electronic", "EDM"],
    benefits: [
      { title: "Twitch Safe", description: "No muted VODs. Stream with complete peace of mind.", icon: "shield" },
      { title: "Montage Ready", description: "High-BPM tracks perfect for FPS highlights.", icon: "youtube" },
      { title: "Free Download", description: "Grab the audio files instantly.", icon: "download" }
    ],
    faqs: [
      { question: "Will my Twitch VOD get muted?", answer: "No. All tracks are cleared from Content ID and DMCA lists, making them safe for Twitch streams and VODs." },
      { question: "Can I use this in my eSports tournament broadcast?", answer: "Yes, the royalty-free nature allows commercial broadcast usages." }
    ],
    relatedSlugs: ["free-vlog-background-music", "free-workout-music"]
  },
  "free-cinematic-music": {
    slug: "free-cinematic-music",
    title: "Free Cinematic Background Music | BeatFlow",
    description: "Epic royalty-free cinematic music for films, trailers, and documentaries. Download and use instantly.",
    h1: "Free Cinematic Music",
    heroCopy: "Add epic scale and emotion to your films, trailers, and documentaries with completely free cinematic soundtracks.",
    apiQuery: "cinematic",
    tags: ["Cinematic", "Epic", "Film", "Trailer"],
    benefits: [
      { title: "Film Score Quality", description: "High-quality orchestral and ambient arrangements.", icon: "star" as any },
      { title: "Commercial Use", description: "Safe for indie films and monetized videos.", icon: "youtube" },
      { title: "Instant Access", description: "Download and drop directly into Premiere or Final Cut.", icon: "download" }
    ],
    faqs: [
      { question: "Is this music free for commercial film festivals?", answer: "Yes, you can use these royalty-free tracks in indie films submitted to festivals without paying licensing fees." },
      { question: "How do I download the tracks?", answer: "Simply click the download icon on any track card to instantly save the MP3." }
    ],
    relatedSlugs: ["travel-vlog-music-free", "chill-background-music-free"]
  },
  "music-for-youtube-shorts": {
    slug: "music-for-youtube-shorts",
    title: "Free Music for YouTube Shorts | BeatFlow",
    description: "Trending, catchy, and royalty-free music specifically optimized for YouTube Shorts and TikToks.",
    h1: "Music for YouTube Shorts",
    heroCopy: "Hook your viewers in the first 3 seconds with incredibly catchy, royalty-free music designed for YouTube Shorts.",
    apiQuery: "upbeat", // usually upbeat works best for shorts
    tags: ["Shorts", "TikTok", "Upbeat", "Trending"],
    benefits: [
      { title: "Monetization Safe", description: "100% cleared for YouTube Shorts monetization.", icon: "youtube" },
      { title: "Viral Potential", description: "High-energy tracks that retain viewer attention.", icon: "star" as any },
      { title: "Royalty-Free", description: "Use the music in unlimited vertical videos.", icon: "money" }
    ],
    faqs: [
      { question: "Can I also use this on TikTok and Instagram Reels?", answer: "Absolutely. The tracks are cleared for use across all major short-form video platforms." }
    ],
    relatedSlugs: ["music-for-instagram-reels", "free-vlog-background-music"]
  },
  "music-for-instagram-reels": {
    slug: "music-for-instagram-reels",
    title: "Free Music for Instagram Reels | BeatFlow",
    description: "Discover aesthetic, trendy background music for Instagram Reels that won't get blocked.",
    h1: "Music for Instagram Reels",
    heroCopy: "Find the perfect aesthetic vibe for your Instagram Reels with our royalty-free music library. Safe from audio removals.",
    apiQuery: "pop", 
    tags: ["Reels", "Instagram", "Aesthetic", "Pop"],
    benefits: [
      { title: "No Muted Reels", description: "Your audio will never be removed by Instagram.", icon: "instagram" },
      { title: "High Quality", description: "Crystal clear audio to make your content pop.", icon: "download" },
      { title: "Creator Safe", description: "Fully cleared for brand sponsorships and ads.", icon: "shield" }
    ],
    faqs: [
      { question: "Why is this better than using Instagram's audio library?", answer: "When you do sponsored posts or ads, Instagram restricts commercial music. Our royalty-free library lets you bypass this easily." }
    ],
    relatedSlugs: ["music-for-youtube-shorts", "travel-vlog-music-free"]
  },
  "podcast-intro-music-free": {
    slug: "podcast-intro-music-free",
    title: "Free Podcast Intro Music & Outros | BeatFlow",
    description: "Professional, royalty-free podcast intro music. Give your show a branded, premium sound for free.",
    h1: "Free Podcast Intro Music",
    heroCopy: "Set the tone for your show with professional, royalty-free podcast intro and outro music. Download MP3s free.",
    apiQuery: "jazz", // jazzy/corporate fits podcasts well
    tags: ["Podcast", "Intro", "Corporate", "Jazz"],
    benefits: [
      { title: "Professional Sound", description: "Elevate your podcast's production value.", icon: "shield" },
      { title: "Cross-Platform Safe", description: "Safe for Spotify, Apple Podcasts, and Google.", icon: "youtube" },
      { title: "Royalty-Free", description: "No subscription fees for your podcast audio.", icon: "money" }
    ],
    faqs: [
      { question: "Can I edit the track to be shorter?", answer: "Yes! You are completely free to edit, cut, and mix these tracks to create your perfect 10-second podcast intro." }
    ],
    relatedSlugs: ["chill-background-music-free", "free-lofi-study-music"]
  },
  "travel-vlog-music-free": {
    slug: "travel-vlog-music-free",
    title: "Free Travel Vlog Music | BeatFlow",
    description: "Adventurous, uplifting, and royalty-free music for your travel vlogs. Perfect for cinematic drone shots.",
    h1: "Free Travel Vlog Music",
    heroCopy: "Soundtrack your adventures with uplifting, royalty-free travel vlog music. From cinematic drone shots to cultural explorations.",
    apiQuery: "world", // world or upbeat
    tags: ["Travel", "Vlog", "Adventure", "Acoustic"],
    benefits: [
      { title: "YouTube Monitizable", description: "Keep your ad revenue on travel videos.", icon: "youtube" },
      { title: "Cinematic Quality", description: "Perfectly matches sweeping drone footage.", icon: "star" as any },
      { title: "No Licensing Drama", description: "Download and travel securely.", icon: "shield" }
    ],
    faqs: [
      { question: "Is this music copyright free?", answer: "Yes, it is royalty-free and safe from copyright strikes, meaning you can monetize your travel videos globally." }
    ],
    relatedSlugs: ["free-vlog-background-music", "free-cinematic-music"]
  },
  "free-workout-music": {
    slug: "free-workout-music",
    title: "Free Workout Music & Gym Beats | BeatFlow",
    description: "High BPM, royalty-free workout music. Safe for fitness YouTubers and gym instructors to stream and use.",
    h1: "Free Workout Music",
    heroCopy: "Fuel your fitness content with high-energy, royalty-free workout beats. 100% safe for fitness influencers and streams.",
    apiQuery: "workout",
    tags: ["Workout", "Fitness", "Gym", "Electronic"],
    benefits: [
      { title: "High Energy", description: "Heart-pumping BPMs for gym content.", icon: "star" as any },
      { title: "Fitness Stream Safe", description: "Run your live classes without DMCA strikes.", icon: "shield" },
      { title: "Free Usage", description: "No recurring music subscription fees.", icon: "money" }
    ],
    faqs: [
      { question: "Can I use this for my live Zoom fitness class?", answer: "Absolutely. You can play this music during your live classes, streams, and YouTube videos freely." }
    ],
    relatedSlugs: ["no-copyright-gaming-music", "music-for-youtube-shorts"]
  },
  "chill-background-music-free": {
    slug: "chill-background-music-free",
    title: "Free Chill Background Music | BeatFlow",
    description: "Relaxing, ambient, and chill background music totally free of royalties. Perfect for voice-overs and tutorials.",
    h1: "Free Chill Background Music",
    heroCopy: "The perfect unobtrusive, chill background music for tutorials, voice-overs, and relaxing streams.",
    apiQuery: "chill",
    tags: ["Chill", "Ambient", "Background", "Relaxing"],
    benefits: [
      { title: "Perfect for Voice-overs", description: "Fills the silence without distracting the viewer.", icon: "youtube" },
      { title: "Stream Safe", description: "Cleared for Twitch and YouTube streams.", icon: "shield" },
      { title: "Easy Download", description: "Download high quality mp3s to your device.", icon: "download" }
    ],
    faqs: [
      { question: "Will this overpower my dialogue?", answer: "These tracks are curated to be ambient. Just lower the volume track in your editor by -15db to -20db and it will sit perfectly under your voice." }
    ],
    relatedSlugs: ["free-lofi-study-music", "podcast-intro-music-free", "free-vlog-background-music"]
  }
};

export function getSeoPage(slug: string): SeoPageConfig | undefined {
  return seoPagesConfig[slug];
}
