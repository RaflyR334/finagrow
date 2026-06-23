import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { FMSState, Budget, Project } from '../types';

const uid = (p = 'ID') => p + Math.random().toString(36).slice(2, 8).toUpperCase();
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};
const monthKey = (d: string) => d.slice(0, 7);

export const DEFAULT_STATE: FMSState = {
  version: '1.0-react',
  currency: 'IDR',
  lang: 'id',
  theme: 'light',
  role: 'Owner',
  subscription: 'Pro',
  activeEntity: 'E1',
  activePeriod: monthKey(today()),
  currentView: 'Dashboard',
  modules: {
    dashboard: true, transactions: true, invoices: true, cashbank: true,
    budgeting: true, tax: true, assets: true, inventory: true,
    coa: true, entities: true, users: true, settings: true
  },
  entities: [
    { id: 'E1', code: 'BC', name: 'BellCorp Indonesia', currency: 'IDR' },
    { id: 'E2', code: 'OB', name: 'OptiBiz Global', currency: 'USD' }
  ],
  users: [
    { id: 'U1', name: 'Demo Admin', email: 'demo_admin@fms.com', role: 'Admin', subscription: 'Pro Plan', status: 'Active' },
    { id: 'U2', name: 'Demo User', email: 'demo_user@fms.com', role: 'User', subscription: 'Pro Plan', status: 'Active' }
  ],
  coa: [
    { id: 'AC_1001', code: '1001', name: 'Kas Kecil', type: 'Asset', description: 'Kas kecil operasional', openingBalance: 5000000 },
    { id: 'AC_1002', code: '1002', name: 'Bank BCA', type: 'Asset', description: 'Rekening bank utama (BCA)', openingBalance: 150000000 },
    { id: 'AC_1003', code: '1003', name: 'Bank Mandiri', type: 'Asset', description: 'Rekening bank sekunder', openingBalance: 75000000 },
    { id: 'AC_1100', code: '1100', name: 'Piutang Usaha', type: 'Asset', description: 'Piutang dari pelanggan', openingBalance: 125000000 },
    { id: 'AC_1200', code: '1200', name: 'Persediaan Barang', type: 'Asset', description: 'Nilai persediaan barang dagang', openingBalance: 200000000 },
    { id: 'AC_1500', code: '1500', name: 'Aset Tetap', type: 'Asset', description: 'Aset jangka panjang (gedung, kendaraan)', openingBalance: 500000000 },
    { id: 'AC_2000', code: '2000', name: 'Utang Usaha', type: 'Liability', description: 'Utang kepada pemasok', openingBalance: 45000000 },
    { id: 'AC_2100', code: '2100', name: 'Utang Pajak', type: 'Liability', description: 'PPN dan PPh terutang', openingBalance: 12000000 },
    { id: 'AC_3000', code: '3000', name: 'Modal Disetor', type: 'Equity', description: 'Modal disetor pemilik', openingBalance: 900000000 },
    { id: 'AC_4000', code: '4000', name: 'Pendapatan Jasa', type: 'Revenue', description: 'Pendapatan dari layanan' },
    { id: 'AC_4100', code: '4100', name: 'Pendapatan Produk', type: 'Revenue', description: 'Pendapatan dari penjualan produk' },
    { id: 'AC_5000', code: '5000', name: 'Harga Pokok Penjualan', type: 'Expense', description: 'Biaya langsung terkait penjualan' },
    { id: 'AC_5100', code: '5100', name: 'Beban Gaji', type: 'Expense', description: 'Gaji karyawan' },
    { id: 'AC_5200', code: '5200', name: 'Beban Sewa', type: 'Expense', description: 'Sewa kantor' },
    { id: 'AC_5300', code: '5300', name: 'Beban Pemasaran', type: 'Expense', description: 'Iklan dan promosi' },
  ],
  transactions: [
      { id: uid('TX'), date: today(), entity: 'E1', description: 'Pembayaran Invoice INV-2024-001', dr: 'AC_1002', cr: 'AC_1100', amount: 25000000, cur: 'IDR', type: 'income', category: 'Sales', status: 'Completed', customer: 'PT. Maju Mundur' },
      { id: uid('TX'), date: daysAgo(1), entity: 'E1', description: 'Pembelian lisensi software', dr: 'AC_5100', cr: 'AC_1002', amount: 3500000, cur: 'IDR', type: 'expense', category: 'Operational', status: 'Completed', vendor: 'TechSoft Inc' },
      { id: uid('TX'), date: daysAgo(2), entity: 'E1', description: 'Gaji Karyawan Bulan Ini', dr: 'AC_5100', cr: 'AC_1002', amount: 45000000, cur: 'IDR', type: 'expense', category: 'Payroll', status: 'Completed' },
      { id: uid('TX'), date: daysAgo(3), entity: 'E2', description: 'Consulting Fee - Global Corp', dr: 'AC_1002', cr: 'AC_4000', amount: 15000, cur: 'USD', type: 'income', category: 'Sales', status: 'Completed', customer: 'Global Corp' },
      { id: uid('TX'), date: daysAgo(5), entity: 'E1', description: 'Sewa Kantor Q3', dr: 'AC_5200', cr: 'AC_1002', amount: 30000000, cur: 'IDR', type: 'expense', category: 'Operational', status: 'Completed', vendor: 'Gedung Sentral' },
      { id: uid('TX'), date: daysAgo(7), entity: 'E1', description: 'Penjualan Produk A', dr: 'AC_1002', cr: 'AC_4100', amount: 12500000, cur: 'IDR', type: 'income', category: 'Sales', status: 'Completed', customer: 'Toko Makmur' },
      { id: uid('TX'), date: daysAgo(10), entity: 'E1', description: 'Iklan Facebook Ads', dr: 'AC_5300', cr: 'AC_1003', amount: 5000000, cur: 'IDR', type: 'expense', category: 'Marketing', status: 'Completed', vendor: 'Meta Platforms' },
  ],
  invoices: [
    { id: uid('INV'), invoiceNumber: 'INV-2024-001', customer: { name: 'PT. Maju Mundur', email: 'finance@majumundur.co.id' }, issueDate: daysAgo(15), dueDate: daysAgo(1), amount: 25000000, vat: 11, status: 'Paid', type: 'AR', entity: 'E1', cur: 'IDR' },
    { id: uid('INV'), invoiceNumber: 'INV-2024-002', customer: { name: 'CV. Bintang Terang', email: 'info@bintangterang.com' }, issueDate: daysAgo(5), dueDate: daysAgo(-10), amount: 18500000, vat: 11, status: 'Pending', type: 'AR', entity: 'E1', cur: 'IDR' },
    { id: uid('INV'), invoiceNumber: 'INV-2024-003', customer: { name: 'Global Corp', email: 'ap@globalcorp.com' }, issueDate: daysAgo(30), dueDate: daysAgo(0), amount: 15000, vat: 0, status: 'Overdue', type: 'AR', entity: 'E2', cur: 'USD' },
    { id: uid('BILL'), invoiceNumber: 'BILL-2024-001', customer: { name: 'Gedung Sentral', email: 'billing@gedungsentral.com' }, issueDate: daysAgo(10), dueDate: daysAgo(-5), amount: 30000000, vat: 11, status: 'Paid', type: 'AP', entity: 'E1', cur: 'IDR' },
    { id: uid('BILL'), invoiceNumber: 'BILL-2024-002', customer: { name: 'TechSoft Inc', email: 'sales@techsoft.com' }, issueDate: daysAgo(2), dueDate: daysAgo(-12), amount: 3500000, vat: 11, status: 'Pending', type: 'AP', entity: 'E1', cur: 'IDR' },
  ],
  budgets: [
      { id: uid('BD'), entity: 'E1', period: monthKey(today()), accountId: 'AC_5100', amount: 50000000 },
      { id: uid('BD'), entity: 'E1', period: monthKey(today()), accountId: 'AC_5300', amount: 10000000 },
      { id: uid('BD'), entity: 'E1', period: monthKey(today()), accountId: 'AC_4000', amount: 100000000 },
  ],
  assets: [],
  inventory: [
    { id: 'IV1', sku: 'LAP-PRO-01', name: 'MacBook Pro M3 Max 16"', category: 'Electronics', quantity: 15, unit: 'pcs', unitCost: 35000000, valuationMethod: 'FIFO' },
    { id: 'IV2', sku: 'MON-4K-02', name: 'Dell UltraSharp 32" 4K Monitor', category: 'Accessories', quantity: 24, unit: 'pcs', unitCost: 8500000, valuationMethod: 'AVCO' },
    { id: 'IV3', sku: 'KEY-MECH-03', name: 'Keychron Q1 Pro Mechanical Keyboard', category: 'Accessories', quantity: 50, unit: 'pcs', unitCost: 2200000, valuationMethod: 'FIFO' },
    { id: 'IV4', sku: 'IPH-15P-04', name: 'iPhone 15 Pro Max 256GB', category: 'Electronics', quantity: 12, unit: 'pcs', unitCost: 19500000, valuationMethod: 'LIFO' },
    { id: 'IV5', sku: 'DESK-ERG-05', name: 'Ergonomic Standing Desk Dual Motor', category: 'Furniture', quantity: 8, unit: 'pcs', unitCost: 4500000, valuationMethod: 'AVCO' },
  ],
  projects: [
    { id: '1', entity: 'E1', name: 'Website Redesign for Global Corp', customer: 'Global Corp', budget: 750000000, spent: 550000000, progress: 75, status: 'In Progress', profitability: 26.7 },
    { id: '2', entity: 'E1', name: 'Mobile App Development', customer: 'Startup C', budget: 1200000000, spent: 800000000, progress: 66, status: 'In Progress', profitability: 33.3 },
    { id: '3', entity: 'E1', name: 'Q3 Marketing Campaign', customer: 'Internal', budget: 300000000, spent: 310000000, progress: 100, status: 'Completed', profitability: -3.3 },
    { id: '4', entity: 'E2', name: 'ERP System Implementation', customer: 'PT. Maju Jaya', budget: 2500000000, spent: 1800000000, progress: 90, status: 'Completed', profitability: 28.0 },
  ],
  vendors: [
    { id: '1', name: 'AWS Indonesia', contactPerson: 'Budi Santoso', email: 'budi.s@aws.id', phone: '0812-3456-7890', outstandingBalance: 1500000 },
    { id: '2', name: 'ATK Center', contactPerson: 'Siti Aminah', email: 'siti@atkcenter.com', phone: '0813-1122-3344', outstandingBalance: 2500000 },
    { id: '3', name: 'Digital Marketing Agency', contactPerson: 'David Lee', email: 'david@digitalagency.com', phone: '0815-5566-7788', outstandingBalance: 25000000 },
    { id: '4', name: 'Office Building Management', contactPerson: 'Rahmat Hidayat', email: 'management@officetower.com', phone: '021-555-0101', outstandingBalance: 120000000 },
    { id: '5', name: 'Gojek Corporate', contactPerson: 'Corporate Sales', email: 'corporate@gojek.com', phone: '021-255-0202', outstandingBalance: 0 },
  ],
  payrollRuns: [
    { id: '1', payPeriod: 'July 1 - July 31, 2024', runDate: '2024-07-25', totalGross: 250000000, totalTaxes: 5000000, totalNet: 245000000, status: 'Completed' },
    { id: '2', payPeriod: 'June 1 - June 30, 2024', runDate: '2024-06-25', totalGross: 248000000, totalTaxes: 4900000, totalNet: 243100000, status: 'Completed' },
    { id: '3', payPeriod: 'May 1 - May 31, 2024', runDate: '2024-05-25', totalGross: 247500000, totalTaxes: 4850000, totalNet: 242650000, status: 'Completed' },
    { id: '4', payPeriod: 'August 1 - August 31, 2024', runDate: '2024-08-25', totalGross: 251000000, totalTaxes: 5100000, totalNet: 245900000, status: 'Scheduled' },
  ],
  notifications: [
    { id: 'N1', title: 'Sistem FMS Pro Aktif', message: 'Selamat datang di FMS Pro! Semua sistem pembukuan utama online.', date: today(), isRead: false, type: 'info' }
  ],
};

