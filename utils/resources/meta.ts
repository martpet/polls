import { shortZonedDateFormat } from "🛠️/intl.ts";
import { Resource, ResourceFieldFormatter } from "🛠️/resources/types.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

export interface ResourceMeta<T = Resource> {
  slugAttr: keyof T;
  titleAttr: keyof T;
  confirmDeleteAttr: keyof T;
  breadcrumbAttr?: keyof T;
  urlSegment?: string;
  attrLabels: Record<keyof T, string>;
  formatters: ResourceFieldFormatter<T>;
  texts: {
    name: string;
    namePlural: string;
    all: string;
    add: string;
    new: string;
    edit: string;
    delete: string;
    deleteConfirmInputLabel: string;
  };
}

const attrLabels = {
  id: "ID",
  slug: "URL име",
  title: "Име",
  order: "Ред",
  group: "Група",
  poll: "Анкета",
  expiresAt: "Изтича",
  points: "Точки",
  headline: "Заглавие",
  createdAt: "Създаден",
  choiceTitleLabel: 'Лейбъл "Отговор"',
  choicePrefixLabel: 'Лейбъл "Префикс"',
};

const formatters: ResourceFieldFormatter<Resource> = {
  expiresAt: (v) => v && shortZonedDateFormat().format(v),
  createdAt: (v) => v && shortZonedDateFormat().format(v),
};

const polls: ResourceMeta<Poll> = {
  attrLabels: {
    ...attrLabels,
    createdAt: "Създадена",
    disabled: "Спряна",
    onHome: "На начална страница",
    ipCityFilter: "IP филтриране по град",
  },
  formatters,
  slugAttr: "slug",
  titleAttr: "title",
  confirmDeleteAttr: "slug",
  texts: {
    name: "Aнкета",
    namePlural: "Aнкети",
    all: "Всички анкети",
    new: "Нова анкета",
    add: "Добави анкета",
    edit: "Редактирай анкета",
    delete: "Изтрий анкета",
    deleteConfirmInputLabel: "Кое е краткото име на анкетата?",
  },
};

const groups: ResourceMeta<Group> = {
  attrLabels: {
    ...attrLabels,
    createdAt: "Създадена",
    disabled: "Спряна",
    otherItemsLabel: 'Лейбъл "Всички"',
  },
  formatters,
  slugAttr: "slug",
  titleAttr: "title",
  confirmDeleteAttr: "slug",
  texts: {
    name: "Група",
    namePlural: "Групи",
    all: "Всички групи",
    add: "Добави група",
    new: "Нова група",
    edit: "Редактирай група",
    delete: "Изтрий групa",
    deleteConfirmInputLabel: "Кое е краткото име на групата?",
  },
};

const choices: ResourceMeta<Choice> = {
  attrLabels: {
    ...attrLabels,
    prefix: "№",
    addition: "Допълнение",
    createdAt: "Създадена",
  },
  formatters,
  slugAttr: "id",
  titleAttr: "title",
  confirmDeleteAttr: "id",
  texts: {
    name: "Отговор",
    namePlural: "Отговори",
    all: "Всички отговори",
    add: "Добави отговор",
    new: "Нов отговор",
    edit: "Редактирай отговор",
    delete: "Изтрий отговор",
    deleteConfirmInputLabel: "ID на отговора:",
  },
};

export const resourcesMeta = {
  polls,
  groups,
  choices,
};
