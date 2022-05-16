let NavVisibily = false;

$(".menu").click(function () {
  if (!NavVisibily) {
    $(".menu-items").attr("data-menu-state", "open");
    NavVisibily = true;
  } else if (NavVisibily) {
    $(".menu-items").attr("data-menu-state", "close");
    NavVisibily = false;
  }
});

$(".menu-item").click(function () {
  $(".menu-items").attr("data-menu-state", "close");
  NavVisibily = false;
});