export function getSeededStateForUser(email: string, role: string): FMSState {
  const emailLower = email.toLowerCase();
  const splitName = emailLower.split('@')[0] || 'admin';
  const userName = splitName.charAt(0).toUpperCase() + splitName.slice(1);
  const isEmailAdmin = emailLower === 'mochamadraflyrasyidin@gmail.com' || emailLower === 'demo_admin@fms.com' || emailLower === 'demo@fms.com' || role === 'Admin';
  
  if (isEmailAdmin) {
    // Large enterprise seeds (Heavy financials)
    return {
      version: '1.0-react',
      currency: 'IDR',
      lang: 'id',
      theme: 'light',
      role: 'Admin',
      subscription: 'Pro',
      activeEntity: 'E1',
      activePeriod: monthKey(today()),
      currentView: 'Dashboard',
      modules: {
        dashboard: true, transactions: true, invoices: true, cashbank: true,
        budgeting: true, tax: true, assets: true, inventory: true,
        coa: true, entities: true, users: true, settings: true
      },
      entities: [
        { id: 'E1', code: 'BC', name: 'BellCorp Indonesia', currency: 'IDR' },
        { id: 'E2', code: 'OB', name: 'OptiBiz Global', currency: 'USD' }
      ],
      users: [
        { id: 'U1', name: 'Demo Admin', email: 'demo_admin@fms.com', role: 'Admin', subscription: 'Pro Plan', status: 'Active' },
        { id: 'U2', name: 'Demo User', email: 'demo_user@fms.com', role: 'User', subscription: 'Pro Plan', status: 'Active' }
      ],
      coa: [
        { id: 'AC_1001', code: '1001', name: 'Kas Kecil Cabang Jakarta', type: 'Asset', description: 'Kas kecil operasional HO', openingBalance: 15000000 },
        { id: 'AC_1002', code: '1002', name: 'Bank BCA Priority', type: 'Asset', description: 'Rekening bank utama perusahaan', openingBalance: 1250000000 },
        { id: 'AC_1003', code: '1003', name: 'Bank Mandiri Corporate', type: 'Asset', description: 'Rekening bank giro', openingBalance: 680000000 },
        { id: 'AC_1100', code: '1100', name: 'Piutang Usaha Korporat', type: 'Asset', description: 'Piutang institusi klien', openingBalance: 450000000 },
        { id: 'AC_1200', code: '1200', name: 'Persediaan Finished Goods', type: 'Asset', description: 'Persediaan barang utama', openingBalance: 1200000000 },
        { id: 'AC_1500', code: '1500', name: 'Aset Tetap Gedung Merdeka', type: 'Asset', description: 'Gedung pencakar langit', openingBalance: 5500000000 },
        { id: 'AC_2000', code: '2000', name: 'Utang Dagang Supplier', type: 'Liability', description: 'Utang bahan baku', openingBalance: 240000000 },
        { id: 'AC_2100', code: '2100', name: 'Utang PPN Masukan', type: 'Liability', description: 'PPN 11%', openingBalance: 75000000 },
        { id: 'AC_3000', code: '3000', name: 'Modal Ventura Seri-A', type: 'Equity', description: 'Modal disetor investor', openingBalance: 8000000000 },
        { id: 'AC_4000', code: '4000', name: 'Pendapatan Kontrak Software', type: 'Revenue', description: 'Pendapatan subscription enterprise' },
        { id: 'AC_4100', code: '4100', name: 'Pendapatan Lisensi API', type: 'Revenue', description: 'Pendapatan integrasi API' },
        { id: 'AC_5000', code: '5000', name: 'HPP Layanan Cloud', type: 'Expense', description: 'Biaya server AWS/Google Cloud' },
        { id: 'AC_5100', code: '5100', name: 'Beban Gaji Direksi & Staf', type: 'Expense', description: 'Beban kompensasi tim' },
        { id: 'AC_5200', code: '5200', name: 'Beban Sewa Data Center', type: 'Expense', description: 'Sewa fasilitas rack' },
        { id: 'AC_5300', code: '5300', name: 'Beban Marketing Campaign', type: 'Expense', description: 'Ads & PR outreach' },
      ],
      transactions: [
        { id: 'TX-A001', date: today(), entity: 'E1', description: 'Terima Termin 1 PT. Astra International', dr: 'AC_1002', cr: 'AC_1100', amount: 350000000, cur: 'IDR', type: 'income', category: 'Sales', status: 'Completed', customer: 'PT. Astra International' },
        { id: 'TX-A002', date: daysAgo(1), entity: 'E1', description: 'Bayar Cloud Server AWS', dr: 'AC_5000', cr: 'AC_1002', amount: 95000000, cur: 'IDR', type: 'expense', category: 'Operational', status: 'Completed', vendor: 'AWS Indonesia' },
        { id: 'TX-A003', date: daysAgo(2), entity: 'E1', description: 'Distribusi Payroll Bulanan Direksi', dr: 'AC_5100', cr: 'AC_1003', amount: 185000000, cur: 'IDR', type: 'expense', category: 'Payroll', status: 'Completed' },
        { id: 'TX-A004', date: daysAgo(4), entity: 'E2', description: 'SaaS Agreement - Singapore Corp', dr: 'AC_1002', cr: 'AC_4000', amount: 48000, cur: 'USD', type: 'income', category: 'Sales', status: 'Completed', customer: 'Singapore Corp' },
        { id: 'TX-A005', date: daysAgo(6), entity: 'E1', description: 'Bayar Kampanye Digital agency', dr: 'AC_5300', cr: 'AC_1002', amount: 50000000, cur: 'IDR', type: 'expense', category: 'Marketing', status: 'Completed', vendor: 'Digital Marketing Agency' },
      ],
      invoices: [
        { id: 'INV-A001', invoiceNumber: 'INV-2026-ENT01', customer: { name: 'PT. Astra International', email: 'billing@astra.co.id' }, issueDate: daysAgo(10), dueDate: daysAgo(-20), amount: 350000000, vat: 11, status: 'Paid', type: 'AR', entity: 'E1', cur: 'IDR' },
        { id: 'INV-A002', invoiceNumber: 'INV-2026-ENT02', customer: { name: 'Kementerian Keuangan RI', email: 'finance@kemenkeu.go.id' }, issueDate: daysAgo(5), dueDate: daysAgo(-15), amount: 720000000, vat: 11, status: 'Pending', type: 'AR', entity: 'E1', cur: 'IDR' },
        { id: 'BILL-A001', invoiceNumber: 'BILL-2026-VND01', customer: { name: 'AWS Indonesia', email: 'accounting@aws.id' }, issueDate: daysAgo(2), dueDate: daysAgo(-12), amount: 95000000, vat: 11, status: 'Paid', type: 'AP', entity: 'E1', cur: 'IDR' }
      ],
      budgets: [
        { id: 'BD-A001', entity: 'E1', period: monthKey(today()), accountId: 'AC_5100', amount: 200000000 },
        { id: 'BD-A002', entity: 'E1', period: monthKey(today()), accountId: 'AC_5300', amount: 75000000 }
      ],
      assets: [
        { id: 'AS-A001', code: 'AST-EQ-100', name: 'Server HP ProLiant Gen10', category: 'Equipment', purchaseDate: daysAgo(120), purchaseCost: 180000000, usefulLife: 5, depreciationMethod: 'Straight Line' }
      ],
      inventory: [
        { id: 'IV-A001', sku: 'SVR-DL380', name: 'Central Hardware Server Cluster DL380', category: 'Hardware', quantity: 9, unit: 'units', unitCost: 150000000, valuationMethod: 'FIFO' },
        { id: 'IV-A002', sku: 'RT-CIS-93', name: 'Cisco Enterprise Layer 3 Router 9300', category: 'Network', quantity: 15, unit: 'pcs', unitCost: 35000000, valuationMethod: 'AVCO' }
      ],
      projects: [
        { id: 'PRJ-A001', entity: 'E1', name: 'ERP Core Architecture Upgrade', customer: 'Kementerian Keuangan RI', budget: 1500000000, spent: 400000000, progress: 30, status: 'In Progress', profitability: 73.3 }
      ],
      vendors: [
        { id: 'VND-A001', name: 'AWS Indonesia', contactPerson: 'Budi Santoso', email: 'budi.s@aws.id', phone: '0812-3456-7890', outstandingBalance: 0 },
        { id: 'VND-A002', name: 'Digital Marketing Agency', contactPerson: 'David Lee', email: 'david@digitalagency.com', phone: '0815-5566-7788', outstandingBalance: 50000000 }
      ],
      payrollRuns: [
        { id: 'PAY-A001', payPeriod: 'June 1 - June 30, 2026', runDate: today(), totalGross: 185000000, totalTaxes: 15000000, totalNet: 170000000, status: 'Completed' }
      ],
      notifications: [
        {
          id: 'N_ADM_1_' + splitName,
          title: `Akses Utama Admin ${userName} Aktif`,
          message: `Selamat datang kembali, ${userName}! Konsolidasi multi-divisi korporasi siap dikelola hari ini.`,
          date: today(),
          isRead: false,
          type: 'success'
        },
        {
          id: 'N_ADM_2_' + splitName,
          title: 'Rekonsiliasi Buku Besar Selesai',
          message: `Data transaksi untuk ${emailLower} telah disinkronkan sepenuhnya ke dalam sistem cloud.`,
          date: daysAgo(1),
          isRead: false,
          type: 'info'
        },
        {
          id: 'N_ADM_3_' + splitName,
          title: 'Siklus Depresiasi Aset Terjanggar',
          message: 'Penyusutan berkala aset bulanan berhasil tercatat otomatis di neraca keuanggan.',
          date: daysAgo(2),
          isRead: true,
          type: 'success'
        }
      ]
    };
  } else {
    // Standard User Seed (Mid-market SME / Warung / Toko Retail seeds with lower values)
    return {
      version: '1.0-react',
      currency: 'IDR',
      lang: 'id',
      theme: 'light',
      role: 'User',
      subscription: 'Free',
      activeEntity: 'E1',
      activePeriod: monthKey(today()),
      currentView: 'Dashboard',
      modules: {
        dashboard: true, transactions: true, invoices: true, cashbank: true,
        budgeting: true, tax: true, assets: true, inventory: true,
        coa: true, entities: true, users: true, settings: true
      },
      entities: [
        { id: 'E1', code: 'RT', name: 'Retail Sentosa Abadi', currency: 'IDR' }
      ],
      users: [
        { id: 'U1', name: 'Demo Admin', email: 'demo_admin@fms.com', role: 'Admin', subscription: 'Pro Plan', status: 'Active' },
        { id: 'U2', name: 'Demo User', email: 'demo_user@fms.com', role: 'User', subscription: 'Pro Plan', status: 'Active' }
      ],
      coa: [
        { id: 'AC_1001', code: '1001', name: 'Cash Register Laci Utama', type: 'Asset', description: 'Uang tunai cash register', openingBalance: 2500000 },
        { id: 'AC_1002', code: '1002', name: 'Bank Jatim UKM', type: 'Asset', description: 'Rekening operasional bank lokal', openingBalance: 45000000 },
        { id: 'AC_1100', code: '1100', name: 'Piutang Langganan Warung', type: 'Asset', description: 'Piutang retail kecil', openingBalance: 7500000 },
        { id: 'AC_1200', code: '1200', name: 'Persediaan Sembako & Barang', type: 'Asset', description: 'Stok dagangan toko', openingBalance: 50000000 },
        { id: 'AC_2000', code: '2000', name: 'Utang Agen Supplier Sembako', type: 'Liability', description: 'Utang ke grosiran', openingBalance: 12000000 },
        { id: 'AC_3000', code: '3000', name: 'Modal Muklas Pribadi', type: 'Equity', description: 'Modal awal pendiri toko', openingBalance: 93000000 },
        { id: 'AC_4000', code: '4000', name: 'Pendapatan Retail Harian', type: 'Revenue', description: 'Penjualan retail langsung sembako' },
        { id: 'AC_5100', code: '5100', name: 'Beban Gaji Karyawan Toko', type: 'Expense', description: 'Gaji penjaga kasir' },
        { id: 'AC_5200', code: '5200', name: 'Beban Listrik & Air Ruko', type: 'Expense', description: 'Biaya utilitas toko bulanan' },
      ],
      transactions: [
        { id: 'TX-U001', date: today(), entity: 'E1', description: 'Penjualan Retail Kasir Sesi Pagi', dr: 'AC_1001', cr: 'AC_4000', amount: 3500000, cur: 'IDR', type: 'income', category: 'Sales', status: 'Completed' },
        { id: 'TX-U002', date: daysAgo(1), entity: 'E1', description: 'Belanja Stok Sembako Pasar Anyar', dr: 'AC_1200', cr: 'AC_1001', amount: 1800000, cur: 'IDR', type: 'expense', category: 'Operational', status: 'Completed', vendor: 'CV. Mandiri Sembako' },
        { id: 'TX-U003', date: daysAgo(2), entity: 'E1', description: 'Gaji Bulanan 2 Kasir Toko', dr: 'AC_5100', cr: 'AC_1002', amount: 5000000, cur: 'IDR', type: 'expense', category: 'Payroll', status: 'Completed' },
      ],
      invoices: [
        { id: 'INV-U001', invoiceNumber: 'INV-RT-2026-001', customer: { name: 'Katering Ibu Rahma', email: 'rahma@gmail.com' }, issueDate: daysAgo(4), dueDate: daysAgo(-1), amount: 7500000, vat: 0, status: 'Pending', type: 'AR', entity: 'E1', cur: 'IDR' }
      ],
      budgets: [
        { id: 'BD-U001', entity: 'E1', period: monthKey(today()), accountId: 'AC_5200', amount: 2000000 }
      ],
      assets: [],
      inventory: [
        { id: 'IV-U001', sku: 'SB-01', name: 'Beras Premium Rajalele 10kg', category: 'Food', quantity: 40, unit: 'bags', unitCost: 145000, valuationMethod: 'FIFO' },
        { id: 'IV-U002', sku: 'MG-02', name: 'Minyak Goreng Bimoli 2L', category: 'Food', quantity: 120, unit: 'bottles', unitCost: 34000, valuationMethod: 'AVCO' }
      ],
      projects: [],
      vendors: [
        { id: 'VND-U001', name: 'CV. Mandiri Sembako', contactPerson: 'Haji Mukhtar', email: 'grosir.mukhtar@gmail.com', phone: '0812-7000-8000', outstandingBalance: 12000000 }
      ],
      payrollRuns: [
        { id: 'PAY-U001', payPeriod: 'June 1 - June 30, 2026', runDate: daysAgo(2), totalGross: 5000000, totalTaxes: 0, totalNet: 5000000, status: 'Completed' }
      ],
      notifications: [
        {
          id: 'N_USR_1_' + splitName,
          title: `Selamat Datang di Toko Kasir ${userName}`,
          message: `Halo ${userName}! Manajemen kas & pembukuan retail harian siap dikelola untuk akun ${emailLower}.`,
          date: today(),
          isRead: false,
          type: 'info'
        },
        {
          id: 'N_USR_2_' + splitName,
          title: 'Arsip Data Keuangan Harmonis',
          message: 'Laporan kas register laci utama berjalan selaras dengan saldo buku besar.',
          date: daysAgo(1),
          isRead: false,
          type: 'success'
        },
        {
          id: 'N_USR_3_' + splitName,
          title: 'Batas Jatuh Tempo Faktur',
          message: 'Utang dagang ke grosir mitra operasional mendekati batas pembayaran berkala.',
          date: daysAgo(2),
          isRead: true,
          type: 'warning'
        }
      ]
    };
  }
}

