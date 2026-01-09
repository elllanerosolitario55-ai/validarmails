// Email Validator - Netlify Function
// Validates emails and checks for regional domains (Europe, Americas, Caribbean)
// 80+ countries and territories supported

const dns = require('dns').promises;

// ============================================
// COMPLETE REGIONAL DOMAINS DATABASE
// ============================================

const REGIONAL_DOMAINS = {
    // ==========================================
    // EUROPE (50 countries/territories)
    // ==========================================
    
    spain: {
        name: 'España',
        flag: '🇪🇸',
        code: 'ES',
        region: 'Europe',
        tld: ['.es'],
        providers: [
            'telefonica.com', 'telefonica.es', 'movistar.es', 'movistar.com',
            'orange.es', 'vodafone.es', 'jazztel.es', 'ono.es', 'ono.com',
            'ya.com', 'terra.es', 'wanadoo.es', 'eresmas.com', 'eresmas.es',
            'mixmail.com', 'correo.es', 'hispavista.com', 'mundo-r.com',
            'r.es', 'euskaltel.es', 'telecable.es', 'masmovil.es',
            'pepephone.com', 'simyo.es', 'lowi.es', 'digi.es', 'finetwork.com',
            'o2online.es', 'ibercom.es', 'auna.es'
        ]
    },

    germany: {
        name: 'Alemania',
        flag: '🇩🇪',
        code: 'DE',
        region: 'Europe',
        tld: ['.de'],
        providers: [
            't-online.de', 'web.de', 'gmx.de', 'gmx.net', 'freenet.de',
            'arcor.de', 'vodafone.de', 'o2online.de', '1und1.de', 'mail.de',
            'posteo.de', 'tutanota.com', 'tutanota.de', 'mailbox.org'
        ]
    },

    france: {
        name: 'Francia',
        flag: '🇫🇷',
        code: 'FR',
        region: 'Europe',
        tld: ['.fr'],
        providers: [
            'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr', 'laposte.net',
            'bbox.fr', 'bouyguestelecom.fr', 'neuf.fr', 'numericable.fr',
            'club-internet.fr', 'alice.fr', 'voila.fr'
        ]
    },

    italy: {
        name: 'Italia',
        flag: '🇮🇹',
        code: 'IT',
        region: 'Europe',
        tld: ['.it'],
        providers: [
            'libero.it', 'virgilio.it', 'tim.it', 'alice.it', 'tin.it',
            'tiscali.it', 'fastweb.it', 'vodafone.it', 'wind.it', 'tre.it',
            'poste.it', 'email.it', 'pec.it', 'aruba.it'
        ]
    },

    uk: {
        name: 'Reino Unido',
        flag: '🇬🇧',
        code: 'GB',
        region: 'Europe',
        tld: ['.uk', '.co.uk', '.org.uk', '.me.uk'],
        providers: [
            'btinternet.com', 'bt.com', 'sky.com', 'virgin.net', 'virginmedia.com',
            'talktalk.net', 'plusnet.com', 'ee.co.uk', 'o2.co.uk', 'vodafone.co.uk',
            'three.co.uk', 'ntlworld.com', 'blueyonder.co.uk', 'aol.co.uk'
        ]
    },

    portugal: {
        name: 'Portugal',
        flag: '🇵🇹',
        code: 'PT',
        region: 'Europe',
        tld: ['.pt'],
        providers: [
            'sapo.pt', 'mail.pt', 'clix.pt', 'iol.pt', 'netcabo.pt',
            'meo.pt', 'nos.pt', 'vodafone.pt', 'nowo.pt', 'telepac.pt'
        ]
    },

    netherlands: {
        name: 'Países Bajos',
        flag: '🇳🇱',
        code: 'NL',
        region: 'Europe',
        tld: ['.nl'],
        providers: [
            'kpnmail.nl', 'ziggo.nl', 'xs4all.nl', 'planet.nl', 'upcmail.nl',
            'home.nl', 'hetnet.nl', 'telfort.nl', 'tele2.nl', 'online.nl'
        ]
    },

    belgium: {
        name: 'Bélgica',
        flag: '🇧🇪',
        code: 'BE',
        region: 'Europe',
        tld: ['.be'],
        providers: [
            'telenet.be', 'skynet.be', 'proximus.be', 'belgacom.net',
            'voo.be', 'scarlet.be', 'base.be', 'mobile.be'
        ]
    },

    switzerland: {
        name: 'Suiza',
        flag: '🇨🇭',
        code: 'CH',
        region: 'Europe',
        tld: ['.ch'],
        providers: [
            'bluewin.ch', 'sunrise.ch', 'swisscom.ch', 'hispeed.ch',
            'gmx.ch', 'protonmail.ch', 'proton.me', 'salt.ch', 'upc.ch'
        ]
    },

    austria: {
        name: 'Austria',
        flag: '🇦🇹',
        code: 'AT',
        region: 'Europe',
        tld: ['.at'],
        providers: [
            'a1.net', 'aon.at', 'chello.at', 'gmx.at', 'drei.at',
            'magenta.at', 'tele2.at', 'inode.at', 'telering.at'
        ]
    },

    poland: {
        name: 'Polonia',
        flag: '🇵🇱',
        code: 'PL',
        region: 'Europe',
        tld: ['.pl'],
        providers: [
            'wp.pl', 'onet.pl', 'interia.pl', 'o2.pl', 'poczta.fm',
            'gazeta.pl', 'op.pl', 'go2.pl', 'tlen.pl', 'orange.pl',
            'plus.pl', 't-mobile.pl', 'play.pl'
        ]
    },

    sweden: {
        name: 'Suecia',
        flag: '🇸🇪',
        code: 'SE',
        region: 'Europe',
        tld: ['.se'],
        providers: [
            'telia.com', 'telia.se', 'bredband.net', 'spray.se', 'comhem.se',
            'tre.se', 'telenor.se', 'tele2.se', 'halon.se'
        ]
    },

    norway: {
        name: 'Noruega',
        flag: '🇳🇴',
        code: 'NO',
        region: 'Europe',
        tld: ['.no'],
        providers: [
            'online.no', 'telenor.no', 'broadpark.no', 'getmail.no',
            'frisurf.no', 'tele2.no', 'netcom.no', 'ice.no'
        ]
    },

    denmark: {
        name: 'Dinamarca',
        flag: '🇩🇰',
        code: 'DK',
        region: 'Europe',
        tld: ['.dk'],
        providers: [
            'mail.dk', 'jubii.dk', 'tdcadsl.dk', 'tdc.dk', 'stofanet.dk',
            'youmail.dk', 'telmore.dk', 'telenor.dk', '3.dk'
        ]
    },

    finland: {
        name: 'Finlandia',
        flag: '🇫🇮',
        code: 'FI',
        region: 'Europe',
        tld: ['.fi'],
        providers: [
            'elisa.fi', 'saunalahti.fi', 'kolumbus.fi', 'suomi24.fi',
            'welho.com', 'pp.inet.fi', 'dna.fi', 'telia.fi'
        ]
    },

    ireland: {
        name: 'Irlanda',
        flag: '🇮🇪',
        code: 'IE',
        region: 'Europe',
        tld: ['.ie'],
        providers: [
            'eircom.net', 'eir.ie', 'vodafone.ie', 'three.ie',
            'upc.ie', 'iolfree.ie', 'digiweb.ie', 'imagine.ie'
        ]
    },

    greece: {
        name: 'Grecia',
        flag: '🇬🇷',
        code: 'GR',
        region: 'Europe',
        tld: ['.gr'],
        providers: [
            'otenet.gr', 'cosmote.gr', 'vodafone.gr', 'forthnet.gr',
            'hol.gr', 'wind.gr', 'nova.gr', 'cyta.gr'
        ]
    },

    czechia: {
        name: 'República Checa',
        flag: '🇨🇿',
        code: 'CZ',
        region: 'Europe',
        tld: ['.cz'],
        providers: [
            'seznam.cz', 'centrum.cz', 'email.cz', 'post.cz', 'volny.cz',
            'atlas.cz', 'o2.cz', 't-mobile.cz', 'vodafone.cz'
        ]
    },

    hungary: {
        name: 'Hungría',
        flag: '🇭🇺',
        code: 'HU',
        region: 'Europe',
        tld: ['.hu'],
        providers: [
            'freemail.hu', 'citromail.hu', 't-online.hu', 'indamail.hu',
            'vipmail.hu', 'upcmail.hu', 'vodafone.hu', 'telekom.hu'
        ]
    },

    romania: {
        name: 'Rumanía',
        flag: '🇷🇴',
        code: 'RO',
        region: 'Europe',
        tld: ['.ro'],
        providers: [
            'yahoo.ro', 'rdslink.ro', 'clicknet.ro', 'personal.ro',
            'email.ro', 'digi.ro', 'orange.ro', 'vodafone.ro'
        ]
    },

    bulgaria: {
        name: 'Bulgaria',
        flag: '🇧🇬',
        code: 'BG',
        region: 'Europe',
        tld: ['.bg'],
        providers: [
            'abv.bg', 'mail.bg', 'dir.bg', 'gbg.bg', 'vivacom.bg',
            'mtel.bg', 'telenor.bg', 'blizoo.bg'
        ]
    },

    croatia: {
        name: 'Croacia',
        flag: '🇭🇷',
        code: 'HR',
        region: 'Europe',
        tld: ['.hr'],
        providers: [
            'net.hr', 'zg.t-com.hr', 'optinet.hr', 'iskon.hr',
            'vip.hr', 'tele2.hr', 'a1.hr', 'inet.hr'
        ]
    },

    slovakia: {
        name: 'Eslovaquia',
        flag: '🇸🇰',
        code: 'SK',
        region: 'Europe',
        tld: ['.sk'],
        providers: [
            'azet.sk', 'centrum.sk', 'post.sk', 'zoznam.sk',
            'orangemail.sk', 't-mobile.sk', 'o2.sk', 'swan.sk'
        ]
    },

    slovenia: {
        name: 'Eslovenia',
        flag: '🇸🇮',
        code: 'SI',
        region: 'Europe',
        tld: ['.si'],
        providers: [
            'siol.net', 'volja.net', 'telemach.si', 'amis.net',
            'telekom.si', 'a1.si', 't-2.net'
        ]
    },

    serbia: {
        name: 'Serbia',
        flag: '🇷🇸',
        code: 'RS',
        region: 'Europe',
        tld: ['.rs'],
        providers: [
            'eunet.rs', 'sbb.rs', 'mts.rs', 'telenor.rs',
            'vip.rs', 'orion.rs', 'beotel.net'
        ]
    },

    ukraine: {
        name: 'Ucrania',
        flag: '🇺🇦',
        code: 'UA',
        region: 'Europe',
        tld: ['.ua'],
        providers: [
            'ukr.net', 'i.ua', 'meta.ua', 'bigmir.net', 'email.ua',
            'mail.ua', 'online.ua', 'kyivstar.ua', 'vodafone.ua'
        ]
    },

    russia: {
        name: 'Rusia',
        flag: '🇷🇺',
        code: 'RU',
        region: 'Europe',
        tld: ['.ru', '.su'],
        providers: [
            'mail.ru', 'yandex.ru', 'rambler.ru', 'bk.ru', 'list.ru',
            'inbox.ru', 'ya.ru', 'mts.ru', 'beeline.ru', 'megafon.ru'
        ]
    },

    turkey: {
        name: 'Turquía',
        flag: '🇹🇷',
        code: 'TR',
        region: 'Europe',
        tld: ['.tr', '.com.tr'],
        providers: [
            'mynet.com', 'turk.net', 'superonline.com', 'ttnet.net.tr',
            'turktelekom.com.tr', 'vodafone.com.tr', 'turkcell.com.tr'
        ]
    },

    iceland: {
        name: 'Islandia',
        flag: '🇮🇸',
        code: 'IS',
        region: 'Europe',
        tld: ['.is'],
        providers: ['simnet.is', 'visir.is', 'vodafone.is', 'nova.is', 'mila.is']
    },

    luxembourg: {
        name: 'Luxemburgo',
        flag: '🇱🇺',
        code: 'LU',
        region: 'Europe',
        tld: ['.lu'],
        providers: ['pt.lu', 'vo.lu', 'internet.lu', 'tango.lu', 'orange.lu']
    },

    malta: {
        name: 'Malta',
        flag: '🇲🇹',
        code: 'MT',
        region: 'Europe',
        tld: ['.mt', '.com.mt'],
        providers: ['maltanet.net', 'go.com.mt', 'melita.com', 'onvol.net']
    },

    cyprus: {
        name: 'Chipre',
        flag: '🇨🇾',
        code: 'CY',
        region: 'Europe',
        tld: ['.cy'],
        providers: ['cytanet.com.cy', 'cablenet.com.cy', 'primehome.com', 'cyta.com.cy']
    },

    estonia: {
        name: 'Estonia',
        flag: '🇪🇪',
        code: 'EE',
        region: 'Europe',
        tld: ['.ee'],
        providers: ['mail.ee', 'hot.ee', 'neti.ee', 'telia.ee', 'elion.ee']
    },

    latvia: {
        name: 'Letonia',
        flag: '🇱🇻',
        code: 'LV',
        region: 'Europe',
        tld: ['.lv'],
        providers: ['inbox.lv', 'one.lv', 'apollo.lv', 'tvnet.lv', 'lattelecom.lv']
    },

    lithuania: {
        name: 'Lituania',
        flag: '🇱🇹',
        code: 'LT',
        region: 'Europe',
        tld: ['.lt'],
        providers: ['gmail.lt', 'takas.lt', 'zebra.lt', 'telia.lt', 'omnitel.lt']
    },

    albania: {
        name: 'Albania',
        flag: '🇦🇱',
        code: 'AL',
        region: 'Europe',
        tld: ['.al'],
        providers: ['albaniaonline.net', 'abcom.al', 'albtelecom.al', 'vodafone.al']
    },

    northMacedonia: {
        name: 'Macedonia del Norte',
        flag: '🇲🇰',
        code: 'MK',
        region: 'Europe',
        tld: ['.mk'],
        providers: ['t-home.mk', 'on.net.mk', 'mt.net.mk', 'a1.mk']
    },

    montenegro: {
        name: 'Montenegro',
        flag: '🇲🇪',
        code: 'ME',
        region: 'Europe',
        tld: ['.me'],
        providers: ['t-com.me', 'm-tel.me', 'telenor.me', 'mtel.me']
    },

    bosnia: {
        name: 'Bosnia y Herzegovina',
        flag: '🇧🇦',
        code: 'BA',
        region: 'Europe',
        tld: ['.ba'],
        providers: ['bih.net.ba', 'tel.net.ba', 'telemach.ba', 'mtel.ba', 'bhtelecom.ba']
    },

    kosovo: {
        name: 'Kosovo',
        flag: '🇽🇰',
        code: 'XK',
        region: 'Europe',
        tld: ['.xk'],
        providers: ['ipko.com', 'kujtesa.com', 'vfrr.net']
    },

    moldova: {
        name: 'Moldavia',
        flag: '🇲🇩',
        code: 'MD',
        region: 'Europe',
        tld: ['.md'],
        providers: ['mail.md', 'moldtelecom.md', 'orange.md', 'moldcell.md', 'starnet.md']
    },

    belarus: {
        name: 'Bielorrusia',
        flag: '🇧🇾',
        code: 'BY',
        region: 'Europe',
        tld: ['.by'],
        providers: ['tut.by', 'mail.by', 'open.by', 'mts.by', 'velcom.by', 'a1.by']
    },

    andorra: {
        name: 'Andorra',
        flag: '🇦🇩',
        code: 'AD',
        region: 'Europe',
        tld: ['.ad'],
        providers: ['andorramail.ad', 'andorra.ad']
    },

    monaco: {
        name: 'Mónaco',
        flag: '🇲🇨',
        code: 'MC',
        region: 'Europe',
        tld: ['.mc'],
        providers: ['monaco.mc', 'libello.com']
    },

    sanMarino: {
        name: 'San Marino',
        flag: '🇸🇲',
        code: 'SM',
        region: 'Europe',
        tld: ['.sm'],
        providers: ['omniway.sm', 'sanmarinotelecom.sm']
    },

    liechtenstein: {
        name: 'Liechtenstein',
        flag: '🇱🇮',
        code: 'LI',
        region: 'Europe',
        tld: ['.li'],
        providers: ['telecom.li', 'supra.net']
    },

    vatican: {
        name: 'Vaticano',
        flag: '🇻🇦',
        code: 'VA',
        region: 'Europe',
        tld: ['.va'],
        providers: []
    },

    gibraltar: {
        name: 'Gibraltar',
        flag: '🇬🇮',
        code: 'GI',
        region: 'Europe',
        tld: ['.gi'],
        providers: ['gibtelecom.net', 'sapphire.gi']
    },

    faroeIslands: {
        name: 'Islas Feroe',
        flag: '🇫🇴',
        code: 'FO',
        region: 'Europe',
        tld: ['.fo'],
        providers: ['foroya.fo', 'telepost.fo', 'olivant.fo']
    },

    alandIslands: {
        name: 'Islas Åland',
        flag: '🇦🇽',
        code: 'AX',
        region: 'Europe',
        tld: ['.ax'],
        providers: ['aland.net']
    },

    isleOfMan: {
        name: 'Isla de Man',
        flag: '🇮🇲',
        code: 'IM',
        region: 'Europe',
        tld: ['.im'],
        providers: ['manx.net', 'mt.im']
    },

    jersey: {
        name: 'Jersey',
        flag: '🇯🇪',
        code: 'JE',
        region: 'Europe',
        tld: ['.je'],
        providers: ['jerseymail.co.uk', 'jtglobal.com']
    },

    guernsey: {
        name: 'Guernsey',
        flag: '🇬🇬',
        code: 'GG',
        region: 'Europe',
        tld: ['.gg'],
        providers: ['cwgsy.net', 'guernsey.net']
    },

    georgia: {
        name: 'Georgia',
        flag: '🇬🇪',
        code: 'GE',
        region: 'Europe',
        tld: ['.ge'],
        providers: ['caucasus.net', 'geo.net.ge', 'magticom.ge', 'silknet.com']
    },

    armenia: {
        name: 'Armenia',
        flag: '🇦🇲',
        code: 'AM',
        region: 'Europe',
        tld: ['.am'],
        providers: ['arminco.com', 'mail.am', 'ucom.am', 'vivacell.am']
    },

    azerbaijan: {
        name: 'Azerbaiyán',
        flag: '🇦🇿',
        code: 'AZ',
        region: 'Europe',
        tld: ['.az'],
        providers: ['azdata.net', 'box.az', 'mail.az', 'azercell.com']
    },

    // ==========================================
    // NORTH AMERICA
    // ==========================================

    usa: {
        name: 'Estados Unidos',
        flag: '🇺🇸',
        code: 'US',
        region: 'North America',
        tld: ['.us'],
        providers: [
            'aol.com', 'att.net', 'bellsouth.net', 'charter.net', 'comcast.net',
            'cox.net', 'earthlink.net', 'juno.com', 'netzero.net', 'optimum.net',
            'optonline.net', 'rocketmail.com', 'sbcglobal.net', 'verizon.net',
            'windstream.net', 'frontier.com', 'centurylink.net', 'spectrum.net',
            'xfinity.com', 'twc.com', 'suddenlink.net'
        ]
    },

    canada: {
        name: 'Canadá',
        flag: '🇨🇦',
        code: 'CA',
        region: 'North America',
        tld: ['.ca'],
        providers: [
            'bell.net', 'bellnet.ca', 'rogers.com', 'shaw.ca', 'telus.net',
            'videotron.ca', 'cogeco.ca', 'eastlink.ca', 'sasktel.net',
            'mts.net', 'sympatico.ca', 'look.ca'
        ]
    },

    mexico: {
        name: 'México',
        flag: '🇲🇽',
        code: 'MX',
        region: 'North America',
        tld: ['.mx', '.com.mx', '.gob.mx', '.org.mx'],
        providers: [
            'prodigy.net.mx', 'telmex.com', 'infinitum.com.mx', 'izzi.mx',
            'megacable.com.mx', 'axtel.mx', 'att.com.mx', 'totalplay.com.mx',
            'cablevision.net.mx', 'correo.unam.mx'
        ]
    },

    greenland: {
        name: 'Groenlandia',
        flag: '🇬🇱',
        code: 'GL',
        region: 'North America',
        tld: ['.gl'],
        providers: ['telepost.gl', 'greennet.gl', 'tusass.gl']
    },

    bermuda: {
        name: 'Bermudas',
        flag: '🇧🇲',
        code: 'BM',
        region: 'North America',
        tld: ['.bm'],
        providers: ['northrock.bm', 'logic.bm', 'ibl.bm']
    },

    saintPierreAndMiquelon: {
        name: 'San Pedro y Miquelón',
        flag: '🇵🇲',
        code: 'PM',
        region: 'North America',
        tld: ['.pm'],
        providers: ['cheznoo.net']
    },

    // ==========================================
    // CENTRAL AMERICA
    // ==========================================

    guatemala: {
        name: 'Guatemala',
        flag: '🇬🇹',
        code: 'GT',
        region: 'Central America',
        tld: ['.gt', '.com.gt', '.org.gt', '.gob.gt'],
        providers: ['turbonett.com', 'claro.com.gt', 'tigo.com.gt', 'movistar.com.gt']
    },

    belize: {
        name: 'Belice',
        flag: '🇧🇿',
        code: 'BZ',
        region: 'Central America',
        tld: ['.bz'],
        providers: ['btl.net', 'digicell.bz', 'smart.bz']
    },

    elSalvador: {
        name: 'El Salvador',
        flag: '🇸🇻',
        code: 'SV',
        region: 'Central America',
        tld: ['.sv', '.com.sv', '.gob.sv'],
        providers: [
            'telecom.com.sv', 'claro.com.sv', 'tigo.com.sv', 'movistar.com.sv',
            'navegante.com.sv', 'turbonett.com.sv'
        ]
    },

    honduras: {
        name: 'Honduras',
        flag: '🇭🇳',
        code: 'HN',
        region: 'Central America',
        tld: ['.hn', '.com.hn', '.gob.hn'],
        providers: ['hondutel.hn', 'tigo.com.hn', 'claro.com.hn', 'cablecolor.hn']
    },

    nicaragua: {
        name: 'Nicaragua',
        flag: '🇳🇮',
        code: 'NI',
        region: 'Central America',
        tld: ['.ni', '.com.ni', '.gob.ni'],
        providers: [
            'cablenet.com.ni', 'claro.com.ni', 'movistar.com.ni', 'yota.com.ni',
            'ideay.net.ni', 'ibw.com.ni'
        ]
    },

    costaRica: {
        name: 'Costa Rica',
        flag: '🇨🇷',
        code: 'CR',
        region: 'Central America',
        tld: ['.cr', '.co.cr', '.go.cr'],
        providers: [
            'ice.co.cr', 'racsa.co.cr', 'kolbi.cr', 'cabletica.com',
            'tigo.co.cr', 'claro.cr', 'movistar.cr', 'telecable.co.cr'
        ]
    },

    panama: {
        name: 'Panamá',
        flag: '🇵🇦',
        code: 'PA',
        region: 'Central America',
        tld: ['.pa', '.com.pa', '.gob.pa'],
        providers: [
            'cwpanama.net', 'cable-onda.com', 'movistar.com.pa', 'claro.com.pa',
            'digicel.com.pa', 'tigo.com.pa'
        ]
    },

    // ==========================================
    // CARIBBEAN (Complete)
    // ==========================================

    cuba: {
        name: 'Cuba',
        flag: '🇨🇺',
        code: 'CU',
        region: 'Caribbean',
        tld: ['.cu'],
        providers: ['nauta.cu', 'etecsa.cu', 'infomed.sld.cu']
    },

    dominicanRepublic: {
        name: 'República Dominicana',
        flag: '🇩🇴',
        code: 'DO',
        region: 'Caribbean',
        tld: ['.do', '.com.do', '.gob.do'],
        providers: [
            'codetel.net.do', 'claro.com.do', 'orange.com.do', 'tricom.net',
            'viva.com.do', 'wind.com.do', 'altice.com.do'
        ]
    },

    puertoRico: {
        name: 'Puerto Rico',
        flag: '🇵🇷',
        code: 'PR',
        region: 'Caribbean',
        tld: ['.pr'],
        providers: ['centennialpr.net', 'claropr.com', 'libertypr.com', 'att.net.pr']
    },

    jamaica: {
        name: 'Jamaica',
        flag: '🇯🇲',
        code: 'JM',
        region: 'Caribbean',
        tld: ['.jm', '.com.jm'],
        providers: ['cwjamaica.com', 'digiceljamaica.com', 'flowjamaica.com']
    },

    haiti: {
        name: 'Haití',
        flag: '🇭🇹',
        code: 'HT',
        region: 'Caribbean',
        tld: ['.ht'],
        providers: ['hainet.ht', 'digicelhaiti.com', 'natcom.com.ht']
    },

    trinidadTobago: {
        name: 'Trinidad y Tobago',
        flag: '🇹🇹',
        code: 'TT',
        region: 'Caribbean',
        tld: ['.tt', '.co.tt'],
        providers: ['tstt.net.tt', 'digiceltt.com', 'flow.co.tt']
    },

    bahamas: {
        name: 'Bahamas',
        flag: '🇧🇸',
        code: 'BS',
        region: 'Caribbean',
        tld: ['.bs'],
        providers: ['batelnet.bs', 'coralwave.com', 'btcbahamas.com']
    },

    barbados: {
        name: 'Barbados',
        flag: '🇧🇧',
        code: 'BB',
        region: 'Caribbean',
        tld: ['.bb', '.com.bb'],
        providers: ['caribsurf.com', 'sunbeach.net', 'flowbb.com']
    },

    antiguaBarbuda: {
        name: 'Antigua y Barbuda',
        flag: '🇦🇬',
        code: 'AG',
        region: 'Caribbean',
        tld: ['.ag'],
        providers: ['apua.ag', 'candw.ag', 'digicelantiguabarbuda.com']
    },

    saintKittsNevis: {
        name: 'San Cristóbal y Nieves',
        flag: '🇰🇳',
        code: 'KN',
        region: 'Caribbean',
        tld: ['.kn'],
        providers: ['sisterisles.kn', 'digicelkn.com', 'flow.kn']
    },

    saintLucia: {
        name: 'Santa Lucía',
        flag: '🇱🇨',
        code: 'LC',
        region: 'Caribbean',
        tld: ['.lc'],
        providers: ['candw.lc', 'digicellc.com', 'flow.lc']
    },

    saintVincent: {
        name: 'San Vicente y Granadinas',
        flag: '🇻🇨',
        code: 'VC',
        region: 'Caribbean',
        tld: ['.vc'],
        providers: ['vincysurf.com', 'digicelvc.com', 'flow.vc']
    },

    grenada: {
        name: 'Granada',
        flag: '🇬🇩',
        code: 'GD',
        region: 'Caribbean',
        tld: ['.gd'],
        providers: ['spiceisle.com', 'digicelgd.com', 'flowgrenada.com']
    },

    dominica: {
        name: 'Dominica',
        flag: '🇩🇲',
        code: 'DM',
        region: 'Caribbean',
        tld: ['.dm'],
        providers: ['cwdom.dm', 'digiceldm.com', 'flow.dm']
    },

    aruba: {
        name: 'Aruba',
        flag: '🇦🇼',
        code: 'AW',
        region: 'Caribbean',
        tld: ['.aw'],
        providers: ['setarnet.aw', 'digicelgroup.com']
    },

    curacao: {
        name: 'Curazao',
        flag: '🇨🇼',
        code: 'CW',
        region: 'Caribbean',
        tld: ['.cw'],
        providers: ['utsmail.an', 'digicelgroup.com', 'flow.cw']
    },

    sintMaarten: {
        name: 'Sint Maarten',
        flag: '🇸🇽',
        code: 'SX',
        region: 'Caribbean',
        tld: ['.sx'],
        providers: ['telem-group.com', 'smitcoms.sx']
    },

    bonaire: {
        name: 'Bonaire',
        flag: '🇧🇶',
        code: 'BQ',
        region: 'Caribbean',
        tld: ['.bq'],
        providers: ['telbo.com']
    },

    caymanIslands: {
        name: 'Islas Caimán',
        flag: '🇰🇾',
        code: 'KY',
        region: 'Caribbean',
        tld: ['.ky'],
        providers: ['candw.ky', 'digicelcayman.com', 'flow.ky']
    },

    britishVirginIslands: {
        name: 'Islas Vírgenes Británicas',
        flag: '🇻🇬',
        code: 'VG',
        region: 'Caribbean',
        tld: ['.vg'],
        providers: ['surfbvi.com', 'digicelbvi.com', 'flowbvi.com']
    },

    usVirginIslands: {
        name: 'Islas Vírgenes de EE.UU.',
        flag: '🇻🇮',
        code: 'VI',
        region: 'Caribbean',
        tld: ['.vi'],
        providers: ['viaccess.net', 'vitelvi.com']
    },

    turksAndCaicos: {
        name: 'Islas Turcas y Caicos',
        flag: '🇹🇨',
        code: 'TC',
        region: 'Caribbean',
        tld: ['.tc'],
        providers: ['tciway.tc', 'digiceltc.com', 'flow.tc']
    },

    anguilla: {
        name: 'Anguila',
        flag: '🇦🇮',
        code: 'AI',
        region: 'Caribbean',
        tld: ['.ai'],
        providers: ['anguillanet.com', 'digicelanguilla.com', 'flow.ai']
    },

    montserrat: {
        name: 'Montserrat',
        flag: '🇲🇸',
        code: 'MS',
        region: 'Caribbean',
        tld: ['.ms'],
        providers: ['candw.ms', 'digicelms.com', 'flow.ms']
    },

    martinique: {
        name: 'Martinica',
        flag: '🇲🇶',
        code: 'MQ',
        region: 'Caribbean',
        tld: ['.mq'],
        providers: ['martinique.fr', 'orange.mq', 'mediaserv.net']
    },

    guadeloupe: {
        name: 'Guadalupe',
        flag: '🇬🇵',
        code: 'GP',
        region: 'Caribbean',
        tld: ['.gp'],
        providers: ['guadeloupe.fr', 'orange.gp', 'mediaserv.net']
    },

    saintBarthelemy: {
        name: 'San Bartolomé',
        flag: '🇧🇱',
        code: 'BL',
        region: 'Caribbean',
        tld: ['.bl'],
        providers: ['orange.fr']
    },

    saintMartin: {
        name: 'San Martín (Francia)',
        flag: '🇲🇫',
        code: 'MF',
        region: 'Caribbean',
        tld: ['.mf'],
        providers: ['orange.fr', 'dauphin.fr']
    },

    // ==========================================
    // SOUTH AMERICA (Complete)
    // ==========================================

    argentina: {
        name: 'Argentina',
        flag: '🇦🇷',
        code: 'AR',
        region: 'South America',
        tld: ['.ar', '.com.ar', '.gob.ar', '.org.ar'],
        providers: [
            'fibertel.com.ar', 'speedy.com.ar', 'arnet.com.ar', 'telecom.com.ar',
            'personal.com.ar', 'claro.com.ar', 'movistar.com.ar', 'iplan.com.ar',
            'telecentro.com.ar', 'ciudad.com.ar', 'fullzero.com.ar', 'infovia.com.ar'
        ]
    },

    brazil: {
        name: 'Brasil',
        flag: '🇧🇷',
        code: 'BR',
        region: 'South America',
        tld: ['.br', '.com.br', '.gov.br', '.org.br'],
        providers: [
            'uol.com.br', 'bol.com.br', 'terra.com.br', 'globo.com', 'ig.com.br',
            'oi.com.br', 'vivo.com.br', 'claro.com.br', 'tim.com.br', 'net.com.br',
            'r7.com', 'zipmail.com.br', 'superig.com.br', 'ibest.com.br'
        ]
    },

    chile: {
        name: 'Chile',
        flag: '🇨🇱',
        code: 'CL',
        region: 'South America',
        tld: ['.cl'],
        providers: [
            'entel.cl', 'vtr.net', 'movistar.cl', 'claro.cl', 'wom.cl',
            'gtd.cl', 'terra.cl', 'mi.cl', 'netline.cl', 'telsur.cl'
        ]
    },

    colombia: {
        name: 'Colombia',
        flag: '🇨🇴',
        code: 'CO',
        region: 'South America',
        tld: ['.co', '.com.co', '.gov.co', '.org.co'],
        providers: [
            'une.net.co', 'epm.net.co', 'etb.net.co', 'telecom.com.co',
            'claro.com.co', 'movistar.com.co', 'tigo.com.co', 'virgin.com.co',
            'emcali.net.co', 'metrotel.net.co'
        ]
    },

    peru: {
        name: 'Perú',
        flag: '🇵🇪',
        code: 'PE',
        region: 'South America',
        tld: ['.pe', '.com.pe', '.gob.pe'],
        providers: [
            'terra.com.pe', 'speedy.com.pe', 'movistar.com.pe', 'claro.com.pe',
            'entel.pe', 'bitel.com.pe', 'cablemagico.com.pe', 'win.pe'
        ]
    },

    venezuela: {
        name: 'Venezuela',
        flag: '🇻🇪',
        code: 'VE',
        region: 'South America',
        tld: ['.ve', '.com.ve', '.gob.ve'],
        providers: [
            'cantv.net', 'movistar.com.ve', 'digitel.com.ve', 'movilnet.com.ve',
            'inter.net.ve', 'supercable.com.ve', 'netuno.net.ve', 'intercable.net.ve'
        ]
    },

    ecuador: {
        name: 'Ecuador',
        flag: '🇪🇨',
        code: 'EC',
        region: 'South America',
        tld: ['.ec', '.com.ec', '.gob.ec'],
        providers: [
            'andinanet.net', 'porta.net', 'claro.com.ec', 'movistar.com.ec',
            'cnt.gob.ec', 'etapanet.net.ec', 'puntonet.ec', 'netlife.ec'
        ]
    },

    bolivia: {
        name: 'Bolivia',
        flag: '🇧🇴',
        code: 'BO',
        region: 'South America',
        tld: ['.bo', '.com.bo', '.gob.bo'],
        providers: [
            'entelnet.bo', 'cotas.com.bo', 'tigo.com.bo', 'viva.com.bo',
            'comteco.com.bo', 'cotel.com.bo', 'telecel.com.bo'
        ]
    },

    paraguay: {
        name: 'Paraguay',
        flag: '🇵🇾',
        code: 'PY',
        region: 'South America',
        tld: ['.py', '.com.py', '.gov.py'],
        providers: [
            'tigo.com.py', 'personal.com.py', 'claro.com.py', 'vox.com.py',
            'copaco.com.py', 'rieder.net.py', 'telecel.com.py'
        ]
    },

    uruguay: {
        name: 'Uruguay',
        flag: '🇺🇾',
        code: 'UY',
        region: 'South America',
        tld: ['.uy', '.com.uy', '.gub.uy'],
        providers: [
            'adinet.com.uy', 'antel.com.uy', 'movistar.com.uy', 'claro.com.uy',
            'dedicado.com.uy', 'montevideo.com.uy', 'netgate.com.uy'
        ]
    },

    guyana: {
        name: 'Guyana',
        flag: '🇬🇾',
        code: 'GY',
        region: 'South America',
        tld: ['.gy'],
        providers: ['networksgy.com', 'gtt.co.gy', 'digicelgroup.com']
    },

    suriname: {
        name: 'Surinam',
        flag: '🇸🇷',
        code: 'SR',
        region: 'South America',
        tld: ['.sr'],
        providers: ['sr.net', 'telesur.sr', 'digicel.sr']
    },

    frenchGuiana: {
        name: 'Guayana Francesa',
        flag: '🇬🇫',
        code: 'GF',
        region: 'South America',
        tld: ['.gf'],
        providers: ['wanadoo.gf', 'nplus.gf', 'digicel.gf', 'orange.gf']
    },

    falklandIslands: {
        name: 'Islas Malvinas',
        flag: '🇫🇰',
        code: 'FK',
        region: 'South America',
        tld: ['.fk'],
        providers: ['horizon.co.fk', 'sure.co.fk']
    }
};

