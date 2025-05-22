export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "db21e45a02a8c168e6c5d54a0986f4c4df9c6c4b1b4c7e3edbe7d3f8d82c6e02", // Stable Diffusion XL
        input: { prompt }
      })
    });

    const prediction = await response.json();

    if (prediction && prediction.urls && prediction.urls.get) {
      // Poll until image is ready
      let image = null;
      for (let i = 0; i < 10; i++) {
        const resultRes = await fetch(prediction.urls.get, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
          }
        });
        const result = await resultRes.json();

        if (result.status === 'succeeded') {
          image = result.output[result.output.length - 1];
          break;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (image) {
        return res.status(200).json({ image });
      } else {
        return res.status(500).json({ message: 'Image generation timeout' });
      }
    } else {
      return res.status(500).json({ message: 'Prediction failed' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'API request failed' });
  }
}

