# TODO 

### UI
- [x] Better options button
- [x] Better face aligning texture
- [x] Better fade out anim for align
- [x] Display actual date on result scene
- [x] Loading indicator on preview scene when clicking yes (for saving image)
- [x] Camera button scale down for notifying that user pressed.
- [x] Make some other animation on result scene for first image yk (when first image has been taken)
- [x] Go back button for composer scene.
- [x] Merge all menu styles into one style
- [x] Faster animations - make it look more snappy
- [x] Redesign menu scenes. (Preferences, composer, ...)
- [x] Fix or remove scrolling background in `Preview.tsx`
- [x] Add to `Tutorial` scene what the `TiltOverlay` does.

### Functionality
- [x] Fix alignings via view shot
- [x] Make name and times per day save to localstorage
- [x] No auto correct / spell check on name input
- [x] Save to med lib (temp)
- [x] Be able to click to skip result scene
- [x] Make the setup scenes automatically skip if they've been completed.
- [x] Make setup scenes save data
- [x] Flashlight (ring light)
- [x] Deactivate buttons in preview scene when removing or saving image
- [x] Stop other button clicking in camera scene when opening preferences or preview
- [x] Confirm click on danger zone in preferences
- [x] Remove all data (images)
- [x] Make flashlight use torch on take image
- [x] Replace the current imagePointers `AsyncStorage` system with a file r/w parsing system. (Async storage is not persisted across newer testflight versions and is not very reliable IMO)
- [x] Review images scene should be reversed (recent image first and oldest image last)
- [x] `PictureManipulator` should be placed behind camera, because it just causes confusion to what's happening.
- [x] Better animations for switching from camera scene to preview
- [x] Better ways of telling the user to move head up / down / left / right
- [x] **[HUGO]** Save instead of back on advanced composer. Also change title
- [x] Loading when deleting all selfies

### Post processing
- [x] Option to not transform image
- [x] Process images and convert to gif / video
- [x] Add advances settings for e.g override bitrate.

### Bugs
- [x] Fix so that preview image does not disappear (?)
- [x] When generating footage, images are not sorted by date.
- [x] That one preferences bug where when you close preferences, it reopens and immediatly closes
- [x] Preferences icon for some reason disappears.
- [x] Fix button pressing in `camera` scene. Two buttons can be pressed at the same time (because they perform transitions which takes a while), which can cause scene changes from nowhere.
- [x] Fix so that image transformer can't get stuck.
- [x] Bitrate input is capped at like 6 digits. Need more room for decimals.
- [x] middleFace in `Calibration` scene isn't in the middle and should be fixed.
- [x] Camera is still detecting faces for some reason when not active.
- [x] Fix "edgecase" where user doesn't allow camera access (`Calibration` and `Camera` scene)
- [x] Make so that user needs atleast 5 images to generate footage.
- [x] Fix notification bug where if you press select amount of times per day multiple times it sends notifications said times per occurance.

### Optimisation & Cleanup
- [x] Fix so that setup scenes use `MultiAnimator` instead of `Animator`s
- [x] Remove output footage file after saving to media library.
- [x] Remove floater component. People don't notice it and it just causes bad performance 

### SCENES
- [x] Face calibration scene
- [x] Option scene
- [x] Tutorial / introduction scene before / after setup.
- [x] "Stitcher Scene" - generates the output video
  - [x] Set gif quality 
- [x] Cleaning scene - remove bad images.
- [x] Loading scene when generating result.
  - [x] Probably with info like number of pictures taken.
- [x] Statistics scene
- [x] Remove the name scene and probably redo `HowMany.tsx` scene

### Feedback I've gotten
- [x] ***[Arman]*** Lowest quality should be named "Low" instead of "Okay"
- [x] ***[Hugo]*** Override framerate option.
- [x] ***[Aaron]*** Difficult to know where to place face. Images don't really align that well.

### Before release
- [x] Come up with app name
- [x] Cleanup unused assets / imports
- [x] Don't allow ipad installs because I'm lazy redoing all of the UI.
- [x] Ads
- [x] Redo logo and app icon
- [x] Fix splash screen
- [x] Enable ads (enable production ads in .env)
- [x] Remove debug components like button to import selfies and `DebugDots`

### Other
- [x] Create readme
- [x] Rendering footage should return to composer scene not camera scene
- [x] Default quality should be high
- [x] Improve grammar and spelling in preferences and composer scene.
- [x] Fix ads being cutoff on smaller devices (IMPORTANT)
- [x] Fix selecting ads which are targetted or not
- [x] Implement after welcome scene to ask about privacy policy and more
- [x] Fix calibration scene being able to be skipped (warn in camera scene)

## Before build
* Set `PRODUCTION_ADS` to true (ONLY CHANGE BACK AFTER BUILD FOR DEV)
* Set `initialRoute` in `App.tsx`
* `expo prebuild`
* `./updatePlist.sh`
* Bump version
* Increment `buildNumber` in `app.json` -> `expo.ios.buildNumber`
* `eas build -p ios`

# Future things to implement
- [ ] Fix quality steps. From 1, to 6, to 64 is dumb
- [ ] ***[Marco]*** Have a backend server to share images with friends to see their latest images taken.
- [ ] ***[Marco]*** Have diffrent types of scrapping animations
  - burning paper
  - paper-shredder
  - denied stamp ««
  - garbage folder ««
- [ ] ***[Hugo]*** Some type of streak system
- [ ] Darkmode?
- [ ] Background color for `PictureManipulator` (default rn is white)
- [x] Notifications
- [ ] Android?

### Todo for v1.0.77
- [x] Fix ads not working
- [x] Remove `result` scene

### Todo for v1.0.78
- [ ] Streak system?
- [ ] Fix `BigText` counter being -1
- [ ] Fix bug where users are sent back to welcome scene (IMPORTANT)
- [ ] Fix so you can view your photo after its been taken (better way)
- [ ] Onionskin opacity slider?
- [ ] Add aaron in credits scene
- [ ] Fix `BigText` color to no opacity
- [ ] Improved calibration scene 
- [ ] What is this app scene in tutorial bc many seem to download the app without reading description
- [ ] Maybe some ad after taking picture in preview scene
