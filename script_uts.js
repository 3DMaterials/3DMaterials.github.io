
async function init(){
    const response = await fetch('data.csv');
    const csvData = await response.text();
  
    // Parse the CSV data
    const lines = csvData.split('\r\n');
    data = lines.map(line => line.split(','));
  
  
    const uniqueValues = getUniqueValues(data, 0); // Pass 0 as the column index
    procSelect=document.getElementById('process_menu');
    for (let i=0; i<(uniqueValues.length)-1;i++){
      var option = document.createElement("option");
      option.value = uniqueValues[i];
      option.text = uniqueValues[i];
      procSelect.add(option);
    } 
    //console.log(uniqueValues); // Output unique values from the first column
    document.getElementById("process_menu").selectedIndex = 0;
    const e = new Event("change");
    const element = document.querySelector('#process_menu')
    element.dispatchEvent(e);
    addData()
  }
  
  // Function to get unique values from a specific column
    function getUniqueValues(data, columnIndex) {
      const uniqueValues = new Set();
  
      for (let i = 1; i < data.length; i++) {
        const value = data[i][columnIndex];
        uniqueValues.add(value);
      }
  
      return Array.from(uniqueValues);
    }
  
  
  
  class DropDown{
  
    constructor(data){
      this.data = data
      this.targets = []
    }
  
    filterData(filterAsArray){
       return this.data.filter(r => filterAsArray.every((item,i) => item === r[i]));
    }
  
    getUniqueValues(dataAsArray,index){
      const uniqueOptions = new Set();
      dataAsArray.forEach(r => uniqueOptions.add(r[index]));
      return [...uniqueOptions];
    }
  
    populateDropDown(el,listAsArray){
      el.innerHTML="";
      listAsArray.forEach(item => {
        const option=document.createElement("option");
        option.label = item;
        option.value = item;
        option.text = item;
        el.appendChild(option);
      });
    }
    createPopulateDropDownFunction(el,elsDependsOn){
      return () => {
        const elsDependsOnValues = elsDependsOn.map(depEl  => depEl.value);
        const dataToUse = this.filterData(elsDependsOnValues);
        const listToUse = this.getUniqueValues(dataToUse,elsDependsOn.length);
        this.populateDropDown(el,listToUse );
      }
    }
    add(options){
      const el = document.getElementById(options.target);
      const elsDependsOn = options.dependsOn.map(id => document.getElementById(id))
      const eventFunction = this.createPopulateDropDownFunction(el,elsDependsOn);
      const targetObject = { el: el, elsDependsOn: elsDependsOn,func: eventFunction};
      targetObject.elsDependsOn.forEach(depEl => depEl.addEventListener("change",eventFunction));
      this.targets.push(targetObject);
    
    
    }
   
    
  }
  var color_list=['Blue','Red','Aquamarine','Coral','Cyan','BlueViolet','DarkOrange','DarkSlateBlue','Greem','Fuchsia']
  var array_count=0
  
  let data = []; // Declare data as a global array
  
  async function readCSV() {
    try {
      const response = await fetch('data.csv');
      const csvData = await response.text();
  
      // Parse the CSV data
      const lines = csvData.split('\r\n');
      data = lines.map(line => line.split(','));
  
      var dd = new DropDown(data);
      dd.add({target: "material_menu", dependsOn: ["process_menu"]});
      dd.add({target: "brand_menu", dependsOn: ["process_menu","material_menu"]});
      dd.add({target: "perim_menu", dependsOn: ["process_menu","material_menu","brand_menu"]});
      dd.add({target: "infill_menu", dependsOn: ["process_menu","material_menu","brand_menu","perim_menu"]});
  
  
      console.log(data); // Output the global array with CSV data
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  readCSV();
  init();
  function addData() {
    
    var proc = document.querySelector('#process_menu').value;
    var mat = document.querySelector('#material_menu').value;
    var bran = document.querySelector('#brand_menu').value;
    var per = document.querySelector('#perim_menu').value;
    var inf = document.querySelector('#infill_menu').value;
    
    color=color_list[array_count]
    plotData(proc,mat,bran,per,inf,color)
    addCard(proc,mat,bran,per,inf,color)
    array_count+=1
  }
  
  var chartData = [];
  var chart_labels=[];
  var chart_val=[];
  var bar_colors=[];
    function plotData(process,material,brand,perim,infill,clr) {
    var pth = process.concat("_",material,"_",brand,"_",perim,"_",infill,".json");
    console.log(pth);
  
    fetch(pth)
    .then(response => response.json())
    .then(data => {
      var stressMax=data.layer_strength;
      // Do something with the arrays
      
      chart_val.push(stressMax);
      chart_labels.push(material+'-'+brand+'   '+perim+'/'+infill);
      bar_colors.push(clr)
      var trace = {
        x: chart_labels,
        y: chart_val,
        type: 'bar',
        text: chart_val.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
          color: bar_colors,
          opacity: 0.6,
          line: {
            color: bar_colors,
            width: 1.5
          }
        }
      };
      var data=[trace]
      var layout = {showlegend: false,
        title: {
          text:'Ultimate Strength',
          font: {
            family: 'Open Sans, monospace',
            size: 24
          },
          xref: 'paper',
          x: 0.05,
        },
        xaxis: {
          title: {
            text: 'Material - Brand    Perimeters/Infill',
            font: {
              family: 'Open Sans, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Stress (MPa)',
            font: {
              family: 'Open Sans, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
        };
      Plotly.newPlot('myChart_uts', data,layout);
      
    
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
  }
  
  function removeCard(id){
    console.log(id);
    removeDivById('card'+id);
    delete chartData[id];
    delete chart_labels[id];
    delete chart_val[id];
    delete bar_colors[id];
    //chart_val.splice(id,1)
    //chart_labels.splice(id,1)
    //bar_colors.splice(id,1)
    var trace = {
        x: chart_labels,
        y: chart_val,
        type: 'bar',
        text: chart_val.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
          color: bar_colors,
          opacity: 0.6,
          line: {
            color: bar_colors,
            width: 1.5
          }
        }
      };
      var data=[trace];
      var layout = {showlegend: false,
        title: {
          text:'Ultimate Strength',
          font: {
            family: 'Open Sans, monospace',
            size: 24
          },
          xref: 'paper',
          x: 0.05,
        },
        xaxis: {
          title: {
            text: 'Material - Brand    Perimeters/Infill',
            font: {
              family: 'Open Sans, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Stress (MPa)',
            font: {
              family: 'Open Sans, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
        };
      Plotly.newPlot('myChart_uts', data,layout);
    color_list.push(color_list[id])
  }
  
  function addCard(proc,mat,bran,per,inf,color) {
    var row = document.createElement('div');
    row.className='row';
    row.id='row'+String(array_count);
    var card = document.createElement('div');
    card.className='card';
    card.id='card'+String(array_count);
    var cardContent = document.createElement('p');
    cardContent.textContent = mat+' - '+bran+'   '+per+'/'+inf;
    
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '30');
    svgElement.setAttribute('height', '10');
    var rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectElement.setAttribute('width', '30');
    rectElement.setAttribute('height', '10');
    rectElement.setAttribute('fill', color);
    svgElement.appendChild(rectElement);
  
    var button = document.createElement('button');
    button.className= 'delBtn';
    button.id=String(array_count);
    button.onclick=function() { removeCard(button.id)};
    var icon = document.createElement('i');
    icon.className = 'fa fa-trash'; // Add the appropriate class for the desired icon
  
    // Append the icon to the button
    button.appendChild(icon);
  
  
    card.appendChild(svgElement);
    card.appendChild(cardContent);
    card.appendChild(button);
    row.appendChild(card);
  
  
    var cardContainer = document.getElementById('legend');
    cardContainer.appendChild(card);
  
  }
  
  function removeDivById(divId) {
    var div = document.getElementById(divId);
  
    if (div) {
      div.parentNode.removeChild(div);
    }
  }
  
  