// Disposable/temporary email domains
const DISPOSABLE_DOMAINS = [
    'tempmail.com', 'temp-mail.org', 'temp-mail.io',
    'guerrillamail.com', 'guerrillamail.org', 'guerrillamail.net',
    'mailinator.com', 'mailinator.net',
    '10minutemail.com', '10minutemail.net',
    'throwaway.email', 'throwawaymail.com',
    'fakeinbox.com', 'fakemailgenerator.com',
    'trashmail.com', 'trashmail.net',
    'yopmail.com', 'yopmail.fr',
    'getnada.com', 'getnada.cc',
    'mohmal.com', 'mohmal.im',
    'dispostable.com', 'mailnesia.com',
    'tempail.com', 'emailondeck.com',
    'maildrop.cc', 'sharklasers.com',
    'spam4.me', 'mytemp.email',
    'burnermail.io', 'emailfake.com'
];

// Build flat lookup arrays for performance
const allTLDs = [];
const allProviders = [];

Object.entries(REGIONAL_DOMAINS).forEach(([key, country]) => {
    country.tld.forEach(tld => {
        allTLDs.push({ tld, country: key });
    });
    country.providers.forEach(provider => {
        allProviders.push({ provider, country: key });
    });
});

// Validate email format
function isValidFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Detect country from email
function detectCountry(email) {
    const domain = email.split('@')[1].toLowerCase();
    
    // Check providers first (more specific)
    for (const { provider, country } of allProviders) {
        if (domain === provider || domain.endsWith('.' + provider)) {
            return REGIONAL_DOMAINS[country];
        }
    }
    
    // Check TLDs (sort by length descending to match longer TLDs first like .com.ar before .ar)
    const sortedTLDs = [...allTLDs].sort((a, b) => b.tld.length - a.tld.length);
    for (const { tld, country } of sortedTLDs) {
        if (domain.endsWith(tld)) {
            return REGIONAL_DOMAINS[country];
        }
    }
    
    return null;
}

