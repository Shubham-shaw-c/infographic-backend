const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/screenshot', async (req, res) => {
    // Launch Puppeteer in headless mode
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navigate to the URL you want to capture
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' }); // Ensure this URL is correct

    // Save the screenshot as a JPEG file
    const screenshotPath = path.join(__dirname, 'screenshot.jpg');
    await page.screenshot({ path: screenshotPath, type: 'jpeg', quality: 80 }); // Set quality between 0 and 100
    await browser.close();

    // Check if the file was created successfully
    if (fs.existsSync(screenshotPath)) {
        console.log(`Screenshot saved to ${screenshotPath}`);
        res.download(screenshotPath, 'screenshot.jpg', (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
            }
            // Optionally, delete the file after sending it
            fs.unlinkSync(screenshotPath);
        });
    } else {
        res.status(500).send('Failed to generate screenshot');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`|| 'Server is running on http://0.0.0.0:${PORT}');
});