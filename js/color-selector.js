function get(i){
    return document.getElementById(i);
}

function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}

function random_color(color){
    get(color).value = random_number(256);
    update_fromslider(color);
}

function random_hex(){
    get('hex').value = hexvalues(random_number(16))
                     + hexvalues(random_number(16))
                     + hexvalues(random_number(16))
                     + hexvalues(random_number(16))
                     + hexvalues(random_number(16))
                     + hexvalues(random_number(16));
    update_fromhex();
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function update_display(){
    // updates the display square background color
    get('display').style.background = 'rgb(' + parseInt(get('red').value) + ','
                                             + parseInt(get('green').value) + ','
                                             + parseInt(get('blue').value) + ')';
}

function update_from1(color){
    // update value of slider when 1 text input is changed
    // validate 1 text input value isn't less than 0 or greater than 1
    if(get(color + '-1').value < 0 || get(color + '-1').value > 1){
        get(color + '-1').value = 0;
    }

    // if 1 text input value is a number, proceed
    if(!isNaN(get(color + '-1').value)){
        // update the sliders, color value out of 255, and the display
        get(color).value = Math.round(get(color + '-1').value * 255);
        get(color + '-255').value = Math.round(get(color + '-1').value * 255);
        update_display();
    }
    // if 1 text input is not a number, don't do anything in case users are entering '.'
}

function update_from255(color){
    // update value of slider when 255 text input is changed
    // validate 255 text input value is a number that isn't less than 0 or greater than 255
    if(isNaN(get(color + '-255').value)
          || get(color + '-255').value < 0
          || get(color + '-255').value > 255){
        get(color + '-255').value = 0;
    }

    // if 255 text input length is zero, just use color value of 0 instead of messing with user input
    get(color).value = get(color + '-255').value.length < 1 ? 0 : get(color + '-255').value;
    get(color + '-1').value = get(color + '-255').value.length < 1 ? 0 : (get(color + '-255').value / 255).toFixed(4);
    update_display();
}

function update_fromhex(){
    // update values of slider/text inputs when hex input is changed
    // hex length of 3 is valid
    var hexlength = get('hex').value.length === 3;
    get('blue-255').value = parseInt(hexlength
                                     ? get('hex').value.substring(2, 3) + get('hex').value.substring(2, 3)
                                     : get('hex').value.substring(4, 6)
                             , 16);
    get('green-255').value = parseInt(hexlength
                                      ? get('hex').value.substring(1, 2) + get('hex').value.substring(1, 2)
                                      : get('hex').value.substring(2, 4)
                             , 16);
    get('red-255').value = parseInt(hexlength
                                    ? get('hex').value.substring(0, 1) + get('hex').value.substring(0, 1)
                                    : get('hex').value.substring(0, 2)
                             , 16);
    update_from255('blue');
    update_from255('green');
    update_from255('red');
    update_display();
}

function update_fromslider(color){
    // update values of hex and text inputs when slider is slided
    get(color + '-1').value = (get(color).value / 255).toFixed(4);
    get(color + '-255').value = get(color).value;
    update_display();
    update_hex();
}

function update_hex(){
    // update the hex value based on slider values
    var red = Math.max(0, Math.min(parseInt(get('red').value, 10), 255));
    var green = Math.max(0, Math.min(parseInt(get('green').value, 10), 255));
    var blue = Math.max(0, Math.min(parseInt(get('blue').value, 10), 255));
    get('hex').value = hexvalues((red - red % 16) / 16) + hexvalues(red % 16)
                     + hexvalues((green - green % 16) / 16) + hexvalues(green % 16)
                     + hexvalues((blue - blue % 16) / 16) + hexvalues(blue % 16);
}

get('blue').oninput = function(){
    // event fires when blue slider is being slided
    update_fromslider('blue');
};

get('blue-1').oninput = function(){
    // event fires when user changes blue 1 text input
    update_from1('blue');
    update_hex();
};

get('blue-255').oninput = function(){
    // event fires when user changes blue 255 text input
    update_from255('blue');
    update_hex();
};

get('green').oninput = function(){
    // event fires when green slider is being slided
    update_fromslider('green');
};

get('green-1').oninput = function(){
    // event fires when user changes green 1 text input
    update_from1('green');
    update_hex();
};

get('green-255').oninput = function(){
    // event fires when user changes green 255 text input
    update_from255('green');
    update_hex();
};

// event fires when user changes hex text input
get('hex').oninput = update_fromhex;

get('red').oninput = function(){
    // event fires when red slider is being slided
    update_fromslider('red');
};

get('red-1').oninput = function(){
    // event fires when user changes red 1 text input
    update_from1('red');
    update_hex();
};

get('red-255').oninput = function(){
    // event fires when user changes red 255 text input
    update_from255('red');
    update_hex();
};

window.onkeydown = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;

    // B: random blue
    if(i == 66){
        random_color('blue');

    // C: random hex
    }else if(i == 67){
        random_hex();

    // G: random green
    }else if(i == 71){
        random_color('green');

    // R: random red
    }else if(i == 82){
        random_color('red');
    }
};
