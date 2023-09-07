const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
const PORT = process.env.PORT || 8000;

const symScript = 'scripts/symptoms.py';
const diagScript = 'scripts/diagnosis.py';
const additionalScript = 'scripts/additional_symptoms.py';
const demoScript = 'scripts/demographics.py';

// Serve static files from the React app build directory
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Define API routes here
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Catch-all to serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const executePythonScript = (script, params) => {
  return new Promise((resolve, reject) => {
    exec(`python3 ${script} ${params}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
};
app.post('/process-text', async (req, res) => {
  try {
    const { userText } = req.body;
    console.log(`This is my initial input text: ${userText}`)
    const demographics = await executePythonScript(demoScript, `--function extract_information --userText "${userText}"`);
    const symptoms = await executePythonScript(symScript, `--function get_sym --userText "${userText}"`);
    console.log(`This is my initial symptom list: ${symptoms}`)
    const disease = await executePythonScript(diagScript, `--function top_3_categories --userText "${userText}"`);
    console.log(`This is my initial disease list: ${disease}`)
    const more_symptoms = await executePythonScript(additionalScript, `--function additional_symptoms --symptoms "${symptoms}"`);
    console.log(`These are the added symptoms: ${more_symptoms}`)
    res.status(200).json({ message: 'Data received', symptoms: symptoms, more_symptoms: more_symptoms, demographics: demographics, userText: userText});
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Second endpoint for additional symptoms
app.post('/process-additional-symptoms', async (req, res) => {
  try {
    const { original_symptoms, additional_symptoms } = req.body;
    const all_symptoms = original_symptoms + ", "  + additional_symptoms;
    console.log(`added symptoms after button sel ${original_symptoms}`);
    console.log(`added symptoms after button sel ${additional_symptoms}`);
    console.log(`added symptoms after button sel ${all_symptoms}`);
    const final_diagnosis = await executePythonScript(diagScript, `--function top_3_categories --userText "${all_symptoms}"`);
    res.status(200).json({ message: 'Final diagnosis received', diagnosis: final_diagnosis });
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
