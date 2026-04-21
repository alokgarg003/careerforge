import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seedProfile() {
  await db.profile.upsert({
    where: { email: 'alokgarg003@gmail.com' },
    update: {},
    create: {
      name: 'Alok Garg',
      email: 'alokgarg003@gmail.com',
      currentRole: 'Application Support Engineer',
      currentCompany: 'Capgemini',
      location: 'Noida, India',
      experienceYears: 1.5,
      phone: '',
      linkedinUrl: 'https://linkedin.com/in/alokgarg003',
      githubUrl: 'https://github.com/alokgarg003',
      summary: 'Application Support Engineer at Capgemini with expertise in GoAnywhere MFT, production support, incident management, and DevOps automation. Resolved 150+ ServiceNow tickets weekly and built AI-powered analytics tools.',
      primarySkills: 'linux,shell,bash,python,jenkins,bitbucket,azure,aws,terraform,servicenow,itil,goanywhere,mft,sftp,ftps,ftp,as2,monitoring,alerting,log_analysis,ci_cd,automation,cloudops',
      secondarySkills: 'java,spring boot,rest api,microservices,docker,kubernetes,observability,grafana,prometheus',
      excludeSignals: 'frontend,react,vue,angular,ux,ui,dsa,competitive programming',
      targetRoles: 'Application Support Engineer,Production Support Engineer,L2 Application Support,Platform Support Engineer,MFT Support Engineer,GoAnywhere MFT Support,Cloud Support Engineer,DevOps Support Engineer,Infrastructure Support,Cloud Operations,Operations Support Engineer',
      preferredLocations: 'Noida,Delhi NCR,Jaipur,Remote,Bangalore',
      salaryMin: 18,
      salaryMax: 45,
      salaryCurrency: 'LPA',
      education: 'PG Diploma (DAC) CDAC Bangalore 2024, B.Tech CSE Poornima Institute Jaipur 2019-2023',
      certifications: 'Azure AI Engineer Associate (AI102),Azure AI Fundamentals,AWS Generative AI,React-Redux',
      achievements: 'Resolved 150+ ServiceNow tickets weekly,Reduced false alerts by 50%,Built Snow Incident AI analytics platform,Created GoAnywhere MFT monitoring dashboard,Implemented recurring error catalogue system',
    },
  });
}

