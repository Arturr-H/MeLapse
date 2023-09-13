# TODO 

### Camera
- [x] Fix alignings via view shot

### UI
- [x] Better options button
- [x] Better face aligning texture
- [x] Better fade out anim for align
- [x] Display actual date on result scene
- [ ] Darkmode?
- [ ] Animate away face align indicator upon faces.length == 0
- [x] Loading indicator on preview scene when clicking yes (for saving image)
- [ ] Fix or remove scrolling background in `Preview.tsx`
- [ ] Maybe some deco in the setup scene and preview and result because they look boring.
- [ ] Camera button scale down for notifying that user pressed.
- [ ] Something to tell the user to move camera closer / further away from face.
- [ ] Make some other animation on result scene for first image yk
- [ ] Go back button for composer scene.
- [ ] Some way of telling how long it takes to generate a 30 second footage when selecting how often to selfie.
- [x] Merge all menu styles into one style

### Functionality
- [x] Make name and times per day save to localstorage
- [x] No auto correct / spell check on name input
- [x] Save to med lib (temp)
- [x] Be able to click to skip result scene
- [ ] Make the setup scenes automatically skip if they've been completed.
- [x] Make setup scenes save data
- [ ] Be able to go back to setup scene (maybe)
- [ ] Flashlight (ring light)
- [x] Deactivate buttons in preview scene when removing or saving image
- [x] Stop other button clicking in camera scene when opening preferences or preview
- [ ] Option to use front camera instead
- [ ] Remove all data (images)
- [ ] Confirm click on danger zone in preferences

### Post processing
- [x] Option to not transform image
- [x] Process images and convert to gif / video

### Bugs
- [ ] Fix so that preview image does not disappear (?)
- [ ] Fix so that image transformer can't get stuck.

### Optimisation & Cleanup
- [x] Fix so that setup scenes use `MultiAnimator` instead of `Animator`s 

### SCENES
- [ ] Face calibration scene
- [x] Option scene
- [ ] Tutorial / introduction scene before / after setup.
- [x] "Stitcher Scene" - generates the output video
  - [x] Set gif quality 
- [ ] Cleaning scene - remove bad images.
- [x] Loading scene when generating result.
  - [x] Probably with info like number of pictures taken.

### Before release
- [ ] Don't save photos to user media lib

# Other
- [x] Create readme


