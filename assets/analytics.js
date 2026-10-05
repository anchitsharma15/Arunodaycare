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

  if (gaEnabled) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    // Do not assume visitor consent. No advertising storage or personalization.
    window.gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied",
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
    if (!allowedEvents.has(name)) return;
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

  window.arunodayAnalytics = Object.freeze({
    // Call only from a consent manager after an actual visitor decision.
    setAnalyticsConsent: function (granted) {
      var status = granted === true ? "granted" : "denied";
      if (gaEnabled) window.gtag("consent", "update", { analytics_storage: status });
    }
  });
})();
