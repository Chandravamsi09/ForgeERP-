export interface FIFOLayer {
  layerId: string;
  batchNumber: string;
  receivedDate: Date;
  initialQuantity: number;
  remainingQuantity: number;
  unitCostBaseCurrency: number;
  originalCurrencyCode: string;
  exchangeRateAtReceipt: number; // to Base Currency
}

export interface FIFODepletionResult {
  productId: string;
  requestedQuantity: number;
  fulfilledQuantity: number;
  totalCostOfGoodsSold: number;
  averageDepletionUnitCost: number;
  consumedLayers: {
    layerId: string;
    batchNumber: string;
    quantityConsumed: number;
    unitCost: number;
    subtotalCost: number;
  }[];
  remainingLayers: FIFOLayer[];
}

export interface MovingAverageState {
  totalQuantity: number;
  movingAverageUnitCost: number;
  totalValuation: number;
}

export class InventoryValuationEngine {
  /**
   * FIFO Depletion Engine: Consumes inventory strictly from the oldest unexhausted layers
   */
  static depleteFIFO(
    layers: FIFOLayer[],
    quantityToDeplete: number,
    productId: string = 'prod'
  ): FIFODepletionResult {
    let remainingToConsume = Math.max(0, quantityToDeplete);
    let totalCOGS = 0;
    const consumedLayers: FIFODepletionResult['consumedLayers'] = [];

    // Clone layers to avoid mutating input directly
    const updatedLayers: FIFOLayer[] = layers.map((l) => ({ ...l }));

    for (const layer of updatedLayers) {
      if (remainingToConsume <= 0) break;
      if (layer.remainingQuantity <= 0) continue;

      const takeQty = Math.min(layer.remainingQuantity, remainingToConsume);
      const layerCost = takeQty * layer.unitCostBaseCurrency;

      layer.remainingQuantity = Number((layer.remainingQuantity - takeQty).toFixed(4));
      remainingToConsume = Number((remainingToConsume - takeQty).toFixed(4));
      totalCOGS += layerCost;

      consumedLayers.push({
        layerId: layer.layerId,
        batchNumber: layer.batchNumber,
        quantityConsumed: takeQty,
        unitCost: layer.unitCostBaseCurrency,
        subtotalCost: Number(layerCost.toFixed(2)),
      });
    }

    const fulfilledQuantity = quantityToDeplete - remainingToConsume;
    const avgCost = fulfilledQuantity > 0 ? totalCOGS / fulfilledQuantity : 0;

    return {
      productId,
      requestedQuantity: quantityToDeplete,
      fulfilledQuantity: Number(fulfilledQuantity.toFixed(4)),
      totalCostOfGoodsSold: Number(totalCOGS.toFixed(2)),
      averageDepletionUnitCost: Number(avgCost.toFixed(4)),
      consumedLayers,
      remainingLayers: updatedLayers.filter((l) => l.remainingQuantity > 0),
    };
  }

  /**
   * Moving Weighted Average Cost (MWAC) Recalculation on Inventory Receipt
   */
  static calculateMovingWeightedAverage(
    currentState: MovingAverageState,
    receiptQuantity: number,
    receiptUnitCostInForeignCurrency: number,
    exchangeRateToBase: number = 1.0
  ): MovingAverageState {
    const receiptCostBase = receiptUnitCostInForeignCurrency * exchangeRateToBase;
    const newTotalQuantity = currentState.totalQuantity + receiptQuantity;

    if (newTotalQuantity <= 0) {
      return { totalQuantity: 0, movingAverageUnitCost: 0, totalValuation: 0 };
    }

    const currentTotalValuation = currentState.totalQuantity * currentState.movingAverageUnitCost;
    const incomingValuation = receiptQuantity * receiptCostBase;
    const newTotalValuation = currentTotalValuation + incomingValuation;
    const newMovingAverage = newTotalValuation / newTotalQuantity;

    return {
      totalQuantity: Number(newTotalQuantity.toFixed(4)),
      movingAverageUnitCost: Number(newMovingAverage.toFixed(4)),
      totalValuation: Number(newTotalValuation.toFixed(2)),
    };
  }

  /**
   * Purchase Price Variance (PPV) Calculation
   * PPV = (Actual Price Base - Standard Cost) * Quantity Received
   */
  static calculatePPV(
    standardCost: number,
    actualUnitPriceForeign: number,
    exchangeRateToBase: number,
    quantityReceived: number
  ): { ppvAmount: number; isFavorable: boolean } {
    const actualPriceBase = actualUnitPriceForeign * exchangeRateToBase;
    const variancePerUnit = actualPriceBase - standardCost;
    const ppvAmount = Number((variancePerUnit * quantityReceived).toFixed(2));

    return {
      ppvAmount,
      isFavorable: ppvAmount < 0, // Negative variance means we purchased cheaper than standard = Favorable
    };
  }

  /**
   * Foreign Exchange (FX) Realized Gain/Loss on Settlement
   */
  static calculateRealizedFXGainLoss(
    foreignAmount: number,
    bookingExchangeRate: number,
    settlementExchangeRate: number
  ): { fxGainLossAmount: number; isGain: boolean } {
    const bookingBase = foreignAmount * bookingExchangeRate;
    const settlementBase = foreignAmount * settlementExchangeRate;
    const diff = Number((settlementBase - bookingBase).toFixed(2));

    return {
      fxGainLossAmount: Math.abs(diff),
      isGain: diff > 0,
    };
  }
}
