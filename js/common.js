var is_showing_toast = !1,
    is_load_more_notifications_clicked = !1,
    enabledSubmitButtons = [];
$(document).ready(function() {
    $("#page_loading_notification").hide();
    validate();
    additional_validations();
    var b = $("#footer").outerHeight();
    $("#content").css("padding-bottom", b);
    var k = window.innerHeight;
    $(".close_action").click(function() { hide_modals() });
    $(document).on("click", ".image_ad", function() {
        var b = $(this).attr("id");
        $.ajax("/cms/ad_clicks/" + b, { type: "POST" }) });
    $(document).on("click", ".fa-question-circle", function() {
        768 > window.innerWidth && ($(".toast-content").text($(this).attr("title")),
            is_showing_toast || (is_showing_toast = !0, $(".toast").fadeIn(400).delay(3E3).fadeOut(400, function() { is_showing_toast = !1 })))
    });
    $(document).on("click", ".showToastOnMobile", function() { 768 > window.innerWidth && ($(".toast-content").text($(this).attr("title")), is_showing_toast || (is_showing_toast = !0, $(".toast").fadeIn(400).delay(3E3).fadeOut(400, function() { is_showing_toast = !1 }))) });
    768 < window.innerWidth && ($(".phone_number").css("color", "#333"), $(".phone_number").css("text-decoration", "none"), $(".phone_number").removeAttr("href"));
    detectIE() || displayMessageInConsole();
    $(document).ajaxStart(function(b) { $(":submit").each(function() { $(this).is(":enabled") && !$(this).hasClass("disableNot") && ($(this).prop("disabled", !0), enabledSubmitButtons.push(this)) }) }).ajaxStop(function() {
        for (; 0 < enabledSubmitButtons.length;) {
            var b = enabledSubmitButtons.pop();
            $(b).prop("disabled", !1) } });
    l_cookie && (b = new WebSocket(web_socket_server_base_url + "?token=" + l_cookie), b.onopen = function(b) { console.log("Connection established!") }, b.onmessage = function(b) {
        b =
            JSON.parse(b.data); - 1 == window.location.href.indexOf("application/form") && ("undefined" != typeof b.logo && null !== b.logo ? $(".socket_notification").html("<a href='/notification/click/" + b.student_internship_notification_history_id + "/in_product_notification' target='_blank'><div><div class='table-row'><div class='notification-image table-cell'><img src= '" + b.logo + "'></div><div class='notification-content table-cell'><p id='title'>" + b.title + "</p><p id='message'>" + b.message + "</p><div></div></div></a><div id='dismiss-in-product-notification'>&times;</div>") :
            $(".socket_notification").html("<a href='/notification/click/" + b.student_internship_notification_history_id + "/in_product_notification' target='_blank'><div><div class='table-row'><div class='notification-content table-cell'><p id='title'>" + b.title + "</p><p id='message'>" + b.message + "</p><div></div></div></a><div id='dismiss-in-product-notification'>&times;</div>"), $(".socket_notification").show(), playSound("/static/audio/notification.mp3"), setTimeout(function() { $(".socket_notification").fadeOut() },
                3E4));
        load_panel_in_product_notification(b.student_internship_notification_history_id)
    }, process_notifications())
});

function process_notifications() {
    $("li.dropdown#notifications_glyph_container a").on("click", function(b) { $(this).parent().toggleClass("open");
        $(this).parent().is(".open") && ($("#notification_number").css("display", "none"), $("#notification_number").html(""), "(" == document.title.charAt(0) && (document.title = document.title.substr(document.title.indexOf(" ") + 1)), is_load_more_notifications_clicked = !1, load_panel_notifications()) });
    $("body").on("click", function(b) {
        $("li.dropdown#notifications_glyph_container").is(b.target) ||
            0 !== $("li.dropdown#notifications_glyph_container").has(b.target).length || 0 !== $(".open").has(b.target).length || $("li.dropdown#notifications_glyph_container").children("#notifications_glyph").removeClass("open")
    });
    $(document).on("click", "#see_more_notifications", function() { is_load_more_notifications_clicked = !0;
        load_panel_notifications() });
    $(document).on("click", ".individual-panel-notification", function() { $(this).hasClass("not_clicked-notification") && $(this).addClass("clicked-notification").removeClass("not_clicked-notification") });
    992 > window.innerWidth ? ($("#notifications_glyph").detach().appendTo("#main-navbar-header"), $("#notifications_glyph").addClass("exceptional_menu_item")) : ($("#notifications_glyph").detach().appendTo("#notifications_glyph_container"), $("#notifications_glyph").removeClass("exceptional_menu_item"));
    992 > window.innerWidth && ($("#notifications-dropdown").css("left", 8 - $("#notifications_glyph").offset().left), $("#notifications-dropdown").css("width", $(document).width()));
    get_and_populate_unseen_notifications_count();
    $(document).on("click", "#dismiss-in-product-notification", function() { $(this).closest(".socket_notification").hide() })
}

function get_and_populate_unseen_notifications_count() { $.ajax("/notification/get_unseen_notifications_count/" + student_id, { type: "POST", success: get_unseen_notifications_count_success }) }

function playSound(b) {
    try {
        (new Audio(b)).play() } catch (k) { console.log("Invalid Audio Path") } }

function get_unseen_notifications_count_success(b) {
    try {
        if (b = JSON.parse(b), b.success) {
            var k = b.unseenNotificationsCount;
            0 < k && ($("#notification_number").css("display", "inline-block"), $("#notification_number").html(k), document.title = "(" + k + ") " + document.title) } } catch (l) {} }

function load_panel_in_product_notification(b) { $("#see_more_notifications").remove();
    $("#loading_image").remove();
    $("#header-notifications-body").prepend("<div id='loading_image'><img src='/static/images/common/ajax-loader.gif'></div>");
    $.ajax("/notification/load_in_product_notifications_for_panel/" + b, { data: { rows: 1, offset: 0 }, type: "POST", success: load_panel_in_product_notification_success }) }

function load_panel_in_product_notification_success(b) {
    try {
        if (b = JSON.parse(b), $("#loading_image").remove(), b.success) {
            $("#header-notifications-body").prepend(b.view);
            var k;
            k = 0 == $("#notification_number").html().length ? 1 : parseInt($("#notification_number").html()) + 1;
            $("#notifications_glyph").is(".open") || ($("#notification_number").css("display", "inline-block"), $("#notification_number").html(k));
            "(" == document.title.charAt(0) && (document.title = document.title.substr(document.title.indexOf(" ") + 1));
            document.title =
                "(" + k + ") " + document.title
        } else throw_semi_error(b.errorThrown)
    } catch (l) { throw_error(l), $(".loading_image").hide() }
}

function load_panel_notifications() { $("#see_more_notifications").remove();
    $("#no_notifications").remove();
    $("#loading_image").remove();
    $("#header-notifications-body").append("<div id='loading_image'><img src='/static/images/common/ajax-loader.gif'></div>");
    var b = $("#header-notifications-body").children(".individual-panel-notification").length,
        k = "/notification/paginated_notifications_for_panel/" + student_id;
    NProgress.start();
    $.ajax(k, { data: { rows: 10, offset: b }, type: "POST", success: load_panel_notifications_success }) }

function load_panel_notifications_success(b) {
    try {
        b = JSON.parse(b), $("#loading_image").remove(), b.success ? (NProgress.done(), b.no_notifications ? $("#header-notifications-body").append("<div id='no_notifications'>No recent updates</div>") : ($("#header-notifications-body").append(b.view), b.to_show_more_notifications && $("#header-notifications-body").append("<div id='see_more_notifications'>View older notifications</div>")), is_load_more_notifications_clicked && (b = 38, null != $("#see_more_notifications").outerHeight() &&
            (b = $("#see_more_notifications").outerHeight()), $("#header-notifications-body").scrollTop($("#header-notifications-body").scrollTop() + b))) : throw_semi_error(b.errorThrown)
    } catch (k) { throw_error(k), NProgress.done(), $(".loading_image").hide() }
}

function displayMessageInConsole() { console.log("");
    console.log("%cINTERNSHALA\n", "position: absolute; top: 10px;color: #fff; padding:5px; font-weight: bold; font-family: helvetica; pading:10px; background-color: #1295c9; font-size: 40px; margin:0 auto; align:center;");
    console.log("");
    console.log("%cWe are transforming the lives of millions of college students, one meaningful internship at a time. Apply here  https://internshala.com/careers to work with us.", "font-family: arial; font-style: italic; font-size: 14px;") }
$(function() { $(".dropdown-hover").hover(function() { $(".dropdown-menu", this).stop(!0, !0).show();
        $(this).toggleClass("open");
        $("b", this).toggleClass("caret caret-up") }, function() { $(".dropdown-menu", this).stop(!0, !0).hide();
        $(this).toggleClass("open");
        $("b", this).toggleClass("caret caret-up") }) });
$(window).resize(function() {
    var b = $("#footer").outerHeight();
    $("#content").css("padding-bottom", b) });

function hide_modals() { $("#error").hide();
    $("#semi_error_modal").hide();
    $("#error_modal").hide();
    $("#semi_success_modal").hide();
    $("#success_modal").hide();
    $("#alert_modal").hide();
    $("#custom_success_modal").hide();
    $("#resume-score-tip-modal").hide();
    $(".loading_image").hide() }
var onError = function() { NProgress.done();
    $(".loading_image").hide();
    show_error("Oops! Sorry, something went wrong. Please try again and if the problem persists, please write to support@internshala.com and we'd be happy to assist.") };

function show_error(b) { $(".loading_image").hide();
    b = "<div> <a title='Close' id='close' class='close_error'>X</a>" + b + "</div>";
    $("#error").show().html(b).slideDown(500);
    $(".close_error").click(function() { $("#error").slideUp(500) }) }

function failure_notification(b) { $(".loading_image").hide();
    b = "<div>" + b + "</div>";
    $("#failure_notification").show().html(b).slideDown(500);
    setTimeout(function() { $("#failure_notification").slideUp(500) }, 6E3) }

function success_notification(b) { $(".loading_image").hide();
    b = "<div>" + b + "</div>";
    $("#success_notification").show().html(b).slideDown(500);
    setTimeout(function() { $("#success_notification").slideUp(500) }, 6E3) }

function general_notification_with_timeout(b) { b = "<div>" + b + "</div>";
    $("#general_notification").show().html(b).slideDown(500);
    setTimeout(function() { $("#general_notification").slideUp(500) }, 6E3) }

function general_notification(b) { b = "<div>" + b + "</div>";
    $("#general_notification").show().html(b).slideDown(500) }

function throw_validation_error(b, k) {
    k = "undefined" == typeof k || "" == k ? "" : k + " ";
    $.each(b, function(b, e) {
        if ("no_input" === b) return show_error(e), $(".loading_image").hide(), !0;
        var h = $("<label>").text(e);
        if ("selected_categories_for_user_preference" === b) var n = "multiselect_category";
        else "profile_primary" == b || "profile_input" == b ? n = "profile_input_container" : "start_date_1" == b || "start_date_2" == b ? n = "later_date_option_container" : "part_time_date_from" == b || "part_time_date_till" == b ? n = "partTimeDateContainer" : "full_time_date_from" ==
            b || "full_time_date_till" == b ? n = "fullTimeDateContainer" : "start_year" == b ? n = "college_start_year_container" : "end_year" == b ? n = "college_end_year_container" : "survey_experience_internship_year" == b ? n = "survey_experience_internship_year_chzn" : "salary2" == b ? n = "stipendvalue" : (n = $(k + "[name=" + b + "]").closest("input").attr("id"), "undefined" == typeof n && (n = $(k + "[name=" + b + "]").closest("textarea").attr("id")), "undefined" == typeof n && (n = $(k + "[name=" + b + "]").closest("select").attr("id")));
        h.attr({
            "class": "help-block form-error",
            id: n + "-error",
            "for": n
        });
        "toc" === b ? h.insertAfter("#label_toc") : "phone_primary" === b || "country_code" === b ? h.insertAfter("#phone_primary") : h.insertAfter(k + "#" + n + "");
        $(h).parent().addClass("has-error");
        $(h).parent().removeClass("has-success");
        $(h).closest("input").addClass("error");
        $(h).closest("input").removeClass("valid");
        $(".loading_image").hide()
    })
}

function throw_semi_error(b) { b.validationError ? throw_validation_error(b.validationError) : ($("#semi_error_modal .text-message").html(b), $("#semi_error_modal").show()) }

function throw_error(b, k) { k ? ($("#error_modal .text-message").html(b), $("#error_modal .btn").attr("href", k), $("#error_modal").show()) : throw_semi_error(b) }

function throw_semi_success(b) { $("#semi_success_modal .text-message").html(b);
    $("#semi_success_modal").show() }

function throw_success(b, k) { k ? ($("#success_modal .text-message").html(b), $("#success_modal .btn").attr("href", k), $("#success_modal").show()) : throw_semi_success(b) }

function throw_custom_success(b, k) { k ? ($("#custom_success_modal .text-heading-message").html(b.heading), $("#custom_success_modal .text-content-message").html(b.content), $("#custom_success_modal .btn").attr("href", k), $("#custom_success_modal").show()) : throw_semi_custom_success(b) }

function throw_semi_custom_success(b) { $("#custom_success_modal .text-heading-message").html(b.heading);
    $("#custom_success_modal .text-content-message").html(b.content);
    $("#custom_success_modal").show() }

function internshala_alert(b, k) { $("#alert_modal .text-message").html(b);
    $("#alert_modal a").attr("href", k);
    k && $("#alert_modal_backdrop").show();
    $("#alert_modal").show() }

function goToByScroll(b) { b = b.replace("link", "");
    $("html,body").animate({ scrollTop: $("#" + b).position().top }, "slow") }

function call_autocomplete(b, k, l, e, h) {
    $("#" + b).bind("keydown", function(b) { b.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active && b.preventDefault() }).autocomplete({
        source: function(e, q) {
            var n = $("#" + b).attr("where_condition");
            "undefined" == typeof n && (n = "0");
            var l = $("#" + b).attr("where_params");
            "undefined" == typeof l && (l = "0");
            h || (h = "0");
            var A = encodeURIComponent(e.term.split(/,\s*/).pop());
            "" != k && "" != A && "." != A && $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/autocomplete/" +
                    k + "/" + A + "/" + n + "/" + l + "/" + h,
                dataType: "json",
                success: function(b) { "skill" !== k && "degree" !== k || 0 != b.result.length ? q(b.result) : q(["No match found"]) }
            })
        },
        minLength: "skill" === k ? 1 : 3,
        focus: function() {
            return !1 },
        select: function(b, e) {
            if (l) {
                if ("skill" === k && "No match found" === e.item.value) {
                    var h = this.value.split(/,\s*/);
                    h.pop();
                    h.push("");
                    this.value = h.join(",");
                    return !1 }
                h = this.value.split(/,\s*/);
                h.pop();
                h.push(e.item.value);
                h.push("");
                this.value = h.join(",");
                return !1 }
            if ("skill" === k && "No match found" === e.item.value) return h =
                this.value.split(/,\s*/), h.pop(), h.push(""), this.value = h.join(","), !1
        }
    });
    return []
}

function call_autocomplete_without_ajax(b, k, l, e, h) { $("#" + b).bind("keydown", function(b) { b.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active && b.preventDefault() }).autocomplete({ source: function(b, e) {
            var h = b.term.split(/,\s*/).pop();
            e($.ui.autocomplete.filter(k, h).slice(0, 10)) }, focus: function() {
            return !1 }, select: function(b, e) {
            if (l) {
                var h = this.value.split(/,\s*/);
                h.pop();
                h.push(e.item.value);
                h.push("");
                this.value = h.join(",");
                return !1 } } });
    return [] }

function validate() {
    var b;
    $.validator.addMethod("greater_than", function(k, e, h) { b = h;
        return this.optional(e) || k > h }, function() {
        return "Please enter value greater than " + b });
    $.validator.addMethod("email", function(b, e) {
        var h = b.split("@"),
            n = !1; "internshala.com" == h[1] ? n = !0 : h[0].includes("+") || (n = !0);
        return this.optional(e) || b.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) && n }, "Please enter a valid email address");
    $.validator.addMethod("countrycode", function(b, e) {
        return this.optional(e) || b.match(/^[/\s+/][0-9]+$/) && 5 >= b.length }, "Please specify a valid country code starting with +");
    $.validator.addMethod("mobilenumber", function(b, e) {
        return this.optional(e) || b.match(/^[789][0-9]{9}$/) }, "Please specify a valid phone number");
    $.validator.addMethod("onlynumbers", function(b, e) {
        return this.optional(e) || b.match(/^[0-9]+$/) }, "Please enter only numbers");
    $.validator.addMethod("nonumbers", function(b, e) {
        return this.optional(e) ||
            b.match(/^[^0-9]+$/)
    }, "Please do not enter any number");
    $.validator.addMethod("onlyalpha", function(b, e) {
        return this.optional(e) || b.match(/^[a-zA-Z ]+$/) }, "Please enter only alphabets");
    $.validator.addMethod("decimalnumbers", function(b, e) {
        return this.optional(e) || b.match(/^[0-9]+[.]+[0-9]+$/) || b.match(/^[0-9]+$/) }, "Please enter only number or decimal number");
    $.validator.addMethod("basicstring", function(b, e) {
        return this.optional(e) || b.match(/^[a-zA-Z]+[a-zA-Z .(),&']*$/) || "10th" === b || "12th" === b || -1 !==
            b.indexOf("5 Years")
    }, "Please enter only valid characters");
    $.validator.addMethod("valid_degree", function(b, e) {
        return this.optional(e) || b.match(/^[a-zA-Z]+[a-zA-Z .(),&\-']*$/) || "10th" === b || "12th" === b || -1 !== b.indexOf("5 Years") }, "Please enter only valid characters");
    $.validator.addMethod("valid_stream", function(b, e) {
        return this.optional(e) || b.match(/^[a-zA-Z]+[a-zA-Z .(),&']*$/) }, "Please enter only valid characters");
    $.validator.addMethod("valid_institute", function(b, e) {
            return this.optional(e) || b.match(/^[a-zA-Z]+[a-zA-Z .(),&']*$/) },
        "Please enter only valid characters");
    $.validator.addMethod("valid_school", function(b, e) {
        return this.optional(e) || b.match(/^[a-zA-Z]+[a-zA-Z .(),&']*$/) }, "Please enter only valid characters");
    $.validator.addMethod("valid_city", function(b, e) {
        return this.optional(e) || is_valid_city }, "Please select a more specific location (City)");
    $.validator.addMethod("mindate", function(b, e, h) { b = $(e).datepicker("getDate");
        return this.optional(e) || h <= b }, "Please specify a date greater than today");
    $.validator.addMethod("maxdate",
        function(b, e, h) { b = $(e).datepicker("getDate");
            return this.optional(e) || h >= b }, "Please specify a date within range");
    $.validator.addMethod("valid_external_link", function(b, e) {
        return this.optional(e) || b.match(/^http/) }, "Please enter valid a url (url must start with http://)");
    var k;
    $.validator.addMethod("profile_url", function(b, e, h) {
        var n = "";
        "github" == h ? (n = "/(?:(?:http|https)://)?(?:www.)?github.com/\\w{1,}", k = "Github") : "behance" == h ? (n = "/(?:(?:http|https)://)?(?:www.)?behance.net/\\w{1,}", k = "Behance") :
            "developer_account" == h && (n = "/(?:(?:http|https)://)?(?:www.)?play.google.com/store/apps/(?:dev|developer)\\?\\w{1,}", k = "Play store");
        return this.optional(e) || b.match(n)
    }, function() {
        return "Please enter a  valid " + k + " URL" });
    $.validator.addMethod("filesize", function(b, e, h) {
        return this.optional(e) || e.files[0].size <= h }, "Please obey the file size")
}

function checkLogoExtension() {
    var b = [".jpeg", ".jpg", ".png", ".gif", ".bmp"],
        k = document.getElementById("logo").value,
        l = k.substr(k.lastIndexOf("."), k.length);
    if (k) {
        var k = 0,
            e;
        for (e in b)
            if (b[e] == l) { k = 1;
                break }
        if (1 != k) return throw_semi_error("Please upload a file with a valid extension."), !1;
        if (1 < $("#logo")[0].files[0].size / 1024 / 1024) return throw_semi_error("File should be less than 1MB!"), !1 }
    return !0 }

function checkAttachmentValidation() {
    var b = ".zip .pdf .doc .docx .jpeg .jpg .png".split(" "),
        k = document.getElementById("mail_attachment").value,
        l = k.substr(k.lastIndexOf("."), k.length);
    if (k) {
        var k = 0,
            e;
        for (e in b)
            if (b[e] == l) { k = 1;
                break }
        1 != k ? throw_semi_error("This extension is not allowed!") : 1 < $("#mail_attachment")[0].files[0].size / 1024 / 1024 && throw_semi_error("File should be less than 1MB!") } }

function countdown_timer(b) { 10 > seconds && (seconds = "0" + seconds);
    document.getElementById(b).innerHTML = seconds;
    0 == seconds ? (clearInterval(countdownTimer), document.getElementById(b).innerHTML = "0") : seconds-- }

function additional_validations() {
    $.validator.addMethod("accept", function(b, k, l) { b = "string" === typeof l ? l.replace(/\s/g, "").replace(/,/g, "|") : "image/*";
        l = this.optional(k);
        var e;
        if (l) return l;
        if ("file" === $(k).attr("type") && (b = b.replace(/\*/g, ".*"), k.files && k.files.length))
            for (l = 0; l < k.files.length; l++)
                if (e = k.files[l], !e.type.match(new RegExp(".?(" + b + ")$", "i"))) return !1;
        return !0 }, $.validator.format("Please enter a value with a valid Filetype."));
    $.validator.addMethod("extension", function(b, k, l) {
        l = "string" ===
            typeof l ? l.replace(/,/g, "|") : "png|jpe?g|gif";
        return this.optional(k) || b.match(new RegExp(".(" + l + ")$", "i"))
    }, $.validator.format("Please enter a value with a valid extension."));
    $.validator.addMethod("size", function(b, k, l) {
        return "file" === $(k).attr("type") && $(k)[0].files[0].size / 1024 / 1024 > l ? !1 : !0 }, $.validator.format("File size should be less than {0}MB."))
}

function make_field_readonly(b) { $(document).on("focusin", b, function(b) { $(this).prop("readonly", !0) });
    $(document).on("focusout", b, function(b) { $(this).prop("readonly", !1) }) }

function reset_form_validations(b) { $("#" + b).validate().resetForm();
    $(".form-control").removeClass("error");
    $(".form-control").removeClass("valid");
    $(".form-group").removeClass("has-error");
    $(".form-group").removeClass("has-success") }

function reset_profile_forms() { $(".form-group div").removeClass("has-error");
    $(".form-group div").removeClass("has-success");
    $(".form-group").removeClass("has-error");
    $(".form-group").removeClass("has-success");
    $(".form-group .form-control").removeClass("error");
    $(".form-group .form-control").removeClass("valid");
    $(".form-error").html("") }

function isScrolledIntoView(b) {
    var k = $(window).scrollTop() + $(window).height();
    if (b.length && "undefined" != typeof $(b).offset()) {
        var l = $(b).offset().top;
        $(b).height();
        return l <= k }
    return !1 }

function get_cookie(b) { b += "=";
    var k = "";
    0 < document.cookie.length && (offset = document.cookie.indexOf(b), -1 != offset && (offset += b.length, end = document.cookie.indexOf(";", offset), -1 == end && (end = document.cookie.length), k = unescape(document.cookie.substring(offset, end))));
    return k }

function setError(b, k) { $(b).text(k);
    $(b).show();
    $(b).closest("input").addClass("error");
    $(b).closest("input").removeClass("valid") }

function removeError(b) { $(b).text("");
    $(b).closest("input").addClass("valid");
    $(b).closest("input").removeClass("error") }
String.prototype.replaceAll = function(b, k, l) {
    return this.replace(new RegExp(b.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), l ? "gi" : "g"), "string" == typeof k ? k.replace(/\$/g, "$$$$") : k) };

function prompt_for_correct_email(b, k, l) {
    var e = $("#" + b).find("#" + k).val().split("@");
    if (2 > e.length) $("#correction,#correction-button-bottom,#correction-button-top").remove();
    else {
        var h = e[0],
            e = $.inArray(e[1], input_domains);
        "email_subscription_popup_container" === l && $(".subscription_alert_footer").css("margin-top", "");
        if (0 <= e) {
            $("#correction,#correction-button-bottom,#correction-button-top").remove();
            var n = h + "@" + valid_domains[e],
                h = "Did you mean: <u><b>" + n + "</b></u>";
            "undefined" !== typeof l ? ($(".subscription_alert_footer").css("margin-top",
                ""), "email_subscription_popup_container" === l && $(".subscription_alert_footer").css("margin-top", "15px"), $("#email").after('<span id="correction-button-top" class="visible-xs email-correction-prompt-message-popup">' + h + "</span>"), $("#" + l).after('<span id="correction-button-bottom" class="hidden-xs email-correction-prompt-message-popup">' + h + "</span>")) : "subscribe-form-at-bottom" == b ? $("#" + b).find("#" + k).after('<label id="correction" class="email-correction-prompt-message">' + h + "</label>") : $("#" + b).find("#" +
                k).after('<span id="correction" class="email-correction-prompt-message">' + h + "</span>");
            $("#correction,#correction-button-bottom,#correction-button-top").click(function() { $("#" + b).find("#" + k).val(n);
                $("#correction,#correction-button-bottom,#correction-button-top").remove();
                $(".subscription_alert_footer").css("margin-top", "") })
        } else $("#correction,#correction-button-bottom,#correction-button-top").remove()
    }
}

function detectIE() {
    var b = window.navigator.userAgent,
        k = b.indexOf("MSIE ");
    if (0 < k) return parseInt(b.substring(k + 5, b.indexOf(".", k)), 10);
    if (0 < b.indexOf("Trident/")) return k = b.indexOf("rv:"), parseInt(b.substring(k + 3, b.indexOf(".", k)), 10);
    k = b.indexOf("Edge/");
    return 0 < k ? parseInt(b.substring(k + 5, b.indexOf(".", k)), 10) : !1 }

function locationInputValidationOnFocusChangeListener(b, k, l) {
    var e = document.getElementById(b);
    $("#" + b).change(function() { $("." + b).val("");
        $(this).val("") });
    google.maps.event.addDomListener(e, "keydown", function(b) { 13 == b.keyCode && b.preventDefault() });
    e.onfocusout = function() {
        if ("" == $("#" + b + "_locality").val() && "" == $("#" + b + "_administrative_area_level_2").val()) {
            var e = $("#" + b + "-error");
            setError(e, "Invalid City");
            is_valid_city = !1 } else is_valid_city = !0 };
    var h = new google.maps.places.Autocomplete(e);
    h.addListener("place_changed",
        function() {
            var e = h.getPlace();
            if (!e.geometry) window.alert("Autocomplete's returned place contains no geometry");
            else if (e.address_components) {
                var q = !1;
                for (index = 0; index < e.address_components.length; ++index) "locality" == e.address_components[index].types[0] ? q = !0 : "administrative_area_level_2" == e.address_components[index].types[0] && (q = !0);
                if (q) {
                    $("." + b).val("");
                    for (index = 0; index < e.address_components.length; ++index) $("#" + b + "_" + e.address_components[index].types[0]).val(e.address_components[index].long_name),
                        $("#personal_details_resume_" + b + "_" + e.address_components[index].types[0]).val(e.address_components[index].long_name);
                    $("#" + b + "_lat").val(e.geometry.location.lat());
                    $("#" + b + "_lng").val(e.geometry.location.lng());
                    $("#personal_details_resume_" + b + "_lat").val(e.geometry.location.lat());
                    $("#personal_details_resume_" + b + "_lng").val(e.geometry.location.lng());
                    is_valid_city = !0;
                    $("#" + k).validate().element("#" + b)
                } else $("#" + b).val(""), e = $("#" + b + "-error"), setError(e, "Please select a more specific location (City).")
            }
        });
    h.setTypes([l])
}

function nl2br(b) {
    return b.replace(/(\r\n|\n\r|\r|\n)/g, "<br>") }

function br2nl(b) {
    return b.replace(/<br>/g, "\r") }

function placeElementAtBottomRelativeToFooter(b) {
    var k = $(this),
        l = "";
    k.scroll(function(e) { l = element_location(k, l, b, !0) });
    l = element_location(k, l, b, !1) }

function element_location(b, k, l, e) { k = document.documentElement.clientHeight;
    k = $("#footer").offset().top - k;
    e ? b.scrollTop() < k ? $(l).css({ position: "fixed", bottom: 0 }) : $(l).css({ position: "absolute", bottom: $("#footer").height() + 20 }) : $(l).css({ position: "fixed", bottom: 0 });
    return k }

function hasAttr(b, k) {
    var l = b.attr(k);
    return "undefined" !== typeof l && !1 !== l ? !0 : !1 };

function output(b, k) {
    if (null != b) try {
        var l = document.getElementsByName(b)[0];
        l instanceof HTMLInputElement ? l.value = k : l instanceof HTMLTextAreaElement ? l.value = k : l.innerHTML = k } catch (e) {
        return console.error("output", b, k, e), null } }

function get(b) { b = document.getElementsByName(b)[0];
    return b instanceof HTMLInputElement || b instanceof HTMLTextAreaElement ? b.value : b.innerHTML }

function chunkArray(b, k) {
    var l = b.byteOffset || 0;
    b = b.buffer || b;
    for (var e = 0, h = []; e + k <= b.byteLength;) h.push(new Uint8Array(b, l + e, k)), e += k;
    e <= b.byteLength && h.push(new Uint8Array(b, l + e));
    return h }

function newSalt() {
    return window.crypto.getRandomValues(new Uint8Array(16)) }
var base64url = {
    _strmap: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    encode: function(b) { b = new Uint8Array(b);
        var k = Math.ceil(4 * b.length / 3);
        return chunkArray(b, 3).map(function(b) {
            return [b[0] >>> 2, (b[0] & 3) << 4 | b[1] >>> 4, (b[1] & 15) << 2 | b[2] >>> 6, b[2] & 63].map(function(b) {
                return base64url._strmap[b] }).join("") }).join("").slice(0, k) },
    _lookup: function(b, k) {
        return base64url._strmap.indexOf(b.charAt(k)) },
    decode: function(b) {
        for (var k = new Uint8Array(Math.floor(3 * b.length / 4)), l = 0, e = 0; e < b.length;) {
            var h =
                base64url._lookup(b, e++),
                n = base64url._lookup(b, e++),
                q = base64url._lookup(b, e++),
                v = base64url._lookup(b, e++);
            k[l++] = h << 2 | n >>> 4;
            k[l++] = n << 4 | q >>> 2;
            k[l++] = q << 6 | v
        }
        return k
    }
};

function hmac(b) { this.keyPromise = webCrypto.importKey("raw", b, { name: "HMAC", hash: "SHA-256" }, !0, ["sign"]) }
hmac.prototype.hash = function(b) {
    return this.keyPromise.then(function(k) {
        return webCrypto.sign("HMAC", k, b) }) };

function hkdf(b, k) { this.prkhPromise = (new hmac(b)).hash(k).then(function(b) {
        return new hmac(b) }) }
hkdf.prototype.extract = function(b, k) {
    var l = concatArray([b, new Uint8Array([1])]);
    return this.prkhPromise.then(function(b) {
        return b.hash(l) }).then(function(b) {
        if (b.byteLength < k) throw Error("Length is too long");
        return b.slice(0, k) }) };

function concatArray(b) {
    var k = b.reduce(function(b, h) {
            return b + h.byteLength }, 0),
        l = 0;
    return b.reduce(function(b, h) { b.set(new Uint8Array(h), l);
        l += h.byteLength;
        return b }, new Uint8Array(k)) }

function be16(b) {
    return (b & 255) << 8 | b >> 8 & 255 }
window.base64url = base64url;
(function(b) { "function" === typeof define && define.amd ? define(["jquery"], b) : b(jQuery) })(function(b) {
    b.extend(b.fn, {
        validate: function(e) {
            if (this.length) {
                var h = b.data(this[0], "validator");
                if (h) return h;
                this.attr("novalidate", "novalidate");
                h = new b.validator(e, this[0]);
                b.data(this[0], "validator", h);
                h.settings.onsubmit && (this.validateDelegate(":submit", "click", function(e) {
                    h.settings.submitHandler && (h.submitButton = e.target);
                    b(e.target).hasClass("cancel") && (h.cancelSubmit = !0);
                    void 0 !== b(e.target).attr("formnovalidate") &&
                        (h.cancelSubmit = !0)
                }), this.submit(function(e) {
                    function n() {
                        var n, k;
                        return h.settings.submitHandler ? (h.submitButton && (n = b("<input type='hidden'/>").attr("name", h.submitButton.name).val(b(h.submitButton).val()).appendTo(h.currentForm)), k = h.settings.submitHandler.call(h, h.currentForm, e), h.submitButton && n.remove(), void 0 !== k ? k : !1) : !0 }
                    h.settings.debug && e.preventDefault();
                    if (h.cancelSubmit) return h.cancelSubmit = !1, n();
                    if (h.form()) return h.pendingRequest ? (h.formSubmitted = !0, !1) : n();
                    h.focusInvalid();
                    return !1 }));
                return h
            }
            e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.")
        },
        valid: function() {
            var e, h;
            b(this[0]).is("form") ? e = this.validate().form() : (e = !0, h = b(this[0].form).validate(), this.each(function() { e = h.element(this) && e }));
            return e },
        removeAttrs: function(e) {
            var h = {},
                n = this;
            b.each(e.split(/\s/), function(b, e) { h[e] = n.attr(e);
                n.removeAttr(e) });
            return h },
        rules: function(e, h) {
            var n = this[0],
                k, v, l, A;
            if (e) switch (k = b.data(n.form, "validator").settings, v = k.rules, l = b.validator.staticRules(n),
                e) {
                case "add":
                    b.extend(l, b.validator.normalizeRule(h));
                    delete l.messages;
                    v[n.name] = l;
                    h.messages && (k.messages[n.name] = b.extend(k.messages[n.name], h.messages));
                    break;
                case "remove":
                    if (!h) return delete v[n.name], l;
                    A = {};
                    b.each(h.split(/\s/), function(e, h) { A[h] = l[h];
                        delete l[h]; "required" === h && b(n).removeAttr("aria-required") });
                    return A }
            k = b.validator.normalizeRules(b.extend({}, b.validator.classRules(n), b.validator.attributeRules(n), b.validator.dataRules(n), b.validator.staticRules(n)), n);
            k.required && (v = k.required,
                delete k.required, k = b.extend({ required: v }, k), b(n).attr("aria-required", "true"));
            k.remote && (v = k.remote, delete k.remote, k = b.extend(k, { remote: v }));
            return k
        }
    });
    b.extend(b.expr[":"], { blank: function(e) {
            return !b.trim("" + b(e).val()) }, filled: function(e) {
            return !!b.trim("" + b(e).val()) }, unchecked: function(e) {
            return !b(e).prop("checked") } });
    b.validator = function(e, h) { this.settings = b.extend(!0, {}, b.validator.defaults, e);
        this.currentForm = h;
        this.init() };
    b.validator.format = function(e, h) {
        if (1 === arguments.length) return function() {
            var h =
                b.makeArray(arguments);
            h.unshift(e);
            return b.validator.format.apply(this, h)
        };
        2 < arguments.length && h.constructor !== Array && (h = b.makeArray(arguments).slice(1));
        h.constructor !== Array && (h = [h]);
        b.each(h, function(b, h) { e = e.replace(new RegExp("\\{" + b + "\\}", "g"), function() {
                return h }) });
        return e
    };
    b.extend(b.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "help-block form-error",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: b([]),
            errorLabelContainer: b([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(b) { this.lastActive = b;
                this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, b, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(b))) },
            onfocusout: function(b) { this.checkable(b) || !(b.name in this.submitted) && this.optional(b) || this.element(b) },
            onkeyup: function(b, h) {
                (9 !== h.which || "" !== this.elementValue(b)) && (b.name in this.submitted || b === this.lastElement) && this.element(b) },
            onclick: function(b) { b.name in this.submitted ? this.element(b) : b.parentNode.name in this.submitted && this.element(b.parentNode) },
            highlight: function(e, h, k) { "radio" === e.type ? this.findByName(e.name).addClass(h).removeClass(k) : b(e).addClass(h).removeClass(k) },
            unhighlight: function(e, h, k) { "radio" === e.type ? this.findByName(e.name).removeClass(h).addClass(k) : b(e).removeClass(h).addClass(k) }
        },
        setDefaults: function(e) { b.extend(b.validator.defaults, e) },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL. (url must start with http://)",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date ( ISO ).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: b.validator.format("Please enter no more than {0} characters."),
            minlength: b.validator.format("Please enter at least {0} characters."),
            rangelength: b.validator.format("Please enter a value between {0} and {1} characters long."),
            range: b.validator.format("Please enter a value between {0} and {1}."),
            max: b.validator.format("Please enter a value less than or equal to {0}."),
            min: b.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function e(e) {
                    var h = b.data(this[0].form, "validator"),
                        k = "on" + e.type.replace(/^validate/, ""),
                        n = h.settings;
                    n[k] && !this.is(n.ignore) && n[k].call(h,
                        this[0], e)
                }
                this.labelContainer = b(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || b(this.currentForm);
                this.containers = b(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();
                var h = this.groups = {},
                    k;
                b.each(this.settings.groups, function(e, k) { "string" === typeof k && (k = k.split(/\s/));
                    b.each(k, function(b, k) { h[k] = e }) });
                k = this.settings.rules;
                b.each(k, function(e, h) { k[e] = b.validator.normalizeRule(h) });
                b(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", "focusin focusout keyup", e).validateDelegate("select, option, [type='radio'], [type='checkbox']",
                    "click", e);
                this.settings.invalidHandler && b(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                b(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            },
            form: function() { this.checkForm();
                b.extend(this.submitted, this.errorMap);
                this.invalid = b.extend({}, this.errorMap);
                this.valid() || b(this.currentForm).triggerHandler("invalid-form", [this]);
                this.showErrors();
                return this.valid() },
            checkForm: function() {
                this.prepareForm();
                for (var b = 0, h = this.currentElements =
                        this.elements(); h[b]; b++) this.check(h[b]);
                return this.valid()
            },
            element: function(e) {
                var h = this.clean(e),
                    k = this.validationTargetFor(h),
                    q = !0;
                this.lastElement = k;
                void 0 === k ? delete this.invalid[h.name] : (this.prepareElement(k), this.currentElements = b(k), (q = !1 !== this.check(k)) ? delete this.invalid[k.name] : this.invalid[k.name] = !0);
                b(e).attr("aria-invalid", !q);
                this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers));
                this.showErrors();
                return q },
            showErrors: function(e) {
                if (e) {
                    b.extend(this.errorMap,
                        e);
                    this.errorList = [];
                    for (var h in e) this.errorList.push({ message: e[h], element: this.findByName(h)[0] });
                    this.successList = b.grep(this.successList, function(b) {
                        return !(b.name in e) })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() { b.fn.resetForm && b(this.currentForm).resetForm();
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid") },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid) },
            objectLength: function(b) {
                var e = 0,
                    k;
                for (k in b) e++;
                return e },
            hideErrors: function() { this.hideThese(this.toHide) },
            hideThese: function(b) { b.not(this.containers).text("");
                this.addWrapper(b).hide() },
            valid: function() {
                return 0 === this.size() },
            size: function() {
                return this.errorList.length },
            focusInvalid: function() {
                if (this.settings.focusInvalid) try { b(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin") } catch (e) {} },
            findLastActive: function() {
                var e = this.lastActive;
                return e && 1 === b.grep(this.errorList, function(b) {
                    return b.element.name === e.name }).length && e },
            elements: function() {
                var e = this,
                    h = {};
                return b(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function() {!this.name && e.settings.debug && window.console && console.error("%o has no name assigned", this);
                    return this.name in h || !e.objectLength(b(this).rules()) ? !1 : h[this.name] = !0 }) },
            clean: function(e) {
                return b(e)[0] },
            errors: function() {
                var e = this.settings.errorClass.split(" ").join(".");
                return b(this.settings.errorElement + "." + e, this.errorContext) },
            reset: function() { this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = b([]);
                this.toHide = b([]);
                this.currentElements = b([]) },
            prepareForm: function() { this.reset();
                this.toHide = this.errors().add(this.containers) },
            prepareElement: function(b) { this.reset();
                this.toHide = this.errorsFor(b) },
            elementValue: function(e) {
                var h = b(e),
                    k = e.type;
                if ("radio" === k || "checkbox" === k) return b("input[name='" + e.name + "']:checked").val();
                if ("number" === k && "undefined" !== typeof e.validity) return e.validity.badInput ? !1 : h.val();
                e = h.val();
                return "string" === typeof e ? e.replace(/\r/g, "") : e
            },
            check: function(e) {
                e = this.validationTargetFor(this.clean(e));
                var h = b(e).rules(),
                    k = b.map(h, function(b, e) {
                        return e }).length,
                    q = !1,
                    l = this.elementValue(e),
                    z, A, r;
                for (A in h) {
                    r = { method: A, parameters: h[A] };
                    try {
                        if (z = b.validator.methods[A].call(this, l, e, r.parameters), "dependency-mismatch" ===
                            z && 1 === k) q = !0;
                        else { q = !1;
                            if ("pending" === z) { this.toHide = this.toHide.not(this.errorsFor(e));
                                return }
                            if (!z) return this.formatAndAdd(e, r), !1 }
                    } catch (w) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + r.method + "' method.", w), w; }
                }
                if (!q) return this.objectLength(h) && this.successList.push(e), !0
            },
            customDataMessage: function(e, h) {
                return b(e).data("msg" + h.charAt(0).toUpperCase() + h.substring(1).toLowerCase()) || b(e).data("msg") },
            customMessage: function(b,
                h) {
                var e = this.settings.messages[b];
                return e && (e.constructor === String ? e : e[h]) },
            findDefined: function() {
                for (var b = 0; b < arguments.length; b++)
                    if (void 0 !== arguments[b]) return arguments[b] },
            defaultMessage: function(e, h) {
                return this.findDefined(this.customMessage(e.name, h), this.customDataMessage(e, h), !this.settings.ignoreTitle && e.title || void 0, b.validator.messages[h], "<strong>Warning: No message defined for " + e.name + "</strong>") },
            formatAndAdd: function(e, h) {
                var k = this.defaultMessage(e, h.method),
                    q = /\$?\{(\d+)\}/g;
                "function" === typeof k ? k = k.call(this, h.parameters, e) : q.test(k) && (k = b.validator.format(k.replace(q, "{$1}"), h.parameters));
                this.errorList.push({ message: k, element: e, method: h.method });
                this.errorMap[e.name] = k;
                this.submitted[e.name] = k
            },
            addWrapper: function(b) { this.settings.wrapper && (b = b.add(b.parent(this.settings.wrapper)));
                return b },
            defaultShowErrors: function() {
                var b, h;
                for (b = 0; this.errorList[b]; b++) h = this.errorList[b], this.settings.highlight && this.settings.highlight.call(this, h.element, this.settings.errorClass,
                    this.settings.validClass), this.showLabel(h.element, h.message);
                this.errorList.length && (this.toShow = this.toShow.add(this.containers));
                if (this.settings.success)
                    for (b = 0; this.successList[b]; b++) this.showLabel(this.successList[b]);
                if (this.settings.unhighlight)
                    for (b = 0, h = this.validElements(); h[b]; b++) this.settings.unhighlight.call(this, h[b], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements()) },
            invalidElements: function() {
                return b(this.errorList).map(function() {
                    return this.element }) },
            showLabel: function(e, h) {
                var k, q, l = this.errorsFor(e),
                    z = this.idOrName(e),
                    A = b(e).attr("aria-describedby");
                l.length ? (l.removeClass(this.settings.validClass).addClass(this.settings.errorClass), l.html(h)) : (k = l = b("<" + this.settings.errorElement + ">").attr("id", z + "-error").addClass(this.settings.errorClass).html(h || ""), this.settings.wrapper && (k = l.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ?
                    this.labelContainer.append(k) : this.settings.errorPlacement ? this.settings.errorPlacement(k, b(e)) : k.insertAfter(e), l.is("label") ? l.attr("for", z) : 0 === l.parents("label[for='" + z + "']").length && (k = l.attr("id").replace(/(:|\.|\[|\])/g, "\\$1"), A ? A.match(new RegExp("\\b" + k + "\\b")) || (A += " " + k) : A = k, b(e).attr("aria-describedby", A), (q = this.groups[e.name]) && b.each(this.groups, function(e, h) { h === q && b("[name='" + e + "']", this.currentForm).attr("aria-describedby", l.attr("id")) })));
                !h && this.settings.success && (l.text(""),
                    "string" === typeof this.settings.success ? l.addClass(this.settings.success) : this.settings.success(l, e));
                this.toShow = this.toShow.add(l)
            },
            errorsFor: function(e) {
                var h = this.idOrName(e);
                e = b(e).attr("aria-describedby");
                h = "label[for='" + h + "'], label[for='" + h + "'] *";
                e && (h = h + ", #" + e.replace(/\s+/g, ", #"));
                return this.errors().filter(h) },
            idOrName: function(b) {
                return this.groups[b.name] || (this.checkable(b) ? b.name : b.id || b.name) },
            validationTargetFor: function(e) { this.checkable(e) && (e = this.findByName(e.name));
                return b(e).not(this.settings.ignore)[0] },
            checkable: function(b) {
                return /radio|checkbox/i.test(b.type) },
            findByName: function(e) {
                return b(this.currentForm).find("[name='" + e + "']") },
            getLength: function(e, h) {
                switch (h.nodeName.toLowerCase()) {
                    case "select":
                        return b("option:selected", h).length;
                    case "textarea":
                        var k = e.match(/(\n\r|\r\n|\n|\r)/g),
                            l = 0;
                        null != k && (l = k.length);
                        return e.length + l;
                    case "input":
                        if (this.checkable(h)) return this.findByName(h.name).filter(":checked").length }
                return e.length },
            depend: function(b, h) {
                return this.dependTypes[typeof b] ?
                    this.dependTypes[typeof b](b, h) : !0
            },
            dependTypes: { "boolean": function(b) {
                    return b }, string: function(e, h) {
                    return !!b(e, h.form).length }, "function": function(b, h) {
                    return b(h) } },
            optional: function(e) {
                var h = this.elementValue(e);
                return !b.validator.methods.required.call(this, h, e) && "dependency-mismatch" },
            startRequest: function(b) { this.pending[b.name] || (this.pendingRequest++, this.pending[b.name] = !0) },
            stopRequest: function(e, h) {
                this.pendingRequest--;
                0 > this.pendingRequest && (this.pendingRequest = 0);
                delete this.pending[e.name];
                h && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (b(this.currentForm).submit(), this.formSubmitted = !1) : !h && 0 === this.pendingRequest && this.formSubmitted && (b(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            },
            previousValue: function(e) {
                return b.data(e, "previousValue") || b.data(e, "previousValue", { old: null, valid: !0, message: this.defaultMessage(e, "remote") }) }
        },
        classRuleSettings: {
            required: { required: !0 },
            email: { email: !0 },
            url: { url: !0 },
            date: { date: !0 },
            dateISO: { dateISO: !0 },
            number: { number: !0 },
            digits: { digits: !0 },
            creditcard: { creditcard: !0 }
        },
        addClassRules: function(e, h) { e.constructor === String ? this.classRuleSettings[e] = h : b.extend(this.classRuleSettings, e) },
        classRules: function(e) {
            var h = {};
            (e = b(e).attr("class")) && b.each(e.split(" "), function() { this in b.validator.classRuleSettings && b.extend(h, b.validator.classRuleSettings[this]) });
            return h },
        attributeRules: function(e) {
            var h = {},
                k = b(e),
                l = e.getAttribute("type"),
                v, z;
            for (v in b.validator.methods) "required" === v ? (z = e.getAttribute(v),
                "" === z && (z = !0), z = !!z) : z = k.attr(v), /min|max/.test(v) && (null === l || /number|range|text/.test(l)) && (z = Number(z)), z || 0 === z ? h[v] = z : l === v && "range" !== l && (h[v] = !0);
            h.maxlength && /-1|2147483647|524288/.test(h.maxlength) && delete h.maxlength;
            return h
        },
        dataRules: function(e) {
            var h, k = {},
                l = b(e);
            for (h in b.validator.methods) e = l.data("rule" + h.charAt(0).toUpperCase() + h.substring(1).toLowerCase()), void 0 !== e && (k[h] = e);
            return k },
        staticRules: function(e) {
            var h = {},
                k = b.data(e.form, "validator");
            k.settings.rules && (h = b.validator.normalizeRule(k.settings.rules[e.name]) || {});
            return h
        },
        normalizeRules: function(e, h) {
            b.each(e, function(k, l) {
                if (!1 === l) delete e[k];
                else if (l.param || l.depends) {
                    var n = !0;
                    switch (typeof l.depends) {
                        case "string":
                            n = !!b(l.depends, h.form).length;
                            break;
                        case "function":
                            n = l.depends.call(h, h) }
                    n ? e[k] = void 0 !== l.param ? l.param : !0 : delete e[k] } });
            b.each(e, function(k, l) { e[k] = b.isFunction(l) ? l(h) : l });
            b.each(["minlength", "maxlength"], function() { e[this] && (e[this] = Number(e[this])) });
            b.each(["rangelength", "range"], function() {
                var h;
                e[this] && (b.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" === typeof e[this] && (h = e[this].replace(/[\[\]]/g, "").split(/[\s,]+/), e[this] = [Number(h[0]), Number(h[1])]))
            });
            b.validator.autoCreateRanges && (null != e.min && null != e.max && (e.range = [e.min, e.max], delete e.min, delete e.max), null != e.minlength && null != e.maxlength && (e.rangelength = [e.minlength, e.maxlength], delete e.minlength, delete e.maxlength));
            return e
        },
        normalizeRule: function(e) {
            if ("string" === typeof e) {
                var h = {};
                b.each(e.split(/\s/), function() { h[this] = !0 });
                e = h }
            return e },
        addMethod: function(e, h, k) { b.validator.methods[e] = h;
            b.validator.messages[e] = void 0 !== k ? k : b.validator.messages[e];
            3 > h.length && b.validator.addClassRules(e, b.validator.normalizeRule(e)) },
        methods: {
            required: function(e, h, k) {
                return this.depend(k, h) ? "select" === h.nodeName.toLowerCase() ? (e = b(h).val()) && 0 < e.length : this.checkable(h) ? 0 < this.getLength(e, h) : 0 < b.trim(e).length : "dependency-mismatch" },
            email: function(b, h) {
                return this.optional(h) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(b) },
            url: function(b, h) {
                return this.optional(h) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(b) },
            date: function(b, h) {
                return this.optional(h) || !/Invalid|NaN/.test((new Date(b)).toString()) },
            dateISO: function(b, h) {
                return this.optional(h) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(b) },
            number: function(b, h) {
                return this.optional(h) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(b) },
            digits: function(b, h) {
                return this.optional(h) || /^\d+$/.test(b) },
            creditcard: function(b, h) {
                if (this.optional(h)) return "dependency-mismatch";
                if (/[^0-9 \-]+/.test(b)) return !1;
                var e = 0,
                    k, l = !1,
                    z;
                b = b.replace(/\D/g,
                    "");
                if (13 > b.length || 19 < b.length) return !1;
                for (z = b.length - 1; 0 <= z; z--) k = b.charAt(z), k = parseInt(k, 10), l && 9 < (k *= 2) && (k -= 9), e += k, l = !l;
                return 0 === e % 10
            },
            minlength: function(e, h, k) { e = b.isArray(e) ? e.length : this.getLength(e, h);
                return this.optional(h) || e >= k },
            maxlength: function(e, h, k) { e = b.isArray(e) ? e.length : this.getLength(e, h);
                return this.optional(h) || e <= k },
            rangelength: function(e, h, k) { e = b.isArray(e) ? e.length : this.getLength(e, h);
                return this.optional(h) || e >= k[0] && e <= k[1] },
            min: function(b, h, k) {
                return this.optional(h) ||
                    b >= k
            },
            max: function(b, h, k) {
                return this.optional(h) || b <= k },
            range: function(b, h, k) {
                return this.optional(h) || b >= k[0] && b <= k[1] },
            equalTo: function(e, h, k) { k = b(k);
                this.settings.onfocusout && k.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() { b(h).valid() });
                return e === k.val() },
            remote: function(e, h, k) {
                if (this.optional(h)) return "dependency-mismatch";
                var l = this.previousValue(h),
                    n, z;
                this.settings.messages[h.name] || (this.settings.messages[h.name] = {});
                l.originalMessage = this.settings.messages[h.name].remote;
                this.settings.messages[h.name].remote = l.message;
                k = "string" === typeof k && { url: k } || k;
                if (l.old === e) return l.valid;
                l.old = e;
                n = this;
                this.startRequest(h);
                z = {};
                z[h.name] = e;
                b.ajax(b.extend(!0, {
                    url: k,
                    mode: "abort",
                    port: "validate" + h.name,
                    dataType: "json",
                    data: z,
                    context: n.currentForm,
                    success: function(k) {
                        var r = !0 === k || "true" === k,
                            q;
                        n.settings.messages[h.name].remote = l.originalMessage;
                        r ? (q = n.formSubmitted, n.prepareElement(h), n.formSubmitted = q, n.successList.push(h), delete n.invalid[h.name], n.showErrors()) : (q = {}, k = k ||
                            n.defaultMessage(h, "remote"), q[h.name] = l.message = b.isFunction(k) ? k(e) : k, n.invalid[h.name] = !0, n.showErrors(q));
                        l.valid = r;
                        n.stopRequest(h, r)
                    }
                }, k));
                return "pending"
            }
        }
    });
    b.format = function() {
        throw "$.format has been deprecated. Please use $.validator.format instead."; };
    var k = {},
        l;
    b.ajaxPrefilter ? b.ajaxPrefilter(function(b, h, l) { h = b.port; "abort" === b.mode && (k[h] && k[h].abort(), k[h] = l) }) : (l = b.ajax, b.ajax = function(e) {
        var h = ("port" in e ? e : b.ajaxSettings).port;
        return "abort" === ("mode" in e ? e : b.ajaxSettings).mode ? (k[h] &&
            k[h].abort(), k[h] = l.apply(this, arguments), k[h]) : l.apply(this, arguments)
    });
    b.extend(b.fn, { validateDelegate: function(e, h, k) {
            return this.bind(h, function(h) {
                var l = b(h.target);
                if (l.is(e)) return k.apply(l, arguments) }) } })
});
(function(b) { "function" === typeof define && define.amd ? define(["jquery"], b) : b(jQuery) })(function(b) {
    function k(a, c) {
        var d, f;
        d = a.nodeName.toLowerCase();
        if ("area" === d) { d = a.parentNode;
            f = d.name;
            if (!a.href || !f || "map" !== d.nodeName.toLowerCase()) return !1;
            d = b("img[usemap='#" + f + "']")[0];
            return !!d && l(d) }
        return (/input|select|textarea|button|object/.test(d) ? !a.disabled : "a" === d ? a.href || c : c) && l(a) }

    function l(a) {
        return b.expr.filters.visible(a) && !b(a).parents().addBack().filter(function() {
            return "hidden" === b.css(this,
                "visibility")
        }).length
    }

    function e(a) {
        for (var b; a.length && a[0] !== document;) { b = a.css("position");
            if ("absolute" === b || "relative" === b || "fixed" === b)
                if (b = parseInt(a.css("zIndex"), 10), !isNaN(b) && 0 !== b) return b;
            a = a.parent() }
        return 0 }

    function h() {
        this._curInst = null;
        this._keyEvent = !1;
        this._disabledInputs = [];
        this._inDialog = this._datepickerShowing = !1;
        this._mainDivId = "ui-datepicker-div";
        this._inlineClass = "ui-datepicker-inline";
        this._appendClass = "ui-datepicker-append";
        this._triggerClass = "ui-datepicker-trigger";
        this._dialogClass = "ui-datepicker-dialog";
        this._disableClass = "ui-datepicker-disabled";
        this._unselectableClass = "ui-datepicker-unselectable";
        this._currentClass = "ui-datepicker-current-day";
        this._dayOverClass = "ui-datepicker-days-cell-over";
        this.regional = [];
        this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: "January February March April May June July August September October November December".split(" "),
            monthNamesShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            dayNames: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            dayNamesShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
            dayNamesMin: "Su Mo Tu We Th Fr Sa".split(" "),
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        };
        this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-20:c+30",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        };
        b.extend(this._defaults, this.regional[""]);
        this.regional.en = b.extend(!0, {}, this.regional[""]);
        this.regional["en-US"] = b.extend(!0, {}, this.regional.en);
        this.dpDiv = n(b("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
    }

    function n(a) {
        return a.delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a", "mouseout", function() {
            b(this).removeClass("ui-state-hover"); - 1 !== this.className.indexOf("ui-datepicker-prev") && b(this).removeClass("ui-datepicker-prev-hover"); - 1 !== this.className.indexOf("ui-datepicker-next") &&
                b(this).removeClass("ui-datepicker-next-hover")
        }).delegate("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a", "mouseover", q)
    }

    function q() {
        b.datepicker._isDisabledDatepicker(L.inline ? L.dpDiv.parent()[0] : L.input[0]) || (b(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), b(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && b(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") &&
            b(this).addClass("ui-datepicker-next-hover"))
    }

    function v(a, c) { b.extend(a, c);
        for (var d in c) null == c[d] && (a[d] = c[d]);
        return a }

    function z(a) {
        return function() {
            var b = this.element.val();
            a.apply(this, arguments);
            this._refresh();
            b !== this.element.val() && this._trigger("change") } }
    b.ui = b.ui || {};
    b.extend(b.ui, { version: "1.11.2", keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 } });
    b.fn.extend({
        scrollParent: function(a) {
            var c =
                this.css("position"),
                d = "absolute" === c,
                f = a ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
            a = this.parents().filter(function() {
                var a = b(this);
                return d && "static" === a.css("position") ? !1 : f.test(a.css("overflow") + a.css("overflow-y") + a.css("overflow-x")) }).eq(0);
            return "fixed" !== c && a.length ? a : b(this[0].ownerDocument || document)
        },
        uniqueId: function() {
            var a = 0;
            return function() {
                return this.each(function() { this.id || (this.id = "ui-id-" + ++a) }) } }(),
        removeUniqueId: function() {
            return this.each(function() {
                /^ui-id-\d+$/.test(this.id) &&
                    b(this).removeAttr("id")
            })
        }
    });
    b.extend(b.expr[":"], { data: b.expr.createPseudo ? b.expr.createPseudo(function(a) {
            return function(c) {
                return !!b.data(c, a) } }) : function(a, c, d) {
            return !!b.data(a, d[3]) }, focusable: function(a) {
            return k(a, !isNaN(b.attr(a, "tabindex"))) }, tabbable: function(a) {
            var c = b.attr(a, "tabindex"),
                d = isNaN(c);
            return (d || 0 <= c) && k(a, !d) } });
    b("<a>").outerWidth(1).jquery || b.each(["Width", "Height"], function(a, c) {
        function d(a, c, d, g) {
            b.each(f, function() {
                c -= parseFloat(b.css(a, "padding" + this)) || 0;
                d && (c -=
                    parseFloat(b.css(a, "border" + this + "Width")) || 0);
                g && (c -= parseFloat(b.css(a, "margin" + this)) || 0)
            });
            return c
        }
        var f = "Width" === c ? ["Left", "Right"] : ["Top", "Bottom"],
            g = c.toLowerCase(),
            p = { innerWidth: b.fn.innerWidth, innerHeight: b.fn.innerHeight, outerWidth: b.fn.outerWidth, outerHeight: b.fn.outerHeight };
        b.fn["inner" + c] = function(a) {
            return void 0 === a ? p["inner" + c].call(this) : this.each(function() { b(this).css(g, d(this, a) + "px") }) };
        b.fn["outer" + c] = function(a, f) {
            return "number" !== typeof a ? p["outer" + c].call(this, a) : this.each(function() {
                b(this).css(g,
                    d(this, a, !0, f) + "px")
            })
        }
    });
    b.fn.addBack || (b.fn.addBack = function(a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a)) });
    b("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (b.fn.removeData = function(a) {
        return function(c) {
            return arguments.length ? a.call(this, b.camelCase(c)) : a.call(this) } }(b.fn.removeData));
    b.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    b.fn.extend({
        focus: function(a) {
            return function(c, d) {
                return "number" === typeof c ? this.each(function() {
                    var a = this;
                    setTimeout(function() {
                        b(a).focus();
                        d && d.call(a)
                    }, c)
                }) : a.apply(this, arguments)
            }
        }(b.fn.focus),
        disableSelection: function() {
            var a = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
            return function() {
                return this.bind(a + ".ui-disableSelection", function(a) { a.preventDefault() }) } }(),
        enableSelection: function() {
            return this.unbind(".ui-disableSelection") },
        zIndex: function(a) {
            if (void 0 !== a) return this.css("zIndex", a);
            if (this.length) {
                a = b(this[0]);
                for (var c; a.length && a[0] !== document;) {
                    c = a.css("position");
                    if ("absolute" === c || "relative" ===
                        c || "fixed" === c)
                        if (c = parseInt(a.css("zIndex"), 10), !isNaN(c) && 0 !== c) return c;
                    a = a.parent()
                }
            }
            return 0
        }
    });
    b.ui.plugin = { add: function(a, c, d) {
            var f;
            a = b.ui[a].prototype;
            for (f in d) a.plugins[f] = a.plugins[f] || [], a.plugins[f].push([c, d[f]]) }, call: function(a, b, d, f) {
            if ((b = a.plugins[b]) && (f || a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType))
                for (f = 0; f < b.length; f++) a.options[b[f][0]] && b[f][1].apply(a.element, d) } };
    var A = 0,
        r = Array.prototype.slice;
    b.cleanData = function(a) {
        return function(c) {
            var d, f, g;
            for (g =
                0; null != (f = c[g]); g++) try {
                (d = b._data(f, "events")) && d.remove && b(f).triggerHandler("remove") } catch (p) {}
            a(c)
        }
    }(b.cleanData);
    b.widget = function(a, c, d) {
        var f, g, p, e, h = {},
            m = a.split(".")[0];
        a = a.split(".")[1];
        f = m + "-" + a;
        d || (d = c, c = b.Widget);
        b.expr[":"][f.toLowerCase()] = function(a) {
            return !!b.data(a, f) };
        b[m] = b[m] || {};
        g = b[m][a];
        p = b[m][a] = function(a, b) {
            if (!this._createWidget) return new p(a, b);
            arguments.length && this._createWidget(a, b) };
        b.extend(p, g, { version: d.version, _proto: b.extend({}, d), _childConstructors: [] });
        e =
            new c;
        e.options = b.widget.extend({}, e.options);
        b.each(d, function(a, d) { b.isFunction(d) ? h[a] = function() {
                var b = function() {
                        return c.prototype[a].apply(this, arguments) },
                    f = function(b) {
                        return c.prototype[a].apply(this, b) };
                return function() {
                    var a = this._super,
                        c = this._superApply,
                        g;
                    this._super = b;
                    this._superApply = f;
                    g = d.apply(this, arguments);
                    this._super = a;
                    this._superApply = c;
                    return g } }() : h[a] = d });
        p.prototype = b.widget.extend(e, { widgetEventPrefix: g ? e.widgetEventPrefix || a : a }, h, {
            constructor: p,
            namespace: m,
            widgetName: a,
            widgetFullName: f
        });
        g ? (b.each(g._childConstructors, function(a, c) {
            var d = c.prototype;
            b.widget(d.namespace + "." + d.widgetName, p, c._proto) }), delete g._childConstructors) : c._childConstructors.push(p);
        b.widget.bridge(a, p);
        return p
    };
    b.widget.extend = function(a) {
        for (var c = r.call(arguments, 1), d = 0, f = c.length, g, p; d < f; d++)
            for (g in c[d]) p = c[d][g], c[d].hasOwnProperty(g) && void 0 !== p && (b.isPlainObject(p) ? a[g] = b.isPlainObject(a[g]) ? b.widget.extend({}, a[g], p) : b.widget.extend({}, p) : a[g] = p);
        return a };
    b.widget.bridge = function(a,
        c) {
        var d = c.prototype.widgetFullName || a;
        b.fn[a] = function(f) {
            var g = "string" === typeof f,
                p = r.call(arguments, 1),
                e = this;
            f = !g && p.length ? b.widget.extend.apply(null, [f].concat(p)) : f;
            g ? this.each(function() {
                var c, g = b.data(this, d);
                if ("instance" === f) return e = g, !1;
                if (!g) return b.error("cannot call methods on " + a + " prior to initialization; attempted to call method '" + f + "'");
                if (!b.isFunction(g[f]) || "_" === f.charAt(0)) return b.error("no such method '" + f + "' for " + a + " widget instance");
                c = g[f].apply(g, p);
                if (c !== g && void 0 !==
                    c) return e = c && c.jquery ? e.pushStack(c.get()) : c, !1
            }) : this.each(function() {
                var a = b.data(this, d);
                a ? (a.option(f || {}), a._init && a._init()) : b.data(this, d, new c(f, this)) });
            return e
        }
    };
    b.Widget = function() {};
    b.Widget._childConstructors = [];
    b.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: { disabled: !1, create: null },
        _createWidget: function(a, c) {
            c = b(c || this.defaultElement || this)[0];
            this.element = b(c);
            this.uuid = A++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.bindings =
                b();
            this.hoverable = b();
            this.focusable = b();
            c !== this && (b.data(c, this.widgetFullName, this), this._on(!0, this.element, { remove: function(a) { a.target === c && this.destroy() } }), this.document = b(c.style ? c.ownerDocument : c.document || c), this.window = b(this.document[0].defaultView || this.document[0].parentWindow));
            this.options = b.widget.extend({}, this.options, this._getCreateOptions(), a);
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: b.noop,
        _getCreateEventData: b.noop,
        _create: b.noop,
        _init: b.noop,
        destroy: function() { this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(b.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus") },
        _destroy: b.noop,
        widget: function() {
            return this.element },
        option: function(a, c) {
            var d = a,
                f, g, p;
            if (0 === arguments.length) return b.widget.extend({}, this.options);
            if ("string" === typeof a)
                if (d = {}, f = a.split("."), a = f.shift(), f.length) { g = d[a] = b.widget.extend({}, this.options[a]);
                    for (p = 0; p < f.length - 1; p++) g[f[p]] = g[f[p]] || {}, g = g[f[p]];
                    a = f.pop();
                    if (1 === arguments.length) return void 0 === g[a] ? null : g[a];
                    g[a] = c } else {
                    if (1 === arguments.length) return void 0 === this.options[a] ? null : this.options[a];
                    d[a] = c }
            this._setOptions(d);
            return this },
        _setOptions: function(a) {
            for (var b in a) this._setOption(b,
                a[b]);
            return this
        },
        _setOption: function(a, b) { this.options[a] = b; "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!b), b && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")));
            return this },
        enable: function() {
            return this._setOptions({ disabled: !1 }) },
        disable: function() {
            return this._setOptions({ disabled: !0 }) },
        _on: function(a, c, d) {
            var f, g = this;
            "boolean" !== typeof a && (d = c, c = a, a = !1);
            d ? (c = f = b(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element,
                f = this.widget());
            b.each(d, function(d, e) {
                function p() {
                    if (a || !0 !== g.options.disabled && !b(this).hasClass("ui-state-disabled")) return ("string" === typeof e ? g[e] : e).apply(g, arguments) } "string" !== typeof e && (p.guid = e.guid = e.guid || p.guid || b.guid++);
                var B = d.match(/^([\w:-]*)\s*(.*)$/),
                    h = B[1] + g.eventNamespace;
                (B = B[2]) ? f.delegate(B, h, p): c.bind(h, p) })
        },
        _off: function(a, c) {
            c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            a.unbind(c).undelegate(c);
            this.bindings = b(this.bindings.not(a).get());
            this.focusable = b(this.focusable.not(a).get());
            this.hoverable = b(this.hoverable.not(a).get())
        },
        _delay: function(a, b) {
            var c = this;
            return setTimeout(function() {
                return ("string" === typeof a ? c[a] : a).apply(c, arguments) }, b || 0) },
        _hoverable: function(a) { this.hoverable = this.hoverable.add(a);
            this._on(a, { mouseenter: function(a) { b(a.currentTarget).addClass("ui-state-hover") }, mouseleave: function(a) { b(a.currentTarget).removeClass("ui-state-hover") } }) },
        _focusable: function(a) {
            this.focusable = this.focusable.add(a);
            this._on(a, { focusin: function(a) { b(a.currentTarget).addClass("ui-state-focus") }, focusout: function(a) { b(a.currentTarget).removeClass("ui-state-focus") } })
        },
        _trigger: function(a, c, d) {
            var f, g = this.options[a];
            d = d || {};
            c = b.Event(c);
            c.type = (a === this.widgetEventPrefix ? a : this.widgetEventPrefix + a).toLowerCase();
            c.target = this.element[0];
            if (a = c.originalEvent)
                for (f in a) f in c || (c[f] = a[f]);
            this.element.trigger(c, d);
            return !(b.isFunction(g) && !1 === g.apply(this.element[0], [c].concat(d)) || c.isDefaultPrevented()) }
    };
    b.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(a, c) { b.Widget.prototype["_" + a] = function(d, f, g) { "string" === typeof f && (f = { effect: f });
            var p, e = f ? !0 === f || "number" === typeof f ? c : f.effect || c : a;
            f = f || {}; "number" === typeof f && (f = { duration: f });
            p = !b.isEmptyObject(f);
            f.complete = g;
            f.delay && d.delay(f.delay);
            if (p && b.effects && b.effects.effect[e]) d[a](f);
            else if (e !== a && d[e]) d[e](f.duration, f.easing, g);
            else d.queue(function(c) { b(this)[a]();
                g && g.call(d[0]);
                c() }) } });
    var w = !1;
    b(document).mouseup(function() { w = !1 });
    b.widget("ui.mouse", {
        version: "1.11.2",
        options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 },
        _mouseInit: function() {
            var a = this;
            this.element.bind("mousedown." + this.widgetName, function(b) {
                return a._mouseDown(b) }).bind("click." + this.widgetName, function(c) {
                if (!0 === b.data(c.target, a.widgetName + ".preventClickEvent")) return b.removeData(c.target, a.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1 });
            this.started = !1 },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName);
            this._mouseMoveDelegate && this.document.unbind("mousemove." +
                this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(a) {
            if (!w) {
                this._mouseMoved = !1;
                this._mouseStarted && this._mouseUp(a);
                this._mouseDownEvent = a;
                var c = this,
                    d = 1 === a.which,
                    f = "string" === typeof this.options.cancel && a.target.nodeName ? b(a.target).closest(this.options.cancel).length : !1;
                if (!d || f || !this._mouseCapture(a)) return !0;
                this.mouseDelayMet = !this.options.delay;
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    c.mouseDelayMet = !0
                }, this.options.delay));
                if (this._mouseDistanceMet(a) && this._mouseDelayMet(a) && (this._mouseStarted = !1 !== this._mouseStart(a), !this._mouseStarted)) return a.preventDefault(), !0;
                !0 === b.data(a.target, this.widgetName + ".preventClickEvent") && b.removeData(a.target, this.widgetName + ".preventClickEvent");
                this._mouseMoveDelegate = function(a) {
                    return c._mouseMove(a) };
                this._mouseUpDelegate = function(a) {
                    return c._mouseUp(a) };
                this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName,
                    this._mouseUpDelegate);
                a.preventDefault();
                return w = !0
            }
        },
        _mouseMove: function(a) {
            if (this._mouseMoved && (b.ui.ie && (!document.documentMode || 9 > document.documentMode) && !a.button || !a.which)) return this._mouseUp(a);
            if (a.which || a.button) this._mouseMoved = !0;
            if (this._mouseStarted) return this._mouseDrag(a), a.preventDefault();
            this._mouseDistanceMet(a) && this._mouseDelayMet(a) && ((this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, a)) ? this._mouseDrag(a) : this._mouseUp(a));
            return !this._mouseStarted },
        _mouseUp: function(a) {
            this.document.unbind("mousemove." +
                this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            this._mouseStarted && (this._mouseStarted = !1, a.target === this._mouseDownEvent.target && b.data(a.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(a));
            return w = !1
        },
        _mouseDistanceMet: function(a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance },
        _mouseDelayMet: function() {
            return this.mouseDelayMet },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0 }
    });
    (function() {
        function a(a, b, c) {
            return [parseFloat(a[0]) * (u.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (u.test(a[1]) ? c / 100 : 1)] }

        function c(a) {
            var c = a[0];
            return 9 === c.nodeType ? { width: a.width(), height: a.height(), offset: { top: 0, left: 0 } } : b.isWindow(c) ? { width: a.width(), height: a.height(), offset: { top: a.scrollTop(), left: a.scrollLeft() } } : c.preventDefault ? { width: 0, height: 0, offset: { top: c.pageY, left: c.pageX } } : {
                width: a.outerWidth(),
                height: a.outerHeight(),
                offset: a.offset()
            }
        }
        b.ui = b.ui || {};
        var d, f, g = Math.max,
            p = Math.abs,
            e = Math.round,
            h = /left|center|right/,
            m = /top|center|bottom/,
            k = /[\+\-]\d+(\.[\d]+)?%?/,
            l = /^\w+/,
            u = /%$/,
            x = b.fn.position;
        b.position = {
            scrollbarWidth: function() {
                if (void 0 !== d) return d;
                var a, c, f = b("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>");
                c = f.children()[0];
                b("body").append(f);
                a = c.offsetWidth;
                f.css("overflow", "scroll");
                c = c.offsetWidth;
                a === c && (c = f[0].clientWidth);
                f.remove();
                return d = a - c
            },
            getScrollInfo: function(a) {
                var c = a.isWindow || a.isDocument ? "" : a.element.css("overflow-x"),
                    d = a.isWindow || a.isDocument ? "" : a.element.css("overflow-y"),
                    c = "scroll" === c || "auto" === c && a.width < a.element[0].scrollWidth;
                return { width: "scroll" === d || "auto" === d && a.height < a.element[0].scrollHeight ? b.position.scrollbarWidth() : 0, height: c ? b.position.scrollbarWidth() : 0 } },
            getWithinInfo: function(a) {
                a = b(a || window);
                var c = b.isWindow(a[0]),
                    d = !!a[0] && 9 === a[0].nodeType;
                return {
                    element: a,
                    isWindow: c,
                    isDocument: d,
                    offset: a.offset() || { left: 0, top: 0 },
                    scrollLeft: a.scrollLeft(),
                    scrollTop: a.scrollTop(),
                    width: c || d ? a.width() : a.outerWidth(),
                    height: c || d ? a.height() : a.outerHeight()
                }
            }
        };
        b.fn.position = function(d) {
            if (!d || !d.of) return x.apply(this, arguments);
            d = b.extend({}, d);
            var B, H, D, Q, G, R, u = b(d.of),
                n = b.position.getWithinInfo(d.within),
                r = b.position.getScrollInfo(n),
                q = (d.collision || "flip").split(" "),
                w = {};
            R = c(u);
            u[0].preventDefault && (d.at = "left top");
            H = R.width;
            D = R.height;
            Q = R.offset;
            G = b.extend({}, Q);
            b.each(["my", "at"], function() {
                var a =
                    (d[this] || "").split(" "),
                    b, c;
                1 === a.length && (a = h.test(a[0]) ? a.concat(["center"]) : m.test(a[0]) ? ["center"].concat(a) : ["center", "center"]);
                a[0] = h.test(a[0]) ? a[0] : "center";
                a[1] = m.test(a[1]) ? a[1] : "center";
                b = k.exec(a[0]);
                c = k.exec(a[1]);
                w[this] = [b ? b[0] : 0, c ? c[0] : 0];
                d[this] = [l.exec(a[0])[0], l.exec(a[1])[0]]
            });
            1 === q.length && (q[1] = q[0]);
            "right" === d.at[0] ? G.left += H : "center" === d.at[0] && (G.left += H / 2);
            "bottom" === d.at[1] ? G.top += D : "center" === d.at[1] && (G.top += D / 2);
            B = a(w.at, H, D);
            G.left += B[0];
            G.top += B[1];
            return this.each(function() {
                var c,
                    h, m = b(this),
                    k = m.outerWidth(),
                    t = m.outerHeight(),
                    y = parseInt(b.css(this, "marginLeft"), 10) || 0,
                    l = parseInt(b.css(this, "marginTop"), 10) || 0,
                    R = k + y + (parseInt(b.css(this, "marginRight"), 10) || 0) + r.width,
                    W = t + l + (parseInt(b.css(this, "marginBottom"), 10) || 0) + r.height,
                    x = b.extend({}, G),
                    T = a(w.my, m.outerWidth(), m.outerHeight());
                "right" === d.my[0] ? x.left -= k : "center" === d.my[0] && (x.left -= k / 2);
                "bottom" === d.my[1] ? x.top -= t : "center" === d.my[1] && (x.top -= t / 2);
                x.left += T[0];
                x.top += T[1];
                f || (x.left = e(x.left), x.top = e(x.top));
                c = {
                    marginLeft: y,
                    marginTop: l
                };
                b.each(["left", "top"], function(a, f) {
                    if (b.ui.position[q[a]]) b.ui.position[q[a]][f](x, { targetWidth: H, targetHeight: D, elemWidth: k, elemHeight: t, collisionPosition: c, collisionWidth: R, collisionHeight: W, offset: [B[0] + T[0], B[1] + T[1]], my: d.my, at: d.at, within: n, elem: m }) });
                d.using && (h = function(a) {
                    var b = Q.left - x.left,
                        c = b + H - k,
                        f = Q.top - x.top,
                        e = f + D - t,
                        B = {
                            target: { element: u, left: Q.left, top: Q.top, width: H, height: D },
                            element: { element: m, left: x.left, top: x.top, width: k, height: t },
                            horizontal: 0 > c ? "left" : 0 < b ? "right" : "center",
                            vertical: 0 > e ? "top" : 0 < f ? "bottom" : "middle"
                        };
                    H < k && p(b + c) < H && (B.horizontal = "center");
                    D < t && p(f + e) < D && (B.vertical = "middle");
                    g(p(b), p(c)) > g(p(f), p(e)) ? B.important = "horizontal" : B.important = "vertical";
                    d.using.call(this, a, B)
                });
                m.offset(b.extend(x, { using: h }))
            })
        };
        b.ui.position = {
            fit: {
                left: function(a, b) {
                    var c = b.within,
                        d = c.isWindow ? c.scrollLeft : c.offset.left,
                        f = c.width,
                        p = a.left - b.collisionPosition.marginLeft,
                        c = d - p,
                        e = p + b.collisionWidth - f - d;
                    b.collisionWidth > f ? 0 < c && 0 >= e ? (d = a.left + c + b.collisionWidth - f - d, a.left += c - d) :
                        a.left = 0 < e && 0 >= c ? d : c > e ? d + f - b.collisionWidth : d : a.left = 0 < c ? a.left + c : 0 < e ? a.left - e : g(a.left - p, a.left)
                },
                top: function(a, b) {
                    var c = b.within,
                        d = c.isWindow ? c.scrollTop : c.offset.top,
                        f = b.within.height,
                        p = a.top - b.collisionPosition.marginTop,
                        c = d - p,
                        e = p + b.collisionHeight - f - d;
                    b.collisionHeight > f ? 0 < c && 0 >= e ? (d = a.top + c + b.collisionHeight - f - d, a.top += c - d) : a.top = 0 < e && 0 >= c ? d : c > e ? d + f - b.collisionHeight : d : a.top = 0 < c ? a.top + c : 0 < e ? a.top - e : g(a.top - p, a.top) }
            },
            flip: {
                left: function(a, b) {
                    var c = b.within,
                        d = c.offset.left + c.scrollLeft,
                        f = c.width,
                        g = c.isWindow ? c.scrollLeft : c.offset.left,
                        e = a.left - b.collisionPosition.marginLeft,
                        c = e - g,
                        B = e + b.collisionWidth - f - g,
                        e = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0,
                        h = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0,
                        m = -2 * b.offset[0];
                    if (0 > c) {
                        if (d = a.left + e + h + m + b.collisionWidth - f - d, 0 > d || d < p(c)) a.left += e + h + m } else 0 < B && (d = a.left - b.collisionPosition.marginLeft + e + h + m - g, 0 < d || p(d) < B) && (a.left += e + h + m)
                },
                top: function(a, b) {
                    var c = b.within,
                        d = c.offset.top + c.scrollTop,
                        f = c.height,
                        g = c.isWindow ?
                        c.scrollTop : c.offset.top,
                        e = a.top - b.collisionPosition.marginTop,
                        c = e - g,
                        B = e + b.collisionHeight - f - g,
                        e = "top" === b.my[1] ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0,
                        h = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0,
                        m = -2 * b.offset[1];
                    0 > c ? (d = a.top + e + h + m + b.collisionHeight - f - d, a.top + e + h + m > c && (0 > d || d < p(c)) && (a.top += e + h + m)) : 0 < B && (d = a.top - b.collisionPosition.marginTop + e + h + m - g, a.top + e + h + m > B && (0 < d || p(d) < B) && (a.top += e + h + m))
                }
            },
            flipfit: {
                left: function() {
                    b.ui.position.flip.left.apply(this, arguments);
                    b.ui.position.fit.left.apply(this, arguments)
                },
                top: function() { b.ui.position.flip.top.apply(this, arguments);
                    b.ui.position.fit.top.apply(this, arguments) }
            }
        };
        (function() {
            var a, c, d, g, p = document.getElementsByTagName("body")[0];
            d = document.createElement("div");
            a = document.createElement(p ? "div" : "body");
            c = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" };
            p && b.extend(c, { position: "absolute", left: "-1000px", top: "-1000px" });
            for (g in c) a.style[g] = c[g];
            a.appendChild(d);
            c = p || document.documentElement;
            c.insertBefore(a, c.firstChild);
            d.style.cssText = "position: absolute; left: 10.7432222px;";
            d = b(d).offset().left;
            f = 10 < d && 11 > d;
            a.innerHTML = "";
            c.removeChild(a)
        })()
    })();
    b.widget("ui.accordion", {
        version: "1.11.2",
        options: { active: 0, animate: {}, collapsible: !1, event: "click", header: "> li > :first-child,> :not(li):even", heightStyle: "auto", icons: { activeHeader: "ui-icon-triangle-1-s", header: "ui-icon-triangle-1-e" }, activate: null, beforeActivate: null },
        hideProps: {
            borderTopWidth: "hide",
            borderBottomWidth: "hide",
            paddingTop: "hide",
            paddingBottom: "hide",
            height: "hide"
        },
        showProps: { borderTopWidth: "show", borderBottomWidth: "show", paddingTop: "show", paddingBottom: "show", height: "show" },
        _create: function() {
            var a = this.options;
            this.prevShow = this.prevHide = b();
            this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role", "tablist");
            a.collapsible || !1 !== a.active && null != a.active || (a.active = 0);
            this._processPanels();
            0 > a.active && (a.active += this.headers.length);
            this._refresh() },
        _getCreateEventData: function() {
            return {
                header: this.active,
                panel: this.active.length ? this.active.next() : b()
            }
        },
        _createIcons: function() {
            var a = this.options.icons;
            a && (b("<span>").addClass("ui-accordion-header-icon ui-icon " + a.header).prependTo(this.headers), this.active.children(".ui-accordion-header-icon").removeClass(a.header).addClass(a.activeHeader), this.headers.addClass("ui-accordion-icons")) },
        _destroyIcons: function() { this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove() },
        _destroy: function() {
            var a;
            this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
            this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").removeUniqueId();
            this._destroyIcons();
            a = this.headers.next().removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").css("display", "").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeUniqueId();
            "content" !== this.options.heightStyle && a.css("height", "")
        },
        _setOption: function(a, b) {
            "active" === a ? this._activate(b) : ("event" === a && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(b)), this._super(a, b), "collapsible" !== a || b || !1 !== this.options.active || this._activate(0), "icons" === a && (this._destroyIcons(), b && this._createIcons()), "disabled" === a && (this.element.toggleClass("ui-state-disabled", !!b).attr("aria-disabled", b), this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!b)))
        },
        _keydown: function(a) {
            if (!a.altKey && !a.ctrlKey) {
                var c = b.ui.keyCode,
                    d = this.headers.length,
                    f = this.headers.index(a.target),
                    g = !1;
                switch (a.keyCode) {
                    case c.RIGHT:
                    case c.DOWN:
                        g = this.headers[(f + 1) % d];
                        break;
                    case c.LEFT:
                    case c.UP:
                        g = this.headers[(f - 1 + d) % d];
                        break;
                    case c.SPACE:
                    case c.ENTER:
                        this._eventHandler(a);
                        break;
                    case c.HOME:
                        g = this.headers[0];
                        break;
                    case c.END:
                        g = this.headers[d - 1] }
                g && (b(a.target).attr("tabIndex", -1), b(g).attr("tabIndex", 0), g.focus(), a.preventDefault()) } },
        _panelKeyDown: function(a) {
            a.keyCode ===
                b.ui.keyCode.UP && a.ctrlKey && b(a.currentTarget).prev().focus()
        },
        refresh: function() {
            var a = this.options;
            this._processPanels();
            !1 === a.active && !0 === a.collapsible || !this.headers.length ? (a.active = !1, this.active = b()) : !1 === a.active ? this._activate(0) : this.active.length && !b.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (a.active = !1, this.active = b()) : this._activate(Math.max(0, a.active - 1)) : a.active = this.headers.index(this.active);
            this._destroyIcons();
            this._refresh()
        },
        _processPanels: function() {
            var a = this.headers,
                b = this.panels;
            this.headers = this.element.find(this.options.header).addClass("ui-accordion-header ui-state-default ui-corner-all");
            this.panels = this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide();
            b && (this._off(a.not(this.headers)), this._off(b.not(this.panels))) },
        _refresh: function() {
            var a, c = this.options,
                d = c.heightStyle,
                f = this.element.parent();
            this.active = this._findActive(c.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all");
            this.active.next().addClass("ui-accordion-content-active").show();
            this.headers.attr("role", "tab").each(function() {
                var a = b(this),
                    c = a.uniqueId().attr("id"),
                    d = a.next(),
                    f = d.uniqueId().attr("id");
                a.attr("aria-controls", f);
                d.attr("aria-labelledby", c) }).next().attr("role", "tabpanel");
            this.headers.not(this.active).attr({ "aria-selected": "false", "aria-expanded": "false", tabIndex: -1 }).next().attr({ "aria-hidden": "true" }).hide();
            this.active.length ? this.active.attr({ "aria-selected": "true", "aria-expanded": "true", tabIndex: 0 }).next().attr({ "aria-hidden": "false" }) : this.headers.eq(0).attr("tabIndex", 0);
            this._createIcons();
            this._setupEvents(c.event);
            "fill" === d ? (a = f.height(), this.element.siblings(":visible").each(function() {
                var c = b(this),
                    d = c.css("position"); "absolute" !== d && "fixed" !== d && (a -= c.outerHeight(!0)) }), this.headers.each(function() { a -= b(this).outerHeight(!0) }), this.headers.next().each(function() {
                b(this).height(Math.max(0,
                    a - b(this).innerHeight() + b(this).height()))
            }).css("overflow", "auto")) : "auto" === d && (a = 0, this.headers.next().each(function() { a = Math.max(a, b(this).css("height", "").height()) }).height(a))
        },
        _activate: function(a) { a = this._findActive(a)[0];
            a !== this.active[0] && (a = a || this.active[0], this._eventHandler({ target: a, currentTarget: a, preventDefault: b.noop })) },
        _findActive: function(a) {
            return "number" === typeof a ? this.headers.eq(a) : b() },
        _setupEvents: function(a) {
            var c = { keydown: "_keydown" };
            a && b.each(a.split(" "), function(a,
                b) { c[b] = "_eventHandler" });
            this._off(this.headers.add(this.headers.next()));
            this._on(this.headers, c);
            this._on(this.headers.next(), { keydown: "_panelKeyDown" });
            this._hoverable(this.headers);
            this._focusable(this.headers)
        },
        _eventHandler: function(a) {
            var c = this.options,
                d = this.active,
                f = b(a.currentTarget),
                g = f[0] === d[0],
                p = g && c.collapsible,
                e = p ? b() : f.next(),
                h = d.next(),
                e = { oldHeader: d, oldPanel: h, newHeader: p ? b() : f, newPanel: e };
            a.preventDefault();
            g && !c.collapsible || !1 === this._trigger("beforeActivate", a, e) || (c.active =
                p ? !1 : this.headers.index(f), this.active = g ? b() : f, this._toggle(e), d.removeClass("ui-accordion-header-active ui-state-active"), c.icons && d.children(".ui-accordion-header-icon").removeClass(c.icons.activeHeader).addClass(c.icons.header), g || (f.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"), c.icons && f.children(".ui-accordion-header-icon").removeClass(c.icons.header).addClass(c.icons.activeHeader), f.next().addClass("ui-accordion-content-active")))
        },
        _toggle: function(a) {
            var c =
                a.newPanel,
                d = this.prevShow.length ? this.prevShow : a.oldPanel;
            this.prevShow.add(this.prevHide).stop(!0, !0);
            this.prevShow = c;
            this.prevHide = d;
            this.options.animate ? this._animate(c, d, a) : (d.hide(), c.show(), this._toggleComplete(a));
            d.attr({ "aria-hidden": "true" });
            d.prev().attr("aria-selected", "false");
            c.length && d.length ? d.prev().attr({ tabIndex: -1, "aria-expanded": "false" }) : c.length && this.headers.filter(function() {
                return 0 === b(this).attr("tabIndex") }).attr("tabIndex", -1);
            c.attr("aria-hidden", "false").prev().attr({
                "aria-selected": "true",
                tabIndex: 0,
                "aria-expanded": "true"
            })
        },
        _animate: function(a, b, d) {
            var c, g, p, e = this,
                h = 0,
                m = a.length && (!b.length || a.index() < b.index()),
                k = this.options.animate || {},
                m = m && k.down || k,
                l = function() { e._toggleComplete(d) };
            "number" === typeof m && (p = m);
            "string" === typeof m && (g = m);
            g = g || m.easing || k.easing;
            p = p || m.duration || k.duration;
            if (!b.length) return a.animate(this.showProps, p, g, l);
            if (!a.length) return b.animate(this.hideProps, p, g, l);
            c = a.show().outerHeight();
            b.animate(this.hideProps, {
                duration: p,
                easing: g,
                step: function(a,
                    b) { b.now = Math.round(a) }
            });
            a.hide().animate(this.showProps, { duration: p, easing: g, complete: l, step: function(a, d) { d.now = Math.round(a); "height" !== d.prop ? h += d.now : "content" !== e.options.heightStyle && (d.now = Math.round(c - b.outerHeight() - h), h = 0) } })
        },
        _toggleComplete: function(a) {
            var b = a.oldPanel;
            b.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all");
            b.length && (b.parent()[0].className = b.parent()[0].className);
            this._trigger("activate", null, a) }
    });
    b.widget("ui.menu", {
        version: "1.11.2",
        defaultElement: "<ul>",
        delay: 300,
        options: { icons: { submenu: "ui-icon-carat-1-e" }, items: "> *", menus: "ul", position: { my: "left-1 top", at: "right top" }, role: "menu", blur: null, focus: null, select: null },
        _create: function() {
            this.activeMenu = this.element;
            this.mouseHandled = !1;
            this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({ role: this.options.role, tabIndex: 0 });
            this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled",
                "true");
            this._on({
                "mousedown .ui-menu-item": function(a) { a.preventDefault() },
                "click .ui-menu-item": function(a) {
                    var c = b(a.target);!this.mouseHandled && c.not(".ui-state-disabled").length && (this.select(a), a.isPropagationStopped() || (this.mouseHandled = !0), c.has(".ui-menu").length ? this.expand(a) : !this.element.is(":focus") && b(this.document[0].activeElement).closest(".ui-menu").length && (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer))) },
                "mouseenter .ui-menu-item": function(a) {
                    if (!this.previousFilter) {
                        var c =
                            b(a.currentTarget);
                        c.siblings(".ui-state-active").removeClass("ui-state-active");
                        this.focus(a, c)
                    }
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function(a, b) {
                    var c = this.active || this.element.find(this.options.items).eq(0);
                    b || this.focus(a, c) },
                blur: function(a) { this._delay(function() { b.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(a) }) },
                keydown: "_keydown"
            });
            this.refresh();
            this._on(this.document, {
                click: function(a) {
                    this._closeOnDocumentClick(a) && this.collapseAll(a);
                    this.mouseHandled = !1
                }
            })
        },
        _destroy: function() {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-menu-icons ui-front").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
            this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").removeUniqueId().removeClass("ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
                var a =
                    b(this);
                a.data("ui-menu-submenu-carat") && a.remove()
            });
            this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
        },
        _keydown: function(a) {
            var c, d, f, g = !0;
            switch (a.keyCode) {
                case b.ui.keyCode.PAGE_UP:
                    this.previousPage(a);
                    break;
                case b.ui.keyCode.PAGE_DOWN:
                    this.nextPage(a);
                    break;
                case b.ui.keyCode.HOME:
                    this._move("first", "first", a);
                    break;
                case b.ui.keyCode.END:
                    this._move("last", "last", a);
                    break;
                case b.ui.keyCode.UP:
                    this.previous(a);
                    break;
                case b.ui.keyCode.DOWN:
                    this.next(a);
                    break;
                case b.ui.keyCode.LEFT:
                    this.collapse(a);
                    break;
                case b.ui.keyCode.RIGHT:
                    this.active && !this.active.is(".ui-state-disabled") && this.expand(a);
                    break;
                case b.ui.keyCode.ENTER:
                case b.ui.keyCode.SPACE:
                    this._activate(a);
                    break;
                case b.ui.keyCode.ESCAPE:
                    this.collapse(a);
                    break;
                default:
                    g = !1, c = this.previousFilter || "", d = String.fromCharCode(a.keyCode), f = !1, clearTimeout(this.filterTimer), d === c ? f = !0 : d = c + d, c = this._filterMenuItems(d), c = f && -1 !== c.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : c, c.length ||
                        (d = String.fromCharCode(a.keyCode), c = this._filterMenuItems(d)), c.length ? (this.focus(a, c), this.previousFilter = d, this.filterTimer = this._delay(function() { delete this.previousFilter }, 1E3)) : delete this.previousFilter
            }
            g && a.preventDefault()
        },
        _activate: function(a) { this.active.is(".ui-state-disabled") || (this.active.is("[aria-haspopup='true']") ? this.expand(a) : this.select(a)) },
        refresh: function() {
            var a, c = this,
                d = this.options.icons.submenu;
            a = this.element.find(this.options.menus);
            this.element.toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length);
            a.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-front").hide().attr({ role: this.options.role, "aria-hidden": "true", "aria-expanded": "false" }).each(function() {
                var a = b(this),
                    c = a.parent(),
                    p = b("<span>").addClass("ui-menu-icon ui-icon " + d).data("ui-menu-submenu-carat", !0);
                c.attr("aria-haspopup", "true").prepend(p);
                a.attr("aria-labelledby", c.attr("id")) });
            a = a.add(this.element).find(this.options.items);
            a.not(".ui-menu-item").each(function() {
                var a =
                    b(this);
                c._isDivider(a) && a.addClass("ui-widget-content ui-menu-divider")
            });
            a.not(".ui-menu-item, .ui-menu-divider").addClass("ui-menu-item").uniqueId().attr({ tabIndex: -1, role: this._itemRole() });
            a.filter(".ui-state-disabled").attr("aria-disabled", "true");
            this.active && !b.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function() {
            return { menu: "menuitem", listbox: "option" }[this.options.role] },
        _setOption: function(a, b) {
            "icons" === a && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(b.submenu);
            "disabled" === a && this.element.toggleClass("ui-state-disabled", !!b).attr("aria-disabled", b);
            this._super(a, b)
        },
        focus: function(a, b) {
            var c;
            this.blur(a, a && "focus" === a.type);
            this._scrollIntoView(b);
            this.active = b.first();
            c = this.active.addClass("ui-state-focus").removeClass("ui-state-active");
            this.options.role && this.element.attr("aria-activedescendant", c.attr("id"));
            this.active.parent().closest(".ui-menu-item").addClass("ui-state-active");
            a && "keydown" === a.type ? this._close() : this.timer = this._delay(function() { this._close() },
                this.delay);
            c = b.children(".ui-menu");
            c.length && a && /^mouse/.test(a.type) && this._startOpening(c);
            this.activeMenu = b.parent();
            this._trigger("focus", a, { item: b })
        },
        _scrollIntoView: function(a) {
            var c, d, f;
            this._hasScroll() && (c = parseFloat(b.css(this.activeMenu[0], "borderTopWidth")) || 0, d = parseFloat(b.css(this.activeMenu[0], "paddingTop")) || 0, c = a.offset().top - this.activeMenu.offset().top - c - d, d = this.activeMenu.scrollTop(), f = this.activeMenu.height(), a = a.outerHeight(), 0 > c ? this.activeMenu.scrollTop(d + c) : c + a > f && this.activeMenu.scrollTop(d +
                c - f + a))
        },
        blur: function(a, b) { b || clearTimeout(this.timer);
            this.active && (this.active.removeClass("ui-state-focus"), this.active = null, this._trigger("blur", a, { item: this.active })) },
        _startOpening: function(a) { clearTimeout(this.timer); "true" === a.attr("aria-hidden") && (this.timer = this._delay(function() { this._close();
                this._open(a) }, this.delay)) },
        _open: function(a) {
            var c = b.extend({ of: this.active }, this.options.position);
            clearTimeout(this.timer);
            this.element.find(".ui-menu").not(a.parents(".ui-menu")).hide().attr("aria-hidden",
                "true");
            a.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(c)
        },
        collapseAll: function(a, c) { clearTimeout(this.timer);
            this.timer = this._delay(function() {
                var d = c ? this.element : b(a && a.target).closest(this.element.find(".ui-menu"));
                d.length || (d = this.element);
                this._close(d);
                this.blur(a);
                this.activeMenu = d }, this.delay) },
        _close: function(a) { a || (a = this.active ? this.active.parent() : this.element);
            a.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find(".ui-state-active").not(".ui-state-focus").removeClass("ui-state-active") },
        _closeOnDocumentClick: function(a) {
            return !b(a.target).closest(".ui-menu").length },
        _isDivider: function(a) {
            return !/[^\-\u2014\u2013\s]/.test(a.text()) },
        collapse: function(a) {
            var b = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            b && b.length && (this._close(), this.focus(a, b)) },
        expand: function(a) {
            var b = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
            b && b.length && (this._open(b.parent()), this._delay(function() { this.focus(a, b) })) },
        next: function(a) {
            this._move("next",
                "first", a)
        },
        previous: function(a) { this._move("prev", "last", a) },
        isFirstItem: function() {
            return this.active && !this.active.prevAll(".ui-menu-item").length },
        isLastItem: function() {
            return this.active && !this.active.nextAll(".ui-menu-item").length },
        _move: function(a, b, d) {
            var c;
            this.active && (c = "first" === a || "last" === a ? this.active["first" === a ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[a + "All"](".ui-menu-item").eq(0));
            c && c.length && this.active || (c = this.activeMenu.find(this.options.items)[b]());
            this.focus(d,
                c)
        },
        nextPage: function(a) {
            var c, d, f;
            this.active ? this.isLastItem() || (this._hasScroll() ? (d = this.active.offset().top, f = this.element.height(), this.active.nextAll(".ui-menu-item").each(function() { c = b(this);
                return 0 > c.offset().top - d - f }), this.focus(a, c)) : this.focus(a, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]())) : this.next(a) },
        previousPage: function(a) {
            var c, d, f;
            this.active ? this.isFirstItem() || (this._hasScroll() ? (d = this.active.offset().top, f = this.element.height(), this.active.prevAll(".ui-menu-item").each(function() {
                c =
                    b(this);
                return 0 < c.offset().top - d + f
            }), this.focus(a, c)) : this.focus(a, this.activeMenu.find(this.options.items).first())) : this.next(a)
        },
        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop("scrollHeight") },
        select: function(a) { this.active = this.active || b(a.target).closest(".ui-menu-item");
            var c = { item: this.active };
            this.active.has(".ui-menu").length || this.collapseAll(a, !0);
            this._trigger("select", a, c) },
        _filterMenuItems: function(a) {
            a = a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            var c =
                new RegExp("^" + a, "i");
            return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function() {
                return c.test(b.trim(b(this).text())) })
        }
    });
    b.widget("ui.autocomplete", {
        version: "1.11.2",
        defaultElement: "<input>",
        options: { appendTo: null, autoFocus: !1, delay: 300, minLength: 1, position: { my: "left top", at: "left bottom", collision: "none" }, source: null, change: null, close: null, focus: null, open: null, response: null, search: null, select: null },
        requestIndex: 0,
        pending: 0,
        _create: function() {
            var a, c, d, f = this.element[0].nodeName.toLowerCase(),
                g = "textarea" === f,
                f = "input" === f;
            this.isMultiLine = g ? !0 : f ? !1 : this.element.prop("isContentEditable");
            this.valueMethod = this.element[g || f ? "val" : "text"];
            this.isNewMenu = !0;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off");
            this._on(this.element, {
                keydown: function(f) {
                    if (this.element.prop("readOnly")) c = d = a = !0;
                    else {
                        c = d = a = !1;
                        var g = b.ui.keyCode;
                        switch (f.keyCode) {
                            case g.PAGE_UP:
                                a = !0;
                                this._move("previousPage", f);
                                break;
                            case g.PAGE_DOWN:
                                a = !0;
                                this._move("nextPage", f);
                                break;
                            case g.UP:
                                a = !0;
                                this._keyEvent("previous",
                                    f);
                                break;
                            case g.DOWN:
                                a = !0;
                                this._keyEvent("next", f);
                                break;
                            case g.ENTER:
                                this.menu.active && (a = !0, f.preventDefault(), this.menu.select(f));
                                break;
                            case g.TAB:
                                this.menu.active && this.menu.select(f);
                                break;
                            case g.ESCAPE:
                                this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(f), f.preventDefault());
                                break;
                            default:
                                c = !0, this._searchTimeout(f)
                        }
                    }
                },
                keypress: function(d) {
                    if (a) a = !1, this.isMultiLine && !this.menu.element.is(":visible") || d.preventDefault();
                    else if (!c) {
                        var f = b.ui.keyCode;
                        switch (d.keyCode) {
                            case f.PAGE_UP:
                                this._move("previousPage",
                                    d);
                                break;
                            case f.PAGE_DOWN:
                                this._move("nextPage", d);
                                break;
                            case f.UP:
                                this._keyEvent("previous", d);
                                break;
                            case f.DOWN:
                                this._keyEvent("next", d)
                        }
                    }
                },
                input: function(a) { d ? (d = !1, a.preventDefault()) : this._searchTimeout(a) },
                focus: function() { this.selectedItem = null;
                    this.previous = this._value() },
                blur: function(a) { this.cancelBlur ? delete this.cancelBlur : (clearTimeout(this.searching), this.close(a), this._change(a)) }
            });
            this._initSource();
            this.menu = b("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({ role: null }).hide().menu("instance");
            this._on(this.menu.element, {
                mousedown: function(a) { a.preventDefault();
                    this.cancelBlur = !0;
                    this._delay(function() { delete this.cancelBlur });
                    var c = this.menu.element[0];
                    b(a.target).closest(".ui-menu-item").length || this._delay(function() {
                        var a = this;
                        this.document.one("mousedown", function(d) { d.target === a.element[0] || d.target === c || b.contains(c, d.target) || a.close() }) }) },
                menufocus: function(a, c) {
                    var d;
                    if (this.isNewMenu && (this.isNewMenu = !1, a.originalEvent && /^mouse/.test(a.originalEvent.type))) {
                        this.menu.blur();
                        this.document.one("mousemove", function() { b(a.target).trigger(a.originalEvent) });
                        return
                    }
                    d = c.item.data("ui-autocomplete-item");
                    !1 !== this._trigger("focus", a, { item: d }) && a.originalEvent && /^key/.test(a.originalEvent.type) && this._value(d.value);
                    (d = c.item.attr("aria-label") || d.value) && b.trim(d).length && (this.liveRegion.children().hide(), b("<div>").text(d).appendTo(this.liveRegion))
                },
                menuselect: function(a, b) {
                    var c = b.item.data("ui-autocomplete-item"),
                        d = this.previous;
                    this.element[0] !== this.document[0].activeElement &&
                        (this.element.focus(), this.previous = d, this._delay(function() { this.previous = d;
                            this.selectedItem = c }));
                    !1 !== this._trigger("select", a, { item: c }) && this._value(c.value);
                    this.term = this._value();
                    this.close(a);
                    this.selectedItem = c
                }
            });
            this.liveRegion = b("<span>", { role: "status", "aria-live": "assertive", "aria-relevant": "additions" }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body);
            this._on(this.window, { beforeunload: function() { this.element.removeAttr("autocomplete") } })
        },
        _destroy: function() {
            clearTimeout(this.searching);
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete");
            this.menu.element.remove();
            this.liveRegion.remove()
        },
        _setOption: function(a, b) { this._super(a, b); "source" === a && this._initSource(); "appendTo" === a && this.menu.element.appendTo(this._appendTo()); "disabled" === a && b && this.xhr && this.xhr.abort() },
        _appendTo: function() {
            var a = this.options.appendTo;
            a && (a = a.jquery || a.nodeType ? b(a) : this.document.find(a).eq(0));
            a && a[0] || (a = this.element.closest(".ui-front"));
            a.length || (a = this.document[0].body);
            return a
        },
        _initSource: function() {
            var a, c, d = this;
            b.isArray(this.options.source) ? (a = this.options.source, this.source = function(c, d) { d(b.ui.autocomplete.filter(a, c.term)) }) : "string" === typeof this.options.source ? (c = this.options.source, this.source = function(a, g) { d.xhr && d.xhr.abort();
                d.xhr = b.ajax({ url: c, data: a, dataType: "json", success: function(a) { g(a) }, error: function() { g([]) } }) }) : this.source = this.options.source },
        _searchTimeout: function(a) {
            clearTimeout(this.searching);
            this.searching = this._delay(function() {
                var b =
                    this.term === this._value(),
                    d = this.menu.element.is(":visible"),
                    f = a.altKey || a.ctrlKey || a.metaKey || a.shiftKey;
                if (!b || b && !d && !f) this.selectedItem = null, this.search(null, a)
            }, this.options.delay)
        },
        search: function(a, b) { a = null != a ? a : this._value();
            this.term = this._value();
            if (a.length < this.options.minLength) return this.close(b);
            if (!1 !== this._trigger("search", b)) return this._search(a) },
        _search: function(a) { this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.cancelSearch = !1;
            this.source({ term: a }, this._response()) },
        _response: function() {
            var a = ++this.requestIndex;
            return b.proxy(function(b) { a === this.requestIndex && this.__response(b);
                this.pending--;
                this.pending || this.element.removeClass("ui-autocomplete-loading") }, this) },
        __response: function(a) { a && (a = this._normalize(a));
            this._trigger("response", null, { content: a });!this.options.disabled && a && a.length && !this.cancelSearch ? (this._suggest(a), this._trigger("open")) : this._close() },
        close: function(a) { this.cancelSearch = !0;
            this._close(a) },
        _close: function(a) {
            this.menu.element.is(":visible") &&
                (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", a))
        },
        _change: function(a) { this.previous !== this._value() && this._trigger("change", a, { item: this.selectedItem }) },
        _normalize: function(a) {
            return a.length && a[0].label && a[0].value ? a : b.map(a, function(a) {
                return "string" === typeof a ? { label: a, value: a } : b.extend({}, a, { label: a.label || a.value, value: a.value || a.label }) }) },
        _suggest: function(a) {
            var c = this.menu.element.empty();
            this._renderMenu(c, a);
            this.isNewMenu = !0;
            this.menu.refresh();
            c.show();
            this._resizeMenu();
            c.position(b.extend({ of: this.element }, this.options.position));
            this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function() {
            var a = this.menu.element;
            a.outerWidth(Math.max(a.width("").outerWidth() + 1, this.element.outerWidth())) },
        _renderMenu: function(a, c) {
            var d = this;
            b.each(c, function(b, c) { d._renderItemData(a, c) }) },
        _renderItemData: function(a, b) {
            return this._renderItem(a, b).data("ui-autocomplete-item", b) },
        _renderItem: function(a, c) {
            return b("<li>").text(c.label).appendTo(a) },
        _move: function(a,
            b) {
            if (this.menu.element.is(":visible"))
                if (this.menu.isFirstItem() && /^previous/.test(a) || this.menu.isLastItem() && /^next/.test(a)) this.isMultiLine || this._value(this.term), this.menu.blur();
                else this.menu[a](b);
            else this.search(null, b) },
        widget: function() {
            return this.menu.element },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments) },
        _keyEvent: function(a, b) {
            if (!this.isMultiLine || this.menu.element.is(":visible")) this._move(a, b), b.preventDefault() }
    });
    b.extend(b.ui.autocomplete, {
        escapeRegex: function(a) {
            return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,
                "\\$&")
        },
        filter: function(a, c) {
            var d = new RegExp(b.ui.autocomplete.escapeRegex(c), "i");
            return b.grep(a, function(a) {
                return d.test(a.label || a.value || a) }) }
    });
    b.widget("ui.autocomplete", b.ui.autocomplete, {
        options: { messages: { noResults: "No search results.", results: function(a) {
                    return a + (1 < a ? " results are" : " result is") + " available, use up and down arrow keys to navigate." } } },
        __response: function(a) {
            var c;
            this._superApply(arguments);
            this.options.disabled || this.cancelSearch || (c = a && a.length ? this.options.messages.results(a.length) :
                this.options.messages.noResults, this.liveRegion.children().hide(), b("<div>").text(c).appendTo(this.liveRegion))
        }
    });
    var C, O = function() {
            var a = b(this);
            setTimeout(function() { a.find(":ui-button").button("refresh") }, 1) },
        J = function(a) {
            var c = a.name,
                d = a.form,
                f = b([]);
            c && (c = c.replace(/'/g, "\\'"), f = d ? b(d).find("[name='" + c + "'][type=radio]") : b("[name='" + c + "'][type=radio]", a.ownerDocument).filter(function() {
                return !this.form }));
            return f };
    b.widget("ui.button", {
        version: "1.11.2",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: !0,
            label: null,
            icons: { primary: null, secondary: null }
        },
        _create: function() {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, O);
            "boolean" !== typeof this.options.disabled ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled);
            this._determineButtonType();
            this.hasTitle = !!this.buttonElement.attr("title");
            var a = this,
                c = this.options,
                d = "checkbox" === this.type || "radio" === this.type,
                f = d ? "" : "ui-state-active";
            null ===
                c.label && (c.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html());
            this._hoverable(this.buttonElement);
            this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role", "button").bind("mouseenter" + this.eventNamespace, function() { c.disabled || this === C && b(this).addClass("ui-state-active") }).bind("mouseleave" + this.eventNamespace, function() { c.disabled || b(this).removeClass(f) }).bind("click" + this.eventNamespace, function(a) {
                c.disabled && (a.preventDefault(),
                    a.stopImmediatePropagation())
            });
            this._on({ focus: function() { this.buttonElement.addClass("ui-state-focus") }, blur: function() { this.buttonElement.removeClass("ui-state-focus") } });
            d && this.element.bind("change" + this.eventNamespace, function() { a.refresh() });
            "checkbox" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (c.disabled) return !1 }) : "radio" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (c.disabled) return !1;
                b(this).addClass("ui-state-active");
                a.buttonElement.attr("aria-pressed", "true");
                var d = a.element[0];
                J(d).not(d).map(function() {
                    return b(this).button("widget")[0] }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function() {
                if (c.disabled) return !1;
                b(this).addClass("ui-state-active");
                C = this;
                a.document.one("mouseup", function() { C = null }) }).bind("mouseup" + this.eventNamespace, function() {
                if (c.disabled) return !1;
                b(this).removeClass("ui-state-active") }).bind("keydown" + this.eventNamespace,
                function(a) {
                    if (c.disabled) return !1;
                    a.keyCode !== b.ui.keyCode.SPACE && a.keyCode !== b.ui.keyCode.ENTER || b(this).addClass("ui-state-active") }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() { b(this).removeClass("ui-state-active") }), this.buttonElement.is("a") && this.buttonElement.keyup(function(a) { a.keyCode === b.ui.keyCode.SPACE && b(this).click() }));
            this._setOption("disabled", c.disabled);
            this._resetButton()
        },
        _determineButtonType: function() {
            var a, b;
            this.element.is("[type=checkbox]") ?
                this.type = "checkbox" : this.element.is("[type=radio]") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button";
            "checkbox" === this.type || "radio" === this.type ? (a = this.element.parents().last(), b = "label[for='" + this.element.attr("id") + "']", this.buttonElement = a.find(b), this.buttonElement.length || (a = a.length ? a.siblings() : this.element.siblings(), this.buttonElement = a.filter(b), this.buttonElement.length || (this.buttonElement = a.find(b))), this.element.addClass("ui-helper-hidden-accessible"),
                (a = this.element.is(":checked")) && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", a)) : this.buttonElement = this.element
        },
        widget: function() {
            return this.buttonElement },
        _destroy: function() {
            this.element.removeClass("ui-helper-hidden-accessible");
            this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-active ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
            this.hasTitle || this.buttonElement.removeAttr("title")
        },
        _setOption: function(a, b) { this._super(a, b); "disabled" === a ? (this.widget().toggleClass("ui-state-disabled", !!b), this.element.prop("disabled", !!b), b && ("checkbox" === this.type || "radio" === this.type ? this.buttonElement.removeClass("ui-state-focus") : this.buttonElement.removeClass("ui-state-focus ui-state-active"))) : this._resetButton() },
        refresh: function() {
            var a = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            a !== this.options.disabled && this._setOption("disabled", a);
            "radio" === this.type ? J(this.element[0]).each(function() { b(this).is(":checked") ? b(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : b(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false") }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",
                "false"))
        },
        _resetButton: function() {
            if ("input" === this.type) this.options.label && this.element.val(this.options.label);
            else {
                var a = this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
                    c = b("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(a.empty()).text(),
                    d = this.options.icons,
                    f = d.primary && d.secondary,
                    g = [];
                d.primary || d.secondary ? (this.options.text &&
                    g.push("ui-button-text-icon" + (f ? "s" : d.primary ? "-primary" : "-secondary")), d.primary && a.prepend("<span class='ui-button-icon-primary ui-icon " + d.primary + "'></span>"), d.secondary && a.append("<span class='ui-button-icon-secondary ui-icon " + d.secondary + "'></span>"), this.options.text || (g.push(f ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || a.attr("title", b.trim(c)))) : g.push("ui-button-text-only");
                a.addClass(g.join(" "))
            }
        }
    });
    b.widget("ui.buttonset", {
        version: "1.11.2",
        options: { items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)" },
        _create: function() { this.element.addClass("ui-buttonset") },
        _init: function() { this.refresh() },
        _setOption: function(a, b) { "disabled" === a && this.buttons.button("option", a, b);
            this._super(a, b) },
        refresh: function() {
            var a = "rtl" === this.element.css("direction"),
                c = this.element.find(this.options.items),
                d = c.filter(":ui-button");
            c.not(":ui-button").button();
            d.button("refresh");
            this.buttons = c.map(function() {
                return b(this).button("widget")[0] }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(a ?
                "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(a ? "ui-corner-left" : "ui-corner-right").end().end()
        },
        _destroy: function() { this.element.removeClass("ui-buttonset");
            this.buttons.map(function() {
                return b(this).button("widget")[0] }).removeClass("ui-corner-left ui-corner-right").end().button("destroy") }
    });
    b.extend(b.ui, { datepicker: { version: "1.11.2" } });
    var L;
    b.extend(h.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        _widgetDatepicker: function() {
            return this.dpDiv },
        setDefaults: function(a) {
            v(this._defaults,
                a || {});
            return this
        },
        _attachDatepicker: function(a, c) {
            var d, f, g;
            d = a.nodeName.toLowerCase();
            f = "div" === d || "span" === d;
            a.id || (this.uuid += 1, a.id = "dp" + this.uuid);
            g = this._newInst(b(a), f);
            g.settings = b.extend({}, c || {}); "input" === d ? this._connectDatepicker(a, g) : f && this._inlineDatepicker(a, g) },
        _newInst: function(a, c) {
            return {
                id: a[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
                input: a,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: c,
                dpDiv: c ? n(b("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
            }
        },
        _connectDatepicker: function(a, c) {
            var d = b(a);
            c.append = b([]);
            c.trigger = b([]);
            d.hasClass(this.markerClassName) || (this._attachments(d, c), d.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(c), b.data(a, "datepicker", c), c.settings.disabled && this._disableDatepicker(a)) },
        _attachments: function(a, c) {
            var d, f;
            d = this._get(c, "appendText");
            var g = this._get(c, "isRTL");
            c.append && c.append.remove();
            d && (c.append = b("<span class='" + this._appendClass +
                "'>" + d + "</span>"), a[g ? "before" : "after"](c.append));
            a.unbind("focus", this._showDatepicker);
            c.trigger && c.trigger.remove();
            d = this._get(c, "showOn");
            "focus" !== d && "both" !== d || a.focus(this._showDatepicker);
            if ("button" === d || "both" === d) d = this._get(c, "buttonText"), f = this._get(c, "buttonImage"), c.trigger = b(this._get(c, "buttonImageOnly") ? b("<img/>").addClass(this._triggerClass).attr({ src: f, alt: d, title: d }) : b("<button type='button'></button>").addClass(this._triggerClass).html(f ? b("<img/>").attr({ src: f, alt: d, title: d }) :
                d)), a[g ? "before" : "after"](c.trigger), c.trigger.click(function() { b.datepicker._datepickerShowing && b.datepicker._lastInput === a[0] ? b.datepicker._hideDatepicker() : (b.datepicker._datepickerShowing && b.datepicker._lastInput !== a[0] && b.datepicker._hideDatepicker(), b.datepicker._showDatepicker(a[0]));
                return !1 })
        },
        _autoSize: function(a) {
            if (this._get(a, "autoSize") && !a.inline) {
                var b, d, f, g, p = new Date(2009, 11, 20),
                    e = this._get(a, "dateFormat");
                e.match(/[DM]/) && (b = function(a) {
                    for (g = f = d = 0; g < a.length; g++) a[g].length > d &&
                        (d = a[g].length, f = g);
                    return f
                }, p.setMonth(b(this._get(a, e.match(/MM/) ? "monthNames" : "monthNamesShort"))), p.setDate(b(this._get(a, e.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - p.getDay()));
                a.input.attr("size", this._formatDate(a, p).length)
            }
        },
        _inlineDatepicker: function(a, c) {
            var d = b(a);
            d.hasClass(this.markerClassName) || (d.addClass(this.markerClassName).append(c.dpDiv), b.data(a, "datepicker", c), this._setDate(c, this._getDefaultDate(c), !0), this._updateDatepicker(c), this._updateAlternate(c), c.settings.disabled &&
                this._disableDatepicker(a), c.dpDiv.css("display", "block"))
        },
        _dialogDatepicker: function(a, c, d, f, g) {
            var p;
            a = this._dialogInst;
            a || (this.uuid += 1, a = "dp" + this.uuid, this._dialogInput = b("<input type='text' id='" + a + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), b("body").append(this._dialogInput), a = this._dialogInst = this._newInst(this._dialogInput, !1), a.settings = {}, b.data(this._dialogInput[0], "datepicker", a));
            v(a.settings, f || {});
            c = c && c.constructor === Date ?
                this._formatDate(a, c) : c;
            this._dialogInput.val(c);
            this._pos = g ? g.length ? g : [g.pageX, g.pageY] : null;
            this._pos || (c = document.documentElement.clientWidth, f = document.documentElement.clientHeight, g = document.documentElement.scrollLeft || document.body.scrollLeft, p = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [c / 2 - 100 + g, f / 2 - 150 + p]);
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px");
            a.settings.onSelect = d;
            this._inDialog = !0;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            b.blockUI && b.blockUI(this.dpDiv);
            b.data(this._dialogInput[0], "datepicker", a);
            return this
        },
        _destroyDatepicker: function(a) {
            var c, d = b(a),
                f = b.data(a, "datepicker");
            d.hasClass(this.markerClassName) && (c = a.nodeName.toLowerCase(), b.removeData(a, "datepicker"), "input" === c ? (f.append.remove(), f.trigger.remove(), d.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup",
                this._doKeyUp)) : "div" !== c && "span" !== c || d.removeClass(this.markerClassName).empty())
        },
        _enableDatepicker: function(a) {
            var c, d = b(a),
                f = b.data(a, "datepicker");
            if (d.hasClass(this.markerClassName)) {
                c = a.nodeName.toLowerCase();
                if ("input" === c) a.disabled = !1, f.trigger.filter("button").each(function() { this.disabled = !1 }).end().filter("img").css({ opacity: "1.0", cursor: "" });
                else if ("div" === c || "span" === c) c = d.children("." + this._inlineClass), c.children().removeClass("ui-state-disabled"), c.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1);
                this._disabledInputs = b.map(this._disabledInputs, function(b) {
                    return b === a ? null : b })
            }
        },
        _disableDatepicker: function(a) {
            var c, d = b(a),
                f = b.data(a, "datepicker");
            if (d.hasClass(this.markerClassName)) {
                c = a.nodeName.toLowerCase();
                if ("input" === c) a.disabled = !0, f.trigger.filter("button").each(function() { this.disabled = !0 }).end().filter("img").css({ opacity: "0.5", cursor: "default" });
                else if ("div" === c || "span" === c) c = d.children("." + this._inlineClass), c.children().addClass("ui-state-disabled"), c.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0);
                this._disabledInputs = b.map(this._disabledInputs, function(b) {
                    return b === a ? null : b });
                this._disabledInputs[this._disabledInputs.length] = a
            }
        },
        _isDisabledDatepicker: function(a) {
            if (!a) return !1;
            for (var b = 0; b < this._disabledInputs.length; b++)
                if (this._disabledInputs[b] === a) return !0;
            return !1 },
        _getInst: function(a) {
            try {
                return b.data(a, "datepicker") } catch (c) {
                throw "Missing instance data for this datepicker"; } },
        _optionDatepicker: function(a, c, d) {
            var f, g, p, e, h = this._getInst(a);
            if (2 === arguments.length && "string" ===
                typeof c) return "defaults" === c ? b.extend({}, b.datepicker._defaults) : h ? "all" === c ? b.extend({}, h.settings) : this._get(h, c) : null;
            f = c || {};
            "string" === typeof c && (f = {}, f[c] = d);
            h && (this._curInst === h && this._hideDatepicker(), g = this._getDateDatepicker(a, !0), p = this._getMinMaxDate(h, "min"), e = this._getMinMaxDate(h, "max"), v(h.settings, f), null !== p && void 0 !== f.dateFormat && void 0 === f.minDate && (h.settings.minDate = this._formatDate(h, p)), null !== e && void 0 !== f.dateFormat && void 0 === f.maxDate && (h.settings.maxDate = this._formatDate(h,
                e)), "disabled" in f && (f.disabled ? this._disableDatepicker(a) : this._enableDatepicker(a)), this._attachments(b(a), h), this._autoSize(h), this._setDate(h, g), this._updateAlternate(h), this._updateDatepicker(h))
        },
        _changeDatepicker: function(a, b, d) { this._optionDatepicker(a, b, d) },
        _refreshDatepicker: function(a) {
            (a = this._getInst(a)) && this._updateDatepicker(a) },
        _setDateDatepicker: function(a, b) {
            var c = this._getInst(a);
            c && (this._setDate(c, b), this._updateDatepicker(c), this._updateAlternate(c)) },
        _getDateDatepicker: function(a,
            b) {
            var c = this._getInst(a);
            c && !c.inline && this._setDateFromField(c, b);
            return c ? this._getDate(c) : null },
        _doKeyDown: function(a) {
            var c, d = b.datepicker._getInst(a.target);
            c = !0;
            var f = d.dpDiv.is(".ui-datepicker-rtl");
            d._keyEvent = !0;
            if (b.datepicker._datepickerShowing) switch (a.keyCode) {
                case 9:
                    b.datepicker._hideDatepicker();
                    c = !1;
                    break;
                case 13:
                    return c = b("td." + b.datepicker._dayOverClass + ":not(." + b.datepicker._currentClass + ")", d.dpDiv), c[0] && b.datepicker._selectDay(a.target, d.selectedMonth, d.selectedYear, c[0]),
                        (a = b.datepicker._get(d, "onSelect")) ? (c = b.datepicker._formatDate(d), a.apply(d.input ? d.input[0] : null, [c, d])) : b.datepicker._hideDatepicker(), !1;
                case 27:
                    b.datepicker._hideDatepicker();
                    break;
                case 33:
                    b.datepicker._adjustDate(a.target, a.ctrlKey ? -b.datepicker._get(d, "stepBigMonths") : -b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 34:
                    b.datepicker._adjustDate(a.target, a.ctrlKey ? +b.datepicker._get(d, "stepBigMonths") : +b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 35:
                    (a.ctrlKey || a.metaKey) && b.datepicker._clearDate(a.target);
                    c = a.ctrlKey || a.metaKey;
                    break;
                case 36:
                    (a.ctrlKey || a.metaKey) && b.datepicker._gotoToday(a.target);
                    c = a.ctrlKey || a.metaKey;
                    break;
                case 37:
                    (a.ctrlKey || a.metaKey) && b.datepicker._adjustDate(a.target, f ? 1 : -1, "D");
                    c = a.ctrlKey || a.metaKey;
                    a.originalEvent.altKey && b.datepicker._adjustDate(a.target, a.ctrlKey ? -b.datepicker._get(d, "stepBigMonths") : -b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 38:
                    (a.ctrlKey || a.metaKey) && b.datepicker._adjustDate(a.target, -7, "D");
                    c = a.ctrlKey || a.metaKey;
                    break;
                case 39:
                    (a.ctrlKey || a.metaKey) &&
                    b.datepicker._adjustDate(a.target, f ? -1 : 1, "D");
                    c = a.ctrlKey || a.metaKey;
                    a.originalEvent.altKey && b.datepicker._adjustDate(a.target, a.ctrlKey ? +b.datepicker._get(d, "stepBigMonths") : +b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 40:
                    (a.ctrlKey || a.metaKey) && b.datepicker._adjustDate(a.target, 7, "D");
                    c = a.ctrlKey || a.metaKey;
                    break;
                default:
                    c = !1
            } else 36 === a.keyCode && a.ctrlKey ? b.datepicker._showDatepicker(this) : c = !1;
            c && (a.preventDefault(), a.stopPropagation())
        },
        _doKeyPress: function(a) {
            var c, d;
            c = b.datepicker._getInst(a.target);
            if (b.datepicker._get(c, "constrainInput")) return c = b.datepicker._possibleChars(b.datepicker._get(c, "dateFormat")), d = String.fromCharCode(null == a.charCode ? a.keyCode : a.charCode), a.ctrlKey || a.metaKey || " " > d || !c || -1 < c.indexOf(d)
        },
        _doKeyUp: function(a) {
            var c;
            a = b.datepicker._getInst(a.target);
            if (a.input.val() !== a.lastVal) try {
                if (c = b.datepicker.parseDate(b.datepicker._get(a, "dateFormat"), a.input ? a.input.val() : null, b.datepicker._getFormatConfig(a))) b.datepicker._setDateFromField(a), b.datepicker._updateAlternate(a),
                    b.datepicker._updateDatepicker(a)
            } catch (d) {}
            return !0
        },
        _showDatepicker: function(a) {
            a = a.target || a;
            "input" !== a.nodeName.toLowerCase() && (a = b("input", a.parentNode)[0]);
            if (!b.datepicker._isDisabledDatepicker(a) && b.datepicker._lastInput !== a) {
                var c, d, f, g;
                c = b.datepicker._getInst(a);
                b.datepicker._curInst && b.datepicker._curInst !== c && (b.datepicker._curInst.dpDiv.stop(!0, !0), c && b.datepicker._datepickerShowing && b.datepicker._hideDatepicker(b.datepicker._curInst.input[0]));
                d = (d = b.datepicker._get(c, "beforeShow")) ?
                    d.apply(a, [a, c]) : {};
                if (!1 !== d && (v(c.settings, d), c.lastVal = null, b.datepicker._lastInput = a, b.datepicker._setDateFromField(c), b.datepicker._inDialog && (a.value = ""), b.datepicker._pos || (b.datepicker._pos = b.datepicker._findPos(a), b.datepicker._pos[1] += a.offsetHeight), f = !1, b(a).parents().each(function() { f |= "fixed" === b(this).css("position");
                            return !f }), d = { left: b.datepicker._pos[0], top: b.datepicker._pos[1] }, b.datepicker._pos = null, c.dpDiv.empty(), c.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" }),
                        b.datepicker._updateDatepicker(c), d = b.datepicker._checkOffset(c, d, f), c.dpDiv.css({ position: b.datepicker._inDialog && b.blockUI ? "static" : f ? "fixed" : "absolute", display: "none", left: d.left + "px", top: d.top + "px" }), !c.inline)) {
                    d = b.datepicker._get(c, "showAnim");
                    g = b.datepicker._get(c, "duration");
                    c.dpDiv.css("z-index", e(b(a)) + 1);
                    b.datepicker._datepickerShowing = !0;
                    if (b.effects && b.effects.effect[d]) c.dpDiv.show(d, b.datepicker._get(c, "showOptions"), g);
                    else c.dpDiv[d || "show"](d ? g : null);
                    b.datepicker._shouldFocusInput(c) &&
                        c.input.focus();
                    b.datepicker._curInst = c
                }
            }
        },
        _updateDatepicker: function(a) {
            this.maxRows = 4;
            L = a;
            a.dpDiv.empty().append(this._generateHTML(a));
            this._attachHandlers(a);
            var c, d = this._getNumberOfMonths(a),
                f = d[1],
                g = a.dpDiv.find("." + this._dayOverClass + " a");
            0 < g.length && q.apply(g.get(0));
            a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            1 < f && a.dpDiv.addClass("ui-datepicker-multi-" + f).css("width", 17 * f + "em");
            a.dpDiv[(1 !== d[0] || 1 !== d[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            a.dpDiv[(this._get(a, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            a === b.datepicker._curInst && b.datepicker._datepickerShowing && b.datepicker._shouldFocusInput(a) && a.input.focus();
            a.yearshtml && (c = a.yearshtml, setTimeout(function() { c === a.yearshtml && a.yearshtml && a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml);
                c = a.yearshtml = null }, 0))
        },
        _shouldFocusInput: function(a) {
            return a.input && a.input.is(":visible") && !a.input.is(":disabled") && !a.input.is(":focus") },
        _checkOffset: function(a,
            c, d) {
            var f = a.dpDiv.outerWidth(),
                g = a.dpDiv.outerHeight(),
                p = a.input ? a.input.outerWidth() : 0,
                e = a.input ? a.input.outerHeight() : 0,
                h = document.documentElement.clientWidth + (d ? 0 : b(document).scrollLeft()),
                m = document.documentElement.clientHeight + (d ? 0 : b(document).scrollTop());
            c.left -= this._get(a, "isRTL") ? f - p : 0;
            c.left -= d && c.left === a.input.offset().left ? b(document).scrollLeft() : 0;
            c.top -= d && c.top === a.input.offset().top + e ? b(document).scrollTop() : 0;
            c.left -= Math.min(c.left, c.left + f > h && h > f ? Math.abs(c.left + f - h) : 0);
            c.top -=
                Math.min(c.top, c.top + g > m && m > g ? Math.abs(g + e) : 0);
            return c
        },
        _findPos: function(a) {
            for (var c = this._getInst(a), c = this._get(c, "isRTL"); a && ("hidden" === a.type || 1 !== a.nodeType || b.expr.filters.hidden(a));) a = a[c ? "previousSibling" : "nextSibling"];
            a = b(a).offset();
            return [a.left, a.top] },
        _hideDatepicker: function(a) {
            var c, d, f = this._curInst;
            if (f && (!a || f === b.data(a, "datepicker")) && this._datepickerShowing) {
                a = this._get(f, "showAnim");
                c = this._get(f, "duration");
                d = function() { b.datepicker._tidyDialog(f) };
                if (b.effects && (b.effects.effect[a] ||
                        b.effects[a])) f.dpDiv.hide(a, b.datepicker._get(f, "showOptions"), c, d);
                else f.dpDiv["slideDown" === a ? "slideUp" : "fadeIn" === a ? "fadeOut" : "hide"](a ? c : null, d);
                a || d();
                this._datepickerShowing = !1;
                (a = this._get(f, "onClose")) && a.apply(f.input ? f.input[0] : null, [f.input ? f.input.val() : "", f]);
                this._lastInput = null;
                this._inDialog && (this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" }), b.blockUI && (b.unblockUI(), b("body").append(this.dpDiv)));
                this._inDialog = !1
            }
        },
        _tidyDialog: function(a) { a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar") },
        _checkExternalClick: function(a) {
            if (b.datepicker._curInst) { a = b(a.target);
                var c = b.datepicker._getInst(a[0]);
                (!(a[0].id === b.datepicker._mainDivId || 0 !== a.parents("#" + b.datepicker._mainDivId).length || a.hasClass(b.datepicker.markerClassName) || a.closest("." + b.datepicker._triggerClass).length || !b.datepicker._datepickerShowing || b.datepicker._inDialog && b.blockUI) || a.hasClass(b.datepicker.markerClassName) && b.datepicker._curInst !== c) && b.datepicker._hideDatepicker() } },
        _adjustDate: function(a, c, d) {
            a = b(a);
            var f =
                this._getInst(a[0]);
            this._isDisabledDatepicker(a[0]) || (this._adjustInstDate(f, c + ("M" === d ? this._get(f, "showCurrentAtPos") : 0), d), this._updateDatepicker(f))
        },
        _gotoToday: function(a) {
            var c = b(a),
                d = this._getInst(c[0]);
            this._get(d, "gotoCurrent") && d.currentDay ? (d.selectedDay = d.currentDay, d.drawMonth = d.selectedMonth = d.currentMonth, d.drawYear = d.selectedYear = d.currentYear) : (a = new Date, d.selectedDay = a.getDate(), d.drawMonth = d.selectedMonth = a.getMonth(), d.drawYear = d.selectedYear = a.getFullYear());
            this._notifyChange(d);
            this._adjustDate(c)
        },
        _selectMonthYear: function(a, c, d) { a = b(a);
            var f = this._getInst(a[0]);
            f["selected" + ("M" === d ? "Month" : "Year")] = f["draw" + ("M" === d ? "Month" : "Year")] = parseInt(c.options[c.selectedIndex].value, 10);
            this._notifyChange(f);
            this._adjustDate(a) },
        _selectDay: function(a, c, d, f) {
            var g;
            g = b(a);
            b(f).hasClass(this._unselectableClass) || this._isDisabledDatepicker(g[0]) || (g = this._getInst(g[0]), g.selectedDay = g.currentDay = b("a", f).html(), g.selectedMonth = g.currentMonth = c, g.selectedYear = g.currentYear = d, this._selectDate(a,
                this._formatDate(g, g.currentDay, g.currentMonth, g.currentYear)))
        },
        _clearDate: function(a) { a = b(a);
            this._selectDate(a, "") },
        _selectDate: function(a, c) {
            var d;
            d = b(a);
            var f = this._getInst(d[0]);
            c = null != c ? c : this._formatDate(f);
            f.input && f.input.val(c);
            this._updateAlternate(f);
            (d = this._get(f, "onSelect")) ? d.apply(f.input ? f.input[0] : null, [c, f]): f.input && f.input.trigger("change");
            f.inline ? this._updateDatepicker(f) : (this._hideDatepicker(), this._lastInput = f.input[0], "object" !== typeof f.input[0] && f.input.focus(), this._lastInput =
                null)
        },
        _updateAlternate: function(a) {
            var c, d, f, g = this._get(a, "altField");
            g && (c = this._get(a, "altFormat") || this._get(a, "dateFormat"), d = this._getDate(a), f = this.formatDate(c, d, this._getFormatConfig(a)), b(g).each(function() { b(this).val(f) })) },
        noWeekends: function(a) { a = a.getDay();
            return [0 < a && 6 > a, ""] },
        iso8601Week: function(a) {
            var b = new Date(a.getTime());
            b.setDate(b.getDate() + 4 - (b.getDay() || 7));
            a = b.getTime();
            b.setMonth(0);
            b.setDate(1);
            return Math.floor(Math.round((a - b) / 864E5) / 7) + 1 },
        parseDate: function(a, c, d) {
            if (null ==
                a || null == c) throw "Invalid arguments";
            c = "object" === typeof c ? c.toString() : c + "";
            if ("" === c) return null;
            var f, g, p, e = 0;
            g = (d ? d.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            g = "string" !== typeof g ? g : (new Date).getFullYear() % 100 + parseInt(g, 10);
            p = (d ? d.dayNamesShort : null) || this._defaults.dayNamesShort;
            var h = (d ? d.dayNames : null) || this._defaults.dayNames,
                m = (d ? d.monthNamesShort : null) || this._defaults.monthNamesShort,
                k = (d ? d.monthNames : null) || this._defaults.monthNames,
                l = d = -1,
                u = -1,
                x = -1,
                G = !1,
                t, y = function(b) {
                    (b =
                        f + 1 < a.length && a.charAt(f + 1) === b) && f++;
                    return b
                },
                D = function(a) {
                    var b = y(a),
                        b = "@" === a ? 14 : "!" === a ? 20 : "y" === a && b ? 4 : "o" === a ? 3 : 2;
                    a = new RegExp("^\\d{" + ("y" === a ? b : 1) + "," + b + "}");
                    a = c.substring(e).match(a);
                    if (!a) throw "Missing number at position " + e;
                    e += a[0].length;
                    return parseInt(a[0], 10) },
                n = function(a, d, f) {
                    var g = -1;
                    a = b.map(y(a) ? f : d, function(a, b) {
                        return [
                            [b, a]
                        ] }).sort(function(a, b) {
                        return -(a[1].length - b[1].length) });
                    b.each(a, function(a, b) {
                        var d = b[1];
                        if (c.substr(e, d.length).toLowerCase() === d.toLowerCase()) return g =
                            b[0], e += d.length, !1
                    });
                    if (-1 !== g) return g + 1;
                    throw "Unknown name at position " + e;
                },
                r = function() {
                    if (c.charAt(e) !== a.charAt(f)) throw "Unexpected literal at position " + e;
                    e++ };
            for (f = 0; f < a.length; f++)
                if (G) "'" !== a.charAt(f) || y("'") ? r() : G = !1;
                else switch (a.charAt(f)) {
                    case "d":
                        u = D("d");
                        break;
                    case "D":
                        n("D", p, h);
                        break;
                    case "o":
                        x = D("o");
                        break;
                    case "m":
                        l = D("m");
                        break;
                    case "M":
                        l = n("M", m, k);
                        break;
                    case "y":
                        d = D("y");
                        break;
                    case "@":
                        t = new Date(D("@"));
                        d = t.getFullYear();
                        l = t.getMonth() + 1;
                        u = t.getDate();
                        break;
                    case "!":
                        t = new Date((D("!") -
                            this._ticksTo1970) / 1E4);
                        d = t.getFullYear();
                        l = t.getMonth() + 1;
                        u = t.getDate();
                        break;
                    case "'":
                        y("'") ? r() : G = !0;
                        break;
                    default:
                        r()
                }
                if (e < c.length && (p = c.substr(e), !/^\s+/.test(p))) throw "Extra/unparsed characters found in date: " + p; - 1 === d ? d = (new Date).getFullYear() : 100 > d && (d += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (d <= g ? 0 : -100));
            if (-1 < x) { l = 1;
                u = x;
                do { g = this._getDaysInMonth(d, l - 1);
                    if (u <= g) break;
                    l++;
                    u -= g } while (1) }
            t = this._daylightSavingAdjust(new Date(d, l - 1, u));
            if (t.getFullYear() !== d || t.getMonth() +
                1 !== l || t.getDate() !== u) throw "Invalid date";
            return t
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: 864E9 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
        formatDate: function(a, b, d) {
            if (!b) return "";
            var c, g = (d ? d.dayNamesShort : null) || this._defaults.dayNamesShort,
                p = (d ? d.dayNames : null) || this._defaults.dayNames,
                e = (d ?
                    d.monthNamesShort : null) || this._defaults.monthNamesShort;
            d = (d ? d.monthNames : null) || this._defaults.monthNames;
            var h = function(b) {
                    (b = c + 1 < a.length && a.charAt(c + 1) === b) && c++;
                    return b },
                m = function(a, b, c) { b = "" + b;
                    if (h(a))
                        for (; b.length < c;) b = "0" + b;
                    return b },
                k = function(a, b, c, d) {
                    return h(a) ? d[b] : c[b] },
                l = "",
                u = !1;
            if (b)
                for (c = 0; c < a.length; c++)
                    if (u) "'" !== a.charAt(c) || h("'") ? l += a.charAt(c) : u = !1;
                    else switch (a.charAt(c)) {
                        case "d":
                            l += m("d", b.getDate(), 2);
                            break;
                        case "D":
                            l += k("D", b.getDay(), g, p);
                            break;
                        case "o":
                            l += m("o", Math.round(((new Date(b.getFullYear(),
                                b.getMonth(), b.getDate())).getTime() - (new Date(b.getFullYear(), 0, 0)).getTime()) / 864E5), 3);
                            break;
                        case "m":
                            l += m("m", b.getMonth() + 1, 2);
                            break;
                        case "M":
                            l += k("M", b.getMonth(), e, d);
                            break;
                        case "y":
                            l += h("y") ? b.getFullYear() : (10 > b.getYear() % 100 ? "0" : "") + b.getYear() % 100;
                            break;
                        case "@":
                            l += b.getTime();
                            break;
                        case "!":
                            l += 1E4 * b.getTime() + this._ticksTo1970;
                            break;
                        case "'":
                            h("'") ? l += "'" : u = !0;
                            break;
                        default:
                            l += a.charAt(c)
                    }
                    return l
        },
        _possibleChars: function(a) {
            var b, d = "",
                f = !1,
                g = function(c) {
                    (c = b + 1 < a.length && a.charAt(b + 1) ===
                        c) && b++;
                    return c
                };
            for (b = 0; b < a.length; b++)
                if (f) "'" !== a.charAt(b) || g("'") ? d += a.charAt(b) : f = !1;
                else switch (a.charAt(b)) {
                    case "d":
                    case "m":
                    case "y":
                    case "@":
                        d += "0123456789";
                        break;
                    case "D":
                    case "M":
                        return null;
                    case "'":
                        g("'") ? d += "'" : f = !0;
                        break;
                    default:
                        d += a.charAt(b) }
                return d
        },
        _get: function(a, b) {
            return void 0 !== a.settings[b] ? a.settings[b] : this._defaults[b] },
        _setDateFromField: function(a, b) {
            if (a.input.val() !== a.lastVal) {
                var c = this._get(a, "dateFormat"),
                    f = a.lastVal = a.input ? a.input.val() : null,
                    g = this._getDefaultDate(a),
                    p = g,
                    e = this._getFormatConfig(a);
                try { p = this.parseDate(c, f, e) || g } catch (H) { f = b ? "" : f }
                a.selectedDay = p.getDate();
                a.drawMonth = a.selectedMonth = p.getMonth();
                a.drawYear = a.selectedYear = p.getFullYear();
                a.currentDay = f ? p.getDate() : 0;
                a.currentMonth = f ? p.getMonth() : 0;
                a.currentYear = f ? p.getFullYear() : 0;
                this._adjustInstDate(a)
            }
        },
        _getDefaultDate: function(a) {
            return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date)) },
        _determineDate: function(a, c, d) {
            var f = function(a) {
                    var b = new Date;
                    b.setDate(b.getDate() +
                        a);
                    return b
                },
                g = function(c) {
                    try {
                        return b.datepicker.parseDate(b.datepicker._get(a, "dateFormat"), c, b.datepicker._getFormatConfig(a)) } catch (u) {}
                    for (var d = (c.toLowerCase().match(/^c/) ? b.datepicker._getDate(a) : null) || new Date, f = d.getFullYear(), g = d.getMonth(), d = d.getDate(), p = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, e = p.exec(c); e;) {
                        switch (e[2] || "d") {
                            case "d":
                            case "D":
                                d += parseInt(e[1], 10);
                                break;
                            case "w":
                            case "W":
                                d += 7 * parseInt(e[1], 10);
                                break;
                            case "m":
                            case "M":
                                g += parseInt(e[1], 10);
                                d = Math.min(d, b.datepicker._getDaysInMonth(f,
                                    g));
                                break;
                            case "y":
                            case "Y":
                                f += parseInt(e[1], 10), d = Math.min(d, b.datepicker._getDaysInMonth(f, g))
                        }
                        e = p.exec(c)
                    }
                    return new Date(f, g, d)
                };
            if (c = (c = null == c || "" === c ? d : "string" === typeof c ? g(c) : "number" === typeof c ? isNaN(c) ? d : f(c) : new Date(c.getTime())) && "Invalid Date" === c.toString() ? d : c) c.setHours(0), c.setMinutes(0), c.setSeconds(0), c.setMilliseconds(0);
            return this._daylightSavingAdjust(c)
        },
        _daylightSavingAdjust: function(a) {
            if (!a) return null;
            a.setHours(12 < a.getHours() ? a.getHours() + 2 : 0);
            return a },
        _setDate: function(a,
            b, d) {
            var c = !b,
                g = a.selectedMonth,
                p = a.selectedYear;
            b = this._restrictMinMax(a, this._determineDate(a, b, new Date));
            a.selectedDay = a.currentDay = b.getDate();
            a.drawMonth = a.selectedMonth = a.currentMonth = b.getMonth();
            a.drawYear = a.selectedYear = a.currentYear = b.getFullYear();
            g === a.selectedMonth && p === a.selectedYear || d || this._notifyChange(a);
            this._adjustInstDate(a);
            a.input && a.input.val(c ? "" : this._formatDate(a)) },
        _getDate: function(a) {
            return !a.currentYear || a.input && "" === a.input.val() ? null : this._daylightSavingAdjust(new Date(a.currentYear,
                a.currentMonth, a.currentDay))
        },
        _attachHandlers: function(a) {
            var c = this._get(a, "stepMonths"),
                d = "#" + a.id.replace(/\\\\/g, "\\");
            a.dpDiv.find("[data-handler]").map(function() {
                b(this).bind(this.getAttribute("data-event"), {
                    prev: function() { b.datepicker._adjustDate(d, -c, "M") },
                    next: function() { b.datepicker._adjustDate(d, +c, "M") },
                    hide: function() { b.datepicker._hideDatepicker() },
                    today: function() { b.datepicker._gotoToday(d) },
                    selectDay: function() {
                        b.datepicker._selectDay(d, +this.getAttribute("data-month"), +this.getAttribute("data-year"),
                            this);
                        return !1
                    },
                    selectMonth: function() { b.datepicker._selectMonthYear(d, this, "M");
                        return !1 },
                    selectYear: function() { b.datepicker._selectMonthYear(d, this, "Y");
                        return !1 }
                }[this.getAttribute("data-handler")])
            })
        },
        _generateHTML: function(a) {
            var b, d, f, g, p, e, h, k, l, n, u, x, G, t, y, D, r, q, w, K, C, F, v, z, A, J, L, O = new Date,
                O = this._daylightSavingAdjust(new Date(O.getFullYear(), O.getMonth(), O.getDate())),
                M = this._get(a, "isRTL");
            e = this._get(a, "showButtonPanel");
            f = this._get(a, "hideIfNoPrevNext");
            p = this._get(a, "navigationAsDateFormat");
            var N = this._getNumberOfMonths(a),
                E = this._get(a, "showCurrentAtPos");
            g = this._get(a, "stepMonths");
            var U = 1 !== N[0] || 1 !== N[1],
                V = this._daylightSavingAdjust(a.currentDay ? new Date(a.currentYear, a.currentMonth, a.currentDay) : new Date(9999, 9, 9)),
                S = this._getMinMaxDate(a, "min"),
                P = this._getMinMaxDate(a, "max"),
                E = a.drawMonth - E,
                I = a.drawYear;
            0 > E && (E += 12, I--);
            if (P)
                for (b = this._daylightSavingAdjust(new Date(P.getFullYear(), P.getMonth() - N[0] * N[1] + 1, P.getDate())), b = S && b < S ? S : b; this._daylightSavingAdjust(new Date(I, E, 1)) >
                    b;) E--, 0 > E && (E = 11, I--);
            a.drawMonth = E;
            a.drawYear = I;
            b = this._get(a, "prevText");
            b = p ? this.formatDate(b, this._daylightSavingAdjust(new Date(I, E - g, 1)), this._getFormatConfig(a)) : b;
            b = this._canAdjustMonth(a, -1, I, E) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + b + "'><span class='ui-icon ui-icon-circle-triangle-" + (M ? "e" : "w") + "'>" + b + "</span></a>" : f ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + b + "'><span class='ui-icon ui-icon-circle-triangle-" +
                (M ? "e" : "w") + "'>" + b + "</span></a>";
            d = this._get(a, "nextText");
            d = p ? this.formatDate(d, this._daylightSavingAdjust(new Date(I, E + g, 1)), this._getFormatConfig(a)) : d;
            f = this._canAdjustMonth(a, 1, I, E) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + d + "'><span class='ui-icon ui-icon-circle-triangle-" + (M ? "w" : "e") + "'>" + d + "</span></a>" : f ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + d + "'><span class='ui-icon ui-icon-circle-triangle-" + (M ? "w" :
                "e") + "'>" + d + "</span></a>";
            g = this._get(a, "currentText");
            d = this._get(a, "gotoCurrent") && a.currentDay ? V : O;
            g = p ? this.formatDate(g, d, this._getFormatConfig(a)) : g;
            p = a.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(a, "closeText") + "</button>";
            e = e ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (M ? p : "") + (this._isInRange(a, d) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" +
                g + "</button>" : "") + (M ? "" : p) + "</div>" : "";
            p = parseInt(this._get(a, "firstDay"), 10);
            p = isNaN(p) ? 0 : p;
            g = this._get(a, "showWeek");
            d = this._get(a, "dayNames");
            h = this._get(a, "dayNamesMin");
            k = this._get(a, "monthNames");
            l = this._get(a, "monthNamesShort");
            n = this._get(a, "beforeShowDay");
            u = this._get(a, "showOtherMonths");
            x = this._get(a, "selectOtherMonths");
            G = this._getDefaultDate(a);
            t = "";
            y;
            for (D = 0; D < N[0]; D++) {
                r = "";
                this.maxRows = 4;
                for (q = 0; q < N[1]; q++) {
                    w = this._daylightSavingAdjust(new Date(I, E, a.selectedDay));
                    y = " ui-corner-all";
                    K = "";
                    if (U) { K += "<div class='ui-datepicker-group";
                        if (1 < N[1]) switch (q) {
                            case 0:
                                K += " ui-datepicker-group-first";
                                y = " ui-corner-" + (M ? "right" : "left");
                                break;
                            case N[1] - 1:
                                K += " ui-datepicker-group-last";
                                y = " ui-corner-" + (M ? "left" : "right");
                                break;
                            default:
                                K += " ui-datepicker-group-middle", y = "" }
                        K += "'>" }
                    K += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + y + "'>" + (/all|left/.test(y) && 0 === D ? M ? f : b : "") + (/all|right/.test(y) && 0 === D ? M ? b : f : "") + this._generateMonthYearHeader(a, E, I, S, P, 0 < D || 0 < q, k, l) + "</div><table class='ui-datepicker-calendar'><thead><tr>";
                    C = g ? "<th class='ui-datepicker-week-col'>" + this._get(a, "weekHeader") + "</th>" : "";
                    for (y = 0; 7 > y; y++) F = (y + p) % 7, C += "<th scope='col'" + (5 <= (y + p + 6) % 7 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + d[F] + "'>" + h[F] + "</span></th>";
                    K += C + "</tr></thead><tbody>";
                    C = this._getDaysInMonth(I, E);
                    I === a.selectedYear && E === a.selectedMonth && (a.selectedDay = Math.min(a.selectedDay, C));
                    y = (this._getFirstDayOfMonth(I, E) - p + 7) % 7;
                    C = Math.ceil((y + C) / 7);
                    this.maxRows = C = U ? this.maxRows > C ? this.maxRows : C : C;
                    F = this._daylightSavingAdjust(new Date(I,
                        E, 1 - y));
                    for (v = 0; v < C; v++) {
                        K += "<tr>";
                        z = g ? "<td class='ui-datepicker-week-col'>" + this._get(a, "calculateWeek")(F) + "</td>" : "";
                        for (y = 0; 7 > y; y++) A = n ? n.apply(a.input ? a.input[0] : null, [F]) : [!0, ""], L = (J = F.getMonth() !== E) && !x || !A[0] || S && F < S || P && F > P, z += "<td class='" + (5 <= (y + p + 6) % 7 ? " ui-datepicker-week-end" : "") + (J ? " ui-datepicker-other-month" : "") + (F.getTime() === w.getTime() && E === a.selectedMonth && a._keyEvent || G.getTime() === F.getTime() && G.getTime() === w.getTime() ? " " + this._dayOverClass : "") + (L ? " " + this._unselectableClass +
                            " ui-state-disabled" : "") + (J && !u ? "" : " " + A[1] + (F.getTime() === V.getTime() ? " " + this._currentClass : "") + (F.getTime() === O.getTime() ? " ui-datepicker-today" : "")) + "'" + (J && !u || !A[2] ? "" : " title='" + A[2].replace(/'/g, "&#39;") + "'") + (L ? "" : " data-handler='selectDay' data-event='click' data-month='" + F.getMonth() + "' data-year='" + F.getFullYear() + "'") + ">" + (J && !u ? "&#xa0;" : L ? "<span class='ui-state-default'>" + F.getDate() + "</span>" : "<a class='ui-state-default" + (F.getTime() === O.getTime() ? " ui-state-highlight" : "") + (F.getTime() ===
                            V.getTime() ? " ui-state-active" : "") + (J ? " ui-priority-secondary" : "") + "' href='#'>" + F.getDate() + "</a>") + "</td>", F.setDate(F.getDate() + 1), F = this._daylightSavingAdjust(F);
                        K += z + "</tr>"
                    }
                    E++;
                    11 < E && (E = 0, I++);
                    K += "</tbody></table>" + (U ? "</div>" + (0 < N[0] && q === N[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                    r += K
                }
                t += r
            }
            a._keyEvent = !1;
            return t + e
        },
        _generateMonthYearHeader: function(a, b, d, f, g, p, e, h) {
            var c, k, B, H = this._get(a, "changeMonth"),
                l = this._get(a, "changeYear"),
                n = this._get(a, "showMonthAfterYear"),
                t = "<div class='ui-datepicker-title'>",
                y = "";
            if (p || !H) y += "<span class='ui-datepicker-month'>" + e[b] + "</span>";
            else { e = f && f.getFullYear() === d;
                c = g && g.getFullYear() === d;
                y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
                for (k = 0; 12 > k; k++)(!e || k >= f.getMonth()) && (!c || k <= g.getMonth()) && (y += "<option value='" + k + "'" + (k === b ? " selected='selected'" : "") + ">" + h[k] + "</option>");
                y += "</select>" }
            n || (t += y + (!p && H && l ? "" : "&#xa0;"));
            if (!a.yearshtml)
                if (a.yearshtml = "", p || !l) t += "<span class='ui-datepicker-year'>" + d + "</span>";
                else {
                    h =
                        this._get(a, "yearRange").split(":");
                    B = (new Date).getFullYear();
                    e = function(a) { a = a.match(/c[+\-].*/) ? d + parseInt(a.substring(1), 10) : a.match(/[+\-].*/) ? B + parseInt(a, 10) : parseInt(a, 10);
                        return isNaN(a) ? B : a };
                    b = e(h[0]);
                    h = Math.max(b, e(h[1] || ""));
                    b = f ? Math.max(b, f.getFullYear()) : b;
                    h = g ? Math.min(h, g.getFullYear()) : h;
                    for (a.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; b <= h; b++) a.yearshtml += "<option value='" + b + "'" + (b === d ? " selected='selected'" : "") + ">" + b + "</option>";
                    a.yearshtml += "</select>";
                    t += a.yearshtml;
                    a.yearshtml = null
                }
            t += this._get(a, "yearSuffix");
            n && (t += (!p && H && l ? "" : "&#xa0;") + y);
            return t + "</div>"
        },
        _adjustInstDate: function(a, b, d) {
            var c = a.drawYear + ("Y" === d ? b : 0),
                g = a.drawMonth + ("M" === d ? b : 0);
            b = Math.min(a.selectedDay, this._getDaysInMonth(c, g)) + ("D" === d ? b : 0);
            c = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(c, g, b)));
            a.selectedDay = c.getDate();
            a.drawMonth = a.selectedMonth = c.getMonth();
            a.drawYear = a.selectedYear = c.getFullYear(); "M" !== d && "Y" !== d || this._notifyChange(a) },
        _restrictMinMax: function(a, b) {
            var c = this._getMinMaxDate(a, "min"),
                f = this._getMinMaxDate(a, "max"),
                c = c && b < c ? c : b;
            return f && c > f ? f : c },
        _notifyChange: function(a) {
            var b = this._get(a, "onChangeMonthYear");
            b && b.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a]) },
        _getNumberOfMonths: function(a) { a = this._get(a, "numberOfMonths");
            return null == a ? [1, 1] : "number" === typeof a ? [1, a] : a },
        _getMinMaxDate: function(a, b) {
            return this._determineDate(a, this._get(a, b + "Date"), null) },
        _getDaysInMonth: function(a, b) {
            return 32 -
                this._daylightSavingAdjust(new Date(a, b, 32)).getDate()
        },
        _getFirstDayOfMonth: function(a, b) {
            return (new Date(a, b, 1)).getDay() },
        _canAdjustMonth: function(a, b, d, f) {
            var c = this._getNumberOfMonths(a);
            d = this._daylightSavingAdjust(new Date(d, f + (0 > b ? b : c[0] * c[1]), 1));
            0 > b && d.setDate(this._getDaysInMonth(d.getFullYear(), d.getMonth()));
            return this._isInRange(a, d) },
        _isInRange: function(a, b) {
            var c, f, g = this._getMinMaxDate(a, "min"),
                p = this._getMinMaxDate(a, "max"),
                e = null,
                h = null;
            if (c = this._get(a, "yearRange")) c = c.split(":"),
                f = (new Date).getFullYear(), e = parseInt(c[0], 10), h = parseInt(c[1], 10), c[0].match(/[+\-].*/) && (e += f), c[1].match(/[+\-].*/) && (h += f);
            return (!g || b.getTime() >= g.getTime()) && (!p || b.getTime() <= p.getTime()) && (!e || b.getFullYear() >= e) && (!h || b.getFullYear() <= h)
        },
        _getFormatConfig: function(a) {
            var b = this._get(a, "shortYearCutoff"),
                b = "string" !== typeof b ? b : (new Date).getFullYear() % 100 + parseInt(b, 10);
            return {
                shortYearCutoff: b,
                dayNamesShort: this._get(a, "dayNamesShort"),
                dayNames: this._get(a, "dayNames"),
                monthNamesShort: this._get(a,
                    "monthNamesShort"),
                monthNames: this._get(a, "monthNames")
            }
        },
        _formatDate: function(a, b, d, f) { b || (a.currentDay = a.selectedDay, a.currentMonth = a.selectedMonth, a.currentYear = a.selectedYear);
            b = b ? "object" === typeof b ? b : this._daylightSavingAdjust(new Date(f, d, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
            return this.formatDate(this._get(a, "dateFormat"), b, this._getFormatConfig(a)) }
    });
    b.fn.datepicker = function(a) {
        if (!this.length) return this;
        b.datepicker.initialized || (b(document).mousedown(b.datepicker._checkExternalClick),
            b.datepicker.initialized = !0);
        0 === b("#" + b.datepicker._mainDivId).length && b("body").append(b.datepicker.dpDiv);
        var c = Array.prototype.slice.call(arguments, 1);
        return "string" === typeof a && ("isDisabled" === a || "getDate" === a || "widget" === a) || "option" === a && 2 === arguments.length && "string" === typeof arguments[1] ? b.datepicker["_" + a + "Datepicker"].apply(b.datepicker, [this[0]].concat(c)) : this.each(function() {
            "string" === typeof a ? b.datepicker["_" + a + "Datepicker"].apply(b.datepicker, [this].concat(c)) : b.datepicker._attachDatepicker(this,
                a)
        })
    };
    b.datepicker = new h;
    b.datepicker.initialized = !1;
    b.datepicker.uuid = (new Date).getTime();
    b.datepicker.version = "1.11.2";
    b.widget("ui.draggable", b.ui.mouse, {
        version: "1.11.2",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() { "original" === this.options.helper && this._setPositionRelative();
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._setHandleClassName();
            this._mouseInit() },
        _setOption: function(a, b) { this._super(a, b); "handle" === a && (this._removeHandleClassName(), this._setHandleClassName()) },
        _destroy: function() {
            (this.helper || this.element).is(".ui-draggable-dragging") ?
                this.destroyOnClear = !0 : (this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._removeHandleClassName(), this._mouseDestroy())
        },
        _mouseCapture: function(a) {
            var c = this.options;
            this._blurActiveElement(a);
            if (this.helper || c.disabled || 0 < b(a.target).closest(".ui-resizable-handle").length) return !1;
            this.handle = this._getHandle(a);
            if (!this.handle) return !1;
            this._blockFrames(!0 === c.iframeFix ? "iframe" : c.iframeFix);
            return !0 },
        _blockFrames: function(a) {
            this.iframeBlocks = this.document.find(a).map(function() {
                var a =
                    b(this);
                return b("<div>").css("position", "absolute").appendTo(a.parent()).outerWidth(a.outerWidth()).outerHeight(a.outerHeight()).offset(a.offset())[0]
            })
        },
        _unblockFrames: function() { this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks) },
        _blurActiveElement: function(a) {
            var c = this.document[0];
            if (this.handleElement.is(a.target)) try { c.activeElement && "body" !== c.activeElement.nodeName.toLowerCase() && b(c.activeElement).blur() } catch (d) {} },
        _mouseStart: function(a) {
            var c = this.options;
            this.helper =
                this._createHelper(a);
            this.helper.addClass("ui-draggable-dragging");
            this._cacheHelperProportions();
            b.ui.ddmanager && (b.ui.ddmanager.current = this);
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent(!0);
            this.offsetParent = this.helper.offsetParent();
            this.hasFixedAncestor = 0 < this.helper.parents().filter(function() {
                return "fixed" === b(this).css("position") }).length;
            this.positionAbs = this.element.offset();
            this._refreshOffsets(a);
            this.originalPosition =
                this.position = this._generatePosition(a, !1);
            this.originalPageX = a.pageX;
            this.originalPageY = a.pageY;
            c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt);
            this._setContainment();
            if (!1 === this._trigger("start", a)) return this._clear(), !1;
            this._cacheHelperProportions();
            b.ui.ddmanager && !c.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, a);
            this._normalizeRightBottom();
            this._mouseDrag(a, !0);
            b.ui.ddmanager && b.ui.ddmanager.dragStart(this, a);
            return !0
        },
        _refreshOffsets: function(a) {
            this.offset = {
                top: this.positionAbs.top -
                    this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            };
            this.offset.click = { left: a.pageX - this.offset.left, top: a.pageY - this.offset.top }
        },
        _mouseDrag: function(a, c) {
            this.hasFixedAncestor && (this.offset.parent = this._getParentOffset());
            this.position = this._generatePosition(a, !0);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!c) {
                var d = this._uiHash();
                if (!1 === this._trigger("drag", a, d)) return this._mouseUp({}), !1;
                this.position =
                    d.position
            }
            this.helper[0].style.left = this.position.left + "px";
            this.helper[0].style.top = this.position.top + "px";
            b.ui.ddmanager && b.ui.ddmanager.drag(this, a);
            return !1
        },
        _mouseStop: function(a) {
            var c = this,
                d = !1;
            b.ui.ddmanager && !this.options.dropBehaviour && (d = b.ui.ddmanager.drop(this, a));
            this.dropped && (d = this.dropped, this.dropped = !1);
            "invalid" === this.options.revert && !d || "valid" === this.options.revert && d || !0 === this.options.revert || b.isFunction(this.options.revert) && this.options.revert.call(this.element, d) ? b(this.helper).animate(this.originalPosition,
                parseInt(this.options.revertDuration, 10),
                function() {!1 !== c._trigger("stop", a) && c._clear() }) : !1 !== this._trigger("stop", a) && this._clear();
            return !1
        },
        _mouseUp: function(a) { this._unblockFrames();
            b.ui.ddmanager && b.ui.ddmanager.dragStop(this, a);
            this.handleElement.is(a.target) && this.element.focus();
            return b.ui.mouse.prototype._mouseUp.call(this, a) },
        cancel: function() { this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this },
        _getHandle: function(a) {
            return this.options.handle ? !!b(a.target).closest(this.element.find(this.options.handle)).length :
                !0
        },
        _setHandleClassName: function() { this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element;
            this.handleElement.addClass("ui-draggable-handle") },
        _removeHandleClassName: function() { this.handleElement.removeClass("ui-draggable-handle") },
        _createHelper: function(a) {
            var c = this.options,
                d = b.isFunction(c.helper);
            a = d ? b(c.helper.apply(this.element[0], [a])) : "clone" === c.helper ? this.element.clone().removeAttr("id") : this.element;
            a.parents("body").length || a.appendTo("parent" === c.appendTo ?
                this.element[0].parentNode : c.appendTo);
            d && a[0] === this.element[0] && this._setPositionRelative();
            a[0] === this.element[0] || /(fixed|absolute)/.test(a.css("position")) || a.css("position", "absolute");
            return a
        },
        _setPositionRelative: function() { /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative") },
        _adjustOffsetFromHelper: function(a) {
            "string" === typeof a && (a = a.split(" "));
            b.isArray(a) && (a = { left: +a[0], top: +a[1] || 0 });
            "left" in a && (this.offset.click.left = a.left + this.margins.left);
            "right" in a && (this.offset.click.left = this.helperProportions.width - a.right + this.margins.left);
            "top" in a && (this.offset.click.top = a.top + this.margins.top);
            "bottom" in a && (this.offset.click.top = this.helperProportions.height - a.bottom + this.margins.top)
        },
        _isRootNode: function(a) {
            return /(html|body)/i.test(a.tagName) || a === this.document[0] },
        _getParentOffset: function() {
            var a = this.offsetParent.offset(),
                c = this.document[0];
            "absolute" === this.cssPosition && this.scrollParent[0] !== c && b.contains(this.scrollParent[0], this.offsetParent[0]) &&
                (a.left += this.scrollParent.scrollLeft(), a.top += this.scrollParent.scrollTop());
            this._isRootNode(this.offsetParent[0]) && (a = { top: 0, left: 0 });
            return { top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0) }
        },
        _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition) return { top: 0, left: 0 };
            var a = this.element.position(),
                b = this._isRootNode(this.scrollParent[0]);
            return {
                top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + (b ?
                    0 : this.scrollParent.scrollTop()),
                left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + (b ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function() { this.margins = { left: parseInt(this.element.css("marginLeft"), 10) || 0, top: parseInt(this.element.css("marginTop"), 10) || 0, right: parseInt(this.element.css("marginRight"), 10) || 0, bottom: parseInt(this.element.css("marginBottom"), 10) || 0 } },
        _cacheHelperProportions: function() { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() } },
        _setContainment: function() {
            var a, c, d;
            a = this.options;
            c = this.document[0];
            this.relativeContainer = null;
            if (a.containment)
                if ("window" === a.containment) this.containment = [b(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, b(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, b(window).scrollLeft() + b(window).width() - this.helperProportions.width - this.margins.left, b(window).scrollTop() + (b(window).height() || c.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
                else if ("document" === a.containment) this.containment = [0, 0, b(c).width() - this.helperProportions.width - this.margins.left, (b(c).height() || c.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            else if (a.containment.constructor === Array) this.containment = a.containment;
            else {
                if ("parent" === a.containment && (a.containment = this.helper[0].parentNode), c = b(a.containment), d = c[0]) a = /(scroll|auto)/.test(c.css("overflow")), this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"),
                        10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (a ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (a ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom],
                    this.relativeContainer = c
            } else this.containment = null
        },
        _convertPositionTo: function(a, b) { b || (b = this.position);
            var c = "absolute" === a ? 1 : -1,
                f = this._isRootNode(this.scrollParent[0]);
            return { top: b.top + this.offset.relative.top * c + this.offset.parent.top * c - ("fixed" === this.cssPosition ? -this.offset.scroll.top : f ? 0 : this.offset.scroll.top) * c, left: b.left + this.offset.relative.left * c + this.offset.parent.left * c - ("fixed" === this.cssPosition ? -this.offset.scroll.left : f ? 0 : this.offset.scroll.left) * c } },
        _generatePosition: function(a,
            b) {
            var c, f, g, e = this.options,
                h = this._isRootNode(this.scrollParent[0]);
            g = a.pageX;
            f = a.pageY;
            h && this.offset.scroll || (this.offset.scroll = { top: this.scrollParent.scrollTop(), left: this.scrollParent.scrollLeft() });
            b && (this.containment && (this.relativeContainer ? (c = this.relativeContainer.offset(), c = [this.containment[0] + c.left, this.containment[1] + c.top, this.containment[2] + c.left, this.containment[3] + c.top]) : c = this.containment, a.pageX - this.offset.click.left < c[0] && (g = c[0] + this.offset.click.left), a.pageY - this.offset.click.top <
                c[1] && (f = c[1] + this.offset.click.top), a.pageX - this.offset.click.left > c[2] && (g = c[2] + this.offset.click.left), a.pageY - this.offset.click.top > c[3] && (f = c[3] + this.offset.click.top)), e.grid && (f = e.grid[1] ? this.originalPageY + Math.round((f - this.originalPageY) / e.grid[1]) * e.grid[1] : this.originalPageY, f = c ? f - this.offset.click.top >= c[1] || f - this.offset.click.top > c[3] ? f : f - this.offset.click.top >= c[1] ? f - e.grid[1] : f + e.grid[1] : f, g = e.grid[0] ? this.originalPageX + Math.round((g - this.originalPageX) / e.grid[0]) * e.grid[0] : this.originalPageX,
                g = c ? g - this.offset.click.left >= c[0] || g - this.offset.click.left > c[2] ? g : g - this.offset.click.left >= c[0] ? g - e.grid[0] : g + e.grid[0] : g), "y" === e.axis && (g = this.originalPageX), "x" === e.axis && (f = this.originalPageY));
            return {
                top: f - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : h ? 0 : this.offset.scroll.top),
                left: g - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : h ? 0 :
                    this.offset.scroll.left)
            }
        },
        _clear: function() { this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = !1;
            this.destroyOnClear && this.destroy() },
        _normalizeRightBottom: function() {
            "y" !== this.options.axis && "auto" !== this.helper.css("right") && (this.helper.width(this.helper.width()), this.helper.css("right", "auto"));
            "x" !== this.options.axis && "auto" !== this.helper.css("bottom") && (this.helper.height(this.helper.height()),
                this.helper.css("bottom", "auto"))
        },
        _trigger: function(a, c, d) { d = d || this._uiHash();
            b.ui.plugin.call(this, a, [c, d, this], !0); /^(drag|start|stop)/.test(a) && (this.positionAbs = this._convertPositionTo("absolute"), d.offset = this.positionAbs);
            return b.Widget.prototype._trigger.call(this, a, c, d) },
        plugins: {},
        _uiHash: function() {
            return { helper: this.helper, position: this.position, originalPosition: this.originalPosition, offset: this.positionAbs } }
    });
    b.ui.plugin.add("draggable", "connectToSortable", {
        start: function(a, c, d) {
            var f =
                b.extend({}, c, { item: d.element });
            d.sortables = [];
            b(d.options.connectToSortable).each(function() {
                var c = b(this).sortable("instance");
                c && !c.options.disabled && (d.sortables.push(c), c.refreshPositions(), c._trigger("activate", a, f)) })
        },
        stop: function(a, c, d) {
            var f = b.extend({}, c, { item: d.element });
            d.cancelHelperRemoval = !1;
            b.each(d.sortables, function() {
                this.isOver ? (this.isOver = 0, d.cancelHelperRemoval = !0, this.cancelHelperRemoval = !1, this._storedCSS = {
                    position: this.placeholder.css("position"),
                    top: this.placeholder.css("top"),
                    left: this.placeholder.css("left")
                }, this._mouseStop(a), this.options.helper = this.options._helper) : (this.cancelHelperRemoval = !0, this._trigger("deactivate", a, f))
            })
        },
        drag: function(a, c, d) {
            b.each(d.sortables, function() {
                var f = !1,
                    g = this;
                g.positionAbs = d.positionAbs;
                g.helperProportions = d.helperProportions;
                g.offset.click = d.offset.click;
                g._intersectsWith(g.containerCache) && (f = !0, b.each(d.sortables, function() {
                    this.positionAbs = d.positionAbs;
                    this.helperProportions = d.helperProportions;
                    this.offset.click = d.offset.click;
                    this !== g && this._intersectsWith(this.containerCache) && b.contains(g.element[0], this.element[0]) && (f = !1);
                    return f
                }));
                f ? (g.isOver || (g.isOver = 1, g.currentItem = c.helper.appendTo(g.element).data("ui-sortable-item", !0), g.options._helper = g.options.helper, g.options.helper = function() {
                        return c.helper[0] }, a.target = g.currentItem[0], g._mouseCapture(a, !0), g._mouseStart(a, !0, !0), g.offset.click.top = d.offset.click.top, g.offset.click.left = d.offset.click.left, g.offset.parent.left -= d.offset.parent.left - g.offset.parent.left,
                    g.offset.parent.top -= d.offset.parent.top - g.offset.parent.top, d._trigger("toSortable", a), d.dropped = g.element, b.each(d.sortables, function() { this.refreshPositions() }), d.currentItem = d.element, g.fromOutside = d), g.currentItem && (g._mouseDrag(a), c.position = g.position)) : g.isOver && (g.isOver = 0, g.cancelHelperRemoval = !0, g.options._revert = g.options.revert, g.options.revert = !1, g._trigger("out", a, g._uiHash(g)), g._mouseStop(a, !0), g.options.revert = g.options._revert, g.options.helper = g.options._helper, g.placeholder && g.placeholder.remove(),
                    d._refreshOffsets(a), c.position = d._generatePosition(a, !0), d._trigger("fromSortable", a), d.dropped = !1, b.each(d.sortables, function() { this.refreshPositions() }))
            })
        }
    });
    b.ui.plugin.add("draggable", "cursor", { start: function(a, c, d) { a = b("body");
            d = d.options;
            a.css("cursor") && (d._cursor = a.css("cursor"));
            a.css("cursor", d.cursor) }, stop: function(a, c, d) { a = d.options;
            a._cursor && b("body").css("cursor", a._cursor) } });
    b.ui.plugin.add("draggable", "opacity", {
        start: function(a, c, d) {
            a = b(c.helper);
            d = d.options;
            a.css("opacity") &&
                (d._opacity = a.css("opacity"));
            a.css("opacity", d.opacity)
        },
        stop: function(a, c, d) { a = d.options;
            a._opacity && b(c.helper).css("opacity", a._opacity) }
    });
    b.ui.plugin.add("draggable", "scroll", {
        start: function(a, b, d) { d.scrollParentNotHidden || (d.scrollParentNotHidden = d.helper.scrollParent(!1));
            d.scrollParentNotHidden[0] !== d.document[0] && "HTML" !== d.scrollParentNotHidden[0].tagName && (d.overflowOffset = d.scrollParentNotHidden.offset()) },
        drag: function(a, c, d) {
            c = d.options;
            var f = !1,
                g = d.scrollParentNotHidden[0],
                e = d.document[0];
            g !== e && "HTML" !== g.tagName ? (c.axis && "x" === c.axis || (d.overflowOffset.top + g.offsetHeight - a.pageY < c.scrollSensitivity ? g.scrollTop = f = g.scrollTop + c.scrollSpeed : a.pageY - d.overflowOffset.top < c.scrollSensitivity && (g.scrollTop = f = g.scrollTop - c.scrollSpeed)), c.axis && "y" === c.axis || (d.overflowOffset.left + g.offsetWidth - a.pageX < c.scrollSensitivity ? g.scrollLeft = f = g.scrollLeft + c.scrollSpeed : a.pageX - d.overflowOffset.left < c.scrollSensitivity && (g.scrollLeft = f = g.scrollLeft - c.scrollSpeed))) : (c.axis && "x" === c.axis || (a.pageY -
                b(e).scrollTop() < c.scrollSensitivity ? f = b(e).scrollTop(b(e).scrollTop() - c.scrollSpeed) : b(window).height() - (a.pageY - b(e).scrollTop()) < c.scrollSensitivity && (f = b(e).scrollTop(b(e).scrollTop() + c.scrollSpeed))), c.axis && "y" === c.axis || (a.pageX - b(e).scrollLeft() < c.scrollSensitivity ? f = b(e).scrollLeft(b(e).scrollLeft() - c.scrollSpeed) : b(window).width() - (a.pageX - b(e).scrollLeft()) < c.scrollSensitivity && (f = b(e).scrollLeft(b(e).scrollLeft() + c.scrollSpeed))));
            !1 !== f && b.ui.ddmanager && !c.dropBehaviour && b.ui.ddmanager.prepareOffsets(d,
                a)
        }
    });
    b.ui.plugin.add("draggable", "snap", {
        start: function(a, c, d) { a = d.options;
            d.snapElements = [];
            b(a.snap.constructor !== String ? a.snap.items || ":data(ui-draggable)" : a.snap).each(function() {
                var a = b(this),
                    c = a.offset();
                this !== d.element[0] && d.snapElements.push({ item: this, width: a.outerWidth(), height: a.outerHeight(), top: c.top, left: c.left }) }) },
        drag: function(a, c, d) {
            var f, g, e, h, k, m, l, n, u, x, r = d.options,
                t = r.snapTolerance,
                y = c.offset.left,
                D = y + d.helperProportions.width,
                q = c.offset.top,
                w = q + d.helperProportions.height;
            for (u = d.snapElements.length - 1; 0 <= u; u--) k = d.snapElements[u].left - d.margins.left, m = k + d.snapElements[u].width, l = d.snapElements[u].top - d.margins.top, n = l + d.snapElements[u].height, D < k - t || y > m + t || w < l - t || q > n + t || !b.contains(d.snapElements[u].item.ownerDocument, d.snapElements[u].item) ? (d.snapElements[u].snapping && d.options.snap.release && d.options.snap.release.call(d.element, a, b.extend(d._uiHash(), { snapItem: d.snapElements[u].item })), d.snapElements[u].snapping = !1) : ("inner" !== r.snapMode && (f = Math.abs(l - w) <= t, g =
                    Math.abs(n - q) <= t, e = Math.abs(k - D) <= t, h = Math.abs(m - y) <= t, f && (c.position.top = d._convertPositionTo("relative", { top: l - d.helperProportions.height, left: 0 }).top), g && (c.position.top = d._convertPositionTo("relative", { top: n, left: 0 }).top), e && (c.position.left = d._convertPositionTo("relative", { top: 0, left: k - d.helperProportions.width }).left), h && (c.position.left = d._convertPositionTo("relative", { top: 0, left: m }).left)), x = f || g || e || h, "outer" !== r.snapMode && (f = Math.abs(l - q) <= t, g = Math.abs(n - w) <= t, e = Math.abs(k - y) <= t, h = Math.abs(m -
                    D) <= t, f && (c.position.top = d._convertPositionTo("relative", { top: l, left: 0 }).top), g && (c.position.top = d._convertPositionTo("relative", { top: n - d.helperProportions.height, left: 0 }).top), e && (c.position.left = d._convertPositionTo("relative", { top: 0, left: k }).left), h && (c.position.left = d._convertPositionTo("relative", { top: 0, left: m - d.helperProportions.width }).left)), !d.snapElements[u].snapping && (f || g || e || h || x) && d.options.snap.snap && d.options.snap.snap.call(d.element, a, b.extend(d._uiHash(), { snapItem: d.snapElements[u].item })),
                d.snapElements[u].snapping = f || g || e || h || x)
        }
    });
    b.ui.plugin.add("draggable", "stack", { start: function(a, c, d) {
            var f;
            a = b.makeArray(b(d.options.stack)).sort(function(a, c) {
                return (parseInt(b(a).css("zIndex"), 10) || 0) - (parseInt(b(c).css("zIndex"), 10) || 0) });
            a.length && (f = parseInt(b(a[0]).css("zIndex"), 10) || 0, b(a).each(function(a) { b(this).css("zIndex", f + a) }), this.css("zIndex", f + a.length)) } });
    b.ui.plugin.add("draggable", "zIndex", {
        start: function(a, c, d) {
            a = b(c.helper);
            d = d.options;
            a.css("zIndex") && (d._zIndex = a.css("zIndex"));
            a.css("zIndex", d.zIndex)
        },
        stop: function(a, c, d) { a = d.options;
            a._zIndex && b(c.helper).css("zIndex", a._zIndex) }
    });
    b.widget("ui.resizable", b.ui.mouse, {
        version: "1.11.2",
        widgetEventPrefix: "resize",
        options: { alsoResize: !1, animate: !1, animateDuration: "slow", animateEasing: "swing", aspectRatio: !1, autoHide: !1, containment: !1, ghost: !1, grid: !1, handles: "e,s,se", helper: !1, maxHeight: null, maxWidth: null, minHeight: 10, minWidth: 10, zIndex: 90, resize: null, start: null, stop: null },
        _num: function(a) {
            return parseInt(a, 10) || 0 },
        _isNumber: function(a) {
            return !isNaN(parseInt(a,
                10))
        },
        _hasScroll: function(a, c) {
            if ("hidden" === b(a).css("overflow")) return !1;
            var d = c && "left" === c ? "scrollLeft" : "scrollTop",
                f;
            if (0 < a[d]) return !0;
            a[d] = 1;
            f = 0 < a[d];
            a[d] = 0;
            return f },
        _create: function() {
            var a, c, d, f, g, e = this,
                h = this.options;
            this.element.addClass("ui-resizable");
            b.extend(this, { _aspectRatio: !!h.aspectRatio, aspectRatio: h.aspectRatio, originalElement: this.element, _proportionallyResizeElements: [], _helper: h.helper || h.ghost || h.animate ? h.helper || "ui-resizable-helper" : null });
            this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) &&
                (this.element.wrap(b("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({ position: this.element.css("position"), width: this.element.outerWidth(), height: this.element.outerHeight(), top: this.element.css("top"), left: this.element.css("left") })), this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")), this.elementIsWrapper = !0, this.element.css({
                    marginLeft: this.originalElement.css("marginLeft"),
                    marginTop: this.originalElement.css("marginTop"),
                    marginRight: this.originalElement.css("marginRight"),
                    marginBottom: this.originalElement.css("marginBottom")
                }), this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0 }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" })), this.originalElement.css({ margin: this.originalElement.css("margin") }), this._proportionallyResize());
            this.handles = h.handles || (b(".ui-resizable-handle", this.element).length ? { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw" } : "e,s,se");
            if (this.handles.constructor === String)
                for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), a = this.handles.split(","), this.handles = {}, c = 0; c < a.length; c++) d = b.trim(a[c]), g = "ui-resizable-" + d, f = b("<div class='ui-resizable-handle " + g + "'></div>"), f.css({ zIndex: h.zIndex }), "se" === d && f.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),
                    this.handles[d] = ".ui-resizable-" + d, this.element.append(f);
            this._renderAxis = function(a) {
                var c, d, f;
                a = a || this.element;
                for (c in this.handles) this.handles[c].constructor === String && (this.handles[c] = this.element.children(this.handles[c]).first().show()), this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i) && (d = b(this.handles[c], this.element), f = /sw|ne|nw|se|n|s/.test(c) ? d.outerHeight() : d.outerWidth(), d = ["padding", /ne|nw|n/.test(c) ? "Top" : /se|sw|s/.test(c) ? "Bottom" :
                    /^e$/.test(c) ? "Right" : "Left"
                ].join(""), a.css(d, f), this._proportionallyResize()), b(this.handles[c])
            };
            this._renderAxis(this.element);
            this._handles = b(".ui-resizable-handle", this.element).disableSelection();
            this._handles.mouseover(function() { e.resizing || (this.className && (f = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), e.axis = f && f[1] ? f[1] : "se") });
            h.autoHide && (this._handles.hide(), b(this.element).addClass("ui-resizable-autohide").mouseenter(function() {
                h.disabled || (b(this).removeClass("ui-resizable-autohide"),
                    e._handles.show())
            }).mouseleave(function() { h.disabled || e.resizing || (b(this).addClass("ui-resizable-autohide"), e._handles.hide()) }));
            this._mouseInit()
        },
        _destroy: function() {
            this._mouseDestroy();
            var a, c = function(a) { b(a).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove() };
            this.elementIsWrapper && (c(this.element), a = this.element, this.originalElement.css({
                position: a.css("position"),
                width: a.outerWidth(),
                height: a.outerHeight(),
                top: a.css("top"),
                left: a.css("left")
            }).insertAfter(a), a.remove());
            this.originalElement.css("resize", this.originalResizeStyle);
            c(this.originalElement);
            return this
        },
        _mouseCapture: function(a) {
            var c, d, f = !1;
            for (c in this.handles)
                if (d = b(this.handles[c])[0], d === a.target || b.contains(d, a.target)) f = !0;
            return !this.options.disabled && f },
        _mouseStart: function(a) {
            var c, d, f = this.options,
                g = this.element;
            this.resizing = !0;
            this._renderProxy();
            c = this._num(this.helper.css("left"));
            d = this._num(this.helper.css("top"));
            f.containment && (c += b(f.containment).scrollLeft() || 0, d += b(f.containment).scrollTop() || 0);
            this.offset = this.helper.offset();
            this.position = { left: c, top: d };
            this.size = this._helper ? { width: this.helper.width(), height: this.helper.height() } : { width: g.width(), height: g.height() };
            this.originalSize = this._helper ? { width: g.outerWidth(), height: g.outerHeight() } : { width: g.width(), height: g.height() };
            this.sizeDiff = { width: g.outerWidth() - g.width(), height: g.outerHeight() - g.height() };
            this.originalPosition = { left: c, top: d };
            this.originalMousePosition = { left: a.pageX, top: a.pageY };
            this.aspectRatio = "number" === typeof f.aspectRatio ? f.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
            c = b(".ui-resizable-" + this.axis).css("cursor");
            b("body").css("cursor", "auto" === c ? this.axis + "-resize" : c);
            g.addClass("ui-resizable-resizing");
            this._propagate("start", a);
            return !0
        },
        _mouseDrag: function(a) {
            var c, d = this.originalMousePosition;
            c = a.pageX - d.left || 0;
            var d = a.pageY - d.top || 0,
                f = this._change[this.axis];
            this._updatePrevProperties();
            if (!f) return !1;
            c = f.apply(this, [a, c, d]);
            this._updateVirtualBoundaries(a.shiftKey);
            if (this._aspectRatio || a.shiftKey) c = this._updateRatio(c, a);
            c = this._respectSize(c, a);
            this._updateCache(c);
            this._propagate("resize", a);
            c = this._applyChanges();
            !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize();
            b.isEmptyObject(c) || (this._updatePrevProperties(), this._trigger("resize", a, this.ui()), this._applyChanges());
            return !1
        },
        _mouseStop: function(a) {
            this.resizing = !1;
            var c, d, f, g = this.options;
            this._helper && (c = this._proportionallyResizeElements, c = (d = c.length && /textarea/i.test(c[0].nodeName)) && this._hasScroll(c[0], "left") ? 0 : this.sizeDiff.height, d = d ? 0 : this.sizeDiff.width, d = { width: this.helper.width() - d, height: this.helper.height() - c }, c = parseInt(this.element.css("left"), 10) + (this.position.left - this.originalPosition.left) || null, f = parseInt(this.element.css("top"), 10) + (this.position.top - this.originalPosition.top) || null, g.animate || this.element.css(b.extend(d, { top: f, left: c })), this.helper.height(this.size.height),
                this.helper.width(this.size.width), this._helper && !g.animate && this._proportionallyResize());
            b("body").css("cursor", "auto");
            this.element.removeClass("ui-resizable-resizing");
            this._propagate("stop", a);
            this._helper && this.helper.remove();
            return !1
        },
        _updatePrevProperties: function() { this.prevPosition = { top: this.position.top, left: this.position.left };
            this.prevSize = { width: this.size.width, height: this.size.height } },
        _applyChanges: function() {
            var a = {};
            this.position.top !== this.prevPosition.top && (a.top = this.position.top +
                "px");
            this.position.left !== this.prevPosition.left && (a.left = this.position.left + "px");
            this.size.width !== this.prevSize.width && (a.width = this.size.width + "px");
            this.size.height !== this.prevSize.height && (a.height = this.size.height + "px");
            this.helper.css(a);
            return a
        },
        _updateVirtualBoundaries: function(a) {
            var b, d, f, g;
            g = this.options;
            g = {
                minWidth: this._isNumber(g.minWidth) ? g.minWidth : 0,
                maxWidth: this._isNumber(g.maxWidth) ? g.maxWidth : Infinity,
                minHeight: this._isNumber(g.minHeight) ? g.minHeight : 0,
                maxHeight: this._isNumber(g.maxHeight) ?
                    g.maxHeight : Infinity
            };
            if (this._aspectRatio || a) a = g.minHeight * this.aspectRatio, d = g.minWidth / this.aspectRatio, b = g.maxHeight * this.aspectRatio, f = g.maxWidth / this.aspectRatio, a > g.minWidth && (g.minWidth = a), d > g.minHeight && (g.minHeight = d), b < g.maxWidth && (g.maxWidth = b), f < g.maxHeight && (g.maxHeight = f);
            this._vBoundaries = g
        },
        _updateCache: function(a) {
            this.offset = this.helper.offset();
            this._isNumber(a.left) && (this.position.left = a.left);
            this._isNumber(a.top) && (this.position.top = a.top);
            this._isNumber(a.height) && (this.size.height =
                a.height);
            this._isNumber(a.width) && (this.size.width = a.width)
        },
        _updateRatio: function(a) {
            var b = this.position,
                d = this.size,
                f = this.axis;
            this._isNumber(a.height) ? a.width = a.height * this.aspectRatio : this._isNumber(a.width) && (a.height = a.width / this.aspectRatio); "sw" === f && (a.left = b.left + (d.width - a.width), a.top = null); "nw" === f && (a.top = b.top + (d.height - a.height), a.left = b.left + (d.width - a.width));
            return a },
        _respectSize: function(a) {
            var b = this._vBoundaries,
                d = this.axis,
                f = this._isNumber(a.width) && b.maxWidth && b.maxWidth <
                a.width,
                g = this._isNumber(a.height) && b.maxHeight && b.maxHeight < a.height,
                e = this._isNumber(a.width) && b.minWidth && b.minWidth > a.width,
                h = this._isNumber(a.height) && b.minHeight && b.minHeight > a.height,
                k = this.originalPosition.left + this.originalSize.width,
                m = this.position.top + this.size.height,
                l = /sw|nw|w/.test(d),
                d = /nw|ne|n/.test(d);
            e && (a.width = b.minWidth);
            h && (a.height = b.minHeight);
            f && (a.width = b.maxWidth);
            g && (a.height = b.maxHeight);
            e && l && (a.left = k - b.minWidth);
            f && l && (a.left = k - b.maxWidth);
            h && d && (a.top = m - b.minHeight);
            g && d && (a.top = m - b.maxHeight);
            a.width || a.height || a.left || !a.top ? a.width || a.height || a.top || !a.left || (a.left = null) : a.top = null;
            return a
        },
        _getPaddingPlusBorderDimensions: function(a) {
            var b = 0,
                d = [],
                f = [a.css("borderTopWidth"), a.css("borderRightWidth"), a.css("borderBottomWidth"), a.css("borderLeftWidth")];
            for (a = [a.css("paddingTop"), a.css("paddingRight"), a.css("paddingBottom"), a.css("paddingLeft")]; 4 > b; b++) d[b] = parseInt(f[b], 10) || 0, d[b] += parseInt(a[b], 10) || 0;
            return { height: d[0] + d[2], width: d[1] + d[3] } },
        _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length)
                for (var a,
                        b = 0, d = this.helper || this.element; b < this._proportionallyResizeElements.length; b++) a = this._proportionallyResizeElements[b], this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(a)), a.css({ height: d.height() - this.outerDimensions.height || 0, width: d.width() - this.outerDimensions.width || 0 })
        },
        _renderProxy: function() {
            var a = this.options;
            this.elementOffset = this.element.offset();
            this._helper ? (this.helper = this.helper || b("<div style='overflow:hidden;'></div>"), this.helper.addClass(this._helper).css({
                width: this.element.outerWidth() -
                    1,
                height: this.element.outerHeight() - 1,
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++a.zIndex
            }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element
        },
        _change: {
            e: function(a, b) {
                return { width: this.originalSize.width + b } },
            w: function(a, b) {
                return { left: this.originalPosition.left + b, width: this.originalSize.width - b } },
            n: function(a, b, d) {
                return { top: this.originalPosition.top + d, height: this.originalSize.height - d } },
            s: function(a, b, d) {
                return {
                    height: this.originalSize.height +
                        d
                }
            },
            se: function(a, c, d) {
                return b.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [a, c, d])) },
            sw: function(a, c, d) {
                return b.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [a, c, d])) },
            ne: function(a, c, d) {
                return b.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [a, c, d])) },
            nw: function(a, c, d) {
                return b.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [a, c, d])) }
        },
        _propagate: function(a, c) {
            b.ui.plugin.call(this, a, [c, this.ui()]);
            "resize" !== a && this._trigger(a, c, this.ui())
        },
        plugins: {},
        ui: function() {
            return { originalElement: this.originalElement, element: this.element, helper: this.helper, position: this.position, size: this.size, originalSize: this.originalSize, originalPosition: this.originalPosition } }
    });
    b.ui.plugin.add("resizable", "animate", {
        stop: function(a) {
            var c = b(this).resizable("instance"),
                d = c.options,
                f = c._proportionallyResizeElements,
                g = f.length && /textarea/i.test(f[0].nodeName),
                e = g && c._hasScroll(f[0], "left") ? 0 : c.sizeDiff.height,
                g = {
                    width: c.size.width -
                        (g ? 0 : c.sizeDiff.width),
                    height: c.size.height - e
                },
                e = parseInt(c.element.css("left"), 10) + (c.position.left - c.originalPosition.left) || null,
                h = parseInt(c.element.css("top"), 10) + (c.position.top - c.originalPosition.top) || null;
            c.element.animate(b.extend(g, h && e ? { top: h, left: e } : {}), {
                duration: d.animateDuration,
                easing: d.animateEasing,
                step: function() {
                    var d = {
                        width: parseInt(c.element.css("width"), 10),
                        height: parseInt(c.element.css("height"), 10),
                        top: parseInt(c.element.css("top"), 10),
                        left: parseInt(c.element.css("left"),
                            10)
                    };
                    f && f.length && b(f[0]).css({ width: d.width, height: d.height });
                    c._updateCache(d);
                    c._propagate("resize", a)
                }
            })
        }
    });
    b.ui.plugin.add("resizable", "containment", {
        start: function() {
            var a, c, d, f, g, e = b(this).resizable("instance"),
                h = e.element;
            d = e.options.containment;
            if (h = d instanceof b ? d.get(0) : /parent/.test(d) ? h.parent().get(0) : d) e.containerElement = b(h), /document/.test(d) || d === document ? (e.containerOffset = { left: 0, top: 0 }, e.containerPosition = { left: 0, top: 0 }, e.parentData = {
                element: b(document),
                left: 0,
                top: 0,
                width: b(document).width(),
                height: b(document).height() || document.body.parentNode.scrollHeight
            }) : (a = b(h), c = [], b(["Top", "Right", "Left", "Bottom"]).each(function(b, d) { c[b] = e._num(a.css("padding" + d)) }), e.containerOffset = a.offset(), e.containerPosition = a.position(), e.containerSize = { height: a.innerHeight() - c[3], width: a.innerWidth() - c[1] }, d = e.containerOffset, f = e.containerSize.height, g = e.containerSize.width, g = e._hasScroll(h, "left") ? h.scrollWidth : g, f = e._hasScroll(h) ? h.scrollHeight : f, e.parentData = {
                element: h,
                left: d.left,
                top: d.top,
                width: g,
                height: f
            })
        },
        resize: function(a) {
            var c, d, f, g = b(this).resizable("instance");
            c = g.options;
            d = g.containerOffset;
            f = g.position;
            a = g._aspectRatio || a.shiftKey;
            var e = { top: 0, left: 0 },
                h = g.containerElement,
                k = !0;
            h[0] !== document && /static/.test(h.css("position")) && (e = d);
            f.left < (g._helper ? d.left : 0) && (g.size.width += g._helper ? g.position.left - d.left : g.position.left - e.left, a && (g.size.height = g.size.width / g.aspectRatio, k = !1), g.position.left = c.helper ? d.left : 0);
            f.top < (g._helper ? d.top : 0) && (g.size.height += g._helper ? g.position.top -
                d.top : g.position.top, a && (g.size.width = g.size.height * g.aspectRatio, k = !1), g.position.top = g._helper ? d.top : 0);
            c = g.containerElement.get(0) === g.element.parent().get(0);
            f = /relative|absolute/.test(g.containerElement.css("position"));
            c && f ? (g.offset.left = g.parentData.left + g.position.left, g.offset.top = g.parentData.top + g.position.top) : (g.offset.left = g.element.offset().left, g.offset.top = g.element.offset().top);
            c = Math.abs(g.sizeDiff.width + (g._helper ? g.offset.left - e.left : g.offset.left - d.left));
            d = Math.abs(g.sizeDiff.height +
                (g._helper ? g.offset.top - e.top : g.offset.top - d.top));
            c + g.size.width >= g.parentData.width && (g.size.width = g.parentData.width - c, a && (g.size.height = g.size.width / g.aspectRatio, k = !1));
            d + g.size.height >= g.parentData.height && (g.size.height = g.parentData.height - d, a && (g.size.width = g.size.height * g.aspectRatio, k = !1));
            k || (g.position.left = g.prevPosition.left, g.position.top = g.prevPosition.top, g.size.width = g.prevSize.width, g.size.height = g.prevSize.height)
        },
        stop: function() {
            var a = b(this).resizable("instance"),
                c = a.options,
                d = a.containerOffset,
                f = a.containerPosition,
                g = a.containerElement,
                e = b(a.helper),
                h = e.offset(),
                k = e.outerWidth() - a.sizeDiff.width,
                e = e.outerHeight() - a.sizeDiff.height;
            a._helper && !c.animate && /relative/.test(g.css("position")) && b(this).css({ left: h.left - f.left - d.left, width: k, height: e });
            a._helper && !c.animate && /static/.test(g.css("position")) && b(this).css({ left: h.left - f.left - d.left, width: k, height: e })
        }
    });
    b.ui.plugin.add("resizable", "alsoResize", {
        start: function() {
            var a = b(this).resizable("instance").options,
                c = function(a) {
                    b(a).each(function() {
                        var a =
                            b(this);
                        a.data("ui-resizable-alsoresize", { width: parseInt(a.width(), 10), height: parseInt(a.height(), 10), left: parseInt(a.css("left"), 10), top: parseInt(a.css("top"), 10) })
                    })
                };
            "object" !== typeof a.alsoResize || a.alsoResize.parentNode ? c(a.alsoResize) : a.alsoResize.length ? (a.alsoResize = a.alsoResize[0], c(a.alsoResize)) : b.each(a.alsoResize, function(a) { c(a) })
        },
        resize: function(a, c) {
            var d = b(this).resizable("instance"),
                f = d.options,
                g = d.originalSize,
                e = d.originalPosition,
                h = {
                    height: d.size.height - g.height || 0,
                    width: d.size.width -
                        g.width || 0,
                    top: d.position.top - e.top || 0,
                    left: d.position.left - e.left || 0
                },
                k = function(a, d) { b(a).each(function() {
                        var a = b(this),
                            f = b(this).data("ui-resizable-alsoresize"),
                            g = {},
                            e = d && d.length ? d : a.parents(c.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                        b.each(e, function(a, b) {
                            var c = (f[b] || 0) + (h[b] || 0);
                            c && 0 <= c && (g[b] = c || null) });
                        a.css(g) }) };
            "object" !== typeof f.alsoResize || f.alsoResize.nodeType ? k(f.alsoResize) : b.each(f.alsoResize, function(a, b) { k(a, b) })
        },
        stop: function() { b(this).removeData("resizable-alsoresize") }
    });
    b.ui.plugin.add("resizable", "ghost", {
        start: function() {
            var a = b(this).resizable("instance"),
                c = a.options,
                d = a.size;
            a.ghost = a.originalElement.clone();
            a.ghost.css({ opacity: .25, display: "block", position: "relative", height: d.height, width: d.width, margin: 0, left: 0, top: 0 }).addClass("ui-resizable-ghost").addClass("string" === typeof c.ghost ? c.ghost : "");
            a.ghost.appendTo(a.helper) },
        resize: function() {
            var a = b(this).resizable("instance");
            a.ghost && a.ghost.css({ position: "relative", height: a.size.height, width: a.size.width }) },
        stop: function() {
            var a = b(this).resizable("instance");
            a.ghost && a.helper && a.helper.get(0).removeChild(a.ghost.get(0)) }
    });
    b.ui.plugin.add("resizable", "grid", {
        resize: function() {
            var a, c = b(this).resizable("instance"),
                d = c.options,
                f = c.size,
                g = c.originalSize,
                e = c.originalPosition,
                h = c.axis,
                k = "number" === typeof d.grid ? [d.grid, d.grid] : d.grid,
                m = k[0] || 1,
                l = k[1] || 1,
                n = Math.round((f.width - g.width) / m) * m,
                f = Math.round((f.height - g.height) / l) * l,
                u = g.width + n,
                x = g.height + f,
                r = d.maxWidth && d.maxWidth < u,
                t = d.maxHeight && d.maxHeight <
                x,
                y = d.minWidth && d.minWidth > u,
                D = d.minHeight && d.minHeight > x;
            d.grid = k;
            y && (u += m);
            D && (x += l);
            r && (u -= m);
            t && (x -= l);
            if (/^(se|s|e)$/.test(h)) c.size.width = u, c.size.height = x;
            else if (/^(ne)$/.test(h)) c.size.width = u, c.size.height = x, c.position.top = e.top - f;
            else if (/^(sw)$/.test(h)) c.size.width = u, c.size.height = x, c.position.left = e.left - n;
            else {
                if (0 >= x - l || 0 >= u - m) a = c._getPaddingPlusBorderDimensions(this);
                0 < x - l ? (c.size.height = x, c.position.top = e.top - f) : (x = l - a.height, c.size.height = x, c.position.top = e.top + g.height - x);
                0 < u -
                    m ? (c.size.width = u, c.position.left = e.left - n) : (u = l - a.height, c.size.width = u, c.position.left = e.left + g.width - u)
            }
        }
    });
    b.widget("ui.dialog", {
        version: "1.11.2",
        options: {
            appendTo: "body",
            autoOpen: !0,
            buttons: [],
            closeOnEscape: !0,
            closeText: "Close",
            dialogClass: "",
            draggable: !0,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: !1,
            position: { my: "center", at: "center", of: window, collision: "fit", using: function(a) {
                    var c = b(this).css(a).offset().top;
                    0 > c && b(this).css("top", a.top - c) } },
            resizable: !0,
            show: null,
            title: null,
            width: 300,
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },
        sizeRelatedOptions: { buttons: !0, height: !0, maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0, width: !0 },
        resizableRelatedOptions: { maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0 },
        _create: function() {
            this.originalCss = {
                display: this.element[0].style.display,
                width: this.element[0].style.width,
                minHeight: this.element[0].style.minHeight,
                maxHeight: this.element[0].style.maxHeight,
                height: this.element[0].style.height
            };
            this.originalPosition = { parent: this.element.parent(), index: this.element.parent().children().index(this.element) };
            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;
            this._createWrapper();
            this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog);
            this._createTitlebar();
            this._createButtonPane();
            this.options.draggable && b.fn.draggable && this._makeDraggable();
            this.options.resizable &&
                b.fn.resizable && this._makeResizable();
            this._isOpen = !1;
            this._trackFocus()
        },
        _init: function() { this.options.autoOpen && this.open() },
        _appendTo: function() {
            var a = this.options.appendTo;
            return a && (a.jquery || a.nodeType) ? b(a) : this.document.find(a || "body").eq(0) },
        _destroy: function() {
            var a, b = this.originalPosition;
            this._destroyOverlay();
            this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach();
            this.uiDialog.stop(!0, !0).remove();
            this.originalTitle && this.element.attr("title",
                this.originalTitle);
            a = b.parent.children().eq(b.index);
            a.length && a[0] !== this.element[0] ? a.before(this.element) : b.parent.append(this.element)
        },
        widget: function() {
            return this.uiDialog },
        disable: b.noop,
        enable: b.noop,
        close: function(a) {
            var c, d = this;
            if (this._isOpen && !1 !== this._trigger("beforeClose", a)) {
                this._isOpen = !1;
                this._focusedElement = null;
                this._destroyOverlay();
                this._untrackInstance();
                if (!this.opener.filter(":focusable").focus().length) try {
                    (c = this.document[0].activeElement) && "body" !== c.nodeName.toLowerCase() &&
                        b(c).blur()
                } catch (f) {}
                this._hide(this.uiDialog, this.options.hide, function() { d._trigger("close", a) })
            }
        },
        isOpen: function() {
            return this._isOpen },
        moveToTop: function() { this._moveToTop() },
        _moveToTop: function(a, c) {
            var d = !1,
                f = this.uiDialog.siblings(".ui-front:visible").map(function() {
                    return +b(this).css("z-index") }).get(),
                f = Math.max.apply(null, f);
            f >= +this.uiDialog.css("z-index") && (this.uiDialog.css("z-index", f + 1), d = !0);
            d && !c && this._trigger("focus", a);
            return d },
        open: function() {
            var a = this;
            this._isOpen ? this._moveToTop() &&
                this._focusTabbable() : (this._isOpen = !0, this.opener = b(this.document[0].activeElement), this._size(), this._position(), this._createOverlay(), this._moveToTop(null, !0), this.overlay && this.overlay.css("z-index", this.uiDialog.css("z-index") - 1), this._show(this.uiDialog, this.options.show, function() { a._focusTabbable();
                    a._trigger("focus") }), this._makeFocusTarget(), this._trigger("open"))
        },
        _focusTabbable: function() {
            var a = this._focusedElement;
            a || (a = this.element.find("[autofocus]"));
            a.length || (a = this.element.find(":tabbable"));
            a.length || (a = this.uiDialogButtonPane.find(":tabbable"));
            a.length || (a = this.uiDialogTitlebarClose.filter(":tabbable"));
            a.length || (a = this.uiDialog);
            a.eq(0).focus()
        },
        _keepFocus: function(a) {
            function c() {
                var a = this.document[0].activeElement;
                this.uiDialog[0] === a || b.contains(this.uiDialog[0], a) || this._focusTabbable() }
            a.preventDefault();
            c.call(this);
            this._delay(c) },
        _createWrapper: function() {
            this.uiDialog = b("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " + this.options.dialogClass).hide().attr({
                tabIndex: -1,
                role: "dialog"
            }).appendTo(this._appendTo());
            this._on(this.uiDialog, {
                keydown: function(a) {
                    if (this.options.closeOnEscape && !a.isDefaultPrevented() && a.keyCode && a.keyCode === b.ui.keyCode.ESCAPE) a.preventDefault(), this.close(a);
                    else if (a.keyCode === b.ui.keyCode.TAB && !a.isDefaultPrevented()) {
                        var c = this.uiDialog.find(":tabbable"),
                            d = c.filter(":first"),
                            f = c.filter(":last");
                        a.target !== f[0] && a.target !== this.uiDialog[0] || a.shiftKey ? a.target !== d[0] && a.target !== this.uiDialog[0] || !a.shiftKey || (this._delay(function() { f.focus() }),
                            a.preventDefault()) : (this._delay(function() { d.focus() }), a.preventDefault())
                    }
                },
                mousedown: function(a) { this._moveToTop(a) && this._focusTabbable() }
            });
            this.element.find("[aria-describedby]").length || this.uiDialog.attr({ "aria-describedby": this.element.uniqueId().attr("id") })
        },
        _createTitlebar: function() {
            var a;
            this.uiDialogTitlebar = b("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);
            this._on(this.uiDialogTitlebar, {
                mousedown: function(a) {
                    b(a.target).closest(".ui-dialog-titlebar-close") ||
                        this.uiDialog.focus()
                }
            });
            this.uiDialogTitlebarClose = b("<button type='button'></button>").button({ label: this.options.closeText, icons: { primary: "ui-icon-closethick" }, text: !1 }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);
            this._on(this.uiDialogTitlebarClose, { click: function(a) { a.preventDefault();
                    this.close(a) } });
            a = b("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);
            this._title(a);
            this.uiDialog.attr({ "aria-labelledby": a.attr("id") })
        },
        _title: function(a) {
            this.options.title ||
                a.html("&#160;");
            a.text(this.options.title)
        },
        _createButtonPane: function() { this.uiDialogButtonPane = b("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");
            this.uiButtonSet = b("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane);
            this._createButtons() },
        _createButtons: function() {
            var a = this,
                c = this.options.buttons;
            this.uiDialogButtonPane.remove();
            this.uiButtonSet.empty();
            b.isEmptyObject(c) || b.isArray(c) && !c.length ? this.uiDialog.removeClass("ui-dialog-buttons") :
                (b.each(c, function(c, f) {
                    var d, e;
                    f = b.isFunction(f) ? { click: f, text: c } : f;
                    f = b.extend({ type: "button" }, f);
                    d = f.click;
                    f.click = function() { d.apply(a.element[0], arguments) };
                    e = { icons: f.icons, text: f.showText };
                    delete f.icons;
                    delete f.showText;
                    b("<button></button>", f).button(e).appendTo(a.uiButtonSet) }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog))
        },
        _makeDraggable: function() {
            function a(a) {
                return { position: a.position, offset: a.offset } }
            var c = this,
                d = this.options;
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function(d, g) { b(this).addClass("ui-dialog-dragging");
                    c._blockFrames();
                    c._trigger("dragStart", d, a(g)) },
                drag: function(b, d) { c._trigger("drag", b, a(d)) },
                stop: function(f, g) {
                    var e = g.offset.left - c.document.scrollLeft(),
                        h = g.offset.top - c.document.scrollTop();
                    d.position = { my: "left top", at: "left" + (0 <= e ? "+" : "") + e + " top" + (0 <= h ? "+" : "") + h, of: c.window };
                    b(this).removeClass("ui-dialog-dragging");
                    c._unblockFrames();
                    c._trigger("dragStop", f, a(g)) }
            })
        },
        _makeResizable: function() {
            function a(a) {
                return {
                    originalPosition: a.originalPosition,
                    originalSize: a.originalSize,
                    position: a.position,
                    size: a.size
                }
            }
            var c = this,
                d = this.options,
                f = d.resizable,
                g = this.uiDialog.css("position"),
                f = "string" === typeof f ? f : "n,e,s,w,se,sw,ne,nw";
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: d.maxWidth,
                maxHeight: d.maxHeight,
                minWidth: d.minWidth,
                minHeight: this._minHeight(),
                handles: f,
                start: function(d, f) { b(this).addClass("ui-dialog-resizing");
                    c._blockFrames();
                    c._trigger("resizeStart", d, a(f)) },
                resize: function(b,
                    d) { c._trigger("resize", b, a(d)) },
                stop: function(f, g) {
                    var e = c.uiDialog.offset(),
                        h = e.left - c.document.scrollLeft(),
                        e = e.top - c.document.scrollTop();
                    d.height = c.uiDialog.height();
                    d.width = c.uiDialog.width();
                    d.position = { my: "left top", at: "left" + (0 <= h ? "+" : "") + h + " top" + (0 <= e ? "+" : "") + e, of: c.window };
                    b(this).removeClass("ui-dialog-resizing");
                    c._unblockFrames();
                    c._trigger("resizeStop", f, a(g)) }
            }).css("position", g)
        },
        _trackFocus: function() {
            this._on(this.widget(), {
                focusin: function(a) {
                    this._makeFocusTarget();
                    this._focusedElement =
                        b(a.target)
                }
            })
        },
        _makeFocusTarget: function() { this._untrackInstance();
            this._trackingInstances().unshift(this) },
        _untrackInstance: function() {
            var a = this._trackingInstances(),
                c = b.inArray(this, a); - 1 !== c && a.splice(c, 1) },
        _trackingInstances: function() {
            var a = this.document.data("ui-dialog-instances");
            a || (a = [], this.document.data("ui-dialog-instances", a));
            return a },
        _minHeight: function() {
            var a = this.options;
            return "auto" === a.height ? a.minHeight : Math.min(a.minHeight, a.height) },
        _position: function() {
            var a = this.uiDialog.is(":visible");
            a || this.uiDialog.show();
            this.uiDialog.position(this.options.position);
            a || this.uiDialog.hide()
        },
        _setOptions: function(a) {
            var c = this,
                d = !1,
                f = {};
            b.each(a, function(a, b) { c._setOption(a, b);
                a in c.sizeRelatedOptions && (d = !0);
                a in c.resizableRelatedOptions && (f[a] = b) });
            d && (this._size(), this._position());
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", f) },
        _setOption: function(a, b) {
            var c, f = this.uiDialog;
            "dialogClass" === a && f.removeClass(this.options.dialogClass).addClass(b);
            "disabled" !==
            a && (this._super(a, b), "appendTo" === a && this.uiDialog.appendTo(this._appendTo()), "buttons" === a && this._createButtons(), "closeText" === a && this.uiDialogTitlebarClose.button({ label: "" + b }), "draggable" === a && ((c = f.is(":data(ui-draggable)")) && !b && f.draggable("destroy"), !c && b && this._makeDraggable()), "position" === a && this._position(), "resizable" === a && ((c = f.is(":data(ui-resizable)")) && !b && f.resizable("destroy"), c && "string" === typeof b && f.resizable("option", "handles", b), c || !1 === b || this._makeResizable()), "title" ===
                a && this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))
        },
        _size: function() {
            var a, b, d, f = this.options;
            this.element.show().css({ width: "auto", minHeight: 0, maxHeight: "none", height: 0 });
            f.minWidth > f.width && (f.width = f.minWidth);
            a = this.uiDialog.css({ height: "auto", width: f.width }).outerHeight();
            b = Math.max(0, f.minHeight - a);
            d = "number" === typeof f.maxHeight ? Math.max(0, f.maxHeight - a) : "none";
            "auto" === f.height ? this.element.css({ minHeight: b, maxHeight: d, height: "auto" }) : this.element.height(Math.max(0, f.height - a));
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        },
        _blockFrames: function() { this.iframeBlocks = this.document.find("iframe").map(function() {
                var a = b(this);
                return b("<div>").css({ position: "absolute", width: a.outerWidth(), height: a.outerHeight() }).appendTo(a.parent()).offset(a.offset())[0] }) },
        _unblockFrames: function() { this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks) },
        _allowInteraction: function(a) {
            return b(a.target).closest(".ui-dialog").length ?
                !0 : !!b(a.target).closest(".ui-datepicker").length
        },
        _createOverlay: function() {
            if (this.options.modal) {
                var a = !0;
                this._delay(function() { a = !1 });
                this.document.data("ui-dialog-overlays") || this._on(this.document, { focusin: function(b) { a || this._allowInteraction(b) || (b.preventDefault(), this._trackingInstances()[0]._focusTabbable()) } });
                this.overlay = b("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo());
                this._on(this.overlay, { mousedown: "_keepFocus" });
                this.document.data("ui-dialog-overlays",
                    (this.document.data("ui-dialog-overlays") || 0) + 1)
            }
        },
        _destroyOverlay: function() {
            if (this.options.modal && this.overlay) {
                var a = this.document.data("ui-dialog-overlays") - 1;
                a ? this.document.data("ui-dialog-overlays", a) : this.document.unbind("focusin").removeData("ui-dialog-overlays");
                this.overlay.remove();
                this.overlay = null } }
    });
    b.widget("ui.droppable", {
        version: "1.11.2",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: !1,
            addClasses: !0,
            greedy: !1,
            hoverClass: !1,
            scope: "default",
            tolerance: "intersect",
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
        },
        _create: function() {
            var a, c = this.options,
                d = c.accept;
            this.isover = !1;
            this.isout = !0;
            this.accept = b.isFunction(d) ? d : function(a) {
                return a.is(d) };
            this.proportions = function() {
                if (arguments.length) a = arguments[0];
                else return a ? a : a = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight } };
            this._addToManager(c.scope);
            c.addClasses && this.element.addClass("ui-droppable") },
        _addToManager: function(a) {
            b.ui.ddmanager.droppables[a] = b.ui.ddmanager.droppables[a] || [];
            b.ui.ddmanager.droppables[a].push(this)
        },
        _splice: function(a) {
            for (var b = 0; b < a.length; b++) a[b] === this && a.splice(b, 1) },
        _destroy: function() { this._splice(b.ui.ddmanager.droppables[this.options.scope]);
            this.element.removeClass("ui-droppable ui-droppable-disabled") },
        _setOption: function(a, c) { "accept" === a ? this.accept = b.isFunction(c) ? c : function(a) {
                return a.is(c) } : "scope" === a && (this._splice(b.ui.ddmanager.droppables[this.options.scope]), this._addToManager(c));
            this._super(a, c) },
        _activate: function(a) {
            var c =
                b.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass);
            c && this._trigger("activate", a, this.ui(c))
        },
        _deactivate: function(a) {
            var c = b.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            c && this._trigger("deactivate", a, this.ui(c)) },
        _over: function(a) {
            var c = b.ui.ddmanager.current;
            c && (c.currentItem || c.element)[0] !== this.element[0] && this.accept.call(this.element[0], c.currentItem || c.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass),
                this._trigger("over", a, this.ui(c)))
        },
        _out: function(a) {
            var c = b.ui.ddmanager.current;
            c && (c.currentItem || c.element)[0] !== this.element[0] && this.accept.call(this.element[0], c.currentItem || c.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", a, this.ui(c))) },
        _drop: function(a, c) {
            var d = c || b.ui.ddmanager.current,
                f = !1;
            if (!d || (d.currentItem || d.element)[0] === this.element[0]) return !1;
            this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function() {
                var c =
                    b(this).droppable("instance");
                if (c.options.greedy && !c.options.disabled && c.options.scope === d.options.scope && c.accept.call(c.element[0], d.currentItem || d.element) && b.ui.intersect(d, b.extend(c, { offset: c.element.offset() }), c.options.tolerance, a)) return f = !0, !1
            });
            return f ? !1 : this.accept.call(this.element[0], d.currentItem || d.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop",
                a, this.ui(d)), this.element) : !1
        },
        ui: function(a) {
            return { draggable: a.currentItem || a.element, helper: a.helper, position: a.position, offset: a.positionAbs } }
    });
    b.ui.intersect = function() {
        return function(a, b, d, f) {
            if (!b.offset) return !1;
            var c = (a.positionAbs || a.position.absolute).left + a.margins.left,
                e = (a.positionAbs || a.position.absolute).top + a.margins.top,
                h = c + a.helperProportions.width,
                k = e + a.helperProportions.height,
                m = b.offset.left,
                l = b.offset.top,
                n = m + b.proportions().width,
                u = l + b.proportions().height;
            switch (d) {
                case "fit":
                    return m <=
                        c && h <= n && l <= e && k <= u;
                case "intersect":
                    return m < c + a.helperProportions.width / 2 && h - a.helperProportions.width / 2 < n && l < e + a.helperProportions.height / 2 && k - a.helperProportions.height / 2 < u;
                case "pointer":
                    a = f.pageY;
                    d = b.proportions().height;
                    if (l = a >= l && a < l + d) f = f.pageX, b = b.proportions().width, l = f >= m && f < m + b;
                    return l;
                case "touch":
                    return (e >= l && e <= u || k >= l && k <= u || e < l && k > u) && (c >= m && c <= n || h >= m && h <= n || c < m && h > n);
                default:
                    return !1
            }
        }
    }();
    b.ui.ddmanager = {
        current: null,
        droppables: { "default": [] },
        prepareOffsets: function(a, c) {
            var d,
                f, g = b.ui.ddmanager.droppables[a.options.scope] || [],
                e = c ? c.type : null,
                h = (a.currentItem || a.element).find(":data(ui-droppable)").addBack();
            d = 0;
            a: for (; d < g.length; d++)
                if (!(g[d].options.disabled || a && !g[d].accept.call(g[d].element[0], a.currentItem || a.element))) {
                    for (f = 0; f < h.length; f++)
                        if (h[f] === g[d].element[0]) { g[d].proportions().height = 0;
                            continue a }
                    g[d].visible = "none" !== g[d].element.css("display");
                    g[d].visible && ("mousedown" === e && g[d]._activate.call(g[d], c), g[d].offset = g[d].element.offset(), g[d].proportions({
                        width: g[d].element[0].offsetWidth,
                        height: g[d].element[0].offsetHeight
                    }))
                }
        },
        drop: function(a, c) {
            var d = !1;
            b.each((b.ui.ddmanager.droppables[a.options.scope] || []).slice(), function() { this.options && (!this.options.disabled && this.visible && b.ui.intersect(a, this, this.options.tolerance, c) && (d = this._drop.call(this, c) || d), !this.options.disabled && this.visible && this.accept.call(this.element[0], a.currentItem || a.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, c))) });
            return d },
        dragStart: function(a, c) {
            a.element.parentsUntil("body").bind("scroll.droppable",
                function() { a.options.refreshPositions || b.ui.ddmanager.prepareOffsets(a, c) })
        },
        drag: function(a, c) {
            a.options.refreshPositions && b.ui.ddmanager.prepareOffsets(a, c);
            b.each(b.ui.ddmanager.droppables[a.options.scope] || [], function() {
                if (!this.options.disabled && !this.greedyChild && this.visible) {
                    var d, f, g;
                    g = b.ui.intersect(a, this, this.options.tolerance, c);
                    var e = !g && this.isover ? "isout" : g && !this.isover ? "isover" : null;
                    e && (this.options.greedy && (f = this.options.scope, g = this.element.parents(":data(ui-droppable)").filter(function() {
                        return b(this).droppable("instance").options.scope ===
                            f
                    }), g.length && (d = b(g[0]).droppable("instance"), d.greedyChild = "isover" === e)), d && "isover" === e && (d.isover = !1, d.isout = !0, d._out.call(d, c)), this[e] = !0, this["isout" === e ? "isover" : "isout"] = !1, this["isover" === e ? "_over" : "_out"].call(this, c), d && "isout" === e && (d.isout = !1, d.isover = !0, d._over.call(d, c)))
                }
            })
        },
        dragStop: function(a, c) { a.element.parentsUntil("body").unbind("scroll.droppable");
            a.options.refreshPositions || b.ui.ddmanager.prepareOffsets(a, c) }
    };
    b.effects = { effect: {} };
    (function(a, b) {
        function c(a, b, c) {
            var d =
                l[b.type] || {};
            if (null == a) return c || !b.def ? null : b.def;
            a = d.floor ? ~~a : parseFloat(a);
            return isNaN(a) ? b.def : d.mod ? (a + d.mod) % d.mod : 0 > a ? 0 : d.max < a ? d.max : a
        }

        function f(b) {
            var c = k(),
                d = c._rgba = [];
            b = b.toLowerCase();
            q(h, function(a, f) {
                var g, e = f.re.exec(b);
                g = e && f.parse(e);
                e = f.space || "rgba";
                if (g) return g = c[e](g), c[m[e].cache] = g[m[e].cache], d = c._rgba = g._rgba, !1 });
            return d.length ? ("0,0,0,0" === d.join() && a.extend(d, r.transparent), c) : r[b] }

        function g(a, b, c) {
            c = (c + 1) % 1;
            return 1 > 6 * c ? a + (b - a) * c * 6 : 1 > 2 * c ? b : 2 > 3 * c ? a + (b - a) * (2 / 3 -
                c) * 6 : a
        }
        var e = /^([\-+])=\s*(\d+\.?\d*)/,
            h = [{ re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, parse: function(a) {
                    return [a[1], a[2], a[3], a[4]] } }, { re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, parse: function(a) {
                    return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]] } }, { re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function(a) {
                    return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)] } }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                parse: function(a) {
                    return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)] }
            }, { re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, space: "hsla", parse: function(a) {
                    return [a[1], a[2] / 100, a[3] / 100, a[4]] } }],
            k = a.Color = function(b, c, d, f) {
                return new a.Color.fn.parse(b, c, d, f) },
            m = {
                rgba: { props: { red: { idx: 0, type: "byte" }, green: { idx: 1, type: "byte" }, blue: { idx: 2, type: "byte" } } },
                hsla: {
                    props: {
                        hue: { idx: 0, type: "degrees" },
                        saturation: { idx: 1, type: "percent" },
                        lightness: { idx: 2, type: "percent" }
                    }
                }
            },
            l = { "byte": { floor: !0, max: 255 }, percent: { max: 1 }, degrees: { mod: 360, floor: !0 } },
            n = k.support = {},
            u = a("<p>")[0],
            r, q = a.each;
        u.style.cssText = "background-color:rgba(1,1,1,.5)";
        n.rgba = -1 < u.style.backgroundColor.indexOf("rgba");
        q(m, function(a, b) { b.cache = "_" + a;
            b.props.alpha = { idx: 3, type: "percent", def: 1 } });
        k.fn = a.extend(k.prototype, {
            parse: function(d, g, e, h) {
                if (d === b) return this._rgba = [null, null, null, null], this;
                if (d.jquery || d.nodeType) d = a(d).css(g), g = b;
                var p = this,
                    l = a.type(d),
                    B = this._rgba = [];
                g !== b && (d = [d, g, e, h], l = "array");
                if ("string" === l) return this.parse(f(d) || r._default);
                if ("array" === l) return q(m.rgba.props, function(a, b) { B[b.idx] = c(d[b.idx], b) }), this;
                if ("object" === l) return d instanceof k ? q(m, function(a, b) { d[b.cache] && (p[b.cache] = d[b.cache].slice()) }) : q(m, function(b, f) {
                        var g = f.cache;
                        q(f.props, function(a, b) {
                            if (!p[g] && f.to) {
                                if ("alpha" === a || null == d[a]) return;
                                p[g] = f.to(p._rgba) }
                            p[g][b.idx] = c(d[a], b, !0) });
                        p[g] && 0 > a.inArray(null, p[g].slice(0, 3)) && (p[g][3] = 1, f.from && (p._rgba = f.from(p[g]))) }),
                    this
            },
            is: function(a) {
                var b = k(a),
                    c = !0,
                    d = this;
                q(m, function(a, f) {
                    var g, e = b[f.cache];
                    e && (g = d[f.cache] || f.to && f.to(d._rgba) || [], q(f.props, function(a, b) {
                        if (null != e[b.idx]) return c = e[b.idx] === g[b.idx] }));
                    return c });
                return c },
            _space: function() {
                var a = [],
                    b = this;
                q(m, function(c, d) { b[d.cache] && a.push(c) });
                return a.pop() },
            transition: function(a, b) {
                var d = k(a),
                    f = d._space(),
                    g = m[f],
                    e = 0 === this.alpha() ? k("transparent") : this,
                    h = e[g.cache] || g.to(e._rgba),
                    p = h.slice(),
                    d = d[g.cache];
                q(g.props, function(a, f) {
                    var g = f.idx,
                        e = h[g],
                        k = d[g],
                        m = l[f.type] || {};
                    null !== k && (null === e ? p[g] = k : (m.mod && (k - e > m.mod / 2 ? e += m.mod : e - k > m.mod / 2 && (e -= m.mod)), p[g] = c((k - e) * b + e, f)))
                });
                return this[f](p)
            },
            blend: function(b) {
                if (1 === this._rgba[3]) return this;
                var c = this._rgba.slice(),
                    d = c.pop(),
                    f = k(b)._rgba;
                return k(a.map(c, function(a, b) {
                    return (1 - d) * f[b] + d * a })) },
            toRgbaString: function() {
                var b = "rgba(",
                    c = a.map(this._rgba, function(a, b) {
                        return null == a ? 2 < b ? 1 : 0 : a });
                1 === c[3] && (c.pop(), b = "rgb(");
                return b + c.join() + ")" },
            toHslaString: function() {
                var b = "hsla(",
                    c = a.map(this.hsla(),
                        function(a, b) { null == a && (a = 2 < b ? 1 : 0);
                            b && 3 > b && (a = Math.round(100 * a) + "%");
                            return a });
                1 === c[3] && (c.pop(), b = "hsl(");
                return b + c.join() + ")"
            },
            toHexString: function(b) {
                var c = this._rgba.slice(),
                    d = c.pop();
                b && c.push(~~(255 * d));
                return "#" + a.map(c, function(a) { a = (a || 0).toString(16);
                    return 1 === a.length ? "0" + a : a }).join("") },
            toString: function() {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString() }
        });
        k.fn.parse.prototype = k.fn;
        m.hsla.to = function(a) {
            if (null == a[0] || null == a[1] || null == a[2]) return [null, null, null, a[3]];
            var b =
                a[0] / 255,
                c = a[1] / 255,
                d = a[2] / 255;
            a = a[3];
            var f = Math.max(b, c, d),
                g = Math.min(b, c, d),
                e = f - g,
                h = f + g,
                k = .5 * h;
            return [Math.round(g === f ? 0 : b === f ? 60 * (c - d) / e + 360 : c === f ? 60 * (d - b) / e + 120 : 60 * (b - c) / e + 240) % 360, 0 === e ? 0 : .5 >= k ? e / h : e / (2 - h), k, null == a ? 1 : a]
        };
        m.hsla.from = function(a) {
            if (null == a[0] || null == a[1] || null == a[2]) return [null, null, null, a[3]];
            var b = a[0] / 360,
                c = a[1],
                d = a[2];
            a = a[3];
            c = .5 >= d ? d * (1 + c) : d + c - d * c;
            d = 2 * d - c;
            return [Math.round(255 * g(d, c, b + 1 / 3)), Math.round(255 * g(d, c, b)), Math.round(255 * g(d, c, b - 1 / 3)), a] };
        q(m, function(d, f) {
            var g =
                f.props,
                h = f.cache,
                p = f.to,
                m = f.from;
            k.fn[d] = function(d) { p && !this[h] && (this[h] = p(this._rgba));
                if (d === b) return this[h].slice();
                var f, e = a.type(d),
                    l = "array" === e || "object" === e ? d : arguments,
                    B = this[h].slice();
                q(g, function(a, b) {
                    var d = l["object" === e ? a : b.idx];
                    null == d && (d = B[b.idx]);
                    B[b.idx] = c(d, b) });
                return m ? (f = k(m(B)), f[h] = B, f) : k(B) };
            q(g, function(b, c) {
                k.fn[b] || (k.fn[b] = function(f) {
                    var g = a.type(f),
                        h = "alpha" === b ? this._hsla ? "hsla" : "rgba" : d,
                        k = this[h](),
                        p = k[c.idx];
                    if ("undefined" === g) return p;
                    "function" === g && (f = f.call(this,
                        p), g = a.type(f));
                    if (null == f && c.empty) return this;
                    "string" === g && (g = e.exec(f)) && (f = p + parseFloat(g[2]) * ("+" === g[1] ? 1 : -1));
                    k[c.idx] = f;
                    return this[h](k)
                })
            })
        });
        k.hook = function(b) {
            b = b.split(" ");
            q(b, function(b, c) {
                a.cssHooks[c] = {
                    set: function(b, d) {
                        var g, e = "";
                        if ("transparent" !== d && ("string" !== a.type(d) || (g = f(d)))) {
                            d = k(g || d);
                            if (!n.rgba && 1 !== d._rgba[3]) {
                                for (g = "backgroundColor" === c ? b.parentNode : b;
                                    ("" === e || "transparent" === e) && g && g.style;) try { e = a.css(g, "backgroundColor"), g = g.parentNode } catch (X) {}
                                d = d.blend(e && "transparent" !==
                                    e ? e : "_default")
                            }
                            d = d.toRgbaString()
                        }
                        try { b.style[c] = d } catch (X) {}
                    }
                };
                a.fx.step[c] = function(b) { b.colorInit || (b.start = k(b.elem, c), b.end = k(b.end), b.colorInit = !0);
                    a.cssHooks[c].set(b.elem, b.start.transition(b.end, b.pos)) }
            })
        };
        k.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");
        a.cssHooks.borderColor = {
            expand: function(a) {
                var b = {};
                q(["Top", "Right", "Bottom", "Left"], function(c, d) {
                    b["border" + d + "Color"] =
                        a
                });
                return b
            }
        };
        r = a.Color.names = { aqua: "#00ffff", black: "#000000", blue: "#0000ff", fuchsia: "#ff00ff", gray: "#808080", green: "#008000", lime: "#00ff00", maroon: "#800000", navy: "#000080", olive: "#808000", purple: "#800080", red: "#ff0000", silver: "#c0c0c0", teal: "#008080", white: "#ffffff", yellow: "#ffff00", transparent: [null, null, null, 0], _default: "#ffffff" }
    })(b);
    (function() {
        function a(a) {
            var c, d = a.ownerDocument.defaultView ? a.ownerDocument.defaultView.getComputedStyle(a, null) : a.currentStyle,
                f = {};
            if (d && d.length && d[0] && d[d[0]])
                for (a =
                    d.length; a--;) c = d[a], "string" === typeof d[c] && (f[b.camelCase(c)] = d[c]);
            else
                for (c in d) "string" === typeof d[c] && (f[c] = d[c]);
            return f
        }
        var c = ["add", "remove", "toggle"],
            d = { border: 1, borderBottom: 1, borderColor: 1, borderLeft: 1, borderRight: 1, borderTop: 1, borderWidth: 1, margin: 1, padding: 1 };
        b.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(a, c) { b.fx.step[c] = function(a) {
                if ("none" !== a.end && !a.setAttr || 1 === a.pos && !a.setAttr) b.style(a.elem, c, a.end), a.setAttr = !0 } });
        b.fn.addBack ||
            (b.fn.addBack = function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a)) });
        b.effects.animateClass = function(f, g, e, h) {
            var k = b.speed(g, e, h);
            return this.queue(function() {
                var g = b(this),
                    e = g.attr("class") || "",
                    h, p = k.children ? g.find("*").addBack() : g,
                    p = p.map(function() {
                        return { el: b(this), start: a(this) } });
                h = function() { b.each(c, function(a, b) {
                        if (f[b]) g[b + "Class"](f[b]) }) };
                h();
                p = p.map(function() {
                    this.end = a(this.el[0]);
                    var c = this.start,
                        f = this.end,
                        g = {},
                        e, h;
                    for (e in f) h = f[e], c[e] === h || d[e] || !b.fx.step[e] &&
                        isNaN(parseFloat(h)) || (g[e] = h);
                    this.diff = g;
                    return this
                });
                g.attr("class", e);
                p = p.map(function() {
                    var a = this,
                        c = b.Deferred(),
                        d = b.extend({}, k, { queue: !1, complete: function() { c.resolve(a) } });
                    this.el.animate(this.diff, d);
                    return c.promise() });
                b.when.apply(b, p.get()).done(function() { h();
                    b.each(arguments, function() {
                        var a = this.el;
                        b.each(this.diff, function(b) { a.css(b, "") }) });
                    k.complete.call(g[0]) })
            })
        };
        b.fn.extend({
            addClass: function(a) {
                return function(c, d, f, e) {
                    return d ? b.effects.animateClass.call(this, { add: c }, d,
                        f, e) : a.apply(this, arguments)
                }
            }(b.fn.addClass),
            removeClass: function(a) {
                return function(c, d, f, e) {
                    return 1 < arguments.length ? b.effects.animateClass.call(this, { remove: c }, d, f, e) : a.apply(this, arguments) } }(b.fn.removeClass),
            toggleClass: function(a) {
                return function(c, d, f, e, h) {
                    return "boolean" === typeof d || void 0 === d ? f ? b.effects.animateClass.call(this, d ? { add: c } : { remove: c }, f, e, h) : a.apply(this, arguments) : b.effects.animateClass.call(this, { toggle: c }, d, f, e) } }(b.fn.toggleClass),
            switchClass: function(a, c, d, e, h) {
                return b.effects.animateClass.call(this, { add: c, remove: a }, d, e, h)
            }
        })
    })();
    (function() {
        function a(a, c, g, e) { b.isPlainObject(a) && (c = a, a = a.effect);
            a = { effect: a };
            null == c && (c = {});
            b.isFunction(c) && (e = c, g = null, c = {});
            if ("number" === typeof c || b.fx.speeds[c]) e = g, g = c, c = {};
            b.isFunction(g) && (e = g, g = null);
            c && b.extend(a, c);
            g = g || c.duration;
            a.duration = b.fx.off ? 0 : "number" === typeof g ? g : g in b.fx.speeds ? b.fx.speeds[g] : b.fx.speeds._default;
            a.complete = e || c.complete;
            return a }

        function c(a) {
            return !a || "number" === typeof a || b.fx.speeds[a] || "string" === typeof a && !b.effects.effect[a] ||
                b.isFunction(a) || "object" === typeof a && !a.effect ? !0 : !1
        }
        b.extend(b.effects, {
            version: "1.11.2",
            save: function(a, b) {
                for (var c = 0; c < b.length; c++) null !== b[c] && a.data("ui-effects-" + b[c], a[0].style[b[c]]) },
            restore: function(a, b) {
                var c, d;
                for (d = 0; d < b.length; d++) null !== b[d] && (c = a.data("ui-effects-" + b[d]), void 0 === c && (c = ""), a.css(b[d], c)) },
            setMode: function(a, b) { "toggle" === b && (b = a.is(":hidden") ? "show" : "hide");
                return b },
            getBaseline: function(a, b) {
                var c, d;
                switch (a[0]) {
                    case "top":
                        c = 0;
                        break;
                    case "middle":
                        c = .5;
                        break;
                    case "bottom":
                        c =
                            1;
                        break;
                    default:
                        c = a[0] / b.height
                }
                switch (a[1]) {
                    case "left":
                        d = 0;
                        break;
                    case "center":
                        d = .5;
                        break;
                    case "right":
                        d = 1;
                        break;
                    default:
                        d = a[1] / b.width }
                return { x: d, y: c }
            },
            createWrapper: function(a) {
                if (a.parent().is(".ui-effects-wrapper")) return a.parent();
                var c = { width: a.outerWidth(!0), height: a.outerHeight(!0), "float": a.css("float") },
                    d = b("<div></div>").addClass("ui-effects-wrapper").css({ fontSize: "100%", background: "transparent", border: "none", margin: 0, padding: 0 }),
                    e = { width: a.width(), height: a.height() },
                    h = document.activeElement;
                try { h.id } catch (H) { h = document.body }
                a.wrap(d);
                (a[0] === h || b.contains(a[0], h)) && b(h).focus();
                d = a.parent();
                "static" === a.css("position") ? (d.css({ position: "relative" }), a.css({ position: "relative" })) : (b.extend(c, { position: a.css("position"), zIndex: a.css("z-index") }), b.each(["top", "left", "bottom", "right"], function(b, d) { c[d] = a.css(d);
                    isNaN(parseInt(c[d], 10)) && (c[d] = "auto") }), a.css({ position: "relative", top: 0, left: 0, right: "auto", bottom: "auto" }));
                a.css(e);
                return d.css(c).show()
            },
            removeWrapper: function(a) {
                var c =
                    document.activeElement;
                a.parent().is(".ui-effects-wrapper") && (a.parent().replaceWith(a), (a[0] === c || b.contains(a[0], c)) && b(c).focus());
                return a
            },
            setTransition: function(a, c, g, e) { e = e || {};
                b.each(c, function(b, c) {
                    var d = a.cssUnit(c);
                    0 < d[0] && (e[c] = d[0] * g + d[1]) });
                return e }
        });
        b.fn.extend({
            effect: function() {
                function c(a) {
                    function c() { b.isFunction(g) && g.call(d[0]);
                        b.isFunction(a) && a() }
                    var d = b(this),
                        g = f.complete,
                        e = f.mode;
                    (d.is(":hidden") ? "hide" === e : "show" === e) ? (d[e](), c()) : h.call(d[0], f, c) }
                var f = a.apply(this,
                        arguments),
                    g = f.mode,
                    e = f.queue,
                    h = b.effects.effect[f.effect];
                return b.fx.off || !h ? g ? this[g](f.duration, f.complete) : this.each(function() { f.complete && f.complete.call(this) }) : !1 === e ? this.each(c) : this.queue(e || "fx", c)
            },
            show: function(b) {
                return function(d) {
                    if (c(d)) return b.apply(this, arguments);
                    var f = a.apply(this, arguments);
                    f.mode = "show";
                    return this.effect.call(this, f) } }(b.fn.show),
            hide: function(b) {
                return function(d) {
                    if (c(d)) return b.apply(this, arguments);
                    var f = a.apply(this, arguments);
                    f.mode = "hide";
                    return this.effect.call(this,
                        f)
                }
            }(b.fn.hide),
            toggle: function(b) {
                return function(d) {
                    if (c(d) || "boolean" === typeof d) return b.apply(this, arguments);
                    var f = a.apply(this, arguments);
                    f.mode = "toggle";
                    return this.effect.call(this, f) } }(b.fn.toggle),
            cssUnit: function(a) {
                var c = this.css(a),
                    d = [];
                b.each(["em", "px", "%", "pt"], function(a, b) { 0 < c.indexOf(b) && (d = [parseFloat(c), b]) });
                return d }
        })
    })();
    (function() {
        var a = {};
        b.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(b, d) { a[d] = function(a) {
                return Math.pow(a, b + 2) } });
        b.extend(a, {
            Sine: function(a) {
                return 1 -
                    Math.cos(a * Math.PI / 2)
            },
            Circ: function(a) {
                return 1 - Math.sqrt(1 - a * a) },
            Elastic: function(a) {
                return 0 === a || 1 === a ? a : -Math.pow(2, 8 * (a - 1)) * Math.sin((80 * (a - 1) - 7.5) * Math.PI / 15) },
            Back: function(a) {
                return a * a * (3 * a - 2) },
            Bounce: function(a) {
                for (var b, c = 4; a < ((b = Math.pow(2, --c)) - 1) / 11;);
                return 1 / Math.pow(4, 3 - c) - 7.5625 * Math.pow((3 * b - 2) / 22 - a, 2) }
        });
        b.each(a, function(a, d) { b.easing["easeIn" + a] = d;
            b.easing["easeOut" + a] = function(a) {
                return 1 - d(1 - a) };
            b.easing["easeInOut" + a] = function(a) {
                return .5 > a ? d(2 * a) / 2 : 1 - d(-2 * a + 2) / 2 } })
    })();
    b.effects.effect.blind = function(a, c) {
        var d = b(this),
            f = "position top bottom left right height width".split(" "),
            g = b.effects.setMode(d, a.mode || "hide"),
            e = a.direction || "up",
            h = /up|down|vertical/.test(e),
            k = h ? "height" : "width",
            m = h ? "top" : "left",
            e = /up|left|vertical|horizontal/.test(e),
            l = {},
            n = "show" === g,
            r, q, w;
        d.parent().is(".ui-effects-wrapper") ? b.effects.save(d.parent(), f) : b.effects.save(d, f);
        d.show();
        r = b.effects.createWrapper(d).css({ overflow: "hidden" });
        q = r[k]();
        w = parseFloat(r.css(m)) || 0;
        l[k] = n ? q : 0;
        e || (d.css(h ?
            "bottom" : "right", 0).css(h ? "top" : "left", "auto").css({ position: "absolute" }), l[m] = n ? w : q + w);
        n && (r.css(k, 0), e || r.css(m, w + q));
        r.animate(l, { duration: a.duration, easing: a.easing, queue: !1, complete: function() { "hide" === g && d.hide();
                b.effects.restore(d, f);
                b.effects.removeWrapper(d);
                c() } })
    };
    b.effects.effect.bounce = function(a, c) {
        var d = b(this),
            f = "position top bottom left right height width".split(" "),
            g = b.effects.setMode(d, a.mode || "effect"),
            e = "hide" === g,
            h = "show" === g,
            k = a.direction || "up",
            g = a.distance,
            m = a.times || 5,
            l =
            2 * m + (h || e ? 1 : 0),
            n = a.duration / l,
            r = a.easing,
            q = "up" === k || "down" === k ? "top" : "left",
            k = "up" === k || "left" === k,
            w, t, y = d.queue(),
            C = y.length;
        (h || e) && f.push("opacity");
        b.effects.save(d, f);
        d.show();
        b.effects.createWrapper(d);
        g || (g = d["top" === q ? "outerHeight" : "outerWidth"]() / 3);
        h && (t = { opacity: 1 }, t[q] = 0, d.css("opacity", 0).css(q, k ? 2 * -g : 2 * g).animate(t, n, r));
        e && (g /= Math.pow(2, m - 1));
        t = {};
        for (h = t[q] = 0; h < m; h++) w = {}, w[q] = (k ? "-=" : "+=") + g, d.animate(w, n, r).animate(t, n, r), g = e ? 2 * g : g / 2;
        e && (w = { opacity: 0 }, w[q] = (k ? "-=" : "+=") + g, d.animate(w,
            n, r));
        d.queue(function() { e && d.hide();
            b.effects.restore(d, f);
            b.effects.removeWrapper(d);
            c() });
        1 < C && y.splice.apply(y, [1, 0].concat(y.splice(C, l + 1)));
        d.dequeue()
    };
    b.effects.effect.clip = function(a, c) {
        var d = b(this),
            f = "position top bottom left right height width".split(" "),
            g = "show" === b.effects.setMode(d, a.mode || "hide"),
            e = "vertical" === (a.direction || "vertical"),
            h = e ? "height" : "width",
            e = e ? "top" : "left",
            k = {},
            m, l;
        b.effects.save(d, f);
        d.show();
        m = b.effects.createWrapper(d).css({ overflow: "hidden" });
        m = "IMG" === d[0].tagName ?
            m : d;
        l = m[h]();
        g && (m.css(h, 0), m.css(e, l / 2));
        k[h] = g ? l : 0;
        k[e] = g ? 0 : l / 2;
        m.animate(k, { queue: !1, duration: a.duration, easing: a.easing, complete: function() { g || d.hide();
                b.effects.restore(d, f);
                b.effects.removeWrapper(d);
                c() } })
    };
    b.effects.effect.drop = function(a, c) {
        var d = b(this),
            f = "position top bottom left right opacity height width".split(" "),
            g = b.effects.setMode(d, a.mode || "hide"),
            e = "show" === g,
            h = a.direction || "left",
            k = "up" === h || "down" === h ? "top" : "left",
            h = "up" === h || "left" === h ? "pos" : "neg",
            m = { opacity: e ? 1 : 0 },
            l;
        b.effects.save(d,
            f);
        d.show();
        b.effects.createWrapper(d);
        l = a.distance || d["top" === k ? "outerHeight" : "outerWidth"](!0) / 2;
        e && d.css("opacity", 0).css(k, "pos" === h ? -l : l);
        m[k] = (e ? "pos" === h ? "+=" : "-=" : "pos" === h ? "-=" : "+=") + l;
        d.animate(m, { queue: !1, duration: a.duration, easing: a.easing, complete: function() { "hide" === g && d.hide();
                b.effects.restore(d, f);
                b.effects.removeWrapper(d);
                c() } })
    };
    b.effects.effect.explode = function(a, c) {
        function d() { n.push(this);
            n.length === f * g && (e.css({ visibility: "visible" }), b(n).remove(), h || e.hide(), c()) }
        var f = a.pieces ?
            Math.round(Math.sqrt(a.pieces)) : 3,
            g = f,
            e = b(this),
            h = "show" === b.effects.setMode(e, a.mode || "hide"),
            k = e.show().css("visibility", "hidden").offset(),
            m = Math.ceil(e.outerWidth() / g),
            l = Math.ceil(e.outerHeight() / f),
            n = [],
            r, q, w, t, C, v;
        for (r = 0; r < f; r++)
            for (t = k.top + r * l, v = r - (f - 1) / 2, q = 0; q < g; q++) w = k.left + q * m, C = q - (g - 1) / 2, e.clone().appendTo("body").wrap("<div></div>").css({ position: "absolute", visibility: "visible", left: -q * m, top: -r * l }).parent().addClass("ui-effects-explode").css({
                position: "absolute",
                overflow: "hidden",
                width: m,
                height: l,
                left: w + (h ? C * m : 0),
                top: t + (h ? v * l : 0),
                opacity: h ? 0 : 1
            }).animate({ left: w + (h ? 0 : C * m), top: t + (h ? 0 : v * l), opacity: h ? 1 : 0 }, a.duration || 500, a.easing, d)
    };
    b.effects.effect.fade = function(a, c) {
        var d = b(this),
            f = b.effects.setMode(d, a.mode || "toggle");
        d.animate({ opacity: f }, { queue: !1, duration: a.duration, easing: a.easing, complete: c }) };
    b.effects.effect.fold = function(a, c) {
        var d = b(this),
            f = "position top bottom left right height width".split(" "),
            g = b.effects.setMode(d, a.mode || "hide"),
            e = "show" === g,
            h = "hide" === g,
            g = a.size || 15,
            k = /([0-9]+)%/.exec(g),
            m = !!a.horizFirst,
            l = e !== m,
            n = l ? ["width", "height"] : ["height", "width"],
            r = a.duration / 2,
            q, w = {},
            t = {};
        b.effects.save(d, f);
        d.show();
        q = b.effects.createWrapper(d).css({ overflow: "hidden" });
        l = l ? [q.width(), q.height()] : [q.height(), q.width()];
        k && (g = parseInt(k[1], 10) / 100 * l[h ? 0 : 1]);
        e && q.css(m ? { height: 0, width: g } : { height: g, width: 0 });
        w[n[0]] = e ? l[0] : g;
        t[n[1]] = e ? l[1] : 0;
        q.animate(w, r, a.easing).animate(t, r, a.easing, function() { h && d.hide();
            b.effects.restore(d, f);
            b.effects.removeWrapper(d);
            c() })
    };
    b.effects.effect.highlight =
        function(a, c) {
            var d = b(this),
                f = ["backgroundImage", "backgroundColor", "opacity"],
                g = b.effects.setMode(d, a.mode || "show"),
                e = { backgroundColor: d.css("backgroundColor") }; "hide" === g && (e.opacity = 0);
            b.effects.save(d, f);
            d.show().css({ backgroundImage: "none", backgroundColor: a.color || "#ffff99" }).animate(e, { queue: !1, duration: a.duration, easing: a.easing, complete: function() { "hide" === g && d.hide();
                    b.effects.restore(d, f);
                    c() } }) };
    b.effects.effect.size = function(a, c) {
        var d, f, g, e, h, k, m = b(this),
            l = "position top bottom left right width height overflow opacity".split(" ");
        h = "position top bottom left right overflow opacity".split(" ");
        var n = ["width", "height", "overflow"],
            q = ["fontSize"],
            r = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
            w = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
            t = b.effects.setMode(m, a.mode || "effect"),
            C = a.restore || "effect" !== t,
            v = a.scale || "both";
        k = a.origin || ["middle", "center"];
        var z = m.css("position"),
            A = C ? l : h,
            J = { height: 0, width: 0, outerHeight: 0, outerWidth: 0 };
        "show" === t && m.show();
        h = {
            height: m.height(),
            width: m.width(),
            outerHeight: m.outerHeight(),
            outerWidth: m.outerWidth()
        };
        "toggle" === a.mode && "show" === t ? (m.from = a.to || J, m.to = a.from || h) : (m.from = a.from || ("show" === t ? J : h), m.to = a.to || ("hide" === t ? J : h));
        g = m.from.height / h.height;
        e = m.from.width / h.width;
        d = m.to.height / h.height;
        f = m.to.width / h.width;
        if ("box" === v || "both" === v) g !== d && (A = A.concat(r), m.from = b.effects.setTransition(m, r, g, m.from), m.to = b.effects.setTransition(m, r, d, m.to)), e !== f && (A = A.concat(w), m.from = b.effects.setTransition(m, w, e, m.from), m.to = b.effects.setTransition(m,
            w, f, m.to));
        "content" !== v && "both" !== v || g === d || (A = A.concat(q).concat(n), m.from = b.effects.setTransition(m, q, g, m.from), m.to = b.effects.setTransition(m, q, d, m.to));
        b.effects.save(m, A);
        m.show();
        b.effects.createWrapper(m);
        m.css("overflow", "hidden").css(m.from);
        k && (k = b.effects.getBaseline(k, h), m.from.top = (h.outerHeight - m.outerHeight()) * k.y, m.from.left = (h.outerWidth - m.outerWidth()) * k.x, m.to.top = (h.outerHeight - m.to.outerHeight) * k.y, m.to.left = (h.outerWidth - m.to.outerWidth) * k.x);
        m.css(m.from);
        if ("content" === v ||
            "both" === v) r = r.concat(["marginTop", "marginBottom"]).concat(q), w = w.concat(["marginLeft", "marginRight"]), n = l.concat(r).concat(w), m.find("*[width]").each(function() {
            var c = b(this),
                h = c.height(),
                k = c.width(),
                p = c.outerHeight(),
                m = c.outerWidth();
            C && b.effects.save(c, n);
            c.from = { height: h * g, width: k * e, outerHeight: p * g, outerWidth: m * e };
            c.to = { height: h * d, width: k * f, outerHeight: h * d, outerWidth: k * f };
            g !== d && (c.from = b.effects.setTransition(c, r, g, c.from), c.to = b.effects.setTransition(c, r, d, c.to));
            e !== f && (c.from = b.effects.setTransition(c,
                w, e, c.from), c.to = b.effects.setTransition(c, w, f, c.to));
            c.css(c.from);
            c.animate(c.to, a.duration, a.easing, function() { C && b.effects.restore(c, n) })
        });
        m.animate(m.to, {
            queue: !1,
            duration: a.duration,
            easing: a.easing,
            complete: function() {
                0 === m.to.opacity && m.css("opacity", m.from.opacity);
                "hide" === t && m.hide();
                b.effects.restore(m, A);
                C || ("static" === z ? m.css({ position: "relative", top: m.to.top, left: m.to.left }) : b.each(["top", "left"], function(a, b) {
                    m.css(b, function(b, c) {
                        var d = parseInt(c, 10),
                            f = a ? m.to.left : m.to.top;
                        return "auto" ===
                            c ? f + "px" : d + f + "px"
                    })
                }));
                b.effects.removeWrapper(m);
                c()
            }
        })
    };
    b.effects.effect.scale = function(a, c) {
        var d = b(this),
            f = b.extend(!0, {}, a),
            g = b.effects.setMode(d, a.mode || "effect"),
            e = parseInt(a.percent, 10) || (0 === parseInt(a.percent, 10) ? 0 : "hide" === g ? 0 : 100),
            h = a.direction || "both",
            k = a.origin,
            m = { height: d.height(), width: d.width(), outerHeight: d.outerHeight(), outerWidth: d.outerWidth() },
            l = "horizontal" !== h ? e / 100 : 1,
            e = "vertical" !== h ? e / 100 : 1;
        f.effect = "size";
        f.queue = !1;
        f.complete = c;
        "effect" !== g && (f.origin = k || ["middle", "center"],
            f.restore = !0);
        f.from = a.from || ("show" === g ? { height: 0, width: 0, outerHeight: 0, outerWidth: 0 } : m);
        f.to = { height: m.height * l, width: m.width * e, outerHeight: m.outerHeight * l, outerWidth: m.outerWidth * e };
        f.fade && ("show" === g && (f.from.opacity = 0, f.to.opacity = 1), "hide" === g && (f.from.opacity = 1, f.to.opacity = 0));
        d.effect(f)
    };
    b.effects.effect.puff = function(a, c) {
        var d = b(this),
            f = b.effects.setMode(d, a.mode || "hide"),
            g = "hide" === f,
            e = parseInt(a.percent, 10) || 150,
            h = e / 100,
            k = {
                height: d.height(),
                width: d.width(),
                outerHeight: d.outerHeight(),
                outerWidth: d.outerWidth()
            };
        b.extend(a, { effect: "scale", queue: !1, fade: !0, mode: f, complete: c, percent: g ? e : 100, from: g ? k : { height: k.height * h, width: k.width * h, outerHeight: k.outerHeight * h, outerWidth: k.outerWidth * h } });
        d.effect(a)
    };
    b.effects.effect.pulsate = function(a, c) {
        var d = b(this),
            f = b.effects.setMode(d, a.mode || "show"),
            g = "show" === f,
            e = "hide" === f,
            f = 2 * (a.times || 5) + (g || "hide" === f ? 1 : 0),
            h = a.duration / f,
            k = 0,
            m = d.queue(),
            l = m.length;
        if (g || !d.is(":visible")) d.css("opacity", 0).show(), k = 1;
        for (g = 1; g < f; g++) d.animate({ opacity: k },
            h, a.easing), k = 1 - k;
        d.animate({ opacity: k }, h, a.easing);
        d.queue(function() { e && d.hide();
            c() });
        1 < l && m.splice.apply(m, [1, 0].concat(m.splice(l, f + 1)));
        d.dequeue()
    };
    b.effects.effect.shake = function(a, c) {
        var d = b(this),
            f = "position top bottom left right height width".split(" "),
            g = b.effects.setMode(d, a.mode || "effect"),
            e = a.direction || "left",
            h = a.distance || 20,
            k = a.times || 3,
            m = 2 * k + 1,
            l = Math.round(a.duration / m),
            n = "up" === e || "down" === e ? "top" : "left",
            r = "up" === e || "left" === e,
            e = {},
            q = {},
            w = {},
            t = d.queue(),
            C = t.length;
        b.effects.save(d,
            f);
        d.show();
        b.effects.createWrapper(d);
        e[n] = (r ? "-=" : "+=") + h;
        q[n] = (r ? "+=" : "-=") + 2 * h;
        w[n] = (r ? "-=" : "+=") + 2 * h;
        d.animate(e, l, a.easing);
        for (h = 1; h < k; h++) d.animate(q, l, a.easing).animate(w, l, a.easing);
        d.animate(q, l, a.easing).animate(e, l / 2, a.easing).queue(function() { "hide" === g && d.hide();
            b.effects.restore(d, f);
            b.effects.removeWrapper(d);
            c() });
        1 < C && t.splice.apply(t, [1, 0].concat(t.splice(C, m + 1)));
        d.dequeue()
    };
    b.effects.effect.slide = function(a, c) {
        var d = b(this),
            f = "position top bottom left right width height".split(" "),
            g = b.effects.setMode(d, a.mode || "show"),
            e = "show" === g,
            h = a.direction || "left",
            k = "up" === h || "down" === h ? "top" : "left",
            h = "up" === h || "left" === h,
            m, l = {};
        b.effects.save(d, f);
        d.show();
        m = a.distance || d["top" === k ? "outerHeight" : "outerWidth"](!0);
        b.effects.createWrapper(d).css({ overflow: "hidden" });
        e && d.css(k, h ? isNaN(m) ? "-" + m : -m : m);
        l[k] = (e ? h ? "+=" : "-=" : h ? "-=" : "+=") + m;
        d.animate(l, { queue: !1, duration: a.duration, easing: a.easing, complete: function() { "hide" === g && d.hide();
                b.effects.restore(d, f);
                b.effects.removeWrapper(d);
                c() } })
    };
    b.effects.effect.transfer = function(a, c) {
        var d = b(this),
            f = b(a.to),
            g = "fixed" === f.css("position"),
            e = b("body"),
            h = g ? e.scrollTop() : 0,
            e = g ? e.scrollLeft() : 0,
            k = f.offset(),
            f = { top: k.top - h, left: k.left - e, height: f.innerHeight(), width: f.innerWidth() },
            k = d.offset(),
            m = b("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(a.className).css({ top: k.top - h, left: k.left - e, height: d.innerHeight(), width: d.innerWidth(), position: g ? "fixed" : "absolute" }).animate(f, a.duration, a.easing, function() { m.remove();
                c() }) };
    b.widget("ui.progressbar", {
        version: "1.11.2",
        options: { max: 100, value: 0, change: null, complete: null },
        min: 0,
        _create: function() { this.oldValue = this.options.value = this._constrainedValue();
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({ role: "progressbar", "aria-valuemin": this.min });
            this.valueDiv = b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
            this._refreshValue() },
        _destroy: function() {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.valueDiv.remove()
        },
        value: function(a) {
            if (void 0 === a) return this.options.value;
            this.options.value = this._constrainedValue(a);
            this._refreshValue() },
        _constrainedValue: function(a) { void 0 === a && (a = this.options.value);
            this.indeterminate = !1 === a; "number" !== typeof a && (a = 0);
            return this.indeterminate ? !1 : Math.min(this.options.max, Math.max(this.min, a)) },
        _setOptions: function(a) {
            var b = a.value;
            delete a.value;
            this._super(a);
            this.options.value = this._constrainedValue(b);
            this._refreshValue() },
        _setOption: function(a,
            b) { "max" === a && (b = Math.max(this.min, b)); "disabled" === a && this.element.toggleClass("ui-state-disabled", !!b).attr("aria-disabled", b);
            this._super(a, b) },
        _percentage: function() {
            return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min) },
        _refreshValue: function() {
            var a = this.options.value,
                c = this._percentage();
            this.valueDiv.toggle(this.indeterminate || a > this.min).toggleClass("ui-corner-right", a === this.options.max).width(c.toFixed(0) + "%");
            this.element.toggleClass("ui-progressbar-indeterminate",
                this.indeterminate);
            this.indeterminate ? (this.element.removeAttr("aria-valuenow"), this.overlayDiv || (this.overlayDiv = b("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))) : (this.element.attr({ "aria-valuemax": this.options.max, "aria-valuenow": a }), this.overlayDiv && (this.overlayDiv.remove(), this.overlayDiv = null));
            this.oldValue !== a && (this.oldValue = a, this._trigger("change"));
            a === this.options.max && this._trigger("complete")
        }
    });
    b.widget("ui.selectable", b.ui.mouse, {
        version: "1.11.2",
        options: {
            appendTo: "body",
            autoRefresh: !0,
            distance: 0,
            filter: "*",
            tolerance: "touch",
            selected: null,
            selecting: null,
            start: null,
            stop: null,
            unselected: null,
            unselecting: null
        },
        _create: function() {
            var a, c = this;
            this.element.addClass("ui-selectable");
            this.dragged = !1;
            this.refresh = function() {
                a = b(c.options.filter, c.element[0]);
                a.addClass("ui-selectee");
                a.each(function() {
                    var a = b(this),
                        c = a.offset();
                    b.data(this, "selectable-item", {
                        element: this,
                        $element: a,
                        left: c.left,
                        top: c.top,
                        right: c.left + a.outerWidth(),
                        bottom: c.top + a.outerHeight(),
                        startselected: !1,
                        selected: a.hasClass("ui-selected"),
                        selecting: a.hasClass("ui-selecting"),
                        unselecting: a.hasClass("ui-unselecting")
                    })
                })
            };
            this.refresh();
            this.selectees = a.addClass("ui-selectee");
            this._mouseInit();
            this.helper = b("<div class='ui-selectable-helper'></div>")
        },
        _destroy: function() { this.selectees.removeClass("ui-selectee").removeData("selectable-item");
            this.element.removeClass("ui-selectable ui-selectable-disabled");
            this._mouseDestroy() },
        _mouseStart: function(a) {
            var c = this,
                d = this.options;
            this.opos = [a.pageX, a.pageY];
            this.options.disabled || (this.selectees = b(d.filter, this.element[0]), this._trigger("start", a), b(d.appendTo).append(this.helper), this.helper.css({ left: a.pageX, top: a.pageY, width: 0, height: 0 }), d.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function() {
                    var d = b.data(this, "selectable-item");
                    d.startselected = !0;
                    a.metaKey || a.ctrlKey || (d.$element.removeClass("ui-selected"), d.selected = !1, d.$element.addClass("ui-unselecting"), d.unselecting = !0, c._trigger("unselecting", a, { unselecting: d.element })) }),
                b(a.target).parents().addBack().each(function() {
                    var d, g = b.data(this, "selectable-item");
                    if (g) return d = !a.metaKey && !a.ctrlKey || !g.$element.hasClass("ui-selected"), g.$element.removeClass(d ? "ui-unselecting" : "ui-selected").addClass(d ? "ui-selecting" : "ui-unselecting"), g.unselecting = !d, g.selecting = d, (g.selected = d) ? c._trigger("selecting", a, { selecting: g.element }) : c._trigger("unselecting", a, { unselecting: g.element }), !1 }))
        },
        _mouseDrag: function(a) {
            this.dragged = !0;
            if (!this.options.disabled) {
                var c, d = this,
                    f = this.options,
                    g = this.opos[0],
                    e = this.opos[1],
                    h = a.pageX,
                    k = a.pageY;
                g > h && (c = h, h = g, g = c);
                e > k && (c = k, k = e, e = c);
                this.helper.css({ left: g, top: e, width: h - g, height: k - e });
                this.selectees.each(function() {
                    var c = b.data(this, "selectable-item"),
                        l = !1;
                    c && c.element !== d.element[0] && ("touch" === f.tolerance ? l = !(c.left > h || c.right < g || c.top > k || c.bottom < e) : "fit" === f.tolerance && (l = c.left > g && c.right < h && c.top > e && c.bottom < k), l ? (c.selected && (c.$element.removeClass("ui-selected"), c.selected = !1), c.unselecting && (c.$element.removeClass("ui-unselecting"),
                        c.unselecting = !1), c.selecting || (c.$element.addClass("ui-selecting"), c.selecting = !0, d._trigger("selecting", a, { selecting: c.element }))) : (c.selecting && ((a.metaKey || a.ctrlKey) && c.startselected ? (c.$element.removeClass("ui-selecting"), c.selecting = !1, c.$element.addClass("ui-selected"), c.selected = !0) : (c.$element.removeClass("ui-selecting"), c.selecting = !1, c.startselected && (c.$element.addClass("ui-unselecting"), c.unselecting = !0), d._trigger("unselecting", a, { unselecting: c.element }))), !c.selected || a.metaKey || a.ctrlKey ||
                        c.startselected || (c.$element.removeClass("ui-selected"), c.selected = !1, c.$element.addClass("ui-unselecting"), c.unselecting = !0, d._trigger("unselecting", a, { unselecting: c.element }))))
                });
                return !1
            }
        },
        _mouseStop: function(a) {
            var c = this;
            this.dragged = !1;
            b(".ui-unselecting", this.element[0]).each(function() {
                var d = b.data(this, "selectable-item");
                d.$element.removeClass("ui-unselecting");
                d.unselecting = !1;
                d.startselected = !1;
                c._trigger("unselected", a, { unselected: d.element }) });
            b(".ui-selecting", this.element[0]).each(function() {
                var d =
                    b.data(this, "selectable-item");
                d.$element.removeClass("ui-selecting").addClass("ui-selected");
                d.selecting = !1;
                d.selected = !0;
                d.startselected = !0;
                c._trigger("selected", a, { selected: d.element })
            });
            this._trigger("stop", a);
            this.helper.remove();
            return !1
        }
    });
    b.widget("ui.selectmenu", {
        version: "1.11.2",
        defaultElement: "<select>",
        options: {
            appendTo: null,
            disabled: null,
            icons: { button: "ui-icon-triangle-1-s" },
            position: { my: "left top", at: "left bottom", collision: "none" },
            width: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            select: null
        },
        _create: function() {
            var a = this.element.uniqueId().attr("id");
            this.ids = { element: a, button: a + "-button", menu: a + "-menu" };
            this._drawButton();
            this._drawMenu();
            this.options.disabled && this.disable() },
        _drawButton: function() {
            var a = this,
                c = this.element.attr("tabindex");
            this.label = b("label[for='" + this.ids.element + "']").attr("for", this.ids.button);
            this._on(this.label, { click: function(a) { this.button.focus();
                    a.preventDefault() } });
            this.element.hide();
            this.button = b("<span>", {
                "class": "ui-selectmenu-button ui-widget ui-state-default ui-corner-all",
                tabindex: c || this.options.disabled ? -1 : 0,
                id: this.ids.button,
                role: "combobox",
                "aria-expanded": "false",
                "aria-autocomplete": "list",
                "aria-owns": this.ids.menu,
                "aria-haspopup": "true"
            }).insertAfter(this.element);
            b("<span>", { "class": "ui-icon " + this.options.icons.button }).prependTo(this.button);
            this.buttonText = b("<span>", { "class": "ui-selectmenu-text" }).appendTo(this.button);
            this._setText(this.buttonText, this.element.find("option:selected").text());
            this._resizeButton();
            this._on(this.button, this._buttonEvents);
            this.button.one("focusin", function() { a.menuItems || a._refreshMenu() });
            this._hoverable(this.button);
            this._focusable(this.button)
        },
        _drawMenu: function() {
            var a = this;
            this.menu = b("<ul>", { "aria-hidden": "true", "aria-labelledby": this.ids.button, id: this.ids.menu });
            this.menuWrap = b("<div>", { "class": "ui-selectmenu-menu ui-front" }).append(this.menu).appendTo(this._appendTo());
            this.menuInstance = this.menu.menu({
                role: "listbox",
                select: function(b, d) {
                    b.preventDefault();
                    a._setSelection();
                    a._select(d.item.data("ui-selectmenu-item"),
                        b)
                },
                focus: function(b, d) {
                    var c = d.item.data("ui-selectmenu-item");
                    null != a.focusIndex && c.index !== a.focusIndex && (a._trigger("focus", b, { item: c }), a.isOpen || a._select(c, b));
                    a.focusIndex = c.index;
                    a.button.attr("aria-activedescendant", a.menuItems.eq(c.index).attr("id")) }
            }).menu("instance");
            this.menu.addClass("ui-corner-bottom").removeClass("ui-corner-all");
            this.menuInstance._off(this.menu, "mouseleave");
            this.menuInstance._closeOnDocumentClick = function() {
                return !1 };
            this.menuInstance._isDivider = function() {
                return !1 }
        },
        refresh: function() { this._refreshMenu();
            this._setText(this.buttonText, this._getSelectedItem().text());
            this.options.width || this._resizeButton() },
        _refreshMenu: function() {
            this.menu.empty();
            var a;
            a = this.element.find("option");
            a.length && (this._parseOptions(a), this._renderMenu(this.menu, this.items), this.menuInstance.refresh(), this.menuItems = this.menu.find("li").not(".ui-selectmenu-optgroup"), a = this._getSelectedItem(), this.menuInstance.focus(null, a), this._setAria(a.data("ui-selectmenu-item")), this._setOption("disabled",
                this.element.prop("disabled")))
        },
        open: function(a) { this.options.disabled || (this.menuItems ? (this.menu.find(".ui-state-focus").removeClass("ui-state-focus"), this.menuInstance.focus(null, this._getSelectedItem())) : this._refreshMenu(), this.isOpen = !0, this._toggleAttr(), this._resizeMenu(), this._position(), this._on(this.document, this._documentClick), this._trigger("open", a)) },
        _position: function() { this.menuWrap.position(b.extend({ of: this.button }, this.options.position)) },
        close: function(a) {
            this.isOpen && (this.isOpen = !1, this._toggleAttr(), this.range = null, this._off(this.document), this._trigger("close", a))
        },
        widget: function() {
            return this.button },
        menuWidget: function() {
            return this.menu },
        _renderMenu: function(a, c) {
            var d = this,
                f = "";
            b.each(c, function(c, e) { e.optgroup !== f && (b("<li>", { "class": "ui-selectmenu-optgroup ui-menu-divider" + (e.element.parent("optgroup").prop("disabled") ? " ui-state-disabled" : ""), text: e.optgroup }).appendTo(a), f = e.optgroup);
                d._renderItemData(a, e) }) },
        _renderItemData: function(a, b) {
            return this._renderItem(a,
                b).data("ui-selectmenu-item", b)
        },
        _renderItem: function(a, c) {
            var d = b("<li>");
            c.disabled && d.addClass("ui-state-disabled");
            this._setText(d, c.label);
            return d.appendTo(a) },
        _setText: function(a, b) { b ? a.text(b) : a.html("&#160;") },
        _move: function(a, b) {
            var c, f = ".ui-menu-item";
            this.isOpen ? c = this.menuItems.eq(this.focusIndex) : (c = this.menuItems.eq(this.element[0].selectedIndex), f += ":not(.ui-state-disabled)");
            c = "first" === a || "last" === a ? c["first" === a ? "prevAll" : "nextAll"](f).eq(-1) : c[a + "All"](f).eq(0);
            c.length && this.menuInstance.focus(b,
                c)
        },
        _getSelectedItem: function() {
            return this.menuItems.eq(this.element[0].selectedIndex) },
        _toggle: function(a) { this[this.isOpen ? "close" : "open"](a) },
        _setSelection: function() {
            var a;
            this.range && (window.getSelection ? (a = window.getSelection(), a.removeAllRanges(), a.addRange(this.range)) : this.range.select(), this.button.focus()) },
        _documentClick: { mousedown: function(a) { this.isOpen && (b(a.target).closest(".ui-selectmenu-menu, #" + this.ids.button).length || this.close(a)) } },
        _buttonEvents: {
            mousedown: function() {
                var a;
                window.getSelection ? (a = window.getSelection(), a.rangeCount && (this.range = a.getRangeAt(0))) : this.range = document.selection.createRange()
            },
            click: function(a) { this._setSelection();
                this._toggle(a) },
            keydown: function(a) {
                var c = !0;
                switch (a.keyCode) {
                    case b.ui.keyCode.TAB:
                    case b.ui.keyCode.ESCAPE:
                        this.close(a);
                        c = !1;
                        break;
                    case b.ui.keyCode.ENTER:
                        this.isOpen && this._selectFocusedItem(a);
                        break;
                    case b.ui.keyCode.UP:
                        a.altKey ? this._toggle(a) : this._move("prev", a);
                        break;
                    case b.ui.keyCode.DOWN:
                        a.altKey ? this._toggle(a) : this._move("next",
                            a);
                        break;
                    case b.ui.keyCode.SPACE:
                        this.isOpen ? this._selectFocusedItem(a) : this._toggle(a);
                        break;
                    case b.ui.keyCode.LEFT:
                        this._move("prev", a);
                        break;
                    case b.ui.keyCode.RIGHT:
                        this._move("next", a);
                        break;
                    case b.ui.keyCode.HOME:
                    case b.ui.keyCode.PAGE_UP:
                        this._move("first", a);
                        break;
                    case b.ui.keyCode.END:
                    case b.ui.keyCode.PAGE_DOWN:
                        this._move("last", a);
                        break;
                    default:
                        this.menu.trigger(a), c = !1
                }
                c && a.preventDefault()
            }
        },
        _selectFocusedItem: function(a) {
            var b = this.menuItems.eq(this.focusIndex);
            b.hasClass("ui-state-disabled") ||
                this._select(b.data("ui-selectmenu-item"), a)
        },
        _select: function(a, b) {
            var c = this.element[0].selectedIndex;
            this.element[0].selectedIndex = a.index;
            this._setText(this.buttonText, a.label);
            this._setAria(a);
            this._trigger("select", b, { item: a });
            a.index !== c && this._trigger("change", b, { item: a });
            this.close(b) },
        _setAria: function(a) { a = this.menuItems.eq(a.index).attr("id");
            this.button.attr({ "aria-labelledby": a, "aria-activedescendant": a });
            this.menu.attr("aria-activedescendant", a) },
        _setOption: function(a, b) {
            "icons" ===
            a && this.button.find("span.ui-icon").removeClass(this.options.icons.button).addClass(b.button);
            this._super(a, b);
            "appendTo" === a && this.menuWrap.appendTo(this._appendTo());
            "disabled" === a && (this.menuInstance.option("disabled", b), this.button.toggleClass("ui-state-disabled", b).attr("aria-disabled", b), this.element.prop("disabled", b), b ? (this.button.attr("tabindex", -1), this.close()) : this.button.attr("tabindex", 0));
            "width" === a && this._resizeButton()
        },
        _appendTo: function() {
            var a = this.options.appendTo;
            a && (a = a.jquery ||
                a.nodeType ? b(a) : this.document.find(a).eq(0));
            a && a[0] || (a = this.element.closest(".ui-front"));
            a.length || (a = this.document[0].body);
            return a
        },
        _toggleAttr: function() { this.button.toggleClass("ui-corner-top", this.isOpen).toggleClass("ui-corner-all", !this.isOpen).attr("aria-expanded", this.isOpen);
            this.menuWrap.toggleClass("ui-selectmenu-open", this.isOpen);
            this.menu.attr("aria-hidden", !this.isOpen) },
        _resizeButton: function() {
            var a = this.options.width;
            a || (a = this.element.show().outerWidth(), this.element.hide());
            this.button.outerWidth(a)
        },
        _resizeMenu: function() { this.menu.outerWidth(Math.max(this.button.outerWidth(), this.menu.width("").outerWidth() + 1)) },
        _getCreateOptions: function() {
            return { disabled: this.element.prop("disabled") } },
        _parseOptions: function(a) {
            var c = [];
            a.each(function(a, f) {
                var d = b(f),
                    e = d.parent("optgroup");
                c.push({ element: d, index: a, value: d.attr("value"), label: d.text(), optgroup: e.attr("label") || "", disabled: e.prop("disabled") || d.prop("disabled") }) });
            this.items = c },
        _destroy: function() {
            this.menuWrap.remove();
            this.button.remove();
            this.element.show();
            this.element.removeUniqueId();
            this.label.attr("for", this.ids.element)
        }
    });
    b.widget("ui.slider", b.ui.mouse, {
        version: "1.11.2",
        widgetEventPrefix: "slide",
        options: { animate: !1, distance: 0, max: 100, min: 0, orientation: "horizontal", range: !1, step: 1, value: 0, values: null, change: null, slide: null, start: null, stop: null },
        numPages: 5,
        _create: function() {
            this._mouseSliding = this._keySliding = !1;
            this._animateOff = !0;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this._calculateNewMax();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            this._refresh();
            this._setOption("disabled", this.options.disabled);
            this._animateOff = !1
        },
        _refresh: function() { this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue() },
        _createHandles: function() {
            var a, c;
            a = this.options;
            var d = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                f = [];
            c = a.values && a.values.length || 1;
            d.length > c && (d.slice(c).remove(),
                d = d.slice(0, c));
            for (a = d.length; a < c; a++) f.push("<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>");
            this.handles = d.add(b(f.join("")).appendTo(this.element));
            this.handle = this.handles.eq(0);
            this.handles.each(function(a) { b(this).data("ui-slider-handle-index", a) })
        },
        _createRange: function() {
            var a = this.options,
                c = "";
            a.range ? (!0 === a.range && (a.values ? a.values.length && 2 !== a.values.length ? a.values = [a.values[0], a.values[0]] : b.isArray(a.values) && (a.values = a.values.slice(0)) : a.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({ left: "", bottom: "" }) : (this.range = b("<div></div>").appendTo(this.element), c = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(c + ("min" === a.range || "max" === a.range ? " ui-slider-range-" + a.range : ""))) : (this.range && this.range.remove(), this.range = null)
        },
        _setupEvents: function() {
            this._off(this.handles);
            this._on(this.handles, this._handleEvents);
            this._hoverable(this.handles);
            this._focusable(this.handles)
        },
        _destroy: function() { this.handles.remove();
            this.range && this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all");
            this._mouseDestroy() },
        _mouseCapture: function(a) {
            var c, d, f, g, e, h = this,
                k = this.options;
            if (k.disabled) return !1;
            this.elementSize = { width: this.element.outerWidth(), height: this.element.outerHeight() };
            this.elementOffset = this.element.offset();
            c = this._normValueFromMouse({ x: a.pageX, y: a.pageY });
            d = this._valueMax() - this._valueMin() + 1;
            this.handles.each(function(a) {
                var e = Math.abs(c - h.values(a));
                if (d > e || d === e && (a === h._lastChangedValue || h.values(a) === k.min)) d = e, f = b(this), g = a });
            if (!1 === this._start(a, g)) return !1;
            this._mouseSliding = !0;
            this._handleIndex = g;
            f.addClass("ui-state-active").focus();
            e = f.offset();
            this._clickOffset = b(a.target).parents().addBack().is(".ui-slider-handle") ? {
                left: a.pageX - e.left - f.width() / 2,
                top: a.pageY - e.top - f.height() / 2 - (parseInt(f.css("borderTopWidth"), 10) || 0) - (parseInt(f.css("borderBottomWidth"),
                    10) || 0) + (parseInt(f.css("marginTop"), 10) || 0)
            } : { left: 0, top: 0 };
            this.handles.hasClass("ui-state-hover") || this._slide(a, g, c);
            return this._animateOff = !0
        },
        _mouseStart: function() {
            return !0 },
        _mouseDrag: function(a) {
            var b = this._normValueFromMouse({ x: a.pageX, y: a.pageY });
            this._slide(a, this._handleIndex, b);
            return !1 },
        _mouseStop: function(a) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = !1;
            this._stop(a, this._handleIndex);
            this._change(a, this._handleIndex);
            this._clickOffset = this._handleIndex = null;
            return this._animateOff = !1
        },
        _detectOrientation: function() { this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal" },
        _normValueFromMouse: function(a) {
            var b;
            "horizontal" === this.orientation ? (b = this.elementSize.width, a = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (b = this.elementSize.height, a = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0));
            b = a / b;
            1 < b && (b = 1);
            0 > b && (b = 0);
            "vertical" === this.orientation && (b = 1 - b);
            a = this._valueMax() - this._valueMin();
            b = this._valueMin() +
                b * a;
            return this._trimAlignValue(b)
        },
        _start: function(a, b) {
            var c = { handle: this.handles[b], value: this.value() };
            this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values());
            return this._trigger("start", a, c) },
        _slide: function(a, b, d) {
            var c;
            this.options.values && this.options.values.length ? (c = this.values(b ? 0 : 1), 2 === this.options.values.length && !0 === this.options.range && (0 === b && d > c || 1 === b && d < c) && (d = c), d !== this.values(b) && (c = this.values(), c[b] = d, a = this._trigger("slide", a, {
                handle: this.handles[b],
                value: d,
                values: c
            }), this.values(b ? 0 : 1), !1 !== a && this.values(b, d))) : d !== this.value() && (a = this._trigger("slide", a, { handle: this.handles[b], value: d }), !1 !== a && this.value(d))
        },
        _stop: function(a, b) {
            var c = { handle: this.handles[b], value: this.value() };
            this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values());
            this._trigger("stop", a, c) },
        _change: function(a, b) {
            if (!this._keySliding && !this._mouseSliding) {
                var c = { handle: this.handles[b], value: this.value() };
                this.options.values && this.options.values.length &&
                    (c.value = this.values(b), c.values = this.values());
                this._lastChangedValue = b;
                this._trigger("change", a, c)
            }
        },
        value: function(a) {
            if (arguments.length) this.options.value = this._trimAlignValue(a), this._refreshValue(), this._change(null, 0);
            else return this._value() },
        values: function(a, c) {
            var d, f, g;
            if (1 < arguments.length) this.options.values[a] = this._trimAlignValue(c), this._refreshValue(), this._change(null, a);
            else if (arguments.length)
                if (b.isArray(arguments[0])) {
                    d = this.options.values;
                    f = arguments[0];
                    for (g = 0; g < d.length; g +=
                        1) d[g] = this._trimAlignValue(f[g]), this._change(null, g);
                    this._refreshValue()
                } else return this.options.values && this.options.values.length ? this._values(a) : this.value();
            else return this._values()
        },
        _setOption: function(a, c) {
            var d, f = 0;
            "range" === a && !0 === this.options.range && ("min" === c ? (this.options.value = this._values(0), this.options.values = null) : "max" === c && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null));
            b.isArray(this.options.values) && (f = this.options.values.length);
            "disabled" === a && this.element.toggleClass("ui-state-disabled", !!c);
            this._super(a, c);
            switch (a) {
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    this.handles.css("horizontal" === c ? "bottom" : "left", "");
                    break;
                case "value":
                    this._animateOff = !0;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = !1;
                    break;
                case "values":
                    this._animateOff = !0;
                    this._refreshValue();
                    for (d = 0; d < f; d += 1) this._change(null,
                        d);
                    this._animateOff = !1;
                    break;
                case "step":
                case "min":
                case "max":
                    this._animateOff = !0;
                    this._calculateNewMax();
                    this._refreshValue();
                    this._animateOff = !1;
                    break;
                case "range":
                    this._animateOff = !0, this._refresh(), this._animateOff = !1
            }
        },
        _value: function() {
            var a = this.options.value;
            return a = this._trimAlignValue(a) },
        _values: function(a) {
            var b, d;
            if (arguments.length) return b = this.options.values[a], b = this._trimAlignValue(b);
            if (this.options.values && this.options.values.length) {
                b = this.options.values.slice();
                for (d = 0; d < b.length; d +=
                    1) b[d] = this._trimAlignValue(b[d]);
                return b
            }
            return []
        },
        _trimAlignValue: function(a) {
            if (a <= this._valueMin()) return this._valueMin();
            if (a >= this._valueMax()) return this._valueMax();
            var b = 0 < this.options.step ? this.options.step : 1,
                d = (a - this._valueMin()) % b;
            a -= d;
            2 * Math.abs(d) >= b && (a += 0 < d ? b : -b);
            return parseFloat(a.toFixed(5)) },
        _calculateNewMax: function() {
            var a = (this.options.max - this._valueMin()) % this.options.step;
            this.max = this.options.max - a },
        _valueMin: function() {
            return this.options.min },
        _valueMax: function() {
            return this.max },
        _refreshValue: function() {
            var a, c, d, f, g, e = this.options.range,
                h = this.options,
                k = this,
                l = this._animateOff ? !1 : h.animate,
                n = {};
            if (this.options.values && this.options.values.length) this.handles.each(function(d) {
                c = (k.values(d) - k._valueMin()) / (k._valueMax() - k._valueMin()) * 100;
                n["horizontal" === k.orientation ? "left" : "bottom"] = c + "%";
                b(this).stop(1, 1)[l ? "animate" : "css"](n, h.animate);
                if (!0 === k.options.range)
                    if ("horizontal" === k.orientation) {
                        if (0 === d) k.range.stop(1, 1)[l ? "animate" : "css"]({ left: c + "%" }, h.animate);
                        if (1 ===
                            d) k.range[l ? "animate" : "css"]({ width: c - a + "%" }, { queue: !1, duration: h.animate })
                    } else {
                        if (0 === d) k.range.stop(1, 1)[l ? "animate" : "css"]({ bottom: c + "%" }, h.animate);
                        if (1 === d) k.range[l ? "animate" : "css"]({ height: c - a + "%" }, { queue: !1, duration: h.animate }) }
                a = c
            });
            else {
                d = this.value();
                f = this._valueMin();
                g = this._valueMax();
                c = g !== f ? (d - f) / (g - f) * 100 : 0;
                n["horizontal" === this.orientation ? "left" : "bottom"] = c + "%";
                this.handle.stop(1, 1)[l ? "animate" : "css"](n, h.animate);
                if ("min" === e && "horizontal" === this.orientation) this.range.stop(1,
                    1)[l ? "animate" : "css"]({ width: c + "%" }, h.animate);
                if ("max" === e && "horizontal" === this.orientation) this.range[l ? "animate" : "css"]({ width: 100 - c + "%" }, { queue: !1, duration: h.animate });
                if ("min" === e && "vertical" === this.orientation) this.range.stop(1, 1)[l ? "animate" : "css"]({ height: c + "%" }, h.animate);
                if ("max" === e && "vertical" === this.orientation) this.range[l ? "animate" : "css"]({ height: 100 - c + "%" }, { queue: !1, duration: h.animate })
            }
        },
        _handleEvents: {
            keydown: function(a) {
                var c, d, f, g = b(a.target).data("ui-slider-handle-index");
                switch (a.keyCode) {
                    case b.ui.keyCode.HOME:
                    case b.ui.keyCode.END:
                    case b.ui.keyCode.PAGE_UP:
                    case b.ui.keyCode.PAGE_DOWN:
                    case b.ui.keyCode.UP:
                    case b.ui.keyCode.RIGHT:
                    case b.ui.keyCode.DOWN:
                    case b.ui.keyCode.LEFT:
                        if (a.preventDefault(), !this._keySliding && (this._keySliding = !0, b(a.target).addClass("ui-state-active"), c = this._start(a, g), !1 === c)) return
                }
                f = this.options.step;
                c = this.options.values && this.options.values.length ? d = this.values(g) : d = this.value();
                switch (a.keyCode) {
                    case b.ui.keyCode.HOME:
                        d = this._valueMin();
                        break;
                    case b.ui.keyCode.END:
                        d = this._valueMax();
                        break;
                    case b.ui.keyCode.PAGE_UP:
                        d = this._trimAlignValue(c + (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case b.ui.keyCode.PAGE_DOWN:
                        d = this._trimAlignValue(c - (this._valueMax() -
                            this._valueMin()) / this.numPages);
                        break;
                    case b.ui.keyCode.UP:
                    case b.ui.keyCode.RIGHT:
                        if (c === this._valueMax()) return;
                        d = this._trimAlignValue(c + f);
                        break;
                    case b.ui.keyCode.DOWN:
                    case b.ui.keyCode.LEFT:
                        if (c === this._valueMin()) return;
                        d = this._trimAlignValue(c - f)
                }
                this._slide(a, g, d)
            },
            keyup: function(a) {
                var c = b(a.target).data("ui-slider-handle-index");
                this._keySliding && (this._keySliding = !1, this._stop(a, c), this._change(a, c), b(a.target).removeClass("ui-state-active")) }
        }
    });
    b.widget("ui.sortable", b.ui.mouse, {
        version: "1.11.2",
        widgetEventPrefix: "sort",
        ready: !1,
        options: { appendTo: "parent", axis: !1, connectWith: !1, containment: !1, cursor: "auto", cursorAt: !1, dropOnEmpty: !0, forcePlaceholderSize: !1, forceHelperSize: !1, grid: !1, handle: !1, helper: "original", items: "> *", opacity: !1, placeholder: !1, revert: !1, scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, scope: "default", tolerance: "intersect", zIndex: 1E3, activate: null, beforeStop: null, change: null, deactivate: null, out: null, over: null, receive: null, remove: null, sort: null, start: null, stop: null, update: null },
        _isOverAxis: function(a, b, d) {
            return a >= b && a < b + d },
        _isFloating: function(a) {
            return /left|right/.test(a.css("float")) || /inline|table-cell/.test(a.css("display")) },
        _create: function() {
            var a = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");
            this.refresh();
            this.floating = this.items.length ? "x" === a.axis || this._isFloating(this.items[0].item) : !1;
            this.offset = this.element.offset();
            this._mouseInit();
            this._setHandleClassName();
            this.ready = !0 },
        _setOption: function(a, b) {
            this._super(a, b);
            "handle" ===
            a && this._setHandleClassName()
        },
        _setHandleClassName: function() { this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle");
            b.each(this.items, function() {
                (this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item).addClass("ui-sortable-handle") }) },
        _destroy: function() {
            this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle");
            this._mouseDestroy();
            for (var a = this.items.length - 1; 0 <= a; a--) this.items[a].item.removeData(this.widgetName +
                "-item");
            return this
        },
        _mouseCapture: function(a, c) {
            var d = null,
                f = !1,
                g = this;
            if (this.reverting || this.options.disabled || "static" === this.options.type) return !1;
            this._refreshItems(a);
            b(a.target).parents().each(function() {
                if (b.data(this, g.widgetName + "-item") === g) return d = b(this), !1 });
            b.data(a.target, g.widgetName + "-item") === g && (d = b(a.target));
            if (!d || this.options.handle && !c && (b(this.options.handle, d).find("*").addBack().each(function() { this === a.target && (f = !0) }), !f)) return !1;
            this.currentItem = d;
            this._removeCurrentsFromItems();
            return !0
        },
        _mouseStart: function(a, c, d) {
            var f;
            c = this.options;
            this.currentContainer = this;
            this.refreshPositions();
            this.helper = this._createHelper(a);
            this._cacheHelperProportions();
            this._cacheMargins();
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.currentItem.offset();
            this.offset = { top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left };
            b.extend(this.offset, { click: { left: a.pageX - this.offset.left, top: a.pageY - this.offset.top }, parent: this._getParentOffset(), relative: this._getRelativeOffset() });
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");
            this.originalPosition = this._generatePosition(a);
            this.originalPageX = a.pageX;
            this.originalPageY = a.pageY;
            c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt);
            this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };
            this.helper[0] !== this.currentItem[0] && this.currentItem.hide();
            this._createPlaceholder();
            c.containment && this._setContainment();
            c.cursor && "auto" !== c.cursor && (f = this.document.find("body"),
                this.storedCursor = f.css("cursor"), f.css("cursor", c.cursor), this.storedStylesheet = b("<style>*{ cursor: " + c.cursor + " !important; }</style>").appendTo(f));
            c.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", c.opacity));
            c.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", c.zIndex));
            this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset());
            this._trigger("start", a, this._uiHash());
            this._preserveHelperProportions || this._cacheHelperProportions();
            if (!d)
                for (d = this.containers.length - 1; 0 <= d; d--) this.containers[d]._trigger("activate", a, this._uiHash(this));
            b.ui.ddmanager && (b.ui.ddmanager.current = this);
            b.ui.ddmanager && !c.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, a);
            this.dragging = !0;
            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(a);
            return !0
        },
        _mouseDrag: function(a) {
            var c, d, f, g;
            c = this.options;
            d = !1;
            this.position = this._generatePosition(a);
            this.positionAbs = this._convertPositionTo("absolute");
            this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs);
            this.options.scroll && (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - a.pageY < c.scrollSensitivity ? this.scrollParent[0].scrollTop = d = this.scrollParent[0].scrollTop + c.scrollSpeed : a.pageY - this.overflowOffset.top < c.scrollSensitivity && (this.scrollParent[0].scrollTop = d = this.scrollParent[0].scrollTop - c.scrollSpeed),
                this.overflowOffset.left + this.scrollParent[0].offsetWidth - a.pageX < c.scrollSensitivity ? this.scrollParent[0].scrollLeft = d = this.scrollParent[0].scrollLeft + c.scrollSpeed : a.pageX - this.overflowOffset.left < c.scrollSensitivity && (this.scrollParent[0].scrollLeft = d = this.scrollParent[0].scrollLeft - c.scrollSpeed)) : (a.pageY - b(document).scrollTop() < c.scrollSensitivity ? d = b(document).scrollTop(b(document).scrollTop() - c.scrollSpeed) : b(window).height() - (a.pageY - b(document).scrollTop()) < c.scrollSensitivity && (d = b(document).scrollTop(b(document).scrollTop() +
                c.scrollSpeed)), a.pageX - b(document).scrollLeft() < c.scrollSensitivity ? d = b(document).scrollLeft(b(document).scrollLeft() - c.scrollSpeed) : b(window).width() - (a.pageX - b(document).scrollLeft()) < c.scrollSensitivity && (d = b(document).scrollLeft(b(document).scrollLeft() + c.scrollSpeed))), !1 !== d && b.ui.ddmanager && !c.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, a));
            this.positionAbs = this._convertPositionTo("absolute");
            this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px");
            this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px");
            for (c = this.items.length - 1; 0 <= c; c--)
                if (d = this.items[c], f = d.item[0], (g = this._intersectsWithPointer(d)) && d.instance === this.currentContainer && f !== this.currentItem[0] && this.placeholder[1 === g ? "next" : "prev"]()[0] !== f && !b.contains(this.placeholder[0], f) && ("semi-dynamic" === this.options.type ? !b.contains(this.element[0], f) : 1)) {
                    this.direction = 1 === g ? "down" : "up";
                    if ("pointer" === this.options.tolerance || this._intersectsWithSides(d)) this._rearrange(a,
                        d);
                    else break;
                    this._trigger("change", a, this._uiHash());
                    break
                }
            this._contactContainers(a);
            b.ui.ddmanager && b.ui.ddmanager.drag(this, a);
            this._trigger("sort", a, this._uiHash());
            this.lastPositionAbs = this.positionAbs;
            return !1
        },
        _mouseStop: function(a, c) {
            if (a) {
                b.ui.ddmanager && !this.options.dropBehaviour && b.ui.ddmanager.drop(this, a);
                if (this.options.revert) {
                    var d = this,
                        f = this.placeholder.offset(),
                        g = this.options.axis,
                        e = {};
                    g && "x" !== g || (e.left = f.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] ===
                        document.body ? 0 : this.offsetParent[0].scrollLeft));
                    g && "y" !== g || (e.top = f.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop));
                    this.reverting = !0;
                    b(this.helper).animate(e, parseInt(this.options.revert, 10) || 500, function() { d._clear(a) })
                } else this._clear(a, c);
                return !1
            }
        },
        cancel: function() {
            if (this.dragging) {
                this._mouseUp({ target: null });
                "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var a = this.containers.length - 1; 0 <= a; a--) this.containers[a]._trigger("deactivate", null, this._uiHash(this)), this.containers[a].containerCache.over && (this.containers[a]._trigger("out", null, this._uiHash(this)), this.containers[a].containerCache.over = 0)
            }
            this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), b.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }), this.domPosition.prev ? b(this.domPosition.prev).after(this.currentItem) : b(this.domPosition.parent).prepend(this.currentItem));
            return this
        },
        serialize: function(a) {
            var c = this._getItemsAsjQuery(a && a.connected),
                d = [];
            a = a || {};
            b(c).each(function() {
                var c = (b(a.item || this).attr(a.attribute || "id") || "").match(a.expression || /(.+)[\-=_](.+)/);
                c && d.push((a.key || c[1] + "[]") + "=" + (a.key && a.expression ? c[1] : c[2])) });!d.length && a.key && d.push(a.key + "=");
            return d.join("&") },
        toArray: function(a) {
            var c =
                this._getItemsAsjQuery(a && a.connected),
                d = [];
            a = a || {};
            c.each(function() { d.push(b(a.item || this).attr(a.attribute || "id") || "") });
            return d
        },
        _intersectsWith: function(a) {
            var b = this.positionAbs.left,
                d = b + this.helperProportions.width,
                f = this.positionAbs.top,
                g = f + this.helperProportions.height,
                e = a.left,
                h = e + a.width,
                k = a.top,
                l = k + a.height,
                n = this.offset.click.top,
                r = this.offset.click.left,
                n = "x" === this.options.axis || f + n > k && f + n < l,
                r = "y" === this.options.axis || b + r > e && b + r < h;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers ||
                "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? n && r : e < b + this.helperProportions.width / 2 && d - this.helperProportions.width / 2 < h && k < f + this.helperProportions.height / 2 && g - this.helperProportions.height / 2 < l
        },
        _intersectsWithPointer: function(a) {
            var b = "x" === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, a.top, a.height);
            a = "y" === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left,
                a.left, a.width);
            b = b && a;
            a = this._getDragVerticalDirection();
            var d = this._getDragHorizontalDirection();
            return b ? this.floating ? d && "right" === d || "down" === a ? 2 : 1 : a && ("down" === a ? 2 : 1) : !1
        },
        _intersectsWithSides: function(a) {
            var b = this._isOverAxis(this.positionAbs.top + this.offset.click.top, a.top + a.height / 2, a.height);
            a = this._isOverAxis(this.positionAbs.left + this.offset.click.left, a.left + a.width / 2, a.width);
            var d = this._getDragVerticalDirection(),
                f = this._getDragHorizontalDirection();
            return this.floating && f ? "right" ===
                f && a || "left" === f && !a : d && ("down" === d && b || "up" === d && !b)
        },
        _getDragVerticalDirection: function() {
            var a = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 !== a && (0 < a ? "down" : "up") },
        _getDragHorizontalDirection: function() {
            var a = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 !== a && (0 < a ? "right" : "left") },
        refresh: function(a) { this._refreshItems(a);
            this._setHandleClassName();
            this.refreshPositions();
            return this },
        _connectWith: function() {
            var a = this.options;
            return a.connectWith.constructor === String ? [a.connectWith] :
                a.connectWith
        },
        _getItemsAsjQuery: function(a) {
            function c() { e.push(this) }
            var d, f, g, e = [],
                h = [],
                k = this._connectWith();
            if (k && a)
                for (a = k.length - 1; 0 <= a; a--)
                    for (f = b(k[a]), d = f.length - 1; 0 <= d; d--)(g = b.data(f[d], this.widgetFullName)) && g !== this && !g.options.disabled && h.push([b.isFunction(g.options.items) ? g.options.items.call(g.element) : b(g.options.items, g.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), g]);
            h.push([b.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : b(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
            for (a = h.length - 1; 0 <= a; a--) h[a][0].each(c);
            return b(e)
        },
        _removeCurrentsFromItems: function() {
            var a = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = b.grep(this.items, function(b) {
                for (var c = 0; c < a.length; c++)
                    if (a[c] === b.item[0]) return !1;
                return !0 }) },
        _refreshItems: function(a) {
            this.items = [];
            this.containers = [this];
            var c, d, f, g, e, h = this.items,
                k = [
                    [b.isFunction(this.options.items) ?
                        this.options.items.call(this.element[0], a, { item: this.currentItem }) : b(this.options.items, this.element), this
                    ]
                ];
            if ((e = this._connectWith()) && this.ready)
                for (c = e.length - 1; 0 <= c; c--)
                    for (f = b(e[c]), d = f.length - 1; 0 <= d; d--)(g = b.data(f[d], this.widgetFullName)) && g !== this && !g.options.disabled && (k.push([b.isFunction(g.options.items) ? g.options.items.call(g.element[0], a, { item: this.currentItem }) : b(g.options.items, g.element), g]), this.containers.push(g));
            for (c = k.length - 1; 0 <= c; c--)
                for (a = k[c][1], f = k[c][0], d = 0, e = f.length; d <
                    e; d++) g = b(f[d]), g.data(this.widgetName + "-item", a), h.push({ item: g, instance: a, width: 0, height: 0, left: 0, top: 0 })
        },
        refreshPositions: function(a) {
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            var c, d, f;
            for (c = this.items.length - 1; 0 <= c; c--) d = this.items[c], d.instance !== this.currentContainer && this.currentContainer && d.item[0] !== this.currentItem[0] || (f = this.options.toleranceElement ? b(this.options.toleranceElement, d.item) : d.item, a || (d.width = f.outerWidth(), d.height = f.outerHeight()),
                f = f.offset(), d.left = f.left, d.top = f.top);
            if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this);
            else
                for (c = this.containers.length - 1; 0 <= c; c--) f = this.containers[c].element.offset(), this.containers[c].containerCache.left = f.left, this.containers[c].containerCache.top = f.top, this.containers[c].containerCache.width = this.containers[c].element.outerWidth(), this.containers[c].containerCache.height = this.containers[c].element.outerHeight();
            return this
        },
        _createPlaceholder: function(a) {
            a =
                a || this;
            var c, d = a.options;
            d.placeholder && d.placeholder.constructor !== String || (c = d.placeholder, d.placeholder = {
                element: function() {
                    var d = a.currentItem[0].nodeName.toLowerCase(),
                        e = b("<" + d + ">", a.document[0]).addClass(c || a.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
                    "tr" === d ? a.currentItem.children().each(function() { b("<td>&#160;</td>", a.document[0]).attr("colspan", b(this).attr("colspan") || 1).appendTo(e) }) : "img" === d && e.attr("src", a.currentItem.attr("src"));
                    c || e.css("visibility",
                        "hidden");
                    return e
                },
                update: function(b, e) {
                    if (!c || d.forcePlaceholderSize) e.height() || e.height(a.currentItem.innerHeight() - parseInt(a.currentItem.css("paddingTop") || 0, 10) - parseInt(a.currentItem.css("paddingBottom") || 0, 10)), e.width() || e.width(a.currentItem.innerWidth() - parseInt(a.currentItem.css("paddingLeft") || 0, 10) - parseInt(a.currentItem.css("paddingRight") || 0, 10)) }
            });
            a.placeholder = b(d.placeholder.element.call(a.element, a.currentItem));
            a.currentItem.after(a.placeholder);
            d.placeholder.update(a, a.placeholder)
        },
        _contactContainers: function(a) {
            var c, d, f, e, h, k, l, m, n = e = null;
            for (c = this.containers.length - 1; 0 <= c; c--) b.contains(this.currentItem[0], this.containers[c].element[0]) || (this._intersectsWith(this.containers[c].containerCache) ? e && b.contains(this.containers[c].element[0], e.element[0]) || (e = this.containers[c], n = c) : this.containers[c].containerCache.over && (this.containers[c]._trigger("out", a, this._uiHash(this)), this.containers[c].containerCache.over = 0));
            if (e)
                if (1 === this.containers.length) this.containers[n].containerCache.over ||
                    (this.containers[n]._trigger("over", a, this._uiHash(this)), this.containers[n].containerCache.over = 1);
                else {
                    c = 1E4;
                    f = null;
                    e = (d = e.floating || this._isFloating(this.currentItem)) ? "left" : "top";
                    h = d ? "width" : "height";
                    m = d ? "clientX" : "clientY";
                    for (d = this.items.length - 1; 0 <= d; d--) b.contains(this.containers[n].element[0], this.items[d].item[0]) && this.items[d].item[0] !== this.currentItem[0] && (k = this.items[d].item.offset()[e], l = !1, a[m] - k > this.items[d][h] / 2 && (l = !0), Math.abs(a[m] - k) < c && (c = Math.abs(a[m] - k), f = this.items[d],
                        this.direction = l ? "up" : "down"));
                    if (f || this.options.dropOnEmpty) this.currentContainer === this.containers[n] ? this.currentContainer.containerCache.over || (this.containers[n]._trigger("over", a, this._uiHash()), this.currentContainer.containerCache.over = 1) : (f ? this._rearrange(a, f, null, !0) : this._rearrange(a, null, this.containers[n].element, !0), this._trigger("change", a, this._uiHash()), this.containers[n]._trigger("change", a, this._uiHash(this)), this.currentContainer = this.containers[n], this.options.placeholder.update(this.currentContainer,
                        this.placeholder), this.containers[n]._trigger("over", a, this._uiHash(this)), this.containers[n].containerCache.over = 1)
                }
        },
        _createHelper: function(a) {
            var c = this.options;
            a = b.isFunction(c.helper) ? b(c.helper.apply(this.element[0], [a, this.currentItem])) : "clone" === c.helper ? this.currentItem.clone() : this.currentItem;
            a.parents("body").length || b("parent" !== c.appendTo ? c.appendTo : this.currentItem[0].parentNode)[0].appendChild(a[0]);
            a[0] === this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            });
            a[0].style.width && !c.forceHelperSize || a.width(this.currentItem.width());
            a[0].style.height && !c.forceHelperSize || a.height(this.currentItem.height());
            return a
        },
        _adjustOffsetFromHelper: function(a) {
            "string" === typeof a && (a = a.split(" "));
            b.isArray(a) && (a = { left: +a[0], top: +a[1] || 0 });
            "left" in a && (this.offset.click.left = a.left + this.margins.left);
            "right" in a && (this.offset.click.left =
                this.helperProportions.width - a.right + this.margins.left);
            "top" in a && (this.offset.click.top = a.top + this.margins.top);
            "bottom" in a && (this.offset.click.top = this.helperProportions.height - a.bottom + this.margins.top)
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var a = this.offsetParent.offset();
            "absolute" === this.cssPosition && this.scrollParent[0] !== document && b.contains(this.scrollParent[0], this.offsetParent[0]) && (a.left += this.scrollParent.scrollLeft(), a.top += this.scrollParent.scrollTop());
            if (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && b.ui.ie) a = { top: 0, left: 0 };
            return { top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0) }
        },
        _getRelativeOffset: function() {
            if ("relative" === this.cssPosition) {
                var a = this.currentItem.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"),
                        10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return { top: 0, left: 0 }
        },
        _cacheMargins: function() { this.margins = { left: parseInt(this.currentItem.css("marginLeft"), 10) || 0, top: parseInt(this.currentItem.css("marginTop"), 10) || 0 } },
        _cacheHelperProportions: function() { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() } },
        _setContainment: function() {
            var a, c, d;
            c = this.options;
            "parent" === c.containment && (c.containment = this.helper[0].parentNode);
            if ("document" === c.containment || "window" === c.containment) this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, b("document" === c.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (b("document" === c.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            /^(document|window|parent)$/.test(c.containment) || (a = b(c.containment)[0], c = b(c.containment).offset(), d = "hidden" !== b(a).css("overflow"), this.containment = [c.left +
                (parseInt(b(a).css("borderLeftWidth"), 10) || 0) + (parseInt(b(a).css("paddingLeft"), 10) || 0) - this.margins.left, c.top + (parseInt(b(a).css("borderTopWidth"), 10) || 0) + (parseInt(b(a).css("paddingTop"), 10) || 0) - this.margins.top, c.left + (d ? Math.max(a.scrollWidth, a.offsetWidth) : a.offsetWidth) - (parseInt(b(a).css("borderLeftWidth"), 10) || 0) - (parseInt(b(a).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, c.top + (d ? Math.max(a.scrollHeight, a.offsetHeight) : a.offsetHeight) - (parseInt(b(a).css("borderTopWidth"),
                    10) || 0) - (parseInt(b(a).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top
            ])
        },
        _convertPositionTo: function(a, c) {
            c || (c = this.position);
            var d = "absolute" === a ? 1 : -1,
                f = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && b.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                e = /(html|body)/i.test(f[0].tagName);
            return {
                top: c.top + this.offset.relative.top * d + this.offset.parent.top * d - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() :
                    e ? 0 : f.scrollTop()) * d,
                left: c.left + this.offset.relative.left * d + this.offset.parent.left * d - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : e ? 0 : f.scrollLeft()) * d
            }
        },
        _generatePosition: function(a) {
            var c, d, f = this.options;
            d = a.pageX;
            c = a.pageY;
            var e = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && b.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                h = /(html|body)/i.test(e[0].tagName);
            "relative" !== this.cssPosition || this.scrollParent[0] !== document &&
                this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset());
            this.originalPosition && (this.containment && (a.pageX - this.offset.click.left < this.containment[0] && (d = this.containment[0] + this.offset.click.left), a.pageY - this.offset.click.top < this.containment[1] && (c = this.containment[1] + this.offset.click.top), a.pageX - this.offset.click.left > this.containment[2] && (d = this.containment[2] + this.offset.click.left), a.pageY - this.offset.click.top > this.containment[3] && (c = this.containment[3] +
                this.offset.click.top)), f.grid && (c = this.originalPageY + Math.round((c - this.originalPageY) / f.grid[1]) * f.grid[1], c = this.containment ? c - this.offset.click.top >= this.containment[1] && c - this.offset.click.top <= this.containment[3] ? c : c - this.offset.click.top >= this.containment[1] ? c - f.grid[1] : c + f.grid[1] : c, d = this.originalPageX + Math.round((d - this.originalPageX) / f.grid[0]) * f.grid[0], d = this.containment ? d - this.offset.click.left >= this.containment[0] && d - this.offset.click.left <= this.containment[2] ? d : d - this.offset.click.left >=
                this.containment[0] ? d - f.grid[0] : d + f.grid[0] : d));
            return { top: c - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : h ? 0 : e.scrollTop()), left: d - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : h ? 0 : e.scrollLeft()) }
        },
        _rearrange: function(a, b, d, f) {
            d ? d[0].appendChild(this.placeholder[0]) : b.item[0].parentNode.insertBefore(this.placeholder[0], "down" ===
                this.direction ? b.item[0] : b.item[0].nextSibling);
            var c = this.counter = this.counter ? ++this.counter : 1;
            this._delay(function() { c === this.counter && this.refreshPositions(!f) })
        },
        _clear: function(a, b) {
            function c(a, b, c) {
                return function(d) { c._trigger(a, d, b._uiHash(b)) } }
            this.reverting = !1;
            var f, e = [];
            !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem);
            this._noFinalSort = null;
            if (this.helper[0] === this.currentItem[0]) {
                for (f in this._storedCSS)
                    if ("auto" === this._storedCSS[f] ||
                        "static" === this._storedCSS[f]) this._storedCSS[f] = "";
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            this.fromOutside && !b && e.push(function(a) { this._trigger("receive", a, this._uiHash(this.fromOutside)) });
            !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || b || e.push(function(a) { this._trigger("update", a, this._uiHash()) });
            this === this.currentContainer ||
                b || (e.push(function(a) { this._trigger("remove", a, this._uiHash()) }), e.push(function(a) {
                    return function(b) { a._trigger("receive", b, this._uiHash(this)) } }.call(this, this.currentContainer)), e.push(function(a) {
                    return function(b) { a._trigger("update", b, this._uiHash(this)) } }.call(this, this.currentContainer)));
            for (f = this.containers.length - 1; 0 <= f; f--) b || e.push(c("deactivate", this, this.containers[f])), this.containers[f].containerCache.over && (e.push(c("out", this, this.containers[f])), this.containers[f].containerCache.over =
                0);
            this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove());
            this._storedOpacity && this.helper.css("opacity", this._storedOpacity);
            this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex);
            this.dragging = !1;
            b || this._trigger("beforeStop", a, this._uiHash());
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper =
                null);
            if (!b) {
                for (f = 0; f < e.length; f++) e[f].call(this, a);
                this._trigger("stop", a, this._uiHash()) }
            this.fromOutside = !1;
            return !this.cancelHelperRemoval
        },
        _trigger: function() {!1 === b.Widget.prototype._trigger.apply(this, arguments) && this.cancel() },
        _uiHash: function(a) {
            var c = a || this;
            return { helper: c.helper, placeholder: c.placeholder || b([]), position: c.position, originalPosition: c.originalPosition, offset: c.positionAbs, item: c.currentItem, sender: a ? a.element : null } }
    });
    b.widget("ui.spinner", {
        version: "1.11.2",
        defaultElement: "<input>",
        widgetEventPrefix: "spin",
        options: { culture: null, icons: { down: "ui-icon-triangle-1-s", up: "ui-icon-triangle-1-n" }, incremental: !0, max: null, min: null, numberFormat: null, page: 10, step: 1, change: null, spin: null, start: null, stop: null },
        _create: function() { this._setOption("max", this.options.max);
            this._setOption("min", this.options.min);
            this._setOption("step", this.options.step); "" !== this.value() && this._value(this.element.val(), !0);
            this._draw();
            this._on(this._events);
            this._refresh();
            this._on(this.window, { beforeunload: function() { this.element.removeAttr("autocomplete") } }) },
        _getCreateOptions: function() {
            var a = {},
                c = this.element;
            b.each(["min", "max", "step"], function(b, f) {
                var d = c.attr(f);
                void 0 !== d && d.length && (a[f] = d) });
            return a },
        _events: {
            keydown: function(a) { this._start(a) && this._keydown(a) && a.preventDefault() },
            keyup: "_stop",
            focus: function() { this.previous = this.element.val() },
            blur: function(a) { this.cancelBlur ? delete this.cancelBlur : (this._stop(), this._refresh(), this.previous !== this.element.val() && this._trigger("change", a)) },
            mousewheel: function(a, b) {
                if (b) {
                    if (!this.spinning &&
                        !this._start(a)) return !1;
                    this._spin((0 < b ? 1 : -1) * this.options.step, a);
                    clearTimeout(this.mousewheelTimer);
                    this.mousewheelTimer = this._delay(function() { this.spinning && this._stop(a) }, 100);
                    a.preventDefault()
                }
            },
            "mousedown .ui-spinner-button": function(a) {
                function c() { this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = d, this._delay(function() { this.previous = d })) }
                var d;
                d = this.element[0] === this.document[0].activeElement ? this.previous : this.element.val();
                a.preventDefault();
                c.call(this);
                this.cancelBlur = !0;
                this._delay(function() { delete this.cancelBlur;
                    c.call(this) });
                !1 !== this._start(a) && this._repeat(null, b(a.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, a)
            },
            "mouseup .ui-spinner-button": "_stop",
            "mouseenter .ui-spinner-button": function(a) {
                if (b(a.currentTarget).hasClass("ui-state-active")) {
                    if (!1 === this._start(a)) return !1;
                    this._repeat(null, b(a.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, a) } },
            "mouseleave .ui-spinner-button": "_stop"
        },
        _draw: function() {
            var a = this.uiSpinner = this.element.addClass("ui-spinner-input").attr("autocomplete",
                "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
            this.element.attr("role", "spinbutton");
            this.buttons = a.find(".ui-spinner-button").attr("tabIndex", -1).button().removeClass("ui-corner-all");
            this.buttons.height() > Math.ceil(.5 * a.height()) && 0 < a.height() && a.height(a.height());
            this.options.disabled && this.disable()
        },
        _keydown: function(a) {
            var c = this.options,
                d = b.ui.keyCode;
            switch (a.keyCode) {
                case d.UP:
                    return this._repeat(null, 1, a), !0;
                case d.DOWN:
                    return this._repeat(null, -1, a), !0;
                case d.PAGE_UP:
                    return this._repeat(null,
                        c.page, a), !0;
                case d.PAGE_DOWN:
                    return this._repeat(null, -c.page, a), !0
            }
            return !1
        },
        _uiSpinnerHtml: function() {
            return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>" },
        _buttonHtml: function() {
            return "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon " + this.options.icons.up + "'>&#9650;</span></a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon " + this.options.icons.down + "'>&#9660;</span></a>" },
        _start: function(a) {
            if (!this.spinning &&
                !1 === this._trigger("start", a)) return !1;
            this.counter || (this.counter = 1);
            return this.spinning = !0
        },
        _repeat: function(a, b, d) { a = a || 500;
            clearTimeout(this.timer);
            this.timer = this._delay(function() { this._repeat(40, b, d) }, a);
            this._spin(b * this.options.step, d) },
        _spin: function(a, b) {
            var c = this.value() || 0;
            this.counter || (this.counter = 1);
            c = this._adjustValue(c + a * this._increment(this.counter));
            this.spinning && !1 === this._trigger("spin", b, { value: c }) || (this._value(c), this.counter++) },
        _increment: function(a) {
            var c = this.options.incremental;
            return c ? b.isFunction(c) ? c(a) : Math.floor(a * a * a / 5E4 - a * a / 500 + 17 * a / 200 + 1) : 1
        },
        _precision: function() {
            var a = this._precisionOf(this.options.step);
            null !== this.options.min && (a = Math.max(a, this._precisionOf(this.options.min)));
            return a },
        _precisionOf: function(a) { a = a.toString();
            var b = a.indexOf(".");
            return -1 === b ? 0 : a.length - b - 1 },
        _adjustValue: function(a) {
            var b, d = this.options;
            b = null !== d.min ? d.min : 0;
            a = b + Math.round((a - b) / d.step) * d.step;
            a = parseFloat(a.toFixed(this._precision()));
            return null !== d.max && a > d.max ? d.max : null !==
                d.min && a < d.min ? d.min : a
        },
        _stop: function(a) { this.spinning && (clearTimeout(this.timer), clearTimeout(this.mousewheelTimer), this.counter = 0, this.spinning = !1, this._trigger("stop", a)) },
        _setOption: function(a, b) {
            if ("culture" === a || "numberFormat" === a) {
                var c = this._parse(this.element.val());
                this.options[a] = b;
                this.element.val(this._format(c)) } else "max" !== a && "min" !== a && "step" !== a || "string" !== typeof b || (b = this._parse(b)), "icons" === a && (this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(b.up),
                this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(b.down)), this._super(a, b), "disabled" === a && (this.widget().toggleClass("ui-state-disabled", !!b), this.element.prop("disabled", !!b), this.buttons.button(b ? "disable" : "enable"))
        },
        _setOptions: z(function(a) { this._super(a) }),
        _parse: function(a) { "string" === typeof a && "" !== a && (a = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(a, 10, this.options.culture) : +a);
            return "" === a || isNaN(a) ? null : a },
        _format: function(a) {
            return "" ===
                a ? "" : window.Globalize && this.options.numberFormat ? Globalize.format(a, this.options.numberFormat, this.options.culture) : a
        },
        _refresh: function() { this.element.attr({ "aria-valuemin": this.options.min, "aria-valuemax": this.options.max, "aria-valuenow": this._parse(this.element.val()) }) },
        isValid: function() {
            var a = this.value();
            return null === a ? !1 : a === this._adjustValue(a) },
        _value: function(a, b) {
            var c; "" !== a && (c = this._parse(a), null !== c && (b || (c = this._adjustValue(c)), a = this._format(c)));
            this.element.val(a);
            this._refresh() },
        _destroy: function() { this.element.removeClass("ui-spinner-input").prop("disabled", !1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.uiSpinner.replaceWith(this.element) },
        stepUp: z(function(a) { this._stepUp(a) }),
        _stepUp: function(a) { this._start() && (this._spin((a || 1) * this.options.step), this._stop()) },
        stepDown: z(function(a) { this._stepDown(a) }),
        _stepDown: function(a) {
            this._start() && (this._spin((a || 1) * -this.options.step),
                this._stop())
        },
        pageUp: z(function(a) { this._stepUp((a || 1) * this.options.page) }),
        pageDown: z(function(a) { this._stepDown((a || 1) * this.options.page) }),
        value: function(a) {
            if (!arguments.length) return this._parse(this.element.val());
            z(this._value).call(this, a) },
        widget: function() {
            return this.uiSpinner }
    });
    b.widget("ui.tabs", {
        version: "1.11.2",
        delay: 300,
        options: { active: null, collapsible: !1, event: "click", heightStyle: "content", hide: null, show: null, activate: null, beforeActivate: null, beforeLoad: null, load: null },
        _isLocal: function() {
            var a =
                /#.*$/;
            return function(b) {
                var c, f;
                b = b.cloneNode(!1);
                c = b.href.replace(a, "");
                f = location.href.replace(a, "");
                try { c = decodeURIComponent(c) } catch (g) {}
                try { f = decodeURIComponent(f) } catch (g) {}
                return 1 < b.hash.length && c === f }
        }(),
        _create: function() {
            var a = this,
                c = this.options;
            this.running = !1;
            this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", c.collapsible);
            this._processTabs();
            c.active = this._initialActive();
            b.isArray(c.disabled) && (c.disabled = b.unique(c.disabled.concat(b.map(this.tabs.filter(".ui-state-disabled"),
                function(b) {
                    return a.tabs.index(b) }))).sort());
            this.active = !1 !== this.options.active && this.anchors.length ? this._findActive(c.active) : b();
            this._refresh();
            this.active.length && this.load(c.active)
        },
        _initialActive: function() {
            var a = this.options.active,
                c = this.options.collapsible,
                d = location.hash.substring(1);
            null === a && (d && this.tabs.each(function(c, e) {
                if (b(e).attr("aria-controls") === d) return a = c, !1 }), null === a && (a = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), null === a || -1 === a) && (a = this.tabs.length ? 0 :
                !1);
            !1 !== a && (a = this.tabs.index(this.tabs.eq(a)), -1 === a && (a = c ? !1 : 0));
            !c && !1 === a && this.anchors.length && (a = 0);
            return a
        },
        _getCreateEventData: function() {
            return { tab: this.active, panel: this.active.length ? this._getPanelForTab(this.active) : b() } },
        _tabKeydown: function(a) {
            var c = b(this.document[0].activeElement).closest("li"),
                d = this.tabs.index(c),
                f = !0;
            if (!this._handlePageNav(a)) {
                switch (a.keyCode) {
                    case b.ui.keyCode.RIGHT:
                    case b.ui.keyCode.DOWN:
                        d++;
                        break;
                    case b.ui.keyCode.UP:
                    case b.ui.keyCode.LEFT:
                        f = !1;
                        d--;
                        break;
                    case b.ui.keyCode.END:
                        d = this.anchors.length - 1;
                        break;
                    case b.ui.keyCode.HOME:
                        d = 0;
                        break;
                    case b.ui.keyCode.SPACE:
                        a.preventDefault();
                        clearTimeout(this.activating);
                        this._activate(d);
                        return;
                    case b.ui.keyCode.ENTER:
                        a.preventDefault();
                        clearTimeout(this.activating);
                        this._activate(d === this.options.active ? !1 : d);
                        return;
                    default:
                        return
                }
                a.preventDefault();
                clearTimeout(this.activating);
                d = this._focusNextTab(d, f);
                a.ctrlKey || (c.attr("aria-selected", "false"), this.tabs.eq(d).attr("aria-selected", "true"), this.activating =
                    this._delay(function() { this.option("active", d) }, this.delay))
            }
        },
        _panelKeydown: function(a) {!this._handlePageNav(a) && a.ctrlKey && a.keyCode === b.ui.keyCode.UP && (a.preventDefault(), this.active.focus()) },
        _handlePageNav: function(a) {
            if (a.altKey && a.keyCode === b.ui.keyCode.PAGE_UP) return this._activate(this._focusNextTab(this.options.active - 1, !1)), !0;
            if (a.altKey && a.keyCode === b.ui.keyCode.PAGE_DOWN) return this._activate(this._focusNextTab(this.options.active + 1, !0)), !0 },
        _findNextTab: function(a, c) {
            function d() {
                a >
                    f && (a = 0);
                0 > a && (a = f);
                return a
            }
            for (var f = this.tabs.length - 1; - 1 !== b.inArray(d(), this.options.disabled);) a = c ? a + 1 : a - 1;
            return a
        },
        _focusNextTab: function(a, b) { a = this._findNextTab(a, b);
            this.tabs.eq(a).focus();
            return a },
        _setOption: function(a, b) { "active" === a ? this._activate(b) : "disabled" === a ? this._setupDisabled(b) : (this._super(a, b), "collapsible" === a && (this.element.toggleClass("ui-tabs-collapsible", b), b || !1 !== this.options.active || this._activate(0)), "event" === a && this._setupEvents(b), "heightStyle" === a && this._setupHeightStyle(b)) },
        _sanitizeSelector: function(a) {
            return a ? a.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "" },
        refresh: function() {
            var a = this.options,
                c = this.tablist.children(":has(a[href])");
            a.disabled = b.map(c.filter(".ui-state-disabled"), function(a) {
                return c.index(a) });
            this._processTabs();
            !1 !== a.active && this.anchors.length ? this.active.length && !b.contains(this.tablist[0], this.active[0]) ? this.tabs.length === a.disabled.length ? (a.active = !1, this.active = b()) : this._activate(this._findNextTab(Math.max(0, a.active - 1), !1)) :
                a.active = this.tabs.index(this.active) : (a.active = !1, this.active = b());
            this._refresh()
        },
        _refresh: function() {
            this._setupDisabled(this.options.disabled);
            this._setupEvents(this.options.event);
            this._setupHeightStyle(this.options.heightStyle);
            this.tabs.not(this.active).attr({ "aria-selected": "false", "aria-expanded": "false", tabIndex: -1 });
            this.panels.not(this._getPanelForTab(this.active)).hide().attr({ "aria-hidden": "true" });
            this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            }), this._getPanelForTab(this.active).show().attr({ "aria-hidden": "false" })) : this.tabs.eq(0).attr("tabIndex", 0)
        },
        _processTabs: function() {
            var a = this,
                c = this.tabs,
                d = this.anchors,
                f = this.panels;
            this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist").delegate("> li", "mousedown" + this.eventNamespace, function(a) { b(this).is(".ui-state-disabled") && a.preventDefault() }).delegate(".ui-tabs-anchor",
                "focus" + this.eventNamespace,
                function() { b(this).closest("li").is(".ui-state-disabled") && this.blur() });
            this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({ role: "tab", tabIndex: -1 });
            this.anchors = this.tabs.map(function() {
                return b("a", this)[0] }).addClass("ui-tabs-anchor").attr({ role: "presentation", tabIndex: -1 });
            this.panels = b();
            this.anchors.each(function(c, d) {
                var f, e, g = b(d).uniqueId().attr("id"),
                    h = b(d).closest("li"),
                    k = h.attr("aria-controls");
                a._isLocal(d) ? (f =
                    d.hash, e = f.substring(1), f = a.element.find(a._sanitizeSelector(f))) : (e = h.attr("aria-controls") || b({}).uniqueId()[0].id, f = a.element.find("#" + e), f.length || (f = a._createPanel(e), f.insertAfter(a.panels[c - 1] || a.tablist)), f.attr("aria-live", "polite"));
                f.length && (a.panels = a.panels.add(f));
                k && h.data("ui-tabs-aria-controls", k);
                h.attr({ "aria-controls": e, "aria-labelledby": g });
                f.attr("aria-labelledby", g)
            });
            this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel");
            c && (this._off(c.not(this.tabs)),
                this._off(d.not(this.anchors)), this._off(f.not(this.panels)))
        },
        _getList: function() {
            return this.tablist || this.element.find("ol,ul").eq(0) },
        _createPanel: function(a) {
            return b("<div>").attr("id", a).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0) },
        _setupDisabled: function(a) {
            b.isArray(a) && (a.length ? a.length === this.anchors.length && (a = !0) : a = !1);
            for (var c = 0, d; d = this.tabs[c]; c++) !0 === a || -1 !== b.inArray(c, a) ? b(d).addClass("ui-state-disabled").attr("aria-disabled", "true") :
                b(d).removeClass("ui-state-disabled").removeAttr("aria-disabled");
            this.options.disabled = a
        },
        _setupEvents: function(a) {
            var c = {};
            a && b.each(a.split(" "), function(a, b) { c[b] = "_eventHandler" });
            this._off(this.anchors.add(this.tabs).add(this.panels));
            this._on(!0, this.anchors, { click: function(a) { a.preventDefault() } });
            this._on(this.anchors, c);
            this._on(this.tabs, { keydown: "_tabKeydown" });
            this._on(this.panels, { keydown: "_panelKeydown" });
            this._focusable(this.tabs);
            this._hoverable(this.tabs) },
        _setupHeightStyle: function(a) {
            var c,
                d = this.element.parent();
            "fill" === a ? (c = d.height(), c -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function() {
                var a = b(this),
                    d = a.css("position"); "absolute" !== d && "fixed" !== d && (c -= a.outerHeight(!0)) }), this.element.children().not(this.panels).each(function() { c -= b(this).outerHeight(!0) }), this.panels.each(function() { b(this).height(Math.max(0, c - b(this).innerHeight() + b(this).height())) }).css("overflow", "auto")) : "auto" === a && (c = 0, this.panels.each(function() {
                c = Math.max(c,
                    b(this).height("").height())
            }).height(c))
        },
        _eventHandler: function(a) {
            var c = this.options,
                d = this.active,
                f = b(a.currentTarget).closest("li"),
                e = f[0] === d[0],
                h = e && c.collapsible,
                k = h ? b() : this._getPanelForTab(f),
                l = d.length ? this._getPanelForTab(d) : b(),
                d = { oldTab: d, oldPanel: l, newTab: h ? b() : f, newPanel: k };
            a.preventDefault();
            f.hasClass("ui-state-disabled") || f.hasClass("ui-tabs-loading") || this.running || e && !c.collapsible || !1 === this._trigger("beforeActivate", a, d) || (c.active = h ? !1 : this.tabs.index(f), this.active = e ? b() :
                f, this.xhr && this.xhr.abort(), l.length || k.length || b.error("jQuery UI Tabs: Mismatching fragment identifier."), k.length && this.load(this.tabs.index(f), a), this._toggle(a, d))
        },
        _toggle: function(a, c) {
            function d() { e.running = !1;
                e._trigger("activate", a, c) }

            function f() { c.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
                h.length && e.options.show ? e._show(h, e.options.show, d) : (h.show(), d()) }
            var e = this,
                h = c.newPanel,
                k = c.oldPanel;
            this.running = !0;
            k.length && this.options.hide ? this._hide(k, this.options.hide,
                function() { c.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
                    f() }) : (c.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), k.hide(), f());
            k.attr("aria-hidden", "true");
            c.oldTab.attr({ "aria-selected": "false", "aria-expanded": "false" });
            h.length && k.length ? c.oldTab.attr("tabIndex", -1) : h.length && this.tabs.filter(function() {
                return 0 === b(this).attr("tabIndex") }).attr("tabIndex", -1);
            h.attr("aria-hidden", "false");
            c.newTab.attr({ "aria-selected": "true", "aria-expanded": "true", tabIndex: 0 })
        },
        _activate: function(a) { a = this._findActive(a);
            a[0] !== this.active[0] && (a.length || (a = this.active), a = a.find(".ui-tabs-anchor")[0], this._eventHandler({ target: a, currentTarget: a, preventDefault: b.noop })) },
        _findActive: function(a) {
            return !1 === a ? b() : this.tabs.eq(a) },
        _getIndex: function(a) { "string" === typeof a && (a = this.anchors.index(this.anchors.filter("[href$='" + a + "']")));
            return a },
        _destroy: function() {
            this.xhr && this.xhr.abort();
            this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
            this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
            this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
            this.tablist.unbind(this.eventNamespace);
            this.tabs.add(this.panels).each(function() { b.data(this, "ui-tabs-destroy") ? b(this).remove() : b(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role") });
            this.tabs.each(function() {
                var a = b(this),
                    c = a.data("ui-tabs-aria-controls");
                c ? a.attr("aria-controls", c).removeData("ui-tabs-aria-controls") : a.removeAttr("aria-controls") });
            this.panels.show();
            "content" !== this.options.heightStyle && this.panels.css("height", "")
        },
        enable: function(a) {
            var c = this.options.disabled;!1 !== c && (void 0 === a ? c = !1 : (a = this._getIndex(a), c = b.isArray(c) ? b.map(c, function(b) {
                return b !== a ? b : null }) : b.map(this.tabs, function(b, c) {
                return c !== a ? c : null })), this._setupDisabled(c)) },
        disable: function(a) {
            var c =
                this.options.disabled;
            if (!0 !== c) {
                if (void 0 === a) c = !0;
                else { a = this._getIndex(a);
                    if (-1 !== b.inArray(a, c)) return;
                    c = b.isArray(c) ? b.merge([a], c).sort() : [a] }
                this._setupDisabled(c) }
        },
        load: function(a, c) {
            a = this._getIndex(a);
            var d = this,
                f = this.tabs.eq(a),
                e = f.find(".ui-tabs-anchor"),
                h = this._getPanelForTab(f),
                k = { tab: f, panel: h };
            this._isLocal(e[0]) || (this.xhr = b.ajax(this._ajaxSettings(e, c, k))) && "canceled" !== this.xhr.statusText && (f.addClass("ui-tabs-loading"), h.attr("aria-busy", "true"), this.xhr.success(function(a) {
                setTimeout(function() {
                    h.html(a);
                    d._trigger("load", c, k)
                }, 1)
            }).complete(function(a, b) { setTimeout(function() { "abort" === b && d.panels.stop(!1, !0);
                    f.removeClass("ui-tabs-loading");
                    h.removeAttr("aria-busy");
                    a === d.xhr && delete d.xhr }, 1) }))
        },
        _ajaxSettings: function(a, c, d) {
            var f = this;
            return { url: a.attr("href"), beforeSend: function(a, e) {
                    return f._trigger("beforeLoad", c, b.extend({ jqXHR: a, ajaxSettings: e }, d)) } } },
        _getPanelForTab: function(a) { a = b(a).attr("aria-controls");
            return this.element.find(this._sanitizeSelector("#" + a)) }
    });
    b.widget("ui.tooltip", {
        version: "1.11.2",
        options: { content: function() {
                var a = b(this).attr("title") || "";
                return b("<a>").text(a).html() }, hide: !0, items: "[title]:not([disabled])", position: { my: "left top+15", at: "left bottom", collision: "flipfit flip" }, show: !0, tooltipClass: null, track: !1, close: null, open: null },
        _addDescribedBy: function(a, c) {
            var d = (a.attr("aria-describedby") || "").split(/\s+/);
            d.push(c);
            a.data("ui-tooltip-id", c).attr("aria-describedby", b.trim(d.join(" "))) },
        _removeDescribedBy: function(a) {
            var c = a.data("ui-tooltip-id"),
                d = (a.attr("aria-describedby") || "").split(/\s+/),
                c = b.inArray(c, d); - 1 !== c && d.splice(c, 1);
            a.removeData("ui-tooltip-id");
            (d = b.trim(d.join(" "))) ? a.attr("aria-describedby", d): a.removeAttr("aria-describedby")
        },
        _create: function() { this._on({ mouseover: "open", focusin: "open" });
            this.tooltips = {};
            this.parents = {};
            this.options.disabled && this._disable();
            this.liveRegion = b("<div>").attr({ role: "log", "aria-live": "assertive", "aria-relevant": "additions" }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body) },
        _setOption: function(a, c) {
            var d = this; "disabled" === a ? (this[c ? "_disable" : "_enable"](), this.options[a] = c) : (this._super(a, c), "content" === a && b.each(this.tooltips, function(a, b) { d._updateContent(b.element) })) },
        _disable: function() {
            var a = this;
            b.each(this.tooltips, function(c, d) {
                var f = b.Event("blur");
                f.target = f.currentTarget = d.element[0];
                a.close(f, !0) });
            this.element.find(this.options.items).addBack().each(function() {
                var a = b(this);
                a.is("[title]") && a.data("ui-tooltip-title", a.attr("title")).removeAttr("title") }) },
        _enable: function() { this.element.find(this.options.items).addBack().each(function() {
                var a = b(this);
                a.data("ui-tooltip-title") && a.attr("title", a.data("ui-tooltip-title")) }) },
        open: function(a) {
            var c = this,
                d = b(a ? a.target : this.element).closest(this.options.items);
            d.length && !d.data("ui-tooltip-id") && (d.attr("title") && d.data("ui-tooltip-title", d.attr("title")), d.data("ui-tooltip-open", !0), a && "mouseover" === a.type && d.parents().each(function() {
                var a = b(this),
                    d;
                a.data("ui-tooltip-open") && (d = b.Event("blur"), d.target =
                    d.currentTarget = this, c.close(d, !0));
                a.attr("title") && (a.uniqueId(), c.parents[this.id] = { element: this, title: a.attr("title") }, a.attr("title", ""))
            }), this._updateContent(d, a))
        },
        _updateContent: function(a, b) {
            var c;
            c = this.options.content;
            var f = this,
                e = b ? b.type : null;
            if ("string" === typeof c) return this._open(b, a, c);
            (c = c.call(a[0], function(c) { a.data("ui-tooltip-open") && f._delay(function() { b && (b.type = e);
                    this._open(b, a, c) }) })) && this._open(b, a, c) },
        _open: function(a, c, d) {
            function f(a) { l.of = a;
                h.is(":hidden") || h.position(l) }
            var e, h, k, l = b.extend({}, this.options.position);
            d && ((e = this._find(c)) ? e.tooltip.find(".ui-tooltip-content").html(d) : (c.is("[title]") && (a && "mouseover" === a.type ? c.attr("title", "") : c.removeAttr("title")), e = this._tooltip(c), h = e.tooltip, this._addDescribedBy(c, h.attr("id")), h.find(".ui-tooltip-content").html(d), this.liveRegion.children().hide(), d.clone && (d = d.clone(), d.removeAttr("id").find("[id]").removeAttr("id")), b("<div>").html(d).appendTo(this.liveRegion), this.options.track && a && /^mouse/.test(a.type) ?
                (this._on(this.document, { mousemove: f }), f(a)) : h.position(b.extend({ of: c }, this.options.position)), h.hide(), this._show(h, this.options.show), this.options.show && this.options.show.delay && (k = this.delayedShow = setInterval(function() { h.is(":visible") && (f(l.of), clearInterval(k)) }, b.fx.interval)), this._trigger("open", a, { tooltip: h }), d = { keyup: function(a) { a.keyCode === b.ui.keyCode.ESCAPE && (a = b.Event(a), a.currentTarget = c[0], this.close(a, !0)) } }, c[0] !== this.element[0] && (d.remove = function() { this._removeTooltip(h) }),
                a && "mouseover" !== a.type || (d.mouseleave = "close"), a && "focusin" !== a.type || (d.focusout = "close"), this._on(!0, c, d)))
        },
        close: function(a) {
            var c, d = this,
                f = b(a ? a.currentTarget : this.element),
                e = this._find(f);
            e && (c = e.tooltip, e.closing || (clearInterval(this.delayedShow), f.data("ui-tooltip-title") && !f.attr("title") && f.attr("title", f.data("ui-tooltip-title")), this._removeDescribedBy(f), e.hiding = !0, c.stop(!0), this._hide(c, this.options.hide, function() { d._removeTooltip(b(this)) }), f.removeData("ui-tooltip-open"), this._off(f,
                "mouseleave focusout keyup"), f[0] !== this.element[0] && this._off(f, "remove"), this._off(this.document, "mousemove"), a && "mouseleave" === a.type && b.each(this.parents, function(a, c) { b(c.element).attr("title", c.title);
                delete d.parents[a] }), e.closing = !0, this._trigger("close", a, { tooltip: c }), e.hiding || (e.closing = !1)))
        },
        _tooltip: function(a) {
            var c = b("<div>").attr("role", "tooltip").addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || "")),
                d = c.uniqueId().attr("id");
            b("<div>").addClass("ui-tooltip-content").appendTo(c);
            c.appendTo(this.document[0].body);
            return this.tooltips[d] = { element: a, tooltip: c }
        },
        _find: function(a) {
            return (a = a.data("ui-tooltip-id")) ? this.tooltips[a] : null },
        _removeTooltip: function(a) { a.remove();
            delete this.tooltips[a.attr("id")] },
        _destroy: function() {
            var a = this;
            b.each(this.tooltips, function(c, d) {
                var f = b.Event("blur"),
                    e = d.element;
                f.target = f.currentTarget = e[0];
                a.close(f, !0);
                b("#" + c).remove();
                e.data("ui-tooltip-title") && (e.attr("title") || e.attr("title", e.data("ui-tooltip-title")), e.removeData("ui-tooltip-title")) });
            this.liveRegion.remove()
        }
    })
});
(function(b, k) { "function" === typeof define && define.amd ? define(k) : "object" === typeof exports ? module.exports = k() : b.NProgress = k() })(this, function() {
    function b(b, e, h) {
        return b < e ? e : b > h ? h : b }

    function k(b, e, h) { b = "translate3d" === v.positionUsing ? { transform: "translate3d(" + 100 * (-1 + b) + "%,0,0)" } : "translate" === v.positionUsing ? { transform: "translate(" + 100 * (-1 + b) + "%,0)" } : { "margin-left": 100 * (-1 + b) + "%" };
        b.transition = "all " + e + "ms " + h;
        return b }

    function l(b, e) {
        return 0 <= ("string" == typeof b ? b : n(b)).indexOf(" " + e + " ") }

    function e(b,
        e) {
        var h = n(b),
            k = h + e;
        l(h, e) || (b.className = k.substring(1)) }

    function h(b, e) {
        var h = n(b);
        l(b, e) && (h = h.replace(" " + e + " ", " "), b.className = h.substring(1, h.length - 1)) }

    function n(b) {
        return (" " + (b.className || "") + " ").replace(/\s+/gi, " ") }
    var q = { version: "0.2.0" },
        v = q.settings = { minimum: .08, easing: "ease", positionUsing: "", speed: 200, trickle: !0, trickleRate: .02, trickleSpeed: 800, showSpinner: !1, barSelector: '[role="bar"]', spinnerSelector: '[role="spinner"]', parent: "body", template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>' };
    q.configure = function(b) {
        var e, h;
        for (e in b) h = b[e], void 0 !== h && b.hasOwnProperty(e) && (v[e] = h);
        return this };
    q.status = null;
    q.set = function(e) {
        var h = q.isStarted();
        e = b(e, v.minimum, 1);
        q.status = 1 === e ? null : e;
        var l = q.render(!h),
            n = l.querySelector(v.barSelector),
            r = v.speed,
            L = v.easing;
        l.offsetWidth;
        z(function(a) {
            "" === v.positionUsing && (v.positionUsing = q.getPositioningCSS());
            A(n, k(e, r, L));
            1 === e ? (A(l, { transition: "none", opacity: 1 }), l.offsetWidth, setTimeout(function() {
                A(l, { transition: "all " + r + "ms linear", opacity: 0 });
                setTimeout(function() { q.remove();
                    a() }, r)
            }, r)) : setTimeout(a, r)
        });
        return this
    };
    q.isStarted = function() {
        return "number" === typeof q.status };
    q.start = function() { q.status || q.set(0);
        var b = function() { setTimeout(function() { q.status && (q.trickle(), b()) }, v.trickleSpeed) };
        v.trickle && b();
        return this };
    q.done = function(b) {
        return b || q.status ? q.inc(.3 + .5 * Math.random()).set(1) : this };
    q.inc = function(e) {
        var h = q.status;
        return h ? ("number" !== typeof e && (e = (1 - h) * b(Math.random() * h, .1, .95)), h = b(h + e, 0, .994), q.set(h)) : q.start() };
    q.trickle =
        function() {
            return q.inc(Math.random() * v.trickleRate) };
    (function() {
        var b = 0,
            e = 0;
        q.promise = function(h) {
            if (!h || "resolved" === h.state()) return this;
            0 === e && q.start();
            b++;
            e++;
            h.always(function() { e--;
                0 === e ? (b = 0, q.done()) : q.set((b - e) / b) });
            return this } })();
    q.render = function(b) {
        if (q.isRendered()) return document.getElementById("nprogress");
        e(document.documentElement, "nprogress-busy");
        var h = document.createElement("div");
        h.id = "nprogress";
        h.innerHTML = v.template;
        var k = h.querySelector(v.barSelector),
            l = b ? "-100" : 100 *
            (-1 + (q.status || 0));
        b = document.querySelector(v.parent);
        A(k, { transition: "all 0 linear", transform: "translate3d(" + l + "%,0,0)" });
        v.showSpinner || (k = h.querySelector(v.spinnerSelector)) && k && k.parentNode && k.parentNode.removeChild(k);
        b != document.body && e(b, "nprogress-custom-parent");
        b.appendChild(h);
        return h
    };
    q.remove = function() { h(document.documentElement, "nprogress-busy");
        h(document.querySelector(v.parent), "nprogress-custom-parent");
        var b = document.getElementById("nprogress");
        b && b && b.parentNode && b.parentNode.removeChild(b) };
    q.isRendered = function() {
        return !!document.getElementById("nprogress") };
    q.getPositioningCSS = function() {
        var b = document.body.style,
            e = "WebkitTransform" in b ? "Webkit" : "MozTransform" in b ? "Moz" : "msTransform" in b ? "ms" : "OTransform" in b ? "O" : "";
        return e + "Perspective" in b ? "translate3d" : e + "Transform" in b ? "translate" : "margin" };
    var z = function() {
            function b() {
                var h = e.shift();
                h && h(b) }
            var e = [];
            return function(h) { e.push(h);
                1 == e.length && b() } }(),
        A = function() {
            function b(b) {
                return b.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi,
                    function(b, a) {
                        return a.toUpperCase() })
            }

            function e(e) { e = b(e);
                var l;
                if (!(l = k[e])) { l = e;
                    a: {
                        var a = document.body.style;
                        if (!(e in a))
                            for (var c = h.length, d = e.charAt(0).toUpperCase() + e.slice(1), f; c--;)
                                if (f = h[c] + d, f in a) { e = f;
                                    break a } }
                    l = k[l] = e }
                return l }
            var h = ["Webkit", "O", "Moz", "ms"],
                k = {};
            return function(b, h) {
                var a = arguments,
                    c, d;
                if (2 == a.length)
                    for (c in h) {
                        if (d = h[c], void 0 !== d && h.hasOwnProperty(c)) {
                            var a = b,
                                f = c,
                                f = e(f);
                            a.style[f] = d } } else c = b, f = a[1], a = a[2], f = e(f), c.style[f] = a }
        }();
    return q
});
