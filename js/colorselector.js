'use strict';

function calculate_wcag(source, offset, length){
    var source = document.getElementById(source).value;
    var math = parseInt(
      length === 4
        ? source[offset / 2] + source[offset / 2]
        : source.substring(
          offset - 1,
          offset + 1
        ),
      16
    ) / 255;

    return math <= .03928
      ? math / 12.92
      : Math.pow(
        ((math + .055) / 1.055),
        2.4
      );
}

function darken_lighten(change){
    var hex = document.getElementById('hex').value;
    var hexlength = hex.length === 3;

    // Get colors.
    var blue =
      (eval(
        parseInt(
          hexlength
            ? hex.substring(2, 3) + hex.substring(2, 3)
            : hex.substring(4, 6),
          16
        )
      ) / 51) * .2;
    var green =
      (eval(
        parseInt(
          hexlength
            ? hex.substring(1, 2) + hex.substring(1, 2)
            : hex.substring(2, 4),
          16
        )
      ) / 51) * .2;
    var red =
      (eval(
        parseInt(
          hexlength
            ? hex.substring(0, 1) + hex.substring(0, 1)
            : hex.substring(0, 2),
          16
        )
      ) / 51) * .2;

    var Max = 0;
    var Min = 0;

    Max = eval(eval(red) >= eval(green)
      ? red
      : green
    );
    if(eval(blue) > eval(Max)){
        Max = eval(blue);
    }
    Min = eval(eval(red) <= eval(green)
      ? red
      : green
    );
    if(eval(blue) < eval(Min)){
        Min = eval(blue);
    }

    var H = 0;
    var L = Math.round(
      (eval(Max) + eval(Min)) * 50
    );
    var S = 0;

    // Luminosity calculations.
    L = (L + (change ? 6.25 : -6.25)) / 100;
    if(L > 1){
        L = 1;

    }else if(L < 0){
        L = 0;
    }

    if(eval(Max) != eval(Min)){
        var dx = (eval(Max) - eval(Min));
        if(red === Max){
            H = (eval(green) - eval(blue)) / dx;
        }
        if(green === Max){
            H = 2 + (eval(blue) - eval(red)) / dx;
        }
        if(blue === Max){
            H = 4 + (eval(red) - eval(green)) / dx;
        }
        S = dx
          / (L<.5
            ? eval(Max) + eval(Min)
            : 2 - eval(Max) - eval(Min)
          );
    }

    H = Math.round(H * 60);
    if(H < 0){
        H += 360;

    }else if(H >= 360){
        H -= 360;
    }

    var temp = L < .5
      ? L * (1 + S)
      : L + S - (L * S);
    var temp2 = 2 * L - temp;
    red = Math.round(
      darken_lighten_math(
        temp2,
        temp,
        H + 120
      ) * 255
    );
    green = Math.round(
      darken_lighten_math(
        temp2,
        temp,
        H
      ) * 255
    );
    blue = Math.round(
      darken_lighten_math(
        temp2,
        temp,
        H - 120
      ) * 255
    );

    document.getElementById('red-255').value =
      (red < 0 || red > 255)
        ? 0
        : red;
    document.getElementById('green-255').value =
      (green < 0 || green > 255)
        ? 0
        : green;
    document.getElementById('blue-255').value =
      (blue < 0 || blue > 255)
        ? 0
        : blue;

    update_from255('blue');
    update_from255('green');
    update_from255('red');

    update_hex();
}

function darken_lighten_math(d0, d1, d2){
    if(d2 > 360){
        d2 = d2 - 360;

    }else if(d2 < 0){
        d2 = d2 + 360;
    }

    if(d2 < 60){
        return d0 + (d1 - d0) * d2 / 60;

    }else if(d2 < 180){
        return d1;

    }else if(d2 < 240){
        return d0 + (d1 - d0) * (240 - d2) / 60;

    }else{
        return d0;
    }
}

function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}

function random_color(color){
    color = color || 'hex';

    if(color === 'hex'){
        document.getElementById(color).value = random_hex({
          'hash': false,
        });
        update_fromhex();

    }else{
        document.getElementById(color).value = random_integer({
          'max': 256,
        });
        update_fromslider(color);
    }
}

function update_display(){
    // Set hex-color value to hex value.
    document.getElementById('hex-color').value =
      '#' + document.getElementById('hex').value;

    // Updates the display square background color.
    document.getElementById('display').style.background = 'rgb('
      + parseInt(document.getElementById('red').value, 10) + ','
      + parseInt(document.getElementById('green').value, 10) + ','
      + parseInt(document.getElementById('blue').value, 10) + ')';
}

