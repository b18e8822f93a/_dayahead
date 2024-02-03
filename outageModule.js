;
const outageChart =  {
    chart: {
        type: 'xrange'
    },
    title: {
        text: 'Highcharts X-range'
    },
    accessibility: {
        point: {
            descriptionFormat: '{add index 1}. {yCategory}, {x:%A %e %B %Y} to {x2:%A %e %B %Y}. {yCategory}'
        }
    },
    tooltip: {
        footerFormat: '{point.point.options.tag}'
    },
    xAxis: {
        type: 'datetime'
    },
   
    legend: {
        enabled: false
      },

}

const outageModule = {

    addButtons : function () {
        let html =`<div class="btn-group clCharts hiding2" role="group">
        <input type="radio" class="btn-check " name="btnRadioK" id="btnRadioK1" autocomplete="off" checked value="0">
        <label class="btn btn-outline-primary" for="btnRadioK1">16 weeks</label>
        <input type="radio" class="btn-check" name="btnRadioK" id="btnRadioK2" autocomplete="off" value="1">
        <label class="btn btn-outline-primary" for="btnRadioK2">2 years</label>
    </div>
    <div class="btn-group  btn-group clCharts hiding2" role="group">
        <input type="radio" class="btn-check" name="btnRadioJ" id="btnRadioJ2" autocomplete="off" checked value="0">
        <label class="btn btn-outline-primary" for="btnRadioJ2">Unavailabile</label>
        <input type="radio" class="btn-check " name="btnRadioJ" id="btnRadioJ1" autocomplete="off" value="1">
        <label class="btn btn-outline-primary" for="btnRadioJ1">Available</label>
    </div> `;

    return html;
    },
    addTable: function (items) {
        let tb0 = '<table class="T2" border=3><thead><th>Fuel</th><th>Plant</th><th>Unit</th><th>Capacity (MW)</th><th>Unavailable (MW)</th><th>Available (MW)</th><th>Fraction</th><th>Duration</th><th>Start</th><th>End</th><th>Published</th></thead><tbody>';

        items.forEach(element => {
            tb0 += '<tr>';
            tb0 += '<td style="background-color:' + element.colour +  'a9">';
            tb0 += element.fuelName;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.plant;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.unit;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.capacity;
            tb0 += '</td>';
            tb0 += '<td class ="searchText">';
            tb0 += element.volume;
            tb0 += '</td>';
         
            tb0 += '<td>';
            tb0 += element.availability;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.fraction;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.duration;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.startDate;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.endDate;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.publishedDate;
            tb0 += '</td>';
            tb0 += '</tr>';
        })
        tb0 += '</tbody>';
        return tb0;
    },
}

