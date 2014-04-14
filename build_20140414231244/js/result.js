var projName = "";
var classlist;
var standard_variance;
var problems;
var median_totalscore;
var difficulty;
var discrimination;
var students;
var totalscore;
var students_by_class = [];
var studentsid = [];
var studentsclass = [];


function testFetchStatisticResult() {
  var doc_href = ""+(document.location.href);
  for(var i = doc_href.indexOf("=")+1; i < doc_href.length; i++){
    projName += doc_href[i];
  }
  var prefix = 'http://42.96.165.209:8192';
  var url = prefix+'/fetch/statistic_result';
  $.ajax({
    url: url,
    type: 'POST',
    data: {project_name:projName, creator_id:'teacher0'},
    crossDomain: true,
    dataType: "json",
    success: function(result) {
      console.log(result);
      classlist = result.classlist;
      $("h1").html(projName);
      standard_variance = result.standard_variance.toFixed(2);
      median_totalscore = result.median_totalscore.toFixed(2);
      totalscore = result.totalscore;
      difficulty = result.difficulty.toFixed(2);
      discrimination = result.discrimination.toFixed(2);
      students = result.students;
      problems = result.problems;
      get_item_statistics();
      rank_pb();
      get_pb_statistics();
      get_student_statistics();
    }
  });
}

function get_item_statistics(){
  $("<td>" + totalscore + "</td>").appendTo($(".item-statistics tr").last());
  $("<td>" + median_totalscore + "</td>").appendTo($(".item-statistics tr").last());
  $("<td>" + standard_variance + "</td>").appendTo($(".item-statistics tr").last());
  $("<td>" + difficulty + "</td>").appendTo($(".item-statistics tr").last());
  $("<td>" + discrimination + "</td>").appendTo($(".item-statistics tr").last());
}

function rank_pb(){
  var length = problems.length;
  for(i=0; i<=length-2; i++){
    for(j=length-1; j>=1; j--){
      if(Number(problems[j].id) < Number(problems[j-1].id)){
        temp = problems[j];
        problems[j] = problems[j-1];
        problems[j-1] = temp;
      }
    }
  }
}


//这玩意儿本来是用来切分班组的。但是将来班组会剥离，现在做没啥意义。注释之
// function initiate_student(){
//   for(i=0;i<classlist.length;i++){
//     for(j=0;j<students.length;j++){
//       if(students[j].){
//         students_by_class[i].push(students[j]);
//       }
//       else{}
//     }
//   }
// }

function get_students_id(){
  for(i=0;i<students.length;i++){
    studentsid[i] = "";
    for(j = 0; j < students[i].student_id.indexOf("/"); j++){
      studentsid[i] += students[i].student_id[j];
    }
  }
}

function get_students_class(){
  for(i=0;i<students.length;i++){
    studentsclass[i] = "";
    for(j = students[i].student_id.indexOf("/")+1; j < students[i].student_id.length; j++){
      studentsclass[i] += students[i].student_id[j];
    }
  }
}

function rank_student(){
  var length = students.length;
  for(i=0; i<=length-2; i++){
    for(j=length-1; j>=1; j--){
      //对两个元素进行交换 
      if(Number(students[j].totalscore) > Number(students[j-1].totalscore)){
        temp = students[j];
        students[j] = students[j-1];
        students[j-1] = temp;
      }
    }
  }
}

function get_pb_statistics(){
  rank_pb();
  for(var i=0;i<problems.length;i++){
    var temp_html = "<tr>"
    +"<td>" + problems[i].id + "</td>"
    +"<td>" + problems[i].type+ "</td>"
    +"<td>" + problems[i].error_count + "</td>"
    +"<td>" + problems[i].error_rate.toFixed(2) + "</td>"
    +"<td>" + problems[i].difficulty.toFixed(2) + "</td>"
    +"<td>" + problems[i].discrimination.toFixed(2) + "</td>"
    +"</tr>";
    $(temp_html).appendTo(".pb-statistics");
  }
}

function get_student_statistics(){
  rank_student();
  get_students_id();
  get_students_class();
  for(i=0;i<students.length;i++){
    var temp_html = "<tr>"
    +"<td>" + studentsclass[i] +"</td>"
    +"<td>" + studentsid[i] +"</td>"
    +"<td>" + students[i].totalscore +"</td>"
    +"<td>" + Number(i+1) +"</td>";
    $(temp_html).appendTo(".student-statistics")
  }
}

function switch_sta(){
  $(".hide-pb-sta").on("click",function(){
    $(".pb-statistics").css("display","none")
  });

  $(".show-pb-sta").on("click",function(){
    $(".pb-statistics").css("display","block")
  });

  $(".show-stu-sta").on("click",function(){
    $(".student-statistics").css("display","block")
  });

  $(".hide-stu-sta").on("click",function(){
    $(".student-statistics").css("display","none")
  });

  $(".show-item-sta").on("click",function(){
    $(".item-statistics").css("display","block")
  });

  $(".hide-item-sta").on("click",function(){
    $(".item-statistics").css("display","none")
  });
}


$(function(){
  testFetchStatisticResult();
  switch_sta();
});









