$(document).ready(function () {
    formValidation()
    $('.edit').on('click', function () {
        $('#editModal').data('id', $(this).data('id'))
    })

    $('.delete').on('click', function () {
        $('#deleteModal').data('id', $(this).data('id'))
    })

    $('.save').on('click', function(){
        var id = $('#editModal').data('id');
        var form = document.getElementById('edit-form')
        var name = form['name'].value;
        if( !form.checkValidity()){
            return false
        }
        fetch('/edit_name', {
                method: 'PATCH', 
                body: JSON.stringify({id: id, name: name}), 
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .then(response => location.reload())
            .catch(error => console.error('Error:', error));
    })

    $('.confirm-delete').on('click', function () {
        var id = $('#deleteModal').data('id');
        fetch('/delete_video', {
                method: 'POST',
                body: JSON.stringify({
                    id: id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .then(response => location.reload())
            .catch(error => console.error('Error:', error));
    })

})

function formValidation() {
    document.querySelectorAll("input").forEach(function (input) {
        // Add a css class on submit when the input is invalid.
        input.addEventListener("invalid", function () {
            input.classList.remove("valid");
            input.classList.add("invalid");
        });

        // Remove the class when the input becomes valid.
        // 'input' will fire each time the user types
        input.addEventListener("input", function () {
            if (input.validity.valid) {
                input.classList.remove("invalid");
                input.classList.add("valid");
            } else {
                input.classList.remove("valid");
                input.classList.add("invalid");
            }
        });
    });
}