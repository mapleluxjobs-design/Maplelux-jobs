(function() {
  if (!document.getElementById('formalGrid')) return;

  // ---------- 50+ JOBS DATA ----------
  const defaultJobs = [
    // ================= FORMAL JOBS (TECH, HEALTHCARE, FINANCE) =================
    // Canada Formal
    { country: 'canada', type: 'formal', title: 'Senior Frontend Developer', company: 'Maple Tech Inc.', desc: 'Build modern React applications for a leading Canadian fintech. Remote-friendly, with offices in Toronto and Vancouver.', fee: '15', salary: 'CAD 110k–140k', location: 'Toronto / Remote' },
    { country: 'canada', type: 'formal', title: 'Cloud Solutions Architect', company: 'AWS Partner', desc: 'Design enterprise cloud infrastructures. Must have deep knowledge of AWS, Terraform, and Kubernetes.', fee: '20', salary: 'CAD 130k–160k', location: 'Remote / Canada' },
    { country: 'canada', type: 'formal', title: 'Data Scientist', company: 'AI Health', desc: 'Build predictive models for patient outcomes. Strong Python, SQL, and machine learning experience required.', fee: '18', salary: 'CAD 95k–120k', location: 'Montreal, QC' },
    { country: 'canada', type: 'formal', title: 'Registered Nurse (ICU)', company: 'HealthCare Toronto', desc: 'Seeking compassionate ICU nurses for a major hospital network. Relocation support available for qualified candidates.', fee: '12', salary: 'CAD 85k–105k', location: 'Toronto, ON' },
    { country: 'canada', type: 'formal', title: 'Marketing Coordinator', company: 'True North Goods', desc: 'Support the marketing team for a sustainable outdoor brand. Based in Vancouver, some remote flexibility.', fee: '15', salary: 'CAD 55k–70k', location: 'Vancouver, BC' },
    { country: 'canada', type: 'formal', title: 'Civil Engineer', company: 'BuildRight', desc: 'Manage infrastructure projects across Ontario. P.Eng designation or eligibility required.', fee: '14', salary: 'CAD 80k–110k', location: 'Ottawa, ON' },
    { country: 'canada', type: 'formal', title: 'Graphic Designer', company: 'Creative Edge', desc: 'Create branding and digital assets for a fast-growing agency. Strong Adobe Creative Suite skills required.', fee: '10', salary: 'CAD 50k–65k', location: 'Toronto, ON' },
    { country: 'canada', type: 'formal', title: 'Sales Executive', company: 'SaaS Global', desc: 'Drive B2B software sales. Base salary plus commission. Previous tech sales experience required.', fee: '15', salary: 'CAD 70k+ OTE', location: 'Calgary, AB' },
    { country: 'canada', type: 'formal', title: 'Customer Success Manager', company: 'CloudSoft', desc: 'Ensure enterprise clients get maximum value from our software. Excellent communication skills required.', fee: '12', salary: 'CAD 65k–85k', location: 'Remote / Canada' },
    { country: 'canada', type: 'formal', title: 'Backend Developer (Node.js)', company: 'FinServe', desc: 'Develop robust microservices for a payments platform. Experience with Express and PostgreSQL needed.', fee: '16', salary: 'CAD 90k–115k', location: 'Toronto, ON' },
    { country: 'canada', type: 'formal', title: 'HR Generalist', company: 'Retail Group', desc: 'Manage employee relations, onboarding, and payroll for a national retail chain.', fee: '12', salary: 'CAD 60k–75k', location: 'Vancouver, BC' },
    { country: 'canada', type: 'formal', title: 'Mechanical Engineer', company: 'AutoParts Mfg', desc: 'Design and optimize manufacturing processes for automotive components. AutoCAD experience required.', fee: '15', salary: 'CAD 75k–95k', location: 'Windsor, ON' },
    { country: 'canada', type: 'formal', title: 'UX/UI Designer', company: 'Digital Agency', desc: 'Create intuitive user experiences for web and mobile apps. Portfolio required.', fee: '15', salary: 'CAD 70k–90k', location: 'Remote / Canada' },
    { country: 'canada', type: 'formal', title: 'Financial Controller', company: 'Logistics Co.', desc: 'Oversee financial reporting and compliance. CPA designation required.', fee: '25', salary: 'CAD 100k–130k', location: 'Toronto, ON' },
    { country: 'canada', type: 'formal', title: 'Elementary School Teacher', company: 'Public School Board', desc: 'Teach primary grades. Must have a valid Ontario teaching certificate or equivalent.', fee: '12', salary: 'CAD 60k–85k', location: 'Ottawa, ON' },

    // Luxembourg Formal
    { country: 'luxembourg', type: 'formal', title: 'Financial Analyst', company: 'LuxFinance S.A.', desc: 'Join a dynamic team in Luxembourg City. Analyse investment portfolios and support ESG reporting for European clients.', fee: '10', salary: '€65k–85k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'Cybersecurity Analyst', company: 'SecureLux', desc: 'Monitor network security and respond to incidents. CISSP or CEH certification is highly desired.', fee: '15', salary: '€70k–90k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'DevOps Engineer', company: 'FinTech Europe', desc: 'Maintain CI/CD pipelines and server infrastructure. Experience with Docker, Jenkins, and Linux required.', fee: '12', salary: '€65k–85k', location: 'Luxembourg / Hybrid' },
    { country: 'luxembourg', type: 'formal', title: 'IT Project Manager', company: 'Digital Lux Advisors', desc: 'Lead cross-border digital transformation projects. Fluent English required; French or German a plus.', fee: '10', salary: '€75k–95k', location: 'Luxembourg / Hybrid' },
    { country: 'luxembourg', type: 'formal', title: 'Legal Counsel (Corporate)', company: 'LuxLaw Partners', desc: 'Provide legal support on cross-border M&A and corporate structuring. Minimum 3 years PQE, EU qualified.', fee: '10', salary: '€80k–100k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'HR Manager', company: 'EuroCorp', desc: 'Oversee recruitment and employee relations for a 200-person European headquarters. Multilingual preferred.', fee: '12', salary: '€70k–90k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'Logistics Coordinator', company: 'CargoLink', desc: 'Coordinate shipments across the EU. Experience with customs documentation and supply chain software is a plus.', fee: '10', salary: '€50k–65k', location: 'Luxembourg / Hybrid' },
    { country: 'luxembourg', type: 'formal', title: 'Accountant', company: 'Lux Audit', desc: 'Prepare financial statements and tax returns. ACCA or equivalent qualification preferred.', fee: '10', salary: '€55k–75k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'Operations Manager', company: 'EuroLogistics', desc: 'Oversee daily operations for a busy distribution center. Lean Six Sigma certification is an asset.', fee: '15', salary: '€75k–95k', location: 'Esch-sur-Alzette' },
    { country: 'luxembourg', type: 'formal', title: 'Software Engineer (Java)', company: 'BankTech', desc: 'Develop secure banking applications. 3+ years of Java and Spring Boot experience needed.', fee: '15', salary: '€70k–90k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'Marketing Manager', company: 'Retail Lux', desc: 'Lead marketing campaigns across the Benelux region. Fluent French and English required.', fee: '12', salary: '€60k–80k', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'formal', title: 'Data Analyst', company: 'Insight EU', desc: 'Analyze large datasets to drive business decisions. SQL, Python, and Tableau skills required.', fee: '12', salary: '€55k–75k', location: 'Luxembourg / Hybrid' },
    { country: 'luxembourg', type: 'formal', title: 'Investment Fund Manager', company: 'Asset Mgmt', desc: 'Manage UCITS funds and ensure regulatory compliance. CFA charterholder preferred.', fee: '30', salary: '€100k–140k', location: 'Luxembourg City' },

    // ================= INFORMAL JOBS (GIGS & CASUAL) =================
    // Canada Informal
    { country: 'canada', type: 'informal', title: 'House Cleaner (Part-time)', company: 'Private Household', desc: 'Flexible cleaning work in Ottawa. 3–4 days per week, own transportation preferred. Friendly family environment.', fee: '5', salary: 'CAD 22/hr', location: 'Ottawa, ON' },
    { country: 'canada', type: 'informal', title: 'Moving Helper / Labourer', company: 'Family Move', desc: 'Help load and unload a moving truck this weekend. Cash paid same day. Must be able to lift heavy boxes.', fee: '6', salary: 'CAD 25/hr', location: 'Vancouver, BC' },
    { country: 'canada', type: 'informal', title: 'Snow Shovelling', company: 'Neighbourhood', desc: 'On-call snow clearing for driveways and walkways in Calgary. Paid per visit. Own shovel an asset.', fee: '5', salary: 'CAD 30/visit', location: 'Calgary, AB' },
    { country: 'canada', type: 'informal', title: 'Freelance Web Developer', company: 'Local Startup', desc: 'Build a simple 5-page WordPress site for a local bakery. Flexible timeline, remote work.', fee: '8', salary: 'CAD 1,500 fixed', location: 'Remote' },
    { country: 'canada', type: 'informal', title: 'Social Media Manager', company: 'Influencer', desc: 'Manage Instagram and TikTok for a local fitness influencer. Create graphics and reply to DMs.', fee: '10', salary: 'CAD 20/hr', location: 'Remote / Toronto' },
    { country: 'canada', type: 'informal', title: 'Bartender (Weekends)', company: 'The Local Pub', desc: 'Looking for an experienced bartender for Friday and Saturday nights in downtown Toronto.', fee: '7', salary: 'CAD 18/hr + tips', location: 'Toronto, ON' },
    { country: 'canada', type: 'informal', title: 'Data Entry Clerk', company: 'Accounting Firm', desc: 'Enter receipts and invoices into Excel. 10 hours a week, fully remote. Basic Excel skills needed.', fee: '6', salary: 'CAD 17/hr', location: 'Remote' },
    { country: 'canada', type: 'informal', title: 'Dog Walker (Weekends)', company: 'Local Owners', desc: 'Walk dogs around Stanley Park on Saturdays. Must love animals.', fee: '5', salary: 'CAD 20/hr', location: 'Vancouver, BC' },
    { country: 'canada', type: 'informal', title: 'Pizza Delivery Driver', company: 'Pizza Express', desc: 'Deliver pizzas in your own vehicle. Gas allowance provided. Evening shifts.', fee: '6', salary: 'CAD 16/hr + tips', location: 'Toronto, ON' },
    { country: 'canada', type: 'informal', title: 'Event Staff / Usher', company: 'Stadium', desc: 'Help with crowd control and ticket checking during weekend sports games.', fee: '5', salary: 'CAD 19/hr', location: 'Calgary, AB' },
    { country: 'canada', type: 'informal', title: 'Yard Work / Gardening', company: 'Homeowner', desc: 'Mow the lawn and trim hedges for a residential property. Equipment provided.', fee: '6', salary: 'CAD 25/hr', location: 'Ottawa, ON' },
    { country: 'canada', type: 'informal', title: 'Cafe Barista (Part-time)', company: 'Coffee Shop', desc: 'Make coffee and serve customers on weekday mornings. Willing to train.', fee: '6', salary: 'CAD 17/hr', location: 'Vancouver, BC' },
    { country: 'canada', type: 'informal', title: 'Furniture Assembler', company: 'Local Resident', desc: 'Assemble IKEA furniture in a new apartment. Tools provided. Estimated 3 hours of work.', fee: '5', salary: 'CAD 25/hr', location: 'Toronto, ON' },
    { country: 'canada', type: 'informal', title: 'Grocery Shopper', company: 'Instacart-style', desc: 'Shop for and deliver groceries to local residents. Flexible hours.', fee: '5', salary: 'CAD 18/hr', location: 'Montreal, QC' },
    { country: 'canada', type: 'informal', title: 'Pet Sitter', company: 'Vacationing Family', desc: 'Feed and check on two cats for one week while the owners are away.', fee: '5', salary: 'CAD 200 fixed', location: 'Calgary, AB' },
    { country: 'canada', type: 'informal', title: 'Painter (One-off)', company: 'Homeowner', desc: 'Paint two bedrooms in a house. Paint and supplies provided.', fee: '7', salary: 'CAD 30/hr', location: 'Ottawa, ON' },

    // Luxembourg Informal
    { country: 'luxembourg', type: 'informal', title: 'Dog Walker', company: 'Local Pet Owners', desc: 'Walk dogs in Luxembourg City parks. Flexible hours, ideal for students. Must be reliable and love animals.', fee: '5', salary: '€15/hr', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Babysitter (Evenings)', company: 'Local Family', desc: 'Occasional evening babysitting for two children (ages 4 & 7). English or French speaking. References required.', fee: '5', salary: '€14/hr', location: 'Esch-sur-Alzette' },
    { country: 'luxembourg', type: 'informal', title: 'Delivery Rider (Bike)', company: 'Local Restaurant', desc: 'Deliver food orders around central Luxembourg by bike. Evening shifts, flexible days. Own bike required.', fee: '6', salary: '€13/hr + tips', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'IT Support (Part-time)', company: 'Small Law Firm', desc: 'Help staff with basic computer issues, printer setups, and email configuration. 2 days a week.', fee: '7', salary: '€18/hr', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Website Tester (UX)', company: 'Design Agency', desc: 'Spend 2 hours testing a new mobile app and record your feedback via video. Must have an iPhone.', fee: '5', salary: '€50 fixed', location: 'Remote' },
    { country: 'luxembourg', type: 'informal', title: 'Event Photographer', company: 'Private Event', desc: 'Take photos at a corporate networking event in Luxembourg City for 4 hours. Own camera required.', fee: '10', salary: '€300 fixed', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Furniture Assembler', company: 'Local Resident', desc: 'Assemble IKEA furniture in a new apartment. Tools provided. Estimated 3 hours of work.', fee: '6', salary: '€25/hr', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'House Cleaner', company: 'Private Household', desc: 'Clean a 2-bedroom apartment once a week. Flexible schedule.', fee: '5', salary: '€20/hr', location: 'Esch-sur-Alzette' },
    { country: 'luxembourg', type: 'informal', title: 'Language Tutor (English)', company: 'Student', desc: 'Tutor a high school student in English once a week. Native speaker preferred.', fee: '6', salary: '€25/hr', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Bartender (Weekends)', company: 'Irish Pub', desc: 'Serve drinks and manage the bar on Friday and Saturday nights. Experience required.', fee: '7', salary: '€18/hr + tips', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Garden Maintenance', company: 'Homeowner', desc: 'Trim hedges and mow the lawn at a private residence. Equipment provided.', fee: '6', salary: '€22/hr', location: 'Esch-sur-Alzette' },
    { country: 'luxembourg', type: 'informal', title: 'Flyer Distributor', company: 'Marketing Co.', desc: 'Distribute promotional flyers in the city center for a weekend campaign.', fee: '5', salary: '€15/hr', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Pet Sitter', company: 'Vacationing Family', desc: 'Feed and check on a dog for 5 days while the owners are away.', fee: '5', salary: '€150 fixed', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Data Entry (Remote)', company: 'Small Business', desc: 'Input customer details into a CRM. 10 hours a week. Basic typing skills required.', fee: '6', salary: '€16/hr', location: 'Remote' },
    { country: 'luxembourg', type: 'informal', title: 'Moving Helper', company: 'Local Resident', desc: 'Help carry boxes and furniture down 3 flights of stairs. 4 hours of work.', fee: '6', salary: '€25/hr', location: 'Luxembourg City' },
    { country: 'luxembourg', type: 'informal', title: 'Cafe Barista', company: 'Coffee Shop', desc: 'Make coffee and serve pastries on weekend mornings.', fee: '6', salary: '€17/hr', location: 'Luxembourg City' }
  ];

  // Load Admin Jobs (if any) + Default Jobs
  function loadJobs() {
    const adminJobs = JSON.parse(localStorage.getItem('mapleLuxJobs')) || [];
    const allJobs = [...defaultJobs, ...adminJobs]; 

    const formalGrid = document.getElementById('formalGrid');
    const informalGrid = document.getElementById('informalGrid');

    allJobs.forEach(job => {
      const isCanada = job.country === 'canada';
      const currency = isCanada ? 'CAD' : '€';
      const flagText = isCanada ? 'Canada' : 'Luxembourg';
      const flagClass = job.type === 'informal' ? 'informal-flag' : '';
      
      const flagImg = isCanada 
        ? '<img src="https://flagcdn.com/w20/ca.png" alt="Canada" style="width: 16px; border-radius: 2px;">' 
        : '<img src="https://flagcdn.com/w20/lu.png" alt="Luxembourg" style="width: 16px; border-radius: 2px;">';

      const newCard = document.createElement('div');
      newCard.className = 'job-card';
      newCard.setAttribute('data-country', job.country);
      newCard.setAttribute('data-type', job.type);
      newCard.setAttribute('data-job', job.title);
      newCard.setAttribute('data-fee', job.fee);

      newCard.innerHTML = `
        <div class="job-flag ${flagClass}">${flagImg} ${flagText} ${job.type === 'informal' ? '· Informal' : ''}</div>
        <div class="job-title">${job.title}</div>
        <div class="job-company"><i class="fas fa-building"></i> ${job.company}</div>
        <div class="job-desc">${job.desc}</div>
        <div class="fee-badge"><i class="fas fa-receipt"></i> Application fee: ${currency} ${job.fee}</div>
        <div class="job-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${job.location || flagText}</span>
          <span><i class="fas fa-clock"></i> ${job.type === 'formal' ? 'Full-time' : 'Part-time'}</span>
          <span><i class="fas fa-dollar-sign"></i> ${job.salary}</span>
        </div>
        <button class="btn-apply">Apply now <i class="fas fa-arrow-right"></i></button>
      `;

      if (job.type === 'formal') {
        formalGrid.appendChild(newCard);
      } else {
        informalGrid.appendChild(newCard);
      }
    });
  }
  
  loadJobs();

  // ---------- Filtering & Dynamic Counters ----------
  const searchInput = document.getElementById('searchInput');
  const countrySelect = document.getElementById('countrySelect');
  const typeSelect = document.getElementById('typeSelect');
  const filterBtn = document.getElementById('filterBtn');
  const noResults = document.getElementById('noResults');
  const formalSection = document.getElementById('formal');
  const informalSection = document.getElementById('informal');
  const formalCount = document.getElementById('formalCount');
  const informalCount = document.getElementById('informalCount');

  function filterJobs() {
    const jobCards = Array.from(document.querySelectorAll('.job-card'));
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCountry = countrySelect.value;
    const selectedType = typeSelect.value;
    let visibleCount = 0;
    let formalVisible = 0;
    let informalVisible = 0;

    jobCards.forEach(card => {
      const title = card.querySelector('.job-title')?.innerText.toLowerCase() || '';
      const company = card.querySelector('.job-company')?.innerText.toLowerCase() || '';
      const desc = card.querySelector('.job-desc')?.innerText.toLowerCase() || '';
      const combinedText = title + ' ' + company + ' ' + desc;
      const cardCountry = card.getAttribute('data-country');
      const cardType = card.getAttribute('data-type');

      const countryMatch = selectedCountry === 'all' || cardCountry === selectedCountry;
      const typeMatch = selectedType === 'all' || cardType === selectedType;
      const textMatch = searchTerm === '' || combinedText.includes(searchTerm);

      if (countryMatch && typeMatch && textMatch) {
        card.style.display = 'flex';
        visibleCount++;
        if (cardType === 'formal') formalVisible++;
        else informalVisible++;
      } else {
        card.style.display = 'none';
      }
    });

    formalCount.textContent = formalVisible + (formalVisible === 1 ? ' role' : ' roles');
    informalCount.textContent = informalVisible + (informalVisible === 1 ? ' gig' : ' gigs');

    formalSection.style.display = formalVisible === 0 ? 'none' : 'block';
    informalSection.style.display = informalVisible === 0 ? 'none' : 'block';
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  filterBtn.addEventListener('click', filterJobs);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); filterJobs(); }
  });
  countrySelect.addEventListener('change', filterJobs);
  typeSelect.addEventListener('change', filterJobs);
  filterJobs(); 

  // ---------- REDIRECT TO APPLY PAGE ----------
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-apply')) {
      const btn = e.target.closest('.btn-apply');
      const card = btn.closest('.job-card');
      
      const title = card.getAttribute('data-job');
      const country = card.getAttribute('data-country');
      const fee = card.getAttribute('data-fee');
      
      const companyEl = card.querySelector('.job-company');
      let company = 'Company';
      if (companyEl) {
         company = companyEl.innerText.replace(/[^\w\s\.\-]/g, '').trim();
      }
      
      window.location.href = `apply.html?title=${encodeURIComponent(title)}&country=${country}&fee=${fee}&company=${encodeURIComponent(company)}`;
    }
  });
})();