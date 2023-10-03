# TODO 

### Camera
- [x] Fix alignings via view shot

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

- [ ] Something to tell the user to move camera closer / further away from face.
- [ ] ***[Aaron]*** Change most paragraph texts to not blend in with background.

### Functionality
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

### Optimisation & Cleanup
- [x] Fix so that setup scenes use `MultiAnimator` instead of `Animator`s
- [x] Remove output footage file after saving to media library.

### SCENES
- [x] Face calibration scene
- [x] Option scene
- [x] Tutorial / introduction scene before / after setup.
- [x] "Stitcher Scene" - generates the output video
  - [x] Set gif quality 
- [x] Cleaning scene - remove bad images.
- [x] Loading scene when generating result.
  - [x] Probably with info like number of pictures taken.

### Feedback I've gotten
- [x] ***[Arman]*** Lowest quality should be named "Low" instead of "Okay"
- [x] ***[Hugo]*** Override framerate option.

- [ ] ***[Aaron]*** Difficult to know where to place face. Images don't really align that well.

### Before release
- [ ] Come up with app name
- [ ] Cleanup unused assets / imports
- [ ] Don't allow ipad installs because I'm lazy redoing all of the UI.
- [ ] Ads
- [x] Redo logo and app icon
- [ ] Fix splash screen
- [ ] Remove debug components like button to import selfies and `DebugDots`

### Other
- [x] Create readme

# Future things to implement
- [ ] ***[Marco]*** Have a backend server to share images with friends to see their latest images taken.
- [ ] ***[Marco]*** Have diffrent types of scrapping animations, like a paper-shredder / burning paper.
- [ ] ***[Hugo]*** Some type of streak system
- [ ] Darkmode?
- [ ] Background color for `PictureManipulator` (default rn is white)
- [ ] Notifications
- [ ] Android?