async function seedCompanies() {
  const companies = [
    // Tier 1 - Mega Enterprise
    { name: 'Microsoft', industry: 'Technology', sector: 'Enterprise Tech', tier: 1, hqLocation: 'Redmond, USA', ncrOffice: 'Noida, Gurgaon, Hyderabad', employeeCount: '220,000+', careerPageUrl: 'https://careers.microsoft.com', linkedinUrl: 'https://linkedin.com/company/microsoft', salaryRange: '₹25L-₹45L', priority: 1, searchKeywords: 'azure support,cloud support,application support', searchLocation: 'Noida,Hyderabad,Remote' },
    { name: 'Amazon', industry: 'E-Commerce/Cloud', sector: 'Tech Giant', tier: 1, hqLocation: 'Seattle, USA', ncrOffice: 'Hyderabad, Bangalore', employeeCount: '1,500,000+', careerPageUrl: 'https://amazon.jobs', linkedinUrl: 'https://linkedin.com/company/amazon', salaryRange: '₹22L-₹40L', priority: 1 },
    { name: 'Google', industry: 'Technology', sector: 'Enterprise Tech', tier: 1, hqLocation: 'Mountain View, USA', ncrOffice: 'Gurgaon, Bangalore', employeeCount: '180,000+', careerPageUrl: 'https://careers.google.com', linkedinUrl: 'https://linkedin.com/company/google', salaryRange: '₹25L-₹50L', priority: 1 },
    { name: 'Goldman Sachs', industry: 'Financial Services', sector: 'Investment Banking', tier: 1, hqLocation: 'New York, USA', ncrOffice: 'Bangalore', employeeCount: '45,000+', careerPageUrl: 'https://goldmansachs.com/careers', linkedinUrl: 'https://linkedin.com/company/goldman-sachs', salaryRange: '₹20L-₹40L', priority: 1 },
    { name: 'JPMorgan Chase', industry: 'Financial Services', sector: 'Banking', tier: 1, hqLocation: 'New York, USA', ncrOffice: 'Mumbai, Bangalore', employeeCount: '295,000+', careerPageUrl: 'https://jpmorganchase.com/careers', linkedinUrl: 'https://linkedin.com/company/jpmorgan-chase', salaryRange: '₹18L-₹38L', priority: 1 },
    { name: 'Walmart', industry: 'Retail/Logistics', sector: 'Retail Tech', tier: 1, hqLocation: 'Bentonville, USA', ncrOffice: 'Bangalore', employeeCount: '2,100,000+', careerPageUrl: 'https://careers.walmart.com', linkedinUrl: 'https://linkedin.com/company/walmart', salaryRange: '₹18L-₹35L', priority: 1 },
    { name: 'Deloitte', industry: 'Consulting', sector: 'IT Consulting', tier: 1, hqLocation: 'New York, USA', ncrOffice: 'Gurgaon, Noida, Hyderabad', employeeCount: '450,000+', careerPageUrl: 'https://www2.deloitte.com/careers', linkedinUrl: 'https://linkedin.com/company/deloitte', salaryRange: '₹15L-₹30L', priority: 1 },
    { name: 'Barclays', industry: 'Financial Services', sector: 'Banking', tier: 1, hqLocation: 'London, UK', ncrOffice: 'Pune, Mumbai', employeeCount: '95,000+', careerPageUrl: 'https://barclays.jobs', linkedinUrl: 'https://linkedin.com/company/barclays', salaryRange: '₹16L-₹32L', priority: 1 },

    // Tier 2 - Large Enterprise
    { name: 'HSBC', industry: 'Financial Services', sector: 'Banking', tier: 2, hqLocation: 'London, UK', ncrOffice: 'Pune, Mumbai, Gurgaon', employeeCount: '220,000+', careerPageUrl: 'https://careers.hsbc.com', linkedinUrl: 'https://linkedin.com/company/hsbc', salaryRange: '₹14L-₹28L', priority: 2 },
    { name: 'LSEG', industry: 'Financial Services', sector: 'Financial Data', tier: 2, hqLocation: 'London, UK', ncrOffice: 'Noida, Pune', employeeCount: '25,000+', careerPageUrl: 'https://careers.lseg.com', linkedinUrl: 'https://linkedin.com/company/london-stock-exchange-group', salaryRange: '₹15L-₹30L', priority: 2, searchKeywords: 'goanywhere,MFT,file transfer,support engineer', searchLocation: 'Noida,Pune' },
    { name: 'Fidelity Investments', industry: 'Financial Services', sector: 'Asset Management', tier: 2, hqLocation: 'Boston, USA', ncrOffice: 'Noida, Bangalore', employeeCount: '74,000+', careerPageUrl: 'https://careers.fidelity.com', linkedinUrl: 'https://linkedin.com/company/fidelity-investments', salaryRange: '₹14L-₹28L', priority: 2 },
    { name: 'Humana', industry: 'Healthcare', sector: 'Health Insurance', tier: 2, hqLocation: 'Louisville, USA', ncrOffice: 'Noida', employeeCount: '95,000+', careerPageUrl: 'https://humana.com/careers', linkedinUrl: 'https://linkedin.com/company/humana', salaryRange: '₹14L-₹26L', priority: 2, searchKeywords: 'MFT,sftp,systems engineer,application support', searchLocation: 'Noida,Remote' },
    { name: 'Pfizer', industry: 'Healthcare', sector: 'Pharmaceutical', tier: 2, hqLocation: 'New York, USA', ncrOffice: 'Pune, Mumbai', employeeCount: '90,000+', careerPageUrl: 'https://careers.pfizer.com', linkedinUrl: 'https://linkedin.com/company/pfizer', salaryRange: '₹14L-₹28L', priority: 2 },
    { name: 'UnitedHealth Group', industry: 'Healthcare', sector: 'Health Insurance', tier: 2, hqLocation: 'Minnetonka, USA', ncrOffice: 'Noida, Gurgaon', employeeCount: '400,000+', careerPageUrl: 'https://careers.uhg.com', linkedinUrl: 'https://linkedin.com/company/unitedhealth-group', salaryRange: '₹14L-₹28L', priority: 2 },
    { name: 'CVS Health', industry: 'Healthcare', sector: 'Healthcare Services', tier: 2, hqLocation: 'Woonsocket, USA', ncrOffice: 'Bangalore', employeeCount: '300,000+', careerPageUrl: 'https://jobs.cvshealth.com', linkedinUrl: 'https://linkedin.com/company/cvs-health', salaryRange: '₹14L-₹26L', priority: 2 },
    { name: 'MetLife', industry: 'Financial Services', sector: 'Insurance', tier: 2, hqLocation: 'New York, USA', ncrOffice: 'Noida, Pune', employeeCount: '45,000+', careerPageUrl: 'https://metlife.com/careers', linkedinUrl: 'https://linkedin.com/company/metlife', salaryRange: '₹13L-₹25L', priority: 2 },
    { name: 'FedEx', industry: 'Logistics', sector: 'Shipping & MFT', tier: 2, hqLocation: 'Memphis, USA', ncrOffice: 'Noida, Mumbai', employeeCount: '530,000+', careerPageUrl: 'https://careers.fedex.com', linkedinUrl: 'https://linkedin.com/company/fedex', salaryRange: '₹14L-₹26L', priority: 2, notes: 'Strong MFT relevance - file transfer for logistics', searchKeywords: 'MFT,file transfer,sftp,EDI,integration support', searchLocation: 'Noida,Mumbai,Remote' },
    { name: 'DHL', industry: 'Logistics', sector: 'Shipping', tier: 2, hqLocation: 'Bonn, Germany', ncrOffice: 'Noida, Gurgaon', employeeCount: '580,000+', careerPageUrl: 'https://careers.dhl.com', linkedinUrl: 'https://linkedin.com/company/dhl', salaryRange: '₹13L-₹25L', priority: 2, notes: 'MFT relevance for international file transfer', searchKeywords: 'MFT,file transfer,sftp,integration,application support', searchLocation: 'Noida,Gurgaon' },
    { name: 'Maersk', industry: 'Logistics', sector: 'Shipping & Supply Chain', tier: 2, hqLocation: 'Copenhagen, Denmark', ncrOffice: 'Noida, Mumbai', employeeCount: '110,000+', careerPageUrl: 'https://maersk.com/careers', linkedinUrl: 'https://linkedin.com/company/maersk', salaryRange: '₹14L-₹26L', priority: 2, notes: 'Strong MFT relevance for supply chain', searchKeywords: 'MFT,file transfer,EDI,supply chain integration', searchLocation: 'Noida,Mumbai,Pune' },
    { name: 'Nike', industry: 'Retail', sector: 'Apparel Tech', tier: 2, hqLocation: 'Beaverton, USA', ncrOffice: 'Bangalore', employeeCount: '79,000+', careerPageUrl: 'https://jobs.nike.com', linkedinUrl: 'https://linkedin.com/company/nike', salaryRange: '₹15L-₹28L', priority: 2 },
    { name: 'CrowdStrike', industry: 'Cybersecurity', sector: 'Security Tech', tier: 2, hqLocation: 'Austin, USA', ncrOffice: 'Remote India', employeeCount: '8,000+', careerPageUrl: 'https://crowdstrike.com/careers', linkedinUrl: 'https://linkedin.com/company/crowdstrike', salaryRange: '₹20L-₹40L', priority: 2 },
    { name: 'GitLab', industry: 'Technology', sector: 'DevOps Tools', tier: 2, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote', employeeCount: '2,500+', careerPageUrl: 'https://about.gitlab.com/jobs', linkedinUrl: 'https://linkedin.com/company/gitlab', salaryRange: '₹18L-₹38L', priority: 2, notes: 'Remote-first, strong DevOps culture' },
    { name: 'Snowflake', industry: 'Technology', sector: 'Cloud Data', tier: 2, hqLocation: 'Bozeman, USA', ncrOffice: 'Bangalore, Remote', employeeCount: '7,000+', careerPageUrl: 'https://careers.snowflake.com', linkedinUrl: 'https://linkedin.com/company/snowflake-computing', salaryRange: '₹20L-₹40L', priority: 2 },
    { name: 'Stripe', industry: 'Fintech', sector: 'Payments', tier: 2, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote, Singapore', employeeCount: '8,000+', careerPageUrl: 'https://stripe.com/jobs', linkedinUrl: 'https://linkedin.com/company/stripe', salaryRange: '₹22L-₹45L', priority: 2 },
    { name: 'HashiCorp', industry: 'Technology', sector: 'DevOps/IaC', tier: 2, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote', employeeCount: '2,000+', careerPageUrl: 'https://hashicorp.com/careers', linkedinUrl: 'https://linkedin.com/company/hashicorp', salaryRange: '₹20L-₹38L', priority: 2, notes: 'Terraform creators - perfect for DevOps goals' },

    // Tier 3 - Mid Enterprise (Good for MFT/Support roles)
    { name: 'Capgemini', industry: 'IT Consulting', sector: 'Managed Services', tier: 3, hqLocation: 'Paris, France', ncrOffice: 'Noida, Gurgaon, Mumbai, Bangalore, Hyderabad, Jaipur', employeeCount: '350,000+', careerPageUrl: 'https://capgemini.com/careers', linkedinUrl: 'https://linkedin.com/company/capgemini', salaryRange: '₹8L-₹22L', priority: 3, notes: 'Current employer - Royal Mail client', searchKeywords: 'application support,production support,MFT,GoAnywhere', searchLocation: 'Noida,Gurgaon' },
    { name: 'Accenture', industry: 'IT Consulting', sector: 'Managed Services', tier: 3, hqLocation: 'Dublin, Ireland', ncrOffice: 'Noida, Gurgaon, Mumbai, Bangalore, Hyderabad, Jaipur', employeeCount: '730,000+', careerPageUrl: 'https://accenture.com/careers', linkedinUrl: 'https://linkedin.com/company/accenture', salaryRange: '₹8L-₹22L', priority: 3 },
    { name: 'TCS', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Mumbai, India', ncrOffice: 'Noida, Gurgaon, Mumbai, Bangalore, Hyderabad, Jaipur', employeeCount: '600,000+', careerPageUrl: 'https://tcs.com/careers', linkedinUrl: 'https://linkedin.com/company/tata-consultancy-services', salaryRange: '₹7L-₹18L', priority: 3 },
    { name: 'Infosys', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Bangalore, India', ncrOffice: 'Noida, Gurgaon, Pune, Bangalore, Jaipur', employeeCount: '340,000+', careerPageUrl: 'https://infosys.com/careers', linkedinUrl: 'https://linkedin.com/company/infosys', salaryRange: '₹7L-₹18L', priority: 3 },
    { name: 'Cognizant', industry: 'IT Consulting', sector: 'Managed Services', tier: 3, hqLocation: 'Teaneck, USA', ncrOffice: 'Noida, Gurgaon, Pune, Bangalore, Chennai, Jaipur', employeeCount: '350,000+', careerPageUrl: 'https://careers.cognizant.com', linkedinUrl: 'https://linkedin.com/company/cognizant', salaryRange: '₹8L-₹20L', priority: 3 },
    { name: 'IBM', industry: 'Technology', sector: 'Enterprise Tech', tier: 3, hqLocation: 'Armonk, USA', ncrOffice: 'Noida, Gurgaon, Pune, Bangalore', employeeCount: '288,000+', careerPageUrl: 'https://ibm.com/careers', linkedinUrl: 'https://linkedin.com/company/ibm', salaryRange: '₹10L-₹25L', priority: 3 },
    { name: 'DXC Technology', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Tysons, USA', ncrOffice: 'Noida, Gurgaon, Pune, Bangalore, Chennai', employeeCount: '130,000+', careerPageUrl: 'https://dxc.com/careers', linkedinUrl: 'https://linkedin.com/company/dxctechnology', salaryRange: '₹8L-₹18L', priority: 3 },
    { name: 'HCL Technologies', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Noida, India', ncrOffice: 'Noida, Gurgaon, Bangalore, Chennai, Jaipur', employeeCount: '225,000+', careerPageUrl: 'https://hcltech.com/careers', linkedinUrl: 'https://linkedin.com/company/hcl-technologies', salaryRange: '₹7L-₹18L', priority: 3 },
    { name: 'Wipro', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Bangalore, India', ncrOffice: 'Noida, Gurgaon, Bangalore, Jaipur', employeeCount: '240,000+', careerPageUrl: 'https://careers.wipro.com', linkedinUrl: 'https://linkedin.com/company/wipro', salaryRange: '₹7L-₹16L', priority: 3 },
    { name: 'Tech Mahindra', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Pune, India', ncrOffice: 'Noida, Gurgaon, Pune, Hyderabad', employeeCount: '150,000+', careerPageUrl: 'https://careers.techmahindra.com', linkedinUrl: 'https://linkedin.com/company/tech-mahindra', salaryRange: '₹7L-₹16L', priority: 3 },
    { name: 'LTIMindtree', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Mumbai, India', ncrOffice: 'Noida, Gurgaon, Bangalore, Chennai, Jaipur', employeeCount: '80,000+', careerPageUrl: 'https://ltim.com/careers', linkedinUrl: 'https://linkedin.com/company/ltimindtree', salaryRange: '₹7L-₹18L', priority: 3 },
    { name: 'Oracle', industry: 'Technology', sector: 'Enterprise Software', tier: 3, hqLocation: 'Austin, USA', ncrOffice: 'Noida, Gurgaon, Bangalore, Hyderabad', employeeCount: '164,000+', careerPageUrl: 'https://oracle.com/careers', linkedinUrl: 'https://linkedin.com/company/oracle', salaryRange: '₹10L-₹25L', priority: 3 },
    { name: 'SAP', industry: 'Enterprise Software', sector: 'ERP/Cloud', tier: 3, hqLocation: 'Walldorf, Germany', ncrOffice: 'Gurgaon, Bangalore', employeeCount: '107,000+', careerPageUrl: 'https://sap.com/careers', linkedinUrl: 'https://linkedin.com/company/sap', salaryRange: '₹12L-₹26L', priority: 3 },
    { name: 'ServiceNow', industry: 'Technology', sector: 'ITSM/SaaS', tier: 3, hqLocation: 'Santa Clara, USA', ncrOffice: 'Hyderabad, Noida', employeeCount: '22,000+', careerPageUrl: 'https://servicenow.com/careers', linkedinUrl: 'https://linkedin.com/company/servicenow', salaryRange: '₹15L-₹30L', priority: 3, notes: 'Direct ServiceNow expertise alignment', searchKeywords: 'servicenow,ITSM,incident management,platform support', searchLocation: 'Hyderabad,Noida,Remote' },

    // Tier 4 - Growing Tech Companies
    { name: 'Nagarro', industry: 'IT Services', sector: 'Digital Engineering', tier: 4, hqLocation: 'Gurgaon, India', ncrOffice: 'Gurgaon, Noida, Jaipur', employeeCount: '15,000+', careerPageUrl: 'https://nagarro.com/careers', linkedinUrl: 'https://linkedin.com/company/nagarro', salaryRange: '₹10L-₹22L', priority: 3 },
    { name: 'Emplay', industry: 'Technology', sector: 'AI/SaaS', tier: 4, hqLocation: 'Bangalore, India', ncrOffice: 'Remote', employeeCount: '500+', careerPageUrl: 'https://emplay.com/careers', linkedinUrl: 'https://linkedin.com/company/emplay', salaryRange: '₹12L-₹24L', priority: 3 },
    { name: 'Snyk', industry: 'Cybersecurity', sector: 'DevSecOps', tier: 4, hqLocation: 'London, UK', ncrOffice: 'Remote', employeeCount: '2,000+', careerPageUrl: 'https://snyk.io/careers', linkedinUrl: 'https://linkedin.com/company/snyk', salaryRange: '₹18L-₹35L', priority: 2 },
    { name: 'Freshworks', industry: 'Technology', sector: 'SaaS/ITSM', tier: 4, hqLocation: 'San Mateo, USA', ncrOffice: 'Chennai, Bangalore', employeeCount: '7,000+', careerPageUrl: 'https://freshworks.com/company/careers', linkedinUrl: 'https://linkedin.com/company/freshworks', salaryRange: '₹12L-₹24L', priority: 3 },
    { name: 'Zscaler', industry: 'Cybersecurity', sector: 'Cloud Security', tier: 4, hqLocation: 'San Jose, USA', ncrOffice: 'Bangalore, Hyderabad', employeeCount: '7,000+', careerPageUrl: 'https://zscaler.com/careers', linkedinUrl: 'https://linkedin.com/company/zscaler', salaryRange: '₹16L-₹32L', priority: 2 },
    { name: 'Atlassian', industry: 'Technology', sector: 'DevOps/Collaboration', tier: 4, hqLocation: 'Sydney, Australia', ncrOffice: 'Bangalore', employeeCount: '11,000+', careerPageUrl: 'https://atlassian.com/company/careers', linkedinUrl: 'https://linkedin.com/company/atlassian', salaryRange: '₹18L-₹35L', priority: 2 },
    { name: 'Elastic', industry: 'Technology', sector: 'Search/Observability', tier: 4, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote, Singapore', employeeCount: '3,000+', careerPageUrl: 'https://elastic.co/careers', linkedinUrl: 'https://linkedin.com/company/elastic', salaryRange: '₹16L-₹30L', priority: 2, notes: 'ELK Stack alignment' },
    { name: 'Datadog', industry: 'Technology', sector: 'Monitoring/Observability', tier: 4, hqLocation: 'New York, USA', ncrOffice: 'Remote', employeeCount: '5,000+', careerPageUrl: 'https://careers.datadoghq.com', linkedinUrl: 'https://linkedin.com/company/datadog', salaryRange: '₹18L-₹35L', priority: 2, notes: 'Monitoring/observability alignment' },
    { name: 'PagerDuty', industry: 'Technology', sector: 'Incident Management', tier: 4, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote, Toronto', employeeCount: '1,500+', careerPageUrl: 'https://pagerduty.com/careers', linkedinUrl: 'https://linkedin.com/company/pagerduty', salaryRange: '₹16L-₹30L', priority: 2, notes: 'Incident management alignment' },
    { name: 'Splunk', industry: 'Technology', sector: 'Observability/Security', tier: 4, hqLocation: 'San Francisco, USA', ncrOffice: 'Bangalore', employeeCount: '8,000+', careerPageUrl: 'https://splunk.com/careers', linkedinUrl: 'https://linkedin.com/company/splunk', salaryRange: '₹16L-₹30L', priority: 2, notes: 'Log analysis alignment' },
    { name: 'Grafana Labs', industry: 'Technology', sector: 'Monitoring/Visualization', tier: 4, hqLocation: 'New York, USA', ncrOffice: 'Remote', employeeCount: '1,000+', careerPageUrl: 'https://grafana.com/about/careers', linkedinUrl: 'https://linkedin.com/company/grafana-labs', salaryRange: '₹18L-₹35L', priority: 2, notes: 'Grafana/Prometheus alignment' },
    { name: 'New Relic', industry: 'Technology', sector: 'Observability', tier: 4, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote, Pune', employeeCount: '3,000+', careerPageUrl: 'https://newrelic.com/about/careers', linkedinUrl: 'https://linkedin.com/company/new-relic', salaryRange: '₹16L-₹30L', priority: 2 },
    { name: 'HashiCorp', industry: 'Technology', sector: 'Infrastructure/IaC', tier: 4, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote', employeeCount: '2,000+', careerPageUrl: 'https://hashicorp.com/careers', linkedinUrl: 'https://linkedin.com/company/hashicorp', salaryRange: '₹18L-₹35L', priority: 2 },
    { name: 'MongoDB', industry: 'Technology', sector: 'Database', tier: 4, hqLocation: 'New York, USA', ncrOffice: 'Bangalore', employeeCount: '2,500+', careerPageUrl: 'https://mongodb.com/careers', linkedinUrl: 'https://linkedin.com/company/mongodb', salaryRange: '₹15L-₹30L', priority: 3 },

    // Tier 5 - Specialized Infrastructure / MFT Companies
    { name: 'OpenText', industry: 'Information Management', sector: 'MFT/Enterprise', tier: 5, hqLocation: 'Waterloo, Canada', ncrOffice: 'Noida, Bangalore', employeeCount: '25,000+', careerPageUrl: 'https://opentext.com/careers', linkedinUrl: 'https://linkedin.com/company/opentext', salaryRange: '₹12L-₹24L', priority: 2, notes: 'MFT leader (owns Managed File Transfer product)', searchKeywords: 'MFT,managed file transfer,support engineer,GoAnywhere', searchLocation: 'Noida,Bangalore' },
    { name: 'IBM Sterling', industry: 'Technology', sector: 'MFT/Supply Chain', tier: 5, hqLocation: 'Armonk, USA', ncrOffice: 'Noida, Bangalore, Pune', employeeCount: '164,000+', careerPageUrl: 'https://ibm.com/careers', linkedinUrl: 'https://linkedin.com/company/ibm', salaryRange: '₹12L-₹26L', priority: 2, notes: 'IBM Sterling MFT - top MFT product' },
    { name: 'Cleo', industry: 'Technology', sector: 'MFT/Integration', tier: 5, hqLocation: 'Rockville, USA', ncrOffice: 'Remote', employeeCount: '500+', careerPageUrl: 'https://cleo.com/careers', linkedinUrl: 'https://linkedin.com/company/cleo', salaryRange: '₹10L-₹20L', priority: 2, notes: 'MFT/EDI specialist' },
    { name: 'Thru Inc', industry: 'Technology', sector: 'Cloud MFT', tier: 5, hqLocation: 'New York, USA', ncrOffice: 'Remote', employeeCount: '50-200', careerPageUrl: 'https://thruinc.com', linkedinUrl: 'https://linkedin.com/company/thru-inc', salaryRange: '₹8L-₹18L', priority: 2, notes: 'Cloud MFT specialist' },
    { name: 'Axway', industry: 'Technology', sector: 'MFT/API', tier: 5, hqLocation: 'Phoenix, USA', ncrOffice: 'Remote', employeeCount: '1,500+', careerPageUrl: 'https://axway.com/careers', linkedinUrl: 'https://linkedin.com/company/axway', salaryRange: '₹10L-₹20L', priority: 2, notes: 'MFT and API management' },
    { name: 'Tibco', industry: 'Technology', sector: 'Integration/MFT', tier: 5, hqLocation: 'Palo Alto, USA', ncrOffice: 'Pune, Bangalore', employeeCount: '4,000+', careerPageUrl: 'https://tibco.com/careers', linkedinUrl: 'https://linkedin.com/company/tibco', salaryRange: '₹12L-₹24L', priority: 2, notes: 'Integration & MFT' },
    { name: 'GoAnywhere (Fortra)', industry: 'Technology', sector: 'MFT/Security', tier: 5, hqLocation: 'Plymouth, USA', ncrOffice: 'Remote', employeeCount: '500+', careerPageUrl: 'https://fortra.com/careers', linkedinUrl: 'https://linkedin.com/company/goanywhere', salaryRange: '₹10L-₹22L', priority: 1, notes: 'YOUR CORE EXPERTISE - GoAnywhere MFT', searchKeywords: 'GoAnywhere,MFT,sftp,ftps,file transfer,support', searchLocation: 'Remote' },

    // Tier 6 - Startups & Remote-First
    { name: 'Crossover', industry: 'Talent Platform', sector: 'Remote Jobs', tier: 6, hqLocation: 'Austin, USA', ncrOffice: 'Remote', employeeCount: '1,000+', careerPageUrl: 'https://crossover.com', linkedinUrl: 'https://linkedin.com/company/crossover', salaryRange: '₹20L-₹45L', priority: 2, notes: 'Full-time remote with USD salary', searchKeywords: 'devops support,application support,system administrator', searchLocation: 'Remote' },
    { name: 'BairesDev', industry: 'IT Services', sector: 'Remote Staffing', tier: 6, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote', employeeCount: '5,000+', careerPageUrl: 'https://bairesdev.com/careers', linkedinUrl: 'https://linkedin.com/company/bairesdev', salaryRange: '₹12L-₹25L', priority: 3 },
    { name: 'Arc.dev', industry: 'Talent Platform', sector: 'Remote Developer Jobs', tier: 6, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote', employeeCount: '200+', careerPageUrl: 'https://arc.dev', linkedinUrl: 'https://linkedin.com/company/arc', salaryRange: '₹15L-₹35L', priority: 3, notes: 'Remote developer jobs platform' },
    { name: 'Toptal', industry: 'Talent Platform', sector: 'Freelance/Contract', tier: 6, hqLocation: 'San Francisco, USA', ncrOffice: 'Remote', employeeCount: '1,000+', careerPageUrl: 'https://toptal.com/careers', linkedinUrl: 'https://linkedin.com/company/toptal', salaryRange: '₹20L-₹50L', priority: 3 },
    { name: 'Gun.io', industry: 'Talent Platform', sector: 'Remote Tech Jobs', tier: 6, hqLocation: 'Atlanta, USA', ncrOffice: 'Remote', employeeCount: '100+', careerPageUrl: 'https://gun.io', linkedinUrl: 'https://linkedin.com/company/gun', salaryRange: '₹15L-₹30L', priority: 3 },
    { name: 'Innova ESI', industry: 'IT Services', sector: 'Cloud/DevOps', tier: 6, hqLocation: 'India', ncrOffice: 'Noida', employeeCount: '200+', careerPageUrl: '', linkedinUrl: '', salaryRange: '₹8L-₹15L', priority: 4, notes: 'Contacted by recruiter Tripti Goyal - Cloud Admin role' },

    // Additional Indian IT & Support Focus
    { name: 'Genpact', industry: 'IT Services', sector: 'BPO/Tech', tier: 3, hqLocation: 'Gurgaon, India', ncrOffice: 'Gurgaon, Noida, Jaipur', employeeCount: '125,000+', careerPageUrl: 'https://genpact.com/careers', linkedinUrl: 'https://linkedin.com/company/genpact', salaryRange: '₹7L-₹18L', priority: 3 },
    { name: 'Concentrix', industry: 'IT Services', sector: 'BPO/Tech Support', tier: 3, hqLocation: 'Fremont, USA', ncrOffice: 'Gurgaon, Noida, Bangalore', employeeCount: '440,000+', careerPageUrl: 'https://careers.concentrix.com', linkedinUrl: 'https://linkedin.com/company/concentrix', salaryRange: '₹6L-₹14L', priority: 3 },
    { name: 'Teleperformance', industry: 'IT Services', sector: 'BPO/Tech Support', tier: 3, hqLocation: 'Paris, France', ncrOffice: 'Gurgaon, Noida, Jaipur', employeeCount: '500,000+', careerPageUrl: 'https://teleperformance.com/careers', linkedinUrl: 'https://linkedin.com/company/teleperformance', salaryRange: '₹6L-₹14L', priority: 3 },
    { name: 'Mphasis', industry: 'IT Services', sector: 'Managed Services', tier: 3, hqLocation: 'Bangalore, India', ncrOffice: 'Noida, Gurgaon, Mumbai, Bangalore, Jaipur', employeeCount: '35,000+', careerPageUrl: 'https://mphasis.com/careers', linkedinUrl: 'https://linkedin.com/company/mphasis', salaryRange: '₹7L-₹16L', priority: 3 },
    { name: 'Amdocs', industry: 'Technology', sector: 'Telecom/IT Services', tier: 3, hqLocation: 'Chesterfield, USA', ncrOffice: 'Pune, Gurgaon, Noida, Bangalore', employeeCount: '30,000+', careerPageUrl: 'https://amdocs.com/careers', linkedinUrl: 'https://linkedin.com/company/amdocs', salaryRange: '₹10L-₹22L', priority: 3 },
    { name: 'Mindtree (LTIM)', industry: 'IT Services', sector: 'Digital Transformation', tier: 3, hqLocation: 'Bangalore, India', ncrOffice: 'Noida, Gurgaon, Bangalore, Jaipur', employeeCount: '80,000+', careerPageUrl: 'https://ltimindtree.com/careers', linkedinUrl: 'https://linkedin.com/company/ltimindtree', salaryRange: '₹7L-₹18L', priority: 3 },
    { name: 'Zensar Technologies', industry: 'IT Services', sector: 'Digital Solutions', tier: 4, hqLocation: 'Pune, India', ncrOffice: 'Pune, Noida, Jaipur', employeeCount: '12,000+', careerPageUrl: 'https://zensar.com/careers', linkedinUrl: 'https://linkedin.com/company/zensar-technologies', salaryRange: '₹7L-₹16L', priority: 4 },
    { name: 'Cyient', industry: 'Engineering/IT', sector: 'Engineering Services', tier: 4, hqLocation: 'Hyderabad, India', ncrOffice: 'Hyderabad, Pune, Bangalore', employeeCount: '15,000+', careerPageUrl: 'https://cyient.com/careers', linkedinUrl: 'https://linkedin.com/company/cyient', salaryRange: '₹7L-₹16L', priority: 4 },
  ];

  for (const c of companies) {
    await db.company.upsert({
      where: { id: `${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-seed` },
      update: {},
      create: {
        id: `${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-seed`,
        ...c,
      },
    });
  }
}

async function seedActivityLog() {
  const activities = [
    { type: 'system', action: 'System Initialized', detail: 'CareerForge is ready to use. Your profile, companies, and skill taxonomy have been pre-configured.' },
  ];
  for (const a of activities) {
    await db.activityLog.create({ data: a });
  }
}

async function main() {
  console.log('Seeding profile...');
  await seedProfile();
  console.log('Seeding companies...');
  await seedCompanies();
  console.log('Seeding activity log...');
  await seedActivityLog();
  console.log('Done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
