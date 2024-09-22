const fs = require('fs');
const https = require('https');

const username = 'Fanu2'; // Replace with your GitHub username

function fetchRepositories() {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${username}/repos`,
        method: 'GET',
        headers: {
            'User-Agent': 'node.js'
        }
    };

    https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const repos = JSON.parse(data);
            generateIndex(repos);
        });
    }).on('error', (err) => {
        console.error('Error fetching repositories:', err);
    });
}

function generateIndex(repos) {
    let indexContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My GitHub Pages Index</title>
    </head>
    <body>
        <h1>My GitHub Pages</h1>
        <ul>
    `;

    repos.forEach(repo => {
        if (repo.homepage) {
            indexContent += `
                <li>
                    <a href="${repo.homepage}" target="_blank">${repo.name}</a> - ${repo.description || 'No description available'}
                </li>
            `;
        }
    });

    indexContent += `
        </ul>
    </body>
    </html>
    `;

    fs.writeFileSync('index.html', indexContent);
    console.log('Index generated successfully!');
}

// Run the function to fetch repositories and generate the index
fetchRepositories();
