# Fashion Lens

A responsive fashion-discovery app built with React Native and Expo. It runs on
Android and web.

## Run locally

Start the Quarkus API first (see the backend README), then run:

```bash
npm install
npm run android
```

The Android app uses Firebase's native authentication, so run it in a
development build (Expo Go does not include the required native module).
Android Studio and an Android SDK are required for `npm run android`. Once
installed, start Metro with `npx expo start --dev-client`.

For web, run `npm run web`. The app defaults to `http://localhost:8080` on web
and `http://10.0.2.2:8080` on the Android emulator. To connect to another API,
set `EXPO_PUBLIC_API_BASE_URL` before starting Expo. Physical Android devices
need a backend URL reachable on the same network.

## Deploy web app to Firebase Hosting

The Firebase Hosting configuration serves Expo's web export from `dist` and
rewrites app routes to `index.html`. The default Firebase project is
`fashionlens-da167`.

1. Sign in to Firebase CLI using an account with access to this project:

   ```bash
   npx firebase-tools login
   ```

2. Export the web app and deploy it:

   ```bash
   npx expo export --platform web
   npx firebase-tools deploy --only hosting
   ```

3. Add the deployed `fashionlens-da167.web.app` domain in Firebase
   Authentication → Settings → Authorized domains if it is not already listed.

## Firebase email and password login setup

1. In Firebase Console, open **Authentication → Sign-in method** and enable
   **Email/Password**.
2. Register an Android app with package name `com.fashionlens.app`, then put
   its `google-services.json` in this project root. The JSON file is
   git-ignored.
3. Register a Firebase web app and copy its web configuration values into a
   `.env.local` file using [.env.example](./.env.example) as a template. Keep
   `.env.local` out of version control.
4. Add your web host to Firebase Authentication's authorized domains.
5. Rebuild the Android development app after adding `google-services.json`:

   ```bash
   npx expo run:android
   ```

Users can create an account with an email and password, sign in, and request a
password-reset email. Firebase email/password authentication does not send paid
SMS messages. The UI remains on the login page until Firebase confirms an
authenticated account.

## Features

- Browse sample fashions for women, men, and kids and babies.
- Require Firebase email/password authentication before showing the shopping
  page.
- Filter by clothing category, search, sort, and save styles.
- Search the backend's product listings on demand.
- Load seller prices and direct retailer product links from live seller offers
  when the provider supplies them. Sample listing buttons open a search on the
  named retailer and are not confirmed product pages.
- Select a fashion photo and preview it locally; it is only uploaded after
  tapping **Search this photo**.
- Open live search result links to the seller where available.

Listings are marked as samples until a SerpApi key is configured on the backend.
Live results are returned through SerpApi's Google Shopping and Google Lens
engines; they are not guaranteed official marketplace listings or a complete
price comparison. For a live product, choose **Load seller prices & product
links** to retrieve merchant offers; each **Shop on [store]** link opens the
retailer URL supplied for that offer, not a generic Google Shopping page.
Loading offers uses one additional provider search per product and is labelled
in the UI. A direct retailer link is only shown when the provider returns one.
Sample products and prices are illustrative; their store buttons search that
retailer for the sample product name.
The current SerpApi Free plan lists 250 successful searches per month. Review
provider terms and pricing before launch.
