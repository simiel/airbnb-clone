# airbnb

A React Native app that recreates the Airbnb explore experience over a bundled set of Berlin listings: a clustered price map, a draggable sheet of stay cards, a parallax listing page, and Clerk sign-in. It is a local mobile prototype (iOS, Android, and web) for anyone reading the code or running the Explore flow. Wishlists, Trips, Inbox, Profile, and the booking screen are still placeholders.

Built by [Samuel Mensah](https://github.com/simiel).

## Features

- **Explore header.** A search pill opens the booking modal. A horizontal category row (Tiny homes, Cabins, Trending, Play, City, Beachfront, Countryside) tracks the active chip, scrolls it into view, and fires a light haptic on selection.
- **Clustered map.** `listings.geo.json` is drawn with price markers. Clusters use a custom marker that shows the point count. A locate button requests foreground location permission and animates the camera to the device.
- **Listing sheet.** A bottom sheet snapped at 10% and 100% sits over the map and lists every stay: photo, name, rating, room type, and nightly price in euros. A floating Map button collapses the sheet back to the map. Changing category replays the row enter and exit animation.
- **Listing detail.** `/listing/[id]` looks up the record and renders a scroll-linked parallax photo (translate and scale), a navigation bar that fades in as the page scrolls, host name and photo, room and guest counts, the description, and a system share action for the listing URL. A sticky footer shows the nightly price and a Reserve button.
- **Sign-in.** The root layout wraps the tree in Clerk and caches the session token with Expo SecureStore. Once Clerk has loaded and there is no session, the login modal opens. Apple, Google, and Facebook sign-in run through Clerk OAuth; a created session is set active and the modal closes.

## Tech stack

| Area | Choice |
| --- | --- |
| App | Expo SDK 50, React Native 0.73.4, React 18.2, TypeScript 5.3 (`strict`) |
| Navigation | Expo Router 3.4, file-based routes, `typedRoutes` enabled |
| Auth | `@clerk/clerk-expo`, `expo-secure-store`, `expo-auth-session`, `expo-web-browser` |
| Maps | `react-native-maps`, `react-native-map-clustering`, `expo-location` |
| Motion and gestures | Reanimated 3, `react-native-gesture-handler`, `@gorhom/bottom-sheet`, `expo-haptics` |
| Icons and fonts | `@expo/vector-icons`; Montserrat Regular, SemiBold, and Bold via `expo-font` |
| Native | Hermes (`ios/Podfile.properties.json`), iOS 13.4, bundle id `com.simiel.airbnb` |
| Tests | Jest 29 with the `jest-expo` preset |

`app.json` sets portrait orientation, iPad support, the `myapp` URL scheme, and a Metro web build with static output. `react-native-web` is included for that web target. The iOS Xcode project and CocoaPods lockfile are in `ios/`. The Android native project is produced by `expo run:android`.

The font loader also pulls in FontAwesome, and `assets/fonts/` includes the rest of the Montserrat family plus Space Mono. Splash screen hide waits until those fonts have loaded.

## Architecture

Stay data is static JSON in the repo. `assets/data/listings.json` contains **666** Berlin, Germany records in the Inside Airbnb field layout, with `last_scraped` of `2017-05-08`. `assets/data/listings.geo.json` is a GeoJSON `FeatureCollection` of **667** features and is what the map renders. `interfaces/listing.ts` types the listing, host, amenities, review scores, and geolocation. Cards and the detail page show the star rating as `review_scores_rating / 20`, converting the stored 0–100 score to a 5-point value. Prices render in euros.

```
app/
  _layout.tsx            Clerk provider, SecureStore token cache, fonts, splash, root stack
  (tabs)/
    _layout.tsx          Explore, Wishlists, Trips, Inbox, Profile
    index.tsx            category state, map, and listing sheet
    wishlists.tsx        placeholder
    trips.tsx            placeholder
    inbox.tsx            placeholder
    profile.tsx          placeholder
  (modals)/
    login.tsx            email field, phone button, Apple / Google / Facebook OAuth
    booking.tsx          placeholder body; Stays / Experiences header toggle
  listing/[id].tsx       listing detail
components/
  ExploreHeader.tsx      search pill, filter control, category scroller
  ListingsMap.tsx        clustered map and locate control
  ListingsBottomSheet.tsx
  Listings.tsx           animated listing rows
  ModalHeaderText.tsx    Stays / Experiences switch
constants/               Colors and shared styles (primary #FF385C)
interfaces/listing.ts
assets/data/             listings.json, listings.geo.json, places.ts
assets/fonts/            Montserrat family, Space Mono
ios/                     Xcode project, workspace, Podfile
```

`tsconfig.json` maps `@/*` to the repo root. `babel.config.js` registers the Reanimated Babel plugin.

## Getting started

**Prerequisites**

- Node.js and npm. Dependencies are locked with npm (`package-lock.json`, lockfileVersion 3).
- For an iOS simulator or device build: macOS, Xcode, and CocoaPods. `ios/Podfile` targets iOS 13.4.
- For Android: a local Android SDK. `npm run android` runs `expo run:android`.
- A Clerk publishable key so the auth provider and OAuth buttons can start a session.

**Install**

```bash
npm install
```

**Environment**

The app reads one variable, in `app/_layout.tsx`:

| Variable | Role |
| --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key passed to `ClerkProvider` |

Put it in a `.env` file at the repo root. Apple, Google, and Facebook buttons call the Clerk strategies `oauth_apple`, `oauth_google`, and `oauth_facebook`, so those providers need to be enabled on the Clerk instance that issued the key.

**Run**

```bash
npm start          # expo start
npm run ios        # expo run:ios
npm run android    # expo run:android
npm run web        # expo start --web
```

**Test**

```bash
npm test           # jest --watchAll
```

Jest uses the `jest-expo` preset from `package.json`. The repository has no test files yet, so the watcher opens an empty suite.

## Project status

Personal prototype. The initial commit is 10 February 2024; the latest commit is 19 July 2024.

The Explore tab, the listing detail page, and Clerk OAuth (Apple, Google, Facebook), including the SecureStore token cache and the login redirect, are implemented.

These pieces are still stubs or unwired:

- Wishlists, Trips, Inbox, and Profile render a static label.
- The booking modal body is a single text node. The Stays / Experiences control in its header only toggles local state.
- Continue (email) and Continue with Phone have no press handlers. The filter control, heart icons, and Reserve button are the same.
- Tapping a map marker does not open the listing. The `router.push` in `ListingsMap` is commented out.
- Category selection does not filter the data. It clears the list for 200ms, then shows the full set of 666 listings again.
- `assets/data/places.ts` exports destination cards (I'm flexible, United States, Italy, Middle East, Netherlands, Southeast Asia) and is never imported. The `world-*.png` files it requires are not in the repo.

## What this demonstrates

- File-based navigation with Expo Router: a five-tab layout, modal presentations for login and booking, and a dynamic `/listing/[id]` route, with typed routes enabled.
- A map and a gesture-driven bottom sheet working as one screen: clustered GeoJSON markers, a custom cluster renderer, a locate control backed by foreground location permission, and a Map action that collapses the sheet.
- Reanimated used for real UI motion: list rows that fade in and out, and a detail header whose image scale, translation, and bar opacity are driven by scroll offset.
- On-device auth with Clerk: three OAuth strategies, a SecureStore token cache on the provider, and a layout effect that opens login when the session is missing.
- A typed model for a large static dataset (666 listing records plus a GeoJSON companion) rendered both as price markers and as a bottom-sheet list.
- A checked-in iOS app (Hermes, location usage strings, custom fonts, splash held until fonts load) next to Expo scripts for Android and web.
