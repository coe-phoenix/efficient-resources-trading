const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(INQUIRIES_FILE)) fs.writeFileSync(INQUIRIES_FILE, '[]');

const pages = {
  '/':           { template: 'home',       title: 'Unvulcanized Rubber Recycling Malaysia' },
  '/about':      { template: 'about',      title: 'About Us' },
  '/services':   { template: 'services',   title: 'Tire Plant Services' },
  '/process':    { template: 'process',    title: 'Our Facility and Process' },
  '/products':   { template: 'products',   title: 'Products' },
  '/compliance': { template: 'compliance', title: 'EU Regulatory Compliance' },
  '/contact':    { template: 'contact',    title: 'Contact Us' },
};

Object.entries(pages).forEach(([route, { template, title }]) => {
  app.get(route, (req, res) => {
    res.render(template, { pageTitle: title, currentPath: route });
  });
});

app.post('/api/inquiry', (req, res) => {
  try {
    const { name, email, company, interest, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email.' });
    let inquiries = [];
    try { inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8')); } catch(e) {}
    const inquiry = { id: Date.now(), name: name.trim(), email: email.trim(), company: (company||'').trim()||'N/A', interest: interest||'N/A', message: message.trim(), submitted_at: new Date().toISOString(), ip: req.ip };
    inquiries.push(inquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    console.log('[INQUIRY] ' + inquiry.name + ' at ' + inquiry.submitted_at);
    res.json({ success: true, message: 'Thank you, ' + inquiry.name + '. Your inquiry has been received. We will respond within 24 hours.' });
  } catch(err) { console.error(err); res.status(500).json({ success: false, error: 'Server error.' }); }
});

app.get('/api/inquiries', (req, res) => {
  if (req.query.key !== 'ert-admin-2026') return res.status(403).json({ error: 'Unauthorized' });
  try { const d = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8')); res.json({ total: d.length, inquiries: d }); } catch(e) { res.json({ total: 0, inquiries: [] }); }
});

app.listen(PORT, '0.0.0.0', function() { console.log('ERT running on port ' + PORT); });