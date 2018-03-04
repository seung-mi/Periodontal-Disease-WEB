// 애니메이션 파이그래프 시작
// set data
var domain =["치은염 및 치주질환", "급성 기관지염", "치아우식", "급성 편도염", "앨러지성 비염"];
var dataA = [35, 26, 14, 13, 12];
var dataB = [31, 29, 15, 13, 12];
var dataC = [37, 28, 12, 12, 11];
var dataD = [35, 23, 18, 12, 12];
var dataE = [29, 25, 21, 13, 12];

// set radian
var R = 400 / 2; 

// set color
var color = d3.scaleOrdinal()
    .domain(domain)
    .range(["#C6EDF4", "#9ADDED", "#88CFE5","#69C2D6","#49AFBF"]);

var color2 =  d3.scaleOrdinal()
    .domain(domain)
    .range(d3.schemeCategory20b);

// set pie graph
var pie = d3.pie();
var arc = d3.arc().innerRadius(R/2).outerRadius(R);
var svg = d3.select("#first-pie-graph1-svg")

drawPieGraphTrans(dataA);
d3.selectAll("input").on("change", changed);
function changed() {
    if (this.value === "dataA") {
        drawPieGraphTrans(dataA);
    }else if (this.value === "dataB") {
        drawPieGraphTrans(dataB);
    }else if (this.value === "dataC") {
        drawPieGraphTrans(dataE);
    }else if (this.value === "dataD") {
        drawPieGraphTrans(dataD);
    }else {
        drawPieGraphTrans(dataE);
    }
}


function drawPieGraphTrans(data) {
    var thisData = data;
//    console.log(thisData);
   
    var slice = svg.selectAll("path.slice").data(pie(data));
    slice.enter().append("path")
        .style("fill", function(d, i){return color(i)})
        .attr("class", "slice")
        .attr("transform", "translate(" + 700 / 2 + ", " + 450 / 2 + ")")
        .on("mouseover", function (d, i) {
            svg.append("text")
                .attr("dy", ".5em")
                .style("text-anchor", "middle")
                .style("font-size", 15)
                .style("font-weight", 400)
                .attr("class","label")
                .attr("transform", "translate(" + 700 / 2 + ", " + 450 / 2 + ")")
                .style("fill", function(d,i){return "#E0635A";})
                .text(domain[i]+": "+d.data+"%");
       
                console.log(d);

            d3.select(this)
                  .style("fill", "#E0635A");
        }).on("mouseout", function (d, i) {
            svg.select(".label").remove();
            d3.select(this).style("fill", function(){return color(i)})
        });
    
    slice = svg.selectAll("path.slice").data(pie(data));
        
    slice.transition().duration(500)
//        .delay(function(d, i){return i*10;})
        .ease(d3.easeCubic)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		});
    
    slice.exit().remove();
}
//애니메이션 파이그래프 끝


// 꺾은선 그래프 시작
var lineSvgWidth = 500;
var lineSvgHeight = 250;
var offsetX = 40;
var offsetY = 10;
var scale = 20;
var firstLineData = [5,7,9,10,11];
var marginSpacecraft = (lineSvgWidth-offsetX)/(firstLineData.length - 1);
var firstLineNale = ["2012","2013","2014","2015","2016","2017"];

drawLineScale(firstLineNale, marginSpacecraft,"#first-line-graph-svg");
drawLineGraph(firstLineData, marginSpacecraft, "#first-line-graph-svg", "spacecraft");

// 꺾은선 그래프를 표시하는 함수
function drawLineGraph(dataSet, margin, svgIDName, cssClassName) {
    // 꺾은선 그래프 좌표를 계산하는 메서드
    margin = margin - 2;
    var line = d3.line() // svg의 선
        .x(function(d, i) {
            return i * margin + offsetX + 40; //X 좌표는 표시 순서 X 간격
        })
        .y(function(d, i) {
            return lineSvgHeight - (d * scale) - offsetY;
        })

    // 꺾은선 그래프 그리기
    var lineElements = d3.select(svgIDName)
        .append("path")
        .attr("class", "lineGraph " + cssClassName)
        .attr("d", line(dataSet));

    //
    var circleElements = d3.select(svgIDName)
        .selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("class", "line-dot")
        .attr("cx", function(d, i){
            console.log(i);
            return i * margin + offsetX + 40;
        })
        .attr("cy", function(d, i){
            return lineSvgHeight - (d * scale) - offsetY;
        })
        .attr("r", 5)
        .on("mouseover", function(d, i){
            d3.select(this)
              .style("fill", "#E0635A");
            
            lineValue.append("text")
                .attr("x", i * margin + 75)
                .attr("y", lineSvgHeight - dataSet[i] * 15 - 10)
                .attr("class", "label")
                .style("font-size", 15)
                .style("font-weight", 600)
                .style("fill", function(d, i){return "#E0635A"})
                .text(dataSet[i]);
        })
        .on("mouseout", function(){
            d3.select(this)
              .style("fill", "#6EB3CE");
            
            lineValue.select(".label").remove();
        })
    
    var lineValue = d3.select(svgIDName).append("svg")
        .attr("width", 600)
        .attr("height", 250)
        .append("g")
}

