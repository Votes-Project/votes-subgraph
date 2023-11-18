import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  Locked as LockedEvent,
  QuestionEdited as QuestionEditedEvent,
  QuestionSubmitted as QuestionSubmittedEvent,
  Unlocked as UnlockedEvent,
  Questions as QuestionsContractInstance,
  RoleGranted as RoleGrantedEvent,
} from "../generated/Questions/Questions";
import {
  Locked,
  QuestionEdited,
  QuestionSubmitted,
  Unlocked,
  QuestionsContract,
  Question
} from "../generated/schema";


function getOrCreateContract(address: Address): QuestionsContract {
  let contract = QuestionsContract.load(address);

  if (!contract) {
    let instance = QuestionsContractInstance.bind(address);
    contract = new QuestionsContract(address);

    contract.votesAddress = instance.votesAddress();
    contract.reviewerRole = instance.REVIEWER_ROLE();

    contract.save();
  }

  return contract;
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  if (event.params.sender != event.params.account) return

  getOrCreateContract(event.address)

}


export function handleLocked(event: LockedEvent): void {
  let entity = new Locked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let questionId = Bytes.fromI32(event.params.tokenId.toI32());

  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let question = Question.load(questionId);

  if (question == null) {
    log.error("[handleLocked] Question not found with ID #{}. Hash: {}", [
      questionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }
  question.isLocked = true;
  question.save();
}

export function handleQuestionEdited(event: QuestionEditedEvent): void {
  let entity = new QuestionEdited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.tokenId = event.params.tokenId;
  entity.question = event.params.question;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let questionId = Bytes.fromI32(event.params.tokenId.toI32());

  let question = Question.load(questionId);

  if (question == null) {
    log.error("[handleQuestionEdited] Question not found with ID #{}. Hash: {}", [
      questionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }
  question.question = event.params.question;
  question.save();

}

export function handleQuestionSubmitted(event: QuestionSubmittedEvent): void {
  let entity = new QuestionSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;
  entity.question = event.params.question;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let questionId = Bytes.fromI32(event.params.tokenId.toI32());

  let question = new Question(questionId);

  question.contract = event.address
  question.tokenId = event.params.tokenId;
  question.question = event.params.question;
  question.isLocked = false;

  question.save();
}

export function handleUnlocked(event: UnlockedEvent): void {
  let entity = new Unlocked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();


  let questionId = Bytes.fromI32(event.params.tokenId.toI32());

  let question = Question.load(questionId);

  if (question == null) {
    log.error("[handleQuestionUnlocked] Question not found with ID #{}. Hash: {}", [
      questionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  question.isLocked = false;
  question.save();
}
