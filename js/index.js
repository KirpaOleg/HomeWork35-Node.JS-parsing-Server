const http = require('http');
const request = require('request');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const URL = 'https://auto.ria.com/uk/legkovie/tesla/?page=1';
let str = '';
const blockCars = [];
let blockCar = '';
const arrCarInfo = [];
let strCSV = '';
let tableInfo = '<tr><td style="border: 1px solid black; text-align: center;">model</td><td style="border: 1px solid black;">year</td><td style="border: 1px solid black;">priceUSD</td><td style="border: 1px solid black;">priceUAH</td></tr>';

request(URL, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.

  // Получаем нужный кусок HTML
  const getHTMLCars = (HTMLBody) => {
    const startStr = HTMLBody.indexOf('<div id="searchResults">');
    const endStr = HTMLBody.indexOf('<section class="social-sharing m-padding">');

    for (let i = startStr; i < endStr; i++) {
      str = `${str}${HTMLBody[i]}`;
    }
    // console.log('ТЕСТ >>>>>>>>>', str);
  };
  getHTMLCars(body);

  // Нарезаем div с информацией про авто
  const cutStringBlockCar = (string) => {
    let stringStart = string.indexOf('<section class="ticket-item "');
    let stringEnd = string.indexOf('<i class="icon-favorite-head"></i> </a> </div> </div> </div> </div> </section>');
    let newString = string;

    while (stringStart > 0) {
      blockCar = newString.slice(stringStart, stringEnd);
      blockCars.push(blockCar);
      newString = newString.slice(stringEnd + 1);
      stringStart = newString.indexOf('<section class="ticket-item "');
      stringEnd = newString.indexOf('<i class="icon-favorite-head"></i> </a> </div> </div> </div> </div> </section>'
      );
    }
  };
  cutStringBlockCar(str);
  // console.log(blockCars);

  // Формируем массив
  blockCars.forEach((property) => {
    let model = property.split('<span class="blue bold">').pop().split('</span>');
    let year = property.split('data-year="').pop().split('" data-expire-date');
    let priceUSD = property.split('data-currency="USD">').pop().split('</span>');
    let priceUAH = property.split('<span data-currency="UAH">').pop().split('</span>');

    const propertyCar = {
      model: model[0],
      year: year[0],
      priceUSD: priceUSD[0],
      priceUAH: priceUAH[0],
    };
    // console.log(propertyCar);
    arrCarInfo.push(propertyCar);
  });
  console.table(arrCarInfo);

  // Генерируем Ексель таблицу
  arrCarInfo.forEach((item) => {
    strCSV = `${strCSV} ${item.model}; ${item.year}; ${item.priceUSD}; ${item.priceUAH}; \n`;
  });
  // console.log(strCSV);

  // Генерируем имя файла
  const generateFileName = () => {
    return `./product/products_${moment().format("YYYY-MM-DD hhmmss")}.csv`;
  };

  // Сервер
  const server = http.createServer((req, res) => {
    const fileName = generateFileName();
    fs.writeFileSync(fileName, strCSV);

  arrCarInfo.forEach((item) => {
      tableInfo = tableInfo + `
            <tr>
              <td style="border: 1px solid black;">${item.model}</td>
              <td style="border: 1px solid black;">${item.year}</td>
              <td style="border: 1px solid black;">${item.priceUSD}</td>
              <td style="border: 1px solid black;">${item.priceUAH}</td>
            </tr>
          `
    });
    // res.write(`${strCSV}`);
    res.write(`<html><body><table style="border: 1px solid black;">${tableInfo}</table></body></html>`);
    res.end();
  });

  server.listen(5000, () => {
    console.log("Server listen >>>> 5000");
  });
});