const FMSContext = createContext<{ state: FMSState; dispatch: React.Dispatch<any> }>({
  state: DEFAULT_STATE,
  dispatch: () => null,
});

type Action =
  | { type: 'SET_STATE'; payload: FMSState }
  | { type: 'TOGGLE_MODULE'; payload: { key: string; value: boolean } }
  | { type: 'ADD_COA_ACCOUNT'; payload: any }
  | { type: 'EDIT_COA_ACCOUNT'; payload: any }
  | { type: 'DELETE_COA_ACCOUNT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: any }
  | { type: 'EDIT_TRANSACTION'; payload: any }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_INVOICE'; payload: any }
  | { type: 'EDIT_INVOICE'; payload: any }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'ADD_VENDOR'; payload: any }
  | { type: 'EDIT_VENDOR'; payload: any }
  | { type: 'DELETE_VENDOR'; payload: string }
  | { type: 'ADD_ENTITY'; payload: any }
  | { type: 'EDIT_ENTITY'; payload: any }
  | { type: 'DELETE_ENTITY'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Omit<Budget, 'id'> }
  | { type: 'EDIT_BUDGET'; payload: any }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_ASSET'; payload: any }
  | { type: 'EDIT_ASSET'; payload: any }
  | { type: 'DELETE_ASSET'; payload: string }
  | { type: 'ADD_INVENTORY_ITEM'; payload: any }
  | { type: 'EDIT_INVENTORY_ITEM'; payload: any }
  | { type: 'DELETE_INVENTORY_ITEM'; payload: string }
  | { type: 'ADD_USER'; payload: any }
  | { type: 'EDIT_USER'; payload: any }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Omit<Project, 'id'> }
  | { type: 'LOGIN_USER'; payload: { email: string; stateData: FMSState } }
  | { type: 'LOGOUT_USER' }
  | { type: 'SET_SUBSCRIPTION'; payload: 'Free' | 'Pro' }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'DELETE_NOTIFICATION'; payload: string };


