So real progress when doing DSA comes from solving questions yourself and get your brain actually working. However temptations are typically too sweet to resist and you might find yourself on the solutions tab after spending 2 seconds on the problem.

I struggled with this issue so for my own use I decided to build an extension that locks out the solution and editorial tab for a period minimum 20 mins max 3 hours based on how much time I think it would take me to solve a problem. So for that particular time I cannot view the solutions at all and try and solve it myself.
<img width="1911" height="636" alt="image" src="https://github.com/user-attachments/assets/edaec7ff-3da3-437b-b5d0-5be2de9df11c" />
<img width="395" height="364" alt="image" src="https://github.com/user-attachments/assets/54af4807-4779-4099-b495-0929501fc9fd" />
when you click on solutions or editorial 
<img width="1915" height="958" alt="image" src="https://github.com/user-attachments/assets/4b2a2df0-74c1-415d-ae9e-fd62c4dea8d1" />

it does have an early release option but since that might also be a possible way out and you get stuck in the same loop I am trying to add another flow where if the timer's On and you have a successful submission (Accepted) the timer will exit on it's own otherwise the solutions would still be locked till the end. Working on this one for now 

## To use:
1. Clone the repo onto your local machine.
2. Go to chrome or brave or any browser of your choice and open extensions.
3. In extensions page you'll need to turn ON developer mode.
4. Once dev mode is on click on load unpacked and select the cloned repo from your device and you're good to go!
5. Use it from your extension list whenever you open leetcode (trying to add an automatic popup if possible like when you open a problem it pops up automatically) -------> Select time duration minimum is 20 mins max 3 hours and start solving ! -----> try not to peek Oogway will definitely catch you.


## Project structure
leetcode-focus-lock/
├── manifest.json      # Manifest V3 config
├── background.js      # Service worker: owns session state + alarms
├── content.js          # Injected on leetcode.com: widget + lock overlay
├── content.css          # Styling for the injected UI
├── popup.html/.css/.js  # Extension toolbar popup
├── pixelart.js           # Shared pixel-mascot SVG renderer ("Oogway")
├── icons/                # Generated pixel-art toolbar/store icons
└── README.md
