<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\SiteController;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\RegionController;
use App\Http\Controllers\Public\ManufacturingController;
use App\Http\Controllers\Public\LeadController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminLeadController;
use App\Http\Controllers\Admin\AdminPageController;
use App\Http\Controllers\Admin\AdminSettingsController;

/*
|--------------------------------------------------------------------------
| Saudi Master Company (ULMA Alliance) - API Routes
|--------------------------------------------------------------------------
| All public endpoints return strict JSON envelopes { data, meta, links }
| Admin endpoints require Sanctum authentication / Admin policy checks
*/

// =========================================================================
// 1. PUBLIC REST API (Cached with immediate invalidation upon admin update)
// =========================================================================
Route::prefix('public')->group(function () {
    // Site Identity, Design Tokens, Navigation, Global Contacts
    Route::get('/site', [SiteController::class, 'getSettings']);
    Route::get('/navigation', [SiteController::class, 'getNavigation']);
    Route::get('/home', [SiteController::class, 'getHomePage']);

    // Classifications, Brands & Categories
    Route::get('/classifications', [ProductController::class, 'getClassifications']);
    Route::get('/brands', [ProductController::class, 'getBrands']);
    Route::get('/categories', [CategoryController::class, 'index']);

    // Products (Filterable by classification, category, query)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/products/{slug}/assembly', [ProductController::class, 'getAssemblySequence']);
    Route::get('/hotspots/{targetIdentifier}', [ProductController::class, 'getHotspots']);

    // Services & Regional Capability Matrix (Sales/Rental rules)
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/regions', [RegionController::class, 'index']);
    Route::get('/regions/matrix', [RegionController::class, 'getCapabilityMatrix']);

    // Projects & Case Studies
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);

    // In-Kingdom Manufacturing & Fleet Logistics
    Route::get('/manufacturing', [ManufacturingController::class, 'getFacilityData']);

    // Lead & RFQ Submission
    Route::post('/leads/rfq', [LeadController::class, 'storeRfq']);
    Route::post('/leads/consultation', [LeadController::class, 'storeConsultation']);
});

// =========================================================================
// 2. ADMIN REST API (Authenticated CMS Portal Endpoints)
// =========================================================================
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    // Products & Visual Experiences CRUD
    Route::get('/products', [AdminProductController::class, 'index']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::get('/products/{id}', [AdminProductController::class, 'show']);
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);
    Route::post('/products/{id}/publish', [AdminProductController::class, 'publish']);

    // CMS Page Builder & Sections
    Route::get('/pages', [AdminPageController::class, 'index']);
    Route::get('/pages/{id}/sections', [AdminPageController::class, 'getSections']);
    Route::put('/pages/{id}/sections', [AdminPageController::class, 'updateSections']);

    // Leads & Drawing Submissions
    Route::get('/leads', [AdminLeadController::class, 'index']);
    Route::get('/leads/{id}', [AdminLeadController::class, 'show']);
    Route::patch('/leads/{id}/status', [AdminLeadController::class, 'updateStatus']);

    // Site Settings & Brand Configuration
    Route::get('/settings', [AdminSettingsController::class, 'index']);
    Route::put('/settings', [AdminSettingsController::class, 'update']);
});
