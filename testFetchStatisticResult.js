function testFetchStatisticResult() {
  var prefix = 'http://42.96.165.209:8192';
  var url = prefix+'/fetch/statistic_result';
  $.ajax({
    url: url,
    type: 'POST',
    data: {project_name:'测试项目3', creator_id:'teacher0'},
    crossDomain: true,
    dataType: "json",
    success: function(result) {
      console.log(result);
    }
  });
}