document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const sortOptions = document.getElementById("sort-options");
  const resultsDiv = document.getElementById("results");
  const suggestionsDiv = document.getElementById("suggestions");
  const totalResultsSpan = document.getElementById("total-results");

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const companies = data.companies;

      // Function to render results
      const renderResults = (results) => {
        resultsDiv.innerHTML = "";

        if (results.length === 0) {
          resultsDiv.innerHTML = "<p>Không tìm thấy.</p>";
          totalResultsSpan.textContent = "0";
          return;
        }

        totalResultsSpan.textContent = results.length;
        results.forEach(company => {
          const companyDiv = document.createElement("div");
          companyDiv.classList.add("result-item");
          companyDiv.innerHTML = `
            <h2>${company.name}</h2>
            <p><strong>Miền:</strong> ${company.region}</p>
            <p><strong>Địa chỉ:</strong> ${company.address}</p>
            <p><strong>Nhược điểm:</strong></p>
            <ul>${company.disadvantages.map(disadv => `<li>${disadv}</li>`).join("")}</ul>
          `;
          resultsDiv.appendChild(companyDiv);
        });
      };

      // Function to sort results
      const sortResults = (results, criteria) => {
        switch (criteria) {
          case "name-asc":
            return results.sort((a, b) => a.name.localeCompare(b.name));
          case "name-desc":
            return results.sort((a, b) => b.name.localeCompare(a.name));
          case "region-asc":
            return results.sort((a, b) => a.region.localeCompare(b.region));
          case "region-desc":
            return results.sort((a, b) => b.region.localeCompare(a.region));
          default:
            return results;
        }
      };

      // Function to show suggestions
      const showSuggestions = (query) => {
        suggestionsDiv.innerHTML = "";
        if (query.trim() === "") {
          suggestionsDiv.style.display = "none";
          return;
        }

        const filteredSuggestions = companies.filter(company =>
          company.name.toLowerCase().includes(query.toLowerCase())
        );

        filteredSuggestions.forEach(suggestion => {
          const suggestionDiv = document.createElement("div");
          suggestionDiv.textContent = suggestion.name;
          suggestionDiv.addEventListener("click", () => {
            searchInput.value = suggestion.name;
            searchHandler();
            suggestionsDiv.style.display = "none";
          });
          suggestionsDiv.appendChild(suggestionDiv);
        });

        suggestionsDiv.style.display = "block";
      };

      // Search handler
      const searchHandler = () => {
        const query = searchInput.value.toLowerCase();
        const filteredCompanies = companies.filter(company =>
          company.name.toLowerCase().includes(query) ||
          company.region.toLowerCase().includes(query)
        );

        const sortedCompanies = sortResults(filteredCompanies, sortOptions.value);
        renderResults(sortedCompanies);
      };

      // Event Listeners
      searchButton.addEventListener("click", searchHandler);
      sortOptions.addEventListener("change", searchHandler);
      searchInput.addEventListener("input", (event) => showSuggestions(event.target.value));
      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          searchHandler();
          suggestionsDiv.style.display = "none";
        }
      });
    })
    .catch(error => console.error("Error fetching data:", error));
});
