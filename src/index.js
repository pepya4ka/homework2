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
    const rate = rateTag.getAttribute("max");
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
  const keys = Object.keys(currencyData).sort((k1, k2) =>
    compare(currencyData[k1], currencyData[k2])
  );
  const plotData = keys.map(key => currencyData[key]);

  const chartConfig = {
    type: "line",

    data: {
      labels: keys,
      datasets: [
        {
          label: "Температура",
          backgroundColor: "rgb(255, 20, 20)",
          borderColor: "rgb(180, 0, 0)",
          data: plotData
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


//RGB(20, 130, 50)
//RGB(10, 200, 50)