//  그래프 눈금을 표시하는 함수
function drawLineScale(dataSet, margin, svgIDName) {
    margin = margin - 2;
    
    // 눈금 표시를 위한 스케일 설정
    var yScale = d3.scaleLinear() // 스케일 설정
        .domain([0, 12]) // 원래 크기
        .range([10 * scale, 0]) // 실제 표시 크기
    // 눈금 표시
    d3.select(svgIDName)
        .append("g")    // g요소 추가. 이것이 눈금을 표시하는 요소가 됨
        .attr("class", "axis")
        .attr("transform", "translate(" + offsetX + ", " + (offsetY + 10) + ")")
        .call(d3.axisLeft(yScale)); // 스케일 적용

    // 가로 방향의 선을 표시
    d3.select(svgIDName)
        .append("rect") // rect 요소 추가
        .attr("class", "axis") // CSS 클래스 지정
        .attr("width", lineSvgWidth) // 선의 길이를 지정
        .attr("height", 0.5)       // 선의 두께를 지정
        .attr("transform", "translate(" + offsetX + ", " + (lineSvgHeight - offsetY -20) +")");
    
    var textElements = d3.select(svgIDName)
        .selectAll("rect")
        .data(dataSet)
        .enter()
        .append("text")
        .attr("class", "lineBarName")
        .attr("x", function(d, i){
            console.log(i);
            return (i-1) * margin + 65;
        })
        .attr("y", lineSvgHeight-5)
        .text(function(d, i){
            return dataSet[i-1];
        })
}
// 꺾은선 그래프 끝

// 첫 번째 스태틱 파이 그래프 시작
var dataBasic = [25.8,21.3,16.1,14.1,10.9,7.2,2.3,1.4,0.9]; // 화성 대기 파이 그래프 데이터 셋
var domain1 =["50-59세","40-49세","60-69세","30-39세","20-29세","70-79세","10-19세","80세이상","0-9세"];
var pieWidth = 400;
var pieHeight = 400;

// 원 그래프 좌표값을 계산하는 메서드
var pie = d3.pie(); // 원 그래프 레이아웃

// 원 그래프의 안쪽 반지름, 바깥쪽 반지를 설정
var arc = d3.arc().innerRadius(90).outerRadius(160);

drawPieGraph(dataBasic);

function drawPieGraph(data) {
    // 원 그래프 그리기
    var pieElements = d3.select("#first-pie-graph-svg")
        .selectAll("path")
        .data(pie(data));
    // 데이터 추가 및 색 설정
    pieElements.enter() // 데이터 수만큼 반복
        .append("path") // 데이터 수만큼 path 요소가 추가됨
        .attr("class", "pieColor") // CSS 클래스 이름 설정
        .attr("d", arc) // 부채꼴 설정
        .attr("transform", "translate(200, 200)") // 그래프 중앙
        .style("fill", function (d, i) {
            return ["#C6EDF4", "#9ADDED", "#88CFE5","#69C2D6","#49AFBF","#329AA5","#1E7F84","#0B6363","#034240"][i]; // 배열 안의 색
        }).on("mouseover", function (d, i) {
            svgText.append("text")
                .attr("dy", ".5em")
                .style("text-anchor", "middle")
                .style("font-size", 15)
                .style("font-weight", 400)
                .attr("class","label")
                .style("fill", function(d,i){return "#E0635A";})
                .text(domain1[i]+": "+dataBasic[i]+"%");

            d3.select(this)
                  .style("fill", "#E0635A");
        }).on("mouseout", function (d, i) {
            svgText.select(".label").remove();

            d3.select(this).style("fill", function () {
                return ["#C6EDF4", "#9ADDED", "#88CFE5","#69C2D6","#49AFBF","#329AA5","#1E7F84","#0B6363","#034240"][i]; // 배열 안의 색
            })
        })
    
    var svgText = d3.select("#first-pie-graph-svg")
        .append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
        .attr("class", "pieText") 
        .append("g")
        .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");
    
    
}
// 첫 번째 스태틱 파이 그래프 끝