function update_from1(color){
    // Update value of slider when 0-1 text input is changed
    //   and validate 0-1 text input value isn't less than 0 or greater than 1.
    var color_value = document.getElementById(color + '-1').value;
    if(color_value < 0
      || color_value > 1){
        document.getElementById(color + '-1').value = 0;
    }

    // If 0-1 text input value is a number, proceed.
    color_value = document.getElementById(color + '-1').value;
    if(!isNaN(color_value)){
        // Update the sliders, color value out of 255, and the display.
        document.getElementById(color).value = Math.round(color_value * 255);
        document.getElementById(color + '-255').value = Math.round(color_value * 255);
        update_display();
    }
    // If 0-1 text input is not a number, don't do anything in case users are entering '.',
}

function update_from255(color){
    // Update value of slider when 0-255 text input is changed
    //   and validate 0-255 text input value is a number that isn't less than 0 or greater than 255.
    var color_value = document.getElementById(color + '-255').value;
    if(isNaN(color_value)
      || color_value < 0
      || color_value > 255){
        document.getElementById(color + '-255').value = 0;
    }

    // If 0-255 text input length is 0, just use color value of 0 instead of messing with user input.
    color_value = document.getElementById(color + '-255').value;
    document.getElementById(color).value = color_value.length < 1
      ? 0
      : color_value;
    document.getElementById(color + '-1').value = color_value.length < 1
      ? 0
      : (color_value / 255).toFixed(4);

    update_display();
}

function update_fromhex(){
    // Update values of slider/text inputs when hex input is changed.
    // Hex length of 3 is valid.
    var hex = document.getElementById('hex').value;
    var hexlength = hex.length === 3;

    document.getElementById('blue-255').value =
      parseInt(
        hexlength
          ? hex.substring(2, 3) + hex.substring(2, 3)
          : hex.substring(4, 6),
        16
      );
    document.getElementById('green-255').value =
      parseInt(
        hexlength
          ? hex.substring(1, 2) + hex.substring(1, 2)
          : hex.substring(2, 4),
        16
      );
    document.getElementById('red-255').value =
      parseInt(
        hexlength
          ? hex.substring(0, 1) + hex.substring(0, 1)
          : hex.substring(0, 2),
        16
      );

    update_from255('blue');
    update_from255('green');
    update_from255('red');

    update_display();
}

function update_fromslider(color){
    // Update values of hex and text inputs when slider is slided.
    var color_value = document.getElementById(color).value;
    document.getElementById(color + '-1').value = (color_value / 255).toFixed(4);
    document.getElementById(color + '-255').value = color_value;

    update_display();
    update_hex();
}

function update_hex(){
    // Update the hex value based on slider values.
    var red = Math.max(0, Math.min(parseInt(document.getElementById('red').value, 10), 255));
    var green = Math.max(0, Math.min(parseInt(document.getElementById('green').value, 10), 255));
    var blue = Math.max(0, Math.min(parseInt(document.getElementById('blue').value, 10), 255));

    document.getElementById('hex').value =
      hexvalues((red - red % 16) / 16) + hexvalues(red % 16)
      + hexvalues((green - green % 16) / 16) + hexvalues(green % 16)
      + hexvalues((blue - blue % 16) / 16) + hexvalues(blue % 16);

    update_display();
}

function update_wcag(source, source_hex, length){
    var source_value = document.getElementById(source_hex).value;
    document.getElementById(source).value = length === 4
      ? '#'
        + source_value[1] + source_value[1]
        + source_value[2] + source_value[2]
        + source_value[3] + source_value[3]
      : source_value;

    var background_math =
      (.2126 * calculate_wcag('wcag-background-color', 2, length)
      + .7152 * calculate_wcag('wcag-background-color', 4, length)
      + .0722 * calculate_wcag('wcag-background-color', 6, length)
    );
    var foreground_math =
      (.2126 * calculate_wcag('wcag-foreground-color', 2, length)
      + .7152 * calculate_wcag('wcag-foreground-color', 4, length)
      + .0722 * calculate_wcag('wcag-foreground-color', 6, length)
    );

    var wcag_score = Math.round(
      (Math.max(background_math, foreground_math) + .05)
      / (Math.min(background_math, foreground_math) + .05)
      * 10
    ) / 10;

    document.getElementById('wcag-text-normal-aaa').innerHTML =
      '<b>' + wcag_score + '</b> / 7.0 = '
      + (wcag_score > 7
        ? 'Passed'
        : 'Failed'
      );
    document.getElementById('wcag-text-normal-aa').innerHTML =
      '<b>' + wcag_score + '</b> / 4.5 = '
      + (wcag_score > 4.5
        ? 'Passed'
        : 'Failed'
      );
    document.getElementById('wcag-text-large-aaa').innerHTML =
      '<b>' + wcag_score + '</b> / 4.5 = '
      + (wcag_score > 4.5
        ? 'Passed'
        : 'Failed'
      );
    document.getElementById('wcag-text-large-aa').innerHTML =
      '<b>' + wcag_score + '</b> / 3.0 = '
      + (wcag_score > 3
        ? 'Passed'
        : 'Failed'
      );

    var background = document.getElementById('wcag-background-color').value;
    var foreground = document.getElementById('wcag-foreground-color').value;
    document.getElementById('wcag-text-normal').style.backgroundColor = background;
    document.getElementById('wcag-text-normal').style.color = foreground;
    document.getElementById('wcag-text-large').style.backgroundColor = background ;
    document.getElementById('wcag-text-large').style.color = foreground;
}

