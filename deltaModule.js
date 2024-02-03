;
const deltaChart = {
    title: {
        text: null
    },
    chart: {
        type: "column"
    },
    boost: {
        useGPUTranslations: true
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: { text: "MWh" }
    },

    legend: {
        enabled: true
    },
    plotOptions: {

        column: {
            stacking: 'normal',
            pointPadding: 0,
            borderWidth: .1,
            groupPadding: 0.00,
            dataLabels: {
                enabled: false
            }
        }
    },
}

const deltaModule = {

     MODE : Object.freeze(
        {
            Units: 0,
            Fuels: 1
        }),
        columnsFriendlyNames :  Object.freeze(
        {
            lAvailability: 'Left Availability',
            rAvailability: 'Right Availability',
            lOutage: 'Left Outage',
            rOutage: 'Right Outage',
            deltaOutage: 'Outage Delta',
            deltaAvailability: 'Outage Availability',
        }),
    CHARTS : Object.freeze(
        {
            lAvailability: 0,
            rAvailability: 1,
            lOutage: 2,
            rOutage: 3,
            deltaOutage: 4,
            deltaAvailability: 5
        }),
         groupedXYToSeries : function(grouped) {
            let gr1 = Object.groupBy(grouped, ({ key }) => JSON.stringify(key))
            let entries = Object.entries(gr1)
            let series = entries.map((o) => { return { ...JSON.parse(o[0]), data: o[1].map((x) => x.xy) } });
            console.log(series)
    
            return series;
        },
    addButtons: function () {
        let html = `<div class="btn-group clCharts hiding2" role="group">
        <input type="radio" class="btn-check " name="btnRadioK" id="btnRadioK1" autocomplete="off" checked value="0">
        <label class="btn btn-outline-primary" for="btnRadioK1">16 weeks</label>
        <input type="radio" class="btn-check" name="btnRadioK" id="btnRadioK2" autocomplete="off" value="1">
        <label class="btn btn-outline-primary" for="btnRadioK2">2 years</label>
        <div class="btn-group" role="group" id="dvColumnButtons"></div>
        <div class="btn-group" role="group" id="dvChangesButtons"></div>
    </div>
   `;

        return html;
    },
    addTable: function (items) {
        let tb0 = `<table class="T2" border=3><thead><th>Fuel</th><th>Plant</th><th>Unit</th><th>Capacity (MW)</th><th>Date</th>
        <th>lhs Outage</th>
        <th>rhs Outage</th>
        <th>outage delta</th>
        <th>lhs Available</th>
        <th>rhs Available</th>
        <th>available delta</th>
        </thead>
        <tbody>`;

        items.forEach(element => {
            tb0 += '<tr>';
            tb0 += '<td style="background-color:' + element.colour + 'a9">';
            tb0 += element.fuelName;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.plant;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.unit;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.lCapacity;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.day;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.lOutage;
            tb0 += '</td>';
            tb0 += '<td class ="searchText">';
            tb0 += element.rOutage;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.deltaOutage;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.lAvailability;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.rAvailability;
            tb0 += '</td>';
            tb0 += '<td>';
            tb0 += element.deltaAvailability;
            tb0 += '</td>';
            tb0 += '</tr>';
        })
        tb0 += '</tbody>';
        return tb0;
    },
}

