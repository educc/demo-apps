document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('personForm');
    const personList = document.getElementById('personsList');

    // Function to fetch and display persons
    function fetchPersons() {
        fetch('/api/persons')
            .then(response => response.json())
            .then(data => {
                personList.innerHTML = '';
                data.forEach(person => {
                    const li = document.createElement('li');
                    li.textContent = `${person.name}, Age: ${person.age}`;
                    li.dataset.id = person.id;

                    // Create update and delete buttons
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.onclick = () => updatePerson(person.id);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deletePerson(person.id);

                    li.appendChild(updateButton);
                    li.appendChild(deleteButton);
                    personList.appendChild(li);
                });
            });
    }

    // Function to handle form submission
    form.onsubmit = function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const person = {
            name: name,
            age: parseInt(age)
        };

        fetch('/api/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person)
        })
        .then(response => response.json())
        .then(() => {
            fetchPersons();
            form.reset();
        });
    };

    // Function to update a person
    function updatePerson(id) {
        const name = prompt('Enter new name:');
        const age = prompt('Enter new age:');
        if (name && age) {
            fetch(`/api/persons/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, age: parseInt(age) })
            })
            .then(() => fetchPersons());
        }
    }

    // Function to delete a person
    function deletePerson(id) {
        fetch(`/api/persons/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchPersons());
    }

    // Initial fetch of persons
    fetchPersons();
});