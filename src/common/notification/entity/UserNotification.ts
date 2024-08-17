import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import moment from 'moment-timezone';
import { keyBy, values } from 'lodash';
import { Language } from '@config/multilanguage';
import { INotificationTemplate, NotificationType } from '../notification.interface';

const HIGHLIGHT_TEMPLATE = /<b>([^<>]*)<\/b>/gi;
const HIGHLIGHT_TEMPLATE_LENGTH = 7;

const CHAR_LT = 17;
const CHAR_GT = 18;

function renderMessage(message: string): INotificationContent {
    let highlights = [];
    const text = message.replace(HIGHLIGHT_TEMPLATE, (match, p1, offset) => {
        highlights.push({ offset, length: p1.length });
        return p1;
    });
    highlights = highlights.map((highlight, index) => {
        highlight.offset -= HIGHLIGHT_TEMPLATE_LENGTH * index;
        return highlight;
    });

    return { text: unescape(text), highlights };
}

function escape(value) {
    if (typeof value === 'string') {
        return value.replace('<', String.fromCharCode(CHAR_LT)).replace('>', String.fromCharCode(CHAR_GT));
    }
    return value;
}

function unescape(value) {
    if (typeof value === 'string') {
        return value.replace(String.fromCharCode(CHAR_LT), '<').replace(String.fromCharCode(CHAR_GT), '>');
    }
    return value;
}

export enum NotificationStatus {
    UNSEEN_AND_UNREAD = 0,
    SEEN_BUT_UNREAD = 1,
    SEEN_AND_READ = 2,
}

interface IHighlight {
    offset: number;
    length: number;
}

interface INotificationContent {
    text: string;
    highlights: IHighlight[];
}

export interface INotificationData {
    subs: string[];
    di_obj?: string;
    in_obj?: string;
    pr_obj?: string;
    ctx?: string;
}

export interface INotificationMeta {
    _id: string;
    name?: string;
    image?: string;
    tz: Date;
}

export interface IUserNotificationResponse {
    id: number;
    auth_id: number;
    type: NotificationType;
    image: string;
    icon: string;
    url: string;
    title: string;
    content: INotificationContent;
    received_at: number;
    read_at?: number;
    status: NotificationStatus;
}

interface ICompiledData {
    subs: INotificationMeta[];
    di_obj?: INotificationMeta;
    in_obj?: INotificationMeta;
    pr_obj?: INotificationMeta;
    ctx?: INotificationMeta;
}

@Entity()
export class UserNotification {
    @PrimaryColumn()
    id: number;

    @Column('integer', { name: 'auth_id' })
    authId: number;

    @Column('character varying', { name: 'image' })
    image: string;

    @Column('character varying', { name: 'icon' })
    icon: string;

    @Column('character varying', { name: 'url' })
    url: string;

    @Column('character varying', { name: 'title' })
    title: string;

    @Column('jsonb', { name: 'content' })
    content: INotificationContent;

    @Column('jsonb', { name: 'data' })
    data: INotificationData;

    @Column('jsonb', { name: 'meta' })
    meta: INotificationMeta[];

    @Column('date', { name: 'compiled_at' })
    compiledAt: Date;

    @Column('date', { name: 'received_at' })
    receivedAt: Date;

    @Column('date', { name: 'last_received_at' })
    lastReceivedAt: Date;

    @Column('date', { name: 'read_at' })
    readAt: Date;

    @Column({ type: 'enum', name: 'type', enum: NotificationType })
    type: NotificationType;

    @Column({ type: 'enum', name: 'status', enum: NotificationStatus })
    status: NotificationStatus;

    @Column('bytea', { name: 'key', nullable: false, unique: true })
    key: Buffer;

    @CreateDateColumn({
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
        type: 'timestamp with time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
        type: 'timestamp with time zone',
    })
    updatedAt: Date;

    transform(): IUserNotificationResponse {
        const transformed: IUserNotificationResponse = {
            id: this.id,
            auth_id: this.authId,
            type: this.type,
            image: this.image,
            icon: this.icon,
            url: this.url,
            title: this.title,
            content: this.content,
            received_at: moment(this.receivedAt).unix(),
            read_at: this.readAt ? moment(this.readAt).unix() : null,
            status: this.status,
        };

        return transformed;
    }

    getCompiledData(): ICompiledData {
        const map = keyBy(this.meta, '_id');
        return {
            subs: this.data?.subs ? this.data.subs.map((sub) => map[sub]) : null,
            di_obj: this.data?.di_obj ? map[this.data.di_obj] : null,
            in_obj: this.data?.in_obj ? map[this.data.in_obj] : null,
            pr_obj: this.data?.pr_obj ? map[this.data.pr_obj] : null,
            ctx: this.data?.ctx ? map[this.data.ctx] : null,
        };
    }

    test() {
        console.log('vo day ');
    }

    compile(lang: Language, template: INotificationTemplate): void {
        const compiledData = this.getCompiledData();
        this.title = unescape(template.title[lang](compiledData, { allowProtoPropertiesByDefault: true }));
        this.content = renderMessage(template.content[lang](compiledData, { allowProtoPropertiesByDefault: true }));
        this.compiledAt = new Date();
    }
}
