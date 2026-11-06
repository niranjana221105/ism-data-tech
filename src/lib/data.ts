// ─── Company Data ────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name: "ISM Data Technology",
  tagline: "Delivering Trusted Global Data Solutions",
  description:
    "Transforming global data needs while uplifting rural women professionals.",
  email: "official@ismdatatech.com",
  hrEmail: "hr@ismdatatech.com",
  website: "https://ismdatatech.com",
  launchDate: "22 Aug 2024",
  founder: {
    name: "Mr. Muthu Kulathur",
    title: "Founder & CEO",
  },
  address: {
    line1: "Selva Complex, V.A Nagar",
    line2: "Kadayam Road, Pavoorchatram",
    city: "Tenkasi",
    state: "Tamil Nadu",
    country: "India",
    full: "Selva Complex, V.A Nagar, Kadayam Road, Pavoorchatram, Tenkasi, Tamil Nadu, India",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.9!2d77.4!3d8.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOCw!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
    mapsUrl:
      "https://www.google.com/maps/search/Selva+Complex+VA+Nagar+Kadayam+Road+Pavoorchatram+Tenkasi+Tamil+Nadu",
    lat: 8.9167,
    lng: 77.4,
  },
  stats: [
    { value: 98, suffix: "%", label: "Quality Delivery" },
    { value: 3, suffix: "+", label: "International Partners" },
    { value: 100, suffix: "%", label: "Skilled Employees" },
    { value: 24, suffix: " hrs", label: "Live Support" },
  ],
  social: {
    linkedin: "#",
    twitter: "#",
    facebook: "#",
    instagram: "#",
  },
  businessHours: "Monday – Friday: 9:00 AM – 6:00 PM IST",
};

// ─── Services ────────────────────────────────────────────────────────────────

export type ServiceCategory =
  | "all"
  | "it-voice"
  | "data-entry"
  | "records"
  | "content-media"
  | "business-support";

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  description: string;
  icon: string;
}

