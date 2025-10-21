export class MessageContentVO {
    private constructor(private readonly content: string) {}

    static create(content: string) {
        return new MessageContentVO(content);
    }

    get value() {
        return this.content;
    }
}
