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
              darken_lighten(-1);
          },
        },
        'grayscale': {
          'onclick': set_grayscale,
        },
        'hex': {
          'oninput': update_fromhex,
        },
        'hex-color': {
          'oninput': function(){
              document.getElementById('hex').value =
                document.getElementById('hex-color').value.substring(
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
        'wcag-background': {
          'oninput': function(){
              update_wcag(this.id);
          },
        },
        'wcag-background-color': {
          'oninput': function(){
              update_wcag(this.id);
          },
        },
        'wcag-background-use': {
          'onclick': function(){
              wcag_set('background');
          },
        },
        'wcag-foreground': {
          'oninput': function(){
              update_wcag(this.id);
          },
        },
        'wcag-foreground-color': {
          'oninput': function(){
              update_wcag(this.id);
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
          'todo': function(event){
              random_color('green');
          },
        },
        75: {
          'todo': function(event){
              darken_lighten(-1);
          },
        },
        76: {
          'todo': function(event){
              darken_lighten(1);
          },
        },
        78: {
          'todo': function(event){
              wcag_set('background');
          },
        },
        79: {
          'todo': function(event){
              wcag_set('foreground');
          },
        },
        82: {
          'todo': function(event){
              random_color('red');
          },
        },
        83: {
          'todo': wcag_switch,
        },
        85: {
          'todo': function(event){
              random_color('blue');
          },
        },
        88: {
          'todo': function(event){
              document.getElementById('hex').value = core_random_hex();
              update_fromhex();
          },
        },
        89: {
          'todo': set_grayscale,
        },
      },
      'storage': {
        'hex': '000000',
      },
      'title': 'ColorSelector.htm',
    });

    document.getElementById('wcag-background-color').value = '#000000';
    document.getElementById('wcag-foreground-color').value = '#ffffff';
    update_wcag('wcag-foreground-color');

    const colors = [
      'blue',
      'green',
      'red',
    ];
    for(const color in colors){
        document.getElementById(colors[color] + '-random').onclick = function(){
            const id = this.id;
            // Event fires when color button is clicked.
            random_color(id.substring(0, id.indexOf('-')));
        };

        document.getElementById(colors[color]).oninput = function(){
            // Event fires when colors[color] slider is being slided.
            update_fromslider(this.id);
        };

        document.getElementById(colors[color] + '-1').oninput = function(){
            const id = this.id;
            // Event fires when user changes colors[color] 1 text input.
            update_from1(id.substring(0, id.indexOf('-')));
            update_hex();
        };

        document.getElementById(colors[color] + '-255').oninput = function(){
            const id = this.id;
            // Event fires when user changes colors[color] 255 text input.
            update_from255(id.substring(0, id.indexOf('-')));
            update_hex();
        };
    }

    core_storage_update();
    update_fromhex();
}
