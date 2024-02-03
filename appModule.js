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
   

     redrawCharts: function() {
        if(typeof $('#dvChart').highcharts() !== 'undefined')
        {
            $('#dvChart').highcharts().reflow();
        }
      
      
    },

    dispatch: function (message) {
        console.log(message);
        switch (message.key) {
           
            case "toggle":
                globalVariable.showTable = message.value;
                this.reToggleChartAndTable();
                break;
        }

       this.redrawCharts();
    },

    setUpEventListeners: function () {
      
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
            byDate :'1977-01-12'
        });
        
        let ids = plantsObj.plantsTable.map(x => x.fuel).sort();
        globalVariable.uniqueFuels = ['*', ...new Set(ids)];

        this.addFuelRadioButtons();
    }
}