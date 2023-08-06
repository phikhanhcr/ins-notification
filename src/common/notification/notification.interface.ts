import Handlebars, { TemplateDelegate } from 'handlebars';

import { IEventData } from '@common/event-source/EventData';
import { Language } from '@config/multilanguage';
import { UserNotification } from './entity/UserNotification';

export enum NotificationType {
    // Other
    OTHER = 0,
    POST_LIKED = 1,
    POST_COMMENTED = 2,
}

export interface ITemplateLanguage {
    [Language.VI]: TemplateDelegate;
    [Language.EN]: TemplateDelegate;
}

export interface INotificationTemplate {
    icon: string;
    title: ITemplateLanguage;
    content: ITemplateLanguage;
}

export const NotificationTemplates = new Map<NotificationType, INotificationTemplate>();

NotificationTemplates.set(NotificationType.POST_LIKED, {
    icon: '',
    title: {
        vi: Handlebars.compile('Instagram'),
        en: Handlebars.compile('Instagram'),
    },
    content: {
        vi: Handlebars.compile(`
        {{#if ctx.name}}
            {{{ subs.0.name }}} va {{{ ctx.name }}} nguoi khac thich bai viet cua ban
        {{~else}}
            {{{ subs.0.name }}} vua like bai viet cua ban
        {{/if}}

        `),
        en: Handlebars.compile(`
        {{#if ctx.name}}
            {{{ subs.0.name }}} and {{{ ctx.name }}} people like your post
        {{~else}}
            {{{ subs.0.name }}} like your post
        {{/if}}

        `),
    },
});

export interface INotificationTransformerConstructor {
    getType(): NotificationType;
    make(data: IEventData): INotificationTransformer;
}

export interface INotificationTransformer {
    getKey(): Buffer;
    transform(lang: Language, notification: UserNotification): UserNotification;
}
