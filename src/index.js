import "babel-polyfill";
import Chart from "chart.js";

// const currencyURL = "www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

async function loadCurrency() {
  // const response = await fetch(currencyURL);//???????????????????????
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  // const currencyData = parser.parseFromString(xmlTest, "text/xml");
  // // <Cube currency="USD" rate="1.1321" />
  // const rates = currencyData.querySelectorAll("Cube[currency][rate]");

  const temperatureData = parser.parseFromString(xmlTest, "text/xml"); 
  // <TEMPERATURE max="10" min="2"/>
  const rates = temperatureData.querySelectorAll("TEMPERATURE[max][min]");

  const dateData = parser.parseFromString(xmlTest, "text/xml"); 
  // <FORECAST day="20" month="04" year="2019" hour="21" tod="3" predict="0" weekday="7">
  const dates = dateData.querySelectorAll("FORECAST[day][month][year][hour][tod][predict][weekday]");

  const result = Object.create(null);
  for (let i = 0; i < rates.length; i++) {
    // const rateTag = rates.item(i);
    // const rate = rateTag.getAttribute("rate");
    // const currency = rateTag.getAttribute("currency");
    // result[currency] = rate;

    const rateTag = rates.item(i);
    // const rate = rateTag.getAttribute("max");
    // const rate = (rateTag.getAttribute("max") + rateTag.getAttribute("min"));
    const rate = String( ( (1 * rateTag.getAttribute("max")) + (1 * rateTag.getAttribute("min")) ) / 2 );
    const dateTag = dates.item(i);
    const date = dateTag.getAttribute("hour");
    result[date] = rate;
  }
  // result["EUR"] = 1;
  // result["RANDOM"] = 1 + Math.random();
  return result;
}

async function loadCurrency1() {
  // const response = await fetch(currencyURL);//???????????????????????
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  // const currencyData = parser.parseFromString(xmlTest, "text/xml");
  // // <Cube currency="USD" rate="1.1321" />
  // const rates = currencyData.querySelectorAll("Cube[currency][rate]");

  const temperatureData = parser.parseFromString(xmlTest, "text/xml"); 
  // <HEAT min="0" max="0"/>
  const rates = temperatureData.querySelectorAll("HEAT[max][min]");
  const dateData = parser.parseFromString(xmlTest, "text/xml"); 
  // <FORECAST day="20" month="04" year="2019" hour="21" tod="3" predict="0" weekday="7">
  const dates = dateData.querySelectorAll("FORECAST[day][month][year][hour][tod][predict][weekday]");

  const result = Object.create(null);
  for (let i = 0; i < rates.length; i++) {
    // const rateTag = rates.item(i);
    // const rate = rateTag.getAttribute("rate");
    // const currency = rateTag.getAttribute("currency");
    // result[currency] = rate;

    const rateTag = rates.item(i);
    const rate = String( ( (1 * rateTag.getAttribute("max")) + (1 * rateTag.getAttribute("min")) ) / 2 );
    const dateTag = dates.item(i);
    const date = dateTag.getAttribute("hour");
    result[date] = rate;
  }
  // result["EUR"] = 1;
  // result["RANDOM"] = 1 + Math.random();
  return result;
}


// function normalizeDataByCurrency(data, currency) {
//   const result = Object.create(null);
//   const value = data[currency];
//   for (const key of Object.keys(data)) {
//     result[key] = value / data[key];
//   }
//   return result;
// }

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function() {
  const currencyData = await loadCurrency();
  // const normalData = normalizeDataByCurrency(currencyData, "RUB");


  // const keys = Object.keys(currencyData).sort((k1, k2) =>
  //   compare(currencyData[k1], currencyData[k2])
  // );
  // const plotData = keys.map(key => currencyData[key]);

  const keys = Object.keys(currencyData);
  const plotData = keys.map(key => currencyData[key]);

  // const currencyData1 = await loadCurrency1();
  // const keys1 = Object.keys(currencyData1).sort((k1, k2) =>
  //   compare(currencyData1[k1], currencyData1[k2])
  // );
  // const plotData1 = keys1.map(key => currencyData1[key]);

  const currencyData1 = await loadCurrency1();
  const keys1 = Object.keys(currencyData1);
  const plotData1 = keys1.map(key => currencyData1[key]);

  const chartConfig = {
    type: "line",

    data: {
      labels: keys,
      datasets: [
        {
          label: "Температура",
          backgroundColor: "rgb(255, 20, 20, 0.8)",
          borderColor: "rgb(180, 0, 0)",
          data: plotData
        },
        {
          label: "Температура по ощущениям",
          backgroundColor: "rgb(20, 130, 50, 0.8)",
          borderColor: "rgb(10, 200, 50)",
          data: plotData1
        }
      ]
    }
  };

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
  
});

function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}