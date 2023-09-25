import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  AuctionBid as AuctionBidEvent,
  AuctionCreated as AuctionCreatedEvent,
  AuctionSettled as AuctionSettledEvent,
  DurationUpdated as DurationUpdatedEvent,
  MinBidIncrementPercentageUpdated as MinBidIncrementPercentageUpdatedEvent,
  Paused as PausedEvent,
  RaffleAddressUpdated as RaffleAddressUpdatedEvent,
  ReserveAddressUpdated as ReserveAddressUpdatedEvent,
  ReservePriceUpdated as ReservePriceUpdatedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  TimeBufferUpdated as TimeBufferUpdatedEvent,
  TreasuryAddressUpdated as TreasuryAddressUpdatedEvent,
  Unpaused as UnpausedEvent,
} from "../generated/Auction/Auction";
import {
  AuctionBid,
  AuctionCreated,
  AuctionSettled,
  Auction,
  DurationUpdated,
  MinBidIncrementPercentageUpdated,
  Paused,
  RaffleAddressUpdated,
  ReserveAddressUpdated,
  ReservePriceUpdated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TimeBufferUpdated,
  TreasuryAddressUpdated,
  Unpaused,
  Vote,
} from "../generated/schema";

export function handleAuctionBid(event: AuctionBidEvent): void {
  let entity = new AuctionBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let auctionId = Bytes.fromI32(event.params.tokenId.toI32());

  entity.tokenId = event.params.tokenId;
  entity.bidder = event.params.bidder;
  entity.amount = event.params.amount;
  entity.extended = event.params.extended;
  entity.endTime = event.params.endTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.auction = auctionId;

  entity.save();

  let auction = Auction.load(auctionId);

  if (auction == null) {
    log.error("[handleAuctionBid] Auction not found for Vote #{}. Hash: {}", [
      auctionId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.bidder = event.params.bidder;
  auction.amount = event.params.amount;
  auction.extended = event.params.extended;
  auction.endTime = event.params.endTime;
  auction.save();
}

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
  let entity = new AuctionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;
  entity.startTime = event.params.startTime;
  entity.endTime = event.params.endTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  let id = Bytes.fromI32(event.params.tokenId.toI32());

  let vote = Vote.load(id);
  if (vote == null) {
    log.error("[handleAuctionCreated] Vote #{} not found. Hash: {}", [
      id.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  let auction = new Auction(id);

  auction.vote = id;
  auction.amount = BigInt.fromI32(0);
  auction.startTime = event.params.startTime;
  auction.endTime = event.params.endTime;
  auction.extended = false;
  auction.settled = false;
  auction.save();
}

export function handleAuctionSettled(event: AuctionSettledEvent): void {
  let entity = new AuctionSettled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.tokenId = event.params.tokenId;
  entity.winner = event.params.winner;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let auctionId = Bytes.fromI32(event.params.tokenId.toI32());
  let auction = Auction.load(auctionId);

  if (auction == null) {
    log.error(
      "[handleAuctionCreated] Auction not found for Vote #{}. Hash: {}",
      [auctionId.toString(), event.transaction.hash.toHex()]
    );
    return;
  }

  auction.amount = event.params.amount;
  auction.settled = true;
  auction.save();
}

export function handleDurationUpdated(event: DurationUpdatedEvent): void {
  let entity = new DurationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.duration = event.params.duration;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMinBidIncrementPercentageUpdated(
  event: MinBidIncrementPercentageUpdatedEvent
): void {
  let entity = new MinBidIncrementPercentageUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.minBidIncrementPercentage = event.params.minBidIncrementPercentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRaffleAddressUpdated(
  event: RaffleAddressUpdatedEvent
): void {
  let entity = new RaffleAddressUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.raffleAddress = event.params.raffleAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleReserveAddressUpdated(
  event: ReserveAddressUpdatedEvent
): void {
  let entity = new ReserveAddressUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.reserveAddress = event.params.reserveAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleReservePriceUpdated(
  event: ReservePriceUpdatedEvent
): void {
  let entity = new ReservePriceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.reservePrice = event.params.reservePrice;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.newAdminRole = event.params.newAdminRole;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTimeBufferUpdated(event: TimeBufferUpdatedEvent): void {
  let entity = new TimeBufferUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.timeBuffer = event.params.timeBuffer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTreasuryAddressUpdated(
  event: TreasuryAddressUpdatedEvent
): void {
  let entity = new TreasuryAddressUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.treasuryAddress = event.params.treasuryAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
