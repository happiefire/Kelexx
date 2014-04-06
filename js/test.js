var cf = 0; //指向的是each-pb
var cf_tag = 0;
var count = 0;
var timeout_hide, timeout_show;
var motherpb = 0;
var current_subpb = 0;

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
  score_input_hide(target);
}

//与楼上的差别：不执行score_input_hide()
function subpb_popover_show(target){
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
function popover_hide() {
  $(".popover-show").removeClass("popover-show").addClass("popover-hide");
  cf_tag = 0;
  $(".tag-focus").removeClass("tag-focus");
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
  popover_show(cf); 
//此选择结构为了保证快捷键时候，没有触发mouseenter的情况下，motherpb能够进行更新
  if (cf.hasClass("sub-pb")){
    find_mother();
  }
  else{};
}

//与do_focus的差别：不执行score_input_hide()
function subpb_do_focus(){
  popover_hide();
  $(".pb-focus").removeClass("pb-focus");
  cf.find(".pb-target").addClass("pb-focus");
  subpb_popover_show(cf); 
}

//此函数用于mouseenter中，但是后来被我注释掉了，那里有说原因
// function nopop_focus(){
//   popover_hide();
//   $(".pb-focus").removeClass("pb-focus");
//   cf.find(".pb-target").addClass("pb-focus");
// }

//此函数用于：找到小题对应的母题，motherpb为全局变量
//需要找母题的场景：click subpb，hover subpb
function find_mother(){
  motherpb = cf;
  do
    {
      motherpb = motherpb.prev();
    }
  while(motherpb.hasClass("has-sub-pb") == false)
}

// 需要找小题的场景：click motherpb
function find_subpb(){}

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
  } else if (cf.prev().is(":first-child")){ //注意，此处题型的h4影响了child的位置，故做了.prev的修改
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
      cf = cf.parent().next(".pb-group").find(".each-pb").first();
      do_focus();
    }
  }
}

function press_up() {
  if (cf == 0) {
    cf = $(".pb-list").find(".each-pb").first();
    do_focus();
  } else {
    if ( cf.find(".popover").hasClass("popover-show") ){
      // focus 到children里选择tag
      if (cf_tag == 0){
        cf_tag = cf.find(".each-tag").last();
        do_tag_focus();
      } else {
        if (cf_tag.is(":first-child")){
          cf_tag = cf_tag;
        } else {
          cf_tag = cf_tag.prev();
          do_tag_focus();
        }
      }
    } else {
      cf = cf.parent().prev(".pb-group").find(".each-pb").first();
      do_focus();
    }
  }
}

function press_enter(){
  if (cf_tag == 0){
    if (cf == 0){}
      else{
        clickpb();
      }
  } else{
    clicktag(cf_tag);
  };
}

function press_shift(){
  if(cf.find(".popover").hasClass("popover-show") == true){
    popover_hide();
  } else
  {do_focus();};
}

function press_number(target){
  cf = $(target);
  do_focus();
}

function press_space(){
  if(cf.hasClass("input-on")){
    //do nothing
  }
  else{
    popover_hide();
  }
  score_input_focus();
}

