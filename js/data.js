'use strict';

function calculate_wcag(source, offset){
    source = document.getElementById(source).value;
    let math = Number.parseInt(
      source.length === 4
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
        (math + .055) / 1.055,
        2.4
      );
}

function darken_lighten(change){
    let hex = document.getElementById('hex').value;

    // Get colors.
    let blue = Number.parseInt(
      hex.length === 3
        ? hex.substring(2, 3) + hex.substring(2, 3)
        : hex.substring(4, 6),
      16
    ) / 51 * .2;
    let green = Number.parseInt(
      hex.length === 3
        ? hex.substring(1, 2) + hex.substring(1, 2)
        : hex.substring(2, 4),
      16
    ) / 51 * .2;
    let red = Number.parseInt(
      hex.length === 3
        ? hex.substring(0, 1) + hex.substring(0, 1)
        : hex.substring(0, 2),
      16
    ) / 51 * .2;

    let max = red >= green
      ? red
      : green;
    if(blue > max){
        max = blue;
    }
    let min = red <= green
      ? red
      : green;
    if(blue < min){
        min = blue;
    }

    let hue = 0;
    let lightness = Math.round((min + max) * 50);
    let saturation = 0;

    lightness = (lightness + change * 6.25) / 100;
    if(lightness > 1){
        lightness = 1;

    }else if(lightness < 0){
        lightness = 0;
    }

    if(min !== max){
        let dx = max - min;
        if(red === max){
            hue = (green - blue) / dx;
        }
        if(green === max){
            hue = 2 + (blue - red) / dx;
        }
        if(blue === max){
            hue = 4 + (red - green) / dx;
        }
        saturation = dx / (lightness < .5
          ? min + max
          : 2 - min - max);
    }

    hue = Math.round(hue * 60);
    if(hue < 0){
        hue += 360;

    }else if(hue >= 360){
        hue -= 360;
    }

    let temp = lightness < .5
      ? lightness * (1 + saturation)
      : lightness + saturation - (lightness * saturation);
    let temp2 = 2 * lightness - temp;
    red = Math.round(
      darken_lighten_math(
        temp2,
        temp,
        hue + 120
      ) * 255
    );
    green = Math.round(
      darken_lighten_math(
        temp2,
        temp,
        hue
      ) * 255
    );
    blue = Math.round(
      darken_lighten_math(
        temp2,
        temp,
        hue - 120
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
    }

    return d0;
}

function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}

function random_color(color){
    color = color || 'hex';

    if(color === 'hex'){
        document.getElementById(color).value = core_random_hex();
        update_fromhex();

    }else{
        document.getElementById(color).value = core_random_integer({
          'max': 256,
        });
        update_fromslider(color);
    }
}

function set_grayscale(){
    let blue_element = document.getElementById('blue');
    let green_element = document.getElementById('green');
    let red_element = document.getElementById('red');

    let blue = Number.parseInt(blue_element.value, 10);
    let green = Number.parseInt(green_element.value, 10);
    let red = Number.parseInt(red_element.value, 10);

    let average = (blue + green + red) / 3;

    blue_element.value = average;
    green_element.value = average;
    red_element.value = average;

    update_fromslider('blue');
    update_fromslider('green');
    update_fromslider('red');
}

function update_display(){
    let blue = Number.parseInt(document.getElementById('blue').value, 10);
    let green = Number.parseInt(document.getElementById('green').value, 10);
    let red = Number.parseInt(document.getElementById('red').value, 10);

    // Set hex-color value to hex value.
    document.getElementById('hex-color').value = '#' + document.getElementById('hex').value;

    // Update the background color for each display.
    document.getElementById('display-hex').style.background = 'rgb(' + red + ',' + green + ',' + blue + ')';
    document.getElementById('display-red').style.background = 'rgb(' + red + ',0,0)';
    document.getElementById('display-green').style.background = 'rgb(0,' + green + ',0)';
    document.getElementById('display-blue').style.background = 'rgb(0,0,' + blue + ')';
}

function update_from1(color){
    // Update value of slider when 0-1 text input is changed
    //   and validate 0-1 text input value isn't less than 0 or greater than 1.
    let color_value = document.getElementById(color + '-1').value;
    if(Number.isNaN(color_value)
      || color_value < 0
      || color_value > 1){
        color_value = 0;
        document.getElementById(color + '-1').value = color_value;
    }

    color_value = Math.round(color_value * 255);
    document.getElementById(color).value = color_value;
    document.getElementById(color + '-255').value = color_value;
    update_display();
}