const fmsReducer = (state: FMSState, action: Action): FMSState => {
  switch (action.type) {
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.payload,
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: (state.notifications || []).map(notif => 
          action.payload === 'all' || notif.id === action.payload
            ? { ...notif, isRead: true }
            : notif
        )
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: (state.notifications || []).filter(notif => notif.id !== action.payload)
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...(state.notifications || [])]
      };
    case 'EDIT_COA_ACCOUNT':
      return {
        ...state,
        coa: state.coa.map(acc => acc.id === action.payload.id ? action.payload : acc)
      };
    case 'DELETE_COA_ACCOUNT':
      return {
        ...state,
        coa: state.coa.filter(acc => acc.id !== action.payload)
      };
    case 'ADD_TRANSACTION': {
      const newTx = { ...action.payload, id: uid('TX') };
      const newNotif = {
        id: uid('N'),
        title: state.lang === 'id' ? 'Transaksi Dicatat' : 'Transaction Recorded',
        message: state.lang === 'id' 
          ? `Transaksi baru "${newTx.description || 'Tanpa Nama'}" senilai IDR ${Number(newTx.amount).toLocaleString()} sukses ditambahkan.`
          : `New transaction "${newTx.description || 'Unnamed'}" of IDR ${Number(newTx.amount).toLocaleString()} has been added.`,
        date: today(),
        isRead: false,
        type: 'success' as const
      };
      return {
        ...state,
        transactions: [newTx, ...state.transactions],
        notifications: [newNotif, ...(state.notifications || [])]
      };
    }
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx => tx.id === action.payload.id ? action.payload : tx)
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(tx => tx.id !== action.payload)
      };
    case 'ADD_INVOICE': {
      const newInv = { ...action.payload, id: uid('INV') };
      const newNotif = {
        id: uid('N'),
        title: state.lang === 'id' ? 'Faktur Dibuat' : 'Invoice Generated',
        message: state.lang === 'id'
          ? `Faktur ${newInv.invoiceNumber} senilai IDR ${Number(newInv.amount).toLocaleString()} telah diterbitkan.`
          : `Invoice ${newInv.invoiceNumber} of IDR ${Number(newInv.amount).toLocaleString()} has been successfully created.`,
        date: today(),
        isRead: false,
        type: 'info' as const
      };
      return {
        ...state,
        invoices: [newInv, ...state.invoices],
        notifications: [newNotif, ...(state.notifications || [])]
      };
    }
    case 'EDIT_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(inv => inv.id === action.payload.id ? action.payload : inv)
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload)
      };
    case 'ADD_VENDOR':
      return {
        ...state,
        vendors: [{ ...action.payload, id: uid('VEND') }, ...state.vendors]
      };
    case 'EDIT_VENDOR':
      return {
        ...state,
        vendors: state.vendors.map(v => v.id === action.payload.id ? action.payload : v)
      };
    case 'DELETE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.filter(v => v.id !== action.payload)
      };
    case 'SET_STATE':
      return action.payload;
    case 'TOGGLE_MODULE':
      return {
        ...state,
        modules: {
          ...state.modules,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'ADD_COA_ACCOUNT':
        return {
            ...state,
            coa: [...state.coa, { ...action.payload, id: uid('AC') }]
        };
    case 'ADD_ENTITY':
        return {
            ...state,
            entities: [...state.entities, { ...action.payload, id: uid('E') }]
        };
    case 'EDIT_ENTITY':
        return {
            ...state,
            entities: state.entities.map(e => e.id === action.payload.id ? action.payload : e)
        };
    case 'DELETE_ENTITY':
        return {
            ...state,
            entities: state.entities.filter(e => e.id !== action.payload)
        };
    case 'ADD_BUDGET': {
        const newBudget = { ...action.payload, id: uid('BD') };
        const newNotif = {
          id: uid('N'),
          title: state.lang === 'id' ? 'Anggaran Dipasang' : 'Budget Target Created',
          message: state.lang === 'id'
            ? `Anggaran untuk periode ${newBudget.period} bernilai IDR ${Number(newBudget.amount).toLocaleString()} berhasil didaftarkan.`
            : `Budget of IDR ${Number(newBudget.amount).toLocaleString()} for ${newBudget.period} period successfully assigned.`,
          date: today(),
          isRead: false,
          type: 'success' as const
        };
        return {
            ...state,
            budgets: [...state.budgets, newBudget],
            notifications: [newNotif, ...(state.notifications || [])]
        };
    }
    case 'EDIT_BUDGET':
        return {
            ...state,
            budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b)
        };
    case 'DELETE_BUDGET':
        return {
            ...state,
            budgets: state.budgets.filter(b => b.id !== action.payload)
        };
    case 'ADD_ASSET': {
        const newAsset = { ...action.payload, id: uid('AS') };
        const newNotif = {
          id: uid('N'),
          title: state.lang === 'id' ? 'Aset Ditambahkan' : 'Asset Registered',
          message: state.lang === 'id'
            ? `Aset baru "${newAsset.name || 'Aset'}" (${newAsset.code}) senilai IDR ${Number(newAsset.purchaseCost).toLocaleString()} divalidasi.`
            : `New asset "${newAsset.name || 'Asset'}" (${newAsset.code}) worth IDR ${Number(newAsset.purchaseCost).toLocaleString()} has been processed.`,
          date: today(),
          isRead: false,
          type: 'success' as const
        };
        return {
            ...state,
            assets: [...state.assets, newAsset],
            notifications: [newNotif, ...(state.notifications || [])]
        };
    }
    case 'EDIT_ASSET':
        return {
            ...state,
            assets: state.assets.map(a => a.id === action.payload.id ? action.payload : a)
        };
    case 'DELETE_ASSET':
        return {
            ...state,
            assets: state.assets.filter(a => a.id !== action.payload)
        };
    case 'ADD_INVENTORY_ITEM':
        return {
            ...state,
            inventory: [...state.inventory, { ...action.payload, id: uid('IV') }]
        };
    case 'EDIT_INVENTORY_ITEM':
        return {
            ...state,
            inventory: state.inventory.map(i => i.id === action.payload.id ? action.payload : i)
        };
    case 'DELETE_INVENTORY_ITEM':
        return {
            ...state,
            inventory: state.inventory.filter(i => i.id !== action.payload)
        };
    case 'ADD_USER':
        return {
            ...state,
            users: [...state.users, { ...action.payload, id: uid('U') }]
        };
    case 'EDIT_USER':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.id ? action.payload : u)
        };
    case 'DELETE_USER':
        return {
            ...state,
            users: state.users.filter(u => u.id !== action.payload)
        };
    case 'ADD_PROJECT':
        return {
            ...state,
            projects: [...state.projects, { ...action.payload, id: uid('PROJ') }]
        }
    case 'LOGIN_USER': {
        const baseLoginState = {
            ...action.payload.stateData,
            currentUserEmail: action.payload.email
        };
        try {
          const globalModulesStr = localStorage.getItem('fms_global_modules');
          if (globalModulesStr) {
            baseLoginState.modules = { ...baseLoginState.modules, ...JSON.parse(globalModulesStr) };
          }
        } catch (_) {}
        return baseLoginState;
    }
    case 'LOGOUT_USER':
        return {
            ...DEFAULT_STATE,
            currentUserEmail: undefined
        };
    default:
      return state;
  }
};

