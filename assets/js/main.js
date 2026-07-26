/*
    anshnagwekar.github.io — no dependencies.

    The card flips between its front and one of the back faces. Which face is
    showing is driven entirely by the URL hash, so deep links (/#about) and the
    browser back button both work without any extra bookkeeping.
*/

(function () {
    'use strict';

    var flip    = document.querySelector('.flip');
    var inner   = document.querySelector('.flip-inner');
    var front   = document.querySelector('.face.front');
    var backs   = Array.prototype.slice.call(document.querySelectorAll('.face.back'));

    if (!flip || !inner || !front) return;

    /* ---- Flip ---- */

    function faceFromHash() {
        var id = window.location.hash.slice(1);
        if (!id) return null;
        var el = document.getElementById(id);
        return el && el.classList.contains('back') ? el : null;
    }

    // The 3D faces are absolutely positioned, so the card has no height of its
    // own. Give it the height of whichever face is showing, and it animates.
    function resize() {
        var active = flip.classList.contains('is-flipped')
            ? backs.filter(function (b) { return b.classList.contains('is-active'); })[0]
            : front;
        if (active) inner.style.height = active.offsetHeight + 'px';
    }

    // Mask the bottom edge only while there is more text below the fold.
    function updateScrollHint(face) {
        var body = face.querySelector('.face-body');
        if (!body) return;

        var overflows = body.scrollHeight - body.clientHeight > 2;
        face.classList.toggle('is-scrollable', overflows);

        var atEnd = body.scrollTop + body.clientHeight >= body.scrollHeight - 2;
        face.classList.toggle('is-at-end', atEnd);
    }

    function show(face, moveFocus) {
        backs.forEach(function (b) {
            var on = (b === face);
            b.classList.toggle('is-active', on);
            b.inert = !on;
        });

        front.inert = !!face;
        flip.classList.toggle('is-flipped', !!face);

        if (face) {
            var body = face.querySelector('.face-body');
            if (body) body.scrollTop = 0;
            updateScrollHint(face);
        }

        resize();

        // The element that was focused is on the face we just turned away from,
        // and it is now inert — so hand focus to whatever is now facing forward.
        if (moveFocus) (face || front).focus({ preventScroll: true });
    }

    function sync(moveFocus) { show(faceFromHash(), moveFocus); }

    window.addEventListener('hashchange', function () { sync(true); });

    // "Back" returns to the front without leaving a bare "#" in the URL.
    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-back]');
        if (!trigger) return;
        e.preventDefault();

        if (window.history.replaceState) {
            window.history.pushState(null, '', window.location.pathname);
            show(null, true);
        } else {
            window.location.hash = '';
        }
    });

    window.addEventListener('popstate', function () { sync(true); });

    // Escape backs out of a flipped card.
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !flip.classList.contains('is-flipped')) return;
        window.history.pushState(null, '', window.location.pathname);
        show(null, true);
    });

    backs.forEach(function (b) {
        var body = b.querySelector('.face-body');
        if (body) body.addEventListener('scroll', function () { updateScrollHint(b); });
    });

    /* Height depends on rendered text, so recompute whenever that can change. */

    var pending;
    window.addEventListener('resize', function () {
        clearTimeout(pending);
        pending = setTimeout(resize, 120);
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(resize);
    }

    // First run: settle into position with no transition, otherwise the card
    // visibly animates its height up from zero on load.
    flip.classList.add('is-settling');
    sync(false);
    requestAnimationFrame(function () {
        requestAnimationFrame(function () { flip.classList.remove('is-settling'); });
    });

    window.addEventListener('load', resize);

    /* ---- Social icon readout ---- */

    var readout = document.querySelector('.hover-readout');
    if (!readout) return;

    function show_(text) {
        readout.textContent = text;
        readout.classList.add('is-visible');
    }

    function hide() { readout.classList.remove('is-visible'); }

    Array.prototype.forEach.call(document.querySelectorAll('.socials [data-hover]'), function (link) {
        var label = link.getAttribute('data-hover');
        if (!label) return;

        link.addEventListener('mouseenter', function () { show_(label); });
        link.addEventListener('focus',      function () { show_(label); });
        link.addEventListener('mouseleave', hide);
        link.addEventListener('blur',       hide);
    });

}());
