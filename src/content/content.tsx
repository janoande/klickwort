import WordPopup from './wordPopup/wordPopup';

import { h, render } from 'preact';

/* window.addEventListener('click', WordPopup.hideOnOutsideClick);
 * window.addEventListener('dblclick', WordPopup.handleWordClick); */

render(<WordPopup />, document.body);