export const FMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(fmsReducer, DEFAULT_STATE, (initial) => {
    try {
      const activeEmail = localStorage.getItem('fms_active_user_email');
      let baseState = initial;
      if (activeEmail) {
        const userData = localStorage.getItem(`fms_state_user_${activeEmail}`);
        if (userData) {
          baseState = { ...JSON.parse(userData), currentUserEmail: activeEmail };
        }
      } else {
        const localData = localStorage.getItem('fms_state_react_v1');
        if (localData) {
          baseState = JSON.parse(localData);
        }
      }

      // Sync active modules with the ADMIN's global modules configuration
      try {
        const globalModulesStr = localStorage.getItem('fms_global_modules');
        if (globalModulesStr) {
          const globalModules = JSON.parse(globalModulesStr);
          baseState.modules = { ...baseState.modules, ...globalModules };
        }
      } catch (_) {}

      return baseState;
    } catch (error) {
      console.error("Could not parse localStorage data", error);
      return initial;
    }
  });

  useEffect(() => {
    try {
      // If active user is Admin, sync current modules settings globally
      if (state.role === 'Admin' && state.modules) {
        localStorage.setItem('fms_global_modules', JSON.stringify(state.modules));
      }
      
      // Override modules to match global setup if they exist
      try {
        const globalModulesStr = localStorage.getItem('fms_global_modules');
        if (globalModulesStr) {
          const globalModules = JSON.parse(globalModulesStr);
          state.modules = { ...state.modules, ...globalModules };
        }
      } catch (_) {}

      if (state.currentUserEmail) {
        localStorage.setItem(`fms_state_user_${state.currentUserEmail}`, JSON.stringify(state));
        localStorage.setItem('fms_active_user_email', state.currentUserEmail);
      } else {
        localStorage.removeItem('fms_active_user_email');
        localStorage.setItem('fms_state_react_v1', JSON.stringify(state));
      }
    } catch (error) {
        console.error("Could not save state to localStorage", error);
    }
  }, [state]);

  return (
    <FMSContext.Provider value={{ state, dispatch }}>
      {children}
    </FMSContext.Provider>
  );
};

export const useFMS = () => useContext(FMSContext);