// 성별 바(남) 그래프 시작
var horizontalBarData = [246904,440125,1317262,1862180,3164587,3965029,2636679,1287964,256689];

drawHorizontalBarGraph(horizontalBarData);

function drawHorizontalBarGraph(data) {
    var barElements = d3.select("#first-bar-graph-svg")
    .selectAll("rect")
    .data(data)

    barElements.enter()
        .append("rect")
        .attr("x", 60)
        .attr("y", function(d, i){
            return i * 25;
        })
        .attr("width", function(d,i){
            return (d * 1/6000);
        })
        .attr("height", "15px")
        .style("fill", "#6EB3CE")
        .on("mouseover", function(d, i){
            d3.select(this)
              .style("fill", "#E0635A");

            barValue.append("text")
                .attr("x", 62)
                .attr("y", i * 25 + 11)
                .attr("class", "label")
                .style("font-size", 10)
                .style("font-weight", 600)
                .style("fill", function(d, i){return "#FFFFFF"})
                .text(data[i]);
        })
        .on("mouseout", function(){
            barValue.select(".label").remove();

            d3.select(this)
              .style("fill", "#6EB3CE");
        })

    barElements.enter()
        .append("text")
        .attr("class", "barName")
        .attr("x", 0)
        .attr("y", function(d, i){
            return i * 25 + 12;
        })
        .style("font-size", 12)
        .text(function(d, i) {
            return ["0 - 9세","10 - 19세","20 - 29세","30 - 39세","40 - 49세","50 - 59세","60 - 69세","70 - 79세","80세 이상"][i];
        })

    var barValue = d3.select("#first-bar-graph-svg").append("svg")
        .attr("width", 320)
        .attr("height", 240)
        .attr("class", "barValue")
        .append("g")

    var barTitle = d3.select("#first-bar-graph-svg")
        .append("text")
        .style("text-anchor", "middle")
        .style("font-weight", 400)
        .style("fill", "#5194A8")
        .attr("class", "bartitle") // 텍스트 CSS 이름 셀정
        .attr("transform", "translate(350, 250)") // 텍스트 중앙 하단
        .text("● 2016년 남"); // 텍스트
        
       
}
// 성별(남) 바 그래프 끝

// 성별 바(여) 그래프 시작
var horizontalBarData = [228630,503278,1582016,1805689,2683855,3672154,2546135,1391949,351082];

drawHorizontalBarGraph2(horizontalBarData);

function drawHorizontalBarGraph2(data) {
    var barElements = d3.select("#first-bar-graph2-svg")
    .selectAll("rect")
    .data(data)

    barElements.enter()
        .append("rect")
        .attr("x", 60)
        .attr("y", function(d, i){
            return i * 25;
        })
        .attr("width", function(d,i){
            return (d * 1/6000);
        })
        .attr("height", "15px")
        .style("fill", "#49AFBF")
        .on("mouseover", function(d, i){
            d3.select(this)
              .style("fill", "#E0635A");

            barValue.append("text")
                .attr("x", 62)
                .attr("y", i * 25 + 11)
                .attr("class", "label")
                .style("font-size", 10)
                .style("font-weight", 600)
                .style("fill", function(d, i){return "#FFFFFF"})
                .text(data[i]);
        })
        .on("mouseout", function(){
            barValue.select(".label").remove();

            d3.select(this)
              .style("fill", "#49AFBF");
        })

    barElements.enter()
        .append("text")
        .attr("class", "barName")
        .attr("x", 0)
        .attr("y", function(d, i){
            return i * 25 + 12;
        })
        .style("font-size", 12)
        .text(function(d, i) {
            return ["0 - 9세","10 - 19세","20 - 29세","30 - 39세","40 - 49세","50 - 59세","60 - 69세","70 - 79세","80세 이상"][i];
        })

    var barValue = d3.select("#first-bar-graph2-svg").append("svg")
        .attr("width", 320)
        .attr("height", 240)
        .attr("class", "barValue")
        .append("g")

    var barTitle = d3.select("#first-bar-graph2-svg")
        .append("text")
        .style("text-anchor", "middle")
        .style("font-weight", 400)
        .style("fill", "#329AA5")
        .attr("class", "bartitle") // 텍스트 CSS 이름 셀정
        .attr("transform", "translate(350, 250)") // 텍스트 중앙 하단
        .text("● 2016년 여"); // 텍스트
        
       
}
// 성별(여) 바 그래프 끝













