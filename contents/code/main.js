workspace.windowAdded.connect(function(client) {
    if (client.caption.includes("Picture in picture") ||
        client.caption.includes("Picture-in-Picture")) {
        client.keepAbove = true;
        var aspectRatio = client.width / client.height;
        var prevX, prevY;
        var prevWidth = client.width;
        var prevHeight = client.height;

        client.interactiveMoveResizeStarted.connect(function() {
            prevX = client.x;
            prevY = client.y;
            prevWidth = client.width;
            prevHeight = client.height;
        });

        client.interactiveMoveResizeFinished.connect(function() {
            var widthChanged = Math.abs(client.width - prevWidth);
            var heightChanged = Math.abs(client.height - prevHeight);

            if (widthChanged === 0 && heightChanged === 0) {
                return;
            }

            var newWidth, newHeight;

            if (widthChanged >= heightChanged) {
                newWidth = client.width;
                newHeight = Math.round(client.width / aspectRatio);
            } else {
                newHeight = client.height;
                newWidth = Math.round(client.height * aspectRatio);
            }

            var finalX = client.x;
            var finalY = client.y;

            if (client.x !== prevX) {
                finalX = prevX + prevWidth - newWidth;
            }
            if (client.y !== prevY) {
                finalY = prevY + prevHeight - newHeight;
            }

            var screen = workspace.clientArea(workspace.PlacementArea, client);

            // Clamp to right/bottom boundaries
            if (finalX + newWidth > screen.x + screen.width) {
                finalX = screen.x + screen.width - newWidth;
            }
            if (finalY + newHeight > screen.y + screen.height) {
                finalY = screen.y + screen.height - newHeight;
            }

            // Clamp to left/top boundaries
            if (finalX < screen.x) {
                finalX = screen.x;
            }
            if (finalY < screen.y) {
                finalY = screen.y;
            }

            client.frameGeometry = {
                x: finalX,
                y: finalY,
                width: newWidth,
                height: newHeight
            };
        });
    }
});
