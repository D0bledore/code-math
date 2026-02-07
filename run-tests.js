const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Capture console output
  page.on('console', msg => console.log(msg.text()));

  const filePath = 'file://' + path.resolve(__dirname, 'tests.html');
  await page.goto(filePath, { waitUntil: 'load' });

  // Extract results from the DOM
  const results = await page.evaluate(() => {
    const summary = document.getElementById('summary').textContent;
    const suites = document.querySelectorAll('.suite');
    const output = [];

    suites.forEach(s => {
      const title = s.querySelector('h2').textContent;
      output.push('\n' + title);
      output.push('-'.repeat(title.length));
      s.querySelectorAll('.test').forEach(t => {
        output.push(t.textContent);
      });
    });

    return { summary, details: output.join('\n') };
  });

  console.log('=== TEST RESULTS ===');
  console.log(results.summary);
  console.log(results.details);

  // Exit with code 1 if any failures
  const hasFail = results.summary.includes('failed');
  await browser.close();
  process.exit(hasFail ? 1 : 0);
})();
