async function generateImage() {
  const prompt = document.getElementById("promptInput").value;
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }
  alert("Pretending to generate image for: " + prompt);
  const style = document.getElementById("style").value;
  const finalPrompt = `${prompt}, style: ${style}, ultra realistic, 8K, first-person, GoPro`;

  document.getElementById("result").innerHTML = "Generating...";

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token YOUR_REPLICATE_API_TOKEN_HERE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "db21e45f37003c945e4c73f61c8e92f4c23fdc5f5c91a6dc39ee6e6bdf3c10c7",
      input: { prompt: finalPrompt }
    })
  });

  const prediction = await response.json();
  const interval = setInterval(async () => {
    const result = await fetch(prediction.urls.get, {
      headers: { "Authorization": "Token YOUR_REPLICATE_API_TOKEN_HERE" }
    });
    const data = await result.json();
    if (data.status === "succeeded") {
      clearInterval(interval);
      document.getElementById("result").innerHTML = `<img src="${data.output[0]}" alt="Generated Image" />`;
    }
  }, 2000);
}
