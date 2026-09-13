(function() {
    var cursor = document.createElement('div');
    cursor.id = 'tv-virtual-cursor';

    // Styling
    Object.assign(cursor.style, {
        position: 'fixed',
        width: '40px',
        height: '40px',
        backgroundImage: 'radial-gradient(circle, rgba(0,229,255,1) 0%, rgba(0,229,255,0) 70%)',
        border: '2px solid #FFFFFF',
        borderRadius: '50%',
        boxShadow: '0 0 15px #00E5FF, 0 0 30px #00E5FF',
        pointerEvents: 'none',
        zIndex: '1000000',
        display: 'none',
        transform: 'translate(-50%, -50%)'
    });

    document.body.appendChild(cursor);

    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var speed = 35;
    var isVisible = false;

    function showCursor() {
        if (!isVisible) {
            cursor.style.display = 'block';
            isVisible = true;
            updateCursorPosition();
        }
    }

    function updateCursorPosition() {
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';

        var canvas = document.querySelector('canvas');
        if(!canvas) return;

        // Phaser ko move event bhejna
        var moveEvt = new MouseEvent('mousemove', {
            bubbles: true, cancelable: true, view: window,
            clientX: cx, clientY: cy
        });
        canvas.dispatchEvent(moveEvt);
    }

    // --- YEAH HAI MAIN FIX ---
    function simulateClick() {
        var canvas = document.querySelector('canvas');
        if(!canvas) return;

        console.log("Simulating Super Click at: " + cx + ", " + cy);

        var opts = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: cx,
            clientY: cy,
            screenX: cx,
            screenY: cy,
            button: 0,
            buttons: 1
        };

        // 1. Mouse Down
        canvas.dispatchEvent(new MouseEvent('mousedown', opts));

        // 2. Touch Start (Kuch TV browsers touch mangte hain)
        var touch = new Touch({ identifier: Date.now(), target: canvas, clientX: cx, clientY: cy });
        canvas.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch] }));

        // Thora sa gap de kar release karna zaroori hai (100ms)
        setTimeout(function() {
            // 3. Mouse Up
            canvas.dispatchEvent(new MouseEvent('mouseup', opts));
            // 4. Click
            canvas.dispatchEvent(new MouseEvent('click', opts));
            // 5. Touch End
            canvas.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [touch] }));

            console.log("Click Released!");
        }, 100);
    }

    window.addEventListener('keydown', function(e) {
        var handled = false;

        // Navigation keys check
        if ([37, 38, 39, 40, 13, 23, 66, 32].indexOf(e.keyCode) > -1) {
            showCursor();
            handled = true;
        }

        if (e.keyCode === 37) cx -= speed;
        if (e.keyCode === 38) cy -= speed;
        if (e.keyCode === 39) cx += speed;
        if (e.keyCode === 40) cy += speed;

        cx = Math.max(0, Math.min(window.innerWidth, cx));
        cy = Math.max(0, Math.min(window.innerHeight, cy));

        if (handled) {
            updateCursorPosition();
            // Enter / Center OK check
            if ([13, 23, 66, 32].indexOf(e.keyCode) > -1) {
                simulateClick();
            }
            e.preventDefault();
        }
    });

    window.addEventListener('touchstart', function() {
        cursor.style.display = 'none';
        isVisible = false;
    });
})();
