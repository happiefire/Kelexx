var cf = 0;
var cf_tag = 0;
var count = 0;
var timeout_hide, timeout_show;

// function popover_show(target) {
//   timeout_show = window.setTimeout(function(){
//     $(".popover-show").removeClass("popover-show").addClass("popover-hide");
//     $(target).find(".popover").removeClass("popover-hide").addClass("popover-show");
//   }, 300);
//   window.clearTimeout(timeout_hide);
// }

// function popover_hide(target) {
//   timeout_hide = window.setTimeout(function(){
//     $(target).find(".popover").removeClass("popover-show").addClass("popover-hide");
//   }, 400);
// }


// 暂时取消了setTimeout的步骤
function popover_show(target) {
  $(".popover-show").removeClass("popover-show").addClass("popover-hide");
  $(target).find(".popover").removeClass("popover-hide").addClass("popover-show");
}

// popover_hide 现在的target参数是用不上的只是没删而已
// 现在做法是直接全局之内找.popover-show关掉之，不考虑具体哪个开着
// ====
// 所以现在popover_hide更确切的名字应该是：
// popover_hide_all(); 并非popover_show的严格反面
// ====
// 同时把cf_tag 重置到 0
// ct_tag 是全局var，只在.popover-show展开的时候才有必要存在
// 每次.popover-show被关掉时reset成0
function popover_hide(target) {
  $(".popover-show").removeClass("popover-show").addClass("popover-hide");
  cf_tag = 0;
  $(".tag-focus").removeClass("tag-focus");
  console.log(count++);
}


// 使用.pb-focus样式来标示目前cf里存着的对象，在_standard.sass里头，下面的tag-focus样式也是
// .pb-focus应作用在pb-target上，而非each-pb
// ====
// do_focus 工作逻辑：
// 先收起所有开着的东西
// 找到所有现在开着.pb-focus的东西，关之
// 把.pb-focus移到cf下的pb-target上
// 最后再展开它下面的popover
function do_focus() {
  popover_hide();
  $(".pb-focus").removeClass("pb-focus");
  cf.find(".pb-target").addClass("pb-focus");
  popover_show(cf); // 不应该把这两步分开吗？?
}


// 找到目前所有开着.tag-focus的，关之
// 然后只对currentfocus tag加上.tag-focus以标示cf_tag内的内容
function do_tag_focus() {
  $(".tag-focus").removeClass("tag-focus");
  cf_tag.addClass("tag-focus");
}

function press_right() {
  if (cf == 0) {
    // cf = 第一个
    cf = $(".pb-list").find(".each-pb").first();
    do_focus();
  } else if (cf.is(":last-child")){
    if (cf.parent().is(":last-child")) {
      cf = cf;
    } else {
      cf = cf.parent().next(".pb-group").find(".each-pb").first();
      do_focus();
    }
  } else {
    cf = cf.next(".each-pb");
    do_focus();
  }
} 

function press_left() {
  if (cf == 0) {
    cf = $(".pb-list").find(".each-pb").first();
    do_focus();
  } else if (cf.is(":first-child")){
    if (cf.parent().is(":first-child")) {
      cf = cf;
    } else {
      cf = cf.parent().prev(".pb-group").find(".each-pb").last();
      do_focus();
    }
  } else {
    cf = cf.prev(".each-pb");
    do_focus();
  }
}

function press_down() {
  if (cf == 0) {
    cf = $(".pb-list").find(".each-pb").first();
    do_focus();
  } else {
    if ( cf.find(".popover").hasClass("popover-show") ){
      // focus 到children里选择tag
      if (cf_tag == 0){
        cf_tag = cf.find(".each-tag").first();
        do_tag_focus();
      } else {
        if (cf_tag.is(":last-child")){
          cf_tag = cf_tag;
        } else {
          cf_tag = cf_tag.next();
          do_tag_focus();
        }
      }
    } else {
      // 跳到下一行
    }
  }
}


function hotkeys(){
  KeyboardJS.on('1>2', function() {
    popover_show($("#bp-12"));
  });
  KeyboardJS.on('1', function() {
    cf = $("#pb-1");
    do_focus();
  });
  KeyboardJS.on('2', function() {
    cf = $("#pb-2");
    do_focus();
  });

  KeyboardJS.on('right', press_right);
  KeyboardJS.on('left', press_left);
  KeyboardJS.on('down', press_down);
}

$(function(){

  window.onload = function(){
    hotkeys();
  }

  $(".each-pb").mouseover(function(){
    cf = $(this);
    do_focus();
  });

  $(".each-pb").mouseleave(function(){
    // 也许可以加一个mouseleave出发条件来解决下面那个问题
    popover_hide();    
  });

// click的工作方式，目前只改换了pb-target的样式
  $(".each-pb").on("click", function(){
    $(this).find(".pb-target").toggleClass("pb-wrong");
  });

// 在tag的条目上mouseover工作方式
// 我草…这tmd不是跟press_down一模一样的么，为毛还有问题呢为毛呢！
// chrome里查看那个元素时候.tag-focus就是加不上去！
// 哦，该不会是因为跟popover_hide里的:
//   $(".tag-focus").removeClass("tag-focus");
// 冲突了吧？？
  $(".each-tag").mouseover(function(){
    cf_tag = $(this);
    do_tag_focus();
  });
});

