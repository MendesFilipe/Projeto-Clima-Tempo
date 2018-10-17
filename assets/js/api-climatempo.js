//Função para utilizar a api do clima tempo
//São Passados dois parâmetros na API a cidade e o Estado
function consultaAPI(){
    // atribuo o valor informado no input para a minha variável "obj_cidade"
    var obj_cidade = $('input[name=cidade]').val();
    // atribuo a valor selecionado no dropdown para a minha variável "obj_uf"
    var obj_uf = $('a[name=uf]').text();
    // faço minha requisição a api via ajax para retornar o id da cidade pesquisada
    $.ajax({
        url: 'http://apiadvisor.climatempo.com.br/api/v1/locale/city?name='+obj_cidade+'&state='+obj_uf+'&token=c13dc6669359629b349dd67f1d9d271a',
        type: 'GET',
        async: true,
        // retorno o meu objeto data 
        success: function(data){
            // faço uma verificação se existiu retorno da api
            if(data[0] != undefined)
            {
                // se verdadeiro, eu passo o id da cidade para a função "retornaPrevisao"
                retornaPrevisao(data[0].id);
            }
            // se retornar falso, significa que a consulta não retornou nenhum elemento
            else{
                // sendo assim eu mostro o pop-up de erro. 
                setTimeout(function(){ $("#modal_trigger").trigger("click"); }, 300);
                
                // instancio o meu leanModal para configuração do pop-up
                $("#modal_trigger").leanModal({
                    top: 100,
                    overlay: 0.6,
                    closeButton: ".modal_close"
                });
            }
            
        },
        error: function(e){
            console.log(e);
        }
    });
}

// Nessa função eu passo o id da cidade para a minha API e retorno todas as informações sobre a previsão do tempo
function retornaPrevisao(id){
    // Se existirem cards na tela, eu os removo.
    $('#weather-wrapper div').remove();

    // faço minha requisição a api via ajax passando o "id" para retornar as informações necessarias
    $.ajax({
        url: 'http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/'+id+'/days/15?token=c13dc6669359629b349dd67f1d9d271a',
        type: 'GET',
        async: true,
        // retorno o meu objeto 
        success: function(climaTempo){
            // variável que irá receber meu html concatenado
            var card = "";
            // variável que irá receber o retorno da função "retornaPeriodoDia()"
            var aux_periodo = "";
            // variável que recebe a informação do dia  
            var dia = "";
            // variável que recebe a temperatura 
            var tempHoje = "";
            // variável que recebe o texto sobre o tempo
            var txtTempo = "";
            // variável que recebe o código do ícone
            var aux_iconcode = "";
            // variável que recebe o html do ícone  
            var aux_iconhtml = "";

            // aqui eu faço um Loop, para retornar apenas os três primeiros 
            // Tive que fazer assim, pois de acordo com a documentação da API do "climatempo"
            // Existem duas consultas para retornar as informações do Forecast
            // Uma por horas (72 horas) e outra por dia (15 dias)
            // Na consulta por horas, falta algumas informações necessárias
            // há consulta por dias possui todas as informações, mas a consulta por dias, exige que seja por 15 dias     
            for(var i=0; i<3; i++){

                // fiz uma função para retornar os dias da semana
                // aqui eu estancio uma variável que irá receber o dia atual de acordo com o retorno do meu objeto
                var aux_dia = climaTempo.data[i].date;
                var today = new Date(aux_dia);
                today.setDate(today.getDate() + 1);

                // são apresentados na tela 3 dias: hoje, amanhã e o próximo dia.
                // o card do dia atual e diferente dos demais
                // como eu estou trabalhando com index, o primeiro index será o meu dia atual. 
                if(i == 0)
                {
                    // de acordo com a documentação da API eu tenho diferentes retornos para cada período do dia
                    // então aqui eu fiz uma função onde eu retorno o período do dia.
                    aux_periodo = retornaPeriodoDia(climaTempo, i);
                    // fiz uma função que retorna o código do ícone
                    aux_iconcode = retornaTempoIcone(climaTempo, i);
                    // aqui eu retorno o html de acordo com o código do ícone
                    aux_iconhtml = retornaIcone(aux_iconcode);
                    // função que retorna o dia da semana
                    dia ='<h1>'+retornaDiaSemana(today)+'</h1>';
                    tempHoje ='<p class="temperature-txt">'+ aux_periodo +'º C'+'</p>';
                    // retorno o texto do tempo, exemplo: Sol, pancadas de chuva e trovoadas.
                    txtTempo ='<p class="temperature-info">'+climaTempo.data[i].text_icon.text.pt+'</p>';
                    // crio o meu card
                    card += '<div class="weather-card">'+dia+aux_iconhtml+tempHoje+txtTempo+'</div>';
                }
                // aqui eu monto o card dos próximos dias.
                else{
                    // função que retorna o dia da semana
                    dia ='<h1>'+retornaDiaSemana(today)+'</h1>';
                    // retorno a temperatura mínima e máxima 
                    temp_result ='<p class="temperature-prox-txt">'+'min: '+climaTempo.data[i].temperature.min+'º '+'máx: '+climaTempo.data[i].temperature.max+'º '+'</p>';
                    // retorno o texto do tempo.
                    info_previsao ='<p class="temperature-prox-info">'+climaTempo.data[i].text_icon.text.phrase.reduced+'</p>';
                    // crio o meu card
                    card += '<div class="weather-card">'+dia+temp_result+info_previsao+'</div>';
                }

            }

            // Insiro no meu html os card's da previsão do tempo
            $('#weather-wrapper').append(card);

        },
        error: function(e){
            console.log(e);
        }
    });

}

