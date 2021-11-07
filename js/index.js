const http = require('http');
const request = require('request');
const URL = 'https://auto.ria.com/uk/legkovie/tesla/?page=1';
let str = '';
const blockCars = []; 
let blockCar = '';
const arrPropertyCar = []; 

// const server = http.createServer((req, res) => {

  request(URL, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.

    const getHTMLCars = (HTMLBody) => {
      const startStr = HTMLBody.indexOf('<div id="searchResults">');
      const endStr = HTMLBody.indexOf('<div class="infiltrate fl-l popup-filter"');

      for (let i = startStr; i < endStr; i++) {
        str = `${str}${HTMLBody[i]}`
      } 
      // console.log('ТЕСТ >>>>>>>>>', str);
    };
    getHTMLCars(body);

    const cutStringBlockCar = (string) => {
      let stringStart = string.indexOf('<section class="ticket-item "');
      let stringEnd = string.indexOf('<i class="icon-favorite-head"></i> </a> </div> </div> </div> </div> </section>');
      let newString = string;
    
      while (stringStart > 0) {
        blockCar = newString.slice(stringStart, stringEnd);
        blockCars.push(blockCar);
        newString = newString.slice(stringEnd + 1);
        stringStart = newString.indexOf('<section class="ticket-item "');
        stringEnd = newString.indexOf('<i class="icon-favorite-head"></i> </a> </div> </div> </div> </div> </section>');
      }
    }
    cutStringBlockCar(str);
    // console.log(blockCars);

    arrPropertyCar.forEach((property) => {
      let model = property.split('<span class="blue bold">').pop().split('</span>')
      let year = property.split('</span>').pop().split('</a>')
      let priceUSD = property.split('data-currency="USD">').pop().split('</span>')
      let priceUAH = property.split('<span data-currency="UAH">').pop().split('</span>')
    });
     console.log(arrPropertyCar.model);
  });

    // res.write(`<tr><td>${model}</td><td>${year}</td><td>${priceUSD}</td><td>${priceUAH}</td></tr>`);
    // res.end();
// });

// server.listen(5000, () => {
//   console.log('Server listen >>>> 5000');
// });