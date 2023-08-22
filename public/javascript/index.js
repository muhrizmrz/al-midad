const validateAndSanitizeUrl = require("../../confiq/urlValidator");

$(document).ready(function(){
    AOS.init();

    $('#sidebar_icon').click(function () {
        $('#sidebar_menu').toggleClass('hidden')
        $('#sidebar_menu').toggleClass('md:hidden')
        $('#menu_button').toggleClass('hidden')
        $('#menu_close').toggleClass('hidden')
    });

    $('#blank_model').click(() => {
        $('#sidebar_menu').addClass('hidden')
        $('#menu_close').addClass('hidden')
        $('#menu_button').removeClass('hidden')
    })

    $('.deleteBtn').click(function(){
        $('#popup').removeClass('hidden')
        var id = $(this).attr('data-id')
        id = validateAndSanitizeUrl(id)
        var url = `/admin/delete/${id}`
        $('.sureDlt').attr('href',url)
    })

    $('#cancelDltBtn').click(()=>{
        $('#popup').addClass('hidden')
    })

    $('#launch_page_button').click(() => {
        $('#hadith').css({marginRight:"-1500px"})
        $('#header_img').css({opacity:"0"})
        $('#cover').css({opacity:"0"})
        $("#launch_page").removeClass('hidden')
        $('#launched').removeClass('hidden')
    })

    $('#launch_button').click(() => {
        $("#launch_page").addClass('hidden')
        setTimeout(() => {
            $('#header_img').animate({opacity:"1"})
            setTimeout(() => {
                $('#hadith').animate({marginRight:"0"},800)
                setTimeout(() => {
                    $('#cover').animate({opacity:"1"},1000)          
                }, 500)
            }, 500)
        }, 500)
    })


    $('.recoommended-articles').not('.{{currentArticle}}').show()
})