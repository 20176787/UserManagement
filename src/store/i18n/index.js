import viVN from './vi-VN';
import enUS from './en-US';

// export default function I18N({LANG, key}) {
//   switch (LANG) {
//     case 'vi-VN':
//       return viVN[key];
//     case 'en-US':
//       return enUS[key];
//   }
// }
class I18N {
  get(key, LANG) {
    switch (LANG) {
      case 'vi-VN':
        return viVN[key];
      case 'en-US':
        return enUS[key];
    }
  }
}

export default new I18N();
