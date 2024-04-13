$(document).ready(function () {

    var heightOfNewContent = $('#news_content').height();
    $('.news_image').height(heightOfNewContent);

    const mySwiper = new Swiper('.swiper-articles', {
        // Optional parameters
        loop: true,
        grabCursor: true,
        slidesPerView: 2,  // Display two slides at a time
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
                effect: 'creative',
                centeredSlides: true,
                slideActiveClass: 'swiper-article-active',
                wrapperClass: 'swiper-article-wrapper',

                creativeEffect: {
                    perspective: true,
                    prev: {
                        shadow: true,
                        translate: ["120%", 0, -500],
                    },
                    next: {
                        shadow: true,
                        translate: ["-120%", 0, -500],
                    },
                },
                slidesPerView: 1,  // Display two slides at a time
                navigation: {
                    enabled: false,
                    nextEl: '.swiper-articles-button-next',
                    prevEl: '.swiper-articles-button-prev',
                }
            },
            680: {
                effect: 'creative',
                centeredSlides: true,
                slideActiveClass: 'swiper-article-active',
                wrapperClass: 'swiper-article-wrapper',

                creativeEffect: {
                    perspective: true,
                    prev: {
                        shadow: true,
                        translate: ["50%", 0, -220],
                    },
                    next: {
                        shadow: true,
                        translate: ["-50%", 0, -220],
                    },
                },
                slidesPerView: 2,  // Display two slides at a time
                navigation: {
                    enabled: false,
                    nextEl: '.swiper-articles-button-next',
                    prevEl: '.swiper-articles-button-prev',
                }
            },
            830: {
                effect: 'creative',
                centeredSlides: true,
                slideActiveClass: 'swiper-article-active',
                wrapperClass: 'swiper-article-wrapper',

                creativeEffect: {
                    perspective: true,
                    prev: {
                        shadow: true,
                        translate: ["50%", 0, -220],
                    },
                    next: {
                        shadow: true,
                        translate: ["-50%", 0, -220],
                    },
                },
                slidesPerView: 2,  // Display two slides at a time
                navigation: {
                    enabled: true,
                    nextEl: '.swiper-articles-button-next',
                    prevEl: '.swiper-articles-button-prev',
                }
            },
        }
    })
    /*const swiperWrapper = $('.swiper-wrapper');
    //const activeSlide = $('.swiper-article-active');
    const wrapperWidth = swiperWrapper.width();
    const activeWidth = (wrapperWidth / 3) + (wrapperWidth / 3);
    mySwiper[0].eventsListeners.slideChange[0](()=>{
        alert('sl');

    })*/




    const swiper = new Swiper('.swiper-news', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        speed: 300,
        mousewheel: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
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
                slidesPerView: 1
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

    /*var simplemde = new SimpleMDE({
        element: $("#markdown-editor")[0],
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "guide"]
      });*/

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

    function handleDeleteModel(prompt, element) {
        $('#popup h5').text(prompt);
        $('#popup').removeClass('hidden')
        var id = element.attr('data-id')
        var type = element.attr('data-type')
        var url = `/admin/${type}/delete/${id}`
        $('.sureDlt').attr('href', url)
    }

    $('.deleteBtn').click(function () {
        handleDeleteModel('Are you sure you want to delete this article?', $(this))
    });

    $('.deleteBtnNews').click(function () {
        handleDeleteModel('Are you sure you want to delete this news?', $(this))
    });

    $('.dltBtnCategory').click(function () {
        handleDeleteModel('Are you sure want to delete this category', $(this))
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