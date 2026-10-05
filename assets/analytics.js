/* Independent, optional tracking: never delays or cancels site interactions. */
(function () {
  "use strict";
  if (window.arunodayAnalytics) return;
  var config = window.ARUNODAY_ANALYTICS_CONFIG || {};
  var production = /^(www\.)?arunodaycare\.com$/i.test(window.location.hostname);
  var gaEnabled = production && /^G-[A-Z0-9]+$/.test(config.ga4MeasurementId || "");
  var allowedEvents = new Set([
    "project_enquiry", "start_conversation", "whatsapp_click",
    "phone_click", "email_click", "explore_products"
  ]);

  function loadScript(src) {
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  var consentKey = "arunodaycare.analytics-consent.v1";
  var consent = null;
  var initialized = false;
  var banner;
  try { consent = window.localStorage.getItem(consentKey); } catch (_) {}
  if (consent !== "granted" && consent !== "denied") consent = null;

  function startAnalytics() {
    if (!gaEnabled || initialized || consent !== "granted") return;
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    // Load only after an actual choice; advertising remains disabled.
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    var tagConfig = {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Exclude arbitrary URL parameters and fragments from reported page URLs.
      page_location: window.location.origin + window.location.pathname,
      page_referrer: cleanReferrer(document.referrer)
    };
    // Keep campaign attribution while excluding unrelated query parameters.
    var campaignParams = new URLSearchParams(window.location.search);
    var campaignFields = {
      utm_source: "campaign_source", utm_medium: "campaign_medium",
      utm_campaign: "campaign_name", utm_id: "campaign_id",
      utm_content: "campaign_content", utm_term: "campaign_term"
    };
    Object.keys(campaignFields).forEach(function (key) {
      var value = campaignParams.get(key);
      if (value) tagConfig[campaignFields[key]] = value;
    });
    window.gtag("config", config.ga4MeasurementId, tagConfig);
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + config.ga4MeasurementId);
  }

  function cleanReferrer(value) {
    try { var url = new URL(value); return url.origin + url.pathname; }
    catch (_) { return ""; }
  }

  function track(name, placement) {
    if (!initialized || consent !== "granted" || !allowedEvents.has(name)) return;
    try {
      if (gaEnabled) window.gtag("event", name, {
        send_to: config.ga4MeasurementId,
        cta_placement: placement,
        transport_type: "beacon"
      });
    } catch (_) { /* Analytics must not interrupt navigation. */ }
  }

  // Attach in capture phase so existing menu handlers keep working independently.
  document.addEventListener("click", function (event) {
    if (event.button !== 0) return;
    var element = event.target;
    var link = element && element.closest && element.closest("a[data-analytics-event]");
    if (link) track(link.dataset.analyticsEvent, link.dataset.analyticsPlacement);
  }, true);

  function clearAnalyticsCookies() {
    var names = document.cookie.split(";").map(function (cookie) {
      return cookie.trim().split("=")[0];
    }).filter(function (name) { return /^_ga(?:_|$)/.test(name); });
    var domains = ["", window.location.hostname, ".arunodaycare.com"];
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/" +
          (domain ? "; domain=" + domain : "") + "; SameSite=Lax";
      });
    });
  }

  function setConsent(granted) {
    consent = granted === true ? "granted" : "denied";
    try { window.localStorage.setItem(consentKey, consent); } catch (_) {}
    if (initialized) {
      window.gtag("consent", "update", { analytics_storage: consent });
    } else if (consent === "granted") {
      startAnalytics();
    }
    if (consent === "denied") clearAnalyticsCookies();
    if (banner) banner.hidden = true;
  }

  window.arunodayAnalytics = Object.freeze({ setAnalyticsConsent: setConsent });

  if (gaEnabled) {
    startAnalytics();
    banner = document.createElement("section");
    banner.id = "analyticsConsent";
    banner.setAttribute("aria-label", "Analytics preferences");
    banner.hidden = consent !== null;
    var message = document.createElement("p");
    message.textContent = "May we use Google Analytics cookies to understand visits and improve this website? Your choice is optional. We do not enable advertising cookies.";
    banner.appendChild(message);
    var actions = document.createElement("div");
    actions.className = "analytics-consent-actions";
    [["Accept analytics", true], ["Decline", false]].forEach(function (choice) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = choice[0];
      button.addEventListener("click", function () { setConsent(choice[1]); });
      actions.appendChild(button);
    });
    banner.appendChild(actions);
    document.body.appendChild(banner);
    var preferences = document.createElement("button");
    preferences.id = "analyticsPreferences";
    preferences.type = "button";
    preferences.textContent = "Analytics preferences";
    preferences.setAttribute("aria-controls", banner.id);
    preferences.addEventListener("click", function () {
      banner.hidden = !banner.hidden;
      if (!banner.hidden) banner.querySelector("button").focus();
    });
    var footer = document.querySelector("footer");
    (footer || document.body).appendChild(preferences);
  }
})();
