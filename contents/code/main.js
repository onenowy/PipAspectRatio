workspace.windowAdded.connect(function(client) {
    if (client.caption.includes("Picture in picture") ||
        client.caption.includes("Picture-in-Picture")) {
        client.keepAbove = true;
        var aspectRatio = client.width / client.height;
        var prevWidth = client.width;
        var prevHeight = client.height;

        client.interactiveMoveResizeFinished.connect(function() {
            var widthChanged = Math.abs(client.width - prevWidth);
            var heightChanged = Math.abs(client.height - prevHeight);
            var newWidth, newHeight;

            if (widthChanged >= heightChanged) {
                newWidth = client.width;
                newHeight = Math.round(client.width / aspectRatio);
            } else {
                newHeight = client.height;
                newWidth = Math.round(client.height * aspectRatio);
            }

            client.frameGeometry = {
                x: client.x,
                y: client.y,
                width: newWidth,
                height: newHeight
            };

            prevWidth = newWidth;
            prevHeight = newHeight;
        });
    }
});