// Check if email is from disposable domain
function isDisposable(email) {
    const domain = email.split('@')[1].toLowerCase();
    return DISPOSABLE_DOMAINS.some(dd => domain.includes(dd));
}

// Check MX records for domain
async function hasMXRecords(domain) {
    try {
        const records = await dns.resolveMx(domain);
        return records && records.length > 0;
    } catch (error) {
        return false;
    }
}

// Check if domain exists (A or AAAA records)
async function domainExists(domain) {
    try {
        await dns.resolve4(domain);
        return true;
    } catch {
        try {
            await dns.resolve6(domain);
            return true;
        } catch {
            return false;
        }
    }
}

// Main validation function
async function validateEmail(email) {
    const result = {
        email: email.toLowerCase(),
        valid: false,
        country: null,
        countryCode: null,
        countryName: null,
        countryFlag: null,
        region: null,
        reason: null,
        checks: {
            format: false,
            disposable: false,
            domain: false,
            mx: false
        }
    };

    // Normalize email
    email = email.toLowerCase().trim();

    // Check format
    if (!isValidFormat(email)) {
        result.reason = 'Formato de email inválido';
        return result;
    }
    result.checks.format = true;

    // Check disposable
    if (isDisposable(email)) {
        result.reason = 'Email temporal/desechable detectado';
        result.checks.disposable = true;
        return result;
    }

    const domain = email.split('@')[1];

    // Check domain exists
    const exists = await domainExists(domain);
    if (!exists) {
        result.reason = 'El dominio no existe';
        return result;
    }
    result.checks.domain = true;

    // Check MX records
    const hasMX = await hasMXRecords(domain);
    if (!hasMX) {
        result.reason = 'El dominio no tiene servidor de correo (MX)';
        return result;
    }
    result.checks.mx = true;

    // Detect country
    const country = detectCountry(email);
    if (country) {
        result.country = country.code;
        result.countryCode = country.code;
        result.countryName = country.name;
        result.countryFlag = country.flag;
        result.region = country.region;
    }

    // All checks passed
    result.valid = true;
    return result;
}

