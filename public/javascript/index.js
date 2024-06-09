$(document).ready(function () {
  var heightOfNewContent = $("#news_content").height();
  $(".news_image").height(heightOfNewContent);

    AOS.init({
        duration: 1200, // Animation duration
        easing: 'ease-in-out', // Easing function
        once: true // Whether animation should happen only once
    });


  const mySwiper = new Swiper(".swiper-articles", {
    // Optional parameters
    loop: true,
    speed: 500,
    slidesPerView: 1,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    grabCursor: true,
    slidesPerView: 2, // Display two slides at a time
    effect: "cards",
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
      el: ".swiper-articles-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-articles-button-next",
      prevEl: ".swiper-articles-button-prev",
    },
    breakpoints: {
      // When window width is >= 576px
      0: {
        grabCursor: true,
        effect: "creative",
        centeredSlides: true,
        slideActiveClass: "swiper-article-active",
        wrapperClass: "swiper-article-wrapper",

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
        slidesPerView: 1, // Display two slides at a time
        navigation: {
          enabled: false,
          nextEl: ".swiper-articles-button-next",
          prevEl: ".swiper-articles-button-prev",
        },
      },
      680: {
        effect: "creative",
        centeredSlides: true,
        slideActiveClass: "swiper-article-active",
        wrapperClass: "swiper-article-wrapper",

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
        slidesPerView: 2, // Display two slides at a time
        navigation: {
          enabled: false,
          nextEl: ".swiper-articles-button-next",
          prevEl: ".swiper-articles-button-prev",
        },
      },
      830: {
        effect: "creative",
        centeredSlides: true,
        slideActiveClass: "swiper-article-active",
        wrapperClass: "swiper-article-wrapper",

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
        slidesPerView: 2, // Display two slides at a time
        navigation: {
          enabled: true,
          nextEl: ".swiper-articles-button-next",
          prevEl: ".swiper-articles-button-prev",
        },
      },
    },
  });
  /*const swiperWrapper = $('.swiper-wrapper');
    //const activeSlide = $('.swiper-article-active');
    const wrapperWidth = swiperWrapper.width();
    const activeWidth = (wrapperWidth / 3) + (wrapperWidth / 3);
    mySwiper[0].eventsListeners.slideChange[0](()=>{
        alert('sl');

    })*/

  const swiper = new Swiper(".swiper-news", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    speed: 300,
    mousewheel: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 30,
      slideShadows: true,
    },
    // If we need pagination
    pagination: {
      el: ".swiper-news-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-news-button-next",
      prevEl: ".swiper-news-button-prev",
    },
  });

  const swiperCover = new Swiper(".swiper-cover", {
    // Optional parameters
    direction: "horizontal",
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
      slideShadows: true,
    },
    // If we need pagination
    pagination: {
      el: ".swiper-cover-pagination",
    },
    breakpoints: {
      // When window width is >= 576px
      0: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 3,
      },
      700: {
        slidesPerView: 4,
      },
      900: {
        slidesPerView: 4,
      },
    },
  });

  /*var simplemde = new SimpleMDE({
        element: $("#markdown-editor")[0],
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "guide"]
      });*/

  AOS.init();

  $(".sidebar_icon").click(function () {
    $("#sidebar_menu").toggleClass("hidden");
    $("#sidebar_menu").toggleClass("md:hidden");
    $(".menu_button").toggleClass("hidden");
    $(".menu_close").toggleClass("hidden");
  });

  $("#blank_model").click(() => {
    $(".sidebar_menu").addClass("hidden");
    $(".menu_close").addClass("hidden");
    $(".menu_button").removeClass("hidden");
  });

  function handleDeleteModel(prompt, element) {
    $("#popup h5").text(prompt);
    $("#popup").removeClass("hidden");
    var id = element.attr("data-id");
    var type = element.attr("data-type");
    var url = `/admin/${type}/delete/${id}`;
    $(".sureDlt").attr("href", url);
  }

  $(".deleteBtn").click(function () {
    handleDeleteModel("Are you sure you want to delete this article?", $(this));
  });

  $(".deleteBtnNews").click(function () {
    handleDeleteModel("Are you sure you want to delete this news?", $(this));
  });

  $(".dltBtnCategory").click(function () {
    handleDeleteModel("Are you sure want to delete this category", $(this));
  });

  $("#cancelDltBtn").click(() => {
    $("#popup").addClass("hidden");
  });

  ///// Subscription

  var orderId = $("#orderId").val();
  var amount = $("#amount").val();
  var senderName = $("#name").val();
  var senderContact = $("#contact").val();
  var senderEmail = $("#email").val();
  var subscriptionId = $("#subscription_id").val();

  /*var options = {
    key: "rzp_test_ir6rbJEfHASIUM", // Enter the Key ID generated from the Dashboard
    amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Al Midad Arabic Bimonthly",
    order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    prefill: {
      name: senderName,
      email: senderEmail,
      contact: senderContact,
    },
    handler: function (response) {
      window.location.href = `/subscribe/payment-success/${response.razorpay_payment_id}`;
      fetch("/subscribe/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
          subscriptionId: subscriptionId,
        }),
      })
        .then((result) => {
          
        })
        .catch((error) => console.error("Error:", error));
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);

  $("#rzp-button1").on("click", function (e) {
    e.preventDefault();
    if (rzp1) {
      console.log("Razorpay instance created successfully:", rzp1);
      rzp1.open();
      console.log(subscriptionId);
    } else {
      console.error("Failed to create Razorpay instance");
    }
  });*/

  // $('#subscription_form').submit(function(event) {
  //     event.preventDefault(); // Prevent the default form submission
  //     var formData = $(this).serialize(); // Serialize the form data

  //     $.ajax({
  //         type: 'POST',
  //         url: '/subscribe', // API endpoint for subscription
  //         data: formData,
  //         success: function(response) {
  //             // Handle success response
  //             console.log(response)
  //             $('#subscription_form').find('input[type=text], input[type=email]').val(''); // Clear the form inputs after successful submission
  //             alert('Subscription successful! Thank you for subscribing.');
  //         },
  //         error: function(xhr, status, error) {
  //             // Handle error response
  //             alert('Error subscribing: ' + xhr.responseText);
  //         }
  //     });
  // });

  $("#launch_page_button").click(() => {
    $("#hadith").css({ marginRight: "-1500px" });
    $("#header_img").css({ opacity: "0" });
    $("#cover").css({ opacity: "0" });
    $("#launch_page").removeClass("hidden");
    $("#launched").removeClass("hidden");
  });

  $("#launch_button").click(() => {
    $("#launch_page").addClass("hidden");
    setTimeout(() => {
      $("#header_img").animate({ opacity: "1" });
      setTimeout(() => {
        $("#hadith").animate({ marginRight: "0" }, 800);
        setTimeout(() => {
          $("#cover").animate({ opacity: "1" }, 1000);
        }, 500);
      }, 500);
    }, 500);
  });

  //$('.recoommended-articles').not('.{{currentArticle}}').show()
});