const outagePage = {
    dvTable : '#dvTable2',
    dvChart : 'dvChart2',
    pageLabel : 'Outages',
    setUnitMenu() {
        $("#sl2").empty();
        var x2 = document.getElementById("sl2");

        for (const o of outagesObj.publishedDates) {
            console.log(`${o}`);
            var option = document.createElement("option");
            option.text = o;
            option.value = o;
            x2.add(option, o);
            option.selected = true;
            globalVariable.byDate = o;
            x2.disabled = true
        };

        var option = document.createElement("option");
        option.text = '*';
        option.value = '*';
        // x2.add(option, '*');
    },
    reDrawTable: function () {

        var q0 = globalVariable.filterLabel === '*' ? outagesObj.outagesRows : outagesObj.outagesRows.filter(x => x.fuelName == globalVariable.filterLabel)
        //var q = globalVariable.isLatestOnly == '0' ? q0 : q0.filter(x => x.isLatest == 1)
        var q = q0.filter(x => x.publishedDate == globalVariable.byDate)

       
        let tableDiv = document.querySelector(this.dvTable);
        tableDiv.innerHTML = outageModule.addTable(q);
    },

    reDrawChart: function () {

        if (globalVariable.btnRadioValue == 1) {
            var q0 = globalVariable.filterLabel === '*' ? outagesObj. unitChartSeries : outagesObj.unitChartSeries.filter(x => x.label == globalVariable.filterLabel.replaceAll(' ', ''))
            var q = globalVariable.byDate === '*' ? q0 : q0.filter(x => x.key1 == globalVariable.byDate)
            var q3 = globalVariable.isTwoYears !== "0" ? q : q.map(o => { return { ...o, data: o.data.filter(x => x[2] === 0) }; });
            var q4 = globalVariable.isAvailability === "0" ? q3 : q3.map(o => { return { ...o, data: o.data.map(x => [x[0], x[3]]) }; });
            console.log(globalVariable.filterLabel.replace(' ', ''))
            console.log(globalVariable.isTwoYears, "isTwoYears")
            console.log(q4, "unit chart series")
            addChart(q4,this.dvChart, outageChart);
        }
        else {
           
      
        function splitDate(d) {
         
            var arr = d.split("-");

            let utcDate = Date.UTC(...arr)
            return utcDate;
        }

        let xyz = Object.entries(outagesObj.ganntSereis);

        var q0 = globalVariable.filterLabel === '*' ? xyz : xyz.filter(x => x[1][0].tag == globalVariable.filterLabel)
        

        console.log(q0);
        var categories = q0.map(o => o[0]);
        console.log(categories, 'pig')
        var data = q0.map((o,i) =>  o[1].map((x) =>{ return {...x, y:i }})).flat();

        var gr1 = Object.groupBy(data, ({color}) => color);

       
        var series =  [{ 
            // pointWidth: 2,
            pointPadding: .1,
            lineWidth:1,
          groupPadding: 0,
          name : '', 
          data :data,
        }]

          

       var theYaxis = {   yAxis: {
            title: {
                text: ''
            },
             categories: categories,
            reversed: true
        }}

        console.log(series, 'hi there')
            addChart(series, this.dvChart, {...outageChart, ...theYaxis});
        }
    },
    dispatch: function (message) {
        switch (message.key) {
            case "switchChart":
                globalVariable.btnRadioValue = message.value;
                this.reDrawChart();
                break;

            case "twoYears":
                globalVariable.isTwoYears = message.value;
                this.reDrawChart();
                break;

            case "isUnavailability":
                globalVariable.isAvailability = message.value;
                this.reDrawChart();
                break;
            case "filter":

                var name = globalVariable.uniqueFuels[message.value];
                globalVariable.filterLabel = name;
                this.reDrawTable()
                this.reDrawChart();
                break;

            case "latest":
                globalVariable.isLatestOnly = message.value;
                this.reDrawTable()
                break;

            case "byDate":
                globalVariable.byDate = message.value;
                this.reDrawTable()
                this.reDrawChart();
                break;


        }

    },


    setUpEventListeners: function () {

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioA', (v) =>
            outagePage.dispatch({ key: 'switchChart', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioB', (v) =>
            outagePage.dispatch({ key: 'filter', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioE', (v) =>
            outagePage.dispatch({ key: 'latest', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioK', (v) =>
            outagePage.dispatch({ key: 'twoYears', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioJ', (v) =>
            outagePage.dispatch({ key: 'isUnavailability', value: v }));

        document.getElementById("sl2").onchange = function (x) {

            console.log(this.value)
            outagePage.dispatch({ key: 'byDate', value: this.value });
        }
    },
    onLoad: function () {

        globalVariableAdd( {
          
            isLatestOnly: 0,
            byDate: '*',
            isTwoYears: "0",
            isAvailability: "0",
        });

        let dvFirst = document.querySelector('#dvFirst');
        //dvFirst.insertAdjacentHTML('afterbegin' , outageModule.addButtons());

        // let ids = outageRows.map(x => x.fuelName).sort();
        // globalVariable.uniqueFuels = ['*', ...new Set(ids)];
        // var radioButtons = ['units', 'fuels'].map((x, i) => radioButtonCreate.getAnRadioButton(i, x, 'btnRadioB')).join('');
        // var buttonsDiv = document.querySelector('#dvButtons');

        // buttonsDiv.innerHTML = radioButtons;
     
        
        outagePage.setUnitMenu();
        //TableFilterModule.initialiseNumberInputBox('#myInput', TableFilterModule.filterTable)

        outagePage.reDrawChart();
        outagePage.reDrawTable();

        outagePage.setUpEventListeners();

        appPage.dispatch({ key: 'toggle', value: 1 })
    }
}