function update_from255(color){
    // Update value of slider when 0-255 text input is changed
    //   and validate 0-255 text input value is a number that isn't less than 0 or greater than 255.
    let color_value = document.getElementById(color + '-255').value;
    if(Number.isNaN(color_value)
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
      : (color_value / 255).toFixed(7);

    update_display();
}

function update_fromhex(){
    // Update values of slider/text inputs when hex input is changed.
    // Hex length of 3 is valid.
    let hex = document.getElementById('hex').value;

    document.getElementById('blue-255').value =
      Number.parseInt(
        hex.length === 3
          ? hex.substring(2, 3) + hex.substring(2, 3)
          : hex.substring(4, 6),
        16
      );
    document.getElementById('green-255').value =
      Number.parseInt(
        hex.length === 3
          ? hex.substring(1, 2) + hex.substring(1, 2)
          : hex.substring(2, 4),
        16
      );
    document.getElementById('red-255').value =
      Number.parseInt(
        hex.length === 3
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
    let color_value = document.getElementById(color).value;
    document.getElementById(color + '-1').value = (color_value / 255).toFixed(7);
    document.getElementById(color + '-255').value = color_value;

    update_display();
    update_hex();
}

function update_hex(){
    // Update the hex value based on slider values.
    let red = Math.max(0, Math.min(Number.parseInt(document.getElementById('red').value, 10), 255));
    let green = Math.max(0, Math.min(Number.parseInt(document.getElementById('green').value, 10), 255));
    let blue = Math.max(0, Math.min(Number.parseInt(document.getElementById('blue').value, 10), 255));

    document.getElementById('hex').value =
      hexvalues((red - red % 16) / 16) + hexvalues(red % 16)
      + hexvalues((green - green % 16) / 16) + hexvalues(green % 16)
      + hexvalues((blue - blue % 16) / 16) + hexvalues(blue % 16);

    update_display();
}

function update_wcag(source){
    let source_element = document.getElementById(source);
    let other_input = source.endsWith('-color')
      ? source.slice(0, -6)
      : source + '-color';
    document.getElementById(other_input).value = source_element.value.length === 4
      ? '#' + source_element.value[1] + source_element.value[1] + source_element.value[2] + source_element.value[2] + source_element.value[3] + source_element.value[3]
      : source_element.value;

    let background_math =
      (.2126 * calculate_wcag('wcag-background-color', 2)
      + .7152 * calculate_wcag('wcag-background-color', 4)
      + .0722 * calculate_wcag('wcag-background-color', 6)
    );
    let foreground_math =
      (.2126 * calculate_wcag('wcag-foreground-color', 2)
      + .7152 * calculate_wcag('wcag-foreground-color', 4)
      + .0722 * calculate_wcag('wcag-foreground-color', 6)
    );

    let wcag_score = Math.round(
      (Math.max(background_math, foreground_math) + .05)
      / (Math.min(background_math, foreground_math) + .05)
      * 10
    ) / 10;

    document.getElementById('wcag-text-normal-result').innerHTML =
      wcag_score + ' / 7 = AAA '
      + (wcag_score > 7
        ? 'Passed'
        : 'Failed'
      ) + '<br>' + wcag_score + ' / 4.5 = AA '
      + (wcag_score > 4.5
        ? 'Passed'
        : 'Failed'
      );
    document.getElementById('wcag-text-large-result').innerHTML =
      wcag_score + ' / 4.5 = AAA '
      + (wcag_score > 4.5
        ? 'Passed'
        : 'Failed'
      ) + '<br>' + wcag_score + ' / 3 = AA '
      + (wcag_score > 3
        ? 'Passed'
        : 'Failed'
      );

    let background = document.getElementById('wcag-background-color').value;
    let foreground = document.getElementById('wcag-foreground-color').value;
    document.getElementById('wcag-text-normal').style.backgroundColor = background;
    document.getElementById('wcag-text-normal').style.color = foreground;
    document.getElementById('wcag-text-large').style.backgroundColor = background;
    document.getElementById('wcag-text-large').style.color = foreground;

    document.getElementById('display-background').style.backgroundColor = background;
    document.getElementById('display-foreground').style.backgroundColor = foreground;
}

function wcag_set(target){
    document.getElementById('wcag-' + target + '-color').value = '#' + document.getElementById('hex').value;

    update_wcag('wcag-' + target + '-color');
}

function wcag_switch(){
    let background_element = document.getElementById('wcag-background-color');
    let foreground_element = document.getElementById('wcag-foreground-color');

    let background = background_element.value;
    background_element.value = foreground_element.value;
    foreground_element.value = background;

    update_wcag('wcag-background-color');
    update_wcag('wcag-foreground-color');
}
