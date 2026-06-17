export type ToolSeoPage = {
  slug: string;
  label: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  highlights: Array<{ title: string; text: string }>;
  useCases: Array<{ title: string; text: string }>;
  complianceNote: string;
  faq: Array<[string, string]>;
  relatedLinks: Array<{ href: string; label: string }>;
};

export const TOOL_LABELS: Record<string, string> = {
  'background-remover': 'Background Remover',
  'edit-pdf': 'Edit PDF',
  'favicon-generator': 'Favicon Generator',
  'image-compressor': 'Image Compressor',
  'image-cropper': 'Image Cropper',
  'image-format-converter': 'Image Format Converter',
  'image-resizer': 'Image Resizer',
  'image-to-pdf': 'Image to PDF',
  'json-formatter': 'JSON Formatter',
  'password-generator': 'Password Generator',
  'pdf-compressor': 'PDF Compressor',
  'pdf-merge': 'PDF Merge',
  'qr-generator': 'QR Generator',
  'word-counter': 'Word Counter',
  'word-to-pdf': 'Word to PDF',
  'logo-remover': 'Logo Remover',
  'pdf-to-word': 'PDF to Word',
  'facebook-downloader': 'Facebook Downloader',
  'facebook-id-finder': 'Facebook ID Finder',
  'facebook-video-downloader': 'Facebook Video Downloader',
  'facebook-reels-downloader': 'Facebook Reels Downloader',
  'facebook-story-downloader': 'Facebook Story Downloader',
  'facebook-photo-downloader': 'Facebook Photo Downloader',
  'facebook-cover-photo-downloader': 'Facebook Cover Photo Downloader',
  'facebook-profile-picture-downloader': 'Facebook Profile Picture Downloader',
  'facebook-group-video-downloader': 'Facebook Group Video Downloader',
  'instagram-downloader': 'Instagram Downloader',
  'instagram-user-id-finder': 'Instagram User ID Finder',
  'instagram-video-downloader': 'Instagram Video Downloader',
  'instagram-reels-downloader': 'Instagram Reels Downloader',
  'instagram-story-downloader': 'Instagram Story Downloader',
  'instagram-photo-downloader': 'Instagram Photo Downloader',
  'instagram-profile-picture-downloader': 'Instagram Profile Picture Downloader',
  'instagram-highlights-downloader': 'Instagram Highlights Downloader',
  'instagram-carousel-downloader': 'Instagram Carousel Downloader',
  'linkedin-downloader': 'LinkedIn Downloader',
  'linkedin-video-downloader': 'LinkedIn Video Downloader',
  'linkedin-image-downloader': 'LinkedIn Image Downloader',
  'pinterest-downloader': 'Pinterest Downloader',
  'pinterest-video-downloader': 'Pinterest Video Downloader',
  'pinterest-image-downloader': 'Pinterest Image Downloader',
  'pinterest-gif-downloader': 'Pinterest GIF Downloader',
  'tiktok-downloader': 'TikTok Downloader',
  'tiktok-user-id-finder': 'TikTok User ID Finder',
  'tiktok-video-downloader': 'TikTok Video Downloader',
  'tiktok-no-watermark-downloader': 'TikTok No Watermark Downloader',
  'tiktok-audio-downloader': 'TikTok Audio Downloader',
  'tiktok-mp3-downloader': 'TikTok MP3 Downloader',
  'tiktok-profile-picture-downloader': 'TikTok Profile Picture Downloader',
  'twitter-video-downloader': 'Twitter Video Downloader',
  'twitter-gif-downloader': 'Twitter GIF Downloader',
  'twitter-image-downloader': 'Twitter Image Downloader',
  'x-twitter-downloader': 'X / Twitter Downloader',
  'x-video-downloader': 'X Video Downloader',
  'youtube-downloader': 'YouTube Downloader',
  'youtube-shorts-downloader': 'YouTube Shorts Downloader',
  'youtube-to-mp4': 'YouTube to MP4 Converter',
  'youtube-to-mp3': 'YouTube to MP3 Converter',
  'youtube-thumbnail': 'YouTube Thumbnail Downloader',
  'youtube-thumbnail-downloader': 'YouTube Thumbnail Downloader',
  'youtube-playlist-downloader': 'YouTube Playlist Downloader',
  'youtube-banner-downloader': 'YouTube Banner Downloader',
  'youtube-channel-logo-downloader': 'YouTube Channel Logo Downloader',
  'youtube-video-title-generator': 'YouTube Video Title Generator',
  'youtube-tag-extractor': 'YouTube Tag Extractor',
  'youtube-description-extractor': 'YouTube Description Extractor',
  'youtube-channel-id-finder': 'YouTube Channel ID Finder',
  'youtube-video-id-finder': 'YouTube Video ID Finder',
  'video-downloader': 'Video Downloader',
  'online-video-downloader': 'Online Video Downloader',
  'hd-video-downloader': 'HD Video Downloader',
  'free-video-downloader': 'Free Video Downloader',
  'video-to-mp3': 'Video to MP3',
  'video-to-mp4': 'Video to MP4',
  'mp4-downloader': 'MP4 Downloader',
  'mp3-downloader': 'MP3 Downloader',
};

