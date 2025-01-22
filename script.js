const imageUpload = document.getElementById('imageUpload');
const processBtn = document.getElementById('processBtn');
const outputText = document.getElementById('outputText');
const saveBtn = document.getElementById('saveBtn');
const notesContainer = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const categoryInput = document.getElementById('categoryInput');
const toggleTheme = document.getElementById('toggleTheme');

let extractedText = '';
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Render notes from localStorage
function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach(({ text, category }) => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.textContent = `[${category}] ${text}`;
    notesContainer.appendChild(noteDiv);
  });
}

// Process Image and Perform OCR
processBtn.addEventListener('click', () => {
  if (!imageUpload.files[0]) {
    alert('Please upload an image!');
    return;
  }

  const file = imageUpload.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageSrc = event.target.result;
    outputText.value = 'Processing image...';

    Tesseract.recognize(imageSrc, 'eng')
      .then(({ data: { text } }) => {
        extractedText = text;
        outputText.value = text;
      })
      .catch((err) => {
        console.error(err);
        alert('Error processing the image.');
      });
  };

  reader.readAsDataURL(file);
});

// Save Note
saveBtn.addEventListener('click', () => {
  const category = categoryInput.value.trim() || 'Uncategorized';
  if (!extractedText.trim()) {
    alert('No text to save!');
    return;
  }

  notes.push({ text: extractedText, category });
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();

  outputText.value = '';
  categoryInput.value = '';
  extractedText = '';
});

// Search Notes
searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const filteredNotes = notes.filter(({ text }) =>
    text.toLowerCase().includes(query)
  );
  notesContainer.innerHTML = '';
  filteredNotes.forEach(({ text, category }) => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.textContent = `[${category}] ${text}`;
    notesContainer.appendChild(noteDiv);
  });
});

// Toggle Dark Mode
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Initial render
renderNotes();
