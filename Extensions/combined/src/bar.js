import { getButtons, getDislikeButton, getLikeButton } from "./buttons";
import {
  extConfig,
  isMobile,
  isLikesDisabled,
  isNewDesign,
  isRoundedDesign,
  isShorts,
} from "./state";
import { cLog, getColorFromTheme, isInViewport } from "./utils";

function createRateBar(likes, dislikes) {
  requestAnimationFrame(function () {
    let rateBar = document.getElementById("ryd-bar-container");
    if (!isLikesDisabled()) {
      // sometimes rate bar is hidden
      if(rateBar && !isInViewport(rateBar)){
        rateBar.remove();
        rateBar = null;
      }

      const widthPx =
        getLikeButton().clientWidth +
        getDislikeButton().clientWidth +
        (isRoundedDesign() ? 0 : 8);

        const widthPercent =
          likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

        var likePercentage = parseFloat(widthPercent.toFixed(1));
        const dislikePercentage = (100 - likePercentage).toLocaleString();
        likePercentage = likePercentage.toLocaleString();

        const button = getLikeButton();
        const buttonRect = button.getBoundingClientRect();
        const buttonParentRect = button.parentElement.getBoundingClientRect();
        let relativePos = {};
        relativePos.left = buttonRect.left - buttonParentRect.left;
        const leftPx = relativePos.left ?? 0;

        if (extConfig.showTooltipPercentage) {
          var tooltipInnerHTML;
          switch (extConfig.tooltipPercentageMode) {
            case "dash_dislike":
              tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
              break;
            case "both":
              tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
              break;
            case "only_like":
              tooltipInnerHTML = `${likePercentage}%`;
              break;
            case "only_dislike":
              tooltipInnerHTML = `${dislikePercentage}%`;
              break;
            default: // dash_like
              tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
          }
        } else {
          tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
        }

      if (!isShorts()) {
        if (!rateBar && !isMobile()) {
          let colorLikeStyle = "";
          let colorDislikeStyle = "";
          if (extConfig.coloredBar) {
            colorLikeStyle = "; background-color: " + getColorFromTheme(true);
            colorDislikeStyle = "; background-color: " + getColorFromTheme(false);
          }
          let actions = isNewDesign() && getButtons().id === "top-level-buttons-computed" 
            ? getButtons() : document.getElementById("menu-container");
          (
            actions || document.querySelector("ytm-slim-video-action-bar-renderer")
          ).insertAdjacentHTML(
            "beforeend",
            `
                <div class="ryd-tooltip ryd-tooltip-${isNewDesign() ? "new" : "old"}-design" style="width: ${widthPx}px">
                <div class="ryd-tooltip-bar-container">
                  <div
                      id="ryd-bar-container"
                      style="width: 100%; height: 2px;${colorDislikeStyle}"
                      >
                      <div
                        id="ryd-bar"
                        style="width: ${widthPercent}%; height: 100%${colorLikeStyle}"
                        ></div>
                  </div>
                </div>
                <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
                  <!--css-build:shady-->${tooltipInnerHTML}
                </tp-yt-paper-tooltip>
                </div>
            `
          );

          if (isNewDesign()) {
            // Add border between info and comments
            let descriptionAndActionsElement = document.getElementById("top-row");
            descriptionAndActionsElement.style.borderBottom =
              "1px solid var(--yt-spec-10-percent-layer)";
            descriptionAndActionsElement.style.paddingBottom = "10px";

            // Fix like/dislike ratio bar offset in new UI
            document.getElementById("actions-inner").style.width = "revert";
            if (isRoundedDesign()) {
              document.getElementById("actions").style.flexDirection =
                "row-reverse";
            }
          }
        }
      } else {
        cLog("removing bar");
        let ratebar = document.getElementById("ryd-bar-container");
        if (ratebar) {
          ratebar.parentNode.removeChild(ratebar);
        }
      }
    } else {
      cLog("removing bar");
      if (rateBar) {
        rateBar.parentNode.removeChild(rateBar);
      }
    }
  });
}

export { createRateBar };
