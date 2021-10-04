/*
 * SPDX-License-Identifier: Apache-2.0
 */

export class AcrisDataModel {
    flightData: object;
    flightKey: string;
    // Which IATA entity updated the data.
    updaterId: string;
    txId: string;
    docType: string;
}

export class AcrisDataHistory {
    flightData: object;
    timestamp: object;
    key: string;
}