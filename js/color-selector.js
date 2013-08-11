function get(i){
    return document.getElementById(i);
}

function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}


function update_display(){
    // updates the display square background color
    get('display').style.background = 'rgb(' + parseInt(get('red').value) + ','
                                             + parseInt(get('green').value) + ','
                                             + parseInt(get('blue').value) + ')'
}

function update_fromhex(){
    // update values of slider/text inputs when hex input is changed
    // hex length of 3 is valid
    var hexlength = get('hex').length === 3;
    get('blue-value').value = parseInt(hexlength
                                     ? get('hex').value.substring(2, 3) + '' + get('hex').value.substring(2, 3)
                                     : get('hex').value.substring(4, 6)
                              , 16);
    get('green-value').value = parseInt(hexlength
                                      ? get('hex').value.substring(1, 2) + '' + get('hex').value.substring(1, 2)
                                      : get('hex').value.substring(2, 4)
                               , 16);
    get('red-value').value = parseInt(hexlength
                                    ? get('hex').value.substring(0, 1) + '' + get('hex').value.substring(0, 1)
                                    : get('hex').value.substring(0, 2)
                             , 16);
    update_fromtext('blue');
    update_fromtext('green');
    update_fromtext('red');
    update_display();
}
function update_fromslider(color){
    // update values of hex and text input when slider is slided
    get(color + '-value').value = get(color).value;
    update_display();
    update_hex();
}

function update_fromtext(color){
    // update value of slider when text input is changed
    // validate text input value is a number that isn't less than 0 or greater than 255
    if(isNaN(get(color + '-value').value)
          || get(color + '-value').value < 0
          || get(color + '-value').value > 255){
        get(color + '-value').value = 0;
    }

    // if text input length is zero, just use color value of 0 instead of messing with user input
    get(color).value = get(color + '-value').value.length < 1 ? 0 : get(color + '-value').value;
    update_display();
}

function update_hex(){
    // update the hex value based on slider values
    var red = Math.max(0, Math.min(parseInt(get('red').value, 10), 255));
    var green = Math.max(0, Math.min(parseInt(get('green').value, 10), 255));
    var blue = Math.max(0, Math.min(parseInt(get('blue').value, 10), 255));
    get('hex').value = hexvalues((red - red % 16) / 16) + hexvalues(red % 16) + ''
                     + hexvalues((green - green % 16) / 16) + hexvalues(green % 16) + ''
                     + hexvalues((blue - blue % 16) / 16) + hexvalues(blue % 16);
}

get('blue').onchange = function(){
    // event fires when blue slider is being slided
    update_fromslider('blue');
};

get('blue-value').oninput = function(){
    // event fires when user changes blue text input
    update_fromtext('blue');
    update_hex();
};

get('green').onchange = function(){
    // event fires when green slider is being slided
    update_fromslider('green');
};

get('green-value').oninput = function(){
    // event fires when user changes green text input
    update_fromtext('green');
    update_hex();
};

// event fires when user changes hex text input
get('hex').oninput = update_fromhex;

get('red').onchange = function(){
    // event fires when red slider is being slided
    update_fromslider('red');
};

get('red-value').oninput = function(){
    // event fires when user changes red text input
    update_fromtext('red');
    update_hex();
};
