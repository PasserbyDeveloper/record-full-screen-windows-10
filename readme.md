# Recording full screen in Windows 10

Record your multi-monitor screen and save it into a video file in Windows 10.

Output file format is a 30fps `mp4` (very high quality).

Output filename is the current date time.

ffmpeg uses the [gdigrab](https://ffmpeg.org/ffmpeg-devices.html#gdigrab), a Win32 GDI-based screen capture device.

This script does not do anything beside calling `ffmpeg` with the right parameters to record video and output it so that you don't have to learn how to use FFmpeg's interface. The full source is 100 lines long and is well written.

# How to use

Install [FFmpeg](https://ffmpeg.org/) and then run `record.js` script with [Nodejs](https://nodejs.org/en/) to start recording. Send `CTRL+C` to the terminal to stop recording.

You may also manually press "q" followed by enter to send "quit" command to ffmpeg to stop recording.

# Ouput size

The output uses the ffmpeg's default encoder for mp4 (very high quality).

A video in a single 4k monitor setup should yield:

- a 60 seconds video is roughly 8 MB
- a 60 minutes video is roughly 500 MB
- a 12 hours video is roughly 5 GB

# How does it work, exactly?

- Run `node record.js` on your terminal to start this program.
- The `ffmpeg` process will be started with specific parameters configured by this program.
- The parameters will instruct the FFmpeg tool to record full screen and save to a local file.
- FFmpeg will tell you that your screen is being recorded and keep printing data about it (frames / duration / etc)
- When you're done recording your screen get the terminal in focus and `CTRL+C` it to stop recording
- `ffmpeg` process will receive SIGINT and will (hopefully) close the file correctly and exit after a few seconds
- If the exit fails, press `CTRL+C` 4 times to forcefully stop it (might corrupt your output file)

# Parameters

None.

# Config

None.

# Dependencies

[Node.js](https://nodejs.org/en/) must be installed in the system.
[FFmpeg](https://ffmpeg.org/) must be installed in the system.

For windows, you can download it here: https://github.com/BtbN/FFmpeg-Builds/releases

For linux, you can download it here: https://ffmpeg.org/download.html

## Security / Trust

This is open-source, as is FFmpeg.

It takes less than 1 minute to read the code and conclude it is safe and does what you think it does.

## How to edit this tool for my needs

FFmpeg is a command-line program that records, converts and creates video streams in multiple formats.

By changing the parameters sent to the process you can configure how it behaves.

Example:
    - You want to record a 1920 x 1080 (FHD) region on your display starting from the origin (0,0 / top left of primary monitor)
    - Search the available [input parameters](https://ffmpeg.org/ffmpeg-devices.html#gdigrab)
    - It seems that the `-offset_x`, `-offset_y`, and `-video_size` parameters are useful.
    - Change `record.js` to add the parameters (line 25)
    - You need to add `-offset_x 0 -offset_y 0 -video_size 1920x1080`
    - In javascript, we have:

```js
let child = cp.spawn("ffmpeg2", [
    "-f", "gdigrab",
    "-i", "desktop",
    "-offset_x", "0",
    "-offset_y", "0",
    "--video_size", "1920x1080",
    "-framerate", fps.toString(),
    getFullFileName(),
]);
```

## NPM Dependencies

None.

## Licence

Do what you think is fair.

## Why

I want to help the world by writing software. More specifically by decreasing the time between these two events in a person's life:

 - found a software to solve my problem
 - am using the software to solve the problem