export const SERVICES: Service[] = [
  {
    id: "epub",
    title: "EPUB Services",
    category: "it-voice",
    categoryLabel: "Advanced IT & Voice Services",
    description:
      "Conversion and formatting of digital books and documents into EPUB format with professional precision.",
    icon: "BookOpen",
  },
  {
    id: "tax-voice",
    title: "International Voice Support (UK & USA Tax Filing)",
    category: "it-voice",
    categoryLabel: "Advanced IT & Voice Services",
    description:
      "Assisted with tax-related processes and client communication for UK and US businesses.",
    icon: "Phone",
  },
  {
    id: "debit-support",
    title: "International Semi-Voice (Debit Support)",
    category: "it-voice",
    categoryLabel: "Advanced IT & Voice Services",
    description:
      "Handled semi-voice debit processing projects with accuracy and reliability.",
    icon: "CreditCard",
  },
  {
    id: "healthcare",
    title: "Healthcare Data Entry",
    category: "it-voice",
    categoryLabel: "Advanced IT & Voice Services",
    description:
      "Managed sensitive healthcare-related records with accuracy, confidentiality, and attention to detail.",
    icon: "HeartPulse",
  },
  {
    id: "spanish-data",
    title: "Spanish Data Projects",
    category: "data-entry",
    categoryLabel: "Data Entry & Document Processing",
    description:
      "Managed input and organization of Spanish-language records, ensuring linguistic accuracy and efficiency.",
    icon: "Languages",
  },
  {
    id: "filipino-data",
    title: "Filipino Data Projects",
    category: "data-entry",
    categoryLabel: "Data Entry & Document Processing",
    description:
      "Accurate entry and verification of civil registry records including birth, marriage, and death certificates.",
    icon: "FileCheck",
  },
  {
    id: "ceylon-data",
    title: "Ceylon Data Projects",
    category: "data-entry",
    categoryLabel: "Data Entry & Document Processing",
    description:
      "Handling government records, business data, and financial documentation with precision.",
    icon: "Database",
  },
  {
    id: "baptism-records",
    title: "Indexing Handwritten Baptism Records",
    category: "records",
    categoryLabel: "Historical & Vital Records Management",
    description:
      "Transcribed and indexed historical baptism documents for preservation and digital access.",
    icon: "Archive",
  },
  {
    id: "burial-records",
    title: "Burial Records Projects",
    category: "records",
    categoryLabel: "Historical & Vital Records Management",
    description:
      "Accurately transcribed handwritten burial records for historical preservation and research.",
    icon: "ScrollText",
  },
  {
    id: "vital-records-usa",
    title: "Vital Records Processing – USA",
    category: "records",
    categoryLabel: "Historical & Vital Records Management",
    description:
      "Entry and processing of birth, death, and marriage certificates per US government standards.",
    icon: "FileText",
  },
  {
    id: "newspaper-zoning",
    title: "Newspaper Zoning Projects",
    category: "content-media",
    categoryLabel: "Content & Media Processing",
    description:
      "Indexed and classified diverse newspaper content for research, archiving, and digital access.",
    icon: "Newspaper",
  },
  {
    id: "books-extraction",
    title: "Printed English Books Extraction",
    category: "content-media",
    categoryLabel: "Content & Media Processing",
    description:
      "Extracted structured data from printed books ensuring flawless formatting and data integrity.",
    icon: "BookMarked",
  },
  {
    id: "australian-leads",
    title: "Australian Business Leads Collection",
    category: "business-support",
    categoryLabel: "Business Support & Lead Generation",
    description:
      "Provided verified, actionable contact lists for B2B clients targeting Australian markets.",
    icon: "Target",
  },
  {
    id: "medical-billing",
    title: "Medical Billing (Exela Technologies)",
    category: "business-support",
    categoryLabel: "Business Support & Lead Generation",
    description:
      "Delivered back-end support for medical billing operations in partnership with Exela Technologies.",
    icon: "Receipt",
  },
];

export const ADDITIONAL_SERVICES = [
  {
    id: "usa-docs",
    title: "USA Documentation",
    description:
      "We provide accurate and efficient USA documentation services, ensuring data consistency and compliance with international standards. Our experienced team handles complex documentation processes with precision, helping clients save time and maintain quality in every project.",
    icon: "FileStack",
  },
  {
    id: "australian-scraping",
    title: "Australian Scraping",
    description:
      "Our Australian scraping services deliver clean, structured, and high-quality data from trusted online sources. We use advanced tools and techniques to extract accurate information, empowering businesses with actionable insights for informed decision-making.",
    icon: "Globe",
  },
  {
    id: "xml-processing",
    title: "XML Processing",
    description:
      "We specialize in efficient XML processing services, ensuring accurate data conversion, validation, and structuring. Our team delivers well-organized XML outputs that enhance data exchange, integration, and automation across multiple platforms.",
    icon: "Code2",
  },
  {
    id: "typing-projects",
    title: "Typing Projects",
    description:
      "Our typing services ensure fast, accurate, and well-formatted data entry for all types of projects. With a skilled team and quality checks at every stage, we deliver reliable typing solutions that help businesses maintain efficiency and precision.",
    icon: "Keyboard",
  },
];

export const SERVICE_CATEGORIES = [
  { value: "all", label: "All Programs" },
  { value: "it-voice", label: "Advanced IT & Voice Services" },
  { value: "data-entry", label: "Data Entry & Document Processing" },
  { value: "records", label: "Historical & Vital Records Management" },
  { value: "content-media", label: "Content & Media Processing" },
  { value: "business-support", label: "Business Support & Lead Generation" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "This was a difficult project but ISM data tech did a great job and communicated progress throughout as I requested. Excellent worker. They were very focused on the task. I'll hire again when I have another project.",
    name: "Rob S",
    location: "Phoenix, United States",
    rating: 5,
    initials: "RS",
  },
  {
    id: 2,
    quote:
      "ISM data tech is an excellent freelancer you can completely rely on. You can hire them with confidence and will be very pleased with his work. Their communication skills are outstanding, and they deliver the job as expected. I will definitely work again with ISM data tech in the future.",
    name: "Victor B",
    location: "Montreuil, France",
    rating: 5,
    initials: "VB",
  },
  {
    id: 3,
    quote:
      "Great on time project completion. On time and really quick. Professional worker.",
    name: "J G",
    location: "Sydney, Australia",
    rating: 5,
    initials: "JG",
  },
];

