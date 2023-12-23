const getCurrencies = () => {
    const selectCurrencyTag = document.querySelector('#currency');

    fetch('https://mindicador.cl/api') // se hace el llamado al servicio
        .then(response => response.json()) // nos responde y trasformamos el valor a json
        .then(currencies => { // tenemos acceso al objeto
            console.log(currencies);

            for (let key in currencies) { // recorremos el objeto
                if (key !== 'version' && key !== 'autor' && key !== 'fecha') { // descartamos las que no nos interesa

                    let option = document.createElement("option") // crea un elemento option html
                    option.value = currencies[key].valor;
                    option.text = currencies[key].nombre;
                    option.id = currencies[key].codigo;

                    selectCurrencyTag.add(option) // incluimos las opciones en el html del select
                }
            }
        })
        .catch(error => { //manejamos el error
            alert("Ocurrió un error al obtener las monedas")
            console.log(error);
        });
}

// función de calculo
const calculate = () => {
    // se tomaron los elementos html
    const selectCurrency = document.querySelector('#currency');
    const input = document.querySelector('#inputValue');
    const result = document.querySelector('#result');



    let selectEDCurrency = selectCurrency.value;
    let value = input.value;

    result.innerHTML = (value / selectEDCurrency).toFixed(2); // valor con decimales
    
    let options = selectCurrency.options;
    let currencyType = options[options.selectedIndex].id;

    console.log(currencyType);

    generateChart(currencyType);
}


//generar grafico
const generateChart = (currencyType) => {
    fetch('https://mindicador.cl/api/'+currencyType) // se hace el llamado al servicio
    .then(response => response.json()) // nos responde y trasformamos el valor a json
    .then(data => { 
        const ctx = document.getElementById('myChart');
        ctx.innerHTML = ''; // limpiamos el canvas

        const temporalDiv = document.createElement('canvas');

        new Chart(temporalDiv, {
            type: 'line',
            data: {
                labels: data.serie.map((value) => value.fecha),
                datasets: [{
                    label: 'Cambio en el tiempo',
                    data: data.serie.map((value) => value.valor),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        ctx.appendChild(temporalDiv);
        
    })
    .catch(error => { //manejamos el error
        alert("Ocurrió un error al obtener las monedas")
        console.log(error);
    });

}

// 1 - llamado inicial de la funcion getCurrencies
// es lo primero que ocurre cuando se carga la pagina
getCurrencies();

// se agrega un evento click al boton convertir y se llama la funcion de calculo
const convert = document.querySelector('#convert');
convert.addEventListener('click', calculate);