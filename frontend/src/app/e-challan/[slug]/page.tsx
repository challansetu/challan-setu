import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SiteHeader } from '@/components/SiteHeader';
import { JsonLd, breadcrumbSchema, faqSchema, webPageSchema, serviceSchema, howToSchema } from '@/components/seo/JsonLd';
import { HeroForm } from '@/components/HeroForm';
import { RenewalBanner } from '@/app/motor-insurance/components/RenewalBanner';
import { CheckCircle2, MapPin, AlertCircle, ExternalLink, BookOpen } from 'lucide-react';

// State-level metadata: capitals, cities, local enforcement content
const STATE_META: Record<string, { capital: string; majorCities: string[]; localContent: string }> = {
  'delhi': {
    capital: 'New Delhi',
    majorCities: ['Central Delhi', 'Dwarka', 'Rohini', 'Saket', 'Laxmi Nagar'],
    localContent: 'Delhi operates one of India\'s most advanced Integrated Traffic Management Systems (ITMS) with 3,000+ CCTV cameras across major intersections. High-challan zones include Ring Road, NH-48 (Delhi-Gurgaon Expressway), Connaught Place, and Outer Ring Road. Delhi Traffic Police conducts special night enforcement drives on weekends near entertainment areas, resulting in high drink-drive challan volumes. All Delhi challans are adjudicated at district courts in Tis Hazari, Saket, Dwarka, or Patiala House. Lok Adalat sessions are held at each district court, typically every Monday. Vehicles with 3+ pending challans risk RC suspension at renewal.',
  },
  'maharashtra': {
    capital: 'Mumbai',
    majorCities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    localContent: 'Maharashtra issues challans through the Maha Traffic app and CCTV-based enforcement across Mumbai, Pune, and Nagpur. High-enforcement corridors include the Mumbai-Pune Expressway (NH-48), Western Express Highway, and Eastern Express Highway. Mumbai Traffic Police runs frequent helmet and seat belt drives in Andheri, Borivali, and Thane. Pune\'s Hinjawadi IT corridor sees high speeding violations. Nagpur has strict enforcement near Ambazari and Wardha Road. Maharashtra Lok Adalat settlements are handled through district courts in Mumbai (Esplanade Court), Pune (Shivajinagar Court), and Nagpur. First-time offenders typically get 30-50% reduction through Lok Adalat.',
  },
  'uttar-pradesh': {
    capital: 'Lucknow',
    majorCities: ['Lucknow', 'Noida', 'Agra', 'Kanpur', 'Varanasi'],
    localContent: 'Uttar Pradesh traffic police enforces challans across 75 districts through the UPTRANSIT portal and CCTV systems. Major enforcement zones include NH-9 (Delhi-Lucknow), Agra-Lucknow Expressway, Yamuna Expressway (Noida-Agra), and NH-19 (Varanasi). Noida sector roads see high frequency camera-based challans for signal jumping and speeding. Agra traffic police intensifies enforcement near tourist zones. UP Lok Adalat sessions are held at Allahabad High Court jurisdiction courts. Noida challans go through Gautam Buddha Nagar District Court, while Ghaziabad cases are handled at Ghaziabad District Court.',
  },
  'karnataka': {
    capital: 'Bengaluru',
    majorCities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
    localContent: 'Karnataka State Police issues e-challans through KSP portal across Bengaluru, Mysuru, and other cities. Bengaluru\'s Outer Ring Road (ORR), Hosur Road (NH-44), and Bannerghatta Road are top challan zones. Traffic enforcement is high in Whitefield, Electronic City, and Koramangala IT corridors during peak hours. Mysuru Road and Tumkur Road see frequent speeding challans. Bengaluru traffic cases are adjudicated at City Civil Court (Mayo Hall) and Magistrate courts in each zone. Karnataka Lok Adalat is operated by Karnataka State Legal Services Authority (KSLSA) with sessions every month.',
  },
  'tamil-nadu': {
    capital: 'Chennai',
    majorCities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tirupur'],
    localContent: 'Tamil Nadu Traffic Police enforces e-challans across Chennai, Coimbatore, Madurai, and other cities. Chennai\'s Anna Salai (Mount Road), OMR (Old Mahabalipuram Road), ECR (East Coast Road), and GST Road are major enforcement corridors. The city has 700+ AI-based traffic surveillance cameras active across 300+ signals. Coimbatore sees heavy commercial vehicle challan enforcement on Avinashi Road and Trichy Road. All Tamil Nadu challans are handled through district courts — Chennai cases at City Civil Court, Egmore. Tamil Nadu Legal Services Authority (TNLSA) conducts Lok Adalat on the second Saturday of every month.',
  },
  'telangana': {
    capital: 'Hyderabad',
    majorCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    localContent: 'Telangana State Police uses advanced TGSWAN (Telangana State Wide Area Network) camera network with 3,000+ cameras across Hyderabad. High-challan zones include Outer Ring Road (ORR), HITEC City, Gachibowli IT corridor, and Banjara Hills. Hyderabad traffic police conducts frequent night patrolling on weekends near Jubilee Hills and Banjara Hills, making it a top city for drink-drive challans in South India. Telangana e-challan settlement happens through Rachakonda and Hyderabad Commissionerate courts. Lok Adalat sessions organized by TSLSA are held monthly at district courts across Telangana.',
  },
  'kerala': {
    capital: 'Thiruvananthapuram',
    majorCities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    localContent: 'Kerala Motor Vehicles Department and state police issue e-challans through M-Parivahan app and fixed cameras. High-enforcement zones include NH-66 (Mumbai-Kanyakumari Highway), Kochi bypass, and Thiruvananthapuram-Kollam NH. Kochi Metropolitan area sees the highest challan volume, particularly in Kakkanad IT corridor and Marine Drive. Kerala has strict drunk driving enforcement with regular check-posts on major highways, especially during festivals like Onam and Vishu. Challans are adjudicated at District Magistrate courts. Kerala has permanent Lok Adalat benches at all district courts managed by KELSA (Kerala Legal Services Authority).',
  },
  'haryana': {
    capital: 'Chandigarh',
    majorCities: ['Gurgaon', 'Faridabad', 'Ambala', 'Panipat', 'Karnal'],
    localContent: 'Haryana traffic police enforces challans through ITMS cameras on national highways and state roads. Top enforcement corridors include NH-44 (Delhi-Ambala), NH-48 (Delhi-Gurgaon-Jaipur), and NH-58 (Delhi-Meerut bypass via Gurgaon). Gurgaon\'s Golf Course Road, MG Road, and Sohna Road are major challan zones. Faridabad enforcement is active on Mathura Road and Delhi-Faridabad Flyway. Karnal and Ambala see high commercial vehicle challan volumes. Haryana Lok Adalat sessions held at Gurugram, Faridabad, Ambala, and Karnal district courts under HALSA (Haryana State Legal Services Authority).',
  },
  'punjab': {
    capital: 'Chandigarh',
    majorCities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    localContent: 'Punjab Police runs active traffic enforcement on NH-1 (Delhi-Amritsar), NH-44, and state highways. Ludhiana has highest challan volume in Punjab due to dense commercial vehicle traffic on G.T. Road and Ferozepur Road. Amritsar sees strict enforcement near Golden Temple approach roads and NH-54. Jalandhar and Patiala have active helmet and seat belt drives. Punjab also runs frequent drunk driving checkpoints near Chandigarh on weekends. Traffic cases in Punjab go through respective district courts — Ludhiana at District & Sessions Court, Amritsar at Amritsar Court Complex. Lok Adalat operates under Punjab Legal Services Authority (PLSA).',
  },
  'rajasthan': {
    capital: 'Jaipur',
    majorCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    localContent: 'Rajasthan Traffic Police enforces e-challans using CCTV systems on NH-48 (Delhi-Jaipur-Mumbai), NH-58 (Jaipur-Agra), and NH-112. Jaipur\'s Ajmer Road, Tonk Road, and JLN Marg are major challan corridors. Rajasthan sees high tourist vehicle challan volumes near Jodhpur, Udaipur, and Jaisalmer during peak tourist season (October-March). Commercial vehicle overloading challans are common on Kota-Bundi mining routes. All Rajasthan challans are adjudicated at district courts. Jaipur cases handled at Jaipur District & Sessions Court. Lok Adalat under RSLSA operates at all 33 district courts monthly.',
  },
  'gujarat': {
    capital: 'Gandhinagar',
    majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    localContent: 'Gujarat Traffic Police uses intelligent traffic management across Ahmedabad, Surat, and Vadodara. Key enforcement zones include Ahmedabad-Vadodara Expressway (NH-48), SP Ring Road (Ahmedabad), and Surat\'s Ring Road. Ahmedabad\'s BRTS corridor has strict enforcement for vehicles entering bus lanes. Surat sees high two-wheeler challan volume near textile market areas. Gujarat being a dry state has zero alcohol tolerance — drink-drive cases are treated with maximum severity. All challans go through district courts: Ahmedabad cases at Gujarat High Court jurisdiction, Surat at Surat District Court. Lok Adalat under GSLSA operates monthly.',
  },
  'madhya-pradesh': {
    capital: 'Bhopal',
    majorCities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Rewa'],
    localContent: 'Madhya Pradesh Police enforces e-challans via CCTV across Bhopal, Indore, and Gwalior. Major enforcement corridors include NH-46 (Bhopal-Indore), NH-3 (Agra-Bombay Highway), and NH-86. Indore\'s AB Road and Ring Road are top challan zones — Indore ranks among India\'s top 10 cities for traffic challan volume. Bhopal enforcement is active near New Market, Hoshangabad Road, and Arera Colony. Gwalior sees high enforcement near Gwalior Fort approach. MP Lok Adalat sessions are conducted by MPSLSA at all divisional headquarters monthly.',
  },
  'west-bengal': {
    capital: 'Kolkata',
    majorCities: ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Howrah'],
    localContent: 'West Bengal Traffic Police issues e-challans through CCTV and manual enforcement across Kolkata, Howrah, and Siliguri. Key challan zones include AJC Bose Road, EM Bypass, VIP Road (Kolkata), and NH-12 (Kolkata-Siliguri). Kolkata sees high traffic violations near business districts — Park Street, Salt Lake, and Rajarhat IT corridor. Howrah Bridge approach roads have strict enforcement. Siliguri on Sevoke Road sees high commercial vehicle challan volume. Kolkata traffic cases go through Calcutta High Court jurisdiction courts. West Bengal Lok Adalat is managed by WBSLSA with sessions at Calcutta High Court and all district courts.',
  },
  'bihar': {
    capital: 'Patna',
    majorCities: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
    localContent: 'Bihar Traffic Police enforces e-challans particularly in Patna, Gaya, and Muzaffarpur. High-enforcement zones include NH-19 (Patna-Varanasi), NH-28 (Muzaffarpur-Gorakhpur), and Bailey Road (Patna). Patna sees highest challan volume during peak festival periods — Chhath Puja and Durga Puja create massive traffic violations. Commercial vehicle overloading is a major violation on Gaya-Bodh Gaya pilgrim routes. Bihar traffic cases are handled at Patna District and Sessions Court and respective city magistrate courts. Bihar Legal Services Authority (BSLSA) operates Lok Adalat at district level.',
  },
  'andhra-pradesh': {
    capital: 'Amaravati',
    majorCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
    localContent: 'Andhra Pradesh Traffic Police uses CCTV enforcement across Visakhapatnam, Vijayawada, and Tirupati. Key challan zones include NH-16 (Chennai-Kolkata), NH-65 (Hyderabad-Pune), and Beach Road (Visakhapatnam). Visakhapatnam sees high challan volume near IT sector (Rushikonda) and Steel Plant area. Tirupati enforces strict traffic rules near temple precincts — violations have zero tolerance. Vijayawada\'s Bandar Road and Eluru Road are major enforcement corridors. AP traffic cases are handled at respective district courts. Lok Adalat is operated by APSLSA with sessions on the second Saturday of every month.',
  },
  'odisha': {
    capital: 'Bhubaneswar',
    majorCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
    localContent: 'Odisha State Police issues e-challans in Bhubaneswar, Cuttack, and Rourkela through CCTV systems. Key enforcement zones include NH-16 (Golden Quadrilateral), Bhubaneswar-Cuttack Highway, and Rourkela Steel Plant areas. Bhubaneswar\'s Nayapalli, Saheed Nagar, and Chandrasekharpur see highest challan volume. Puri road enforcement intensifies during Rath Yatra and other major festivals. Cuttack\'s Silver City junction has active signal-jumping enforcement. Odisha traffic cases handled at Bhubaneswar District Court and respective district courts. Lok Adalat by OSLSA held monthly.',
  },
  'assam': {
    capital: 'Dispur',
    majorCities: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'],
    localContent: 'Assam Police enforces traffic challans particularly in Guwahati, the largest city in Northeast India. Key enforcement areas include NH-27 (Guwahati-Shillong), NH-37 (Guwahati-Dibrugarh), and GS Road, Christian Basti area. Guwahati\'s high traffic density near Paltan Bazaar, Pan Bazaar, and Fancy Bazaar results in frequent signal violations. Overloading is a major issue on tea garden supply routes between Jorhat and Dibrugarh. Traffic cases handled at Kamrup District Court (Guwahati) and respective district courts. Lok Adalat by ASLSA held monthly at all districts.',
  },
  'jharkhand': {
    capital: 'Ranchi',
    majorCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    localContent: 'Jharkhand Traffic Police enforces e-challans in Ranchi, Jamshedpur, and Dhanbad through CCTV and manual methods. Major enforcement zones include NH-33 (Ranchi-Jamshedpur), NH-23 (Ranchi-Patna), and NH-2. Jamshedpur sees high commercial vehicle challan volume near Tata Motors and steel plant approach roads. Dhanbad coal mining routes have frequent overloading violations. Bokaro\'s steel city roads have active enforcement. Traffic cases handled at Jharkhand High Court jurisdiction — Ranchi at Ranchi District Court, Jamshedpur at East Singhbhum District Court. JHALSA manages Lok Adalat monthly.',
  },
  'chhattisgarh': {
    capital: 'Raipur',
    majorCities: ['Raipur', 'Bilaspur', 'Durg', 'Korba'],
    localContent: 'Chhattisgarh Police enforces traffic challans in Raipur, Bilaspur, and Durg through camera systems. Key challan zones include NH-53 (Raipur-Nagpur), NH-30 (Raipur-Bhopal), and NH-130. Raipur\'s VIP Road, Telibandha, and Shankar Nagar areas see highest signal-jumping violations. Korba industrial area has high commercial vehicle challan volume due to coal transportation routes. Bilaspur sees active enforcement near High Court complex. Traffic cases handled at Chhattisgarh High Court jurisdiction — Raipur District Court for metro cases. CGSLSA manages monthly Lok Adalat sessions.',
  },
  'uttarakhand': {
    capital: 'Dehradun',
    majorCities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani'],
    localContent: 'Uttarakhand Police enforces traffic challans particularly on pilgrimage routes and hill roads. Key enforcement zones include NH-58 (Delhi-Badrinath), NH-73 (Dehradun-Rishikesh), and NH-72 (Haridwar-Kotdwar). Haridwar and Rishikesh see massive traffic enforcement during Ardh Kumbh, Kanwar Yatra, and Char Dham season. Speeding on mountain roads is strictly enforced — overloading on tourist routes carries heavy penalties. Dehradun\'s Rajpur Road and Patel Nagar have active signal enforcement. Traffic cases handled at Uttarakhand High Court jurisdiction (Nainital). Lok Adalat by USLSA held monthly at all district courts.',
  },
  'himachal-pradesh': {
    capital: 'Shimla',
    majorCities: ['Shimla', 'Dharamshala', 'Manali', 'Solan'],
    localContent: 'Himachal Pradesh Police enforces strict traffic rules particularly on mountain roads and tourist zones. Key enforcement areas include NH-3 (Delhi-Shimla-Mandi), NH-21 (Chandigarh-Manali), and NH-154 (Pathankot-Mandi). Manali and Rohtang Pass approaches have strict overloading and unfit vehicle enforcement. Shimla\'s Cart Road and Mall Road are active signal-jumping enforcement zones. Tourist vehicle overloading is a major violation issue in summer season. Traffic cases handled at Himachal Pradesh High Court (Shimla) jurisdiction. HP Legal Services Authority (HPSLSA) manages monthly Lok Adalat.',
  },
  'goa': {
    capital: 'Panaji',
    majorCities: ['Panaji', 'Margao', 'Vasco', 'Mapusa'],
    localContent: 'Goa Police enforces strict traffic rules particularly against drunk driving — Goa has one of India\'s highest drink-drive challan rates due to tourism. Key enforcement zones include NH-66 (Mumbai-Mangaluru), Panaji-Porvorim-Mapusa stretch, and beach resort areas in North and South Goa. Breathalyzer tests are standard practice on weekends and holidays. Helmet enforcement is strict across Panaji, Margao, and Vasco. Traffic cases handled at Goa District Court (Panaji). Lok Adalat sessions operated by Goa Legal Services Authority (GSLSA) on the second Saturday of every month.',
  },
  'jammu-kashmir': {
    capital: 'Srinagar/Jammu',
    majorCities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'],
    localContent: 'J&K Police enforces traffic challans in Jammu and Srinagar divisions. Key enforcement zones include NH-44 (Jammu-Srinagar National Highway), Jammu bypass, and Srinagar Ring Road. Jammu sees highest challan volume near Trikuta Nagar, Gandhi Nagar, and RS Pura areas. Srinagar enforcement is active near Lal Chowk, Boulevard Road (Dal Lake), and Airport Road. NH-44 (world\'s highest motorable road stretch) has strict overloading and speed enforcement. Traffic cases handled at J&K High Court jurisdiction — Jammu Wing (Jammu) and Srinagar Wing (Srinagar). JKSLSA manages monthly Lok Adalat sessions.',
  },
  'ladakh': {
    capital: 'Leh',
    majorCities: ['Leh', 'Kargil'],
    localContent: 'Ladakh Police enforces traffic rules on one of the world\'s most challenging road networks. Key enforcement zones include Leh-Manali Highway (NH-3), Leh-Srinagar Highway (NH-1), and Leh city approaches. Overloading of tourist vehicles is the most common violation — strictly enforced near Khardung La and Chang La. Speed limits are strictly enforced on mountain passes. Helmet rules apply strictly across Leh and Kargil. Unfit vehicle certifications are carefully checked for tourist taxis. Traffic cases handled at UT of Ladakh Court at Leh. Lok Adalat sessions conducted by Ladakh Legal Services Authority (LLSA).',
  },
  'manipur': {
    capital: 'Imphal',
    majorCities: ['Imphal', 'Bishnupur', 'Churachandpur'],
    localContent: 'Manipur Traffic Police enforces e-challans in Imphal and surrounding districts. Key enforcement zones include NH-2 (Imphal-Jiribam), NH-37 (Imphal-Moreh), and Imphal city centre. Imphal\'s Paona Bazaar, Thangal Bazaar, and Nagamapal areas see highest signal-jumping violations. Overloading on Imphal-Jiribam highway is a major commercial vehicle issue. Helmet enforcement is active across Imphal East and West districts. Traffic cases handled at Manipur High Court jurisdiction (Imphal). Lok Adalat by MSLSA held monthly at district courts.',
  },
  'meghalaya': {
    capital: 'Shillong',
    majorCities: ['Shillong', 'Tura', 'Nongstoin'],
    localContent: 'Meghalaya Police enforces traffic challans in Shillong and East Khasi Hills district. Key enforcement areas include NH-6 (Shillong-Guwahati), NH-40 (Shillong-Dawki), and Shillong city centre near Police Bazaar. Shillong sees high tourist vehicle violations particularly during Northeast tourism season. Overloading on mining routes toward Jowai and Nongstoin is common. Tura in West Garo Hills has active enforcement on NH-51. Traffic cases handled at Meghalaya High Court (Shillong). MHLSA manages monthly Lok Adalat sessions.',
  },
  'nagaland': {
    capital: 'Kohima',
    majorCities: ['Kohima', 'Dimapur', 'Mokokchung'],
    localContent: 'Nagaland Police enforces traffic rules in Kohima, Dimapur, and other districts. Key enforcement zones include NH-2 (Dimapur-Kohima), NH-29 (Kohima-Imphal), and Dimapur commercial areas near Hongkong Market. Dimapur, being a commercial hub, sees highest challan volume for signal violations and parking. Kohima enforcement is strict near state secretariat and court complex. Commercial vehicle overloading is common on Dimapur-Kohima supply routes. Traffic cases handled at Nagaland High Court (Kohima). NSLSA manages Lok Adalat sessions monthly.',
  },
  'tripura': {
    capital: 'Agartala',
    majorCities: ['Agartala', 'Dharmanagar', 'Udaipur'],
    localContent: 'Tripura Police enforces traffic challans in Agartala and other major towns. Key enforcement areas include NH-8 (Agartala-Sabroom), NH-44 (Agartala-Dharmanagar), and Agartala city areas near Battala and Khayerpur. Agartala sees highest challan volume due to high two-wheeler density and limited road width. Border trade vehicles on Bangladesh corridor routes face frequent overloading checks. Traffic cases handled at Tripura High Court (Agartala) jurisdiction. TSLSA operates Lok Adalat on the second Saturday of each month.',
  },
  'mizoram': {
    capital: 'Aizawl',
    majorCities: ['Aizawl', 'Lunglei', 'Champhai'],
    localContent: 'Mizoram Traffic Police enforces challans in Aizawl and district headquarters. Key enforcement zones include NH-306 (Aizawl-Champhai), NH-302 (Aizawl-Lunglei), and Aizawl city roads near Bara Bazaar. Aizawl\'s hilly terrain makes speeding violations particularly dangerous — strict speed limits enforced. Overloading is common on Champhai trade route with Myanmar. Helmet violations are actively enforced across urban areas. Traffic cases handled at Gauhati High Court (Aizawl Bench). MZSLSA manages Lok Adalat sessions monthly.',
  },
  'sikkim': {
    capital: 'Gangtok',
    majorCities: ['Gangtok', 'Namchi', 'Geyzing'],
    localContent: 'Sikkim Traffic Police enforces strict rules on mountain roads, particularly for tourist vehicles. Key enforcement zones include NH-10 (Siliguri-Gangtok), NH-310 (Gangtok-Nathu La), and Gangtok city centre near MG Marg. Overloading and speeding on mountain passes (Nathu La 4,310m, Jelep La) are zero-tolerance violations. Tourist taxi overloading is strictly checked at entry points. Gangtok\'s MG Marg is a pedestrian zone — vehicle violations carry heavy fines. Traffic cases handled at Sikkim High Court (Gangtok). SLSA Sikkim manages Lok Adalat sessions.',
  },
  'arunachal-pradesh': {
    capital: 'Itanagar',
    majorCities: ['Itanagar', 'Naharlagun', 'Pasighat'],
    localContent: 'Arunachal Pradesh Police enforces traffic rules across its mountainous terrain and border areas. Key enforcement zones include NH-415 (Itanagar-Bhalukpong), NH-229 (Itanagar-Passighat), and Itanagar city areas near Naharlagun. Inner Line Permit (ILP) verification creates additional checkpoints where vehicle documents are scrutinized. Overloading on supply routes to remote districts is common. Itanagar and Naharlagun see highest challan volume for two-wheeler violations. Traffic cases handled at Gauhati High Court jurisdiction (Permanent Bench at Itanagar). ASLSA manages Lok Adalat.',
  },
  'andaman-nicobar': {
    capital: 'Port Blair',
    majorCities: ['Port Blair', 'Car Nicobar'],
    localContent: 'Andaman & Nicobar Islands Police enforces traffic rules across Port Blair and South Andaman. Key enforcement zones include NH-223 (Port Blair-Diglipur), Andaman Trunk Road, and Port Blair city areas near Aberdeen Bazaar and Haddo Wharf. Port Blair has strict vehicle density controls — only island-registered vehicles allowed, limiting total vehicle count. Speeding enforcement is active near Marine Hill and Corbyn\'s Cove beach road. Two-wheeler helmet violations are most common challan type. Traffic cases handled at Port Blair District & Sessions Court. Lok Adalat conducted by A&N SLSA.',
  },
  'lakshadweep': {
    capital: 'Kavaratti',
    majorCities: ['Kavaratti', 'Agatti', 'Minicoy'],
    localContent: 'Lakshadweep Administration enforces traffic rules across island territories. Kavaratti (capital island) has the highest vehicle density. Key enforcement areas include Kavaratti island internal roads and Agatti airport approach road. Vehicle population is strictly controlled across all islands. Speed limits are low — 40 kmph maximum on all island roads. Two-wheeler helmet rules are strictly enforced. Import of vehicles to Lakshadweep requires special permission. Traffic cases handled at UT Lakshadweep Court (Kavaratti). Lok Adalat conducted by Lakshadweep SLSA.',
  },
  'daman-diu': {
    capital: 'Daman',
    majorCities: ['Daman', 'Diu', 'Silvassa'],
    localContent: 'Daman & Diu Traffic Police enforces rules in Daman and Diu union territory. Key enforcement zones include NH-48 (passing through Daman), Daman city roads near market areas, and Diu island roads. Diu being a tourist destination sees high weekend traffic violations — parking and speeding are common issues. Daman\'s proximity to Gujarat creates high cross-state commercial vehicle movement with frequent overloading checks. Helmet and seat belt enforcement is active. Traffic cases handled at Daman & Diu District Court. Lok Adalat by D&D SLSA conducted monthly.',
  },
  'dadra-nagar-haveli': {
    capital: 'Silvassa',
    majorCities: ['Silvassa', 'Naroli', 'Samarvarni'],
    localContent: 'Dadra & Nagar Haveli Traffic Police enforces rules in Silvassa and the union territory. Key enforcement zones include NH-48 (passing through DNH), Silvassa industrial estate approach roads, and Vapi-Silvassa connector. DNH\'s industrial character means high commercial vehicle traffic — overloading on factory supply routes is a major violation. Silvassa city has active signal and helmet enforcement near Swaminarayan Temple tourist zone. Gujarat border creates high cross-state commercial vehicle movement. Traffic cases handled at DNH District Court (Silvassa). Lok Adalat by DNH SLSA conducted monthly.',
  },
};

