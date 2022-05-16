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
