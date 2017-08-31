/*
*= require jquery-2.0.3.min
*= require modernizr.min
*= require bootstrap.min

*= require history.min.js
*= require history.adapter.jquery.min.js
*= require picky.min.js
*= require search.config.js
*= require zero-clipboard.min.js
*= require has_flash.js
*= require ICanHaz.js
*= require jquery.cookie.js
*/

// Sets up tabs for README/CHANGELOGs
// Placed here so it can be accessed
// by search results, and pod pages.
//
var post_expansion_setup = function(){
  $("#asset_switcher").tab();
  $('[data-toggle="tabajax"]').click(function(e) {
    var $this = $(this)
    var loadurl = $this.attr('href')
    var target = $this.attr('data-target')
    if ($(target).children().length == 0) {
      $.get(loadurl, function(data) {
        $(target).html(data);
      });
    }
    
    $this.tab('show');
    return false;
  });
}

// Remove keyboard on scroll
//
$(document).bind("touchmove", function(e){
  document.activeElement.blur();
  $("input").blur();
});

$( document ).ready( function(){

  // Add support for animating the marker on the homepages
  //
  $('.underscore a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    var index = $(e.target.parentElement).index()
    var width = $(window).width();
    var constant = (width < 768) ? 33: 40;
    var percent = (index * constant).toString()
    $("#homepage-tab-indicator").css("margin-left", percent + "%");
  })

  // Support non-flash clipboard stuff
  //
  if( hasFlash() ) {
    $("html").addClass("flash")
  }

  post_expansion_setup();
});

var rootSelector = ".space_for_appsight"

var showAppSight = function(name) {
  console.log("showing: " + name)

  // if($(rootSelector + " button")) { }
  $.getJSON("https://www.appsight.io/api/1.0/sdks/find?filter=top-apps-using&cocoapod=" + name + "&callback=?", function( data ) {
    console.log("Data")
    if (data.status && data.status.is_successful) {
      if (data.result) {
        $('<p>Apps using <a href="' + data.result.href + '">' + name + '</a></p>').appendTo(rootSelector)

        $.each(data.result.apps_using, function(i, app){
          var a = $('<a href=' + app.href + '/>')
          $('<img/>', {
            src: app.icons[0].url,
            title: app.name,
            style: 'margin: 2px;',
            "data-toggle": 'tooltip',
            "data-placement": 'top'
          }).appendTo(a)
          $(a).appendTo(rootSelector)
        })

        $(rootSelector + ' [data-toggle="tooltip"]').tooltip()
        $('<sub>powered by <a href="http://appsight.io">AppSight.io</a></sub>').appendTo(rootSelector)
        $('<hr/>').appendTo(rootSelector)
      }
    }
  });
}

var checkForAppSight = function(name) {
  console.log("check " + name)
  if(!$.cookie('enable_appsight')) {
    $(rootSelector).append("<button class='btn' type='button'>Show Apps using " + name + "</button>").on('click', function (e) {
      $.cookie('enable_appsight', "sure")
      showAppSight(name)
    })

  } else {
    showAppSight(name)
  }
}
