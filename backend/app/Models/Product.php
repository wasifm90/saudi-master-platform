<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Product extends Model
{
    protected $guarded = ['id'];

    protected static function booted()
    {
        static::saved(function () {
            Cache::tags(['products', 'public_api'])->flush();
        });
        static::deleted(function () {
            Cache::tags(['products', 'public_api'])->flush();
        });
    }

    public function classification(): BelongsTo
    {
        return $this->belongsTo(ProductClassification::class, 'classification_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function applications(): BelongsToMany
    {
        return $this->belongsToMany(Application::class, 'product_applications');
    }

    public function assemblySequences(): HasMany
    {
        return $this->hasMany(AssemblySequence::class);
    }
}
