let NavVisibily = false;

$(".menu").click(function () {
  if (!NavVisibily) {
    $(".menu-items").attr("data-menu-state", "open");
    $("body").css("overflow-y", "hidden");
    NavVisibily = true;
  } else if (NavVisibily) {
    $(".menu-items").attr("data-menu-state", "close");
    $("body").css("overflow-y", "scroll");

    NavVisibily = false;
  }
});

$(".menu-item").click(function () {
  $(".menu-items").attr("data-menu-state", "close");
  $("body").css("overflow-y", "scroll");

  NavVisibily = false;
});
$(document).ready(function () {
  $("#preloader").hide();
  setTimeout(() => {
    gsap.fromTo(
      ".intro",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, 500);
  //   $(".intro").addClass("animate__animated animate__bounce");
});
