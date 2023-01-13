function encode(input) {
    var output = "";
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;

    var i = 0;

    input = Base64._utf8_encode(input); //inputan user diubah menjadi utf8 string

    while (i < input.length) {
        //AND = 65 78 68 --> merupakan utf8
        chr1 = input.charCodeAt(i++); //65

        chr2 = input.charCodeAt(i++); //78

        chr3 = input.charCodeAt(i++); //68

        enc1 = chr1 >> 2; // 65 == 16  // diproses dan diubah menjadi base64 tabel encode

        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); // 20

        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); // 57

        enc4 = chr3 & 63; //4

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        //paham
        output =
            output +
            keyStr.charAt(enc1) + // mencari alphabet sesuai hasil encoding
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
    } //semua langsung di jadikan 1
    // hasil QU5E

    return output;
}

function decode (input){
    var output = "";
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    var chr1, chr2, chr3;

    var enc1, enc2, enc3, enc4;

    var i = 0;
    //input QU5E
    input = input.replace(/[^A-Za-z0-9\/_\-]/g, ""); //diganti inputan alfabhet

    while (i < input.length) {
        enc1 = keyStr.indexOf(input.charAt(i++)); //mencari index string dengan loop diganti dengan keystring
        // Q dicari pada index ke berapa dalam base 64 == 16
        enc2 = keyStr.indexOf(input.charAt(i++));
        // U dicari pada index ke berapa dalam base 64 == 20
        enc3 = keyStr.indexOf(input.charAt(i++));
        // 5 dicari pada index ke berapa dalam base 64 == 57
        enc4 = keyStr.indexOf(input.charAt(i++));
        // E dicari pada index ke berapa dalam base 64 == 4

        chr1 = (enc1 << 2) | (enc2 >> 4);
        // HASIL 65 //berupa utf16
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        // 78 //berupa utf16
        chr3 = ((enc3 & 3) << 6) | enc4;
        //68 //berupa utf16

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) { //bila tidak sama dengan
            output = output + String.fromCharCode(chr2);
        }

        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }

    output = Base64._utf8_decode(output);

    return output;
}

const Base64 = {
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n"); //https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n

        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode?retiredLocale=id
            // variable c menggunakan utf16
            if (c < 128) { //jika kurang dari jumlah total utf16
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);

                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);

                utftext += String.fromCharCode(((c >> 6) & 63) | 128);

                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    },

    // private method for UTF-8 decoding

    _utf8_decode: function (utftext) {
        var string = "";

        var i = 0;

        let c1;
        let c2;
        var c = (c1 = c2 = 0);

        while (i < utftext.length) {
            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);

                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);

                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));

                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);

                c3 = utftext.charCodeAt(i + 2);

                string += String.fromCharCode(
                    ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                );

                i += 3;
            }
        }

        return string;
    },
};

module.exports = {Base64, encode, decode}