const PLATFORM_LINKS: Record<string, string[]> = {
  youtube: [
    'youtube-downloader',
    'youtube-shorts-downloader',
    'youtube-to-mp4',
    'youtube-to-mp3',
    'youtube-thumbnail-downloader',
    'youtube-playlist-downloader',
    'youtube-channel-id-finder',
    'youtube-video-id-finder',
  ],
  facebook: [
    'facebook-downloader',
    'facebook-video-downloader',
    'facebook-reels-downloader',
    'facebook-story-downloader',
    'facebook-photo-downloader',
    'facebook-cover-photo-downloader',
    'facebook-profile-picture-downloader',
    'facebook-group-video-downloader',
    'facebook-id-finder',
  ],
  instagram: [
    'instagram-downloader',
    'instagram-video-downloader',
    'instagram-reels-downloader',
    'instagram-story-downloader',
    'instagram-photo-downloader',
    'instagram-profile-picture-downloader',
    'instagram-highlights-downloader',
    'instagram-carousel-downloader',
    'instagram-user-id-finder',
  ],
  tiktok: [
    'tiktok-downloader',
    'tiktok-video-downloader',
    'tiktok-no-watermark-downloader',
    'tiktok-audio-downloader',
    'tiktok-mp3-downloader',
    'tiktok-profile-picture-downloader',
    'tiktok-user-id-finder',
  ],
  twitter: [
    'twitter-video-downloader',
    'twitter-gif-downloader',
    'twitter-image-downloader',
    'x-twitter-downloader',
    'x-video-downloader',
  ],
  pinterest: [
    'pinterest-downloader',
    'pinterest-video-downloader',
    'pinterest-image-downloader',
    'pinterest-gif-downloader',
  ],
  linkedin: [
    'linkedin-downloader',
    'linkedin-video-downloader',
    'linkedin-image-downloader',
  ],
  general: [
    'video-downloader',
    'online-video-downloader',
    'hd-video-downloader',
    'free-video-downloader',
    'video-to-mp3',
    'video-to-mp4',
    'mp4-downloader',
    'mp3-downloader',
  ],
};

function detectPlatform(slug: string) {
  if (slug.startsWith('youtube-')) return 'youtube';
  if (slug.startsWith('facebook-')) return 'facebook';
  if (slug.startsWith('instagram-')) return 'instagram';
  if (slug.startsWith('tiktok-')) return 'tiktok';
  if (slug.startsWith('twitter-') || slug.startsWith('x-') || slug === 'x-twitter-downloader') return 'twitter';
  if (slug.startsWith('pinterest-')) return 'pinterest';
  if (slug.startsWith('linkedin-')) return 'linkedin';
  return 'general';
}

