import React, { useEffect, useState } from 'react';
/*import axios from 'axios';*/
import './index.css';
import HumanBodyImage from './human_body';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [pythonOutput, setPythonOutput] = useState({});
  const [list, setList] = useState([]);
  const [buttonClicked, setButtonClicked] = useState({});
  const [originalSymptoms, setOriginalSymptoms] = useState([]);
  const [demographicsObj, setDemographicsObj] = useState({});

  const handleClear = () => {
    setList([]); // Clear the list
    setButtonClicked(false); // Reset buttonClicked state
    setPythonOutput(""); // Reset pythonOutput state
    setInputValue(""); 
    setOriginalSymptoms([]);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };


  const handleSubmit = async () => {
    try {
      const response = await fetch('https://autodoc1-0-2341f1c6dfd1.herokuapp.com/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userText: inputValue }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setOriginalSymptoms(data.symptoms); // Store the initial symptoms
      setPythonOutput(data); // Update pythonOutput state
      setDemographicsObj(JSON.parse(data.demographics));
      console.log(`DemographicsOBJ: ${demographicsObj}`);
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddNewSymptoms = (value) => {
    if (!buttonClicked[value] && !list.includes(value)) {
      setList([...list, value]);
      setButtonClicked({ ...buttonClicked, [value]: true });
    }
  };

  const sendDataToBackend = async () => {
    try {
      console.log(`SENDING TO BACKEND!!!: ${list}`);
      console.log(`SENDING TO BACKEND OG SYM!!!: ${pythonOutput.userText}`);
      const response = await fetch('https://autodoc1-0-2341f1c6dfd1.herokuapp.com/process-additional-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          original_symptoms: pythonOutput.userText,
          additional_symptoms: list 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      const final_diagnosis = data.diagnosis;
      setPythonOutput({ ...pythonOutput, diagnosis: final_diagnosis });
    } catch (error) {
      console.error(error);
    }
  };

    return (
  <div className="center-square">
    <div className="left-column">
      {pythonOutput.symptoms && (
        <HumanBodyImage isMale={pythonOutput.demographics} symptoms={pythonOutput.symptoms.split(", ")} />
      )}
    </div>
    <div className="right-column">
      <h2 className="center-header">Patient Case Description:</h2>
        <p style={{fontSize: '14px'}}>Please describe the patient encounter...</p>
          <textarea
            className="text-box"
            value={inputValue}
            onChange={handleChange}
            placeholder="Example: A 28-year-old female Asian patient complains of cough, chest pain, etc."
          />
        <div className="button-container">
          <button onClick={handleSubmit} className="submit-button">Submit</button>
          <button onClick={handleClear} className="submit-button">Clear Page</button>
        </div>
        {pythonOutput && pythonOutput.symptoms && (
          <>
            <div>
              <p style={{fontSize: '14px'}}>
                Patient demographics:
              </p>
              <ul>
                {Object.keys(demographicsObj).map((key, index) => (
                  <li key={index}>{key}: {demographicsObj[key]}</li>
                ))}
              </ul>
            </div>
            <h7>Related symptoms: please select if they apply</h7>
            <p></p>
            {(() => {
              let symptomsArray = pythonOutput.more_symptoms;

              if (typeof symptomsArray === 'string') {
                symptomsArray = symptomsArray.split(',');
              } else if (typeof symptomsArray === 'object' && !Array.isArray(symptomsArray)) {
                symptomsArray = Object.values(symptomsArray);
              } else if (symptomsArray == null) {
                symptomsArray = [];
              } else if (!Array.isArray(symptomsArray)) {
                symptomsArray = [symptomsArray];
              }

              return symptomsArray.length > 0 ? symptomsArray.map((name, index) => (
                <button key={index} onClick={() => handleAddNewSymptoms(name)} disabled={buttonClicked[name]} className={buttonClicked[name] ? 'button-disabled' : 'symptoms-button'}>{name.replace(/[\[\]]/g, "")}</button>
              )) : <p className="text-info">No symptoms to display.</p>;
            })()}
            {Array.isArray(list) && list.length > 0 && (
              <>
                <h4>Added Symptoms:</h4>
                <ul>
                  {list.map((value, index) => <li key={index}>{value.replace(/[\[\]]/g, "")}</li>)}
                </ul>
              </>
            )}
            <p></p>
            <button className='submit-button' onClick={sendDataToBackend}>Done Adding!</button>
            <p style={{ fontSize: '16px', fontFamily: 'Helvetica' }}>Probable Diagnoses: {pythonOutput.diagnosis}</p>
          </>
        )}
    </div>
  </div>
)};

export default App;