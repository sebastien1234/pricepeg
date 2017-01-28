"use strict";
var CurrencyConversion = (function () {
    function CurrencyConversion(fromCurrencySymbol, fromCurrencyLabel, fromCurrencyAmount, toCurrencySymbol, toCurrencyLabel, toCurrencyAmount) {
        this.fromCurrencySymbol = fromCurrencySymbol;
        this.fromCurrencyLabel = fromCurrencyLabel;
        this.fromCurrencyAmount = fromCurrencyAmount;
        this.toCurrencySymbol = toCurrencySymbol;
        this.toCurrencyLabel = toCurrencyLabel;
        this.fromCurrencySymbol = fromCurrencySymbol;
        this.fromCurrencyLabel = fromCurrencyLabel;
        this.fromCurrencyAmount = parseFloat(fromCurrencyAmount.toString()); // force to number type
        this.toCurrencySymbol = toCurrencySymbol;
        this.toCurrencyLabel = toCurrencyLabel;
        this.toCurrencyAmount = parseFloat(toCurrencyAmount.toString()); //force to number type
    }
    return CurrencyConversion;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CurrencyConversion;
exports.CurrencyConversionType = {
    FIAT: {
        USD: { symbol: "USD", label: "US Dollar", isFiat: true },
        GBP: { symbol: "GBP", label: "British Pound", isFiat: true },
        CNY: { symbol: "CNY", label: "Chinese Yuan", isFiat: true },
        EUR: { symbol: "EUR", label: "Euro", isFiat: true },
        CAD: { symbol: "CAD", label: "Canada", isFiat: true },
        AUD: { symbol: "AUD", label: "Australian Dollar", isFiat: true },
        BGN: { symbol: "BGN", label: "Bulgarian Lev", isFiat: true },
        BRL: { symbol: "BRL", label: "Brazilian Real", isFiat: true },
        CHF: { symbol: "CHF", label: "Swiss Franc", isFiat: true },
        CZK: { symbol: "CZK", label: "Czech Republic Koruna", isFiat: true },
        DKK: { symbol: "DKK", label: "Danish Krone", isFiat: true },
        HKD: { symbol: "HKD", label: "Hong Kong Dollar", isFiat: true },
        HRK: { symbol: "HRK", label: "Croatian Kuna", isFiat: true },
        HUF: { symbol: "HUF", label: "Hungarian Forint", isFiat: true },
        IDR: { symbol: "IDR", label: "Indonesian Rupiah", isFiat: true },
        ILS: { symbol: "ILS", label: "Israeli New Shekel", isFiat: true },
        INR: { symbol: "INR", label: "Indian Rupee", isFiat: true },
        JPY: { symbol: "JPY", label: "Japanese Yen", isFiat: true },
        KRW: { symbol: "KRW", label: "South Korean Won", isFiat: true },
        MXN: { symbol: "MXN", label: "Mexican Peso", isFiat: true },
        MYR: { symbol: "MYR", label: "Malaysian Ringgit", isFiat: true },
        NOK: { symbol: "NOK", label: "Norwegian Krone", isFiat: true },
        NZD: { symbol: "NZD", label: "New Zealand Dollar", isFiat: true },
        PHP: { symbol: "PHP", label: "Philippine Peso", isFiat: true },
        PLN: { symbol: "PLN", label: "Polish Zloty", isFiat: true },
        RON: { symbol: "RON", label: "Romanian Leu", isFiat: true },
        RUB: { symbol: "RUB", label: "Russian Ruble", isFiat: true },
        SEK: { symbol: "SEK", label: "Swedish Krona", isFiat: true },
        SGD: { symbol: "SGD", label: "Singapore Dollar", isFiat: true },
        THB: { symbol: "THB", label: "Thai Baht", isFiat: true },
        TRY: { symbol: "TRY", label: "Turkish Lira", isFiat: true },
        ZAR: { symbol: "ZAR", label: "South African Rand", isFiat: true }
    },
    CRYPTO: {
        AMP: { symbol: "AMP", label: "SYNEREO AMP", isFiat: false },
        ARDR: { symbol: "ARDR", label: "ARDOR", isFiat: false },
        BBR: { symbol: "BBR", label: "BOOLBERRY", isFiat: false },
        BTC: { symbol: "BTC", label: "BITCOIN", isFiat: false },
        BCN: { symbol: "BCN", label: "BYTECOIN", isFiat: false },
        BCY: { symbol: "BCY", label: "BITCRYSTALS", isFiat: false },
        BELA: { symbol: "BELA", label: "BELLACOIN", isFiat: false },
        BITS: { symbol: "BITS", label: "BITSTAR", isFiat: false },
        BLK: { symbol: "BLK", label: "BLACKCOIN", isFiat: false },
        BTCD: { symbol: "BTCD", label: "BITCOINDARK", isFiat: false },
        BTM: { symbol: "BTM", label: "BITMARK", isFiat: false },
        BTS: { symbol: "BTS", label: "BITSHARES", isFiat: false },
        BURST: { symbol: "BURST", label: "BURST", isFiat: false },
        C2: { symbol: "C2", label: "COIN2.0", isFiat: false },
        CLAM: { symbol: "CLAM", label: "CLAMS", isFiat: false },
        CURE: { symbol: "CURE", label: "CURECOIN", isFiat: false },
        DASH: { symbol: "DASH", label: "DASH", isFiat: false },
        DCR: { symbol: "DCR", label: "DECRED", isFiat: false },
        DGB: { symbol: "DGB", label: "DIGIBYTE", isFiat: false },
        DOGE: { symbol: "DOGE", label: "DOGECOIN", isFiat: false },
        EMC2: { symbol: "EMC2", label: "EINSTEINIUM", isFiat: false },
        ETC: { symbol: "ETC", label: "ETHEREUM CLASSIC", isFiat: false },
        ETH: { symbol: "ETH", label: "ETHEREUM", isFiat: false },
        EXP: { symbol: "EXP", label: "EXPANSE", isFiat: false },
        FCT: { symbol: "FCT", label: "FACTOM", isFiat: false },
        FLDC: { symbol: "FLDC", label: "FOLDINGCOIN", isFiat: false },
        FLO: { symbol: "FLO", label: "FLORINCOIN", isFiat: false },
        GAME: { symbol: "GAME", label: "GAMECREDITS", isFiat: false },
        GRC: { symbol: "GRC", label: "GRIDCOIN RESEARCH", isFiat: false },
        HUC: { symbol: "HUC", label: "HUNTERCOIN", isFiat: false },
        HZ: { symbol: "HZ", label: "HORIZON", isFiat: false },
        IOC: { symbol: "IOC", label: "IO DIGITAL", isFiat: false },
        LBC: { symbol: "LBC", label: "LBRY CREDITS", isFiat: false },
        LSK: { symbol: "LSK", label: "LISK", isFiat: false },
        LTC: { symbol: "LTC", label: "LITECOIN", isFiat: false },
        MAID: { symbol: "MAID", label: "MAIDSAFECOIN", isFiat: false },
        MYR: { symbol: "MYR", label: "MYRIADCOIN", isFiat: false },
        NAUT: { symbol: "NAUT", label: "NAUTILUSCOIN", isFiat: false },
        NAV: { symbol: "NAV", label: "NAVCOIN", isFiat: false },
        NEOS: { symbol: "NEOS", label: "NEOSCOIN", isFiat: false },
        NMC: { symbol: "NMC", label: "NAMECOIN", isFiat: false },
        NOBL: { symbol: "NOBL", label: "NOBLECOIN", isFiat: false },
        NOTE: { symbol: "NOTE", label: "DNOTES", isFiat: false },
        NSR: { symbol: "NSR", label: "NUSHARES", isFiat: false },
        NXC: { symbol: "NXC", label: "NEXIUM", isFiat: false },
        NXT: { symbol: "NXT", label: "NXT", isFiat: false },
        OMNI: { symbol: "OMNI", label: "OMNI", isFiat: false },
        PINK: { symbol: "PINK", label: "PINKCOIN", isFiat: false },
        POT: { symbol: "POT", label: "POTCOIN", isFiat: false },
        PPC: { symbol: "PPC", label: "PEERCOIN", isFiat: false },
        QBK: { symbol: "QBK", label: "QIBUCK", isFiat: false },
        QORA: { symbol: "QORA", label: "QORA", isFiat: false },
        QTL: { symbol: "QTL", label: "QUATLOO", isFiat: false },
        RADS: { symbol: "RADS", label: "RADIUM", isFiat: false },
        RBY: { symbol: "RBY", label: "RUBYCOIN", isFiat: false },
        REP: { symbol: "REP", label: "AUGUR", isFiat: false },
        RIC: { symbol: "RIC", label: "RIECOIN", isFiat: false },
        SBD: { symbol: "SBD", label: "STEEM DOLLARS", isFiat: false },
        SC: { symbol: "SC", label: "SIACOIN", isFiat: false },
        SDC: { symbol: "SDC", label: "SHADOW", isFiat: false },
        SJCX: { symbol: "SJCX", label: "STORJCOIN X", isFiat: false },
        STEEM: { symbol: "STEEM", label: "STEEM", isFiat: false },
        STR: { symbol: "STR", label: "STELLAR", isFiat: false },
        STRAT: { symbol: "STRAT", label: "STRATIS", isFiat: false },
        SYS: { symbol: "SYS", label: "SYSCOIN", isFiat: false },
        UNITY: { symbol: "UNITY", label: "SUPERNET", isFiat: false },
        VIA: { symbol: "VIA", label: "VIACOIN", isFiat: false },
        VOX: { symbol: "VOX", label: "VOXELS", isFiat: false },
        VRC: { symbol: "VRC", label: "VERICOIN", isFiat: false },
        VTC: { symbol: "VTC", label: "VERTCOIN", isFiat: false },
        WAVES: { symbol: "WAVES", label: "WAVES", isFiat: false },
        XBC: { symbol: "XBC", label: "BITCOINPLUS", isFiat: false },
        XCP: { symbol: "XCP", label: "COUNTERPARTY", isFiat: false },
        XEM: { symbol: "XEM", label: "NEM", isFiat: false },
        XMG: { symbol: "XMG", label: "MAGI", isFiat: false },
        XMR: { symbol: "XMR", label: "MONERO", isFiat: false },
        XPM: { symbol: "XPM", label: "PRIMECOIN", isFiat: false },
        XRP: { symbol: "XRP", label: "RIPPLE", isFiat: false },
        XVC: { symbol: "XVC", label: "VCASH", isFiat: false },
        ZEC: { symbol: "ZEC", label: "ZCASH", isFiat: false }
    }
};
//# sourceMappingURL=CurrencyConversion.js.map