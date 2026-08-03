
# Mochi is Watching
So real progress when doing DSA comes from solving questions yourself and get your brain actually working. However temptations are typically too sweet to resist and you might find yourself on the solutions tab after spending 2 seconds on the problem.

I struggled with this issue so for my own use I decided to build an extension that locks out the solution and editorial tab for a period minimum 20 mins max 3 hours based on how much time I think it would take me to solve a problem. So for that particular time I cannot view the solutions at all and try and solve it myself.
<img width="1907" height="680" alt="image" src="https://github.com/user-attachments/assets/9d0e2ac9-6ee7-47e7-84d0-f7a2cdf03305" />

<img width="392" height="423" alt="image" src="https://github.com/user-attachments/assets/c0bea5bd-e904-494b-905a-2d3228345f81" />



it does have an early release option but since that might also be a possible way out and you get stuck in the same loop I am trying to add another flow where if the timer's On and you have a successful submission (Accepted) the timer will exit on it's own otherwise the solutions would still be locked till the end. Working on this one for now .

- **Per-question timer** — set anywhere from 20 minutes to 3 hours for the
  problem you're currently on.
- **Full-screen block** — if you navigate to that problem's Solutions,
  Editorial, or Discuss page while a session is running, a full-viewport
  lock screen covers everything: a "I caught you" speech bubble, Mochi
  giving you a shocked look (red glow + shake), a live countdown, and a
  progress bar. A button also lets you trigger real browser Fullscreen mode(this ones kinda flawed as of now).
- **Floating widget** — a small pixel window sits in the corner of every
  problem page with Mochi perched right on top of it, showing your countdown.
- **Day / night theme ** — the whole UI switches automatically
  based on your local time . I had fun with this one
- **Black-outline "sticker" buttons** — white/pastel fill, black border,
  black text (auto-inverts to cream-on-navy for the night theme so it stays
  legible against the darker art).
- **Notification** when your timer ends.
- **Give up early** is possible (this is a discipline tool, not a prison) but
  it always asks you to confirm first.



=======
## To use:
1. Clone the repo onto your local machine.
2. Go to chrome or brave or any browser of your choice and open extensions.
3. In extensions page you'll need to turn ON developer mode.
4. Once dev mode is on click on load unpacked and select the cloned repo from your device and you're good to go!
5. Use it from your extension list whenever you open leetcode (trying to add an automatic popup if possible like when you open a problem it pops up automatically) -------> Select time duration minimum is 20 mins max 3 hours and start solving ! -----> if you peek mochi will definitely catch you.


## Project structure
leetcode-focus-lock/
├── manifest.json      # Manifest V3 config (declares assets/ as web-accessible)
├── background.js      # owns session state + alarms
├── content.js          # Injected on leetcode.com: widget + lock overlay
├── content.css          # Themed styling (day/night skies)
├── popup.html/.css/.js  
├── assets/               
├── icons/                
└── README.md
```


- Sessions are tracked per problem slug, so switching problems mid-session
  doesn't dodge the timer for the one you're actually locked into — but each
  problem can have its own independent session.
=======
>>>>>>> b50909ec9ee7e7ebeb13eeeb8088f5efa01ce7b1
