let NavVisibily = false;
const BaseUrl = "https://api2.observersteam.ir";
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
function gh(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+=-";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
if (localStorage.getItem("token") == null) {
  localStorage.setItem("token", gh(20));
}
localStorage.getItem("projects") == null
  ? localStorage.setItem(
      "projects",
      JSON.stringify([
        { id: 0, isLiked: false },
        { id: 1, isLiked: false },
        { id: 2, isLiked: false },
      ])
    )
  : "";

$(document).ready(async () => {
  $("#preloader").hide();
  setTimeout(() => {
    gsap.fromTo(
      ".intro",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, 500);
  LSdata = JSON.parse(localStorage.getItem("projects"));
  for (const key of LSdata) {
    let likes = $.ajax({
      url: `${BaseUrl}/like`,
      type: "POST",
      data: {
        q: "g",
        id: key.id,
      },
    });
    if (key.isLiked) {
      element = $(`.project-desc p i[data-id="${key.id}"]`)[0];
      element.className = "bi bi-heart-fill";
      element.parentElement.childNodes[0].nodeValue = likes.likes;
    } else {
      element = $(`.project-desc p i[data-id="${key.id}"]`)[0];
      element.classList = "bi bi-heart";
      element.parentElement.childNodes[0].nodeValue = likes.likes;
    }
  }
});

$(".project-desc p i").click((e) => {
  let projectid = parseInt(e.target.attributes["data-id"].value);
  let LSdata = JSON.parse(localStorage.getItem("projects"));
  LSdata.forEach((element) => {
    if (element.id == projectid) {
      if (element.isLiked) {
        element.isLiked = false;
      } else {
        element.isLiked = true;
      }
    }
  });
  localStorage.setItem("projects", JSON.stringify(LSdata));

  if (LSdata[projectid].isLiked) {
    $.ajax({
      url: BaseUrl + "/like",
      type: "POST",
      data: {
        q: "i",
        id: projectid,
        hash: localStorage.getItem("token"),
      },
    }).then((data) => {
      e.target.parentElement.childNodes[0].nodeValue = data.likes;
      e.target.classList.value = "bi bi-heart-fill";
    });
  } else {
    $.ajax({
      url: BaseUrl + "/like",
      type: "POST",
      data: {
        q: "d",
        id: projectid,
        hash: localStorage.getItem("token"),
      },
    }).then((data) => {
      e.target.parentElement.childNodes[0].nodeValue = data.likes;
      e.target.classList.value = "bi bi-heart";
    });
  }
});
