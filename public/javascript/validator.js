
$(document).ready(function () {

    function validator(event) {

        $('.error').remove()

        var topic = $("input[name|='topic'")
        var author = $("input[name|='author'")
        var article = $("textarea")
        var image = $("input[name|='image'")[0]
        var errorMsg = 'Fill '
        var errState = []


        function validating(elementValue, msg, e) {
            if (elementValue.val().length === 0) {
                e.preventDefault()
                elementValue.after(`<small class="error text-red-500">${msg}</small>`)
                errState.push(true)
            }
        }

        function validateImage() {
            if (image.files.length === 0) {
                event.preventDefault()
                alert('Image field is empty')
                errState.push(true)
            }
        }

        function action(event) {
            event.preventDefault()
            alert(errorMsg)
        }

        validating(topic, "Topic field is empty", event)
        validating(author, "Author field is empty", event)
        validating(article, "Article field is empty", event)

        validateImage()

        !errState.includes(true) ? alert("Added") : ''

    }

    var form = $('#settings');

    form.submit((e) => {
        alert("Settings saved");
    })

    $('#add_article').submit(function (e) {
        validator(e)
    })

    $('#edit_review').submit((e) => {
        if (topic === '' || author === '' || article === '') {
            e.preventDefault()
            errorMsg = "Fill all the fields"
            alert(errorMsg)
        }
    })
})