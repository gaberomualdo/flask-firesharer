// Select your input type file and store it in a variable
const input = document.querySelector('input[type=file]');

const downloadURI = (uri, name) => {
  var link = document.createElement('a');
  link.download = name;
  link.href = encodeURI(uri);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

input.addEventListener(
  'change',
  () => {
    document.querySelector('label.upload').classList.add('has-file');
    document.querySelector('label.upload .title').innerText = 'Select Another File';
    document.querySelector('label.upload .file-name').innerText = input.files[0].name;
  },
  false
);
document.querySelector('.upload-btn').addEventListener('click', async () => {
  const file = input.files[0];
  fetch('/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      file: (await toBase64(file)).split(',')[1],
    }),
  })
    .then((response) => response.json())
    .then((success) => {
      const { pin } = success;
      document.querySelector('.success').classList.add('displayed');
      document.querySelector('.success h3').innerText = pin;
    });
});
document.querySelector('.download-btn').addEventListener('click', () => {
  fetch('/api/' + document.querySelector('input[type=number]').value, {})
    .then((response) => response.json())
    .then((success) => {
      downloadURI(success.file, success.filename);
    });
});
