import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd';
import { HeroForm } from '@/components/HeroForm';
import { RenewalBanner } from '@/app/motor-insurance/components/RenewalBanner';
import { ArrowRight, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';

type Offence = { name: string; fine: string };

type StateData = {
  name: string;
  image: string;
  authority: string;
  rtoCode: string;
  description: string;
  commonOffences: Offence[];
  fineRange: string;
};

const STATES: Record<string, StateData> = {
  'delhi': {
    name: 'Delhi',
    image: '/images/states/e_challan_delhi.webp',
    authority: 'Delhi Traffic Police',
    rtoCode: 'DL',
    description: 'Delhi has one of the highest e-challan volumes in India due to CCTV, ITMS cameras, and strict enforcement across the city.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'Seat belt violation', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding (ITMS camera)', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong side driving', fine: '₹5,000' },
      { name: 'No parking / towing', fine: '₹2,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'maharashtra': {
    name: 'Maharashtra',
    image: '/images/states/e_challan_maharashtra.webp',
    authority: 'Maharashtra Traffic Police',
    rtoCode: 'MH',
    description: 'Maharashtra issues e-challans across Mumbai, Pune, Nagpur and other cities via camera-based enforcement.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,500' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    image: '/images/states/e_challan_uttar_pradesh.webp',
    authority: 'UP Traffic Police',
    rtoCode: 'UP',
    description: 'UP traffic police issues e-challans across Lucknow, Noida, Agra, Kanpur and other major cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'No registration certificate', fine: '₹2,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Seat belt violation', fine: '₹1,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'karnataka': {
    name: 'Karnataka',
    image: '/images/states/e_challan_karnataka.webp',
    authority: 'Karnataka State Police',
    rtoCode: 'KA',
    description: 'Karnataka enforces traffic rules via e-challan system across Bengaluru, Mysuru, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Triple riding', fine: '₹1,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    image: '/images/states/e_challan_tamil_nadu.webp',
    authority: 'Tamil Nadu Traffic Police',
    rtoCode: 'TN',
    description: 'Tamil Nadu traffic police issues e-challans in Chennai, Coimbatore, Madurai and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'Triple riding', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'telangana': {
    name: 'Telangana',
    image: '/images/states/e_challan_telangana.webp',
    authority: 'Telangana State Police',
    rtoCode: 'TS',
    description: 'Telangana enforces strict traffic rules via e-challans in Hyderabad and other cities with camera-based surveillance.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'kerala': {
    name: 'Kerala',
    image: '/images/states/e_challan_kerala.webp',
    authority: 'Kerala Police',
    rtoCode: 'KL',
    description: 'Kerala Motor Vehicles Department issues e-challans across Thiruvananthapuram, Kochi, Kozhikode and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'haryana': {
    name: 'Haryana',
    image: '/images/states/e_challan_haryana.webp',
    authority: 'Haryana Traffic Police',
    rtoCode: 'HR',
    description: 'Haryana traffic police issues e-challans in Gurgaon, Faridabad, Ambala, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'Seat belt violation', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'odisha': {
    name: 'Odisha',
    image: '/images/states/e_challan_odisha.webp',
    authority: 'Odisha Traffic Police',
    rtoCode: 'OD',
    description: 'Odisha state police issues e-challans in Bhubaneswar, Cuttack, and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'andhra-pradesh': {
    name: 'Andhra Pradesh',
    image: '/images/states/e_challan_andhra_pradesh.webp',
    authority: 'Andhra Pradesh Police',
    rtoCode: 'AP',
    description: 'AP enforces traffic rules via e-challans across Vijayawada, Visakhapatnam, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Triple riding', fine: '₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'punjab': {
    name: 'Punjab',
    image: '/images/states/e_challan_punjab.webp',
    authority: 'Punjab Police',
    rtoCode: 'PB',
    description: 'Punjab traffic police issues e-challans in Ludhiana, Amritsar, Chandigarh, and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'bihar': {
    name: 'Bihar',
    image: '/images/states/e_challan_bihar.webp',
    authority: 'Bihar Police',
    rtoCode: 'BR',
    description: 'Bihar traffic police issues e-challans in Patna, Gaya, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'rajasthan': {
    name: 'Rajasthan',
    image: '/images/states/e_challan_rajasthan.webp',
    authority: 'Rajasthan Police',
    rtoCode: 'RJ',
    description: 'Rajasthan traffic police issues e-challans in Jaipur, Jodhpur, Udaipur, and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong side driving', fine: '₹5,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'gujarat': {
    name: 'Gujarat',
    image: '/images/states/e_challan_gujarat.webp',
    authority: 'Gujarat Police',
    rtoCode: 'GJ',
    description: 'Gujarat traffic police issues e-challans across Ahmedabad, Surat, Vadodara, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'madhya-pradesh': {
    name: 'Madhya Pradesh',
    image: '/images/states/e_challan_madhya_pradesh.webp',
    authority: 'Madhya Pradesh Police',
    rtoCode: 'MP',
    description: 'MP traffic police issues e-challans in Bhopal, Indore, Gwalior, and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'west-bengal': {
    name: 'West Bengal',
    image: '/images/states/e_challan_west_bengal.webp',
    authority: 'West Bengal Traffic Police',
    rtoCode: 'WB',
    description: 'West Bengal traffic police issues e-challans in Kolkata, Siliguri, Asansol, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'assam': {
    name: 'Assam',
    image: '/images/states/e_challan_assam.webp',
    authority: 'Assam Police',
    rtoCode: 'AS',
    description: 'Assam traffic police issues e-challans in Guwahati and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'himachal-pradesh': {
    name: 'Himachal Pradesh',
    image: '/images/states/e_challan_himachal_pradesh.webp',
    authority: 'Himachal Pradesh Police',
    rtoCode: 'HP',
    description: 'HP traffic police issues e-challans in Shimla, Dharamshala, Manali, and other areas.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding on hill roads', fine: '₹1,000 – ₹2,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'uttarakhand': {
    name: 'Uttarakhand',
    image: '/images/states/e_challan_uttarakhand.webp',
    authority: 'Uttarakhand Police',
    rtoCode: 'UK',
    description: 'Uttarakhand traffic police issues e-challans in Dehradun, Haridwar, Rishikesh, and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'jharkhand': {
    name: 'Jharkhand',
    image: '/images/states/e_challan_jharkhand.webp',
    authority: 'Jharkhand Police',
    rtoCode: 'JH',
    description: 'Jharkhand traffic police issues e-challans in Ranchi, Jamshedpur, Dhanbad, and other cities.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'chhattisgarh': {
    name: 'Chhattisgarh',
    image: '/images/states/e_challan_chhattisgarh.webp',
    authority: 'Chhattisgarh Police',
    rtoCode: 'CG',
    description: 'Chhattisgarh traffic police issues e-challans in Raipur, Bilaspur, and other cities.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'goa': {
    name: 'Goa',
    image: '/images/states/e_challan_goa.webp',
    authority: 'Goa Police',
    rtoCode: 'GA',
    description: 'Goa traffic police issues e-challans in Panaji, Margao, Vasco, and other areas.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
  },
  'jammu-kashmir': {
    name: 'Jammu & Kashmir',
    image: '/images/states/e_challan_jammu_kashmir.webp',
    authority: 'J&K Police',
    rtoCode: 'JK',
    description: 'Jammu & Kashmir traffic police issues e-challans in Jammu, Srinagar, and other areas.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'ladakh': {
    name: 'Ladakh',
    image: '/images/states/e_challan_ladakh.webp',
    authority: 'Ladakh Police',
    rtoCode: 'LA',
    description: 'Ladakh traffic police issues e-challans in Leh, Kargil, and other areas.',
    commonOffences: [
      { name: 'Speeding on mountain roads', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
      { name: 'Helmet violation', fine: '₹1,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'manipur': {
    name: 'Manipur',
    image: '/images/states/e_challan_manipur.webp',
    authority: 'Manipur Police',
    rtoCode: 'MN',
    description: 'Manipur traffic police issues e-challans in Imphal and other areas.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'meghalaya': {
    name: 'Meghalaya',
    image: '/images/states/e_challan_meghalaya.webp',
    authority: 'Meghalaya Police',
    rtoCode: 'ML',
    description: 'Meghalaya traffic police issues e-challans in Shillong and other areas.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'nagaland': {
    name: 'Nagaland',
    image: '/images/states/e_challan_nagaland.webp',
    authority: 'Nagaland Police',
    rtoCode: 'NL',
    description: 'Nagaland traffic police issues e-challans in Kohima, Dimapur, and other areas.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'tripura': {
    name: 'Tripura',
    image: '/images/states/e_challan_tripura.webp',
    authority: 'Tripura Police',
    rtoCode: 'TR',
    description: 'Tripura traffic police issues e-challans in Agartala and other areas.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'mizoram': {
    name: 'Mizoram',
    image: '/images/states/e_challan_mizoram.webp',
    authority: 'Mizoram Police',
    rtoCode: 'MZ',
    description: 'Mizoram traffic police issues e-challans in Aizawl and other areas.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'sikkim': {
    name: 'Sikkim',
    image: '/images/states/e_challan_sikkim.webp',
    authority: 'Sikkim Police',
    rtoCode: 'SK',
    description: 'Sikkim traffic police issues e-challans in Gangtok and other areas.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding on mountain roads', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'arunachal-pradesh': {
    name: 'Arunachal Pradesh',
    image: '/images/states/e_challan_arunachal_pradesh.webp',
    authority: 'Arunachal Pradesh Police',
    rtoCode: 'AR',
    description: 'Arunachal Pradesh traffic police issues e-challans in Itanagar and other areas.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'andaman-nicobar': {
    name: 'Andaman & Nicobar',
    image: '/images/states/e_challan_andaman_nicobar.webp',
    authority: 'Andaman & Nicobar Police',
    rtoCode: 'AN',
    description: 'Andaman & Nicobar Islands traffic police issues e-challans in Port Blair and other areas.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'lakshadweep': {
    name: 'Lakshadweep',
    image: '/images/states/e_challan_lakshadweep.webp',
    authority: 'Lakshadweep Police',
    rtoCode: 'LD',
    description: 'Lakshadweep traffic police issues e-challans in Kavaratti and other islands.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'daman-diu': {
    name: 'Daman & Diu',
    image: '/images/states/e_challan_daman_diu.webp',
    authority: 'Daman & Diu Police',
    rtoCode: 'DD',
    description: 'Daman & Diu traffic police issues e-challans in Daman and Diu.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
  'dadra-nagar-haveli': {
    name: 'Dadra Nagar Haveli',
    image: '/images/states/e_challan_dadra_nagar_haveli.webp',
    authority: 'DNH Police',
    rtoCode: 'DN',
    description: 'Dadra & Nagar Haveli traffic police issues e-challans in Silvassa and other areas.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = STATES[slug];
  if (!state) return {};
  const title = `Check E-Challan in ${state.name} | ${state.rtoCode} Vehicle Challan Status`;
  const description = `Check pending e-challans for ${state.name} (${state.rtoCode}) registered vehicles. View challan status, fine amounts, and get expert assistance to settle challans legally via Lok Adalat — save up to 50%.`;
  const image = `https://www.challansetu.com/images/states/e_challan_${slug.replace(/-/g, '_')}.webp`;
  return {
    title,
    description,
    keywords: [
      `e-challan ${state.name}`,
      `traffic challan ${state.name}`,
      `${state.rtoCode} challan check`,
      `check challan ${state.name}`,
      `pending challan ${state.name}`,
      `${state.name} traffic fine`,
      `echallan ${state.rtoCode}`,
      `${state.name} vehicle challan`,
      `Lok Adalat challan ${state.name}`,
      `traffic challan settlement ${state.name}`,
    ],
    alternates: { canonical: `/e-challan/${slug}` },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: `/e-challan/${slug}`,
      siteName: 'ChallanSetu',
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `Check e-challan in ${state.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(STATES).map((slug) => ({ slug }));
}

export default async function StatePage({ params }: Props) {
  const { slug } = await params;
  const state = STATES[slug];
  if (!state) notFound();

  const faqs = [
    {
      q: `How do I check my e-challan in ${state.name}?`,
      a: `Enter your ${state.rtoCode}-registered vehicle number on ChallanSetu. We instantly fetch all pending challans linked to your vehicle and show you the offence details, fine amounts, and available options.`,
    },
    {
      q: `Can I get a discount on my ${state.name} traffic challan?`,
      a: `Yes. Through the Lok Adalat process, eligible challans in ${state.name} can be settled at a reduced amount — often 30–50% less than the original fine. ChallanSetu checks your eligibility and handles the entire process legally.`,
    },
    {
      q: `What is the fine for not wearing a helmet in ${state.name}?`,
      a: `The fine for not wearing a helmet in ${state.name} is ₹1,000 for the first offence, and ₹2,000 with possible disqualification for repeat offences, as per the Motor Vehicles (Amendment) Act, 2019.`,
    },
    {
      q: `What is the penalty for jumping a red signal in ${state.name}?`,
      a: `Jumping a red signal in ${state.name} attracts a fine of ₹1,000–₹5,000 depending on the number of previous violations. Repeat offenders may also face licence suspension.`,
    },
    {
      q: `Can I check ${state.name} challan by driving licence number?`,
      a: `Yes. You can check pending challans in ${state.name} by either your vehicle registration number (${state.rtoCode}XXAABBBB format) or your driving licence number. Enter either on ChallanSetu to see all linked challans.`,
    },
    {
      q: `What happens if I don't pay my ${state.name} challan?`,
      a: `Unpaid challans in ${state.name} can result in penalties at RC renewal, detention at checkpoints, or escalating fines. It is best to check and settle pending challans promptly to avoid complications.`,
    },
    {
      q: `Is it safe to settle a challan through ChallanSetu?`,
      a: `Yes. ChallanSetu uses the official Lok Adalat process — a Government of India legal mechanism — to settle traffic challans at a reduced amount. The process is 100% legal and transparent.`,
    },
    {
      q: `How long does challan settlement take in ${state.name}?`,
      a: `After you submit your vehicle number, ChallanSetu fetches your challan details immediately. The Lok Adalat settlement process typically takes a few business days — we handle all paperwork and follow-ups for you.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'States', url: '/#states' },
          { name: state.name, url: `/e-challan/${slug}` },
        ])}
      />
      <Navbar />
      <main className="flex-1">
        <div className="relative">

          {/* Hero */}
          <section className="relative bg-gradient-hero text-white overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={state.image}
                alt={`E-challan in ${state.name}`}
                fill
                sizes="100vw"
                className="object-cover object-top opacity-20"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-800/90" />
            <div className="relative container-app py-12 sm:py-16">
              <div className="flex items-center gap-2 text-primary-300 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>{state.authority}</span>
                <span className="text-primary-500">·</span>
                <span>RTO: {state.rtoCode}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
                Check E-Challan in {state.name}
              </h1>
              <p className="text-primary-200 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
                {state.description}
              </p>
              <HeroForm showCalculatorLink={false} source="city_page" buttonLabel="Check Challan" />
            </div>
          </section>

          <div className="relative z-10 bg-white">

            {/* Common offences with fine amounts */}
            <section className="py-12 sm:py-16 bg-surface-50">
              <div className="container-app">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">Penalties</p>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mb-8">
                  Common Traffic Offences in {state.name}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl">
                  {state.commonOffences.map((offence) => (
                    <div key={offence.name} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{offence.name}</span>
                      </div>
                      <span className="text-sm font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{offence.fine}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How to check */}
            <section className="py-12 sm:py-16 bg-white">
              <div className="container-app max-w-4xl">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">Guide</p>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mb-8">
                  How to Check E-Challan in {state.name}
                </h2>
                <div className="space-y-4">
                  {[
                    `Enter your ${state.rtoCode}-registered vehicle number in the form above.`,
                    'We fetch all pending challans linked to your vehicle, offence details, fine amounts, and due dates.',
                    `Review your challans and check if you're eligible for a discount via Lok Adalat.`,
                    'Our team guides you through the full settlement process, legally and hassle-free.',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <JsonLd data={faqSchema(faqs)} />
            <section className="py-12 sm:py-16 bg-surface-50">
              <div className="container-app max-w-3xl">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">FAQ</p>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.q} className="group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer">
                      <summary className="flex items-center justify-between gap-4 list-none font-semibold text-gray-900 text-sm sm:text-base">
                        {faq.q}
                        <span className="text-primary-400 text-lg group-open:rotate-45 transition-transform duration-200 flex-shrink-0">+</span>
                      </summary>
                      <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-14 bg-gradient-hero text-white">
              <div className="container-app text-center max-w-2xl">
                <CheckCircle2 className="w-10 h-10 text-accent-300 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
                  Got a challan in {state.name}?
                </h2>
                <p className="text-primary-200 mb-8">
                  Enter your vehicle number to check status and get expert guidance on your options.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
                >
                  Check Challan Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            <RenewalBanner />

            <Footer />
          </div> {/* end content sheet */}
        </div> {/* end sticky wrapper */}
      </main>
    </>
  );
}