function hotkeys(){
  KeyboardJS.on('right', press_right);
  KeyboardJS.on('left', press_left);
  KeyboardJS.on('down', press_down);
  KeyboardJS.on('up', press_up);
  KeyboardJS.on('1', function() {press_number($("#pb-1"))});
  KeyboardJS.on('2', function() {press_number($("#pb-2"))});
  KeyboardJS.on('3', function() {press_number($("#pb-3"))});
  KeyboardJS.on('4', function() {press_number($("#pb-4"))});
  KeyboardJS.on('5', function() {press_number($("#pb-5"))});
  KeyboardJS.on('6', function() {press_number($("#pb-6"))});
  KeyboardJS.on('7', function() {press_number($("#pb-7"))});
  KeyboardJS.on('8', function() {press_number($("#pb-8"))});
  KeyboardJS.on('9', function() {press_number($("#pb-9"))});
  KeyboardJS.on('1>0', function() {press_number($("#pb-10"))});
  KeyboardJS.on('. + 1', function() {press_number($("#pb-11"))});
  KeyboardJS.on('1>2', function() {press_number($("#pb-12"))});
  KeyboardJS.on('1>3', function() {press_number($("#pb-13"))});
  KeyboardJS.on('1>4', function() {press_number($("#pb-14"))});
  KeyboardJS.on('1>5', function() {press_number($("#pb-15"))});
  KeyboardJS.on('1>6', function() {press_number($("#pb-16"))});
  KeyboardJS.on('1>7', function() {press_number($("#pb-17"))});
  KeyboardJS.on('1>8', function() {press_number($("#pb-18"))});
  KeyboardJS.on('1>9', function() {press_number($("#pb-19"))});
  KeyboardJS.on('2>0', function() {press_number($("#pb-20"))});
  KeyboardJS.on('2>1', function() {press_number($("#pb-21"))});
  KeyboardJS.on('. + 2', function() {press_number($("#pb-22"))});
  KeyboardJS.on('2>3', function() {press_number($("#pb-23"))});
  KeyboardJS.on('2>4', function() {press_number($("#pb-24"))});
  KeyboardJS.on('2>5', function() {press_number($("#pb-25"))});
  KeyboardJS.on('2>6', function() {press_number($("#pb-26"))});
  KeyboardJS.on('2>7', function() {press_number($("#pb-27"))});
  KeyboardJS.on('2>8', function() {press_number($("#pb-28"))});
  KeyboardJS.on('2>9', function() {press_number($("#pb-29"))});
  KeyboardJS.on('3>0', function() {press_number($("#pb-30"))});
  KeyboardJS.on('shift',press_shift);
  KeyboardJS.on('enter',press_enter);
  KeyboardJS.on('space',press_space);
}

//有关click的一堆，加了selectpb之后，干净多了
//有关motherpb的事情，为了保证快捷键里面不用再写一遍，写进了此基本函数clickpb
//此处motherpb各种弹出input。是否应该加上，如果已经输入过分数，则不弹出
//里面那个选择结构整理一下
function clickpb(){
    selectpb();
    //这个选择结构实现了：当取消母题的选中时，小题也被取消选中
    if (cf.hasClass("has-sub-pb") && pbselection(cf) == false){
      current_subpb = cf.next();
      console.log(current_subpb);
      do
      {
        current_subpb.find(".pb-target").removeClass("pb-selected");
        current_subpb.find(".each-tag").removeClass("tag-selected");
        current_subpb = current_subpb.next();
      }
      while(current_subpb.hasClass("sub-pb") == true)
    }
    else{};
    popover_hide();
  //下面一行如果删掉，用户可以将错误类型用作中性标签
    cf.find(".each-tag").removeClass("tag-selected");
}

//以下函数为了实现选中母题，之所以单独写，是为了保持selectpb等干净，这里要写一堆小题全部取消选中之类的蛋疼东西，防止搞乱其他基本的函数。
//将来再把selectpb之类的加上target参数，进行整合
function motherselect(){
  motherpb.find(".pb-target").toggleClass("pb-selected");
    if (motherpb.hasClass("has-score") && !motherpb.hasClass("input-on")){
    score_input_focus(motherpb);
  } else {
    if (motherpb.hasClass("input-on")){score_input_hide(motherpb)}
      else{}
  }
}

//以上函数为了实现选中母题

function selectpb(){
//这个选择结构用于实现：小题选中，母题也选中
  if (cf.hasClass("sub-pb")){
    cf.find(".pb-target").toggleClass("pb-selected");
    if (pbselection(motherpb))
    {
      if (pbselection(cf)){
        score_input_focus(motherpb);
      }
      else{
        motherpb.find("input").focus();
      }
    }
    else{
      motherselect();
    }
  } 
  else{
    cf.find(".pb-target").toggleClass("pb-selected");
    if (cf.hasClass("has-score") && !cf.hasClass("input-on")){
      score_input_focus(cf);
    } 
    else 
    {
      if (cf.hasClass("input-on"))
        {score_input_hide(cf)}
      else{}
    }
  }
 }

function pbselection(target){
  if ($(target).find(".pb-target").hasClass("pb-selected")){return true;}
  else{return false;}
}

