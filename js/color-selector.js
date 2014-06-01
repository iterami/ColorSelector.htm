function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}

function random_color(color){
    document.getElementById(color).value = random_number(256);
    update_fromslider(color);
}

function random_hex(){
    document.getElementById('hex').value =
      hexvalues(random_number(16))
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

function reset(){
    if(confirm('Reset?')){
        document.getElementById('hex').value = '000000';
        update_fromhex();
    }
}

function update_display(){
    // set hex-color value to hex value
    document.getElementById('hex-color').value =
      '#' + document.getElementById('hex').value;

    // updates the display square background color
    document.getElementById('display').style.background = 'rgb('
      + parseInt(document.getElementById('red').value) + ','
      + parseInt(document.getElementById('green').value) + ','
      + parseInt(document.getElementById('blue').value) + ')';
}

function update_from1(color){
    // update value of slider when 1 text input is changed
    // validate 1 text input value isn't less than 0 or greater than 1
    if(document.getElementById(color + '-1').value < 0
      || document.getElementById(color + '-1').value > 1){
        document.getElementById(color + '-1').value = 0;
    }

    // if 1 text input value is a number, proceed
    if(!isNaN(document.getElementById(color + '-1').value)){
        // update the sliders, color value out of 255, and the display
        document.getElementById(color).value = Math.round(document.getElementById(color + '-1').value * 255);
        document.getElementById(color + '-255').value = Math.round(document.getElementById(color + '-1').value * 255);
        update_display();
    }
    // if 1 text input is not a number, don't do anything in case users are entering '.'
}

function update_from255(color){
    // update value of slider when 255 text input is changed
    // validate 255 text input value is a number that isn't less than 0 or greater than 255
    if(isNaN(document.getElementById(color + '-255').value)
      || document.getElementById(color + '-255').value < 0
      || document.getElementById(color + '-255').value > 255){
        document.getElementById(color + '-255').value = 0;
    }

    // if 255 text input length is zero, just use color value of 0 instead of messing with user input
    document.getElementById(color).value = document.getElementById(color + '-255').value.length < 1
      ? 0
      : document.getElementById(color + '-255').value;
    document.getElementById(color + '-1').value = document.getElementById(color + '-255').value.length < 1
      ? 0
      : (document.getElementById(color + '-255').value / 255).toFixed(4);

    update_display();
}

function update_fromhex(){
    // update values of slider/text inputs when hex input is changed
    // hex length of 3 is valid
    var hexlength = document.getElementById('hex').value.length === 3;

    document.getElementById('blue-255').value =
      parseInt(hexlength
        ? document.getElementById('hex').value.substring(2, 3)
          + document.getElementById('hex').value.substring(2, 3)
        : document.getElementById('hex').value.substring(4, 6),
      16);
    document.getElementById('green-255').value =
      parseInt(hexlength
        ? document.getElementById('hex').value.substring(1, 2)
          + document.getElementById('hex').value.substring(1, 2)
        : document.getElementById('hex').value.substring(2, 4),
      16);
    document.getElementById('red-255').value =
      parseInt(hexlength
        ? document.getElementById('hex').value.substring(0, 1)
          + document.getElementById('hex').value.substring(0, 1)
        : document.getElementById('hex').value.substring(0, 2),
      16);

    update_from255('blue');
    update_from255('green');
    update_from255('red');

    update_display();
}

function update_fromslider(color){
    // update values of hex and text inputs when slider is slided
    document.getElementById(color + '-1').value = (document.getElementById(color).value / 255).toFixed(4);
    document.getElementById(color + '-255').value = document.getElementById(color).value;
    update_display();
    update_hex();
}

function update_hex(){
    // update the hex value based on slider values
    var red = Math.max(0, Math.min(parseInt(document.getElementById('red').value, 10), 255));
    var green = Math.max(0, Math.min(parseInt(document.getElementById('green').value, 10), 255));
    var blue = Math.max(0, Math.min(parseInt(document.getElementById('blue').value, 10), 255));
    document.getElementById('hex').value =
      hexvalues((red - red % 16) / 16) + hexvalues(red % 16)
      + hexvalues((green - green % 16) / 16) + hexvalues(green % 16)
      + hexvalues((blue - blue % 16) / 16) + hexvalues(blue % 16);
    update_display();
}

var cankeypress = 1;

document.getElementById('blue').oninput = function(){
    // event fires when blue slider is being slided
    update_fromslider('blue');
};

document.getElementById('blue-1').oninput = function(){
    // event fires when user changes blue 1 text input
    update_from1('blue');
    update_hex();
};

document.getElementById('blue-255').oninput = function(){
    // event fires when user changes blue 255 text input
    update_from255('blue');
    update_hex();
};

document.getElementById('green').oninput = function(){
    // event fires when green slider is being slided
    update_fromslider('green');
};

document.getElementById('green-1').oninput = function(){
    // event fires when user changes green 1 text input
    update_from1('green');
    update_hex();
};

document.getElementById('green-255').oninput = function(){
    // event fires when user changes green 255 text input
    update_from255('green');
    update_hex();
};

// event fires when user changes hex text input
document.getElementById('hex').oninput = update_fromhex;

// event fires when user updates the hex-color color input
document.getElementById('hex-color').oninput = function(){
    document.getElementById('hex').value =
      document.getElementById('hex-color').value.substring(
        1,
        7
      );

    update_fromhex();
};

document.getElementById('red').oninput = function(){
    // event fires when red slider is being slided
    update_fromslider('red');
};

document.getElementById('red-1').oninput = function(){
    // event fires when user changes red 1 text input
    update_from1('red');
    update_hex();
};

document.getElementById('red-255').oninput = function(){
    // event fires when user changes red 255 text input
    update_from255('red');
    update_hex();
};

window.onkeydown = function(e){
    if(cankeypress){
        var key = window.event ? event : e;
        key = key.charCode ? key.charCode : key.keyCode;

        // G: random green
        if(key == 71){
            random_color('green');

        // H: random hex
        }else if(key == 72){
            random_hex();

        // R: random red
        }else if(key == 82){
            random_color('red');

        // U: random blue
        }else if(key == 85){
            random_color('blue');

        // T: reset()
        }else if(key == 84){
            reset();
        }

        cankeypress = 0;
    }
};

window.onkeyup = function(e){
    cankeypress = 1;
};
