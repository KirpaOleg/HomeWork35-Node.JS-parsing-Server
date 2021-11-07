const http = require('http');
const request = require('request');
const URL = 'https://auto.ria.com/uk/legkovie/tesla/?page=1';
let str = '';
const elements = []; 
let element = '';
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

    const cutElementsCar = (string) => {
      let elementStart = string.indexOf('<section class="ticket-item "');
      let elementEnd = string.indexOf('<i class="icon-favorite-head"></i> </a> </div> </div> </div> </div> </section>');
      let newString = string;
    
      while (elementStart > 0) {

        element = newString.slice(elementStart, elementEnd);
        elements.push(element);
        newString = newString.slice(elementEnd + 1);
        elementStart = newString.indexOf('<section class="ticket-item "');
        elementEnd = newString.indexOf('<i class="icon-favorite-head"></i> </a> </div> </div> </div> </div> </section>');
      }
    }
    cutElementsCar(str);
    // console.log(elements);

    arrPropertyCar.forEach((property) => {
      let model = property.split('<span class="blue bold">').pop().split('</span>')
      let year = property.split('</span>').pop().split('</a>')
      let priceUSD = property.split('data-currency="USD">').pop().split('</span>')
      let priceUAH = property.split('<span data-currency="UAH">').pop().split('</span>')
     });

  });

    // res.write(`<tr><td>${model}</td><td>${year}</td><td>${priceUSD}</td><td>${priceUAH}</td></tr>`);
    // res.end();
// });

// server.listen(5000, () => {
//   console.log('Server listen >>>> 5000');
// });