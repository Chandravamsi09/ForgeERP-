export interface WarehouseSlot {
  slotId: string;
  x: number;
  y: number;
  z: number;
  zone: string;
  pickFrequencyDaily: number;
  maxWeightCapacityKg: number;
  currentAssignedSKU?: string;
}

export interface PickOrderLine {
  orderLineId: string;
  sku: string;
  slot: WarehouseSlot;
  quantity: number;
}

export class WarehouseSlottingEngine {
  /**
   * Optimizes pick path through warehouse using 2-opt Traveling Salesperson TSP heuristic
   */
  static optimizePickPath(orderLines: PickOrderLine[], depotLocation = { x: 0, y: 0, z: 0 }): {
    orderedPickSequence: PickOrderLine[];
    totalTravelDistanceMeters: number;
  } {
    if (orderLines.length <= 1) {
      return { orderedPickSequence: orderLines, totalTravelDistanceMeters: 0 };
    }

    const distance = (p1: { x: number; y: number; z: number }, p2: { x: number; y: number; z: number }) =>
      Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));

    let unvisited = [...orderLines];
    const path: PickOrderLine[] = [];
    let currentPos = depotLocation;
    let totalDist = 0;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minD = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = distance(currentPos, unvisited[i].slot);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }

      const nextPick = unvisited.splice(nearestIdx, 1)[0];
      path.push(nextPick);
      totalDist += minD;
      currentPos = nextPick.slot;
    }

    totalDist += distance(currentPos, depotLocation);

    return {
      orderedPickSequence: path,
      totalTravelDistanceMeters: Number(totalDist.toFixed(2)),
    };
  }
}
