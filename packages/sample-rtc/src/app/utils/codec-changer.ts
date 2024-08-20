export function setCodecToOpus(sdp: string) {
  return sdp.replace(
    /a=mid:audio\r\n/g,
    'a=mid:audio\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1\r\n',
  );
}

export function adjustPacketizationInterval(sdp: string) {
  return sdp.replace(
    /a=fmtp:111 minptime=10/g, // Existing configuration in SDP
    'a=fmtp:111 minptime=10;maxaveragebitrate=64000;stereo=1;useinbandfec=1;cbr=1;ptime=10', // Force ptime (packetization time) to 10ms
  );
}
