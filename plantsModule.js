;
const plantsChartOptions = {

    chart: {
        type: "column"
    },

    xAxis: {
        // labels: { enabled: true },
        //  categories: ['Green', 'Pink'],
        type: 'category'
    },
    yAxis: {
        title: { text: "MWh" }
    },
    legend: {
        enabled: false
    },
    plotOptions: {

        column: {
            pointPadding: 0,
            borderWidth: .1,
            groupPadding: 0.00,
            // pointWidth: 0.1,
            //stacking: 'normal',
            dataLabels: {
                enabled: false
            }
        }
    },
    tooltip: {
        footerFormat: '{point.point.options.tag}'
    }
}

const plantsModule = {

    addTable: function (items) {
        let tb0 = '<table class="T2" border=3><thead><th>Fuel</th><th>Plant</th><th>Unit</th><th>Capacity</th></thead>';//<th>Outages</th>

        items.forEach(element => {

            tb0 += '<tr >';
            tb0 += '<td style="background-color:' + element.color + 'a9">';
            tb0 += element.fuel;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.plant;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.unit;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.y;
            tb0 += '</td>';

            // tb0 += '<td>';
            // tb0 += element.futureOutages;
            // tb0 += '</td>';
            tb0 += '</tr>';
        })

        return tb0;
    },


}

const plantsPage = {

    setUnitMenu() {
        $("#sl2").empty();
        var x2 = document.getElementById("sl2");

       
        
           
            var option = document.createElement("option");
            option.text = globalVariable.byDate;
            option.value = globalVariable.byDate;
            x2.add(option, globalVariable.byDate);
            
            option.selected = true;
           
            x2.disabled = true;

    
     
    },

    reDrawChart: function reDrawChart() {
        if (globalVariable.btnRadioValue == 0) {
            var q = globalVariable.filterLabel === '*' ? plantsObj.plantsTable : plantsObj.plantsTable.filter(x => x.fuel == globalVariable.filterLabel)
            let seriesLabel = globalVariable.filterLabel === '*' ? "All fuels" : globalVariable.filterLabel
           
            let newSeries = [{ name: "", data: q }]
            console.log(newSeries)
            addChart(newSeries, "dvChart", plantsChartOptions);
        }
        else {
            var q = globalVariable.filterLabel === '*' ? plantsObj.groupedPlantsTable : plantsObj.groupedPlantsTable.filter(x => x.fuel == globalVariable.filterLabel)
            let seriesLabel = ""
            let newSeries = [{ name: seriesLabel, data: q }]
            addChart(newSeries, "dvChart", plantsChartOptions);
        }
    },

    reDrawTable: function reDrawTable() {
        let tableDiv = document.querySelector('#dvTable');
        if (globalVariable.btnRadioValue == 0) {
            var q = globalVariable.filterLabel === '*' ? plantsObj.plantsTable : plantsObj.plantsTable.filter(x => x.fuel == globalVariable.filterLabel)
            tableDiv.innerHTML = plantsModule.addTable(q);
        }
        else {
            var q = globalVariable.filterLabel === '*' ? plantsObj.groupedPlantsTable : plantsObj.groupedPlantsTable.filter(x => x.fuel == globalVariable.filterLabel)

            tableDiv.innerHTML = plantsModule.addTable(q);
        }
    },

    dispatch: function (message) {
        switch (message.key) {
            case "byUnit":
                globalVariable.btnRadioValue = message.value;
                break;

            case "filter":
                globalVariable.filterLabel = globalVariable.uniqueFuels[message.value];
                break;
        }

        this.reDrawChart();
        this.reDrawTable()
    },

    setUpEventListeners: function () {
        radioButtonCreate.setUpEventListenersRadioButton('btnRadioB', (v) =>
            this.dispatch({ key: 'filter', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioA', (v) =>
            this.dispatch({ key: 'byUnit', value: v }));
    },

    onLoad: function () {
            this.setUpEventListeners();
            this.dispatch({ key: 'filter', value: 0 });
            this.setUnitMenu() ;
        
    }
}