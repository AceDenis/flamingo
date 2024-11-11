function calculateDateDifference() {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    const basicpayInput = parseFloat(document.getElementById('basicpay').value);
    const additionalpayInput = parseFloat(document.getElementById('additionalpay').value);

    if (!startDateInput || !endDateInput || isNaN(basicpayInput) || isNaN(additionalpayInput)) {
        alert("Please fill in all the fields correctly.");
        return;
    }

    const sumpay = basicpayInput + additionalpayInput;

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    let yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    let monthsDiff = endDate.getMonth() - startDate.getMonth();
    let daysDiff = endDate.getDate() - startDate.getDate();

    if (daysDiff < 0) {
        monthsDiff--;
        daysDiff += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }

    if (monthsDiff < 0) {
        yearsDiff--;
        monthsDiff += 12;
    }

    const totalMonths = yearsDiff * 12 + monthsDiff;

    const lumpsumPension = Math.min(totalMonths, 400) * sumpay * 0.15;

    function calculateTax(income) {
        let tax = 0;
        if (income > 600000) tax += Math.min(400000, income - 600000) * 0.1;
        if (income > 1000000) tax += Math.min(400000, income - 1000000) * 0.15;
        if (income > 1400000) tax += Math.min(400000, income - 1400000) * 0.2;
        if (income > 1800000) tax += Math.min(400000, income - 1800000) * 0.25;
        if (income > 2200000) tax += (income - 2200000) * 0.3;
        return tax;
    }

    const taxAmount = calculateTax(lumpsumPension);
    const payout = lumpsumPension - taxAmount;

    const monthlyPension = Math.min(totalMonths, 400) * sumpay * 0.001875;

    function calculateTax2(income) {
        let tax2 = 0;
        if (income > 40000) tax2 += (income - 40000) * 0.1;
        return tax2;
    }

    const taxAmount2 = calculateTax2(monthlyPension);
    const payout2 = monthlyPension - taxAmount2;

    const result = `
        Time Difference:<br>
        Years: ${yearsDiff}<br>
        Months: ${monthsDiff}<br>
        Days: ${daysDiff}<br>
        Total months: ${totalMonths}<br><br>
        Lumpsum Pension : ${lumpsumPension.toLocaleString()}<br>
        Tax on Lumpsum Pension : ${taxAmount.toLocaleString()}<br>
        Total payout Lumpsum Pension : ${payout.toLocaleString()}<br><br>
        Monthly Pension : ${monthlyPension.toLocaleString()}<br>
        Tax on Monthly Pension : ${taxAmount2.toLocaleString()}<br>
        Total payout Monthly Pension : ${payout2.toLocaleString()}<br>
    `;

    document.getElementById('result').innerHTML = result;
}

function calculatepaye() {
    const basicpay3 = parseFloat(document.getElementById('basicpay3').value);
    const house_allowance = parseFloat(document.getElementById('house_allowance').value);

    if (isNaN(basicpay3) || isNaN(house_allowance)) {
        alert("Please fill in all the fields correctly.");
        return;
    }

    const income3 = basicpay3 + house_allowance;

    function calculatePayeTax(income) {
        let tax = 0;
        if (income > 24000) tax += Math.min(8333, income - 24000) * 0.25;
        if (income > 32333) tax += Math.min(467667, income - 32333) * 0.3;
        if (income > 500000) tax += Math.min(300000, income - 500000) * 0.32;
        if (income > 800000) tax += Math.min(500000, income - 800000) * 0.35;
        if (income > 1000000) tax += (income - 1000000) * 0.37;
        return tax;
    }

    const payeTax = calculatePayeTax(income3);
    const netIncome = income3 - payeTax;

    document.getElementById('totalpaye').innerHTML = `
        Total Income: ${income3.toLocaleString()}<br>
        PAYE Tax: ${payeTax.toLocaleString()}<br>
        Net Income after PAYE: ${netIncome.toLocaleString()}
    `;
}

function loancalculator() {
    const principle = parseFloat(document.getElementById('principle').value);
    const payment_period = parseInt(document.getElementById('payment_period').value);
    const interest = parseFloat(document.getElementById('interest').value);

    if (isNaN(principle) || isNaN(payment_period) || isNaN(interest)) {
        alert("Please fill in all the fields correctly.");
        return;
    }

    const interestRate = interest / 100;
    const monthlyInterestRate = interestRate / 12;
    const numPayments = payment_period;

    const monthlyPayment = (principle * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numPayments));
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principle;

    document.getElementById('loanspecs').innerHTML = `
        Monthly Payment: ${monthlyPayment.toFixed(2)}<br>
        Total Payment Over Period: ${totalPayment.toFixed(2)}<br>
        Total Interest Paid: ${totalInterest.toFixed(2)}
    `;

    generateAmortizationTable(principle, monthlyPayment, monthlyInterestRate, numPayments);

    const button2 = document.getElementById('toggleTableBtn');
    button2.style.display = "block";
}

function generateAmortizationTable(principle, monthlyPayment, monthlyInterestRate, numPayments) {
    let remainingBalance = principle;
    let tableContent = `<table class="amortization-table">
        <thead>
            <tr><th>Payment #</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
        </thead>
        <tbody>`;

    for (let paymentNumber = 1; paymentNumber <= numPayments; paymentNumber++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        tableContent += `
            <tr>
                <td>${paymentNumber}</td>
                <td>${monthlyPayment.toFixed(2)}</td>
                <td>${principalPayment.toFixed(2)}</td>
                <td>${interestPayment.toFixed(2)}</td>
                <td>${remainingBalance.toFixed(2)}</td>
            </tr>
        `;
    }

    tableContent += "</tbody></table>";
    document.getElementById('amortizationTable').innerHTML = tableContent;
}

function toggleAmortizationTable() {
    const table = document.getElementById('amortizationTable');
    const button = document.getElementById('toggleTableBtn');

    if (table.style.display === "none") {
        table.style.display = "block";
        button.textContent = "Hide Amortization Table";
    } else {
        table.style.display = "none";
        button.textContent = "Show Amortization Table";
    }
}


function checkLoanLimit() {
    const grossPay = parseFloat(document.getElementById('gross_pay').value);
    const totalDeductions = parseFloat(document.getElementById('total_deductions').value);
    const loanAmount = parseFloat(document.getElementById('amount').value);
    const interestRate = parseFloat(document.getElementById('interest4').value);

    if (isNaN(grossPay) || isNaN(totalDeductions) || isNaN(loanAmount) || isNaN(interestRate)) {
        alert("Please fill in all the fields correctly.");
        return;
    }

    const netIncome = grossPay - totalDeductions;
    const monthlyInterestRate = interestRate / 100 / 12;
    const loanLimit = netIncome / monthlyInterestRate;

    const isLoanApproved = loanAmount <= loanLimit;

    document.getElementById('loanlimit').innerHTML = `
        Net Income: ${netIncome.toLocaleString()}<br>
        Loan Limit: ${loanLimit.toFixed(2)}<br>
        ${isLoanApproved ? 'Loan Approved' : 'Loan Denied'}
    `;
}
