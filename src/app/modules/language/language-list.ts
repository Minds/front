/**
 * Language list entry structure
 */
export interface LanguageListEntry {
  code: string;
  name: string;
  nativeName: string;
  nativeNames: Array<string>;
}

/**
 * Language list
 */
const languageList: Array<LanguageListEntry> = [
  {
    code: 'ab',
    name: 'Abkhaz',
    nativeName: '&#1072;&#1191;&#1089;&#1091;&#1072;',
    nativeNames: ['&#1072;&#1191;&#1089;&#1091;&#1072;'],
  },
  {
    code: 'aa',
    name: 'Afar',
    nativeName: 'Afaraf',
    nativeNames: ['Afaraf'],
  },
  {
    code: 'af',
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    nativeNames: ['Afrikaans'],
  },
  {
    code: 'ak',
    name: 'Akan',
    nativeName: 'Akan',
    nativeNames: ['Akan'],
  },
  {
    code: 'sq',
    name: 'Albanian',
    nativeName: 'Shqip',
    nativeNames: ['Shqip'],
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: '&#4768;&#4635;&#4653;&#4763;',
    nativeNames: ['&#4768;&#4635;&#4653;&#4763;'],
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: '&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;',
    nativeNames: ['&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;'],
  },
  {
    code: 'an',
    name: 'Aragonese',
    nativeName: 'Aragon&#233;s',
    nativeNames: ['Aragon&#233;s'],
  },
  {
    code: 'hy',
    name: 'Armenian',
    nativeName: '&#1344;&#1377;&#1397;&#1381;&#1408;&#1381;&#1398;',
    nativeNames: ['&#1344;&#1377;&#1397;&#1381;&#1408;&#1381;&#1398;'],
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: '&#2437;&#2488;&#2478;&#2496;&#2479;&#2492;&#2494;',
    nativeNames: ['&#2437;&#2488;&#2478;&#2496;&#2479;&#2492;&#2494;'],
  },
  {
    code: 'av',
    name: 'Avaric',
    nativeName: '&#1072;&#1074;&#1072;&#1088; &#1084;&#1072;&#1094;&#1216;',
    nativeNames: [
      '&#1072;&#1074;&#1072;&#1088; &#1084;&#1072;&#1094;&#1216;',
      '&#1084;&#1072;&#1075;&#1216;&#1072;&#1088;&#1091;&#1083; &#1084;&#1072;&#1094;&#1216;',
    ],
  },
  {
    code: 'ae',
    name: 'Avestan',
    nativeName: 'avesta',
    nativeNames: ['avesta'],
  },
  {
    code: 'ay',
    name: 'Aymara',
    nativeName: 'aymar aru',
    nativeNames: ['aymar aru'],
  },
  {
    code: 'az',
    name: 'Azerbaijani',
    nativeName: 'az&#601;rbaycan dili',
    nativeNames: ['az&#601;rbaycan dili'],
  },
  {
    code: 'bm',
    name: 'Bambara',
    nativeName: 'bamanankan',
    nativeNames: ['bamanankan'],
  },
  {
    code: 'ba',
    name: 'Bashkir',
    nativeName:
      '&#1073;&#1072;&#1096;&#1185;&#1086;&#1088;&#1090; &#1090;&#1077;&#1083;&#1077;',
    nativeNames: [
      '&#1073;&#1072;&#1096;&#1185;&#1086;&#1088;&#1090; &#1090;&#1077;&#1083;&#1077;',
    ],
  },
  {
    code: 'eu',
    name: 'Basque',
    nativeName: 'euskara',
    nativeNames: ['euskara', 'euskera'],
  },
  {
    code: 'be',
    name: 'Belarusian',
    nativeName:
      '&#1041;&#1077;&#1083;&#1072;&#1088;&#1091;&#1089;&#1082;&#1072;&#1103;',
    nativeNames: [
      '&#1041;&#1077;&#1083;&#1072;&#1088;&#1091;&#1089;&#1082;&#1072;&#1103;',
    ],
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: '&#2476;&#2494;&#2434;&#2482;&#2494;',
    nativeNames: ['&#2476;&#2494;&#2434;&#2482;&#2494;'],
  },
  {
    code: 'bh',
    name: 'Bihari',
    nativeName: '&#2349;&#2379;&#2332;&#2346;&#2369;&#2352;&#2368;',
    nativeNames: ['&#2349;&#2379;&#2332;&#2346;&#2369;&#2352;&#2368;'],
  },
  {
    code: 'bi',
    name: 'Bislama',
    nativeName: 'Bislama',
    nativeNames: ['Bislama'],
  },
  {
    code: 'bs',
    name: 'Bosnian',
    nativeName: 'bosanski jezik',
    nativeNames: ['bosanski jezik'],
  },
  {
    code: 'br',
    name: 'Breton',
    nativeName: 'brezhoneg',
    nativeNames: ['brezhoneg'],
  },
  {
    code: 'bg',
    name: 'Bulgarian',
    nativeName:
      '&#1073;&#1098;&#1083;&#1075;&#1072;&#1088;&#1089;&#1082;&#1080; &#1077;&#1079;&#1080;&#1082;',
    nativeNames: [
      '&#1073;&#1098;&#1083;&#1075;&#1072;&#1088;&#1089;&#1082;&#1080; &#1077;&#1079;&#1080;&#1082;',
    ],
  },
  {
    code: 'my',
    name: 'Burmese',
    nativeName: '&#4119;&#4121;&#4140;&#4101;&#4140;',
    nativeNames: ['&#4119;&#4121;&#4140;&#4101;&#4140;'],
  },
  {
    code: 'ca',
    name: 'Catalan; Valencian',
    nativeName: 'Catal&#224;',
    nativeNames: ['Catal&#224;'],
  },
  {
    code: 'ch',
    name: 'Chamorro',
    nativeName: 'Chamoru',
    nativeNames: ['Chamoru'],
  },
  {
    code: 'ce',
    name: 'Chechen',
    nativeName:
      '&#1085;&#1086;&#1093;&#1095;&#1080;&#1081;&#1085; &#1084;&#1086;&#1090;&#1090;',
    nativeNames: [
      '&#1085;&#1086;&#1093;&#1095;&#1080;&#1081;&#1085; &#1084;&#1086;&#1090;&#1090;',
    ],
  },
  {
    code: 'ny',
    name: 'Chichewa; Chewa; Nyanja',
    nativeName: 'chiChe&#373;a',
    nativeNames: ['chiChe&#373;a', 'chinyanja'],
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '&#20013;&#25991; (Zh&#333;ngw&#233;n)',
    nativeNames: [
      '&#20013;&#25991; (Zh&#333;ngw&#233;n)',
      '&#27721;&#35821;',
      '&#28450;&#35486;',
    ],
  },
  {
    code: 'cv',
    name: 'Chuvash',
    nativeName:
      '&#1095;&#1233;&#1074;&#1072;&#1096; &#1095;&#1239;&#1083;&#1093;&#1080;',
    nativeNames: [
      '&#1095;&#1233;&#1074;&#1072;&#1096; &#1095;&#1239;&#1083;&#1093;&#1080;',
    ],
  },
  {
    code: 'kw',
    name: 'Cornish',
    nativeName: 'Kernewek',
    nativeNames: ['Kernewek'],
  },
  {
    code: 'co',
    name: 'Corsican',
    nativeName: 'corsu',
    nativeNames: ['corsu', 'lingua corsa'],
  },
  {
    code: 'cr',
    name: 'Cree',
    nativeName: '&#5312;&#5158;&#5123;&#5421;&#5133;&#5135;&#5155;',
    nativeNames: ['&#5312;&#5158;&#5123;&#5421;&#5133;&#5135;&#5155;'],
  },
  {
    code: 'hr',
    name: 'Croatian',
    nativeName: 'hrvatski',
    nativeNames: ['hrvatski'],
  },
  {
    code: 'cs',
    name: 'Czech',
    nativeName: '&#269;esky',
    nativeNames: ['&#269;esky', '&#269;e&#353;tina'],
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'dansk',
    nativeNames: ['dansk'],
  },
  {
    code: 'dv',
    name: 'Divehi; Dhivehi; Maldivian;',
    nativeName: '&#1931;&#1960;&#1928;&#1964;&#1920;&#1960;',
    nativeNames: ['&#1931;&#1960;&#1928;&#1964;&#1920;&#1960;'],
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    nativeNames: ['Nederlands', 'Vlaams'],
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    nativeNames: ['English'],
  },
  {
    code: 'eo',
    name: 'Esperanto',
    nativeName: 'Esperanto',
    nativeNames: ['Esperanto'],
  },
  {
    code: 'et',
    name: 'Estonian',
    nativeName: 'eesti',
    nativeNames: ['eesti', 'eesti keel'],
  },
  {
    code: 'ee',
    name: 'Ewe',
    nativeName: 'E&#651;egbe',
    nativeNames: ['E&#651;egbe'],
  },
  {
    code: 'fo',
    name: 'Faroese',
    nativeName: 'f&#248;royskt',
    nativeNames: ['f&#248;royskt'],
  },
  {
    code: 'fj',
    name: 'Fijian',
    nativeName: 'vosa Vakaviti',
    nativeNames: ['vosa Vakaviti'],
  },
  {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'suomi',
    nativeNames: ['suomi', 'suomen kieli'],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'fran&#231;ais',
    nativeNames: ['fran&#231;ais', 'langue fran&#231;aise'],
  },
  {
    code: 'ff',
    name: 'Fula; Fulah; Pulaar; Pular',
    nativeName: 'Fulfulde',
    nativeNames: ['Fulfulde', 'Pulaar', 'Pular'],
  },
  {
    code: 'gl',
    name: 'Galician',
    nativeName: 'Galego',
    nativeNames: ['Galego'],
  },
  {
    code: 'ka',
    name: 'Georgian',
    nativeName: '&#4325;&#4304;&#4320;&#4311;&#4323;&#4314;&#4312;',
    nativeNames: ['&#4325;&#4304;&#4320;&#4311;&#4323;&#4314;&#4312;'],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    nativeNames: ['Deutsch'],
  },
  {
    code: 'el',
    name: 'Greek, Modern',
    nativeName: '&#917;&#955;&#955;&#951;&#957;&#953;&#954;&#940;',
    nativeNames: ['&#917;&#955;&#955;&#951;&#957;&#953;&#954;&#940;'],
  },
  {
    code: 'gn',
    name: 'Guaraní',
    nativeName: 'Ava&#241;e&#7869;',
    nativeNames: ['Ava&#241;e&#7869;'],
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: '&#2711;&#2753;&#2716;&#2736;&#2750;&#2724;&#2752;',
    nativeNames: ['&#2711;&#2753;&#2716;&#2736;&#2750;&#2724;&#2752;'],
  },
  {
    code: 'ht',
    name: 'Haitian; Haitian Creole',
    nativeName: 'Krey&#242;l ayisyen',
    nativeNames: ['Krey&#242;l ayisyen'],
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    nativeNames: ['Hausa', '&#1607;&#1614;&#1608;&#1615;&#1587;&#1614;'],
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: '&#1506;&#1489;&#1512;&#1497;&#1514;',
    nativeNames: ['&#1506;&#1489;&#1512;&#1497;&#1514;'],
  },
  {
    code: 'iw',
    name: 'Hebrew',
    nativeName: '&#1506;&#1489;&#1512;&#1497;&#1514;',
    nativeNames: ['&#1506;&#1489;&#1512;&#1497;&#1514;'],
  },
  {
    code: 'hz',
    name: 'Herero',
    nativeName: 'Otjiherero',
    nativeNames: ['Otjiherero'],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: '&#2361;&#2367;&#2344;&#2381;&#2342;&#2368;',
    nativeNames: [
      '&#2361;&#2367;&#2344;&#2381;&#2342;&#2368;',
      '&#2361;&#2367;&#2306;&#2342;&#2368;',
    ],
  },
  {
    code: 'ho',
    name: 'Hiri Motu',
    nativeName: 'Hiri Motu',
    nativeNames: ['Hiri Motu'],
  },
  {
    code: 'hu',
    name: 'Hungarian',
    nativeName: 'Magyar',
    nativeNames: ['Magyar'],
  },
  {
    code: 'ia',
    name: 'Interlingua',
    nativeName: 'Interlingua',
    nativeNames: ['Interlingua'],
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    nativeNames: ['Bahasa Indonesia'],
  },
  {
    code: 'ie',
    name: 'Interlingue',
    nativeName: 'Interlingue',
    nativeNames: [
      'Interlingue',
      'Originally called Occidental; then Interlingue after WWII',
    ],
  },
  {
    code: 'ga',
    name: 'Irish',
    nativeName: 'Gaeilge',
    nativeNames: ['Gaeilge'],
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'As&#7909;s&#7909; Igbo',
    nativeNames: ['As&#7909;s&#7909; Igbo'],
  },
  {
    code: 'ik',
    name: 'Inupiaq',
    nativeName: 'I&#241;upiaq',
    nativeNames: ['I&#241;upiaq', 'I&#241;upiatun'],
  },
  {
    code: 'io',
    name: 'Ido',
    nativeName: 'Ido',
    nativeNames: ['Ido'],
  },
  {
    code: 'is',
    name: 'Icelandic',
    nativeName: '&#205;slenska',
    nativeNames: ['&#205;slenska'],
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    nativeNames: ['Italiano'],
  },
  {
    code: 'iu',
    name: 'Inuktitut',
    nativeName: '&#5123;&#5316;&#5251;&#5198;&#5200;&#5222;',
    nativeNames: ['&#5123;&#5316;&#5251;&#5198;&#5200;&#5222;'],
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '&#26085;&#26412;&#35486;',
    nativeNames: [
      '&#26085;&#26412;&#35486;',
      '&#12395;&#12411;&#12435;&#12372;／&#12395;&#12387;&#12413;&#12435;&#12372;',
    ],
  },
  {
    code: 'jv',
    name: 'Javanese',
    nativeName: 'basa Jawa',
    nativeNames: ['basa Jawa'],
  },
  {
    code: 'kl',
    name: 'Kalaallisut, Greenlandic',
    nativeName: 'kalaallisut',
    nativeNames: ['kalaallisut', 'kalaallit oqaasii'],
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: '&#3221;&#3240;&#3277;&#3240;&#3233;',
    nativeNames: ['&#3221;&#3240;&#3277;&#3240;&#3233;'],
  },
  {
    code: 'kr',
    name: 'Kanuri',
    nativeName: 'Kanuri',
    nativeNames: ['Kanuri'],
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: '&#2325;&#2358;&#2381;&#2350;&#2368;&#2352;&#2368;',
    nativeNames: [
      '&#2325;&#2358;&#2381;&#2350;&#2368;&#2352;&#2368;',
      '&#1603;&#1588;&#1605;&#1610;&#1585;&#1610;&#8206;',
    ],
  },
  {
    code: 'kk',
    name: 'Kazakh',
    nativeName:
      '&#1178;&#1072;&#1079;&#1072;&#1179; &#1090;&#1110;&#1083;&#1110;',
    nativeNames: [
      '&#1178;&#1072;&#1079;&#1072;&#1179; &#1090;&#1110;&#1083;&#1110;',
    ],
  },
  {
    code: 'km',
    name: 'Khmer',
    nativeName:
      '&#6039;&#6070;&#6047;&#6070;&#6017;&#6098;&#6040;&#6082;&#6042;',
    nativeNames: [
      '&#6039;&#6070;&#6047;&#6070;&#6017;&#6098;&#6040;&#6082;&#6042;',
    ],
  },
  {
    code: 'ki',
    name: 'Kikuyu, Gikuyu',
    nativeName: 'G&#297;k&#361;y&#361;',
    nativeNames: ['G&#297;k&#361;y&#361;'],
  },
  {
    code: 'rw',
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda',
    nativeNames: ['Ikinyarwanda'],
  },
  {
    code: 'ky',
    name: 'Kirghiz, Kyrgyz',
    nativeName:
      '&#1082;&#1099;&#1088;&#1075;&#1099;&#1079; &#1090;&#1080;&#1083;&#1080;',
    nativeNames: [
      '&#1082;&#1099;&#1088;&#1075;&#1099;&#1079; &#1090;&#1080;&#1083;&#1080;',
    ],
  },
  {
    code: 'kv',
    name: 'Komi',
    nativeName: '&#1082;&#1086;&#1084;&#1080; &#1082;&#1099;&#1074;',
    nativeNames: ['&#1082;&#1086;&#1084;&#1080; &#1082;&#1099;&#1074;'],
  },
  {
    code: 'kg',
    name: 'Kongo',
    nativeName: 'KiKongo',
    nativeNames: ['KiKongo'],
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어 (&#38867;&#22283;&#35486;)',
    nativeNames: [
      '한국어 (&#38867;&#22283;&#35486;)',
      '조선말 (&#26397;鮮&#35486;)',
    ],
  },
  {
    code: 'ku',
    name: 'Kurdish',
    nativeName: 'Kurd&#238;',
    nativeNames: ['Kurd&#238;', '&#1603;&#1608;&#1585;&#1583;&#1740;&#8206;'],
  },
  {
    code: 'kj',
    name: 'Kwanyama, Kuanyama',
    nativeName: 'Kuanyama',
    nativeNames: ['Kuanyama'],
  },
  {
    code: 'la',
    name: 'Latin',
    nativeName: 'latine',
    nativeNames: ['latine', 'lingua latina'],
  },
  {
    code: 'lb',
    name: 'Luxembourgish, Letzeburgesch',
    nativeName: 'L&#235;tzebuergesch',
    nativeNames: ['L&#235;tzebuergesch'],
  },
  {
    code: 'lg',
    name: 'Luganda',
    nativeName: 'Luganda',
    nativeNames: ['Luganda'],
  },
  {
    code: 'li',
    name: 'Limburgish, Limburgan, Limburger',
    nativeName: 'Limburgs',
    nativeNames: ['Limburgs'],
  },
  {
    code: 'ln',
    name: 'Lingala',
    nativeName: 'Ling&#225;la',
    nativeNames: ['Ling&#225;la'],
  },
  {
    code: 'lo',
    name: 'Lao',
    nativeName: '&#3742;&#3762;&#3754;&#3762;&#3749;&#3762;&#3751;',
    nativeNames: ['&#3742;&#3762;&#3754;&#3762;&#3749;&#3762;&#3751;'],
  },
  {
    code: 'lt',
    name: 'Lithuanian',
    nativeName: 'lietuvi&#371; kalba',
    nativeNames: ['lietuvi&#371; kalba'],
  },
  {
    code: 'lu',
    name: 'Luba-Katanga',
    nativeName: 'Luba-Katanga',
    nativeNames: ['Luba-Katanga'],
  },
  {
    code: 'lv',
    name: 'Latvian',
    nativeName: 'latvie&#353;u valoda',
    nativeNames: ['latvie&#353;u valoda'],
  },
  {
    code: 'gv',
    name: 'Manx',
    nativeName: 'Gaelg',
    nativeNames: ['Gaelg', 'Gailck'],
  },
  {
    code: 'mk',
    name: 'Macedonian',
    nativeName:
      '&#1084;&#1072;&#1082;&#1077;&#1076;&#1086;&#1085;&#1089;&#1082;&#1080; &#1112;&#1072;&#1079;&#1080;&#1082;',
    nativeNames: [
      '&#1084;&#1072;&#1082;&#1077;&#1076;&#1086;&#1085;&#1089;&#1082;&#1080; &#1112;&#1072;&#1079;&#1080;&#1082;',
    ],
  },
  {
    code: 'mg',
    name: 'Malagasy',
    nativeName: 'Malagasy fiteny',
    nativeNames: ['Malagasy fiteny'],
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'bahasa Melayu',
    nativeNames: [
      'bahasa Melayu',
      '&#1576;&#1607;&#1575;&#1587; &#1605;&#1604;&#1575;&#1610;&#1608;&#8206;',
    ],
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: '&#3374;&#3378;&#3375;&#3390;&#3379;&#3330;',
    nativeNames: ['&#3374;&#3378;&#3375;&#3390;&#3379;&#3330;'],
  },
  {
    code: 'mt',
    name: 'Maltese',
    nativeName: 'Malti',
    nativeNames: ['Malti'],
  },
  {
    code: 'mi',
    name: 'Māori',
    nativeName: 'te reo M&#257;ori',
    nativeNames: ['te reo M&#257;ori'],
  },
  {
    code: 'mr',
    name: 'Marathi (Marāṭhī)',
    nativeName: '&#2350;&#2352;&#2366;&#2336;&#2368;',
    nativeNames: ['&#2350;&#2352;&#2366;&#2336;&#2368;'],
  },
  {
    code: 'mh',
    name: 'Marshallese',
    nativeName: 'Kajin M&#807;aje&#316;',
    nativeNames: ['Kajin M&#807;aje&#316;'],
  },
  {
    code: 'mn',
    name: 'Mongolian',
    nativeName: '&#1084;&#1086;&#1085;&#1075;&#1086;&#1083;',
    nativeNames: ['&#1084;&#1086;&#1085;&#1075;&#1086;&#1083;'],
  },
  {
    code: 'na',
    name: 'Nauru',
    nativeName: 'Ekakair&#361; Naoero',
    nativeNames: ['Ekakair&#361; Naoero'],
  },
  {
    code: 'nv',
    name: 'Navajo, Navaho',
    nativeName: 'Din&#233; bizaad',
    nativeNames: ['Din&#233; bizaad', 'Din&#233;k&#700;eh&#496;&#237;'],
  },
  {
    code: 'nb',
    name: 'Norwegian Bokmål',
    nativeName: 'Norsk bokm&#229;l',
    nativeNames: ['Norsk bokm&#229;l'],
  },
  {
    code: 'nd',
    name: 'North Ndebele',
    nativeName: 'isiNdebele',
    nativeNames: ['isiNdebele'],
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: '&#2344;&#2375;&#2346;&#2366;&#2354;&#2368;',
    nativeNames: ['&#2344;&#2375;&#2346;&#2366;&#2354;&#2368;'],
  },
  {
    code: 'ng',
    name: 'Ndonga',
    nativeName: 'Owambo',
    nativeNames: ['Owambo'],
  },
  {
    code: 'nn',
    name: 'Norwegian Nynorsk',
    nativeName: 'Norsk nynorsk',
    nativeNames: ['Norsk nynorsk'],
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    nativeNames: ['Norsk'],
  },
  {
    code: 'ii',
    name: 'Nuosu',
    nativeName: 'ꆈꌠ꒿ Nuosuhxop',
    nativeNames: ['ꆈꌠ꒿ Nuosuhxop'],
  },
  {
    code: 'nr',
    name: 'South Ndebele',
    nativeName: 'isiNdebele',
    nativeNames: ['isiNdebele'],
  },
  {
    code: 'oc',
    name: 'Occitan',
    nativeName: 'Occitan',
    nativeNames: ['Occitan'],
  },
  {
    code: 'oj',
    name: 'Ojibwe, Ojibwa',
    nativeName: '&#5130;&#5314;&#5393;&#5320;&#5167;&#5287;&#5134;&#5328;',
    nativeNames: ['&#5130;&#5314;&#5393;&#5320;&#5167;&#5287;&#5134;&#5328;'],
  },
  {
    code: 'cu',
    name:
      'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
    nativeName:
      '&#1129;&#1079;&#1099;&#1082;&#1098; &#1089;&#1083;&#1086;&#1074;&#1123;&#1085;&#1100;&#1089;&#1082;&#1098;',
    nativeNames: [
      '&#1129;&#1079;&#1099;&#1082;&#1098; &#1089;&#1083;&#1086;&#1074;&#1123;&#1085;&#1100;&#1089;&#1082;&#1098;',
    ],
  },
  {
    code: 'om',
    name: 'Oromo',
    nativeName: 'Afaan Oromoo',
    nativeNames: ['Afaan Oromoo'],
  },
  {
    code: 'or',
    name: 'Oriya',
    nativeName: '&#2835;&#2849;&#2876;&#2879;&#2822;',
    nativeNames: ['&#2835;&#2849;&#2876;&#2879;&#2822;'],
  },
  {
    code: 'os',
    name: 'Ossetian, Ossetic',
    nativeName:
      '&#1080;&#1088;&#1086;&#1085; &#230;&#1074;&#1079;&#1072;&#1075;',
    nativeNames: [
      '&#1080;&#1088;&#1086;&#1085; &#230;&#1074;&#1079;&#1072;&#1075;',
    ],
  },
  {
    code: 'pa',
    name: 'Panjabi, Punjabi',
    nativeName: '&#2602;&#2672;&#2588;&#2622;&#2604;&#2624;',
    nativeNames: [
      '&#2602;&#2672;&#2588;&#2622;&#2604;&#2624;',
      '&#1662;&#1606;&#1580;&#1575;&#1576;&#1740;&#8206;',
    ],
  },
  {
    code: 'pi',
    name: 'Pāli',
    nativeName: '&#2346;&#2366;&#2356;&#2367;',
    nativeNames: ['&#2346;&#2366;&#2356;&#2367;'],
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: '&#1601;&#1575;&#1585;&#1587;&#1740;',
    nativeNames: ['&#1601;&#1575;&#1585;&#1587;&#1740;'],
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'polski',
    nativeNames: ['polski'],
  },
  {
    code: 'ps',
    name: 'Pashto, Pushto',
    nativeName: '&#1662;&#1690;&#1578;&#1608;',
    nativeNames: ['&#1662;&#1690;&#1578;&#1608;'],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Portugu&#234;s',
    nativeNames: ['Portugu&#234;s'],
  },
  {
    code: 'qu',
    name: 'Quechua',
    nativeName: 'Runa Simi',
    nativeNames: ['Runa Simi', 'Kichwa'],
  },
  {
    code: 'rm',
    name: 'Romansh',
    nativeName: 'rumantsch grischun',
    nativeNames: ['rumantsch grischun'],
  },
  {
    code: 'rn',
    name: 'Kirundi',
    nativeName: 'kiRundi',
    nativeNames: ['kiRundi'],
  },
  {
    code: 'ro',
    name: 'Romanian, Moldavian, Moldovan',
    nativeName: 'rom&#226;n&#259;',
    nativeNames: ['rom&#226;n&#259;'],
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName:
      '&#1088;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081; &#1103;&#1079;&#1099;&#1082;',
    nativeNames: [
      '&#1088;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081; &#1103;&#1079;&#1099;&#1082;',
    ],
  },
  {
    code: 'sa',
    name: 'Sanskrit (Saṁskṛta)',
    nativeName:
      '&#2360;&#2306;&#2360;&#2381;&#2325;&#2371;&#2340;&#2350;&#2381;',
    nativeNames: [
      '&#2360;&#2306;&#2360;&#2381;&#2325;&#2371;&#2340;&#2350;&#2381;',
    ],
  },
  {
    code: 'sc',
    name: 'Sardinian',
    nativeName: 'sardu',
    nativeNames: ['sardu'],
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: '&#2360;&#2367;&#2344;&#2381;&#2343;&#2368;',
    nativeNames: [
      '&#2360;&#2367;&#2344;&#2381;&#2343;&#2368;',
      '&#1587;&#1606;&#1676;&#1610;&#1548; &#1587;&#1606;&#1583;&#1726;&#1740;&#8206;',
    ],
  },
  {
    code: 'se',
    name: 'Northern Sami',
    nativeName: 'Davvis&#225;megiella',
    nativeNames: ['Davvis&#225;megiella'],
  },
  {
    code: 'sm',
    name: 'Samoan',
    nativeName: 'gagana faa Samoa',
    nativeNames: ['gagana faa Samoa'],
  },
  {
    code: 'sg',
    name: 'Sango',
    nativeName: 'y&#226;ng&#226; t&#238; s&#228;ng&#246;',
    nativeNames: ['y&#226;ng&#226; t&#238; s&#228;ng&#246;'],
  },
  {
    code: 'sr',
    name: 'Serbian',
    nativeName:
      '&#1089;&#1088;&#1087;&#1089;&#1082;&#1080; &#1112;&#1077;&#1079;&#1080;&#1082;',
    nativeNames: [
      '&#1089;&#1088;&#1087;&#1089;&#1082;&#1080; &#1112;&#1077;&#1079;&#1080;&#1082;',
    ],
  },
  {
    code: 'gd',
    name: 'Scottish Gaelic; Gaelic',
    nativeName: 'G&#224;idhlig',
    nativeNames: ['G&#224;idhlig'],
  },
  {
    code: 'sn',
    name: 'Shona',
    nativeName: 'chiShona',
    nativeNames: ['chiShona'],
  },
  {
    code: 'si',
    name: 'Sinhala, Sinhalese',
    nativeName: '&#3523;&#3538;&#3458;&#3524;&#3517;',
    nativeNames: ['&#3523;&#3538;&#3458;&#3524;&#3517;'],
  },
  {
    code: 'sk',
    name: 'Slovak',
    nativeName: 'sloven&#269;ina',
    nativeNames: ['sloven&#269;ina'],
  },
  {
    code: 'sl',
    name: 'Slovene',
    nativeName: 'sloven&#353;&#269;ina',
    nativeNames: ['sloven&#353;&#269;ina'],
  },
  {
    code: 'so',
    name: 'Somali',
    nativeName: 'Soomaaliga',
    nativeNames: ['Soomaaliga', 'af Soomaali'],
  },
  {
    code: 'st',
    name: 'Southern Sotho',
    nativeName: 'Sesotho',
    nativeNames: ['Sesotho'],
  },
  {
    code: 'es',
    name: 'Spanish; Castilian',
    nativeName: 'espa&#241;ol',
    nativeNames: ['espa&#241;ol', 'castellano'],
  },
  {
    code: 'su',
    name: 'Sundanese',
    nativeName: 'Basa Sunda',
    nativeNames: ['Basa Sunda'],
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    nativeNames: ['Kiswahili'],
  },
  {
    code: 'ss',
    name: 'Swati',
    nativeName: 'SiSwati',
    nativeNames: ['SiSwati'],
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'svenska',
    nativeNames: ['svenska'],
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: '&#2980;&#2990;&#3007;&#2996;&#3021;',
    nativeNames: ['&#2980;&#2990;&#3007;&#2996;&#3021;'],
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: '&#3108;&#3142;&#3122;&#3137;&#3095;&#3137;',
    nativeNames: ['&#3108;&#3142;&#3122;&#3137;&#3095;&#3137;'],
  },
  {
    code: 'tg',
    name: 'Tajik',
    nativeName: '&#1090;&#1086;&#1207;&#1080;&#1082;&#1251;',
    nativeNames: [
      '&#1090;&#1086;&#1207;&#1080;&#1082;&#1251;',
      'to&#287;ik&#299;',
      '&#1578;&#1575;&#1580;&#1740;&#1705;&#1740;&#8206;',
    ],
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: '&#3652;&#3607;&#3618;',
    nativeNames: ['&#3652;&#3607;&#3618;'],
  },
  {
    code: 'ti',
    name: 'Tigrinya',
    nativeName: '&#4725;&#4877;&#4653;&#4763;',
    nativeNames: ['&#4725;&#4877;&#4653;&#4763;'],
  },
  {
    code: 'bo',
    name: 'Tibetan Standard, Tibetan, Central',
    nativeName: '&#3926;&#3964;&#3921;&#3851;&#3937;&#3954;&#3906;',
    nativeNames: ['&#3926;&#3964;&#3921;&#3851;&#3937;&#3954;&#3906;'],
  },
  {
    code: 'tk',
    name: 'Turkmen',
    nativeName: 'T&#252;rkmen',
    nativeNames: [
      'T&#252;rkmen',
      '&#1058;&#1199;&#1088;&#1082;&#1084;&#1077;&#1085;',
    ],
  },
  {
    code: 'tl',
    name: 'Tagalog',
    nativeName: 'Wikang Tagalog',
    nativeNames: [
      'Wikang Tagalog',
      '&#5903;&#5906;&#5891;&#5893;&#5908; &#5894;&#5892;&#5902;&#5907;&#5892;&#5908;',
    ],
  },
  {
    code: 'tn',
    name: 'Tswana',
    nativeName: 'Setswana',
    nativeNames: ['Setswana'],
  },
  {
    code: 'to',
    name: 'Tonga (Tonga Islands)',
    nativeName: 'faka Tonga',
    nativeNames: ['faka Tonga'],
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'T&#252;rk&#231;e',
    nativeNames: ['T&#252;rk&#231;e'],
  },
  {
    code: 'ts',
    name: 'Tsonga',
    nativeName: 'Xitsonga',
    nativeNames: ['Xitsonga'],
  },
  {
    code: 'tt',
    name: 'Tatar',
    nativeName: '&#1090;&#1072;&#1090;&#1072;&#1088;&#1095;&#1072;',
    nativeNames: [
      '&#1090;&#1072;&#1090;&#1072;&#1088;&#1095;&#1072;',
      'tatar&#231;a',
      '&#1578;&#1575;&#1578;&#1575;&#1585;&#1670;&#1575;&#8206;',
    ],
  },
  {
    code: 'tw',
    name: 'Twi',
    nativeName: 'Twi',
    nativeNames: ['Twi'],
  },
  {
    code: 'ty',
    name: 'Tahitian',
    nativeName: 'Reo Tahiti',
    nativeNames: ['Reo Tahiti'],
  },
  {
    code: 'ug',
    name: 'Uighur, Uyghur',
    nativeName: 'Uy&#419;urq&#601;',
    nativeNames: [
      'Uy&#419;urq&#601;',
      '&#1574;&#1735;&#1610;&#1594;&#1735;&#1585;&#1670;&#1749;&#8206;',
    ],
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName:
      '&#1091;&#1082;&#1088;&#1072;&#1111;&#1085;&#1089;&#1100;&#1082;&#1072;',
    nativeNames: [
      '&#1091;&#1082;&#1088;&#1072;&#1111;&#1085;&#1089;&#1100;&#1082;&#1072;',
    ],
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: '&#1575;&#1585;&#1583;&#1608;',
    nativeNames: ['&#1575;&#1585;&#1583;&#1608;'],
  },
  {
    code: 'uz',
    name: 'Uzbek',
    nativeName: 'zbek',
    nativeNames: [
      'zbek',
      '&#1038;&#1079;&#1073;&#1077;&#1082;',
      '&#1571;&#1735;&#1586;&#1576;&#1744;&#1603;&#8206;',
    ],
  },
  {
    code: 've',
    name: 'Venda',
    nativeName: 'Tshiven&#7699;a',
    nativeNames: ['Tshiven&#7699;a'],
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Ti&#7871;ng Vi&#7879;t',
    nativeNames: ['Ti&#7871;ng Vi&#7879;t'],
  },
  {
    code: 'vo',
    name: 'Volapük',
    nativeName: 'Volap&#252;k',
    nativeNames: ['Volap&#252;k'],
  },
  {
    code: 'wa',
    name: 'Walloon',
    nativeName: 'Walon',
    nativeNames: ['Walon'],
  },
  {
    code: 'cy',
    name: 'Welsh',
    nativeName: 'Cymraeg',
    nativeNames: ['Cymraeg'],
  },
  {
    code: 'wo',
    name: 'Wolof',
    nativeName: 'Wollof',
    nativeNames: ['Wollof'],
  },
  {
    code: 'fy',
    name: 'Western Frisian',
    nativeName: 'Frysk',
    nativeNames: ['Frysk'],
  },
  {
    code: 'xh',
    name: 'Xhosa',
    nativeName: 'isiXhosa',
    nativeNames: ['isiXhosa'],
  },
  {
    code: 'yi',
    name: 'Yiddish',
    nativeName: '&#1497;&#1497;&#1460;&#1491;&#1497;&#1513;',
    nativeNames: ['&#1497;&#1497;&#1460;&#1491;&#1497;&#1513;'],
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yor&#249;b&#225;',
    nativeNames: ['Yor&#249;b&#225;'],
  },
  {
    code: 'za',
    name: 'Zhuang, Chuang',
    nativeName: 'Sa&#623; cue&#331;&#389;',
    nativeNames: ['Sa&#623; cue&#331;&#389;', 'Saw cuengh'],
  },
];

export default languageList;
