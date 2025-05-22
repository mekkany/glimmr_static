async function generateImage() {
  const prompt = document.getElementById('prompt').value;
  const output = document.getElementById('output');

  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  output.innerHTML = `<p>Generating image... please wait ⏳</p>`;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.image) {
      output.innerHTML = `<img src="${data.image}" alt="Generated Image" style="max-width:100%; margin-top: 1em;" />`;
    } else {
      output.innerHTML = `<p>Something went wrong. 😢</p>`;
    }
  } catch (error) {
    console.error(error);
    output.innerHTML = `<p>Error generating image. Try again.</p>`;
  }
}
