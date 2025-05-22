export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${replicateApiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "db21e45a3f1df9f8f4efab8c03eb0c420b6b0e398c8601686de51f7f4473c3d6",
      input: { prompt }
    })
  });

  const prediction = await response.json();

  if (prediction?.urls?.get) {
    const getUrl = prediction.urls.get;

    let result;
    while (!result || result.status !== "succeeded") {
      const res = await fetch(getUrl, {
        headers: { Authorization: `Token ${replicateApiToken}` }
      });
      result = await res.json();
      if (result.status === "succeeded") break;
      await new Promise((r) => setTimeout(r, 2000));
    }

    return res.status(200).json({ image: result.output[0] });
  } else {
    return res.status(500).json({ error: "Image generation failed" });
  }
}
Add serverless function to generate image using Replicate API
