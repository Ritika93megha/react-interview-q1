import React, { useEffect, useState } from 'react';
import './App.css';
import { isNameValid, getLocations } from './mock-api/apis';
import { debounce } from './helper';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [name, setName] = useState('');
  const [locations, setLocations] = useState([])
  const [tableData, setTableData] = useState({});
  const [invalid, setInvalid] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getLocations().then((res) => {
      // TODO Add progress bar 
      setLocations(res);
      setSelectedRegion(res[0]);
    });
  }, [])
  /**
   * Adds the name and country in the table 
   */
  const onClickAdd = () => {
    if (name) {
      if (tableData[name]) {
        setInvalid('Name already present');
      } else {
        setTableData({ ...tableData, ...{ [name]: selectedRegion } });
        setInvalid(null);
      }
    } else {
      setInvalid('Please select a name');
    }
  }
  /**
   * Validates if data already present in table then delete it 
   */
  const onClickClear = () => {
    if (tableData[name]) {
      delete tableData[name];
      setTableData({ ...tableData });
      setInvalid(null);
    } else {
      setInvalid('Name not present');
    }
  }
  /**
   * Validates the name value from mock api
   */
  const validateName = async (value) => {
    try {
      const isValid = await isNameValid(value);
      setErrorMessage(isValid ? null : "The name is already taken");
    } catch (error) {
      //console.error("Error validating name:", error);
      setErrorMessage("Error validating name");
    }
  };

  const debouncedFn = debounce(validateName, 500);
  /**
   * Handles the name input change
   */
  const handleInputChange = (event) => {
    setName(event.target.value);
    debouncedFn(event.target.value);
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="input-container">
          <div className="input">Name</div>
          <div className="input"><input type='text' value={name} aria-label='Input your Name' onChange={handleInputChange} /></div>
        </div>
        <div>
          {
            errorMessage && (
              <p>{errorMessage}</p>
            )
          }
        </div>
        <div className="input-container">
          <div className="input">Location</div>
          <div className="input">
            <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} aria-label="region-selection">

              {locations.map((location, index) =>
                <option value={location} key={index}>{location}</option>
              )}
            </select>
          </div>
        </div>
        <div>
          {
            invalid && (
              <p className="error">{invalid}</p>
            )
          }
        </div>
        <div className='button-container'>
          <button className='button' onClick={() => onClickClear()}>Clear</button>
          <button className='button' onClick={() => onClickAdd()}>Add</button>
        </div>
        <div className='tableContent'>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Country</th>
              </tr>
              {
                Object.keys(tableData).map((key, index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{tableData[key]}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}

export default App;