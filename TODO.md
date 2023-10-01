# TODO 

### Camera
- [x] Fix alignings via view shot

### UI
- [x] Better options button
- [x] Better face aligning texture
- [x] Better fade out anim for align
- [x] Display actual date on result scene
- [ ] Darkmode?
- [x] Loading indicator on preview scene when clicking yes (for saving image)
- [ ] Fix or remove scrolling background in `Preview.tsx`
- [ ] Maybe some deco in the setup scene and preview and result because they look boring.
- [x] Camera button scale down for notifying that user pressed.
- [ ] Something to tell the user to move camera closer / further away from face.
- [x] Make some other animation on result scene for first image yk (when first image has been taken)
- [x] Go back button for composer scene.
- [ ] Some way of telling how long it takes to generate a 30 second footage when selecting how often to selfie.
- [x] Merge all menu styles into one style
- [x] Faster animations - make it look more snappy
- [ ] ***[Aaron]*** Change most paragraph texts to not blend in with background.
- [ ] Some indicator for `FaceRotationView` when rotation is too severe.
- [x] Redesign menu scenes. (Preferences, composer, ...)

### Functionality
- [x] Make name and times per day save to localstorage
- [x] No auto correct / spell check on name input
- [x] Save to med lib (temp)
- [x] Be able to click to skip result scene
- [x] Make the setup scenes automatically skip if they've been completed.
- [x] Make setup scenes save data
- [ ] Be able to go back to setup scene (maybe)
- [x] Flashlight (ring light)
- [x] Deactivate buttons in preview scene when removing or saving image
- [x] Stop other button clicking in camera scene when opening preferences or preview
- [ ] Option to use front camera instead
- [ ] Remove all data (images)
- [x] Confirm click on danger zone in preferences
- [ ] Make flashlight use torch on take image
- [ ] Background color for `PictureManipulator` (default rn is white)

### Post processing
- [x] Option to not transform image
- [x] Process images and convert to gif / video
- [x] Add advances settings for e.g override bitrate.

### Bugs
- [x] Fix so that preview image does not disappear (?)
- [ ] Fix so that image transformer can't get stuck.
- [x] When generating footage, images are not sorted by date.
- [x] That one preferences bug where when you close preferences, it reopens and immediatly closes
- [x] Preferences icon for some reason disappears.

### Optimisation & Cleanup
- [x] Fix so that setup scenes use `MultiAnimator` instead of `Animator`s 

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
- [ ] ***[Arman]*** Highest quality should be enabled by default
- [ ] ***[Aaron]*** Difficult to know where to place face. Images don't really align that well.
- [x] ***[Hugo]*** Override framerate option.

### Before release
- [ ] Come up with app name
- [ ] Cleanup unused assets / imports

### Other
- [x] Create readme

# Future things to implement
- [ ] ***[Marco]*** Have a backend server to share images with friends to see their latest images taken.
- [ ] ***[Marco]*** Have diffrent types of scrapping animations, like a paper-shredder / burning paper.
- [ ] ***[Hugo]*** Some type of streak system

