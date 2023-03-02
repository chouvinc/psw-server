/**
 * An immutable receipt class to describe the contents we care about in a receipt (mostly line items, but also who paid for what).
 * 
 * Consumers shouldn't try to persist state of the current session in receipts, since modifying history is scary!
 * Better to derive remaining unpaid amounts, etc. from a collection of receipts via maps & reductions.
 * 
 * @constructor is private
 * 
 * Instantiate new receipts using the factory method 
 * ```
 * Receipt.new(
 *      name: String,
        lineItems: String[],
        paidBy: String,
        totalAmount: Number  
 * );
 * ```
 */
export default class Receipt {

    private readonly name: String;
    private readonly lineItems: String[];
    private readonly paidBy: String;
    private readonly totalAmount: Number;
    
    private constructor(
        name: String,
        lineItems: String[],
        paidBy: String,
        // TODO: receipts by nature are small in amount -- but we shouldn't really be using native JS number types for math or numbers due to limited precision
        totalAmount: Number 
    ) {
        this.name = name;
        this.lineItems = lineItems;
        this.paidBy = paidBy;
        this.totalAmount = totalAmount;
    }

    static new(
        name: String,
        lineItems: String[],
        paidBy: String,
        totalAmount: Number 
    ): Receipt {
        return new Receipt(name, lineItems, paidBy, totalAmount);
    }
}