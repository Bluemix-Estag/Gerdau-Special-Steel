'use strict'



let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stream,
  recorder,
  counter = 1,
  chunks,
  media;

start.onmousedown = e => {
  e.preventDefault();
    $('.progress').removeClass('hide');
    console.log('onmousedown');
    toggleRecording(start);
}

start.onmouseup = e => {
  e.preventDefault();
  $('.progress').addClass('hide');
  toggleRecording(start);
}


start.ontouchstart = e => {
  
    $('.progress').removeClass('hide');
  console.log('onmousedown');
  toggleRecording(start);


}

start.ontouchend = e => {
  e.preventDefault();
  $('.progress').addClass('hide');
  toggleRecording(start);
  console.log($('#switch').val());
}
