
if (window.localStorage.getItem("Lang") == null)
    // if (["zh_CN", "zh_TW", "en", "ja"].indexOf(navigator.language))
    changeLanguage("en");
else
    changeLanguage(window.localStorage.getItem("Lang"));
//监听地址栏
function hashChange(writeLocalStorage = false) {
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
            $('[data-lang]').each(function () {
                let this_lang = $(this).data("lang");
                $(this).html(tr[this_lang]);
            })
        },
        error: function () {
            Swal.fire({
                text: "Failed to load i18n data!",
                icon: 'error'
            })
        }
    });
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