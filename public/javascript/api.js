$(document).ready(function () {

    function showSuccessMsg(msg) {
        if (!msg) {
            msg = 'Successfull'
        }
        let successElement = $('#success-msg');
        successElement.text(msg)
        successElement.removeClass('-top-1/2');
        successElement.addClass('top-14');
        setTimeout(() => {
            successElement.removeClass('top-14');
            successElement.addClass('-top-1/2');
        }, 5000)
    }

    function showErrorMsg(msg) {
        if (!msg) {
            msg = 'Error'
        }
        let errorElement = $('#error-msg');
        errorElement.text(msg)
        errorElement.removeClass('-top-1/2');
        errorElement.addClass('top-14');
        setTimeout(() => {
            errorElement.removeClass('top-14');
            errorElement.addClass('-top-1/2');
        }, 5000)
    }

    $('#category_settings').on('change', function () {
        var formData = new FormData($('#category_settings')[0]);
        var csrfToken = $('#category_settings [name="_csrf"');

        $.ajax({
            url: '/api/admin/settings',
            type: 'POST',
            data: formData,
            contentType: false, // Set to false when using FormData
            processData: false,
            headers: {
                'CSRF-Token': csrfToken
            },
            success: function (response) {
                showSuccessMsg('Changes saved');
            },
            error: function (error) {
                showErrorMsg();
                console.error('Settings Error:', error);
            }
        })
    })

    $('#filterByCategoryOptions').change(function () {
        let category = $(this).val();

        function renderData(data) {
            $('#articles').html('');
            for (var i = 0; i < data.length; i++) {
                let divStyle = `<div class="flex flex-col h-full bg-white p-5">
                <div class="h-36 md:flex hidden">
                    <img src="/static/article-images/${data[i]._id}.jpg" class="object-cover">
                </div>
    
                <div class="flex-1 p-2">
                    <p class="capitalize tracking-wide text-blue-500 mb-2">${data[i].date}</p>
                    <a href="/admin/article/${data[i]._id}">
                        <h2 class="text-xl font-bold">${data[i].topic}</h2>
                    </a>
                    <p class="font-bold text-gray-600">${data[i].author}</p>
                </div>
                <div class="w-full">
    
    
                    <a href="/admin/article/edit/${data[i]._id}" class="w-full "><button
                            class="px-5 mt-2 w-full py-2 bg-blue-500 text-white rounded text-center">Edit</button></a>
                    <a data-id="${data[i]._id}" data-type="article" class="w-full deleteBtn"><button
                            class="px-5 mt-2 w-full py-2 bg-red-500 text-white rounded text-center">Delete</button></a>
                    </div>
                </div>`;

                $('#articles').append(divStyle);
            }
        }

        function filterData() {
            if (category == 'All category') {
                $.get('/api/articles', function (data) {
                    renderData(data)
                })
            } else {
                $.get(`/api/${category}`, function (data) {
                    if (data.length === 0) {
                        $('#articles').html('<p class="col-span-3 text-center text-xl pt-5 font-semibold">No articles in this category</p>')
                    } else {
                        renderData(data)
                    }
                })
            }
        }

        filterData();
    });

    function validateInput(elementValue, msg, errState) {
        elementValue.next('.error').remove();
        if (elementValue.val().length === 0) {
            e.preventDefault()
            elementValue.after(`<small class="error text-red-500">${msg}</small>`)
            errState.push(true)
        }
    }

    function validateImage(image, errState) {
        if (image[0].files.length === 0) {
            event.preventDefault()
            alert('Image field is empty')
            errState.push(true)
        }
    }

    function checkFormValidity(errState, elementArray, callback) {
        if (!errState.includes(true)) {
            callback();
            for (var i = 0; i < elementArray.length; i++) {
                elementArray[i].val('');
            }
        }
    }

    function uploadCover() {
        var formData = new FormData($('#cover_upload_form')[0]);
        var csrfToken = $('#cover_upload_form [name="_csrf"');

        $.ajax({
            url: '/api/admin/upload-cover',
            type: 'POST',
            data: formData,
            contentType: false, // Set to false when using FormData
            processData: false,
            headers: {
                'CSRF-Token': csrfToken
            },
            success: function (response) {
                showSuccessMsg()
            },
            error: function (error) {
                showErrorMsg('Uploaded Successfully');
                console.error('Error uploading file:', error);
            }
        })
    }


    $('#cover_upload_form').on("submit", function (e) {
        e.preventDefault();

        var edition = $("input[name|='edition'");
        var content = $("input[name|='content'");
        var image = $("input[name|='new-cover'");

        var errState = [];

        validateInput(edition, "edition field is empty", errState);
        validateInput(content, "Author field is empty", errState);
        validateImage(image, errState, e);

        checkFormValidity(errState, [edition, content, image], function () {
            uploadCover();
        })
    })

    function uploadAd() {
        var formData = new FormData($('#ad_upload_form')[0]);
        var csrfToken = $('#ad_upload_form [name="_csrf"');

        $.ajax({
            url: '/api/admin/upload-ad',
            type: 'POST',
            data: formData,
            contentType: false, // Set to false when using FormData
            processData: false,
            headers: {
                'CSRF-Token': csrfToken
            },
            success: function (response) {
                if (!response.error) {
                    showSuccessMsg('Uploaded Successfully')
                } else {
                    showErrorMsg();
                    console.log(response.msg);
                }
            },
            error: function (error) {
                showErrorMsg();
                console.error('Error uploading file:', error);
            }
        })
    }

    function validatorUploadAd(event) {
        event.preventDefault();

        var image = $("input[name|='ad'");
        var errState = [];

        validateImage(image, errState, event)

        checkFormValidity(errState, [image], function () {
            uploadAd();
        })
    }

    $('#ad_upload_form').submit(function (e) {
        e.preventDefault();
        validatorUploadAd(e);
    })


})