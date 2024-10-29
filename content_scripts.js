'use strict'

class ShortAutoPlay {

    constructor() {
        this.adSkip = false;
    }

    async start() {
        const observer = new MutationObserver(this.callback);
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    callback() {
        const isPlayPage = new RegExp(".*://.*\\.youtube\\.com/shorts/.*").test(location.href);
        if (!isPlayPage) return;

        const shortsPlayer = document.getElementById('shorts-player');
        if (!shortsPlayer) return;
        const slider = document.querySelector('#scrubber [role="slider"]');
        if (!slider) return;

        if (Array.from(shortsPlayer.classList).includes('ad-created')) {
            if (!this.adSkip) {
                document.querySelector('#navigation-button-down button').click();
                this.adSkip = true;
                setTimeout(() => {
                    this.adSkip = false;
                }, 3000);
            }
        }

        if (!Array.from(shortsPlayer.classList).includes('paused-mode')) {
            const value = parseInt(slider.getAttribute('aria-valuenow'));
            if (this.needGoToNext && value === 0) {
                document.querySelector('#navigation-button-down button').click();
                this.needGoToNext = false;
            } else if (!this.needGoToNext && value >= 90) {
                this.needGoToNext = true;
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const shortAutoPlay = new ShortAutoPlay();
        shortAutoPlay.start();
    });
} else {
    const shortAutoPlay = new ShortAutoPlay();
    shortAutoPlay.start();
}
