const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener('click', ()=>{
   //Animate Links
    navLinks.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade");
    });

    //Hamburger Animation
    hamburger.classList.toggle("toggle");
});

$(" .card").mouseenter(function(item) {
    $(" .card").removeClass("card-selected");
    $(" #" + $(item.currentTarget).attr("id")).addClass("card-selected");
  });

  const visibilitySelect = document.getElementById('visibility-select');
  const securitySelectContainer = document.getElementById('security-select-container');

  visibilitySelect.addEventListener('change', function () {
      if (this.value === 'private') {
          securitySelectContainer.style.display = 'block';
      } else {
          securitySelectContainer.style.display = 'none';
      }
  });

  