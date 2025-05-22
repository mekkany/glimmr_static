function generateImage() {
  const prompt = document.getElementById('prompt').value;
  const output = document.getElementById('output');

  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  // For now, just test the flow
  output.innerHTML = `<p>Generating image for: <strong>${prompt}</strong></p>`;
}