type Offence = { name: string; fine: string };

type StateData = {
  name: string;
  image: string;
  authority: string;
  rtoCode: string;
  description: string;
  commonOffences: Offence[];
  fineRange: string;
  portalUrl: string;
  portalName: string;
  cityPageSlug?: string; // links to our city settlement page if available
  relatedStates?: string[]; // slugs of nearby/related states
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
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Parivahan E-Challan Portal',
    cityPageSlug: 'delhi',
    relatedStates: ['haryana', 'uttar-pradesh'],
  },
  'maharashtra': {
    name: 'Maharashtra',
    image: '/images/states/e_challan_maharashtra.webp',
    authority: 'Maharashtra Traffic Police',
    rtoCode: 'MH',
    description: 'Maharashtra issues e-challans across Mumbai, Pune, Nagpur and other cities via camera-based enforcement and Maha Traffic app.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,500' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
    portalUrl: 'https://mahatrafficechallan.gov.in/',
    portalName: 'Maharashtra E-Challan Portal',
    relatedStates: ['karnataka', 'gujarat', 'goa'],
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    image: '/images/states/e_challan_uttar_pradesh.webp',
    authority: 'UP Traffic Police',
    rtoCode: 'UP',
    description: 'UP traffic police issues e-challans across Lucknow, Noida, Agra, Kanpur and other major cities via UPTRANSIT portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'No registration certificate', fine: '₹2,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Seat belt violation', fine: '₹1,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://uppolice.gov.in/',
    portalName: 'UP Police E-Challan Portal',
    cityPageSlug: 'noida',
    relatedStates: ['delhi', 'haryana', 'uttarakhand'],
  },
  'karnataka': {
    name: 'Karnataka',
    image: '/images/states/e_challan_karnataka.webp',
    authority: 'Karnataka State Police',
    rtoCode: 'KA',
    description: 'Karnataka enforces traffic rules via e-challan system across Bengaluru, Mysuru, and other cities through the KSP portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Triple riding', fine: '₹1,000' },
    ],
    fineRange: '₹500 – ₹10,000',
    portalUrl: 'https://ksp.karnataka.gov.in/',
    portalName: 'Karnataka State Police E-Challan',
    relatedStates: ['tamil-nadu', 'andhra-pradesh', 'telangana', 'kerala'],
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    image: '/images/states/e_challan_tamil_nadu.webp',
    authority: 'Tamil Nadu Traffic Police',
    rtoCode: 'TN',
    description: 'Tamil Nadu traffic police issues e-challans in Chennai, Coimbatore, Madurai and other cities through the TNECHALLAN portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'Triple riding', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Tamil Nadu E-Challan Portal',
    relatedStates: ['karnataka', 'andhra-pradesh', 'kerala'],
  },
  'telangana': {
    name: 'Telangana',
    image: '/images/states/e_challan_telangana.webp',
    authority: 'Telangana State Police',
    rtoCode: 'TS',
    description: 'Telangana enforces strict traffic rules via e-challans in Hyderabad and other cities with TGSWAN camera-based surveillance.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
    portalUrl: 'https://echallan.tspolice.gov.in/',
    portalName: 'Telangana Police E-Challan',
    relatedStates: ['andhra-pradesh', 'karnataka', 'maharashtra'],
  },
  'kerala': {
    name: 'Kerala',
    image: '/images/states/e_challan_kerala.webp',
    authority: 'Kerala Police',
    rtoCode: 'KL',
    description: 'Kerala Motor Vehicles Department issues e-challans across Thiruvananthapuram, Kochi, Kozhikode and other cities via M-Parivahan.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
    ],
    fineRange: '₹500 – ₹10,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Kerala E-Challan (Parivahan)',
    relatedStates: ['tamil-nadu', 'karnataka'],
  },
  'haryana': {
    name: 'Haryana',
    image: '/images/states/e_challan_haryana.webp',
    authority: 'Haryana Traffic Police',
    rtoCode: 'HR',
    description: 'Haryana traffic police issues e-challans in Gurgaon, Faridabad, Ambala, and other cities via the Haryana Police portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'Seat belt violation', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://haryanapolice.gov.in/',
    portalName: 'Haryana Police E-Challan',
    cityPageSlug: 'gurgaon',
    relatedStates: ['delhi', 'punjab', 'uttar-pradesh'],
  },
  'odisha': {
    name: 'Odisha',
    image: '/images/states/e_challan_odisha.webp',
    authority: 'Odisha Traffic Police',
    rtoCode: 'OD',
    description: 'Odisha state police issues e-challans in Bhubaneswar, Cuttack, and other cities via the Odisha Police portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Odisha E-Challan (Parivahan)',
    relatedStates: ['west-bengal', 'jharkhand', 'andhra-pradesh'],
  },
  'andhra-pradesh': {
    name: 'Andhra Pradesh',
    image: '/images/states/e_challan_andhra_pradesh.webp',
    authority: 'Andhra Pradesh Police',
    rtoCode: 'AP',
    description: 'AP enforces traffic rules via e-challans across Vijayawada, Visakhapatnam, and other cities through the AP Police portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Triple riding', fine: '₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'AP E-Challan (Parivahan)',
    relatedStates: ['telangana', 'karnataka', 'odisha'],
  },
  'punjab': {
    name: 'Punjab',
    image: '/images/states/e_challan_punjab.webp',
    authority: 'Punjab Police',
    rtoCode: 'PB',
    description: 'Punjab traffic police issues e-challans in Ludhiana, Amritsar, and other cities. Check challans via the Punjab Police e-challan portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
    ],
    fineRange: '₹500 – ₹10,000',
    portalUrl: 'https://punjabpolice.gov.in/',
    portalName: 'Punjab Police E-Challan',
    relatedStates: ['haryana', 'himachal-pradesh', 'delhi'],
  },
  'bihar': {
    name: 'Bihar',
    image: '/images/states/e_challan_bihar.webp',
    authority: 'Bihar Police',
    rtoCode: 'BR',
    description: 'Bihar traffic police issues e-challans in Patna, Gaya, and other cities. Check via the Parivahan national portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Bihar E-Challan (Parivahan)',
    relatedStates: ['jharkhand', 'west-bengal', 'uttar-pradesh'],
  },
  'rajasthan': {
    name: 'Rajasthan',
    image: '/images/states/e_challan_rajasthan.webp',
    authority: 'Rajasthan Police',
    rtoCode: 'RJ',
    description: 'Rajasthan traffic police issues e-challans in Jaipur, Jodhpur, Udaipur, and other cities via the Rajasthan Police portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong side driving', fine: '₹5,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://police.rajasthan.gov.in/',
    portalName: 'Rajasthan Police E-Challan',
    relatedStates: ['delhi', 'haryana', 'gujarat', 'madhya-pradesh'],
  },
  'gujarat': {
    name: 'Gujarat',
    image: '/images/states/e_challan_gujarat.webp',
    authority: 'Gujarat Police',
    rtoCode: 'GJ',
    description: 'Gujarat traffic police issues e-challans across Ahmedabad, Surat, Vadodara, and other cities via the Gujarat Police e-challan system.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹500 – ₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Mobile use while driving', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://gujaratpolice.gov.in/',
    portalName: 'Gujarat Police E-Challan',
    relatedStates: ['maharashtra', 'rajasthan', 'madhya-pradesh'],
  },
  'madhya-pradesh': {
    name: 'Madhya Pradesh',
    image: '/images/states/e_challan_madhya_pradesh.webp',
    authority: 'Madhya Pradesh Police',
    rtoCode: 'MP',
    description: 'MP traffic police issues e-challans in Bhopal, Indore, Gwalior, and other cities via the MP Police e-challan portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://mppolice.gov.in/',
    portalName: 'MP Police E-Challan',
    relatedStates: ['rajasthan', 'gujarat', 'maharashtra', 'uttar-pradesh'],
  },
  'west-bengal': {
    name: 'West Bengal',
    image: '/images/states/e_challan_west_bengal.webp',
    authority: 'West Bengal Traffic Police',
    rtoCode: 'WB',
    description: 'West Bengal traffic police issues e-challans in Kolkata, Siliguri, Asansol, and other cities via the WB Police portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://wbpolice.gov.in/',
    portalName: 'West Bengal Police E-Challan',
    relatedStates: ['odisha', 'bihar', 'jharkhand', 'assam'],
  },
  'assam': {
    name: 'Assam',
    image: '/images/states/e_challan_assam.webp',
    authority: 'Assam Police',
    rtoCode: 'AS',
    description: 'Assam traffic police issues e-challans in Guwahati, Dibrugarh, and other cities via the Assam Police portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Assam E-Challan (Parivahan)',
    relatedStates: ['west-bengal', 'meghalaya', 'manipur', 'nagaland'],
  },
  'himachal-pradesh': {
    name: 'Himachal Pradesh',
    image: '/images/states/e_challan_himachal_pradesh.webp',
    authority: 'Himachal Pradesh Police',
    rtoCode: 'HP',
    description: 'HP traffic police issues e-challans in Shimla, Dharamshala, Manali, and other areas. Special enforcement on mountain roads.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding on hill roads', fine: '₹1,000 – ₹2,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'HP E-Challan (Parivahan)',
    relatedStates: ['punjab', 'delhi', 'uttarakhand'],
  },
  'uttarakhand': {
    name: 'Uttarakhand',
    image: '/images/states/e_challan_uttarakhand.webp',
    authority: 'Uttarakhand Police',
    rtoCode: 'UK',
    description: 'Uttarakhand traffic police issues e-challans in Dehradun, Haridwar, Rishikesh, and other cities. High enforcement on pilgrimage routes.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Uttarakhand E-Challan (Parivahan)',
    relatedStates: ['delhi', 'uttar-pradesh', 'himachal-pradesh'],
  },
  'jharkhand': {
    name: 'Jharkhand',
    image: '/images/states/e_challan_jharkhand.webp',
    authority: 'Jharkhand Police',
    rtoCode: 'JH',
    description: 'Jharkhand traffic police issues e-challans in Ranchi, Jamshedpur, Dhanbad, and other cities via the Jharkhand Police portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Jharkhand E-Challan (Parivahan)',
    relatedStates: ['bihar', 'west-bengal', 'odisha'],
  },
  'chhattisgarh': {
    name: 'Chhattisgarh',
    image: '/images/states/e_challan_chhattisgarh.webp',
    authority: 'Chhattisgarh Police',
    rtoCode: 'CG',
    description: 'Chhattisgarh traffic police issues e-challans in Raipur, Bilaspur, and other cities via the CG Police e-challan system.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'CG E-Challan (Parivahan)',
    relatedStates: ['madhya-pradesh', 'odisha', 'maharashtra'],
  },
  'goa': {
    name: 'Goa',
    image: '/images/states/e_challan_goa.webp',
    authority: 'Goa Police',
    rtoCode: 'GA',
    description: 'Goa traffic police issues e-challans in Panaji, Margao, Vasco, and other areas. Strict enforcement during tourist season.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'Drunk driving', fine: '₹10,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹10,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Goa E-Challan (Parivahan)',
    relatedStates: ['maharashtra', 'karnataka'],
  },
  'jammu-kashmir': {
    name: 'Jammu & Kashmir',
    image: '/images/states/e_challan_jammu_kashmir.webp',
    authority: 'J&K Police',
    rtoCode: 'JK',
    description: 'Jammu & Kashmir traffic police issues e-challans in Jammu, Srinagar, and other areas via the J&K Police portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://jkpolice.gov.in/',
    portalName: 'J&K Police E-Challan',
    relatedStates: ['himachal-pradesh', 'punjab', 'ladakh'],
  },
  'ladakh': {
    name: 'Ladakh',
    image: '/images/states/e_challan_ladakh.webp',
    authority: 'Ladakh Police',
    rtoCode: 'LA',
    description: 'Ladakh traffic police issues e-challans in Leh, Kargil, and other areas. Special focus on mountain road safety and overloading.',
    commonOffences: [
      { name: 'Speeding on mountain roads', fine: '₹1,000 – ₹2,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
      { name: 'Helmet violation', fine: '₹1,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Ladakh E-Challan (Parivahan)',
    relatedStates: ['jammu-kashmir', 'himachal-pradesh'],
  },
  'manipur': {
    name: 'Manipur',
    image: '/images/states/e_challan_manipur.webp',
    authority: 'Manipur Police',
    rtoCode: 'MN',
    description: 'Manipur traffic police issues e-challans in Imphal, Churachandpur, and other areas via the Parivahan portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Manipur E-Challan (Parivahan)',
    relatedStates: ['assam', 'nagaland', 'mizoram'],
  },
  'meghalaya': {
    name: 'Meghalaya',
    image: '/images/states/e_challan_meghalaya.webp',
    authority: 'Meghalaya Police',
    rtoCode: 'ML',
    description: 'Meghalaya traffic police issues e-challans in Shillong, Tura, and other areas via the Parivahan portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Meghalaya E-Challan (Parivahan)',
    relatedStates: ['assam', 'tripura'],
  },
  'nagaland': {
    name: 'Nagaland',
    image: '/images/states/e_challan_nagaland.webp',
    authority: 'Nagaland Police',
    rtoCode: 'NL',
    description: 'Nagaland traffic police issues e-challans in Kohima, Dimapur, and other areas via the Parivahan national portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Nagaland E-Challan (Parivahan)',
    relatedStates: ['assam', 'manipur', 'arunachal-pradesh'],
  },
  'tripura': {
    name: 'Tripura',
    image: '/images/states/e_challan_tripura.webp',
    authority: 'Tripura Police',
    rtoCode: 'TR',
    description: 'Tripura traffic police issues e-challans in Agartala, Dharmanagar, and other areas via the Parivahan portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Tripura E-Challan (Parivahan)',
    relatedStates: ['west-bengal', 'assam', 'meghalaya'],
  },
  'mizoram': {
    name: 'Mizoram',
    image: '/images/states/e_challan_mizoram.webp',
    authority: 'Mizoram Police',
    rtoCode: 'MZ',
    description: 'Mizoram traffic police issues e-challans in Aizawl, Lunglei, and other areas via the Parivahan national portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Mizoram E-Challan (Parivahan)',
    relatedStates: ['assam', 'manipur', 'tripura'],
  },
  'sikkim': {
    name: 'Sikkim',
    image: '/images/states/e_challan_sikkim.webp',
    authority: 'Sikkim Police',
    rtoCode: 'SK',
    description: 'Sikkim traffic police issues e-challans in Gangtok, Namchi, and other areas. Strict enforcement on mountain and tourist routes.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding on mountain roads', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Sikkim E-Challan (Parivahan)',
    relatedStates: ['west-bengal', 'assam'],
  },
  'arunachal-pradesh': {
    name: 'Arunachal Pradesh',
    image: '/images/states/e_challan_arunachal_pradesh.webp',
    authority: 'Arunachal Pradesh Police',
    rtoCode: 'AR',
    description: 'Arunachal Pradesh traffic police issues e-challans in Itanagar, Naharlagun, and other areas via the Parivahan portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Overloading', fine: '₹2,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Arunachal E-Challan (Parivahan)',
    relatedStates: ['assam', 'nagaland'],
  },
  'andaman-nicobar': {
    name: 'Andaman & Nicobar',
    image: '/images/states/e_challan_andaman_nicobar.webp',
    authority: 'Andaman & Nicobar Police',
    rtoCode: 'AN',
    description: 'Andaman & Nicobar Islands traffic police issues e-challans in Port Blair and other areas via the national Parivahan portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Andaman E-Challan (Parivahan)',
    relatedStates: [],
  },
  'lakshadweep': {
    name: 'Lakshadweep',
    image: '/images/states/e_challan_lakshadweep.webp',
    authority: 'Lakshadweep Police',
    rtoCode: 'LD',
    description: 'Lakshadweep traffic police issues e-challans in Kavaratti and other islands via the national Parivahan portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
      { name: 'Overloading', fine: '₹2,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Lakshadweep E-Challan (Parivahan)',
    relatedStates: ['kerala'],
  },
  'daman-diu': {
    name: 'Daman & Diu',
    image: '/images/states/e_challan_daman_diu.webp',
    authority: 'Daman & Diu Police',
    rtoCode: 'DD',
    description: 'Daman & Diu traffic police issues e-challans in Daman and Diu via the national Parivahan e-challan portal.',
    commonOffences: [
      { name: 'Helmet violation', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'Daman & Diu E-Challan (Parivahan)',
    relatedStates: ['gujarat', 'maharashtra'],
  },
  'dadra-nagar-haveli': {
    name: 'Dadra Nagar Haveli',
    image: '/images/states/e_challan_dadra_nagar_haveli.webp',
    authority: 'DNH Police',
    rtoCode: 'DN',
    description: 'Dadra & Nagar Haveli traffic police issues e-challans in Silvassa and other areas via the national Parivahan portal.',
    commonOffences: [
      { name: 'Helmet not worn', fine: '₹1,000' },
      { name: 'No seat belt', fine: '₹1,000' },
      { name: 'Speeding', fine: '₹1,000 – ₹2,000' },
      { name: 'Wrong parking', fine: '₹500 – ₹1,000' },
      { name: 'Signal jumping', fine: '₹1,000 – ₹5,000' },
      { name: 'No documents', fine: '₹500 – ₹5,000' },
    ],
    fineRange: '₹500 – ₹5,000',
    portalUrl: 'https://echallan.parivahan.gov.in/',
    portalName: 'DNH E-Challan (Parivahan)',
    relatedStates: ['gujarat', 'maharashtra'],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = STATES[slug];
  if (!state) return {};
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
  const meta = STATE_META[slug];
  const cityList = meta?.majorCities?.slice(0, 3).join(', ') || state.name;
  const title = `${state.name} E-Challan Check | Pending Traffic Challan & Settlement Online`;
  const description = `Check & settle pending e-challans in ${state.name} (${state.rtoCode}) — ${cityList}. Lok Adalat settlement, save up to 50%. Free check, no court visit. Expert legal guidance.`;
  const image = `${SITE_URL}/images/states/e_challan_${slug.replace(/-/g, '_')}.webp`;
  const canonicalUrl = `${SITE_URL}/e-challan/${slug}`;
  return {
    title,
    description,
    keywords: [
      `e-challan ${state.name}`,
      `e challan ${state.name}`,
      `${state.name} e challan check`,
      `traffic challan ${state.name}`,
      `${state.rtoCode} challan check`,
      `check challan ${state.name} online`,
      `pending challan ${state.name}`,
      `${state.name} traffic fine`,
      `echallan ${state.rtoCode}`,
      `${state.name} vehicle challan`,
      `Lok Adalat challan ${state.name}`,
      `traffic challan settlement ${state.name}`,
      `how to pay e challan ${state.name}`,
      `${state.name} challan check online`,
      `unpaid challan ${state.name}`,
      `${state.name} challan settlement`,
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: canonicalUrl,
      siteName: 'ChallanSetu',
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `Check and settle e-challan in ${state.name} | ${state.authority}` }],
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
      q: `How to pay e-challan online in ${state.name}?`,
      a: `You can pay ${state.name} e-challans online via the official ${state.authority} portal or through Parivahan (echallan.parivahan.gov.in). However, before paying the full amount, check if you're eligible for Lok Adalat settlement — you could save 30–50% legally.`,
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
      a: `Unpaid challans in ${state.name} can result in: (1) Vehicle registration renewal blocked, (2) Detention at police checkpoints, (3) Higher fines over time, (4) Court summons for serious violations. Settle promptly to avoid escalation.`,
    },
    {
      q: `Can I contest a wrong challan in ${state.name}?`,
      a: `Yes. If a challan has been issued incorrectly in ${state.name} — wrong vehicle, incorrect offence, or camera error — you can contest it through the ${state.authority}. ChallanSetu helps you prepare the documentation and guides you through the appeal process.`,
    },
    {
      q: `Is there a time limit to pay ${state.name} e-challan?`,
      a: `${state.name} e-challans generally have a 60–90 day payment window before the case is sent to court. Once in court, additional legal fees apply. It is best to check and settle challans within 30 days of receiving them.`,
    },
    {
      q: `Can a challan affect vehicle registration renewal in ${state.name}?`,
      a: `Yes. In ${state.name}, pending challans can block your vehicle's RC (Registration Certificate) renewal. The RTO checks for outstanding challans before processing renewals. ChallanSetu helps you clear all pending challans before renewal.`,
    },
    {
      q: `Is it safe to settle a challan through ChallanSetu?`,
      a: `Yes. ChallanSetu uses the official Lok Adalat process — a Government of India legal mechanism — to settle traffic challans at a reduced amount. The process is 100% legal and transparent.`,
    },
    {
      q: `How long does challan settlement take in ${state.name}?`,
      a: `After you submit your vehicle number, ChallanSetu fetches your challan details immediately. The Lok Adalat settlement process typically takes 4–8 weeks — we handle all paperwork, court filings, and follow-ups for you.`,
    },
  ];

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
  const pageUrl = `/e-challan/${slug}`;
  const meta = STATE_META[slug];
  const cityList = meta?.majorCities?.slice(0, 3).join(', ') || state.name;
  const title = `${state.name} E-Challan Check | Pending Traffic Challan & Settlement Online`;
  const description = `Check & settle pending e-challans in ${state.name} (${state.rtoCode}) — ${cityList}. Lok Adalat settlement, save up to 50%. Free check, no court visit. Expert legal guidance.`;
  const dateModified = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* All Schema Markup */}
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'E-Challan by State', url: '/e-challan/delhi' },
        { name: state.name, url: pageUrl },
      ])} />
      <JsonLd data={webPageSchema({ title, description, url: pageUrl, dateModified })} />
      <JsonLd data={serviceSchema({
        name: `E-Challan Check & Settlement in ${state.name}`,
        description,
        url: pageUrl,
      })} />
      <JsonLd data={howToSchema({
        name: `How to Check E-Challan in ${state.name}`,
        description: `Step-by-step guide to check and settle pending traffic challans in ${state.name}`,
        steps: [
          { name: 'Enter Vehicle Number', text: `Enter your ${state.rtoCode}-registered vehicle number in the form above.` },
          { name: 'View Pending Challans', text: 'We fetch all pending challans linked to your vehicle, offence details, and fine amounts.' },
          { name: 'Check Lok Adalat Eligibility', text: `We check if your ${state.name} challan qualifies for Lok Adalat settlement (30–50% discount).` },
          { name: 'Get Expert Guidance', text: 'Our team guides you through the full legal settlement process — no court visit required.' },
        ],
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <SiteHeader />
      <main className="flex-1">
        <div className="relative">

          {/* Hero — sticky on mobile, slides under content sheet as user scrolls */}
          <section
            className="sticky top-[104px] z-0 sm:relative sm:top-auto sm:z-auto text-white overflow-hidden py-12 sm:py-16"
            style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}
          >
            <div className="absolute inset-0">
              <Image
                src={state.image}
                alt={`${state.name} e-challan check online | ${state.rtoCode} traffic challan status | ${state.authority}`}
                fill
                sizes="100vw"
                className="object-cover object-top opacity-10"
                priority
              />
            </div>
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="relative container-app">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-amber-400 text-xs font-semibold mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {state.authority}
                </span>
                <span className="text-white/30">·</span>
                <span>RTO: {state.rtoCode}</span>
                {meta?.capital && (
                  <>
                    <span className="text-white/30">·</span>
                    <span>Capital: {meta.capital}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3" style={{ color: '#f5c842' }}>
                {state.name} E-Challan Check & Settlement
              </h1>
              <p className="text-gray-300 text-sm sm:text-base max-w-xl mb-2 leading-relaxed">
                {state.description}
              </p>
              {meta?.majorCities?.length > 0 && (
                <p className="text-amber-400/70 text-xs mb-6">
                  Covering: {meta.majorCities.join(' · ')}
                </p>
              )}
              <HeroForm showCalculatorLink={false} source="city_page" city={state.name} buttonLabel="Check Challan" />
            </div>
          </section>

          {/* White content sheet — rounded top corners slide over sticky hero on scroll */}
          <div className="relative z-10 bg-white rounded-t-[2rem] sm:rounded-none -mt-6 sm:mt-0" style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.18)' }}>

            {/* Common offences with fine amounts */}
            <section className="py-6 sm:py-8 bg-gray-50">
              <div className="container-app">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-amber-600">Penalties</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Common Traffic Challan Offences & Fines in {state.name}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl">
                  {state.commonOffences.map((offence) => (
                    <div key={offence.name} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{offence.name}</span>
                      </div>
                      <span className="text-sm font-bold text-amber-600 whitespace-nowrap flex-shrink-0">{offence.fine}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <RenewalBanner />

            {/* How to check */}
            <section className="py-6 sm:py-8 bg-white">
              <div className="container-app max-w-4xl">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-amber-600">Guide</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
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
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-6 sm:py-8 bg-gray-50">
              <div className="container-app max-w-3xl">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-amber-600">FAQ</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  E-Challan {state.name} — Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.q} className="group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-sm transition-shadow">
                      <summary className="flex items-center justify-between gap-4 list-none font-semibold text-gray-900 text-sm sm:text-base group-open:text-amber-700">
                        {faq.q}
                        <span className="text-amber-500 text-lg group-open:rotate-45 transition-transform duration-200 flex-shrink-0">+</span>
                      </summary>
                      <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* State-specific local enforcement content */}
            {meta?.localContent && (
              <section className="py-6 bg-white border-t border-gray-100">
                <div className="container-app max-w-4xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Traffic Challan Enforcement in {state.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {meta.localContent}
                  </p>
                </div>
              </section>
            )}

            {/* What happens if unpaid */}
            <section className="py-6 bg-white border-t border-gray-100">
              <div className="container-app max-w-4xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  What Happens if You Don't Pay {state.name} Challan?
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'RC Renewal Blocked', desc: `Your ${state.rtoCode} vehicle's RC renewal will be blocked until all pending challans are cleared.` },
                    { title: 'Checkpoint Detention', desc: 'Traffic police can detain your vehicle at checkpoints for unpaid challans.' },
                    { title: 'Escalating Fines', desc: 'Court fees and legal costs add up over time, making the final amount much higher.' },
                    { title: 'Court Summons', desc: 'Serious violations can lead to court summons and possible criminal proceedings.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Drink & Drive Cross-link */}
            <section className="py-5 bg-amber-50 border-y border-amber-100">
              <div className="container-app max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">Got a Drink & Drive Challan in {state.name}?</p>
                  <p className="text-sm text-gray-600 mt-1">Section 185 cases need expert legal guidance. We help you understand your options.</p>
                </div>
                <Link
                  href="/drink-and-drive"
                  className="shrink-0 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Get Legal Help →
                </Link>
              </div>
            </section>

            {/* Motor Insurance Cross-link */}
            <section className="py-5 bg-white border-t border-gray-100">
              <div className="container-app max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">Is your vehicle insurance still valid?</p>
                  <p className="text-sm text-gray-600 mt-1">Check motor insurance status free via VAHAN. Renew online & save up to 85%.</p>
                </div>
                <Link
                  href="/motor-insurance"
                  className="shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Check Insurance Status →
                </Link>
              </div>
            </section>

            {/* Blog Internal Links — only real existing pages */}
            <section className="py-6 bg-white border-t border-gray-100">
              <div className="container-app max-w-4xl">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Helpful Guides on Challan Settlement
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { href: '/blog/lok-adalat-challan-settlement', label: 'What is Lok Adalat & How it Settles Challans' },
                    { href: '/blog/what-happens-if-you-dont-pay-challan', label: 'What Happens if You Don\'t Pay Challan?' },
                    { href: '/blog/court-challan-vs-online-challan', label: 'Court Challan vs Online Challan — Key Differences' },
                    { href: '/how-it-works', label: 'How ChallanSetu Works — Step by Step' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      <span className="text-amber-500">→</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Official Portal Link */}
            <section className="py-5 bg-white border-t border-gray-100">
              <div className="container-app max-w-4xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Official {state.name} E-Challan Portal
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  You can also check and pay challans directly on the official government portal. ChallanSetu helps you understand your options and settle eligible challans at a reduced amount.
                </p>
                <a
                  href={state.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  {state.portalName}
                </a>
              </div>
            </section>

            {/* City Settlement Page Link (if available) */}
            {state.cityPageSlug && (
              <section className="py-6 bg-amber-50 border-y border-amber-100">
                <div className="container-app max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">Need help settling your {state.name} challan?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Get expert legal guidance tailored to {state.name} courts & Lok Adalat process.
                    </p>
                  </div>
                  <Link
                    href={`/${state.cityPageSlug}/challan-settlement`}
                    className="shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Settle {state.name} Challan →
                  </Link>
                </div>
              </section>
            )}

            {/* Related States — rich anchor text for SEO */}
            {state.relatedStates && state.relatedStates.length > 0 && (
              <section className="py-6 bg-gray-50 border-t border-gray-100">
                <div className="container-app max-w-4xl">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Check E-Challan in Nearby States</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {state.relatedStates.map((relatedSlug) => {
                      const related = STATES[relatedSlug];
                      const relatedMeta = STATE_META[relatedSlug];
                      if (!related) return null;
                      return (
                        <Link
                          key={relatedSlug}
                          href={`/e-challan/${relatedSlug}`}
                          className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-colors group"
                        >
                          <span className="text-amber-500 mt-0.5 text-lg flex-shrink-0">→</span>
                          <div>
                            <p className="font-bold text-gray-900 text-sm group-hover:text-amber-700 transition-colors">
                              {related.name} E-Challan Check ({related.rtoCode})
                            </p>
                            {relatedMeta?.majorCities && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {relatedMeta.majorCities.slice(0, 3).join(', ')}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Bottom CTA */}
            <section className="py-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
              <div className="container-app relative text-center max-w-2xl">
                <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
                  Got a challan in {state.name}?
                </h2>
                <p className="text-white/60 mb-8">
                  Enter your vehicle number to check status and get expert guidance on settlement options.
                </p>
                <div className="max-w-xl mx-auto">
                  <HeroForm
                    showCalculatorLink={false}
                    source="city_page"
                    city={state.name}
                    buttonLabel="Check My Challan"
                  />
                </div>
              </div>
            </section>

            <Footer />
          </div> {/* end content sheet */}
        </div> {/* end sticky wrapper */}
      </main>
    </>
  );
}