// Get list of supported countries
function getSupportedCountries() {
    const byRegion = {};
    
    Object.entries(REGIONAL_DOMAINS).forEach(([key, data]) => {
        if (!byRegion[data.region]) {
            byRegion[data.region] = [];
        }
        byRegion[data.region].push({
            key,
            code: data.code,
            name: data.name,
            flag: data.flag,
            tlds: data.tld,
            providerCount: data.providers.length
        });
    });

    return byRegion;
}

// Netlify Function Handler
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                countries: getSupportedCountries(),
                totalCountries: Object.keys(REGIONAL_DOMAINS).length
            })
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        
        if (body.email) {
            const result = await validateEmail(body.email);
            return { statusCode: 200, headers, body: JSON.stringify(result) };
        }

        if (body.emails && Array.isArray(body.emails)) {
            const results = await Promise.all(
                body.emails.slice(0, 100).map(validateEmail)
            );
            
            const byCountry = {};
            const byRegion = {};
            
            results.filter(r => r.valid && r.countryCode).forEach(r => {
                if (!byCountry[r.countryCode]) {
                    byCountry[r.countryCode] = {
                        code: r.countryCode,
                        name: r.countryName,
                        flag: r.countryFlag,
                        region: r.region,
                        count: 0,
                        emails: []
                    };
                }
                byCountry[r.countryCode].count++;
                byCountry[r.countryCode].emails.push(r.email);

                if (r.region) {
                    if (!byRegion[r.region]) {
                        byRegion[r.region] = 0;
                    }
                    byRegion[r.region]++;
                }
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    results,
                    summary: {
                        total: results.length,
                        valid: results.filter(r => r.valid).length,
                        invalid: results.filter(r => !r.valid).length,
                        identified: results.filter(r => r.countryCode).length,
                        byCountry: Object.values(byCountry).sort((a, b) => b.count - a.count),
                        byRegion
                    }
                })
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Se requiere email o emails[]' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Error interno del servidor' })
        };
    }
};
