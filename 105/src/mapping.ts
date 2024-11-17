import { BadgeMinted } from "../generated/YourContract/YourContract";
import { Badge } from "../generated/schema";

export function handleBadgeMinted(event: BadgeMinted): void {
  // Create a new Badge entity using the event parameters
  let badge = new Badge(event.params.tokenId.toHex());
  badge.owner = event.params.owner;
  badge.project = event.params.project;
  badge.timestamp = event.block.timestamp;

  // Save the entity to the store
  badge.save();
}