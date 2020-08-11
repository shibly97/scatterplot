const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let data;

let req = new XMLHttpRequest;
req.open('GET',url,true)
req.send()
req.onload = () => {    
    data = JSON.parse(req.responseText);
    console.log(data)

    drawSvg()
    genarateScales()
    drawAxis()
    drawCir()
}

let height = 600
let width = 800
let padding = 40

let widthScale
let heightScale
let xAxisScale
let yAxisScale

let drawSvg = () =>{
    d3.select('body').append('svg').attr('width',width).attr('height',height)
}

let genarateScales = () =>{
    let dateData = data.map((object) =>{ 
        return new Date(object['Year'],0,0,0,0,0,0)})
    
    let oneYear = new Date(1,0,0,0,0,0,0)

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(dateData),d3.max(dateData)])
                   .range([padding,width-padding])
    // use date objects to get dates. its easy.    
    let timeData = data.map((object)=>{
        return new Date(0,0,0,0,0,object['Seconds'],0)   }
    )

    yAxisScale = d3.scaleTime()
                   .domain([d3.min(data,(object)=>{
                    return new Date(0,0,0,0,0,object['Seconds'],0)    
                    }),
                    d3.max(data, (object)=>{
                    return new Date(0,0,0,0,0,object['Seconds'],0)    })])
                   .range([padding,(height-padding)])

    // widthScale = d3.scaleLinear()
    //                .domain([0,data.length])
    //                .range([padding,width-padding])

    // heightScale = d3.scaleLinear()
    //                 .domain([0,d3.max(timeData)])
    //                 .range(0,height-(2*padding))
}

let drawAxis = () =>{
    
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)
                  .tickFormat(d3.timeFormat('%M:%S'))

    let svg = d3.select('svg')

    svg.append('g')
       .call(xAxis)
       .attr('id',"x-axis")
       .attr('transform','translate(0,'+(height-padding)+')')


    svg.append('g')
       .call(yAxis)
       .attr('id',"y-axis")
       .attr('transform','translate('+(padding)+',0)')
}

let drawCir = () =>{
    let tooltip =    d3.select('body')
                       .append('div')
                       .attr('id','tooltip')
                       .style('visibility','hidden')

    d3.select('svg')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class','dot')
      .attr('r', '7')
      .attr('data-xvalue',(object)=>{return object['Year']})
      .attr('data-yvalue',(object) =>{return new Date(0,0,0,0,0,object['Seconds'],0) })
      .attr('cx',(object)=>{return xAxisScale(new Date(object['Year'],0,0,0,0,0,0))})
      .attr('cy',(object) =>{return yAxisScale( new Date(0,0,0,0,0,object['Seconds'],0) )})
      .attr('fill',(object)=>{
          if (object.URL == ''){
            return 'dark green'
          }
          else{
              return 'red'
          }
      })
      .on('mouseover',(object)=>{
        tooltip.transition()
        .style('visibility','visible')
        if (object['URL']==''){
            tooltip.text('Name - '+object['Name'] + ' ** Has no alleged drug use')
        }else{
            tooltip.text('Name - '+object['Name'] + ' ** Alleged drug use due to high hermatocrit levels')
        }
        
        tooltip.attr('data-year', object['Year'])
      })
      .on('mouseout',(object)=>{
          tooltip.transition()
          .style('visibility','hidden')
      })

    d3.select('svg')
      .append('g')
      .attr('id','legend')
      .append('rect')
      
      
}
