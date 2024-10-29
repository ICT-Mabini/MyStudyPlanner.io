document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const noteForm = document.getElementById('noteForm');
    const noteList = document.getElementById('noteList');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'student' && password === 'password') {
                alert('Login successful! Redirecting...');
                window.location.href = 'planner.html'; // Redirect to the planner features page
            } else {
                alert('Invalid username or password. Please try again.');
            }
        });
    }

    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const note = document.getElementById('note').value;

            if (note) {
                saveNote(note);
                document.getElementById('note').value = ''; // Clear the textarea
                displayNotes();
            }
        });

        noteList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                const li = e.target.parentElement;
                const noteIndex = li.getAttribute('data-index');
                const noteText = prompt('Edit your note:', li.firstChild.textContent);
                if (noteText !== null) {
                    updateNote(noteIndex, noteText);
                    displayNotes();
                }
            } else if (e.target.classList.contains('delete')) {
                const li = e.target.parentElement;
                const noteIndex = li.getAttribute('data-index');
                deleteNote(noteIndex);
                displayNotes();
            }
        });

        displayNotes();
    }

    function saveNote(note) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function updateNote(index, note) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes[index] = note;
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function deleteNote(index) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function displayNotes() {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        noteList.innerHTML = '';

        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.className = 'note-box'; // Add a class for styling
            li.innerHTML = `${note} <button class="edit">Edit</button> <button class="delete">Delete</button>`;
            noteList.appendChild(li);
        });
    }

    // FullCalendar setup
    if (document.getElementById('calendar')) {
        $('#calendar').fullCalendar({
            editable: true,
            events: JSON.parse(localStorage.getItem('tasks')) || [],
            eventClick: function(event) {
                if (confirm('Do you want to delete this task?')) {
                    $('#calendar').fullCalendar('removeEvents', event._id);
                    removeHighlight(event.start); // Remove highlight when task is deleted
                    saveTasks();
                }
            },
            dayClick: function(date) {
                const title = prompt('New task:');
                if (title) {
                    const newEvent = {
                        title: title,
                        start: date,
                        allDay: true
                    };
                    $('#calendar').fullCalendar('renderEvent', newEvent, true);
                    dateHighlight(date); // Highlight the date
                    saveTasks();
                }
            }
        });

        function saveTasks() {
            const tasks = $('#calendar').fullCalendar('clientEvents');
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function dateHighlight(date) {
            $(`.fc-day[data-date="${date.format()}"]`).addClass('highlight');
        }

        function removeHighlight(date) {
            $(`.fc-day[data-date="${date.format()}"]`).removeClass('highlight');
        }

        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        existingTasks.forEach(task => {
            dateHighlight(moment(task.start));
        });
    }
});