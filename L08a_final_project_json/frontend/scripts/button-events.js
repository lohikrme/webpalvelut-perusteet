
// function to display data on html pre element
function displayData(data) {
    const output = document.getElementById('data_output')
    // print stringified json data with indentation
    output.textContent = JSON.stringify(data, null, 4);
}


// GET ALL PARROTS BUTTON
// notice that response is transformed into json form
document.getElementById('get_all_button').addEventListener('click', () => {
    fetch(`http://localhost:3200/proxy/parrots`)
        .then(resp => resp.json())
        .then(data => displayData(data))
        .catch(error => {
            console.error('Error fetching data: ', error.message)
            displayData({error: `Error fetching data: ${error.message}`})
        })
})

// GET PARROT BY ID BUTTON
document.getElementById('get_by_id_button').addEventListener('click', () => {
    // fetch first id from frontend
    let id = parseInt(document.getElementById('id_value').value)
    console.log(id)
    // use id to make the fetch
    fetch(`http://localhost:3200/proxy/parrots/${id}`)
        .then(resp => resp.json())
        .then(data => displayData(data))
        .catch(error => {
            console.error('Error fetching data: ', error.message)
            displayData({error: `Error fetching data: ${error.message}`})
        })
    return false;
})

// DELETE PARROT BUTTON
document.getElementById('delete_by_id_button').addEventListener('click', () => {
    // fetch first id from frontend
    let id = parseInt(document.getElementById('id_value').value)
    // use id to make the fetch
    fetch(`http://localhost:3200/proxy/parrots/${id}`, 
        {
            method: "DELETE"
        })
        .then(resp => resp.json())
        .then(data => {
            displayData(data)
            alert(JSON.stringify(data))
        })
        .catch(error => {
            console.error('Error fetching data: ', error.message)
            displayData({error: `Error fetching data: ${error.message}`})
        })
})

// UPDATE PARROT BUTTON
document.getElementById('update_by_id_button').addEventListener('click', () => {
    // fetch first id and other attributesfrom frontend
    let id = parseInt(document.getElementById('id_value').value)
    let name = document.getElementById('name_value').value
    let species = document.getElementById('species_value').value
    let age = parseInt(document.getElementById('age_value').value)
    // use id to make the fetch
    fetch(`http://localhost:3200/proxy/parrots/${id}`, 
        {
            method: "PUT",
            body: JSON.stringify({
                name: name,
                species: species,
                age: age
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(data => {
            displayData(data)
            alert(JSON.stringify(data))
        })
        .catch(error => {
            console.error('Error fetching data: ', error.message)
            displayData({error: `Error fetching data: ${error.message}`})
        })
})


// ADD A NEW PARROT BUTTON
document.getElementById('add_new_button').addEventListener('click', () => {
    // fetch first id and other attributesfrom frontend
    let id = parseInt(document.getElementById('id_value').value)
    let name = document.getElementById('name_value').value
    let species = document.getElementById('species_value').value
    let age = parseInt(document.getElementById('age_value').value)
    // all attributes are inside body
    fetch(`http://localhost:3200/proxy/parrots/`, 
        {
            method: "POST",
            body: JSON.stringify({
                id: id,
                name: name,
                species: species,
                age: age
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(data => {
            displayData(data)
            alert(JSON.stringify(data))
        })
        .catch(error => {
            console.error('Error fetching data: ', error.message)
            displayData({error: `Error fetching data: ${error.message}`})
        })
})

// CLEAR BUTTON
document.getElementById('clear_button').addEventListener('click', () => {
    // clear data
    displayData({message: "Data has been cleared!"})
    
})