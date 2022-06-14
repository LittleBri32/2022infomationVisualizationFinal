{
    document.querySelector('.svg-init-wrapper-1').style.display = 'none';
    document.querySelector('#tag-a-title').style.display = 'none';
    document.querySelector('.svg-init-wrapper-2').style.display = 'none';
    document.querySelector('#tag-b-title').style.display = 'none';
}
async function getJsonData(url) {
    const data = await d3.json(url);
    return data;
}
function updateExtraData(type) {
    const beginDate = document.querySelector('input[type="date"][id="beginDate"]')
    const beginYear = beginDate.value.split('-')[0];
    const searchDate = document.querySelector('input[type="date"][id="searchDate"]')
    const searchYear = searchDate.value.split('-')[0];
    const beginMonth = parseInt(beginDate.value.split('-')[1]);
    const searchMonth = parseInt(searchDate.value.split('-')[1]);
    const data = getJsonData("https://raw.githubusercontent.com/JanTan169/Information-Visualization-Final-Project/main/Earthquake.json");
    const tagA_Title = document.querySelector('#tag-a-title');
    const tagB_Title = document.querySelector('#tag-b-title');
    document.querySelector('.svg-init-wrapper-1').style.display = 'block';
    document.querySelector('#tag-a-title').style.display = 'block';
    document.querySelector('.svg-init-wrapper-2').style.display = 'block';
    document.querySelector('#tag-b-title').style.display = 'block';
    if (type == 0) {
        tagA_Title.innerText = `${beginYear}年${beginMonth}月長條圖`;
        tagB_Title.innerText = `${beginYear}年${beginMonth}月散點圖`;
    } else {
        tagA_Title.innerText = `${searchYear}年${searchMonth}月長條圖`;
        tagB_Title.innerText = `${searchYear}年${searchMonth}月散點圖`;
    }
    {
        d3.selectAll("path").remove();
        d3.selectAll("text").remove();
        d3.selectAll("svg").remove();
    }
    data.then(res => {
        let filteredData = null
        if (type == 0) {
            filteredData = res.filter(e => e.Year === `${beginYear}` && e.Month == `${beginMonth}`);
        } else {
            filteredData = res.filter(e => e.Year === `${searchYear}` && e.Month == `${searchMonth}`);
        }
        console.log(filteredData)
        updateBarChart(filteredData);
        updateScatterPlot(filteredData);
    })
}
function updateScatterPlot(filteredData) {
    // 
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 640 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    const svg = d3.select("body")
        .select('.svg-init-wrapper-2')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
        //這裡是y軸芮氏規模的範圍(3.0 ~ 9.0)
        .domain([3.0, 9.0])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([0, 500])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    d3.csv("https://raw.githubusercontent.com/JanTan169/Information-Visualization-Final-Project/main/Earthquake.csv").then(function (data) {
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("cx", function (d) { return x(d.MagnitudeValue); })
            .attr("cy", function (d) { return y(d.MinimumDistance); })
            .attr("r", 1.5)
            .style("fill", function (d) {
                const depth = parseFloat(d.Depth);
                if (0 <= depth && depth < 30.0) {
                    return '#BBBDF6';
                }
                else if (30.0 <= depth && depth < 70.0) {
                    return '#70A288';
                }
                else {
                    return '#E40066';
                }
            });
    })
}
function updateBarChart(filteredData) {
    //這裡把註解的部分全部打開，就會顯示2.0~2.9的資料
    const staticData = [
        // {
        //     'name':"2.0~2.9",'value': 0
        // },
        {
            'name': "3.0~3.9", 'value': 0
        },
        {
            'name': "4.0~4.9", 'value': 0
        },
        {
            'name': "5.0~5.9", 'value': 0
        },
        {
            'name': "6.0~6.9", 'value': 0
        },
        {
            'name': "7.0~7.9", 'value': 0
        },
        {
            'name': "8.0~8.9", 'value': 0
        },
        {
            'name': ">9.0", 'value': 0
        }
    ];
    // 過濾當年當月資料
    filteredData.forEach(e => {
        const rScale = parseFloat(e.MagnitudeValue);
        // if(2.0 <= rScale && rScale <= 2.9){
        //     staticData.find(item=>item.name==='2.0~2.9').value+=1;
        // }
        if (3.0 < rScale && rScale <= 3.9) {
            staticData.find(item => item.name === '3.0~3.9').value += 1;
        }
        else if (4.0 < rScale && rScale <= 4.9) {
            staticData.find(item => item.name === '4.0~4.9').value += 1;
        }
        else if (5.0 < rScale && rScale <= 5.9) {
            staticData.find(item => item.name === '5.0~5.9').value += 1;
        }
        else if (6.0 < rScale && rScale <= 6.9) {
            staticData.find(item => item.name === '6.0~6.9').value += 1;
        }
        else if (7.0 < rScale && rScale <= 7.9) {
            staticData.find(item => item.name === '7.0~7.9').value += 1;
        }
        else if (8.0 < rScale && rScale <= 8.9) {
            staticData.find(item => item.name === '8.0~8.9').value += 1;
        }
        else if (rScale >= 9.0) {
            staticData.find(item => item.name === '>9.0').value += 1;
        }
    })

    var barsWidth = 500,
        barsHeight = 400,
        axisMargin = 100;
    var chartHeight = barsHeight + axisMargin,
        chartWidth = barsWidth + axisMargin;

    let svg = d3.select("body")
        .select(".svg-init-wrapper-1")
        .append("svg")
        .attr("width", 640)
        .attr("height", 480)

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(staticData, function (d) {
            return d.value;
        })])
        .rangeRound([barsHeight, 0]);

    let xScale = d3.scaleBand()
        .domain(
            staticData.map(
                function (d) {
                    return d.name;
                }
            )
        )
        .rangeRound([0, barsWidth])
        .padding(0.1);
    // 
    var bars = svg.append('g')
        .attr('id', "bars-container");
    bars.selectAll('.bar')
        .data(staticData)
        .enter().append("rect")
        .attr('class', "bar")
        .attr('x', function (d) {
            return xScale(d.name);
        })
        .attr('y', function (d) {
            return yScale(d.value);
        })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return barsHeight - yScale(d.value); });

    bars.attr('transform', 'translate(' + axisMargin + ',0)');
    yAxis = svg.append('g')

        .attr('id', 'y-axis')
        .call(d3.axisLeft(yScale).ticks(10))
        .attr('transform', 'translate(' + axisMargin + ',0)');

    xAxis = svg.append('g')
        .attr('id', 'x-axis')
        .call(d3.axisBottom(xScale))
        .attr('transform', 'translate(' + axisMargin + ',' + barsHeight + ')')
        .selectAll("text")
        .style("text-anchor", 'start')
        .attr('transform', 'rotate(45)');
}
