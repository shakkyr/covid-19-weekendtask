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


let diedNumbers = [];
let reg = [];
let diedObj ={}
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
    reg.push('asia')
    diedNumbers.push(countDeaths (regions.europe))
    reg.push('europe')
    diedNumbers.push(countDeaths (regions.africa))
    reg.push('africa')
    diedNumbers.push(countDeaths (regions.americas))
    reg.push('americas')
    diedObj.labels = reg;
    diedObj.values = diedNumbers
    diedObj.notes = 'Number of Deaths'
    chartUpdate(diedObj)

})


// Confirmed Cases
// - Number of Deaths
// - Number of recovered
// - Number of critical cond


    

function chartUpdate(obj) {
 const ctx = document.querySelector('.myChart').getContext('2d');
 const myChart = new Chart(ctx, {
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