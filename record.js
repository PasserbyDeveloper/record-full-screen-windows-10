const cp = require("child_process"); // Used to launch ffmpeg

/**
 * @returns {"2020-02-14 18:44:00" | string} "yyyy-mm-dd hh:ii:ss" (always 19 characters)
 */
function getDateTimeString() {
    const now = new Date();
    const timezone_hours = now.getTimezoneOffset() / 60;

    now.setTime(now.getTime() - 3600 * timezone_hours * 1000);

    return now
        .toISOString()
        .substring(0, 19)
        .replace("T", " ");
}

function getFullFileName() {
    const fileName = getDateTimeString().replace(" ", "_").replace(/\:/g, "-");
    return `./${fileName}.mp4`;
}

const fps = 30;

let child = cp.spawn("ffmpeg", [
    "-f", "gdigrab",
    "-i", "desktop",
    "-framerate", fps.toString(),
    getFullFileName(),
]);

child.on("error", function(err) {
    if (err.code === "ENOENT") {
        console.log("It seems 'ffmpeg' (executable) was not found (got ENOENT)");
        console.log("You either forgot to install it or forgot to make it visible to this script");
        console.log("After installing ffmpeg.exe, you need to add its folder path (the directory where the 'ffmpeg.exe' file is) to the \"windows PATH system variable\"");
        process.exit(1);
        return;
    }
    console.log(err);
    process.exit(1);
});

child.stdout.on("data", function(data) {
    process.stdout.write(data.toString("utf8"));
});

child.stderr.on("data", function(data) {
    process.stdout.write(data.toString("utf8"));
});

process.stdin.on("data", function(data) {
    if (child && child.stdin && child.stdin.write) {
        child.stdin.write(data);
    }
});

child.on("close", (code) => {
    console.log("Process closed with", code);
    process.exit(code);
});

let sig_int_count = 0;
process.on('SIGINT', function() {
    sig_int_count++;

    if (sig_int_count === 1) {
        console.log("You sent a interrupt signal and the FFMPEG process should handle it promptly and eventually close.");
        console.log("You must allow about 3 seconds so that the output file is correctly finished.");
        return;
    }
    if (sig_int_count === 2) {
        console.log("Sending close request directly to ffmpeg");
        console.log("Closing in about 3 seconds (probably)");

        if (child && child.stdin && child.stdin.write) {
            child.stdin.write("q\n");
            return;
        }

        console.log("Could not find the child stdin write function");
        return;
    }
    if (sig_int_count === 3) {
        console.log("ffmpeg is closing (probably)");
        console.log("Do you want to force it?");
        console.log("Request again to confirm.");
        return;
    }

    if (sig_int_count >= 4) {
        console.log("Force Exit");
        return process.exit(1);
    }
});
