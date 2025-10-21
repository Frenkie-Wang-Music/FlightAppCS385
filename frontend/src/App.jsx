import React, { useEffect, useState } from "react";
import Airplane from "./Airplane.png"; // Import Airplane Image

function App() {
  // the data response from the API - initially empty array
  const [data, setData] = useState([]);
  // a flag to indicate the data is loading - initially false
  const [loaded, setLoaded] = useState(false);
  // a flag to indicate an error, if any - initially null.
  const [error, setError] = useState(null);
  // State: Save the Search content
  const [searchTerm, setSearchTerm] = useState("");

  //useEffect is a React Hook
  // lets you synchronize a component with an external system.
  useEffect(() => {
    const URL = "https://raw.githubusercontent.com/Frenkie-Wang-Music/CS385DataSet/refs/heads/main/FlightData/times.json";

    async function fetchData() {
      try {
        const response = await fetch(URL);
        const jsonData = await response.json(); // wait for the JSON response
        setLoaded(true); // Once async mainpulation is done, change this state
        setData(jsonData.flightTimes); // flightTimes is the Array's Key
      } catch (error) {
        setError(error); // take the error message from the system
        setLoaded(false);
      } // end try-catch block
    } // end of fetchData

    fetchData(); // invoke fetchData in useEffect

  }, []); // end of useEffect
  // Empty square brackets
  // This means that the useEffect hook does not depend
  // on any other variable. Therefore, here it will only
  // happen once.

  function handleSearchBox(event){
    setSearchTerm(event.target.value);
  }

  function clearSearch(){
    setSearchTerm("");
  }

  if (error) {
    return <h1>Opps! An error has occurred: {error.toString()}</h1>;
  } else if (loaded === false) {
    return <h1>loading Data...... please wait!</h1>;
  } else {
    return (
      // send the data to the ResultsComponent for render
      <>
        <form>
          <img src = {Airplane} alt = "Airplane Image" />
          <h2>Search by Departure and Destination Name:</h2>
          <h4>You are currently Searching: {searchTerm}</h4>
          <input 
            type = "text" 
            placeholder = "Type the keyword"
            value = {searchTerm} 
            onChange = {handleSearchBox}
          />
          <button onClick = {clearSearch}>Clear Search Box</button> 
        </form>
        <ResultsComponent 
          APIData={data} 
          searchTermFromParent = {searchTerm} 
        />
      </>
    );
  } // end else
} // end App() function or component

// This is our Results Component
// This component will display the contents
// the response of the API call from above.

function ResultsComponent(props) {

  function flightTimeFilter() {
    return function (flightObject) {
      // The arrival property of the data is HH:MM
      const timeParts = flightObject.arrival.split(":");
      let h = timeParts[0]; // extract the hour
      let m = timeParts[1]; // extract the minute
      // create a Javascript Date Object
      let flightDate = new Date();
      flightDate.setHours(h);
      flightDate.setMinutes(m);

      return flightDate >= new Date();
    };
  }

    // A standard search for a string within the
  // departure or destination property values
  function flightDeptDestFilter(searchTerm) {
    return function (flightObject) {
      let deptLowerCase = flightObject.dept.toLowerCase();
      let destLowerCase = flightObject.dest.toLowerCase();
      let searchTermLowerCase = searchTerm.toLowerCase();

      return (
        searchTerm != "" &&
        (deptLowerCase.includes(searchTermLowerCase) ||
          destLowerCase.includes(searchTermLowerCase))
      );
    };
  }

  return (
    <>
      <h1>Number of flights returned: {props.APIData.length}</h1>
      <h3>Current Time is : {new Date().toLocaleString()}</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Pilot</th>
            <th>Flight No.</th>
            <th>Dept.</th>
            <th>Dest</th>
            <th>Arrival</th>
          </tr>
        </thead>
        <tbody>
          {props.APIData
            .filter(flightTimeFilter())
            .filter(flightDeptDestFilter(props.searchTermFromParent))
            .map((p, index) => (
              <tr key={index}>
                <td>
                  <i>{p.aircraft.captain}</i>
                </td>
                <td>
                  <b>{p.id}</b>
                </td>
                <td>
                  <b>{p.dept}</b>
                </td>
                <td>
                  <b>{p.dest}</b>
                </td>
                <td>{p.arrival}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default App;