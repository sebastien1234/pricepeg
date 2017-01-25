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
        USD: { symbol: "USD", label: "US Dollar" },
        GBP: { symbol: "GBP", label: "British Pound" },
        CNY: { symbol: "CNY", label: "Chinese Yuan" },
        EUR: { symbol: "EUR", label: "Euro" },
        CAD: { symbol: "CAD", label: "Canada" },
        AUD: { symbol: "AUD", label: "Australian Dollar" },
        BGN: { symbol: "BGN", label: "Bulgarian Lev" },
        BRL: { symbol: "BRL", label: "Brazilian Real" },
        CHF: { symbol: "CHF", label: "Swiss Franc" },
        CZK: { symbol: "CZK", label: "Czech Republic Koruna" },
        DKK: { symbol: "DKK", label: "Danish Krone" },
        HKD: { symbol: "HKD", label: "Hong Kong Dollar" },
        HRK: { symbol: "HRK", label: "Croatian Kuna" },
        HUF: { symbol: "HUF", label: "Hungarian Forint" },
        IDR: { symbol: "IDR", label: "Indonesian Rupiah" },
        ILS: { symbol: "ILS", label: "Israeli New Shekel" },
        INR: { symbol: "INR", label: "Indian Rupee" },
        JPY: { symbol: "JPY", label: "Japanese Yen" },
        KRW: { symbol: "KRW", label: "South Korean Won" },
        MXN: { symbol: "MXN", label: "Mexican Peso" },
        MYR: { symbol: "MYR", label: "Malaysian Ringgit" },
        NOK: { symbol: "NOK", label: "Norwegian Krone" },
        NZD: { symbol: "NZD", label: "New Zealand Dollar" },
        PHP: { symbol: "PHP", label: "Philippine Peso" },
        PLN: { symbol: "PLN", label: "Polish Zloty" },
        RON: { symbol: "RON", label: "Romanian Leu" },
        RUB: { symbol: "RUB", label: "Russian Ruble" },
        SEK: { symbol: "SEK", label: "Swedish Krona" },
        SGD: { symbol: "SGD", label: "Singapore Dollar" },
        THB: { symbol: "THB", label: "Thai Baht" },
        TRY: { symbol: "TRY", label: "Turkish Lira" },
        ZAR: { symbol: "ZAR", label: "South African Rand" }
    },
    CRYPTO: {
        AMP: { symbol: "AMP", label: "SYNEREO AMP" },
        ARDR: { symbol: "ARDR", label: "ARDOR" },
        BBR: { symbol: "BBR", label: "BOOLBERRY" },
        BTC: { symbol: "BTC", label: "BITCOIN" },
        BCN: { symbol: "BCN", label: "BYTECOIN" },
        BCY: { symbol: "BCY", label: "BITCRYSTALS" },
        BELA: { symbol: "BELA", label: "BELLACOIN" },
        BITS: { symbol: "BITS", label: "BITSTAR" },
        BLK: { symbol: "BLK", label: "BLACKCOIN" },
        BTCD: { symbol: "BTCD", label: "BITCOINDARK" },
        BTM: { symbol: "BTM", label: "BITMARK" },
        BTS: { symbol: "BTS", label: "BITSHARES" },
        BURST: { symbol: "BURST", label: "BURST" },
        C2: { symbol: "C2", label: "COIN2.0" },
        CLAM: { symbol: "CLAM", label: "CLAMS" },
        CURE: { symbol: "CURE", label: "CURECOIN" },
        DASH: { symbol: "DASH", label: "DASH" },
        DCR: { symbol: "DCR", label: "DECRED" },
        DGB: { symbol: "DGB", label: "DIGIBYTE" },
        DOGE: { symbol: "DOGE", label: "DOGECOIN" },
        EMC2: { symbol: "EMC2", label: "EINSTEINIUM" },
        ETC: { symbol: "ETC", label: "ETHEREUM CLASSIC" },
        ETH: { symbol: "ETH", label: "ETHEREUM" },
        EXP: { symbol: "EXP", label: "EXPANSE" },
        FCT: { symbol: "FCT", label: "FACTOM" },
        FLDC: { symbol: "FLDC", label: "FOLDINGCOIN" },
        FLO: { symbol: "FLO", label: "FLORINCOIN" },
        GAME: { symbol: "GAME", label: "GAMECREDITS" },
        GRC: { symbol: "GRC", label: "GRIDCOIN RESEARCH" },
        HUC: { symbol: "HUC", label: "HUNTERCOIN" },
        HZ: { symbol: "HZ", label: "HORIZON" },
        IOC: { symbol: "IOC", label: "IO DIGITAL" },
        LBC: { symbol: "LBC", label: "LBRY CREDITS" },
        LSK: { symbol: "LSK", label: "LISK" },
        LTC: { symbol: "LTC", label: "LITECOIN" },
        MAID: { symbol: "MAID", label: "MAIDSAFECOIN" },
        MYR: { symbol: "MYR", label: "MYRIADCOIN" },
        NAUT: { symbol: "NAUT", label: "NAUTILUSCOIN" },
        NAV: { symbol: "NAV", label: "NAVCOIN" },
        NEOS: { symbol: "NEOS", label: "NEOSCOIN" },
        NMC: { symbol: "NMC", label: "NAMECOIN" },
        NOBL: { symbol: "NOBL", label: "NOBLECOIN" },
        NOTE: { symbol: "NOTE", label: "DNOTES" },
        NSR: { symbol: "NSR", label: "NUSHARES" },
        NXC: { symbol: "NXC", label: "NEXIUM" },
        NXT: { symbol: "NXT", label: "NXT" },
        OMNI: { symbol: "OMNI", label: "OMNI" },
        PINK: { symbol: "PINK", label: "PINKCOIN" },
        POT: { symbol: "POT", label: "POTCOIN" },
        PPC: { symbol: "PPC", label: "PEERCOIN" },
        QBK: { symbol: "QBK", label: "QIBUCK" },
        QORA: { symbol: "QORA", label: "QORA" },
        QTL: { symbol: "QTL", label: "QUATLOO" },
        RADS: { symbol: "RADS", label: "RADIUM" },
        RBY: { symbol: "RBY", label: "RUBYCOIN" },
        REP: { symbol: "REP", label: "AUGUR" },
        RIC: { symbol: "RIC", label: "RIECOIN" },
        SBD: { symbol: "SBD", label: "STEEM DOLLARS" },
        SC: { symbol: "SC", label: "SIACOIN" },
        SDC: { symbol: "SDC", label: "SHADOW" },
        SJCX: { symbol: "SJCX", label: "STORJCOIN X" },
        STEEM: { symbol: "STEEM", label: "STEEM" },
        STR: { symbol: "STR", label: "STELLAR" },
        STRAT: { symbol: "STRAT", label: "STRATIS" },
        SYS: { symbol: "SYS", label: "SYSCOIN" },
        UNITY: { symbol: "UNITY", label: "SUPERNET" },
        VIA: { symbol: "VIA", label: "VIACOIN" },
        VOX: { symbol: "VOX", label: "VOXELS" },
        VRC: { symbol: "VRC", label: "VERICOIN" },
        VTC: { symbol: "VTC", label: "VERTCOIN" },
        WAVES: { symbol: "WAVES", label: "WAVES" },
        XBC: { symbol: "XBC", label: "BITCOINPLUS" },
        XCP: { symbol: "XCP", label: "COUNTERPARTY" },
        XEM: { symbol: "XEM", label: "NEM" },
        XMG: { symbol: "XMG", label: "MAGI" },
        XMR: { symbol: "XMR", label: "MONERO" },
        XPM: { symbol: "XPM", label: "PRIMECOIN" },
        XRP: { symbol: "XRP", label: "RIPPLE" },
        XVC: { symbol: "XVC", label: "VCASH" },
        ZEC: { symbol: "ZEC", label: "ZCASH" }
    }
};
//# sourceMappingURL=CurrencyConversion.js.map