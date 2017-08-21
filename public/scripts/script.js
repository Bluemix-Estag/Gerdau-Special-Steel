function verifyTool() {
    $('#translate').tooltip('remove');
}




$(document).ready(function () {
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        $('#start').addClass('hide');
        var listen = '<div class="col s1 tooltipped" style="margin-top:2rem;" id="say-div" data-tooltip="Not available yet."><a href="#" id="listen" style="cursor: pointer;"><i class="material-icons">volume_off</i></a></div>'
        $('#user').append(listen);
    } else {}





    var result = {};

    $('select').material_select();
    $('#input').on('input', function () {
        var user_input = $('#input').val();
        console.log("Input:" + user_input);
        if (user_input == null || user_input == '') {
            $('#translate').prop("disabled", true);
            result.lang = null;
            result.verified = false;
            $('#identified').prop("value", "Type to detect language");

        }
        xhrGet('http://cury-red.mybluemix.net/verify?text=' + user_input, function (result) {
            var result = JSON.parse(result);
            if (result['verified'] == true) {
                $('#translate').prop("disabled", false);
                $('#' + result.lang).prop('selected', true);
                $('select').material_select('update');
                console.log('Resultado' + result.lang)
            } else {
                $('#translate').prop("disabled", true);
                if (user_input == null || user_input == '') {
                    $('#identified').prop("value", "Type to detect language");
                } else {
                    $('#identified').prop("value", result.lang);
                }
            }
        }, function (err) {
            console.log(err);
        }, 'audio')
    });
})



$('#translate').on('click', function (e) {
    var user_input = $('#input').val();
    var navegador = null;
    e.preventDefault();
    var selecionado = $('#select').val();

        $('#loader').removeClass('hide');
        $('#user').addClass('hide');

    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        if (user_input != null || user_input != 'undefined' && result.verified == true) {
            var user_input = $('#input').val();
            var selecionado = $('#select').val();

            var audio = '<audio src="https://cury-red.mybluemix.net/translate?text=' + user_input + '&idioma=' + selecionado + '" autobuffer id="frame" oncanplay="myOnCanPlayFunction()" oncanplaythrough="myOnCanPlayThroughFunction()"  onloadeddata="myOnLoadedData()"></audio>';
            document.getElementById('audio').innerHTML = audio;
            var frame = document.getElementById('audio').innerHTML = audio;


            document.getElementById('frame').play();
        } else {
            alert('User input is null');
        }
    } else {

        if (user_input != null || user_input != 'undefined' && result.verified == true) {
            var user_input = $('#input').val();
            var selecionado = $('#select').val();
            var audio = '<audio src="https://cury-red.mybluemix.net/translate?text=' + user_input + '&idioma=' + selecionado + '" autobuffer id="frame" oncanplay="myOnCanPlayFunction()" oncanplaythrough="myOnCanPlayThroughFunction()"  onloadeddata="myOnLoadedData()"></audio>';
            document.getElementById('audio').innerHTML = audio;
            var frame = document.getElementById('audio').innerHTML = audio;
            document.getElementById('frame').play();
        } else {
            alert('User input is null');
        }
    }
})



function myOnCanPlayFunction() {
    //    console.log('Can play');
    // // alert('pode tocar');
    $('#loader').addClass('hide');
    $('#user').removeClass('hide');
    // stop_gif();
}

function myOnCanPlayThroughFunction() { //console.log('Can play through'); 
}

function myOnLoadedData() { //console.log('Loaded data'); 
}