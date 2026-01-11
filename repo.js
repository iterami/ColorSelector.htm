'use strict';

function calculate_wcag(source, offset){
    const value = core_elements[source].value;
    const math = Number.parseInt(
      value.length === 4
        ? value[offset / 2] + value[offset / 2]
        : value.substring(
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
    const hex = core_elements.hex.value;

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

    const max = Math.max(
      blue,
      green,
      red
    );
    const min = Math.min(
      blue,
      green,
      red
    );

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
        const dx = max - min;
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

    const temp = lightness < .5
      ? lightness * (1 + saturation)
      : lightness + saturation - (lightness * saturation);
    const temp2 = 2 * lightness - temp;
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

    core_elements.red_255.value =
      (red < 0 || red > 255)
        ? 0
        : red;
    core_elements.green_255.value =
      (green < 0 || green > 255)
        ? 0
        : green;
    core_elements.blue_255.value =
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
        core_elements[color].value = core_random_hex();
        update_fromhex();

    }else{
        core_elements[color].value = core_random_integer(256);
        update_fromslider(color);
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'color_random': {
          'onclick':  function(){
              random_color();
          },
        },
        'darken': {
          'onclick': function(){
              darken_lighten(-1);
          },
        },
        'grayscale': {
          'onclick': set_grayscale,
        },
        'hex': {
          'oninput': update_fromhex,
        },
        'hex_color': {
          'oninput': function(){
              core_elements.hex.value =
                core_elements.hex_color.value.substring(
                  1,
                  7
                );

              update_fromhex();
          },
        },
        'lighten': {
          'onclick': function(){
              darken_lighten(1);
          },
        },
        'wcag': {
          'onclick': wcag_switch,
        },
        'wcag_background': {
          'oninput': update_wcag,
        },
        'wcag_background_use': {
          'onclick': function(){
              wcag_set('background');
          },
        },
        'wcag_foreground': {
          'oninput': update_wcag,
        },
        'wcag_foreground_use': {
          'onclick': function(){
              wcag_set('foreground');
          },
        },
      },
      'keybinds': {
        'KeyG': {
          'down': function(){
              random_color('green');
          },
        },
        'KeyK': {
          'down': function(){
              darken_lighten(-1);
          },
        },
        'KeyL': {
          'down': function(){
              darken_lighten(1);
          },
        },
        'KeyN': {
          'down': function(){
              wcag_set('background');
          },
        },
        'KeyO': {
          'down': function(){
              wcag_set('foreground');
          },
        },
        'KeyR': {
          'down': function(){
              random_color('red');
          },
        },
        'KeyS': {
          'down': wcag_switch,
        },
        'KeyU': {
          'down': function(){
              random_color('blue');
          },
        },
        'KeyX': {
          'down': function(){
              core_elements.hex.value = core_random_hex();
              update_fromhex();
          },
        },
        'KeyY': {
          'down': set_grayscale,
        },
      },
      'storage': {
        'background_page': false,
        'background_table': true,
        'hex': '000000',
      },
      'storage_menu': '<table><tr><td><input id=background_page type=checkbox><td>Page Background Color'
        +  '<tr><td><input id=background_table type=checkbox><td>Table Background Color</table>',
      'title': 'ColorSelector.htm',
      'ui_elements': [
        'blue',
        'blue_1',
        'blue_255',
        'display_background',
        'display_blue',
        'display_foreground',
        'display_green',
        'display_red',
        'green',
        'green_1',
        'green_255',
        'hex',
        'hex_color',
        'red',
        'red_1',
        'red_255',
        'wcag_background',
        'wcag_foreground',
        'wcag_text_large',
        'wcag_text_large_result',
        'wcag_text_normal',
        'wcag_text_normal_result',
      ],
    });

    core_elements.wcag_background.value = '#000000';
    core_elements.wcag_foreground.value = '#ffffff';
    update_wcag();

    const colors = [
      'blue',
      'green',
      'red',
    ];
    for(const color in colors){
        document.getElementById(colors[color] + '_random').onclick = function(){
            const id = this.id;
            random_color(id.substring(0, id.indexOf('_')));
        };

        core_elements[colors[color]].oninput = function(){
            update_fromslider(this.id);
        };

        core_elements[colors[color] + '_1'].oninput = function(){
            const id = this.id;
            update_from1(id.substring(0, id.indexOf('_')));
            update_hex();
        };

        core_elements[colors[color] + '_255'].oninput = function(){
            const id = this.id;
            update_from255(id.substring(0, id.indexOf('_')));
            update_hex();
        };
    }

    core_storage_update();
    update_fromhex();
}

function set_grayscale(){
    const blue = Number.parseInt(core_elements.blue.value, 10);
    const green = Number.parseInt(core_elements.green.value, 10);
    const red = Number.parseInt(core_elements.red.value, 10);

    const average = (blue + green + red) / 3;

    core_elements.blue.value = average;
    core_elements.green.value = average;
    core_elements.red.value = average;

    update_fromslider('blue');
    update_fromslider('green');
    update_fromslider('red');
}

