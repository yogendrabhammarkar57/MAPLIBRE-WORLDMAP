import React, { useState, useEffect } from 'react';
import jsonObject1 from './countrycode.json';
import jsonObject2 from './data.json';

const App3 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Iterate through jsonObject2 and add ISO3 Code where there's a match
    const updatedData = jsonObject2.map((obj2) => {
      const matchingObject1 = jsonObject1.find((obj1) => obj1["Country"] === obj2["Area"]);
      if (matchingObject1) {
        return { ...obj2, "ISO3": matchingObject1["ISO3 Code"] };
      }
      return obj2;
    });

    setData(updatedData);
  }, []);

  console.log(data);

  return (
    <div>
      hii
    </div>
  );
}

export default App3;
