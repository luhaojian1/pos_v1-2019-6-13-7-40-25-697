'use strict';

//打印账单
function printReceipt(barcodes) {
    const barcodesObjectList = countGoods(barcodes);
    const validInfomation = validBarcodes(barcodesObjectList);
    if (validInfomation !== "")
        return validInfomation;
    const report = createReceipt(barcodesObjectList);
    return report;
}

//判断商品Id是否合法
function validBarcodes(barcodes) {
    let result = "";
    barcodes.forEach(barcode => {
        if (getDataSource(barcode.id) === null)
            result += `item ${barcode.id} is not valid!\n`;
    });
    return result;
}

//创建账单
function createReceipt(barcodes) {
    const receipt = calculateItemPrice(barcodes);
    let result = `***<没钱赚商店>收据***\n`;
    result += receipt.receiptInfo;
    result += `----------------------\n`;
    result += `总计：${receipt.sum.toFixed(2)}(元)\n节省：${receipt.promotionMoney.toFixed(2)}(元)\n**********************`;
    console.log(result);

}

//统计item并计算价钱
function calculateItemPrice(barcodes) {
    let receiptInfo = "";
    let sum = 0;
    let promotionMoney = 0;
    barcodes.forEach(barcode => {
        let money = 0;
        const item = getDataSource(barcode.id);
        if (barcode.count > 1 && isPromotion(barcode.id)) {
            money = (barcode.count - 1) * item.price;
            promotionMoney += item.price;
        } else money = barcode.count * item.price;
        sum += money;
        receiptInfo += `名称：${item.name}，数量：${barcode.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${money.toFixed(2)}(元)\n`;
    });
    const receipt = {
        receiptInfo: receiptInfo,
        sum: sum,
        promotionMoney: promotionMoney
    };
    return receipt;

}

//获取货物信息
function getDataSource(barcodeChildElement) {
    const items = loadAllItems();
    for (let i = 0; i < items.length; i++) {
        if (barcodeChildElement === items[i].barcode)
            return items[i];
    }
    return null;
}

//判断是否打折
function isPromotion(barcodeId) {
    const promotions = loadPromotions();
    const barcodes = promotions[0].barcodes;
    for (let i = 0; i < barcodes.length; i++) {
        if (barcodes[i] === barcodeId)
            return true;
    }
    return false;
}

//整理，计算商品数量，返回一个包含商品id和数量的对象的集合
function countGoods(barcodes) {
    let goodObject = {};
    let arr = [];
    barcodes.forEach(barcode => {
        if (barcode.indexOf('-') !== -1) {
            let good = barcode.split('-');
            if (goodObject[good[0]] === undefined) {
                goodObject[good[0]] = good[1];
                arr.push(good[0]);
            } else goodObject[good[0]] += parseInt(good[1]);
        } else if (goodObject[barcode] === undefined) {
            goodObject[barcode] = 1;
            arr.push(barcode);
        } else
            goodObject[barcode]++;
    });
    let result = [];
    arr.forEach(item => {
        result.push({
            id: item,
            count: goodObject[item]
        });
    });
    return result;
}

