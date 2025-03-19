const express = require('express');
const puppeteer =('puppeteer'); // Corrected the require statement
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/screenshot', async (req, res) => {
    const url = 'https://example.com'; // Hardcoded URL

    try {
        const browser = await puppeteer.launch({
            headless: true,
            // Remove executablePath to use the default Chromium
            // executablePath: '/path/to/your/chromium'
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        const screenshotPath = path.join(__dirname, 'screenshot.jpg');
        await page.screenshot({ path: screenshotPath, type: 'jpeg', quality: 80 });
        await browser.close();

        if (fs.existsSync(screenshotPath)) {
            res.download(screenshotPath, 'screenshot.jpg', (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                }
                fs.unlinkSync(screenshotPath); // Delete the file after sending
            });
        } else {
            res.status(500).send('Failed to generate screenshot');
        }
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).send('Failed to take screenshot');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});