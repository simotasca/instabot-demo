"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPATH_ACCOUNT_PAGE_BTN_CONFERMA_UNFOLLOW = exports.XPATH_ACCOUNT_PAGE_BTN_UNFOLLOW = exports.XPATH_FOLLOWER_ACCOUNT_CONTAINER = exports.XPATH_BTN_LOADING = exports.XPATH_ALL_SEGUI_BTN = exports.XPATH_RICHIESTA_EFFETTUATA_BTN = exports.XPATH_SEGUI_GIA_BTN = exports.XPATH_SEGUI_BTN = exports.XPATH_FOLLOWERS_DIALOG_LOADER = exports.XPATH_FOLLOWERS_DIALOG_TITLE = exports.XPATH_FOLLOWERS_BTN = exports.XPATH_NEXT_POST_BTN_EN = exports.XPATH_NEXT_POST_BTN = exports.LIKE_COLOR = exports.XPATH_POST_UNLIKE_BTN_EN = exports.XPATH_POST_UNLIKE_BTN = exports.XPATH_POST_LIKE_BTN_EN = exports.XPATH_POST_LIKE_BTN = exports.XPATH_LIKED_SVG = exports.XPATH_POST_DATE = exports.XPATH_POST_PROFILE_PICTURE_EN = exports.XPATH_POST_PROFILE_PICTURE = exports.XPATH_FIRST_POST = exports.TITLE_PAGE_NOT_FOUND_EN = exports.TITLE_PAGE_NOT_FOUND = void 0;
exports.TITLE_PAGE_NOT_FOUND = "Pagina non trovata";
exports.TITLE_PAGE_NOT_FOUND_EN = "Page not found";
exports.XPATH_FIRST_POST = "//article//a[starts-with(@href, '/p/')]";
// contiene il nome utente nell'alt
exports.XPATH_POST_PROFILE_PICTURE = "//div[@role='dialog']//img[contains(@alt, 'Immagine del profilo di')]";
exports.XPATH_POST_PROFILE_PICTURE_EN = "//div[@role='dialog']//img[contains(@alt, 's profile picture')]";
exports.XPATH_POST_DATE = "//div[@role='dialog']//*[not(self::a[@role='link'])]//time[@datetime]";
// export const XPATH_LIKED_SVG = "//div[@role='dialog']//*[@color='#ed4956']";
exports.XPATH_LIKED_SVG = "//div[@role='dialog']//*[@color='rgb(255, 48, 64)']";
exports.XPATH_POST_LIKE_BTN = "//div[@role='dialog']//*[@aria-label='Mi piace']/ancestor::button";
exports.XPATH_POST_LIKE_BTN_EN = "//div[@role='dialog']//*[@aria-label='Like']/ancestor::button";
exports.XPATH_POST_UNLIKE_BTN = "//div[@role='dialog']//*[@aria-label='Non mi piace più']/ancestor::button";
exports.XPATH_POST_UNLIKE_BTN_EN = "//div[@role='dialog']//*[@aria-label='Unlike']/ancestor::button";
exports.LIKE_COLOR = "#ed4956";
exports.XPATH_NEXT_POST_BTN = "//*[@aria-label='Avanti']/ancestor::button";
exports.XPATH_NEXT_POST_BTN_EN = "//*[@aria-label='Next']/ancestor::button";
// ================================================================================================
const XPATH_FOLLOWERS_BTN = (account) => `//a[@href='/${account}/followers/']`;
exports.XPATH_FOLLOWERS_BTN = XPATH_FOLLOWERS_BTN;
// usato per validare l'apertura della dialog dopo il click
exports.XPATH_FOLLOWERS_DIALOG_TITLE = "//div[@role='dialog']//*[text()='Follower']";
exports.XPATH_FOLLOWERS_DIALOG_LOADER = "//div[@role='dialog']//*[@data-visualcompletion='loading-state']";
exports.XPATH_SEGUI_BTN = "//div[@role='dialog']//button//*[text()='Segui']/ancestor::button";
exports.XPATH_SEGUI_GIA_BTN = "//div[@role='dialog']//button//*[text()='Segui già']/ancestor::button";
exports.XPATH_RICHIESTA_EFFETTUATA_BTN = "//div[@role='dialog']//button//*[text()='Richiesta effettuata']/ancestor::button";
exports.XPATH_ALL_SEGUI_BTN = [
    exports.XPATH_SEGUI_BTN,
    exports.XPATH_SEGUI_GIA_BTN,
    exports.XPATH_RICHIESTA_EFFETTUATA_BTN,
].join(" | ");
// da ricercare come figlio di uno dei tre bottoni sopra
exports.XPATH_BTN_LOADING = "//*[@data-visualcompletion='loading-state']";
// function getElementByXpath(path) {
//   let result = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
//   let node = null;
//   let tagNames = [];
//   while ((node = result.iterateNext())) {
//     tagNames.push(node);
//   }
//   return tagNames;
// }
// ricerco il parente comune tra il tasto follow e il link con l'username (anche la foto profilo è un link e la escludo)
// in seguito dico che questo elemento non deve avere come sottoelementi altri elementi con le stesse caratteristiche
// questo serve a eliminare tutti i div che contengono i div ricercati
// versione completa:
// const XPATH_FOLLOWER_CONTAINER = "//div[@role='dialog']//*[.//button//*[text()='Segui']][.//a[not(descendant::img)]][not(.//*[.//button//*[text()='Segui']][.//a[not(descendant::img)]])]";
const followerDivPredicates = "[.//button//*[text()='Segui']][.//a[not(descendant::img)]]";
exports.XPATH_FOLLOWER_ACCOUNT_CONTAINER = `//div[@role='dialog']//*${followerDivPredicates}[not(.//*${followerDivPredicates})]`;
// ================================================================================================
exports.XPATH_ACCOUNT_PAGE_BTN_UNFOLLOW = "//button//*[@aria-label='Segui già']/ancestor::button";
exports.XPATH_ACCOUNT_PAGE_BTN_CONFERMA_UNFOLLOW = "//div[@role='dialog']//button[contains(text(),'Non seguire più')]";