function clicktag(target){
  if ($(target).hasClass("tag-selected")){
    $(target).removeClass("tag-selected");
  } else{
    $(target).addClass("tag-selected");
    if (pbselection(cf)){
//此处为了保证input focus
      if (cf.hasClass("sub-pb")){
        find_mother();
        motherpb.find("input").focus();
      }
      else{};
    }
      else{
        selectpb(); 
      }
  }
  popover_hide(); 
}
// 以上为有关click的一堆结束

function score_input_hide(target){
  $(".score-input").css("display","none");
  KeyboardJS.enable();
  $(target).removeClass("input-on");
}

//target必须是each pb
function score_input_focus(target){
  if (pbselection($(target))){
    score_input_hide($(target));
    $(target).find(".score-input").css("display","block").find("input").focus();
    KeyboardJS.disable();
    $(target).addClass("input-on");
  } //为了实现，红色的题取消选中，不出现input框
    else{}
}

//这段貌似没有用到
// function score_input_blur(){
//   cf.find(".score-input input").blur().parent().css("display","none");
// }

function event_in_eachpb(){
  if ($(event.target).parents(".each-pb").hasClass("each-pb")){return true}
    else{return false}
}

$(document).bind("click",function(){
  if ( event_in_eachpb() ) {
    //这一段仍然需要，否则input点不开
  } else{
    score_input_hide(cf);
    score_input_hide(motherpb);//此处暴力写了这句
  }
})
//以上为有关input的主要事情结束

$(function(){
  window.onload = function(){
    hotkeys();
  }

//此函数用于处理score input打开时候的键盘行为监视
  $(function(){
    $(".score-input input").keydown(function(event){
      if (event.keyCode == 13){
        score_input_hide(cf);
        return false; //这一行不加，将导致pbselect被取消
      }
      else{
        //do nothing
      }
    })
  });

//此函数为了实现：有input框的cf，当鼠标绕一圈重新enter时不执行mouseenter而进行了一些修改。主要是，当enter其他东西的时候，原来的cf的input-on要删除。其他时候这个删除操作时针对当前cf写的
//这样写完之后，input框在任何情况下不可能出现失去焦点但是却没有消失的情况
//但是这玩意儿太鸡巴长了，回头要把里面的函数拿出去  
//我了个擦擦擦
  $(".each-pb").mouseenter(function(){
    var ccff; 
    if (cf == 0){
      cf = $(this);
      do_focus();
    }
    else{
      ccff = cf;
      cf = $(this);
      if (cf.hasClass("input-on")){
          //nopop_focus();
          //hover应该保证选中，但是此时不应出pop
          //但是我后来又注释掉，是因为我用下来感觉不做更合适。用快捷键的时候，得分enter完，focus保留在小题上更好。用鼠标应与其保持一致。另外，假如用户比较靠谱，是先输的分数，则这里加不加无所谓，就算他不靠谱，用鼠标进行后续操作，此处做不做差距也几乎没有。保持一致更加重要
        }
        else{
          if (cf.hasClass("sub-pb")){
            find_mother();
            if (motherpb.hasClass("input-on")){
              subpb_do_focus();
            }
            else{
              do_focus();
              ccff.removeClass("input-on");
            }
          }
          else{
            do_focus();
            ccff.removeClass("input-on");
          }
        }
    }
  });

  $(".each-pb").mouseleave(function(){
      $(this).find(".popover-show").removeClass("popover-show").addClass("popover-hide");
      cf_tag = 0;
      $(this).find(".tag-focus").removeClass("tag-focus");
});

// click的工作方式，目前只改换了pb-target的样式
  $(".pb-target").on("click", function(){
    clickpb();
  });

 $(".each-tag").on("click", function(){
    clicktag($(this));
  });

//问题1:鼠标在tag上时，right，popover昙花一现
//解决办法：把原因里的hide全局改为hide this
//原因：当从第一题换到第二题时，cf变为第二题，此时第一题popover消失，然后mouseleave触发，然后hide，然后全部hide了

//问题2:tag无法添加tag_focus类
//解决办法：将所有mouseover改为mouseenter
//原因：疑似某个事件触发之后，mouseover被重新执行了一遍，导致了某些蛋疼的问题

  $(".each-tag").mouseenter(function(){
    cf_tag = $(this);
    do_tag_focus();
  });
});

