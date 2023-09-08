import React, { useEffect, useState } from 'react';
import maleBodyImage from './images/male_body.jpg';
import femaleBodyImage from './images/female_body.png';

function HumanBodyImage({isMale, symptoms}) {

    const [imageSrc, setImageSrc] = useState('');

    const coordinates = {
        'Head': { top: '5%', left: '50%' },
        'Lungs': { top: '20%', left: '50%' },
        'Nose': { top: '15%', left: '50%' },
        'Throat': { top: '40%', left: '50%' },
        'Stomach': { top: '50%', left: '50%' },
        'Skin': { top: '60%', left: '50%' },
        'Eyes': { top: '20%', left: '50%' },
        'Reproductive': { top: '70%', left: '50%' },
        'Extremities': { top: '30%', left: '50%' },
        // ... add more body parts and their relative positions
    };

    const [result, setResult] = useState({});
  
    const symptom_map = {
      "General": ['Fever', 'Fatigue', 'Muscle aches', 'Unexplained weight loss', 'Unexplained weight gain', 'Insomnia', 'Excessive sleepiness'],
      "Lungs": ['Cough', 'Shortness of breath', 'Persistent cough', 'Chest pain', 'Difficulty breathing while lying down'], 
      "Nose": ['Runny nose', 'Stuffy nose', 'Congestion', 'Loss of taste', 'Loss of smell', 'Nosebleeds'],
      "Head": ['headache', 'Dizziness', 'Fainting', 'Anxiety', 'Panic attacks', 'Hair loss', 'Memory Loss', 'Confusion', 'Depression'],
      "Thoat": ['Sore throat', 'Excessive thirst', 'Difficulty swallowing', 'Slurred Speech'],
      "Stomach": ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Changes in bowel habits', 'Constipation', 'Reduced apetite', 'Bloated'],
      "Skin": ["Jaundice", "Rashes", "Hives", "Patches", "Acne", "Scaly skin"],
      "Eyes": ['Changes in vision', 'dry eyes'],
      "Reproductive": ['Frequent urination', 'Erectile dysfunction', 'Heavy periods', 'Irregular periods', 'Reduced libido', 'Period cramps'],
      "Extremeties": ['Tremors', 'joint pain', 'Cold extremities'],
    };
  
    function findKeysByValueInList(object, value) {
        for (const [key, array] of Object.entries(object)) {
            const newArray = array.map(item => item.toLowerCase());
            if (Array.isArray(newArray) && newArray.includes(value.toLowerCase())) {
              return key;
            }
          }
          return null;
        }
    useEffect(() => {
      const newResult = {};
      console.log(`Symptoms INSDIE : ${symptoms}`)
      symptoms.forEach(query => {
        console.log(`Query ${query}`);
        const keys = findKeysByValueInList(symptom_map, query);
        if (keys !== null) {
          if (Array.isArray(newResult[keys])) {
              newResult[keys].push(query);
          } else {
              newResult[keys] = [query]; // Initialize a new array if it doesn't exist
          }
        } else {
            newResult[keys] = ["No matching keys"]; // Assign an array containing the string
        }
        console.log(`Result: ${JSON.stringify(newResult)}`);
      });
  
      setResult(newResult);
    }, [symptoms]);

    console.log(`isMale: ${isMale}`)
    useEffect(() => {
      if ( isMale.indexOf('female') !== -1 ) {
        setImageSrc(femaleBodyImage);
      } else {
        setImageSrc(maleBodyImage);
      }
    }, [isMale]);
  
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={imageSrc} alt="Human Body" style={{ width: '60%', height: 'auto' }} />
  
          {Object.entries(result).map(([key, queries]) => {
              const position = coordinates[key];
              if (position) {
                  // Convert the array of queries to a comma-separated string
                  const queriesString = queries.join(', ');
                  return (
                      <div
                          key={key}
                          style={{
                            position: 'absolute', // Use absolute positioning
                            top: position.top, // Adjust the top position
                            left: position.left - 2, // Adjust the left position
                            transform: 'translate(-50%, -50%)', // Center the text within the div
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            padding: '2px',
                            borderRadius: '5px',
                        }}
                      >
                          {queriesString}
                      </div>
                  );
              }
              return null;
          })}
      </div>
  );
}
export default HumanBodyImage;