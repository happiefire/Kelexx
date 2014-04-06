function modify_main_width(){
  var width = $(window).width() - $(".state-panel").width();
  $(".main-view").css("width", width);
}

$(function(){
  modify_main_width();
  $(window).resize(modify_main_width);


});