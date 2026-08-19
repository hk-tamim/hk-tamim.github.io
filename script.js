"use strict";

/* =========================================================
   CONFIGURATION
========================================================= */

const profileURL = window.location.href;


/* =========================================================
   ELEMENTS
========================================================= */

const socialLinks = document.querySelectorAll(".social-link");

const shareButton = document.getElementById("shareButton");

const copyButton = document.getElementById("copyButton");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

const currentYear = document.getElementById("currentYear");


/* =========================================================
   CURRENT YEAR
========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   TOAST SYSTEM
========================================================= */

let toastTimer;

function showToast(message, icon = "fa-circle-check") {

    if (!toast || !toastMessage) {
        return;
    }

    const toastIcon = toast.querySelector("i");

    if (toastIcon) {
        toastIcon.className = `fa-solid ${icon}`;
    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   SOCIAL LINK CLICK HANDLER
========================================================= */

socialLinks.forEach((link) => {

    link.addEventListener("click", function () {

        const platform = this.dataset.platform || "Link";

        /*
         * Small interaction effect.
         */
        this.classList.add("clicked");

        setTimeout(() => {
            this.classList.remove("clicked");
        }, 300);


        /*
         * Optional analytics hook.
         *
         * You can connect this later to Google Analytics,
         * Firebase Analytics, or another analytics service.
         */
        console.log(`Social link clicked: ${platform}`);

    });

});


/* =========================================================
   COPY PROFILE LINK
========================================================= */

async function copyProfileLink() {

    try {

        await navigator.clipboard.writeText(profileURL);

        showToast(
            "Profile link copied!",
            "fa-link"
        );

    } catch (error) {

        /*
         * Fallback for browsers where Clipboard API
         * is unavailable.
         */

        const temporaryInput = document.createElement("input");

        temporaryInput.value = profileURL;

        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();
        temporaryInput.setSelectionRange(
            0,
            temporaryInput.value.length
        );

        try {

            document.execCommand("copy");

            showToast(
                "Profile link copied!",
                "fa-link"
            );

        } catch (fallbackError) {

            showToast(
                "Unable to copy the link.",
                "fa-circle-exclamation"
            );

        }

        temporaryInput.remove();
    }
}


/* =========================================================
   SHARE PROFILE
========================================================= */

async function shareProfile() {

    const shareData = {
        title: "My Profile",
        text: "Check out my social links and profiles!",
        url: profileURL
    };


    /*
     * Use native sharing when supported.
     */

    if (
        navigator.share &&
        typeof navigator.share === "function"
    ) {

        try {

            await navigator.share(shareData);

            showToast(
                "Profile shared!",
                "fa-share-nodes"
            );

        } catch (error) {

            /*
             * User closing the native share menu
             * is not an actual error for our UI.
             */

            if (error.name !== "AbortError") {

                showToast(
                    "Sharing was cancelled.",
                    "fa-circle-exclamation"
                );

            }

        }

        return;
    }


    /*
     * If native sharing is not supported,
     * copy the profile URL instead.
     */

    try {

        await navigator.clipboard.writeText(profileURL);

        showToast(
            "Sharing unavailable — link copied!",
            "fa-link"
        );

    } catch (error) {

        copyProfileLink();

    }
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (copyButton) {

    copyButton.addEventListener(
        "click",
        copyProfileLink
    );

}


if (shareButton) {

    shareButton.addEventListener(
        "click",
        shareProfile
    );

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener("keydown", (event) => {

    /*
     * Escape closes the toast.
     */

    if (event.key === "Escape") {

        if (toast) {
            toast.classList.remove("show");
        }

    }

});


/* =========================================================
   PAGE LOAD EFFECT
========================================================= */

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});