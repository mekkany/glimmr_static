<script>
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const result = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = input.value;
    result.innerHTML = "Generating...";

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.image) {
      result.innerHTML = `<img src="${data.image}" alt="AI Image" style="max-width: 100%; border-radius: 10px;" />`;
    } else {
      result.innerHTML = `Error: ${data.error}`;
    }
  });
</script>

