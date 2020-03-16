
if (window.localStorage.getItem("Lang") == null) {
    switch (navigator.language) {
        //这段好笨啊，但懒得用聪明方法了
        case "zh_CN":
            changeLanguage("zh_CN");
            break;
        case "zh_TW":
            changeLanguage("zh_TW");
            break;
        case "zh_HK":
            changeLanguage("zh_TW");
            break;
        case "ja":
            changeLanguage("ja");
            break;
        default:
            changeLanguage("en");
            break;
    }
    hashChange();
} else {
    changeLanguage(window.localStorage.getItem("Lang"));
}
//监听地址栏
function hashChange() {
    let url = window.location.href;
    let index = url.lastIndexOf("\#");
    str = url.substring(index + 1, url.length);
    if (["zh_CN", "zh_TW", "en", "ja"].indexOf(str) !== -1) {
        changeLanguage(str, true);
    }
}
function changeLanguage(Lang, notify = false) {
    $.ajax({
        type: "get",
        url: "js/i18n/" + Lang + ".json",
        success: function (tr) {
            if (notify) {
                Swal.fire({
                    text: tr.DOC_SWITCH_LANGUAGE,
                    icon: 'success'
                })
            }
            window.localStorage.setItem("Lang", Lang);
            document.title = tr.DOC_TITLE;
            $("html").attr("lang", Lang)
            $('[data-lang]').each(function () {
                let this_lang = $(this).data("lang");
                $(this).html(tr[this_lang]);
            })
            hitokoto(Lang);
            if (window.localStorage.getItem("BGM_play") == null) {
                Swal.fire({
                    title: tr.MUSIC_PLAY,
                    text: tr.MUSIC_ASK,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#1685a9',
                    cancelButtonColor: '',
                    confirmButtonText: tr.MUSIC_CONFIRM,
                    cancelButtonText: tr.MUSIC_CANCEL
                }).then((result) => {
                    if (result.value) {
                        window.localStorage.setItem("BGM_play", true);
                        ap.play();
                    } else {
                        window.localStorage.setItem("BGM_play", "false");
                    }
                })
            }

        },
        error: function () {
            Swal.fire({
                text: "Failed to load i18n data!",
                icon: 'error'
            })
        }
    });
}
function hitokoto(lang) {
    $.ajax({
        type: "get",
        url: "js/hitokoto/" + lang + ".json",
        success: function (response) {
            let index = Math.floor((Math.random() * response.hitokoto.length));
            console.log(response.hitokoto[index]);
            $("#hitokoto").text(response.hitokoto[index].c + "——" + response.hitokoto[index].a);
        }
    });
}
function font(lnag) {
    const font = [
        "zh_CN"
    ];
}
if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8)) {
    window.onhashchange = hashChange;
} else {
    setInterval(function () {
        let ischanged = isHashChanged();
        if (ischanged) {
            hashChange();
        }
    }, 150);
}