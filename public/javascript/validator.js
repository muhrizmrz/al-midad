$(document).ready(function(){
    var topic = $("input[name|='topic'").val()
    var author = $("input[name|='author'").val()
    var article = $("input[name|='article'").val()
    var image = $("input[name|='image")
    var errorMsg = ''
    
    $('#add_article').submit((e)=>{    
        if(topic === ''||author === ''||article === ''||review === ''||image.files.lenght == 0){
            e.preventDefault()
            errorMsg = "Fill all the fields and upload image"
            alert(errorMsg)
        }
        alert("Added successfully")
    })

    $('#edit_review').submit((e)=>{
        if(topic === ''||author === ''||article === ''){
            e.preventDefault()
            errorMsg = "Fill all the fields"
            alert(errorMsg)
        }
    })
})