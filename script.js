document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const resultsDiv = document.getElementById("results");
  const suggestionsDiv = document.getElementById("suggestions");

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const companies = data.companies;

      // Search Handler
      const searchHandler = () => {
        const query = searchInput.value.toLowerCase();
        resultsDiv.innerHTML = "";
        suggestionsDiv.innerHTML = "";

        const filteredCompanies = companies.filter(company =>
          company.name.toLowerCase().includes(query) ||
          company.region.toLowerCase().includes(query)
        );

        if (filteredCompanies.length === 0) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
          return;
        }

        filteredCompanies.forEach(company => {
          const companyDiv = document.createElement("div");
          companyDiv.classList.add("result-item");
          companyDiv.innerHTML = `
            <h2>${company.name}</h2>
            <p><strong>Region:</strong> ${company.region}</p>
            <p><strong>Address:</strong> ${company.address}</p>
            <p><strong>Disadvantages:</strong></p>
            <ul>${company.disadvantages.map(disadv => `<li>${disadv}</li>`).join("")}</ul>
          `;
          resultsDiv.appendChild(companyDiv);
        });
      };

      // Suggestions Handler
      const suggestionHandler = () => {
        const query = searchInput.value.toLowerCase();
        suggestionsDiv.innerHTML = "";

        if (query.length === 0) {
          return;
        }

        const filteredSuggestions = companies
          .filter(company => company.name.toLowerCase().includes(query))
          .slice(0, 5); // Show up to 5 suggestions

        filteredSuggestions.forEach(company => {
          const suggestionItem = document.createElement("div");
          suggestionItem.textContent = company.name;
          suggestionItem.addEventListener("click", () => {
            searchInput.value = company.name;
            suggestionsDiv.innerHTML = "";
            searchHandler();
          });
          suggestionsDiv.appendChild(suggestionItem);
        });
      };

      // Event Listeners
      searchButton.addEventListener("click", searchHandler);
      searchInput.addEventListener("input", suggestionHandler);
      searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          searchHandler();
          suggestionsDiv.innerHTML = "";
        }
      });
    })
    .catch(error => console.error("Error fetching data:", error));
});
