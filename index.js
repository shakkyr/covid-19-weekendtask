
let deathsButton = document.querySelector('#deaths'),
    confirmedButton = document.querySelector('#confirmed'),
    recoveredButton = document.querySelector('#recovered'),
    criticalButton = document.querySelector('#critical'),
    worldButton = document.querySelector('#world'),
    asiaButton = document.querySelector('#asia'),
    europeButton = document.querySelector('#europe'),
    africaButton = document.querySelector('#africa'),
    americasButton = document.querySelector('#americas'),
    regionsAllButton = document.querySelectorAll('.regions'),
    countriesList = document.querySelector('.countries'),
    countriesDiv = document.querySelector('.countries-div')

let region = [];
let statusObj ={}
let continent=null;

const regions = {
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
function countCases (obj , status){
    let num5 = 0;
    for (let i in obj){
    num5 += obj[i].data[status];
    }}

function getAllCountries (regionName) {
    // Asia 
    let obj = regions[regionName];
    let arr=[]
    for (let country in obj){
     arr.push(obj[country].country)
     
        }
return arr;
}

function dataPerCountry (country ,continent) {
     for ( let key in regions[continent]){
          if (regions[continent][key].country == country) {
            console.log(regions[continent][key]); 
            return regions[continent][key]
          }}

}


regionsAllButton.forEach(btn => {
    btn.addEventListener('click', function () {
        let obj={}
        continent = this.id
        let doal = getAllCountries(continent)
        let str ='<select name="countris-list" id="countris-list">';
        doal.forEach( ele => {
            str += `<option value="${ele}">${ele}</option>`
        })
        str += '</select> <input type="button" id="giveData" value="give Data Please">' 
        countriesList.innerHTML = str;
        document.querySelector('#giveData').addEventListener('click' , () =>{
             let dataaaaa =   dataPerCountry (document.querySelector('#countris-list').value, continent);

               countriesDiv.innerHTML = `<br><h1>${dataaaaa.country}</h1><br><br> <span>confirmed =</span> ${dataaaaa.data.confirmed} <br><br>
               <span>critical status =</span> ${dataaaaa.data.critical} <br><br>
               <span>deaths =</span>  ${dataaaaa.data.deaths} <br><br>
               <span>recovered cases =</span>  ${dataaaaa.data.recovered}`
                
        })
        })
      
    })
function getAllWorldData(status){
    
   
  let arr=[]
  for(let region in regions){

      arr.push((getRegionData(status,region).reduce((total,current)=>total+current)))
  }
 statusObj.labels=Object.keys(regions)
 statusObj.values=arr;
 statusObj.notes=status
 console.log(statusObj);
chartUpdate(statusObj)
}


function getRegionData(status,continent){
    let obj=regions[continent];
   let arr=[]

for(let country in obj){

    arr.push(obj[country].data[status]);
}
return arr;

}
function caseData(status){
    statusObj.labels=getAllCountries(continent)
    statusObj.notes = status
    statusObj.values=getRegionData(status,continent)
    chartUpdate(statusObj)
}

   deathsButton.addEventListener('click' , () => {
       console.log(continent);
    if(continent=='world')
    getAllWorldData('deaths')
    else
    caseData('deaths')
  
})

confirmedButton.addEventListener('click', ()=> {
    if(continent=='world')
    getAllWorldData('confirmed')
    else
    caseData('confirmed')


})
recoveredButton.addEventListener('click', ()=> {
    if(continent=='world')
    getAllWorldData('recovered')
    else
    caseData('recovered')

})
criticalButton.addEventListener('click', ()=> {
    if(continent=='world')
    getAllWorldData('critical')
    else
    caseData('critical')

})


let myChart;
function chartUpdate(obj) {
  
    if(myChart)
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
                beginAtZero: true,
                
            }
        }
    }, 
});
  
}
addEventListener('load', getAllWorldData('deaths'))