function update_display(){
    const blue = Number.parseInt(core_elements.blue.value, 10);
    const green = Number.parseInt(core_elements.green.value, 10);
    const red = Number.parseInt(core_elements.red.value, 10);
    const hex_value = '#' + core_elements.hex.value;

    core_elements.hex_color.value = hex_value;
    document.title = hex_value + ' r' + red + ' g' + green + ' b' + blue + ' - ' + core_repo_title;

    if(core_storage_data.background_table){
        core_elements.display_blue.style.backgroundColor = 'rgb(0,0,' + blue + ')';
        core_elements.display_green.style.backgroundColor = 'rgb(0,' + green + ',0)';
        core_elements.display_red.style.backgroundColor = 'rgb(' + red + ',0,0)';
    }
    if(core_storage_data.background_page){
        document.body.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
    }
}

function update_from1(color){
    const color_element = core_elements[color + '_1'];
    let color_value = color_element.value;
    if(globalThis.isNaN(color_value)
      || color_value < 0
      || color_value > 1){
        color_value = 0;
        color_element.value = color_value;
    }

    color_value = Math.round(color_value * 255);
    core_elements[color].value = color_value;
    core_elements[color + '_255'].value = color_value;
    update_hex();
}

function update_from255(color){
    const color_element = core_elements[color + '_255'];
    let color_value = color_element.value;
    if(globalThis.isNaN(color_value)
      || color_value < 0
      || color_value > 255){
        color_element.value = 0;
    }

    color_value = color_element.value;
    core_elements[color].value = color_value.length < 1
      ? 0
      : color_value;
    core_elements[color + '_1'].value = color_value.length < 1
      ? 0
      : color_value / 255;

    update_hex();
}

function update_fromhex(){
    const hex = core_elements.hex.value;

    if(hex.length !== 3
      && hex.length !== 6){
        return;
    }

    core_elements.blue_255.value =
      Number.parseInt(
        hex.length === 3
          ? hex.substring(2, 3) + hex.substring(2, 3)
          : hex.substring(4, 6),
        16
      );
    core_elements.green_255.value =
      Number.parseInt(
        hex.length === 3
          ? hex.substring(1, 2) + hex.substring(1, 2)
          : hex.substring(2, 4),
        16
      );
    core_elements.red_255.value =
      Number.parseInt(
        hex.length === 3
          ? hex.substring(0, 1) + hex.substring(0, 1)
          : hex.substring(0, 2),
        16
      );

    update_from255('blue');
    update_from255('green');
    update_from255('red');

    update_hex();
}

function update_fromslider(color){
    core_elements[color + '_1'].value = core_elements[color].value / 255;
    core_elements[color + '_255'].value = core_elements[color].value;

    update_hex();
}

function update_hex(){
    const red = Math.max(0, Math.min(Number.parseInt(core_elements.red.value, 10), 255));
    const green = Math.max(0, Math.min(Number.parseInt(core_elements.green.value, 10), 255));
    const blue = Math.max(0, Math.min(Number.parseInt(core_elements.blue.value, 10), 255));

    core_elements.hex.value =
      hexvalues((red - red % 16) / 16) + hexvalues(red % 16)
      + hexvalues((green - green % 16) / 16) + hexvalues(green % 16)
      + hexvalues((blue - blue % 16) / 16) + hexvalues(blue % 16);
    core_storage_save({
      'keys': ['hex'],
      'rebind': false,
    });

    update_display();
}

function update_wcag(){
    const background_math =
      (.2126 * calculate_wcag('wcag_background', 2)
      + .7152 * calculate_wcag('wcag_background', 4)
      + .0722 * calculate_wcag('wcag_background', 6)
    );
    const foreground_math =
      (.2126 * calculate_wcag('wcag_foreground', 2)
      + .7152 * calculate_wcag('wcag_foreground', 4)
      + .0722 * calculate_wcag('wcag_foreground', 6)
    );

    const wcag_score = Math.round(
      (Math.max(background_math, foreground_math) + .05)
      / (Math.min(background_math, foreground_math) + .05)
      * 10
    ) / 10;

    core_elements.wcag_text_normal_result.innerHTML =
      wcag_score + ' / 7 = AAA '
      + (wcag_score > 7
        ? 'Passed'
        : 'Failed'
      ) + '<br>' + wcag_score + ' / 4.5 = AA '
      + (wcag_score > 4.5
        ? 'Passed'
        : 'Failed'
      );
    core_elements.wcag_text_large_result.innerHTML =
      wcag_score + ' / 4.5 = AAA '
      + (wcag_score > 4.5
        ? 'Passed'
        : 'Failed'
      ) + '<br>' + wcag_score + ' / 3 = AA '
      + (wcag_score > 3
        ? 'Passed'
        : 'Failed'
      );

    const background = core_elements.wcag_background.value;
    const foreground = core_elements.wcag_foreground.value;
    const text_large = core_elements.wcag_text_large.style;
    text_large.backgroundColor = background;
    text_large.color = foreground;
    const text_normal = core_elements.wcag_text_normal.style;
    text_normal.backgroundColor = background;
    text_normal.color = foreground;

    if(core_storage_data.background_table){
        core_elements.display_background.style.backgroundColor = background;
        core_elements.display_foreground.style.backgroundColor = foreground;
    }
}

function wcag_set(target){
    core_elements['wcag_' + target].value = '#' + core_elements.hex.value;
    update_wcag();
}

function wcag_switch(){
    [core_elements.wcag_background.value, core_elements.wcag_foreground.value]
      = [core_elements.wcag_foreground.value, core_elements.wcag_background.value];

    update_wcag();
}
