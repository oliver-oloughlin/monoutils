import {
  ServerSentEvent,
  ServerSentEventStreamTarget,
} from "https://deno.land/std@0.206.0/http/unstable_server_sent_event.ts"

export class ServerSentEventStreamTargetPool<T> {
  private targets: Map<string, ServerSentEventStreamTarget>

  constructor() {
    this.targets = new Map()
  }

  add(target: ServerSentEventStreamTarget) {
    const id = crypto.randomUUID()

    target.addEventListener("close", () => {
      this.targets.delete(id)
    })

    this.targets.set(id, target)
    return id
  }

  remove(id: string) {
    this.targets.delete(id)
  }

  dispatchMessage(data: T) {
    this.targets.forEach((target) => target.dispatchMessage(data))
  }

  dispatchEvent(event: ServerSentEvent) {
    this.targets.forEach((target) => target.dispatchEvent(event))
  }

  dispatchComment(comment: string) {
    this.targets.forEach((target) => target.dispatchComment(comment))
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions,
  ) {
    this.targets.forEach((target) =>
      target.addEventListener(type, listener, options)
    )
  }
}
