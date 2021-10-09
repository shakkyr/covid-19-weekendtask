{/* <div class="status">
        <input type="button" id="deaths" class="btn" value="Number of Deaths">
        <input type="button" id="cases" class="btn" value="Confirmed Cases">
        <input type="button" id="recovered" class="btn" value="Number of recovered">
        <input type="button" id="critical" class="btn" value="Number of critical condition">
      
    </div>
    <div id="continents">
        <input type="button" id="world" class="regions" value="World">
        <input type="button" id="asia" class="regions" value="Asia">
        <input type="button" id="europe" class="regions" value="Europe">
        <input type="button" id="africa" class="regions" value="Africa">
        <input type="button" id="americas" class="regions" value="Americas">
    </div> */}
let deathsButton = document.querySelector('#deaths'),
    casesButton = document.querySelector('#cases'),
    recoveredButton = document.querySelector('#recovered'),
    criticalButton = document.querySelector('#critical'),
    worldButton = document.querySelector('#world'),
    asiaButton = document.querySelector('#asia'),
    europeButton = document.querySelector('#europe'),
    africaButton = document.querySelector('#africa'),
    americasButton = document.querySelector('#americas'),
    allButton = document.querySelectorAll('input');


let diedNumbers = [];
let casesNumbers = [];
let recoveredNumbers = [];
let criticalNumbers = [];
let countryData = [];
let region = [];
let statusObj ={}
let casesObj ={}
let recoveredObj ={}
let criticalObj ={}
let x = [];
let y = [];



const regions = {
    world: {},
    asia: {},
    europe: {},
    africa: {},
    americas: {},
};


async function getData() {
    if (!localStorage.getItem("tempStorage")) {
        let data1 = await (await fetch('https://corona-api.com/countries')).json();
        let data2 = await (await fetch('https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1')).json();
        localStorage.setItem("tempStorage", JSON.stringify({ data1: data1, data2: data2 }))
        
    }
    let data = JSON.parse(localStorage.getItem("tempStorage"))

    data.data2.forEach(ele => {
        data.data1.data.forEach(element => {
            regions.world[ele.cca2] = { country: ele.name.common };
            
            if (ele.region === "Asia" && element.code == ele.cca2) {
                regions.asia[ele.cca2] = { country: ele.name.common, data: element.latest_data };
            
            } else if (ele.region === "Europe" && element.code == ele.cca2) {
                regions.europe[ele.cca2] = { country: ele.name.common, data: element.latest_data };
            } else if (ele.region === "Americas" && element.code == ele.cca2) {
                ; regions.americas[ele.cca2] = { country: ele.name.common, data: element.latest_data }
            } else if (ele.region === "Africa" && element.code == ele.cca2) {
                regions.africa[ele.cca2] = { country: ele.name.common, data: element.latest_data };
            }   
        })
    })
   
    
}
getData()
console.log(regions);
console.log(regions.asia['IL']);

function countDeaths (obj) {
    let num1 = 0;
    for (let i in obj){
    num1 += obj[i].data.deaths;
    }
    return num1
}
function countConfirmedCases (obj) {
    let num2 = 0;
    for (let i in obj){
    num2 += obj[i].data.confirmed;
    }
    return num2
}
function countRecovered (obj) {
    let num3 = 0;
    for (let i in obj){
    num3 += obj[i].data.recovered;
    }
    return num3
}
function countCritical(obj) {
    let num4 = 0;
    for (let i in obj){
    num4 += obj[i].data.critical;
    }
    return num4
}

    addEventListener('load' , () => {
    
    diedNumbers.push(countDeaths (regions.asia))
    region.push('asia')
    diedNumbers.push(countDeaths (regions.europe))
    region.push('europe')
    diedNumbers.push(countDeaths (regions.africa))
    region.push('africa')
    diedNumbers.push(countDeaths (regions.americas))
    region.push('americas')
    statusObj.labels = region;
    statusObj.values = diedNumbers
    statusObj.notes = 'Number of Deaths'
    chartUpdate(statusObj)
})

casesButton.addEventListener('click', ()=> {
    
    region = [];
    statusObj ={}
    casesNumbers.push(countConfirmedCases (regions.asia))
    region.push('asia')
    casesNumbers.push(countConfirmedCases (regions.europe))
    region.push('europe')
    casesNumbers.push(countConfirmedCases (regions.africa))
    region.push('africa')
    casesNumbers.push(countConfirmedCases (regions.americas))
    region.push('americas')
    statusObj.labels = region;
    statusObj.values = casesNumbers
    statusObj.notes = 'Covid - 19 confirmed cases'
    chartUpdate(statusObj)

})


let myChart;
function chartUpdate(obj) {
    if (myChart)
  myChart.destroy()
 let ctx = document.querySelector('#myChart').getContext('2d');
    myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: obj.labels,
        datasets: [{
          label: obj.notes,
          data: obj.values,
          borderWidth: 1,
          backgroundColor: ['#CB4335', '#1F618D', '#F1C40F', '#27AE60', '#884EA0', '#D35400'],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }, 
});

return myChart;
}