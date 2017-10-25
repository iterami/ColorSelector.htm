'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'color-random': {
          'onclick':  function(){
              random_color();
          },
        },
        'darken': {
          'onclick': function(){
              darken_lighten(0);
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
        'wcag-background-use': {
          'onclick': function(){
              wcag_set('background');
          },
        },
        'wcag-foreground-use': {
          'onclick': function(){
              wcag_set('foreground');
          },
        },
      },
      'keybinds': {
        71: {
          'todo': function(){
              random_color('green');
          },
        },
        72: {
          'todo': function(){
              document.getElementById('hex').value = core_random_hex();
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
      },
      'title': 'ColorSelector.htm',
    });

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

    document.getElementById('hex').value = core_random_hex();
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
}
