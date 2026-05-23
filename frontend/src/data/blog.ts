// ─── Blog Data Layer ──────────────────────────────────────────────────────────

export type BlogBlock =
  | { kind: "p"; html: string }
  | { kind: "ul"; items: string[] }
  | { kind: "image"; alt: string; src: string; caption?: string }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "steps"; items: { title: string; html: string }[] }
  | { kind: "highlights"; items: string[] }
  | { kind: "strong_bullets"; items: { label: string; text: string }[] };

export interface BlogSection {
  heading?: string;
  blocks: BlogBlock[];
}

export interface BlogPost {
  slug: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  excerpt: string;
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  ctaHtml: string;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

const POSTS: BlogPost[] = [
  {
    slug: "challan-discount-delhi",
    coverImage: "/blog/cover-delhi-challan.svg",
    metaTitle: "Challan Discount in Delhi: How to Legally Pay Less | ChallanSetu",
    metaDescription:
      "Got a traffic challan in Delhi? Learn how challan discount via Lok Adalat can cut your fine by up to 50%. Check eligibility free.",
    title: "Got a Traffic Challan in Delhi? Here’s How to Legally Pay Less",
    category: "Challan Guide",
    publishedAt: "2026-05-01",
    readingTime: 7,
    excerpt:
      "A Delhi traffic challan can run into thousands of rupees , but you don’t always have to pay the full amount. Here’s how Lok Adalat settlement works and how to get a legal challan discount in Delhi.",
    sections: [
      {
        blocks: [
          {
            kind: "p",
            html: "You’re driving home after a long day and near ITO a traffic cop waves you down for a red light jump. Or maybe you open the Parivahan app and find two camera-issued challans sitting against your vehicle number , for violations you didn’t even know were recorded. Whether it’s an overspeeding notice on the Outer Ring Road, a no-helmet challan, or a phone-use fine, a Delhi traffic challan today can run into thousands of rupees in one shot. The good news? You don’t always have to pay the full amount.",
          },
        ],
      },
      {
        heading: "Why Traffic Fines in Delhi Are So High Now",
        blocks: [
          {
            kind: "p",
            html: "If you got a traffic challan a few years ago, the fine barely hurt , ₹100 here, ₹500 there. Those days ended in September 2019.",
          },
          {
            kind: "p",
            html: "The Motor Vehicles Amendment Act 2019 overhauled penalty amounts across India, often by 5 to 10 times. No seatbelt is now ₹1,000. Using your phone while driving is ₹5,000 for a first offence. Drunk driving starts at ₹10,000. Driving without a licence: ₹5,000.",
          },
          {
            kind: "p",
            html: "Delhi went further. Thousands of speed cameras, ANPR cameras, and red light enforcement systems were installed across major corridors , NH-48, NH-9, the Outer Ring Road, key flyovers and city junctions. These cameras issue e-challans automatically, 24 hours a day, without any traffic officer present.",
          },
          {
            kind: "p",
            html: "The result: many Delhi drivers are carrying challan penalties they didn’t know existed until their RC renewal or insurance was flagged. By then, the situation can already be complicated.",
          },
          {
            kind: "p",
            html: "Understanding your options before you simply pay full is worth a few minutes of your time.",
          },
        ],
      },
      {
        heading: "Online Challan vs Court Challan , What’s the Difference?",
        blocks: [
          {
            kind: "p",
            html: "Not all challans work the same way, and knowing the difference changes what you can do about yours.",
          },
          {
            kind: "p",
            html: "An <strong>online challan</strong> (or e-challan) is issued by traffic cameras or police handheld devices. You can see it on the Parivahan portal and pay it online. Simple , but you pay the full government-set fine. Parivahan offers zero scope for negotiation.",
          },
          {
            kind: "p",
            html: "A <strong>court challan</strong> is more serious. It typically comes from a major violation , drunk driving, driving without documents, or an e-challan that went unresolved long enough to get referred to a traffic magistrate. Ignoring a court challan can make your situation significantly worse over time.",
          },
          {
            kind: "image",
            alt: "Side-by-side comparison of an e-challan vs a court challan",
            src: "/blog/echallan-vs-court.svg",
          },
          {
            kind: "table",
            headers: ["", "Online Challan", "Court Challan"],
            rows: [
              ["Who issues it", "Camera / handheld device", "Traffic court / magistrate"],
              ["Pay online?", "Yes, via Parivahan", "No , needs legal process"],
              ["Discount possible?", "Via Lok Adalat", "Yes"],
              ["Complexity", "Low", "Requires lawyer support"],
            ],
          },
          {
            kind: "p",
            html: "Here’s what matters most: <strong>both types can potentially be settled for less</strong> through a process called Lok Adalat. And for court challans especially, getting legal help isn’t optional , it’s essential for any kind of traffic challan settlement.",
          },
        ],
      },
      {
        heading: "What Is Lok Adalat and Can It Really Reduce Your Fine?",
        blocks: [
          {
            kind: "p",
            html: "Lok Adalat means “People’s Court.” It’s a legal forum established under the Legal Services Authorities Act, 1987 , a proper government institution, not a loophole or a workaround.",
          },
          {
            kind: "p",
            html: "Traffic challan cases are among the most common matters heard at Lok Adalat. A lawyer presents your case, explains the circumstances, and negotiates a reduced settlement amount with the presiding authority. If both sides agree, the case is closed , permanently. No appeal, no re-opening, no future liability.",
          },
          {
            kind: "p",
            html: "Can a Lok Adalat challan really reduce your fine? Yes, realistically. Delhi traffic challans handled through Lok Adalat have seen reductions of 30% to 50% in eligible cases. The actual saving depends on:",
          },
          {
            kind: "ul",
            items: [
              "The type of violation",
              "How old the challan is",
              "Whether it’s a court challan or an e-challan",
              "The magistrate’s call on the day",
            ],
          },
          {
            kind: "p",
            html: "It’s not a guarantee of exactly 50% every single time. But it’s almost always less than paying the full penalty on Parivahan. Even a 30% reduction on a ₹5,000 fine saves you ₹1,500.",
          },
          {
            kind: "p",
            html: "The catch? Lok Adalat sessions run on fixed dates, require proper paperwork, and work best when a lawyer who knows the process handles the filing. Most people don’t have that available , which is exactly why a dedicated challan discount Delhi service like ChallanSetu exists.",
          },
        ],
      },
      {
        heading: "How ChallanSetu Helps You Settle Your Challan for Less",
        blocks: [
          {
            kind: "image",
            alt: "ChallanSetu , settle your challan and save up to 50% legally",
            src: "/blog/mobile-challansetu.svg",
          },
          {
            kind: "p",
            html: "ChallanSetu is a Delhi NCR challan settlement service built for vehicle owners who want to pay less , legally. The entire process is digital. You don’t need to step inside a courtroom.",
          },
          {
            kind: "p",
            html: "Here’s how it works:",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Enter your vehicle number",
                html: "Head to <a href=\"/pay-vehicle-challan-in-delhi\" class=\"text-primary-600 underline underline-offset-2 hover:text-primary-700\">challansetu.com/pay-vehicle-challan-in-delhi</a> and enter your registration number. No payment at this stage. Just your number plate.",
              },
              {
                title: "Share your challan details",
                html: "Provide your name, mobile number, and any challan info you have , a screenshot, PDF, or challan number. The team reviews your case and checks eligibility for Lok Adalat settlement.",
              },
              {
                title: "A dedicated lawyer takes over",
                html: "This is where ChallanSetu differs from Parivahan. A real lawyer is assigned to your case and files it for the next available Lok Adalat session in your jurisdiction. You don’t appear in court. You don’t chase paperwork.",
              },
              {
                title: "Settlement confirmed, you pay less",
                html: "Once the session happens and a reduced amount is agreed, you pay only the settled sum. You receive written confirmation that the case is closed.",
              },
            ],
          },
          {
            kind: "p",
            html: "The full timeline is typically 15 to 45 days, depending on the next Lok Adalat date.",
          },
          {
            kind: "highlights",
            items: [
              "Save up to 50% on eligible challans , not zero",
              "A lawyer fights your case, not a payment form",
              "Fully digital , no court visits, no chasing officials",
              "If settlement isn’t achieved: 100% money-back guarantee",
            ],
          },
          {
            kind: "p",
            html: "See the complete step-by-step process at <a href=\"/how-it-works\" class=\"text-primary-600 underline underline-offset-2 hover:text-primary-700\">challansetu.com/how-it-works</a>.",
          },
        ],
      },
      {
        heading: "Who Is Eligible for a Challan Discount in Delhi?",
        blocks: [
          {
            kind: "p",
            html: "Lok Adalat isn’t available for every challan. Here’s what generally qualifies:",
          },
          {
            kind: "strong_bullets",
            items: [
              {
                label: "Location",
                text: "Your challan is from Delhi, Noida, Gurgaon, Ghaziabad, or Faridabad",
              },
              {
                label: "Violation type",
                text: "Overspeeding, red light jumping, no helmet, no seatbelt, mobile use while driving, wrong parking , standard traffic offences",
              },
              {
                label: "Status",
                text: "The challan has not already been paid in full or previously settled",
              },
              {
                label: "Offence category",
                text: "Standard traffic violations qualify. Challans tied to serious criminal matters , injury accidents, hit-and-run , have a different process",
              },
              {
                label: "Court challans",
                text: "Active court challan cases still eligible for a Lok Adalat hearing are covered",
              },
            ],
          },
          {
            kind: "image",
            alt: "ChallanSetu service area , Delhi, Noida, Gurgaon, Ghaziabad, Faridabad",
            src: "/blog/delhi-ncr-cities.svg",
          },
          {
            kind: "p",
            html: "Not sure if your specific challan qualifies? The easiest move is to submit your vehicle number on challansetu.com. The challan fine reduction eligibility check is completely free , no payment, no commitment.",
          },
          {
            kind: "p",
            html: "For detailed scenarios, the full <a href=\"/faq\" class=\"text-primary-600 underline underline-offset-2 hover:text-primary-700\">FAQ page</a> covers the most common cases people ask about.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is challan discount legal in India?",
        a: "Yes, completely. Lok Adalat is a government-recognised legal institution under the Legal Services Authorities Act, 1987. Getting your challan settled through Lok Adalat at a reduced amount is a fully legal process , the same route used for thousands of cases every year across Indian courts. It is not a shortcut. It is the system working as designed.",
      },
      {
        q: "How much can I save on my challan?",
        a: "Eligible Delhi traffic challans typically see a reduction of 30–50% of the original fine amount. The actual saving depends on the offence type, challan age, whether it is a court challan, and the outcome of the Lok Adalat session. ChallanSetu gives you a realistic estimate after reviewing your specific case , before you pay anything.",
      },
      {
        q: "Does ChallanSetu work for court challans?",
        a: "Yes. ChallanSetu specifically handles court challans where the case needs lawyer assistance and Lok Adalat filing. If your challan has already entered the court process, ChallanSetu can still help , that’s actually where its legal support makes the most meaningful difference compared to just trying to pay online.",
      },
      {
        q: "How long does challan settlement take?",
        a: "The typical timeline is 15 to 45 days. It depends on when the next Lok Adalat session is scheduled in your jurisdiction. Once your case is filed, the assigned lawyer tracks the hearing date and keeps you updated. You do not need to do anything or show up anywhere.",
      },
    ],
    ctaHtml:
      "If you’ve been putting off dealing with a pending challan , or just received a fine that feels steep , it costs nothing to find out what’s possible. Visit <a href='/' class='font-semibold underline underline-offset-2'>challansetu.com</a>, enter your vehicle number, and the team reviews your case at no charge. No upfront payment, no court visits, no confusing process. If your challan qualifies for a legal discount in Delhi, a real lawyer handles everything from filing to settlement. And if settlement doesn’t work out? Your money comes back. Checking takes two minutes , start there.",
  },
  {
    slug: "what-happens-if-you-dont-pay-challan",
    coverImage: "/blog/cover-unpaid-challan.svg",
    metaTitle: "What Happens If You Don't Pay a Traffic Challan? | ChallanSetu",
    metaDescription:
      "Ignoring a traffic challan can block your RC renewal, suspend your licence, and grow your fine. Find out the real consequences and how to resolve pending challans.",
    title: "What Happens If You Don't Pay a Traffic Challan?",
    category: "Challan Guide",
    publishedAt: "2026-05-05",
    readingTime: 6,
    excerpt:
      "Ignoring a traffic challan is one of the costliest mistakes a vehicle owner can make. Here's exactly what happens — and how to fix it before it gets worse.",
    sections: [
      {
        blocks: [
          {
            kind: "p",
            html: "Most people who get a traffic challan fall into one of two groups. The first group panics, pays immediately, and moves on. The second group thinks: <em>\"I'll deal with it later.\"</em> Months pass. The challan quietly sits on the Parivahan server. Nothing happens — until it does.",
          },
          {
            kind: "p",
            html: "If you're in the second group, this article is important. The consequences of ignoring a challan in India are real, they compound over time, and some of them will catch you at the worst possible moment.",
          },
        ],
      },
      {
        heading: "The Challan Doesn't Disappear",
        blocks: [
          {
            kind: "p",
            html: "This is the most dangerous myth around traffic challans: that they expire or get wiped after some time. They don't.",
          },
          {
            kind: "p",
            html: "E-challans issued by cameras and handheld devices are stored permanently against your vehicle registration number on the Parivahan portal. Court challans are even more persistent — they sit as live cases with a traffic magistrate and accumulate legal weight the longer they go unresolved.",
          },
          {
            kind: "p",
            html: "When you run a vehicle number check on Parivahan, every pending challan shows up — including ones from years ago. And increasingly, other systems are checking Parivahan too.",
          },
        ],
      },
      {
        heading: "Consequence 1: RC Renewal Gets Blocked",
        blocks: [
          {
            kind: "p",
            html: "Every private vehicle in India needs its RC (Registration Certificate) renewed periodically. In many states including Delhi, the transport department now checks Parivahan for pending challans before processing an RC renewal.",
          },
          {
            kind: "p",
            html: "If there are unpaid challans against your vehicle number, your renewal can be rejected outright. You'll be told to clear the dues first — no alternatives, no waivers.",
          },
          {
            kind: "p",
            html: "This catches people off guard because it often hits months or years after the original challan, exactly when you're under deadline pressure to get the RC renewed.",
          },
        ],
      },
      {
        heading: "Consequence 2: Driving Licence Suspension Risk",
        blocks: [
          {
            kind: "p",
            html: "Under the Motor Vehicles Act, repeated or serious traffic violations can trigger a licence suspension process. While this isn't automatic for every unpaid challan, court challans — especially those tied to offences like drunk driving, dangerous driving, or driving without documents — carry real suspension risk.",
          },
          {
            kind: "p",
            html: "Once a case is before a traffic magistrate and you haven't responded, the court can pass an ex-parte order (a ruling without your presence). That ruling can include a licence suspension, a fine larger than the original, or both.",
          },
          {
            kind: "highlights",
            items: [
              "Court challan + no appearance = possible ex-parte order",
              "Ex-parte orders can include licence suspension",
              "Getting an ex-parte order reversed requires legal intervention",
              "The longer you wait, the harder the reversal process gets",
            ],
          },
        ],
      },
      {
        heading: "Consequence 3: Insurance Complications",
        blocks: [
          {
            kind: "p",
            html: "Vehicle insurance in India is linked to your registration number, not just your policy. Some insurers flag vehicles with a history of serious pending challans — particularly for commercial vehicles or in no-claim-bonus situations.",
          },
          {
            kind: "p",
            html: "More commonly, if you're involved in an accident while carrying an unresolved traffic challan, the opposing party's lawyer will use it as evidence of negligent or unlawful driving. This can complicate your insurance claim significantly.",
          },
        ],
      },
      {
        heading: "Consequence 4: Escalation to Court Challan",
        blocks: [
          {
            kind: "p",
            html: "E-challans that stay unpaid for extended periods get referred to the traffic court magistrate. At that point, the case moves from a simple online payment to an active legal proceeding.",
          },
          {
            kind: "p",
            html: "You can no longer just pay on Parivahan to close it. The case needs to be heard in court or resolved via Lok Adalat. It requires proper legal filing — which means you can't do it alone.",
          },
          {
            kind: "table",
            headers: ["Stage", "Status", "What It Takes to Close"],
            rows: [
              ["Fresh e-challan", "Pending on Parivahan", "Pay online directly"],
              ["Old unpaid e-challan", "May be referred to court", "Lok Adalat or court hearing"],
              ["Active court challan", "Live case with magistrate", "Lawyer + Lok Adalat filing"],
              ["Ex-parte order passed", "Ruling against you", "Legal reversal process"],
            ],
          },
        ],
      },
      {
        heading: "The Good News: Even Old Challans Can Be Resolved",
        blocks: [
          {
            kind: "p",
            html: "Here's what people don't realise: even challans that have escalated to court can be resolved — often for less than the original fine amount — through Lok Adalat. The Lok Adalat system was specifically designed to clear backlogs like these. Traffic cases are among the most common matters heard.",
          },
          {
            kind: "p",
            html: "A lawyer presents your case, negotiates a settlement figure with the presiding authority, and if both sides agree, the case is closed permanently. No further liability, no record following you.",
          },
          {
            kind: "p",
            html: "ChallanSetu handles exactly this situation — including challan cases that have already gone to court. The process is fully digital: you submit your details, a lawyer is assigned, and they handle the filing and hearing. You don't visit court.",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Check your pending challans",
                html: "Enter your vehicle number on <a href=\"/\" class=\"text-primary-600 underline underline-offset-2 hover:text-primary-700\">challansetu.com</a>. The team identifies all pending challans — including old ones you may have forgotten.",
              },
              {
                title: "Free eligibility review",
                html: "ChallanSetu reviews your specific challans and tells you what's possible. No upfront payment at this stage.",
              },
              {
                title: "Lawyer files for Lok Adalat",
                html: "An assigned lawyer handles all paperwork and filing for the next available Lok Adalat session in your jurisdiction.",
              },
              {
                title: "Settlement at a reduced amount",
                html: "Once the hearing happens and both sides agree on a reduced figure, you pay only that amount. Case closed permanently.",
              },
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Does a traffic challan expire or get deleted automatically?",
        a: "No. Challans do not expire. E-challans stay on Parivahan indefinitely against your vehicle number. Court challans remain as active legal cases until they are settled, dismissed, or a ruling is passed. The only way to close a challan is to resolve it.",
      },
      {
        q: "Can an unpaid challan block my RC renewal?",
        a: "Yes. Delhi and several other states now check Parivahan for pending challans before processing RC renewals. If you have outstanding dues, the renewal application will be held or rejected until they are cleared.",
      },
      {
        q: "My e-challan is very old. Can it still be settled?",
        a: "Yes, most old e-challans can still be settled — often through Lok Adalat, which may allow a reduced payment. If the challan has escalated to a court matter, ChallanSetu's legal team handles the court process on your behalf. Start with a free check at challansetu.com.",
      },
      {
        q: "What if a court has already passed an order against me?",
        a: "An ex-parte court order is serious but not the end. A lawyer can file for it to be set aside and then pursue a Lok Adalat settlement. The earlier you act, the simpler the process. Delaying after an order only makes reversal harder.",
      },
    ],
    ctaHtml:
      "If you've been ignoring a challan — or just discovered an old one you didn't know about — the best move is to check your situation now before it blocks something important. Visit <a href='/' class='font-semibold underline underline-offset-2'>challansetu.com</a>, enter your vehicle number, and get a free review. No payment required to check. ChallanSetu handles everything from fresh e-challans to old court cases — legally, digitally, with a money-back guarantee if settlement doesn't work out.",
  },
  {
    slug: "court-challan-vs-online-challan",
    coverImage: "/blog/cover-court-vs-online.svg",
    metaTitle: "Court Challan vs Online Challan: What's the Difference? | ChallanSetu",
    metaDescription:
      "Not all traffic challans are the same. Learn the difference between an e-challan and a court challan, how each is issued, and what you can do to settle each one for less.",
    title: "Court Challan vs Online Challan: What's the Difference and How to Settle Each",
    category: "Challan Guide",
    publishedAt: "2026-05-10",
    readingTime: 6,
    excerpt:
      "Not all traffic challans are the same. Know the difference between an e-challan and a court challan — and what you can do to legally settle each one for less.",
    sections: [
      {
        blocks: [
          {
            kind: "p",
            html: "Most people use the word \"challan\" for any traffic fine, but there are actually two very different things it can mean — and the difference matters enormously for what you can do next.",
          },
          {
            kind: "p",
            html: "One type you can handle in minutes on your phone. The other requires a lawyer. Getting them confused is how people end up paying more than they need to, or worse, ignoring something that quietly becomes a legal problem.",
          },
          {
            kind: "image",
            alt: "E-Challan vs Court Challan — side by side comparison",
            src: "/blog/cover-court-vs-online.svg",
          },
        ],
      },
      {
        heading: "What Is an E-Challan (Online Challan)?",
        blocks: [
          {
            kind: "p",
            html: "An e-challan is a traffic penalty issued electronically. It comes from one of two sources:",
          },
          {
            kind: "ul",
            items: [
              "A traffic camera — speed cameras, red light cameras, and ANPR (Automatic Number Plate Recognition) cameras that capture violations automatically, without any officer present",
              "A police officer with a handheld device — who can issue a challan on the spot and send it electronically",
            ],
          },
          {
            kind: "p",
            html: "E-challans are recorded against your vehicle registration number on the <strong>Parivahan portal</strong> (parivahan.gov.in). You can see them there, check the fine amount, and pay directly online. The process is designed to be simple.",
          },
          {
            kind: "p",
            html: "The fine amounts are fixed by the Motor Vehicles Act and your state government. When you pay on Parivahan, you pay the full government-set amount — there's no room to negotiate on the portal itself.",
          },
          {
            kind: "highlights",
            items: [
              "Issued by camera or handheld device",
              "Visible and payable on Parivahan portal",
              "Fixed fine amounts set by law",
              "Can potentially be settled for less via Lok Adalat",
            ],
          },
        ],
      },
      {
        heading: "What Is a Court Challan?",
        blocks: [
          {
            kind: "p",
            html: "A court challan is a more serious matter. It means your traffic violation case has been referred to or is already being heard by a <strong>traffic magistrate</strong> — a judicial officer with actual court authority.",
          },
          {
            kind: "p",
            html: "Court challans arise in several situations:",
          },
          {
            kind: "ul",
            items: [
              "Serious violations — drunk driving, driving without a licence, dangerous driving causing harm",
              "An e-challan that went unpaid for a long time and was referred to court",
              "Violations where the officer filed a direct charge sheet in traffic court",
              "Cases involving accident liability",
            ],
          },
          {
            kind: "p",
            html: "With a court challan, you <strong>cannot pay online</strong> on Parivahan to close it. The case is a live legal proceeding. It needs to be dealt with through the court system — which means either appearing in court yourself, or having a lawyer represent you.",
          },
          {
            kind: "p",
            html: "If you ignore a court challan, the magistrate can pass an order without you present (called an ex-parte order). That can include a fine larger than the original amount, a licence suspension, or both.",
          },
        ],
      },
      {
        heading: "Key Differences at a Glance",
        blocks: [
          {
            kind: "table",
            headers: ["", "E-Challan", "Court Challan"],
            rows: [
              ["Issued by", "Camera / police device", "Traffic magistrate / charge sheet"],
              ["How to check", "Parivahan portal", "Court records / notice received"],
              ["Pay online?", "Yes", "No"],
              ["What happens if ignored", "May escalate to court", "Ex-parte order possible"],
              ["Can be settled for less?", "Yes, via Lok Adalat", "Yes, via Lok Adalat"],
              ["Needs a lawyer?", "Optional but helpful", "Strongly recommended"],
            ],
          },
        ],
      },
      {
        heading: "Can Both Be Settled for Less Than the Full Amount?",
        blocks: [
          {
            kind: "p",
            html: "Yes — this is the part most people don't know. Both types of challans can be settled for less than the full fine amount through a legal process called <strong>Lok Adalat</strong>.",
          },
          {
            kind: "p",
            html: "Lok Adalat (\"People's Court\") is a government-recognised alternative dispute resolution forum under the Legal Services Authorities Act, 1987. Traffic cases are among the most commonly heard matters at Lok Adalat sessions.",
          },
          {
            kind: "p",
            html: "In a Lok Adalat session, a lawyer presents your case, and the settlement amount is negotiated with the presiding authority. If both sides agree, the case is permanently closed — no re-opening, no further liability. Challans settled through Lok Adalat typically see reductions of 30% to 50%.",
          },
          {
            kind: "p",
            html: "For e-challans, Lok Adalat is an alternative to just paying on Parivahan. For court challans, Lok Adalat is usually the <em>best</em> route available — it closes the case with a reduced payment instead of an unpredictable court ruling.",
          },
        ],
      },
      {
        heading: "How to Tell Which Type You Have",
        blocks: [
          {
            kind: "p",
            html: "Here's a quick way to figure out what you're dealing with:",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Check Parivahan",
                html: "Go to parivahan.gov.in and search by your vehicle number. If your challan shows up here with a \"Pay Now\" option, it's an e-challan and still in the online stage.",
              },
              {
                title: "Look for physical notices",
                html: "If you've received a physical court summons or notice from a traffic magistrate's court, your case has become a court challan. Don't ignore this — respond quickly.",
              },
              {
                title: "Check with ChallanSetu",
                html: "If you're unsure, enter your vehicle number at <a href=\"/\" class=\"text-primary-600 underline underline-offset-2 hover:text-primary-700\">challansetu.com</a>. The team reviews your challans and tells you exactly what type they are and what options you have — for free.",
              },
            ],
          },
        ],
      },
      {
        heading: "Which Needs More Urgent Attention?",
        blocks: [
          {
            kind: "p",
            html: "Both need attention, but court challans are more time-sensitive. Every week a court challan sits unresolved, the risk of an ex-parte ruling increases. An active court challan also makes it harder to get your RC renewed or transfer vehicle ownership.",
          },
          {
            kind: "p",
            html: "E-challans are less urgent but not risk-free. Left long enough, they get referred to court and become the more complicated version. The earlier you act on an e-challan, the simpler your options are.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I know if my challan is a court challan or an e-challan?",
        a: "Check Parivahan first. If your challan appears there with a payment option, it's still at the e-challan stage. If you've received a physical court summons, or Parivahan shows the challan as referred to court, it has become a court matter. ChallanSetu can also identify this for you — enter your vehicle number for a free check.",
      },
      {
        q: "Can I pay a court challan online on Parivahan?",
        a: "No. Once a case has been referred to a traffic magistrate, it cannot be closed by paying on Parivahan. The case needs to be resolved through the court — either by appearing in person or having a lawyer represent you, ideally through a Lok Adalat settlement.",
      },
      {
        q: "Is Lok Adalat available for both types of challans?",
        a: "Yes. Lok Adalat handles both e-challan cases and court challan cases. For e-challans, it's an alternative to paying full on Parivahan. For court challans, it's typically the best available route — it closes the case with a reduced payment and no further liability.",
      },
      {
        q: "Do I need a lawyer for an e-challan?",
        a: "For a standard e-challan, you don't strictly need a lawyer — you can pay on Parivahan yourself. But if you want to pursue a Lok Adalat settlement to pay less, a lawyer who knows the process makes a significant difference to the outcome. For court challans, professional legal support is strongly recommended.",
      },
    ],
    ctaHtml:
      "Whether you have an e-challan sitting on Parivahan or an old court challan you've been avoiding, both can be resolved for less than the full amount — legally. Visit <a href='/' class='font-semibold underline underline-offset-2'>challansetu.com</a>, enter your vehicle number, and get a free review of your specific situation. ChallanSetu handles both e-challans and court challans across Delhi NCR, with real lawyers managing the Lok Adalat process on your behalf.",
  },

  // ─── Post 4: How to Check Pending Challan in Delhi ───────────────────────────
  {
    slug: "how-to-check-pending-challan-delhi",
    coverImage: "/blog/cover-check-challan.svg",
    metaTitle: "How to Check Pending Challan in Delhi (4 Free Methods) | ChallanSetu",
    metaDescription:
      "Check pending challans on your Delhi vehicle number in minutes. 4 free methods: Parivahan portal, mParivahan app, Delhi Traffic Police site, and ChallanSetu.",
    title: "How to Check Pending Challan in Delhi (4 Ways That Actually Work)",
    category: "Challan Guide",
    publishedAt: "2026-05-15",
    readingTime: 5,
    excerpt:
      "Not sure if you have pending challans? Here are 4 free ways to check your vehicle's challan status in Delhi — including what to do once you find them.",
    sections: [
      {
        blocks: [
          {
            kind: "p",
            html: "Thousands of Delhi drivers discover they have pending challans only when their RC renewal gets blocked, or when they're stopped at a police checkpoint. Camera-issued e-challans are generated automatically and never physically served — so you can accumulate fines without ever knowing. Checking takes under two minutes and costs nothing.",
          },
          {
            kind: "p",
            html: "Here are the four methods that actually work, in order of reliability.",
          },
        ],
      },
      {
        heading: "Method 1: Parivahan Portal (Most Reliable)",
        blocks: [
          {
            kind: "p",
            html: "The <strong>Parivahan portal</strong> (parivahan.gov.in) is the official government database for all e-challans issued across India. It's the primary source — every other method pulls from here.",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Go to parivahan.gov.in/parivahan",
                html: "Open the site on any browser. No login or app download needed.",
              },
              {
                title: 'Click "Online Services" → "e-Challan"',
                html: "This takes you to the challan check section. Look for \"Check Challan Status\" in the menu.",
              },
              {
                title: "Enter your vehicle number",
                html: "Type your registration number exactly as it appears on your RC — for example, DL7SBY5194. You can also search by challan number or driving licence number.",
              },
              {
                title: "Enter the captcha and submit",
                html: "All pending challans linked to your vehicle number will appear — including the offence, date, location, and fine amount.",
              },
            ],
          },
          {
            kind: "highlights",
            items: [
              "Shows all camera-issued and handheld-device challans",
              "Displays challan status: pending, paid, or disposed",
              "Works for Delhi, UP, Haryana, and all other states",
              "Free, no login required",
            ],
          },
        ],
      },
      {
        heading: "Method 2: mParivahan App",
        blocks: [
          {
            kind: "p",
            html: "The <strong>mParivahan app</strong> (available on Android and iOS) is the official mobile app from the Ministry of Road Transport. It gives you the same challan data as the Parivahan website but with a cleaner interface.",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Download mParivahan from the Play Store or App Store",
                html: "Search for \"mParivahan\" — the official app by NIC (National Informatics Centre).",
              },
              {
                title: "Tap \"RC\" or search your vehicle number",
                html: "Enter your registration number in the vehicle search. The app shows RC details, insurance status, and pending challans.",
              },
              {
                title: "Check the Challan tab",
                html: "Scroll to the challan section to see all pending fines with dates and amounts.",
              },
            ],
          },
          {
            kind: "p",
            html: "The app also lets you store your RC and driving licence digitally, which is legally accepted at traffic checkpoints under the Motor Vehicles Act.",
          },
        ],
      },
      {
        heading: "Method 3: Delhi Traffic Police Portal",
        blocks: [
          {
            kind: "p",
            html: "The <strong>Delhi Traffic Police website</strong> (delhitrafficpolice.nic.in) has its own challan check for Delhi-specific violations — particularly useful for older challans and those issued by Delhi Traffic Police directly.",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Visit delhitrafficpolice.nic.in",
                html: "Go to the official Delhi Traffic Police site.",
              },
              {
                title: 'Click "Check Your Challan"',
                html: "Usually listed under Services or e-Services in the navigation.",
              },
              {
                title: "Enter vehicle number or challan number",
                html: "Results show pending challans issued by Delhi Traffic Police, with the option to pay online.",
              },
            ],
          },
          {
            kind: "p",
            html: "Note: This portal is separate from Parivahan. A challan may appear on one but not the other depending on when it was issued. Checking both is safest.",
          },
        ],
      },
      {
        heading: "Method 4: Check via ChallanSetu",
        blocks: [
          {
            kind: "p",
            html: "If you want to check your challan status <em>and</em> find out whether you're eligible for a legal discount in the same step, <a href='/' class='text-primary-600 underline underline-offset-2 hover:text-primary-700'>ChallanSetu</a> is the fastest route.",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Enter your vehicle number on challansetu.com",
                html: "No login, no payment required at this stage.",
              },
              {
                title: "Our team checks your challan details",
                html: "We verify the challan status, type, and whether it qualifies for a Lok Adalat settlement discount.",
              },
              {
                title: "You receive the available options",
                html: "If your challan is eligible for a reduction, we share the best available option before you pay anything.",
              },
            ],
          },
          {
            kind: "p",
            html: "This is the only method that doesn't just <em>show</em> you the challan — it also tells you whether you can legally pay less.",
          },
        ],
      },
      {
        heading: "What to Do After You Find a Pending Challan",
        blocks: [
          {
            kind: "p",
            html: "Once you've confirmed a pending challan, you have three options:",
          },
          {
            kind: "strong_bullets",
            items: [
              {
                label: "Pay full on Parivahan",
                text: "Fastest option. Use Parivahan's online payment — UPI, net banking, or card. The challan is cleared within 24–48 hours.",
              },
              {
                label: "Contest it (if wrongly issued)",
                text: "If you believe the challan was issued in error — wrong vehicle number, camera malfunction, wrong location — you can file a representation with the issuing authority. Success rate varies.",
              },
              {
                label: "Settle for less via Lok Adalat",
                text: "For eligible challans, a Lok Adalat settlement can reduce the fine by 30–50%. This requires a lawyer to file and represent the case. ChallanSetu manages this entire process.",
              },
            ],
          },
          {
            kind: "p",
            html: "The most important thing: <strong>don't ignore a pending challan</strong>. It won't expire, and it will create problems at the worst possible time — RC renewal, insurance claim, or a police checkpoint.",
          },
          {
            kind: "p",
            html: "For the full picture on what happens when challans go unpaid, see our guide: <a href='/blog/what-happens-if-you-dont-pay-challan' class='text-primary-600 underline underline-offset-2 hover:text-primary-700'>What Happens If You Don't Pay a Traffic Challan</a>.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I check my challan status by vehicle number in Delhi?",
        a: "Go to parivahan.gov.in, click Online Services → e-Challan → Check Challan Status, and enter your vehicle registration number. All pending challans linked to your vehicle will appear. Alternatively, use the mParivahan app for the same data in a mobile-friendly format.",
      },
      {
        q: "Why is my challan not showing on Parivahan?",
        a: "Challans can take 24–72 hours to appear on Parivahan after being issued. If a challan issued more than a week ago still doesn't appear, it may be a court challan rather than an e-challan — court challans are managed separately and may not always show on the Parivahan portal. Contact ChallanSetu for help tracing it.",
      },
      {
        q: "Can I pay my Delhi challan online?",
        a: "Yes. Once you find your challan on Parivahan, you can pay directly using UPI, net banking, or debit/credit card. However, paying full online means no discount. If your challan is eligible for Lok Adalat settlement, you could legally pay 30–50% less.",
      },
      {
        q: "Does checking challan status cost anything?",
        a: "No. Checking your challan status on Parivahan, mParivahan, Delhi Traffic Police portal, or ChallanSetu is completely free.",
      },
    ],
    ctaHtml:
      "Found a pending challan? Before you pay the full amount on Parivahan, check whether you're eligible for a legal discount. Visit <a href='/' class='font-semibold underline underline-offset-2'>challansetu.com</a>, enter your vehicle number, and our team will review your challan and share the best available settlement option — at no upfront cost. If a legal discount is possible, a real lawyer handles the entire Lok Adalat process on your behalf.",
  },

  // ─── Post 5: What is Lok Adalat ──────────────────────────────────────────────
  {
    slug: "lok-adalat-challan-settlement",
    coverImage: "/blog/cover-lok-adalat.svg",
    metaTitle: "What is Lok Adalat? How It Reduces Your Traffic Challan Fine | ChallanSetu",
    metaDescription:
      "Lok Adalat is a government-recognised legal forum that can cut your traffic challan fine by 30–50%. Learn how it works, who's eligible, and how to use it.",
    title: "What is Lok Adalat? How It Can Cut Your Traffic Fine by 50%",
    category: "Settlement Guide",
    publishedAt: "2026-05-20",
    readingTime: 6,
    excerpt:
      "Lok Adalat is the legal route thousands of Delhi drivers use to settle traffic challans at a reduced amount. Here's exactly how it works and who qualifies.",
    sections: [
      {
        blocks: [
          {
            kind: "p",
            html: "Every year, millions of traffic challans are issued across Delhi NCR. Most people assume they have two choices: pay the full fine on Parivahan, or ignore it and hope for the best. There's a third option that most people don't know about — one that's completely legal, government-sanctioned, and can cut your fine by 30 to 50%.",
          },
          {
            kind: "p",
            html: "It's called <strong>Lok Adalat</strong>. And it's been working quietly for decades.",
          },
        ],
      },
      {
        heading: "What is Lok Adalat?",
        blocks: [
          {
            kind: "p",
            html: "<strong>Lok Adalat</strong> (literally, \"People's Court\") is a legal forum established under the <strong>Legal Services Authorities Act, 1987</strong>. It's a formal part of India's justice system — not a shortcut, not a grey area, not a bribe. It's the government's own alternative dispute resolution mechanism.",
          },
          {
            kind: "p",
            html: "Lok Adalats are organised by State Legal Services Authorities (SLSAs) and District Legal Services Authorities (DLSAs) at regular intervals — monthly in most cities, more frequently in Delhi. They handle a wide range of cases: motor accident claims, electricity disputes, matrimonial matters, and most relevantly for vehicle owners, <strong>traffic challan cases</strong>.",
          },
          {
            kind: "p",
            html: "The key principle: both parties — in this case, the vehicle owner and the traffic authority — agree to a settlement. Once agreed, the Lok Adalat issues an award that is <strong>final and binding</strong>. The case is permanently closed. No appeal, no re-opening, no future liability.",
          },
          {
            kind: "highlights",
            items: [
              "Established under the Legal Services Authorities Act, 1987",
              "Organised by official State and District Legal Services Authorities",
              "Awards are final, binding, and cannot be appealed",
              "Used for thousands of traffic challan cases every month across India",
            ],
          },
        ],
      },
      {
        heading: "Why Does Lok Adalat Allow a Fine Reduction?",
        blocks: [
          {
            kind: "p",
            html: "The fine amounts set under the Motor Vehicles Act represent the <em>maximum</em> the government can collect — not a fixed amount that must be collected in every case. Lok Adalat operates on the principle of mutual settlement: if the vehicle owner agrees to pay a reduced but still meaningful amount, and the traffic authority accepts it, both sides benefit.",
          },
          {
            kind: "p",
            html: "From the government's perspective, a guaranteed partial payment today is better than a disputed case that drags through courts for years and may yield nothing. From the vehicle owner's perspective, they pay less and the case is permanently closed.",
          },
          {
            kind: "p",
            html: "This is not a loophole. It is how the system was designed to work.",
          },
          {
            kind: "table",
            headers: ["", "Paying on Parivahan", "Lok Adalat Settlement"],
            rows: [
              ["Amount paid", "100% of fine", "30–70% of fine typically"],
              ["Case status after", "Paid, closed", "Permanently settled, closed"],
              ["Time required", "Immediate", "15–45 days"],
              ["Lawyer needed", "No", "Yes — for best outcome"],
              ["Legal validity", "Yes", "Yes — court-issued award"],
            ],
          },
        ],
      },
      {
        heading: "How Does Lok Adalat Work for Traffic Challans?",
        blocks: [
          {
            kind: "p",
            html: "The process has specific steps, and knowing them helps you understand why professional help makes a real difference:",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Identify the challan and jurisdiction",
                html: "The challan must be matched to the correct Lok Adalat jurisdiction — typically the district court in the area where the violation occurred. Delhi has multiple district courts: Tis Hazari, Saket, Rohini, Karkardooma, Dwarka, and Patiala House.",
              },
              {
                title: "File a representation",
                html: "A formal application is filed with the relevant DLSA or traffic court, requesting the challan case be referred to the next Lok Adalat session. This requires the correct paperwork, challan details, and vehicle documents.",
              },
              {
                title: "Attend the Lok Adalat session",
                html: "On the session date, a lawyer presents your case to the Lok Adalat panel. The panel includes a sitting or retired judge. The lawyer negotiates the settlement amount on your behalf — you don't need to appear.",
              },
              {
                title: "Settlement award issued",
                html: "If both sides agree, the Lok Adalat panel issues a formal award. You pay only the settled amount. The case is permanently closed and recorded in court records.",
              },
            ],
          },
          {
            kind: "p",
            html: "The reason most vehicle owners never use this process isn't that it's difficult — it's that they don't know how to navigate it. Finding the right Lok Adalat session, filing the representation correctly, and knowing the realistic settlement range for your offence type requires experience. One wrong step and the case misses that session entirely.",
          },
        ],
      },
      {
        heading: "Which Challans Are Eligible for Lok Adalat Settlement?",
        blocks: [
          {
            kind: "p",
            html: "Most standard traffic violations qualify. Here's what generally applies:",
          },
          {
            kind: "strong_bullets",
            items: [
              {
                label: "Overspeeding",
                text: "Camera-issued speed challans from NH-48, NH-9, Outer Ring Road, and city corridors. Very commonly settled via Lok Adalat.",
              },
              {
                label: "Red light jumping",
                text: "RLVD camera challans and handheld-device challans both qualify.",
              },
              {
                label: "No helmet / no seatbelt",
                text: "Standard equipment violation challans are routinely handled.",
              },
              {
                label: "Mobile use while driving",
                text: "Eligible, including the higher ₹5,000 fine under the amended MV Act.",
              },
              {
                label: "Court challans",
                text: "Challans that have already moved to a traffic magistrate court are also eligible — these are actually where Lok Adalat makes the biggest financial difference.",
              },
              {
                label: "Old pending challans",
                text: "Age of challan generally doesn't disqualify it. Challans pending for 2–5 years have been successfully settled.",
              },
            ],
          },
          {
            kind: "p",
            html: "<strong>What doesn't qualify:</strong> Challans linked to accidents causing injury or death, drunk driving cases that have become criminal matters, and challans where a final court order has already been passed.",
          },
        ],
      },
      {
        heading: "How ChallanSetu Handles the Lok Adalat Process for You",
        blocks: [
          {
            kind: "p",
            html: "ChallanSetu was built specifically for this: getting Delhi NCR vehicle owners through the Lok Adalat process without needing to understand every step themselves.",
          },
          {
            kind: "steps",
            items: [
              {
                title: "Submit your vehicle number",
                html: "Visit <a href='/' class='text-primary-600 underline underline-offset-2 hover:text-primary-700'>challansetu.com</a> and enter your vehicle registration number. No payment required at this stage.",
              },
              {
                title: "We verify your challan details",
                html: "Our team checks the challan type, amount, jurisdiction, and Lok Adalat eligibility. You receive the assessment and the realistic savings range before you commit.",
              },
              {
                title: "A lawyer handles the entire filing",
                html: "Once you proceed, a dedicated lawyer is assigned to your case. They file the representation, track the Lok Adalat session date, and negotiate the settlement on your behalf.",
              },
              {
                title: "You pay only the settled amount",
                html: "After the session, you pay the agreed reduced amount. The case is permanently closed. You receive written confirmation.",
              },
            ],
          },
          {
            kind: "p",
            html: "If settlement isn't achieved: <strong>full money-back guarantee</strong>. No fine reduction, no charge.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Lok Adalat settlement legal?",
        a: "Yes, completely legal. Lok Adalat is a statutory body established under the Legal Services Authorities Act, 1987. Settlements made through Lok Adalat carry the same legal weight as a court decree. The process is used by thousands of people every month across India for traffic challans, motor accident claims, and other disputes.",
      },
      {
        q: "How much can I save on my challan through Lok Adalat?",
        a: "Typically 30–50% of the original fine amount for standard traffic violations in Delhi NCR. The actual saving depends on the offence type, challan age, whether it's a court challan, and the settlement negotiated on the day. ChallanSetu provides a realistic estimate after reviewing your specific challan — before you pay anything.",
      },
      {
        q: "Do I need to go to court for Lok Adalat settlement?",
        a: "No. If you use a service like ChallanSetu, the assigned lawyer represents your case at the Lok Adalat session. You don't need to appear in person, take time off work, or visit any court or government office.",
      },
      {
        q: "How long does Lok Adalat challan settlement take?",
        a: "Typically 15 to 45 days from filing, depending on when the next Lok Adalat session is scheduled in your jurisdiction. Delhi holds Lok Adalat sessions frequently — usually monthly at each district court. Once the session date is confirmed, the lawyer attends and the settlement is usually concluded the same day.",
      },
      {
        q: "What if my Lok Adalat settlement doesn't go through?",
        a: "If the settlement isn't achieved — either the session is postponed or a settlement amount can't be agreed — ChallanSetu offers a full money-back guarantee on its service fee. You would not have paid any challan amount at that point, so your only exposure is zero.",
      },
    ],
    ctaHtml:
      "If you have a pending traffic challan in Delhi, Noida, Gurgaon, Ghaziabad, or Faridabad, you don't have to pay the full amount. Visit <a href='/' class='font-semibold underline underline-offset-2'>challansetu.com</a>, enter your vehicle number, and our team will check whether your challan qualifies for a Lok Adalat settlement discount — completely free, no upfront payment. A real lawyer handles the entire process, and if settlement doesn't happen, you get your money back.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POST_MAP = new Map<string, BlogPost>(POSTS.map((p) => [p.slug, p]));

export function getBlogPost(slug: string): BlogPost | null {
  return POST_MAP.get(slug) ?? null;
}

export function getAllBlogPosts(): BlogPost[] {
  return POSTS;
}

export function getAllBlogSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
