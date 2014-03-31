function main_width(){
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
  main_width();
  $(window).resize(main_width);
  $(".pb-list").find("a").click(function(){
    $(this).toggleClass("pb-error");
  });

  $("#aaa").popover({
    animation: false,
    content: "you motherfucker"
  });

  $("#aaa").mouseover(function(){
    $(this).popover("show");
  });
  $("#bbb").popover({
    animation: false,
    content: "you yo"
  });

  $("#bbb").mouseover(function(){
    $(this).popover("show");
  });


});