function detectTopic(slug: string) {
  if (
    slug.includes('to-mp4') ||
    slug.includes('to-mp3') ||
    slug.includes('video-to-mp4') ||
    slug.includes('video-to-mp3') ||
    slug.includes('mp4-downloader') ||
    slug.includes('mp3-downloader')
  ) {
    return 'converter';
  }

  if (
    slug.includes('finder') ||
    slug.includes('extractor') ||
    slug.includes('title-generator')
  ) {
    return 'metadata';
  }

  if (
    slug.includes('photo-downloader') ||
    slug.includes('profile-picture-downloader') ||
    slug.includes('image-downloader') ||
    slug.includes('gif-downloader') ||
    slug.includes('cover-photo-downloader') ||
    slug.includes('banner-downloader') ||
    slug.includes('channel-logo-downloader') ||
    slug.includes('thumbnail-downloader')
  ) {
    return 'asset';
  }

  if (
    slug.includes('reels-downloader') ||
    slug.includes('story-downloader') ||
    slug.includes('carousel-downloader') ||
    slug.includes('highlights-downloader') ||
    slug.includes('playlist-downloader') ||
    slug.includes('video-downloader') ||
    slug.includes('shorts-downloader') ||
    slug === 'youtube-downloader' ||
    slug === 'video-downloader' ||
    slug === 'online-video-downloader' ||
    slug === 'hd-video-downloader' ||
    slug === 'free-video-downloader'
  ) {
    return 'download';
  }

  return 'general';
}

const PLATFORM_NAMES: Record<string, string> = {
  youtube: 'YouTube',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  twitter: 'X / Twitter',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
  general: 'General Video',
};

function prettyPlatform(slug: string) {
  const platform = detectPlatform(slug);
  return PLATFORM_NAMES[platform] || 'Media';
}

function buildHighlights(label: string, topic: string) {
  const title = topic === 'metadata' ? 'Plan faster with structured metadata' : topic === 'converter' ? 'Keep files in the right format' : 'Stay organized in a browser workflow';

  return [
    {
      title: 'Browser-first workflow',
      text: `${label} keeps the process simple and avoids extra software installs.`,
    },
    {
      title,
      text:
        topic === 'metadata'
          ? 'Use the page to review titles, tags, descriptions, identifiers, and other planning details in one place.'
          : topic === 'converter'
            ? 'Choose a format that suits playback, editing, sharing, or archiving without leaving the page.'
            : 'Keep outputs labeled and ready for lawful offline reference or internal review.',
    },
    {
      title: 'Built for public content',
      text:
        'The wording stays focused on public, creator-approved, or licensed content so the page reads cleanly for search and compliance.',
    },
  ];
}

function buildUseCases(platform: string, topic: string) {
  if (topic === 'converter') {
    return [
      {
        title: 'Format Compatibility',
        text: `Convert files for broader playback support across devices, browsers, and editors.`,
      },
      {
        title: 'Offline Viewing',
        text: `Prepare local copies for situations where supported, permitted media needs to be viewed later without a connection.`,
      },
      {
        title: 'File Organization',
        text: `Store the final export with clear names so media libraries stay tidy and easy to search.`,
      },
    ];
  }

  if (topic === 'metadata') {
    return [
      {
        title: 'SEO And Planning',
        text: `Review titles, tags, descriptions, or IDs to understand how ${platform} content is organized.`,
      },
      {
        title: 'Channel Or Profile Checks',
        text: `Look up identifiers and supporting metadata before publishing, auditing, or researching content.`,
      },
      {
        title: 'Asset Preparation',
        text: `Use channel art, logos, and related assets to organize a consistent publishing workflow.`,
      },
    ];
  }

  if (topic === 'asset') {
    return [
      {
        title: 'Brand And Profile Assets',
        text: `Work with profile photos, cover images, logos, or similar assets for presentation and review.`,
      },
      {
        title: 'Campaign Planning',
        text: `Keep a clean set of visual assets ready for design, scheduling, or draft layouts.`,
      },
      {
        title: 'Reference Libraries',
        text: `Store approved assets in a folder structure that makes future retrieval easier.`,
      },
    ];
  }

  return [
    {
      title: 'Offline Reference',
      text: `Save permitted public media for later viewing when a connection is not available.`,
    },
    {
      title: 'Content Review',
      text: `Check the media in a calmer environment before using it in a workflow or team review.`,
    },
    {
      title: 'Library Management',
      text: `Keep downloaded items labeled and grouped by topic, source, or project.`,
    },
  ];
}

