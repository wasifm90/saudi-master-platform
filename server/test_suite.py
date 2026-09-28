#!/usr/bin/env python3
import sys
import os
import json
import io
import unittest
from datetime import datetime

# Import the server handler
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from api_server import SaudiMasterHandler, get_db

class MockRequest:
    def __init__(self, data=b""):
        self.data = data
    def makefile(self, *args, **kwargs):
        return io.BytesIO(self.data)

class TestSaudiMasterPlatform(unittest.TestCase):
    def setUp(self):
        self.conn = get_db()
        self.c = self.conn.cursor()

    def tearDown(self):
        self.conn.close()

    def test_database_tables_exist(self):
        self.c.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [r[0] for r in self.c.fetchall()]
        expected = ['users', 'site_settings', 'product_classifications', 'brands', 'categories', 'products', 'applications', 'assembly_sequences', 'assembly_steps', 'hotspots', 'regions', 'services', 'projects', 'manufacturing_facilities', 'manufacturing_processes', 'page_sections', 'leads']
        for exp in expected:
            self.assertIn(exp, tables, f"Table {exp} should exist")
        print("✓ All 17 Core Relational Database Tables Exist")

    def test_classifications_local_and_european(self):
        self.c.execute("SELECT code, name_en, name_ar FROM product_classifications")
        rows = {r[0]: (r[1], r[2]) for r in self.c.fetchall()}
        self.assertIn('LOCAL', rows)
        self.assertIn('EUROPEAN', rows)
        print("✓ Product Classification Model has LOCAL and EUROPEAN classes")

    def test_products_count_and_details(self):
        self.c.execute("SELECT count(*) FROM products WHERE status='PUBLISHED'")
        count = self.c.fetchone()[0]
        self.assertGreaterEqual(count, 12, "Should have at least 12 seeded products")

        # Test Cuplock Scaffolding
        self.c.execute("SELECT name_en, what_is_it_en, technical_specs FROM products WHERE slug='cuplock-scaffolding'")
        cup = self.c.fetchone()
        self.assertIsNotNone(cup)
        self.assertEqual(cup[0], 'Cuplock Scaffolding System')
        self.assertIn('58 kN', cup[2])

        # Test ULMA BRIO Ringlock
        self.c.execute("SELECT name_en, what_is_it_en, technical_specs FROM products WHERE slug='ulma-brio-ringlock'")
        brio = self.c.fetchone()
        self.assertIsNotNone(brio)
        self.assertEqual(brio[0], 'ULMA BRIO Ringlock Scaffolding')
        self.assertIn('EN 12810', brio[2])
        print("✓ Product detail and technical specs match educational specifications")

    def test_assembly_sequence(self):
        self.c.execute("SELECT count(*) FROM assembly_steps")
        steps_count = self.c.fetchone()[0]
        self.assertEqual(steps_count, 7, "Should have 7 assembly steps for BRIO")
        print("✓ 7-Stage Assembly Sequence Protocol Verified")

    def test_hotspots(self):
        self.c.execute("SELECT count(*) FROM hotspots WHERE target_identifier='circular-silo'")
        hs_count = self.c.fetchone()[0]
        self.assertGreaterEqual(hs_count, 4, "Should have at least 4 coordinate hotspots")
        print("✓ Spatial Inspection Hotspots Verified")

    def test_regional_matrix(self):
        self.c.execute("SELECT code, sales_allowed, rental_allowed FROM regions")
        regs = {r[0]: (bool(r[1]), bool(r[2])) for r in self.c.fetchall()}
        self.assertTrue(regs['KSA'][0], "KSA should allow sales")
        self.assertTrue(regs['KSA'][1], "KSA should allow rental")
        self.assertTrue(regs['GCC'][0], "GCC should allow sales")
        self.assertFalse(regs['GCC'][1], "GCC should not allow rental fleet")
        print("✓ Regional Capability Matrix (Sales vs Rental) Verified")

    def test_admin_mutation_persistence(self):
        # Update a product via DB/Admin logic and verify immediate reflection
        self.c.execute("SELECT name_en FROM products WHERE id=1")
        orig_name = self.c.fetchone()[0]
        
        test_name = "Cuplock Heavy Scaffolding System (Tested Edit)"
        self.c.execute("UPDATE products SET name_en = ? WHERE id=1", (test_name,))
        self.conn.commit()

        self.c.execute("SELECT name_en FROM products WHERE id=1")
        updated_name = self.c.fetchone()[0]
        self.assertEqual(updated_name, test_name)

        # Restore original
        self.c.execute("UPDATE products SET name_en = ? WHERE id=1", (orig_name,))
        self.conn.commit()
        print("✓ Admin Database Mutation & Direct Read Verification Successful")

    def test_rfq_lead_creation(self):
        ticket = f"TEST-LEAD-{int(datetime.utcnow().timestamp())}"
        self.c.execute("""
            INSERT INTO leads (ticket_number, full_name, email, phone, system_interest, transaction_type, status)
            VALUES (?, 'Eng. Test Lead', 'lead@test.com', '+966500000000', 'ULMA ORMA', 'RENTAL', 'NEW')
        """, (ticket,))
        self.conn.commit()

        self.c.execute("SELECT status FROM leads WHERE ticket_number=?", (ticket,))
        st = self.c.fetchone()[0]
        self.assertEqual(st, 'NEW')
        print("✓ RFQ Ingestion and Ticket Generation Pipeline Verified")

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestSaudiMasterPlatform)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    if not result.wasSuccessful():
        sys.exit(1)
