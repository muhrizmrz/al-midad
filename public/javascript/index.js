$(document).ready(function () {

    const mySwiper = new Swiper('.swiper-articles', {
        // Optional parameters
        loop: true,
        grabCursor: true,
        slidesPerView: 2,  // Display two slides at a time
        spaceBetween: 20,
        effect: 'cards',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        centeredSlides: true,
        // If we need pagination
        pagination: {
            el: '.swiper-articles-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-articles-button-next',
            prevEl: '.swiper-articles-button-prev',
        },
        breakpoints: {
            // When window width is >= 576px
            0: {
                grabCursor: true,
                effect: "creative",
                creativeEffect: {
                    prev: {
                        shadow: true,
                        translate: ["120%", 0, -500],
                      },
                      next: {
                        shadow: true,
                        translate: ["-120%", 0, -500],
                      },
                },


                // Navigation arrows
                navigation: {
                    enabled: true,
                    nextEl: '.swiper-articles-button-next',
                    prevEl: '.swiper-articles-button-prev',
                },
                slidesPerView: 1,
            },
            576: {
                navigation: {
                    enabled: false
                },
                slidesPerView: 2,
            },
            776: {
                effect: 'cards',
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                },
                slidesPerView: 2,  // Display two slides at a time
                spaceBetween: 30,
                navigation: {
                    enabled: true,
                    nextEl: '.swiper-articles-button-next',
                    prevEl: '.swiper-articles-button-prev',
                }
            },
        }
    })


    const swiper = new Swiper('.swiper-news', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        speed: 300,
        mousewheel: true,
        coverflowEffect: {
            rotate: 30,
            slideShadows: true
        },
        // If we need pagination
        pagination: {
            el: '.swiper-news-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-news-button-next',
            prevEl: '.swiper-news-button-prev',
        }

    });

    const swiperCover = new Swiper('.swiper-cover', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        speed: 200,
        slidesPerView: 1,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        mousewheel: true,
        coverflowEffect: {
            rotate: 30,
            slideShadows: true
        },
        // If we need pagination
        pagination: {
            el: '.swiper-cover-pagination',
        },
        breakpoints: {
            // When window width is >= 576px
            0: {
                slidesPerView: 2
            },
            576: {
                slidesPerView: 3
            },
            700: {
                slidesPerView: 4
            },
            900: {
                slidesPerView: 4
            }
        }
    });



    AOS.init();


    $('.sidebar_icon').click(function () {
        $('#sidebar_menu').toggleClass('hidden')
        $('#sidebar_menu').toggleClass('md:hidden')
        $('.menu_button').toggleClass('hidden')
        $('.menu_close').toggleClass('hidden')
    });

    $('#blank_model').click(() => {
        $('.sidebar_menu').addClass('hidden')
        $('.menu_close').addClass('hidden')
        $('.menu_button').removeClass('hidden')
    })

    $('.deleteBtn').click(function () {
        $('#popup').removeClass('hidden')
        var id = $(this).attr('data-id')
        var type = $(this).attr('data-type')
        var url = `/admin/${type}/delete/${id}`
        $('.sureDlt').attr('href', url)
    })

    $('#cancelDltBtn').click(() => {
        $('#popup').addClass('hidden')
    })

    $('#launch_page_button').click(() => {
        $('#hadith').css({ marginRight: "-1500px" })
        $('#header_img').css({ opacity: "0" })
        $('#cover').css({ opacity: "0" })
        $("#launch_page").removeClass('hidden')
        $('#launched').removeClass('hidden')
    })

    $('#launch_button').click(() => {
        $("#launch_page").addClass('hidden')
        setTimeout(() => {
            $('#header_img').animate({ opacity: "1" })
            setTimeout(() => {
                $('#hadith').animate({ marginRight: "0" }, 800)
                setTimeout(() => {
                    $('#cover').animate({ opacity: "1" }, 1000)
                }, 500)
            }, 500)
        }, 500)
    })


    //$('.recoommended-articles').not('.{{currentArticle}}').show()
})