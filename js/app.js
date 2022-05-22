let NavVisibily = false;
const BaseUrl = "http://api2.observersteam.ir";

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
  // Get Users from api and update the page
  let users = await $.ajax({
    url: `${BaseUrl}/team`,
    type: "GET",
  });

  for (const user of users) {
    // set the user's avatar
    $(`.card[data-userid="${user.id}"] .card__img img`).attr(
      "src",
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
    );
    // set the user's discord tag

    $(
      `.card[data-userid="${user.id}"] .card__social-icons i[data-discord-username="discord"]`
    )[0].setAttribute(
      "data-discord-username",
      `${user.username}#${user.discriminator}`
    );
    // set the user's instagram username
    $(`.card[data-userid="${user.id}"] .card__social-icons .instagram`).attr(
      "href",
      `https://www.instagram.com/${user.instagram}`
    );

    // set the user's github username
    $(`.card[data-userid="${user.id}"] .card__social-icons .github`).attr(
      "href",
      `https://github.com/${user.github}`
    );
    console.log(user.id);
  }
  $("#preloader").hide();
  setTimeout(() => {
    gsap.fromTo(
      ".intro",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, 500);

  // Get Likes from localStorage and api and update the page
  lsData = JSON.parse(localStorage.getItem("projects"));
  let likes = await $.ajax({
    url: `${BaseUrl}/like`,
    type: "POST",
    data: {
      q: "g",
    },
  });
  for (const like in likes.data) {
    if (lsData[like].isLiked) {
      element = $(`.project-desc p i[data-id="${likes.data[like].id}"]`)[0];
      element.className = "bi bi-heart-fill";
      element.parentElement.childNodes[0].nodeValue = likes.data[like].likes;
    } else {
      element = $(`.project-desc p i[data-id="${likes.data[like].id}"]`)[0];
      element.classList = "bi bi-heart";
      element.parentElement.childNodes[0].nodeValue = likes.data[like].likes;
    }
  }
  //   get username when the user clicks on the discord icon
  $(".card__social-icons i[data-discord-username]").click(function (e) {
    e.preventDefault();
    let username = $(this).attr("data-discord-username");
    navigator.clipboard.writeText(username);
    $(".copy-clipboard").addClass("copied");
    setTimeout(() => {
      $(".copy-clipboard").removeClass("copied");
    }, 1000 * 4);
  });
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

// Form submit
$(".form__input button").click((e) => {
  e.preventDefault();
  if (
    $(".form__input #name").val() !== "" &&
    validator.isEmail($(".form__input #email").val()) &&
    $(".form__input #suject").val() !== "" &&
    $(".form__input #message").val() !== ""
  ) {
    $.ajax({
      url: BaseUrl + "/contact",
      type: "POST",
      data: {
        name: $(".form__input #name").val(),
        email: $(".form__input #email").val(),
        subject: $(".form__input #subject").val(),
        message: $(".form__input #message").val(),
        hash: localStorage.getItem("token"),
      },
    }).then((data) => {
      if (data.success == true) {
        $(".form__input #name").val("");
        $(".form__input #email").val("");
        $(".form__input #subject").val("");
        $(".form__input #message").val("");
        $(".form__input button")
          .html(`Sent <i class="bi bi-check-circle-fill"></i>`)
          .addClass("sent")
          .attr("disabled", true);
      } else {
        $(".form__input button").text("Error!");
        setTimeout(() => {
          $(".form__input button").text("Send");
        }, 1000 * 4);
      }
    });
  } else {
    $(".form__input button")
      .html(`Error <i class="bi bi-exclamation-triangle-fill"></i>`)
      .addClass("error");
    setTimeout(() => {
      $(".form__input button")
        .html(`Submit <i class="bi bi-send"></i>`)
        .removeClass("error");
    }, 1000 * 4);
  }
});

$(".form__input #email").keyup(() => {
  if (!validator.isEmail($(".form__input #email").val())) {
    $(".form__input #email").addClass("error");
  } else {
    $(".form__input #email").removeClass("error");
  }
});
