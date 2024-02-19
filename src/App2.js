import React, { useState } from 'react';
import Papa from 'papaparse';

const App2 = () => {
  const [jsonData, setJsonData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    parseCSV(file);
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        if (result.data.length > 0) {
          setJsonData(result.data);
        }
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      {jsonData.length > 0 && (
        <div>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App2;
