function GetChart(){

  const width = 800;
  const height = 400;

  const tooltip = d3.select("#chartHolder")
    .append("div")
    .attr("id","tooltip")
    .style("opacity",0)

  const overlay = d3.select('#chartHolder')
    .append('div')
    .attr('id', 'overlay')
    .style('opacity', 0);

  const charContainer = d3.select("#chartHolder")
                          .append("svg")
                          .attr("width",width+100)
                          .attr("height",height+70)
  const JsonData = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  fetch(JsonData)
  .then(response => response.json())
  .then(data => {    
    const fromDate = data.from_date.split('-')[0];
    const toDate = data.to_date.split('-')[0];
    const GDP = data.data.map((gdp)=>{return gdp[1]})
    const maxGdp= d3.max(GDP)
    const yearsDate = data.data.map((d)=>{return new Date(d[0])})
    const maxDate = new Date(d3.max(yearsDate));
    maxDate.setMonth(maxDate.getMonth() + 3);
    //creat X AND Y AXIS
    var xScale = d3.scaleTime()
                   .domain([d3.min(yearsDate),maxDate])
                   .range([0,width])
    var xAxis = d3.axisBottom()
                  .scale(xScale)
    charContainer.append('g')
                 .call(xAxis)
                 .attr("id","x-axis")
                 .attr("class","tick")
                 .attr('transform', 'translate(70, 420)')
                 
    var yScale = d3.scaleLinear()
                   .domain([maxGdp,0])
                   .range([0,height])
    var yAxis = d3.axisLeft()
                  .scale(yScale)
    charContainer.append('g')
                 .call(yAxis)
                 .attr("id","y-axis")
                 .attr("class","tick")
                 .attr('transform', 'translate(70, 20)')
    
    //TEXT FOR AXIS
    charContainer.append("text")
                  .style('fill', '#EDF2F4')
                  .style("font-size", "0.8em")
                  .attr('x', width /2 + 120 )
                  .attr('y', height + 60)
                  .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    charContainer.append("text")
                 .style('fill', '#EDF2F4')
                 .style("font-size", "0.8em")
                 .attr('transform', 'rotate(-90)')
                 .attr('x', -200)
                 .attr('y', 90)
                 .text('Gross Domestic Product');
    //RECT
    const linearScale = d3.scaleLinear().domain([0, maxGdp]).range([0, height]);
    const scaledGPD = GDP.map(sGPD=>{return linearScale(sGPD)})
   var years = data.data.map(function (item) {
    var quarter;
    var temp = item[0].substring(5, 7);
    switch(temp){
      case "01":
        quarter = 'Q1';
        break;
      case "04":
        quarter = 'Q2';
        break;
      case "07":
        quarter = 'Q3';
        break;
      case "10":
        quarter = 'Q4';
        break;  
    }
    return item[0].substring(0, 4) + ' ' + quarter;
  });


    
    const rect = d3.select("svg")
                   .selectAll("rect")
                   .data(scaledGPD)
                   .enter()
                   .append("rect")
                   .style('fill', '#8D99AE')
                   .attr("class","bar")
                   .attr('data-date',(d,i)=>{return data.data[i][0]})
                   .attr('data-gdp',(d,i)=>{return data.data[i][1]})
                   .attr('x',  (d,i)=>{return xScale(yearsDate[i])})
                   .attr('y',(d)=>{return height - d})
                   .attr("width", width / 210)
                   .attr("height",(d)=>{return d})
                   .attr('transform', 'translate(70, 20)')
                   .attr("position",(d,i)=>i)
                   .on("mouseover",(event,d)=>{
                    let position = event.target.getAttribute("position");
                    d3.select(event.target).style("fill", "#2B2D42");
                    tooltip.transition()
                           .duration(0)
                           .style("opacity",0.9)
                    tooltip.html(
                            years[position] +
                            '<br>' +
                            '$' +
                            GDP[position].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                            ' Billion'
                           )
                           .attr('data-date', data.data[position][0])
                           .style('left', position * width/270 + 'px')
                           .style('transform', `translate(${position * width/270}px,380px)`)
                           .style('background-color', '#8D99AE');
                   })
                   .on('mouseout', function () {
                    tooltip.transition().duration(200).style('opacity', 0);
                    d3.selectAll(".bar").style("fill", "#8D99AE");
                  });


  })
}