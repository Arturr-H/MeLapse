#!/bin/bash
# This file will update the "Info.plist" file which is located
# in the ios/MeLapse/ folder, because it is generated by expo
# prebuild with the default NS(...)UsageDescription.
#
# If you can't run this file, do chmod 777 updatePlist.sh

wd=$(pwd)
plist_file="$wd/Info.plist"

bundle_short_version_key="CFBundleShortVersionString" # number.number.number
bundle_ver_key="CFBundleVersion" # number

bundle_short_version=$(defaults read $plist_file $bundle_short_version_key)
bundle_version=$(defaults read $plist_file $bundle_ver_key)

IFS='.' read -ra version_parts <<< "$bundle_short_version"
if [ "${version_parts[2]}" -eq 99 ]; then
  version_parts[2]=0
  ((version_parts[1]++))
else
  ((version_parts[2]++))
fi

new_bundle_short_version="${version_parts[0]}.${version_parts[1]}.${version_parts[2]}"
new_bundle_version=$((bundle_version + 1))

defaults write "$plist_file" $bundle_short_version_key -string $new_bundle_short_version
defaults write "$plist_file" $bundle_ver_key -string $new_bundle_version

plutil -convert xml1 "$plist_file"

if [ -e Info.plist ]
then
    if [ -d ./ios/MeLapse ]
    then
        cp Info.plist ./ios/MeLapse/Info.plist
        echo "Info.plist updated successfully"
        echo "Bumped version to $new_bundle_short_version and build number to $new_bundle_version"
        echo "⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️ DON'T FORGET TO UPDATE app.json APP VER TO $new_bundle_short_version"
    else
        echo "No ios dir, probably need to run '> expo prebuild'"
    fi
else 
    echo "No Info.plist file found in root 😣"
fi