// ─── Life at ISM ──────────────────────────────────────────────────────────────

export const LIFE_AT_ISM = [
  {
    title: "Brainstorming",
    description:
      "Innovative ideas and creative thinking sessions that spark solutions.",
    image: "/images/life/brainstorming.jpg",
    placeholder: "bg-gradient-to-br from-blue-900 to-cyan-900",
  },
  {
    title: "Cultural Events",
    description:
      "Celebrating diversity with vibrant festivals and traditions at work.",
    image: "/images/life/cultural.jpg",
    placeholder: "bg-gradient-to-br from-purple-900 to-blue-900",
  },
  {
    title: "Team Outing",
    description:
      "Building stronger bonds through adventures, trips, and shared experiences.",
    image: "/images/life/outing.jpg",
    placeholder: "bg-gradient-to-br from-teal-900 to-blue-900",
  },
  {
    title: "Workplace Fun",
    description: "Games, laughter, and activities that make every day enjoyable.",
    image: "/images/life/fun.jpg",
    placeholder: "bg-gradient-to-br from-blue-900 to-indigo-900",
  },
];

// ─── Timeline ────────────────────────────────────────────────────────────────

export const TIMELINE = [
  {
    year: "Aug 2024",
    title: "Company Founded",
    description:
      "ISM Data Technology was officially launched on 22 August 2024, with a clear vision to deliver global data solutions from India.",
  },
  {
    year: "Late 2024",
    title: "First International Partnerships",
    description:
      "Secured first international client partnerships across the United States, France, and Australia, establishing our global reach.",
  },
  {
    year: "2025",
    title: "Expanding Operations",
    description:
      "Scaled our team of skilled professionals, expanded service offerings, and deepened our commitment to rural women empowerment.",
  },
];

// ─── Why Choose ISM ───────────────────────────────────────────────────────────

export const WHY_CHOOSE = [
  {
    icon: "ShieldCheck",
    title: "Accuracy & Quality",
    description:
      "Every project goes through rigorous quality checks. We maintain high accuracy standards across all data operations.",
  },
  {
    icon: "Users",
    title: "Skilled Workforce",
    description:
      "100% skilled employees trained for their specific domains — from healthcare data to historical records management.",
  },
  {
    icon: "Globe2",
    title: "International Experience",
    description:
      "Proven delivery across US, UK, French, Australian, and Asian projects with deep understanding of regional requirements.",
  },
  {
    icon: "TrendingUp",
    title: "Scalable Operations",
    description:
      "Whether a small batch or large-scale continuous project, we scale our team and resources to meet your demand.",
  },
  {
    icon: "Handshake",
    title: "Client-Focused Approach",
    description:
      "We communicate proactively, deliver on time, and tailor our services to each client's unique business needs.",
  },
  {
    icon: "Heart",
    title: "Rural Women Empowerment",
    description:
      "We create meaningful employment for rural women professionals, combining business excellence with social responsibility.",
  },
];

// ─── Client Locations ─────────────────────────────────────────────────────────

export const CLIENT_LOCATIONS = [
  {
    country: "United States",
    description: "Voice support, documentation, vital records, and more.",
  },
  {
    country: "France",
    description: "Data processing and business support services.",
  },
  {
    country: "Australia",
    description: "Business leads, scraping, and data collection projects.",
  },
];
