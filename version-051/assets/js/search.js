document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    var input = document.getElementById("searchInput");
    var resultBox = document.getElementById("searchResults");
    var form = document.getElementById("searchForm");
    var query = params.get("q") || "";

    if (input) {
        input.value = query;
    }

    function render(value) {
        if (!resultBox) {
            return;
        }
        var key = value.trim().toLowerCase();
        var data = window.SEARCH_INDEX || [];
        var results = key ? data.filter(function (item) {
            return [item.title, item.year, item.region, item.type, item.genre].join(" ").toLowerCase().indexOf(key) !== -1;
        }).slice(0, 80) : data.slice(0, 40);

        resultBox.innerHTML = results.map(function (item) {
            return '<a class="search-result-item" href="' + item.url + '">' +
                '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
                '<span><h2>' + item.title + '</h2><p>' + item.region + ' · ' + item.type + ' · ' + item.year + '</p><p>' + item.oneLine + '</p></span>' +
                '</a>';
        }).join("") || '<p class="empty-state">没有找到匹配内容。</p>';
    }

    if (form && input) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var value = input.value.trim();
            var url = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
            window.history.replaceState(null, "", url);
            render(value);
        });
        input.addEventListener("input", function () {
            render(input.value);
        });
    }

    render(query);
});
