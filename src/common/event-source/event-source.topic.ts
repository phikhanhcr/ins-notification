export enum TopicName {
    POST = 'Post',
}

export enum EventName {
    POST__LIKED = 'liked',
    POST__UN_LIKED = 'un_liked',
}

export interface IEventTopic {
    event: string;
    topic: TopicName;
}
