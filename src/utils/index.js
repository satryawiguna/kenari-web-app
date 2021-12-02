
// export function camel (str) {
//   const camel = (str || '').replace(/-([^-])/g, g => g[1].toUpperCase());

//   return capitalize(camel);
// }

// export function camelActual (str) {
//   return (str || '').replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
// }

// export function kebab (str) {
//   return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
// }

// export function capitalize (str) {
//   str = str || '';

//   return `${str.substr(0, 1).toUpperCase()}${str.slice(1)}`;
// }

// export function findProduct (store, id) {
//   return store.state.store.products.find(p => p.id === id);
// }

// export function isOnSale (variants) {
//   return variants.some(variant => {
//     return parseFloat(variant.price) < parseFloat(variant.compareAtPrice);
//   });
// }

// export function randomNumber (min, max) {
//   return Math.floor(Math.random() * max) + min;
// }

// export function randomString (length = 5) {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }

//   return text;
// }
const randomElement = (arr = []) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const kebab = (str) => {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const toggleFullScreen = () => {
  let doc = window.document
  let docEl = doc.documentElement

  let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
  let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl)
  } else {
    cancelFullScreen.call(doc)
  }
}

const isFullScreen = () => {
  let doc = window.document

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    return false
  } else {
    return true
  }
}

const terbilang = (queueNumber) => {
  let result = []
  const numArr = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan']
  const suffix = ['Ratus', 'Puluh', '']
  let arr = queueNumber.split('')
  let numStart = false

  for (let i = 0; i < arr.length; i++) {
    let num = arr[i]

    if (!numStart) {
      numStart = num !== '0'
    }

    if (numStart) {
      result.push(numArr[num] + ' ' + (num !== '0' ? suffix[i] : ''))
    }
  }

  if (result.includes('Satu Puluh')) {
    let idx = result.indexOf('Satu Puluh')

    result[idx] = ''
    if (result[idx + 1] === 'Satu ') result[idx + 1] = 'Sebelas'
    else if (result[idx + 1] === ' ') result[idx] = 'Sepuluh'
    else { result.push('Belas') }
  }

  if (result.includes('Satu Ratus')) {
    let idx = result.indexOf('Satu Ratus')
    result[idx] = 'Seratus'
  }

  return result.join(', ')
}

export default {
  randomElement,
  toggleFullScreen,
  isFullScreen,
  kebab,
  terbilang
}
