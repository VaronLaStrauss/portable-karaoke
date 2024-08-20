# Portable Karaoke

## Installation

Install `openssl` and `bun.js` on your device. Then type into the terminal `bun run gen-keys`.

## Running

Open two terminals and run:

```sh
# terminal 1
cd sample/sample-rtc
bun run start --host 0.0.0.0 --ssl
# terminal 2
cd server sample/server
bun run dev
```

Connect to `https://<your-ip-address>:4200` to view the website.

Go to `<URL>/speak` for people who will be using the microphones.

The speaker (aka the laptop) should have an open browser tab on `<URL>/listen`.

## Caveats

1. There should be only 1 instance running on a given signaling server. Change the ports if you want multiple ones.
1. Sometimes, connecting from a remote source takes multiple attempts. This is a known bug and can be circumvented by retrying.
1. Before opening the `/speak` routes, make sure that you have a `/listen` route already open (preferrably on a device connected to a speaker). This would not work the other way around (`/speak` first before `/listen`).
