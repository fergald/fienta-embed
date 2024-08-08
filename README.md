# What is this?

This is the fienta embe script from https://fienta.com/embed.js with 1
extra setting, `stopPropagation`. This setting works around Wix's
over-zealous click handler which ignores `preventDetault()` and
navigates anyway.

# How to use it?

Using this setting is tricky since it cancels the event entirely, so
it's best to have the fienta `embed.js` be the last script that runs
in pageload, so that it installs its event handler last. Even then
- there's a chance it won't be last and some other scripts will lose
  visibility of click events
- some Wix click-handler things will behave oddly

Both of these are probably harmless since the click's purpose is to
show the Fienta UI, so it's not a navigation click that would feed
into analytics.

# This repo

This is a temporary repo for communication with fienta. There are 3 branches
- `original` - I check in the original embed.js
- `formatted` - I format the original
- `main` - formatted original with my changes on top