const deltaPage = {
    setLeftAndRightDatesDropdowns() {
        $("#sl2").empty();
        let x23 = document.getElementById("sl2");

        addOptions(x23, outagesObj.publishedDates)

        $("#sl3").empty();
        let x2 = document.getElementById("sl3");
        addOptions(x2, outagesObj.publishedDates)

        globalVariable.byDate = outagesObj.publishedDates.slice(-1)[0];
    },
    reDrawTable: function () {



        let tableDiv = document.querySelector('#dvTable2');

        if (globalVariable.btnRadioValue == 0) {
            let q = globalVariable.filterLabel === '*' ? deltaObj.deltaSeries : deltaObj.deltaSeries.filter(x => x.fuelName == globalVariable.filterLabel)
            tableDiv.innerHTML = deltaModule.addTable(q);
        }
        else if (globalVariable.btnRadioValue == 1) {
            let q = globalVariable.filterLabel === '*' ? deltaObj.fuelDeltaSeries : deltaObj.fuelDeltaSeries.filter(x => x.fuelName == globalVariable.filterLabel)

            tableDiv.innerHTML = deltaModule.addTable(q);
        }

        else if (globalVariable.btnRadioValue == 2) {
            let q = deltaObj.groupedDeltaSeries;
            tableDiv.innerHTML = deltaModule.addTable(q);
        }
    },

    reDrawChart: function () {

        function run(columnIdx, dataframe, keyMakeFunc, fuelPattern, onlyThoseChange) {

            let columnName = Object.keys(deltaModule.CHARTS)[columnIdx].toString();

            if (fuelPattern != "*")
                dataframe = dataframe.filter(x => x.fuelName == fuelPattern)

            if (onlyThoseChange)
                dataframe = dataframe.filter(x => x.deltaOutage > 0)

            let keyShape = dataframe.map((o) => { return { key: keyMakeFunc(o), xy: [o.dt, o[columnName]] }; })

            let extraOptions = {
                tooltip: {
                    footerFormat: '{series.userOptions.tag}'
                }
            };

            let series =  deltaModule.groupedXYToSeries(keyShape)
            addChart(series, "dvChart2", { ...deltaChart, ...extraOptions });
        }

        let modeIn = globalVariable.btnRadioValue;
        let fuelPattern = globalVariable.filterLabel ;
        let onlyThoseChange = globalVariable.isChangesOnly ;
        let columnIdx = globalVariable.columnIdx;

        if (modeIn == deltaModule.MODE.Units)
            run(columnIdx, deltaObj.deltaSeries, (o) => { return { name: o.plant, color: o.color, tag: o.fuelName } }, fuelPattern, onlyThoseChange);
        else
            run(columnIdx, deltaObj.fuelDeltaSeries, (o) => { return { name: o.fuelName, color: o.color, tag: o.plant + " plants" } }, fuelPattern, onlyThoseChange);
    },

    disableFuelButtons: function () {
        var buttonsDiv = document.getElementsByName('btnRadioB');
        var buttonsArray = [...buttonsDiv]
        console.log("mouse")
        if (globalVariable.btnRadioValue == 2) {
            buttonsArray.forEach(o => o.disabled = true);

        }
        else {
            buttonsArray.forEach(o => o.disabled = false);

        }
    },
    addExtraChartButtons: function () {
        var radioButtons = Object.keys(deltaModule.CHARTS).map((x, i) => radioButtonCreate.getAnRadioButton(i, deltaModule.columnsFriendlyNames[x], 'btnRadioColumn')).join('');
        document.querySelector('#dvColumnButtons').innerHTML = radioButtons;

        var radioButtons2 = ['All', 'Changes Only'].map((x, i) => radioButtonCreate.getAnRadioButton(i, x, 'btnRadioIsChanges')).join('');
        document.querySelector('#dvChangesButtons').innerHTML = radioButtons2;
    },
    dispatch: function (message) {
        switch (message.key) {

            case "switchChart":
                globalVariable.btnRadioValue = message.value;
                this.disableFuelButtons();
                break;

            case "twoYears":
                globalVariable.isTwoYears = message.value;
                break;

            case "filter":
                var name = globalVariable.uniqueFuels[message.value];
                globalVariable.filterLabel = name;
                break;

            case "latest":
                globalVariable.isLatestOnly = message.value;
                break;

            case "byDate":
                globalVariable.byDate = message.value;
                break;
                case "byColumn":
                    globalVariable.columnIdx = message.value;
                    break;
                case "isChangesOnly":
                    globalVariable.isChangesOnly = message.value == 1;
                    break;
        }

        this.reDrawTable()
        this.reDrawChart();
    },

    setUpEventListeners: function () {

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioA', (v) =>
            deltaPage.dispatch({ key: 'switchChart', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioB', (v) =>
            deltaPage.dispatch({ key: 'filter', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioE', (v) =>
            deltaPage.dispatch({ key: 'latest', value: v }));

        radioButtonCreate.setUpEventListenersRadioButton('btnRadioK', (v) =>
            deltaPage.dispatch({ key: 'twoYears', value: v }));

            radioButtonCreate.setUpEventListenersRadioButton('btnRadioColumn', (v) =>
            this.dispatch({ key: 'byColumn', value: v }));

            radioButtonCreate.setUpEventListenersRadioButton('btnRadioIsChanges', (v) =>
            this.dispatch({ key: 'isChangesOnly', value: v }));


        document.getElementById("sl2").onchange = function (x) {

            console.log(this.value)
            deltaPage.dispatch({ key: 'byDate', value: this.value });
        }
    },
    onLoad: function () {

        globalVariableAdd( {
            columnIdx: 0,
            isChangesOnly: 0,
        });

        document.querySelector('#dvFirst').insertAdjacentHTML('afterbegin', deltaModule.addButtons());
        this.addExtraChartButtons();
        this.setLeftAndRightDatesDropdowns();
        //TableFilterModule.initialiseNumberInputBox('#myInput', TableFilterModule.filterTable)

        this.reDrawChart();
        this.reDrawTable();

        this.setUpEventListeners();
    }
}