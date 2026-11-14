export const siteConfig = {
  name: "СТЗ Автоплатформи",
  shortName: "СТЗ",
  description:
    "Отдаване под наем на автомобилни платформи — равна 5 м, малка 4.5 м и дълга 6 м. Документи за България и чужбина.",
  phone: "[ТЕЛЕФОН]", // TODO: реален телефон
  phoneHref: "tel:+359000000000", // TODO: реален tel: линк
  email: "avoex.contact@gmail.com", // TODO: потвърди фирмен имейл
  address: "[АДРЕС, ГРАД]", // TODO: адрес за вземане
  workingHours: "[РАБОТНО ВРЕМЕ]", // TODO: работно време
  mapsEmbedUrl: "", // TODO: Google Maps embed URL
  mapsLink: "", // TODO: Google Maps линк
  paymentNote: "Плащане само в брой при вземане на платформата.",
  priceDisclaimer:
    "Посочените цени са ориентировъчни и могат да варират според индивидуалния случай, наемния период и товара. За конкретна оферта се свържете с нас по телефона.",
  loyaltyNote:
    "За постоянни клиенти големи отстъпки и по-гъвкави условия.",
  longTermNote: "Цени за по-дълги периоди по договаряне.",
  included: [
    "Ръчна лебедка",
    "Резервна гума",
    "Обезопасителни колани",
    "Документи за транспорт в България и чужбина",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
