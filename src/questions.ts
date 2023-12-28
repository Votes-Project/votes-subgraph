import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  QuestionEdited as QuestionEditedEvent,
  QuestionSubmitted as QuestionSubmittedEvent,
  QuestionApproved as QuestionApprovedEvent,
  QuestionUsed as QuestionUsedEvent,
  QuestionFlagged as QuestionFlaggedEvent,
  Questions as QuestionsContractInstance,
  RoleGranted as RoleGrantedEvent,
} from "../generated/Questions/Questions";
import {
  QuestionApproved,
  QuestionEdited,
  QuestionSubmitted,
  QuestionUsed,
  QuestionFlagged,
  QuestionsContract,
  Question,
  Vote
} from "../generated/schema";

class QuestionState {
  static Submitted: string = "Submitted";
  static Approved: string = "Approved";
  static Used: string = "Used";
  static Flagged: string = "Flagged";
}


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

export function handleQuestionApproved(event: QuestionApprovedEvent): void {
  let entity = new QuestionApproved(
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
    log.error("[handleQuestionApproved] Question not found with ID #{}. Hash: {}", [
      questionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  question.state = QuestionState.Approved;
  question.save();
}

export function handleQuestionUsed(event: QuestionUsedEvent): void {
  let entity = new QuestionUsed(
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
    log.error("[handleQuestionUsed] Question not found with ID #{}. Hash: {}", [
      questionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  question.state = QuestionState.Used;
  question.day = event.block.timestamp;
  question.save();

  let contract = getOrCreateContract(event.address);
  contract.lastUsedQuestion = questionId;
  contract.save();
}

export function handleQuestionFlagged(event: QuestionFlaggedEvent): void {
  let entity = new QuestionFlagged(
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
    log.error("[handleQuestionFlagged] Question not found with ID #{}. Hash: {}", [
      questionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  question.state = QuestionState.Flagged;
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
  question.state = QuestionState.Submitted;
  question.modifiedTimestamp = event.block.timestamp;
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

  let id = Bytes.fromI32(event.params.tokenId.toI32());

  let question = new Question(id);

  question.contract = event.address
  question.vote = id;
  question.question = event.params.question;
  question.asker = event.transaction.from;
  question.modifiedTimestamp = event.block.timestamp;
  question.state = QuestionState.Submitted;

  question.save();

  let vote = Vote.load(id);
  if (vote == null) {
    log.error("[handleQuestionSubmittec] Vote #{} not found. Hash: {}", [
      id.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }
  vote.question = id;
  vote.save();
}
