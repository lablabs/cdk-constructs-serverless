import * as events from 'aws-cdk-lib/aws-events'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import type { SqsEventSourceProps } from 'aws-cdk-lib/aws-lambda-event-sources'
import type { QueueProps } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'
import { EventBus, Queue } from 'sst/constructs'
import type { EventBusRuleProps } from 'sst/constructs/EventBus'

export interface EventHandlerProps {
    eventBusArn?: string
    eventBus?: EventBus
    queueProps?: QueueProps
    pattern?: {
        source?: string[]
        detail?: {
            [key: string]: unknown
        }
        detailType?: string[]
    }
    handler: IFunction
    eventSource?: SqsEventSourceProps
}

export class EventHandler extends Construct {
    constructor(scope: Construct, id: string, props: EventHandlerProps) {
        super(scope, id)
        const eventBusSqsQueue = new Queue(scope, `${id}-queue`, {
            cdk: {
                queue: props.queueProps
            },
            consumer: {
                cdk: {
                    function: props.handler,
                    eventSource: props.eventSource
                }
            }
        })
        this.sqs = eventBusSqsQueue

        if (props.pattern) {
            const entries: Map<string, EventBusRuleProps> = new Map([
                [
                    `${id}-rule`,
                    {
                        pattern: props.pattern,
                        targets: {
                            sqs: eventBusSqsQueue
                        }
                    }
                ]
            ])

            const rules = Object.fromEntries(entries)
            if (props.eventBus) {
                props.eventBus.addRules(scope, rules)
                return
            }
            if (props.eventBusArn) {
                let eventBus = new EventBus(scope, `${id}-event-bus`, {
                    cdk: {
                        eventBus: events.EventBus.fromEventBusArn(
                            scope,
                            `${id}-imported-event-bus`,
                            props.eventBusArn
                        )
                    }
                })
                eventBus.addRules(scope, rules)
            }
        }
    }

    sqs: Queue
}
