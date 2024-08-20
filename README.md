# Laptop Karaoke

## Introduction

You know what I hate about karaoke setups? They're practically huge... not so portable after all. How about speakers with microphones? Who brings microphones to their outings, right? So, I came up with a solution. What if you have (1) an output device (phone/laptop), (2) a local network, (3) portable microphones (i.e., mobile devices), and (4) a speaker. Hey, what do you know - we have this almost always (don't judge me with the speakers)! So, I created an application that acts like a portable karaoke! We use our mobile phones as microphones, and the laptop (or another mobile device connected to a speaker) as the output/speakers. Amazing!!!

### Tech Stack

1. `WebRTC` for peer-to-peer connectivity
1. `WebSocket` on `ElysiaJS` for the signaling server
1. `Angular` as the web framework

## Installation

Install `openssl` and `bun.js` on your device. Then type into the terminal `bun run gen-keys`. Then, run `bun i` to install all dependencies.

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
1. You need to be connected to a router (and not just a mobile hotspot) because each device needs to have an IP address for WebRTC to work (or tell me if you find a way to fix this by creating an issue! I'll be glad to update the project).
