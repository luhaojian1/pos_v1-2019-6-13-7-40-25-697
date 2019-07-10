'use strict';

//打印账单
function printReceipt(barcodes) {
    const validInfomation = validBarcodes(barcodes);
    if(validInfomation !== "")
        return validInfomation;
    const barcodesObjectList = countGoods(barcodes);
    const report = createReceipt(barcodesObjectList);
    return report;
}

//判断商品Id是否合法
function validBarcodes(barcodes) {
    console.log(barcodes);
    let result = "";
    barcodes.forEach(barcode =>{
        if (getComputedStyle(barcode) === null)
            result += `item ${barcode} is not valid!\n`;
    });
    return result;
    
}

//创建账单
function createReceipt(barcodes) {

    const receipt = calculateItemPrice(barcodes);
    let result = `***<没钱赚商店>收据***\n`;
    result += receipt.receiptInfo;
    result += `----------------------\n`;
    result += `总计：${receipt.sum}\n节省：${receipt.sum}\n**********************`;
    return result;
}

//统计item并计算价钱
function calculateItemPrice(barcodes) {
    let receiptInfo = "";
    let sum = 0;
    let promotionMoney = 0;
    barcodes.forEach(barcode=>{
        let money = 0;
        const item = getDataSource(barcode.id);
        if (barcode.count>1&&isPromotion(barcode.id)){
            money = (barcode.count-1)*item.price;
            promotionMoney += item.price;
        }

        else money = barcode.count*item.price;
        sum += money;
        receiptInfo += `名称：${item.name}，数量：${barcode.count}${item.unit}，单价：${item.price}(元)，小计：${money}(元)\n`;
    });
    const receipt = {
        receiptInfo:receiptInfo,
        sum:sum,
        promotionMoney:promotionMoney
    };
    return receipt;

}
//获取货物信息
function getDataSource(barcodeChildElement) {
    const items = loadAllItems();
    items.forEach(item => {
        if (barcodeChildElement === item.barcode)
            return item;
        else
            return null;
    });
}

//判断是否打折
function isPromotion(barcodeId){
    const promotions = loadPromotions();
    promotions.barcodes.forEach(barcode =>{
        if (barcode === barcodeId)
            return true;
    } );
    return false;
}

//整理，计算商品数量，返回一个包含商品id和数量的对象的集合
function countGoods(barcodes) {
    console.log(barcodes);
    let i = 0;
    let goodObject = {};
    let arr = [];
    barcodes.forEach(barcode => {
        let good = barcode.split('-');
        if (good.length > 1) {
            if (goodObject[good[0]] === undefined) {
                goodObject[good[0]] = 1;
                arr.push(good[i]);
            }
        }
        if (goodObject[barcode] === undefined) {
            goodObject[barcode] = 1;
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

