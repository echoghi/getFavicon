$(document).ajaxStart(function(){
  $('body').addClass(".loading");
  $('.modal').css('display', 'block');
}).ajaxStop(function(){
  $('.modal').css('display', 'none');
  $('body').removeClass(".loading");
});

$('.btn-shorten').on('click', function(){
  $.ajax({
    url: '/api/search',
    type: 'POST',
    dataType: 'JSON',
    data: JSON.stringify({url: $('#url-field').val()}),
    contentType: "application/json; charset=utf-8",
    success: function(data){
      // Provide a favicon download link that is returned by the server
      var resultHTML = '<a class="result" href="/download">' +
          'Download main favicon from '+ data.searchUrl + '</a>';

      if(data.searchUrl === 'error'){
        resultHTML = '<p class="result">No Favicon was found, please check the URL and try again.';
      }
console.log(data.searchUrl)
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
    }
  });

});
