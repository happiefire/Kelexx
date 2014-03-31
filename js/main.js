function modify_main_width(){
  var width = $(window).width() - $(".state-panel").width();
  $(".main-view").css("width", width);
}

function hehe(){
  var i = j = 1;
  $("#aaa").mouseout(function(){ i = 0; });
  $("#aaa").next().mouseout(function(){ j = 0; });
  if(i==0&&j==0){
    $("#aaa").popover("hide");
  }
}

$(function(){
  modify_main_width();
  $(window).resize(modify_main_width);

  var pb_target = ".pb-list li>a";
  $(pb_target).click(function(){
    $(this).toggleClass("pb-wrong");
  });


});