// Criei essa função para retornar a temperatura de acordo com o período do dia 
// exemplo: manhã, tarde e noite
function retornaPeriodoDia(climaTempo, index){
    // aqui eu estancio uma variável date 
    var ndate = new Date();
    // pego a hora atual
    var hr = ndate.getHours();
    // variável que recebe o retorno do objeto
    var periodo_temperatura = "";
    
    // condição para manhã
    if (hr < 12)
    {
        periodo_temperatura = climaTempo.data[index].temperature.morning.min;
    }
    // condição para tarde
    else if (hr >= 12 && hr <= 17)
    {
        periodo_temperatura = climaTempo.data[index].temperature.afternoon.min;
    }
    // condição para noite
    else if (hr >= 17 && hr <= 24)
        periodo_temperatura = climaTempo.data[index].temperature.night.min;

    return periodo_temperatura;

}

// Criei essa função para retornar o dia da semana
// a função recebe como parâmetro a data do objeto
function retornaDiaSemana(date){
    // na data eu dou um getday que tem como retorno 0 a 6 
    // sendo 0 domingo e 6 sábado
    switch (date.getDay()) {
        case 0:
            day = "Domingo";
            break;
        case 1:
            day = "Segunda-feira";
            break;
        case 2:
            day = "Terça-feira";
            break;
        case 3:
            day = "Quarta-feira";
            break;
        case 4:
            day = "Quinta-feira";
            break;
        case 5:
            day = "Sexta-feira";
            break;
        case 6:
            day = "Sábado";
    }
    return day;
}

// função que retorna o código do ícone de acordo com o período do dia
function retornaTempoIcone(climaTempo, index){

    var ndate = new Date();
    var hr = ndate.getHours();
    var periodo = "";

    console.log(hr);

    if (hr < 6)
    {
        periodo = climaTempo.data[index].text_icon.icon.dawn;
        console.log('dawn');
    }
    else if(hr >= 6 && hr <= 12){
        periodo = climaTempo.data[index].text_icon.icon.morning;
        console.log('morning');
    }
    else if (hr >= 12 && hr <= 17)
    {
        periodo = climaTempo.data[index].text_icon.icon.afternoon;
        console.log('afternoon');
    }
    else if (hr >= 17 && hr <= 24){
     periodo = climaTempo.data[index].text_icon.icon.night;
     console.log('night');
 }


 return periodo;

}

// função que retorna o html criado para cada ícone de acordo com o seu código 
function retornaIcone(code){
  switch (code) {
    case '1':
        return '<div class="sunny"></div>'

    case '2':
    case '2r':
    case '9':
        return '<div class="partly_cloudy"><div class="partly_cloudy__sun"></div><div class="partly_cloudy__cloud"></div></div>'

    case '1n':
    case '2n':
    case '2rn':
    case '9n':
        return '<div class="night"><span class="moon"></span><span class="spot1"></span><span class="spot2"></span><ul><li></li><li></li><li></li><li></li><li></li></ul></div><div style="height: 100px;"></div>'

    case '3':
    case '3n':
    case '4':
    case '4n':
    case '4r':
    case '4rn':
    case '5':
    case '5n':
        return '<div class="rainy"><div class="rainy__cloud"></div><div class="rainy__rain"></div></div>'

    case '7':
    case '7n':
    case '8':
    case '8n':
        return '<div class="stormy"><ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul><span class="snowe"></span><span class="snowex"></span><span class="stick"></span><span class="stick2"></span></div><div style="height: 100px;"></div>'

    case '3tm':
        return '<div class="cloudy-one"></div>'

    case '4t':
    case '4tn':
    case '6':
    case '6n':
        return '<div class="thundery"><div class="thundery__cloud"></div><div class="thundery__rain"></div></div>'

    default:
        return '<div class="sunny"></div>'
}
}