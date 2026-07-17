import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';

export const socialLinks = [
  { name: 'LinkedIn',  Icon: Linkedin,  url: 'https://www.linkedin.com/showcase/blinkus-ai/' },
  { name: 'Instagram', Icon: Instagram, url: 'https://www.instagram.com/blinkus.ai?igsh=eTg5cHVocm84a2E1' },
  { name: 'Facebook',  Icon: Facebook,  url: 'https://www.facebook.com/share/1BLWH6ZRi2/' },
  { name: 'YouTube',   Icon: Youtube,   url: 'https://youtube.com/@blinkus-ai?si=kwBv0rAh2C7rlX4R' },
];

export const companyLinks = [
  { label: 'About Us', to: '/about'   },
  { label: 'Careers',  to: '/careers' },
  { label: 'Contact',  to: '/contact' },
];

export const resourceLinks = [
  { label: 'Blog',          to: '/blog'          },
  { label: 'Articles',      to: '/articles'      },
  { label: 'Press Release', to: '/press-release' },
];

export const articles = [
  {
    id: 1,
    title: 'The Hidden Inefficiencies Costing Global Exporters Billions',
    excerpt:
      'Global exporters face mounting losses from fragmented data, legacy systems, and opaque supply chains. Discover how AI is transforming trade intelligence and unlocking billions in hidden value.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.linkedin.com/pulse/hidden-inefficiencies-costing-global-exporters-billions-k2mhc/?trackingId=%2FlTXacYUQ6eRrdqBGrXX5w%3D%3D',
    source: 'LinkedIn',
    date: 'May 2025',
  },
];

export const pressReleases = [
  {
    id: 1,
    title: 'From Rice Inspection to AI-Powered Global Trade',
    headline: 'How Indian Startup CargoFirst is Building Quality AI and Blinkus AI',
    description:
      'Learn how Blinkus AI is revolutionizing quality inspection and trade intelligence for global exporters, turning legacy inspection processes into AI-driven insights for the modern supply chain.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    url: 'https://theblunttimes.in/from-rice-inspection-to-ai-powered-global-trade-how-indian-startup-cargofirst-is-building-qualty-ai-and-blinkus-ai/64714/',
    source: 'The Blunt Times',
    date: 'April 2025',
  },
];
