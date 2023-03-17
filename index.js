const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  fetchCoordsByIP(ip, (error, data) => {
    console.log("Error: ", error);
    console.log("Data: ", data);
  });
}); 

const exampleCoords = { latitude: '49.2827', longitude: '-123.1207' };

fetchISSFlyOverTimes(exampleCoords, (error, flyoverTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('Flyover times:', flyoverTimes);
});

nextISSTimesForMyLocation((error, passTimes) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    
    console.log('The next 5 upcoming ISS flyovers for your location are:');
    for (const flyover of passTimes) {
      const date = new Date(flyover.risetime * 1000);
      console.log(`- At ${date.toLocaleString('en-US', { timeZone: 'America/New_York' })}, for ${flyover.duration} seconds`);
    }
  });
