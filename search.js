$('.btn-shorten').on('click', function(){
  $.ajax({
    url: '/api/search',
    type: 'POST',
    dataType: 'JSON',
    data: JSON.stringify({url: $('#url-field').val()}),
    contentType: "application/json; charset=utf-8",
    success: function(data){
      console.log(data);
        // Provide a favicon download link that is returned by the server
        var resultHTML = '<a class="result" href="/download">' +
            'Download main favicon from '+ data.searchUrl + '</a>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
    }
  });

});
