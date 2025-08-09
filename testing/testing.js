const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DOGS_DIR = './test_dogs'; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function login(page, email, password) {
  await page.goto('http://localhost:4200/login');

  await page.waitForSelector('form.register-form');

  await page.type('input[formcontrolname="email"]', email);
  await page.type('input[formcontrolname="password"]', password);

  await Promise.all([
    page.click('form.register-form button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  console.log('✅ Logged in');
}

async function selectMatOptionByText(page, text) {
  await page.click('#looking-for-select'); 

  await page.waitForSelector('mat-option');

  const options = await page.$$('mat-option');

  for (const option of options) {
    const optionText = await page.evaluate(el => el.textContent.trim(), option);
    if (optionText === text) {
      await option.click();
      return;
    }
  }

  throw new Error(`Option with text "${text}" not found`);
}


async function uploadDogPost(page, type, description, images) {
  await page.waitForSelector('#new-post-btn');
  await page.click('#new-post-btn');

  await page.waitForSelector('#looking-for-select');

  await selectMatOptionByText(page, type === 'true' ? 'Trazi se' : 'Pronadjen'); 


  await page.type('#description-input', description);

  const input = await page.$('#image-upload-input');
  await input.uploadFile(...images);

  await page.click('#submit-post-btn');

  await sleep(3000); 
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const EMAIL = 'petar.petrovic@gmail.com';
  const PASSWORD = 'Mysecretpassword123*';

  await login(page, EMAIL, PASSWORD);

  await page.goto('http://localhost:4200/home');

  const folders = fs.readdirSync(DOGS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const folderName of folders) {
    const folderPath = path.join(DOGS_DIR, folderName);
    const lostPath = path.join(folderPath, 'lost');
    const foundPath = path.join(folderPath, 'found');
const hasLost = fs.existsSync(lostPath);
  const hasFound = fs.existsSync(foundPath);

  if (hasLost) {
    const lostImages = fs.readdirSync(lostPath)
      .map((file) => path.join(lostPath, file));
    if (lostImages.length > 0) {
      const description = hasFound
        ? folderName
        : `${folderName} - samo izgubljen`; 
      await uploadDogPost(page, 'true', description, lostImages);
    }
  }

  if (hasFound) {
    const foundImages = fs.readdirSync(foundPath)
      .map((file) => path.join(foundPath, file));
    if (foundImages.length > 0) {
      const description = hasLost
        ? folderName
        : `${folderName} - samo pronadjen`; 
      await uploadDogPost(page, 'false', description, foundImages);
    }
  }
  }

  console.log('✅ All done!');
  await browser.close();
})();