function wcag_set(target){
    document.getElementById('wcag-' + target + '-color').value =
      '#' + document.getElementById('hex').value;

    update_wcag(
      'wcag-' + target,
      'wcag-' + target + '-color',
      document.getElementById('wcag-' + target + '-color').value.length
    );
}

function wcag_switch(){
    var temp = document.getElementById('wcag-background-color').value;
    document.getElementById('wcag-background-color').value = document.getElementById('wcag-foreground-color').value;
    document.getElementById('wcag-foreground-color').value = temp;

    update_wcag(
      'wcag-background',
      'wcag-background-color',
      document.getElementById('wcag-background-color').value.length
    );

    update_wcag(
      'wcag-foreground',
      'wcag-foreground-color',
      temp.length
    );
}

window.onload = function(e){
    input_init(
      {
        71: {
          'todo': function(){
              random_color('green');
          },
        },
        72: {
          'todo': function(){
              document.getElementById('hex').value = random_hex({
                'hash': false,
              });
              update_fromhex();
          },
        },
        75: {
          'todo': function(){
              darken_lighten(0);
          },
        },
        76: {
          'todo': function(){
              darken_lighten(1);
          },
        },
        78: {
          'todo': function(){
              wcag_set('background');
          },
        },
        79: {
          'todo': function(){
              wcag_set('foreground');
          },
        },
        82: {
          'todo': function(){
              random_color('red');
          },
        },
        83: {
          'todo': wcag_switch,
        },
        85: {
          'todo': function(){
              random_color('blue');
          },
        },
      }
    );

    // Event fires when user changes hex text input.
    document.getElementById('hex').oninput = update_fromhex;

    // Event fires when user updates the hex-color color input.
    document.getElementById('hex-color').oninput = function(){
        document.getElementById('hex').value =
          document.getElementById('hex-color').value.substring(
            1,
            7
          );

        update_fromhex();
    };

    document.getElementById('wcag-background-color').oninput = function(){
        update_wcag(
          'wcag-background',
          'wcag-background-color',
          document.getElementById('wcag-background-color').value.length
        );
    };

    document.getElementById('wcag-background').oninput = function(){
        update_wcag(
          'wcag-background-color',
          'wcag-background',
          false
        );
    };

    document.getElementById('wcag-foreground-color').oninput = function(){
        update_wcag(
          'wcag-foreground',
          'wcag-foreground-color',
          document.getElementById('wcag-foreground-color').value.length
        );
    };

    document.getElementById('wcag-foreground').oninput = function(){
        update_wcag(
          'wcag-foreground-color',
          'wcag-foreground',
          false
        );
    };

    document.getElementById('hex').value = random_hex({
      'hash': false,
    });
    update_fromhex();

    update_wcag(
      'wcag-background',
      'wcag-background-color',
      false
    );
    update_wcag(
      'wcag-foreground',
      'wcag-foreground-color',
      false
    );

    var colors = [
      'blue',
      'green',
      'red',
    ];

    for(var color in colors){
        document.getElementById(colors[color] + '-random').onclick = function(){
            var id = this.id;
            // Event fires when color button is clicked.
            random_color(id.substring(0, id.indexOf('-')));
        };

        document.getElementById(colors[color]).oninput = function(){
            // Event fires when colors[color] slider is being slided.
            update_fromslider(this.id);
        };

        document.getElementById(colors[color] + '-1').oninput = function(){
            var id = this.id;
            // Event fires when user changes colors[color] 1 text input.
            update_from1(id.substring(0, id.indexOf('-')));
            update_hex();
        };

        document.getElementById(colors[color] + '-255').oninput = function(){
            var id = this.id;
            // Event fires when user changes colors[color] 255 text input.
            update_from255(id.substring(0, id.indexOf('-')));
            update_hex();
        };
    }
    document.getElementById('color-random').onclick = function(){
        random_color();
    };
    document.getElementById('darken').onclick = function(){
        darken_lighten(0);
    };
    document.getElementById('lighten').onclick = function(){
        darken_lighten(1);
    };
    document.getElementById('wcag').onclick = wcag_switch;
    document.getElementById('wcag-background-use').onclick = function(){
        wcag_set('background');
    };
    document.getElementById('wcag-foreground-use').onclick = function(){
        wcag_set('foreground');
    };
};
