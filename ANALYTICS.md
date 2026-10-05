# ArunodayCare GA4

Measurement ID: **G-CMGQJWG9KR**. GA4 only; no Clarity or Search Console integration.

## Tracking

| Event | Trigger | Meaning |
| --- | --- | --- |
| project_enquiry | Start a Project; Discuss a project; Discuss executive training | Opens contact section |
| start_conversation | Start a conversation | Opens contact section |
| whatsapp_click | WhatsApp link | Contact intent |
| phone_click | Phone link | Contact intent |
| email_click | Email link | Contact intent |
| explore_products | Hero Explore products | Product interest |

There is no form. No successful-enquiry or generate_lead event is claimed.

Existing styles, original JavaScript, link destinations and visible text are preserved. The scripts run in order, load the Google tag asynchronously, and only enable tracking on arunodaycare.com and www.arunodaycare.com. Missing/invalid IDs and local previews do not load GA4. UTM campaign values are mapped to GA4's campaign fields; unrelated URL query parameters and fragments are excluded from the reported page URL. Never include personal information in UTM links.

## Account settings to finish

In Google Analytics → Admin → Data display → Key events, create key events named **whatsapp_click**, **phone_click**, and **email_click**. These are contact attempts, not confirmed conversations. Keep **project_enquiry**, **start_conversation**, and **explore_products** as engagement events. Leave automatic outbound `click` unmarked to avoid counting the same contact action twice.

Create an event-scoped custom dimension with event parameter **cta_placement** if you want reports by navigation/hero/training/contact placement.

After publication, open https://arunodaycare.com and Google Analytics → Reports → Realtime. Check page views and click **Explore products** or **Discuss a project** to check their named events. Google Tag Assistant can provide a more detailed inspection. Dashboard receipt and account settings require access to the owning GA4 account; they are not confirmed by code verification.

## Consent

The page presents a small **Accept analytics / Decline** choice and an **Analytics preferences** button in the footer. GA4 loads only after acceptance. Choices are remembered on this browser; a visitor may change them from the footer. Declining stops custom tracking and removes GA cookies on the site. Advertising storage, advertising user data, advertising personalization and Google signals remain disabled.

The previous version kept analytics storage denied without providing a consent choice. The correction requires a new publication. After publishing, accept analytics during a real site visit and check the correct GA4 property's Realtime report. Standard reports can take 24–48 hours. Browser content blockers can also prevent collection.

## References

- GA4 configuration and campaign fields: https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- Event setup: https://developers.google.com/analytics/devguides/collection/ga4/events
- Google consent mode: https://developers.google.com/tag-platform/security/guides/consent
