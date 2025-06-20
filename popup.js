const productiveSites = ["stackoverflow.com", "github.com", "w3schools.com"];
const reportDiv = document.getElementById("report");
const summaryDiv = document.getElementById("summary");
const resetBtn = document.getElementById("reset");

chrome.storage.local.get(null, data => {
    let totalProductive = 0;
    let totalUnproductive = 0;
    let output = "<ul>";

    for (const domain in data) {
        const seconds = data[domain];
        const minutes = Math.round(seconds / 60);
        const isProductive = productiveSites.includes(domain);

        output += `<li>${domain} — ${minutes} mins — ${isProductive ? "✅ Productive" : "❌ Unproductive"}</li>`;

        if (isProductive) {
            totalProductive += seconds;
        } else {
            totalUnproductive += seconds;
        }
    }

    output += "</ul>";
    reportDiv.innerHTML = output;

    const total = totalProductive + totalUnproductive;

    summaryDiv.innerHTML = `
        <p><strong>Productive Time:</strong> ${Math.round(totalProductive / 60)} mins</p>
        <p><strong> Unproductive Time:</strong> ${Math.round(totalUnproductive / 60)} mins</p>
        <p><strong> Total Time:</strong> ${Math.round(total / 60)} mins</p>
    `;
});

// Reset button click
resetBtn.addEventListener("click", () => {
    chrome.storage.local.clear(() => {
        reportDiv.innerHTML = "<p>Data reset. Visit sites to start tracking again!</p>";
        summaryDiv.innerHTML = "";
    });
});
