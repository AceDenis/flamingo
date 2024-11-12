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
    const houseLevy = income3 * 0.015;
    const netIncome = income3 - payeTax - houseLevy;

    document.getElementById('totalpaye').innerHTML = `
        Total Income: ${income3.toLocaleString()}<br>
        PAYE Tax: ${payeTax.toLocaleString()}<br>
        House Levy: ${houseLevy.toLocaleString()}<br>
        Net Income after Taxes: ${netIncome.toLocaleString()}
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
    const percentPaidInterest = (totalInterest/principle)*100;

    document.getElementById('loanspecs').innerHTML = `
        Principl: ${principle.toLocaleString()}<br>
        Monthly Payment: ${Math.ceil(monthlyPayment).toLocaleString()}<br>
        Total Payment Over ${numPayments} Months Period: ${Math.ceil(totalPayment).toLocaleString()}<br>
        Total Interest Paid: ${Math.ceil(totalInterest).toLocaleString()}<br>
        Percent Interest Paid: ${percentPaidInterest.toFixed(2)}%
    `;

    generateAmortizationTable(principle, monthlyPayment, monthlyInterestRate, numPayments);

    const button2 = document.getElementById('toggleTableBtn');
    button2.style.display = "block";
}

function generateAmortizationTable(principle, monthlyPayment, monthlyInterestRate, numPayments) {
    let remainingBalance = principle;
    let tableContent = `
        <div class="amortization-table-container">
            <table class="amortization-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Beginning Balance</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Remaining Balance</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (let month = 1; month <= numPayments; month++) {
        const beginningBalance = remainingBalance;
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        tableContent += `
            <tr>
                <td>${month}</td>
                 <td>$${beginningBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>$${interestPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>$${principalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>$${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;

        if (month % 12 === 0) {
            tableContent += `
             <tr>
                <td colspan="5" style="text-align: center; font-weight: bold;">Year #${month / 12} End</td>
             </tr>
            `;
            
        }
    }

    tableContent += "</tbody></table></div>";
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

    const remainder = grossPay - totalDeductions;
    const percent_remainder = (remainder / grossPay) * 100;
    const interestRate4 = interestRate / 100/12;
    const netIncome_per = (remainder/grossPay)*100;

    let s = null;
    let e = null;
    let loan_margin = 0;

    if (percent_remainder <= 34) {
        document.getElementById('loanlimit').innerHTML += "Your loan limits is 0.<br>";
    } else {
        loan_margin = (grossPay * 0.66) - totalDeductions;
        console.log("Loan Margin:", loan_margin);

        for (let payment_period4 = 6; payment_period4 < 72; payment_period4 += 6) {
            let emi = Math.ceil((loanAmount * (interestRate4 * Math.pow(1 + interestRate4, payment_period4))) / (Math.pow(1 + interestRate4, payment_period4) - 1));

            if (emi < loan_margin) {
                s = payment_period4;
                e = emi;
                break; // Exit loop when a valid repayment period is found
            }
        }
        
    }


    document.getElementById('loanlimit').innerHTML = `
        Gross Pay: ${grossPay.toLocaleString()}<br>
        Total Deductions: ${totalDeductions.toLocaleString()}<br>
        Net Income: ${remainder.toLocaleString()}<br>
        Net Income Percent: ${netIncome_per.toFixed(2)}%<br>
        Available funds: ${Math.floor(loan_margin).toLocaleString()}<br>
    `;

    let remainder5 = grossPay-totalDeductions-e;

        if (s !== null && e !== null) {
            document.getElementById('loanlimit').innerHTML += "Shortest Repayment Period: " + s + " months<br>" +
                    "Monthly Payment: " + Math.ceil(e).toLocaleString() + "<br>" +
                    "Remander: " + Math.floor(remainder5).toLocaleString() + " <br>";
        } else {
            document.getElementById('loanlimit').innerHTML += "Unable to find a suitable repayment period within limits.<br>";
        }

    

}
