const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
// const hostname = '127.0.0.1'; // Your server ip address
const hostname = '172.31.33.26'; // Your server ip address
const port = 3000;

const version = '1.0.0';

// Path to the existing CSV file
const out_file = path.join(__dirname, 'mm_genome_uis/step1/data/inputs.csv');
const out_image_dir = path.join(__dirname, 'mm_genome_uis/step1/data/images');

// Middleware to parse JSON body from POST requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'mm_genome_uis/step1')));

app.get('/', (req, res) => {
    // Serve index.html when the root URL is accessed
    res.sendFile(path.join(__dirname, 'mm_genome_uis/step1', 'index.html'));

    //console.log(`[Version ${version}]: New request => http://${hostname}:${port}` + req.url);
})

// Handle POST request to '/submit'
app.post('/submit', (req, res) => {
    // Get the data from the POST request body
    const {
        anno_id, culture, region, example_id, category, seed_concept: concept,
        q1_input, q1_exp, q2_input, q2_exp, q3_input, q3_query, q3_rank, q4_input
    } = req.body;

    // Open the CSV file and write the data as a new row
    const csvData = [anno_id, culture, region, example_id, category, concept, q1_input, q1_exp, q2_input, q2_exp, q3_input, q3_query, q3_rank, q4_input];

    // Writing row to CSV file
    fs.appendFile(out_file, csvData.join('|') + '\n', (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
            return res.status(500).send('Failed to save data');
        }
        // console.log('Data written to CSV:', csvData);
        // res.send('Data successfully saved to CSV');
    });
});

// Route to handle image downloading and saving
app.post('/download-image', async (req, res) => {
    const { url, path_name } = req.body;

    if (!url || !path_name) {
        return res.status(400).send(
            'Error: Both "url" and "path_name" fields are required.'
        );
    }

    // Directory to save the downloaded image
    const savePath = path.join(out_image_dir, path_name);

    try {
        // Download image data using fetch (similar to file_get_contents in PHP)
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(400).send('Error: Could not download image.');
        }

        const imageData = await response.buffer();  // Get the image data as a buffer

        // Ensure the save directory exists
        if (!fs.existsSync(out_image_dir)) {
            fs.mkdirSync(out_image_dir, { recursive: true });
        }

        // Save the image to the specified path (similar to file_put_contents in PHP)
        fs.writeFile(savePath, imageData, (err) => {
            if (err) {
                console.error('Error saving image:', err);
                return res.status(500).send('Error: Could not save the image.');
            }
            // console.log('Image downloaded and saved to:', savePath);
            // res.send(`Image downloaded successfully and saved to: ${savePath}`);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error: ' + error.message);
    }
});


// Handle POST request to '/submit'
app.post('/save-image-results-page', (req, res) => {
    // Get the data from the POST request body
    const {
        anno_id, culture, example_id, q3_query, selected_img_path, selected_img_rank, image_search_page, image_search_page_ranks
    } = req.body;

    // Open the CSV file and write the data as a new row
    const csvData = [anno_id, culture, example_id, q3_query, selected_img_path, selected_img_rank, image_search_page, image_search_page_ranks];
    const search_file = path.join(out_image_dir, `${selected_img_path.replace(".png", "")}_searchpage.csv`);
    // Writing row to CSV file
    fs.appendFile(search_file, csvData.join('|') + '\n', (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
            return res.status(500).send('Failed to save data');
        }
        // console.log('Data written to CSV:', csvData);
        // res.send('Data successfully saved to CSV');
    });
});


app.listen(port, '0.0.0.0', () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
})
