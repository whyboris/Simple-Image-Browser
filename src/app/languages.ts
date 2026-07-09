// Languages
import Arabic from '../../i18n/ar.json';
import Bengali from '../../i18n/bn.json';
import Chinese from '../../i18n/zh.json';
import Czech from '../../i18n/cs.json';
import Dutch from '../../i18n/nl.json';
import English from '../../i18n/en.json';
import French from '../../i18n/fr.json';
import German from '../../i18n/de.json';
import Hindi from '../../i18n/hi.json';
import Italian from '../../i18n/it.json';
import Japanese from '../../i18n/ja.json';
import Korean from '../../i18n/ko.json';
import Malay from '../../i18n/ms.json';
import Polish from '../../i18n/pl.json';
import Portuguese from '../../i18n/pt.json';
import Russian from '../../i18n/ru.json';
import Spanish from '../../i18n/es.json';
import Turkish from '../../i18n/tr.json';
import Ukrainian from '../../i18n/uk.json';
import Vietnamese from '../../i18n/vi.json';

export const LanguageLookup: Record<SupportedLanguage, any> = {
  'ar': Arabic,
  'bn': Bengali,
  'cs': Czech,
  'de': German,
  'en': English,
  'es': Spanish,
  'fr': French,
  'hi': Hindi,
  'it': Italian,
  'ja': Japanese,
  'ko': Korean,
  'ms': Malay,
  'nl': Dutch,
  'pl': Polish,
  'pt': Portuguese,
  'ru': Russian,
  'tr': Turkish,
  'uk': Ukrainian,
  'vi': Vietnamese,
  'zh': Chinese,
};

export type SupportedLanguage =
 'ar' |
 'bn' |
 'cs' |
 'de' |
 'en' |
 'es' |
 'fr' |
 'hi' |
 'it' |
 'ja' |
 'ko' |
 'ms' |
 'nl' |
 'pl' |
 'pt' |
 'ru' |
 'tr' |
 'uk' |
 'vi' |
 'zh';
