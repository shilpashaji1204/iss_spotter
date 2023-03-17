 const request = require('request');

const fetchMyIP = function(callback) { 
    // use request to fetch IP address from JSON API
    request('https://api.ipify.org?format=json', function(error, response, body) {
        if(error) return callback(error, null);

        if(response.statusCode !== 200) {
            callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`),null);
            return;
        }
        const data = JSON.parse(body).ip;
        callback(null, data);
      });
  };
  const fetchCoordsByIP = function(ip, callback) {
    const url = `https://ipwhois.app/json/${ip}`;
  
    request(url, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      const data = JSON.parse(body);
      if (!data.success) {
        const msg = `Error getting coordinates for IP ${ip}: ${data.message}`;
        callback(Error(msg), null);
        return;
      }
  
      const coords = { latitude: data.latitude, longitude: data.longitude };
      callback(null, coords);
    });
  };

  

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      callback(`Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`, null);
    } else {
      const data = JSON.parse(body);
      callback(null, data.response);
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
      fetchCoordsByIP(ip, (error, coords) => {
        if (error) {
          return callback(error, null);
        }
        fetchISSFlyOverTimes(coords, (error, flyover) => {
          if (error) {
            return callback(error, null);
          }
          callback(null, flyover);
        });
      });
    });
    
};
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
