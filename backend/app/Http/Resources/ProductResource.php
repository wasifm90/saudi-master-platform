<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $lang = $request->header('X-Language', $request->query('lang', 'en'));
        $isAr = $lang === 'ar';

        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'slug' => $this->slug,
            'name' => $isAr ? $this->name_ar : $this->name_en,
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'tagline' => $isAr ? $this->tagline_ar : $this->tagline_en,
            'classification' => [
                'code' => $this->classification->code,
                'name' => $isAr ? $this->classification->name_ar : $this->classification->name_en,
                'slug' => $this->classification->slug,
            ],
            'brand' => [
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
                'origin' => $this->brand->country_of_origin,
                'logo' => $this->brand->logo_url,
            ],
            'category' => [
                'name' => $isAr ? $this->category->name_ar : $this->category->name_en,
                'slug' => $this->category->slug,
            ],
            'short_summary' => $isAr ? $this->short_summary_ar : $this->short_summary_en,
            'what_is_it' => $isAr ? $this->what_is_it_ar : $this->what_is_it_en,
            'what_is_used_for' => $isAr ? $this->what_is_used_for_ar : $this->what_is_used_for_en,
            'how_does_it_work' => $isAr ? $this->how_does_it_work_ar : $this->how_does_it_work_en,
            'key_advantages' => $isAr ? json_decode($this->key_advantages_ar ?? '[]') : json_decode($this->key_advantages_en ?? '[]'),
            'main_components' => $isAr ? json_decode($this->main_components_ar ?? '[]') : json_decode($this->main_components_en ?? '[]'),
            'technical_specs' => json_decode($this->technical_specs ?? '{}', true),
            'commercial_terms' => [
                'sales_available' => (bool) $this->sales_available,
                'rental_available' => (bool) $this->rental_available,
                'regional_scope' => json_decode($this->regional_availability ?? '[]'),
            ],
            'media' => [
                'hero_image' => $this->hero_image,
                'main_image' => $this->main_image,
                'drawing_url' => $this->drawing_url,
                'brochure_url' => $this->brochure_url,
                'video_url' => $this->video_url,
            ],
            'applications' => $this->applications->map(function ($app) use ($isAr) {
                return [
                    'id' => $app->id,
                    'name' => $isAr ? $app->name_ar : $app->name_en,
                    'slug' => $app->slug,
                    'icon' => $app->icon_name,
                ];
            }),
            'status' => $this->status,
            'featured' => (bool) $this->featured,
            'display_order' => $this->display_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
