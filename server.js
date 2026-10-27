'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ADMIN CALCULATION DATA. This remains on the server and is never sent to the browser.
const calculatorConfig = Object.freeze({
  minimum: 20000,
  maximum: 250000,
  documentFee: 495,
  tiers: [
    { upperLimit: 50000, rate: 0.0995, brokerMultiplier: 1.05, dofBase: 0 },
    { upperLimit: 100000, rate: 0.0945, brokerMultiplier: 1.04, dofBase: 0 },
    { upperLimit: 200000, rate: 0.0945, brokerMultiplier: 1.035, dofBase: 0 },
    { upperLimit: 300000, rate: 0.0945, brokerMultiplier: 1.0325, dofBase: 0 }
  ],
  terms: [36, 48, 60]
});

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function selectTier(invoicePrice) {
  return calculatorConfig.tiers.find(tier => invoicePrice < tier.upperLimit) || null;
}

// Excel-equivalent PMT using payment timing type 1 (payment at start of period).
function pmt(rate, periods, presentValue, futureValue = 0, type = 1) {
  if (rate === 0) return -(presentValue + futureValue) / periods;
  const factor = Math.pow(1 + rate, periods);
  return -(rate * (futureValue + factor * presentValue)) /
    ((1 + rate * type) * (factor - 1));
}

app.post('/api/calculate', (req, res) => {
  const invoicePrice = Number(req.body.invoicePrice);
  if (!Number.isFinite(invoicePrice)) {
    return res.status(400).json({ error: 'Enter a valid equipment price.' });
  }
  if (invoicePrice < calculatorConfig.minimum || invoicePrice > calculatorConfig.maximum) {
    return res.status(400).json({
      error: `Equipment price must be between $${calculatorConfig.minimum.toLocaleString('en-AU')} and $${calculatorConfig.maximum.toLocaleString('en-AU')}.`
    });
  }

  const tier = selectTier(invoicePrice);
  if (!tier) return res.status(400).json({ error: 'No calculation tier is available for this amount.' });

  const loanAmount = invoicePrice * tier.brokerMultiplier + calculatorConfig.documentFee;
  const monthlyRate = tier.rate / 12;
  const payments = calculatorConfig.terms.map(term => ({
    term,
    payment: Math.ceil(pmt(monthlyRate, term, -loanAmount, 0, 1))
  }));

  res.json({ invoicePrice, payments });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Solar Finance calculator running on port ${PORT}`));
