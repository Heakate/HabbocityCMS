function changeMetadataFunction(metadataString) {
    metadataLabel = "";
    metadataLabel.innerHTML = metadataString;
}

function initRadio() {
    adswizzSDK.init({
        contentPlayer : document.getElementById('player'),
        companionBanner : {
                container   : document.getElementById('companionBannerDiv'),
                size        : [300,250],
                baseURL     : "https://eupublishers.deliveryengine.adswizz.com/www/delivery/afr.php",
                zoneId      : "1235",
                fallbackZoneId  : "0",
                alwaysDisplayAds : true
        }
    });

    adswizzSDK.addMetadataChangedListener(changeMetadataFunction);
}