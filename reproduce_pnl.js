
const calculatePL = (type, entry, exit, qty, market) => {
    const entryPrice = parseFloat(entry) || 0;
    const exitPrice = parseFloat(exit) || 0;
    const quantity = parseFloat(qty) || 0;

    if (entryPrice === 0) return 0;

    let pnl = 0;
    if (exitPrice > 0) {
        // For Forex, 1 Lot = 100,000 units
        const multiplier = market === 'Forex' ? 100000 : 1;
        const effectiveQty = quantity * multiplier;
        pnl = (type === 'Buy' ? exitPrice - entryPrice : entryPrice - exitPrice) * effectiveQty;
    }

    return parseFloat(pnl.toFixed(2));
};

const testCases = [
    // Forex Buy Profit
    { type: 'Buy', entry: 156.707, exit: 157.958, qty: 0.05, market: 'Forex', expected: 6255 },
    // Forex Buy Loss
    { type: 'Buy', entry: 157.958, exit: 156.707, qty: 0.05, market: 'Forex', expected: -6255 },
    // Forex Sell Profit
    { type: 'Sell', entry: 157.958, exit: 156.707, qty: 0.05, market: 'Forex', expected: 6255 },
    // Forex Sell Loss
    { type: 'Sell', entry: 156.707, exit: 157.958, qty: 0.05, market: 'Forex', expected: -6255 },

    // Indian Buy Profit
    { type: 'Buy', entry: 100, exit: 110, qty: 10, market: 'Indian', expected: 100 },
    // Indian Buy Loss
    { type: 'Buy', entry: 110, exit: 100, qty: 10, market: 'Indian', expected: -100 },

    // Small P&L check
    { type: 'Buy', entry: 1.0000, exit: 1.0001, qty: 0.01, market: 'Forex', expected: 0.10 }, // 1 pip * 1000 units = 0.1
    { type: 'Buy', entry: 1.0001, exit: 1.0000, qty: 0.01, market: 'Forex', expected: -0.10 },
];

testCases.forEach((test, index) => {
    const result = calculatePL(test.type, test.entry, test.exit, test.qty, test.market);
    const passed = Math.abs(result - test.expected) < 0.01;
    console.log(`Test ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
    if (!passed) {
        console.log(`  Expected: ${test.expected}, Got: ${result}`);
        console.log(`  Params: ${JSON.stringify(test)}`);
    }
});