function buildFaq(label: string, topic: string): [string, string][] {
  if (topic === 'metadata') {
    return [
      [`What does ${label} do?`, `${label} helps you review identifiers, titles, tags, descriptions, or related planning details in a browser.`],
      ['Do I need special software?', 'No. The page is designed to work in a normal browser workflow.'],
      ['Is this useful for SEO research?', 'Yes. Metadata pages are useful for content planning, audit checks, and quick reference.'],
      ['Can I use it for public or creator-approved content?', 'Yes. The page is framed around public, creator-approved, or licensed material.'],
    ];
  }

  if (topic === 'converter') {
    return [
      [`What is ${label}?`, `${label} helps you move media into a format that fits playback, editing, or sharing needs.`],
      ['Which format should I pick?', 'Choose the format that best matches your device, editor, or storage goals.'],
      ['Can I use it for offline reference?', 'Yes, when you have permission to keep the content locally.'],
      ['Is the page browser-based?', 'Yes. The workflow is designed to stay simple in a modern browser.'],
    ];
  }

  return [
    [`What is ${label}?`, `${label} is a browser-friendly page for public, creator-approved, or licensed media workflows.`],
    ['Do I need to install anything?', 'No. The page is designed to be clear, fast, and easy to use in a browser.'],
    ['Can I save files for offline reference?', 'Yes, when the content is permitted for local storage or review.'],
    ['Is this safe for SEO and compliance?', 'Yes. The wording stays focused on lawful, public, and creator-approved usage.'],
  ];
}

function buildRelatedLinks(slug: string) {
  const platform = detectPlatform(slug);
  const links = PLATFORM_LINKS[platform] || PLATFORM_LINKS.general;
  return links
    .filter((item) => item !== slug)
    .slice(0, 4)
    .map((item) => ({
      href: `/tools/${item}`,
      label: TOOL_LABELS[item] || item.replace(/-/g, ' '),
    }));
}

export function getToolSeoPage(slug: string): ToolSeoPage | null {
  const label = TOOL_LABELS[slug];
  if (!label) {
    return null;
  }

  const topic = detectTopic(slug);
  const platform = prettyPlatform(slug);
  const title = `${label} | MyToolsHub`;
  const description =
    topic === 'converter'
      ? `Use ${label.toLowerCase()} to convert media into a format that fits playback, editing, and lawful offline reference needs.`
      : topic === 'metadata'
        ? `Use ${label.toLowerCase()} to review media details, identifiers, and search-friendly metadata in a browser workflow.`
        : topic === 'asset'
          ? `Use ${label.toLowerCase()} to work with profile, cover, logo, or image assets in a clean browser-based flow.`
          : `Use ${label.toLowerCase()} to organize public or creator-approved media in a browser-first workflow.`;

  const keywords = Array.from(
    new Set([
      label,
      `${platform} tools`,
      `${label.toLowerCase()} online`,
      'browser-based media tool',
      'public content workflow',
      'creator-approved content',
      'licensed media reference',
      'lawful offline use',
    ])
  );

  return {
    slug,
    label,
    title,
    description,
    keywords,
    intro:
      topic === 'metadata'
        ? `This ${label.toLowerCase()} page keeps search-friendly details in one place for public content, creator-approved uploads, and safe planning workflows.`
        : topic === 'converter'
          ? `This ${label.toLowerCase()} page helps you prepare files in a format that works better for playback, editing, sharing, or archiving.`
          : topic === 'asset'
            ? `This ${label.toLowerCase()} page helps you handle profile, cover, logo, or image assets in a cleaner browser workflow.`
            : `This ${label.toLowerCase()} page is designed for quick, browser-based media workflows that stay focused on public or creator-approved content.`,
    highlights: buildHighlights(label, topic),
    useCases: buildUseCases(platform, topic),
    complianceNote:
      'The page copy intentionally stays focused on public, creator-approved, or licensed content so the SEO wording remains safer and more brand-friendly.',
    faq: buildFaq(label, topic),
    relatedLinks: buildRelatedLinks(slug),
  };
}
