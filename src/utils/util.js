let Base64 = require('js-base64').Base64;

export function decode_message(message) {
    return Base64.decode(message)
}

export function format_date(merge_date) {
    // console.log(merge_date)
    return new Date(merge_date * 1000)
}