const fs = require('fs');
const path = require('path');

// Directory containing the logos
const logosDir = path.join(__dirname, 'docs/CompanyLogos');

// Function to generate logos.json
function generateLogosJson() {
    fs.readdir(logosDir, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory:', err);
        }

        // Filter image files
        const logos = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));

        // Save the list of logos to a JSON file
        const jsonPath = path.join(__dirname, 'docs/logos.json');
        fs.writeFile(jsonPath, JSON.stringify(logos, null, 2), (err) => {
            if (err) {
                return console.error('Error writing logos.json:', err);
            }
            console.log(`Logos saved to ${jsonPath}:`, logos);
        });
    });
}

// Run the function
generateLogosJson();














