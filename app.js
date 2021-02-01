const express = require('express');
const dotenv = require('dotenv');
const dateFormat = require('./utils/dateFormat');
const cors = require('cors');

const app = express();
dotenv.config();

app.use(cors());

app.use(express.json());

async function generatePdf(html) { 
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
    });

    const page = await browser.newPage();
    await page.goto(`data:text/html,${html}`, {
        waitUntil: 'networkidle0'
    });
    const options = {
        format: 'A4',
        margin: { top: "60px", bottom: "60px", left: "15px", right: "15px" },
        printBackground: true,
    }
    const pdf = await page.pdf(options);
    await browser.close();
    console.log('PDF is:', pdf);
    return pdf;
}

app.post('/cover-letter', async (req, res) => {
    console.log(req.body);
    const {position, company, fileTitle, coverLetter} = req.body;
    const date = dateFormat(new Date());

    // const coverLetter = `<html><head><meta content="text/html; charset=UTF-8" http-equiv="content-type"></head><body><div class="c0"><span class="c1">Ryan Talbert</span><br><span class="c1">710 La Marite Dr.</span><br><span class="c1">Manchester, MO 63021</span><br><span class="c1">m: 636-484-2273</span><br><span class="c1">talbertr@slu.edu</span><br><span class="c1">${date}</span><br><p class="c3 c6"><span class="c1"></span></p><p class="c3 c6"><span class="c1"></span></p><p class="c3 c6"><span class="c1"></span></p><p class="c3"><span class="c1">Dear Hiring Manager,</span></p><p class="c4 c6"><span class="c1"></span></p><p class="c4"><span class="c1">Please accept this letter and attached CV as an application for the position of 
    // ${position} with ${company}. My professional expertise lies in both long-range application design and business management, and I am excited to bring an experienced perspective to the ${company} community. </span></p><p class="c4 c6"><span class="c1"></span></p><p class="c4"><span class="c5">The position of ${position} caught my attention as it incorporates my professional interests and would allow me to exercise a range of my skills. In charting my rise from an early administrative assistant to my current role as software engineer with a leading virtual experience company, my experience is substantive and multifaceted. In my current role with Geniecast, I have ensured the continual increase of operational efficiency and opportunity growth while retaining an unwavering attention to the company&rsquo;s core values, mission, and objectives. I joined Geniecast at a pivotal time and was entrusted with</span><span class="c7">&nbsp;</span><span class="c1">spearheading all aspects of designing, deploying, and supporting automated systems in order to maximize employee time and minimize company costs. I mine, scrutinize, and translate complex data from SaaS platforms and migrate it to its appropriate endpoint through RESTful &amp; GraphQL API in Node.js. I have also been entrusted with contributing significantly to the structure and design of the company website utilizing WordPress, Javascript, and PHP. I am also tasked with certifying that our operations are compliant, reliable, and supportive of senior management confidence. Thus, with a career history steeped in the marriage of complex coding and website design, I am immersed in the trends shaping the industry&mdash;a hallmark feature of a ${position}. As such, I am in an influential, respected leadership position that leverages systems analysis for business strategy, while maintaining a strong strategic focus on the clients and business objectives.</span></p><p class="c4 c6"><span class="c1"></span></p><p class="c4"><span class="c1">Prior to joining Geniecast, I established a successful record of advancement with my personal start-up company, Herdmap. As an adept Founder, I partnered with specialized coders and developers to create and launch a fully functional app with more than 1,200 downloads. In addition to my employment experience, I have successfully completed a project for a Facebook Marketplace Bot. In this project, I successfully created and linked the front-end React application with the backend Node.js RESTful API to allow data flow through user interface interaction.</span></p><p class="c4 c6"><span class="c1"></span></p><p class="c4"><span class="c5">Thanks to these and other experiences, I possess an essential skill set well suited to address the duties and responsibilities of the ${position}. In me, ${company}</span><span class="c2">&nbsp;</span><span class="c1">will gain the value of an experienced perspective, clear project management vision, keen business insights, and tireless dedication to short- and long-range success. I am certain that the foundation exists for a fruitful partnership.</span></p><p class="c4 c6"><span class="c1"></span></p><p class="c4"><span class="c1">Thank you for your consideration, and I look forward to the opportunity to speak with you about my candidacy in greater detail.</span></p><p class="c4 c6"><span class="c1"></span></p><p class="c4"><span class="c1">Sincerely,</span></p><p class="c4 c6"><span class="c1"></span></p><p class="c3"><span class="c5">Ryan Talbert</span></p></div></body></html>`;
    const dateReplace = coverLetter.replace(/DATE/g, date);
    const positionReplace = dateReplace.replace(/POSITION/g, position);
    const companyReplace = positionReplace.replace(/COMPANY/g, company);
    
    const pdfBuffer = await generatePdf(companyReplace);

    const fileName = `attachment; filename=\"${fileTitle}.pdf\"`;
    res.setHeader("Content-Type", "application/pdf");
     
    //res.setHeader("Content-Disposition","inline; filename=\"test_resume_company_name.pdf\"");
    res.setHeader('Content-Disposition', fileName);
    res.status(200).send(pdfBuffer);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})

// `attachment; filename=\"test.pdf\"`


