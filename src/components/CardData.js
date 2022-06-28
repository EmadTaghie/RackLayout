const SC = require("./pics/SC.png");
const OS5 = require("./pics/OS5.png");
const IFC = require("./pics/IFC.png");
const HKP = require("./pics/HKP.png");
const OA = require("./pics/OA.png");
const OCM = require("./pics/OCM.png");
const SM2 = require("./pics/SM2.png");
const TP2X = require("./pics/TP2X.png");
const TPAX = require("./pics/TPAX.png");
const MP2X = require("./pics/MP2X.png");
const MP2XP = require("./pics/MP2X+.png");
const MD48OI = require("./pics/MD48OI.png");
const MD48E = require("./pics/MD48E.png");
const MD48O = require("./pics/MD48O.png");
const MP1H = require("./pics/MP1H.png");
const DCM = require("./pics/DCM.png");
const PWR = require("./pics/PWR.png");
const FIM = require("./pics/FIM.png");
const Empty = require("./pics/Empty.png");

const _ = require("lodash");

const connections = {
    connected: "connected",
    pending: "pending",
    notConnected: "notConnected"
}

class CardData {
    cardStorageArr = [
        {id: "0", textLabel: "SC", bgColor: "#F2DCDB", size: 1, power: 10, url: SC},
        {id: "1", textLabel: "OS5", bgColor: "#E6B8B7", size: 1, power: 5, url: OS5},
        {id: "2", textLabel: "IFC", bgColor: "#0070C0", size: 1, power: 5, url: IFC},
        {id: "3", textLabel: "HKP", bgColor: "#7030A0", size: 1, power: 3, url: HKP},
        {id: "4", textLabel: "OA-BAP2", bgColor: "#92D050", size: 1, power: 15, url: OA},
        {id: "5", textLabel: "OA-PAP2", bgColor: "#FFFF00", size: 1, power: 15, url: OA},
        {id: "6", textLabel: "OAR-RAM2", bgColor: "#DA9694", size: 1, power: 50, url: OA},
        {id: "7", textLabel: "OCM", bgColor: "#00B0F0", size: 1, power: 5, url: OCM},
        {id: "8", textLabel: "WS4", bgColor: "#E4DFEC", size: 1, power: 15, url: OA},
        {id: "9", textLabel: "SM2", bgColor: "#FFFFFF", size: 1, power: 5, url: SM2},
        {id: "10", textLabel: "TP2X", bgColor: "#00B050", size: 1, power: 20, url: TP2X, ports:[
                {id: 1, width: 9 / 24, height: 1 / 10, pos: {width: 100/320, height: 26/64}, Tx: "Cli1,Tx", Rx: "Cli1,Rx", connected: connections.notConnected},
                {id: 2, width: 9 / 24, height: 1 / 10, pos: {width: 100/320, height: 26/64 + 6/64}, Tx: "Cli2,Tx", Rx: "Cli2,Rx", connected: connections.notConnected},
                {id: 3, width: 9 / 24, height: 1 / 10, pos: {width: 100/320, height: 199/256}, Tx: "Line1,Tx", Rx: "Line1,Rx", connected: connections.notConnected},
                {id: 4, width: 9 / 24, height: 1 / 10, pos: {width: 100/320, height: 199/256 + 12/128}, Tx: "Line2,Tx", Rx: "Line2,Rx", connected: connections.notConnected}
                ]
        },
        {id: "11", textLabel: "TP2X-A", bgColor: "#D9D9D9", size: 2, power: 60, url: TPAX, ports:[
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256}, Tx: "Cli1,Tx", Rx: "Cli1,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256}, Tx: "Cli2,Tx", Rx: "Cli2,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 5/64}, Tx: "Cli3,Tx", Rx: "Cli3,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 5/64}, Tx: "Cli4,Tx", Rx: "Cli4,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 2*5/64}, Tx: "Cli5,Tx", Rx: "Cli5,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 2*5/64}, Tx: "Cli6,Tx", Rx: "Cli6,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 3*5/64}, Tx: "Cli7,Tx", Rx: "Cli7,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 3*5/64}, Tx: "Cli8,Tx", Rx: "Cli8,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 4*5/64}, Tx: "Cli9,Tx", Rx: "Cli9,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 4*5/64}, Tx: "Cli10,Tx", Rx: "Cli10,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 5*5/64}, Tx: "Line1,Tx", Rx: "Line1,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 5*5/64}, Tx: "Line2,Tx", Rx: "Line2,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 6*5/64}, Tx: "Line3,Tx", Rx: "Line3,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 6*5/64}, Tx: "Line4,Tx", Rx: "Line4,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 7*5/64}, Tx: "Line5,Tx", Rx: "Line5,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 7*5/64}, Tx: "Line6,Tx", Rx: "Line6,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 8*5/64}, Tx: "Line7,Tx", Rx: "Line7,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 8*5/64}, Tx: "Line8,Tx", Rx: "Line8,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 28/320, height: 44/256 + 9*5/64}, Tx: "Line9,Tx", Rx: "Line9,Rx", connected: connections.notConnected},
                {id: 1, width: 14 / 98, height: 1 / 13, pos: {width: 73/320, height: 44/256 + 9*5/64}, Tx: "Line10,Tx", Rx: "Line10,Rx", connected: connections.notConnected}
            ]
        },
        {id: "12", textLabel: "MP2X", bgColor: "#FCD5B4", size: 2, power: 35, url: MP2X, ports:[
                {id: 1, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 5/64}, Tx: "Tx1", Rx: "Rx1", connected: connections.notConnected},
                {id: 2, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 5/64}, Tx: "Tx2", Rx: "Rx2", connected: connections.notConnected},
                {id: 3, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 2*5/64}, Tx: "Tx3", Rx: "Rx3", connected: connections.notConnected},
                {id: 4, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 2*5/64}, Tx: "Tx4", Rx: "Rx4", connected: connections.notConnected},
                {id: 5, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 3*5/64}, Tx: "Tx5", Rx: "Rx5", connected: connections.notConnected},
                {id: 6, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 3*5/64}, Tx: "Tx6", Rx: "Rx6", connected: connections.notConnected},
                {id: 7, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 4*5/64}, Tx: "Tx7", Rx: "Rx7", connected: connections.notConnected},
                {id: 8, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 4*5/64}, Tx: "Tx8", Rx: "Rx8", connected: connections.notConnected},
                {id: 9, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 5*5/64}, Tx: "Tx9", Rx: "Rx9", connected: connections.notConnected},
                {id: 10, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 5*5/64}, Tx: "Tx11", Rx: "Rx11", connected: connections.notConnected},
                {id: 11, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 6*5/64}, Tx: "Tx12", Rx: "Rx12", connected: connections.notConnected},
                {id: 12, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 6*5/64}, Tx: "Tx13", Rx: "Rx13", connected: connections.notConnected},
                {id: 13, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 7*5/64}, Tx: "Tx14", Rx: "Rx14", connected: connections.notConnected},
                {id: 14, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 7*5/64}, Tx: "Tx15", Rx: "Rx15", connected: connections.notConnected},
                {id: 15, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 8*5/64}, Tx: "Tx16", Rx: "Rx16", connected: connections.notConnected},
                {id: 16, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 8*5/64}, Tx: "Tx17", Rx: "Rx17", connected: connections.notConnected},
                {id: 17, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 11/64}, Tx: "Lin1,Tx", Rx: "Line1,Rx", connected: connections.notConnected},
                {id: 18, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 11/64}, Tx: "line2,Tx", Rx: "Line2,Rx", connected: connections.notConnected}
        ]},
        {id: "13", textLabel: "MP2X Plus", bgColor: "#00B0F0", size: 2, power: 75, url: MP2XP, ports: [
                {id: 1, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64}, Tx: "Tx1", Rx: "Rx1", connected: connections.notConnected},
                {id: 2, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64}, Tx: "Tx2", Rx: "Rx2", connected: connections.notConnected},
                {id: 3, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 5/64}, Tx: "Tx3", Rx: "Rx3", connected: connections.notConnected},
                {id: 4, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 5/64}, Tx: "Tx4", Rx: "Rx4", connected: connections.notConnected},
                {id: 5, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 2*5/64}, Tx: "Tx5", Rx: "Rx5", connected: connections.notConnected},
                {id: 6, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 2*5/64}, Tx: "Tx6", Rx: "Rx6", connected: connections.notConnected},
                {id: 7, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 3*5/64}, Tx: "Tx7", Rx: "Rx7", connected: connections.notConnected},
                {id: 8, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 3*5/64}, Tx: "Tx8", Rx: "Rx8", connected: connections.notConnected},
                {id: 9, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 4*5/64}, Tx: "Tx9", Rx: "Rx9", connected: connections.notConnected},
                {id: 10, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 4*5/64}, Tx: "Tx10", Rx: "Rx10", connected: connections.notConnected},
                {id: 11, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 5*5/64}, Tx: "Tx11", Rx: "Rx11", connected: connections.notConnected},
                {id: 12, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 5*5/64}, Tx: "Tx12", Rx: "Rx12", connected: connections.notConnected},
                {id: 13, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 6*5/64}, Tx: "Tx13", Rx: "Rx13", connected: connections.notConnected},
                {id: 14, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 6*5/64}, Tx: "Tx14", Rx: "Rx14", connected: connections.notConnected},
                {id: 15, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 7*5/64}, Tx: "Tx15", Rx: "Rx15", connected: connections.notConnected},
                {id: 16, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 7*5/64}, Tx: "Tx16", Rx: "Rx16", connected: connections.notConnected},
                {id: 17, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 8*5/64}, Tx: "Tx17", Rx: "Rx17", connected: connections.notConnected},
                {id: 18, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 8*5/64}, Tx: "Tx18", Rx: "Rx18", connected: connections.notConnected}
            ]
        },
        {id: "14", textLabel: "MP2X+", bgColor: "#00B0F0", size: 2, power: 75, url: MP2XP, ports: [
                    {id: 1, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64}, Tx: "Tx1", Rx: "Rx1", connected: connections.notConnected},
                    {id: 2, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64}, Tx: "Tx2", Rx: "Rx2", connected: connections.notConnected},
                    {id: 3, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 5/64}, Tx: "Tx3", Rx: "Rx3", connected: connections.notConnected},
                    {id: 4, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 5/64}, Tx: "Tx4", Rx: "Rx4", connected: connections.notConnected},
                    {id: 5, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 2*5/64}, Tx: "Tx5", Rx: "Rx5", connected: connections.notConnected},
                    {id: 6, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 2*5/64}, Tx: "Tx6", Rx: "Rx6", connected: connections.notConnected},
                    {id: 7, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 3*5/64}, Tx: "Tx7", Rx: "Rx7", connected: connections.notConnected},
                    {id: 8, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 3*5/64}, Tx: "Tx8", Rx: "Rx8", connected: connections.notConnected},
                    {id: 9, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 4*5/64}, Tx: "Tx9", Rx: "Rx9", connected: connections.notConnected},
                    {id: 10, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 4*5/64}, Tx: "Tx10", Rx: "Rx10", connected: connections.notConnected},
                    {id: 11, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 5*5/64}, Tx: "Tx11", Rx: "Rx11", connected: connections.notConnected},
                    {id: 12, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 5*5/64}, Tx: "Tx12", Rx: "Rx12", connected: connections.notConnected},
                    {id: 13, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 6*5/64}, Tx: "Tx13", Rx: "Rx13", connected: connections.notConnected},
                    {id: 14, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 6*5/64}, Tx: "Tx14", Rx: "Rx14", connected: connections.notConnected},
                    {id: 15, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 7*5/64}, Tx: "Tx15", Rx: "Rx15", connected: connections.notConnected},
                    {id: 16, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 7*5/64}, Tx: "Tx16", Rx: "Rx16", connected: connections.notConnected},
                    {id: 17, width: 1 / 7, height: 1 / 13, pos: {width: 30/320, height: 12/64 + 8*5/64}, Tx: "Tx17", Rx: "Rx17", connected: connections.notConnected},
                    {id: 18, width: 1 / 7, height: 1 / 13, pos: {width: 73/320, height: 12/64 + 8*5/64}, Tx: "Tx18", Rx: "Rx18", connected: connections.notConnected}
                ]
            },
        {id: "15", textLabel: "MD48", bgColor: "#FFFFCC", size: 2, power: 0, url: MD48OI},//ask about power consumption
        {id: "16", textLabel: "MD48E", bgColor: "#FFFFCC", size: 2, power: 0, url: MD48E},
        {id: "17", textLabel: "MD48O", bgColor: "#FFFFCC", size: 2, power: 0, url: MD48O},
        {id: "18", textLabel: "MP1H", bgColor: "#C00000", size: 2, power: 60, url: MP1H, ports:[
            {id: 1, width: 1 / 7, height: 1 / 13, pos: {width: 31/320, height: 23/128}, Tx: "Tx1", Rx: "Rx1", connected: connections.notConnected},
            {id: 2, width: 1 / 7, height: 1 / 13, pos: {width: 86/320, height: 23/128}, Tx: "Tx2", Rx: "Rx2", connected: connections.notConnected},
            {id: 3, width: 1 / 7, height: 1 / 13, pos: {width: 31/320, height: 23/128 + 47/512}, Tx: "Tx3", Rx: "Rx3", connected: connections.notConnected},
            {id: 4, width: 1 / 7, height: 1 / 13, pos: {width: 86/320, height: 23/128 + 47/512}, Tx: "Tx4", Rx: "Rx4", connected: connections.notConnected},
            {id: 5, width: 1 / 7, height: 1 / 13, pos: {width: 31/320, height: 23/128 + 2*47/512}, Tx: "Tx5", Rx: "Rx5", connected: connections.notConnected},
            {id: 6, width: 1 / 7, height: 1 / 13, pos: {width: 86/320, height: 23/128 + 2*47/512}, Tx: "Tx6", Rx: "Rx6", connected: connections.notConnected},
            {id: 7, width: 1 / 7, height: 1 / 13, pos: {width: 31/320, height: 23/128 + 3*47/512}, Tx: "Tx7", Rx: "Rx7", connected: connections.notConnected},
            {id: 8, width: 1 / 7, height: 1 / 13, pos: {width: 86/320, height: 23/128 + 3*47/512}, Tx: "Tx8", Rx: "Rx8", connected: connections.notConnected},
            {id: 9, width: 1 / 7, height: 1 / 13, pos: {width: 31/320, height: 23/128 + 4*47/512}, Tx: "Tx9", Rx: "Rx9", connected: connections.notConnected},
            {id: 10, width: 1 / 7, height: 1 / 13, pos: {width: 86/320, height: 23/128 + 4*47/512}, Tx: "Tx10", Rx: "Rx10", connected: connections.notConnected},
            {id: 11, width: 1 / 4, height: 37 / 156, pos: {width: 23/320, height: 96/128}, Tx: "Line,Tx", Rx: "Line,Rx", connected: connections.notConnected}
        ]},
        {id: "19", textLabel: "DCM", bgColor: "#D9D9D9", size: 1, power: 0, url: DCM},
        {id: "20", textLabel: "PWR", bgColor: "#A9D08E", size: 1/2, power: 2, url: PWR},
        {id: "21", textLabel: "OA", bgColor: "#92D050", size: 1, power: 15, url: OA},
        {id: "22", textLabel: "FIM", bgColor: "#FFC000", size: 1, power: 0, url: FIM},
        {id: "23", textLabel: "WS9", bgColor: "#FFF2CC", size: 2, power: 15, url: OA},
        {id: "24", textLabel: "", bgColor: "#A6A6A6", size: 1, power: 0, url: Empty},
        {id: "25", textLabel: "TPAX", bgColor: "#D9D9D9", size: 2, power: 60, url: TPAX},
        {id: "26", textLabel: "OAR", bgColor: "#DA9694", size: 1, power: 50, url: OA}
    ];

    constructor() {
    }

    getCardArr() {
        return _.cloneDeep(this.cardStorageArr);
    }

    getEnums() {
        return connections;
    }
}
export default CardData;