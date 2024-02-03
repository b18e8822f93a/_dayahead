;
const appPage = {
    addFuelRadioButtons: function () {
        var radioButtons = globalVariable.uniqueFuels.map((x, i) => radioButtonCreate.getAnRadioButton(i, x, 'btnRadioB')).join('');

        document.querySelector('#dvButtons').innerHTML = radioButtons;
    },
    reToggleChartAndTable: function () {
        if (globalVariable.showTable == 1) {
            //e//lem.classList.add('hiding2');
            $('.dvTable').toggleClass("hiding2", true);//.hide();

            $('.dvChart').toggleClass("hiding2", false);
            $('.clCharts').toggleClass("hiding2", false);

        }
        else if (globalVariable.showTable == 2) {
            $('.dvTable').toggleClass("hiding2", true);//.hide();

            $('.dvChart').toggleClass("hiding2", false);
            $('.clCharts').toggleClass("hiding2", false);
        }
        else {

            $('.dvTable').toggleClass("hiding2", false);
            $('.dvChart').toggleClass("hiding2", true);
            $('.clCharts').toggleClass("hiding2", true);
        }
    },
    reLayout: function () {

        let cap = document.querySelectorAll(".cell3");
        let out = document.querySelectorAll(".cell2");

        // this was to hide but seems wierd to select nothing to show, maybe change in future
        if (globalVariable.showSections.length == 0) {

            for (let elem of cap)
                elem.classList.remove('hiding');

            for (let elem of out)
                elem.classList.remove('hiding');
            document.getElementById("gdMain").style.gridTemplateRows = "1fr 1fr";
        }
        else if (globalVariable.showSections.length == 2) {

            for (let elem of cap)
                elem.classList.remove('hiding');

            for (let elem of out)
                elem.classList.remove('hiding');
            document.getElementById("gdMain").style.gridTemplateRows = "1fr 1fr";
        }

        else if (globalVariable.showSections[0] == 0) {
            document.getElementById("gdMain").style.gridTemplateRows = "1fr";

            for (let elem of cap)
                elem.classList.remove('hiding');

            for (let elem of out)
                elem.classList.add('hiding');
        }
        else if (globalVariable.showSections[0] == 1) {
            document.getElementById("gdMain").style.gridTemplateRows = "1fr ";
            for (let elem of cap)
                elem.classList.add('hiding');

            for (let elem of out)
                elem.classList.remove('hiding');
        }
    },

     redrawCharts: function() {
        if(typeof $('#dvChart').highcharts() !== 'undefined')
        {
            $('#dvChart').highcharts().reflow();
        }
      
        if(typeof $('#dvChart2').highcharts() !== 'undefined')
        {
            $('#dvChart2').highcharts().reflow();
        }
    },

    dispatch: function (message) {
        console.log(message);
        switch (message.key) {
            case "layout":
                globalVariable.showSections = message.value;
                this.reLayout();
                break;
            case "toggle":
                globalVariable.showTable = message.value;
                this.reToggleChartAndTable();
                break;
        }

       this.redrawCharts();
    },

    setUpEventListeners: function () {
        radioButtonCreate.setUpEventListenersCheckboxButton('btnRadioD', (v) =>
            this.dispatch({ key: 'layout', value: v }));
         radioButtonCreate.setUpEventListenersRadioButton('btnRadioC', (v) =>
            this.dispatch({ key: 'toggle', value: v }));
    },

    onLoad: function () {
        globalVariableAdd({showSections :0, showTable : 0})

        this.setUpEventListeners();
        this.reToggleChartAndTable();

        globalVariableAdd({
            btnRadioValue: 0,
            uniqueFuels: [],
            filterLabel: '*',
        });
        
        let ids = plantsObj.plantsTable.map(x => x.fuel).sort();
        globalVariable.uniqueFuels = ['*', ...new Set(ids)];

      
        this.addFuelRadioButtons();
    }
}