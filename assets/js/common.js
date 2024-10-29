let mobilemenuopen = document.getElementById("mobile-menu-open");
let mobilemenuclose = document.getElementById("mobile-menu-close");
let mobilemenu = document.querySelector(".nav .nav-items ul");
let menuitem = document.querySelectorAll(".nav .nav-items ul li a");


mobilemenuopen.addEventListener("click", function () {
  mobilemenu.classList.add("nav-active");
});

function menuhide() {
  mobilemenu.classList.remove("nav-active");
}

mobilemenuclose.addEventListener("click", menuhide);
menuitem.forEach(item => {
    item.addEventListener("click", menuhide);
});



// ----------------------------------------------
// ----------  search js   -----------------------
// ----------------------------------------------

const searchlabel= document.getElementById('slabel');
const searchInput = document.getElementById('search-input');

    // Handle Enter key press
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          performSearch();
      }
  });

  // Handle button click
  document.getElementById('search-button').addEventListener('click', () => {
      performSearch();
  });

  // Function to perform the search
  function performSearch() {
      const query = searchInput.value.trim();
      if (query === "") {
          searchlabel.style.display = "block";
      } else {
          searchlabel.style.display = "none";
          window.location.href = `search.html?query=${encodeURIComponent(query)}`;
      }
  }


