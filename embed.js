if (void 0 !== fientaEmbed)
  console.log("Warning: Fienta's embed.js is included twice!");
else {
  var fientaEmbed = {
    version : "2024-08-02",
    defaults : {
      link_selector : 'body a[href*="fienta."]',
      utm_source : "homepage",
      background : "rgba(255, 255, 255, 0.5)",
      border_radius : "5px",
      fienta_host : "https://fienta.com",
      descriptionEnabled : !1,
      imageEnabled: !1,
      stopPropagation: false,
    },
    settings : {},
    isIOS :
        /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) && !window.MSStream,
    iframeSrc : "",
    clickedEventURL : "",
    clickedEventPath : "",
    iframeLoadedPath : "",
    openEmbedURL : "",
    overflowHtmlX : "",
    overflowHtmlY : "",
    overflowBodyX : "",
    overflowBodyY : "",
    init : function() { this.run() },
    run : function() {
      this.compileSettings(),
          document.addEventListener("DOMContentLoaded", (function(e) {
                                      fientaEmbed.appendIframe(),
                                          fientaEmbed.listenMessages(),
                                          fientaEmbed.setClickHandler(),
                                          fientaEmbed.openEmbed(),
                                          fientaEmbed.updateTicketsAvailable()
                                    }))
    },
    compileSettings : function() {
      this.settings =
          Object.assign({}, fientaEmbed.defaults, window.piletimasinSettings,
                        window.fientaSettings)
    },
    queryString : function(e) {
      if ("" == e)
        return {};
      for (var t = {}, i = 0; i < e.length; ++i) {
        var n = e[i].split("=", 2);
        t[n[0]] =
            2 == n.length ? decodeURIComponent(n[1].replace(/\+/g, " ")) : ""
      }
      return t
    }(window.location.search.substr(1).split("&")),
    initBackHandler : function(e) {
      history.replaceState({page : "cart"}, null, null),
          history.pushState({page : "cart-loaded"}, null, null),
          window.onpopstate = function(t) {
            if (t.state && "cart" === t.state.page) {
              var i = fientaEmbed.parseEventURL(e, "slug");
              parent.postMessage({op : "hide_fienta_iframe", slug : i}, "*"),
                  window.onpopstate = null
            }
          }
    },
    restoreHistoryStates : function() {
      if (history.state && "cart-loaded" === history.state.page) {
        history.back();
        window.onpopstate = function(e) {
          e.state && "cart" === e.state.page && (window.onpopstate = null)
        }
      }
    },
    setClickHandler : function() {
      document.addEventListener(
          "click", (function(e) {
            var t =
                e.composedPath()[0].closest(fientaEmbed.settings.link_selector);
            t && t.href && t.href.includes("fienta.") &&
                (e.preventDefault(),
                 // Work around Wix's insistence on navigating.
                fientaEmbed.settings.stopPropagation && e.stopPropagation(),
                fientaEmbed.openInIframe(t.href));
          }))
    },
    appendIframe : function() {
      var e = document.createElement("iframe");
      e.setAttribute("id", "fienta_iframe"), e.setAttribute("frameborder", "0"),
          e.setAttribute("allowpaymentrequest", !0),
          e.style.position = "fixed", e.style.top = "0px", e.style.left = "0px",
          e.style.display = "block", e.style.margin = "0px",
          e.style.padding = "0px", e.style.border = "none",
          e.style.height = "100vh", e.style.width = "100vw",
          e.style.zIndex = "2147483647", e.style.display = "none",
          e.style.background = fientaEmbed.settings.background,
          document.body.appendChild(e)
    },
    iframeShow : function() {
      var e = document.querySelector("html"),
          t = document.querySelector("body");
      this.overflowHtmlX = e.style.overflowX,
      this.overflowHtmlY = e.style.overflowY,
      this.overflowBodyX = t.style.overflowX,
      this.overflowBodyY = t.style.overflowY, e.style.overflow = "hidden",
      t.style.overflow = "hidden",
      document.querySelector("#fienta_iframe").style.display = "block"
    },
    iframeHide : function(e) {
      document.querySelector("#fienta_iframe").style.display = "none";
      var t = document.querySelector("html"),
          i = document.querySelector("body");
      t.style.overflowX = this.overflowHtmlX,
      t.style.overflowY = this.overflowHtmlY,
      i.style.overflowX = this.overflowBodyX,
      i.style.overflowY = this.overflowBodyY, this.updateTicketsAvailable(e),
      window.postMessage({op : "fienta_iframe_closed"}, "*"),
      fientaEmbed.restoreHistoryStates()
    },
    openInIframe : function(e) {
      fientaEmbed.initBackHandler(e);
      var t = this.parseURL(e),
          i = t.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
      if (!i)
        return location.href = e, !0;
      var n = t.hostname, a = i.split("/");
      "cart" == a[a.length - 1] && a.pop(),
          this.clickedEventPath = a.join("/"),
          this.clickedEventURL =
              "https://" + n + "/" + this.clickedEventPath + t.search,
          this.clickedEventCartURL =
              "https://" + n + "/" + this.clickedEventPath + "/cart" + t.search;
      var s = this.clickedEventURL;
      if (void 0 !== this.queryString) {
        var o = {}, r = Object.assign({}, this.queryString);
        if (Object.keys(r).forEach(
                (function(e) { -1 !== e.indexOf("utm_") && (o[e] = r[e]) })),
            Object.keys(o).length > 0) {
          var l = this.serializeParams(o);
          -1 === s.indexOf("?") ? s += "?" + l : s += "&" + l
        }
      }
      this.iframeSrc =
          s + (-1 === s.indexOf("?") ? "?" : "&") + "embed=1" +
          (this.settings.utm_source && -1 === t.search.indexOf("utm_source")
               ? "&utm_source=" + this.settings.utm_source
               : "") +
          (void 0 !== this.settings.border_radius
               ? "&border-radius=" + this.settings.border_radius
               : "") +
          (this.settings.descriptionEnabled ? "&descriptionEnabled=1" : "") +
          (this.settings.imageEnabled ? "&imageEnabled=1" : "") +
          (void 0 !== this.settings.step ? "&step=" + this.settings.step : ""),
      this.isIOS ? location.href = this.iframeSrc
                 : (document.getElementById("fienta_iframe")
                        .contentWindow.location.replace(this.iframeSrc),
                    this.iframeShow())
    },
    openEmbed : function() {
      if (void 0 !== this.queryString &&
          void 0 !== this.queryString.openEmbed) {
        var e = this.queryString.openEmbed;
        this.openEmbedURL = e, this.openInIframe(this.openEmbedURL),
        delete this.queryString.openEmbed,
        delete this.queryString.skipCookieCheck;
        var t = [ "https://", location.host, location.pathname ].join(""),
            i = this.serializeParams(this.queryString);
        i.length > 0 && (i = "?" + i), t = t + i + location.hash,
                                       history.replaceState({}, "", t)
      }
    },
    listenMessages : function() {
      window.addEventListener(
          "message", (function(e) {
            var t = e.data.op ? e.data.op : e.data;
            if ("hide_fienta_iframe" == t)
              fientaEmbed.iframeHide(e.data.slug);
            else if ("show_fienta_iframe" == t)
              fientaEmbed.iframeShow();
            else if ("MM:3PCunsupported" == t)
              fientaEmbed.thirdPartyCookiesEnabled = !1;
            else if ("redirect_parent" == t) {
              if (null == e.data.url)
                return;
              fientaEmbed.iframeHide(), location.href = e.data.url
            } else if ("cart_loaded" == t) {
              void 0 !== e.data.path &&
                  (fientaEmbed.iframeLoadedPath = e.data.path);
              var i = {
                op : "set_embed_info",
                embed_version : fientaEmbed.version,
                parent_url : location.href,
                open_embed_url : fientaEmbed.openEmbedURL
              };
              document.getElementById("fienta_iframe")
                  .contentWindow.postMessage(i, "*")
            }
          }),
          !1)
    },
    updateTicketsAvailable : function(e) {
      "function" == typeof this.settings.onTicketsAvailableReady &&
          document.querySelectorAll(this.settings.link_selector)
              .forEach((function(t) {
                var i;
                if (void 0 !== t.dataset.event
                        ? i = t.dataset.event
                        : void 0 !== t.href &&
                              (i = fientaEmbed.parseEventURL(t.href, "slug")),
                    i && (!e || i == e)) {
                  var n = fientaEmbed.settings.fienta_host + "/api/v1/" + i +
                          "/tickets-available";
                  fetch(n)
                      .then((function(e) {
                        if (!e.ok)
                          throw new Error("HTTP error " + e.status);
                        return e.json()
                      }))
                      .then((function(e) {
                        t.setAttribute("data-tickets-available", e),
                            fientaEmbed.settings.onTicketsAvailableReady(t, e)
                      }))
                      .catch((function(e) {}))
                }
              }))
    },
    parseURL : function(e) {
      var t = document.createElement("a");
      return t.href = e, t
    },
    parseEventURL : function(e, t) {
      var i = this.parseURL(e);
      if (!(s = i.pathname.replace(/^\/+/, "").replace(/\/+$/, "")))
        return !1;
      var n = i.hostname;
      -1 !== n.indexOf("piletimasin.ee") &&
          (n = n.replace(/piletimasin.ee/gi, "fienta.com"));
      var a = s.split("/");
      "cart" == a[a.length - 1] && a.pop();
      var s = a.join("/"), o = a[a.length - 1];
      return "slug" == t ? o : "https://" + n + "/" + s + i.search
    },
    serializeParams : function(e) {
      return 0 === Object.keys(e).length ? ""
                                         : new URLSearchParams(e).toString()
    }
  };
  fientaEmbed.init()
}
