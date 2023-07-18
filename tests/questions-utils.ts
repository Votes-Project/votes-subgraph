import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Locked,
  QuestionEdited,
  QuestionSubmitted,
  Unlocked
} from "../generated/Questions/Questions"

export function createLockedEvent(tokenId: BigInt): Locked {
  let lockedEvent = changetype<Locked>(newMockEvent())

  lockedEvent.parameters = new Array()

  lockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return lockedEvent
}

export function createQuestionEditedEvent(
  tokenId: BigInt,
  question: Bytes
): QuestionEdited {
  let questionEditedEvent = changetype<QuestionEdited>(newMockEvent())

  questionEditedEvent.parameters = new Array()

  questionEditedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  questionEditedEvent.parameters.push(
    new ethereum.EventParam("question", ethereum.Value.fromBytes(question))
  )

  return questionEditedEvent
}

export function createQuestionSubmittedEvent(
  tokenId: BigInt,
  question: Bytes
): QuestionSubmitted {
  let questionSubmittedEvent = changetype<QuestionSubmitted>(newMockEvent())

  questionSubmittedEvent.parameters = new Array()

  questionSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  questionSubmittedEvent.parameters.push(
    new ethereum.EventParam("question", ethereum.Value.fromBytes(question))
  )

  return questionSubmittedEvent
}

export function createUnlockedEvent(tokenId: BigInt): Unlocked {
  let unlockedEvent = changetype<Unlocked>(newMockEvent())

  unlockedEvent.parameters = new Array()

  unlockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return unlockedEvent
}
