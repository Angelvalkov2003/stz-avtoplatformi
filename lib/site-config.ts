export const siteConfig = {
  name: "СТЗ Автоплатформи",
  shortName: "СТЗ",
  description:
    "Отдаване под наем на автомобилни платформи — равна 5 м, малка 4.5 м и дълга 6 м. Документи за България и чужбина.",
  phone: "+359 877 751 188",
  phoneHref: "tel:+359877751188",
  email: "avoex.contact@gmail.com",
  address: "Район Стара Загора",
  workingHours: "Всеки ден — постоянно",
  viber: "viber://chat?number=%2B359877751188",
  facebookUrl: "https://www.facebook.com/share/1KJYJAAseD/?mibextid=wwXIfr",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=%D0%A1%D1%82%D0%B0%D1%80%D0%B0%20%D0%97%D0%B0%D0%B3%D0%BE%D1%80%D0%B0&hl=bg&z=12&output=embed",
  mapsLink: "https://share.google/M4BYmEXlphPFPJOSq",
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
