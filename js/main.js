const headerEl = document.getElementById("header")

window.addEventListener("scroll", function () {
  const scrollPos = window.scrollY

  if (scrollPos > 1) {
    headerEl.classList.add("header_scroll")
  } else {
    headerEl.classList.remove("header_scroll")
  }
})



